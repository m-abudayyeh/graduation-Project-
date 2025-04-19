const { FAQ } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

/**
 * Get all FAQs
 * @route GET /api/faqs
 */
exports.getAllFAQs = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    
    // Build query conditions
    const whereConditions = {};
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { question: { [Op.iLike]: `%${search}%` } },
        { answer: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add category filter if provided
    if (category) {
      whereConditions.category = category;
    }
    
    // Get FAQs
    const faqs = await FAQ.findAll({
      where: whereConditions,
      order: [
        ['category', 'ASC'],
        ['order', 'ASC']
      ]
    });
    
    return responseHandler.success(res, 200, 'FAQs retrieved successfully', faqs);
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQ by ID
 * @route GET /api/faqs/:id
 */
exports.getFAQById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find FAQ
    const faq = await FAQ.findByPk(id);
    
    if (!faq) {
      return responseHandler.error(res, 404, 'FAQ not found');
    }
    
    return responseHandler.success(res, 200, 'FAQ retrieved successfully', faq);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new FAQ (super_admin only)
 * @route POST /api/faqs
 */
exports.createFAQ = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { question, answer, category, order } = req.body;
    
    // Only super_admin can create FAQs
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Create FAQ
    const faq = await FAQ.create({
      question,
      answer,
      category,
      order: order || 0
    });
    
    return responseHandler.success(res, 201, 'FAQ created successfully', faq);
  } catch (error) {
    next(error);
  }
};

/**
 * Update FAQ (super_admin only)
 * @route PUT /api/faqs/:id
 */
exports.updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const updates = req.body;
    
    // Only super_admin can update FAQs
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find FAQ
    const faq = await FAQ.findByPk(id);
    
    if (!faq) {
      return responseHandler.error(res, 404, 'FAQ not found');
    }
    
    // Update FAQ
    await faq.update(updates);
    
    return responseHandler.success(res, 200, 'FAQ updated successfully', faq);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete FAQ (super_admin only)
 * @route DELETE /api/faqs/:id
 */
exports.deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Only super_admin can delete FAQs
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find FAQ
    const faq = await FAQ.findByPk(id);
    
    if (!faq) {
      return responseHandler.error(res, 404, 'FAQ not found');
    }
    
    // Delete FAQ
    await faq.destroy();
    
    return responseHandler.success(res, 200, 'FAQ deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all FAQ categories
 * @route GET /api/faqs/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    // Get distinct categories
    const categories = await FAQ.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: {
        category: { [Op.ne]: null }
      },
      raw: true
    });
    
    const categoryList = categories
      .map(item => item.category)
      .filter(category => category)
      .sort();
    
    return responseHandler.success(res, 200, 'FAQ categories retrieved successfully', categoryList);
  } catch (error) {
    next(error);
  }
};