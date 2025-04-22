const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
