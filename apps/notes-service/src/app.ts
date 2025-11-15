import { ExpressServer, Request, Response, NextFunction, getEnvNumber } from '@naman_deep_singh/server-utils';
import notesRoutes from './routes';

// Custom middleware for request logging
function requestLogger(req: Request, res: Response, next: NextFunction) {
    console.log('Notes micro service got a hit:', req.method, req.url, req.body);
    next();
}

// Create server instance
const serverInstance = new ExpressServer('Notes Service', '1.0.0', {
    port: getEnvNumber("PORT", 8081),
    cors: true,
    helmet: true,
    json: true,
    cookieParser: false,
    customMiddleware: [requestLogger],
    healthCheck: true,
    gracefulShutdown: true
});

// Get the Express app
const app = serverInstance.app;

// Add routes
app.use('/notes', notesRoutes);

export default serverInstance;
