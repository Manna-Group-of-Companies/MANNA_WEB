"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "font-medium whitespace-nowrap select-none",
    "transition-[transform,box-shadow,background-color,color,border-color] duration-300",
    "[transition-timing-function:var(--ease-out-quint)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.975]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-white shadow-[0_10px_30px_-10px_rgba(244,121,32,0.6)] hover:bg-brand-600 hover:shadow-[0_16px_44px_-12px_rgba(244,121,32,0.78)] hover:-translate-y-0.5",
        secondary:
          "bg-[var(--surface)] text-fg border border-[var(--border-strong)] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:-translate-y-0.5 shadow-soft",
        ghost:
          "text-fg hover:bg-[var(--surface-2)] hover:text-brand-600 dark:hover:text-brand-400",
        outline:
          "border border-brand-500/60 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white hover:-translate-y-0.5",
        glass:
          "glass text-white hover:bg-white/20 hover:-translate-y-0.5 border-white/25",
        dark: "bg-ink-950 text-white hover:bg-ink-800 hover:-translate-y-0.5 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
      },
      size: {
        sm: "h-9 rounded-lg px-3.5 text-sm",
        md: "h-11 rounded-xl px-5 text-[0.95rem]",
        lg: "h-13 rounded-2xl px-7 text-base py-3.5",
        xl: "h-14 rounded-2xl px-8 text-[1.05rem]",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

type Ripple = { id: number; x: number; y: number; size: number };

function useRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const add = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = Date.now() + Math.random();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
  }, []);

  const node = (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.62, ease: "easeOut" }}
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          className="absolute rounded-full bg-current"
        />
      ))}
    </span>
  );

  return { add, node };
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  href?: string;
  external?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, full, href, external, loading, children, onClick, ...props },
    ref,
  ) => {
    const { add, node } = useRipple();
    const classes = cn(button({ variant, size, full }), className);

    const inner = (
      <>
        {node}
        <span className={cn("relative z-10 inline-flex items-center gap-2", loading && "opacity-0")}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 z-10 grid place-items-center">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}
      </>
    );

    if (href) {
      const linkProps = external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};
      return (
        <Link
          href={href}
          className={classes}
          onClick={(e) => add(e)}
          {...linkProps}
          aria-busy={loading || undefined}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        onClick={(e) => {
          add(e);
          onClick?.(e);
        }}
        {...props}
      >
        {inner}
      </button>
    );
  },
);
Button.displayName = "Button";
