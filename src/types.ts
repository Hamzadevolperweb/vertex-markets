export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sparkline: number[];
  high: number;
  low: number;
  digits: number;
}

export type PlatformType = 'web' | 'desktop' | 'mobile';

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  timestamp: string;
}

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  timestamp: string;
  status: 'CLOSED';
}
