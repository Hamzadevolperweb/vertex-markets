import { useEffect, useState, useRef } from 'react';
import { Ticker } from '../types';

const INITIAL_TICKERS: Ticker[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.08945, change: 0.47, sparkline: [1.085, 1.086, 1.084, 1.087, 1.088, 1.089, 1.08945], high: 1.091, low: 1.0832, digits: 5 },
  { symbol: 'GBPUSD', name: 'GBP / USD', price: 1.27482, change: 0.35, sparkline: [1.27, 1.271, 1.269, 1.273, 1.272, 1.275, 1.27482], high: 1.278, low: 1.2685, digits: 5 },
  { symbol: 'XAUUSD', name: 'Gold / USD', price: 2384.65, change: 0.62, sparkline: [2370.2, 2374.5, 2368.1, 2378.9, 2382.4, 2385.0, 2384.65], high: 2392.1, low: 2365.4, digits: 2 },
  { symbol: 'USDJPY', name: 'USD / JPY', price: 156.743, change: -0.21, sparkline: [157.1, 156.9, 157.3, 156.8, 157.0, 156.6, 156.743], high: 157.55, low: 156.22, digits: 3 },
  { symbol: 'BTCUSD', name: 'Bitcoin / USD', price: 67842.1, change: 1.08, sparkline: [66900, 67200, 66800, 67450, 67600, 68100, 67842.1], high: 68350, low: 66500, digits: 2 },
  { symbol: 'USOIL', name: 'WTI Crude', price: 78.245, change: -0.15, sparkline: [78.6, 78.4, 78.9, 78.1, 78.5, 78.0, 78.245], high: 79.15, low: 77.8, digits: 3 },
];

interface TickerBarProps {
  onTickerSelect?: (ticker: Ticker) => void;
  activeSymbol?: string;
}

/** Design: single tray with dashed vertical dividers */
export default function TickerBar({ onTickerSelect, activeSymbol }: TickerBarProps) {
  const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
  const prevPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    tickers.forEach((t) => { prevPrices.current[t.symbol] = t.price; });
    const interval = setInterval(() => {
      setTickers((curr) =>
        curr.map((ticker) => {
          const volatility = ticker.symbol === 'BTCUSD' ? 25 : ticker.symbol === 'XAUUSD' ? 0.8 : 0.00015;
          const newPrice = Math.max(ticker.low, Math.min(ticker.high, ticker.price + (Math.random() - 0.5) * volatility));
          prevPrices.current[ticker.symbol] = newPrice;
          return {
            ...ticker,
            price: newPrice,
            change: Number((ticker.change + (Math.random() - 0.48) * 0.03).toFixed(2)),
            sparkline: [...ticker.sparkline.slice(1), newPrice],
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sparkPath = (values: number[], w: number, h: number) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
      .map((val, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((val - min) / range) * (h - 4) - 2;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="w-full py-6 md:py-8" id="ticker-bar-container">
      <div className="w-full px-6 lg:px-10 xl:px-14">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] overflow-x-auto">
          <div className="flex min-w-[960px]">
            {tickers.map((ticker, i) => {
              const up = ticker.change >= 0;
              const active = activeSymbol === ticker.symbol;
              const lineColor = up ? '#1e60ff' : '#e5e7eb';
              return (
                <button
                  key={ticker.symbol}
                  type="button"
                  onClick={() => onTickerSelect?.(ticker)}
                  className={`relative flex-1 text-left px-4 py-4 transition-colors cursor-pointer ${
                    active ? 'bg-brand-blue/[0.06]' : 'hover:bg-white/[0.02]'
                  } ${i > 0 ? 'border-l border-dashed border-white/[0.1]' : ''}`}
                >
                  <div className="text-[11px] font-bold tracking-wide text-white mb-1">{ticker.symbol}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-[13px] font-semibold text-white">
                      {ticker.price.toLocaleString(undefined, {
                        minimumFractionDigits: ticker.digits,
                        maximumFractionDigits: ticker.digits,
                      })}
                    </span>
                    <span className={`text-[11px] font-mono font-semibold ${up ? 'text-brand-blue' : 'text-white/70'}`}>
                      {up ? '+' : ''}{ticker.change}%
                    </span>
                  </div>
                  <svg className="w-full h-7" viewBox="0 0 64 28" preserveAspectRatio="none">
                    <path
                      d={sparkPath(ticker.sparkline, 64, 28)}
                      fill="none"
                      stroke={lineColor}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: up ? 'drop-shadow(0 0 3px #1e60ff)' : undefined }}
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
