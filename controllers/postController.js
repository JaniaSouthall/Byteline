const pool = require('../config/dbPostgresql');

exports.createPost = async (req, res) => {
  const { id, user_id, title, body, comments } = req.body;
  const result = await pool.query(
    `INSERT INTO posts (id, user_id, title, body, created_at, updated_at, comments)
     VALUES ($1, $2, $3, $4, NOW(), NOW(), $5) RETURNING *`,
    [id, user_id, title, body, comments]
  );
  res.status(201).json(result.rows[0]);
};
