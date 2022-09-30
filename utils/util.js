var AppError = require('./AppError');

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }
}

const handleDBError = (err, res) => {
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(500, message);
  }

  if (err.code === 11000) {
    const message = `Duplicated value`;
    return new AppError(500, message);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data, ${errors.join('. ')}`;

    return new AppError(500, message);
  }

  return err;
}

const handleJWTError = (err, res) => {
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return new AppError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token is expired';
    return new AppError(401, message);
  }

  return err;
}

const handleProdError = (err, res) => {
  // if err come from Error isOperational is undefined
  // if err come from AppError isOperational is true
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
}

module.exports = {
  catchAsync,
  handleDBError,
  handleJWTError,
  handleProdError,
}