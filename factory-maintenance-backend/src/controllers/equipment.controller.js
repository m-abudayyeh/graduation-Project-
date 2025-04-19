const { Equipment, Location, WorkOrder, PreventiveMaintenance } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

/**
 * Get all equipment for a company
 * @route GET /api/equipment
 */
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10, search, locationId, category } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { companyId };
    
    // Add location filter if provided
    if (locationId) {
      whereConditions.locationId = locationId;
    }
    
    // Add category filter if provided
    if (category) {
      whereConditions.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } },
        { manufacturer: { [Op.iLike]: `%${search}%` } },
        { serialNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get equipment with pagination and include location
    const { count, rows } = await Equipment.findAndCountAll({
      where: whereConditions,
      include: [{ model: Location, as: 'location' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Equipment retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get equipment by ID
 * @route GET /api/equipment/:id
 */
exports.getEquipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find equipment
    const equipment = await Equipment.findOne({
      where: { id, companyId },
      include: [{ model: Location, as: 'location' }]
    });
    
    if (!equipment) {
      return responseHandler.error(res, 404, 'Equipment not found');
    }
    
    return responseHandler.success(res, 200, 'Equipment retrieved successfully', equipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new equipment
 * @route POST /api/equipment
 */
exports.createEquipment = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
    // Only admin or supervisor can create equipment
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to create equipment');
    }
    
    const { 
      name, description, model, manufacturer, 
      serialNumber, category, locationId, notes 
    } = req.body;
    
    // Validate location belongs to company
    if (locationId) {
      const location = await Location.findOne({
        where: { id: locationId, companyId }
      });
      
      if (!location) {
        return responseHandler.error(res, 404, 'Location not found');
      }
    }
    
    // Create equipment
    const equipment = await Equipment.create({
      name,
      description,
      model,
      manufacturer,
      serialNumber,
      category,
      locationId,
      notes,
      companyId
    });
    
    // Fetch created equipment with location
    const createdEquipment = await Equipment.findByPk(equipment.id, {
      include: [{ model: Location, as: 'location' }]
    });
    
    return responseHandler.success(res, 201, 'Equipment created successfully', createdEquipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Update equipment
 * @route PUT /api/equipment/:id
 */
exports.updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const updates = req.body;
    
    // Only admin or supervisor can update equipment
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to update equipment');
    }
    
    // Find equipment
    const equipment = await Equipment.findOne({
      where: { id, companyId }
    });
    
    if (!equipment) {
      return responseHandler.error(res, 404, 'Equipment not found');
    }
    
    // Validate location belongs to company if provided
    if (updates.locationId) {
      const location = await Location.findOne({
        where: { id: updates.locationId, companyId }
      });
      
      if (!location) {
        return responseHandler.error(res, 404, 'Location not found');
      }
    }
    
    // Remove fields that shouldn't be updated
    delete updates.companyId;
    
    // Update equipment
    await equipment.update(updates);
    
    // Fetch updated equipment with location
    const updatedEquipment = await Equipment.findByPk(equipment.id, {
      include: [{ model: Location, as: 'location' }]
    });
    
    return responseHandler.success(res, 200, 'Equipment updated successfully', updatedEquipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete equipment
 * @route DELETE /api/equipment/:id
 */
exports.deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can delete equipment
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can delete equipment');
    }
    
    // Find equipment
    const equipment = await Equipment.findOne({
      where: { id, companyId }
    });
    
    if (!equipment) {
      return responseHandler.error(res, 404, 'Equipment not found');
    }
    
    // Check if equipment has work orders
    const workOrderCount = await WorkOrder.count({
      where: { equipmentId: id }
    });
    
    if (workOrderCount > 0) {
      return responseHandler.error(
        res, 
        400, 
        'Cannot delete equipment because it has work orders associated with it'
      );
    }
    
    // Check if equipment has preventive maintenance schedules
    const pmCount = await PreventiveMaintenance.count({
      where: { equipmentId: id }
    });
    
    if (pmCount > 0) {
      return responseHandler.error(
        res, 
        400, 
        'Cannot delete equipment because it has preventive maintenance schedules associated with it'
      );
    }
    
    // Delete equipment
    await equipment.destroy();
    
    return responseHandler.success(res, 200, 'Equipment deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Upload equipment image
 * @route PUT /api/equipment/:id/image
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin or supervisor can update equipment images
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to update equipment');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find equipment
    const equipment = await Equipment.findOne({
      where: { id, companyId }
    });
    
    if (!equipment) {
      return responseHandler.error(res, 404, 'Equipment not found');
    }
    
    // Update image
    equipment.image = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await equipment.save();
    
    return responseHandler.success(res, 200, 'Equipment image updated successfully', equipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload equipment documentation file
 * @route PUT /api/equipment/:id/file
 */
exports.uploadFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin or supervisor can update equipment files
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to update equipment');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find equipment
    const equipment = await Equipment.findOne({
      where: { id, companyId }
    });
    
    if (!equipment) {
      return responseHandler.error(res, 404, 'Equipment not found');
    }
    
    // Update file
    equipment.file = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await equipment.save();
    
    return responseHandler.success(res, 200, 'Equipment file uploaded successfully', equipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get equipment categories
 * @route GET /api/equipment/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    
    // Get distinct categories from equipment
    const categories = await Equipment.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { 
        companyId,
        category: { [Op.ne]: null }
      },
      raw: true
    });
    
    const categoryList = categories
      .map(item => item.category)
      .filter(category => category)
      .sort();
    
    return responseHandler.success(res, 200, 'Equipment categories retrieved successfully', categoryList);
  } catch (error) {
    next(error);
  }
};