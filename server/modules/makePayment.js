const request = require('request');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = (task, cb) => {
  if (!task) return cb(false, {error: "No task found"});
  // create the paypal payment
  var paypalOpt = {
    url: settings.api_host + "/payment/" + task.owner + "/pay/" + task.method,
    method: "POST",
    form: {
      amount: task.deposit,
      currency: task.currency,
      label: task.label,
      token: task.paymentMethodToken,
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
};
