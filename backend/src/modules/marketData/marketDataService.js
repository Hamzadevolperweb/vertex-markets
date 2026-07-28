/**
 * Finnhub market-data client (server-side only — never expose the API key).
 * Docs: https://finnhub.io/docs/api
 */
const FINNHUB_BASE = process.env.MARKET_DATA_BASE_URL || 'https://finnhub.io/api/v1';

function getApiKey() {
  const key = process.env.MARKET_DATA_API_KEY;
  if (!key) {
    const err = new Error('MARKET_DATA_API_KEY is not configured');
    err.status = 503;
    throw err;
  }
  return key;
}

async function finnhubGet(path, params = {}) {
  const url = new URL(`${FINNHUB_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  url.searchParams.set('token', getApiKey());

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || `Market data error (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Map UI symbols to Finnhub symbols where needed */
function toFinnhubSymbol(symbol) {
  const s = String(symbol || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const map = {
    USOIL: 'OANDA:WTICO_USD',
    XAUUSD: 'OANDA:XAU_USD',
    NASDAQ: 'NDX',
    SPX500: 'SPX',
    UK100: 'UKX',
  };
  return map[s] || s;
}

async function getQuote(symbol) {
  const data = await finnhubGet('/quote', { symbol: toFinnhubSymbol(symbol) });
  return {
    symbol: String(symbol).toUpperCase(),
    price: data.c ?? 0,
    change: data.dp ?? 0,
    changeAbs: data.d ?? 0,
    high: data.h ?? 0,
    low: data.l ?? 0,
    open: data.o ?? 0,
    previousClose: data.pc ?? 0,
    timestamp: data.t ? data.t * 1000 : Date.now(),
  };
}

/**
 * resolution: 1 | 5 | 15 | 30 | 60 | D | W | M
 */
async function getCandles(symbol, { resolution = '60', from, to } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const defaultFrom = now - 60 * 60 * 24 * 7; // 7 days
  const data = await finnhubGet('/stock/candle', {
    symbol: toFinnhubSymbol(symbol),
    resolution,
    from: from || defaultFrom,
    to: to || now,
  });

  if (!data || data.s === 'no_data' || !Array.isArray(data.t)) {
    return { symbol: String(symbol).toUpperCase(), resolution, candles: [] };
  }

  const candles = data.t.map((t, i) => ({
    time: t,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v?.[i] ?? 0,
  }));

  return { symbol: String(symbol).toUpperCase(), resolution, candles };
}

async function getQuotes(symbols = []) {
  const list = (Array.isArray(symbols) ? symbols : String(symbols).split(','))
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 25);

  const results = await Promise.allSettled(list.map((s) => getQuote(s)));
  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { symbol: list[i], price: 0, change: 0, error: r.reason?.message || 'failed' },
  );
}

module.exports = {
  getQuote,
  getCandles,
  getQuotes,
  toFinnhubSymbol,
};
