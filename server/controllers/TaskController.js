const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const mongoose = require('mongoose');
const request = require('request');

module.exports = (app, route) => {

  // prepare the models
  var User = mongoose.model('user', app.models.user);
  var Task = mongoose.model('task', app.models.task);

  /** Route to get user's tasks **/
  app.get('/task/:id', verifyOwner, (req, res) => {
    var tasksExclusionFields = "-paymentId -payerId";
    Task.find({owner: req.params.id}, tasksExclusionFields, (err, tasks) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(tasks);
    });
  });
  // ---------------------------------------------------

  /** Route to record tasks **/
  app.post('/task', checkAccess, (req, res) => {
    if (!req.body._id || !req.body.label || !req.body.due || !req.body.deposit || !req.body.currency) {
      return res.status(400).send("Request body is incomplete. (_id, label, due, deposit, currency)");
    }

    // prepare the document
    var taskDoc = {
      owner: req.body._id,
      label: req.body.label,
      deposit: req.body.deposit,
      due: req.body.due,
      currency: req.body.currency
    };

    Task.create(taskDoc, (error, task) => {
      if (error) return res.status(400).send(error);

      console.log(task);

      // create the paypal payment
      var paypalOpt = {
        url: app.settings.api_host + "/payment",
        method: "POST",
        form: {
          method: "paypal",
          amount: taskDoc.deposit,
          currency: taskDoc.currency,
          description: taskDoc.label,
          user_id: taskDoc.owner,
          task_id: task._id.toString()
        },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };

      request(paypalOpt, (error, resp, body) => {
        if (error) return res.status(400).send(error);

        var payment;
        try {
          payment = JSON.parse(body);
        } catch (e) {
          console.log(e);
          console.log(body);
          return res.status(400).send("Error parsing your request.");
        }

        // update the task document
        Task.findByIdAndUpdate(task._id, {
          $set: {
            method: payment.payer.payment_method,
            paymentId: payment.id
          }
        }, (err, task) => {

          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          return res.status(200).send({
            task: task,
            payment: payment
          });
        });
      });
    });
  });
  // ---------------------------------------------------

  return (req, res, next) => {
    next();
  }
}
