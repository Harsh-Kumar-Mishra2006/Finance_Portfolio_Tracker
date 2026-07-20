// middleware/auth.js
const authService = require('../services/authService');
const { UnauthorizedError } = require('../utils/errorHandler');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = authService.verifyToken(token);
        if (!decoded) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        
        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = auth;