const mongodb = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let _db = null;

const initDb = (callback) => {
  if (_db) {
    return callback(null, _db);
  }

  mongodb
    .connect(url)
    .then((client) => {
      _db = client.db();
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!db) {
    throw Error("Database not initialzed");
  }

  return _db;
};

module.exports = {
  initDb,
  getDb,
};
