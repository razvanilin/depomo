const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyOwner = require('../modules/verifyOwner');
const mailchimp = require('../modules/mailchimp');
const uuid = require('uuid/v4');

const SALT_WORK_FACTOR = 10;

module.exports = (app, route) => {

  // prepare the model
  var User = mongoose.model('user', app.models.user);

  /** Route to get all the users **/
  app.get('/user', (req, res) => {
    return res.status(200).send("GET /user works");
  });

  /** Route to get a user **/
  app.get('/user/:userId', verifyOwner, (req, res) => {
    return res.status(200).send("GET /user/:userId works");
  });

  /** Route to create a user **/
  app.post('/user', (req, res) => {
    if (!req.body.email) return res.status(400).send("Request is missing the email field.");
    if (!req.body.password) return res.status(400).send("Request is missing the password field.");
    if (req.body.password.length < 6) {
      return res.status(400).send("The password must be at least 6 characters long.");
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err + "");
        }
        req.body.password = hash;
        User.create(req.body, (error, user) => {
            if (error) return res.status(400).send(error);

            // add user to the mailchimp list
            mailchimp.addUser(user);

            // send welcome message
            mailchimp.sendEmail(app, app.settings.mandrill.welcome_template, user, [{name: "fname", content: user.name}]);

            return res.status(200).send("User Created");
        });
      });
    });
    // return res.status(200).send("works");
  });
  // ----------------------------------------------------------

  /** Route to login a user **/
  app.post('/user/login', (req, res) => {
    if (!req.body.email) return res.status(400).send("Request is missing the email field.");
    if (!req.body.password) return res.status(400).send("Request is missing the password field.");

    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err || user === null) {
        return res.status(401).send("Wrong email or password.");
      }

      // check the password
      user.comparePassword(req.body.password, user.password, (isMatch) => {
        if (!isMatch) {
          console.log("Failed to log in with " + req.body.email);
          return res.status(401).send("Wrong email or password.");
        }

        let token = jwt.sign(user, app.settings.secret, {
          expiresIn: 604800 // a week
        });

        var userResponse = {
          _id: user._id,
          email: user.email,
          name: user.name,
          token: token
        }

        return res.status(200).send(userResponse);
      });
    });
  });
  // ----------------------------------------------------------

  /** Route used to relog the users that have a valid token **/
  app.post("/user/relog", (req, res, next) => {
    if (!req.body.token) return res.status(400).send("Token is missing");

    jwt.verify(req.body.token, app.settings.secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access.");
      User.findOne({
        _id: decoded._doc._id
      }, (err, user) => {
        if (!user || err) return res.status(400).send("Could not process your user information. Try again later.")

        var userResponse = {
          _id: user._id,
          email: user.email,
          name: user.name,
          token: req.body.token
        }
        // return the decoded information
        return res.status(200).send(userResponse);
      });
    });
  });
  // ----------------------------------------------------------

  /** Route to reset user's password **/
  app.post("/user/forgot", (req, res, next) => {
    if (!req.body.email) return res.status(400).send("Email is missing");

    // edit the user document with a randomly generated token
    User.update({email: req.body.email}, { $set: { resetToken: uuid()}}, { new: true }, (err, user) => {
      if (err || !user || user.length < 1) {
        console.log(err);
        return res.status(400).send(err ? err : 'No user with that email');
      }
      console.log(user);

      User.findOne({email: req.body.email}, (err, user) => {
        if (err || !user || user.length < 1) {
          console.log(err);
          return res.status(400).send(err ? err : 'No user with that email');
        }

        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }
          // hash the email and user ID for extra security
          bcrypt.hash(user._id + "-" + user.email, salt, (err, hash) => {

            // send forgot password email
            // send user a welcome message
            var templateName = "depomo-forgot-password";
            var templateContent = [{
              name: "Forgot Passowrd",
              content: "Get ready to break procrastination"
            }];
            var message = {
              from_email: "razvan@depomo.com",
              from_name: "Razvan",
              to: [{
                email: user.email,
                name: user.name,
                type: "to"
              }],
              headers: {
                "Reply-To": "razvan@depomo.com"
              },
              track_opens: true,
              track_clicks: true,
              merge_vars: [{
                rcpt: user.email,
                vars: [{
                  name: 'fname',
                  content: user.name
                }, {
                  name: "resetlink",
                  content: app.settings.host + "/reset?token=" + user.resetToken + "&hash=" + hash
                }]
              }],
              tags: ["forgot"]
            }

            app.mandrill.messages.sendTemplate({
              template_name: templateName,
              template_content: templateContent,
              message: message,
              async: true,
              ip_pool: "Main Pool"
            }, result => {
              console.log("email sent");
              console.log(result);
            }, err => {
              console.log("email error");
              console.log(err);
            });

            return res.status(200).send("Email sent.");
          });
        });
      });
    });
  });
  // ----------------------------------------------------------

  /** Route to change the password **/
  app.put("/user/password", (req, res) => {
    if (!req.body.token || !req.body.hash) return res.status(400).send("Body is missing token or hash.");
    if (!req.body.password) return res.status(400).send("The password field is missing from the body.");

    User.findOne({resetToken: req.body.token}, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user || user.length < 1) return res.status(404).send("Reset token is not valid");

      // compare the hash with the user information
      bcrypt.compare(user._id + "-" + user.email, req.body.hash, (err, isMatch) => {
        if (err) {
          return res.status(401).send(err);
        }
        if (!isMatch) return res.status(401).send("The hash is not valid.");

        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(400).send(err);
            }

            User.findByIdAndUpdate(user._id, { $set: {password: hash, resetToken: ""}}, {new: true}, (err, user) => {
              if (err) {
                console.log(err);
                return res.status(400).send(err);
              }

              return res.status(200).send("Password reset");
            });
          });
        });
      });
    });
  });
  // ----------------------------------------------------------

  return (req, res, next) => {
    next();
  }
}
