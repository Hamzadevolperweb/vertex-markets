const { NotFoundError } = require('./customErrors');

const notFound = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = { notFound };

