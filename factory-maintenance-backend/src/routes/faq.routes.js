const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Public routes
router.get('/', faqController.getAllFAQs);
router.get('/categories', faqController.getCategories);
router.get('/:id', faqController.getFAQById);

// Admin routes
router.use(authenticateToken);

// Create new FAQ (super_admin only)
router.post(
  '/',
  authorizeRoles('super_admin'),
  faqController.createFAQ
);

// Update FAQ (super_admin only)
router.put(
  '/:id',
  authorizeRoles('super_admin'),
  faqController.updateFAQ
);

// Delete FAQ (super_admin only)
router.delete(
  '/:id',
  authorizeRoles('super_admin'),
  faqController.deleteFAQ
);

module.exports = router;