"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import * as React from "react";
import { industries } from "@/data/content";
import { useQuote } from "@/components/QuoteContext";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

export function Industries() {
  const { requestQuote } = useQuote();
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <section id="industries" className="section-y scroll-mt-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Who We Supply"
          title="Built for the industries that punish tyres hardest"
          highlight={["punish"]}
          lead="Different work destroys tread in different ways. Tell us which of these you are, and the range recommendation follows from that."
        />

        <RevealGroup
          as="ul"
          gap={0.06}
          className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {industries.map((ind, i) => {
            const isHot = hovered === ind.title;
            // Last card spans to fill the 7-item grid neatly on wide screens
            const isLast = i === industries.length - 1;

            return (
              <RevealItem
                as="li"
                key={ind.title}
                preset="up"
                className={cn(isLast && "sm:col-span-2 lg:col-span-1 xl:col-span-1")}
              >
                <motion.button
                  type="button"
                  onClick={() => requestQuote()}
                  onMouseEnter={() => setHovered(ind.title)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(ind.title)}
                  onBlur={() => setHovered(null)}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className={cn(
                    "group relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] p-5 text-left xs:p-6",
                    "ring-1 transition-colors duration-500",
                    isHot
                      ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white ring-brand-500 shadow-glow"
                      : "bg-surface ring-[var(--border)] shadow-soft",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-12 place-items-center rounded-xl transition-colors duration-500",
                      isHot ? "bg-white/20 text-white" : "bg-brand-500/12 text-brand-600 dark:text-brand-400",
                    )}
                  >
                    <Icon name={ind.icon} className="size-[1.35rem]" />
                  </span>

                  <h3 className="mt-5 font-display text-[1.15rem] font-bold tracking-tight">
                    {ind.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 flex-1 text-[0.88rem] leading-relaxed transition-colors duration-500",
                      isHot ? "text-white/80" : "text-muted",
                    )}
                  >
                    {ind.body}
                  </p>

                  <span className="mt-5 flex flex-wrap gap-1.5">
                    {ind.fitments.map((f) => (
                      <Badge
                        key={f}
                        variant={isHot ? "glass" : "neutral"}
                        size="xs"
                        className={isHot ? "text-white" : undefined}
                      >
                        {f}
                      </Badge>
                    ))}
                  </span>

                  <span
                    className={cn(
                      "mt-5 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold transition-colors duration-500",
                      isHot ? "text-white" : "text-brand-600 dark:text-brand-400",
                    )}
                  >
                    Get a recommendation
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </motion.button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
