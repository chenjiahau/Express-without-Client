const { faker } = require('@faker-js/faker');
const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

const dataModel = {
  id: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false
  }
};

const categories = [];
for (let product of products) {
  if (categories.indexOf(product.category) === -1) {
    categories.push(product.category);
  }
}

router.get('/product/list', function (req, res) {
  let num = 10;
  req.query.num && (num = req.query.num);

  res.send({
    data: products
  });
});

router.post('/product', function (req, res) {
  const newProduct = {};

  let isValid = true;
  for (let model in dataModel) {
    newProduct[model] = req.body[model];

    if (dataModel[model].required && !req.body[model]) {
      isValid = false
    }
  }

  if (!isValid) {
    res.status(400).send({
      message: 'Please fill full of fields.'
    });

    return;
  }

  for (let model in dataModel) {
    newProduct[model] = req.body[model];
  }

  newProduct['id'] = uuid.v4();
  if (req.body['isActive'] === undefined || typeof req.body['isActive'] !== "boolean") {
    newProduct.isActive = false;
  } else {
    newProduct.isActive = req.body['isActive'];
  }

  products.push(newProduct);
  
  res.send({
    data: newProduct
  });
});

router.get('/product/:id', function (req, res) {
  const product = products.find((p) => {
    return p.id === req.params.id;
  });

  if (!product) {
    res.status(400).send({
      message: 'id is invalid.'
    });

    return;
  }

  res.send({
    data: product
  });
});

router.put('/product/:id', function (req, res) {
  const updatedProduct = {};

  let isValid = true;
  for (let model in dataModel) {
    if (!dataModel[model].required) {
      continue;
    }

    updatedProduct[model] = req.body[model];
    if (!req.body[model]) {
      isValid = false
    }
  }

  if (!isValid) {
    res.status(400).send({
      message: 'Please fill full of fields.'
    });

    return;
  }

  for (let model in dataModel) {
    if (!dataModel[model].required) {
      continue;
    }

    updatedProduct[model] = req.body[model];
  }

  if (req.body['isActive'] === undefined || typeof req.body['isActive'] !== "boolean") {
    updatedProduct.isActive = false;
  } else {
    updatedProduct.isActive = req.body['isActive'];
  }

  const index = products.findIndex((p) => p.id === req.params.id);
  products[index] = updatedProduct;
  
  res.send({
    data: updatedProduct
  });
});

router.delete('/product/:id', function (req, res) {
  const index = products.findIndex((p) => {
    return p.id === req.params.id;
  });

  if (index < 0) {
    res.status(400).send({
      message: 'id is invalid.'
    });

    return;
  }

  products.splice(index, 1);

  res.send({
    data: products.splice(0, num)
  });
});

module.exports = router;
