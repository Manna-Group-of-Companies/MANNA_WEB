import { cn } from '@/lib/cn';
import { useWishlist } from '@/context/WishlistContext';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  productId: string;
  /** Read out by screen readers, since the icon variant has no visible label. */
  productName: string;
  /** `icon` sits on a card; `full` is the detail page's bordered button. */
  variant?: 'icon' | 'full';
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);

  return (
    <button
      className={cn(styles.button, styles[variant], className)}
      type="button"
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${productName} from your wishlist`
          : `Save ${productName} to your wishlist`
      }
      data-saved={saved}
      onClick={() => toggle(productId)}
    >
      <svg className={styles.heart} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {variant === 'full' && (
        <span className={styles.label}>
          {saved ? 'Saved to wishlist' : 'Save to wishlist'}
        </span>
      )}
    </button>
  );
}
