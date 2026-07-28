/**
 * Apply SQL migrations in supabase/migrations against DIRECT_URL / DATABASE_URL.
 * Usage: node -r dotenv/config src/scripts/migrate-supabase.js
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const connectionString =
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error('Set DIRECT_URL (or DATABASE_URL) to run migrations');
  }

  const migrationsDir = path.resolve(
    __dirname,
    '../../../supabase/migrations',
  );

  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    // eslint-disable-next-line no-console
    console.log('[migrate] no SQL files found');
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  // eslint-disable-next-line no-console
  console.log(`[migrate] connected — applying ${files.length} file(s)`);

  await client.query(`
    create table if not exists public.schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  for (const file of files) {
    const { rows } = await client.query(
      'select 1 from public.schema_migrations where id = $1',
      [file],
    );
    if (rows.length) {
      // eslint-disable-next-line no-console
      console.log(`[migrate] skip ${file} (already applied)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`[migrate] applying ${file}...`);
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query(
        'insert into public.schema_migrations (id) values ($1)',
        [file],
      );
      await client.query('commit');
      // eslint-disable-next-line no-console
      console.log(`[migrate] ok ${file}`);
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  }

  await client.end();
  // eslint-disable-next-line no-console
  console.log('[migrate] done');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[migrate] failed', err.message);
  process.exit(1);
});
