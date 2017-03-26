const mongoose = require('mongoose');

module.exports = (app, route) => {

  var Activity = mongoose.model('activity', app.models.activity);

  /** Route to authorize a payment **/
  app.post("/payment", (req, res) => {
    if (!req.body.method || !req.body.currency || !req.body.amount || !req.body.user_id || !req.body.activity_id) {
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
        description: req.body.description ? req.body.description : "depomo activity"
      }]
    };

    console.log(req.body.activity_id);

    if (req.body.method === "paypal") {
      payment.payer.payment_method = 'paypal';
      payment.redirect_urls = {
        "return_url": app.settings.host + "/payment?user_id=" + req.body.user_id + "&activity_id=" + req.body.activity_id,
        "cancel_url": app.settings.host + "/payment?user_id=" + req.body.user_id + "&activity_id=" + req.body.activity_id
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
    if (!req.body.userId || !req.body.paymentId || !req.body.payerId || !req.body.activityId) {
      return res.status(400).send("Request body is missing parameters.");
    }

    // update the activity document
    Activity.findByIdAndUpdate(req.body.activityId, {
      $set: {
        payerId: req.body.payerId,
        status: "waiting"
      }
    }, (err, activity) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Error updating the activity");
      }

      return res.status(200).send(activity);
    });
  });
  // ------------------------------------------------  

  return (req, res, next) => {

  }
}
