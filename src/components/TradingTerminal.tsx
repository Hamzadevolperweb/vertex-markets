import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Star,
  Settings,
  Maximize2,
  Moon,
  Sun,
  Bell,
  Check,
  ChevronDown,
  Trash2,
  Lock,
  Unlock,
  Ruler,
  Type,
  MousePointer,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Edit2,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronUp,
  Flame,
  User,
  ShieldAlert,
  Sliders
} from 'lucide-react';

// Live ticker type
interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isUp: boolean;
  high: number;
  low: number;
  volume: string;
  flag: string;
}

// Position type
interface ActivePosition {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  size: number;
  entryPrice: number;
  markPrice: number;
  sl: number;
  tp: number;
  pnl: number;
  pnlPercent: number;
}

// Recent order type
interface RecentOrder {
  time: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  type: string;
  size: number;
  price: number;
  status: 'Filled' | 'Canceled' | 'Pending';
}

// Order Book row
interface OrderBookRow {
  price: number;
  size: number;
  total: number;
  cumPercentage: number;
}

interface TradingTerminalProps {
  onLogout: () => void;
  onNavigateToOverview?: () => void;
}

export default function TradingTerminal({ onLogout, onNavigateToOverview }: TradingTerminalProps) {
  // Available Tickers List (Matches the Image 5 Favorites Exactly)
  const [tickers, setTickers] = useState<TickerData[]>([
    { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.08945, change: 0.47, isUp: true, high: 1.09123, low: 1.08321, volume: '1.23B', flag: '🇪🇺' },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.27482, change: 0.35, isUp: true, high: 1.27950, low: 1.27120, volume: '840M', flag: '🇬🇧' },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2384.65, change: 0.62, isUp: true, high: 2395.20, low: 2368.50, volume: '2.1B', flag: '✨' },
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: 67842.10, change: 1.08, isUp: true, high: 68420.00, low: 66910.00, volume: '34.5B', flag: '🪙' },
    { symbol: 'USOIL', name: 'Crude Oil', price: 78.245, change: -0.15, isUp: false, high: 79.120, low: 77.850, volume: '450M', flag: '🛢️' },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 156.743, change: -0.21, isUp: false, high: 157.320, low: 155.980, volume: '980M', flag: '🇯🇵' },
    { symbol: 'NAS100', name: 'NASDAQ 100', price: 18742.50, change: 0.39, isUp: true, high: 18850.00, low: 18620.00, volume: '12.4B', flag: '🇺🇸' },
    { symbol: 'XAGUSD', name: 'Silver / US Dollar', price: 28.415, change: 0.17, isUp: true, high: 28.850, low: 28.110, volume: '120M', flag: '🥈' }
  ]);

  // Selected asset
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD');
  const activeTicker = tickers.find(t => t.symbol === selectedSymbol) || tickers[0];

  // Active view constraints
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [marketFilter, setMarketFilter] = useState<'All' | 'Forex' | 'Crypto' | 'Commodities' | 'Indices'>('All');

  // Chart States
  const [chartTimeframe, setChartTimeframe] = useState<string>('1h');
  const [drawingTool, setDrawingTool] = useState<string>('crosshair');
  const [isDrawingLocked, setIsDrawingLocked] = useState<boolean>(false);

  // Account stats matching Image 5 header
  const [equity, setEquity] = useState<number>(125430.25);
  const [balance, setBalance] = useState<number>(85430.25);
  const [marginUsed, setMarginUsed] = useState<number>(18430.21);
  const [marginLevel, setMarginLevel] = useState<number>(678.45);

  // Order Ticket states
  const [orderMode, setOrderMode] = useState<'Buy' | 'Sell'>('Buy');
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'Stop' | 'Stop Limit'>('Market');
  const [volumeLots, setVolumeLots] = useState<string>('1.00');
  const [leverage, setLeverage] = useState<string>('50:1');
  const [leverageValue, setLeverageValue] = useState<number>(50); // slider
  const [setStopLoss, setSetStopLoss] = useState<boolean>(true);
  const [stopLossPrice, setStopLossPrice] = useState<string>('1.08500');
  const [stopLossPips, setStopLossPips] = useState<string>('-44.5');
  const [setTakeProfit, setSetTakeProfit] = useState<boolean>(true);
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('1.09400');
  const [takeProfitPips, setTakeProfitPips] = useState<string>('+45.5');

  // Open Positions state (Image 5 starting positions)
  const [positions, setPositions] = useState<ActivePosition[]>([
    { id: 'pos-1', symbol: 'EURUSD', side: 'Buy', size: 1.00, entryPrice: 1.08720, markPrice: 1.08945, sl: 1.08500, tp: 1.09400, pnl: 225.00, pnlPercent: 0.21 },
    { id: 'pos-2', symbol: 'XAUUSD', side: 'Buy', size: 0.50, entryPrice: 2374.50, markPrice: 2384.65, sl: 2360.00, tp: 2400.00, pnl: 507.50, pnlPercent: 0.43 },
    { id: 'pos-3', symbol: 'GBPUSD', side: 'Sell', size: 1.00, entryPrice: 1.27850, markPrice: 1.27482, sl: 1.28300, tp: 1.27000, pnl: 368.00, pnlPercent: 0.29 }
  ]);

  // Recent Orders state (Image 5 starting list)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    { time: '14:31:52', symbol: 'EURUSD', side: 'Buy', type: 'Market', size: 1.00, price: 1.08945, status: 'Filled' },
    { time: '14:30:21', symbol: 'XAUUSD', side: 'Buy', type: 'Limit', size: 0.50, price: 2380.00, status: 'Filled' },
    { time: '14:29:10', symbol: 'GBPUSD', side: 'Sell', type: 'Stop Limit', size: 1.00, price: 1.27400, status: 'Filled' },
    { time: '14:28:05', symbol: 'BTCUSD', side: 'Buy', type: 'Limit', size: 0.10, price: 67500.00, status: 'Canceled' },
    { time: '14:27:33', symbol: 'USOIL', side: 'Sell', type: 'Market', size: 1.00, price: 78.250, status: 'Filled' }
  ]);

  // Notifications or toast alerts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Time ticker state
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('14:32:18');

  // Trigger temporary toasts
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Live time updater
  useEffect(() => {
    const tInterval = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setCurrentTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);
    return () => clearInterval(tInterval);
  }, []);

  // Syncing TP/SL pips automatically if prices change
  useEffect(() => {
    if (!activeTicker) return;
    const currentPrice = activeTicker.price;
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const pipFactor = isCrypto ? 100 : isGold ? 1 : isYen ? 0.01 : 0.0001;

    // Default target prices
    if (orderMode === 'Buy') {
      const slPrice = currentPrice - (44.5 * pipFactor);
      const tpPrice = currentPrice + (45.5 * pipFactor);
      setStopLossPrice(slPrice.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
      setTakeProfitPrice(tpPrice.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
    } else {
      const slPrice = currentPrice + (44.5 * pipFactor);
      const tpPrice = currentPrice - (45.5 * pipFactor);
      setStopLossPrice(slPrice.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
      setTakeProfitPrice(tpPrice.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
    }
  }, [selectedSymbol, orderMode]);

  // Handle ticking simulation (prices update in real-time)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTickers(prevTickers => {
        return prevTickers.map(t => {
          const tickPercent = (Math.random() - 0.48) * 0.0006; // slightly positive drift
          const prevPrice = t.price;
          const newPrice = prevPrice * (1 + tickPercent);
          
          const isYen = t.symbol.includes('JPY');
          const isCrypto = t.symbol.includes('BTC');
          const isGold = t.symbol.includes('XAU');
          const decimals = isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5;
          const formattedPrice = parseFloat(newPrice.toFixed(decimals));

          // Calculate new stats
          const priceDiff = formattedPrice - (t.high + t.low) / 2;
          const currentChange = t.change + (tickPercent * 100);

          return {
            ...t,
            price: formattedPrice,
            change: parseFloat(currentChange.toFixed(2)),
            isUp: currentChange >= 0,
            high: formattedPrice > t.high ? formattedPrice : t.high,
            low: formattedPrice < t.low ? formattedPrice : t.low
          };
        });
      });

      // Fluctuate open positions P&L matching ticker prices
      setPositions(prevPos => {
        return prevPos.map(pos => {
          const currentTkr = tickers.find(tk => tk.symbol === pos.symbol);
          if (!currentTkr) return pos;

          const priceDiff = pos.side === 'Buy' 
            ? currentTkr.price - pos.entryPrice 
            : pos.entryPrice - currentTkr.price;

          // Convert price diff to USD value based on lot size
          // 1 standard lot = 100,000 units for forex, 100 oz for gold, etc.
          let multiplier = 100000;
          if (pos.symbol.includes('XAU')) multiplier = 100; // Gold
          if (pos.symbol.includes('BTC')) multiplier = 10;  // Bitcoin
          if (pos.symbol.includes('USOIL')) multiplier = 1000; // Oil

          const pnlValue = parseFloat((priceDiff * pos.size * multiplier).toFixed(2));
          const pnlPercentValue = parseFloat(((priceDiff / pos.entryPrice) * 100).toFixed(2));

          return {
            ...pos,
            markPrice: currentTkr.price,
            pnl: pnlValue,
            pnlPercent: pnlPercentValue
          };
        });
      });
    }, 1200);

    return () => clearInterval(tickInterval);
  }, [tickers]);

  // Recalculate account stats based on running positions P&L
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const currentEquity = parseFloat((balance + totalPnl).toFixed(2));
  const currentPnlPercent = parseFloat(((totalPnl / balance) * 100).toFixed(2));
  const currentMarginLevel = marginUsed > 0 
    ? parseFloat(((currentEquity / marginUsed) * 100).toFixed(2)) 
    : 0.00;

  // Render filter items
  const filteredTickers = tickers.filter(t => {
    // text query match
    const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // category filter
    if (marketFilter === 'All') return true;
    if (marketFilter === 'Forex') return t.symbol.endsWith('USD') && t.symbol !== 'XAUUSD' && t.symbol !== 'BTCUSD' && t.symbol !== 'XAGUSD';
    if (marketFilter === 'Crypto') return t.symbol === 'BTCUSD';
    if (marketFilter === 'Commodities') return t.symbol === 'XAUUSD' || t.symbol === 'USOIL' || t.symbol === 'XAGUSD';
    if (marketFilter === 'Indices') return t.symbol === 'NAS100';
    return true;
  });

  // Handle Placing a new order (Simulation)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sizeVal = parseFloat(volumeLots);
    if (isNaN(sizeVal) || sizeVal <= 0) {
      triggerToast('Invalid volume lots size', 'error');
      return;
    }

    const price = activeTicker.price;
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const pipFactor = isCrypto ? 100 : isGold ? 1 : isYen ? 0.01 : 0.0001;

    // Create a new position
    const slVal = setStopLoss ? parseFloat(stopLossPrice) : 0;
    const tpVal = setTakeProfit ? parseFloat(takeProfitPrice) : 0;

    const newPosition: ActivePosition = {
      id: `pos-${Date.now()}`,
      symbol: activeTicker.symbol,
      side: orderMode,
      size: sizeVal,
      entryPrice: price,
      markPrice: price,
      sl: slVal,
      tp: tpVal,
      pnl: 0,
      pnlPercent: 0
    };

    const newOrderRecord: RecentOrder = {
      time: currentTimeStr,
      symbol: activeTicker.symbol,
      side: orderMode,
      type: orderType,
      size: sizeVal,
      price: price,
      status: 'Filled'
    };

    setPositions(prev => [newPosition, ...prev]);
    setRecentOrders(prev => [newOrderRecord, ...prev]);
    
    // Adjust account values
    const marginReq = parseFloat(((price * sizeVal * 100000) / leverageValue).toFixed(2));
    setMarginUsed(prev => prev + (activeTicker.symbol.includes('XAU') ? sizeVal * 1000 : marginReq / 100)); // weighted margin

    triggerToast(`Created ${orderMode} order for ${sizeVal} lot ${activeTicker.symbol} successfully!`, 'success');
  };

  // Close position
  const handleClosePosition = (id: string, pnl: number) => {
    const posToRemove = positions.find(p => p.id === id);
    if (!posToRemove) return;

    setPositions(prev => prev.filter(p => p.id !== id));
    setBalance(prev => parseFloat((prev + pnl).toFixed(2)));
    
    // Refund some simulated margin used
    setMarginUsed(prev => Math.max(0, parseFloat((prev - 3000).toFixed(2))));

    // Add to recent orders
    const closeOrderRecord: RecentOrder = {
      time: currentTimeStr,
      symbol: posToRemove.symbol,
      side: posToRemove.side === 'Buy' ? 'Sell' : 'Buy',
      type: 'Market (Close)',
      size: posToRemove.size,
      price: posToRemove.markPrice,
      status: 'Filled'
    };
    setRecentOrders(prev => [closeOrderRecord, ...prev]);

    triggerToast(`Closed position of ${posToRemove.symbol}. Realized profit: $${pnl >= 0 ? '+' : ''}${pnl}`, pnl >= 0 ? 'success' : 'info');
  };

  // Close all positions
  const handleCloseAllPositions = () => {
    if (positions.length === 0) {
      triggerToast('No active positions to close', 'info');
      return;
    }
    
    let totalRealized = 0;
    positions.forEach(p => {
      totalRealized += p.pnl;
      // log each
      const rec: RecentOrder = {
        time: currentTimeStr,
        symbol: p.symbol,
        side: p.side === 'Buy' ? 'Sell' : 'Buy',
        type: 'Market (Close All)',
        size: p.size,
        price: p.markPrice,
        status: 'Filled'
      };
      setRecentOrders(prev => [rec, ...prev]);
    });

    setBalance(prev => parseFloat((prev + totalRealized).toFixed(2)));
    setPositions([]);
    setMarginUsed(0);

    triggerToast(`Closed all positions! Net realized P&L: $${totalRealized >= 0 ? '+' : ''}${totalRealized.toFixed(2)}`, totalRealized >= 0 ? 'success' : 'info');
  };

  // Order book rows generation (Asks and Bids centered around dynamic spot price)
  const getOrderBookAsks = (): OrderBookRow[] => {
    const spot = activeTicker.price;
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const step = isCrypto ? 2.5 : isGold ? 0.15 : isYen ? 0.005 : 0.00002;

    const rawRows = [
      { price: spot + (step * 6), size: 1.20 },
      { price: spot + (step * 5), size: 2.10 },
      { price: spot + (step * 4), size: 1.50 },
      { price: spot + (step * 3), size: 2.00 },
      { price: spot + (step * 2), size: 1.00 },
      { price: spot + step, size: 1.70 }
    ];

    let cumTotal = 0;
    const rows = rawRows.map(r => {
      cumTotal += r.size;
      return {
        price: parseFloat(r.price.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5)),
        size: r.size,
        total: parseFloat(cumTotal.toFixed(2)),
        cumPercentage: 0
      };
    });

    const totalSum = rows.reduce((acc, curr) => acc + curr.size, 0);
    return rows.map(r => ({ ...r, cumPercentage: Math.min(100, (r.total / totalSum) * 100) })).reverse();
  };

  const getOrderBookBids = (): OrderBookRow[] => {
    const spot = activeTicker.price;
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const step = isCrypto ? 2.5 : isGold ? 0.15 : isYen ? 0.005 : 0.00002;

    const rawRows = [
      { price: spot - step, size: 1.30 },
      { price: spot - (step * 2), size: 2.40 },
      { price: spot - (step * 3), size: 1.60 },
      { price: spot - (step * 4), size: 2.20 },
      { price: spot - (step * 5), size: 1.40 },
      { price: spot - (step * 6), size: 2.10 }
    ];

    let cumTotal = 0;
    const rows = rawRows.map(r => {
      cumTotal += r.size;
      return {
        price: parseFloat(r.price.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5)),
        size: r.size,
        total: parseFloat(cumTotal.toFixed(2)),
        cumPercentage: 0
      };
    });

    const totalSum = rows.reduce((acc, curr) => acc + curr.size, 0);
    return rows.map(r => ({ ...r, cumPercentage: Math.min(100, (r.total / totalSum) * 100) }));
  };

  // Quick lots adjustment helpers
  const adjustVolume = (delta: number) => {
    const current = parseFloat(volumeLots);
    if (!isNaN(current)) {
      const next = Math.max(0.01, current + delta);
      setVolumeLots(next.toFixed(2));
    }
  };

  // Adjust SL / TP prices
  const adjustSLPrice = (delta: number) => {
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const pipFactor = isCrypto ? 10 : isGold ? 0.5 : isYen ? 0.01 : 0.0001;

    const current = parseFloat(stopLossPrice);
    if (!isNaN(current)) {
      const next = current + (delta * pipFactor);
      setStopLossPrice(next.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
    }
  };

  const adjustTPPrice = (delta: number) => {
    const isCrypto = activeTicker.symbol.includes('BTC');
    const isGold = activeTicker.symbol.includes('XAU');
    const isYen = activeTicker.symbol.includes('JPY');
    const pipFactor = isCrypto ? 10 : isGold ? 0.5 : isYen ? 0.01 : 0.0001;

    const current = parseFloat(takeProfitPrice);
    if (!isNaN(current)) {
      const next = current + (delta * pipFactor);
      setTakeProfitPrice(next.toFixed(isCrypto ? 1 : isGold ? 2 : isYen ? 3 : 5));
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 flex flex-col font-sans select-none overflow-x-hidden" id="trading-terminal-root">
      
      {/* Dynamic Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-bounce flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-xs px-4 py-3.5 rounded-lg shadow-2xl">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-blue-500' : 'bg-amber-500'}`} />
          <span className="font-semibold text-white">{toast.message}</span>
        </div>
      )}

      {/* 1. TOP STATS NAVBAR (Exact duplicate of Image 5 design) */}
      <nav className="h-14 bg-[#050507] border-b border-white/[0.05] flex items-center justify-between px-6 z-20 shrink-0">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNavigateToOverview}>
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className="absolute inset-0 bg-blue-500/20 rounded blur-[2px]"></span>
              <svg className="w-4.5 h-4.5 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4L12 12L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs tracking-wider text-white uppercase leading-none">Vertex</span>
              <span className="font-sans text-[7px] tracking-[0.25em] text-gray-400 uppercase leading-none mt-1">Markets</span>
            </div>
          </div>

          {/* Links Row */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="text-xs font-bold text-white relative py-1 focus:outline-none cursor-pointer">
              Trade
              <span className="absolute bottom-[-14px] inset-x-0 h-[2px] bg-blue-500" />
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer" onClick={onNavigateToOverview}>
              Markets
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer" onClick={onNavigateToOverview}>
              Portfolio
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Reports
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Resources
            </button>
          </div>
        </div>

        {/* Right: Live Ledger stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 text-[11px] font-semibold text-gray-400">
            <div className="hidden sm:block text-left">
              <span className="block text-[9px] text-gray-500 uppercase leading-none">Equity</span>
              <span className="block font-mono text-white mt-1 font-bold">${currentEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-[9px] text-gray-500 uppercase leading-none">Balance</span>
              <span className="block font-mono text-white mt-1 font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="text-left">
              <span className="block text-[9px] text-gray-500 uppercase leading-none">P&L</span>
              <span className={`block font-mono mt-1 font-extrabold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({currentPnlPercent >= 0 ? '+' : ''}{currentPnlPercent}%)
              </span>
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-[9px] text-gray-500 uppercase leading-none">Margin Used</span>
              <span className="block font-mono text-white mt-1 font-bold">${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-[9px] text-gray-500 uppercase leading-none">Margin Level</span>
              <span className={`block font-mono mt-1 font-bold ${currentMarginLevel > 110 ? 'text-blue-400' : 'text-amber-500'}`}>{currentMarginLevel.toFixed(2)}%</span>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-3 border-l border-white/5 pl-4">
            <button className="text-gray-400 hover:text-white p-1 focus:outline-none cursor-pointer relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
            <button className="text-gray-400 hover:text-white p-1 focus:outline-none cursor-pointer">
              <Moon className="w-4 h-4 text-blue-400" />
            </button>
            
            {/* TR Profile indicator */}
            <div 
              className="w-7 h-7 rounded-full bg-blue-900/40 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold font-mono text-blue-400 cursor-pointer hover:border-blue-400 transition-colors"
              title="Logout Profile"
              onClick={onLogout}
            >
              TR
            </div>
          </div>
        </div>

      </nav>

      {/* 2. CORE WORKSPACE AREA: Divided exactly into columns */}
      <div className="flex-grow flex min-h-0 overflow-hidden relative">
        
        {/* Leftmost ultra-narrow tool icons panel (Matches Image 5 far left strip) */}
        <div className="w-12 bg-[#050507] border-r border-white/[0.04] flex flex-col justify-between py-4 items-center shrink-0">
          <div className="space-y-6">
            <button 
              className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/15 cursor-pointer focus:outline-none"
              onClick={onNavigateToOverview}
              title="Dashboard Overview"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button 
              className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer focus:outline-none"
              title="Add Market Asset"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
            <button 
              className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer focus:outline-none"
              title="Charts Tools"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          <div>
            <button 
              className="w-8 h-8 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 flex items-center justify-center cursor-pointer focus:outline-none"
              title="Secure Logout"
              onClick={onLogout}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* FIRST COLUMN: FAVORITES & SEARCH (Left Pane) */}
        {/* ========================================== */}
        <div className="w-64 bg-[#07070a]/95 border-r border-white/[0.04] flex flex-col shrink-0 hidden md:flex">
          
          {/* Search box */}
          <div className="p-3.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search markets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/5 focus:border-blue-500/40 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none placeholder-gray-600 transition-colors"
              />
            </div>
          </div>

          {/* Markets Filters bar */}
          <div className="px-3 pb-2.5 flex items-center justify-between border-b border-white/[0.03]">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['All', 'Forex', 'Crypto', 'Commodities', 'Indices'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setMarketFilter(cat)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors whitespace-nowrap focus:outline-none cursor-pointer ${
                    marketFilter === cat 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="text-gray-500 hover:text-white p-0.5 focus:outline-none">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Favorites List */}
          <div className="flex-grow overflow-y-auto divide-y divide-white/[0.02]">
            <div className="px-3.5 py-2">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-left">Favorites</span>
            </div>

            {filteredTickers.map(t => {
              const isActive = t.symbol === selectedSymbol;
              return (
                <div
                  key={t.symbol}
                  onClick={() => setSelectedSymbol(t.symbol)}
                  className={`flex items-center justify-between px-3.5 py-3 cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-blue-500/5 border-l-2 border-blue-500' 
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-base select-none">{t.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white font-mono tracking-wide">{t.symbol}</span>
                      <span className="text-[9px] text-gray-500 leading-none truncate w-28">{t.name}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col font-mono">
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {t.price.toLocaleString(undefined, { minimumFractionDigits: t.symbol.includes('USD') && !t.symbol.includes('BTC') ? 5 : 2 })}
                    </span>
                    <span className={`text-[9.5px] font-bold mt-0.5 leading-none ${t.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.isUp ? '+' : ''}{t.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredTickers.length === 0 && (
              <div className="p-8 text-center text-xs text-gray-600 font-semibold">
                No matched assets.
              </div>
            )}
          </div>

          {/* Add Symbol button at the bottom */}
          <div className="p-3 border-t border-white/[0.03] bg-black/20">
            <button 
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md text-[10.5px] font-bold text-gray-300 hover:text-white transition-all focus:outline-none cursor-pointer flex items-center justify-center gap-1.5"
              onClick={() => triggerToast('Search full brokerage inventory (Simulated)', 'info')}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Symbol</span>
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* SECOND COLUMN: CHART & OPEN POSITIONS & RECENT ORDERS (Middle Pane) */}
        {/* ========================================== */}
        <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Ticker Stats display header */}
          <div className="p-4 bg-[#050507]/40 border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <span className="text-2xl">{activeTicker.flag}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold text-white font-mono tracking-tight">{activeTicker.symbol}</h1>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 cursor-pointer" />
                </div>
                <span className="text-[10px] text-gray-500 leading-none">{activeTicker.name}</span>
              </div>

              {/* Spot Price */}
              <div className="flex items-baseline gap-2.5 pl-6 border-l border-white/5">
                <span className="text-lg font-extrabold text-white font-mono tracking-tight">
                  {activeTicker.price.toLocaleString(undefined, { minimumFractionDigits: activeTicker.symbol.includes('USD') && !activeTicker.symbol.includes('BTC') ? 5 : 2 })}
                </span>
                <span className={`text-[10px] font-bold ${activeTicker.isUp ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-0.5`}>
                  {activeTicker.isUp ? '▲' : '▼'} {activeTicker.isUp ? '+' : ''}{activeTicker.change}%
                </span>
              </div>
            </div>

            {/* Stat indicators */}
            <div className="flex items-center gap-6 text-[10.5px] text-gray-500 font-mono">
              <div className="text-left">
                <span className="block text-[8px] text-gray-600 uppercase leading-none">24h High</span>
                <span className="block text-white mt-1 font-semibold">{activeTicker.high.toLocaleString(undefined, { minimumFractionDigits: activeTicker.symbol.includes('USD') && !activeTicker.symbol.includes('BTC') ? 5 : 2 })}</span>
              </div>
              <div className="text-left">
                <span className="block text-[8px] text-gray-600 uppercase leading-none">24h Low</span>
                <span className="block text-white mt-1 font-semibold">{activeTicker.low.toLocaleString(undefined, { minimumFractionDigits: activeTicker.symbol.includes('USD') && !activeTicker.symbol.includes('BTC') ? 5 : 2 })}</span>
              </div>
              <div className="text-left">
                <span className="block text-[8px] text-gray-600 uppercase leading-none">24h Volume</span>
                <span className="block text-white mt-1 font-semibold">${activeTicker.volume}</span>
              </div>
            </div>
          </div>

          {/* Timeframes and Toolbar Row */}
          <div className="px-4 py-2 bg-[#050507]/20 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-1">
              {['1m', '5m', '15m', '1h', '4h', 'D', 'W'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors focus:outline-none cursor-pointer ${
                    chartTimeframe === tf 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
              <span className="h-4 w-[1px] bg-white/5 mx-2" />
              <button className="text-[10px] font-bold text-gray-500 hover:text-white px-2 py-1 cursor-pointer">
                Indicators
              </button>
              <button className="text-[10px] font-bold text-gray-500 hover:text-white px-2 py-1 cursor-pointer">
                Templates
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                className="text-gray-500 hover:text-white p-1 focus:outline-none cursor-pointer"
                onClick={() => triggerToast('Preset Saved', 'success')}
                title="Save Layout"
              >
                <span className="text-[10.5px] font-bold font-mono text-blue-400">Save ▼</span>
              </button>
              <button className="text-gray-500 hover:text-white p-1 focus:outline-none cursor-pointer">
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button className="text-gray-500 hover:text-white p-1 focus:outline-none cursor-pointer">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Interactive Candlestick Chart Area */}
          <div className="h-[360px] bg-black relative flex">
            
            {/* Drawing tool selection strip on the left edge */}
            <div className="w-10 border-r border-white/[0.04] bg-[#050507]/60 flex flex-col items-center py-4 space-y-4 text-gray-600">
              <button 
                onClick={() => setDrawingTool('crosshair')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${drawingTool === 'crosshair' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-white hover:bg-white/5'}`}
                title="Crosshair"
              >
                <MousePointer className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDrawingTool('trendline')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${drawingTool === 'trendline' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-white hover:bg-white/5'}`}
                title="Trend Line"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDrawingTool('fib')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${drawingTool === 'fib' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-white hover:bg-white/5'}`}
                title="Fibonacci Retracement"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDrawingTool('text')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${drawingTool === 'text' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-white hover:bg-white/5'}`}
                title="Add Text Notes"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDrawingTool('measure')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${drawingTool === 'measure' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-white hover:bg-white/5'}`}
                title="Measure Distance / Pips"
              >
                <Ruler className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsDrawingLocked(!isDrawingLocked)}
                className={`p-1.5 rounded transition-colors cursor-pointer hover:text-white hover:bg-white/5`}
                title={isDrawingLocked ? "Unlock Tools" : "Lock Drawing Tools"}
              >
                {isDrawingLocked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-gray-500" />}
              </button>
              <button 
                onClick={() => triggerToast('Cleared drawing templates', 'info')}
                className="p-1.5 rounded hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Clear Drawings"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Canvas / SVG Candle Plotting (High Fidelity Rendering) */}
            <div className="flex-grow relative h-full overflow-hidden flex flex-col justify-between">
              
              {/* Backgrid SVG Plotting */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                      <rect width="40" height="30" fill="none" />
                      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Vector Candlesticks & Technical Lines Overlay */}
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                
                {/* Simulated Chart Plot Lines */}
                <svg className="w-full h-[80%] absolute inset-0 text-blue-500 select-none overflow-visible">
                  
                  {/* Neon Area gradient fill */}
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1e60ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Financial Trend curve */}
                  <path
                    d="M 10 180 C 80 210, 150 110, 220 160 C 290 210, 360 80, 430 110 C 500 140, 570 60, 640 100"
                    fill="url(#chartGlow)"
                    stroke="#1e60ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-70"
                  />

                  {/* EMA Line (Purple trend) */}
                  <path
                    d="M 10 190 C 80 195, 150 140, 220 150 C 290 180, 360 110, 430 115 C 500 130, 570 90, 640 105"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    className="opacity-40"
                  />

                  {/* Candlesticks drawn relative to spots */}
                  {/* Candlestick Group (Red/Green candles) */}
                  <g className="opacity-90">
                    {/* Candle 1 (Green) */}
                    <line x1="40" y1="160" x2="40" y2="210" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="34" y="170" width="12" height="30" fill="#10b981" rx="1" />

                    {/* Candle 2 (Green) */}
                    <line x1="90" y1="140" x2="90" y2="190" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="84" y="150" width="12" height="25" fill="#10b981" rx="1" />

                    {/* Candle 3 (Red) */}
                    <line x1="140" y1="130" x2="140" y2="200" stroke="#ef4444" strokeWidth="1.5" />
                    <rect x="134" y="145" width="12" height="40" fill="#ef4444" rx="1" />

                    {/* Candle 4 (Green) */}
                    <line x1="190" y1="90" x2="190" y2="160" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="184" y="105" width="12" height="45" fill="#10b981" rx="1" />

                    {/* Candle 5 (Red) */}
                    <line x1="240" y1="110" x2="240" y2="170" stroke="#ef4444" strokeWidth="1.5" />
                    <rect x="234" y="125" width="12" height="30" fill="#ef4444" rx="1" />

                    {/* Candle 6 (Red) */}
                    <line x1="290" y1="150" x2="290" y2="220" stroke="#ef4444" strokeWidth="1.5" />
                    <rect x="284" y="160" width="12" height="40" fill="#ef4444" rx="1" />

                    {/* Candle 7 (Green) */}
                    <line x1="340" y1="80" x2="340" y2="150" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="334" y="90" width="12" height="45" fill="#10b981" rx="1" />

                    {/* Candle 8 (Green) */}
                    <line x1="390" y1="60" x2="390" y2="120" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="384" y="70" width="12" height="35" fill="#10b981" rx="1" />

                    {/* Candle 9 (Red) */}
                    <line x1="440" y1="90" x2="440" y2="160" stroke="#ef4444" strokeWidth="1.5" />
                    <rect x="434" y="100" width="12" height="40" fill="#ef4444" rx="1" />

                    {/* Candle 10 (Green) */}
                    <line x1="490" y1="50" x2="490" y2="120" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="484" y="60" width="12" height="45" fill="#10b981" rx="1" />

                    {/* Candle 11 (Green - Live/Flashing Ticker) */}
                    <line x1="540" y1="60" x2="540" y2="110" stroke={activeTicker.isUp ? '#10b981' : '#ef4444'} strokeWidth="1.5" />
                    <rect x="534" y="70" width="12" height="25" fill={activeTicker.isUp ? '#10b981' : '#ef4444'} rx="1" />
                  </g>

                  {/* Horizontal dotted line at active spot price */}
                  <line 
                    x1="0" 
                    y1="82" 
                    x2="100%" 
                    y2="82" 
                    stroke={activeTicker.isUp ? '#10b981' : '#ef4444'} 
                    strokeWidth="1" 
                    strokeDasharray="4 3" 
                    className="opacity-80"
                  />
                  
                  {/* Glowing Price Label on the right axis */}
                  <g transform="translate(565, 73)" className="select-none">
                    <rect width="60" height="18" fill={activeTicker.isUp ? '#10b981' : '#ef4444'} rx="3" className="shadow-lg" />
                    <text x="30" y="12" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {activeTicker.price}
                    </text>
                  </g>
                </svg>

                {/* Floating info overlay */}
                <div className="absolute top-4 left-6 z-10 flex flex-col text-left">
                  <div className="flex items-center gap-2 text-[10.5px] text-gray-400 font-mono">
                    <span className="font-bold text-white">{activeTicker.symbol}</span>
                    <span>1h</span>
                    <span>• Vertex Markets</span>
                    <span>O: <span className="text-gray-300">1.08892</span></span>
                    <span>H: <span className="text-gray-300">1.08988</span></span>
                    <span>L: <span className="text-gray-300">1.08821</span></span>
                    <span>C: <span className="text-blue-400">{activeTicker.price}</span></span>
                  </div>
                </div>
              </div>

              {/* Time scaling labels bottom of chart container (Image 5 matching) */}
              <div className="h-7 bg-[#050507]/40 border-t border-white/[0.04] w-full flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono z-10 shrink-0">
                <div className="flex gap-14">
                  <span>12:00</span>
                  <span>13:00</span>
                  <span>14:00</span>
                  <span>15:00</span>
                  <span>16:00</span>
                  <span>17:00</span>
                  <span>18:00</span>
                  <span>19:00</span>
                </div>
                <span>UTC+0</span>
              </div>
            </div>

            {/* Right Y-Axis prices scale */}
            <div className="w-16 border-l border-white/[0.04] bg-[#050507]/20 flex flex-col justify-between py-6 items-center text-[9px] text-gray-500 font-mono shrink-0 select-none">
              <span>1.09400</span>
              <span>1.09200</span>
              <span>1.09000</span>
              <span className="text-blue-400 font-bold">1.08945</span>
              <span>1.08800</span>
              <span>1.08600</span>
              <span>1.08400</span>
              <span>1.08200</span>
              <span>1.08000</span>
            </div>
          </div>

          {/* Time range picker bottom toolbar */}
          <div className="px-4 py-2 bg-[#050507]/40 border-b border-white/[0.04] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-gray-500 font-mono">
              {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All'].map(dr => (
                <button
                  key={dr}
                  className="px-2 py-1 rounded hover:text-white transition-colors focus:outline-none cursor-pointer"
                  onClick={() => triggerToast(`Time scale updated to ${dr}`, 'info')}
                >
                  {dr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
              <span className="text-gray-300 font-bold">{currentTimeStr} (UTC+0)</span>
              <span className="cursor-pointer hover:text-white">%</span>
              <span className="cursor-pointer hover:text-white">log</span>
              <span className="text-blue-500 font-extrabold cursor-pointer">auto</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* LOWER GRID: OPEN POSITIONS (Left) & RECENT ORDERS (Right) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 border-b border-white/[0.04]">
            
            {/* Open Positions list widget (9 Columns) */}
            <div className="xl:col-span-8 border-r border-white/[0.04] bg-[#050507]/10 p-4">
              <div className="flex items-center justify-between mb-3 text-left">
                <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <span>Open Positions</span>
                  <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[9px] px-1.5 py-0.5 rounded-full font-mono">{positions.length}</span>
                </span>

                <button 
                  onClick={handleCloseAllPositions}
                  className="px-2.5 py-1.5 border border-white/5 hover:border-white/10 hover:bg-white/5 text-[9.5px] font-bold rounded text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Close All Positions
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] text-gray-500 font-bold uppercase tracking-wider border-b border-white/[0.03] pb-2">
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2 text-center">Side</th>
                      <th className="pb-2 text-right">Size (Lots)</th>
                      <th className="pb-2 text-right">Entry Price</th>
                      <th className="pb-2 text-right">Mark Price</th>
                      <th className="pb-2 text-right">SL</th>
                      <th className="pb-2 text-right">TP</th>
                      <th className="pb-2 text-right">P&L (USD)</th>
                      <th className="pb-2 text-right">P&L (%)</th>
                      <th className="pb-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {positions.map(p => (
                      <tr key={p.id} className="text-[11px] hover:bg-white/[0.01] transition-colors group">
                        <td className="py-2.5 font-bold text-white font-mono">{p.symbol}</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                            p.side === 'Buy' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {p.side}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-gray-300">{p.size.toFixed(2)}</td>
                        <td className="py-2.5 text-right font-mono text-gray-300">
                          {p.entryPrice.toLocaleString(undefined, { minimumFractionDigits: p.symbol.includes('USD') && !p.symbol.includes('BTC') ? 5 : 2 })}
                        </td>
                        <td className="py-2.5 text-right font-mono text-white font-semibold">
                          {p.markPrice.toLocaleString(undefined, { minimumFractionDigits: p.symbol.includes('USD') && !p.symbol.includes('BTC') ? 5 : 2 })}
                        </td>
                        <td className="py-2.5 text-right font-mono text-gray-500">{p.sl > 0 ? p.sl : '-'}</td>
                        <td className="py-2.5 text-right font-mono text-gray-500">{p.tp > 0 ? p.tp : '-'}</td>
                        <td className={`py-2.5 text-right font-mono font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.pnl >= 0 ? '+$' : '-$'}{Math.abs(p.pnl).toFixed(2)}
                        </td>
                        <td className={`py-2.5 text-right font-mono font-bold ${p.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.pnlPercent >= 0 ? '+' : ''}{p.pnlPercent}%
                        </td>
                        <td className="py-2.5 text-center">
                          <button 
                            onClick={() => handleClosePosition(p.id, p.pnl)}
                            className="px-2 py-0.5 border border-rose-500/20 hover:bg-rose-500/10 text-[9px] font-bold text-rose-400 rounded hover:text-white transition-all cursor-pointer focus:outline-none"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}

                    {positions.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-xs text-gray-600 font-semibold">
                          No active positions. Execute a BUY or SELL order on the right ticket.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Row */}
              {positions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center justify-between text-[11px] font-semibold text-gray-500">
                  <div className="flex gap-4">
                    <span>Total P&L:</span>
                    <span className={`font-mono font-extrabold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {totalPnl >= 0 ? '+$' : '-$'}{Math.abs(totalPnl).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD ({currentPnlPercent >= 0 ? '+' : ''}{currentPnlPercent}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders List widget (4 Columns) */}
            <div className="xl:col-span-4 bg-[#050507]/20 p-4">
              <span className="text-xs font-bold text-white tracking-wide uppercase block text-left mb-3">Recent Orders</span>
              
              <div className="overflow-x-auto max-h-[160px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] text-gray-500 font-bold uppercase tracking-wider border-b border-white/[0.03] pb-2">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2 text-center">Side</th>
                      <th className="pb-2 text-right">Lots</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {recentOrders.map((ro, i) => (
                      <tr key={i} className="text-[10.5px] font-mono hover:bg-white/[0.01] transition-colors">
                        <td className="py-2 text-gray-500">{ro.time}</td>
                        <td className="py-2 font-bold text-white">{ro.symbol}</td>
                        <td className="py-2 text-center">
                          <span className={`font-bold ${ro.side === 'Buy' ? 'text-blue-400' : 'text-rose-400'}`}>
                            {ro.side}
                          </span>
                        </td>
                        <td className="py-2 text-right text-gray-300">{ro.size.toFixed(2)}</td>
                        <td className="py-2 text-right text-white">{ro.price.toLocaleString(undefined, { minimumFractionDigits: ro.symbol.includes('USD') && !ro.symbol.includes('BTC') ? 5 : 2 })}</td>
                        <td className="py-2 text-center">
                          <span className={`px-1 rounded text-[8.5px] font-bold ${
                            ro.status === 'Filled' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : ro.status === 'Canceled' 
                                ? 'bg-zinc-800 text-zinc-500' 
                                : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {ro.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* THIRD COLUMN: ORDER BOOK & TICKER (Right Pane Sub-split) */}
        {/* ======================================================== */}
        <div className="w-[380px] bg-[#050507] border-l border-white/[0.04] flex flex-col shrink-0 hidden xl:flex">
          
          {/* 1. ORDER BOOK PANEL */}
          <div className="p-4 border-b border-white/[0.04] flex-grow flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-bold text-white tracking-wide uppercase">Order Book</span>
              
              {/* Selector dropdown (Image 5 style) */}
              <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/5 rounded text-[10px] text-gray-400 cursor-pointer">
                <span>0.00001</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </div>

            {/* Order book table headers */}
            <div className="grid grid-cols-3 text-[9px] text-gray-500 font-bold uppercase tracking-wider pb-1.5 border-b border-white/[0.03]">
              <span className="text-left">Price</span>
              <span className="text-right">Size (Lots)</span>
              <span className="text-right">Total (Lots)</span>
            </div>

            {/* Asks (Sell orders in Red) */}
            <div className="space-y-[1.5px] py-1.5 overflow-hidden">
              {getOrderBookAsks().map((ask, idx) => (
                <div key={`ask-${idx}`} className="grid grid-cols-3 text-[11px] font-mono relative py-[1px]">
                  {/* Cumulated volume indicator bar background */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-rose-500/5 transition-all duration-300"
                    style={{ width: `${ask.cumPercentage}%` }}
                  />
                  <span className="text-rose-500 text-left font-bold z-10">{ask.price}</span>
                  <span className="text-gray-400 text-right z-10">{ask.size.toFixed(2)}</span>
                  <span className="text-gray-600 text-right z-10">{ask.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Middle active spread indicator (Spread bar matches Image 5) */}
            <div className="my-1.5 py-1.5 px-2 bg-black/40 border-y border-white/[0.03] flex items-center justify-between text-xs font-mono">
              <span className="text-rose-500 font-extrabold flex items-center gap-1">
                <span>{activeTicker.price}</span>
                <span>▼</span>
              </span>
              <span className="text-gray-500 text-[10px] font-bold">0.1 Spread</span>
              <span className="text-blue-500 font-extrabold flex items-center gap-1">
                <span>{(activeTicker.price + 0.00001).toLocaleString(undefined, { minimumFractionDigits: activeTicker.symbol.includes('USD') && !activeTicker.symbol.includes('BTC') ? 5 : 2 })}</span>
                <span>▲</span>
              </span>
            </div>

            {/* Bids (Buy orders in Blue) */}
            <div className="space-y-[1.5px] py-1.5 overflow-hidden">
              {getOrderBookBids().map((bid, idx) => (
                <div key={`bid-${idx}`} className="grid grid-cols-3 text-[11px] font-mono relative py-[1px]">
                  {/* Cumulated volume indicator bar background */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-blue-500/5 transition-all duration-300"
                    style={{ width: `${bid.cumPercentage}%` }}
                  />
                  <span className="text-blue-400 text-left font-bold z-10">{bid.price}</span>
                  <span className="text-gray-400 text-right z-10">{bid.size.toFixed(2)}</span>
                  <span className="text-gray-600 text-right z-10">{bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Depth mountain chart (Mountain volumes representation bottom of order book) */}
            <div className="h-16 mt-auto border-t border-white/[0.03] pt-2 relative overflow-hidden flex items-end">
              <svg className="w-full h-12 text-gray-500 opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                {/* Red Ask Depth on left */}
                <path d="M 0 20 L 0 5 L 45 15 L 50 20 Z" fill="#ef4444" />
                {/* Blue Bid Depth on right */}
                <path d="M 100 20 L 100 8 L 55 16 L 50 20 Z" fill="#3b82f6" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[8px] text-gray-600 font-mono">
                <span>20.0</span>
                <span>10.0</span>
                <span>0</span>
                <span>10.0</span>
                <span>20.0</span>
              </div>
            </div>
          </div>

          {/* 2. ORDER TICKET ACTION FORM PANEL (Right Side) */}
          <div className="p-4 bg-black/40 border-t border-white/[0.04]">
            
            {/* Header Tabs standard vs TradingView */}
            <div className="grid grid-cols-2 bg-black border border-white/5 rounded p-0.5 mb-3">
              <button className="text-[10px] font-bold py-1 bg-[#09090d] text-white border border-white/5 rounded focus:outline-none cursor-pointer">
                STANDARD
              </button>
              <button 
                className="text-[10px] font-bold py-1 text-gray-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
                onClick={() => triggerToast('Switching chart layout (Simulated)', 'info')}
              >
                TRADINGVIEW
              </button>
            </div>

            {/* Buy/Sell giant selector toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setOrderMode('Buy')}
                className={`py-2 text-[11px] font-extrabold rounded tracking-wider cursor-pointer focus:outline-none transition-all ${
                  orderMode === 'Buy' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'bg-zinc-900 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setOrderMode('Sell')}
                className={`py-2 text-[11px] font-extrabold rounded tracking-wider cursor-pointer focus:outline-none transition-all ${
                  orderMode === 'Sell' 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/10' 
                    : 'bg-zinc-900 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Order types selector chips */}
            <div className="grid grid-cols-4 gap-1 bg-black border border-white/5 rounded p-0.5 mb-4 text-[10px] font-bold text-gray-500">
              {(['Market', 'Limit', 'Stop', 'Stop Limit'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`py-1 rounded transition-colors focus:outline-none cursor-pointer ${
                    orderType === type 
                      ? 'bg-[#09090d] text-white border border-white/5' 
                      : 'hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Form Field inputs */}
            <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-left">
              
              {/* Available Margin */}
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-500 font-semibold">Available Margin</span>
                <span className="font-mono text-white font-bold">$67,000.24</span>
              </div>

              {/* Volume Lots Input */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Volume (Lots)</span>
                <div className="flex items-center bg-black border border-white/5 focus-within:border-blue-500/40 rounded overflow-hidden">
                  <button 
                    type="button" 
                    onClick={() => adjustVolume(-0.01)}
                    className="px-3.5 py-2.5 bg-zinc-900/40 text-gray-400 hover:text-white font-bold border-r border-white/5 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    required
                    value={volumeLots}
                    onChange={(e) => setVolumeLots(e.target.value)}
                    className="w-full bg-transparent border-none text-center text-xs text-white font-mono font-bold focus:outline-none py-1.5"
                  />
                  <button 
                    type="button" 
                    onClick={() => adjustVolume(0.01)}
                    className="px-3.5 py-2.5 bg-zinc-900/40 text-gray-400 hover:text-white font-bold border-l border-white/5 focus:outline-none"
                  >
                    +
                  </button>
                </div>

                {/* Quick select volume buttons */}
                <div className="grid grid-cols-4 gap-1.5 text-[9.5px] font-mono font-bold text-gray-400">
                  {['0.01', '0.10', '1.00', '10.00'].map(lots => (
                    <button
                      key={lots}
                      type="button"
                      onClick={() => setVolumeLots(lots)}
                      className="py-1 bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 rounded text-center transition-colors focus:outline-none cursor-pointer"
                    >
                      {lots}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leverage Selector Dropdown */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Leverage</span>
                <div className="flex items-center justify-between px-3.5 py-2 bg-black border border-white/5 rounded text-xs text-white font-mono cursor-pointer">
                  <span>{leverage}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>

                {/* Leverage Slider (Image 5 style with labels) */}
                <div className="pt-2 px-1 relative">
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={leverageValue}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setLeverageValue(val);
                      setLeverage(`${val}:1`);
                    }}
                    className="w-full h-[3px] bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[8px] text-gray-600 font-mono font-bold mt-1.5">
                    <span>1x</span>
                    <span>10x</span>
                    <span>25x</span>
                    <span className="text-blue-400">50x</span>
                    <span>100x</span>
                    <span>200x</span>
                  </div>
                </div>
              </div>

              {/* Stop Loss & Take Profit Settings (Collapsible checked forms) */}
              <div className="space-y-2.5 border-t border-white/[0.03] pt-3">
                
                {/* Stop Loss checkbox + fields */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stop-loss-chk"
                      checked={setStopLoss}
                      onChange={(e) => setSetStopLoss(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-black border border-white/5 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="stop-loss-chk" className="text-[10px] text-gray-400 font-bold uppercase cursor-pointer select-none">
                      Set Stop Loss
                    </label>
                  </div>

                  {setStopLoss && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-black border border-white/5 rounded overflow-hidden">
                        <button type="button" onClick={() => adjustSLPrice(-1)} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-r border-white/5 text-[11px]">-</button>
                        <input
                          type="text"
                          value={stopLossPrice}
                          onChange={(e) => setStopLossPrice(e.target.value)}
                          className="w-full bg-transparent border-none text-center text-[11px] text-white font-mono focus:outline-none py-1"
                        />
                        <button type="button" onClick={() => adjustSLPrice(1)} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-l border-white/5 text-[11px]">+</button>
                      </div>
                      
                      <div className="flex items-center bg-black border border-white/5 rounded overflow-hidden">
                        <button type="button" onClick={() => setStopLossPips(prev => (parseFloat(prev) - 0.5).toFixed(1))} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-r border-white/5 text-[11px]">-</button>
                        <input
                          type="text"
                          value={stopLossPips}
                          onChange={(e) => setStopLossPips(e.target.value)}
                          className="w-full bg-transparent border-none text-center text-[11px] text-gray-400 font-mono focus:outline-none py-1"
                        />
                        <button type="button" onClick={() => setStopLossPips(prev => (parseFloat(prev) + 0.5).toFixed(1))} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-l border-white/5 text-[11px]">+</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Take Profit checkbox + fields */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="take-profit-chk"
                      checked={setTakeProfit}
                      onChange={(e) => setSetTakeProfit(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-black border border-white/5 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="take-profit-chk" className="text-[10px] text-gray-400 font-bold uppercase cursor-pointer select-none">
                      Set Take Profit
                    </label>
                  </div>

                  {setTakeProfit && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-black border border-white/5 rounded overflow-hidden">
                        <button type="button" onClick={() => adjustTPPrice(-1)} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-r border-white/5 text-[11px]">-</button>
                        <input
                          type="text"
                          value={takeProfitPrice}
                          onChange={(e) => setTakeProfitPrice(e.target.value)}
                          className="w-full bg-transparent border-none text-center text-[11px] text-white font-mono focus:outline-none py-1"
                        />
                        <button type="button" onClick={() => adjustTPPrice(1)} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-l border-white/5 text-[11px]">+</button>
                      </div>
                      
                      <div className="flex items-center bg-black border border-white/5 rounded overflow-hidden">
                        <button type="button" onClick={() => setTakeProfitPips(prev => (parseFloat(prev) - 0.5).toFixed(1))} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-r border-white/5 text-[11px]">-</button>
                        <input
                          type="text"
                          value={takeProfitPips}
                          onChange={(e) => setTakeProfitPips(e.target.value)}
                          className="w-full bg-transparent border-none text-center text-[11px] text-gray-400 font-mono focus:outline-none py-1"
                        />
                        <button type="button" onClick={() => setTakeProfitPips(prev => (parseFloat(prev) + 0.5).toFixed(1))} className="px-2 py-1 bg-zinc-900/40 text-gray-400 hover:text-white border-l border-white/5 text-[11px]">+</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-extrabold transition-all cursor-pointer shadow-lg tracking-wider text-center flex flex-col items-center justify-center ${
                  orderMode === 'Buy' 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10' 
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10'
                }`}
              >
                <span className="text-xs uppercase">{orderMode} {activeTicker.symbol}</span>
                <span className="text-[9px] font-medium text-white/70 block mt-0.5">@ {orderType}</span>
              </button>

              {/* Details and commission */}
              <div className="flex flex-col gap-1.5 text-[10px] text-gray-500 font-semibold border-t border-white/[0.03] pt-3">
                <div className="flex justify-between items-center">
                  <span>Required Margin</span>
                  <span className="font-mono text-white">$2,178.90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Est. Cost (Commission)</span>
                  <span className="font-mono text-white">$3.50</span>
                </div>
              </div>

            </form>

          </div>

        </div>

      </div>

      {/* 3. PLATFORM SYSTEM STATUS FOOTER */}
      <footer className="h-8 bg-[#050507] border-t border-white/[0.05] flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono shrink-0 select-none z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-gray-400">Connection</span>
          <span className="text-emerald-400">● Live</span>
          
          <span className="h-3 w-[1px] bg-white/10 mx-3" />
          
          <span className="text-gray-400 font-bold">News:</span>
          <marquee className="w-96 text-[9.5px] text-gray-500" scrollamount="3">
            ECB President Christine Lagarde Speech in 30 minutes • US Federal Reserve updates key overnight benchmark borrowing rates • crude oil prices jump 1.2% amidst OPEC production cut forecasts • bitcoin targets psychological resistance at $68k region.
          </marquee>
        </div>

        <div className="flex items-center gap-6">
          <span>Server Time: <span className="text-gray-300 font-bold">{currentTimeStr} (UTC+0)</span></span>
          <div className="flex items-center gap-1">
            <span>Data powered by</span>
            <span className="text-blue-400 font-extrabold flex items-center gap-1">
              <span>Vertex Liquidity Hub</span>
              <span className="w-1 h-1 rounded-full bg-blue-500" />
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
