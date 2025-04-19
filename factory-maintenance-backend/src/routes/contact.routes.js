const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Public route for submitting contact message
router.post('/', contactController.submitMessage);

// Admin routes for managing messages
router.use(authenticateToken);

// Get all contact messages (super_admin only)
router.get(
  '/messages',
  authorizeRoles('super_admin'),
  contactController.getAllMessages
);

// Get contact message by ID (super_admin only)
router.get(
  '/messages/:id',
  authorizeRoles('super_admin'),
  contactController.getMessageById
);

// Reply to contact message (super_admin only)
router.post(
  '/messages/:id/reply',
  authorizeRoles('super_admin'),
  contactController.replyToMessage
);

// Delete contact message (super_admin only)
router.delete(
  '/messages/:id',
  authorizeRoles('super_admin'),
  contactController.deleteMessage
);

module.exports = router;