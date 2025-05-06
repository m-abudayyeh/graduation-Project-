// const { Location, Equipment } = require('../models');
// const responseHandler = require('../utils/responseHandler');
// const { Op } = require('sequelize');
// const { Location, Equipment } = require('../models');
// const responseHandler = require('../utils/responseHandler');
// console.log('المسار الكامل لنموذج Equipment:', require.resolve('../models/equipment'));
// console.log('جميع النماذج المتاحة:', Object.keys(require('../models')));


// استيراد النماذج والمكتبات اللازمة
const { Op } = require('sequelize');
const { Location } = require('../models');
const db = require('../models'); // استيراد كل النماذج وكائن sequelize
const responseHandler = require('../utils/responseHandler');


/**
 * Get all locations for a company
 * @route GET /api/locations
 */
exports.getAllLocations = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page =1 , limit = 5, search, includeDeleted } = req.query;
  
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
      order: [['name', 'ASC']],
      // Include deleted records if specified
      paranoid: includeDeleted === 'true' ? false : true
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
    const { includeDeleted } = req.query;
    
    // Find location
    const location = await Location.findOne({
      where: { id, companyId },
      // Include deleted records if specified
      paranoid: includeDeleted === 'true' ? false : true
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
    delete updates.deletedAt; // Prevent manual update of deletedAt
    
    // Update location
    await location.update(updates);
    
    return responseHandler.success(res, 200, 'Location updated successfully', location);
  } catch (error) {
    next(error);
  }
};

// /**
//  * Delete location
//  * @route DELETE /api/locations/:id
//  */
// exports.deleteLocation = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { companyId, role } = req.user;
    
//     // Only admin can delete locations
//     if (role !== 'admin') {
//       return responseHandler.error(res, 403, 'Only admin can delete locations');
//     }
    
//     // Find location
//     const location = await Location.findOne({
//       where: { id, companyId }
//     });
    
//     if (!location) {
//       return responseHandler.error(res, 404, 'Location not found');
//     }
    
//     // Check if location has equipment or work orders
//     // const equipmentCount = await db.Equipments.count({
//     //   where: { locationId: id }
//     // });

//     const [result] = await sequelize.query(
//       'SELECT COUNT(*) as count FROM "Equipments" WHERE "locationId" = :locationId',
//       {
//         replacements: { locationId: id },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );
    
    
//     if (equipmentCount > 0) {
//       return responseHandler.error(
//         res, 
//         400, 
//         'Cannot delete location because it has equipment associated with it'
//       );
//     }
    
//     // Delete location (now a soft delete due to paranoid mode)
//     await location.destroy();
    
//     return responseHandler.success(res, 200, 'Location deleted successfully');
//   } catch (error) {
//     next(error);
//   }
// };


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
    
    // استخدام استعلام SQL مباشر للتحقق من وجود معدات مرتبطة
    const [result] = await db.sequelize.query(
      'SELECT COUNT(*) as count FROM "Equipments" WHERE "locationId" = :locationId',
      {
        replacements: { locationId: id },
        type: db.sequelize.QueryTypes.SELECT
      }
    );
    
    if (parseInt(result.count) > 0) {
      return responseHandler.error(
        res, 
        400, 
        'Cannot delete location because it has equipment associated with it'
      );
    }
    
    // Delete location (now a soft delete due to paranoid mode)
    await location.destroy();
    
    return responseHandler.success(res, 200, 'Location deleted successfully');
  } catch (error) {
    console.error('Error deleting location:', error);
    next(error);
  }
};

/**
 * Restore a soft-deleted location
 * @route POST /api/locations/:id/restore
 */
exports.restoreLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can restore locations
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can restore locations');
    }
    
    // Find the soft-deleted location
    const location = await Location.findOne({
      where: { id, companyId },
      paranoid: false // Include soft-deleted records
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    if (!location.deletedAt) {
      return responseHandler.error(res, 400, 'Location is not deleted');
    }
    
    // Restore the location
    await location.restore();
    
    return responseHandler.success(res, 200, 'Location restored successfully', location);
  } catch (error) {
    console.error('Error restoring location:', error);
    next(error);
  }
};
/**
 * Restore a soft-deleted location
 * @route POST /api/locations/:id/restore
 */
exports.restoreLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can restore locations
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can restore locations');
    }
    
    // Find the soft-deleted location
    const location = await Location.findOne({
      where: { id, companyId },
      paranoid: false // Include soft-deleted records
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    if (!location.deletedAt) {
      return responseHandler.error(res, 400, 'Location is not deleted');
    }
    
    // Restore the location
    await location.restore();
    
    return responseHandler.success(res, 200, 'Location restored successfully', location);
  } catch (error) {
    next(error);
  }
};


/**
 * Permanently delete location (hard delete)
 * @route DELETE /api/locations/:id/permanent
 */
exports.permanentlyDeleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can permanently delete locations
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can permanently delete locations');
    }
    
    // Find location (including soft-deleted ones)
    const location = await Location.findOne({
      where: { id, companyId },
      paranoid: false // Include soft-deleted records
    });
    
    if (!location) {
      return responseHandler.error(res, 404, 'Location not found');
    }
    
    // Use direct SQL query to check for associated equipment (matching the working function)
    const [result] = await db.sequelize.query(
      'SELECT COUNT(*) as count FROM "Equipments" WHERE "locationId" = :locationId',
      {
        replacements: { locationId: id },
        type: db.sequelize.QueryTypes.SELECT
      }
    );
    
    if (parseInt(result.count) > 0) {
      return responseHandler.error(
        res, 
        400, 
        'Cannot delete location because it has equipment associated with it'
      );
    }
    
    // Permanently delete location
    await location.destroy({ force: true });
    
    return responseHandler.success(res, 200, 'Location permanently deleted');
  } catch (error) {
    console.error('Error permanently deleting location:', error);
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