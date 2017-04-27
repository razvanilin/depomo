const jwt = require('jsonwebtoken');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = function(app, user, cb) {

  app.braintree.customer.find(user.customerId, (err, customer) => {

    if (err) return cb(err);

    let token = jwt.sign(user, settings.secret, {
      expiresIn: 604800 // a week
    });

    return cb(null, {
      _id: user._id,
      email: user.email,
      name: user.name,
      timezone: user.timezone,
      paymentMethods: customer.paymentMethods || [],
      token: token
    });
  });
}
