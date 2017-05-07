const mongoose = require('mongoose');
const userResponse = require('../modules/userResponse');
const uuid = require('uuid/v4');
const mailchimp = require('../modules/mailchimp');
const bcrypt = require('bcryptjs');
const request = require('request');
const checkAccess = require('../modules/checkAccess');

const SALT_WORK_FACTOR = 10;

module.exports = (app, route) => {

  User = mongoose.model('user', app.models.user);
  NotificationChannel = mongoose.model('notificationChannel', app.models.notificationChannel);

  app.post('/social/login', (req, res) => {

    if (!req.body.email || !req.body.accessToken) {
      return res.status(400).send("Invalid Request");
    }

    // check if user already exists and if not create a new one
    var email = req.body.email;
    User.findOne({email: email}, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      if (user) {
        userResponse(app, user, (err, response) => {
          return res.status(200).send(response);
        });

      // create a new user
      } else {

        var newUser = {
          name: req.body.name,
          email: email,
          timezone: req.body.timezone
        };

        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          bcrypt.hash(uuid(), salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(400).send(err + "");
            }
            newUser.password = hash;
            User.create(newUser, (error, user) => {
              if (error) return res.status(400).send(error);

              // create a customer on braintree
              app.braintree.customer.create({
                firstName: user.name,
                email: user.email
              }, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.status(400).send("Could not create a customer ID");
                }

                if (result && result.customer && result.customer.id) {
                  User.findByIdAndUpdate(user._id, { $set: { customerId: result.customer.id}}, {new:true}, (err, user) => {
                    if (err) console.log(err);

                    // add user to the mailchimp list
                    mailchimp.addUser(user);

                    // send welcome message
                    mailchimp.sendEmail(app, app.settings.mandrill.welcome_template, user, [{name: "fname", content: user.name}]);

                    userResponse(app, user, (err, response) => {
                      if (err) {
                        console.log(err);
                        return res.status(400).send(err);
                      }
                      return res.status(200).send(response);
                    });
                  });
                } else {
                  return res.status(400).send("Could not create a customer ID");
                }
              });
            });
          });
        });
      }
    });
  });
  // ---------------------------------------------------

  /** Route to connect Google calendar and create a push notification channel **/
  app.get("/social/connect/google", checkAccess, (req, res) => {
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    console.log(req.query.userId);
    var scopes = [
      'https://www.googleapis.com/auth/calendar'
    ];

    var url = app.google.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: scopes,

      // Optional property that passes state parameters to redirect URI
      state: encodeURIComponent(JSON.stringify({ 'userId': req.query.userId }))
    });

    return res.status(200).send({url: url});
  });
  // ---------------------------------------------------

  /** Google oauth redirect **/
  app.get("/social/oauth/google", checkAccess, (req, res) => {
    if (!req.query.code) return res.status(400).send("Authorization code is missing");
    if (!req.query.state) return res.status(400).send("Additional query parameters are missing");

    var userId;
    try {
      userId = JSON.parse(decodeURIComponent(req.query.state)).userId;
      if (!userId) return res.status(400).send("No userId found in the state");
    } catch (e) {
      console.log(e);
      return res.status(400).send("Cannot decode the state query string");
    }

    app.google.getToken(req.query.code, function (err, tokens) {
      if (err || !tokens) return res.status(400).send(err);
      console.log(tokens);

      var googleTokens = {
        googleAccessToken: tokens.access_token
      };
      if (tokens.refresh_token) googleTokens.googleRefreshToken = tokens.refresh_token;

      // Now tokens contains an access_token and an optional refresh_token. Save them.
      User.findByIdAndUpdate(userId, {
        $set: googleTokens
      }, {new: true}, (err, user) => {
        if (err) return res.status(400).send(err);

        var options = {
          url: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + user.googleAccessToken
          }
        };

        request(options, (error, resp, body) => {
          if (error) return res.status(400).send(error);
          console.log("done");
          return res.status(resp.statusCode).send(body);
        });
      });
    });
  });
  // ---------------------------------------------------

  /** Route to select a google calendar **/
  app.get('/social/google/calendar', checkAccess, (req, res) => {
    User.findOne({_id: req.query.userId}, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user.googleAccessToken) return res.status(401).send("The user is missing the google authentication token");

      var channelId = uuid();

      var options = {
        url: "https://www.googleapis.com/calendar/v3/calendars/" + req.query.calendarId + "/events/watch",
        method: "POST",
        body: JSON.stringify({
          id: channelId,
          type: "web_hook",
          address: app.settings.google.webhookUrl + '/' + req.query.userId,
          params: {
            userId: user._id
          }
        }),
        headers: {
          "Authorization": "Bearer " + user.googleAccessToken,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };

      request(options, (error, resp, body) => {
        if (error) return res.status(400).send(error);

        //record the notification channel
        NotificationChannel.create({
          owner: user._id,
          channelId: channelId
        }, (err, channel) => {
          if (err) console.log(err);
        });

        User.findByIdAndUpdate(user._id, {
          $set: {
            googleNotificationChannel: channelId
          }
        }, {new: true}, (err, user) => {
          return res.status(resp.statusCode).send(body);
        })
      });
    });
  });
  // ---------------------------------------------------

  /** Route to remove the Notification Channels **/
  app.put('/social/google/remove', checkAccess, (req, res) => {
    var userId = req.query.userId || req.body.userId;

    User.findOne({_id: userId}, (err, user) => {
      if (err) return res.status(400).send(err);

      if (!user) return res.status(404).send("Could not retrieve user information.");

      // app.google.setCredentials({
      //   access_token: user.access_token,
      //   refresh_token: user.refresh_token,
      //   expiry_date: moment().add(30, 'days').format('x')
      // });
      //
      // app.google.refreshAccessToken((err, tokens) => {
      //   if (err) return res.status(400).send("Cannot authenticate the request");
      //   // attempt to delete the channel if no user is using it
      //   app.calendar.channels.stop({
      //       id: req.get('x-goog-channel-id'),
      //       resourceId: req.get('x-goog-resource-id'),
      //       auth: app.google
      //   }, (err, result) => {
      //     if (err) {
      //       console.log(err);
      //       return res.status(400).send("Channel not found in the system. Could not stop it.")
      //     }
      //     console.log(result);
      //     return res.status(404).send("Channel not found in the system. Channel stopped.");
      //   });
      // });

      User.findByIdAndUpdate(userId, {
        $set: {
          googleNotificationChannel: ""
        }
      }, {new: true}, (err, user) => {
        if (err) return res.status(400).send("Could not update the user information");

        userResponse(app, user, (err, response) => {
          return res.status(200).send(response);
        });
      });
    })
  });
  // ---------------------------------------------------


  return (req, res, next) => {
    next();
  }
}
