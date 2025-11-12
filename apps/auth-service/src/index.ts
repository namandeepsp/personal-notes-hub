import app from './app';
import { connectDB, disconnectDB } from './db/index';

const PORT = Number(process.env.PORT) || 8080;
let server: import('http').Server;

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(PORT, () => {
            console.log(`🚀 Auth service running on http://localhost:${PORT}`);
        });

        /* Graceful shutdown */
        const shutdown = async (signal: string) => {
            console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
            server.close(async () => {
                await disconnectDB();
                console.log('👋 Server closed. Exiting now.');
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (err) {
        console.error('❌ Server startup failed:', err);
        process.exit(1);
    }
};

startServer();

