const express = require('express');
const router = express.Router();
const maintenanceRequestController = require('../controllers/maintenanceRequest.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadMultiple, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get all maintenance requests
router.get('/', maintenanceRequestController.getAllRequests);

// Get maintenance request by ID
router.get('/:id', maintenanceRequestController.getRequestById);

// Create new maintenance request
router.post('/', maintenanceRequestController.createRequest);

// Update maintenance request
router.put('/:id', maintenanceRequestController.updateRequest);

// Delete maintenance request
router.delete('/:id', maintenanceRequestController.deleteRequest);

// Upload images to maintenance request
router.post(
  '/:id/images',
  uploadMultiple('images', 5),
  handleUploadErrors,
  maintenanceRequestController.uploadImages
);

// Upload files to maintenance request
router.post(
  '/:id/files',
  uploadMultiple('files', 5),
  handleUploadErrors,
  maintenanceRequestController.uploadFiles
);

// Convert maintenance request to work order (admin/supervisor only)
router.post(
  '/:id/convert',
  authorizeRoles('admin', 'supervisor'),
  maintenanceRequestController.convertToWorkOrder
);

module.exports = router;