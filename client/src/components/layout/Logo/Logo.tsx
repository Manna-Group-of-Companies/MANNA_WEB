import type { MouseEventHandler } from 'react';
import { cn } from '@/lib/cn';
import { site } from '@/data/site';
import styles from './Logo.module.css';

interface LogoProps {
  tone?: 'ink' | 'light';
  /** Defaults to the top of the current page; pass "/" from a sub-page. */
  href?: string;
  /** Set by `linkTo` when the lockup should navigate client-side. */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}

/* Two cuts of the same lockup: the dark-page version carries white letters
   and rule, the light one carries charcoal. Source art is 158x60. */
const SOURCES: Record<'ink' | 'light', string> = {
  ink: '/brand/manna-group-dark.png',
  light: '/brand/manna-group.png',
};

export function Logo({
  tone = 'ink',
  href = '#top',
  onClick,
  className,
}: LogoProps) {
  return (
    <a
      className={cn(styles.logo, className)}
      href={href}
      onClick={onClick}
      aria-label={`${site.name} ${site.suffix} — home`}
    >
      <img
        className={styles.mark}
        src={SOURCES[tone]}
        alt={`${site.name} Group`}
        width={158}
        height={60}
      />
    </a>
  );
}
