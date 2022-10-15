const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const ReviewProduct = require('../models/review-product');

const getAllReviews = catchAsync(async (req, res) => {
  const reviewList = await ReviewProduct.find();

  res.json({
    status: 'success',
    data: reviewList
  });
});

const writeReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await ReviewProduct.create(req.body);

  res.status(201).json({
    status: "success",
    data: newReview
  });
});

const getReview = catchAsync(async (req, res, next) => {
  let review = null;

  try {
    review = await ReviewProduct.findById(req.params.id);
  } catch (err) {
    return next(new AppError(500, `No review found with that ID: ${req.params.id}`));
  }

  res.status(200).json({
    status: 'success',
    data: review
  });
});

module.exports = {
  getAllReviews,
  writeReview,
  getReview
}