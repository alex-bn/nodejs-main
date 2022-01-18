const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// https://helmetjs.github.io/

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARE STACK

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // console.log(process.env.NODE_ENV);
}

// Limit requests from same API
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
// Limit the amount of data that comes into the body
app.use(express.json({ limit: '10kb' }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
