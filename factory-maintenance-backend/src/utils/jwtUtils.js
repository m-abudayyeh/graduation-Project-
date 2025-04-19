const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate random token for email verification or password reset
 * @returns {String} Random token
 */
exports.generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate hash for a token
 * @param {String} token - Token to hash
 * @returns {String} Hashed token
 */
exports.hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};