const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment');

module.exports = (app, route) => {

  // prepare the models
  var User = mongoose.model('user', app.models.user);
  var Task = mongoose.model('task', app.models.task);

  /** Route to get user's tasks **/
  app.get('/task', verifyOwner, (req, res) => {
    var tasksExclusionFields = "-paymentId -payerId";
    Task.find({owner: req.query.userId}, tasksExclusionFields, (err, tasks) => {
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

  /** ROUTE to update tasks **/
  app.put('/task/:id', verifyOwner, (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, (err, task) => {
      if (err) return res.status(400).send(err);
      if (!task) return res.status(404).send("No task found with that ID");

      return res.status(200).send(task);
    });
  });
  // ---------------------------------------------------

  /** ROUTE to mark activity as complete **/
  app.put('/task/:id/complete', verifyOwner, (req, res) => {
    Task.findByIdAndUpdate(req.params.id, {
      $set: {
        status: "completed",
        payerId: "",
        paymentId: ""
      }
    }, {new: true}, (err, task) => {
      if (err) return res.status(400).send(err);
      if (!task) return res.status(404).send("No task found with that ID");

      return res.status(200).send(task);
    });
  });
  // ---------------------------------------------------

  /** ROUTE to remove a task **/
  app.put('/task/:id/remove', (req, res) => {
    Task.findByIdAndRemove(req.params.id, err => {
      if (err) return res.status(400).send(err);

      return res.status(200).send("Task removed");
    });
  });
  // ---------------------------------------------------


  return (req, res, next) => {
    next();
  }
}
