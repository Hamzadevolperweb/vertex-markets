# Vertex Markets API

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.19-blue)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Production-ready backend API for a modern Forex/Trading company website. Built with Node.js, Express, and an extensible modular architecture.

---

## Features

- **Authentication** - JWT-based auth with access/refresh token rotation, email verification, password reset flow
- **User Management** - Admin CRUD, role management, block/unblock, soft delete/restore
- **CMS** - Dynamic website content management (hero, about, features, testimonials, FAQ, etc.)
- **Markets** - Trading markets CRUD with pagination, filtering, search
- **Trading Platforms** - Platform management with features, supported markets, download links
- **Blog System** - Full blog with categories, tags, draft/publish workflow
- **Contact Management** - Public inquiry form with admin assignment, status workflow, reply system
- **Newsletter** - Subscription management with status tracking and public status lookup
- **Careers** - Job listings with applications, status workflow, admin assignment, internal notes
- **Partner Program** - Partner registrations, client referrals, approval workflow
- **File Uploads** - Multi-category upload system (avatars, images, documents, resumes) with type validation
- **Admin Dashboard** - Aggregated statistics, recent activity feed, system health monitoring
- **Global Search** - Cross-module search with filtering, pagination, sorting
- **Security** - Helmet, CORS, rate limiting, input sanitization, NoSQL injection prevention
- **Validation** - Centralized express-validator with sanitization and normalization
- **RBAC** - Role-based access control with granular permissions
- **Swagger** - Interactive API documentation with OpenAPI 3.0
- **Postman** - Complete Postman collection with environment variables

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Apps                    │
│  (Web App, Mobile App, External Services)        │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────────┐
│               API Gateway (Nginx)                │
│           Reverse Proxy, SSL, Rate Limit          │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Express Application                  │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Security  │ │  Auth    │ │ Validation│        │
│  │ Middleware│ │Middleware│ │ Middleware│        │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Routes  │ │  Modules │ │   Utils  │         │
│  │  (v1)    │ │(14 mods) │ │(search,  │         │
│  │          │ │          │ │paginate) │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │        In-Memory Data Store               │    │
│  │     (Pluggable: MongoDB / PostgreSQL)      │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Modular Architecture** - Each business domain is self-contained (controller, service, repository, validators)
- **In-Memory Storage** - Default in-memory store for development; MongoDB-ready for production
- **Repository Pattern** - Data access abstraction layer for easy database migration
- **JWT Token Rotation** - Refresh token rotation for enhanced security
- **Centralized Validation** - Express-validator with sanitization pipeline

---

## Folder Structure

```
vertex-markets-backend/
├── docs/
│   ├── api/README.md                   # API reference documentation
│   ├── deployment/README.md            # Deployment guide
│   ├── installation/README.md          # Installation guide
│   ├── postman/                        # Postman collection
│   └── swagger/                        # Complete Swagger/OpenAPI spec
├── src/
│   ├── app.js                          # Express application setup
│   ├── server.js                       # Server entry point
│   ├── config/                         # App configuration
│   │   ├── cors.js                     # CORS configuration
│   │   └── mongo.js                    # MongoDB connection
│   ├── constants/
│   │   └── roles.js                    # Role constants (Admin, Customer)
│   ├── infrastructure/
│   │   └── store.js                    # In-memory data store
│   ├── middleware/
│   │   ├── auth/jwtAuth.js             # JWT authentication
│   │   ├── error/                      # Error handling (customErrors, errorHandler, notFound, asyncWrapper)
│   │   ├── logger/requestLogger.js     # Request logging
│   │   ├── rbac/                       # RBAC (requireRoles, requirePermission, permissions)
│   │   ├── security/                   # Security (rateLimiter, securityHeaders, sanitizeAndValidate)
│   │   └── validation/                 # Validation (validateRequest, sanitizeInput, normalizeInput)
│   ├── modules/
│   │   ├── auth/                       # Authentication (register, login, refresh, password, email)
│   │   ├── users/                      # User management (CRUD, block, roles)
│   │   ├── cms/                        # Content management (hero section)
│   │   ├── markets/                    # Trading markets
│   │   ├── platforms/                  # Trading platforms
│   │   ├── blog/                       # Blog posts, categories, tags
│   │   ├── contact/                    # Contact inquiries
│   │   ├── newsletter/                 # Newsletter subscriptions
│   │   ├── careers/                    # Job listings & applications
│   │   ├── partners/                   # Partner registrations & referrals
│   │   ├── uploads/                    # File upload management
│   │   ├── dashboard/                  # Admin dashboard & analytics
│   │   ├── search/                     # Global search engine
│   │   └── validation/                 # Validation utilities
│   ├── routes/
│   │   ├── index.js                    # Route registration
│   │   └── v1/                         # API v1 routes (auth, users, cms, markets, platforms, blog, contact, newsletter, careers, partners, uploads, dashboard, search, swagger)
│   ├── scripts/
│   │   └── swagger.js                  # Swagger/OpenAPI spec builder
│   └── utils/
│       ├── response.js                 # Success/failure response helpers
│       ├── pagination.js               # Pagination utility
│       ├── sorting.js                  # Sorting utility
│       ├── filtering.js                # Filtering utility
│       ├── search.js                   # Search/filter helper
│       ├── validationHelpers.js        # Common validation rules
│       └── validationSchemas.js        # Validation schemas
├── uploads/                            # Uploaded files directory
│   ├── avatars/
│   ├── blog/
│   ├── cms/
│   ├── documents/
│   ├── markets/
│   ├── partners/
│   ├── platforms/
│   └── resumes/
├── Dockerfile                          # Docker image definition
├── docker-compose.yml                  # Docker Compose (API + MongoDB)
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 4.19.x | Web framework |
| JSON Web Token (jsonwebtoken) | 9.x | JWT generation & verification |
| bcrypt | 5.x | Password hashing |
| express-validator | 7.x | Request validation |
| helmet | 7.x | Security headers |
| cors | 2.x | Cross-origin resource sharing |
| morgan | 1.x | HTTP request logging |
| multer | 1.x | File upload handling |
| rate-limiter-flexible | 2.x | Rate limiting |
| express-mongo-sanitize | 2.x | NoSQL injection prevention |
| swagger-jsdoc | 6.x | OpenAPI spec generation |
| swagger-ui-express | 5.x | Swagger UI serving |
| nanoid | 5.x | Unique ID generation |
| slugify | 1.x | URL slug generation |
| nodemailer | 6.x | Email sending (SMTP) |
| winston | 3.x | Logging |
| mongoose | 7.x | MongoDB ODM (optional) |
| validator | 13.x | String validation |
| dotenv | 16.x | Environment variable management |

---

## Requirements

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **MongoDB** v7+ (optional - for production)
- **Docker** (optional - for containerized deployment)

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd vertex-markets-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# (See Environment Variables section below)

# Start development server
npm run dev
```

See the [full installation guide](docs/installation/README.md) for detailed instructions.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGODB_URI` | No | - | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | `dev_access_secret` | JWT access token secret |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token expiry |
| `JWT_REFRESH_SECRET` | Yes | `dev_refresh_secret` | JWT refresh token secret |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token expiry |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | No | `900` | Rate limit window (seconds) |
| `APP_PUBLIC_URL` | No | `http://localhost:3000` | Public URL for links |

---

## Running Locally

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# With Docker
docker-compose up --build
```

Server starts at: `http://localhost:3000`

---

## Docker

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

The Docker Compose setup includes:
- **API** - The Node.js Express application
- **MongoDB** - v7 database (optional, for production use)

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon -r dotenv/config src/server.js` | Development with auto-reload |
| `npm start` | `node src/server.js` | Production start |
| `npm run seed` | `node src/seeders/seed.js` | Run database seeders |
| `npm run swagger` | `node src/scripts/generate-swagger.js` | Generate Swagger docs |

---

## API Documentation

### Interactive Swagger UI

Once the server is running:

```
http://localhost:3000/api/v1/docs
```

The Swagger UI provides:
- Complete endpoint listing with request/response schemas
- "Try it out" functionality for testing endpoints
- Bearer token authentication via the "Authorize" button

### Postman Collection

Import the complete Postman collection from:

```
docs/postman/vertex-markets.postman_collection.json
```

### API Reference

Full API reference is available at `docs/api/README.md`.

---

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Flow

1. **Register** - Create a new account via `POST /api/v1/register`
2. **Login** - Authenticate via `POST /api/v1/login` to receive:
   - `accessToken` - Short-lived JWT (15 min default)
   - `refreshToken` - Long-lived token (30 days), set as HTTP-only cookie
3. **Authorize** - Include the access token in requests:
   ```
   Authorization: Bearer <accessToken>
   ```
4. **Refresh** - When the access token expires, use `POST /api/v1/refresh`
5. **Logout** - Revoke the refresh token via `POST /api/v1/logout`

### Token Rotation

Refresh tokens implement rotation: each time a token is refreshed, the old refresh token is revoked and a new one is issued. This limits the damage if a refresh token is compromised.

---

## Project Modules

| Module | Description | Public | Admin |
|--------|-------------|--------|-------|
| **Auth** | Registration, login, password management, email verification | ✓ | - |
| **Users** | User CRUD, role management, block/unblock | - | ✓ |
| **CMS** | Website content management (hero section) | ✓ | ✓ |
| **Markets** | Trading markets | ✓ | ✓ |
| **Platforms** | Trading platforms | ✓ | ✓ |
| **Blog** | Blog posts with categories and tags | ✓ | ✓ |
| **Contact** | Contact form submissions | ✓ | ✓ |
| **Newsletter** | Email subscriptions | ✓ | ✓ |
| **Careers** | Job listings and applications | ✓ | ✓ |
| **Partners** | Partner program management | ✓ | ✓ |
| **Uploads** | File uploads and serving | ✓ | ✓ |
| **Dashboard** | Analytics, statistics, system health | - | ✓ |
| **Search** | Global and module-specific search | ✓ | ✓ |
| **Validation** | Centralized validation utilities | - | - |

---

## Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "message": "Error description",
  "details": []
}
```

### Error Types

| Error | Status | Description |
|-------|--------|-------------|
| BadRequestError | 400 | Invalid input |
| UnauthorizedError | 401 | Missing or invalid token |
| ForbiddenError | 403 | Insufficient permissions |
| NotFoundError | 404 | Resource not found |
| ConflictError | 409 | Resource already exists |
| ValidationError | 422 | Input validation failed |
| AppError | 500 | Internal server error |

### Async Error Handling

All async route handlers are wrapped with `asyncWrapper` to automatically catch and forward errors to the centralized error handler.

---

## Validation

Input validation uses `express-validator` with a three-layer approach:

1. **Global Middleware** - `sanitizeAndValidate` runs on every request (sanitization, normalization, NoSQL injection prevention)
2. **Route Validators** - Module-specific validation rules applied per route
3. **Validation Check** - `checkValidation` middleware formats errors into standardized response format

---

## Swagger Usage

The API includes full OpenAPI 3.0 documentation:

- **Interactive UI:** `http://localhost:3000/api/v1/docs`
- **JSON Spec:** `http://localhost:3000/api/v1/docs.json`
- **Offline Copy:** `docs/swagger/complete-swagger.json`

To use the "Authorize" button in Swagger UI:
1. First login via `POST /api/v1/login`
2. Copy the `accessToken` from the response
3. Click "Authorize" in Swagger UI
4. Enter `Bearer <your-token>`
5. All subsequent requests will be authenticated

---

## Postman Usage

Import the collection from `docs/postman/vertex-markets.postman_collection.json`.

The collection includes:
- Organized folders for each module
- Sample request bodies with realistic data
- Authentication flow that auto-saves the access token
- Collection variables for easy configuration
- Example responses

---

## Deployment

### Quick Deploy Options

| Platform | Guide |
|----------|-------|
| **Docker** | See [Deployment Guide](docs/deployment/README.md#docker-deployment) |
| **VPS (Ubuntu)** | See [Deployment Guide](docs/deployment/README.md#vps-deployment-ubuntudebian) |
| **Render** | See [Deployment Guide](docs/deployment/README.md#render-deployment) |
| **Railway** | See [Deployment Guide](docs/deployment/README.md#railway-deployment) |

### Production Checklist

- [ ] Use strong JWT secrets
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your frontend domain
- [ ] Set up SSL/TLS
- [ ] Implement MongoDB with proper indexes
- [ ] Configure monitoring and logging
- [ ] Set up database backups
- [ ] Review rate limiting parameters

---

## License

MIT

---

## Future Improvements

- [ ] MongoDB model integration for persistent storage
- [ ] Redis caching layer for frequently accessed data
- [ ] WebSocket support for real-time updates
- [ ] Email service integration (nodemailer SMTP)
- [ ] Cloud file storage (AWS S3, Cloudinary)
- [ ] OAuth2 social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] API versioning (v2)
- [ ] GraphQL endpoint
- [ ] Automated testing (Jest, Supertest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Rate limiting by endpoint
- [ ] Audit logging
- [ ] Webhook system
- [ ] Multi-language support
- [ ] Analytics dashboard enhancements
- [ ] Performance monitoring (New Relic, Datadog)

