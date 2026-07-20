// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const investmentRoutes = require('./investmentRoutes');
const portfolioRoutes = require('./portfolioRoutes');

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/investments', investmentRoutes);
router.use('/portfolio', portfolioRoutes);

module.exports = router;