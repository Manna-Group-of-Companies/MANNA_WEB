import type { MouseEvent } from 'react';

/**
 * A ~30-line history router. The site is one marketing page plus the auth
 * screens, which is well short of what a routing library earns. Swap in
 * react-router the day a third real route appears.
 */

const ROUTE_EVENT = 'manna:routechange';

interface NavigateOptions {
  replace?: boolean;
  /** Filter changes stay put; page changes go back to the top. */
  scroll?: boolean;
}

export function navigate(
  to: string,
  { replace = false, scroll = true }: NavigateOptions = {},
): void {
  if (to === window.location.pathname + window.location.search) return;

  if (replace) window.history.replaceState({}, '', to);
  else window.history.pushState({}, '', to);

  window.dispatchEvent(new Event(ROUTE_EVENT));
  if (!scroll) return;

  // pushState does not act on a fragment the way a real navigation does, so
  // a path carrying one has to be scrolled to by hand.
  const hash = to.slice(to.indexOf('#') + 1);
  if (to.includes('#') && hash) scrollToId(hash);
  else window.scrollTo({ top: 0 });
}

/**
 * Scrolls to an element that the route change may not have painted yet:
 * one frame for React to render the new page, a second as a fallback for a
 * section that mounts a beat later.
 */
function scrollToId(id: string): void {
  const jump = () => {
    const target = document.getElementById(id);
    target?.scrollIntoView();
    return Boolean(target);
  };

  requestAnimationFrame(() => {
    if (!jump()) requestAnimationFrame(jump);
  });
}

/**
 * A `?next=` value we are willing to send somebody to after signing in:
 * an in-app path only. Anything absolute or protocol-relative is dropped,
 * so the parameter cannot be used to bounce a visitor off the site.
 */
export function internalPath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export function subscribeToRoute(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(ROUTE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(ROUTE_EVENT, onChange);
  };
}

export function getPathname(): string {
  return window.location.pathname;
}

export function getSearch(): string {
  return window.location.search;
}

/**
 * Props for an in-app link: a real href for middle-click, right-click and
 * crawlers, with client-side navigation on a plain left click.
 */
export function linkTo(to: string) {
  return {
    href: to,
    onClick(event: MouseEvent<HTMLAnchorElement>) {
      // Let the browser handle modified clicks and anything not left-button.
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      navigate(to);
    },
  };
}

/**
 * Link props for an href out of the content data, which mixes in-app paths,
 * homepage anchors and mailto links.
 *
 * Anchors are rewritten from `#contact` to `/#contact` so they still work from
 * a catalogue page: same document when you are already on the homepage, a real
 * navigation from anywhere else.
 */
export function linkProps(href: string): LinkProps {
  if (href.startsWith('#')) return { href: `/${href}` };
  if (href.startsWith('/')) return linkTo(href);
  return { href };
}

interface LinkProps {
  href: string;
  /** Present only on in-app paths; external and hash links keep the default. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}
