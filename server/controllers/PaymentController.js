const mongoose = require('mongoose');
const checkAccess = require('../modules/checkAccess');

module.exports = (app, route) => {

  var Task = mongoose.model('task', app.models.task);

  /** Route to authorize a payment **/
  app.post("/payment", (req, res) => {
    if (!req.body.method || !req.body.currency || !req.body.amount || !req.body.user_id || !req.body.task_id) {
      return res.status(400).send("The body of the request is missing parameters.");
    }

    var payment = {
      intent: "sale",
      payer: {

      },
      transactions: [{
        amount: {
          currency: req.body.currency,
          total: req.body.amount
        },
        description: req.body.description ? req.body.description : "depomo task"
      }]
    };

    if (req.body.method === "paypal") {
      payment.payer.payment_method = 'paypal';
      payment.redirect_urls = {
        "return_url": app.settings.host + "/payment?user_id=" + req.body.user_id + "&task_id=" + req.body.task_id,
        "cancel_url": app.settings.host + "/payment?user_id=" + req.body.user_id + "&task_id=" + req.body.task_id
      }
    }

    console.log("Redirect: " + payment.redirect_urls.return_url);
    console.log("Cancel: " + payment.redirect_urls.cancel_url);

    app.paypal.payment.create(payment, (error, pay) => {
      if (error) {
        console.log(error);
        console.log(error.response);
        return res.status(400).send(error);
      }

      console.log(pay);
      return res.status(200).send(pay);
    });
  });
  // ------------------------------------------------

  /** Route to confirm the payment **/
  app.post("/payment/confirm", (req, res) => {
    if (!req.body.userId || !req.body.paymentId || !req.body.payerId || !req.body.taskId) {
      return res.status(400).send("Request body is missing parameters.");
    }

    // update the task document
    Task.findByIdAndUpdate(req.body.taskId, {
      $set: {
        payerId: req.body.payerId,
        status: "waiting"
      }
    }, (err, task) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Error updating the task");
      }

      return res.status(200).send(task);
    });
  });
  // ------------------------------------------------

  /** Route to cancel payments **/
  app.post("/payment/cancel", checkAccess, (req, res) => {
    if (!req.body.taskId) {
      return res.status(400).send("The request body is missing the task ID");
    }

    Task.findByIdAndUpdate(req.body.taskId, {
      $set: {
        status: 'canceled',
        payerId: '',
        paymentId: ''
      }
    }, {
      new: true
    }, (err, task) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(task);
    });
  });
  // ------------------------------------------------


  return (req, res, next) => {

  }
}
