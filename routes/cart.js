const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

// Add item to cart
router.post('/add', async (req, res) => {
    const { email, serial } = req.body;

    try {
        // Directly update the cart since it always exists
        console.log('Adding to cart:', { email, serial }); // Debugging log
        const result = await pool.query('SELECT serial FROM carts WHERE email = $1', [email]);
        console.log('Cart query result:', result.rows); // Debugging log

        const existingSerials = result.rows[0].serial;
        if (!existingSerials.includes(serial)) {
            existingSerials.push(serial);
            await pool.query('UPDATE carts SET serial = $1 WHERE email = $2', [existingSerials, email]);
        }

        res.json({ message: 'Item added to cart successfully' });
    } catch (err) {
        console.error('Error adding to cart:', err); // Debugging log
        res.status(500).json({ error: err.message });
    }
});

// Get cart items for a user
router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await pool.query('SELECT serial FROM carts WHERE email = $1', [email]);

        const serials = result.rows[0].serial;

        // Fetch product details for each serial
        const products = [];
        for (const serial of serials) {
            const productResult = await pool.query(
                `SELECT name, image, price, serial FROM laptops WHERE serial = $1
                 UNION
                 SELECT name, image, price, serial FROM peripherals WHERE serial = $1
                 UNION
                 SELECT name, image, price, serial FROM accessories WHERE serial = $1`,
                [serial]
            );
            if (productResult.rows.length > 0) {
                products.push(productResult.rows[0]);
            }
        }

        res.json(products);
    } catch (err) {
        console.error('Error fetching cart items:', err); // Debugging log
        res.status(500).json({ error: err.message });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    const { email, serial } = req.body;

    try {
        const result = await pool.query('SELECT serial FROM carts WHERE email = $1', [email]);

        const updatedSerials = result.rows[0].serial.filter(item => item !== serial);

        await pool.query('UPDATE carts SET serial = $1 WHERE email = $2', [updatedSerials, email]);

        res.json({ message: 'Item removed from cart successfully' });
    } catch (err) {
        console.error('Error removing item from cart:', err); // Debugging log
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;