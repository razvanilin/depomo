const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const mailchimp = require('./mailchimp');
// get the environment specific settings
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else if (process.env.NODE_ENV == "staging") {
  settings = require('../settings-staging');
} else {
  settings = require('../settings-dev');
}

module.exports = function(app, cb) {
  var User = mongoose.model('user', app.models.user);
  var Task = mongoose.model('task', app.models.task);

  // check all the users for pending tasks
  User.find({reminderNotification: true}, (err, users) => {
    if (err) return cb("Could not fetch users");
    if (!users) return cb("No users to check");

    users.map( user => {
      if (!user || !user._id) return;

      Task.find({owner: user._id, status: 'initial', reminderSent: false}, (err, tasks) => {
        if (err) return;
        if (!tasks) return;

        tasks.map( task => {
          if (!task || !task._id) return;

          if (moment.tz(moment().add(user.reminderOffset, 'minutes'), "Europe/London").utc() >= moment(task.due)) {
            let vars = [{
              name: "tasklabel",
              content: task.label,
            }, {
              name: "duedate",
              content: moment.tz(task.due, user.timezone).format('MMMM Do YYYY, h:mm:ss a')
            }, {
              name: 'deposit',
              content: task.deposit + " " + task.currency
            }, {
              name: 'completed',
              content: settings.host + "/complete?taskId=" + task._id + "&token=" + user.completeTaskToken
            }, {
              name: 'unsub',
              content: settings.host + "/notifications?userId=" + user._id + "&token=" + user.notificationToken
            }];

            mailchimp.sendEmail(app, settings.mandrill.reminderTemplate, user, vars, null, (err) => {
              if (!err) {
                Task.findByIdAndUpdate(task._id, {
                  $set: {
                    reminderSent: true
                  }
                }, (err, t) => {
                  if (err) console.log(err);
                });
              }
            });
          }
        });
      });

    });
  });
}
