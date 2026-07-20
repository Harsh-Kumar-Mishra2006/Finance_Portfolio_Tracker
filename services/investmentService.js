// services/investmentService.js
const { Investment } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errorHandler');

const investmentService = {
    // Get all investments with pagination
    async getAllInvestments(userId, options = {}) {
        const { limit = 10, offset = 0, sortBy = 'created_at', order = 'DESC' } = options;
        
        const { count, rows } = await Investment.findAllByUser(userId, {
            limit,
            offset,
            sortBy,
            order
        });
        
        return {
            investments: rows.map(inv => Investment.toJSON(inv)),
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    },
    
    // Get investment by ID
    async getInvestmentById(userId, investmentId) {
        const investment = await Investment.findByUserAndId(userId, investmentId);
        if (!investment) {
            throw new NotFoundError('Investment not found');
        }
        return Investment.toJSON(investment);
    },
    
    // Create investment
    async createInvestment(userId, investmentData) {
        const { investment_name, investment_type, invested_amount, current_value, purchase_date } = investmentData;
        
        // Validate
        if (!investment_name || !investment_type || invested_amount === undefined || current_value === undefined || !purchase_date) {
            throw new ValidationError('Missing required fields');
        }
        
        const investment = await Investment.createInvestment(userId, {
            investment_name,
            investment_type,
            invested_amount,
            current_value,
            purchase_date
        });
        
        return Investment.toJSON(investment);
    },
    
    // Update investment
    async updateInvestment(userId, investmentId, updateData) {
        const investment = await Investment.updateInvestment(userId, investmentId, updateData);
        if (!investment) {
            throw new NotFoundError('Investment not found');
        }
        return Investment.toJSON(investment);
    },
    
    // Delete investment
    async deleteInvestment(userId, investmentId) {
        const investment = await Investment.deleteInvestment(userId, investmentId);
        if (!investment) {
            throw new NotFoundError('Investment not found');
        }
        return { id: investmentId, deleted: true };
    },
    
    // Get portfolio summary
    async getPortfolioSummary(userId) {
        return await Investment.getPortfolioSummary(userId);
    }
};

module.exports = investmentService;