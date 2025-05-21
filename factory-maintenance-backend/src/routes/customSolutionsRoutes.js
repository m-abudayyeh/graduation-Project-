const express = require('express');
const router = express.Router();
const customSolutionsController = require('../controllers/customSolutionsController');

// Public route for sending custom solutions messages
router.post('/custom-solutions', customSolutionsController.createMessage);

// Routes for admin dashboard (no middleware)
router.get('/admin/custom-solutions', customSolutionsController.getAllMessages);
router.get('/admin/custom-solutions/:id', customSolutionsController.getMessage);
router.delete('/admin/custom-solutions/:id', customSolutionsController.deleteMessage);
router.patch('/admin/custom-solutions/:id/toggle-read', customSolutionsController.toggleReadStatus);

module.exports = router;