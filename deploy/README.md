# SSL / Let's Encrypt
#
# 1. Point DNS A/AAAA records for your domain to this server.
# 2. Set env:
#      export DOMAIN=app.yourdomain.com
#      export CERTBOT_EMAIL=admin@yourdomain.com
# 3. Run:
#      chmod +x deploy/init-ssl.sh
#      ./deploy/init-ssl.sh
#
# Certificates renew automatically via the certbot container.
# Official docs: https://letsencrypt.org/
