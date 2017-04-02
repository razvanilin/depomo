const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const mongoose = require('mongoose');
const request = require('request');

module.exports = (app, route) => {

  // prepare the models
  var User = mongoose.model('user', app.models.user);
  var Activity = mongoose.model('activity', app.models.activity);

  /** Route to get user's activities **/
  app.get('/activity/:id', verifyOwner, (req, res) => {
    var activitiesExclusionFields = "-paymentId -payerId";
    Activity.find({owner: req.params.id}, activitiesExclusionFields, (err, activities) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(activities);
    });
  });
  // ---------------------------------------------------

  /** Route to record activities **/
  app.post('/activity', checkAccess, (req, res) => {
    if (!req.body._id || !req.body.label || !req.body.due || !req.body.deposit || !req.body.currency) {
      return res.status(400).send("Request body is incomplete. (_id, label, due, deposit, currency)");
    }

    // prepare the document
    var activityDoc = {
      owner: req.body._id,
      label: req.body.label,
      deposit: req.body.deposit,
      due: req.body.due,
      currency: req.body.currency
    };

    Activity.create(activityDoc, (error, activity) => {
      if (error) return res.status(400).send(error);

      console.log(activity);

      // create the paypal payment
      var paypalOpt = {
        url: app.settings.api_host + "/payment",
        method: "POST",
        form: {
          method: "paypal",
          amount: activityDoc.deposit,
          currency: activityDoc.currency,
          description: activityDoc.label,
          user_id: activityDoc.owner,
          activity_id: activity._id.toString()
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

        // update the activity document
        Activity.findByIdAndUpdate(activity._id, {
          $set: {
            method: payment.payer.payment_method,
            paymentId: payment.id
          }
        }, (err, activity) => {

          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          return res.status(200).send({
            activity: activity,
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
