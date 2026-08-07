"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  useEscapeKey,
  useFocusTrap,
  useIsMobile,
  useLockBodyScroll,
  useMounted,
} from "@/lib/hooks";
import { dialogVariants, overlayVariants, sheetVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  className,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  className?: string;
  size?: "md" | "lg" | "xl" | "full";
}) {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const panelRef = React.useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscapeKey(open, onClose);
  useFocusTrap(panelRef, open);

  if (!mounted) return null;

  const widths = {
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[min(96rem,95vw)]",
  } as const;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center",
            // Phones: pinned to the bottom edge as a sheet. Tablet up:
            // centred dialog with a gutter all the way round.
            "justify-end p-0 md:justify-center md:p-6",
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        >
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
          />

          {/* Grab handle, sitting on the dimmed backdrop just above the
              sheet — reads as "drag me down" and keeps the sheet's own
              top edge clean for whatever content starts there. */}
          <motion.span
            aria-hidden
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative z-10 mb-2.5 h-1 w-10 shrink-0 rounded-full bg-white/45 md:hidden"
          />

          <motion.div
            ref={panelRef}
            variants={isMobile ? sheetVariants : dialogVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "relative z-10 w-full overflow-y-auto overscroll-contain",
              "bg-surface shadow-lift ring-1 ring-[var(--border)]",
              // Sheet: only the top corners round, and it never quite
              // reaches the status bar so the page stays visible behind.
              "max-h-[88dvh] rounded-t-[var(--radius-sheet)]",
              "md:max-h-[92dvh] md:rounded-[var(--radius-xl2)]",
              widths[size],
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="tap absolute right-3 top-3 z-30 grid size-11 place-items-center rounded-full bg-surface/85 text-muted backdrop-blur-md ring-1 ring-[var(--border)] transition hover:bg-brand-500 hover:text-white hover:ring-brand-500 md:right-3.5 md:top-3.5 md:size-10"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
