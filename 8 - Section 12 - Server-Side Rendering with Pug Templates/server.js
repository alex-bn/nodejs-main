const mongoose = require('mongoose');
const dotenv = require('dotenv');

// synchronous code
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔔 Shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// // CONNECT TO mongoDB.Atlas: @cluster0.l47pf.mongodb.net
// // eslint-disable-next-line no-unused-vars
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
// mongoose.connect(DB).then((connection) => {
//   console.log(`Connection to ${connection.connections[0].host} is successful!`);
// });

// CONNECT TO localhost: 127.0.0.1:27017
const retryConnect = () => {
  mongoose
    .connect(process.env.DATABASE_LOCAL)
    .then((connection) =>
      console.log(
        `Connection to your local mongodb(${connection.connections[0].host}) is successful.`
      )
    )
    .catch((error) => {
      console.log(error);
      setTimeout(retryConnect, 5000);
    });
};
// can I do better than this method?
retryConnect();

// console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// asynchronous code
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔔 Shutting down ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
