const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticateToken, authorizeRoles, checkCompanyAccess } = require('../middlewares/auth');

// Webhook route (no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

// Protected routes
router.use(authenticateToken);

// Get company subscription
router.get(
  '/company/:companyId',
  checkCompanyAccess,
  subscriptionController.getCompanySubscription
);

// Create checkout session
router.post(
  '/create-checkout-session',
  authorizeRoles('admin'),
  subscriptionController.createCheckoutSession
);

// Cancel subscription
router.post(
  '/cancel',
  authorizeRoles('admin'),
  subscriptionController.cancelSubscription
);

module.exports = router;