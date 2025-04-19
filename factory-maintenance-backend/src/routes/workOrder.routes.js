const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrder.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadMultiple, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get work order statistics
router.get('/statistics', workOrderController.getStatistics);

// Get all work orders
router.get('/', workOrderController.getAllWorkOrders);

// Get work order by ID
router.get('/:id', workOrderController.getWorkOrderById);

// Create new work order (admin/supervisor only)
router.post(
  '/',
  authorizeRoles('admin', 'supervisor'),
  workOrderController.createWorkOrder
);

// Update work order
router.put(
  '/:id',
  workOrderController.updateWorkOrder
);

// Delete work order (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  workOrderController.deleteWorkOrder
);

// Upload work order images
router.post(
  '/:id/images',
  uploadMultiple('images', 5),
  handleUploadErrors,
  workOrderController.uploadImages
);

// Add parts to work order
router.post(
  '/:id/parts',
  workOrderController.addParts
);

// Remove part from work order
router.delete(
  '/:id/parts/:partId',
  workOrderController.removePart
);

module.exports = router;