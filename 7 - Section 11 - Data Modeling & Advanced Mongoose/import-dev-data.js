const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const Review = require('./models/reviewModel');
const User = require('./models/userModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose.connect(DB).then((connection) => {
//   console.log(`Connection to ${connection.connections[0].host} is successful!`);
// });

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then((connection) => {
    console.log(
      `Connection to your local mongodb(${connection.connections[0].host}) is successful.`
    );
  })
  .catch((error) => console.error(error));

// READ JSON FILE AND SAVE IT INTO A VARIABLE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// INTERACTING WIH THE COMMAND LINE
console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node .\import-dev-data.js --import
// node .\import-dev-data.js --delete
