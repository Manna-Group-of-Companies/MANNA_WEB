"use client";

import { Star } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
} as const;

export type StarSize = keyof typeof SIZES;

function Row({ size, filled }: { size: StarSize; filled: boolean }) {
  return (
    <span className="flex w-max gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            SIZES[size],
            "shrink-0",
            filled ? "fill-brand-500 text-brand-500" : "text-[var(--border-strong)]",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

/**
 * Read-only star display. Renders a grey row with a clipped gold row on top,
 * so a fractional average like 4.6 shows a partially filled star rather than
 * being rounded away.
 */
export function Stars({
  value,
  size = "md",
  className,
  label,
}: {
  value: number;
  size?: StarSize;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span
      role="img"
      aria-label={label ?? `Rated ${clamped.toFixed(1)} out of 5`}
      className={cn("relative inline-flex", className)}
    >
      <Row size={size} filled={false} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${(clamped / 5) * 100}%` }}
      >
        <Row size={size} filled />
      </span>
    </span>
  );
}

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"] as const;

/**
 * Interactive rating input. Built on real radio inputs so arrow keys, focus
 * and form semantics come for free; the visible stars are the labels.
 */
export function StarInput({
  id,
  name,
  value,
  onChange,
  describedBy,
  invalid,
}: {
  /** Applied to the first radio so validation can focus the group. */
  id?: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  describedBy?: string;
  invalid?: boolean;
}) {
  const [hover, setHover] = React.useState(0);
  const shown = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label="Your rating"
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className="flex flex-wrap items-center gap-2"
      onMouseLeave={() => setHover(0)}
    >
      <span className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            /* 44px of padded label on touch — a bare 28px star is well
               under the minimum target size. */
            className="cursor-pointer p-2 sm:px-0.5 sm:py-1"
            onMouseEnter={() => setHover(n)}
          >
            <input
              id={n === 1 ? id : undefined}
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="peer sr-only"
            />
            <Star
              className={cn(
                "size-7 rounded-sm transition-transform duration-200",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500",
                n <= shown
                  ? "fill-brand-500 text-brand-500"
                  : "text-[var(--border-strong)]",
                n <= hover && "scale-110",
              )}
              aria-hidden
            />
            <span className="sr-only">
              {n} star{n > 1 ? "s" : ""} — {RATING_WORDS[n]}
            </span>
          </label>
        ))}
      </span>
      <span
        className={cn(
          "text-[0.82rem] font-medium transition-opacity",
          shown ? "text-fg" : "text-muted",
        )}
        aria-hidden
      >
        {shown ? RATING_WORDS[shown] : "Tap to rate"}
      </span>
    </div>
  );
}
