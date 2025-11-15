import serverInstance from './app';
import { connectDB, disconnectDB } from './db';

const startServer = async () => {
    try {
        await connectDB();
        console.log('✅ Database connected successfully');

        // Start the server instance
        await serverInstance.start();

        // Add custom shutdown logic
        process.on('SIGINT', async () => {
            console.log('🔌 Disconnecting from database...');
            await disconnectDB();
            console.log('✅ Database disconnected');
            await serverInstance.stop();
        });

        process.on('SIGTERM', async () => {
            console.log('🔌 Disconnecting from database...');
            await disconnectDB();
            console.log('✅ Database disconnected');
            await serverInstance.stop();
        });
    } catch (err) {
        console.error('❌ Server startup failed:', err);
        process.exit(1);
    }
};

startServer();