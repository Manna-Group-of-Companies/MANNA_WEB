import { Router } from 'express';
import { createReview, listReviews } from '../controllers/review.controller.js';
import { optionalAuth, requireAuth } from '../middleware/requireAuth.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const reviewRoutes = Router();

reviewRoutes.get('/', optionalAuth(), listReviews);

// An account only has one review to write, so this is edit-rate, not post-rate.
reviewRoutes.post(
  '/',
  rateLimit({ windowMs: 60 * 60_000, max: 10 }),
  requireAuth(),
  createReview,
);
