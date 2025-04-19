const cron = require('node-cron');
const subscriptionController = require('../controllers/subscription.controller');
const preventiveMaintenanceController = require('../controllers/preventiveMaintenance.controller');
const { PreventiveMaintenance, User, Company } = require('../models');
const notificationController = require('../controllers/notification.controller');
const { Op } = require('sequelize');
const emailService = require('./emailService');

/**
 * Initialize all cron jobs
 */
exports.initCronJobs = () => {
  console.log('Initializing cron jobs...');
  
  // Check subscription status daily at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    console.log('Running subscription check cron job...');
    try {
      await subscriptionController.checkSubscriptionStatus();
    } catch (error) {
      console.error('Error in subscription check cron job:', error);
    }
  });
  
  // Check for due preventive maintenance tasks every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running preventive maintenance check cron job...');
    try {
      await checkDuePreventiveMaintenance();
    } catch (error) {
      console.error('Error in preventive maintenance check cron job:', error);
    }
  });
  
  console.log('Cron jobs initialized successfully');
};

/**
 * Check for due preventive maintenance tasks and send notifications
 */
const checkDuePreventiveMaintenance = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find PM tasks due today or tomorrow
    const dueTasks = await PreventiveMaintenance.findAll({
      where: {
        status: 'active',
        nextDueDate: {
          [Op.between]: [today, tomorrow]
        }
      },
      include: [
        { model: Company, as: 'company' }
      ]
    });
    
    console.log(`Found ${dueTasks.length} preventive maintenance tasks due soon`);
    
    // Process each due task
    for (const task of dueTasks) {
      // Find admin and supervisor users for the company
      const users = await User.findAll({
        where: {
          companyId: task.companyId,
          role: { [Op.in]: ['admin', 'supervisor'] }
        }
      });
      
      // Send notifications to users
      for (const user of users) {
        // Create in-app notification
        await notificationController.createNotification({
          type: 'pm_reminder',
          title: 'Preventive Maintenance Due',
          message: `Preventive maintenance task "${task.title}" is due on ${task.nextDueDate.toLocaleDateString()}.`,
          userId: user.id,
          companyId: task.companyId,
          relatedId: task.id,
          relatedType: 'PreventiveMaintenance',
          targetUrl: `/dashboard/preventive-maintenance/${task.id}`
        });
        
        // Send email notification (optional, can be implemented if needed)
      }
    }
  } catch (error) {
    console.error('Error checking due preventive maintenance tasks:', error);
    throw error;
  }
};