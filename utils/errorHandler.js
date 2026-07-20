// utils/errorHandler.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    
    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }
    
    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }
    
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    AppError,
    ValidationError,
    UnauthorizedError,
    NotFoundError,
    errorHandler
};