import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware';
import { SERVICES, PROTECTED_ROUTES } from './config/services';
import { serverError } from '@naman_deep_singh/response-utils';
import { ExpressServer, Request, Response, NextFunction, getEnvBoolean, getEnvNumber } from '@naman_deep_singh/server-utils';

// Custom middleware for gateway request logging
function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log('Gateway micro service got a hit:', req.method, req.url);
  next();
}

// Protected routes middleware
function routeProtector(req: Request, res: Response, next: NextFunction) {
  const isProtected = PROTECTED_ROUTES.some(route => req.path.startsWith(route));
  if (isProtected) {
    return authMiddleware(req, res, next);
  }
  next();
}

// Create server instance
const serverInstance = new ExpressServer('Gateway Service', '1.0.0', {
  port: getEnvNumber("PORT", 5000),
  cors: true,
  helmet: true,
  json: true,
  customMiddleware: [requestLogger, routeProtector],
  healthCheck: false, // We'll add custom health check
  gracefulShutdown: true,
  periodicHealthCheck: {
    enabled: getEnvBoolean("PERIODIC_HEALTH_CHECK", false) || process.env.NODE_ENV === 'production',
    interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
    services: [
      {
        name: 'auth-service',
        url: `${SERVICES.AUTH}/health`,
        timeout: 5000
      },
      {
        name: 'notes-service',
        url: `${SERVICES.NOTES}/health`,
        timeout: 5000
      }
    ]
  }
});

// Get the Express app
const app = serverInstance.app;

// Auth routes (no authentication required)
app.use('/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to ${SERVICES.AUTH}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Auth service response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err.message);
    return serverError('Gateway error', res);
  }
}));

// Notes service routes (protected)
app.use('/api/notes', createProxyMiddleware({
  target: SERVICES.NOTES,
  changeOrigin: true,
  pathRewrite: { '^/api/notes': 'notes' },
  onError: (err, req, res) => {
    console.error('Notes proxy error:', err.message);
    return serverError('Notes service unavailable', res);
  }
}));

export default serverInstance;