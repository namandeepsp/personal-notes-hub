import express from 'express';
type Request = express.Request;
type Response = express.Response;
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth';
import { SERVICES, PROTECTED_ROUTES } from './config/services';
import { serverError } from '@naman_deep_singh/response-utils';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'gateway' });
});

// Test auth service connection
app.get('/test-auth', async (_: Request, res: Response) => {
  try {
    const response = await fetch(`${SERVICES.AUTH}/health`);
    const data = await response.json();
    res.json({ gateway: 'ok', authService: data, authUrl: SERVICES.AUTH });
  } catch (error) {
    res.status(500).json({ error: 'Cannot reach auth service', authUrl: SERVICES.AUTH });
  }
});

// Auth routes (no auth required)
app.use('/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to ${SERVICES.AUTH}${req.url.replace('/auth', '')}`);
    // Fix for POST requests with body
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from auth service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    return serverError('Gateway error', res);
  }
}));

// Protected routes middleware
app.use((req: Request, res: Response, next) => {
  const isProtected = PROTECTED_ROUTES.some(route => req.path.startsWith(route));
  if (isProtected) {
    return authMiddleware(req, res, next);
  }
  next();
});

// Notes service routes
app.use('/api/notes', createProxyMiddleware({
  target: SERVICES.NOTES,
  changeOrigin: true,
  pathRewrite: { '^/api/notes': '' }
}));

export default app;