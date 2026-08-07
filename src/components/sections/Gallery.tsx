"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { createPortal } from "react-dom";
import { gallery, galleryCategories } from "@/data/content";
import { useEscapeKey, useLockBodyScroll, useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { AccordionGallery } from "@/components/ui/AccordionGallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

/** Intrinsic sizes of the generated artwork, by span class. */
const DIMS = {
  tall: { w: 1400, h: 1800 },
  wide: { w: 1400, h: 900 },
  square: { w: 1400, h: 1200 },
} as const;

type Item = (typeof gallery)[number];

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const mounted = useMounted();
  useLockBodyScroll(true);
  useEscapeKey(true, onClose);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNav]);

  if (!mounted) return null;
  const item = items[index];
  const dims = DIMS[item.span as keyof typeof DIMS] ?? DIMS.square;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex flex-col bg-ink-950/94 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${items.length}: ${item.alt}`}
    >
      <div className="flex items-center justify-between p-4 pt-[max(1rem,var(--safe-t))] text-white sm:p-6">
        <p className="text-sm">
          <span className="font-semibold">{item.category}</span>
          <span className="ml-3 text-white/50">
            {index + 1} / {items.length}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="tap grid size-11 place-items-center rounded-full ring-1 ring-white/25 transition hover:bg-white/10"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Arrows overlay the image on phones — there is no room for a
          16-unit gutter on either side at 360px. */}
      <div className="relative flex flex-1 items-center justify-center px-3 pb-[max(1rem,var(--safe-b))] sm:px-16">
        <button
          type="button"
          onClick={() => onNav(-1)}
          aria-label="Previous image"
          className="tap absolute left-2 z-10 grid size-11 place-items-center rounded-full bg-ink-950/50 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/10 sm:left-5 sm:size-13 sm:bg-transparent sm:backdrop-blur-none"
        >
          <ChevronLeft className="size-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.figure
            key={item.src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full flex-col items-center gap-4"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={dims.w}
              height={dims.h}
              className="max-h-[62dvh] w-auto rounded-2xl object-contain shadow-lift sm:max-h-[68dvh]"
              sizes="90vw"
              priority
            />
            <figcaption className="max-w-2xl text-center text-sm text-white/70">
              {item.alt}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => onNav(1)}
          aria-label="Next image"
          className="tap absolute right-2 z-10 grid size-11 place-items-center rounded-full bg-ink-950/50 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/10 sm:right-5 sm:size-13 sm:bg-transparent sm:backdrop-blur-none"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

export function Gallery() {
  const [category, setCategory] = React.useState<string>("All");
  const [open, setOpen] = React.useState<number | null>(null);

  /*
    The accordion is a single row, so the panel count has to stay low enough
    that a collapsed sliver still reads as an image. Every category holds four
    shots, which fits; "All" would be all 32, which does not — so it acts as an
    overview instead, showing the lead image from each category. The pills open
    the full set, and the lightbox arrows walk whatever is on screen.
  */
  const items = React.useMemo(() => {
    if (category !== "All") return gallery.filter((g) => g.category === category);
    const seen = new Set<string>();
    return gallery.filter((g) => {
      if (seen.has(g.category)) return false;
      seen.add(g.category);
      return true;
    });
  }, [category]);

  const nav = React.useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  const panels = React.useMemo(
    () => items.map((g) => ({ image: g.src, alt: g.alt, label: g.alt })),
    [items],
  );

  return (
    <section id="gallery" className="section-y scroll-mt-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Inside the Plant"
          title="From compound mixing to container loading"
          highlight={["container"]}
          lead="Our facility at Rubber Park, Valayanchirangara — where the compounding, curing and quality control behind every roll actually happens."
        />

        {/* Category filter */}
        <Reveal preset="up" delay={0.1}>
          <div className="snap-rail bleed-mobile no-scrollbar mt-8 flex justify-start gap-2 overflow-x-auto pb-1 sm:mt-10 md:justify-center">
            {galleryCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setOpen(null);
                }}
                aria-pressed={category === c}
                className={cn(
                  "relative inline-flex min-h-10 shrink-0 items-center rounded-full px-4 py-2 text-[0.84rem] font-medium transition-colors duration-300",
                  category === c
                    ? "text-white"
                    : "text-muted ring-1 ring-inset ring-[var(--border)] hover:text-fg hover:ring-brand-500/50",
                )}
              >
                {category === c && (
                  <motion.span
                    layoutId="gallery-pill"
                    className="absolute inset-0 rounded-full bg-brand-500"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/*
          Accordion rail. `key={category}` remounts it on filter change so the
          expanded index resets to the middle of the new set rather than
          pointing past the end of a shorter one. Below 520px the component's
          own stylesheet flips it to a stacked column.
        */}
        <Reveal preset="up" delay={0.15}>
          <div className="mt-8 sm:mt-10">
            <AccordionGallery
              key={category}
              items={panels}
              defaultIndex={Math.floor(panels.length / 2)}
              accentColor="#f47920"
              overlayColor="#0d0d0e"
              /* The artwork is already near-black; the stock 0.35 dim plus
                 full grayscale flattens collapsed panels into blank
                 rectangles. Raise these once real photography lands. */
              dim={0.1}
              grayscale={false}
              height={460}
              gap={12}
              radius={20}
              expandRatio={panels.length > 4 ? 0.46 : 0.55}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 46vw"
              onItemActivate={setOpen}
            />
          </div>
        </Reveal>

        <p className="mt-8 text-center text-[0.78rem] text-muted">
          Hover a panel to expand it, then click to view it full size.{" "}
          {category === "All"
            ? "Showing one shot per area — pick a category above for the full set."
            : `All ${items.length} shots from ${category}.`}{" "}
          Placeholder artwork — swap in factory photography at the same paths.
        </p>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            items={items}
            index={open}
            onClose={() => setOpen(null)}
            onNav={nav}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
