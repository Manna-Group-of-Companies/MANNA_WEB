import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = Record<string, unknown>;

const REQUIRED = ["name", "email", "title", "body"] as const;

const MAX = { name: 80, email: 160, org: 120, location: 80, product: 120, title: 120, body: 2000 };

function asString(v: unknown, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Review submission endpoint.
 *
 * Reviews are moderated, never auto-published: this forwards the submission to
 * whichever channel is configured and the approved text is added to
 * `src/data/reviews.ts` by hand. Config mirrors the enquiry route and falls
 * back to it, so a single webhook or Resend key covers both:
 *
 *   REVIEW_WEBHOOK_URL  (or ENQUIRY_WEBHOOK_URL)
 *   RESEND_API_KEY + REVIEW_TO_EMAIL (or ENQUIRY_TO_EMAIL) + ENQUIRY_FROM_EMAIL
 *
 * With neither configured it returns 501 and the form offers email/WhatsApp so
 * the review is never silently swallowed.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans don't.
  if (asString(body.website)) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const missing = REQUIRED.filter((k) => !asString(body[k]));
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
      { status: 422 },
    );
  }

  const email = asString(body.email, MAX.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 422 });
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, error: "Rating must be a whole number between 1 and 5." },
      { status: 422 },
    );
  }

  const reviewBody = asString(body.body, MAX.body);
  if (reviewBody.length < 20) {
    return NextResponse.json(
      { ok: false, error: "Please write at least a couple of sentences." },
      { status: 422 },
    );
  }

  const review = {
    name: asString(body.name, MAX.name),
    email,
    org: asString(body.org, MAX.org),
    location: asString(body.location, MAX.location),
    product: asString(body.product, MAX.product),
    rating,
    title: asString(body.title, MAX.title),
    body: reviewBody,
    receivedAt: new Date().toISOString(),
    source: "tyre-retreading-page",
    status: "pending-moderation",
  };

  const webhook = process.env.REVIEW_WEBHOOK_URL || process.env.ENQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.REVIEW_TO_EMAIL || process.env.ENQUIRY_TO_EMAIL;
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }

    if (resendKey && toEmail && fromEmail) {
      const lines = Object.entries(review)
        .map(([k, v]) => `${k}: ${v || "—"}`)
        .join("\n");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: review.email,
          subject: `Review for moderation — ${review.rating}★ from ${review.name}${
            review.org ? ` (${review.org})` : ""
          }`,
          text: lines,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }
  } catch (err) {
    console.error("[reviews] delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not deliver the review. Please use email or WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      notConfigured: true,
      error:
        "Review delivery is not configured on this deployment. Set REVIEW_WEBHOOK_URL or RESEND_API_KEY.",
    },
    { status: 501 },
  );
}
