const { Client } = require('pg');

let sharedClient = null;

function getDatabaseUrl() {
  return (
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    ''
  );
}

function isPostgresConfigured() {
  return Boolean(getDatabaseUrl());
}

async function getPgClient() {
  if (sharedClient) return sharedClient;

  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error('Set DIRECT_URL or DATABASE_URL for Postgres access');
  }

  sharedClient = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await sharedClient.connect();
  return sharedClient;
}

async function withPg(fn) {
  const client = await getPgClient();
  return fn(client);
}

module.exports = {
  getDatabaseUrl,
  isPostgresConfigured,
  getPgClient,
  withPg,
};
