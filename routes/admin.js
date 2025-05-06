const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');


router.get('/', async (req, res) => {
    try {
        const accessories = await pool.query('SELECT serial, name, brand, price, stock FROM accessories');
        const laptops = await pool.query('SELECT serial, name, brand, price, stock FROM laptops');
        const peripherals = await pool.query('SELECT serial, name, brand, price, stock FROM peripherals');

        
        const allProducts = [
            ...accessories.rows,
            ...laptops.rows,
            ...peripherals.rows
        ];

        res.json(allProducts);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add', async (req, res) => {
    const { name, price, brand, description, stock, image, type } = req.body;

    try {
        let serial;
        let table;

        if (type === 'accessory') {
            const result = await pool.query('SELECT COUNT(*) FROM accessories');
            serial = parseInt(result.rows[0].count) + 201;
            table = 'accessories';
        } else if (type === 'peripheral') {
            const result = await pool.query('SELECT COUNT(*) FROM peripherals');
            serial = parseInt(result.rows[0].count) + 101;
            table = 'peripherals';
        } else if (type === 'laptop') {
            const result = await pool.query('SELECT COUNT(*) FROM laptops');
            serial = parseInt(result.rows[0].count) + 301;
            table = 'laptops';
        } else {
            return res.status(400).json({ error: 'Invalid product type.' });
        }

        await pool.query(
            `INSERT INTO ${table} (serial, name, brand, description, price, stock, image) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [serial, name, brand, description, price, stock, image]
        );

        res.status(201).json({ message: 'Item added successfully!' });
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;