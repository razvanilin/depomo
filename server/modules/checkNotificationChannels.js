const mongoose = require('mongoose');
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else if (process.env.NODE_ENV == "staging") {
  settings = require('../settings-staging');
} else {
  settings = require('../settings-dev');
}

module.exports = (app, cb) => {
  User = mongoose.model('user', app.models.user);
  NotificationChannel = mongoose.model('notificationChannel', app.models.notificationChannel);

  NotificationChannel.find({}, (err, channels) => {
    if (err) return cb(err);
    if (!channels) return cb(null, "no channels");

    for (var i=0; i<channels.length; i++) {
      User.findOne({googleNotificationChannel: channels[i].channelId}, (err, user) => {
        if (!err && !user) {
          NotificationChannel.findOne({channelId: user.googleNotificationChannel}, (err, channel) => {
            app.calendar.channel.stop({
              id: user.googleNotificationChannel,
              resourceId: channel.resourceId,
              auth: settings.google.apiKey
            }, (error, result) => {
              if (error) console.log("Could not stop channel -> " + channel.channelId);
              else console.log("Channel stopped -> " + channel.channelId);
            });
          });
        }
      });
    }

    cb(null, "Done processing notification channels");
  });
}
