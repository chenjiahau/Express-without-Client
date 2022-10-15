const mongoose = require('mongoose');
const Product = require('./product');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Order must belong to user"]
    },
    products: Array
  }
);

orderSchema.pre('save', async function (next) {
  const productPromises = this.products.map(async (id) => await Product.findById(id).select('product price'));
  this.products = await Promise.all(productPromises);

  next();
});

orderSchema.pre(/^find/, function (next) {
  // Known question
  // 1. virtual field cannot exclude
  // 2. if document has virtual field, even select -_id, it is still there
  this
    .populate({
      path: 'user',
      select: 'name'
    })
    .select('products._id products.product products.price ');

  next();
});



module.exports = mongoose.model('Order', orderSchema);