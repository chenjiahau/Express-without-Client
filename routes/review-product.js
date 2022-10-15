const express = require('express');
const router = express.Router();

const { checkParamsId } = require('../utils/util');

const reviewProductCtrl = require('../controllers/review-product');

router.route('/')
  .get(reviewProductCtrl.getAllReviews)
  .post(reviewProductCtrl.writeReview);

router.route('/:id')
  .get(checkParamsId, reviewProductCtrl.getReview)

module.exports = router;
