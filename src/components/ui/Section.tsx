"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Badge";
import { Reveal, TextReveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  lead,
  align = "center",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  lead?: string;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-5",
        // Centred headings are a desktop device — on a phone a centred
        // ragged paragraph is measurably harder to read, so everything
        // is left-aligned below md regardless of `align`.
        align === "center"
          ? "items-start text-left md:items-center md:text-center"
          : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal preset="up">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <TextReveal
        as={as}
        text={title}
        highlight={highlight}
        className={cn(
          "max-w-4xl text-[length:var(--text-fluid-2xl)] font-bold leading-[1.08] sm:text-[length:var(--text-fluid-3xl)]",
          align === "center" && "md:mx-auto",
        )}
      />
      {lead && (
        <Reveal preset="up" delay={0.15}>
          <p
            className={cn(
              "max-w-2xl text-[length:var(--text-fluid-base)] leading-relaxed text-muted",
              align === "center" && "md:mx-auto",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Animated horizontal bar that fills when scrolled into view. */
export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  delay = 0,
  height = "h-2.5",
  label,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  delay?: number;
  height?: string;
  label?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div
      ref={ref}
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-[var(--border)]",
        height,
        className,
      )}
    >
      <motion.span
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay }}
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600",
          barClassName,
        )}
      />
    </div>
  );
}

/** Radial gauge used for performance indicators. */
export function Gauge({
  value,
  label,
  size = 92,
  delay = 0,
}: {
  value: number;
  label: string;
  size?: number;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-[var(--surface-2)]"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke="url(#gauge-grad)"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - (value / 100) * circ } : {}}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
          />
          <defs>
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f79340" />
              <stop offset="100%" stopColor="#f47920" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className="absolute inset-0 grid place-items-center text-lg font-bold tabular-nums"
          aria-hidden
        >
          {value}
        </span>
      </div>
      <span className="max-w-[9rem] text-center text-xs font-medium leading-tight text-muted">
        {label}
        <span className="sr-only">: {value} out of 100</span>
      </span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden />;
}
