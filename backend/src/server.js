const { app } = require('./app');
const http = require('http');
const { store } = require('./infrastructure/store');
const { runSeed } = require('./seeders/seed');
const { isSupabaseConfigured } = require('./config/supabase');
const { isPostgresConfigured } = require('./config/postgres');
const { attachTradingRealtime } = require('./realtime/tradingSocket');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const storeInfo = await store.init();
    // eslint-disable-next-line no-console
    console.log(`[store] mode=${storeInfo.mode}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[store] init failed', err);
    process.exit(1);
  }

  try {
    await runSeed();
    await store.flush();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[seed] startup seed failed', err);
  }

  const server = http.createServer(app);
  if (isPostgresConfigured()) {
    attachTradingRealtime(server);
  }

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Health: http://localhost:${PORT}/health`);
    // eslint-disable-next-line no-console
    console.log(`Docs:   http://localhost:${PORT}/api/v1/docs`);
    // eslint-disable-next-line no-console
    console.log(`WS:     ws://localhost:${PORT}/ws/trading`);
    // eslint-disable-next-line no-console
    console.log(
      `Supabase: ${isSupabaseConfigured() ? 'connected' : 'not configured'} | Postgres: ${
        isPostgresConfigured() ? 'yes' : 'no'
      }`,
    );
  });
}

start();
