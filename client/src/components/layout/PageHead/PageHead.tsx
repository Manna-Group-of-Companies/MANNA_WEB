import type { CSSProperties, ReactNode } from 'react';
import { Fragment } from 'react';
import { cn } from '@/lib/cn';
import { linkTo } from '@/lib/router';
import { Container } from '@/components/ui/Container/Container';
import styles from './PageHead.module.css';

export interface Crumb {
  label: string;
  /** Omitted on the last crumb, which is the page you are already on. */
  href?: string;
}

interface PageHeadProps {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Buttons or links laid under the lede. */
  children?: ReactNode;
  className?: string;
}

/** Position in the staggered entrance, read by `[data-rise]`. */
const riseAt = (index: number) =>
  ({ '--rise-index': index }) as CSSProperties;

/** Masthead shared by the catalogue, wishlist and product detail pages. */
export function PageHead({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
  className,
}: PageHeadProps) {
  return (
    <section className={cn(styles.head, className)}>
      {/* The masthead sits above the fold, so its parts are staggered in on
          mount rather than waiting for a scroll reveal that never fires. */}
      <Container>
        <nav className={styles.crumbs} aria-label="Breadcrumb" data-rise="">
          {crumbs.map((crumb, index) => (
            <Fragment key={crumb.label}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? (
                <a className={styles.crumb} {...linkTo(crumb.href)}>
                  {crumb.label}
                </a>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>

        {eyebrow && (
          <p className={styles.eyebrow} data-rise="" style={riseAt(1)}>
            {eyebrow}
          </p>
        )}
        <h1 className={styles.title} data-rise="" style={riseAt(2)}>
          {title}
        </h1>
        {lede && (
          <p className={styles.lede} data-rise="" style={riseAt(3)}>
            {lede}
          </p>
        )}
        {children && (
          <div className={styles.actions} data-rise="" style={riseAt(4)}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
