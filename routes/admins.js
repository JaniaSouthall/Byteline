const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/dbPostgresql'); // Assuming you're using PostgreSQL

// Create Admin Account
router.post('/create', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingAdmin = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (existingAdmin.rows.length > 0) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new admin into the database
        await pool.query(
            'INSERT INTO admins (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );

        res.json({ message: 'Admin account created successfully!' });
    } catch (err) {
        console.error('Error creating admin account:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;