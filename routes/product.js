const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const productModel = require('../model/product');
const productList = require('../data/product.json');

const categories = [];
for (let product of productList) {
  if (categories.indexOf(product.category) === -1) {
    categories.push(product.category);
  }
}

const getProductList = (req, res) => {
  res.json({
    status: "success",
    data: productList
  });
}

const addProduct = (req, res) => {
  const newProduct = {};

  let isValid = true;
  for (let property in productModel) {
    newProduct[property] = req.body[property];

    if (productModel[property].required && !req.body[property]) {
      isValid = false
    }
  }

  if (!isValid) {
    res.status(400).json({
      status: "error",
      message: 'Please fill full of fields.'
    });

    return;
  }

  for (let property in productModel) {
    newProduct[property] = req.body[property];
  }

  newProduct['id'] = uuid.v4();
  if (req.body['isActive'] === undefined || typeof req.body['isActive'] !== "boolean") {
    newProduct.isActive = false;
  } else {
    newProduct.isActive = req.body['isActive'];
  }

  productList.push(newProduct);
  
  res.status(201).json({
    status: "success",
    data: newProduct
  });
}

const getProduct = (req, res) => {
  if (!(req.params.id)) {
    res.json({
      data: productList
    });

    return;
  }

  const product = productList.find((p) => {
    return p.id === req.params.id;
  });

  if (!product) {
    res.status(400).json({
      status: "error",
      message: 'id is invalid.'
    });

    return;
  }

  res.status(200).json({
    status: "success",
    data: product
  });
}

const updateProduct = (req, res) => {
  const updatedProduct = {};

  let isValid = true;
  for (let property in productModel) {
    if (!productModel[property].required) {
      continue;
    }

    updatedProduct[property] = req.body[property];
    if (!req.body[property]) {
      isValid = false
    }
  }

  if (!isValid) {
    res.status(400).json({
      status: "error",
      message: 'Please fill full of fields.'
    });

    return;
  }

  for (let property in productModel) {
    if (!productModel[property].required) {
      continue;
    }

    updatedProduct[property] = req.body[property];
  }

  if (req.body['isActive'] === undefined || typeof req.body['isActive'] !== "boolean") {
    updatedProduct.isActive = false;
  } else {
    updatedProduct.isActive = req.body['isActive'];
  }

  const index = productList.findIndex((p) => p.id === req.params.id);
  productList[index] = updatedProduct;
  
  res.json({
    status: "success",
    data: updatedProduct
  });
}

const deleteProduct = (req, res) => {
  const index = productList.findIndex((p) => {
    return p.id === req.params.id;
  });

  if (index < 0) {
    res.status(400).json({
      status: "error",
      message: 'id is invalid.'
    });

    return;
  }

  productList.splice(index, 1);

  res.json({
    status: "success",
    data: productList
  });
}

router.get('/product/list', getProductList);
router.post('/product', addProduct);
router.get('/product/:id?', getProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

module.exports = router;
