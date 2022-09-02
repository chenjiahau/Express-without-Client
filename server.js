const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

if (process.env['NODE_ENV'] === 'development') {
  app.listen(process.env['PORT'], () => {
    console.log(`App is running on port ${process.env['PORT']}`);
  });
} else {
  app.listen(80, () => {
    console.log(`App is running`);
  });
}
