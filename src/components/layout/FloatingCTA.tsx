"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mail, MessageCircle, Phone, X } from "lucide-react";
import * as React from "react";
import { site } from "@/data/site";
import { useQuote } from "@/components/QuoteContext";
import { useScrollState } from "@/lib/hooks";
import { cn, waLink } from "@/lib/utils";

const WA_MESSAGE =
  "Hello Manna Rubber — I'd like a quotation for tyre retreading tread rubber. My sizes are:";

/** WhatsApp FAB + back-to-top, bottom-right. */
export function FloatingCTA() {
  const { y } = useScrollState();
  const [expanded, setExpanded] = React.useState(false);
  const show = y > 520;
  // The mobile sticky bar appears at the same scroll depth — lift the FAB
  // stack above it so the two never overlap on phones.
  const barVisible = y > 800;

  return (
    <div
      className={cn(
        "fixed z-[80] flex flex-col items-end gap-3 transition-[bottom] duration-300 sm:bottom-6 print:hidden",
        // Right inset clears a landscape notch; bottom clears the home
        // indicator, and lifts again when the sticky bar is showing.
        "right-[max(1rem,var(--safe-r))] sm:right-6",
        barVisible
          ? "bottom-[calc(5.25rem+var(--safe-b))] sm:bottom-6"
          : "bottom-[max(1.25rem,var(--safe-b))]",
      )}
    >
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="tap grid size-11 place-items-center rounded-full bg-surface text-muted shadow-lift ring-1 ring-[var(--border)] transition hover:text-brand-500 hover:ring-brand-500/50"
          >
            <ArrowUp className="size-[1.05rem]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded contact options */}
      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="flex flex-col items-end gap-2"
          >
            {[
              { label: "Call us", href: `tel:${site.phone}`, icon: Phone },
              { label: "Email us", href: `mailto:${site.email}`, icon: Mail },
            ].map((a) => (
              <li key={a.label}>
                <a
                  href={a.href}
                  className="flex items-center gap-2.5 rounded-full bg-surface py-2.5 pl-4 pr-2.5 text-sm font-medium shadow-lift ring-1 ring-[var(--border)] transition hover:ring-brand-500/50"
                >
                  {a.label}
                  <span className="grid size-8 place-items-center rounded-full bg-brand-500/12 text-brand-600 dark:text-brand-400">
                    <a.icon className="size-4" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2.5">
        <AnimatePresence>
          {!expanded && (
            <motion.span
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="hidden rounded-full bg-surface px-3.5 py-2 text-[0.8rem] font-medium shadow-soft ring-1 ring-[var(--border)] sm:block"
            >
              Chat on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Close contact options" : "More contact options"}
          aria-expanded={expanded}
          className="tap grid size-11 place-items-center rounded-full bg-surface text-muted shadow-lift ring-1 ring-[var(--border)] transition hover:text-brand-500"
        >
          {expanded ? <X className="size-[1.05rem]" /> : <Phone className="size-[1.05rem]" />}
        </button>

        <a
          href={waLink(site.whatsapp, WA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-10px_rgba(37,211,102,0.9)] transition-transform duration-300 hover:scale-105"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#25D366] animate-[var(--animate-pulse-ring)]"
          />
          <MessageCircle className="relative size-6 fill-current" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/** Sticky bottom bar with the primary conversion actions on small screens. */
export function StickyContactBar() {
  const { y } = useScrollState();
  const { requestQuote } = useQuote();
  const show = y > 800;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-[75] sm:hidden print:hidden"
        >
          <div className="glass-strong flex items-center gap-2 border-t border-[var(--border)] p-2.5 pb-[max(0.625rem,var(--safe-b))] pl-[max(0.625rem,var(--safe-l))] pr-[max(0.625rem,var(--safe-r))]">
            <a
              href={`tel:${site.phone}`}
              className="grid h-12 flex-1 place-items-center rounded-xl bg-surface text-sm font-semibold ring-1 ring-[var(--border)]"
            >
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4" aria-hidden />
                Call
              </span>
            </a>
            <button
              type="button"
              onClick={() => requestQuote()}
              className="h-12 flex-[1.6] rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(244,121,32,0.85)]"
            >
              Request Quote
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
