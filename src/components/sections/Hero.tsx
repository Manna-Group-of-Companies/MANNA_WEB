"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Play, ShieldCheck } from "lucide-react";
import * as React from "react";
import { heroStats, site } from "@/data/site";
import { totalSizeCount } from "@/data/products";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FloatingTyres } from "./FloatingTyres";
import { ParticleField } from "./ParticleField";

/**
 * Background video.
 *
 * Drop your footage at:
 *   public/videos/hero-retreading.webm  (preferred)
 *   public/videos/hero-retreading.mp4   (fallback)
 *
 * Until then the branded poster shows and the video silently stays hidden —
 * nothing renders broken.
 */
function HeroVideo() {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const reduce = usePrefersReducedMotion();
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (reduce) ref.current?.pause();
  }, [reduce]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Poster is always painted underneath so there is never a blank frame */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-poster.svg)" }}
      />
      {!failed && (
        <video
          ref={ref}
          className={`size-full object-cover transition-opacity duration-[1200ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.svg"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        >
          <source src="/videos/hero-retreading.webm" type="video/webm" />
          <source src="/videos/hero-retreading.mp4" type="video/mp4" />
        </video>
      )}

      {/* Legibility scrims — vertical for text, warm brand wash for identity */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/88 via-ink-950/72 to-ink-950/95"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_18%_28%,rgba(244,121,32,0.24),transparent_58%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.55]" />
    </div>
  );
}

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: content drifts up and fades as you scroll past
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const jump = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-heading"
      className="min-h-screen-safe relative isolate flex flex-col justify-center overflow-hidden pb-14 pt-[calc(var(--header-h)+2rem)] text-white sm:pb-16 lg:pb-32 lg:pt-[calc(var(--header-h)+3rem)]"
    >
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        <HeroVideo />
      </motion.div>

      <div className="absolute inset-0 -z-[5]">
        <ParticleField className="size-full" />
      </div>
      <FloatingTyres />

      {/* Gradient glow blobs */}
      <div
        aria-hidden
        className="glow-blob absolute -left-40 top-1/4 -z-[6] size-[38rem] animate-[var(--animate-float-slow)]"
      />
      <div
        aria-hidden
        className="glow-blob absolute -right-32 bottom-0 -z-[6] size-[30rem] opacity-70"
        style={{ animationDelay: "3s" }}
      />

      <motion.div style={{ y, opacity }} className="container-page relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* whitespace-normal overrides the Badge default so this wraps
                instead of overflowing narrow screens */}
            <Badge
              variant="glass"
              size="md"
              className="max-w-full items-start whitespace-normal text-left backdrop-blur-xl"
            >
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {site.yearsExperience}+ years · Rubber Park, Kerala · FIEO registered
              </span>
            </Badge>
          </motion.div>

          <h1
            id="hero-heading"
            className="mt-7 text-[length:var(--text-fluid-4xl)] font-bold leading-[0.98] tracking-[-0.04em]"
          >
            <span className="sr-only">Premium Tyre Retreading Solutions</span>
            <span aria-hidden className="block [perspective:900px]">
              {["Premium", "Tyre", "Retreading", "Solutions"].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className={`inline-block ${i === 2 ? "text-gradient-brand" : ""}`}
                    initial={{ y: "112%", opacity: 0, rotateX: -42 }}
                    animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.95,
                      delay: 0.16 + i * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                  {i < 3 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-[length:var(--text-fluid-lg)] leading-relaxed text-white/75"
          >
            High-performance retreading for commercial, industrial, and off-road vehicles.
            Five ranges, {totalSizeCount} published sizes, and three decades of compounding
            behind every roll.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
          >
            {/* Full-width stacked on phones — thumb-reachable and no
                awkward half-width buttons at 360px. */}
            <Button size="xl" full className="sm:w-auto" onClick={() => jump("#products")}>
              Explore Products
              <ArrowUpRight className="size-[1.15rem]" aria-hidden />
            </Button>
            <Button
              size="xl"
              full
              variant="glass"
              className="sm:w-auto"
              onClick={() => jump("#contact")}
            >
              Request Quote
            </Button>
            <button
              type="button"
              onClick={() => jump("#process")}
              className="group mt-2 inline-flex min-h-11 items-center gap-3 self-start text-sm font-medium text-white/70 transition-colors hover:text-white sm:ml-3 sm:mt-0 sm:self-auto"
            >
              <span className="relative grid size-10 place-items-center rounded-full ring-1 ring-white/30 transition-colors group-hover:bg-white/10">
                <Play className="size-3.5 translate-x-px fill-current" aria-hidden />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-1 ring-white/40 animate-[var(--animate-pulse-ring)]"
                />
              </span>
              See the 7-step process
            </button>
          </motion.div>
        </div>

        {/* Floating statistics */}
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.95 } } }}
          className="rail-mobile bleed-mobile no-scrollbar mt-12 gap-3 pb-2 sm:mt-16 sm:grid sm:grid-cols-2 sm:pb-0 lg:grid-cols-4 lg:gap-4"
        >
          {heroStats.map((s, i) => (
            <motion.li
              key={s.label}
              // Rail cards on phones, grid cells from sm up
              className="w-[63vw] max-w-[15rem] sm:w-auto sm:max-w-none"
              variants={{
                hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 5.5 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.35,
                }}
                className="group glass relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-2xl border-white/12 bg-white/[0.06] p-4 backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500 hover:border-brand-400/50 hover:bg-white/[0.11] hover:shadow-[0_20px_45px_-28px_rgba(244,121,32,0.85)] sm:p-5"
              >
                {/* Hairline brand rule — lights up on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100 sm:inset-x-5"
                />
                <p className="text-balance font-display text-[0.98rem] font-bold leading-tight tracking-tight text-white tabular-nums sm:text-[1.12rem] lg:text-[1.25rem]">
                  {s.value}
                </p>
                <p className="text-[0.66rem] font-medium uppercase leading-snug tracking-[0.14em] text-white/50 transition-colors duration-500 group-hover:text-white/70 sm:text-[0.7rem]">
                  {s.label}
                </p>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => jump("#products")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ opacity }}
        aria-label="Scroll to products"
        className="absolute inset-x-0 bottom-9 z-10 mx-auto hidden w-fit flex-col items-center gap-2 text-white/45 transition-colors hover:text-white lg:flex"
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" aria-hidden />
        </motion.span>
      </motion.button>
    </section>
  );
}
