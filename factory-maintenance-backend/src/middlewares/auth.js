const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract token from Bearer format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if the user has the required role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

// Check if the user belongs to the company in the request
exports.checkCompanyAccess = async (req, res, next) => {
  try {
    const companyId = req.params.companyId || req.body.companyId;
    
    // If no companyId specified, move on
    if (!companyId) {
      return next();
    }

    // Super admin can access any company
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user belongs to the specified company
    if (req.user.companyId !== parseInt(companyId)) {
      return res.status(403).json({ 
        message: 'You do not have permission to access resources from this company' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Verify subscription status
exports.checkSubscription = async (req, res, next) => {
  try {
    // Only check for logged-in users with company access
    if (!req.user || !req.user.companyId) {
      return next();
    }

    // Super admin bypass
    if (req.user.role === 'super_admin') {
      return next();
    }

    const { Company } = require('../models');
    
    const company = await Company.findByPk(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if subscription is active or in trial
    if (company.subscriptionStatus === 'expired') {
      return res.status(403).json({ 
        message: 'Your subscription has expired. Please renew your subscription to continue.' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};