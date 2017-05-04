const mongoose = require('mongoose');
const userResponse = require('../modules/userResponse');
const uuid = require('uuid/v4');
const mailchimp = require('../modules/mailchimp');
const bcrypt = require('bcryptjs');
const request = require('request');

const SALT_WORK_FACTOR = 10;

module.exports = (app, route) => {

  User = mongoose.model('user', app.models.user);

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
  app.get("/social/connect/google", (req, res) => {
    // if (!req.body.email && !req.body.accessToken) return res.status(400).send("The request body is missing email or access token.");
    //
    // console.log("yo");
    // var options = {
    //   url: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    //   method: "GET",
    //   headers: {
    //     "Accept": "application/json",
    //     "Authorization": "Bearer " + req.body.accessToken
    //   }
    // };
    //
    // request(options, (error, resp, body) => {
    //   if (error) return res.status(400).send(error);
    //   console.log("done");
    //   console.log(body);
    //   return res.status(resp.statusCode).send(body);
    // });

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
    res.redirect(url);
  });
  // ---------------------------------------------------

  /** Google oauth redirect **/
  app.get("/social/oauth/google", (req, res) => {
    if (!req.query.code) return res.status(400).send("Authorization code is missing");
    if (!req.query.state) return res.status(400).send("Additional query p[arameters are missing");

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

      // Now tokens contains an access_token and an optional refresh_token. Save them.
      User.findByIdAndUpdate(userId, {
        $set: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token
        }
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
          console.log(body);
          return res.status(resp.statusCode).send(body);
        });
      });
    });
  });
  // ---------------------------------------------------

  /** Route to select a google calendar **/
  app.get('/social/google/calendar', (req, res) => {
    User.findOne({_id: req.query.userId}, (err, user) => {
      if (err) return res.status(400).send(err);

      if (!user.googleAccessToken) return res.status(401).send("The user is missing the google authentication token");

      var options = {
        url: "https://www.googleapis.com/calendar/v3/calendars/" + req.query.calendarId + "/events/watch",
        method: "POST",
        form: {
          id: uuid(),
          type: "web_hook",
          address: "https://api1.depomo.com/task/webhook/google"
        },
        headers: {
          "Authorization": "Bearer " + user.googleAccessToken,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };

      request(options, (error, resp, body) => {
        if (error) return res.status(400).send(error);

        return res.status(resp.statusCode).send(body);
      });
    });
  });
  // ---------------------------------------------------

  return (req, res, next) => {
    next();
  }
}
