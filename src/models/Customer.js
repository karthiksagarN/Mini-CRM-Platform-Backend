const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, default: uuidv4 },
  email: { type: String, unique: true, required: true },
  name: { type: String },
  attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
