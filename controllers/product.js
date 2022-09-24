const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
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

const getProductList = catchAsync(async (req, res) => {
  const productList = await Product.find();

  res.json({
    status: 'success',
    data: productList
  });
});

const filterProducts = catchAsync(async (req, res) => {
  let queryObject = { ...req.query };
  let queryStr = JSON.stringify(queryObject);

  // Condition
  // {{baseUrl}}/api/product?min_price[gte]=100&min_price[lte]=150
  // {"min_price":{"$gte":"100","$lte":"150"}}
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  queryObject = JSON.parse(queryStr);

  // Sort
  // Asc: 1, Desc: -1
  // {{baseUrl}}/api/product?min_price[gte]=100&min_price[lte]=150&sortBy=inventory,min_price&sortType=1
  let sortBy = {}
  if (req.query.sortBy) {
    const sortType = req.query.sortType ? +req.query.sortType : 1;
    const sortByAry = req.query.sortBy.split(',');

    for (const field of sortByAry) {
      sortBy[field] = sortType;
    }
  }

  // Field
  // {{baseUrl}}/api/product?min_price[gte]=100&min_price[lte]=150&field=inventory,min_price
  let fieldList = ["product", "price", "inventory", "description", "created_date", "updated_date"];
  if (req.query.field) {
    fieldList = req.query.field.split(',');
  }

  // Pagination
  // {{baseUrl}}/api/product?page=5&limit=333
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const totalDoucment = await Product.countDocuments();
  const totalPage = Math.ceil(totalDoucment / limit);
  const productList = await Product.find(queryObject, fieldList)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  res.json({
    status: 'success',
    length: productList.length,
    totalPage,
    page,
    limit,
    data: productList
  });
});

const addProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: newProduct
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError(500, `No product found with that ID: ${req.param.id}`));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const body = {
    ...req.body,
    $push: { "updated_date": Date.now() }
  };

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: product
  });
});

const updateProductPrice = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.price = req.params.price;

  await product.save({
    validateBeforeSave: true
  })

  res.status(200).json({
    status: 'success',
    data: product
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});

const deleteAllProduct = catchAsync(async (req, res) => {
  await Product.deleteMany();

  res.status(200).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  checkId,
  getProductList,
  filterProducts,
  addProduct,
  getProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
  deleteAllProduct
}