// middleware/validation.js
const Joi = require('joi');
const { ValidationError } = require('../utils/errorHandler');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            throw new ValidationError(errors.join(', '));
        }
        
        next();
    };
};

// Validation schemas
const schemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    
    createInvestment: Joi.object({
        investment_name: Joi.string().max(255).required(),
        investment_type: Joi.string().valid('Mutual Fund', 'Stock', 'Bond', 'ETF', 'Fixed Deposit', 'Real Estate', 'Other').required(),
        invested_amount: Joi.number().positive().required(),
        current_value: Joi.number().positive().required(),
        purchase_date: Joi.date().max('now').required()
    }),
    
    updateInvestment: Joi.object({
        investment_name: Joi.string().max(255),
        investment_type: Joi.string().valid('Mutual Fund', 'Stock', 'Bond', 'ETF', 'Fixed Deposit', 'Real Estate', 'Other'),
        invested_amount: Joi.number().positive(),
        current_value: Joi.number().positive(),
        purchase_date: Joi.date().max('now')
    }).min(1)
};

module.exports = {
    validate,
    schemas
};