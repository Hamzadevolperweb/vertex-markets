import { useEffect, useState } from 'react';
import { fetchCandles, fetchQuote, type Candle, type Quote } from '../api/marketData';

const TF_TO_RESOLUTION: Record<string, string> = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1h': '60',
  '4h': '60',
  'D': 'D',
  'W': 'W',
  '1D': '60',
  '1W': 'D',
  '1M': 'D',
  '3M': 'D',
  '6M': 'W',
  '1Y': 'W',
  All: 'W',
};

export function useLiveMarket(symbol: string, timeframe: string) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    const resolution = TF_TO_RESOLUTION[timeframe] || '60';

    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const [c, q] = await Promise.all([
          fetchCandles(symbol, resolution),
          fetchQuote(symbol),
        ]);
        if (cancelled) return;
        setCandles(c.candles || []);
        setQuote(q);
        setStatus('live');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to load market data');
      }
    }

    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [symbol, timeframe]);

  return { candles, quote, status, error };
}
