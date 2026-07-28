import { useEffect, useState } from 'react';
import {
  adminForceSettle,
  adminListKyc,
  adminListWithdrawals,
  adminOpenTrades,
  adminResolveWithdrawal,
  adminReviewKyc,
  adminTradingReports,
  adminUpdatePayout,
  fetchTradingAssets,
} from '../../api/trading';

export default function AdminTradingOps({ mode }: { mode: string }) {
  const [reports, setReports] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [kyc, setKyc] = useState<any[]>([]);
  const [openTrades, setOpenTrades] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [payoutSymbol, setPayoutSymbol] = useState('EURUSD');
  const [payoutPct, setPayoutPct] = useState('80');

  async function refresh() {
    const [r, w, k, o, a] = await Promise.all([
      adminTradingReports().catch(() => null),
      adminListWithdrawals().catch(() => []),
      adminListKyc().catch(() => []),
      adminOpenTrades().catch(() => []),
      fetchTradingAssets().catch(() => []),
    ]);
    setReports(r);
    setWithdrawals(w || []);
    setKyc(k || []);
    setOpenTrades(o || []);
    setAssets(a || []);
  }

  useEffect(() => {
    refresh().catch((e) => setMsg(e.message));
  }, [mode]);

  return (
    <div className="space-y-6">
      {msg && <p className="text-sm text-amber-300">{msg}</p>}

      {(mode === 'reports' || mode === 'dashboard' || mode === 'analytics') && reports && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Users" value={String(reports.users)} />
          <Card label="Trade volume" value={`$${Number(reports.trades?.volume || 0).toLocaleString()}`} />
          <Card label="Open trades" value={String(reports.trades?.open || 0)} />
          <Card
            label="Pending withdrawals"
            value={String(reports.withdrawals?.pending || 0)}
          />
        </div>
      )}

      {(mode === 'withdrawals' || mode === 'transactions') && (
        <Panel title="Withdrawal approvals">
          {withdrawals.filter((w) => w.status === 'PENDING').length === 0 && (
            <p className="text-sm text-gray-500">No pending withdrawals.</p>
          )}
          {withdrawals
            .filter((w) => w.status === 'PENDING')
            .map((w) => (
              <Row
                key={w.id}
                title={`$${Number(w.amount).toFixed(2)} · ${w.user_id}`}
                subtitle={w.method}
                actions={
                  <>
                    <Btn
                      label="Approve"
                      onClick={async () => {
                        await adminResolveWithdrawal(w.id, true);
                        await refresh();
                      }}
                    />
                    <Btn
                      label="Reject"
                      danger
                      onClick={async () => {
                        await adminResolveWithdrawal(w.id, false);
                        await refresh();
                      }}
                    />
                  </>
                }
              />
            ))}
        </Panel>
      )}

      {mode === 'kyc' && (
        <Panel title="KYC queue">
          {kyc.filter((x) => x.status === 'PENDING').length === 0 && (
            <p className="text-sm text-gray-500">No pending KYC.</p>
          )}
          {kyc
            .filter((x) => x.status === 'PENDING')
            .map((x) => (
              <Row
                key={x.id}
                title={`${x.document_type} · ${x.user_id}`}
                subtitle={new Date(x.created_at).toLocaleString()}
                actions={
                  <>
                    <Btn
                      label="Approve"
                      onClick={async () => {
                        await adminReviewKyc(x.id, true);
                        await refresh();
                      }}
                    />
                    <Btn
                      label="Reject"
                      danger
                      onClick={async () => {
                        await adminReviewKyc(x.id, false, 'Docs unclear');
                        await refresh();
                      }}
                    />
                  </>
                }
              />
            ))}
        </Panel>
      )}

      {(mode === 'live-trades' || mode === 'orders' || mode === 'positions') && (
        <Panel title="Open trades · force settle">
          {openTrades.length === 0 && <p className="text-sm text-gray-500">No open trades.</p>}
          {openTrades.map((t) => (
            <Row
              key={t.id}
              title={`${t.direction} ${t.symbol} · $${t.amount}`}
              subtitle={`Expires ${new Date(t.expiresAt).toLocaleTimeString()}`}
              actions={
                <>
                  <Btn
                    label="Force WIN"
                    onClick={async () => {
                      await adminForceSettle(t.id, 'WON');
                      await refresh();
                    }}
                  />
                  <Btn
                    label="Force LOSS"
                    danger
                    onClick={async () => {
                      await adminForceSettle(t.id, 'LOST');
                      await refresh();
                    }}
                  />
                </>
              }
            />
          ))}
        </Panel>
      )}

      {(mode === 'assets' || mode === 'settings') && (
        <Panel title="Payout controls">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={payoutSymbol}
              onChange={(e) => setPayoutSymbol(e.target.value)}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.symbol}>
                  {a.symbol} ({a.payoutPercent}%)
                </option>
              ))}
            </select>
            <input
              value={payoutPct}
              onChange={(e) => setPayoutPct(e.target.value)}
              className="w-24 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
            <Btn
              label="Update payout %"
              onClick={async () => {
                await adminUpdatePayout(payoutSymbol, Number(payoutPct));
                setMsg(`Updated ${payoutSymbol} payout to ${payoutPct}%`);
                await refresh();
              }}
            />
          </div>
        </Panel>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Row({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 px-3 py-2">
      <div>
        <p className="text-sm text-white">{title}</p>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}

function Btn({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void | Promise<void>;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium border ${
        danger
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue'
      }`}
    >
      {label}
    </button>
  );
}
