const express = require('express');
const router = express.Router();

const reportCtrl = require('../controllers/report');

router.route('/')
  .get(reportCtrl.getReport);

module.exports = router;
