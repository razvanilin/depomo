const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');

var ActivitySchema = new mongoose.Schema({
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
  method: {
    type: String
  },
  payerId: {
    type: String
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    default: "initial"
  }
});

ActivitySchema.plugin(timestamp);

module.exports = ActivitySchema;
