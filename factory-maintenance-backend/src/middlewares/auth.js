const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT token from cookie
exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie instead of header
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Please log in to access this resource.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'verificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
      // Clear invalid cookie
      res.clearCookie('jwt');
      return res.status(401).json({ message: 'Invalid session. Please log in again.' });
    }

    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    // Clear cookie on error
    res.clearCookie('jwt');
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    
    return res.status(401).json({ message: 'Invalid session. Please log in again.' });
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