const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: () => {
      return uuid();
    }
  },
  completeTaskToken: {
    type: String,
    default: () => {
      return uuid();
    }
  },
  timezone: {
    type: String
  },
  customerId: {
    type: String
  },
  preferedPayment: {
    type: String
  },
// GOOGLE
  googleAccessToken: {
    type: String
  },
  googleRefreshToken: {
    type: String
  },
  googleNotificationChannel: {
    type: String
  },
// NOTIFICATIONS
  notificationToken: {
    type: String,
    default: () => {
      return uuid();
    }
  },
  reminderNotification: {
    type: Boolean,
    default: true
  },
  reminderOffset: {
    type: Number,
    default: 30
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Achievement"
  }]
});

UserSchema.plugin(timestamp);

UserSchema.methods.comparePassword = (candidatePassword, password, cb) => {
  bcrypt.compare(candidatePassword, password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(isMatch);
  });
};

module.exports = UserSchema;
