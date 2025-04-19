const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/companies', require('./routes/company.routes'));
app.use('/api/locations', require('./routes/location.routes'));
app.use('/api/equipment', require('./routes/equipment.routes'));
app.use('/api/store', require('./routes/storePart.routes'));
app.use('/api/work-orders', require('./routes/workOrder.routes'));
app.use('/api/preventive-maintenance', require('./routes/preventiveMaintenance.routes'));
app.use('/api/requests', require('./routes/maintenanceRequest.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/subscriptions', require('./routes/subscription.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/faqs', require('./routes/faq.routes'));
app.use('/api/statistics', require('./routes/statistics.routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler middleware
app.use(errorHandler);

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;