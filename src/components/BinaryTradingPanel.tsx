import { useEffect, useState } from 'react';
import {
  connectTradingSocket,
  createDeposit,
  createWithdrawal,
  fetchTradingAssets,
  fetchTradingProfile,
  fetchTrades,
  placeBinaryTrade,
  type Trade,
  type TradingAsset,
  type WalletSummary,
} from '../api/trading';

type Props = {
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
};

export default function BinaryTradingPanel({ onToast }: Props) {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [assets, setAssets] = useState<TradingAsset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState('EURUSD');
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP');
  const [amount, setAmount] = useState('25');
  const [expiry, setExpiry] = useState(60);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  const toast = (msg: string, type: 'success' | 'error' | 'info' = 'info') =>
    onToast?.(msg, type);

  async function refresh() {
    const [profile, assetList, tradeList] = await Promise.all([
      fetchTradingProfile(),
      fetchTradingAssets(),
      fetchTrades(),
    ]);
    setWallet(profile.wallet);
    setStats(profile.stats || {});
    setAssets(assetList);
    setTrades(tradeList);
    if (assetList[0] && !assetList.find((a) => a.symbol === symbol)) {
      setSymbol(assetList[0].symbol);
    }
  }

  useEffect(() => {
    refresh().catch((err) => toast(err.message || 'Failed to load trading data', 'error'));

    const ws = connectTradingSocket((msg: any) => {
      if (msg?.type === 'tick' && msg.symbol === symbol) {
        setLivePrice(msg.price);
      }
      if (msg?.type === 'trade_settled') {
        refresh().catch(() => undefined);
        toast(
          msg.trade?.status === 'WON'
            ? `Won ${msg.trade.symbol} +$${Number(msg.trade.payoutAmount || 0).toFixed(2)}`
            : `Lost ${msg.trade?.symbol}`,
          msg.trade?.status === 'WON' ? 'success' : 'error',
        );
      }
    });

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbols: [symbol, 'EURUSD', 'BTCUSD', 'XAUUSD'] }));
    };

    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const selected = assets.find((a) => a.symbol === symbol);
  const expiries = selected?.expiryOptionsSec || [60, 180, 300];

  async function onTrade() {
    setBusy(true);
    try {
      const trade = await placeBinaryTrade({
        symbol,
        direction,
        amount: Number(amount),
        expirySeconds: expiry,
      });
      toast(`Opened ${trade.direction} ${trade.symbol}`, 'success');
      await refresh();
    } catch (err: any) {
      toast(err.message || 'Trade failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function onDeposit() {
    setBusy(true);
    try {
      await createDeposit(500, 'manual');
      toast('Deposited $500', 'success');
      await refresh();
    } catch (err: any) {
      toast(err.message || 'Deposit failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function onWithdraw() {
    setBusy(true);
    try {
      await createWithdrawal(50, { account: 'demo-bank' });
      toast('Withdrawal requested ($50)', 'info');
      await refresh();
    } catch (err: any) {
      toast(err.message || 'Withdraw failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Available" value={`$${(wallet?.availableBalance ?? 0).toLocaleString()}`} />
        <Metric label="Locked" value={`$${(wallet?.lockedBalance ?? 0).toLocaleString()}`} />
        <Metric label="Win rate" value={`${stats.winRate ?? 0}%`} />
        <Metric label="Open trades" value={String(stats.open ?? 0)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Live price</p>
              <h3 className="text-3xl font-semibold text-white">
                {symbol}{' '}
                <span className="text-brand-blue">
                  {livePrice != null ? livePrice.toFixed(5) : '—'}
                </span>
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onDeposit}
                disabled={busy}
                className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300 border border-emerald-500/30"
              >
                + $500
              </button>
              <button
                type="button"
                onClick={onWithdraw}
                disabled={busy}
                className="rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300 border border-white/10"
              >
                Withdraw $50
              </button>
            </div>
          </div>

          <label className="block text-sm text-gray-400">
            Asset
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.symbol}>
                  {a.symbol} · {a.payoutPercent}% {a.is_otc ? '(OTC)' : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-gray-400">
            Amount (USD)
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min={1}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            />
          </label>

          <label className="block text-sm text-gray-400">
            Expiry
            <select
              value={expiry}
              onChange={(e) => setExpiry(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            >
              {expiries.map((s) => (
                <option key={s} value={s}>
                  {s < 60 ? `${s}s` : `${s / 60}m`}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDirection('UP')}
              className={`rounded-xl py-3 font-semibold border ${
                direction === 'UP'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              UP / CALL
            </button>
            <button
              type="button"
              onClick={() => setDirection('DOWN')}
              className={`rounded-xl py-3 font-semibold border ${
                direction === 'DOWN'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              DOWN / PUT
            </button>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onTrade}
            className="w-full rounded-xl bg-brand-blue py-3 font-semibold text-black disabled:opacity-50"
          >
            {busy ? 'Working…' : `Place ${direction} trade`}
          </button>
          <p className="text-xs text-gray-500">
            Payout {selected?.payoutPercent ?? 80}% · Min ${selected?.minAmount ?? 1}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recent trades
          </h4>
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {trades.length === 0 && (
              <p className="text-sm text-gray-500">No trades yet. Place your first binary trade.</p>
            )}
            {trades.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                <div>
                  <p className="text-sm text-white">
                    {t.direction} {t.symbol}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    ${t.amount} · {t.status}
                    {t.status === 'OPEN'
                      ? ` · ends ${new Date(t.expiresAt).toLocaleTimeString()}`
                      : ''}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    t.status === 'WON'
                      ? 'text-emerald-400'
                      : t.status === 'LOST'
                        ? 'text-rose-400'
                        : 'text-amber-300'
                  }`}
                >
                  {t.status === 'WON'
                    ? `+$${t.payoutAmount.toFixed(2)}`
                    : t.status === 'OPEN'
                      ? 'OPEN'
                      : 'LOST'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b10] p-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
