const { Location, Equipment } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

/**
 * Get all locations for a company
 * @route GET /api/locations
 */
exports.getAllLocations = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10, search } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { companyId };
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get locations with pagination
    const { count, rows } = await Location.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Locations retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get location by ID
 * @route GET /api/locations/:id
 */
exports.getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find location
    const location = await Location.findOne({
      where: { id, companyId }
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    return responseHandler.success(res, 200, 'Location retrieved successfully', location);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new location
 * @route POST /api/locations
 */
exports.createLocation = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
    // Only admin can create locations
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to create locations');
    }
    
    const { name, address, notes } = req.body;
    
    // Create location
    const location = await Location.create({
      name,
      address,
      notes,
      companyId
    });
    
    return responseHandler.success(res, 201, 'Location created successfully', location);
  } catch (error) {
    next(error);
  }
};

/**
 * Update location
 * @route PUT /api/locations/:id
 */
exports.updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const updates = req.body;
    
    // Only admin or supervisor can update locations
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to update locations');
    }
    
    // Find location
    const location = await Location.findOne({
      where: { id, companyId }
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    // Remove fields that shouldn't be updated
    delete updates.companyId;
    
    // Update location
    await location.update(updates);
    
    return responseHandler.success(res, 200, 'Location updated successfully', location);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete location
 * @route DELETE /api/locations/:id
 */
exports.deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can delete locations
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can delete locations');
    }
    
    // Find location
    const location = await Location.findOne({
      where: { id, companyId }
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    // Check if location has equipment or work orders
    const equipmentCount = await Equipment.count({
      where: { locationId: id }
    });
    
    if (equipmentCount > 0) {
      return responseHandler.error(
        res, 
        400, 
        'Cannot delete location because it has equipment associated with it'
      );
    }
    
    // Delete location
    await location.destroy();
    
    return responseHandler.success(res, 200, 'Location deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Upload location image
 * @route PUT /api/locations/:id/image
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin or supervisor can update location images
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to update locations');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find location
    const location = await Location.findOne({
      where: { id, companyId }
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    // Update image
    location.image = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await location.save();
    
    return responseHandler.success(res, 200, 'Location image updated successfully', location);
  } catch (error) {
    next(error);
  }
};