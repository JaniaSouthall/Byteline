const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Add a new review
router.post('/', async (req, res) => {
    const { productId, userEmail, rating, comment } = req.body;

    try {
        const review = new Review({ productId, userEmail, rating, comment });
        await review.save();
        res.json({ message: 'Review added successfully!' });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ productId });
        res.json(reviews);
        console.log("Reviews fetched successfully:", reviews); // Debugging log
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;