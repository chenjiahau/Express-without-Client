const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const reviewProductRouter = require('../routes/review-product');

router.route('/signup')
  .post(userCtrl.signup);

router.route('/login')
  .post(userCtrl.login);

router.route('/forgot-password')
  .post(userCtrl.forgotPassword);

router.route('/reset-password/:token')
  .post(userCtrl.resetPassword);

router.route('/update-profile/:id')
  .put(userCtrl.authenticate, userCtrl.updateProfile);

router.route('/update-password')
  .post(userCtrl.authenticate, userCtrl.updatePassword);

router.route('/delete-self')
  .delete(userCtrl.authenticate, userCtrl.deleteSelf);

router.use('/reviews', userCtrl.authenticate, reviewProductRouter);

module.exports = router;
