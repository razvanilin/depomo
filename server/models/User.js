const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
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
