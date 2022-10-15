const express = require('express');
const router = express.Router();

const { checkParamsId } = require('../utils/util');

const orderCtrl = require('../controllers/order');

router.route('/')
  .get(orderCtrl.getAllOrders)
  .post(orderCtrl.addOrder);

router.route('/:id')
  .get(checkParamsId, orderCtrl.getOrder)

module.exports = router;
