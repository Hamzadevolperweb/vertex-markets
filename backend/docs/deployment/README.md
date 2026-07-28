# Vertex Markets - Deployment Guide

## Overview

This guide covers deployment options for the Vertex Markets backend API. The application is a Node.js Express server with an optional MongoDB database.

---

## Local Production Deployment

### Prerequisites

- Node.js v20+
- npm v9+
- Git

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd vertex-markets-backend

# 2. Install production dependencies only
npm install --production

# 3. Set environment variables
export NODE_ENV=production
export PORT=3000
export JWT_ACCESS_SECRET=<generate-a-secure-secret>
export JWT_REFRESH_SECRET=<generate-a-different-secure-secret>
export APP_PUBLIC_URL=https://your-api-domain.com

# 4. Start the server
npm start
```

### Using a Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/server.js --name vertex-markets-api

# Save the process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Monitor
pm2 monit
pm2 logs vertex-markets-api
```

---

## Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t vertex-markets-api:latest .

# Run the container
docker run -d \
  --name vertex-markets-api \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  vertex-markets-api:latest
```

### Docker Compose (Production)

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  api:
    build: .
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    command: ["npm", "start"]

  mongo:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: vertex_markets
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo_data:
```

Run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## VPS Deployment (Ubuntu/Debian)

### 1. Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/vertex-markets
sudo chown -R $USER:$USER /var/www/vertex-markets

# Clone or copy application files
git clone <repository-url> /var/www/vertex-markets

# Install dependencies
cd /var/www/vertex-markets
npm install --production

# Create .env file
nano .env
```

### 3. Configure Environment

```env
NODE_ENV=production
PORT=3000
JWT_ACCESS_SECRET=<generate-64-char-random-string>
JWT_REFRESH_SECRET=<generate-64-char-random-string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
REFRESH_TOKEN_COOKIE_NAME=refreshToken
JWT_REFRESH_COOKIE_MAX_AGE_MS=2592000000
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW_SECONDS=900
SWAGGER_TITLE=Vertex Markets API
SWAGGER_VERSION=1.0.0
APP_PUBLIC_URL=https://api.your-domain.com
```

### 4. Start with PM2

```bash
cd /var/www/vertex-markets
pm2 start src/server.js --name vertex-markets-api
pm2 save
pm2 startup
```

### 5. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/vertex-markets`:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase body size for file uploads
        client_max_body_size 10M;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/vertex-markets /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL with Certbot

```bash
sudo certbot --nginx -d api.your-domain.com
```

### 7. Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Render Deployment

### Web Service Setup

1. Create a new **Web Service** on Render
2. Connect your GitHub/GitLab repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | vertex-markets-api |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Starter or higher |

4. Add Environment Variables:

```
NODE_ENV=production
JWT_ACCESS_SECRET=<generate-secret>
JWT_REFRESH_SECRET=<generate-secret>
CORS_ORIGIN=https://your-frontend.onrender.com
APP_PUBLIC_URL=https://vertex-markets-api.onrender.com
```

5. Click **Create Web Service**

Render automatically handles:
- SSL/TLS certificates
- Auto-deployments from your branch
- Logging and monitoring

---

## Railway Deployment

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Deploy:
```bash
railway up
```

4. Set environment variables via Railway dashboard:
```
NODE_ENV=production
PORT=3000
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
APP_PUBLIC_URL=https://vertex-markets.up.railway.app
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment (development/production) |
| `MONGODB_URI` | No | - | MongoDB connection string (optional) |
| `JWT_ACCESS_SECRET` | Yes | `dev_access_secret` | JWT access token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token expiration |
| `JWT_REFRESH_SECRET` | Yes | `dev_refresh_secret` | JWT refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token expiration |
| `REFRESH_TOKEN_COOKIE_NAME` | No | `refreshToken` | Cookie name for refresh token |
| `JWT_REFRESH_COOKIE_MAX_AGE_MS` | No | `2592000000` | Cookie max age (30 days) |
| `EMAIL_VERIFICATION_EXPIRES_MINUTES` | No | `1440` | Email verification token expiry |
| `PASSWORD_RESET_EXPIRES_MINUTES` | No | `60` | Password reset token expiry |
| `CORS_ORIGIN` | No | `true` (all) | Allowed CORS origin |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | No | `900` | Rate limit window (15 min) |
| `SWAGGER_TITLE` | No | `Vertex Markets API` | Swagger UI title |
| `SWAGGER_VERSION` | No | `1.0.0` | API version |
| `APP_PUBLIC_URL` | No | `http://localhost:3000` | Public URL for links |

**Security Note:** Always use strong, randomly generated secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in production. Use different values for each.

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Production Checklist

- [ ] Use strong JWT secrets (min 64 chars, different for access and refresh)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to specific frontend domain
- [ ] Set up SSL/TLS certificate
- [ ] Configure rate limiting for production load
- [ ] Set up monitoring and logging (e.g., PM2, Winston)
- [ ] Configure database backups (if using MongoDB)
- [ ] Set up CI/CD pipeline
- [ ] Configure health check monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Review and update security headers
- [ ] Set up file upload limits and virus scanning
- [ ] Configure email service for password resets (production)

---

## MongoDB Migration Notes

The application currently uses an in-memory data store for development and testing. To migrate to MongoDB for production:

1. Set `MONGODB_URI` environment variable
2. Uncomment `connectMongo()` in `src/app.js`:
```javascript
// In src/app.js, uncomment:
connectMongo();
```
3. Create Mongoose models for each data collection
4. Update repositories to use MongoDB queries instead of the in-memory store
5. Add database indexes for performance
6. Set up MongoDB Atlas or self-hosted MongoDB

---

## File Uploads

In production, file uploads are stored locally in the `uploads/` directory. For scalable deployments:

1. **Cloud Storage (Recommended):**
   - Integrate with AWS S3, Cloudinary, or similar service
   - Update the storage module in `src/modules/uploads/storage.js`

2. **Shared Volume (Docker):**
   ```yaml
   volumes:
     - uploads_data:/app/uploads
   ```

3. **Nginx Direct Serving:**
   ```nginx
   location /uploads/ {
       alias /var/www/vertex-markets/uploads/;
       internal;  # Only allow internal redirects
   }
   ```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 list
pm2 show vertex-markets-api
```

### Application Logs

```bash
# PM2 logs
pm2 logs vertex-markets-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Health Check Endpoint

Configure your monitoring service to check:

```
GET https://api.your-domain.com/health
```

Expected response: `{ "ok": true }`

---

## Scaling Considerations

### Horizontal Scaling

The API is stateless (tokens are self-contained JWTs), making it suitable for horizontal scaling behind a load balancer.

```nginx
upstream vertex_markets_cluster {
    least_conn;
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://vertex_markets_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### File Uploads

For multi-server deployments, use a shared file system or cloud storage for uploads.

---

## Troubleshooting

### Application Crashes on Start
- Check environment variables are set correctly
- Verify Node.js version (`node --version`)
- Check port availability
- Review logs: `pm2 logs vertex-markets-api`

### 502 Bad Gateway (Nginx)
- Ensure the application is running: `pm2 status`
- Check Nginx configuration: `sudo nginx -t`
- Verify proxy target is correct

### SSL Certificate Issues
- Renew certificate: `sudo certbot renew`
- Check certificate expiry: `sudo certbot certificates`

### Rate Limiting
- Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_SECONDS` as needed
- Consider IP whitelisting for internal services

---

## Additional Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Docker Documentation](https://docs.docker.com/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)

