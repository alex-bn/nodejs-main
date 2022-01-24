class AppError extends Error {
  constructor(message, statusCode) {
    // we set the message property to our incoming message
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    // we mark all errors that go through this class as operational errors
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
