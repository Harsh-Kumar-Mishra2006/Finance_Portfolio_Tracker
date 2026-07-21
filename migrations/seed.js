// migrations/seed.js
const { sequelize } = require('../config/database');
const { User, Investment } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('🌱 Seeding database...');
        
        // Creating test user
        const password_hash = await bcrypt.hash('password123', 10);
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password_hash
        });
        
        console.log(`✅ Created test user: ${user.email}`);
        
        // Creating sample investments
        const investments = [
            {
                user_id: user.id,
                investment_name: 'HDFC Flexi Cap Fund',
                investment_type: 'Mutual Fund',
                invested_amount: 10000,
                current_value: 12500,
                purchase_date: '2026-06-01'
            },
            {
                user_id: user.id,
                investment_name: 'Tata Motors',
                investment_type: 'Stock',
                invested_amount: 5000,
                current_value: 6200,
                purchase_date: '2026-05-15'
            },
            {
                user_id: user.id,
                investment_name: 'SBI ETF',
                investment_type: 'ETF',
                invested_amount: 8000,
                current_value: 7500,
                purchase_date: '2026-04-10'
            }
        ];
        
        for (const inv of investments) {
            await Investment.create(inv);
        }
        
        console.log(`✅ Created ${investments.length} sample investments`);
        console.log('\n📝 Test credentials:');
        console.log('Email: test@example.com');
        console.log('Password: password123');
        console.log('\n🎉 Seeding complete!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seed();