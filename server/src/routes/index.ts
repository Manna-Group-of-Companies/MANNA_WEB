import { Router } from 'express';
import { leadRoutes } from './lead.routes.js';
import { authRoutes } from './auth.routes.js';
import { reviewRoutes } from './review.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

apiRouter.use('/leads', leadRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/reviews', reviewRoutes);
