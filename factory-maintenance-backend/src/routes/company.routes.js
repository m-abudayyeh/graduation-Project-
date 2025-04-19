const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticateToken, authorizeRoles, checkCompanyAccess, checkSubscription } = require('../middlewares/auth');
const { uploadSingle, handleUploadErrors } = require('../middlewares/fileUpload');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get all companies (super_admin only)
router.get(
  '/',
  authorizeRoles('super_admin'),
  companyController.getAllCompanies
);

// Get company by ID
router.get(
  '/:id',
  checkCompanyAccess,
  companyController.getCompanyById
);

// Update company
router.put(
  '/:id',
  authorizeRoles('admin', 'super_admin'),
  checkCompanyAccess,
  companyController.updateCompany
);

// Upload company logo
router.put(
  '/:id/logo',
  authorizeRoles('admin', 'super_admin'),
  checkCompanyAccess,
  uploadSingle('logo'),
  handleUploadErrors,
  companyController.uploadLogo
);

// Update company subscription (super_admin only)
router.put(
  '/:id/subscription',
  authorizeRoles('super_admin'),
  companyController.updateSubscription
);

module.exports = router;