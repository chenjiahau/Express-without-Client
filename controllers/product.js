const Product = require('../models/product');

const checkId = (req, res, next) => {
  if (!!req.param.id) {
    res.status(404).json({
      status: 'error',
      data: 'id is invalid'
    });

    return;
  }

  next();
}

const getProductList = async (req, res) => {
  try {
    const productList = await Product.find();

    res.json({
      status: 'success',
      data: productList
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: newProduct
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

module.exports = {
  checkId,
  getProductList,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct
}