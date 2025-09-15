const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: { type: [RuleSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Segment', SegmentSchema);
