// controllers/portfolioController.js
const investmentService = require('../services/investmentService');

const portfolioController = {
    // Get portfolio summary
    async getSummary(req, res, next) {
        try {
            const userId = req.user.id;
            
            const summary = await investmentService.getPortfolioSummary(userId);
            
            res.status(200).json({
                success: true,
                data: summary
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = portfolioController;