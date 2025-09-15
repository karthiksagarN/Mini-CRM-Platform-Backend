const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true }, // ✨ ADD THIS LINE
  status: { type: String, enum: ['sent', 'failed'], required: true },
  sentAt: { type: Date, default: Date.now },
  response: { type: String, default: '' }
});

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
