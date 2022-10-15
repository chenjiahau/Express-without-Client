const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');

router.route('/')
  .get(orderCtrl.getAllOrders)
  .post(orderCtrl.addOrder);

module.exports = router;
