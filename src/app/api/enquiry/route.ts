import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = Record<string, unknown>;

const REQUIRED = ["name", "email", "phone", "product", "country", "message"] as const;

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Enquiry endpoint.
 *
 * Forwards to whichever channel is configured via env:
 *   ENQUIRY_WEBHOOK_URL  — any HTTP endpoint (Zapier, Make, Slack, CRM…)
 *   RESEND_API_KEY + ENQUIRY_TO_EMAIL + ENQUIRY_FROM_EMAIL — email via Resend
 *
 * With neither configured it returns 501 and the form falls back to opening
 * the visitor's mail client or WhatsApp with the enquiry pre-filled — so the
 * lead is never silently swallowed.
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

  const email = asString(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 422 });
  }

  const enquiry = {
    name: asString(body.name),
    company: asString(body.company),
    email,
    phone: asString(body.phone),
    product: asString(body.product),
    quantity: asString(body.quantity),
    country: asString(body.country),
    message: asString(body.message),
    receivedAt: new Date().toISOString(),
    source: "tyre-retreading-page",
  };

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ENQUIRY_TO_EMAIL;
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }

    if (resendKey && toEmail && fromEmail) {
      const lines = Object.entries(enquiry)
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
          reply_to: enquiry.email,
          subject: `Tyre retreading enquiry — ${enquiry.name}${
            enquiry.company ? ` (${enquiry.company})` : ""
          }`,
          text: lines,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }
  } catch (err) {
    console.error("[enquiry] delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not deliver the enquiry. Please use email or WhatsApp." },
      { status: 502 },
    );
  }

  // Nothing configured yet — tell the client so it can offer a fallback.
  return NextResponse.json(
    {
      ok: false,
      notConfigured: true,
      error:
        "Enquiry delivery is not configured on this deployment. Set ENQUIRY_WEBHOOK_URL or RESEND_API_KEY.",
    },
    { status: 501 },
  );
}
