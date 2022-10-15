const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    products: [
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ]
  }
);

module.exports = mongoose.model('Order', orderSchema);