// routes/webhook.route.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

router.post('/', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

module.exports = router;
