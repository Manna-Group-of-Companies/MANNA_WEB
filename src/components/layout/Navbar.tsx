"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import * as React from "react";
import { megaColumns, megaHighlights, primaryNav, sectionIds } from "@/data/nav";
import { site } from "@/data/site";
import { useLockBodyScroll, useScrollSpy, useScrollState } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchDialog } from "./SearchDialog";

/** Thin scroll-progress rail pinned to the top of the header. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"
    />
  );
}

export function Navbar() {
  const { scrolled } = useScrollState();
  const active = useScrollSpy(sectionIds);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useLockBodyScroll(mobileOpen);

  // ⌘K / Ctrl+K opens search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  /**
   * At the top of the page the header is transparent over the dark hero, so
   * every control has to be styled light-on-dark regardless of the colour
   * theme. Once it gains its glass background, normal theme colours apply.
   */
  const onHero = !scrolled;
  const chip = onHero
    ? "bg-white/10 text-white ring-white/25 hover:bg-white/20 hover:ring-white/40"
    : "bg-surface-2/60 text-muted ring-[var(--border)] hover:text-fg hover:ring-brand-500/50";

  const jump = (href: string) => {
    setMobileOpen(false);
    setMegaOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-brand-500 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          // pt-safe clears the status bar / notch when the page is rendered
          // edge to edge (viewportFit: "cover")
          "fixed inset-x-0 top-0 z-[90] pt-[var(--safe-t)] transition-all duration-500 [transition-timing-function:var(--ease-out-quint)]",
          scrolled
            ? "glass-strong border-b border-[var(--border)] shadow-soft"
            : "border-b border-transparent bg-transparent text-white",
        )}
        // Unscrolled, the header floats over the dark hero, where the logo's
        // graphite half and the default ink text are both near-invisible.
        style={onHero ? { ["--logo-graphite" as string]: "#f0f0f0" } : undefined}
      >
        {scrolled && <ScrollProgress />}

        <nav
          aria-label="Primary"
          className="container-page flex h-[var(--header-h)] items-center justify-between gap-3 sm:gap-4"
        >
          {/* Brand */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              jump("#home");
            }}
            className="group flex shrink-0 items-center gap-3 sm:gap-3.5"
            aria-label={`${site.name} — home`}
          >
            <Logo
              priority
              onDark={onHero}
              className="h-11 shrink-0 transition-transform duration-500 group-hover:scale-[1.04] xs:h-13 lg:h-18 xl:h-14 2xl:h-18"
            />
            {/*
              Divider + business unit — the group mark carries the brand,
              this says which company within it.

              Hidden between xl and 2xl: that is exactly the band where the
              full desktop nav is showing but the viewport is not yet wide
              enough to hold brand + eight links + actions on one line.
            */}
            <span
              aria-hidden
              className="hidden h-9 w-px bg-[var(--border-strong)] sm:block lg:h-11 xl:hidden 2xl:block"
            />
            <span className="hidden leading-tight sm:block xl:hidden 2xl:block">
              <span className="block font-display text-[0.95rem] font-bold tracking-tight lg:text-[1.05rem]">
                Rubber Products
              </span>
              <span
                className={cn(
                  "block text-[0.64rem] font-medium uppercase tracking-[0.17em] lg:text-[0.7rem]",
                  onHero ? "text-white/60" : "text-muted",
                )}
              >
                Pvt. Ltd.
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            {primaryNav.map((item) => {
              const isActive = active === item.id;
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={item.mega ? openMega : undefined}
                  onMouseLeave={item.mega ? closeMega : undefined}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      jump(item.href);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    aria-expanded={item.mega ? megaOpen : undefined}
                    className={cn(
                      "relative flex items-center gap-1 rounded-xl px-3 py-2 text-[0.9rem] font-medium transition-colors duration-300 2xl:px-3.5",
                      onHero
                        ? isActive
                          ? "text-white"
                          : "text-white/70 hover:text-white"
                        : isActive
                          ? "text-fg"
                          : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-300",
                          megaOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-brand-500"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products and sizes"
              // Only from 2xl — between md and 2xl the icon button below
              // carries search, and the ~100px saved is what keeps the
              // desktop nav on one line at 1280.
              className={cn(
                "group hidden h-10 items-center gap-2 rounded-xl px-3 text-sm ring-1 transition 2xl:flex",
                chip,
              )}
            >
              <Search className="size-4" aria-hidden />
              <span>Search</span>
              <kbd
                className={cn(
                  "ml-1 rounded border px-1.5 py-0.5 font-sans text-[0.65rem]",
                  onHero
                    ? "border-white/25 bg-white/10"
                    : "border-[var(--border)] bg-surface",
                )}
              >
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={cn(
                "grid size-10 place-items-center rounded-xl ring-1 transition 2xl:hidden",
                chip,
              )}
            >
              <Search className="size-[1.1rem]" />
            </button>

            <ThemeToggle className={cn("ring-1", chip)} />

            <Button
              href="#contact"
              size="md"
              className="hidden sm:inline-flex"
              onClick={(e) => {
                e.preventDefault();
                jump("#contact");
              }}
            >
              Request Quote
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={cn("grid size-10 place-items-center rounded-xl ring-1 transition xl:hidden", chip)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute inset-x-0 top-full hidden xl:block"
            >
              <div className="container-page pb-6">
                <div className="glass-strong overflow-hidden rounded-[var(--radius-xl2)] shadow-lift">
                  <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_1fr_0.85fr]">
                    {megaColumns.map((col) => (
                      <div key={col.title}>
                        <div className="mb-4 flex items-baseline justify-between gap-3">
                          <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            {col.title}
                          </h3>
                          <span className="text-[0.68rem] text-muted">{col.note}</span>
                        </div>
                        <ul className="space-y-1">
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  jump(link.href);
                                }}
                                className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-brand-500/10"
                              >
                                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500/12 text-[0.62rem] font-bold text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400">
                                  {link.abbr}
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold leading-snug">
                                    {link.label}
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-snug text-muted">
                                    {link.desc}
                                  </span>
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
                      <Badge variant="glass" size="xs" className="mb-3">
                        Price on request
                      </Badge>
                      <p className="font-display text-lg font-bold leading-snug">
                        Send us your size list and get a quote back.
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        Exporting to Africa &amp; the Middle East from Rubber Park, Kerala.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-sm text-white/90">
                        {megaHighlights.map((h) => (
                          <li key={h.label} className="flex items-start gap-2">
                            <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/70" />
                            {h.label}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="glass"
                        size="sm"
                        full
                        className="mt-5 bg-white/15"
                        onClick={() => jump("#contact")}
                      >
                        Request a quote
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[95] bg-ink-950/60 backdrop-blur-sm xl:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              /* Full-bleed on phones, a panel from sm up — a 12% sliver of
                 dimmed page is wasted space on a 360px screen. */
              className="fixed inset-y-0 right-0 z-[96] flex w-full flex-col bg-surface shadow-lift sm:w-[min(23rem,88vw)] xl:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-4 pt-[max(1rem,var(--safe-t))] sm:px-5">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="tap grid size-11 place-items-center rounded-xl bg-surface-2 transition hover:text-brand-500"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                <ul className="space-y-1">
                  {primaryNav.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.045 }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          jump(item.href);
                        }}
                        className={cn(
                          // Bigger type and a 52px row: this is the primary
                          // way the site is navigated on a phone.
                          "relative flex min-h-[3.25rem] items-center justify-between gap-3 rounded-xl px-4 py-3 font-display text-[1.15rem] font-semibold tracking-tight transition-colors",
                          active === item.id
                            ? "bg-brand-500/12 text-brand-600 dark:text-brand-400"
                            : "hover:bg-surface-2",
                        )}
                      >
                        {active === item.id && (
                          <span
                            aria-hidden
                            className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-brand-500"
                          />
                        )}
                        {item.label}
                        <ArrowUpRight className="size-4 shrink-0 opacity-40" aria-hidden />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-[var(--border)] pt-5">
                  <p className="px-4 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted">
                    Ranges
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    {megaColumns[0].links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            jump(link.href);
                          }}
                          className="flex min-h-[3rem] items-center gap-3 rounded-xl px-4 py-2.5 text-[0.95rem] transition-colors hover:bg-surface-2"
                        >
                          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-500/12 text-[0.62rem] font-bold text-brand-600 dark:text-brand-400">
                            {link.abbr}
                          </span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              <div className="shrink-0 space-y-2.5 border-t border-[var(--border)] p-4 pb-[max(1rem,var(--safe-b))]">
                <Button full size="lg" onClick={() => jump("#contact")}>
                  Request Quote
                </Button>
                <Button href={`tel:${site.phone}`} variant="secondary" full size="lg">
                  <Phone className="size-4" aria-hidden />
                  {site.phoneDisplay}
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
