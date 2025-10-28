const express = require('express');
const router = express.Router();

// Import controller functions
const { getAnalysis, startAssessment, submitFeedback } = require('../controllers/apiController');

// Import auth routes
const authRoutes = require('./auth');

// Use auth routes
router.use('/auth', authRoutes);

// Define routes
router.post('/start', startAssessment);
router.post('/analysis', getAnalysis);
router.post('/feedback', submitFeedback);

module.exports = router;