const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
