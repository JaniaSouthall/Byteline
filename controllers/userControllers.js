const pool = require('../config/dbPostgresql');

exports.registerUser = async (req, res) => {
  const { id, username, email, password_hash } = req.body;
  const result = await pool.query(
    'INSERT INTO users (id, username, email, password_hash, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *',
    [id, username, email, password_hash]
  );
  res.status(201).json(result.rows[0]);
};
