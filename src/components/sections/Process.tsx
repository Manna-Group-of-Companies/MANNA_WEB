"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";
import { processSteps } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

const STEPS = processSteps;

/** Desktop: horizontal rail whose active node tracks scroll position. */
function HorizontalTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [manual, setManual] = React.useState<number | null>(null);
  const [scrollStep, setScrollStep] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 68%", "end 62%"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const lineWidth = useTransform(smooth, [0, 1], ["0%", "100%"]);

  React.useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      const i = Math.min(STEPS.length - 1, Math.max(0, Math.round(v * (STEPS.length - 1))));
      setScrollStep(i);
    });
    return unsub;
  }, [smooth]);

  const activeIndex = manual ?? scrollStep;
  const active = STEPS[activeIndex];

  return (
    // Seven nodes need ~1280px to breathe; below that the vertical rail is used.
    <div ref={ref} className="hidden xl:block">
      {/* Rail */}
      <div className="relative mt-16">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[2.15rem] h-[3px] rounded-full bg-[var(--border)]"
        />
        <motion.div
          aria-hidden
          style={{ width: lineWidth }}
          className="absolute left-0 top-[2.15rem] h-[3px] rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
        />

        <ol
          className="relative grid grid-cols-7 gap-2"
          aria-label="Tyre retreading process steps"
        >
          {STEPS.map((step, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;
            return (
              <li key={step.n} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => setManual(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  className="group flex flex-col items-center focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "relative grid size-[4.3rem] place-items-center rounded-2xl transition-all duration-500 [transition-timing-function:var(--ease-out-quint)]",
                      isActive
                        ? "scale-110 bg-brand-500 text-white shadow-glow"
                        : isDone
                          ? "bg-brand-500/15 text-brand-600 ring-1 ring-brand-500/40 dark:text-brand-400"
                          : "bg-surface text-muted ring-1 ring-[var(--border)] group-hover:ring-brand-500/50",
                    )}
                  >
                    {isDone ? (
                      <Check className="size-6" aria-hidden />
                    ) : (
                      <Icon name={step.icon} className="size-6" />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="process-halo"
                        className="absolute -inset-2 -z-10 rounded-3xl bg-brand-500/20 blur-md"
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-4 text-[0.68rem] font-bold tabular-nums tracking-[0.2em] transition-colors",
                      isActive ? "text-brand-600 dark:text-brand-400" : "text-muted",
                    )}
                  >
                    {step.n}
                  </span>
                  <span
                    className={cn(
                      "mt-1 text-[0.92rem] font-semibold leading-tight transition-colors",
                      isActive ? "text-fg" : "text-muted group-hover:text-fg",
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Detail panel */}
      <div className="relative mt-12 min-h-[15rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.n}
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 rounded-[var(--radius-xl2)] bg-surface p-8 ring-1 ring-[var(--border)] shadow-soft xl:grid-cols-[minmax(0,1fr)_18rem]"
          >
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                {active.duration} — {active.title}
              </p>
              <h3 className="mt-3 font-display text-[length:var(--text-fluid-xl)] font-bold leading-tight tracking-tight">
                {active.summary}
              </h3>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">
                {active.detail}
              </p>
            </div>
            <ul className="space-y-2.5 self-start rounded-2xl bg-surface-2 p-5">
              <li className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted">
                Checks at this stage
              </li>
              {active.checks.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[0.88rem]">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Mobile / tablet: vertical timeline, each card revealing on scroll. */
function VerticalTimeline() {
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 70%"],
  });
  const height = useTransform(
    useSpring(scrollYProgress, { stiffness: 90, damping: 26 }),
    [0, 1],
    ["0%", "100%"],
  );

  return (
    <ol
      ref={ref}
      // Capped and centred so the cards stay readable on tablets and small
      // laptops, where this layout runs all the way up to 1280px.
      className="relative mx-auto mt-10 max-w-2xl space-y-4 sm:mt-12 sm:space-y-5 lg:max-w-3xl xl:hidden"
    >
      {/* Rail sits on the centre of the step icons — 1.5rem below xs where
          the icons are 12 units wide, 1.7rem once they grow to 14. */}
      <div
        aria-hidden
        className="absolute bottom-4 left-6 top-4 w-[2px] rounded-full bg-[var(--border)] xs:left-[1.7rem]"
      />
      <motion.div
        aria-hidden
        style={{ height }}
        className="absolute left-6 top-4 w-[2px] rounded-full bg-gradient-to-b from-brand-400 to-brand-600 xs:left-[1.7rem]"
      />

      {STEPS.map((step, i) => {
        return (
          <motion.li
            key={step.n}
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-3 pl-0 xs:gap-4"
          >
            <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-brand-500 ring-1 ring-[var(--border)] shadow-soft xs:size-14">
              <Icon name={step.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1 rounded-2xl bg-surface p-4 ring-1 ring-[var(--border)] shadow-soft xs:p-5">
              <p className="text-[0.66rem] font-bold tracking-[0.2em] text-brand-600 dark:text-brand-400">
                {step.n} · {step.duration}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{step.detail}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {step.checks.map((c) => (
                  <li
                    key={c}
                    className="rounded-md bg-surface-2 px-2 py-1 text-[0.72rem] text-muted ring-1 ring-inset ring-[var(--border)]"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function Process() {
  return (
    <section id="process" className="section-y relative scroll-mt-24 overflow-hidden bg-subtle">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60 mask-fade-y" />
      <div
        aria-hidden
        className="glow-blob absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 opacity-35"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="How It Works"
          title="Seven stages between a worn casing and a working tyre"
          highlight={["Seven"]}
          lead="Nothing here is decorative. Each stage exists because skipping it is how retreads fail — and every one of them is measured, logged, or both."
        />

        <Reveal preset="up" delay={0.1}>
          <HorizontalTimeline />
        </Reveal>
        <VerticalTimeline />
      </div>
    </section>
  );
}
