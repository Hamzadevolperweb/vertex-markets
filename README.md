# Vertex Markets

Frontend (Vite + React) and API (`backend/`) in one repo.

## Architecture

```
vertex-markets/
├── src/                 # React frontend (port 5173)
├── backend/             # Express API (port 3000, /api/v1)
├── deploy/              # Nginx + Let's Encrypt SSL
└── vite.config.ts       # Proxies /api → localhost:3000
```

## Client integrations

| Service | Env keys | Notes |
|---------|----------|-------|
| Market data | `MARKET_DATA_API_KEY` | Proxied via `/api/v1/market-data/*` (Finnhub-compatible) |
| Charts | `lightweight-charts` | Markets + Trading Terminal |
| Email | `RESEND_API_KEY` | Verification + password reset |
| KYC | `KYC_PUBLIC_ID`, `KYC_SECRET_KEY` | Access-token session via `/api/v1/kyc/*` |
| SSL | `DOMAIN`, `CERTBOT_EMAIL` | See `deploy/README.md` |

Secrets live only in `backend/.env` (gitignored). Never commit real keys.

## Run locally

```bash
npm run dev:api   # API :3000
npm run dev       # Web  :5173
```

### Default admin (seeded)

- Email: `admin@vunexmarket.com`
- Password: `Admin123!`

## HTTPS (production)

```bash
export DOMAIN=app.yourdomain.com
export CERTBOT_EMAIL=admin@yourdomain.com
./deploy/init-ssl.sh
```
