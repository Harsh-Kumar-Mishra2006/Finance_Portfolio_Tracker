// models/Investment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define Investment model
const Investment = sequelize.define('Investment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'user_id'
    },
    investment_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
        },
        field: 'investment_name'
    },
    investment_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['Mutual Fund', 'Stock', 'Bond', 'ETF', 'Fixed Deposit', 'Real Estate', 'Other']]
        },
        field: 'investment_type'
    },
    invested_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        },
        field: 'invested_amount'
    },
    current_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        },
        field: 'current_value'
    },
    purchase_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isBefore: new Date().toISOString().split('T')[0]
        },
        field: 'purchase_date'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'investments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Static methods
Investment.findAllByUser = async function(userId, options = {}) {
    const { limit = 10, offset = 0, sortBy = 'created_at', order = 'DESC' } = options;
    
    return await this.findAndCountAll({
        where: { user_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, order]]
    });
};

Investment.findByUserAndId = async function(userId, investmentId) {
    return await this.findOne({
        where: {
            id: investmentId,
            user_id: userId
        }
    });
};

Investment.createInvestment = async function(userId, investmentData) {
    const { investment_name, investment_type, invested_amount, current_value, purchase_date } = investmentData;
    
    return await this.create({
        user_id: userId,
        investment_name,
        investment_type,
        invested_amount,
        current_value,
        purchase_date
    });
};

Investment.updateInvestment = async function(userId, investmentId, updateData) {
    const investment = await this.findByUserAndId(userId, investmentId);
    if (!investment) return null;
    
    await investment.update(updateData);
    return investment;
};

Investment.deleteInvestment = async function(userId, investmentId) {
    const investment = await this.findByUserAndId(userId, investmentId);
    if (!investment) return null;
    
    await investment.destroy();
    return investment;
};

Investment.getPortfolioSummary = async function(userId) {
    const investments = await this.findAll({
        where: { user_id: userId },
        attributes: ['invested_amount', 'current_value']
    });
    
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount), 0);
    const currentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value), 0);
    const profit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    
    return {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2))
    };
};

Investment.toJSON = function(investment) {
    if (!investment) return null;
    const { 
        id, investment_name, investment_type, invested_amount, 
        current_value, purchase_date, created_at, updated_at 
    } = investment;
    
    return {
        id,
        investmentName: investment_name,
        investmentType: investment_type,
        investedAmount: parseFloat(invested_amount),
        currentValue: parseFloat(current_value),
        purchaseDate: purchase_date,
        createdAt: created_at,
        updatedAt: updated_at
    };
};

// Define associations
Investment.associate = function(models) {
    Investment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = Investment;