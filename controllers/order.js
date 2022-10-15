const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const Order = require('../models/order');

const addOrder = catchAsync(async (req, res) => {
  const newOrder = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: newOrder
  });
});

module.exports = {
  addOrder
}