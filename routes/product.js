const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');

router.route('/list')
  .get(productCtrl.getProductList);
router.route('/')
  .post(productCtrl.addProduct);
router.route('/:id?')
  .get(productCtrl.getProduct);
router.route('/:id')
  .put(productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct);

module.exports = router;
