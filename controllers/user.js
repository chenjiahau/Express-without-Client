const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { catchAsync, handleJWTError, sendEmail } = require('../utils/util');
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

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(404, 'There is no user iwth email address'));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: true });

  // Send it to user's email
  const restURL = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
  let message = '';

  message = 'Forgot your password? \n';
  message += `Submit a PATCH request with your new password and passwordConfirm to: ${restURL}. \n`;
  message += 'If you didn\'t forgot your password, please ignore this email.';

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password rest token (valid for 10 min)',
      message
    });

    res.json({
      status: 'success'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresdDate = undefined;

    await user.save({ validateBeforeSave: true });

    return next(new AppError(500, 'Cannot send the email, try again later.'));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresdDate: { $gt: Date() }
  });

  // 2. Check token has not expired, and there is user
  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }

  // 3. Set the new password, then save
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresdDate = undefined;
  await user.save();

  // 4. Get new token to user
  const token = generateToken(user);

  res.json({
    status: 'success',
    token
  });
});

const update = catchAsync(async (req, res, next) => {
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

const updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2. Verify old password
  if (!(await user.isPasswordRight(req.body.currentPassword, user.password))) {
    return next(new AppError(401, 'Your current password is wrong'));
  }

  // 3. Update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4. Get new token to user
  const token = generateToken(user);

  res.json({
    status: 'success',
    token
  });
});

module.exports = {
  authenticate,
  checkRole,
  signup,
  login,
  forgotPassword,
  resetPassword,
  update,
  updatePassword
}