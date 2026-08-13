import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(`API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  if (env.serveClient) {
    logger.info('Serving the built client from ../client/dist');
  }
});

function shutdown(signal: string): void {
  logger.info(`${signal} received — shutting down`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
