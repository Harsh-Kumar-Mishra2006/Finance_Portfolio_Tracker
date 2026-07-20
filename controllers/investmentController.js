// controllers/investmentController.js
const investmentService = require('../services/investmentService');
const { ValidationError } = require('../utils/errorHandler');

const investmentController = {
    // Get all investments
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const { limit, offset, sortBy, order } = req.query;
            
            const result = await investmentService.getAllInvestments(userId, {
                limit,
                offset,
                sortBy,
                order
            });
            
            res.status(200).json({
                success: true,
                data: result.investments,
                pagination: {
                    total: result.total,
                    limit: result.limit,
                    offset: result.offset,
                    hasMore: result.offset + result.limit < result.total
                }
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get investment by ID
    async getById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            
            const investment = await investmentService.getInvestmentById(userId, id);
            
            res.status(200).json({
                success: true,
                data: investment
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Create investment
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { investment_name, investment_type, invested_amount, current_value, purchase_date } = req.body;
            
            // Validation
            if (!investment_name || !investment_type || invested_amount === undefined || current_value === undefined || !purchase_date) {
                throw new ValidationError('All fields are required');
            }
            
            const investment = await investmentService.createInvestment(userId, {
                investment_name,
                investment_type,
                invested_amount,
                current_value,
                purchase_date
            });
            
            res.status(201).json({
                success: true,
                message: 'Investment created successfully',
                data: investment
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Update investment
    async update(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updateData = req.body;
            
            const investment = await investmentService.updateInvestment(userId, id, updateData);
            
            res.status(200).json({
                success: true,
                message: 'Investment updated successfully',
                data: investment
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Delete investment
    async delete(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            
            await investmentService.deleteInvestment(userId, id);
            
            res.status(200).json({
                success: true,
                message: 'Investment deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = investmentController;