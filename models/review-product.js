const mongoose = require('mongoose');

const Product = require('./product');

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
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    message: {
      type: String,
      required: [true, "Review must have message"]
    }
  }
);

ReviewProductSchema.statics.calcAverageRatings = async function (productId) {
  const statistic = await this.aggregate([
    {
      $match: {
        product: productId
      },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (statistic.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: statistic[0].avgRating
    });
  }
  
}

ReviewProductSchema.pre(/^find/, function (next) {
  this
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'product'
    });

  next();
});

// When a review, update rating of product
ReviewProductSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

// Find this review, pass to next stage
// Can't use findByIdAnd, it's not work, but findOneAnd can reach findByIdAndUpdate or findByIdAndDelete
ReviewProductSchema.pre(/^findOneAnd/, async function (next) {
  this.temporaryProduct = await this.model.findOne();
  console.log(this.temporaryProduct);
  next()
});

// When delete a review, update rating of product
ReviewProductSchema.post(/^findOneAnd/, async function () {
  if (this.temporaryProduct) {
    await this.temporaryProduct.constructor.calcAverageRatings(this.temporaryProduct.product._id);
  }
});

// If model name is a combined word, add _
module.exports = mongoose.model('Review_Product', ReviewProductSchema);