const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true }, // ID of the product being reviewed
    userEmail: { type: String, required: true }, // Email of the user who submitted the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String, required: true }, // Review comment
    date: { type: Date, default: Date.now } // Date of the review
});

module.exports = mongoose.model('Review', reviewSchema);