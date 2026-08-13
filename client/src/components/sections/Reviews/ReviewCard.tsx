import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Stars } from '@/components/ui/StarRating/StarRating';
import type { Review } from '@/types/review';
import styles from './Reviews.module.css';

/**
 * `sm` is the compact card the drifting rail uses: same anatomy, tighter
 * everything, and the comment held to five lines so a long review cannot
 * stretch the card out of the row. `md` is the full card, kept for anywhere
 * a review is read on its own rather than in passing.
 */
type CardSize = 'md' | 'sm';

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : DATE.format(date);
}

interface ReviewCardProps {
  review: Review;
  size?: CardSize;
}

export function ReviewCard({ review, size = 'md' }: ReviewCardProps) {
  const edited = review.updatedAt !== review.createdAt;
  const small = size === 'sm';

  return (
    <article
      className={cn(styles.card, small && styles.cardSm)}
      data-mine={review.isMine}
    >
      <header className={styles.cardHead}>
        <Avatar
          name={review.name}
          picture={review.picture}
          size={small ? 34 : 44}
        />

        <div className={styles.who}>
          <p className={styles.name}>
            {review.name}
            {review.isMine && <span className={styles.youTag}>You</span>}
          </p>
          {review.isSample ? (
            <p className={styles.meta}>Example review</p>
          ) : (
            <p className={styles.meta}>
              <GoogleMark />
              {/* The compact card has no room for the full line. */}
              <span>{small ? 'Google' : 'Signed in with Google'}</span>
            </p>
          )}
        </div>
      </header>

      <Stars value={review.rating} size={small ? 'sm' : 'md'} />

      <blockquote className={styles.comment}>
        <p>{review.comment}</p>
      </blockquote>

      <footer className={styles.cardFoot}>
        <time dateTime={review.createdAt}>
          {formatDate(review.createdAt)}
          {edited && ' · edited'}
        </time>
        {review.isSample ? (
          <span className={styles.sampleTag}>Example</span>
        ) : (
          <span className={styles.verified}>
            <CheckMark />
            Verified
          </span>
        )}
      </footer>
    </article>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 12.5l5 5L20 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The reviewer's Google picture. Google's avatar host occasionally 404s for
 * accounts with no photo, so a failed load falls back to the initial rather
 * than leaving a broken image in the card.
 */
export function Avatar({
  name,
  picture,
  size = 46,
}: {
  name: string;
  picture: string | null;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);

  if (!picture || broken) {
    return (
      <span
        className={styles.avatarFallback}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className={styles.avatar}
      src={picture}
      alt=""
      width={size}
      height={size}
      // Inline, so a photo and an initial come out the same size — the
      // stylesheet's default would otherwise win over the width attribute
      // on the image but not over the fallback's own inline size.
      style={{ width: size, height: size }}
      loading="lazy"
      // Google rejects requests that carry our origin as the referrer.
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  );
}

/** Google's four-colour G, at badge size. */
export function GoogleMark() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.56-5.17 3.56-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
