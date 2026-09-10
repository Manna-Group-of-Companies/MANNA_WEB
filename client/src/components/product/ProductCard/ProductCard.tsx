import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { linkTo } from '@/lib/router';
import { categoryLabel, findCategory } from '@/data/catalogue';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { WishlistButton } from '@/components/product/WishlistButton/WishlistButton';
import type { CatalogueProduct } from '@/types/content';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: CatalogueProduct;
  /** Stagger index passed through to the reveal animation. */
  delay?: number;
  /** Replaces the wishlist heart — the wishlist page puts a Remove there. */
  action?: ReactNode;
  className?: string;
}

/**
 * Catalogue tile, cut to the same pattern as the capability cards: copy at the
 * top, artwork cropped off the bottom edge, spec chips floating over it and an
 * arrow in the corner. The wash comes from the product's category, so a mixed
 * grid still reads by colour.
 *
 * The whole card is one click target — the title's link is stretched over it,
 * with the wishlist control lifted above so it stays independently clickable.
 */
export function ProductCard({
  product,
  delay = 0,
  action,
  className,
}: ProductCardProps) {
  const tone = findCategory(product.category)?.tone ?? 'ink';

  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(styles.card, className)}
      data-tone={tone}
    >
      <div className={styles.head}>
        <p className={styles.category}>{categoryLabel(product.category)}</p>
        <h3 className={styles.title}>
          <a className={styles.link} {...linkTo(`/products/${product.slug}`)}>
            {product.name}
          </a>
        </h3>
        <p className={styles.summary}>{product.summary}</p>
      </div>

      <div className={styles.stage}>
        <div className={styles.frame}>
          {product.image ? (
            <picture>
              {product.image.webpSrcSet && (
                <source type="image/webp" srcSet={product.image.webpSrcSet} />
              )}
              <img
                className={styles.photo}
                data-fit={product.image.fit ?? 'cover'}
                src={product.image.src}
                srcSet={product.image.srcSet}
                sizes="(max-width: 640px) 60vw, 260px"
                alt=""
                loading="lazy"
              />
            </picture>
          ) : (
            <PatternArt pattern={product.pattern} className={styles.art} />
          )}
        </div>

        {product.chips?.map((chip) => (
          <span className={styles.chip} data-at={chip.at} key={chip.label}>
            <span className={styles.chipLabel}>{chip.label}</span>
            {chip.value && (
              <span className={styles.chipValue}>{chip.value}</span>
            )}
          </span>
        ))}
      </div>

      <div className={styles.action}>
        {action ?? (
          <WishlistButton productId={product.id} productName={product.name} />
        )}
      </div>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Reveal>
  );
}
