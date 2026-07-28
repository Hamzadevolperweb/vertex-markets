const {
  AppError,
  ValidationError,
} = require('./customErrors');

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || (err instanceof AppError ? err.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  // Handle ValidationError with standardized format
  if (err instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      message: err.message || 'Validation Failed',
      errors: err.errors || [],
    });
  }

  // Handle other errors with details
  const details = err.details;

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = { errorHandler };

