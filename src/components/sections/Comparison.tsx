"use client";

import { motion, useInView } from "framer-motion";
import { Info } from "lucide-react";
import * as React from "react";
import { comparison } from "@/data/content";
import { useQuote } from "@/components/QuoteContext";
import { Icon } from "@/components/ui/Icon";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

/** Paired bar: new tyre baseline vs retread, normalised to the larger value. */
function ComparisonRow({
  row,
  index,
}: {
  row: (typeof comparison)[number];
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);

  const scale = Math.max(row.newTyre, row.retread);
  const newPct = (row.newTyre / scale) * 100;
  const retreadPct = (row.retread / scale) * 100;
  const retreadWins = row.lowerIsBetter
    ? row.retread < row.newTyre
    : row.retread > row.newTyre;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group grid gap-4 border-b border-[var(--border)] py-6 last:border-0 md:grid-cols-[13rem_minmax(0,1fr)] md:items-center md:gap-8"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400">
          <Icon name={row.icon} className="size-[1.15rem]" />
        </span>
        <div>
          <h3 className="text-[0.98rem] font-semibold leading-tight">{row.metric}</h3>
          <p className="mt-1 text-[0.78rem] leading-snug text-muted md:max-w-[11rem]">
            {row.note}
          </p>
        </div>
      </div>

      {/*
        Narrow screens stack the label/value pair above a full-width bar;
        from sm up it becomes a three-column row.
      */}
      <div className="space-y-4 sm:space-y-3">
        {/* New tyre */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_6rem] sm:gap-y-0">
          <span className="text-[0.78rem] font-medium text-muted">New tyre</span>
          <span className="text-right text-[0.78rem] text-muted sm:order-3">{row.newLabel}</span>
          <div className="col-span-2 h-3 overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-[var(--border)] sm:order-2 sm:col-span-1">
            <motion.span
              initial={{ width: 0 }}
              animate={inView ? { width: `${newPct}%` } : {}}
              transition={{ duration: 1.1, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="block h-full rounded-full bg-ink-400 dark:bg-ink-600"
            />
          </div>
        </div>

        {/* Retread */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_6rem] sm:gap-y-0">
          <span className="text-[0.78rem] font-semibold text-brand-600 dark:text-brand-400">
            Retreaded
          </span>
          <span
            className={cn(
              "text-right text-[0.78rem] font-semibold sm:order-3",
              retreadWins ? "text-brand-600 dark:text-brand-400" : "text-muted",
            )}
          >
            {row.retreadLabel}
          </span>
          <div className="col-span-2 h-3 overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-[var(--border)] sm:order-2 sm:col-span-1">
            <motion.span
              initial={{ width: 0 }}
              animate={inView ? { width: `${retreadPct}%` } : {}}
              transition={{ duration: 1.1, delay: 0.3 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Comparison() {
  const { requestQuote } = useQuote();

  return (
    <section id="comparison" className="section-y relative scroll-mt-24 overflow-hidden bg-subtle">
      <div aria-hidden className="glow-blob absolute -left-32 bottom-0 size-[30rem] opacity-40" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Head to Head"
          title="New tyre vs. retreaded tyre"
          highlight={["retreaded"]}
          lead="Six dimensions that actually move the budget. Bars are normalised against the higher value in each row, with the new tyre set as the baseline."
        />

        <Reveal preset="up" delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[var(--radius-xl2)] bg-surface p-4 ring-1 ring-[var(--border)] shadow-soft xs:p-5 sm:mt-12 sm:p-9">
            <div className="hidden grid-cols-[13rem_minmax(0,1fr)] gap-8 border-b border-[var(--border)] pb-4 md:grid">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted">
                Dimension
              </span>
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted">
                Relative comparison
              </span>
            </div>

            {comparison.map((row, i) => (
              <ComparisonRow key={row.metric} row={row} index={i} />
            ))}

            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-surface-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-muted">
                <Info className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                Indicative industry figures for decision support. Actual results depend on casing
                condition, duty cycle, road surface and maintenance — we will talk through your
                numbers rather than promise ours.
              </p>
              <Button onClick={() => requestQuote()} className="w-full shrink-0 sm:w-auto">
                Work out your cost per km
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
