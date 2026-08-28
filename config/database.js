// config/database.js
const { Sequelize } = require('sequelize');
const dns = require('dns');
require('dotenv').config();

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

let sequelize;

if (process.env.SUPABASE_DATABASE_URL) {
  console.log('🔗 Connecting to Supabase Cloud...');
  
  const url = new URL(process.env.SUPABASE_DATABASE_URL);
  
  sequelize = new Sequelize(process.env.SUPABASE_DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      // Force IPv4
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      connectTimeout: 30000
    },
    // Explicit connection settings
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    // Retry on failure
    retry: {
      max: 3,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /ETIMEDOUT/,
        /ENETUNREACH/
      ]
    }
  });
} else {
  // Local development
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

const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      
      // Get database info
      const [result] = await sequelize.query('SELECT version()');
      console.log('📊 PostgreSQL version:', result[0].version.split(',')[0]);
      
      return true;
    } catch (error) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${(i + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000));
      }
    }
  }
  return false;
};

module.exports = {
  sequelize,
  testConnection
};