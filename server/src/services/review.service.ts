import { randomUUID } from 'node:crypto';
import { reviewRepository } from '../repositories/review.repository.js';
import { logger } from '../utils/logger.js';
import type { SessionUser } from '../types/auth.js';
import type {
  PublicReview,
  ReviewInput,
  ReviewRecord,
  ReviewSummary,
} from '../types/review.js';

function toPublic(record: ReviewRecord, viewerId: string | null): PublicReview {
  return {
    id: record.id,
    name: record.name,
    picture: record.picture,
    rating: record.rating,
    comment: record.comment,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    isMine: viewerId !== null && record.userId === viewerId,
  };
}

export const reviewService = {
  /** `viewerId` only decides which card is flagged as the reader's own. */
  async list(viewerId: string | null = null): Promise<ReviewSummary> {
    const records = await reviewRepository.list();
    const total = records.reduce((sum, record) => sum + record.rating, 0);

    return {
      reviews: records.map((record) => toPublic(record, viewerId)),
      count: records.length,
      average: records.length === 0 ? 0 : Math.round((total / records.length) * 10) / 10,
    };
  },

  /**
   * Publishes a review, or rewrites the author's existing one — an account
   * gets one voice, and editing beats a "you already reviewed this" dead end.
   */
  async upsert(
    user: SessionUser,
    input: ReviewInput,
  ): Promise<{ review: PublicReview; isUpdate: boolean }> {
    const existing = await reviewRepository.findByUserId(user.id);
    const now = new Date().toISOString();

    const record: ReviewRecord = {
      id: existing?.id ?? randomUUID(),
      userId: user.id,
      // Re-read from the session, so a changed Google name or avatar carries.
      name: user.name,
      picture: user.picture,
      rating: input.rating,
      comment: input.comment,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await reviewRepository.save(record);
    logger.info(existing ? 'Review updated' : 'Review published', {
      id: record.id,
      rating: record.rating,
    });

    return { review: toPublic(record, user.id), isUpdate: existing !== null };
  },
};
