const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadSingle, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get equipment categories
router.get('/categories', equipmentController.getCategories);

// Get equipment statuses
router.get('/statuses', equipmentController.getStatuses);

// Get equipment with maintenance due
router.get('/maintenance-due', equipmentController.getMaintenanceDue);

// Get all equipment
router.get('/', equipmentController.getAllEquipment);

// Get equipment by ID
router.get('/:id', equipmentController.getEquipmentById);

// Create new equipment (admin/supervisor only)
router.post(
  '/',
  authorizeRoles('admin', 'supervisor'),
  equipmentController.createEquipment
);

// Update equipment (admin/supervisor only)
router.put(
  '/:id',
  authorizeRoles('admin', 'supervisor'),
  equipmentController.updateEquipment
);

// Restore deleted equipment (admin only)
router.put(
  '/:id/restore',
  authorizeRoles('admin'),
  equipmentController.restoreEquipment
);

// Update equipment status
router.put(
  '/:id/status',
  authorizeRoles('admin', 'supervisor', 'technician'),
  equipmentController.updateStatus
);

// Update equipment maintenance dates
router.put(
  '/:id/maintenance-dates',
  authorizeRoles('admin', 'supervisor', 'technician'),
  equipmentController.updateMaintenanceDates
);

// Delete equipment (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  equipmentController.deleteEquipment
);

// Upload equipment image
router.put(
  '/:id/image',
  authorizeRoles('admin', 'supervisor'),
  uploadSingle('image'),
  handleUploadErrors,
  equipmentController.uploadImage
);

// Upload equipment documentation file
router.put(
  '/:id/file',
  authorizeRoles('admin', 'supervisor'),
  uploadSingle('file'),
  handleUploadErrors,
  equipmentController.uploadFile
);

module.exports = router;