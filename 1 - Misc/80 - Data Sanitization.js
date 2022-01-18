const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
https://www.npmjs.com/package/express-mongo-sanitize
https://www.npmjs.com/package/xss-clean

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

// Data sanitization against NoSQL query injection
/*
Protects against the following type of attack:

POST -> {{URL}}api/v1/users/login
{
    "email" : {"$gt": ""},
    "password": "pass1234" => the attack assumes a common passwd phrase that is used in the database
}

,which will login the user and return a token.
 */
app.use(mongoSanitize()); // problem fixed!

// Data sanitization against cross-sites scripting attacks
app.use(xss()); // will clean any user input from malicious html code (with javascript attached to it)
/*
Example:
POST -> {{URL}}api/v1/users/signup
{
    "email": "tester1@alex.com",
    "password": "pass1234",
    "passwordConfirm": "pass1234",
    "name": "<div id='bad-code'>name</div>" <- this bad code will automatically be converted into an unusable entity
}
*/

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
