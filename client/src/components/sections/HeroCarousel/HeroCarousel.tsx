import { heroCarouselRows } from '@/data/products';
import { CarouselRow } from './CarouselRow';
import styles from './HeroCarousel.module.css';

/**
 * Two opposing bands of product cards drifting under the hero — the
 * reference page's scrolling-block device. The second row runs right and
 * a touch slower, which reads as parallax rather than two copies of the
 * same motion.
 *
 * The bands never pause. They are decoration, not a control: nothing in
 * them is clickable, so stopping on hover would imply an interaction that
 * is not there. Motion is suppressed entirely under `prefers-reduced-motion`.
 */
export function HeroCarousel() {
  const [topRow, bottomRow] = heroCarouselRows;

  return (
    <div className={styles.carousel} aria-label="Product range">
      {topRow && (
        <CarouselRow
          tiles={topRow}
          direction="left"
          duration={72}
          label="Product range, row one"
        />
      )}
      {bottomRow && (
        <CarouselRow
          tiles={bottomRow}
          direction="right"
          startPosition={-240}
          duration={88}
          label="Product range, row two"
        />
      )}
    </div>
  );
}
