const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes/index');
const { handleDBError, handleProdError } = require('./utils/util');
const AppError = require('./utils/AppError');
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// It must put first position in middleware
app.use(helmet());

if (process.env['NODE_ENV'] === 'development') {
  app.use(logger('dev'));
}

// It isn't related with helmet
app.use(bodyParser.json({ limit: '10kb' })); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// To remove data using these defaults:
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Catch 404
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

// Report error
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // production error handler
    handleProdError(handleDBError(err), res);
  }
});

module.exports = app;
