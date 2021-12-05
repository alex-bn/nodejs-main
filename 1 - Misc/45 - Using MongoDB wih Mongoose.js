const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// CONNECT TO => @cluster0.l47pf.mongodb.net
mongoose
  .connect(DB, {
    // Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(connection => {
    console.log(connection.connections);
    console.log(
      `Connection to ${connection.connections[0].host} is successful!`
    );
  });

// CONNECT TO => localhost:27017
mongoose.connect(process.env.DATABASE_LOCAL).then(connection => {
  console.log(connection.connections);
  console.log(`Connection to ${connection.connections[0].host} is successful!`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
