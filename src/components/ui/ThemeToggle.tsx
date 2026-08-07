"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "manna-theme";

/**
 * Blocking script injected in <head> to set the theme class before first
 * paint — without it the page flashes light before hydration.
 */
export const themeInitScript = `
(function(){try{
var k='${STORAGE_KEY}';
var s=localStorage.getItem(k);
var m=window.matchMedia('(prefers-color-scheme: dark)').matches;
var d=s?s==='dark':m;
document.documentElement.classList.toggle('dark',d);
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})();
`;

/**
 * The <html> class is the source of truth — it is set pre-paint by
 * {@link themeInitScript}. We subscribe to it rather than mirroring it into
 * React state, so there is no hydration mismatch and no mount-time re-render.
 */
const themeStore = {
  listeners: new Set<() => void>(),
  subscribe(cb: () => void) {
    themeStore.listeners.add(cb);
    return () => themeStore.listeners.delete(cb);
  },
  emit() {
    themeStore.listeners.forEach((cb) => cb());
  },
  get(): Theme {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  },
};

export function useTheme() {
  const theme = React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.get,
    () => "light" as Theme,
  );
  const ready = useHydrated();

  const apply = React.useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    themeStore.emit();
  }, []);

  const toggle = React.useCallback(
    () => apply(theme === "dark" ? "light" : "dark"),
    [theme, apply],
  );

  return { theme, toggle, ready };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, ready } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-xl",
        "ring-1 ring-[var(--border)] bg-surface-2/60 transition-colors",
        "hover:ring-brand-500/60 hover:text-brand-500",
        !ready && "opacity-0",
        className,
      )}
    >
      <motion.span
        key={theme}
        initial={{ y: 16, opacity: 0, rotate: -35 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="absolute"
      >
        {isDark ? <Moon className="size-[1.15rem]" /> : <Sun className="size-[1.15rem]" />}
      </motion.span>
    </button>
  );
}
