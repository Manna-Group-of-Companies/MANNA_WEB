import type { NextFunction, Request, Response } from 'express';
import { parseReviewInput } from '../validators/review.validator.js';
import { reviewService } from '../services/review.service.js';
import { AppError } from '../utils/AppError.js';
import type { ApiSuccess } from '../types/api.js';
import type { PublicReview, ReviewSummary } from '../types/review.js';

/** Public: the rail renders for signed-out visitors too. */
export async function listReviews(
  req: Request,
  res: Response<ApiSuccess<ReviewSummary>>,
  next: NextFunction,
): Promise<void> {
  try {
    const summary = await reviewService.list(req.user?.id ?? null);

    res.json({
      ok: true,
      message: summary.count === 1 ? '1 review' : `${summary.count} reviews`,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(
  req: Request,
  res: Response<ApiSuccess<{ review: PublicReview }>>,
  next: NextFunction,
): Promise<void> {
  try {
    // requireAuth runs first; this only guards against a routing mistake.
    if (!req.user) throw new AppError('Please sign in to continue.', 401);

    const input = parseReviewInput(req.body);
    const { review, isUpdate } = await reviewService.upsert(req.user, input);

    res.status(isUpdate ? 200 : 201).json({
      ok: true,
      message: isUpdate
        ? 'Your review has been updated.'
        : 'Thanks — your review is live.',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
}
