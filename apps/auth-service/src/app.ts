import express from 'express';
import cookieParser from 'cookie-parser';
import { ExpressServer } from '@naman_deep_singh/server-utils';
import authRoutes from './routes/auth';

// Custom middleware for request logging
function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log('Auth micro service got a hit:', req.method, req.url, req.body);
  next();
}

// Create server instance
const serverInstance = new ExpressServer('Auth Service', '1.0.0', {
  port: Number(process.env.PORT) || 8080,
  cors: true,
  helmet: true,
  json: true,
  customMiddleware: [cookieParser(), requestLogger],
  healthCheck: true,
  gracefulShutdown: true
});

// Get the Express app
const app = serverInstance.app;

// Add routes
app.use('/', authRoutes);

export default serverInstance;
