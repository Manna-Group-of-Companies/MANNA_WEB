"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import * as React from "react";
import { accordionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type AccordionItemData = {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({
  items,
  className,
  defaultOpen,
  allowMultiple = false,
  variant = "card",
}: {
  items: AccordionItemData[];
  className?: string;
  defaultOpen?: string;
  allowMultiple?: boolean;
  variant?: "card" | "flush";
}) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen ? [defaultOpen] : []);

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : allowMultiple
          ? [...prev, id]
          : [id],
    );

  return (
    <div className={cn(variant === "card" ? "space-y-3" : "divide-y divide-[var(--border)]", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden transition-colors duration-300",
              variant === "card" &&
                cn(
                  "rounded-2xl bg-surface ring-1 ring-[var(--border)]",
                  isOpen && "ring-brand-500/40 shadow-soft",
                ),
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`acc-panel-${item.id}`}
                id={`acc-trigger-${item.id}`}
                className={cn(
                  "group flex w-full items-start gap-4 text-left transition-colors",
                  variant === "card" ? "px-5 py-5 sm:px-6" : "py-5",
                  "hover:text-brand-600 dark:hover:text-brand-400",
                )}
              >
                <span className="flex-1">
                  <span className="block text-[1.02rem] font-semibold leading-snug sm:text-[1.1rem]">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="mt-1 block text-sm text-muted">{item.subtitle}</span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                    isOpen
                      ? "rotate-45 bg-brand-500 text-white"
                      : "bg-surface-2 text-muted group-hover:bg-brand-500/15 group-hover:text-brand-600 dark:group-hover:text-brand-400",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={`acc-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`acc-trigger-${item.id}`}
                  variants={accordionVariants}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "text-[0.95rem] leading-relaxed text-muted",
                      variant === "card" ? "px-5 pb-6 pr-14 sm:px-6 sm:pr-16" : "pb-6 pr-12",
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
