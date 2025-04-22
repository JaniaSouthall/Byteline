const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            // ← your PostgreSQL username
  host: 'localhost',
  database: 'ecommerce',       // ← make sure this database exists
  password: 'Miracle3',// ← replace with your actual password
  port: 5432
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = pool;
