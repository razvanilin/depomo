const mongoose = require('mongoose');

function awardAchievementLevels(app, uid, type, numCompleted) {
  var User = mongoose.model('user', app.models.user);
  var Achievement = mongoose.model('achievement', app.models.achievement);

  console.log("Completed task", numCompleted);
  console.log("For user", uid);
  Achievement.findOne({
    label: { $regex: type },
    value: numCompleted,
  }, (err, achievement) => {
    if (err || !achievement) {
      console.log("Could not fetch achievement", err);
      return;
    }

    User.findOne({_id: uid}, (err, user) => {
      if (err) return console.log(err);
      if (!user) return console.log("Could not find user");

      if (!user.achievements) user.achievements = [];
      user.achievements.push(achievement._id);
      user.save();
    });
  });
}
// ------------------------------------------------------

// ------------------------------------------------------

module.exports = {
  awardAchievementLevels,
}
