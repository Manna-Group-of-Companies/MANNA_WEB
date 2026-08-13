import { cn } from '@/lib/cn';
import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5];

const STAR_PATH =
  'M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45l-5.81 3.05 1.11-6.47L2.6 9.45l6.5-.95z';

function Star({ className }: { className?: string }) {
  return (
    <svg className={cn(styles.star, className)} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR_PATH} />
    </svg>
  );
}

interface StarsProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Read-only rating. Drawn as a full row of outlines with a filled row clipped
 * over it, so a 4.3 average shows a genuine partial star instead of rounding.
 */
export function Stars({ value, size = 'md', className }: StarsProps) {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span
      className={cn(styles.stars, styles[size], className)}
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      <span className={styles.track} aria-hidden="true">
        {STARS.map((star) => (
          <Star key={star} className={styles.empty} />
        ))}
      </span>
      <span
        className={styles.fill}
        style={{ width: `${(clamped / 5) * 100}%` }}
        aria-hidden="true"
      >
        {STARS.map((star) => (
          <Star key={star} className={styles.full} />
        ))}
      </span>
    </span>
  );
}

interface StarPickerProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  /** Ties the group to a label and keeps the radios unique on the page. */
  name?: string;
}

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

/**
 * Interactive rating. Real radio inputs underneath, so it arrows, tabs and
 * announces the way a rating control is expected to.
 */
export function StarPicker({
  value,
  onChange,
  disabled = false,
  name = 'rating',
}: StarPickerProps) {
  return (
    <span className={styles.picker} role="radiogroup" aria-label="Your rating">
      {STARS.map((star) => (
        <label
          className={styles.pick}
          key={star}
          data-on={star <= value}
          title={LABELS[star]}
        >
          <input
            className="sr-only"
            type="radio"
            name={name}
            value={star}
            checked={star === value}
            disabled={disabled}
            onChange={() => onChange(star)}
          />
          <Star />
          <span className="sr-only">
            {star} {star === 1 ? 'star' : 'stars'} — {LABELS[star]}
          </span>
        </label>
      ))}
      <span className={styles.pickLabel} aria-hidden="true">
        {value > 0 ? LABELS[value] : 'Tap a star'}
      </span>
    </span>
  );
}
