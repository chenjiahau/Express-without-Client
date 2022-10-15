const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');
const userCtrl = require('../controllers/user');

router.route('/')
  .get(userCtrl.authenticate, orderCtrl.getAllOrders)
  .post(userCtrl.authenticate, orderCtrl.addOrder);

module.exports = router;
