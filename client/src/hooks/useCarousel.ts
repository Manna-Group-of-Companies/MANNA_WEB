import { useCallback, useEffect, useRef, useState } from 'react';

interface Metrics {
  /** Whole items visible at once. */
  perPage: number;
  pages: number;
  /** Distance from one item's leading edge to the next, gap included. */
  stride: number;
}

const EMPTY: Metrics = { perPage: 1, pages: 1, stride: 0 };

/**
 * Measures the rail from its own children rather than from a card count, so
 * a card width that changes at a breakpoint needs no matching change here.
 */
function measure(el: HTMLElement): Metrics {
  const items = Array.from(el.children) as HTMLElement[];
  const [first, second] = items;
  if (!first || el.clientWidth === 0) return EMPTY;

  const width = first.getBoundingClientRect().width;
  const stride = second
    ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
    : width;
  if (stride <= 0) return EMPTY;

  // The trailing gap falls outside the viewport, so it counts towards the fit.
  const perPage = Math.max(1, Math.floor((el.clientWidth + stride - width) / stride));

  return { perPage, pages: Math.max(1, Math.ceil(items.length / perPage)), stride };
}

/**
 * Page state for a horizontal, scroll-snapped rail.
 *
 * Pages advance by whole items, never by a viewport, so a card is never left
 * half-shown after a jump. The rail stays a plain scroll container — these
 * controls only nudge it, so touch, trackpad and keyboard scrolling all keep
 * working without them.
 */
export function useCarousel<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  /**
   * The node is held in state as well as a ref, so a rail whose cards arrive
   * after mount still gets measured — a plain ref would be null on the first
   * pass and the observers below would attach to nothing.
   */
  const [element, setElement] = useState<T | null>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const setRef = useCallback((node: T | null) => {
    ref.current = node;
    setElement(node);
  }, []);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const { perPage, pages: total, stride } = measure(el);
    setPages(total);
    if (stride === 0) return;

    const current = Math.round(el.scrollLeft / (perPage * stride));
    setPage(Math.max(0, Math.min(total - 1, current)));
  }, []);

  useEffect(() => {
    if (!element) return;

    sync();
    element.addEventListener('scroll', sync, { passive: true });

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
    observer?.observe(element);

    // A card arriving changes the page count without changing the rail's box.
    const mutations =
      typeof MutationObserver === 'undefined' ? null : new MutationObserver(sync);
    mutations?.observe(element, { childList: true });

    return () => {
      element.removeEventListener('scroll', sync);
      observer?.disconnect();
      mutations?.disconnect();
    };
  }, [element, sync]);

  /** Scrolls to a page, clamped to what currently fits. */
  const goTo = useCallback((index: number) => {
    const el = ref.current;
    if (!el) return;

    const { perPage, pages: total, stride } = measure(el);
    const target = Math.max(0, Math.min(index, total - 1));
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.scrollTo({
      left: target * perPage * stride,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, []);

  return { ref: setRef, page, pages, goTo } as const;
}
