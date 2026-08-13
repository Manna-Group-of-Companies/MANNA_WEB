import { cn } from '@/lib/cn';
import { linkTo } from '@/lib/router';
import { aboutSections } from '@/data/about';
import styles from './AboutNav.module.css';

interface AboutNavProps {
  /** Slug of the page being read, so its entry can be marked current. */
  current?: string;
  className?: string;
}

/**
 * The About Us section list, carried over from the legacy site's sidebar.
 *
 * A rail beside the copy on desktop; a scrollable strip above it on narrow
 * screens, where a stacked list of eight would push the article off the fold.
 */
export function AboutNav({ current, className }: AboutNavProps) {
  return (
    <nav className={cn(styles.nav, className)} aria-label="About Manna Group">
      <p className={styles.title}>About us</p>
      <ul className={styles.list}>
        {aboutSections.map((section) => {
          const active = section.slug === current;
          return (
            <li key={section.slug}>
              <a
                className={cn(styles.link, active && styles.active)}
                aria-current={active ? 'page' : undefined}
                {...linkTo(`/about/${section.slug}`)}
              >
                {section.navLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
