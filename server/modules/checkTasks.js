const mongoose = require('mongoose');
const moment = require('moment');
const makePayment = require('./makePayment');

module.exports = (app) => {
  var Task = mongoose.model('task', app.models.task);

  // check to see if there are any tasks waiting to be paid and mark them as completed
  Task.find({
    status: 'initial'
  }, (err, tasks) => {
    if (err) {
      console.log(err);
      return false;
    }

    if (tasks && tasks.length == 0) {
      console.log("No tasks to be processed");
      return false;
    }

    for (var i=0; i<tasks.length; i++) {
      if (moment().diff(moment(tasks[i].due), 'minutes') > 0) {
        console.log("making payment");
        makePayment(tasks[i], (success, result) => {
          if (!success) {
            Task.update({_id: result.taskId}, {
              $set: {
                status: "payment_failed"
              }
            }, (err, task) => {

            });
          } else {
            // update the status of the document
            Task.findByIdAndUpdate(result.taskId,
              {
                $set: {
                  status: "failed",
                  transactionId: result.payment.transaction.id,
                  currency: result.payment.transaction.currencyIsoCode,
                  refund: -1
                }
              }, (err, task) => {
                if (err) {
                  console.log(err);
                }
                console.log(result.payment.transaction.id + " was " + result.payment.transaction.status);
            });
          }
        });
      }
    }
  });

  // Check to see if any tasks should be placed as completed
  // Task.find({
  //   status: "paid",
  // }, (err, tasks) => {
  //   if (err) {
  //     console.log(err);
  //     return false;
  //   }
  //
  //   for (var i=0; i<tasks.length; i++) {
  //     if (moment().diff(moment(tasks[i].due), 'minutes') > 0) {
  //       Task.findByIdAndUpdate(tasks[i]._id, {
  //         $set: {
  //           status: "failed",
  //           refund: 0
  //         }
  //       }, { new: true }, (err, task) => {
  //         console.log(task._id + " was processed with: " + task.deposit + " " + task.currency);
  //       });
  //     }
  //   }
  // });

  // Check to see if any tasks that were not paid for
  // Task.find({
  //   status: "initial",
  // }, (err, tasks) => {
  //   if (err) {
  //     console.log(err);
  //     return false;
  //   }
  //
  //   for (var i=0; i<tasks.length; i++) {
  //     if (moment().diff(moment(tasks[i].due), 'minutes') > 0) {
  //       Task.findByIdAndUpdate(tasks[i]._id, {
  //         $set: {
  //           status: "failed",
  //           deposit: 0,
  //           refund: 0
  //         }
  //       }, { new: true }, (err, task) => {
  //         console.log(task._id + " was processed with: " + task.deposit + " " + task.currency);
  //       });
  //     }
  //   }
  // });
}
