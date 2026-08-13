import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = resolve(here, '../../client/dist');

export function createApp(): Express {
  const app = express();

  // Correct client IPs behind a reverse proxy (needed by the rate limiter).
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // credentials: the session cookie has to survive a cross-origin API call.
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '32kb' }));

  app.use('/api', apiRouter);

  if (env.serveClient) {
    app.use(express.static(CLIENT_DIST));
    // SPA fallback — everything that is not /api returns index.html.
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(resolve(CLIENT_DIST, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
