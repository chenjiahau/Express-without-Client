const express = require('express');
const router = express.Router();

const { checkParamsId } = require('../utils/util');

const userCtrl = require('../controllers/user');
const productCtrl = require('../controllers/product');

router.route('/list')
  .get(productCtrl.getProductList);

router.route('/')
  .get(productCtrl.filterProducts)
  .post(productCtrl.addProduct)
  .delete(userCtrl.checkRole(['admin', 'editor']), productCtrl.deleteAllProduct);

router.route('/:id')
  .get(checkParamsId, productCtrl.getProduct)
  .put(checkParamsId, productCtrl.updateProduct)
  .delete(userCtrl.checkRole(['admin', 'editor']), checkParamsId, productCtrl.deleteProduct);

router.route('/:id/:price')
.put(checkParamsId, productCtrl.updateProductPrice)

module.exports = router;
