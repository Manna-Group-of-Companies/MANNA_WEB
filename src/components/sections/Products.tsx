"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Layers, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import {
  categories,
  fitmentsInUse,
  products,
  totalSizeCount,
  type Fitment,
  type Product,
} from "@/data/products";
import { useQuote } from "@/components/QuoteContext";
import { cn, normalise } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DepthCarousel } from "@/components/ui/DepthCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, Skeleton } from "@/components/ui/Section";
import { ProductCard } from "./ProductCard";
import { QuickView } from "./QuickView";

type SortKey = "featured" | "name" | "sizes" | "application";
type View = "grid" | "list" | "depth";

const VIEWS: { key: View; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "grid", label: "Grid", Icon: LayoutGrid },
  { key: "list", label: "List", Icon: List },
  { key: "depth", label: "Depth", Icon: Layers },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "application", label: "Application A–Z" },
  { key: "sizes", label: "Most sizes" },
  { key: "name", label: "Name A–Z" },
];

function matches(p: Product, q: string) {
  if (!q) return true;
  const n = normalise(q);
  return (
    normalise(p.name).includes(n) ||
    normalise(p.abbr).includes(n) ||
    normalise(p.tagline).includes(n) ||
    normalise(p.summary).includes(n) ||
    normalise(p.category).includes(n) ||
    p.sizes.some((s) => normalise(s.code).includes(n)) ||
    p.applications.some((a) => normalise(a).includes(n)) ||
    p.features.some((f) => normalise(f).includes(n))
  );
}

function FilterChip({
  active,
  onClick,
  children,
  count,
  group,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  /** Shared id so the pill slides between chips in the same rail. */
  group: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex min-h-10 shrink-0 items-center rounded-full px-4 py-2 text-[0.84rem] font-medium transition-colors duration-300",
        active
          ? "text-white"
          : "text-muted ring-1 ring-inset ring-[var(--border)] hover:text-fg hover:ring-brand-500/50",
      )}
    >
      {active && (
        <motion.span
          layoutId={`chip-rail-${group}`}
          className="absolute inset-0 rounded-full bg-brand-500"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className={cn("relative z-10 inline-flex items-center gap-1.5", active && "text-white")}>
        {children}
        {count !== undefined && (
          <span className={cn("tabular-nums", active ? "text-white/70" : "text-muted/70")}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

export function Products() {
  const { requestQuote } = useQuote();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const [fitment, setFitment] = React.useState<Fitment | "All">("All");
  const [sort, setSort] = React.useState<SortKey>("featured");
  const [view, setView] = React.useState<View>("grid");
  const [quickView, setQuickView] = React.useState<Product | null>(null);
  const [filtering, setFiltering] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  // Brief skeleton pass when the result set changes, so cards don't pop in raw.
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setFiltering(true);
    const t = setTimeout(() => setFiltering(false), 220);
    return () => clearTimeout(t);
  }, [query, category, fitment, sort]);

  const results = React.useMemo(() => {
    const filtered = products.filter((p) => {
      if (!matches(p, query)) return false;
      if (category !== "All" && p.category !== category) return false;
      if (fitment !== "All" && !p.sizes.some((s) => s.fitment === fitment)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "sizes") sorted.sort((a, b) => b.sizes.length - a.sizes.length);
    else if (sort === "application")
      sorted.sort((a, b) => a.applications[0].localeCompare(b.applications[0]));
    else sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return sorted;
  }, [query, category, fitment, sort]);

  const activeFilters =
    (query ? 1 : 0) + (category !== "All" ? 1 : 0) + (fitment !== "All" ? 1 : 0);

  /* Depth view shows the range on the card face and defers the detail to
     Quick View — there is no room for sizes and features on a tilted panel. */
  const depthItems = React.useMemo(
    () =>
      results.map((p) => ({
        image: p.image,
        alt: `${p.name} — ${p.tagline}`,
        title: p.name,
        subtitle: `${p.tagline} · ${p.sizes.length || "made-to-order"} ${p.sizes.length ? "sizes" : ""}`.trim(),
        badge: p.badge,
      })),
    [results],
  );

  const reset = () => {
    setQuery("");
    setCategory("All");
    setFitment("All");
    setSort("featured");
  };

  const countFor = (fit: Fitment) =>
    products.filter((p) => p.sizes.some((s) => s.fitment === fit)).length;

  return (
    <section id="products" className="section-y relative scroll-mt-24 bg-subtle">
      {/* Layered backdrop. overflow-hidden lives on this wrapper and never on
          the <section> — an overflow-hidden ancestor would kill the sticky
          toolbar below. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Engineering grid, echoing the hero, faded out top and bottom */}
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-60" />

        {/* Warm halo so the eyebrow and title sit in light instead of on flat black */}
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(58%_100%_at_50%_0%,rgba(244,121,32,0.10),transparent_72%)] dark:bg-[radial-gradient(58%_100%_at_50%_0%,rgba(244,121,32,0.16),transparent_72%)]" />

        {/* Brand blobs — offset corners keep the field from reading symmetrical */}
        <div className="glow-blob absolute -right-40 top-20 size-[32rem] opacity-40" />
        <div className="glow-blob absolute -left-48 bottom-8 size-[28rem] opacity-25" />

        {/* Hairline seam against the hero above */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      </div>

      <div className="container-page relative">
        <SectionHeading
          eyebrow="The Catalogue"
          title="Five ranges. Every vehicle class."
          highlight={["ranges."]}
          lead={`From 400×08 three-wheeler stock to 17.5×25 earthmover sections — ${totalSizeCount} published sizes across pre-cure and hot-process retreading, all priced on request.`}
        />

        {/* Toolbar */}
        <Reveal preset="up" delay={0.1}>
          <div className="glass-strong sticky top-[calc(var(--header-h)+var(--safe-t)+0.25rem)] z-40 mt-10 rounded-[var(--radius-xl2)] p-3 shadow-soft sm:mt-12 sm:p-3.5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a size, range or application — try 1000×20"
                  aria-label="Search products"
                  className="h-12 w-full rounded-xl bg-surface pl-11 pr-10 text-base ring-1 ring-[var(--border)] outline-none transition focus:ring-2 focus:ring-brand-500 placeholder:text-muted sm:text-[0.92rem]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort — shrinks and truncates on narrow screens */}
                <label className="sr-only" htmlFor="sort-select">
                  Sort products
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-12 min-w-0 flex-1 truncate rounded-xl bg-surface px-3 text-base font-medium ring-1 ring-[var(--border)] outline-none transition focus:ring-2 focus:ring-brand-500 sm:px-3.5 sm:text-[0.88rem] lg:flex-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      Sort: {s.label}
                    </option>
                  ))}
                </select>

                {/* Filters toggle (mobile) */}
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  aria-expanded={showFilters}
                  className={cn(
                    "relative grid h-12 shrink-0 place-items-center rounded-xl px-3.5 ring-1 transition lg:hidden",
                    showFilters || activeFilters
                      ? "bg-brand-500 text-white ring-brand-500"
                      : "bg-surface ring-[var(--border)]",
                  )}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal className="size-[1.05rem]" />
                  {activeFilters > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-ink-950 text-[0.62rem] font-bold text-white dark:bg-white dark:text-ink-950">
                      {activeFilters}
                    </span>
                  )}
                </button>

                {/* View toggle */}
                <div
                  role="group"
                  aria-label="View mode"
                  className="flex h-12 shrink-0 items-center gap-1 rounded-xl bg-surface p-1 ring-1 ring-[var(--border)]"
                >
                  {VIEWS.map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setView(key)}
                      aria-pressed={view === key}
                      aria-label={`${label} view`}
                      title={`${label} view`}
                      className={cn(
                        "grid size-10 place-items-center rounded-lg transition-colors",
                        view === key
                          ? "bg-brand-500 text-white"
                          : "text-muted hover:bg-surface-2 hover:text-fg",
                      )}
                    >
                      <Icon className="size-[1.05rem]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter rails */}
            <div className={cn("lg:block", showFilters ? "block" : "hidden")}>
              <div className="mt-3 space-y-2.5 border-t border-[var(--border)] pt-3">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <span className="shrink-0 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-muted sm:w-[4.5rem]">
                    Category
                  </span>
                  <div className="snap-rail no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5">
                    <FilterChip
                      group="category"
                      active={category === "All"}
                      onClick={() => setCategory("All")}
                    >
                      All
                    </FilterChip>
                    {categories.map((c) => (
                      <FilterChip
                        key={c}
                        group="category"
                        active={category === c}
                        onClick={() => setCategory(c)}
                        count={products.filter((p) => p.category === c).length}
                      >
                        {c}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <span className="shrink-0 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-muted sm:w-[4.5rem]">
                    Fitment
                  </span>
                  <div className="snap-rail no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5">
                    <FilterChip
                      group="fitment"
                      active={fitment === "All"}
                      onClick={() => setFitment("All")}
                    >
                      All sizes
                    </FilterChip>
                    {fitmentsInUse.map((f) => (
                      <FilterChip
                        key={f}
                        group="fitment"
                        active={fitment === f}
                        onClick={() => setFitment(f)}
                        count={countFor(f)}
                      >
                        {f}
                      </FilterChip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Result meta */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted">
            Showing <span className="font-semibold text-fg">{results.length}</span> of{" "}
            {products.length} ranges
            {fitment !== "All" && (
              <>
                {" "}
                matching <Badge size="xs">{fitment}</Badge>
              </>
            )}
          </p>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="mt-6">
          {filtering && view !== "depth" ? (
            <div
              className={cn(
                "grid gap-6 lg:gap-8",
                view === "grid" ? "sm:grid-cols-2" : "grid-cols-1",
              )}
              aria-hidden
            >
              {Array.from({ length: Math.max(results.length, 3) }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "overflow-hidden rounded-[var(--radius-card)] ring-1 ring-[var(--border)]",
                    view === "list" && "sm:flex",
                  )}
                >
                  <Skeleton className={cn("rounded-none", view === "grid" ? "aspect-[16/10] w-full" : "aspect-[16/10] w-full sm:aspect-auto sm:w-96")} />
                  <div className="flex-1 space-y-3 p-6">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[var(--radius-xl2)] bg-surface p-8 text-center ring-1 ring-[var(--border)] sm:p-12"
            >
              <p className="font-display text-xl font-bold">No ranges match that</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                We publish {totalSizeCount} sizes but we make more than we publish. Tell us the
                size you need and we will confirm whether we can supply it.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <Button onClick={reset} variant="secondary">
                  <RotateCcw className="size-4" aria-hidden />
                  Reset filters
                </Button>
                <Button onClick={() => requestQuote()}>Ask about a size</Button>
              </div>
            </motion.div>
          ) : view === "depth" ? (
            /*
              Depth rail. `key` remounts it whenever the result set changes so
              the focused card resets to the first match instead of pointing
              past the end of a shorter list. The stage is taller than the
              380px card to leave room for the dots below it.
            */
            <Reveal preset="up">
              <div className="relative h-[30rem] sm:h-[34rem]">
                <DepthCarousel
                  key={`${query}|${category}|${fitment}|${sort}`}
                  items={depthItems}
                  cardWidth={320}
                  cardHeight={400}
                  radius={20}
                  accentColor="#f47920"
                  tint="#0d0d0e"
                  depth={200}
                  spread={86}
                  tilt={20}
                  perspective={1500}
                  visibleCards={4}
                  falloff={0.18}
                  blur={5}
                  autoplay
                  autoplayDelay={4200}
                  ctaLabel="Quick View"
                  sizes="(max-width: 640px) 76vw, 340px"
                  onItemActivate={(i) => setQuickView(results[i])}
                />
              </div>
              <p className="mt-6 text-center text-[0.78rem] text-muted">
                Drag, scroll sideways or use the arrow keys to walk the stack — click the
                front card for the full spec.
              </p>
            </Reveal>
          ) : (
            <motion.div
              layout
              className={cn(
                "grid items-stretch gap-6 lg:gap-8",
                view === "grid" ? "sm:grid-cols-2" : "grid-cols-1",
              )}
            >
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    view={view}
                    index={i}
                    onQuickView={() => setQuickView(p)}
                    onQuote={() => requestQuote(p.name)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <QuickView
        product={quickView}
        onClose={() => setQuickView(null)}
        onQuote={(p) => requestQuote(p.name)}
      />
    </section>
  );
}
