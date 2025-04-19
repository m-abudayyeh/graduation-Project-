const { Notification, User } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

/**
 * Get all notifications for a user
 * @route GET /api/notifications
 */
exports.getUserNotifications = async (req, res, next) => {
  try {
    const { id: userId, companyId } = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { 
      companyId,
      userId
    };
    
    // Add unread filter if requested
    if (unreadOnly === 'true') {
      whereConditions.isRead = false;
    }
    
    // Get notifications with pagination
    const { count, rows } = await Notification.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Notifications retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * @route PUT /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, companyId } = req.user;
    
    // Find notification
    const notification = await Notification.findOne({
      where: { id, userId, companyId }
    });
    
    if (!notification) {
      return responseHandler.error(res, 404, 'Notification not found');
    }
    
    // Update notification
    notification.isRead = true;
    await notification.save();
    
    return responseHandler.success(res, 200, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * @route PUT /api/notifications/mark-all-read
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const { id: userId, companyId } = req.user;
    
    // Update all user's unread notifications
    await Notification.update(
      { isRead: true },
      { where: { userId, companyId, isRead: false } }
    );
    
    return responseHandler.success(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count
 * @route GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const { id: userId, companyId } = req.user;
    
    // Count unread notifications
    const count = await Notification.count({
      where: { userId, companyId, isRead: false }
    });
    
    return responseHandler.success(res, 200, 'Unread notifications count retrieved', { count });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 * @route DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, companyId } = req.user;
    
    // Find notification
    const notification = await Notification.findOne({
      where: { id, userId, companyId }
    });
    
    if (!notification) {
      return responseHandler.error(res, 404, 'Notification not found');
    }
    
    // Delete notification
    await notification.destroy();
    
    return responseHandler.success(res, 200, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create a notification (internal use)
 * Not exposed as an API endpoint
 */
exports.createNotification = async (notificationData) => {
  try {
    const { type, title, message, userId, companyId, relatedId, relatedType, targetUrl } = notificationData;
    
    // If userId is not provided, send to all admins and supervisors of the company
    if (!userId) {
      const adminUsers = await User.findAll({
        where: {
          companyId,
          role: { [Op.in]: ['admin', 'supervisor'] }
        }
      });
      
      const notifications = [];
      
      for (const user of adminUsers) {
        const notification = await Notification.create({
          type,
          title,
          message,
          userId: user.id,
          companyId,
          relatedId,
          relatedType,
          targetUrl,
          isRead: false
        });
        
        notifications.push(notification);
      }
      
      return notifications;
    }
    
    // Create notification for specific user
    const notification = await Notification.create({
      type,
      title,
      message,
      userId,
      companyId,
      relatedId,
      relatedType,
      targetUrl,
      isRead: false
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};