import type { MouseEvent } from 'react';
import type { NavItem } from '@/types/content';
import { cn } from '@/lib/cn';
import { linkProps } from '@/lib/router';
import { usePathname } from '@/hooks/usePathname';
import styles from './Header.module.css';

interface NavDropdownProps {
  item: NavItem;
  open: boolean;
  /** Toggles this item's panel. */
  onToggle: () => void;
  /** Called when a link inside the panel is followed. */
  onClose: () => void;
  /** Pointer entered the item, which opens its panel. */
  onHover: () => void;
  /** Pointer left before the panel opened — drops the pending open. */
  onHoverEnd: () => void;
}

const slug = (label: string) => label.toLowerCase().replace(/[^a-z]+/g, '-');

/**
 * Whether this entry is the page being read. Only in-app paths can say:
 * a homepage anchor like `#industries` is a place on a page, not a page.
 * Home matches exactly; a section entry matches anything beneath it.
 */
function isCurrent(href: string, path: string): boolean {
  if (!href.startsWith('/') || href.includes('#')) return false;
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}

/** Link props that close the panel on the way through. */
function panelLinkProps(href: string, onClose: () => void) {
  const props = linkProps(href);
  return {
    ...props,
    onClick(event: MouseEvent<HTMLAnchorElement>) {
      onClose();
      props.onClick?.(event);
    },
  };
}

/**
 * Top-level nav entry. Items without a menu render as a plain link; items
 * with one open a full-width panel ruled off under the header.
 *
 * The panel is absolutely positioned against the header rather than the nav
 * item, so it spans the whole bar regardless of where the trigger sits.
 */
export function NavDropdown({
  item,
  open,
  onToggle,
  onClose,
  onHover,
  onHoverEnd,
}: NavDropdownProps) {
  const path = usePathname();
  const current = isCurrent(item.href, path);

  if (!item.menu) {
    return (
      <a
        className={cn(styles.navLink, current && styles.navCurrent)}
        aria-current={current ? 'page' : undefined}
        {...linkProps(item.href)}
      >
        <span className={styles.navLabel}>{item.label}</span>
      </a>
    );
  }

  const { columns, featured, cta } = item.menu;
  const panelId = `nav-panel-${slug(item.label)}`;

  return (
    <div
      className={styles.navItem}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <button
        className={cn(
          styles.navLink,
          styles.navTrigger,
          current && styles.navCurrent,
          open && styles.navOpen,
        )}
        type="button"
        aria-current={current ? 'page' : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.navLabel}>{item.label}</span>
        <svg className={styles.chevron} viewBox="0 0 10 6" aria-hidden="true">
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.panel} id={panelId} hidden={!open}>
        <div className={styles.panelInner}>
          <div className={styles.panelMain}>
            <div className={styles.columns}>
              {columns.map((column, index) => (
                <div className={styles.column} key={index}>
                  {column.map((group) => (
                    <div className={styles.group} key={group.title}>
                      <p className={styles.groupTitle}>{group.title}</p>
                      <ul className={styles.groupList}>
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <a
                              className={styles.panelLink}
                              {...panelLinkProps(link.href, onClose)}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {cta && (
              <a
                className={styles.panelCta}
                {...panelLinkProps(cta.href, onClose)}
              >
                {cta.label}
              </a>
            )}
          </div>

          {featured && (
            <div className={styles.rail}>
              {featured.map((group) => (
                <div className={styles.railGroup} key={group.title}>
                  <p className={styles.groupTitle}>{group.title}</p>
                  {group.items.map((card) => (
                    <a
                      className={styles.card}
                      key={card.label}
                      {...panelLinkProps(card.href, onClose)}
                    >
                      <span className={styles.cardTitle}>{card.label}</span>
                      <span className={styles.cardBody}>
                        {card.description}
                      </span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
