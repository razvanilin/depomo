const mongoose = require('mongoose');
const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const userResponse = require('../modules/userResponse');

module.exports = (app, route) => {

  var Task = mongoose.model('task', app.models.task);
  var User = mongoose.model('user', app.models.user);
  var PaymentMethod = mongoose.model('paymentMethod', app.models.paymentMethod);

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

      //console.log(pay);
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
    }, {
      new: true
    }, (err, task) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Error updating the task");
      }

      // process the payment
      app.paypal.payment.execute(task.paymentId, {payer_id: task.payerId}, (error, payment) => {
        if (error) {
          console.log(error);
          console.log(error.response);
        }

        console.log(payment);

        // update the status of the document
        Task.update({paymentId: payment.id},
          {
            $set: {
              status: "paid"
            }
          }, (err, task) => {
            if (err) {
              console.log(err);
            }

            console.log(payment.id + " was " + payment.state);
        });
      });

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

  /** ROUTE to generate a Braintree client_token **/
  app.get('/payment/client_token', verifyOwner, (req, res) => {
    app.braintree.clientToken.generate({}, (err, response) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(response);
    });
  });
  // ------------------------------------------------

  /** ROUTE to create a new payment method for an existing customer **/
  app.post('/payment/:userId/method', verifyOwner, (req, res) => {
    if (!req.body.nonce) return res.status(400).send("Nonce missing from the request body");

    User.findOne({_id: req.params.userId}, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) {
        return res.status(404).send("Could not retrieve user information");
      }

      app.braintree.paymentMethod.create({
        customerId: user.customerId,
        paymentMethodNonce: req.body.nonce,
        options: {
          makeDefault: true
        }
      }, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        }

        var paymentMethodFields = {
          owner: user._id,
          token: result.paymentMethod.token,
          cardType: req.body.details.cardType || "",
          type: req.body.type,
          lastTwo: req.body.details.lastTwo || "",
          description: req.body.description || ""
        };

        app.braintree.customer.find(user.customerId, (err, customer) => {
          if (err) return res.status(400).send("Could not retrieve user information.");

          return res.status(200).send(userResponse(user, customer.paymentMethods));
        });
      });
    })
  });
  // ------------------------------------------------

  /** Route to make payment method as default **/
  app.put("/payment/:userId/method/:token", verifyOwner, (req, res) => {
    app.braintree.paymentMethod.update(req.params.token, req.body, (err, result) => {
      if (err) {
        console.log(err);
        console.log(req.params.token);
        return res.status(400).send(err);
      }

      User.findOne({_id: req.params.userId}, (err, user) => {
        if (err || !user) return res.status(400).send("Could not retrieve user information");

        app.braintree.customer.find(user.customerId, (err, customer) => {
          if (err) return res.status(400).send("Could not retrieve customer information");

          return res.status(200).send(userResponse(user, customer.paymentMethods));
        });
      });
    });
  });
  // ------------------------------------------------

  /** Route to make a payment **/
  app.post("/payment/:userId/pay/:type", (req, res) => {
    if (!req.body.amount || !req.body.token || !req.body.label || !req.body.currency)
      return res.status(400).send("Fields missing from the request body");

    // make the transaction
    var transactionOpt = {
      amount: req.body.amount,
      paymentMethodToken: req.body.token,
      options: {
        submitForSettlement: true
      }
    };

    if (req.params.type === 'paypal') {
      transactionOpt.recurring = true;
    }

    app.braintree.transaction.sale(transactionOpt, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(result);
    });
  });

  return (req, res, next) => {

  }
}
