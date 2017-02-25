const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

module.exports = (app, route) => {

  // prepare the model
  var User = mongoose.model('user', app.models.user);

  /** Route to get all the users **/
  app.get('/user', (req, res) => {
    return res.status(200).send("GET /user works");
  });

  /** Route to get a user **/
  app.get('/user/:id', (req, res) => {
    return res.status(200).send("GET /user/:id works");
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
        User.collection.insert(req.body, (error, user) => {
            if (error) return res.status(400).send(error);
            return res.status(200).send("User created");
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

        return res.status(200).send(user);
      });
    });
  });

  return (req, res, next) => {
    next();
  }
}
