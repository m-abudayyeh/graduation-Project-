const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadSingle, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get all locations
router.get('/', locationController.getAllLocations);

// Get location by ID
router.get('/:id', locationController.getLocationById);

// Create new location (admin/supervisor only)
router.post(
  '/',
  authorizeRoles('admin', 'supervisor'),
  locationController.createLocation
);

// Update location (admin/supervisor only)
router.put(
  '/:id',
  authorizeRoles('admin', 'supervisor'),
  locationController.updateLocation
);

// Delete location (admin only) - now soft delete
router.delete(
  '/:id',
  authorizeRoles('admin'),
  locationController.deleteLocation
);

// Restore a soft-deleted location (admin only)
router.post(
  '/:id/restore',
  authorizeRoles('admin'),
  locationController.restoreLocation
);

// Permanently delete location (admin only)
router.delete(
  '/:id/permanent',
  authorizeRoles('admin'),
  locationController.permanentlyDeleteLocation
);

// Upload location image
router.put(
  '/:id/image',
  authorizeRoles('admin', 'supervisor'),
  uploadSingle('image'),
  handleUploadErrors,
  locationController.uploadImage
);

module.exports = router;