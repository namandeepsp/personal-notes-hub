import serverInstance from './app';

const startServer = async () => {
  try {
    // Start the server instance
    await serverInstance.start();
  } catch (err) {
    console.error('❌ Gateway startup failed:', err);
    process.exit(1);
  }
};

startServer();