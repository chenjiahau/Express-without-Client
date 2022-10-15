const mongoose = require('mongoose');

const ReviewProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Review must belong to user"]
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, "Review must belong to product"]
    },
    message: {
      type: String,
      required: [true, "Review must have message"]
    }
  }
);

// If model name is a combined word, add _
module.exports = mongoose.model('Review_Product', ReviewProductSchema);