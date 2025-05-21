const { CustomSolutionsMessage } = require('../models');

// Controller for handling custom solutions form operations
const customSolutionsController = {
  // Create a new custom solutions message
  async createMessage(req, res) {
    try {
      const { name, email, companyName, industry, message } = req.body;
      
      if (!name || !email || !companyName || !industry || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
      }
      
      const newMessage = await CustomSolutionsMessage.create({
        name,
        email,
        companyName,
        industry,
        message
      });
      
      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully',
        data: newMessage
      });
    } catch (error) {
      console.error('Error creating custom solutions message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send your message',
        error: error.message
      });
    }
  },
  
  // Get all custom solutions messages (for admin dashboard)
  async getAllMessages(req, res) {
    try {
      const messages = await CustomSolutionsMessage.findAll({
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching custom solutions messages:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve messages',
        error: error.message
      });
    }
  },
  
  // Get a single message details
  async getMessage(req, res) {
    try {
      const { id } = req.params;
      
      const message = await CustomSolutionsMessage.findByPk(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      // Mark message as read if it hasn't been read yet
      if (!message.isRead) {
        message.isRead = true;
        await message.save();
      }
      
      return res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error fetching message details:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve message details',
        error: error.message
      });
    }
  },
  
  // Delete a message
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      
      const message = await CustomSolutionsMessage.findByPk(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      await message.destroy();
      
      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete message',
        error: error.message
      });
    }
  },
  
  // Mark message as read/unread
  async toggleReadStatus(req, res) {
    try {
      const { id } = req.params;
      
      const message = await CustomSolutionsMessage.findByPk(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      message.isRead = !message.isRead;
      await message.save();
      
      return res.status(200).json({
        success: true,
        message: `Message marked as ${message.isRead ? 'read' : 'unread'}`,
        data: message
      });
    } catch (error) {
      console.error('Error updating message read status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update message status',
        error: error.message
      });
    }
  }
};

module.exports = customSolutionsController;