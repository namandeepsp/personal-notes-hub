/* ENV intialization should be done first */
import dotenv from 'dotenv';
dotenv.config();

import { initExtensions } from '@naman_deep_singh/js-extensions';
import serverInstance from './app';

// Initialize JavaScript extensions
initExtensions({
  number: false,
  array: false,
  object: false,
});

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