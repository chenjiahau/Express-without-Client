const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const user = require("./user");
const product = require("./product");
const report = require("./report");

const userCtrl = require('../controllers/user');

const pathSign = {
  api: 'api'
}

// Limit an hour can request 100 times
const rateLimitOption = rateLimit({
  max: process.env['RATE_LIMIT'] || 100,
  windowMs: process.env['RATE_LIMIT_TIME'] || 60 * 60 * 100,
  message: "Too many requests from this IP, please try again in an hour"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Text mode' });
});

router.get('/express-test', function(req, res, next) {
  res.send({ message: 'Your express is connected to react!' });
});

router
  .use(`/${pathSign.api}/user`, user)
  .use(`/${pathSign.api}/product`, rateLimitOption, userCtrl.authenticate, product)
  .use(`/${pathSign.api}/report`, userCtrl.authenticate, report);

module.exports = router;
