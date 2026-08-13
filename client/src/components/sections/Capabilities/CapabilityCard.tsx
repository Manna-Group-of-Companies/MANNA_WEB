import type { Capability } from '@/types/content';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import styles from './Capabilities.module.css';

/**
 * How wide the art panel actually renders, for the image selector.
 *
 * A card is `clamp(248px, 22vw, 292px)` wide (Capabilities.module.css) and the
 * frame is inset 18% each side, so the panel is ~64% of that — 159px to 187px.
 * Without this the browser resolves a `w`-descriptor srcSet against an assumed
 * 100vw and pulls the 600w file for a 187px slot.
 */
const FRAME_SIZES = '(max-width: 1327px) 159px, 187px';

interface CapabilityCardProps {
  item: Capability;
}

/**
 * Tall product-style card: copy at the top, artwork cropped off the bottom
 * edge, spec chips floating over it and an arrow in the corner. The whole
 * card is the link, so the arrow is decoration — the accessible name comes
 * from the heading and body inside it.
 */
export function CapabilityCard({ item }: CapabilityCardProps) {
  return (
    <a className={styles.card} data-tone={item.tone} href={item.link.href}>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.body}>{item.body}</p>

      <div className={styles.stage}>
        <div className={styles.frame}>
          {item.image ? (
            // Decorative: the card's heading and body already name the step,
            // so an alt here would just be read out twice.
            <img
              className={styles.photo}
              src={item.image.src}
              srcSet={item.image.srcSet}
              sizes={FRAME_SIZES}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <PatternArt pattern={item.pattern} />
          )}
        </div>

        {item.chips.map((chip) => (
          <span className={styles.chip} data-at={chip.at} key={chip.label}>
            <span className={styles.chipLabel}>{chip.label}</span>
            {chip.value && <span className={styles.chipValue}>{chip.value}</span>}
          </span>
        ))}
      </div>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
      <span className="sr-only">{item.link.label}</span>
    </a>
  );
}
