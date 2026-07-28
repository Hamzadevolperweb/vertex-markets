const { createClient } = require('@supabase/supabase-js');

let client = null;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  return { url, serviceKey, publishableKey };
}

function isSupabaseConfigured() {
  const { url, serviceKey } = getSupabaseConfig();
  return Boolean(url && serviceKey);
}

function getRealtimeTransport() {
  try {
    // Node < 22 needs the `ws` package for Realtime
    // eslint-disable-next-line global-require
    return require('ws');
  } catch {
    return undefined;
  }
}

/**
 * Server-side Supabase client (secret / service role).
 * Prefer for DB writes, storage uploads, and bypassing RLS.
 */
function getSupabase() {
  if (client) return client;

  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.',
    );
  }

  const transport = getRealtimeTransport();
  client = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...(transport ? { realtime: { transport } } : {}),
  });

  return client;
}

module.exports = {
  getSupabase,
  getSupabaseConfig,
  isSupabaseConfigured,
};
