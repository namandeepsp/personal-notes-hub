import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth';
import { SERVICES, PROTECTED_ROUTES } from './config/services';
import { serverError } from '@naman_deep_singh/response-utils';
import { ExpressServer, addHealthCheck } from '@naman_deep_singh/server-utils';

// Custom middleware for gateway request logging
function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log('Gateway micro service got a hit:', req.method, req.url);
  next();
}

// Protected routes middleware
function routeProtector(req: express.Request, res: express.Response, next: express.NextFunction) {
  const isProtected = PROTECTED_ROUTES.some(route => req.path.startsWith(route));
  if (isProtected) {
    return authMiddleware(req, res, next);
  }
  next();
}

// Create server instance
const serverInstance = new ExpressServer('Gateway Service', '1.0.0', {
  port: Number(process.env.PORT) || 5000,
  cors: true,
  helmet: true,
  json: true,
  customMiddleware: [requestLogger, routeProtector],
  healthCheck: false, // We'll add custom health check
  gracefulShutdown: true
});

// Get the Express app
const app = serverInstance.app;

// Add custom health check with auth service connectivity
addHealthCheck(app, '/health', {
  customChecks: [
    {
      name: 'auth-service-connectivity',
      check: async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(`${SERVICES.AUTH}/health`, {
            method: 'GET',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          return response.ok;
        } catch (error) {
          console.log('Auth service health check failed:', error instanceof Error ? error.message : 'Unknown error');
          return false;
        }
      }
    }
  ]
});

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
  pathRewrite: { '^/api/notes': '' },
  onError: (err, req, res) => {
    console.error('Notes proxy error:', err.message);
    return serverError('Notes service unavailable', res);
  }
}));

export default serverInstance;