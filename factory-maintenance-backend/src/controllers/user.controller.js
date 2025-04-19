const bcrypt = require('bcrypt');
const { User } = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

/**
 * Get all users for a company
 * @route GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10, search, role } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { companyId };
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add role filter if provided
    if (role) {
      whereConditions.role = role;
    }
    
    // Get users with pagination
    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Users retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find user
    const user = await User.findOne({
      where: { id, companyId },
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });
    
    if (!user) {
      return responseHandler.error(res, 404, 'User not found');
    }
    
    return responseHandler.success(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @route POST /api/users
 */
exports.createUser = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
    // Only admin can create users
    if (role !== 'admin' && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Only admin can create users');
    }
    
    const { firstName, lastName, email, phoneNumber, password, role: userRole } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return responseHandler.error(res, 400, 'Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: userRole,
      companyId,
      isVerified: true // Admin-created users are auto-verified
    });
    
    // Return success without sending password
    const userData = { ...user.get() };
    delete userData.password;
    
    return responseHandler.success(res, 201, 'User created successfully', userData);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    const updates = req.body;
    
    // Find user
    const user = await User.findOne({ where: { id, companyId } });
    
    if (!user) {
      return responseHandler.error(res, 404, 'User not found');
    }
    
    // Only admin can update other users or change roles
    if (req.user.id !== parseInt(id)) {
      if (role !== 'admin' && role !== 'super_admin') {
        return responseHandler.error(res, 403, 'You do not have permission to update this user');
      }
    } else {
      // User updating themselves can't change their role
      delete updates.role;
    }
    
    // Remove fields that shouldn't be updated directly
    delete updates.password;
    delete updates.companyId;
    delete updates.isVerified;
    delete updates.verificationToken;
    delete updates.passwordResetToken;
    delete updates.passwordResetExpires;
    
    // Update user
    await user.update(updates);
    
    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });
    
    return responseHandler.success(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: currentUserId } = req.user;
    
    // Only admin can delete users
    if (role !== 'admin' && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'Only admin can delete users');
    }
    
    // Admin can't delete themselves
    if (parseInt(id) === currentUserId) {
      return responseHandler.error(res, 400, 'You cannot delete your own account');
    }
    
    // Find user
    const user = await User.findOne({ where: { id, companyId } });
    
    if (!user) {
      return responseHandler.error(res, 404, 'User not found');
    }
    
    // Delete user
    await user.destroy();
    
    return responseHandler.success(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile picture
 * @route PUT /api/users/:id/profile-picture
 */
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, id: currentUserId, role } = req.user;
    
    // Check permissions
    if (parseInt(id) !== currentUserId && role !== 'admin' && role !== 'super_admin') {
      return responseHandler.error(res, 403, 'You do not have permission to update this user');
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return responseHandler.error(res, 400, 'No file uploaded');
    }
    
    // Find user
    const user = await User.findOne({
      where: { id, companyId },
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });
    
    if (!user) {
      return responseHandler.error(res, 404, 'User not found');
    }
    
    // Update profile picture
    user.profilePicture = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform
    await user.save();
    
    return responseHandler.success(res, 200, 'Profile picture updated successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user work status
 * @route PUT /api/users/:id/work-status
 */
exports.updateWorkStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, id: currentUserId } = req.user;
    const { workStatus } = req.body;
    
    // Users can only update their own work status
    if (parseInt(id) !== currentUserId) {
      return responseHandler.error(res, 403, 'You can only update your own work status');
    }
    
    // Validate work status
    const validStatuses = ['on_shift', 'end_shift', 'on_call'];
    if (!validStatuses.includes(workStatus)) {
      return responseHandler.error(res, 400, 'Invalid work status');
    }
    
    // Find user
    const user = await User.findOne({
      where: { id, companyId },
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });
    
    if (!user) {
      return responseHandler.error(res, 404, 'User not found');
    }
    
    // Update work status
    user.workStatus = workStatus;
    await user.save();
    
    return responseHandler.success(res, 200, 'Work status updated successfully', user);
  } catch (error) {
    next(error);
  }
};