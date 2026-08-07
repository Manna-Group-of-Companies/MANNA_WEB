"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Download, Eye, Ruler } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { Product } from "@/data/products";
import { downloadDatasheet } from "@/lib/datasheet";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spotlight, Tilt } from "@/components/ui/Tilt";
import { useToast } from "@/components/ui/Toast";

export function ProductCard({
  product,
  view,
  onQuickView,
  onQuote,
  index = 0,
}: {
  product: Product;
  view: "grid" | "list";
  onQuickView: () => void;
  onQuote: () => void;
  index?: number;
}) {
  const { toast } = useToast();

  const handleDatasheet = () => {
    downloadDatasheet(product);
    toast({
      kind: "success",
      title: "Datasheet downloading",
      body: `${product.name} — open it and use Print → Save as PDF.`,
    });
  };

  const shownSizes = product.sizes.slice(0, view === "list" ? 10 : 8);
  const moreSizes = product.sizes.length - shownSizes.length;

  const media = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-ink-950",
        view === "grid" ? "aspect-[16/10] w-full" : "aspect-[16/10] w-full sm:aspect-auto sm:w-72 lg:w-96",
      )}
    >
      <Image
        src={product.image}
        alt={`${product.name} — ${product.tagline}`}
        fill
        sizes={view === "grid" ? "(max-width: 640px) 100vw, (max-width: 1440px) 50vw, 640px" : "(max-width: 640px) 100vw, 24rem"}
        className="object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.06]"
        loading={index < 3 ? "eager" : "lazy"}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-80"
      />
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <Badge variant="solid" size="sm">
          {product.badge}
        </Badge>
        <Badge variant="glass" size="sm" className="text-white">
          {product.category}
        </Badge>
      </div>
      <span className="absolute bottom-4 left-4 font-display text-2xl font-bold tracking-tight text-white/95 sm:text-3xl">
        {product.abbr}
      </span>

      {/*
        Quick view affordance. On a mouse it is a full-cover scrim revealed
        on hover; on touch, where there is no hover, it collapses to a
        permanently visible pill so the tap target is discoverable.
      */}
      <button
        type="button"
        onClick={onQuickView}
        aria-label={`Quick view: ${product.name}`}
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-400",
          "bg-ink-950/45 opacity-0 backdrop-blur-[3px] focus-visible:opacity-100 group-hover:opacity-100",
          "pointer-coarse:place-items-end pointer-coarse:bg-transparent pointer-coarse:p-4 pointer-coarse:opacity-100 pointer-coarse:backdrop-blur-none",
        )}
      >
        <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-lift transition-transform duration-400 group-hover:translate-y-0 pointer-coarse:translate-y-0 pointer-coarse:px-3.5 pointer-coarse:py-2 pointer-coarse:text-[0.78rem]">
          <Eye className="size-4" aria-hidden />
          Quick View
        </span>
      </button>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-5 xs:p-6 sm:p-7">
      <h3 className="font-display text-[1.25rem] font-bold leading-tight tracking-tight xs:text-[1.3rem] sm:text-[1.5rem]">
        {product.name}
      </h3>
      <p className="mt-1.5 text-[0.92rem] text-brand-600 dark:text-brand-400">{product.tagline}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{product.summary}</p>

      {/* Sizes */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
          <Ruler className="size-3.5" aria-hidden />
          Available sizes
          {product.sizes.length > 0 && (
            <span className="text-brand-600 dark:text-brand-400">({product.sizes.length})</span>
          )}
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {shownSizes.map((s) => (
            <li
              key={s.code}
              className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[0.72rem] font-medium text-fg ring-1 ring-inset ring-[var(--border)] transition-colors hover:ring-brand-500/50"
            >
              {s.code}
            </li>
          ))}
          {moreSizes > 0 && (
            <li>
              <button
                type="button"
                onClick={onQuickView}
                className="rounded-md bg-brand-500/12 px-2 py-1 font-mono text-[0.72rem] font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white dark:text-brand-400"
              >
                +{moreSizes} more
              </button>
            </li>
          )}
          {product.sizes.length === 0 && (
            <li className="text-[0.82rem] italic text-muted">
              Made to order — sizes confirmed at enquiry
            </li>
          )}
        </ul>
      </div>

      {/* Applications */}
      <div className="mt-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
          Applications
        </p>
        <p className="mt-2 text-[0.87rem] leading-relaxed text-muted">
          {product.applications.slice(0, view === "list" ? 5 : 3).join(" · ")}
          {product.applications.length > (view === "list" ? 5 : 3) && " …"}
        </p>
      </div>

      {/* Key features */}
      <ul className="mt-5 space-y-2">
        {product.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[0.87rem] leading-snug text-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--border)] pt-5">
        <Button size="sm" onClick={onQuote} className="min-w-full flex-1 xs:min-w-[9rem]">
          Request Quote
          <ArrowUpRight className="size-4" aria-hidden />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDatasheet}>
          <Download className="size-4" aria-hidden />
          Datasheet
        </Button>
        <Button size="sm" variant="ghost" onClick={onQuickView} aria-label={`Quick view ${product.name}`}>
          <Eye className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Details</span>
        </Button>
      </div>
    </div>
  );

  const shell = (
    <Spotlight className="h-full rounded-[var(--radius-card)]">
      <article
        id={`product-${product.id}`}
        className={cn(
          // scroll-mt clears the sticky filter toolbar when a link jumps here
          "group relative flex h-full scroll-mt-40 flex-col overflow-hidden rounded-[var(--radius-card)]",
          "bg-surface ring-1 ring-[var(--border)] shadow-soft",
          "transition-[box-shadow,border-color] duration-500 hover:shadow-lift hover:ring-brand-500/35",
          view === "list" && "sm:flex-row",
        )}
      >
        {media}
        {body}
      </article>
    </Spotlight>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.3) }}
      className="h-full"
    >
      {view === "grid" ? <Tilt max={5} scale={1.01} className="h-full">{shell}</Tilt> : shell}
    </motion.div>
  );
}
