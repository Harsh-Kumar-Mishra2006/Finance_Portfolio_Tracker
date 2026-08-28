// test-supabase-connection.js
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('📡 URL:', process.env.SUPABASE_DATABASE_URL ? '✅ Set' : '❌ Not set');
  
  const url = new URL(process.env.SUPABASE_DATABASE_URL);
  console.log('🏠 Host:', url.hostname);
  console.log('🔢 Port:', url.port || 5432);
  
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    connectionTimeoutMillis: 10000
  });
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('⏰ Server time:', result.rows[0].now);
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('📝 Error code:', error.code);
    console.error('📝 Error details:', error.detail);
    return false;
  }
}

testConnection();