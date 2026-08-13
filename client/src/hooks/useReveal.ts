import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Reveal slightly before the element reaches the fold. */
  rootMargin?: string;
}

/**
 * Reveals an element once as it scrolls into view.
 * Returns a ref to attach and the current revealed state.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
}: Options = {}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, revealed]);

  return { ref, revealed } as const;
}
