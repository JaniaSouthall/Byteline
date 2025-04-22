const pool = require('../config/dbPostgresql');

exports.createComment = async (req, res) => {
  const { id, post_id, user_id, comment_body } = req.body;
  const result = await pool.query(
    `INSERT INTO comments (id, post_id, user_id, comment_body, created_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [id, post_id, user_id, comment_body]
  );
  res.status(201).json(result.rows[0]);
};
