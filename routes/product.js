const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');

router.route('/list')
  .get(productCtrl.getProductList);

router.route('/')
  .post(productCtrl.addProduct)
  .delete(productCtrl.deleteAllProduct);

router.route('/:id')
  .get(productCtrl.checkId, productCtrl.getProduct)
  .put(productCtrl.checkId, productCtrl.updateProduct)
  .delete(productCtrl.checkId, productCtrl.deleteProduct);

module.exports = router;
