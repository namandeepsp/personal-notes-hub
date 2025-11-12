# Auth Service

Authentication microservice for Personal Notes Hub built with TypeScript, Express, and Prisma.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- HTTP-only cookie sessions
- Prisma ORM with PostgreSQL
- Input validation middleware

## Tech Stack

- **Runtime**: Node.js 24
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma Accelerate)
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs
- **Validation**: Custom middleware
- **Security**: Helmet, CORS

## Setup

### Prerequisites
- Node.js 24+
- pnpm
- PostgreSQL database (or Prisma Accelerate)

### Installation
```bash
cd apps/auth-service
pnpm install
```

### Environment Variables
Create `.env.development` and `.env.production`:
```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
PORT=8080
NODE_ENV=development
```

### Database Setup
```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# View database (optional)
pnpm prisma:studio
```

## Development

### Local Development
```bash
pnpm dev
```
Server runs on http://localhost:8080

### Build for Production
```bash
pnpm build
pnpm start
```

### Docker
```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 8080:8080 auth-service
```

## API Endpoints

### Authentication Routes
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /verify` - Verify JWT token

### Health Check
- `GET /health` - Service health status

## Request/Response Format

### Signup
```bash
curl -X POST http://localhost:8080/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Dependencies

### Production
- `@naman_deep_singh/response-utils`: Standardized API responses
- `@naman_deep_singh/security`: JWT and password utilities
- `@prisma/client`: Database client
- `express`: Web framework
- `cookie-parser`: Cookie handling
- `cors`: Cross-origin requests
- `helmet`: Security headers

### Development
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution
- `nodemon`: Development server
- `prisma`: Database toolkit

## Architecture

```
src/
├── controllers/     # Request handlers
├── middleware/      # Validation & auth middleware
├── routes/         # API route definitions
├── db/            # Database connection
├── app.ts         # Express app setup
└── index.ts       # Server entry point
```

## Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS and security headers
- Environment-based configuration