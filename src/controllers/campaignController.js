const campaignService = require('../services/campaignService');


exports.createCampaign = async (req, res, next) => {
  try {
    const { name, segmentId, message, scheduledAt } = req.body;
    const createdBy = req.user ? req.user._id : null;
    const campaign = await campaignService.createCampaign({ name, segmentId, message, scheduledAt, createdBy });
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
};

exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
};

exports.getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
};


exports.sendCampaign = async (req, res, next) => {
  try {
    const result = await campaignService.sendCampaign(req.params.id, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.suggestCampaignMessages = async (req, res, next) => {
  try {
    const { product, audience, tone } = req.body;
    const suggestions = await campaignService.suggestCampaignMessages({ product, audience, tone });
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};
