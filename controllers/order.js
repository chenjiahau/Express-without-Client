const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const Order = require('../models/order');

const getAllOrders = catchAsync(async (req, res) => {
  const orderList = await Order.find();

  res.json({
    status: 'success',
    data: orderList
  });
});

const addOrder = catchAsync(async (req, res) => {
  const newOrder = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: newOrder
  });
});

module.exports = {
  getAllOrders,
  addOrder
}