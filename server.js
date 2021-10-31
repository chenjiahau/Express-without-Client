const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const db = require("./util/db");

db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    server.listen(process.env.PORT || 8000);
  }
});
