const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment-timezone');
const getPaypalToken = require('../modules/getPaypalToken');
const makePayment = require('../modules/makePayment');

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
    if (!req.body._id || !req.body.label || !req.body.due || !req.body.deposit || !req.body.currency || !req.body.defaultPayment) {
      return res.status(400).send("Request body is incomplete. (_id, label, due, deposit, currency)");
    }

    var taskDue = moment(req.body.due);

    if (moment().diff(taskDue, 'minutes') > 0) {
      return res.status(400).send("Cannot set a date in the past");
    }

    User.findOne({_id: req.body._id}, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.status(404).send("Could not retrieve the user information");

      // prepare the document
      var taskDoc = {
        owner: req.body._id,
        label: req.body.label,
        deposit: req.body.deposit,
        due: req.body.due,
        currency: req.body.currency,
        method: "paypal"
      };

      // transform the date to UTC
      //taskDoc.due = moment.tz(taskDoc.due, "M/D/YYYY h:mm a", user.timezone).utc().format();

      if (req.body.defaultPayment.cardType) taskDoc.method = "card";

      Task.create(taskDoc, (error, task) => {
        if (error) return res.status(400).send(error);
        try {
          return res.status(200).send(task);
        } catch (e) {
          console.log(e);
          console.log(task);
          return res.status(400).send("Error parsing the response");
        }
      });
    });
  });
  // ---------------------------------------------------

  /** ROUTE to complete payment **/
  app.put('/task/:id/payment', verifyOwner, (req, res) => {
    Task.findOne({_id: req.params.id}, (err, task) => {
      if (err) return res.status(400).send(err);
      if (!task) return res.status(404).send("No task found with that ID");
      if (task.status !== 'failed' && task.status !== 'completed') return res.status(400).send("This task is not finished yet. Cannot process payment for it.");

      makePayment(app, task, (error, result) => {
        // update the task document
        Task.findByIdAndUpdate(task._id, {
          $set: {
            transactionStatus: result.payment.transaction.status,
            transactionId: result.payment.transaction.id
          }
        }, {new: true}, (err, task) => {

          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          return res.status(200).send({task: task});
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
        status: "completed"
      }
    }, {new: true}, (err, task) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      if (!task) return res.status(404).send("No task was found");

      if (req.body.donation && req.body.donation > 0) {
        task.deposit = req.body.donation;

        makePayment(app, task, (success, result) => {
          if (!success) {
            Task.findByIdAndUpdate(req.params.id, {
              $set: {
                transactionStatus: result.error
              }
            }, {new: true}, (err, errorTask) => {
              if (err) return res.status(400).send("Could not update the task.");
              return res.status(200).send(errorTask);
            });

          } else {
            Task.findByIdAndUpdate(req.params.id, {
              $set: {
                transactionStatus: result.payment.transaction.status,
                transactionId: result.payment.transaction.id,
                currency: result.payment.transaction.currencyIsoCode,
                donation: req.body.donation
              }
            }, {new: true}, (err, doneTask) => {
              if (err) return res.status(400).send(err);
              return res.status(200).send(doneTask);
            });
          }
        });
      } else {
        return res.status(200).send(task);
      }
    });
  });
  // ---------------------------------------------------

  /** ROUTE to remove a task **/
  app.put('/task/:id/remove', (req, res) => {
    Task.findOne({_id: req.params.id}, (err, task) => {
      if (err || !task) {
        return res.status(400).send("Could not retrieve the task information");
      }

      if (moment().diff(moment(task.createdAt), 'minutes') > 5) {
        return res.status(400).send("More than 5 minutes have past since the task was created. The task cannot be removed anymore");
      }

      Task.findByIdAndRemove(req.params.id, err => {
        if (err) return res.status(400).send(err);

        return res.status(200).send("Task removed");
      });
    });
  });
  // ---------------------------------------------------


  return (req, res, next) => {
    next();
  }
}
