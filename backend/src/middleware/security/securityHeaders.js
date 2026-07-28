// Additional security headers beyond helmet defaults
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
};

module.exports = { securityHeaders };

