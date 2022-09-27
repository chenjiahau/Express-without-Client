// Error from NodeJS
// A generic JavaScript <Error> object that does not denote any specific circumstance of why the error occurred.
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // AppError merge Error 
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
