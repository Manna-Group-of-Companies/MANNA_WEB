import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { cn } from '@/lib/cn';
import { linkTo } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button/Button';
import { StarPicker } from '@/components/ui/StarRating/StarRating';
import type { Review, ReviewDraft } from '@/types/review';
import { Avatar, GoogleMark } from './ReviewCard';
import styles from './Reviews.module.css';

const MAX_COMMENT = 800;

/** Where sign-in sends the reader back to — this section, not the top. */
const RETURN_TO = encodeURIComponent('/#reviews');

interface ReviewFormProps {
  /** The reader's existing review, which this form edits rather than duplicates. */
  mine: Review | null;
  onSubmit: (draft: ReviewDraft) => Promise<string>;
}

export function ReviewForm({ mine, onSubmit }: ReviewFormProps) {
  const { user, ready } = useAuth();
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [comment, setComment] = useState(mine?.comment ?? '');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // The reader's own review arrives with the rail, a moment after this mounts.
  useEffect(() => {
    if (!mine) return;
    setRating(mine.rating);
    setComment(mine.comment);
  }, [mine]);

  if (ready && !user) {
    return (
      <div className={styles.gate}>
        <GoogleMark />
        <p className={styles.gateText}>
          Only signed-in Google accounts can leave a review, so the name and
          photo on one always belong to a real buyer.
        </p>
        {/* Carries the way back: signing in returns the reader to this
            section with the form open, rather than to the top of the page. */}
        <Button size="lg" {...linkTo(`/login?next=${RETURN_TO}`)}>
          Sign in with Google to review
        </Button>
      </div>
    );
  }

  if (!ready || !user) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setStatus('error');
      setMessage('Please choose a star rating.');
      return;
    }
    if (comment.trim().length < 5) {
      setStatus('error');
      setMessage('Please write a few words about your experience.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const result = await onSubmit({ rating, comment: comment.trim() });
      setStatus('done');
      setMessage(result);
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not save your review. Please try again.',
      );
    }
  }

  const sending = status === 'sending';
  const remaining = MAX_COMMENT - comment.length;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHead}>
        <Avatar name={user.name} picture={user.picture} size={40} />
        <div>
          <p className={styles.formTitle}>
            {mine ? 'Edit your review' : `Write a review, ${user.name.split(' ')[0]}`}
          </p>
          <p className={styles.formNote}>
            Posted as {user.name} with your Google photo.
          </p>
        </div>
      </div>

      <StarPicker
        value={rating}
        disabled={sending}
        onChange={(next) => {
          setRating(next);
          if (status === 'error') setStatus('idle');
        }}
      />

      <label className="sr-only" htmlFor="review-comment">
        Your review
      </label>
      <textarea
        className={styles.textarea}
        id="review-comment"
        name="comment"
        rows={4}
        maxLength={MAX_COMMENT}
        placeholder="What did you order, and how did it hold up?"
        value={comment}
        disabled={sending}
        onChange={(event) => {
          setComment(event.target.value);
          if (status === 'error') setStatus('idle');
        }}
      />

      <div className={styles.formFoot}>
        <span className={styles.counter} aria-hidden="true">
          {remaining} characters left
        </span>
        <Button type="submit" size="md" disabled={sending}>
          {sending ? 'Saving…' : mine ? 'Update review' : 'Publish review'}
        </Button>
      </div>

      <p
        className={cn(
          styles.status,
          status === 'error' && styles.statusError,
          status === 'done' && styles.statusSuccess,
        )}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
