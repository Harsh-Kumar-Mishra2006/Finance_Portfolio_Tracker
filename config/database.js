// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if we have Supabase URL (production)
if (process.env.SUPABASE_DATABASE_URL) {
  console.log('🔗 Connecting to Supabase Cloud...');
  
  sequelize = new Sequelize(process.env.SUPABASE_DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Supabase
      }
    },
    logging: false, // Set to console.log for debugging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
} 
// Local development
else {
  console.log('💻 Connecting to Local PostgreSQL...');
  
  sequelize = new Sequelize(
    process.env.DB_DATABASE || 'finance_tracker',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Get database info
    const [result] = await sequelize.query('SELECT current_database(), version()');
    console.log(`📊 Database: ${result[0].current_database}`);
    console.log(`🔢 PostgreSQL: ${result[0].version.split(',')[0]}`);
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.error('📝 Connection details:', {
      hasUrl: !!process.env.SUPABASE_DATABASE_URL,
      env: process.env.NODE_ENV || 'development',
      host: process.env.SUPABASE_DB_HOST || 'localhost'
    });
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};