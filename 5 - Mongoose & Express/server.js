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

// Building a basic schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Building a basic model
const Tour = mongoose.model('Tour', tourSchema);

// Create a testing variable
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log('ERROR🤷‍♀️', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
