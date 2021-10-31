const express = require("express");
const router = express.Router();
const { Decimal128 } = require("mongodb");
const path = "/api";

const db = require("../../util/db");
const UserModal = require("../../model/user");
const userData = require("../../data/user");

router.get(`${path}/test`, function (req, res, next) {
  res.send({ message: "API alive check!" });
});

router.get(`${path}/db/install/users`, function (req, res, next) {
  const users = [];

  for (index in userData) {
    const user = {
      firstName: userData[index].firstName,
      lastName: userData[index].lastName,
      gener: userData[index].gender,
      age: userData[index].age,
      email: userData[index].email,
      location: {
        latitude: Decimal128.fromString(userData[index].latitude.toString()),
        longitude: Decimal128.fromString(userData[index].longitude.toString()),
      },
      money: Decimal128.fromString(userData[index].money.toString()),
      company: userData[index].company,
      isActive: userData[index].isActive,
    };

    users.push(user);
  }

  db.getDb()
    .collection("users")
    .deleteMany({})
    .then(() => {
      db.getDb()
        .collection("users")
        .insertMany(users)
        .then((result) => {
          res.send({ result });
        })
        .catch((err) => {
          res.send({ err });
        });
    })
    .catch((err) => {
      res.send({ err });
    });
});

module.exports = router;
