const express = require('express');
const router = express.Router();
const storePartController = require('../controllers/storePart.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');
const { uploadSingle, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get store part categories
router.get('/categories', storePartController.getCategories);

// Get low stock parts
router.get('/low-stock', storePartController.getLowStockParts);

// Get all store parts
router.get('/', storePartController.getAllParts);

// Get store part by ID
router.get('/:id', storePartController.getPartById);

// Create new store part (admin/supervisor/technician only)
router.post(
  '/',
  authorizeRoles('admin', 'supervisor', 'technician'),
  storePartController.createPart
);

// Update store part (admin/supervisor/technician only)
router.put(
  '/:id',
  authorizeRoles('admin', 'supervisor', 'technician'),
  storePartController.updatePart
);

// استرجاع قطعة غيار محذوفة
router.post(
  '/:id/restore',
  authorizeRoles('admin'),
  storePartController.restorePart
);

// Delete store part (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  storePartController.deletePart
);

// Update store part quantity
router.put(
  '/:id/quantity',
  authorizeRoles('admin', 'supervisor', 'technician'),
  storePartController.updateQuantity
);

// Upload store part image
router.put(
  '/:id/image',
  authorizeRoles('admin', 'supervisor', 'technician'),
  uploadSingle('image'),
  handleUploadErrors,
  storePartController.uploadImage
);

// Upload store part documentation file
router.put(
  '/:id/file',
  authorizeRoles('admin', 'supervisor', 'technician'),
  uploadSingle('file'),
  handleUploadErrors,
  storePartController.uploadFile
);

module.exports = router;