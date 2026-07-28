#!/usr/bin/env bash
# Issue / renew Let's Encrypt certificates for DOMAIN.
# Usage:
#   export DOMAIN=app.example.com
#   export CERTBOT_EMAIL=admin@example.com
#   ./deploy/init-ssl.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="${DOMAIN:-}"
EMAIL="${CERTBOT_EMAIL:-}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Set DOMAIN and CERTBOT_EMAIL first."
  echo "Example: DOMAIN=app.example.com CERTBOT_EMAIL=admin@example.com ./deploy/init-ssl.sh"
  exit 1
fi

mkdir -p "$ROOT/deploy/certbot/www" "$ROOT/deploy/certbot/conf"

echo "==> Building frontend"
(cd "$ROOT" && npm run build)

echo "==> Starting nginx (HTTP only first) + API"
DOMAIN="$DOMAIN" docker compose -f "$ROOT/deploy/docker-compose.ssl.yml" up -d mongo api web

echo "==> Requesting Let's Encrypt certificate for $DOMAIN"
docker compose -f "$ROOT/deploy/docker-compose.ssl.yml" run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal || true

echo "==> Reloading nginx with TLS"
DOMAIN="$DOMAIN" docker compose -f "$ROOT/deploy/docker-compose.ssl.yml" up -d web certbot

echo "Done. Visit https://$DOMAIN"
echo "Auto-renewal runs via the certbot container every 12h."
