const { cmsRoutes } = require('./v1/cms.routes');
const { marketsRoutes } = require('./v1/markets.routes');
const { platformRoutes } = require('./v1/platforms.routes');
const { blogRoutes } = require('./v1/blog.routes');
const { contactRoutes } = require('./v1/contact.routes');
const { newsletterRoutes } = require('./v1/newsletter.routes');
const { careersRoutes } = require('./v1/careers.routes');
const { partnersRoutes } = require('./v1/partners.routes');
const { uploadsRoutes } = require('./v1/uploads.routes');
const { searchRoutes } = require('./v1/search.routes');
const { dashboardRoutes } = require('./v1/dashboard.routes');
const { swaggerRoutes } = require('./v1/swagger.routes');
const { usersRoutes } = require('./v1/users.routes');
const { authRoutes } = require('./v1/auth.routes');
const { marketDataRoutes } = require('../modules/marketData');
const { kycRoutes } = require('../modules/kyc');
const { tradingRoutes } = require('../modules/trading');

function registerRoutes(app) {
  // Docs
  app.use('/api/v1', swaggerRoutes());

  // Auth (canonical + legacy aliases under /api/v1/*)
  app.use('/api/v1/auth', authRoutes());
  app.use('/api/v1', authRoutes());

  // Domain modules — each on its own prefix to avoid route collisions
  app.use('/api/v1/cms', cmsRoutes());
  app.use('/api/v1/markets', marketsRoutes());
  app.use('/api/v1/market-data', marketDataRoutes());
  app.use('/api/v1/trading', tradingRoutes());
  app.use('/api/v1/kyc', kycRoutes());
  app.use('/api/v1/platforms', platformRoutes());
  app.use('/api/v1/blog', blogRoutes());
  app.use('/api/v1/careers', careersRoutes());
  app.use('/api/v1/partners', partnersRoutes());
  app.use('/api/v1/contact', contactRoutes());
  app.use('/api/v1/newsletter', newsletterRoutes());
  app.use('/api/v1/dashboard', dashboardRoutes());
  app.use('/api/v1/uploads', uploadsRoutes());
  app.use('/api/v1/users', usersRoutes());
  app.use('/api/v1', searchRoutes());
}

module.exports = { registerRoutes };
