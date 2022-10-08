const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.route('/signup')
  .post(userCtrl.signup);

router.route('/login')
  .post(userCtrl.login);

router.route('/forgot-password')
  .post(userCtrl.forgotPassword);

router.route('/reset-password/:token')
  .post(userCtrl.resetPassword);

router.route('/update/:id')
  .put(userCtrl.authenticate, userCtrl.update);

router.route('/update-password')
  .post(userCtrl.authenticate, userCtrl.updatePassword);

module.exports = router;
