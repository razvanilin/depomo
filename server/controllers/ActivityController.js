const checkAccess = require('../modules/checkAccess');
const mongoose = require('mongoose');

module.exports = (app, route) => {

  // prepare the models
  var User = mongoose.model('user', app.models.user);
  var Activity = mongoose.model('activity', app.models.activity);

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
      return res.status(200).send(activity);
    });
  });

  return (req, res, next) => {
    next();
  }
}