const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const db = process.env.DATABASE;

// const run = async () => {
//   try {
//     await mongoose.connect(
//       db,
//       {
//         useNewUrlParser: true,
//         connectTimeoutMS: 1000
//       }
//     )

//     console.log("DB connection successfully");
//     runServer();
//   } catch(err) {
//       console.log("Cannot connect to DB");
//   }
// }

// const runServer = () => {
//   if (process.env['NODE_ENV'] === 'development') {
//     app.listen(process.env['PORT'], () => {
//       console.log(`App is running on port ${process.env['PORT']}`);
//     });
//   } else {
//     app.listen(80, () => {
//       console.log(`App is running`);
//     });
//   }
// }

// run();

mongoose.connect(db, { useNewUrlParser: true, connectTimeoutMS: 1000 })
  .then(() => {
    console.log("DB connection successfully");
  });

let server = null;
if (process.env['NODE_ENV'] === 'development') {
  server = app.listen(process.env['PORT'], () => {
    console.log(`App is running on port ${process.env['PORT']}`);
  });
} else {
  server = app.listen(80, () => {
    console.log(`App is running`);
  });
}

// unhandledRejection handle some wrong not inside express, like MongoDB can't connect
process.on('unhandledRejection', err => {
  console.log(err);
  server.close(() => {
    process.exit(0);
  });
})