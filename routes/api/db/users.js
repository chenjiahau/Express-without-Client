const express = require("express");
const router = express.Router();
const prefixpPath = '/api/db/users';

const db = require("../../../util/db");

router.get(`${prefixpPath}/list`, function (req, res, next) {
  const users = [];

  db.getDb()
    .collection("users")
    .find({})
    .forEach((userDoc) => {
      users.push(userDoc);
    })
    .then(() => {
      res.send({ users });
    })
    .catch((err) => {
      res.send({ err });
    });
});

module.exports = router;
