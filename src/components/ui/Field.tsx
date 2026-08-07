"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import * as React from "react";

/**
 * `text-base` below sm is deliberate: iOS Safari zooms the viewport when a
 * focused control's font-size is under 16px, and it never zooms back out.
 */
export const inputCx =
  "h-12 w-full rounded-xl bg-surface px-4 text-base ring-1 ring-[var(--border)] outline-none transition placeholder:text-muted focus:ring-2 focus:ring-brand-500 sm:text-[0.92rem]";

/**
 * Labelled form field with an animated inline error.
 * `id` must match the control's id so the label and `${id}-error` wire up.
 */
export function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
  className,
  labelAs = "label",
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  /** Use "span" when the control is a group (e.g. radiogroup) rather than one input. */
  labelAs?: "label" | "span";
}) {
  const labelContent = (
    <>
      {label}
      {required && (
        <span className="ml-1 text-brand-500" aria-hidden>
          *
        </span>
      )}
      {!required && <span className="ml-1.5 text-[0.72rem] text-muted">optional</span>}
    </>
  );

  return (
    <div className={className}>
      {labelAs === "label" ? (
        <label htmlFor={id} className="mb-1.5 block text-[0.82rem] font-medium">
          {labelContent}
        </label>
      ) : (
        <span id={`${id}-label`} className="mb-1.5 block text-[0.82rem] font-medium">
          {labelContent}
        </span>
      )}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-[0.78rem] text-red-500"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && <p className="mt-1.5 text-[0.75rem] text-muted">{hint}</p>}
    </div>
  );
}
