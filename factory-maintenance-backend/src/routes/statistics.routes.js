const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get dashboard statistics
router.get('/dashboard', statisticsController.getDashboardStats);

// Get work order statistics
router.get('/work-orders', statisticsController.getWorkOrderStats);

// Get inventory statistics
router.get('/inventory', statisticsController.getInventoryStats);

// Get super admin statistics (super_admin only)
router.get(
  '/admin',
  authorizeRoles('super_admin'),
  statisticsController.getSuperAdminStats
);

module.exports = router;