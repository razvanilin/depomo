const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');

var TaskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  label: {
    type: String,
    required: true
  },
  due: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  deposit: {
    type: Number,
    min: 1
  },
  refund: {
    type: Number,
    min: -1
  },
  donation: {
    type: String,
    default: 0
  },
  method: {
    type: String
  },
  payerId: {
    type: String
  },
  paymentId: {
    type: String
  },
  transactionId: {
    type: String
  },
  transactionStatus: {
    type: String
  },
  googleId: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "initial"
  }
});

TaskSchema.plugin(timestamp);

module.exports = TaskSchema;
