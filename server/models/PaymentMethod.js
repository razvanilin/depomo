const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

var PaymentMethodSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  lastTwo: {
    type: String
  },
  cardType: {
    type: String
  }
});

PaymentMethodSchema.plugin(timestamp);

module.exports = PaymentMethodSchema;
