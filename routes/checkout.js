const express = require('express');
const router = express.Router();
const pool = require('../config/dbPostgresql');

router.post('/', async (req, res) => {
    const { email, address, creditCardNum, total } = req.body;

    try {
        // Fetch the user's cart items
        const cartResult = await pool.query('SELECT serial FROM carts WHERE email = $1', [email]);
        const items = cartResult.rows[0]?.serial || [];

        if (items.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty.' });
        }

        // Generate the orderID
        const orderCountResult = await pool.query('SELECT COUNT(*) FROM orders');
        const orderID = parseInt(orderCountResult.rows[0].count) + 101;

        // Insert the order into the orders table
        const date = new Date().toISOString(); 
        await pool.query(
            'INSERT INTO orders (orderID, address, creditCardNum, items, total, date) VALUES ($1, $2, $3, $4, $5, $6)',
            [orderID, address, creditCardNum, items, total, date]
        );

        // Update the user's order history
        const orderHistoryResult = await pool.query('SELECT orders FROM orderHistories WHERE email = $1', [email]);
        const existingOrders = orderHistoryResult.rows[0]?.orders || [];
        existingOrders.push(orderID);
        await pool.query('UPDATE orderHistories SET orders = $1 WHERE email = $2', [existingOrders, email]);

        // Decrement the stock amount for each item in the cart
        for (const serial of items) {
            // Check which table the product belongs to and decrement stock
            const tables = ['accessories', 'peripherals', 'laptops'];
            let stockUpdated = false;

            for (const table of tables) {
                const result = await pool.query(
                    `UPDATE ${table} SET stock = stock - 1 WHERE serial = $1 AND stock > 0 RETURNING *`,
                    [serial]
                );

                if (result.rowCount > 0) {
                    stockUpdated = true;
                    break; // Exit the loop once the stock is updated
                }
            }

            if (!stockUpdated) {
                console.warn(`Stock not updated for serial: ${serial}. Item may not exist or is out of stock.`);
            }
        }

        // Empty the user's cart
        await pool.query('UPDATE carts SET serial = $1 WHERE email = $2', [[], email]);

        res.json({ message: 'Order placed successfully!' });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;