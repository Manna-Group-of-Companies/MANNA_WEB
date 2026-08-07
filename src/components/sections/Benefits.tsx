"use client";

import { motion } from "framer-motion";
import { benefits } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Spotlight } from "@/components/ui/Tilt";

export function Benefits() {
  return (
    <section id="benefits" className="section-y scroll-mt-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Retread"
          title="The case for retreading, in six numbers"
          highlight={["six"]}
          lead="Retreading is not the cheap option — it is the option that lowers cost per kilometre while keeping a serviceable casing out of the scrap pile."
        />

        <RevealGroup
          as="ul"
          gap={0.075}
          className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {benefits.map((b) => {
            return (
              <RevealItem as="li" key={b.title} preset="up">
                <Spotlight className="h-full rounded-[var(--radius-card)]">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="group relative h-full overflow-hidden rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft transition-shadow duration-500 hover:shadow-lift hover:ring-brand-500/35 xs:p-6 sm:p-7"
                  >
                    {/* corner gradient wash on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <motion.span
                        whileHover={{ rotate: -8, scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        className="grid size-14 place-items-center rounded-2xl bg-brand-500/12 text-brand-600 ring-1 ring-brand-500/20 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"
                      >
                        <Icon name={b.icon} className="size-6" />
                      </motion.span>
                      <span className="rounded-full bg-surface-2 px-3 py-1.5 text-[0.72rem] font-bold text-brand-600 ring-1 ring-inset ring-[var(--border)] dark:text-brand-400">
                        {b.metric}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-[1.3rem] font-bold tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 text-[0.93rem] leading-relaxed text-muted">{b.body}</p>

                    <span
                      aria-hidden
                      className="mt-6 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-transparent transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-x-100"
                    />
                  </motion.div>
                </Spotlight>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
