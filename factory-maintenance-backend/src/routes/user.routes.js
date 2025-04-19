const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadSingle, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user (admin only)
router.post(
  '/',
  authorizeRoles('admin', 'super_admin'),
  userController.createUser
);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin', 'super_admin'),
  userController.deleteUser
);

// Update profile picture
router.put(
  '/:id/profile-picture',
  uploadSingle('profilePicture'),
  handleUploadErrors,
  userController.updateProfilePicture
);

// Update work status
router.put('/:id/work-status', userController.updateWorkStatus);

module.exports = router;