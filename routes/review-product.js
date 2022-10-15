const express = require('express');
const router = express.Router();

const reviewProductCtrl = require('../controllers/review-product');
const userCtrl = require('../controllers/user');

router.route('/')
  .post(userCtrl.authenticate, reviewProductCtrl.writeReview);

module.exports = router;
