const mongoose = require('mongoose');
const moment = require('moment');
const makePayment = require('./makePayment');
const updateUserAchievements = require('./updateUserAchievements');

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
            }, { new: true }, (err, task) => {
              if (!err && task) {
                Task.find({owner: task.owner, status: "failed"}, (err, totalTasks) => {
                  if (!err && totalTasks) {
                    var totalDeposit = 0;
                    for (var index in totalTasks) {
                      totalDeposit += totalTasks[index].deposit;
                    }

                    updateUserAchievements.awardAchievementLevels(app, task.owner, "Benefactor", totalDeposit);
                  }
                });
              }
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
              }, {new: true}, (err, task) => {
                if (err) {
                  console.log(err);
                }
                console.log(result.payment.id + " was " + result.payment.status);

                if (!err && task) {
                  Task.find({owner: task.owner, status: "failed"}, (err, totalTasks) => {
                    if (!err && totalTasks) {
                      var totalDeposit = 0;
                      for (var index in totalTasks) {
                        totalDeposit += totalTasks[index].deposit;
                      }

                      updateUserAchievements.awardAchievementLevels(app, task.owner, "Benefactor", totalDeposit);
                    }
                  });
                }
            });
          }
        });
      }
    }
  });
}
