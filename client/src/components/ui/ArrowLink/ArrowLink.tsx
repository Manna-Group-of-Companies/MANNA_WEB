import { cn } from '@/lib/cn';
import styles from './ArrowLink.module.css';

interface ArrowLinkProps {
  href: string;
  children: string;
  className?: string;
}

/** Understated text link with the underline that grows on hover. */
export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <a className={cn(styles.link, className)} href={href}>
      <span className={styles.text}>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}
