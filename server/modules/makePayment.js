const request = require('request');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = (task, cb) => {
  if (!task) return cb(false, "No task found");
  // create the paypal payment
  var paypalOpt = {
    url: settings.api_host + "/payment",
    method: "POST",
    form: {
      method: "paypal",
      amount: task.deposit,
      currency: task.currency,
      description: task.label,
      user_id: task.owner.toString(),
      task_id: task._id.toString()
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(paypalOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    var payment;
    try {
      payment = JSON.parse(body);
      return cb(true, payment);
    } catch (e) {
      console.log(e);
      console.log(body);
      return cb(false, "Error parsing your request.");
    }
  });
};
