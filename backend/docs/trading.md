# Trading Platform

Binary trading, wallet ledger, WebSocket prices, KYC, 2FA, referrals, tournaments, payment webhooks, IP blacklist, and admin ops.

## Key routes (`/api/v1/trading`)

- Wallet: `GET /wallet`, `POST /wallet/deposit`, `POST /wallet/withdraw`
- Payments: `POST /payments/webhook` (shared secret)
- Trades: `GET/POST /trades`
- Account: `/notifications`, `/2fa/*`, `/kyc`, `/referral`, `/tournaments`
- Admin: `/admin/reports`, withdrawals/KYC review, force-settle, payout %, IP blacklist

## Payment webhook

`PAYMENT_WEBHOOK_SECRET` (default `vertex_demo_webhook_secret`)

```bash
curl -X POST http://localhost:3000/api/v1/trading/payments/webhook \
  -H 'Content-Type: application/json' \
  -d '{"secret":"vertex_demo_webhook_secret","depositId":"dep_...","externalId":"pi_123"}'
```

## UI wiring

- Trader **Trade** tab → live binary engine
- **Deposit / Withdraw / Wallet** → real APIs
- **Settings** → 2FA, notifications, referral, tournaments, KYC submit
- Admin **KYC / Withdrawals / Live trades / Assets** → live ops panels

```bash
cd backend && npm run migrate
npm run dev:api
npm run dev
```
