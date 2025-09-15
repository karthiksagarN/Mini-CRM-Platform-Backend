const segmentService = require('../services/segmentationService');

exports.createSegment = async (req, res, next) => {
  try {
    const { name, rules } = req.body;
    const segment = await segmentService.createSegment(name, rules, req.user && req.user._id);
    res.status(201).json(segment);
  } catch (err) {
    next(err);
  }
};

exports.getSegmentById = async (req, res, next) => {
  try {
    const segment = await segmentService.getSegmentById(req.params.id);
    if (!segment) return res.status(404).json({ error: 'Segment not found' });
    res.json(segment);
  } catch (err) {
    next(err);
  }
};

exports.evaluateSegmentRules = async (req, res, next) => {
  try {
    const { rules } = req.body;
    const { customers, count } = await segmentService.evaluateRules(rules);
    res.json({ count, customers });
  } catch (err) {
    next(err);
  }
};

exports.getAllSegments = async (req, res, next) => {
  try {
    const segments = await segmentService.getAllSegments();
    res.json(segments);
  } catch (err) {
    next(err);
  }
};

exports.buildRulesWithAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const rules = await segmentService.buildRulesFromAI(prompt);
    res.json({ rules });
  } catch (err) {
    next(err);
  }
};
