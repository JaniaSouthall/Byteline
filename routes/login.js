const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');
const bcrypt = require('bcrypt');

// User Login
router.post('/user', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'User login successful', userId: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Login
router.post('/admin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const admin = result.rows[0];

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'Admin login successful', adminId: admin.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;