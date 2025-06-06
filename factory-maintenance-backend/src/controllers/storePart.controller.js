const { StorePart, WorkOrderParts } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op, Sequelize } = require('sequelize');

/**
 * Get all store parts for a company
 * @route GET /api/store
 */
exports.getAllParts = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10, search, location, category, includeDeleted } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { companyId };
    
    // Add isDeleted condition based on includeDeleted parameter
    if (includeDeleted === 'true') {
      // If includeDeleted is true, we don't add any isDeleted condition
      // This will return both deleted and non-deleted items
    } else {
      // If includeDeleted is false or not provided, only show non-deleted items
      whereConditions.isDeleted = false;
    }
    
    // Add location filter if provided
    if (location) {
      whereConditions.location = location;
    }
    
    // Add category filter if provided
    if (category) {
      whereConditions.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { partNumber: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get store parts with pagination
    const { count, rows } = await StorePart.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Store parts retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get store part by ID
 * @route GET /api/store/:id
 */
exports.getPartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find store part (including deleted ones)
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    return responseHandler.success(res, 200, 'Store part retrieved successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new store part
 * @route POST /api/store
 */
exports.createPart = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
    // Only admin or supervisor or technician can create parts
    if (role !== 'admin' && role !== 'supervisor' && role !== 'technician') {
      return responseHandler.error(res, 403, 'You do not have permission to create store parts');
    }
    
    const { 
      name, partNumber, category, description, 
      quantity, location, notes 
    } = req.body;
    
    // Create store part
    const part = await StorePart.create({
      name,
      partNumber,
      category,
      description,
      quantity: parseInt(quantity) || 0,
      location,
      notes,
      companyId,
      isDeleted: false
    });
    
    return responseHandler.success(res, 201, 'Store part created successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Update store part
 * @route PUT /api/store/:id
 */
exports.updatePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const updates = req.body;
    
    // Only admin or supervisor or technician can update parts
    if (role !== 'admin' && role !== 'supervisor' && role !== 'technician') {
      return responseHandler.error(res, 403, 'You do not have permission to update store parts');
    }
    
    // Find store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: false
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    // Parse quantity as integer if provided
    if (updates.quantity !== undefined) {
      updates.quantity = parseInt(updates.quantity) || 0;
    }
    
    // Remove fields that shouldn't be updated
    delete updates.companyId;
    delete updates.isDeleted;
    
    // Update store part
    await part.update(updates);
    
    return responseHandler.success(res, 200, 'Store part updated successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete store part (soft delete)
 * @route DELETE /api/store/:id
 */
exports.deletePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can delete store parts
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can delete store parts');
    }
    
    // Find store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: false
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    try {
      // Try to check if part is used in work orders
      const db = require('../models');
      if (db.WorkOrderParts) {
        const usageCount = await db.WorkOrderParts.count({
          where: { storePartId: id }
        });
        
        if (usageCount > 0) {
          return responseHandler.error(
            res, 
            400, 
            'Cannot delete part because it is used in work orders'
          );
        }
      }
      
      // Soft delete the store part
      await part.update({ isDeleted: true });
      
      return responseHandler.success(res, 200, 'Store part deleted successfully');
    } catch (innerError) {
      console.error("Error checking part usage:", innerError);
      
      // Continue with delete even if the check fails
      await part.update({ isDeleted: true });
      
      return responseHandler.success(res, 200, 'Store part deleted successfully (without usage check)');
    }
  } catch (error) {
    console.error("General error in delete function:", error);
    next(error);
  }
};

/**
 * Restore deleted store part
 * @route POST /api/store/:id/restore
 */
exports.restorePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can restore store parts
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can restore store parts');
    }
    
    // Find deleted store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: true
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Deleted store part not found');
    }
    
    // Restore store part
    await part.update({ isDeleted: false });
    
    return responseHandler.success(res, 200, 'Store part restored successfully', part);
  } catch (error) {
    console.error("Error restoring store part:", error);
    next(error);
  }
};

/**
 * Upload store part image
 * @route PUT /api/store/:id/image
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin or supervisor or technician can update part images
    if (role !== 'admin' && role !== 'supervisor' && role !== 'technician') {
      return responseHandler.error(res, 403, 'You do not have permission to update store parts');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: false
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    // Update image
    part.image = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await part.save();
    
    return responseHandler.success(res, 200, 'Store part image updated successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload store part documentation file
 * @route PUT /api/store/:id/file
 */
exports.uploadFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin or supervisor or technician can update part files
    if (role !== 'admin' && role !== 'supervisor' && role !== 'technician') {
      return responseHandler.error(res, 403, 'You do not have permission to update store parts');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: false
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    // Update file
    part.file = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await part.save();
    
    return responseHandler.success(res, 200, 'Store part file uploaded successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Update store part quantity
 * @route PUT /api/store/:id/quantity
 */
exports.updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const { quantity, action } = req.body;
    
    // Only admin or supervisor or technician can update quantities
    if (role !== 'admin' && role !== 'supervisor' && role !== 'technician') {
      return responseHandler.error(res, 403, 'You do not have permission to update store parts');
    }
    
    // Find store part
    const part = await StorePart.findOne({
      where: { 
        id, 
        companyId,
        isDeleted: false
      }
    });
    
    if (!part) {
      return responseHandler.error(res, 404, 'Store part not found');
    }
    
    // Calculate new quantity based on action
    let newQuantity = parseInt(quantity) || 0;
    
    if (action === 'add') {
      newQuantity = part.quantity + newQuantity;
    } else if (action === 'subtract') {
      newQuantity = part.quantity - newQuantity;
      if (newQuantity < 0) newQuantity = 0;
    } else {
      // If no action specified, set to the provided quantity
    }
    
    // Update quantity
    part.quantity = newQuantity;
    await part.save();
    
    return responseHandler.success(res, 200, 'Store part quantity updated successfully', part);
  } catch (error) {
    next(error);
  }
};

/**
 * Get store part categories
 * @route GET /api/store/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    
    // Get distinct categories from store parts
    const categories = await StorePart.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
      where: { 
        companyId,
        isDeleted: false,
        category: { [Op.ne]: null }
      },
      raw: true
    });
    
    const categoryList = categories
      .map(item => item.category)
      .filter(category => category)
      .sort();
    
    return responseHandler.success(res, 200, 'Store part categories retrieved successfully', categoryList);
  } catch (error) {
    next(error);
  }
};

/**
 * Get low stock parts
 * @route GET /api/store/low-stock
 */
exports.getLowStockParts = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const minQuantity = req.query.minQuantity || 5;
    
    // Get parts with low quantity
    const lowStockParts = await StorePart.findAll({
      where: { 
        companyId,
        isDeleted: false,
        quantity: { [Op.lt]: minQuantity }
      },
      order: [['quantity', 'ASC']]
    });
    
    return responseHandler.success(
      res, 
      200, 
      'Low stock parts retrieved successfully', 
      lowStockParts
    );
  } catch (error) {
    next(error);
  }
};