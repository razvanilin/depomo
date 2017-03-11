const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// get the environment specific settings
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

// Load the models
const models = require('../models/index');

// prepare the models
var User = mongoose.model('user', models.user);

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, settings.secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access.");
      User.findOne({
        _id: decoded._doc._id
      }, (err, user) => {

        if (err) return res.status(400).send("Could not process your user information. Try again later.")

        if (user._id == req.params.id || user.isAdmin) {
          req.decoded = decoded;
          next();
        } else {
          return res.status(401).send("Not authorized to access resource.");
        }
      });
    });
  } else {
    return res.status(401).send("Token is missing.");
  }
}
