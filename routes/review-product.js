const express = require('express');
const router = express.Router();

const reviewProductCtrl = require('../controllers/review-product');

router.route('/')
  .get(reviewProductCtrl.getAllReviews)
  .post(reviewProductCtrl.writeReview);

module.exports = router;
