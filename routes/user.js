const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.route('/signup')
  .post(userCtrl.signup);

router.route('/login')
  .post(userCtrl.login);

router.route('/update/:id')
  .put(userCtrl.authenticate, userCtrl.update);

module.exports = router;
