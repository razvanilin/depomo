const mongoose = require('mongoose');
const checkAccess = require('../modules/checkAccess');

module.exports = (app, route) => {

  Achievement = mongoose.model('achievement', app.models.achievement);

  /** Get all achievements **/
  app.get("/achievement", checkAccess, (req, res) => {
    Achievement.find({}, (err, achievements) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      if (!achievements) {
        return res.status(404).send("No achievements found")
      }

      return res.status(200).send(achievements);
    });
  });

  /** Route to create new achievements **/
  app.post("/achievement", /*checkAdmin,*/(req, res) => {
    if (!req.body.label) return res.status(400).send("Label is required.");

    Achievement.create(req.body, (err, achievement) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
    });
  });

  return (req, res, next) => {
    next();
  }
}
