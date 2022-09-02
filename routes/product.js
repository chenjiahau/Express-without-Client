const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');

router.route('/list')
  .get(productCtrl.getProductList);
router.route('/')
  .post(productCtrl.addProduct);
router.route('/:id')
  .get(productCtrl.checkId, productCtrl.checkProduct, productCtrl.getProduct)
  .put(productCtrl.checkId, productCtrl.checkProduct, productCtrl.updateProduct)
  .delete(productCtrl.checkId, productCtrl.checkProduct, productCtrl.deleteProduct);

module.exports = router;
