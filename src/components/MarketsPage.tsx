import { useState, useMemo, useEffect } from 'react';
import { fetchMarkets } from '../api/markets';
import type { MarketItem } from '../api/types';
import { fetchQuotes } from '../api/marketData';
import PriceChart from './charts/PriceChart';
import { useLiveMarket } from '../hooks/useLiveMarket';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Calendar, 
  Newspaper, 
  ChevronRight, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Activity,
  Maximize2,
  LineChart,
  Grid
} from 'lucide-react';
import { Ticker } from '../types';

interface MarketsPageProps {
  onGetStartedClick: () => void;
  onTradeClick: (ticker: Ticker) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

// Full rich dataset for different market assets
const ALL_MARKETS_TICKERS = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.08945, change: 0.47, sparkline: [1.085, 1.087, 1.084, 1.086, 1.088, 1.089, 1.08945], category: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.27482, change: 0.35, sparkline: [1.271, 1.272, 1.270, 1.273, 1.274, 1.2745, 1.27482], category: 'Forex' },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2384.65, change: 0.62, sparkline: [2370, 2375, 2368, 2379, 2381, 2382, 2384.65], category: 'Commodities' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: 67842.10, change: 1.08, sparkline: [67100, 67300, 66800, 67400, 67600, 67700, 67842.10], category: 'Crypto' },
  { symbol: 'USOIL', name: 'Crude Oil', price: 78.245, change: -0.15, sparkline: [78.6, 78.5, 78.4, 78.3, 78.2, 78.25, 78.245], category: 'Commodities' },
  { symbol: 'NASDAQ', name: 'NASDAQ 100', price: 18945.15, change: 0.35, sparkline: [18850, 18880, 18820, 18910, 18930, 18940, 18945.15], category: 'Indices' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.25, sparkline: [171.2, 172.0, 171.5, 172.8, 173.1, 173.2, 173.50], category: 'Stocks' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 177.46, change: -2.41, sparkline: [181.5, 180.2, 179.1, 178.5, 176.8, 177.2, 177.46], category: 'Stocks' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.12, change: 3.84, sparkline: [840, 852, 845, 860, 868, 872, 875.12], category: 'Stocks' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', price: 3134.75, change: 4.68, sparkline: [2995, 3020, 3010, 3080, 3110, 3120, 3134.75], category: 'Crypto' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', price: 161.23, change: 6.38, sparkline: [151.2, 153.4, 152.0, 156.8, 158.4, 159.1, 161.23], category: 'Crypto' },
  { symbol: 'AVAXUSD', name: 'Avalanche / US Dollar', price: 37.42, change: 5.27, sparkline: [35.1, 35.8, 36.0, 36.5, 37.1, 37.2, 37.42], category: 'Crypto' },
  { symbol: 'MATICUSD', name: 'Polygon / US Dollar', price: 0.9121, change: 4.12, sparkline: [0.87, 0.88, 0.875, 0.89, 0.90, 0.905, 0.9121], category: 'Crypto' },
  { symbol: 'LINKUSD', name: 'Chainlink / US Dollar', price: 18.47, change: 3.89, sparkline: [17.8, 17.9, 17.7, 18.1, 18.2, 18.3, 18.47], category: 'Crypto' },
  { symbol: 'LTCUSD', name: 'Litecoin / US Dollar', price: 72.45, change: -3.21, sparkline: [74.8, 74.5, 73.9, 73.2, 72.8, 72.5, 72.45], category: 'Crypto' },
  { symbol: 'DOTUSD', name: 'Polkadot / US Dollar', price: 6.21, change: -2.84, sparkline: [6.4, 6.35, 6.3, 6.25, 6.23, 6.22, 6.21], category: 'Crypto' },
  { symbol: 'BCHUSD', name: 'Bitcoin Cash', price: 342.18, change: -2.41, sparkline: [350.5, 348.2, 346.0, 344.2, 343.1, 342.5, 342.18], category: 'Crypto' },
  { symbol: 'XRPUSD', name: 'Ripple / US Dollar', price: 0.5124, change: -2.03, sparkline: [0.523, 0.521, 0.518, 0.515, 0.514, 0.513, 0.5124], category: 'Crypto' },
  { symbol: 'TRXUSD', name: 'TRON / US Dollar', price: 0.1234, change: -1.87, sparkline: [0.125, 0.125, 0.124, 0.124, 0.1238, 0.1236, 0.1234], category: 'Crypto' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', price: 0.65820, change: -0.12, sparkline: [0.660, 0.659, 0.6595, 0.658, 0.6585, 0.6582, 0.65820], category: 'Forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 156.743, change: -0.21, sparkline: [157.2, 157.0, 156.9, 156.8, 156.75, 156.74, 156.743], category: 'Forex' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', price: 1.36840, change: 0.08, sparkline: [1.366, 1.367, 1.3675, 1.368, 1.3682, 1.3683, 1.36840], category: 'Forex' },
  { symbol: 'UK100', name: 'FTSE 100 Index', price: 8245.30, change: 0.42, sparkline: [8210, 8225, 8205, 8230, 8240, 8242, 8245.30], category: 'Indices' },
  { symbol: 'SPX500', name: 'S&P 500 Index', price: 5310.80, change: 0.58, sparkline: [5280, 5295, 5290, 5302, 5308, 5309, 5310.80], category: 'Indices' }
];

// Helper to generate dynamic candlesticks for the active asset chart
const generateCandlesticks = (basePrice: number, isPositive: boolean, timeframe: string) => {
  const candlesCount = 28;
  const list = [];
  let current = basePrice * (1 - (isPositive ? 0.03 : -0.02)); // start slightly off
  const volatility = basePrice * 0.004;

  for (let i = 0; i < candlesCount; i++) {
    const isUp = Math.random() > (isPositive ? 0.45 : 0.53);
    const open = current;
    const changeAmount = (Math.random() * volatility) * (isUp ? 1 : -1);
    const close = current + changeAmount;
    
    // Calculate high and low based on shadow spikes
    const high = Math.max(open, close) + (Math.random() * volatility * 0.3);
    const low = Math.min(open, close) - (Math.random() * volatility * 0.3);

    list.push({
      time: i,
      open,
      high,
      low,
      close,
      isUp: close >= open
    });

    current = close;
  }

  // Set the final candle's close exactly to our basePrice for perfect accuracy
  const finalIndex = list.length - 1;
  list[finalIndex].close = basePrice;
  list[finalIndex].high = Math.max(list[finalIndex].high, basePrice);
  list[finalIndex].low = Math.min(list[finalIndex].low, basePrice);
  list[finalIndex].isUp = list[finalIndex].close >= list[finalIndex].open;

  return list;
};

type MarketFilter = 'Overview' | 'Forex' | 'Crypto' | 'Stocks' | 'Indices' | 'Commodities';

const MARKET_FILTERS: MarketFilter[] = [
  'Overview',
  'Forex',
  'Crypto',
  'Stocks',
  'Indices',
  'Commodities',
];

export default function MarketsPage({
  onGetStartedClick,
  onTradeClick,
  activeFilter = 'Overview',
  onFilterChange,
}: MarketsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = (MARKET_FILTERS.includes(activeFilter as MarketFilter)
    ? activeFilter
    : 'Overview') as MarketFilter;
  const setActiveTab = (tab: MarketFilter) => onFilterChange?.(tab);
  const [marketTickers, setMarketTickers] = useState(ALL_MARKETS_TICKERS);
  const [selectedAsset, setSelectedAsset] = useState(ALL_MARKETS_TICKERS[0]);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'All'>('1D');
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'fallback'>('loading');
  const { candles: liveCandles, quote: liveQuote, status: chartStatus } = useLiveMarket(
    selectedAsset.symbol,
    activeTimeframe,
  );

  useEffect(() => {
    if (!liveQuote || liveQuote.error) return;
    setSelectedAsset((prev) => ({
      ...prev,
      price: liveQuote.price || prev.price,
      change: liveQuote.change || prev.change,
    }));
    setMarketTickers((prev) =>
      prev.map((t) =>
        t.symbol === liveQuote.symbol
          ? { ...t, price: liveQuote.price || t.price, change: liveQuote.change || t.change }
          : t,
      ),
    );
  }, [liveQuote]);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const data = await fetchMarkets({ limit: 100 });
        if (cancelled) return;

        const enriched = data.items.map((item: MarketItem) => {
          const symbol = (item.title || item.slug || '').toUpperCase();
          const local = ALL_MARKETS_TICKERS.find(
            (t) => t.symbol === symbol || t.symbol.toLowerCase() === item.slug,
          );
          return {
            symbol,
            name: item.description || local?.name || item.title,
            price: local?.price ?? 0,
            change: local?.change ?? 0,
            sparkline: local?.sparkline ?? [0, 0, 0, 0, 0, 0, 0],
            category: (item.type as (typeof ALL_MARKETS_TICKERS)[0]['category']) || 'Forex',
          };
        });

        if (enriched.length > 0) {
          setMarketTickers(enriched);
          setSelectedAsset(enriched[0]);
          setApiStatus('live');
          // hydrate live quotes in background
          fetchQuotes(enriched.slice(0, 12).map((e) => e.symbol))
            .then((quotes) => {
              if (cancelled) return;
              setMarketTickers((prev) =>
                prev.map((t) => {
                  const q = quotes.find((x) => x.symbol === t.symbol && !x.error);
                  return q ? { ...t, price: q.price || t.price, change: q.change || t.change } : t;
                }),
              );
            })
            .catch(() => undefined);
        } else {
          setApiStatus('fallback');
        }
      } catch {
        if (!cancelled) setApiStatus('fallback');
      }
    }

    loadMarkets();
    return () => {
      cancelled = true;
    };
  }, []);

  // Generate candle data whenever selected asset or timeframe changes
  const chartCandles = useMemo(() => {
    return generateCandlesticks(selectedAsset.price, selectedAsset.change >= 0, activeTimeframe);
  }, [selectedAsset, activeTimeframe]);

  // Handle active asset click
  const handleSelectAsset = (asset: typeof ALL_MARKETS_TICKERS[0]) => {
    setSelectedAsset(asset);
    setHoveredCandle(null);
  };

  // Filtered tickers list based on category and search query
  const filteredTickers = useMemo(() => {
    return marketTickers.filter((t) => {
      const matchesCategory = activeTab === 'Overview' || t.category === activeTab;
      const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery, marketTickers]);

  // Top Gainers: Sort ascending or descending based on change, taking positive ones
  const topGainers = useMemo(() => {
    return [...marketTickers]
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
  }, [marketTickers]);

  // Top Losers: taking lowest changes
  const topLosers = useMemo(() => {
    return [...marketTickers]
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);
  }, [marketTickers]);

  // Generate a premium holographic 3D circular candlestick dataset for the decorative right-hand section
  const holographicCandles = useMemo(() => {
    const count = 38;
    const list = [];
    const cx = 200; // Center of our custom SVG canvas (viewBox="0 0 400 360")
    const cy = 250; // Squashed base center (lower down for high perspective)
    const rx = 160; // Horizontal radius of the squashed perspective base circle
    const ry = 42;  // Vertical radius of the squashed perspective base circle (squashed to 25% for 3D angle)

    for (let i = 0; i < count; i++) {
      // Distribute them evenly in an arc from 0 to 2*PI
      const theta = (i / count) * 2 * Math.PI;
      const x = cx + rx * Math.cos(theta);
      const y = cy + ry * Math.sin(theta);

      // Generate heights that look like a natural stock wave pattern
      const wave = Math.sin(theta * 3.0) * 35 + Math.cos(theta * 1.5) * 15 + Math.sin(theta * 6) * 8;
      const baseHeight = 70 + wave; // how high it floats overall

      const isUp = Math.sin(theta * 3.0) >= -0.2; // roughly 60/40 up and down candles
      const bodyLen = 15 + Math.abs(Math.sin(i * 1.2)) * 25;
      
      const open = baseHeight - (isUp ? bodyLen : 0);
      const close = baseHeight - (isUp ? 0 : bodyLen);
      const high = baseHeight + 8 + Math.abs(Math.sin(i * 2.3)) * 12;
      const low = baseHeight - bodyLen - 8 - Math.abs(Math.cos(i * 1.7)) * 12;

      // Color coding for visual beauty (shining neon cyan, jade green, pure white, and glowing blues)
      let color = '#00f0ff'; // Neon Blue/Cyan
      if (i % 3 === 0) {
        color = '#ffffff'; // Pristine white
      } else if (i % 5 === 0) {
        color = '#10b981'; // Vibrant emerald green
      } else if (i % 7 === 0) {
        color = '#3b82f6'; // Indigo accent
      }

      list.push({
        id: i,
        x,
        y,
        open,
        close,
        high,
        low,
        isUp,
        color,
        theta,
        // Z-depth order: we want elements with a larger y coordinate (closer to bottom of screen) to render on top
        depth: y
      });
    }

    // Depth sort so back-facing elements render first, creating real 3D occlusion!
    return list.sort((a, b) => a.depth - b.depth);
  }, []);

  // Get flag or icon based on symbol
  const getAssetIcon = (symbol: string) => {
    switch (symbol) {
      case 'EURUSD':
        return (
          <div className="relative w-7 h-7 flex-shrink-0">
            <span className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-600 border border-[#0d0d0d] flex items-center justify-center text-[7px] font-bold text-white font-sans overflow-hidden">EU</span>
            <span className="absolute right-0 bottom-0 w-4 h-4 rounded-full bg-blue-900 border border-[#0d0d0d] flex items-center justify-center text-[7px] font-bold text-white font-sans overflow-hidden">US</span>
          </div>
        );
      case 'GBPUSD':
        return (
          <div className="relative w-7 h-7 flex-shrink-0">
            <span className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border border-[#0d0d0d] flex items-center justify-center text-[7px] font-bold text-white font-sans overflow-hidden">GB</span>
            <span className="absolute right-0 bottom-0 w-4 h-4 rounded-full bg-blue-950 border border-[#0d0d0d] flex items-center justify-center text-[7px] font-bold text-white font-sans overflow-hidden">US</span>
          </div>
        );
      case 'XAUUSD':
        return (
          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-sans font-bold text-xs flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
            Au
          </div>
        );
      case 'BTCUSD':
        return (
          <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 font-sans font-bold text-xs flex-shrink-0">
            ₿
          </div>
        );
      case 'USOIL':
        return (
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-zinc-300 font-sans font-bold text-[10px] flex-shrink-0">
            🛢️
          </div>
        );
      case 'NASDAQ':
        return (
          <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-sans font-bold text-[9px] flex-shrink-0">
            NDX
          </div>
        );
      case 'AAPL':
        return (
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-sans font-semibold text-[10px] flex-shrink-0">
            🍎
          </div>
        );
      case 'TSLA':
        return (
          <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 font-sans font-bold text-[10px] flex-shrink-0">
            T
          </div>
        );
      case 'NVDA':
        return (
          <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-sans font-bold text-[9px] flex-shrink-0">
            NV
          </div>
        );
      case 'ETHUSD':
        return (
          <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-sans font-bold text-xs flex-shrink-0">
            Ξ
          </div>
        );
      case 'SOLUSD':
        return (
          <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-sans font-bold text-[9px] flex-shrink-0">
            SOL
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-sans font-bold text-[10px] flex-shrink-0">
            {symbol.slice(0, 3)}
          </div>
        );
    }
  };

  // Render SVG Sparkline
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    const width = 80;
    const height = 28;
    const padY = 2;
    
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - padY - ((p - min) / range) * (height - padY * 2);
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#22c55e' : '#ef4444';
    const gradientId = `grad-${coords.replace(/[^a-zA-Z0-0]/g, '')}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill Area under Sparkline */}
        <path
          d={`M0,${height} L${coords} L${width},${height} Z`}
          fill={`url(#${gradientId})`}
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          points={coords}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glow point on final price */}
        <circle 
          cx={width} 
          cy={height - padY - ((points[points.length - 1] - min) / range) * (height - padY * 2)} 
          r="2.5" 
          fill={strokeColor}
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div className="bg-[#030303] text-gray-200 min-h-screen relative pb-16">
      
      {/* Decorative background grid & radial glow effects */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-[#030303]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full px-6 lg:px-10 xl:px-14 relative z-10 pt-8">
        
        {/* ================= HERO SECTION / HEADING ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 md:py-12 border-b border-white/[0.05] mb-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-brand-blue font-semibold">Vunex Global Hub</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Explore Global Markets. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-brand-blue">
                Trade Limitless Opportunities.
              </span>
            </h1>
            
            <p className="text-gray-400 text-base sm:text-lg max-w-xl font-sans">
              Real-time market tracking. High frequency deep liquidity channels. Unfettered access to leading financial indexes, crypto currencies, and premium equities.
            </p>

            {/* --- SEARCH & FILTERS BAR --- */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-lg">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search markets, assets, symbols..." 
                  className="w-full pl-11 pr-4 py-3 bg-[#0c0c0e] border border-white/[0.07] hover:border-white/[0.12] focus:border-brand-blue/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:ring-1 focus:ring-brand-blue/30"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-medium rounded-xl transition-all text-sm cursor-pointer shadow-lg shadow-brand-blue/20">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <span
                className={`self-center text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md border ${
                  apiStatus === 'live'
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : apiStatus === 'loading'
                      ? 'text-gray-400 border-white/10 bg-white/5'
                      : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                }`}
              >
                {apiStatus === 'live' ? 'API live' : apiStatus === 'loading' ? 'Loading' : 'Offline'}
              </span>
            </div>
          </div>

          {/* --- RIGHT SIDE: STUNNING 3D HOLOGRAPHIC CANDLESTICK PLATFORM --- */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none">
              
              {/* Outer Cosmic Aura Glow */}
              <div className="absolute w-[360px] h-[360px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none opacity-65" />
              <div className="absolute w-[240px] h-[240px] bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none opacity-40 bottom-10" />

              {/* Central Vector 3D Stage Canvas */}
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 400 380" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Glowing Laser/Hologram filter */}
                  <filter id="holo-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Soft background reflection filter */}
                  <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient for projecting beams */}
                  <linearGradient id="beam-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00a3ff" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Grid overlay mask to give scanlines */}
                  <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="10" y2="0" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                  </pattern>
                </defs>

                {/* ================= STAGE 1: PERSPECTIVE PEDESTAL RINGS ================= */}
                <g className="transition-all duration-500">
                  {/* Outer Cyber Boundary Ring */}
                  <ellipse cx="200" cy="250" rx="190" ry="48" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.15" />
                  
                  {/* Middle Cyber Dash Ring - Rotates */}
                  <ellipse 
                    cx="200" 
                    cy="250" 
                    rx="175" 
                    ry="44" 
                    fill="none" 
                    stroke="#00f0ff" 
                    strokeWidth="1.5" 
                    strokeDasharray="8,12" 
                    strokeOpacity="0.35"
                    className="animate-[spin_60s_linear_infinite] origin-center"
                    style={{ transformOrigin: '200px 250px' }}
                  />

                  {/* Solid Bright Core Platform Ring */}
                  <ellipse 
                    cx="200" 
                    cy="250" 
                    rx="160" 
                    ry="40" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeOpacity="0.65"
                    filter="url(#holo-glow)"
                  />

                  {/* Inner Tech Concentric Circles */}
                  <ellipse cx="200" cy="250" rx="130" ry="32.5" fill="none" stroke="#00a3ff" strokeWidth="1" strokeOpacity="0.2" />
                  <ellipse cx="200" cy="250" rx="90" ry="22.5" fill="none" stroke="#00a3ff" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="3,3" />
                  <ellipse cx="200" cy="250" rx="40" ry="10" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />

                  {/* Polar Coordinates Radial Helper Lines */}
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const angle = (idx * 30 * Math.PI) / 180;
                    const x1 = 200 + 40 * Math.cos(angle);
                    const y1 = 250 + 10 * Math.sin(angle);
                    const x2 = 200 + 160 * Math.cos(angle);
                    const y2 = 250 + 40 * Math.sin(angle);
                    return (
                      <line 
                        key={`radial-${idx}`} 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#00a3ff" 
                        strokeWidth="0.5" 
                        strokeOpacity="0.12" 
                      />
                    );
                  })}
                </g>

                {/* ================= STAGE 2: PERSPECTIVE WORLD MAP PROJECTION ================= */}
                <g 
                  transform="translate(85, 230) scale(0.58, 0.15)" 
                  className="text-brand-blue/20" 
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                >
                  {/* North America */}
                  <path d="M 40,20 Q 60,15 70,30 T 90,25 T 100,45 T 70,60 T 50,40 Z" />
                  {/* South America */}
                  <path d="M 70,60 Q 80,70 75,95 T 65,115 T 55,90 T 60,70 Z" />
                  {/* Eurasia & Africa */}
                  <path d="M 120,25 Q 150,15 180,20 T 210,35 T 230,25 T 210,65 T 170,80 T 150,95 T 130,70 T 120,40 Z" />
                  {/* Australia */}
                  <path d="M 190,95 Q 210,95 215,110 T 195,115 T 185,105 Z" />
                </g>

                {/* ================= STAGE 3: DEPTH-SORTED HOLOGRAPHIC CANDLESTICKS ================= */}
                <g>
                  {holographicCandles.map((candle) => {
                    // Width of each holographic candle
                    const candleWidth = 5.2;

                    // Compute heights relative to the pedestal's squashed Y coordinate
                    const wickHighY = candle.y - candle.high;
                    const wickLowY = candle.y - candle.low;
                    const bodyTopY = candle.y - candle.open;
                    const bodyBottomY = candle.y - candle.close;
                    
                    const bodyHeight = Math.max(Math.abs(bodyTopY - bodyBottomY), 1.5);
                    const rectTop = Math.min(bodyTopY, bodyBottomY);

                    return (
                      <g 
                        key={`holo-candle-${candle.id}`}
                        className="transition-all duration-300 hover:opacity-100"
                      >
                        {/* 1. Translucent Laser Projection Pillar (Grounds the candle to the stage) */}
                        <line 
                          x1={candle.x}
                          y1={candle.y}
                          x2={candle.x}
                          y2={rectTop + bodyHeight}
                          stroke={candle.color}
                          strokeWidth="0.75"
                          strokeOpacity="0.18"
                          strokeDasharray="1,2"
                        />

                        {/* 2. Holographic connection glow dot at base */}
                        <circle 
                          cx={candle.x}
                          cy={candle.y}
                          r="1.8"
                          fill={candle.color}
                          fillOpacity="0.45"
                          filter="url(#holo-glow)"
                        />

                        {/* 3. Candlestick Wick (Shadow line) */}
                        <line 
                          x1={candle.x}
                          y1={wickHighY}
                          x2={candle.x}
                          y2={wickLowY}
                          stroke={candle.color}
                          strokeWidth="1.2"
                          strokeOpacity="0.75"
                          filter="url(#holo-glow)"
                        />

                        {/* 4. Candlestick Real Body (Holographic Rect) */}
                        <rect 
                          x={candle.x - candleWidth / 2}
                          y={rectTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={candle.color}
                          fillOpacity={candle.isUp ? "0.8" : "0.5"}
                          stroke={candle.color}
                          strokeWidth="1"
                          strokeOpacity="0.9"
                          rx="0.5"
                          filter="url(#holo-glow)"
                        />

                        {/* 5. Highlight glowing particle floating on top wick */}
                        {candle.id % 4 === 0 && (
                          <circle 
                            cx={candle.x}
                            cy={wickHighY}
                            r="2"
                            fill="#ffffff"
                            filter="url(#holo-glow)"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* ================= FLOATING GLASSMORPHISM CARDS (As in user image) ================= */}
              
              {/* Card 1: EURUSD (Top-Left) */}
              <motion.div 
                initial={{ y: 0, x: 0 }}
                animate={{ y: [-6, 6, -6], x: [0, 4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-0 sm:left-2 bg-[#060608]/90 backdrop-blur-md border border-green-500/15 rounded-xl p-2.5 px-3.5 shadow-2xl shadow-black flex items-center gap-3 transition-colors hover:border-green-500/30 cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse absolute -top-0.5 -right-0.5 shadow-[0_0_8px_#22c55e]" />
                <div className="text-[10px] font-mono font-extrabold tracking-wider text-gray-400">EURUSD</div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-white tracking-tight">1.08945</span>
                  <span className="font-mono text-[9px] text-green-400 font-bold leading-none mt-0.5">+0.47%</span>
                </div>
              </motion.div>

              {/* Card 2: BTCUSD (Top-Right) */}
              <motion.div 
                initial={{ y: 0, x: 0 }}
                animate={{ y: [-5, 5, -5], x: [0, -4, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-10 right-0 sm:right-2 bg-[#060608]/90 backdrop-blur-md border border-green-500/15 rounded-xl p-2.5 px-3.5 shadow-2xl shadow-black flex items-center gap-3 transition-colors hover:border-green-500/30 cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse absolute -top-0.5 -right-0.5 shadow-[0_0_8px_#22c55e]" />
                <div className="text-[10px] font-mono font-extrabold tracking-wider text-gray-400">BTCUSD</div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-white tracking-tight">67,842.10</span>
                  <span className="font-mono text-[9px] text-green-400 font-bold leading-none mt-0.5">+1.08%</span>
                </div>
              </motion.div>

              {/* Card 3: XAUUSD (Bottom-Left) */}
              <motion.div 
                initial={{ y: 0, x: 0 }}
                animate={{ y: [6, -6, 6], x: [0, 3, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute bottom-12 left-0 sm:-left-4 bg-[#060608]/90 backdrop-blur-md border border-brand-blue/15 rounded-xl p-2.5 px-3.5 shadow-2xl shadow-black flex items-center gap-3 transition-colors hover:border-brand-blue/30 cursor-pointer"
              >
                <div className="text-[10px] font-mono font-extrabold tracking-wider text-gray-400">XAUUSD</div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-white tracking-tight">2,384.65</span>
                  <span className="font-mono text-[9px] text-brand-blue font-bold leading-none mt-0.5">+0.62%</span>
                </div>
              </motion.div>

              {/* Card 4: NASDAQ (Bottom-Right) */}
              <motion.div 
                initial={{ y: 0, x: 0 }}
                animate={{ y: [5, -5, 5], x: [0, -3, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute bottom-16 right-0 sm:-right-4 bg-[#060608]/90 backdrop-blur-md border border-brand-blue/15 rounded-xl p-2.5 px-3.5 shadow-2xl shadow-black flex items-center gap-3 transition-colors hover:border-brand-blue/30 cursor-pointer"
              >
                <div className="text-[10px] font-mono font-extrabold tracking-wider text-gray-400">NASDAQ</div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-white tracking-tight">18,945.15</span>
                  <span className="font-mono text-[9px] text-brand-blue font-bold leading-none mt-0.5">+0.35%</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>


        {/* ================= CATEGORY NAVIGATION TABS ================= */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar scroll-smooth">
          {MARKET_FILTERS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Auto-select first element from that tab to display in chart
                  const matched = marketTickers.find(t => tab === 'Overview' || t.category === tab);
                  if (matched) setSelectedAsset(matched);
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all border cursor-pointer ${
                  isActive 
                    ? 'bg-brand-blue/10 border-brand-blue text-white shadow-md shadow-brand-blue/10 font-semibold' 
                    : 'bg-[#0d0d11] hover:bg-[#121217] border-white/[0.04] text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>


        {/* ================= THREE COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* 1. COLUMN 1: MARKET OVERVIEW LIST (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#08080a] border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-xl shadow-black/40">
            
            <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-blue" />
                <h2 className="font-display font-bold text-white tracking-wide">Market Overview</h2>
              </div>
              <span className="text-[10px] font-mono bg-white/[0.04] text-gray-400 px-2.5 py-1 rounded-md border border-white/[0.03]">
                {filteredTickers.length} Assets Found
              </span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.03] text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-white/[0.01]">
              <div className="col-span-5">Instrument</div>
              <div className="col-span-3 text-right">Price</div>
              <div className="col-span-2 text-right">Change</div>
              <div className="col-span-2 text-right">Sparkline</div>
            </div>

            {/* Tickers Scroll Container */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {filteredTickers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Search className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400 font-sans">No matching symbols found</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveTab('Overview'); }}
                    className="mt-3 text-xs text-brand-blue font-semibold hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTickers.map((ticker) => {
                  const isSelected = selectedAsset.symbol === ticker.symbol;
                  const isPositive = ticker.change >= 0;
                  
                  return (
                    <div
                      key={ticker.symbol}
                      onClick={() => handleSelectAsset(ticker)}
                      className={`grid grid-cols-12 px-5 py-4 items-center border-b border-white/[0.02] cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-brand-blue/8 border-l-2 border-l-brand-blue border-b-brand-blue/10' 
                          : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                      }`}
                    >
                      {/* Asset Identity */}
                      <div className="col-span-5 flex items-center gap-3">
                        {getAssetIcon(ticker.symbol)}
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs font-bold text-white truncate leading-tight">
                            {ticker.symbol}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate mt-0.5 font-sans">
                            {ticker.name}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-3 text-right font-mono text-xs font-bold text-white">
                        {ticker.price.toLocaleString(undefined, { minimumFractionDigits: ticker.symbol.includes('JPY') ? 3 : 2, maximumFractionDigits: 5 })}
                      </div>

                      {/* Change */}
                      <div className={`col-span-2 text-right font-mono text-xs font-bold ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : ''}{ticker.change}%
                      </div>

                      {/* Sparkline Visual */}
                      <div className="col-span-2 flex justify-end">
                        {renderSparkline(ticker.sparkline, isPositive)}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* 2. COLUMN 2: TOP GAINERS & LOSERS STACK (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-[600px]">
            
            {/* Top Gainers Card */}
            <div className="flex-1 bg-[#08080a] border border-white/[0.05] rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl shadow-black/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display font-bold text-sm text-white">Top Gainers</h3>
              </div>

              <div className="flex-grow overflow-y-auto space-y-3.5 pr-1">
                {topGainers.map((gainer) => (
                  <div
                    key={`gainer-${gainer.symbol}`}
                    onClick={() => handleSelectAsset(gainer)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {getAssetIcon(gainer.symbol)}
                      <span className="font-mono text-xs font-bold text-white">{gainer.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white">
                        {gainer.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="font-mono text-[10px] text-green-400 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+{gainer.change}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers Card */}
            <div className="flex-1 bg-[#08080a] border border-white/[0.05] rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl shadow-black/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display font-bold text-sm text-white">Top Losers</h3>
              </div>

              <div className="flex-grow overflow-y-auto space-y-3.5 pr-1">
                {topLosers.map((loser) => (
                  <div
                    key={`loser-${loser.symbol}`}
                    onClick={() => handleSelectAsset(loser)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {getAssetIcon(loser.symbol)}
                      <span className="font-mono text-xs font-bold text-white">{loser.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white">
                        {loser.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="font-mono text-[10px] text-red-400 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                        <TrendingDown className="w-3 h-3" />
                        <span>{loser.change}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3. COLUMN 3: INTERACTIVE CANDLESTICK CHART (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#08080a] border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-xl shadow-black/40">
            
            {/* Chart Toolbar */}
            <div className="p-4 border-b border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                  <LineChart className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-mono text-sm font-bold text-white">{selectedAsset.symbol}</h3>
                    <span className="text-[10px] text-gray-500 font-sans">• 1 Day</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans truncate max-w-[180px] sm:max-w-none">{selectedAsset.name}</p>
                </div>
              </div>

              {/* Utility Indicators / Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c22] border border-white/[0.04] text-[10px] text-gray-400 font-medium cursor-pointer transition-colors">
                  <Activity className="w-3 h-3 text-brand-blue" />
                  <span>Indicators</span>
                </button>
                <button className="p-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c22] border border-white/[0.04] text-gray-400 hover:text-white cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c22] border border-white/[0.04] text-gray-400 hover:text-white cursor-pointer">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Candlestick Stage Container */}
            <div className="flex-grow relative p-4 flex flex-col justify-between bg-[#050507]">
              
              {/* Dynamic live values HUD bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-gray-500 border-b border-white/[0.03] pb-2 mb-2">
                {hoveredCandle ? (
                  <>
                    <span>O: <span className={hoveredCandle.isUp ? 'text-green-400' : 'text-red-400'}>{hoveredCandle.open.toFixed(selectedAsset.symbol.includes('JPY') ? 3 : 5)}</span></span>
                    <span>H: <span className={hoveredCandle.isUp ? 'text-green-400' : 'text-red-400'}>{hoveredCandle.high.toFixed(selectedAsset.symbol.includes('JPY') ? 3 : 5)}</span></span>
                    <span>L: <span className={hoveredCandle.isUp ? 'text-green-400' : 'text-red-400'}>{hoveredCandle.low.toFixed(selectedAsset.symbol.includes('JPY') ? 3 : 5)}</span></span>
                    <span>C: <span className={hoveredCandle.isUp ? 'text-green-400' : 'text-red-400'}>{hoveredCandle.close.toFixed(selectedAsset.symbol.includes('JPY') ? 3 : 5)}</span></span>
                  </>
                ) : (
                  <>
                    <span>Price: <span className="text-white font-bold">{selectedAsset.price}</span></span>
                    <span>High: <span className="text-green-400 font-bold">{selectedAsset.high || selectedAsset.price * 1.01}</span></span>
                    <span>Low: <span className="text-red-400 font-bold">{selectedAsset.low || selectedAsset.price * 0.99}</span></span>
                  </>
                )}
              </div>

              {/* TradingView Lightweight Charts */}
              <div className="flex-grow w-full relative h-[320px]">
                {liveCandles.length > 0 ? (
                  <PriceChart candles={liveCandles} height={320} />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-500">
                    {chartStatus === 'loading' ? 'Loading live chart…' : 'Chart data unavailable — check market data API key'}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
                  <span className="font-display font-extrabold text-9xl tracking-[0.1em] text-white uppercase select-none">VUNEX</span>
                </div>
              </div>

              {/* Time scales bottom timeline labels */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-white/[0.03] pt-3 px-2">
                <span className="uppercase tracking-wider">{chartStatus === 'live' ? 'Live feed' : chartStatus}</span>
                <span>{selectedAsset.symbol}</span>
                <span>{activeTimeframe}</span>
              </div>

            </div>

            {/* Timeframe Interval selectors bar */}
            <div className="p-3 bg-[#0a0a0d] border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex gap-1.5">
                {(['1D', '1W', '1M', '3M', '6M', '1Y', 'All'] as const).map((tf) => {
                  const isSelected = activeTimeframe === tf;
                  return (
                    <button
                      key={tf}
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-brand-blue text-white shadow-sm' 
                          : 'bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {tf}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => onTradeClick(selectedAsset)}
                className="flex items-center gap-1 bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all border border-brand-blue/30 cursor-pointer"
              >
                <span>Trade {selectedAsset.symbol}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>


        {/* ================= BOTTOM METRICS WIDGETS (3-Card Row) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* CARD 1: POPULAR ASSETS */}
          <div className="bg-[#08080a] border border-white/[0.05] rounded-2xl p-5 flex flex-col h-[280px] shadow-lg shadow-black/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-sm text-white">Popular Assets</h3>
              </div>
              <button 
                onClick={() => setActiveTab('Overview')} 
                className="text-[10px] text-brand-blue font-bold tracking-wide hover:underline uppercase"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-grow overflow-y-auto">
              {marketTickers.slice(0, 6).map((pop) => (
                <div 
                  key={`popular-${pop.symbol}`}
                  onClick={() => handleSelectAsset(pop)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] cursor-pointer transition-colors"
                >
                  {getAssetIcon(pop.symbol)}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[10px] font-bold text-white truncate">{pop.symbol}</span>
                    <span className="text-[9px] text-gray-500 font-sans truncate">{pop.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: ECONOMIC CALENDAR */}
          <div className="bg-[#08080a] border border-white/[0.05] rounded-2xl p-5 flex flex-col h-[280px] shadow-lg shadow-black/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-sm text-white">Economic Calendar</h3>
              </div>
              <span className="text-[10px] text-brand-blue font-bold tracking-wide uppercase">
                View Calendar
              </span>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto pr-1">
              {[
                { time: '10:00', cur: 'USD', impact: 'high', event: 'CPI MoM (Jun)', val: '0.2%', prev: '0.1%' },
                { time: '12:30', cur: 'GBP', impact: 'medium', event: 'GDP MoM (Q2)', val: '0.1%', prev: '0.3%' },
                { time: '14:00', cur: 'USD', impact: 'high', event: 'Core PPI MoM', val: '0.2%', prev: '0.0%' },
                { time: '16:45', cur: 'EUR', impact: 'low', event: 'ECB President Speech', val: '-', prev: '-' }
              ].map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-gray-400">{ev.time}</span>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-white">{ev.cur}</span>
                      <span className="text-[9px] text-gray-400 font-sans truncate max-w-[120px]">{ev.event}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right font-mono text-[10px]">
                      <span className="text-white font-bold">{ev.val}</span>
                      <span className="text-gray-500 text-[8px]">Prev: {ev.prev}</span>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ev.impact === 'high' ? 'bg-red-500' : ev.impact === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: LATEST MARKET NEWS */}
          <div className="bg-[#08080a] border border-white/[0.05] rounded-2xl p-5 flex flex-col h-[280px] shadow-lg shadow-black/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-sm text-white">Latest Market News</h3>
              </div>
              <span className="text-[10px] text-brand-blue font-bold tracking-wide uppercase">
                View All News
              </span>
            </div>

            <div className="space-y-3.5 flex-grow overflow-y-auto pr-1">
              {[
                { title: 'US Stocks Edge Higher as Tech Leads Rally', source: 'MarketWire', time: '2h ago' },
                { title: 'Gold Holds Gains as Dollar Weakens', source: 'BullionDaily', time: '3h ago' },
                { title: 'Bitcoin Surges Past $67K Amid ETF Inflows', source: 'CryptoPulse', time: '4h ago' },
                { title: 'Crude Oil Settles Near $78 on OPEC Supply Plans', source: 'GlobalEnergy', time: '6h ago' }
              ].map((news, i) => (
                <div key={i} className="flex flex-col gap-1 p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02]">
                  <h4 className="text-[10px] font-sans font-bold text-white line-clamp-2 leading-snug hover:text-brand-blue transition-colors cursor-pointer">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 mt-1">
                    <span>{news.source}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{news.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* ================= BOTTOM GLOWING CTA BANNER ================= */}
        <div className="relative rounded-3xl bg-[#060608] border border-white/[0.06] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl shadow-brand-blue/5">
          {/* Subtle neon glow backlights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[120px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-indigo-500/10 to-transparent blur-[70px] pointer-events-none" />

          <div className="text-center md:text-left space-y-2 relative z-10">
            <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-white">
              Ready to Trade Global Markets?
            </h2>
            <p className="text-sm text-gray-400 font-sans max-w-xl">
              Join millions of traders who trust Vunex Market for professional institutional-grade tech and deep global liquidity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
            <button 
              onClick={onGetStartedClick}
              className="text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Open Demo Account →
            </button>
            <button 
              onClick={onGetStartedClick}
              className="w-full sm:w-auto px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/20 cursor-pointer shadow-md shadow-brand-blue/15"
            >
              Get Started
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
