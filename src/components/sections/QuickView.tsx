"use client";

import { ArrowUpRight, Check, Download, Ruler, Sparkles, Target } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { PERFORMANCE_LABELS, type PerformanceKey, type Product } from "@/data/products";
import { downloadDatasheet } from "@/lib/datasheet";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";

export function QuickView({
  product,
  onClose,
  onQuote,
}: {
  product: Product | null;
  onClose: () => void;
  onQuote: (p: Product) => void;
}) {
  const { toast } = useToast();
  if (!product) return null;

  const perfKeys = Object.keys(product.performance) as PerformanceKey[];

  return (
    <Modal open={!!product} onClose={onClose} size="xl" labelledBy="quickview-title">
      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        {/* Media rail — a banner on phones, a full-height rail from lg up */}
        <div className="relative h-40 bg-ink-950 xs:h-48 sm:h-60 lg:h-auto lg:min-h-full">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 pr-16 sm:p-6">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge variant="solid" size="sm">{product.badge}</Badge>
              <Badge variant="glass" size="sm" className="text-white">{product.curing}</Badge>
              <Badge variant="glass" size="sm" className="text-white">{product.construction}</Badge>
            </div>
            <p className="mt-2.5 font-display text-2xl font-bold text-white sm:mt-3 sm:text-3xl">
              {product.abbr}
            </p>
          </div>
        </div>

        {/* Detail rail */}
        <div className="p-5 pb-[max(1.25rem,var(--safe-b))] sm:p-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            {product.category}
          </p>
          <h2
            id="quickview-title"
            className="mt-2 font-display text-[length:var(--text-fluid-xl)] font-bold leading-tight tracking-tight lg:pr-10"
          >
            {product.name}
          </h2>
          <p className="mt-2 text-[0.95rem] text-muted">{product.tagline}</p>

          <Tabs
            idPrefix={`qv-${product.id}`}
            className="mt-6"
            items={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <div className="space-y-5">
                    <p className="text-[0.94rem] leading-relaxed text-muted">
                      {product.description}
                    </p>
                    <div>
                      <h3 className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
                        <Sparkles className="size-3.5" aria-hidden />
                        Key features
                      </h3>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {product.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[0.88rem] leading-snug text-muted">
                            <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                id: "specs",
                label: "Specifications",
                content: (
                  <dl className="divide-y divide-[var(--border)] overflow-hidden rounded-xl ring-1 ring-[var(--border)]">
                    {product.specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-baseline justify-between gap-4 px-4 py-3 text-[0.9rem] odd:bg-surface-2/40"
                      >
                        <dt className="text-muted">{s.label}</dt>
                        <dd className="text-right font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                id: "sizes",
                label: `Sizes${product.sizes.length ? ` (${product.sizes.length})` : ""}`,
                content: product.sizes.length ? (
                  <div className="space-y-4">
                    {Array.from(new Set(product.sizes.map((s) => s.fitment))).map((fit) => (
                      <div key={fit}>
                        <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
                          <Ruler className="size-3.5" aria-hidden />
                          {fit}
                        </p>
                        <ul className="mt-2.5 flex flex-wrap gap-1.5">
                          {product.sizes
                            .filter((s) => s.fitment === fit)
                            .map((s) => (
                              <li
                                key={s.code}
                                className="rounded-lg bg-surface-2 px-2.5 py-1.5 font-mono text-[0.76rem] font-medium ring-1 ring-inset ring-[var(--border)]"
                              >
                                {s.code}
                                {s.hd && (
                                  <span className="ml-1.5 text-[0.62rem] font-bold text-brand-500">
                                    HD
                                  </span>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-surface-2 p-5 text-[0.9rem] leading-relaxed text-muted">
                    This range is made to order. Send your fitment list through the enquiry form
                    and we will confirm exactly what we can supply — including whether a
                    published size from another range is a better match.
                  </p>
                ),
              },
              {
                id: "performance",
                label: "Performance",
                content: (
                  <div className="space-y-4">
                    {perfKeys.map((k, i) => (
                      <div key={k}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[0.86rem]">
                          <span className="text-muted">{PERFORMANCE_LABELS[k]}</span>
                          <span className="font-semibold tabular-nums">
                            {product.performance[k]}
                            <span className="text-muted">/100</span>
                          </span>
                        </div>
                        <ProgressBar
                          value={product.performance[k]}
                          delay={i * 0.07}
                          height="h-2"
                          label={PERFORMANCE_LABELS[k]}
                        />
                      </div>
                    ))}
                    <p className="rounded-lg bg-surface-2 p-3.5 text-[0.78rem] leading-relaxed text-muted">
                      Indicative comparison between our own ranges, to help you choose one. Not a
                      laboratory result and not a substitute for testing in your duty cycle.
                    </p>
                  </div>
                ),
              },
              {
                id: "recommended",
                label: "Best for",
                content: (
                  <div className="space-y-5">
                    <div>
                      <h3 className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
                        <Target className="size-3.5" aria-hidden />
                        Recommended for
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {product.recommendedFor.map((r) => (
                          <li
                            key={r}
                            className="flex items-start gap-2.5 rounded-lg bg-surface-2/60 px-3.5 py-2.5 text-[0.89rem] text-muted"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
                        Applications
                      </h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {product.applications.map((a) => (
                          <li key={a}>
                            <Badge variant="neutral" size="sm">{a}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              },
            ]}
          />

          <div className="mt-7 flex flex-col gap-2.5 border-t border-[var(--border)] pt-6 xs:flex-row xs:flex-wrap">
            <Button
              size="lg"
              onClick={() => {
                onQuote(product);
                onClose();
              }}
              className="xs:min-w-[11rem] xs:flex-1"
            >
              Request Quote
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                downloadDatasheet(product);
                toast({
                  kind: "success",
                  title: "Datasheet downloading",
                  body: `${product.name} — open it and use Print → Save as PDF.`,
                });
              }}
            >
              <Download className="size-4" aria-hidden />
              Datasheet
            </Button>
          </div>
          <p className="mt-3 text-center text-[0.78rem] text-muted">
            All ranges are <span className="font-semibold text-fg">priced on request</span>.
          </p>
        </div>
      </div>
    </Modal>
  );
}
