# Gateway Service

API Gateway microservice for Personal Notes Hub built with TypeScript and Express. Routes requests to appropriate microservices and handles authentication.

## Features

- HTTP proxy middleware for request routing
- Authentication middleware integration
- Service discovery and load balancing
- Request/response logging
- Error handling and fallback
- CORS and security headers

## Tech Stack

- **Runtime**: Node.js 24
- **Framework**: Express.js
- **Proxy**: http-proxy-middleware
- **Security**: Helmet, CORS
- **Response Utils**: Custom response utilities

## Setup

### Prerequisites
- Node.js 24+
- pnpm
- Running auth-service

### Installation
```bash
cd apps/gateway-service
pnpm install
```

### Environment Variables
Create `.env.development` and `.env.production`:
```env
PORT=5000
AUTH_SERVICE_URL=http://localhost:8080
NOTES_SERVICE_URL=http://localhost:8081
NODE_ENV=development
```

## Development

### Local Development
```bash
pnpm dev
```
Gateway runs on http://localhost:5000

### Build for Production
```bash
pnpm build
pnpm start
```

### Docker
```bash
# Build image
docker build -t gateway-service .

# Run container
docker run -p 5000:5000 gateway-service
```

## API Routes

### Authentication Routes (Proxied to Auth Service)
- `POST /auth/signup` → `http://auth-service:8080/signup`
- `POST /auth/login` → `http://auth-service:8080/login`
- `POST /auth/logout` → `http://auth-service:8080/logout`
- `POST /auth/verify` → `http://auth-service:8080/verify`

### Protected Routes (Requires Authentication)
- `GET|POST /api/notes/*` → `http://notes-service:8081/*`

### Health & Testing
- `GET /health` - Gateway health status
- `GET /test-auth` - Test auth service connection

## Usage Examples

### User Registration via Gateway
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### User Login via Gateway
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Cookie: token=your_jwt_token"
```

## Service Configuration

### Proxy Configuration
```typescript
// Auth routes (no authentication required)
app.use('/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

// Protected routes (authentication required)
app.use('/api/notes', authMiddleware, createProxyMiddleware({
  target: SERVICES.NOTES,
  changeOrigin: true,
  pathRewrite: { '^/api/notes': '' }
}));
```

### Authentication Middleware
The gateway validates JWT tokens by calling the auth service:
```typescript
const response = await fetch(`${SERVICES.AUTH}/verify`, {
  method: 'POST',
  headers: {
    'Cookie': req.headers.cookie || '',
    'Content-Type': 'application/json'
  }
});
```

## Dependencies

### Production
- `@naman_deep_singh/response-utils`: Standardized API responses
- `express`: Web framework
- `http-proxy-middleware`: Request proxying
- `cors`: Cross-origin requests
- `helmet`: Security headers

### Development
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution
- `nodemon`: Development server

## Architecture

```
src/
├── middleware/     # Authentication middleware
├── config/        # Service URLs and routes
├── app.ts         # Express app and proxy setup
└── index.ts       # Server entry point
```

## Request Flow

1. **Client Request** → Gateway Service (port 5000)
2. **Route Matching** → Determine target service
3. **Authentication** → Validate JWT (if protected route)
4. **Proxy Request** → Forward to target microservice
5. **Response** → Return response to client

## Environment-Specific Configuration

### Development
- Services run on localhost
- Direct service communication
- Hot reloading with nodemon

### Production (Docker)
- Services communicate via Docker network
- Service discovery using container names
- Optimized builds and caching

## Error Handling

- Connection failures to downstream services
- Authentication errors
- Request timeout handling
- Graceful degradation