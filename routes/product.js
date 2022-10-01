const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const productCtrl = require('../controllers/product');

router.route('/list')
  .get(productCtrl.getProductList);

router.route('/')
  .get(productCtrl.filterProducts)
  .post(productCtrl.addProduct)
  .delete(userCtrl.checkRole(['admin', 'editor']), productCtrl.deleteAllProduct);

router.route('/:id')
  .get(productCtrl.checkId, productCtrl.getProduct)
  .put(productCtrl.checkId, productCtrl.updateProduct)
  .delete(userCtrl.checkRole(['admin', 'editor']), productCtrl.checkId, productCtrl.deleteProduct);

router.route('/:id/:price')
.put(productCtrl.checkId, productCtrl.updateProductPrice)

module.exports = router;
