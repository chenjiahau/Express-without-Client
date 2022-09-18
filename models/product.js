const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "product is required"],
      unique: true
    },
    price: {
      type: Number,
      required: false,
      default: 0
    },
    min_price: {
      type: Number,
      required: false,
      default: 0
    },
    max_price: {
      type: Number,
      required: false,
      default: 0
    },
    discount_time: {
      type: Number,
      required: false,
      default: 0
    },
    rating: {
      type: Number,
      required: false,
      default: 0
    },
    inventory: {
      type: Number,
      required: false,
      default: 0
    },
    is_active: {
      type: Boolean,
      required: false,
      default: false
    },
    description: {
      type: String,
      required: [ true, "Description is required"]
    },
    created_date: {
      type: Date,
      required: false,
      default: Date.now()
    },
    updated_date: {
      type: [Date],
      required: false
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

productSchema.virtual('mid_price')
  .get(function () {
    return Math.floor((this.max_price + this.min_price) / 2);
  });

module.exports = mongoose.model('Product', productSchema);