import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Container } from '@/components/ui/Container/Container';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { Stars } from '@/components/ui/StarRating/StarRating';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import styles from './Reviews.module.css';

/**
 * Seconds of travel per card, so speed stays constant as reviews are added.
 * Set against the card's width: the rail runs on compact cards, so the same
 * figure as the full-size card would have crawled.
 */
const SECONDS_PER_CARD = 5.5;
const MIN_DURATION = 30;

/**
 * Customer reviews: a continuously drifting row of cards, each carrying the
 * reviewer's Google name and photo, over a form that only a signed-in
 * account can use.
 *
 * The one place a serif appears on the site — a wall of testimony from
 * other people should not look like the rest of the page talking about
 * itself.
 */
export function Reviews() {
  const { reviews, count, average, status, isSample, mine, submit } = useReviews();
  const [paused, setPaused] = useState(false);
  /** Pointer over the row, or focus inside it. */
  const [engaged, setEngaged] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [drifting, setDrifting] = useState(false);

  /**
   * A copy narrower than the viewport would run out of cards before the loop
   * came round, showing a gap at the seam — so the row only drifts once the
   * reviews are wide enough to cover it. Measured from a card rather than
   * counted, because card width changes at every breakpoint.
   */
  useEffect(() => {
    const frame = viewport.current;
    const row = track.current;
    const card = row?.firstElementChild;
    if (!frame || !card) {
      setDrifting(false);
      return;
    }

    const check = () => {
      const gap = parseFloat(getComputedStyle(card).marginRight) || 0;
      const copyWidth = (card.getBoundingClientRect().width + gap) * count;
      setDrifting(copyWidth >= frame.clientWidth);
    };

    check();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [count]);

  // Two identical copies: travelling exactly one copy's width lands on a
  // frame indistinguishable from the start, so the loop never shows a seam.
  const loop = drifting ? [...reviews, ...reviews] : reviews;
  const duration = Math.max(MIN_DURATION, count * SECONDS_PER_CARD);

  return (
    <section className={styles.section} id="reviews">
      <Container>
        <div className={styles.head}>
          <Reveal as="p" className={styles.eyebrow}>
            What our customers say
          </Reveal>
          <Reveal as="h2" delay={1} className={styles.title}>
            Trusted by customers around the world.
          </Reveal>

          {count > 0 && (
            <Reveal as="p" delay={2} className={styles.score}>
              <Stars value={average} />
              <strong>{average.toFixed(1)}</strong> average
              <span className={styles.scoreDot} aria-hidden="true" />
              {count} {isSample ? 'example' : 'verified'}{' '}
              {count === 1 ? 'review' : 'reviews'}
            </Reveal>
          )}
        </div>
      </Container>

      {status === 'loading' ? (
        <p className={styles.loading}>Loading reviews…</p>
      ) : count === 0 ? (
        <Container>
          <Reveal className={styles.empty}>
            <Stars value={0} size="lg" />
            <p className={styles.emptyTitle}>No reviews yet.</p>
            <p className={styles.emptyBody}>
              Be the first to tell other engineers how the parts performed.
            </p>
          </Reveal>
        </Container>
      ) : (
        <div className={styles.rail}>
          <div
            className={styles.viewport}
            ref={viewport}
            onPointerEnter={() => setEngaged(true)}
            onPointerLeave={() => setEngaged(false)}
            onFocus={() => setEngaged(true)}
            onBlur={() => setEngaged(false)}
          >
            <ul
              className={styles.track}
              ref={track}
              data-drifting={drifting}
              // Hover and focus stop the animation where it stands rather
              // than resetting it, so reading never costs you your place.
              data-paused={paused || engaged}
              style={{ '--drift-duration': `${duration}s` } as CSSProperties}
            >
              {loop.map((review, index) => {
                const duplicate = drifting && index >= count;
                return (
                  <li
                    className={styles.item}
                    key={`${review.id}-${index}`}
                    // The second copy exists to make the loop seamless; it is
                    // the same content, so it is not announced twice.
                    aria-hidden={duplicate || undefined}
                  >
                    <ReviewCard review={review} size="sm" />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.controls}>
            {drifting && (
              <button
                className={styles.toggle}
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? <PlayIcon /> : <PauseIcon />}
                <span>{paused ? 'Play reviews' : 'Pause reviews'}</span>
              </button>
            )}
          </div>

          {/* Says so while the placeholders are standing in. Delete this
              block when you delete `sampleReviews`. */}
          {isSample && (
            <p className={styles.sampleNote}>
              Example reviews, shown while we gather the first real ones.
            </p>
          )}
        </div>
      )}

      <Container>
        <Reveal className={styles.formWrap}>
          <ReviewForm mine={mine} onSubmit={submit} />
        </Reveal>
      </Container>
    </section>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="3" height="10" rx="1" />
      <rect x="9" y="3" width="3" height="10" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5 3.4v9.2a.6.6 0 0 0 .92.5l7-4.6a.6.6 0 0 0 0-1l-7-4.6a.6.6 0 0 0-.92.5z" />
    </svg>
  );
}
