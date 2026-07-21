// migrations/migrate.js
const { sequelize } = require('../config/database');
const { User, Investment } = require('../models');

async function migrate() {
    try {
        console.log('🔄 Running migrations...');
        
        await sequelize.sync({ force: true });
        
        console.log('✅ All tables created successfully!');
        console.log('📊 Tables: users, investments');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();