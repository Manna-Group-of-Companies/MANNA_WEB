import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        brand: "bg-brand-500/12 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/25",
        solid: "bg-brand-500 text-white",
        neutral:
          "bg-[var(--surface-2)] text-muted ring-1 ring-[var(--border)]",
        outline: "ring-1 ring-[var(--border-strong)] text-fg",
        glass: "glass text-white",
        success:
          "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25",
      },
      size: {
        xs: "px-2 py-0.5 text-[0.68rem] tracking-wide",
        sm: "px-2.5 py-1 text-xs",
        md: "px-3.5 py-1.5 text-[0.8rem]",
      },
    },
    defaultVariants: { variant: "brand", size: "sm" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant, size }), className)} {...props} />;
}

/** Small labelled eyebrow used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-400",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-brand-500 to-transparent" />
      {children}
    </span>
  );
}
