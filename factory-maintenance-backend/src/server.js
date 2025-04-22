const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

// Import database models
const db = require('./models');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

// Create Express app
const app = express();

// Enable CORS with credentials support
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// Add cookie parser middleware before routes
app.use(cookieParser()); 

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

// 404 Not Found handler
app.use((req, res) => {
 res.status(404).json({ message: 'Route not found' });
});

// Start server after connecting to database
const PORT = process.env.PORT || 5000;

// Try to connect to database then start server
db.sequelize.authenticate()
 .then(() => {
   console.log('Database connection has been established successfully.');
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
   process.exit(1); // Exit application if database connection fails
 });


module.exports = app; // Export for testing purposes if needed