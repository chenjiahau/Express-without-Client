const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');
const order = require('../models/order');

router.route('/')
  .get(orderCtrl.getAllOrders)
  .post(orderCtrl.addOrder);

module.exports = router;
