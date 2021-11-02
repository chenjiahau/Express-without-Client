const express = require("express");
const router = express.Router();
const prefixpPath = '/api/db/install';

const { Int32, Decimal128 } = require("mongodb");

const db = require("../../../util/db");
const userData = require('../../../data/user');
const UserModal = require("../../../model/user");

router.get(`${prefixpPath}/users`, function (req, res, next) {
  const users = [];

  for (index in userData) {
    const languages = userData[index].languages.map(language => language.language);
    const user = {
      firstName: userData[index].firstName,
      lastName: userData[index].lastName,
      gener: userData[index].gender,
      age: Int32(userData[index].age),
      email: userData[index].email,
      location: {
        latitude: Decimal128.fromString(userData[index].latitude.toString()),
        longitude: Decimal128.fromString(userData[index].longitude.toString()),
      },
      salary: Int32(userData[index].salary),
      company: userData[index].company,
      formerCompanies: userData[index].formerCompanies,
      languages,
      ownCars: userData[index].ownCars,
      isActive: false,
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
