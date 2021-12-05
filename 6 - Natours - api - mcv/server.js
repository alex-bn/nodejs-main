const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// CONNECT TO mongoDB.Atlas: @cluster0.l47pf.mongodb.net
mongoose.connect(DB).then((connection) => {
  console.log(`Connection to ${connection.connections[0].host} is successful!`);
});

// // CONNECT TO localhost: 127.0.0.1:27017
// mongoose
//   .connect(process.env.DATABASE_LOCAL)
//   .then((connection) =>
//     console.log(
//       `Connection to ${connection.connections[0].host} is successful!`
//     )
//   );

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
