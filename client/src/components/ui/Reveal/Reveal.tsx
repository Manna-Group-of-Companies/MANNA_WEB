import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps {
  as?: ElementType;
  /** Stagger index — each step adds 90ms. */
  delay?: number;
  className?: string;
  children: ReactNode;
  /**
   * Any other `data-*` attribute is forwarded to the rendered element, so a
   * caller can style the reveal wrapper itself — `data-tone` on a product
   * card, for instance. Without this they are dropped silently: TypeScript
   * does not flag unknown hyphenated attributes on a component.
   */
  [key: `data-${string}`]: unknown;
  /**
   * Likewise `aria-*`, so revealing a landmark — a `nav`, a `section` — does
   * not cost it the label that makes it one.
   */
  [key: `aria-${string}`]: unknown;
}

/**
 * Fades and lifts its children into place on first scroll into view.
 * Styling lives in `styles/utilities.css` under `[data-reveal]`.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
  ...rest
}: RevealProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <Tag
      {...rest}
      ref={ref}
      className={className}
      data-reveal=""
      data-revealed={revealed}
      style={{ '--reveal-delay': `${delay * 90}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
