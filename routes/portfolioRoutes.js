// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

router.get('/summary', auth, portfolioController.getSummary);

module.exports = router;