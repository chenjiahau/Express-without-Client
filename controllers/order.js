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

const addOrder = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  // Model can't reject array is empty even set required is true
  if (!req.body.products || (req.body.products && req.body.products.length === 0)) {
    return next(new AppError(500, "Order must has products"));
  }

  const newOrder = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: newOrder
  });
});

const getOrder = catchAsync(async (req, res, next) => {
  let order = null;

  try {
    order = await Order.findById(req.params.id);
  } catch (err) {
    return next(new AppError(500, `No order found with that ID: ${req.params.id}`));
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

module.exports = {
  getAllOrders,
  addOrder,
  getOrder
}