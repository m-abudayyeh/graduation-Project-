const { Company } = require('../models');
const responseHandler = require('../utils/responseHandler');

/**
 * Get company details by ID
 * @route GET /api/companies/:id
 */
exports.getCompanyById = async (req, res, next) => {
  try {
    console.log('Request params:', req.params);
    console.log('Request user:', req.user);
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find company - all users can view their company data
    const company = await Company.findByPk(id);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Users can only view their own company data, except super_admin
    if (parseInt(id) !== companyId && req.user.role !== 'super_admin') {
      return responseHandler.error(res, 403, 'You do not have permission to access this company');
    }
    
    return responseHandler.success(res, 200, 'Company retrieved successfully', company);
  } catch (error) {
    next(error);
  }
};

/**
 * Update company details
 * @route PUT /api/companies/:id
 */
exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const updates = req.body;
    
    // Find company first to check if it exists
    const company = await Company.findByPk(id);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Only admin or super_admin can update company
    if (role !== 'admin' && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Only admin can update company details');
    }
    
    // Users can only update their own company data, except super_admin
    if (parseInt(id) !== companyId && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'You do not have permission to update this company');
    }
    
    // Remove fields that shouldn't be updated by regular admin
    if (role !== 'super_admin') {
      delete updates.subscriptionStatus;
      delete updates.subscriptionType;
      delete updates.subscriptionStartDate;
      delete updates.subscriptionEndDate;
      delete updates.stripeCustomerId;
  
    }
    
    // Update company
    await company.update(updates);
    
    return responseHandler.success(res, 200, 'Company updated successfully', company);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload company logo
 * @route PUT /api/companies/:id/logo
 */
exports.uploadLogo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Find company first to check if it exists
    const company = await Company.findByPk(id);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Only admin or super_admin can update company logo
    if (role !== 'admin' && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Only admin can update company logo');
    }
    
    // Users can only update their own company data, except super_admin
    if (parseInt(id) !== companyId && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'You do not have permission to update this company');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Update logo
    company.logo = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await company.save();
    
    return responseHandler.success(res, 200, 'Company logo updated successfully', company);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all companies (super_admin only)
 * @route GET /api/companies
 */
exports.getAllCompanies = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { page = 1, limit = 10, search, subscriptionStatus } = req.query;
    
    // Only super_admin can list all companies
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = {};
    
    // Add search filter if provided
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${search}%` };
    }
    
    // Add subscription status filter if provided
    if (subscriptionStatus) {
      whereConditions.subscriptionStatus = subscriptionStatus;
    }
    
    // Get companies with pagination
    const { count, rows } = await Company.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Companies retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update company subscription details (super_admin only)
 * @route PUT /api/companies/:id/subscription
 */
exports.updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const { subscriptionStatus, subscriptionType, subscriptionStartDate, subscriptionEndDate } = req.body;
    
    // Only super_admin can update subscription details
    if (role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Access denied');
    }
    
    // Find company
    const company = await Company.findByPk(id);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Update subscription details
    await company.update({
      subscriptionStatus,
      subscriptionType,
      subscriptionStartDate,
      subscriptionEndDate
    });
    
    return responseHandler.success(res, 200, 'Subscription updated successfully', company);
  } catch (error) {
    next(error);
  }
};