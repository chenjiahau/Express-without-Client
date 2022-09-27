const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const Product = require('../models/product');

const getReport = catchAsync(async (req, res) => {
  const productList = await Product.aggregate([
    {
      $match: {
        rating: {
          $gte: 0
        }
      }
    },
    {
      $group: {
        _id: { $year: "$created_date" },
        avgPrice: { $avg: "$price" },
        avgMinPrice: { $avg: "$min_price" },
        avgMaxPrice: { $avg: "$max_price" },
        avgDiscountTime: { $avg: "$discount_time" },
        avgIventory: { $avg: "$inventory" }
      }
    },
    {
      $project: {
        avgPrice: { $round: ["$avgPrice", 2] },
        avgMinPrice: { $round: ["$avgMinPrice", 2] },
        avgMaxPrice: { $round: ["$avgMaxPrice", 2] },
        avgDiscountTime: { $round: ["$avgDiscountTime", 2] },
        avgIventory: { $round: ["$avgIventory", 2] },
      }
    },
    {
      $sort: {
        avgPrice: -1
      }
    }
  ]);

  res.json({
    status: 'success',
    data: productList
  });
});

module.exports = {
  getReport
}