import { cn } from '@/lib/cn';
import styles from './TyreSpinner.module.css';

/** Five spokes, so a turn reads as a turn rather than a shimmer. */
const SPOKES = [0, 72, 144, 216, 288];

/**
 * The wheel itself. Kept in step with the copy drawn inline in index.html,
 * which has to paint before this bundle has loaded.
 */
function Tyre() {
  return (
    <svg className={styles.tyre} viewBox="0 0 100 100" aria-hidden="true">
      {/* The casing runs out under the tread, so the lugs stand only a
          little proud of it — any deeper and the wheel reads as a gear. */}
      <circle className={styles.casing} cx="50" cy="50" r="38.5" />
      {/* 28 tread lugs: pathLength makes one lug plus its gap exactly one
          unit, so the dashes close round the circle without a short one. */}
      <circle className={styles.tread} cx="50" cy="50" r="46" pathLength={28} />
      <circle className={styles.sidewall} cx="50" cy="50" r="35" />
      <circle className={styles.rim} cx="50" cy="50" r="29.5" />
      <g className={styles.spokes}>
        {SPOKES.map((angle) => (
          <path key={angle} d="M50 41V22" transform={`rotate(${angle} 50 50)`} />
        ))}
      </g>
      <circle className={styles.hub} cx="50" cy="50" r="8" />
      <circle className={styles.cap} cx="50" cy="50" r="3" />
    </svg>
  );
}

interface TyreSpinnerProps {
  /** Said aloud and shown beside the wheel. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * The site's loading mark: a tyre turning on the spot. `sm` sits the label
 * beside the wheel for a single line of UI; `md` and `lg` stack it under.
 */
export function TyreSpinner({ label, size = 'md', className }: TyreSpinnerProps) {
  return (
    <div className={cn(styles.spinner, styles[size], className)} role="status">
      <Tyre />
      <span>{label}</span>
    </div>
  );
}
