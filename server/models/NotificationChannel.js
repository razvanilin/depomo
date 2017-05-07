const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

var NotificationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  channelId: {
    type: String,
    required: true
  },
  resourceId: {
    type: String
  }
});

NotificationSchema.plugin(timestamp);

module.exports = NotificationSchema;
