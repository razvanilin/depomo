const mongoose = require('mongoose');
const moment = require('moment');

module.exports = (app) => {
  var Activity = mongoose.model('activity', app.models.activity);

  Activity.find({
    status: 'waiting'
  }, (err, activities) => {
    if (err) {
      console.log(err);
      return false;
    }

    if (activities && activities.length == 0) {
      console.log("No activities to be processed");
      return false;
    }

    for (var i=0; i<activities.length; i++) {
      //console.log(moment(activities[i].due));
      // if the activity is due, then process the payment
      if (moment().diff(moment(activities[i].due, "M/D/YYYY h:mm a"), 'minutes') > 0) {
        app.paypal.payment.execute(activities[i].paymentId, {payer_id: activities[i].payerId}, (error, payment) => {
          if (error) {
            //console.log("Error processing: " + activities[i].label);
            console.log(error);
            console.log(error.response);
          }

          // update the status of the document
          Activity.update({paymentId: payment.id},
            {
              $set: {
                status: "paid"
              }
            }, (err, activity) => {
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
