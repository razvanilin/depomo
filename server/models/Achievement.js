const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

var Achievement = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  nextLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Achievement"
  },
  description: {
    type: String,
  },
  imageFileName: {
    type: String,
  },
  primary: {
    type: Boolean,
    default: true
  }
});

Achievement.plugin(timestamp);

module.exports = Achievement;
