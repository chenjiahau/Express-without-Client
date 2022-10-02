const jwt = require('jsonwebtoken');

const { catchAsync, handleJWTError } = require('../utils/util');
const AppError = require('../utils/AppError');
const User = require('../models/user');

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

const authenticate = catchAsync(async (req, res, next) => {
  let token = null;

  // 1. Check token exist
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'You are not logged in! Please log in to get access'));
  }

  // 2. Check token, valid and not expired
  let decoded = null;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(handleJWTError(err));
  }

  // 3. Check if user still exists, user might be deleted after the token was issued)
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError(401, 'The user belonging to this token does no longer exist'));
  }

  // 4. Check if user changed password after the token was issued
  if (user.isPasswordChangedAfterLogin(decoded.iat)) {
    return next(new AppError(401, 'User recently changed password! Please log in again'));
  }

  req.user = user;

  next();
});

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }

    next();
  }
}

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = generateToken(newUser);

  res.json({
    status: 'success',
    data: newUser,
    token
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError(400, 'Please full your email and passowrd'));
    return;
  }

  const user = await User.findOne({ email }).select('+password');
  const isPasswordRight = await user.isPasswordRight(password, user.password);

  if (!user || !isPasswordRight) {
    next(new AppError(400, 'Email or passowrd is invalid'));
    return;
  }

  const token = generateToken(user);

  res.json({
    status: 'success',
    data: user,
    token
  });
});

const update = catchAsync(async (req, res, next) => {
  const body = {
    ...req.body
  };

  const user = await User.findById(req.params.id);
  Object.assign(user, req.body)

  await user.save({
    validateBeforeSave: true
  })

  res.json({
    status: 'success',
    data: user
  });
});

module.exports = {
  authenticate,
  checkRole,
  signup,
  login,
  update
}