import type { ProductTile } from '@/types/content';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import styles from './HeroCarousel.module.css';

/** Intrinsic card geometry — matches the reference card exactly. */
export const CARD_WIDTH = 369;
export const CARD_HEIGHT = 232;

/**
 * How wide the tile actually renders, spelled out for the image selector.
 *
 * The CSS is `clamp(228px, 24vw, 369px)`: 24vw hits the 228 floor at a 950px
 * viewport and the 369 ceiling at 1538px. Without this a `w`-descriptor srcSet
 * is resolved against an assumed 100vw, so every browser downloads the 1200w
 * file for a slot that is never wider than 369px.
 */
const CARD_SIZES = '(max-width: 950px) 228px, (min-width: 1538px) 369px, 24vw';

interface CarouselCardProps {
  tile: ProductTile;
  /** Duplicate copies exist only to close the loop; hide them from AT. */
  duplicate: boolean;
}

export function CarouselCard({ tile, duplicate }: CarouselCardProps) {
  return (
    <div className={styles.card} aria-hidden={duplicate || undefined}>
      <div className={styles.imageWrapper}>
        {tile.image ? (
          <picture>
            {tile.image.webpSrcSet && (
              <source
                srcSet={tile.image.webpSrcSet}
                sizes={CARD_SIZES}
                type="image/webp"
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
              />
            )}
            {tile.image.srcSet && (
              <source
                srcSet={tile.image.srcSet}
                sizes={CARD_SIZES}
                type="image/jpeg"
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
              />
            )}
            <img
              className={styles.image}
              src={tile.image.src}
              srcSet={tile.image.srcSet}
              sizes={CARD_SIZES}
              alt={duplicate ? '' : tile.label}
              loading="lazy"
              decoding="async"
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
            />
          </picture>
        ) : (
          <PatternArt pattern={tile.pattern} className={styles.image} />
        )}
      </div>
    </div>
  );
}
