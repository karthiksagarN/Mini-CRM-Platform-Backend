// backend/src/routes/communicationLogRoutes.js
const express = require('express');
const communicationLogController = require('../controllers/communicationLogController');

const router = express.Router();

// Optional query params: campaignId, customerId, status, from, to
router.get('/', communicationLogController.listCommunicationLogs);

// Vendor delivery receipt callback (public endpoint — vendor will call it)
router.post('/receipt', communicationLogController.handleDeliveryReceipt);

module.exports = router;
