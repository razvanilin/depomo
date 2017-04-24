const jwt = require('jsonwebtoken');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = function(user, paymentMethods) {

  let token = jwt.sign(user, settings.secret, {
    expiresIn: 604800 // a week
  });

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    timezone: user.timezone,
    paymentMethods: paymentMethods || [],
    token: token
  }
}
