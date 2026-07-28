const corsOptions = {
  origin: process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

module.exports = { corsOptions };

