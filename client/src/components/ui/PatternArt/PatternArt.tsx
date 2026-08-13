import type { PatternName } from '@/types/content';
import { cn } from '@/lib/cn';
import styles from './PatternArt.module.css';

interface PatternArtProps {
  pattern: PatternName;
  /** Aspect ratio of the art block, e.g. "4 / 3". */
  ratio?: string;
  className?: string;
}

/**
 * Decorative, CSS-drawn stand-in for product photography.
 * Swap for <img> once real photography is available — the surrounding
 * layout does not depend on this component's internals.
 */
export function PatternArt({ pattern, ratio, className }: PatternArtProps) {
  return (
    <div
      className={cn(styles.art, className)}
      data-pattern={pattern}
      style={ratio ? { aspectRatio: ratio } : undefined}
      aria-hidden="true"
    />
  );
}
