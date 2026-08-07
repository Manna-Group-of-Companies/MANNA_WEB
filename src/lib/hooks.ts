"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/** SSR-safe layout effect. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const noopSubscribe = () => () => {};

/**
 * False during SSR and the first client render, true afterwards.
 * useSyncExternalStore rather than setState-in-effect, so there is no
 * cascading re-render on mount.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** @deprecated Prefer {@link useHydrated}. */
export const useMounted = useHydrated;

/* ── localStorage as an external store ──────────────────────────────
   Subscribed rather than read into state by an effect, so there is no
   cascading render on mount and every hook on the same key stays in sync
   (including across tabs, via the `storage` event). */

const storeSubscribers = new Map<string, Set<() => void>>();
/** Writes from this session — also the fallback when localStorage is unwritable. */
const storeMemory = new Map<string, string>();
/** raw JSON → parsed value, so getSnapshot keeps a stable identity. */
const storeParsed = new Map<string, { raw: string; value: unknown }>();

function readRaw(key: string) {
  const own = storeMemory.get(key);
  if (own !== undefined) return own;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readKey<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (raw === null) return fallback;

  const cached = storeParsed.get(key);
  if (cached?.raw === raw) return cached.value as T;

  try {
    const value = JSON.parse(raw) as T;
    storeParsed.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

/**
 * State persisted to localStorage. Renders `fallback` on the server and during
 * hydration, then the stored value — so it never causes a markup mismatch.
 */
export function usePersistentState<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback);

  const subscribe = useCallback(
    (onChange: () => void) => {
      let set = storeSubscribers.get(key);
      if (!set) {
        set = new Set();
        storeSubscribers.set(key, set);
      }
      set.add(onChange);

      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        // Another tab is now authoritative for this key.
        storeMemory.delete(key);
        onChange();
      };
      window.addEventListener("storage", onStorage);

      return () => {
        set.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    useCallback(() => readKey(key, fallbackRef.current), [key]),
    useCallback(() => fallbackRef.current, []),
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(readKey(key, fallbackRef.current))
          : next;

      const raw = JSON.stringify(resolved);
      storeMemory.set(key, raw);
      storeParsed.set(key, { raw, value: resolved });
      try {
        window.localStorage.setItem(key, raw);
      } catch {
        /* private mode or quota — the value still holds for this session */
      }
      storeSubscribers.get(key)?.forEach((fn) => fn());
    },
    [key],
  );

  return [value, setValue] as const;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True below the `md` breakpoint — the boundary the mobile style layer in
 * globals.css uses. False during SSR and the first client render, so only
 * use it for things that appear after an interaction (dialogs, sheets);
 * anything painted on load should branch in CSS instead, or it will flash.
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 47.9375rem)");
}

/** True when the primary pointer can't hover — i.e. a touch screen. */
export function useIsTouch() {
  return useMediaQuery("(hover: none)");
}

/** Locks body scroll without the layout shift from a disappearing scrollbar. */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [locked]);
}

/** Calls `onClose` on Escape. */
export function useEscapeKey(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return;
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, active]);
}

/** Traps Tab focus inside a container while `active`. */
export function useFocusTrap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const SELECTOR =
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );

    const first = focusables()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener("keydown", onKey);
    return () => {
      container.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
}

/** Scroll position + direction, rAF-throttled. */
export function useScrollState() {
  const [state, setState] = useState({ y: 0, scrolled: false, hidden: false });
  const last = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > last.current && y > 320;
        setState({ y, scrolled: y > 24, hidden: goingDown });
        last.current = y;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}

/** Highlights the nav link for whichever section is in view. */
export function useScrollSpy(ids: readonly string[], offset = 140) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + offset;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}

/** Pointer position normalised to -0.5..0.5 for mouse-parallax. */
export function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const fine = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth - 0.5) * strength,
          y: (e.clientY / window.innerHeight - 0.5) * strength,
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength, fine]);

  return pos;
}

/** Copy-to-clipboard with a transient "copied" flag. */
export function useCopy(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );
  return { copied, copy };
}
