const nodemailer = require('nodemailer');
const AppError = require('./AppError');

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }
}

const checkParamsId = (req, res, next) => {
  if (!req.params.id || req.params.id === ':id') {
    res.status(404).json({
      status: 'error',
      data: 'ID is invalid'
    });

    return;
  }

  next();
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

const sendEmail = async (option) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'outlook.office365.com',
    secureConnection: false,
    port: 587,
    auth: {
      user: process.env['EMAIL'],
      pass: process.env['EMAIL_PASSWORD']
    },
    tls: {
      ciphers:'SSLv3'
  }
  });

  // 2. Define the email options
  const mailOption = {
    from: `Ivan Chen <${process.env['EMAIL']}>`,
    to: option.email,
    subject: option.subject,
    text: option.message
  };

  // 3. Send
  await transporter.sendMail(mailOption);
}

module.exports = {
  catchAsync,
  checkParamsId,
  handleDBError,
  handleJWTError,
  handleProdError,
  sendEmail
}