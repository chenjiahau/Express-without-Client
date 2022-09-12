const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const db = process.env.DATABASE;

const run = async () => {
  try {
    const connection = await mongoose.connect(
      db,
      {
        useNewUrlParser: true,
        connectTimeoutMS: 1000
      }
    )
  
    console.log("DB connection successfully");
    runServer();
  } catch(err) {
      console.log("Cannot connect to DB");
  }
}

const runServer = () => {
  if (process.env['NODE_ENV'] === 'development') {
    app.listen(process.env['PORT'], () => {
      console.log(`App is running on port ${process.env['PORT']}`);
    });
  } else {
    app.listen(80, () => {
      console.log(`App is running`);
    });
  }
}

run();