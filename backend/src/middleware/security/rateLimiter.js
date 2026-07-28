const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: Number(process.env.RATE_LIMIT_MAX || 100),
  duration: Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 900),
});

const middleware = async (req, res, next) => {
  try {
    const ip = req.ip;
    await rateLimiter.consume(ip);
    return next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }
};

module.exports = { rateLimiter: middleware };

