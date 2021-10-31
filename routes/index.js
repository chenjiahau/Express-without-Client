const express = require("express");
const router = express.Router();
const api = require("./api");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { title: "Text mode" });
});

router.get("/express-test", function (req, res, next) {
  res.send({ message: "Your express is connected to react!" });
});

// API
router.use(api);

module.exports = router;
