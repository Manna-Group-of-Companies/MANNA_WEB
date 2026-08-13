import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

interface Options {
  windowMs: number;
  max: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal in-memory limiter — enough for a single-process deployment.
 * Behind more than one instance, swap for a shared store (Redis).
 */
export function rateLimit({ windowMs, max }: Options) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > max) {
      next(new AppError('Too many requests. Please try again shortly.', 429));
      return;
    }

    next();
  };
}
