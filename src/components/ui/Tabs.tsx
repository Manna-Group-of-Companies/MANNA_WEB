"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

/**
 * Accessible tabs with a shared-layout indicator that slides between triggers.
 * Arrow keys move between tabs per WAI-ARIA authoring practices.
 */
export function Tabs({
  items,
  className,
  panelClassName,
  idPrefix = "tabs",
}: {
  items: TabItem[];
  className?: string;
  panelClassName?: string;
  idPrefix?: string;
}) {
  const [active, setActive] = React.useState(items[0]?.id);
  const layoutId = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    setActive(items[next].id);
    refs.current[next]?.focus();
  };

  const current = items.find((t) => t.id === active);

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Product information"
        onKeyDown={onKeyDown}
        className="snap-rail no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl bg-surface-2 p-1.5 ring-1 ring-[var(--border)]"
      >
        {items.map((tab, i) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive ? "text-white" : "text-muted hover:text-fg",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`tab-pill-${layoutId}`}
                  className="absolute inset-0 rounded-xl bg-brand-500 shadow-[0_6px_20px_-8px_rgba(244,121,32,0.85)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className={cn("relative mt-6", panelClassName)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            role="tabpanel"
            id={`${idPrefix}-panel-${active}`}
            aria-labelledby={`${idPrefix}-tab-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {current?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
