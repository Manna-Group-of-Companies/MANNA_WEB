import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import { linkProps, linkTo } from '@/lib/router';
import { primaryNav } from '@/data/site';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useScrolled } from '@/hooks/useScrolled';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { usePathname } from '@/hooks/usePathname';
import { useSearch } from '@/hooks/useSearchParams';
import { Button } from '@/components/ui/Button/Button';
import { Logo } from '@/components/layout/Logo/Logo';
import { NavDropdown } from './NavDropdown';
import styles from './Header.module.css';

/** Milliseconds the pointer must rest on a nav item before its panel drops. */
const HOVER_DELAY = 90;

export function Header() {
  const scrolled = useScrolled(8);
  const { user, ready, signOut } = useAuth();
  const { count } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  // Label of the desktop mega menu on screen, or null. Held here rather than
  // per-item so opening one panel closes the last.
  const [openNav, setOpenNav] = useState<string | null>(null);
  // The signed-in account menu, which is the only way to sign out on desktop.
  const [accountOpen, setAccountOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number>();
  // Signing in should not cost you the page you were reading.
  const here = usePathname() + useSearch();
  const loginLink = linkTo(`/login?next=${encodeURIComponent(here)}`);
  const wishlistLink = linkTo('/wishlist');
  const catalogueLink = linkTo('/products');

  useLockBodyScroll(menuOpen);

  /**
   * Opens a mega menu on hover.
   *
   * Only on a machine that genuinely hovers — a tap on a touchscreen fires
   * mouseenter and then click, which would open the panel and immediately
   * toggle it shut again.
   *
   * The first panel waits out a short intent delay so that sweeping the
   * pointer across the bar on the way to "Get started" does not drop a menu
   * over the page. Once one is open, moving between items switches instantly:
   * at that point the reader is in the nav on purpose.
   */
  function openOnHover(label: string) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    window.clearTimeout(hoverTimer.current);
    if (openNav) {
      setOpenNav(label);
      return;
    }
    hoverTimer.current = window.setTimeout(() => setOpenNav(label), HOVER_DELAY);
  }

  /** Drops any pending open — the pointer left before the delay elapsed. */
  function cancelHover() {
    window.clearTimeout(hoverTimer.current);
  }

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Escape, an outside click, or the pointer leaving the header dismisses
  // the mega menu.
  useEffect(() => {
    if (!openNav) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenNav(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenNav(null);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openNav]);

  // Same dismissal rules for the account menu, but measured against the menu
  // itself rather than the header — the mega menu spans the whole bar, this
  // does not.
  useEffect(() => {
    if (!accountOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [accountOpen]);

  // Signing out from anywhere should not leave an open menu pointing at a
  // session that no longer exists.
  useEffect(() => {
    if (!user) setAccountOpen(false);
  }, [user]);

  return (
    <header
      className={cn(styles.header, scrolled && styles.isScrolled)}
      data-open={menuOpen}
      data-nav-open={openNav !== null}
      ref={headerRef}
      onMouseLeave={() => {
        cancelHover();
        setOpenNav(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenNav(null);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo />
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {primaryNav.map((item) => (
            <NavDropdown
              item={item}
              key={item.label}
              open={openNav === item.label}
              onToggle={() => {
                cancelHover();
                setOpenNav((current) =>
                  current === item.label ? null : item.label,
                );
              }}
              onClose={() => {
                cancelHover();
                setOpenNav(null);
              }}
              onHover={() => openOnHover(item.label)}
              onHoverEnd={cancelHover}
            />
          ))}
        </nav>

        <div className={styles.right}>
          <a
            className={styles.wishlist}
            aria-label={
              count === 0
                ? 'Wishlist, empty'
                : `Wishlist, ${count} ${count === 1 ? 'product' : 'products'} saved`
            }
            {...wishlistLink}
          >
            <svg className={styles.heart} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"
                fill={count > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {count}
              </span>
            )}
          </a>

          {/* Held back until the session check lands, so the bar never shows
              "Log in" to somebody who is already signed in. */}
          {ready &&
            (user ? (
              <div className={styles.accountWrap} ref={accountRef}>
                <button
                  className={styles.account}
                  type="button"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-controls="account-menu"
                  onClick={() => {
                    setOpenNav(null);
                    setAccountOpen((open) => !open);
                  }}
                >
                  {user.picture ? (
                    <img
                      className={styles.avatar}
                      src={user.picture}
                      alt=""
                      width={28}
                      height={28}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className={styles.accountName}>
                    {user.name.split(' ')[0]}
                  </span>
                  <svg
                    className={styles.caret}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 4l3 3 3-3" />
                  </svg>
                </button>

                <div
                  className={styles.accountMenu}
                  id="account-menu"
                  hidden={!accountOpen}
                >
                  <div className={styles.accountIdentity}>
                    <p className={styles.accountFullName}>{user.name}</p>
                    <p className={styles.accountEmail}>{user.email}</p>
                  </div>

                  <a
                    className={styles.accountItem}
                    {...wishlistLink}
                    onClick={(event) => {
                      setAccountOpen(false);
                      wishlistLink.onClick?.(event);
                    }}
                  >
                    Your wishlist
                    {count > 0 && (
                      <span className={styles.accountCount}>{count}</span>
                    )}
                  </a>

                  <button
                    className={cn(styles.accountItem, styles.accountSignOut)}
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      void signOut();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <a className={styles.quiet} {...loginLink}>
                Log in
              </a>
            ))}
          <Button href="/#contact" size="md">
            Get started
          </Button>
        </div>

        <button
          className={styles.burger}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={styles.mobileMenu} id="mobile-menu" hidden={!menuOpen}>
        <ul className={styles.mobileList}>
          {primaryNav.map((item) => {
            const props = linkProps(item.href);
            return (
              <li key={item.label}>
                <a
                  className={styles.mobileLink}
                  {...props}
                  onClick={(event) => {
                    setMenuOpen(false);
                    props.onClick?.(event);
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
          <li>
            <a
              className={styles.mobileLink}
              href={wishlistLink.href}
              onClick={(event) => {
                setMenuOpen(false);
                wishlistLink.onClick(event);
              }}
            >
              Wishlist{count > 0 && ` (${count})`}
            </a>
          </li>
        </ul>
        <div className={styles.mobileActions}>
          <Button href="/#contact" size="lg" onClick={() => setMenuOpen(false)}>
            Get started
          </Button>
          <Button
            size="lg"
            variant="outline"
            {...catalogueLink}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              setMenuOpen(false);
              catalogueLink.onClick(event);
            }}
          >
            Browse the catalogue
          </Button>
          {ready &&
            (user ? (
              <button
                className={styles.mobileQuiet}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void signOut();
                }}
              >
                Sign out ({user.name.split(' ')[0]})
              </button>
            ) : (
              <a
                className={styles.mobileQuiet}
                href={loginLink.href}
                onClick={(event) => {
                  setMenuOpen(false);
                  loginLink.onClick(event);
                }}
              >
                Log in with Google
              </a>
            ))}
        </div>
      </div>
    </header>
  );
}
