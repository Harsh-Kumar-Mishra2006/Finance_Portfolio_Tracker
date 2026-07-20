// controllers/authController.js
const authService = require('../services/authService');
const { ValidationError } = require('../utils/errorHandler');

const authController = {
    // Register
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            
            // Validation
            if (!name || !email || !password) {
                throw new ValidationError('Name, email and password are required');
            }
            
            const result = await authService.register({ name, email, password });
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                throw new ValidationError('Email and password are required');
            }
            
            const result = await authService.login(email, password);
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get current user
    async getCurrentUser(req, res, next) {
        try {
            const user = req.user;
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;