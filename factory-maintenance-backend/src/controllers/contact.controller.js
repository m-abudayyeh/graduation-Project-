const { ContactMessage } = require('../models');
const responseHandler = require('../utils/responseHandler');
const emailService = require('../utils/emailService');

/**
 * Submit contact message
 * @route POST /api/contact
 */
exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create contact message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      isRead: false,
      isReplied: false
    });
    
    // Send auto-reply email
    await emailService.sendEmail({
      to: email,
      subject: `Thank you for contacting us - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF5E14;">Thank You for Contacting Us</h2>
          <p>Hello ${name},</p>
          <p>We have received your message regarding "${subject}".</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <p>For your reference, here's a copy of your message:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Thank you for your interest in our services.</p>
          <p>Best regards,<br>Factory Maintenance Team</p>
        </div>
      `
    });
    
    return responseHandler.success(
      res, 
      201, 
      'Your message has been sent successfully. We will get back to you soon.', 
      contactMessage
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all contact messages (super_admin only)
 * @route GET /api/contact/messages
 */
exports.getAllMessages = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { page = 1, limit = 10, isRead, isReplied } = req.query;
    
    // Only super_admin can list messages
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = {};
    
    // Add read/unread filter if provided
    if (isRead !== undefined) {
      whereConditions.isRead = isRead === 'true';
    }
    
    // Add replied filter if provided
    if (isReplied !== undefined) {
      whereConditions.isReplied = isReplied === 'true';
    }
    
    // Get messages with pagination
    const { count, rows } = await ContactMessage.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Contact messages retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get contact message by ID (super_admin only)
 * @route GET /api/contact/messages/:id
 */
exports.getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Only super_admin can view messages
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find message
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return responseHandler.error(res, 404, 'Message not found');
    }
    
    // Mark message as read if not already
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    
    return responseHandler.success(res, 200, 'Message retrieved successfully', message);
  } catch (error) {
    next(error);
  }
};

/**
 * Reply to contact message (super_admin only)
 * @route POST /api/contact/messages/:id/reply
 */
exports.replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const { replyContent } = req.body;
    
    // Only super_admin can reply to messages
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find message
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return responseHandler.error(res, 404, 'Message not found');
    }
    
    // Send reply email
    await emailService.sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF5E14;">Response to Your Inquiry</h2>
          <p>Hello ${message.name},</p>
          <p>Thank you for contacting Factory Maintenance. Here is our response to your inquiry:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            ${replyContent.replace(/\n/g, '<br>')}
          </div>
          <p>Your original message:</p>
          <div style="padding: 15px; border-left: 3px solid #FF5E14; margin: 20px 0;">
            ${message.message.replace(/\n/g, '<br>')}
          </div>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Factory Maintenance Team</p>
        </div>
      `
    });
    
    // Update message as replied
    message.isReplied = true;
    message.isRead = true;
    await message.save();
    
    return responseHandler.success(res, 200, 'Reply sent successfully', message);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact message (super_admin only)
 * @route DELETE /api/contact/messages/:id
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Only super_admin can delete messages
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find message
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return responseHandler.error(res, 404, 'Message not found');
    }
    
    // Delete message
    await message.destroy();
    
    return responseHandler.success(res, 200, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};