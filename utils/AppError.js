// Error from NodeJS
// A generic JavaScript <Error> object that does not denote any specific circumstance of why the error occurred.
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    console.log(statusCode, message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fali' : 'error';
    this.isOperational = true;

    // AppError merge Error 
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
