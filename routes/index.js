var express = require('express');
var router = express.Router();

const user = require("./user");
const product = require("./product");
const report = require("./report");

const userCtrl = require('../controllers/user');

const pathSign = {
  api: 'api'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Text mode' });
});

router.get('/express-test', function(req, res, next) {
  res.send({ message: 'Your express is connected to react!' });
});

router
  .use(`/${pathSign.api}/user`, user)
  .use(`/${pathSign.api}/product`, userCtrl.authenticate, product)
  .use(`/${pathSign.api}/report`, userCtrl.authenticate, report);

module.exports = router;
