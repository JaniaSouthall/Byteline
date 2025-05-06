const { Pool } = require('pg');
 
 const pool = new Pool({
   user: 'postgres',            
   host: 'localhost',
   database: 'Byteline',       
   password: 'Byteline123',
   port: 5432
 });
 
 pool.on('connect', () => {
   console.log('Connected to PostgreSQL');
 });

 pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected:', res.rows);
  }
});
 
 module.exports = pool;