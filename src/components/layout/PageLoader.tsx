"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Logo } from "@/components/ui/Logo";

/**
 * Brief brand curtain on first load. Content is already server-rendered
 * underneath, and the curtain lifts on mount — it never gates hydration.
 * Skipped entirely for reduced-motion users and on repeat visits in the
 * same session.
 */
export function PageLoader() {
  const reduce = usePrefersReducedMotion();
  // Rendered on the server too, so there is no flash of unstyled hero behind it.
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    let delay = 900;
    try {
      // Already seen this session (or reduced motion) → lift immediately.
      if (sessionStorage.getItem("manna-loaded")) delay = 0;
      else sessionStorage.setItem("manna-loaded", "1");
    } catch {
      /* storage blocked — show it once anyway */
    }
    if (reduce) delay = 0;

    const t = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="pointer-events-none fixed inset-0 z-[150] grid place-items-center bg-ink-950"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              // curtain is near-black, so lift the graphite half of the lockup
              style={{ ["--logo-graphite" as string]: "#f0f0f0" }}
            >
              <Logo onDark className="h-20 sm:h-24" priority />
            </motion.div>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block h-full w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
