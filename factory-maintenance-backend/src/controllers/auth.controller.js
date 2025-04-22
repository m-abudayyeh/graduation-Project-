const bcrypt = require('bcrypt');
const { User, Company } = require('../models');
const jwtUtils = require('../utils/jwtUtils');
const emailService = require('../utils/emailService');
const responseHandler = require('../utils/responseHandler');

/**
 * Register a new user and company
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, companyName } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return responseHandler.error(res, 400, 'Email already registered');
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      subscriptionStatus: 'trial',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = jwtUtils.generateRandomToken();
    const hashedToken = jwtUtils.hashToken(verificationToken);

    // Create user with admin role
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'admin',
      companyId: company.id,
      verificationToken: hashedToken
    });

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    // Return success without sending password
    const userData = { ...user.get() };
    delete userData.password;
    delete userData.verificationToken;

    return responseHandler.success(
      res, 
      201, 
      'Registration successful. Please check your email to verify your account.', 
      { user: userData, company }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user email
 * @route GET /api/auth/verify-email/:token
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedToken = jwtUtils.hashToken(token);

    // Find user with matching token
    const user = await User.findOne({ where: { verificationToken: hashedToken } });

    if (!user) {
      return responseHandler.error(res, 400, 'Invalid or expired verification token');
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return responseHandler.success(res, 200, 'Email verification successful. You can now login.');
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Company, as: 'company' }]
    });

    // Check if user exists
    if (!user) {
      return responseHandler.error(res, 401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseHandler.error(res, 401, 'Invalid email or password');
    }

    // Check if email is verified
    if (!user.isVerified) {
      return responseHandler.error(res, 401, 'Please verify your email before logging in');
    }

    // Check company subscription status
    if (user.company.subscriptionStatus === 'expired' && user.role !== 'super_admin') {
      return responseHandler.error(
        res, 
        403, 
        'Your company subscription has expired. Please contact your administrator.'
      );
    }

    // Generate JWT token
    const token = jwtUtils.generateToken(user);
    
    // Set token in HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,              // منع الوصول من JavaScript
      secure: process.env.NODE_ENV === 'production', // استخدام HTTPS في الإنتاج فقط
      sameSite: 'strict',          // حماية من هجمات CSRF
      maxAge: parseInt(process.env.JWT_EXPIRES_IN) * 1000 || 24 * 60 * 60 * 1000  // صلاحية التوكن
    });

    // Return user data without password
    const userData = { ...user.get() };
    delete userData.password;
    delete userData.verificationToken;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;

    return responseHandler.success(res, 200, 'Login successful', { user: userData });
  } catch (error) {
    next(error);
  }
};

/**
 * User logout
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    // Clear JWT cookie
    res.clearCookie('jwt');
    
    return responseHandler.success(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user with email
    const user = await User.findOne({ where: { email } });

    // If user not found, still return success to prevent email enumeration
    if (!user) {
      return responseHandler.success(
        res, 
        200, 
        'If your email exists in our database, you will receive a password reset link'
      );
    }

    // Generate reset token
    const resetToken = jwtUtils.generateRandomToken();
    const hashedToken = jwtUtils.hashToken(resetToken);

    // Update user with reset token
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(user, resetToken);

    return responseHandler.success(
      res, 
      200, 
      'Password reset email sent. Please check your email.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedToken = jwtUtils.hashToken(token);

    // Find user with valid token
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() }
      }
    });

    if (!user) {
      return responseHandler.error(res, 400, 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and remove reset token
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return responseHandler.success(res, 200, 'Password reset successful. You can now login with your new password.');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached to request by auth middleware
    const { user } = req;

    // Include company data
    const userWithCompany = await User.findByPk(user.id, {
      include: [{ model: Company, as: 'company' }],
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    return responseHandler.success(res, 200, 'User profile retrieved successfully', userWithCompany);
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * @route PUT /api/auth/change-password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByPk(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return responseHandler.error(res, 401, 'Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return responseHandler.success(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};