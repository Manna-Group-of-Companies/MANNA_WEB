"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import * as React from "react";
import { quoteProducts } from "@/data/content";
import { site } from "@/data/site";
import { useQuote } from "@/components/QuoteContext";
import { cn, waLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field, inputCx } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Toast";

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  country: string;
  message: string;
  /** honeypot */
  website: string;
};

const EMPTY: Fields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  quantity: "",
  country: "",
  message: "",
  website: "",
};

const COUNTRY_SUGGESTIONS = [
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Oman",
  "Qatar",
  "Kuwait",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Nigeria",
  "Ghana",
  "Ethiopia",
  "South Africa",
  "Egypt",
  "Sri Lanka",
  "Bangladesh",
  "Nepal",
];

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  if (f.phone.replace(/\D/g, "").length < 7)
    e.phone = "Enter a reachable phone number with country code.";
  if (!f.product) e.product = "Choose a product range — or pick “Not sure”.";
  if (f.country.trim().length < 2) e.country = "Which country is this shipping to?";
  if (f.message.trim().length < 10)
    e.message = "A line or two about your requirement helps us quote accurately.";
  return e;
}

export function Contact() {
  const { product: preselected } = useQuote();
  const { toast } = useToast();
  const [values, setValues] = React.useState<Fields>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof Fields, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "fallback">("idle");

  /**
   * A "Request Quote" button elsewhere on the page sets a product in context.
   * Derived during render rather than copied into state by an effect — the
   * visitor's own selection always wins once they touch the field.
   */
  const preselectedOption = React.useMemo(() => {
    if (!preselected) return "";
    const lower = preselected.toLowerCase();
    return (
      quoteProducts.find((p) => p.toLowerCase().includes(lower)) ??
      quoteProducts.find((p) => lower.includes(p.split("—")[0].trim().toLowerCase())) ??
      quoteProducts[quoteProducts.length - 1]
    );
  }, [preselected]);

  const productValue = values.product || preselectedOption;
  const effective: Fields = { ...values, product: productValue };

  const set = (k: keyof Fields) => (v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (touched[k]) setErrors(validate({ ...effective, [k]: v }));
  };

  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(effective));
  };

  const enquiryText = [
    "Tyre retreading enquiry",
    `Name: ${effective.name}`,
    effective.company && `Company: ${effective.company}`,
    `Email: ${effective.email}`,
    `Phone: ${effective.phone}`,
    `Product: ${effective.product}`,
    effective.quantity && `Quantity: ${effective.quantity}`,
    `Country: ${effective.country}`,
    "",
    effective.message,
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(effective);
    setErrors(found);
    setTouched(
      Object.fromEntries(Object.keys(effective).map((k) => [k, true])) as Record<
        keyof Fields,
        boolean
      >,
    );

    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      toast({
        kind: "error",
        title: "Check the highlighted fields",
        body: "A few details are missing before we can quote.",
      });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(effective),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY);
        setTouched({});
        toast({
          kind: "success",
          title: "Enquiry sent",
          body: "We'll come back to you with a quotation.",
        });
        return;
      }

      // Not configured (or delivery failed) — offer direct channels instead.
      setStatus("fallback");
      toast({
        kind: "info",
        title: "Send it directly instead",
        body: "Email or WhatsApp is pre-filled with your enquiry.",
      });
    } catch {
      setStatus("fallback");
      toast({
        kind: "info",
        title: "Network unavailable",
        body: "Use email or WhatsApp — both are pre-filled.",
      });
    }
  };

  const cards = [
    {
      icon: MapPin,
      label: "Factory",
      lines: [
        site.address.line1,
        site.address.line2,
        `${site.address.city}, ${site.address.state} ${site.address.postalCode}`,
        site.address.country,
      ],
      href: site.mapLink,
      external: true,
    },
    {
      icon: Phone,
      label: "Phone",
      lines: [site.phoneDisplay],
      href: `tel:${site.phone}`,
    },
    {
      icon: Mail,
      label: "Email",
      lines: [site.email],
      href: `mailto:${site.email}`,
    },
    { icon: Clock, label: "Hours", lines: [site.hours] },
  ];

  return (
    <section id="contact" className="section-y relative scroll-mt-24 overflow-hidden">
      <div aria-hidden className="glow-blob absolute -right-40 top-10 size-[34rem] opacity-40" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Send your size list. Get a real quotation."
          highlight={["quotation."]}
          lead="All ranges are priced on request. The more specific you are about sizes, vehicles and volume, the more useful our reply will be."
        />

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* Form */}
          <Reveal preset="left">
            <form
              onSubmit={onSubmit}
              noValidate
              aria-label="Request a quotation"
              className="rounded-[var(--radius-xl2)] bg-surface p-5 ring-1 ring-[var(--border)] shadow-soft xs:p-6 sm:p-8"
            >
              {/* Honeypot — clipped rather than offset, so it can never
                  contribute to horizontal overflow */}
              <div className="sr-only" aria-hidden>
                <label htmlFor="field-website">Leave this empty</label>
                <input
                  id="field-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => set("website")(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="field-name" label="Name" required error={errors.name}>
                  <input
                    id="field-name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => set("name")(e.target.value)}
                    onBlur={blur("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "field-name-error" : undefined}
                    placeholder="Your full name"
                    className={cn(inputCx, errors.name && "ring-red-500/60")}
                  />
                </Field>

                <Field id="field-company" label="Company" error={errors.company}>
                  <input
                    id="field-company"
                    name="company"
                    autoComplete="organization"
                    value={values.company}
                    onChange={(e) => set("company")(e.target.value)}
                    placeholder="Fleet, dealership or plant"
                    className={inputCx}
                  />
                </Field>

                <Field id="field-email" label="Email" required error={errors.email}>
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email")(e.target.value)}
                    onBlur={blur("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "field-email-error" : undefined}
                    placeholder="you@company.com"
                    className={cn(inputCx, errors.email && "ring-red-500/60")}
                  />
                </Field>

                <Field
                  id="field-phone"
                  label="Phone"
                  required
                  error={errors.phone}
                  hint="Include country code — we may call or WhatsApp."
                >
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    onBlur={blur("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "field-phone-error" : undefined}
                    placeholder="+91 90370 25722"
                    className={cn(inputCx, errors.phone && "ring-red-500/60")}
                  />
                </Field>

                <Field id="field-product" label="Product" required error={errors.product}>
                  <select
                    id="field-product"
                    name="product"
                    value={productValue}
                    onChange={(e) => set("product")(e.target.value)}
                    onBlur={blur("product")}
                    aria-invalid={!!errors.product}
                    aria-describedby={errors.product ? "field-product-error" : undefined}
                    className={cn(inputCx, errors.product && "ring-red-500/60")}
                  >
                    <option value="">Select a range…</option>
                    {quoteProducts.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id="field-quantity"
                  label="Quantity"
                  error={errors.quantity}
                  hint="Rolls, kg or number of tyres — whatever you work in."
                >
                  <input
                    id="field-quantity"
                    name="quantity"
                    value={values.quantity}
                    onChange={(e) => set("quantity")(e.target.value)}
                    placeholder="e.g. 500 kg / 40 tyres"
                    className={inputCx}
                  />
                </Field>

                <Field
                  id="field-country"
                  label="Country"
                  required
                  error={errors.country}
                  className="sm:col-span-2"
                >
                  <input
                    id="field-country"
                    name="country"
                    autoComplete="country-name"
                    list="country-suggestions"
                    value={values.country}
                    onChange={(e) => set("country")(e.target.value)}
                    onBlur={blur("country")}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? "field-country-error" : undefined}
                    placeholder="Shipping destination"
                    className={cn(inputCx, errors.country && "ring-red-500/60")}
                  />
                  <datalist id="country-suggestions">
                    {COUNTRY_SUGGESTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>

                <Field
                  id="field-message"
                  label="Message"
                  required
                  error={errors.message}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="field-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => set("message")(e.target.value)}
                    onBlur={blur("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "field-message-error" : undefined}
                    placeholder="Sizes needed, vehicle types, casing condition, target timeline…"
                    className={cn(
                      inputCx,
                      "h-auto resize-y py-3.5 leading-relaxed",
                      errors.message && "ring-red-500/60",
                    )}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  size="lg"
                  loading={status === "sending"}
                  disabled={status === "sending"}
                  className="w-full sm:w-auto sm:min-w-[13rem]"
                >
                  <Send className="size-4" aria-hidden />
                  Request Quotation
                </Button>
                <p className="text-[0.78rem] leading-snug text-muted">
                  We reply to enquiries with a quotation, not a newsletter.
                </p>
              </div>

              {/* Delivery fallback */}
              <AnimatePresence>
                {status === "fallback" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 rounded-2xl bg-surface-2 p-5">
                      <p className="text-[0.88rem] font-semibold">
                        Send it straight to us instead
                      </p>
                      <p className="mt-1 text-[0.82rem] text-muted">
                        Both options open pre-filled with everything you just typed.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        <Button
                          href={`mailto:${site.email}?subject=${encodeURIComponent(
                            `Tyre retreading enquiry — ${values.name || "Website"}`,
                          )}&body=${encodeURIComponent(enquiryText)}`}
                          size="sm"
                          variant="secondary"
                        >
                          <Mail className="size-4" aria-hidden />
                          Email enquiry
                        </Button>
                        <Button
                          href={waLink(site.whatsapp, enquiryText)}
                          external
                          size="sm"
                        >
                          WhatsApp enquiry
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {status === "sent" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <p className="mt-5 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 p-4 text-[0.88rem] font-medium text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
                      <CheckCircle2 className="size-5 shrink-0" aria-hidden />
                      Thank you — your enquiry is with our sales team.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          {/* Details + map */}
          <Reveal preset="right">
            <div className="space-y-5">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {cards.map((c) => {
                  const Icon = c.icon;
                  const inner = (
                    <>
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400">
                        <Icon className="size-[1.05rem]" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
                          {c.label}
                        </span>
                        {c.lines.map((l) => (
                          <span key={l} className="mt-0.5 block text-[0.86rem] leading-snug">
                            {l}
                          </span>
                        ))}
                      </span>
                    </>
                  );
                  return (
                    <li key={c.label}>
                      {c.href ? (
                        <a
                          href={c.href}
                          {...(c.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="group flex h-full items-start gap-3.5 rounded-2xl bg-surface p-4 ring-1 ring-[var(--border)] shadow-soft transition hover:ring-brand-500/40"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex h-full items-start gap-3.5 rounded-2xl bg-surface p-4 ring-1 ring-[var(--border)] shadow-soft">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-[var(--border)] shadow-soft">
                <iframe
                  src={site.mapEmbed}
                  title={`Map showing ${site.name} at Rubber Park, Valayanchirangara`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[17rem] w-full border-0 grayscale-[0.25] transition-[filter] duration-700 hover:grayscale-0 sm:h-[22rem] lg:h-[26rem]"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
