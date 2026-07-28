import { useEffect, useState } from 'react';
import {
  disable2FA,
  enable2FA,
  fetchNotifications,
  fetchReferral,
  fetchTournaments,
  fetchTradingProfile,
  joinTournament,
  markAllNotificationsRead,
  setup2FA,
  submitTradingKyc,
} from '../api/trading';

type Props = {
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onBack?: () => void;
  onLogout?: () => void;
};

export default function AccountHub({ onToast, onBack, onLogout }: Props) {
  const [tab, setTab] = useState<'security' | 'notifications' | 'referral' | 'tournaments' | 'kyc'>('security');
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [referral, setReferral] = useState<{ code: string; referrals: any[] } | null>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const toast = (m: string, t: 'success' | 'error' | 'info' = 'info') => onToast?.(m, t);

  async function refresh() {
    const [profile, notes, ref, tnm] = await Promise.all([
      fetchTradingProfile(),
      fetchNotifications(),
      fetchReferral(),
      fetchTournaments(),
    ]);
    setTwoFaEnabled(Boolean(profile.twoFa?.enabled));
    setNotifications(notes || []);
    setReferral(ref);
    setTournaments(tnm || []);
  }

  useEffect(() => {
    refresh().catch((e) => toast(e.message, 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button type="button" className="text-sm text-gray-400" onClick={onBack}>
          ← Back
        </button>
        <div className="flex gap-2 text-xs">
          {(['security', 'notifications', 'referral', 'tournaments', 'kyc'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 capitalize ${
                tab === t ? 'bg-brand-blue text-black' : 'bg-white/5 text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button type="button" className="text-sm text-gray-400" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {tab === 'security' && (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-4">
            <h2 className="text-lg font-semibold">Two-factor authentication</h2>
            <p className="text-sm text-gray-400">
              Status: {twoFaEnabled ? 'Enabled' : 'Disabled'}
            </p>
            {!twoFaEnabled && (
              <button
                type="button"
                disabled={busy}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm"
                onClick={async () => {
                  setBusy(true);
                  try {
                    const data = await setup2FA();
                    setQr(data.qrCodeDataUrl);
                    setSecret(data.secret);
                    toast('Scan the QR code in your authenticator app', 'info');
                  } catch (e: any) {
                    toast(e.message, 'error');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Setup 2FA
              </button>
            )}
            {qr && (
              <div className="space-y-3">
                <img src={qr} alt="2FA QR" className="w-40 h-40 rounded-lg bg-white p-2" />
                <p className="text-xs text-gray-500 break-all">Secret: {secret}</p>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                />
                <button
                  type="button"
                  className="rounded-xl bg-brand-blue px-4 py-2 text-sm text-black font-semibold"
                  onClick={async () => {
                    try {
                      await enable2FA(token);
                      setQr(null);
                      setToken('');
                      toast('2FA enabled', 'success');
                      await refresh();
                    } catch (e: any) {
                      toast(e.message, 'error');
                    }
                  }}
                >
                  Enable 2FA
                </button>
              </div>
            )}
            {twoFaEnabled && (
              <div className="flex gap-2 items-center">
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Code to disable"
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                />
                <button
                  type="button"
                  className="rounded-xl bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-sm text-rose-300"
                  onClick={async () => {
                    try {
                      await disable2FA(token);
                      setToken('');
                      toast('2FA disabled', 'info');
                      await refresh();
                    } catch (e: any) {
                      toast(e.message, 'error');
                    }
                  }}
                >
                  Disable
                </button>
              </div>
            )}
          </section>
        )}

        {tab === 'notifications' && (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button
                type="button"
                className="text-xs text-brand-blue"
                onClick={async () => {
                  await markAllNotificationsRead();
                  await refresh();
                }}
              >
                Mark all read
              </button>
            </div>
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="rounded-xl border border-white/5 p-3">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-400">{n.message}</p>
              </div>
            ))}
          </section>
        )}

        {tab === 'referral' && (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-3">
            <h2 className="text-lg font-semibold">Referral program</h2>
            <p className="text-sm text-gray-400">Your code</p>
            <div className="flex gap-2">
              <code className="rounded-xl bg-black/50 px-4 py-2 text-brand-blue">
                {referral?.code || '—'}
              </code>
              <button
                type="button"
                className="text-xs text-gray-300"
                onClick={() => {
                  if (referral?.code) {
                    navigator.clipboard.writeText(referral.code);
                    toast('Copied', 'success');
                  }
                }}
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Referrals: {referral?.referrals?.length || 0}
            </p>
          </section>
        )}

        {tab === 'tournaments' && (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-3">
            <h2 className="text-lg font-semibold">Tournaments</h2>
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-white/5 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.status} · entry ${Number(t.entryFee || t.entry_fee || 0)} · prize $
                    {Number(t.prizePool || t.prize_pool || 0)}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-brand-blue/20 border border-brand-blue/40 px-3 py-1.5 text-xs text-brand-blue"
                  onClick={async () => {
                    try {
                      await joinTournament(t.id);
                      toast('Joined tournament', 'success');
                      await refresh();
                    } catch (e: any) {
                      toast(e.message, 'error');
                    }
                  }}
                >
                  Join
                </button>
              </div>
            ))}
          </section>
        )}

        {tab === 'kyc' && (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-5 space-y-3">
            <h2 className="text-lg font-semibold">Submit KYC for review</h2>
            <button
              type="button"
              className="rounded-xl bg-brand-blue px-4 py-2 text-sm text-black font-semibold"
              onClick={async () => {
                try {
                  await submitTradingKyc({
                    documentType: 'passport',
                    documentUrl: 'uploaded://passport',
                    selfieUrl: 'uploaded://selfie',
                  });
                  toast('KYC submitted for admin review', 'success');
                } catch (e: any) {
                  toast(e.message, 'error');
                }
              }}
            >
              Submit documents
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
