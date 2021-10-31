const express = require("express");
const router = express.Router();
const path = "/api";

router.get(`${path}/test`, function (req, res, next) {
  res.send({ message: "API alive check!" });
});

module.exports = router;
