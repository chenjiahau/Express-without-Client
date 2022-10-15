const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const ReviewProduct = require('../models/review-product');

const writeReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await ReviewProduct.create(req.body);

  res.status(201).json({
    status: "success",
    data: newReview
  });
});

module.exports = {
  writeReview
}