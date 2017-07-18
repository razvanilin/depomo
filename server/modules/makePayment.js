const request = require('request');
// get the environment specific settings
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else if (process.env.NODE_ENV == "staging") {
  settings = require('../settings-staging');
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
    if (err || !user) return cb(false, {error: "Could not retrieve user", taskId: task._id});
    if (!user.customerId) return cb(false, {error: "User does not have a Stripe customer ID", taskId: task._id});

    app.stripe.customers.retrieve(user.customerId, (err, customer) => {
      if (err || !customer){
        return cb(false, {error: "Could not retrieve the customer details", taskId: task._id});
      }

      app.stripe.customers.listSources(user.customerId, (err, sources) => {
        if (err || !sources || !sources.data || sources.data.length < 1)
          return cb(false, {error: "Could not retrieve customer payment methods", taskId: task._id});

        for (var i=0; i<sources.data.length; i++) {
          if (sources.data[i].id === customer.default_source) {
            defaultToken = sources.data[i].id;
          }
        }

        // create the payment
        var paymentOpt = {
          url: settings.api_host + "/payment/" + task.owner + "/pay/" + task.method,
          method: "POST",
          form: {
            customer: user.customerId,
            amount: parseFloat(task.deposit) * 100,
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

        request(paymentOpt, (error, resp, body) => {
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
  });
};
