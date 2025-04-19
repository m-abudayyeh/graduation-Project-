const express = require('express');
const router = express.Router();
const preventiveMaintenanceController = require('../controllers/preventiveMaintenance.controller');
const { authenticateToken, authorizeRoles, checkSubscription } = require('../middlewares/auth');

// Apply middleware to all routes
router.use(authenticateToken);
router.use(checkSubscription);

// Get preventive maintenance statistics
router.get('/statistics', preventiveMaintenanceController.getStatistics);

// Get due preventive maintenance schedules
router.get('/due', preventiveMaintenanceController.getDueSchedules);

// Get all preventive maintenance schedules
router.get('/', preventiveMaintenanceController.getAllSchedules);

// Get preventive maintenance schedule by ID
router.get('/:id', preventiveMaintenanceController.getScheduleById);

// Create new preventive maintenance schedule (admin/supervisor only)
router.post(
  '/',
  authorizeRoles('admin', 'supervisor'),
  preventiveMaintenanceController.createSchedule
);

// Update preventive maintenance schedule (admin/supervisor only)
router.put(
  '/:id',
  authorizeRoles('admin', 'supervisor'),
  preventiveMaintenanceController.updateSchedule
);

// Delete preventive maintenance schedule (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  preventiveMaintenanceController.deleteSchedule
);

// Generate work order from preventive maintenance schedule
router.post(
  '/:id/generate-work-order',
  authorizeRoles('admin', 'supervisor'),
  preventiveMaintenanceController.generateWorkOrder
);

module.exports = router;