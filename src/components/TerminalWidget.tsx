import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticker, Position, TradeHistoryItem } from '../types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Activity, X, RotateCcw, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface TerminalWidgetProps {
  selectedTicker: Ticker;
  onTickerSelect: (ticker: Ticker) => void;
}

const TIMEFRAMES = ['1M', '5M', '15M', '1H', '1D'];

export default function TerminalWidget({ selectedTicker, onTickerSelect }: TerminalWidgetProps) {
  // Simulator State
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('vertex_sim_balance');
    return saved ? parseFloat(saved) : 10000.00;
  });
  
  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('vertex_sim_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<TradeHistoryItem[]>(() => {
    const saved = localStorage.getItem('vertex_sim_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [timeframe, setTimeframe] = useState<string>('5M');
  const [tradeAmount, setTradeAmount] = useState<number>(100);
  const [leverage, setLeverage] = useState<number>(100);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Local historical chart coordinates generated dynamically for each symbol
  const [chartData, setChartData] = useState<number[]>([]);
  const chartPointsLimit = 40;

  // Persist State
  useEffect(() => {
    localStorage.setItem('vertex_sim_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('vertex_sim_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('vertex_sim_history', JSON.stringify(history));
  }, [history]);

  // Generate baseline chart data when selected symbol changes
  useEffect(() => {
    const base = selectedTicker.price;
    const initialPoints: number[] = [];
    let current = base - (selectedTicker.change * 0.015 * base);
    for (let i = 0; i < chartPointsLimit; i++) {
      const noise = (Math.random() - 0.48) * (base * 0.001);
      current += noise;
      initialPoints.push(current);
    }
    // Set final point to match current live ticker price exactly
    initialPoints[initialPoints.length - 1] = base;
    setChartData(initialPoints);
  }, [selectedTicker.symbol]);

  // Add new ticks to chart dynamically when selectedTicker changes price
  useEffect(() => {
    setChartData(prev => {
      if (prev.length === 0) return [selectedTicker.price];
      const nextData = [...prev];
      nextData[nextData.length - 1] = selectedTicker.price; // Update last item to live tick
      
      // Every 3 seconds, lock point and append next if ticker changes significantly, or limit
      if (Math.random() > 0.4) {
        nextData.push(selectedTicker.price);
        if (nextData.length > chartPointsLimit) {
          nextData.shift();
        }
      }
      return nextData;
    });

    // Update active positions PnL
    setPositions(currentPositions => 
      currentPositions.map(pos => {
        if (pos.symbol === selectedTicker.symbol) {
          const entry = pos.entryPrice;
          const current = selectedTicker.price;
          let pnlPercent = 0;
          if (pos.type === 'BUY') {
            pnlPercent = ((current - entry) / entry) * pos.leverage;
          } else {
            pnlPercent = ((entry - current) / entry) * pos.leverage;
          }
          const pnlValue = pos.amount * pnlPercent;
          return {
            ...pos,
            currentPrice: current,
            pnl: Number(pnlValue.toFixed(2)),
          };
        }
        return pos;
      })
    );
  }, [selectedTicker.price]);

  // Handle placing a simulated trade
  const handlePlaceOrder = (type: 'BUY' | 'SELL') => {
    if (tradeAmount <= 0) {
      triggerAlert('Amount must be positive', 'error');
      return;
    }
    if (tradeAmount > balance) {
      triggerAlert('Insufficient simulation balance', 'error');
      return;
    }

    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      symbol: selectedTicker.symbol,
      type,
      entryPrice: selectedTicker.price,
      currentPrice: selectedTicker.price,
      amount: tradeAmount,
      leverage,
      pnl: 0,
      timestamp: new Date().toLocaleTimeString(),
    };

    setBalance(prev => Number((prev - tradeAmount).toFixed(2)));
    setPositions(prev => [newPosition, ...prev]);
    triggerAlert(`Executed simulator ${type} order for ${selectedTicker.symbol}`, 'success');
  };

  // Close an active position
  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    // Return margin plus PnL
    const payout = pos.amount + pos.pnl;
    setBalance(prev => Number((prev + payout).toFixed(2)));

    // Add to history
    const historyItem: TradeHistoryItem = {
      id: pos.id,
      symbol: pos.symbol,
      type: pos.type,
      entryPrice: pos.entryPrice,
      exitPrice: pos.currentPrice,
      amount: pos.amount,
      leverage: pos.leverage,
      pnl: pos.pnl,
      timestamp: new Date().toLocaleTimeString(),
      status: 'CLOSED',
    };

    setHistory(prev => [historyItem, ...prev]);
    setPositions(prev => prev.filter(p => p.id !== id));
    triggerAlert(`Closed simulation position with PnL of $${pos.pnl.toFixed(2)}`, pos.pnl >= 0 ? 'success' : 'info');
  };

  // Reset simulator
  const handleResetSimulator = () => {
    setBalance(10000.00);
    setPositions([]);
    setHistory([]);
    triggerAlert('Simulation account reset to $10,000.00', 'info');
  };

  const triggerAlert = (text: string, type: 'success' | 'error' | 'info') => {
    setAlertMsg({ text, type });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // Render SVG charts
  const renderChart = () => {
    if (chartData.length === 0) return null;

    const width = 600;
    const height = 240;
    const minVal = Math.min(...chartData);
    const maxVal = Math.max(...chartData);
    const valueRange = maxVal - minVal || 1;

    // Convert values to SVG coordinate string
    const pointsStr = chartData
      .map((val, idx) => {
        const x = (idx / (chartData.length - 1)) * width;
        const y = height - ((val - minVal) / valueRange) * (height - 30) - 15;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const linePath = `M ${pointsStr}`;
    const fillPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    const isPositive = selectedTicker.change >= 0;
    const chartColor = isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg className="w-full h-full overflow-visible select-none" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFillGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const y = ratio * height;
          const value = maxVal - ratio * valueRange;
          return (
            <g key={i} className="opacity-10">
              <line x1="0" y1={y} x2={width} y2={y} stroke="#ffffff" strokeDasharray="3 3" strokeWidth="1" />
              <text x={width - 5} y={y - 4} fill="#ffffff" className="font-mono text-[9px]" textAnchor="end">
                {value.toLocaleString(undefined, { minimumFractionDigits: selectedTicker.digits, maximumFractionDigits: selectedTicker.digits })}
              </text>
            </g>
          );
        })}

        {/* Dynamic Glowing Area Fill */}
        <path d={fillPath} fill="url(#chartFillGlow)" />

        {/* Dynamic Glowing Line Path */}
        <path
          d={linePath}
          fill="none"
          stroke={chartColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing indicator at current live price */}
        {chartData.length > 0 && (
          <g transform={`translate(${width}, ${height - ((chartData[chartData.length - 1] - minVal) / valueRange) * (height - 30) - 15})`}>
            <circle cx="0" cy="0" r="6" fill={chartColor} className="animate-ping opacity-75" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
            <circle cx="0" cy="0" r="2.5" fill={chartColor} />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/[0.08] bg-[#07070a]/90 shadow-2xl p-6 relative w-full" id="terminal">
      
      {/* Simulation Header Alerts */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border flex items-center gap-2 text-xs font-semibold shadow-lg ${
              alertMsg.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                : alertMsg.type === 'error'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                : 'bg-brand-blue/10 text-brand-blue border-brand-blue/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Chart Display and History/Positions (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Chart Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-xl text-white tracking-wide">{selectedTicker.symbol}</span>
              <span className="font-sans text-xs text-gray-400">{selectedTicker.name}</span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${selectedTicker.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {selectedTicker.change >= 0 ? '+' : ''}{selectedTicker.change}%
              </span>
            </div>

            {/* Interval Toggles */}
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-lg">
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-[10px] font-mono font-medium rounded-md transition-all ${
                    timeframe === tf ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Canvas container */}
          <div className="h-60 w-full relative bg-white/[0.005] border border-white/[0.03] rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            {renderChart()}
          </div>

          {/* Ticker Bottom Quick Switch Panel */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 border-b border-white/[0.04]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex-shrink-0">Quick Assets:</span>
            {['EURUSD', 'XAUUSD', 'BTCUSD', 'GBPUSD'].map(sym => {
              const isActive = selectedTicker.symbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => {
                    const found = [
                      { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.08945, change: 0.47, digits: 5, high: 1.091, low: 1.083 },
                      { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2384.65, change: 0.62, digits: 2, high: 2392, low: 2365 },
                      { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: 67842.10, change: 1.08, digits: 2, high: 68350, low: 66500 },
                      { symbol: 'GBPUSD', name: 'Great British Pound / US Dollar', price: 1.27482, change: 0.35, digits: 5, high: 1.278, low: 1.268 }
                    ].find(t => t.symbol === sym);
                    if (found) onTickerSelect(found as Ticker);
                  }}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold border transition-all ${
                    isActive ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30' : 'text-gray-400 border-white/[0.05] hover:text-white hover:border-white/10'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          {/* Positions & History Logs */}
          <div className="flex-1 mt-2">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
              <span className="font-display font-semibold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-blue" />
                Active Simulation Positions ({positions.length})
              </span>
              {positions.length > 0 && (
                <span className={`text-xs font-mono font-bold ${
                  positions.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  Total PnL: ${positions.reduce((acc, p) => acc + p.pnl, 0).toFixed(2)}
                </span>
              )}
            </div>

            {positions.length === 0 ? (
              <div className="py-10 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/[0.05]">
                <p className="text-gray-500 font-sans text-xs">No open simulated positions. Use the right-hand trading desk panel to place BUY/SELL orders.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.04]">
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Lev</th>
                      <th className="pb-2">Entry Price</th>
                      <th className="pb-2">Current</th>
                      <th className="pb-2 text-right">PnL (USD)</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(pos => {
                      const isProfit = pos.pnl >= 0;
                      return (
                        <tr key={pos.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                          <td className="py-2.5 font-bold text-white">{pos.symbol}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {pos.type}
                            </span>
                          </td>
                          <td className="py-2.5 font-mono text-gray-400">{pos.leverage}x</td>
                          <td className="py-2.5 font-mono text-gray-400">{pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-2.5 font-mono text-gray-200">{pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className={`py-2.5 font-mono text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleClosePosition(pos.id)}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Virtual Balance and Order Form (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-6 lg:pt-0 lg:pl-6 text-left">
          
          {/* Virtual Wallet Indicator */}
          <div className="bg-[#0b0b10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-blue/5 rounded-full blur-lg pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-brand-blue" />
                Demo Account Balance
              </span>
              <button
                onClick={handleResetSimulator}
                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                title="Reset simulation data"
                id="btn-reset-balance"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight flex items-baseline gap-1.5">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs text-gray-400 font-sans font-normal">USD</span>
            </div>
          </div>

          {/* Quick Order Desk Panel */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Execution Parameters</span>
              
              {/* Size Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Order Margin (USD):</span>
                  <span className="text-gray-500">Min: $10</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0d0d12] border border-white/[0.08] rounded-lg pl-8 pr-12 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-blue/50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {[50, 100, 500].map(val => (
                      <button
                        key={val}
                        onClick={() => setTradeAmount(val)}
                        className="px-1.5 py-1 rounded bg-white/5 text-[9px] font-mono font-bold text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leverage Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Leverage:</span>
                  <span className="text-brand-blue font-mono font-bold">{leverage}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="5"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full accent-brand-blue cursor-pointer h-1 bg-[#1a1a24] rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>1x (Raw)</span>
                  <span>100x</span>
                  <span>200x</span>
                  <span>500x (Max)</span>
                </div>
              </div>

              {/* Protective order bounds indicators (Simulated informational) */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg space-y-1.5 text-[11px] leading-relaxed text-gray-400">
                <div className="flex justify-between">
                  <span>Notional Value:</span>
                  <span className="font-mono text-white">${(tradeAmount * leverage).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Margin Call Price:</span>
                  <span className="font-mono text-rose-400">~{selectedTicker.change >= 0 ? (selectedTicker.price * 0.992).toFixed(4) : (selectedTicker.price * 1.008).toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Execute Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => handlePlaceOrder('BUY')}
                className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-500/15"
                id="btn-buy"
              >
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>BUY</span>
                </div>
                <span className="text-[10px] font-mono font-normal text-emerald-100">Long Market</span>
              </button>

              <button
                onClick={() => handlePlaceOrder('SELL')}
                className="py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 shadow-lg shadow-rose-500/15"
                id="btn-sell"
              >
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>SELL</span>
                </div>
                <span className="text-[10px] font-mono font-normal text-rose-100">Short Market</span>
              </button>
            </div>
          </div>

          {/* Trade History Log (Interactive mini collapsible display) */}
          {history.length > 0 && (
            <div className="border-t border-white/[0.04] pt-4 mt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">History Log</span>
              <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                {history.slice(0, 3).map((item, idx) => {
                  const win = item.pnl >= 0;
                  return (
                    <div key={idx} className="flex justify-between items-center text-[10px] border-b border-white/[0.02] pb-1.5">
                      <div className="text-left">
                        <span className="font-bold text-white block">{item.symbol}</span>
                        <span className="text-gray-500">{item.timestamp}</span>
                      </div>
                      <span className={`font-mono font-bold ${win ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {win ? '+' : ''}${item.pnl.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
