import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchReviews, submitReview } from '@/lib/api';
import { SHOW_SAMPLE_REVIEWS, sampleReviews } from '@/data/sampleReviews';
import type { Review, ReviewDraft } from '@/types/review';

type LoadStatus = 'loading' | 'ready' | 'error';

/** Mean to one decimal place, matching how the server rounds it. */
function averageOf(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/**
 * Owns the review rail's data: one load on mount, then whatever the server
 * hands back on submit folded into the list. Count and average are derived
 * rather than stored, so the rail can never disagree with its own summary.
 */
export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    fetchReviews()
      .then((response) => {
        if (cancelled) return;
        setReviews(response.data?.reviews ?? []);
        setStatus('ready');
      })
      .catch(() => {
        // Not worth an error banner on a marketing page — the section falls
        // back to its empty state.
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Publishes or edits, then moves the saved review to the front. */
  const submit = useCallback(async (draft: ReviewDraft) => {
    const response = await submitReview(draft);
    const saved = response.data?.review;

    if (saved) {
      setReviews((current) => [
        saved,
        ...current.filter((review) => review.id !== saved.id),
      ]);
    }

    return response.message;
  }, []);

  /**
   * Placeholder reviews stand in only while there are none at all. The
   * first real one replaces the whole set rather than joining it — an
   * invented card must never sit next to a genuine customer's.
   *
   * An unreachable API counts as none: the rail cannot know whether real
   * reviews exist, and a marketing page with the review server down should
   * still read as a finished page rather than an empty one.
   */
  const isSample =
    SHOW_SAMPLE_REVIEWS && status !== 'loading' && reviews.length === 0;
  const visible = isSample ? sampleReviews : reviews;

  const average = useMemo(() => averageOf(visible), [visible]);
  /** The reader's own review, if they have written one. Never a sample. */
  const mine = useMemo(
    () => reviews.find((review) => review.isMine) ?? null,
    [reviews],
  );

  return {
    reviews: visible,
    count: visible.length,
    average,
    status,
    isSample,
    mine,
    submit,
  } as const;
}
