"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { useMediaQuery, useMouseParallax } from "@/lib/hooks";
import { cn } from "@/lib/utils";

function TyreGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="7" opacity="0.5" />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="5" opacity="0.35" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x1 = 50 + Math.cos(a) * 36;
        const y1 = 50 + Math.sin(a) * 36;
        const x2 = 50 + Math.cos(a) * 45;
        const y2 = 50 + Math.sin(a) * 45;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.45"
          />
        );
      })}
    </svg>
  );
}

/**
 * `size` is the desktop diameter in px; it scales down on smaller viewports so
 * a 250px glyph doesn't swallow a 360px-wide phone screen. `hideBelow` drops
 * the busiest glyphs on mobile entirely.
 */
const TYRES = [
  { top: "8%", left: "4%", size: 190, depth: 26, dur: 11, delay: 0, spin: 58 },
  { top: "58%", left: "8%", size: 120, depth: 44, dur: 9, delay: 1.4, spin: -42 },
  { top: "16%", right: "7%", size: 250, depth: 18, dur: 13, delay: 0.7, spin: 70 },
  { top: "68%", right: "14%", size: 96, depth: 54, dur: 8, delay: 2.1, spin: -34, hideBelow: "sm" },
  { top: "40%", left: "46%", size: 78, depth: 66, dur: 10, delay: 1.1, spin: 46, hideBelow: "lg" },
];

/** Decorative tyre glyphs with mouse parallax and slow independent drift. */
export function FloatingTyres() {
  const { x, y } = useMouseParallax(1);
  const isTablet = useMediaQuery("(min-width: 640px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const scale = isDesktop ? 1 : isTablet ? 0.72 : 0.46;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {TYRES.map((t, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute text-brand-500/30 will-change-transform dark:text-brand-400/25",
            t.hideBelow === "sm" && "hidden sm:block",
            t.hideBelow === "lg" && "hidden lg:block",
          )}
          style={{
            top: t.top,
            left: t.left,
            right: t.right,
            width: Math.round(t.size * scale),
            height: Math.round(t.size * scale),
          }}
          animate={{
            x: x * t.depth,
            y: y * t.depth,
          }}
          transition={{ type: "spring", stiffness: 42, damping: 18, mass: 1.1 }}
        >
          <motion.div
            animate={{ y: [0, -22, 0], rotate: [0, t.spin > 0 ? 8 : -8, 0] }}
            transition={{
              duration: t.dur,
              delay: t.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="size-full"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: Math.abs(t.spin), repeat: Infinity, ease: "linear" }}
              className="size-full"
            >
              <TyreGlyph className="size-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
