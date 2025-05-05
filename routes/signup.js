const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

// User Signup
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Insert the new user into the users table
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, password]
        );

        // Create an empty cart for the user
        await pool.query(
            'INSERT INTO carts (email, serial) VALUES ($1, $2)',
            [email, []] // Initialize the serial column as an empty array
        );

        // Create an empty order history for the user
        await pool.query(
            'INSERT INTO orderHistories (email, orders) VALUES ($1, $2)',
            [email, []] // Initialize the orders column as an empty array
        );

        res.json({ message: 'Account created successfully' });
    } catch (err) {
        console.error('Error creating account:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;