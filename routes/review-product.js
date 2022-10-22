const express = require('express');
const router = express.Router({ mergeParams: true });

const { checkParamsId } = require('../utils/util');

const reviewProductCtrl = require('../controllers/review-product');

router.route('/')
  .get(reviewProductCtrl.getAllReviews)
  .post(reviewProductCtrl.writeReview);

router.route('/user')
  .get(reviewProductCtrl.getReviewByUser);

router.route('/:id')
  .get(checkParamsId, reviewProductCtrl.getReview)
  .delete(checkParamsId, reviewProductCtrl.deleteReview)

module.exports = router;
