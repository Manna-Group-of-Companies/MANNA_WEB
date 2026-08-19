import type { CSSProperties } from 'react';
import type { ProductTile } from '@/types/content';
import { CarouselCard } from './CarouselCard';
import styles from './HeroCarousel.module.css';

export interface CarouselRowProps {
  tiles: ProductTile[];
  /** Travel direction. 'right' simply reverses the same animation. */
  direction: 'left' | 'right';
  /**
   * Initial offset along the track, in px, as `--carousel-start-position`.
   * Must stay within the width of one copy of `tiles`, or a gap appears
   * at the trailing edge.
   */
  startPosition?: number;
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  label: string;
}

/**
 * Tiles a copy must contain before it is wide enough to span the viewport.
 *
 * A card tops out at 369px and the gap at 40px, so each tile is 409px of
 * track and twelve of them cover ~4900px. That clears a 3840px 4K panel run
 * at 100% and a 3440px ultra-wide with room to spare; anything larger is a
 * 5K display, which reports 2560 logical pixels because it runs at 2x.
 *
 * The floor matters because a copy narrower than the screen runs out of
 * cards before the lap comes round, and a bare strip drifts through the
 * seam once every pass.
 */
const MIN_TILES_PER_COPY = 12;

export function CarouselRow({
  tiles,
  direction,
  startPosition = 0,
  duration = 72,
  label,
}: CarouselRowProps) {
  // A short row is repeated until one copy is wide enough to cover the screen;
  // the copy is then rendered twice, so the -50% translate lands on an
  // identical frame. Three photographed tiles would otherwise leave a gap.
  const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_COPY / tiles.length));
  const copy = Array.from({ length: repeats }, () => tiles).flat();
  const loop = [...copy, ...copy];

  return (
    <div
      className={styles.row}
      data-direction={direction}
      style={
        {
          '--carousel-start-position': `${startPosition}px`,
          '--carousel-duration': `${duration}s`,
        } as CSSProperties
      }
      role="group"
      aria-label={label}
    >
      <div className={styles.track}>
        {loop.map((tile, index) => (
          <CarouselCard
            key={`${tile.id}-${index}`}
            tile={tile}
            duplicate={index >= tiles.length}
          />
        ))}
      </div>
    </div>
  );
}
