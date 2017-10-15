const mongoose = require('mongoose');

function awardAchievementLevels(app, uid, type, numCompleted) {
  var User = mongoose.model('user', app.models.user);
  var Achievement = mongoose.model('achievement', app.models.achievement);

  console.log("Completed task", numCompleted);
  console.log("For user", uid);
  Achievement.find({
    label: { $regex: type },
    value: { $lte: numCompleted },
  }, (err, achievements) => {
    if (err || !achievements) {
      console.log("Could not fetch achievement", err);
      return;
    }

    User.findOne({_id: uid}, (err, user) => {
      if (err) return console.log(err);
      if (!user) return console.log("Could not find user");

      if (!user.achievements) user.achievements = [];

      // go through the array and make sure not to add duplicates
      for (var i in achievements) {
        var found = false;

        for (var a in user.achievements) {
          if (user.achievements[a].toString() == achievements[i]._id) {
            found = true;
            break;
          }
        }

        if (!found) user.achievements.push(achievements[i]._id);
      }

      user.save();
    });
  });
}
// ------------------------------------------------------

// ------------------------------------------------------

module.exports = {
  awardAchievementLevels,
}
