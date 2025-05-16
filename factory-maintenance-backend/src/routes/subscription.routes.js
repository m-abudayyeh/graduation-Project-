const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');


// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get subscription details for a company
router.get('/company/:companyId', subscriptionController.getCompanySubscription);

// Create free trial subscription
router.post('/create-trial', authorizeRoles(['admin']), subscriptionController.createTrialSubscription);

// Create Stripe checkout session
router.post('/create-checkout-session', subscriptionController.createCheckoutSession);

// Cancel subscription
router.post('/cancel', authorizeRoles(['admin']), subscriptionController.cancelSubscription);

// Update subscription preferences
router.patch('/:id', authorizeRoles(['admin']), subscriptionController.updateSubscriptionPreferences);

// POST /api/subscriptions/verify-payment
router.post('/verify-payment', subscriptionController.verifyPayment);

module.exports = router;