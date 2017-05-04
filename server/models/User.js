const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');

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
    type: String
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
  googleAccessToken: {
    type: String
  },
  googleRefreshToken: {
    type: String
  },
  googleNotificationChannel: {
    type: String
  }
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
