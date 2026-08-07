"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, Send, ShieldCheck } from "lucide-react";
import * as React from "react";
import { quoteProducts } from "@/data/content";
import type { Review } from "@/data/reviews";
import { site } from "@/data/site";
import { cn, waLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field, inputCx } from "@/components/ui/Field";
import { StarInput } from "@/components/ui/Rating";
import { useToast } from "@/components/ui/Toast";

type Fields = {
  name: string;
  email: string;
  org: string;
  location: string;
  product: string;
  title: string;
  body: string;
  /** honeypot */
  website: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  org: "",
  location: "",
  product: "",
  title: "",
  body: "",
  website: "",
};

const BODY_MIN = 20;
const BODY_MAX = 2000;

type Errors = Partial<Record<keyof Fields | "rating", string>>;

function validate(f: Fields, rating: number): Errors {
  const e: Errors = {};
  if (!rating) e.rating = "Pick a star rating.";
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  if (f.title.trim().length < 4) e.title = "Give your review a short headline.";
  if (f.body.trim().length < BODY_MIN)
    e.body = `A couple of sentences helps other buyers — ${BODY_MIN} characters minimum.`;
  return e;
}

export function ReviewForm({
  onSubmitted,
  onCancel,
}: {
  /** Called once the review has been accepted for moderation. */
  onSubmitted: (review: Review) => void;
  onCancel?: () => void;
}) {
  const { toast } = useToast();
  const [values, setValues] = React.useState<Fields>(EMPTY);
  const [rating, setRating] = React.useState(0);
  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "fallback">("idle");

  const set = (k: keyof Fields) => (v: string) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validate(next, rating));
  };

  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values, rating));
  };

  const pickRating = (n: number) => {
    setRating(n);
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const reviewText = [
    `Review — ${rating || "?"}/5 stars`,
    `Name: ${values.name}`,
    values.org && `Company: ${values.org}`,
    values.location && `Location: ${values.location}`,
    values.product && `Product: ${values.product}`,
    `Email: ${values.email}`,
    "",
    values.title,
    values.body,
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values, rating);
    setErrors(found);
    setTouched(
      Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Record<
        keyof Fields,
        boolean
      >,
    );

    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(`review-${firstKey}`)?.focus();
      toast({
        kind: "error",
        title: "Check the highlighted fields",
        body: "A rating and a few details are needed before we can publish.",
      });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, rating }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        onSubmitted({
          // Local-only id; the published copy is assigned one at moderation.
          id: `local-${Date.now()}`,
          name: values.name.trim(),
          org: values.org.trim() || undefined,
          location: values.location.trim() || undefined,
          product: values.product || undefined,
          rating,
          title: values.title.trim(),
          body: values.body.trim(),
          date: new Date().toISOString().slice(0, 10),
          pending: true,
        });
        setValues(EMPTY);
        setRating(0);
        setTouched({});
        setStatus("idle");
        toast({
          kind: "success",
          title: "Thanks for the review",
          body: "It goes live once our team has checked it.",
        });
        return;
      }

      setStatus("fallback");
      toast({
        kind: "info",
        title: "Send it directly instead",
        body: "Email or WhatsApp is pre-filled with your review.",
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

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Write a review"
      className="rounded-[var(--radius-xl2)] bg-surface p-6 ring-1 ring-[var(--border)] shadow-soft sm:p-8"
    >
      {/* Honeypot */}
      <div className="sr-only" aria-hidden>
        <label htmlFor="review-website">Leave this empty</label>
        <input
          id="review-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website")(e.target.value)}
        />
      </div>

      <Field
        id="review-rating"
        label="Your rating"
        required
        error={errors.rating}
        labelAs="span"
      >
        <StarInput
          id="review-rating"
          name="rating"
          value={rating}
          onChange={pickRating}
          invalid={!!errors.rating}
          describedBy={errors.rating ? "review-rating-error" : undefined}
        />
      </Field>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="review-name" label="Name" required error={errors.name}>
          <input
            id="review-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            onBlur={blur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "review-name-error" : undefined}
            placeholder="Shown with your review"
            className={cn(inputCx, errors.name && "ring-red-500/60")}
          />
        </Field>

        <Field
          id="review-email"
          label="Email"
          required
          error={errors.email}
          hint="Never published — used only to verify the review."
        >
          <input
            id="review-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            onBlur={blur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "review-email-error" : undefined}
            placeholder="you@company.com"
            className={cn(inputCx, errors.email && "ring-red-500/60")}
          />
        </Field>

        <Field id="review-org" label="Company">
          <input
            id="review-org"
            name="org"
            autoComplete="organization"
            value={values.org}
            onChange={(e) => set("org")(e.target.value)}
            placeholder="Fleet, dealership or plant"
            className={inputCx}
          />
        </Field>

        <Field id="review-location" label="Location">
          <input
            id="review-location"
            name="location"
            value={values.location}
            onChange={(e) => set("location")(e.target.value)}
            placeholder="City or country"
            className={inputCx}
          />
        </Field>

        <Field id="review-product" label="Product reviewed" className="sm:col-span-2">
          <select
            id="review-product"
            name="product"
            value={values.product}
            onChange={(e) => set("product")(e.target.value)}
            className={inputCx}
          >
            <option value="">Select a range…</option>
            {quoteProducts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field id="review-title" label="Headline" required error={errors.title} className="sm:col-span-2">
          <input
            id="review-title"
            name="title"
            value={values.title}
            onChange={(e) => set("title")(e.target.value)}
            onBlur={blur("title")}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "review-title-error" : undefined}
            placeholder="Sum it up in a line"
            maxLength={120}
            className={cn(inputCx, errors.title && "ring-red-500/60")}
          />
        </Field>

        <Field
          id="review-body"
          label="Your review"
          required
          error={errors.body}
          hint={`${values.body.trim().length}/${BODY_MAX} characters`}
          className="sm:col-span-2"
        >
          <textarea
            id="review-body"
            name="body"
            rows={5}
            value={values.body}
            onChange={(e) => set("body")(e.target.value)}
            onBlur={blur("body")}
            aria-invalid={!!errors.body}
            aria-describedby={errors.body ? "review-body-error" : undefined}
            maxLength={BODY_MAX}
            placeholder="What did you run it on, and how did it hold up? Mileage, casing condition and duty cycle are what other buyers look for."
            className={cn(
              inputCx,
              "h-auto resize-y py-3.5 leading-relaxed",
              errors.body && "ring-red-500/60",
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
          className="w-full sm:w-auto sm:min-w-[12rem]"
        >
          <Send className="size-4" aria-hidden />
          Submit Review
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <p className="flex items-start gap-1.5 text-[0.78rem] leading-snug text-muted">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Reviews are checked before publishing. We do not edit or remove them for
          being critical.
        </p>
      </div>

      <AnimatePresence>
        {status === "fallback" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-2xl bg-surface-2 p-5">
              <p className="text-[0.88rem] font-semibold">Send it straight to us instead</p>
              <p className="mt-1 text-[0.82rem] text-muted">
                Both options open pre-filled with everything you just wrote.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Button
                  href={`mailto:${site.email}?subject=${encodeURIComponent(
                    `Product review — ${values.name || "Website"}`,
                  )}&body=${encodeURIComponent(reviewText)}`}
                  size="sm"
                  variant="secondary"
                >
                  <Mail className="size-4" aria-hidden />
                  Email review
                </Button>
                <Button href={waLink(site.whatsapp, reviewText)} external size="sm">
                  WhatsApp review
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
