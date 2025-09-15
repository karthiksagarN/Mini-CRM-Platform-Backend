const express = require('express');
const Joi = require('joi');
const validationMiddleware = require('../middlewares/validationMiddleware');
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const createCampaignSchema = Joi.object({
  name: Joi.string().required(),
  segmentId: Joi.string().optional(),
  message: Joi.string().required(),
  scheduledAt: Joi.date().optional()
});

router.post('/', validationMiddleware([createCampaignSchema]), campaignController.createCampaign);
router.get('/:id', campaignController.getCampaignById);
router.get('/', campaignController.getAllCampaigns);
router.post('/:id/send', campaignController.sendCampaign);
// router.post('/ai-suggestions', authMiddleware, validationMiddleware([createCampaignSchema]), campaignController.suggestCampaignMessages);
router.post('/ai-suggestions', campaignController.suggestCampaignMessages);


module.exports = router;
