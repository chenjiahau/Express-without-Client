const express = require("express");
const router = express.Router();
const { Int32, Decimal128 } = require("mongodb");
const prefixpPath = "/api";

const dbInstallRoute = require('./db/install');

router.get(`${prefixpPath}/test`, function (req, res, next) {
  res.send({ message: "API alive check!" });
});

router.use(dbInstallRoute);

module.exports = router;
