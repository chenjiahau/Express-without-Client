const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');

router.route('/')
  .post(orderCtrl.addOrder);

module.exports = router;
