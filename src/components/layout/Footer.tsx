"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, Check, Mail, MapPin, Phone, Send } from "lucide-react";
import * as React from "react";
import { megaColumns, primaryNav } from "@/data/nav";
import { site } from "@/data/site";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

/* lucide dropped brand marks in v1 — these are the official simple glyphs. */
const SOCIAL_PATHS: Record<string, string> = {
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0",
  facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0",
  youtube:
    "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81M9.55 15.57V8.43L15.82 12z",
};

function SocialIcon({ name, className }: { name: string; className?: string }) {
  const d = SOCIAL_PATHS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      toast({ kind: "error", title: "Enter a valid email address" });
      return;
    }
    // No list provider is wired up yet — route it to sales as a normal enquiry.
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      "Newsletter signup",
    )}&body=${encodeURIComponent(`Please add ${email.trim()} to your product updates list.`)}`;
    setDone(true);
    toast({
      kind: "success",
      title: "Almost there",
      body: "Send the email that just opened and you're on the list.",
    });
  };

  return (
    <form onSubmit={submit} className="mt-5">
      <label htmlFor="newsletter-email" className="text-[0.82rem] text-white/60">
        Product updates and new size announcements.
      </label>
      <div className="mt-2.5 flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          className="h-12 min-w-0 flex-1 rounded-xl bg-white/[0.07] px-4 text-base text-white ring-1 ring-white/15 outline-none transition placeholder:text-white/35 focus:ring-2 focus:ring-brand-500 sm:h-11 sm:text-[0.88rem]"
        />
        <button
          type="submit"
          aria-label="Subscribe to product updates"
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 sm:size-11"
        >
          {done ? <Check className="size-4" /> : <Send className="size-4" />}
        </button>
      </div>
      <p className="mt-2 text-[0.72rem] text-white/35">
        No spam. Unsubscribe by replying to any email.
      </p>
    </form>
  );
}

export function Footer() {
  const jump = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-ink-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent"
      />
      <div aria-hidden className="glow-blob absolute -left-24 -top-24 size-[28rem] opacity-40" />

      <div className="container-page relative">
        {/* CTA banner */}
        <Reveal preset="up">
          <div className="mt-12 flex flex-col gap-6 rounded-[var(--radius-xl2)] bg-gradient-to-br from-brand-500 to-brand-700 p-6 xs:p-8 sm:mt-16 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="max-w-2xl font-display text-[length:var(--text-fluid-2xl)] font-bold leading-[1.1] tracking-tight">
                Ready to lower your cost per kilometre?
              </h2>
              <p className="mt-3 max-w-xl text-white/80">
                Send us your size list. We will come back with a quotation and, if something
                else in the range fits better, we will say so.
              </p>
            </div>
            <a
              href="#contact"
              onClick={jump("#contact")}
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-white px-7 py-4 font-semibold text-ink-950 shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-8 py-12 xs:grid-cols-2 sm:gap-10 sm:py-16 lg:grid-cols-12 lg:gap-8">
          {/* Company */}
          <div className="xs:col-span-2 lg:col-span-4">
            {/* Footer sits on near-black, so the lockup's graphite parts are
                lifted to near-white by --logo-graphite */}
            <div className="flex items-center gap-3.5" style={{ ["--logo-graphite" as string]: "#f0f0f0" }}>
              <Logo onDark className="h-16 lg:h-20" />
              <span aria-hidden className="h-11 w-px bg-white/20" />
              <span className="leading-tight">
                <span className="block font-display text-[1.02rem] font-bold">
                  Rubber Products
                </span>
                <span className="block text-[0.68rem] uppercase tracking-[0.17em] text-white/45">
                  Pvt. Ltd.
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-white/55">
              Manufacturer of tread rubber, rubber compounds, reclaimed rubber and customised
              moulded rubber goods — operating from Rubber Park, Kerala for three decades and
              exporting across Africa and the Middle East.
            </p>

            <ul className="mt-6 space-y-3 text-[0.88rem]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                <a
                  href={site.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 transition hover:text-white"
                >
                  {site.address.line1}, {site.address.line2}, {site.address.city},{" "}
                  {site.address.state} {site.address.postalCode}, {site.address.country}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-brand-500" aria-hidden />
                <a href={`tel:${site.phone}`} className="text-white/65 transition hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-brand-500" aria-hidden />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-white/65 transition hover:text-white"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            {/* Social */}
            <ul className="mt-6 flex gap-2.5">
              {site.social.map((s) => (
                <li key={s.label}>
                  <motion.a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.shortName} on ${s.label}`}
                    whileHover={{ y: -3 }}
                    className="grid size-10 place-items-center rounded-xl bg-white/[0.06] text-white/60 ring-1 ring-white/10 transition-colors hover:bg-brand-500 hover:text-white hover:ring-brand-500"
                  >
                    <SocialIcon name={s.icon} className="size-[1.05rem]" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <nav className="lg:col-span-2" aria-label="Quick links">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {primaryNav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={jump(l.href)}
                    className="group inline-flex items-center gap-1.5 text-[0.88rem] text-white/60 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-500 transition-all duration-300 group-hover:w-3" />
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={jump("#contact")}
                  className="group inline-flex items-center gap-1.5 text-[0.88rem] text-white/60 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-brand-500 transition-all duration-300 group-hover:w-3" />
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Products */}
          <nav className="lg:col-span-3" aria-label="Products">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5">
              {megaColumns.flatMap((c) => c.links).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={jump(l.href)}
                    className="group inline-flex items-center gap-1.5 text-[0.88rem] text-white/60 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-500 transition-all duration-300 group-hover:w-3" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter + certifications */}
          <div className="xs:col-span-2 lg:col-span-3">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
              Stay Updated
            </h3>
            <Newsletter />

            <h3 className="mt-9 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40">
              Certifications
            </h3>
            <ul className="mt-4 space-y-2">
              {site.certifications.map((c) => (
                <li
                  key={c.label}
                  className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] p-3 ring-1 ring-white/10"
                >
                  <Award className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                  <span>
                    <span className="block text-[0.84rem] font-medium">{c.label}</span>
                    <span className="block text-[0.72rem] text-white/45">{c.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar. The extra padding below sm clears the sticky mobile
            contact bar, which is fixed over this exact spot. */}
        <div className="flex flex-col gap-4 border-t border-white/10 pb-[calc(4.75rem+var(--safe-b))] pt-7 sm:flex-row sm:items-center sm:justify-between sm:pb-7">
          <p className="text-[0.8rem] text-white/40">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="glass" size="xs" className="text-white/70">
              Price on request
            </Badge>
            <Badge variant="glass" size="xs" className="text-white/70">
              Export enquiries welcome
            </Badge>
            <span className="text-[0.8rem] text-white/40">
              GST &amp; export documentation on request
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
