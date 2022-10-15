const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Order must belong to user"]
    },
    products: [
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ]
  }
);

orderSchema.pre(/^find/, function (next) {
  // Known question
  // 1. virtual field cannot exclude
  // 2. if document has virtual field, even select -_id, it is still there
  this
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'products'
    });

  next();
});

module.exports = mongoose.model('Order', orderSchema);