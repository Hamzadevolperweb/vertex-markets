const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { connectMongo } = require('./config/mongo');
const { errorHandler } = require('./middleware/error/errorHandler');
const { notFound } = require('./middleware/error/notFound');
const { requestLogger } = require('./middleware/logger/requestLogger');
const { rateLimiter } = require('./middleware/security/rateLimiter');
const { securityHeaders } = require('./middleware/security/securityHeaders');
const { sanitizeAndValidate } = require('./middleware/security/sanitizeAndValidate');
const { corsOptions } = require('./config/cors');
const { ipBlacklistMiddleware } = require('./modules/trading/ipBlacklist');

const { registerRoutes } = require('./routes');

const app = express();

// Base middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

app.use(helmet());
app.use(securityHeaders);
app.use(cors(corsOptions));

// Logging
app.use(morgan('combined'));
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// IP blacklist (Postgres-backed)
app.use(ipBlacklistMiddleware());

// Security: sanitization + validation defaults
app.use(sanitizeAndValidate);

// Health
app.get('/health', async (req, res) => {
  const { isSupabaseConfigured } = require('./config/supabase');
  const { isPostgresConfigured } = require('./config/postgres');
  const { store } = require('./infrastructure/store');

  let supabase = 'not_configured';
  if (isPostgresConfigured()) {
    supabase = store.mode === 'postgres' ? 'ok' : 'configured';
  } else if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = require('./config/supabase');
      const { error } = await getSupabase()
        .from('app_documents')
        .select('id', { count: 'exact', head: true });
      supabase = error ? 'error' : 'ok';
    } catch {
      supabase = 'error';
    }
  }

  res.json({
    ok: true,
    store: store.ready ? store.mode || 'ready' : 'pending',
    supabase,
  });
});

// Routes
registerRoutes(app);

// Debug: list mounted route paths (useful during implementation)
/*
if (process.env.DEBUG_ROUTES === '1') {
  const paths = [];
  app._router.stack.forEach((l) => {
    if (l.route && l.route.path) paths.push(l.route.path);
    if (l.name === 'router' && l.regexp) {
      // mounted router; cannot reliably enumerate its internal paths here
    }
  });
  // eslint-disable-next-line no-console
  console.log('Mounted routes (direct):', paths);
}
*/



app.use(notFound);
app.use(errorHandler);

// NOTE: Mongo is optional legacy; primary persistence is Supabase.
// connectMongo();

module.exports = { app };


