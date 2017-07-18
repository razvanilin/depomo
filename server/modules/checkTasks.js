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
      if (moment.tz().diff(moment(tasks[i].due), 'minutes') > 0) {
        console.log("making payment for: " + tasks[i]._id);
        makePayment(app, tasks[i], (success, result) => {
          if (!success) {
            Task.update({_id: result.taskId}, {
              $set: {
                transactionStatus: "payment_failed",
                status: "failed"
              }
            }, (err, task) => {

            });
          } else {
            // update the status of the document
            Task.findByIdAndUpdate(result.taskId,
              {
                $set: {
                  status: "failed",
                  transactionId: result.payment.id,
                  transactionStatus: result.payment.status,
                  currency: result.payment.currency,
                  refund: -1
                }
              }, (err, task) => {
                if (err) {
                  console.log(err);
                }
                console.log(result.payment.id + " was " + result.payment.status);
            });
          }
        });
      }
    }
  });
}
