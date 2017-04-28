const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const userResponse = require('../modules/userResponse');
const uuid = require('uuid/v4');
const mailchimp = require('../modules/mailchimp');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

module.exports = (app, route) => {

  User = mongoose.model('user', app.models.user);

  passport.use(new FacebookStrategy({
    clientID: app.settings.facebook.client_id,
    clientSecret: app.settings.facebook.client_secret,
    callbackURL: app.settings.host + "/login/facebook",
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);

    // check if user already exists and if not create a new one
    var email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
    User.findOne({email: email}, (err, user) => {
      if (err) return cb(err);

      if (user) {
        userResponse(app, user, (err, response) => {
          return cb(null, response);
        });
      } else {
        console.log("lol");
        return cb("error");
      }
    });

    return cb(null, profile);
  }));

  passport.serializeUser(function(user, cb) {
    console.log("serializeUser");
    console.log(user);
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    console.log("deserializeUser");
    cb(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  /** Route to login using Facebook **/
  app.get("/oauth/facebook", (req, res) => {
    console.log("asdddda");
    passport.authenticate('facebook', {scope: 'email'}, (err, user, info) => {
      console.log(err);
      console.log("---------------User");
      console.log(user);
      console.log("------------------info");
      console.log(info);
    });
  });

  app.post('/social/facebook/login', (req, res) => {

    if (!req.body.email || !req.body.accessToken || !req.body.signedRequest || !req.body.id || !req.body.userID) {
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

  return (req, res, next) => {
    next();
  }
}
