const mongoose = require('mongoose');
const userResponse = require('../modules/userResponse');
const uuid = require('uuid/v4');
const mailchimp = require('../modules/mailchimp');
const bcrypt = require('bcryptjs');

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
  app.post("/social/connect/google", (req, res) => {
    
  });
  // ---------------------------------------------------


  return (req, res, next) => {
    next();
  }
}
