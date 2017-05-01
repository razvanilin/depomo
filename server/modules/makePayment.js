const request = require('request');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

const mongoose = require('mongoose');

module.exports = (app, task, cb) => {
  if (!task) return cb(false, {error: "No task found"});

  var User = mongoose.model('user', app.models.user);
  // get the owner information and then the default payment associated with the user
  var defaultToken;
  User.findOne({_id: task.owner}, (err, user) => {
    if (err || !user) return cb(false, {error: "Could not retrieve user"});

    if (!user.customerId) return cb(false, {error: "User does not have a Braintree customer ID"});

    app.braintree.customer.find(user.customerId, (err, customer) => {
      if (!err || !customer) return cb(false, {error: "Could not retrieve the customer details"});
      if (!customer.paymentMethods) return cb(false, {error: "Could not retrieve customer payment methods"});

      for (var i=0; i<customer.paymentMethods.length; i++) {
        if (customer.paymentMethods[i].default) {
          defaultToken = customer.paymentMethods[i].token;
        }
      }

      // create the paypal payment
      var paypalOpt = {
        url: settings.api_host + "/payment/" + task.owner + "/pay/" + task.method,
        method: "POST",
        form: {
          amount: task.deposit,
          currency: task.currency,
          label: task.label,
          token: defaultToken,
          user_id: task.owner.toString(),
          task_id: task._id.toString()
        },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };

      request(paypalOpt, (error, resp, body) => {
        if (error) return cb(false, {taskId: task._id.toString(), error: error});
        var payment;
        try {
          payment = JSON.parse(body);
          return cb(true, {taskId: task._id.toString(), payment: payment});
        } catch (e) {
          return cb(true, {taskId: task._id, payment: payment});
        }
      });
    });
  });
};
