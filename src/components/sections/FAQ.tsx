"use client";

import { MessageCircleQuestion } from "lucide-react";
import { faqs } from "@/data/content";
import { useQuote } from "@/components/QuoteContext";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

export function FAQ() {
  const { requestQuote } = useQuote();

  return (
    <section id="faq" className="section-y scroll-mt-24 bg-subtle">
      <div className="container-page">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--safe-t)+1rem)] lg:h-fit">
            <SectionHeading
              align="left"
              eyebrow="Questions"
              title="Straight answers, no sales script"
              highlight={["Straight"]}
              lead="The things buyers actually ask us before placing a first order."
            />

            <Reveal preset="up" delay={0.2}>
              <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft sm:mt-8 sm:p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-400">
                  <MessageCircleQuestion className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-display text-lg font-bold tracking-tight">
                  Not covered here?
                </p>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">
                  Send us the size list and the vehicles it is going on. That is usually enough
                  for us to give you a real answer rather than a brochure one.
                </p>
                <Button full className="mt-5" onClick={() => requestQuote()}>
                  Ask a question
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal preset="up" delay={0.1}>
            <Accordion
              defaultOpen="faq-0"
              items={faqs.map((f, i) => ({
                id: `faq-${i}`,
                title: f.q,
                content: <p>{f.a}</p>,
              }))}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
