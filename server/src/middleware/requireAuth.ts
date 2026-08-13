import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { readSessionCookie } from '../utils/cookies.js';
import { AppError } from '../utils/AppError.js';
import type { SessionUser } from '../types/auth.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by requireAuth. Undefined on unguarded routes. */
      user?: SessionUser;
    }
  }
}

/**
 * Reads the session if there is one and carries on either way. For routes
 * that serve everybody but render differently for the signed-in reader.
 */
export function optionalAuth() {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.userFromToken(readSessionCookie(req));
      if (user) req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/** Gate for anything that should only work when signed in. */
export function requireAuth() {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.userFromToken(readSessionCookie(req));
      if (!user) {
        next(new AppError('Please sign in to continue.', 401));
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}
