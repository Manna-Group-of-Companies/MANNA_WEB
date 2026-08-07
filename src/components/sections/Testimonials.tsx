"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import * as React from "react";
import { testimonials } from "@/data/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Stars } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [playing, setPlaying] = React.useState(true);
  const reduce = usePrefersReducedMotion();

  const go = React.useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(((next % testimonials.length) + testimonials.length) % testimonials.length);
  }, []);

  const next = React.useCallback(() => go(index + 1, 1), [go, index]);
  const prev = React.useCallback(() => go(index - 1, -1), [go, index]);

  React.useEffect(() => {
    if (!playing || reduce) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, reduce, next, index]);

  const active = testimonials[index];

  return (
    <section
      id="testimonials"
      className="section-y scroll-mt-24 bg-subtle"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="In Their Words"
          title="What operators say after the second tread life"
          highlight={["second"]}
        />

        <Reveal preset="up" delay={0.1}>
          <div
            className="relative mx-auto mt-12 max-w-4xl"
            onMouseEnter={() => setPlaying(false)}
            onMouseLeave={() => setPlaying(true)}
            onFocusCapture={() => setPlaying(false)}
            onBlurCapture={() => setPlaying(true)}
          >
            <div className="relative overflow-hidden rounded-[var(--radius-xl2)] bg-surface p-6 ring-1 ring-[var(--border)] shadow-soft sm:p-10 lg:p-12">
              <Quote
                className="absolute right-8 top-8 size-20 text-brand-500/10 sm:size-28"
                aria-hidden
              />

              {/* Reserved height keeps the card from jumping between quotes
                  of different lengths as the carousel advances */}
              <div className="relative min-h-[20rem] sm:min-h-[15rem] lg:min-h-[13rem]">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.blockquote
                    key={index}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 48, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: dir * -48, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    aria-live="polite"
                    /* Swipe to advance — the expected gesture on a phone.
                       touch-pan-y keeps vertical page scrolling working. */
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.16}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) next();
                      else if (info.offset.x > 60) prev();
                    }}
                    className="touch-pan-y select-none lg:cursor-default"
                  >
                    <Stars value={active.rating} label={`${active.rating} out of 5`} />

                    <p className="mt-6 font-display text-[length:var(--text-fluid-lg)] font-medium leading-relaxed tracking-tight">
                      “{active.quote}”
                    </p>

                    <footer className="mt-7 flex items-center gap-3.5">
                      <span
                        aria-hidden
                        className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-base font-bold text-white"
                      >
                        {active.org
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div>
                        <p className="text-[0.92rem] font-semibold">{active.role}</p>
                        <p className="text-[0.82rem] text-muted">
                          {active.org} · {active.market}
                        </p>
                      </div>
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="tap grid size-11 place-items-center rounded-xl ring-1 ring-[var(--border)] transition hover:bg-brand-500 hover:text-white hover:ring-brand-500 sm:size-10"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next testimonial"
                    className="tap grid size-11 place-items-center rounded-xl ring-1 ring-[var(--border)] transition hover:bg-brand-500 hover:text-white hover:ring-brand-500 sm:size-10"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
                    className="tap ml-1 grid size-11 place-items-center rounded-xl text-muted ring-1 ring-[var(--border)] transition hover:text-fg sm:size-10"
                  >
                    {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.org}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                      onClick={() => go(i, i > index ? 1 : -1)}
                      /* The dot is 8px tall; the button around it is 44 so
                         it is actually hittable with a thumb. */
                      className="group grid h-11 place-items-center px-1"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "block h-2 rounded-full transition-all duration-500",
                          i === index
                            ? "w-8 bg-brand-500"
                            : "w-2 bg-[var(--border-strong)] group-hover:bg-brand-500/50",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Autoplay progress */}
              {playing && !reduce && (
                <motion.span
                  key={`bar-${index}`}
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand-400 to-brand-600"
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
