const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

// GET search results
router.get('/', async (req, res) => {
  const { query } = req.query; // Get the search query from the request
  try {
    const laptops = await pool.query(
      `SELECT * FROM laptops WHERE name ILIKE $1`,
      [`%${query}%`]
    );
    const peripherals = await pool.query(
      `SELECT * FROM peripherals WHERE name ILIKE $1`,
      [`%${query}%`]
    );
    const accessories = await pool.query(
      `SELECT * FROM accessories WHERE name ILIKE $1`,
      [`%${query}%`]
    );

    // Combine results from all tables
    const results = [
      ...laptops.rows,
      ...peripherals.rows,
      ...accessories.rows,
    ];
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;