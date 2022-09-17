const Product = require('../models/product');

const getReport = async (req, res) => {
  try {
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
          avgPrice: { $round: [ "$avgPrice", 2]},
          avgMinPrice: { $round: [ "$avgMinPrice", 2]},
          avgMaxPrice: { $round: [ "$avgMaxPrice", 2]},
          avgDiscountTime: { $round: [ "$avgDiscountTime", 2]},
          avgIventory: { $round: [ "$avgIventory", 2]},
        }
      },
      {
        $sort: {
          avgPrice: -1
        }
      }
    ]);

    console.log(productList);
    res.json({
      status: 'success',
      data: productList
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

module.exports = {
  getReport
}