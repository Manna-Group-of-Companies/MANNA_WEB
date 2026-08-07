"use client";

import { motion } from "framer-motion";
import { Globe, ShieldCheck } from "lucide-react";
import { marqueeItems } from "@/data/content";
import { site, stats } from "@/data/site";
import { Badge } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Trust() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="relative isolate overflow-hidden bg-ink-950 py-16 text-white sm:py-24"
    >
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.7]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_0%,rgba(244,121,32,0.22),transparent_65%)]"
      />
      <div aria-hidden className="glow-blob absolute -right-24 top-0 size-[26rem] opacity-60" />

      <div className="container-page relative">
        <div className="flex flex-col items-start text-left md:items-center md:text-center">
          <Badge
            variant="glass"
            size="md"
            className="max-w-full items-start whitespace-normal text-left"
          >
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Three decades at Rubber Park, Kerala
          </Badge>
          <h2
            id="trust-heading"
            className="mt-5 max-w-3xl text-[length:var(--text-fluid-2xl)] font-bold leading-[1.1] tracking-tight sm:mt-6"
          >
            The numbers behind the name
          </h2>
        </div>

        <RevealGroup
          as="ul"
          gap={0.1}
          className="mt-10 grid gap-3 xs:grid-cols-2 sm:mt-14 sm:gap-6 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <RevealItem as="li" key={s.label} preset="scale">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="glass h-full rounded-2xl border-white/12 bg-white/[0.05] p-5 text-center backdrop-blur-xl transition-colors duration-500 hover:border-brand-400/50 hover:bg-white/[0.09] sm:p-7"
              >
                <p className="font-display text-[length:var(--text-fluid-3xl)] font-bold leading-none tracking-tight text-gradient-brand">
                  <Counter to={s.value} suffix={s.suffix} duration={2.2} />
                </p>
                <p className="mt-3 text-[0.95rem] font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-[0.78rem] text-white/50">{s.hint}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Markets */}
        <div className="mt-10 flex flex-wrap items-center gap-2 sm:mt-14 sm:gap-2.5 md:justify-center">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-white/40">
            <Globe className="size-3.5" aria-hidden />
            Exporting to
          </span>
          {site.markets.map((m) => (
            <Badge key={m} variant="glass" size="sm" className="text-white">
              {m}
            </Badge>
          ))}
        </div>
      </div>

      {/* Infinite product marquee */}
      <div className="mt-12 border-y border-white/10 py-5 sm:mt-16 sm:py-6">
        <Marquee slow>
          {marqueeItems.map((item) => (
            <span key={item} className="flex items-center gap-8 px-8">
              <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-white/45 transition-colors duration-300 hover:text-white sm:text-xl">
                {item}
              </span>
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand-500" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
