const { catchAsync } = require('../utils/util');
const AppError = require('../utils/AppError');
const User = require('../models/user');

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.json({
    status: 'success',
    data: newUser
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError(400, 'Please full your email and passowrd'));
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    next(new AppError(400, 'Email or passowrd is invalid'));
    return;
  }

  res.json({
    status: 'success',
    data: user
  });
});

const update = catchAsync(async (req, res, next) => {
  const body = {
    ...req.body
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    body,
    {
      new: true,
      runValidators: true
    }
  );

  await user.save({
    validateBeforeSave: true
  })

  res.json({
    status: 'success',
    data: user
  });
});

module.exports = {
  signup,
  login,
  update
}