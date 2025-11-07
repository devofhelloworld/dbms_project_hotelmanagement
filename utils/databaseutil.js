// database.js
const mysql = require('mysql2');
require('dotenv').config();

// Detect if running on Railway (production)
const isProduction = process.env.RAILWAY_ENVIRONMENT === 'production';

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'sujay@123',
  database: process.env.MYSQLDATABASE || 'royalstay',
  port: process.env.MYSQLPORT || 3306,
  ssl: isProduction ? { rejectUnauthorized: true } : false // Enable SSL only on Railway
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
    conn.release();
  }
});

module.exports = pool.promise();
