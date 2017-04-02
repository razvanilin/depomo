const mongoose = require('mongoose');
const moment = require('moment');

module.exports = (app) => {
  var Task = mongoose.model('task', app.models.task);

  Task.find({
    status: 'waiting'
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
      // if the task is due, then process the payment
      if (moment().diff(moment(tasks[i].due, "M/D/YYYY h:mm a"), 'minutes') > 0) {
        app.paypal.payment.execute(tasks[i].paymentId, {payer_id: tasks[i].payerId}, (error, payment) => {
          if (error) {
            console.log(error);
            console.log(error.response);
          }

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
      }
    }
  });
}
