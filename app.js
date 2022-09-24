var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var { handleDBError, handleProdError } = require('./utils/util');
var AppError = require('./utils/AppError');
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env['NODE_ENV'] === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
