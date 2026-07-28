# Vertex Markets - Installation Guide

## Prerequisites

- **Node.js** v18 or higher (v20 recommended)
- **npm** v9 or higher
- **Git** (for cloning the repository)
- **MongoDB** v7 (optional - for database-backed operations)
- **Docker** & **Docker Compose** (optional - for containerized setup)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vertex-markets-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB (optional - currently using in-memory store)
MONGODB_URI=mongodb://localhost:27017/vertex_markets

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# Refresh Token Cookie
REFRESH_TOKEN_COOKIE_NAME=refreshToken
JWT_REFRESH_COOKIE_MAX_AGE_MS=2592000000

# Email Verification
EMAIL_VERIFICATION_EXPIRES_MINUTES=1440

# Password Reset
PASSWORD_RESET_EXPIRES_MINUTES=60

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_SECONDS=900

# APP (Swagger, Public URLs)
SWAGGER_TITLE=Vertex Markets API
SWAGGER_VERSION=1.0.0
APP_PUBLIC_URL=http://localhost:3000
```

### 4. Run the Application

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

### 5. Verify Installation

The server will start on `http://localhost:3000`.

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{ "ok": true }
```

Access the API documentation:

```
http://localhost:3000/api/v1/docs
```

---

## Docker Setup

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

### Using Docker Alone

```bash
# Build the image
docker build -t vertex-markets-api .

# Run the container
docker run -p 3000:3000 --env-file .env vertex-markets-api
```

The docker-compose configuration includes:
- `api` - The Node.js application server
- `mongo` - MongoDB v7 database (optional)

---

## Project Structure

```
vertex-markets-backend/
├── docs/                  # Documentation
│   ├── api/              # API reference
│   ├── deployment/       # Deployment guide
│   ├── installation/     # Installation guide (this file)
│   ├── postman/          # Postman collection
│   └── swagger/          # Complete Swagger specification
├── src/
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   ├── config/           # Configuration (cors, mongo)
│   ├── constants/        # Constants (roles)
│   ├── infrastructure/   # Infrastructure (in-memory store)
│   ├── middleware/        # Express middleware
│   │   ├── auth/         # JWT authentication
│   │   ├── error/        # Error handling
│   │   ├── logger/       # Request logging
│   │   ├── rbac/         # Role-based access control
│   │   ├── security/     # Security headers, rate limiting
│   │   └── validation/   # Input validation
│   ├── modules/          # Business modules
│   │   ├── auth/         # Authentication
│   │   ├── users/        # User management
│   │   ├── cms/          # Content management
│   │   ├── markets/      # Trading markets
│   │   ├── platforms/    # Trading platforms
│   │   ├── blog/         # Blog system
│   │   ├── contact/      # Contact inquiries
│   │   ├── newsletter/   # Newsletter subscriptions
│   │   ├── careers/      # Jobs & applications
│   │   ├── partners/     # Partner management
│   │   ├── uploads/      # File uploads
│   │   ├── dashboard/    # Admin dashboard
│   │   ├── search/       # Global search
│   │   └── validation/   # Validation utilities
│   ├── routes/           # Route definitions
│   │   └── v1/           # API v1 routes
│   ├── scripts/          # Utility scripts
│   └── utils/            # Shared utilities
├── uploads/              # Uploaded files directory
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker Compose configuration
└── package.json          # Dependencies and scripts
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload (nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run linter (not configured) |
| `npm run seed` | Run database seeders |
| `npm run swagger` | Generate Swagger documentation |

---

## Using Swagger

Interactive API documentation is available at:

```
http://localhost:3000/api/v1/docs
```

The Swagger UI allows you to:
- Browse all available endpoints
- View request/response schemas
- Test endpoints directly from the browser
- Authenticate using the "Authorize" button (Bearer token)

The raw OpenAPI specification is available at:

```
http://localhost:3000/api/v1/docs.json
```

A complete offline copy of the Swagger specification is located at:

```
docs/swagger/complete-swagger.json
```

---

## Using Postman

### Option 1: Import Collection

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `docs/postman/vertex-markets.postman_collection.json`
4. The collection will appear in your Collections sidebar

### Option 2: Create Environment

1. Create a new Postman environment
2. Add the following variables:

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `baseUrl` | `http://localhost:3000` | API base URL |
| `accessToken` | (auto-populated) | JWT access token |
| `adminEmail` | `admin@vertexmarkets.com` | Admin email |
| `adminPassword` | `admin123` | Admin password |

3. Set the environment as active

### Option 3: Authentication Flow

1. Run the **Login** request from the Authentication folder
2. The Postman test script will automatically save the `accessToken`
3. All subsequent requests will use the saved token via the `{{accessToken}}` variable

---

## Troubleshooting

### Port Already in Use

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Module Not Found

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### MongoDB Connection Issues

The application currently uses an in-memory data store by default. MongoDB connection is configured but not activated. To use MongoDB, uncomment the `connectMongo()` call in `src/app.js` and ensure the `MONGODB_URI` environment variable is set correctly.

### CORS Errors

Make sure the `CORS_ORIGIN` environment variable matches your frontend application URL. For development with Vite (default port 5173):

```
CORS_ORIGIN=http://localhost:5173
```

---

## Next Steps

After installation:

1. Create an admin account using the register endpoint
2. Login to get an access token
3. Use the Swagger UI or Postman collection to explore the API
4. Configure the frontend application to connect to the API
5. Review the deployment guide for production setup

For detailed API documentation, see `docs/api/README.md`.

For deployment instructions, see `docs/deployment/README.md`.

