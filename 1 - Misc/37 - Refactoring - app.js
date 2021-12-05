const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWAREs

//
app.use(express.json());
//
app.use(morgan('dev'));
//
app.use((req, res, next) => {
  console.log('Hello from the middleware function 👍');
  next();
});
//
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Mount routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
