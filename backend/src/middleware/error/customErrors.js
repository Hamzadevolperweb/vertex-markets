class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details) {
    super(message, 400, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, details);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details) {
    super(message, 403, details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found', details) {
    super(message, 404, details);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict', details) {
    super(message, 409, details);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation Failed', errors = []) {
    super(message, 422, errors);
    this.errors = errors;
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
};

