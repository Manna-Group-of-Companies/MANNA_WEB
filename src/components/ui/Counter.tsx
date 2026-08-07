"use client";

import { animate, useInView } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Counter({
  to,
  from = 0,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
  decimals = 0,
}: {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = React.useState(from);

  React.useEffect(() => {
    if (!inView) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // duration 0 still resolves through onUpdate, so reduced-motion users land
    // on the final value without a synchronous setState in the effect body.
    const controls = animate(from, to, {
      duration: reduce ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  const display = React.useMemo(() => {
    const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    return decimals > 0
      ? rounded
      : new Intl.NumberFormat("en-IN").format(Math.round(value));
  }, [value, decimals]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {/* Screen readers get the final value immediately, not the tick-up */}
      <span aria-hidden>
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  );
}
