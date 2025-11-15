import { ExpressServer, Request, Response, NextFunction, getEnvNumber } from '@naman_deep_singh/server-utils';
import authRoutes from './routes';

// Custom middleware for request logging
function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log('Auth micro service got a hit:', req.method, req.url, req.body);
  next();
}

// Create server instance
const serverInstance = new ExpressServer('Auth Service', '1.0.0', {
  port: getEnvNumber("PORT", 8080),
  cors: true,
  helmet: true,
  json: true,
  cookieParser: true,
  customMiddleware: [requestLogger],
  healthCheck: true,
  gracefulShutdown: true
});

// Get the Express app
const app = serverInstance.app;

// Add routes
app.use('/', authRoutes);

export default serverInstance;
