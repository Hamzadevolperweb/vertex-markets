import { apiRequest } from './client';

export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changeAbs?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  timestamp?: number;
  error?: string;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export async function fetchQuote(symbol: string): Promise<Quote> {
  return apiRequest<Quote>(`/market-data/quote/${encodeURIComponent(symbol)}`);
}

export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const data = await apiRequest<{ items: Quote[] }>(
    `/market-data/quotes?symbols=${encodeURIComponent(symbols.join(','))}`,
  );
  return data.items;
}

export async function fetchCandles(
  symbol: string,
  resolution: string = '60',
): Promise<{ symbol: string; resolution: string; candles: Candle[] }> {
  return apiRequest(`/market-data/candles/${encodeURIComponent(symbol)}?resolution=${encodeURIComponent(resolution)}`);
}
