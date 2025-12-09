require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const assessmentRoutes = require('./src/routes/assessmentRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const iotRoutes = require('./src/routes/iotRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const rechargeRoutes = require('./src/routes/rechargeRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); // HTTP request logger

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'VARUN API - Intelligent Rainwater Harvesting & Recharge Planner',
    version: '1.0.0',
    status: 'running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/recharge', rechargeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

module.exports = app;
