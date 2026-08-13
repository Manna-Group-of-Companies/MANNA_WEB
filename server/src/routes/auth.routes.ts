import { Router } from 'express';
import {
  getCurrentUser,
  signInWithGoogle,
  signOut,
} from '../controllers/auth.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const authRoutes = Router();

// Verification is cheap but not free, and a genuine user signs in once.
authRoutes.post(
  '/google',
  rateLimit({ windowMs: 10 * 60_000, max: 20 }),
  signInWithGoogle,
);

authRoutes.get('/me', getCurrentUser);
authRoutes.post('/logout', signOut);
