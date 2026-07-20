// models/index.js
const User = require('./User');
const Investment = require('./Investment');

// Set up associations
User.hasMany(Investment, {
    foreignKey: 'user_id',
    as: 'investments',
    onDelete: 'CASCADE'
});

Investment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = {
    User,
    Investment
};