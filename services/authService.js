// services/authService.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('../utils/errorHandler');

const authService = {
    // Register user
    async register(userData) {
        const { name, email, password } = userData;
        
        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('User already exists with this email');
        }
        
        // Create user
        const user = await User.createUser({ name, email, password });
        const userJSON = User.toJSON(user);
        
        // Generate token
        const token = this.generateToken(userJSON);
        
        return { user: userJSON, token };
    },
    
    // Login user
    async login(email, password) {
        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ValidationError('Invalid email or password');
        }
        
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new ValidationError('Invalid email or password');
        }
        
        const userJSON = User.toJSON(user);
        const token = this.generateToken(userJSON);
        
        return { user: userJSON, token };
    },
    
    // Generate JWT
    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    },
    
    // Verify token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};

module.exports = authService;