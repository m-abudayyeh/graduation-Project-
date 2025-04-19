const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken, checkSubscription } = require('../middlewares/auth');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get all user notifications
router.get('/', notificationController.getUserNotifications);

// Get unread notifications count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark all notifications as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;