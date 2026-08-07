"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Clock3, MessageSquarePlus, ThumbsUp } from "lucide-react";
import * as React from "react";
import {
  formatReviewDate,
  reviews as seedReviews,
  reviewSorts,
  summarise,
  type Review,
  type ReviewSort,
} from "@/data/reviews";
import { site } from "@/data/site";
import { usePersistentState } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { inputCx } from "@/components/ui/Field";
import { Stars } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { ProgressBar, SectionHeading } from "@/components/ui/Section";
import { ReviewForm } from "./ReviewForm";

const MINE_KEY = "manna:reviews:mine:v1";
const HELPFUL_KEY = "manna:reviews:helpful:v1";
const PAGE_SIZE = 4;

/** Module-level so the persisted-state fallbacks keep a stable identity. */
const NO_REVIEWS: Review[] = [];
const NO_IDS: string[] = [];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Reviews() {
  /** Reviews submitted from this browser, awaiting moderation. */
  const [mine, setMine] = usePersistentState<Review[]>(MINE_KEY, NO_REVIEWS);
  const [helpful, setHelpful] = usePersistentState<string[]>(HELPFUL_KEY, NO_IDS);
  const [filter, setFilter] = React.useState(0);
  const [sort, setSort] = React.useState<ReviewSort>("recent");
  const [visible, setVisible] = React.useState(PAGE_SIZE);
  const [writing, setWriting] = React.useState(false);
  const formRef = React.useRef<HTMLDivElement>(null);

  /** Aggregate covers published reviews only — pending ones must not move it. */
  const summary = React.useMemo(() => summarise(seedReviews), []);

  const filtered = React.useMemo(() => {
    const list = seedReviews.filter((r) => !filter || Math.round(r.rating) === filter);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "highest":
          return b.rating - a.rating || b.date.localeCompare(a.date);
        case "lowest":
          return a.rating - b.rating || b.date.localeCompare(a.date);
        case "helpful":
          return (b.helpful ?? 0) - (a.helpful ?? 0) || b.date.localeCompare(a.date);
        default:
          return b.date.localeCompare(a.date);
      }
    });
    return sorted;
  }, [filter, sort]);

  const shown = filtered.slice(0, visible);

  const toggleHelpful = (id: string) => {
    setHelpful((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSubmitted = (review: Review) => {
    setMine((prev) => [review, ...prev]);
    setWriting(false);
  };

  const openForm = () => {
    setWriting(true);
    // Wait for the panel to mount before scrolling to it.
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  return (
    <section id="reviews" className="section-y scroll-mt-24 bg-subtle">
      <div className="container-page">
        <SectionHeading
          eyebrow="Ratings & Reviews"
          title="Rated by the people running the tyres"
          highlight={["running"]}
          lead="Every review is from a verified enquiry or order, published unedited. Add your own — it helps the next fleet manager specify correctly."
        />

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* Summary */}
          <Reveal preset="left">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--safe-t)+1rem)]">
              <div className="rounded-[var(--radius-xl2)] bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft xs:p-6 sm:p-8">
                <div className="flex items-end gap-4">
                  <p className="font-display text-[3.5rem] font-bold leading-none tabular-nums">
                    {summary.average.toFixed(1)}
                  </p>
                  <div className="pb-1.5">
                    <Stars value={summary.average} size="lg" />
                    <p className="mt-1.5 text-[0.82rem] text-muted">
                      {summary.count} review{summary.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">
                  <span className="font-semibold text-fg">{summary.recommendPct}%</span> rated
                  us four stars or better.
                </p>

                {/* Distribution — each row filters the list */}
                <ul className="mt-6 space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = summary.distribution[star];
                    const active = filter === star;
                    return (
                      <li key={star}>
                        <button
                          type="button"
                          onClick={() => {
                            setFilter(active ? 0 : star);
                            setVisible(PAGE_SIZE);
                          }}
                          aria-pressed={active}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-1.5 py-1 text-left transition",
                            "hover:bg-surface-2",
                            active && "bg-surface-2",
                          )}
                        >
                          <span className="w-10 shrink-0 text-[0.8rem] font-medium tabular-nums">
                            {star} ★
                          </span>
                          <ProgressBar
                            value={n}
                            max={Math.max(1, summary.count)}
                            height="h-2"
                            delay={(5 - star) * 0.06}
                            label={`${n} of ${summary.count} reviews gave ${star} stars`}
                          />
                          <span className="w-6 shrink-0 text-right text-[0.78rem] tabular-nums text-muted">
                            {n}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7 border-t border-[var(--border)] pt-6">
                  <Button full size="lg" onClick={openForm}>
                    <MessageSquarePlus className="size-4" aria-hidden />
                    Write a Review
                  </Button>
                  <p className="mt-3 text-center text-[0.76rem] leading-snug text-muted">
                    Prefer to talk? Call {site.phoneDisplay} — we read every review either way.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* List + form */}
          <div className="space-y-5">
            {/* Controls */}
            <Reveal preset="up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter reviews by rating">
                  {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setFilter(star);
                        setVisible(PAGE_SIZE);
                      }}
                      aria-pressed={filter === star}
                      className={cn(
                        "inline-flex min-h-10 items-center rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium ring-1 transition",
                        filter === star
                          ? "bg-brand-500 text-white ring-brand-500"
                          : "bg-surface text-muted ring-[var(--border)] hover:text-fg hover:ring-brand-500/40",
                      )}
                    >
                      {star === 0 ? "All" : `${star} ★`}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-[0.8rem] text-muted">
                  <span className="sr-only sm:not-sr-only">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as ReviewSort);
                      setVisible(PAGE_SIZE);
                    }}
                    aria-label="Sort reviews"
                    className={cn(inputCx, "h-10 w-auto py-0 pr-9 sm:text-[0.82rem]")}
                  >
                    {reviewSorts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Reveal>

            {/* Write-a-review panel */}
            <div ref={formRef}>
              <AnimatePresence initial={false}>
                {writing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-1">
                      <ReviewForm
                        onSubmitted={onSubmitted}
                        onCancel={() => setWriting(false)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Awaiting moderation — visible to this browser only */}
            {mine.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}

            {shown.length === 0 && (
              <div className="rounded-[var(--radius-xl2)] bg-surface p-8 text-center ring-1 ring-[var(--border)]">
                <p className="text-[0.92rem] font-medium">No {filter}-star reviews yet.</p>
                <button
                  type="button"
                  onClick={() => setFilter(0)}
                  className="mt-2 text-[0.85rem] font-medium text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
                >
                  Show all reviews
                </button>
              </div>
            )}

            {shown.map((r, i) => (
              <Reveal key={r.id} preset="up" delay={Math.min(i, 3) * 0.06}>
                <ReviewCard
                  review={r}
                  helpful={helpful.includes(r.id)}
                  onHelpful={() => toggleHelpful(r.id)}
                />
              </Reveal>
            ))}

            {visible < filtered.length && (
              <div className="pt-2 text-center">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show more reviews ({filtered.length - visible})
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  helpful,
  onHelpful,
}: {
  review: Review;
  helpful?: boolean;
  onHelpful?: () => void;
}) {
  const count = (review.helpful ?? 0) + (helpful ? 1 : 0);

  return (
    <article
      className={cn(
        "rounded-[var(--radius-xl2)] bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft xs:p-6 sm:p-7",
        review.pending && "ring-brand-500/40",
      )}
    >
      <header className="flex flex-wrap items-start gap-3.5">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-sm font-bold text-white"
        >
          {initials(review.name)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[0.92rem] font-semibold">{review.name}</p>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-emerald-600 dark:text-emerald-400">
                <BadgeCheck className="size-3.5" aria-hidden />
                Verified buyer
              </span>
            )}
            {review.pending && (
              <Badge variant="brand" size="xs">
                <Clock3 className="size-3" aria-hidden />
                Awaiting moderation
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-[0.8rem] text-muted">
            {[review.org, review.location].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-1 xs:w-auto xs:items-end">
          <Stars value={review.rating} label={`Rated ${review.rating} out of 5`} />
          <time dateTime={review.date} className="text-[0.75rem] text-muted">
            {formatReviewDate(review.date)}
          </time>
        </div>
      </header>

      <h3 className="mt-5 font-display text-[1.05rem] font-semibold leading-snug">
        {review.title}
      </h3>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{review.body}</p>

      {review.pending && (
        <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-[0.8rem] leading-relaxed text-muted">
          Only you can see this. It appears for everyone once our team has checked it.
        </p>
      )}

      {(review.product || onHelpful) && (
        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          {review.product ? (
            <Badge variant="neutral" size="xs">
              {review.product}
            </Badge>
          ) : (
            <span />
          )}

          {onHelpful && (
            <button
              type="button"
              onClick={onHelpful}
              aria-pressed={helpful}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.78rem] font-medium ring-1 transition",
                helpful
                  ? "bg-brand-500/12 text-brand-600 ring-brand-500/30 dark:text-brand-400"
                  : "text-muted ring-[var(--border)] hover:text-fg hover:ring-brand-500/40",
              )}
            >
              <ThumbsUp className={cn("size-3.5", helpful && "fill-current")} aria-hidden />
              Helpful
              {count > 0 && <span className="tabular-nums">({count})</span>}
            </button>
          )}
        </footer>
      )}

      {review.reply && (
        <div className="mt-4 rounded-2xl bg-surface-2 p-4 ring-1 ring-[var(--border)]">
          <p className="text-[0.8rem] font-semibold">
            {site.shortName}
            <span className="ml-2 font-normal text-muted">
              replied {formatReviewDate(review.reply.date)}
            </span>
          </p>
          <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted">{review.reply.body}</p>
        </div>
      )}
    </article>
  );
}
