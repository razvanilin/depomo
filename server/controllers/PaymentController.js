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
        "return_url": app.settings.host + "/dashboard/activities?register_activity=true",
        "cancel_url": app.settings.host + "/dashboard/activities/add?register_activity=false"
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

  return (req, res, next) => {

  }
}
