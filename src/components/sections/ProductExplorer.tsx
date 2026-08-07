"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Download,
  Gauge as GaugeIcon,
  Layers,
  Ruler,
  Target,
} from "lucide-react";
import * as React from "react";
import {
  PERFORMANCE_LABELS,
  products,
  type PerformanceKey,
  type Product,
} from "@/data/products";
import { useQuote } from "@/components/QuoteContext";
import { downloadDatasheet } from "@/lib/datasheet";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Gauge, ProgressBar, SectionHeading } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Toast";

const PERF_KEYS = Object.keys(PERFORMANCE_LABELS) as PerformanceKey[];

/** Grouped bar chart comparing every range on one performance dimension. */
function ComparativeChart({ metric }: { metric: PerformanceKey }) {
  const max = Math.max(...products.map((p) => p.performance[metric]));
  return (
    <div className="space-y-3">
      {products.map((p, i) => {
        const v = p.performance[metric];
        const isBest = v === max;
        return (
          <div
            key={p.id}
            className="grid grid-cols-[4rem_minmax(0,1fr)_2.25rem] items-center gap-2.5 sm:grid-cols-[6.5rem_minmax(0,1fr)_2.5rem] sm:gap-3"
          >
            <span
              className={cn(
                "truncate text-[0.78rem] font-medium",
                isBest ? "text-fg" : "text-muted",
              )}
              title={p.name}
            >
              {p.abbr}
            </span>
            <ProgressBar
              value={v}
              delay={i * 0.06}
              height="h-2.5"
              label={`${p.name} — ${PERFORMANCE_LABELS[metric]}`}
              barClassName={cn(!isBest && "opacity-55")}
            />
            <span
              className={cn(
                "text-right text-[0.78rem] tabular-nums",
                isBest ? "font-bold text-brand-600 dark:text-brand-400" : "text-muted",
              )}
            >
              {v}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProductPanel({ product }: { product: Product }) {
  const { requestQuote } = useQuote();
  const { toast } = useToast();

  const fitments = Array.from(new Set(product.sizes.map((s) => s.fitment)));

  return (
    <div className="grid gap-6 sm:gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <div>
        <Accordion
          defaultOpen="specs"
          items={[
            {
              id: "specs",
              title: (
                <span className="inline-flex items-center gap-2.5">
                  <Layers className="size-4 text-brand-500" aria-hidden />
                  Technical specifications
                </span>
              ),
              subtitle: `${product.curing} · ${product.construction}`,
              content: (
                <dl className="grid gap-x-8 sm:grid-cols-2">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] py-2.5 last:border-0"
                    >
                      <dt>{s.label}</dt>
                      <dd className="text-right font-semibold text-fg">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
            {
              id: "sizes",
              title: (
                <span className="inline-flex items-center gap-2.5">
                  <Ruler className="size-4 text-brand-500" aria-hidden />
                  Available sizes
                </span>
              ),
              subtitle: product.sizes.length
                ? `${product.sizes.length} published across ${fitments.length} vehicle class${fitments.length === 1 ? "" : "es"}`
                : "Made to order — confirmed at enquiry",
              content: product.sizes.length ? (
                <div className="space-y-4">
                  {fitments.map((fit) => (
                    <div key={fit}>
                      <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                        {fit}
                      </p>
                      <motion.ul
                        initial="hidden"
                        whileInView="show"
                        viewport={viewportOnce}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } } }}
                        className="flex flex-wrap gap-1.5"
                      >
                        {product.sizes
                          .filter((s) => s.fitment === fit)
                          .map((s) => (
                            <motion.li
                              key={s.code}
                              variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 },
                              }}
                              className="rounded-lg bg-surface-2 px-2.5 py-1.5 font-mono text-[0.76rem] font-medium text-fg ring-1 ring-inset ring-[var(--border)] transition-colors hover:ring-brand-500/60"
                            >
                              {s.code}
                              {s.hd && (
                                <span className="ml-1.5 rounded bg-brand-500/15 px-1 text-[0.6rem] font-bold text-brand-600 dark:text-brand-400">
                                  HD
                                </span>
                              )}
                            </motion.li>
                          ))}
                      </motion.ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  Sizes for this range are confirmed against your fitment list at enquiry rather
                  than held as a published list — off-highway fitments vary too much by machine
                  for a fixed table to be useful.
                </p>
              ),
            },
            {
              id: "performance",
              title: (
                <span className="inline-flex items-center gap-2.5">
                  <GaugeIcon className="size-4 text-brand-500" aria-hidden />
                  Performance indicators
                </span>
              ),
              subtitle: "Indicative profile across five dimensions",
              content: (
                <div className="space-y-5">
                  <div className="flex flex-wrap justify-center gap-5 sm:justify-start sm:gap-7">
                    {PERF_KEYS.map((k, i) => (
                      <Gauge
                        key={k}
                        value={product.performance[k]}
                        label={PERFORMANCE_LABELS[k]}
                        delay={i * 0.08}
                      />
                    ))}
                  </div>
                  <p className="rounded-lg bg-surface-2 p-3.5 text-[0.8rem] leading-relaxed">
                    Scores compare our own ranges on a 0–100 scale so you can pick between them.
                    They are not laboratory measurements — confirm suitability against your own
                    duty cycle.
                  </p>
                </div>
              ),
            },
            {
              id: "usage",
              title: (
                <span className="inline-flex items-center gap-2.5">
                  <Target className="size-4 text-brand-500" aria-hidden />
                  Usage recommendations
                </span>
              ),
              subtitle: product.applications.slice(0, 2).join(" · "),
              content: (
                <div className="space-y-5">
                  <div>
                    <p className="mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                      Recommended for
                    </p>
                    <ul className="space-y-2">
                      {product.recommendedFor.map((r) => (
                        <li key={r} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                      Applications
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
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
      </div>

      {/* Side rail */}
      <aside className="space-y-5">
        <div className="rounded-2xl bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft sm:p-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
            At a glance
          </p>
          <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight">
            {product.abbr}
          </p>
          <p className="mt-1 text-sm text-muted">{product.tagline}</p>
          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ["Cure", product.curing],
              ["Casings", product.construction],
              ["Sizes", product.sizes.length ? `${product.sizes.length} published` : "Made to order"],
              ["Pricing", "On request"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 space-y-2">
            <Button full onClick={() => requestQuote(product.name)}>
              Request Quote
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
            <Button
              full
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
              Download datasheet
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function ProductExplorer() {
  const [activeId, setActiveId] = React.useState(products[0].id);
  const [metric, setMetric] = React.useState<PerformanceKey>("mileage");
  const active = products.find((p) => p.id === activeId)!;
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = products.findIndex((p) => p.id === activeId);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % products.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (i - 1 + products.length) % products.length;
    else return;
    e.preventDefault();
    setActiveId(products[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="specifications" className="section-y scroll-mt-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Technical Detail"
          title="Everything you need to specify the right range"
          highlight={["specify"]}
          lead="Specifications, the full size list, indicative performance and usage guidance — expandable, comparable, and downloadable as a datasheet."
        />

        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 xl:grid-cols-[15rem_minmax(0,1fr)]">
          {/* Vertical product tabs */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Select a product range"
            onKeyDown={onKeyDown}
            className="snap-rail bleed-mobile no-scrollbar flex gap-2 overflow-x-auto pb-1 xl:sticky xl:top-[calc(var(--header-h)+var(--safe-t)+1rem)] xl:h-fit xl:flex-col xl:overflow-visible xl:pb-0"
          >
            {products.map((p, i) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`explorer-tab-${p.id}`}
                  aria-selected={isActive}
                  aria-controls={`explorer-panel-${p.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(p.id)}
                  className={cn(
                    "group relative shrink-0 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-colors duration-300",
                    isActive
                      ? "bg-surface ring-1 ring-brand-500/40 shadow-soft"
                      : "ring-1 ring-[var(--border)] hover:bg-surface-2",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="explorer-rail"
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand-500"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative block whitespace-nowrap text-[0.9rem] font-semibold xl:whitespace-normal">
                    {p.name}
                  </span>
                  <span className="relative mt-0.5 hidden text-[0.72rem] text-muted xl:block">
                    {p.sizes.length ? `${p.sizes.length} sizes` : "Made to order"} · {p.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            role="tabpanel"
            id={`explorer-panel-${active.id}`}
            aria-labelledby={`explorer-tab-${active.id}`}
          >
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductPanel product={active} />
            </motion.div>
          </div>
        </div>

        {/* Cross-range comparison chart */}
        <Reveal preset="up" className="mt-16">
          <div className="rounded-[var(--radius-xl2)] bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft xs:p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  Compare all five ranges
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Pick a dimension to see how the ranges stack up against each other.
                </p>
              </div>
              <div className="snap-rail no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto rounded-xl bg-surface-2 p-1.5 ring-1 ring-[var(--border)] sm:mx-0">
                {PERF_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMetric(k)}
                    aria-pressed={metric === k}
                    className={cn(
                      "relative shrink-0 rounded-lg px-3 py-2 text-[0.78rem] font-medium transition-colors",
                      metric === k ? "text-white" : "text-muted hover:text-fg",
                    )}
                  >
                    {metric === k && (
                      <motion.span
                        layoutId="metric-pill"
                        className="absolute inset-0 rounded-lg bg-brand-500"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{PERFORMANCE_LABELS[k]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <ComparativeChart metric={metric} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
