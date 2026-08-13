import { ValidationError } from '../utils/AppError.js';
import type { ReviewInput } from '../types/review.js';

const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_COMMENT = 5;
const MAX_COMMENT = 800;

/**
 * Narrows an untrusted body to a ReviewInput, or throws a ValidationError
 * carrying per-field messages the form can show inline.
 */
export function parseReviewInput(body: unknown): ReviewInput {
  const fields: Record<string, string> = {};

  if (typeof body !== 'object' || body === null) {
    throw new ValidationError({ body: 'Expected a JSON object' });
  }

  const { rating, comment } = body as Record<string, unknown>;

  if (typeof rating !== 'number' || !Number.isInteger(rating)) {
    fields.rating = 'Choose a rating from 1 to 5 stars';
  } else if (rating < MIN_RATING || rating > MAX_RATING) {
    fields.rating = `Rating must be between ${MIN_RATING} and ${MAX_RATING}`;
  }

  const trimmed = typeof comment === 'string' ? comment.trim() : '';

  if (typeof comment !== 'string' || trimmed === '') {
    fields.comment = 'Please write a short comment';
  } else if (trimmed.length < MIN_COMMENT) {
    fields.comment = `Comment must be at least ${MIN_COMMENT} characters`;
  } else if (trimmed.length > MAX_COMMENT) {
    fields.comment = `Comment must be ${MAX_COMMENT} characters or fewer`;
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError(fields);
  }

  return { rating: rating as number, comment: trimmed };
}
