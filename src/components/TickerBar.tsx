import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Ticker } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const INITIAL_TICKERS: Ticker[] = [
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    price: 1.08945,
    change: 0.47,
    sparkline: [1.085, 1.086, 1.084, 1.087, 1.088, 1.089, 1.08945],
    high: 1.09100,
    low: 1.08320,
    digits: 5,
  },
  {
    symbol: 'GBPUSD',
    name: 'Great British Pound / US Dollar',
    price: 1.27482,
    change: 0.35,
    sparkline: [1.270, 1.271, 1.269, 1.273, 1.272, 1.275, 1.27482],
    high: 1.27800,
    low: 1.26850,
    digits: 5,
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold / US Dollar',
    price: 2384.65,
    change: 0.62,
    sparkline: [2370.2, 2374.5, 2368.1, 2378.9, 2382.4, 2385.0, 2384.65],
    high: 2392.10,
    low: 2365.40,
    digits: 2,
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    price: 156.743,
    change: -0.21,
    sparkline: [157.1, 156.9, 157.3, 156.8, 157.0, 156.6, 156.743],
    high: 157.550,
    low: 156.220,
    digits: 3,
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    price: 67842.10,
    change: 1.08,
    sparkline: [66900, 67200, 66800, 67450, 67600, 68100, 67842.10],
    high: 68350.00,
    low: 66500.00,
    digits: 2,
  },
  {
    symbol: 'USOIL',
    name: 'WTI Crude Oil',
    price: 78.245,
    change: -0.15,
    sparkline: [78.6, 78.4, 78.9, 78.1, 78.5, 78.0, 78.245],
    high: 79.150,
    low: 77.800,
    digits: 3,
  },
];

interface TickerBarProps {
  onTickerSelect?: (ticker: Ticker) => void;
  activeSymbol?: string;
}

export default function TickerBar({ onTickerSelect, activeSymbol }: TickerBarProps) {
  const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
  const [flashStates, setFlashStates] = useState<{ [key: string]: 'up' | 'down' | null }>({});
  const prevPrices = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    // Save initial prices
    tickers.forEach(t => {
      prevPrices.current[t.symbol] = t.price;
    });

    const interval = setInterval(() => {
      setTickers(currentTickers => 
        currentTickers.map(ticker => {
          // Keep active symbol relatively stable so it doesn't interrupt terminal focus too much, but still lively
          const volatility = ticker.symbol === 'BTCUSD' ? 25 : ticker.symbol === 'XAUUSD' ? 0.8 : 0.00015;
          const randomFactor = (Math.random() - 0.5) * volatility;
          const newPrice = ticker.price + randomFactor;
          
          // Constrain within bounds
          const clampedPrice = Math.max(ticker.low, Math.min(ticker.high, newPrice));
          
          // Determine flash direction
          const prevPrice = prevPrices.current[ticker.symbol] || ticker.price;
          let direction: 'up' | 'down' | null = null;
          if (clampedPrice > prevPrice) {
            direction = 'up';
          } else if (clampedPrice < prevPrice) {
            direction = 'down';
          }

          // Trigger flash
          if (direction) {
            setFlashStates(prev => ({ ...prev, [ticker.symbol]: direction }));
            setTimeout(() => {
              setFlashStates(prev => ({ ...prev, [ticker.symbol]: null }));
            }, 800);
          }

          // Update prev price
          prevPrices.current[ticker.symbol] = clampedPrice;

          // Update sparkline
          const updatedSparkline = [...ticker.sparkline.slice(1), clampedPrice];
          
          // Re-calculate change based on initial sparkline base or simply drift change
          const pctDrift = (Math.random() - 0.48) * 0.03; // Slight upward drift over time
          const newChange = ticker.change + pctDrift;

          return {
            ...ticker,
            price: clampedPrice,
            change: Number(newChange.toFixed(2)),
            sparkline: updatedSparkline,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSparklinePath = (values: number[], width: number, height: number) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return values
      .map((val, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2; // margins
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  };

  return (
    <div className="w-full bg-[#050507] border-y border-white/[0.05] py-4 overflow-x-auto select-none" id="ticker-bar-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-w-[1000px] justify-between">
          {tickers.map((ticker) => {
            const isPositive = ticker.change >= 0;
            const flash = flashStates[ticker.symbol];
            const isActive = activeSymbol === ticker.symbol;
            
            let flashClass = '';
            if (flash === 'up') flashClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            else if (flash === 'down') flashClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            else flashClass = isActive ? 'border-brand-blue/30 bg-brand-blue/[0.02]' : 'border-transparent';

            return (
              <div
                key={ticker.symbol}
                onClick={() => onTickerSelect?.(ticker)}
                className={`flex-1 flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all duration-300 hover:bg-white/[0.02] ${flashClass}`}
                id={`ticker-${ticker.symbol}`}
              >
                {/* Symbol & Price */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-semibold text-xs text-white tracking-wide">{ticker.symbol}</span>
                    <span className={`text-[10px] font-mono flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{ticker.change}%
                    </span>
                  </div>
                  <div className="font-mono text-sm font-semibold text-gray-200 mt-1">
                    {ticker.price.toLocaleString(undefined, { minimumFractionDigits: ticker.digits, maximumFractionDigits: ticker.digits })}
                  </div>
                </div>

                {/* Sparkline Visual */}
                <div className="w-16 h-8 ml-3 flex items-center">
                  <svg className="w-full h-full overflow-visible">
                    <path
                      d={getSparklinePath(ticker.sparkline, 64, 32)}
                      fill="none"
                      stroke={isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Shadow glow under sparkline */}
                    <path
                      d={`${getSparklinePath(ticker.sparkline, 64, 32)} L 64 32 L 0 32 Z`}
                      fill={isPositive ? 'url(#glow-green)' : 'url(#glow-red)'}
                      className="opacity-15"
                    />
                    
                    {/* Definitions for gradient backgrounds */}
                    <defs>
                      <linearGradient id="glow-green" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="glow-red" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
