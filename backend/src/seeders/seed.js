/**
 * Seeds in-memory store with a default admin and sample markets.
 * Safe to call on every boot — skips when data already exists.
 */
const bcrypt = require('bcryptjs');
const { Roles } = require('../constants/roles');
const { createUser, getUserByEmail } = require('../modules/auth/authRepository');
const marketsRepository = require('../modules/markets/marketsRepository');

const DEFAULT_ADMIN = {
  email: 'admin@vunexmarket.com',
  password: 'Admin123!',
  profile: { firstName: 'Admin', lastName: 'User', phone: '' },
};

const SAMPLE_MARKETS = [
  { type: 'Forex', title: 'EURUSD', slug: 'eurusd', description: 'Euro / US Dollar', order: 1 },
  { type: 'Forex', title: 'GBPUSD', slug: 'gbpusd', description: 'British Pound / US Dollar', order: 2 },
  { type: 'Forex', title: 'USDJPY', slug: 'usdjpy', description: 'US Dollar / Japanese Yen', order: 3 },
  { type: 'Forex', title: 'AUDUSD', slug: 'audusd', description: 'Australian Dollar / US Dollar', order: 4 },
  { type: 'Forex', title: 'USDCAD', slug: 'usdcad', description: 'US Dollar / Canadian Dollar', order: 5 },
  { type: 'Crypto', title: 'BTCUSD', slug: 'btcusd', description: 'Bitcoin / US Dollar', order: 1 },
  { type: 'Crypto', title: 'ETHUSD', slug: 'ethusd', description: 'Ethereum / US Dollar', order: 2 },
  { type: 'Crypto', title: 'SOLUSD', slug: 'solusd', description: 'Solana / US Dollar', order: 3 },
  { type: 'Commodities', title: 'XAUUSD', slug: 'xauusd', description: 'Gold / US Dollar', order: 1 },
  { type: 'Commodities', title: 'USOIL', slug: 'usoil', description: 'Crude Oil', order: 2 },
  { type: 'Indices', title: 'NASDAQ', slug: 'nasdaq', description: 'NASDAQ 100', order: 1 },
  { type: 'Indices', title: 'SPX500', slug: 'spx500', description: 'S&P 500 Index', order: 2 },
  { type: 'Indices', title: 'UK100', slug: 'uk100', description: 'FTSE 100 Index', order: 3 },
  { type: 'Stocks', title: 'AAPL', slug: 'aapl', description: 'Apple Inc.', order: 1 },
  { type: 'Stocks', title: 'TSLA', slug: 'tsla', description: 'Tesla Inc.', order: 2 },
  { type: 'Stocks', title: 'NVDA', slug: 'nvda', description: 'NVIDIA Corp.', order: 3 },
];

async function seedAdmin() {
  const existing = await getUserByEmail(DEFAULT_ADMIN.email);
  if (existing) return { created: false, email: existing.email };

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
  const user = await createUser({
    email: DEFAULT_ADMIN.email,
    passwordHash,
    role: Roles.Admin,
    profile: DEFAULT_ADMIN.profile,
  });

  // Mark verified for local/dev login convenience (persist via repository)
  const { setEmailVerified } = require('../modules/auth/authRepository');
  await setEmailVerified(user.id);
  return { created: true, email: user.email };
}

async function seedMarkets() {
  const existing = await marketsRepository.list();
  if (existing.length > 0) return { created: 0, total: existing.length };

  let created = 0;
  for (const m of SAMPLE_MARKETS) {
    await marketsRepository.create({ ...m, active: true, icon: '' });
    created += 1;
  }
  return { created, total: created };
}

async function runSeed() {
  const admin = await seedAdmin();
  const markets = await seedMarkets();

  try {
    const { isPostgresConfigured } = require('../config/postgres');
    const { ensureTradingProfile } = require('../modules/trading/walletService');
    if (isPostgresConfigured()) {
      const user = await getUserByEmail(DEFAULT_ADMIN.email);
      if (user) {
        await ensureTradingProfile({
          userId: user.id,
          email: user.email,
          displayName: 'Admin User',
          role: user.role,
        });
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[seed] trading profile', err.message);
  }

  // eslint-disable-next-line no-console
  console.log(
    `[seed] admin=${admin.email} (${admin.created ? 'created' : 'exists'}) | markets=${markets.created} created (${markets.total} total)`,
  );
  if (admin.created) {
    // eslint-disable-next-line no-console
    console.log(`[seed] default admin password: ${DEFAULT_ADMIN.password}`);
  }
  return { admin, markets };
}

if (require.main === module) {
  const { store } = require('../infrastructure/store');
  store
    .init()
    .then(() => runSeed())
    .then(() => store.flush())
    .then(() => process.exit(0))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[seed] failed', err);
      process.exit(1);
    });
}

module.exports = { runSeed, DEFAULT_ADMIN, SAMPLE_MARKETS };
