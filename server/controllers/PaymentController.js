module.exports = (app, route) => {

  /** Route to authorize a payment **/
  app.post("/payment", (req, res) => {
    if (!req.body.method || !req.body.currency || !req.body.amount) {
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

    if (req.body.method === "paypal") {
      payment.payer.payment_method = 'paypal';
      payment.redirect_urls = {
        "return_url": app.settings.host + "/payment?user_id=" + req.body._id,
        "cancel_url": app.settings.host + "/payment?user_id=" + req.body._id
      }
    }

    app.paypal.payment.create(payment, (error, pay) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error);
      }

      console.log(pay);
      return res.status(200).send(pay);
    });
  });
  // ------------------------------------------------

  /** Route to confirm the payment **/
  app.post("/payment/confirm", (req, res) => {
    if (!req.body.userId || !req.body.paymentId || !req.body.payerId) {
      return res.status(400).send("Request body is missing parameters.");
    }

    app.paypal.payment.execute(req.body.paymentId, {payer_id: req.body.payerId}, (error, payment) => {
      if (error) {
        console.log("error");
        console.log(error);
        console.log(error.response);
        return res.status(400).send(error);
      }

      console.log("pass");
      console.log(payment, null, 4);
      return res.status(200).send(payment);
    });
  });

  return (req, res, next) => {

  }
}
