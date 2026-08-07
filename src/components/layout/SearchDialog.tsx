"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Ruler, Search, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { faqs } from "@/data/content";
import { allSizes, products } from "@/data/products";
import { useEscapeKey, useHydrated, useLockBodyScroll } from "@/lib/hooks";
import { cn, normalise } from "@/lib/utils";

type Result = {
  id: string;
  kind: "Product" | "Size" | "Question";
  title: string;
  sub: string;
  href: string;
};

/** Flat index built once at module scope — the catalogue is static. */
const INDEX: Result[] = [
  ...products.map((p) => ({
    id: `p-${p.id}`,
    kind: "Product" as const,
    title: p.name,
    sub: p.tagline,
    href: `#product-${p.id}`,
  })),
  ...allSizes.map((s, i) => ({
    id: `s-${s.productId}-${i}`,
    kind: "Size" as const,
    title: s.code,
    sub: `${s.abbr} · ${s.fitment}`,
    href: `#product-${s.productId}`,
  })),
  ...faqs.map((f, i) => ({
    id: `f-${i}`,
    kind: "Question" as const,
    title: f.q,
    sub: "Frequently asked",
    href: "#faq",
  })),
];

function search(query: string): Result[] {
  const q = normalise(query);
  if (!q) return INDEX.filter((r) => r.kind === "Product");
  return INDEX.filter(
    (r) => normalise(r.title).includes(q) || normalise(r.sub).includes(q),
  ).slice(0, 24);
}

/**
 * Mounted only while open, so query/cursor reset naturally on each open —
 * no effect needed to clear them.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useLockBodyScroll(true);
  useEscapeKey(true, onClose);

  React.useEffect(() => {
    // focus once the entrance transition has started
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const results = React.useMemo(() => search(query), [query]);

  const go = React.useCallback(
    (href: string) => {
      onClose();
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [onClose],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor].href);
    }
  };

  return (
    /* Full-screen on phones — a floating panel leaves too little room once
       the on-screen keyboard takes half the viewport. */
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center sm:p-4 sm:pt-[13dvh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search products and sizes"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/65 backdrop-blur-lg"
      />
      <motion.div
        initial={{ opacity: 0, y: -18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative z-10 flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-surface shadow-lift ring-1 ring-[var(--border)] sm:h-auto sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--border)] px-4 py-4 pt-[max(1rem,var(--safe-t))] sm:px-5 sm:pt-4">
          <Search className="size-5 shrink-0 text-brand-500" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search products, sizes (try 1000×20 or 295R22.5)…"
            aria-label="Search"
            className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted sm:text-[1.02rem]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg sm:size-8"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-2.5 sm:max-h-[48dvh] sm:flex-none">
          {results.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              Nothing matched <span className="font-semibold text-fg">“{query}”</span>. Try a size
              code, a range name, or{" "}
              <button
                type="button"
                onClick={() => go("#contact")}
                className="font-semibold text-brand-600 underline underline-offset-4 dark:text-brand-400"
              >
                ask us directly
              </button>
              .
            </p>
          ) : (
            <ul role="listbox" aria-label="Search results">
              {results.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === cursor}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(r.href)}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors",
                      i === cursor ? "bg-brand-500/12" : "hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg text-[0.68rem] font-bold uppercase",
                        r.kind === "Size"
                          ? "bg-brand-500/15 text-brand-600 dark:text-brand-400"
                          : "bg-surface-2 text-muted",
                      )}
                      aria-hidden
                    >
                      {r.kind === "Size" ? <Ruler className="size-4" /> : r.kind.slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.sub}</span>
                    </span>
                    {i === cursor && (
                      <CornerDownLeft className="size-4 shrink-0 text-muted" aria-hidden />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-surface-2/50 px-5 py-2.5 pb-[max(0.625rem,var(--safe-b))] text-[0.7rem] text-muted sm:pb-2.5">
          <span>
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
          <span className="hidden gap-3 sm:flex">
            <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5">↑↓</kbd> navigate
            <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5">↵</kbd> open
            <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5">esc</kbd> close
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const hydrated = useHydrated();
  if (!hydrated) return null;

  return createPortal(
    <AnimatePresence>{open && <SearchPanel onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}
