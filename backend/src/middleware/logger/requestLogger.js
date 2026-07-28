const requestLogger = (req, res, next) => {
  // Keep Morgan as primary logger; this middleware is a hook for future central logging.
  next();
};

module.exports = { requestLogger };

