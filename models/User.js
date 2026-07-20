// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

// Define User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Instance methods (added to prototype)
User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
};

// Static methods
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
};

User.createUser = async function(userData) {
    const { name, email, password } = userData;
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const password_hash = await bcrypt.hash(password, salt);
    
    return await this.create({
        name,
        email,
        password_hash
    });
};

User.toJSON = function(user) {
    if (!user) return null;
    const { id, name, email, created_at, updated_at } = user;
    return { id, name, email, created_at, updated_at };
};

module.exports = User;