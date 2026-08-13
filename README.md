# Manna Website

Marketing site for Manna Rubber, built in the Squarespace design language:
oversized tight-tracked headlines, black pill CTAs, warm off-white section
bands, a drifting product carousel, and a wide multi-column footer.

- **client** — React 18 + TypeScript + Vite, CSS Modules, no UI framework
- **server** — Express 4 + TypeScript, layered (routes → controller → service → repository)

## Quick start

```bash
npm run install:all      # installs client and server dependencies

npm run dev:server       # terminal 1 → http://localhost:4000
npm run dev:client       # terminal 2 → http://localhost:5173
```

Vite proxies `/api/*` to the server, so the lead form works in development with
no extra configuration. Copy `client/.env.example` and `server/.env.example` to
`.env` if you need to change ports or origins.

## Google sign-in

`/login` and `/signup` are the same page in two moods. Google is the only
identity provider — there are no passwords anywhere in this codebase, and a
first-time Google account is signed up rather than turned away.

**1. Create an OAuth client.** In the
[Google Cloud console](https://console.cloud.google.com/apis/credentials) →
_Create credentials_ → _OAuth client ID_ → _Web application_:

| Field                     | Development             | Production                 |
| ------------------------- | ----------------------- | -------------------------- |
| Authorised JavaScript origins | `http://localhost:5173` | `https://your-domain.com`  |
| Authorised redirect URIs  | not needed              | not needed                 |

The button uses the ID-token flow, so there is no redirect URI and the client
**secret is never used** — only the client id, which is safe in the browser.

**2. Wire the id into both packages.** It has to be the same value on both
sides; the server rejects any token minted for a different client.

```bash
# client/.env
VITE_GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com

# server/.env
GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
```

Restart both dev servers — Vite only reads `VITE_*` at startup. Without a
client id the page renders a setup notice instead of a broken button.

**How it works.** Google's script renders the branded button, which hands the
browser an ID token. The client posts it to `/api/auth/google`, where the
server verifies the signature against Google's published keys and checks the
issuer, audience, expiry and `email_verified` before trusting anything in it.
It then issues its own HMAC-signed session cookie (`HttpOnly`, `SameSite=Lax`),
so the Google token is never stored or replayed. `requireAuth()` in
`server/src/middleware` is the gate for the first route that needs a signed-in
user.

**In production** set `COOKIE_SECURE=true` (the default when `NODE_ENV` is
`production`) and serve over HTTPS, and make sure `CORS_ORIGIN` lists the site's
real origin — the session cookie will not survive otherwise.

## Reviews

The homepage carries a drifting row of customer reviews above the closing CTA,
each card showing the reviewer's Google name, photo and star rating. Writing
one needs a signed-in Google account, which is the whole point: the name and
photo on a card come from Google rather than from a text field, so there is no
anonymous entry to moderate.

**It is the one place a serif appears** — a wall of testimony from other people
should not look like the rest of the page talking about itself. The face is
Newsreader (`--font-serif`), used for the headline and the review quotes only.

The band keeps its own token set (`--r-*` at the top of `Reviews.module.css`)
rather than reading globals directly, so the whole section can be re-grounded
from one block — it was drafted on white and moved to black by editing those
ten lines. `StarRating` reads `--star-fill` / `--star-empty` for the same
reason: the page-level line colour is invisible on a light ground.

### Placeholder reviews

`client/src/data/sampleReviews.ts` holds six invented reviews that stand in
while the section is empty. Two rules keep them honest, both enforced in
`useReviews`: they appear **only** when there are no real reviews at all, so an
invented card is never shown beside a genuine one; and while they show, the
cards say "Example review" instead of "Signed in with Google", carry an
"Example" chip rather than "Verified", and the section says so under the row.

**Set `SHOW_SAMPLE_REVIEWS` to `false` before the site goes in front of
customers.** Invented testimonials on a commercial page are misleading
advertising under the UK DMCC Act, the EU Omnibus Directive and the FTC's rule
on fake reviews.

**The row loops continuously**, on the same CSS device as the hero bands: the
cards are rendered twice and the track is animated a flat `-50%`, so the end of
a lap is a frame indistinguishable from its start. Two details keep the seam
invisible — the gap rides on the card as `margin-right` rather than on the
track as `gap`, which makes one card plus one gap the repeating unit and half
the track exactly one copy; and the row only drifts once a copy is measured
wide enough to cover the viewport, since a short copy would run out of cards
before the lap came round. Hover or focus pauses it where it stands via
`animation-play-state`, so nothing snaps, and there is a pause control for
anyone who wants it stopped. Under `prefers-reduced-motion` it holds still and
becomes an ordinary horizontal scroller.

An account holds **one** review — posting again edits the existing one, and the
reader's own card is outlined and tagged in the rail. Reviews append to
`server/data/reviews.jsonl`, last line per author winning, so the file doubles
as an edit history.

The section starts empty; it fills as real customers write. Nothing is seeded,
because a fabricated review is worse than an empty rail.

## Other commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run build`     | Type-checks and builds both packages                 |
| `npm run typecheck` | Type-checks both packages without emitting           |
| `npm start`         | Runs the compiled server from `server/dist`          |

To serve the built site and the API from one process, build the client, then
set `SERVE_CLIENT=true` in `server/.env` and run `npm start`.

## Folder structure

```
MANNA_WEBSITE/
├─ package.json                  workspace-level convenience scripts
│
├─ client/
│  ├─ index.html                 Vite entry document, fonts and meta tags
│  ├─ vite.config.ts             @/ alias, dev proxy to the API
│  ├─ tsconfig.json              strict TS, path mapping
│  ├─ public/favicon.svg
│  └─ src/
│     ├─ main.tsx                React root, AuthProvider
│     ├─ App.tsx                 skip link, /login + /signup routes, layout
│     ├─ pages/
│     │  ├─ HomePage/            section order for the homepage
│     │  └─ AuthPage/            sign in / sign up, Google only
│     ├─ context/AuthContext.tsx session state and sign-in/out actions
│     ├─ components/
│     │  ├─ layout/              Logo, AnnouncementBar, Header, Footer
│     │  ├─ auth/                GoogleSignInButton
│     │  ├─ sections/            Hero, HeroCarousel, StatsBand,
│     │  │                       Capabilities, ProductShowcase,
│     │  │                       IndustriesStrip, QualitySplit,
│     │  │                       Testimonial, LeadCta
│     │  └─ ui/                  Button, Container, SectionHeading,
│     │                          TickList, ArrowLink, PatternArt, Reveal
│     ├─ hooks/                  useReveal, useCountUp, useScrolled,
│     │                          useLockBodyScroll, useLeadForm,
│     │                          usePathname, useGoogleIdentity
│     ├─ data/                   all site copy (site.ts, products.ts,
│     │                          sections.ts)
│     ├─ lib/                    api client, router, cn(), email validation
│     ├─ types/                  content, lead, auth and GSI models
│     └─ styles/                 tokens.css, base.css, utilities.css
│
└─ server/
   ├─ tsconfig.json
   ├─ data/                      leads.jsonl, users.jsonl (created on use)
   └─ src/
      ├─ index.ts                bootstrap, listen, graceful shutdown
      ├─ app.ts                  Express assembly, CORS, static client
      ├─ config/env.ts           typed environment parsing
      ├─ routes/                 apiRouter, lead routes, auth routes
      ├─ controllers/            HTTP layer for leads and auth
      ├─ services/               lead logic, Google verifier, auth logic
      ├─ repositories/           append-only JSONL stores
      ├─ validators/             request body validation
      ├─ middleware/             rateLimit, requireAuth, notFound,
      │                          errorHandler
      ├─ types/                  shared API, lead and auth types
      └─ utils/                  logger, AppError, session, cookies
```

Each component lives in its own folder next to its `.module.css`, so styles are
scoped and a component can be moved or deleted in one piece.

## Conventions

- **Copy lives in `src/data`.** Sections render from typed arrays, so editing
  headlines and product blurbs never means touching JSX.
- **Design tokens live in `src/styles/tokens.css`.** Colour, type scale,
  spacing, radii and motion are all variables — retheming is one file.
- **Artwork is CSS-drawn.** `PatternArt` stands in for product photography so
  the site renders with no external assets. Swap it for `<img>` once real
  photography exists; no layout depends on its internals.
- **Accessibility.** Skip link, roving-tabindex tab strip in the product
  showcase, `aria-live` form status, visible focus rings, and every animation
  respects `prefers-reduced-motion`.

## API

| Method | Route                | Body                                     | Notes                                     |
| ------ | -------------------- | ---------------------------------------- | ----------------------------------------- |
| `GET`  | `/api/health`        | —                                        | Liveness probe                            |
| `POST` | `/api/leads`         | `{ "email": string, "source"?: string }` | 5 requests / 10 min / IP                  |
| `POST` | `/api/auth/google`   | `{ "credential": string }`               | Google ID token in, session cookie out    |
| `GET`  | `/api/auth/me`       | —                                        | `{ user }` or `{ user: null }`, always 200 |
| `POST` | `/api/auth/logout`   | —                                        | Clears the session cookie                 |
| `GET`  | `/api/reviews`       | —                                        | Public; flags the reader's own review     |
| `POST` | `/api/reviews`       | `{ "rating": 1-5, "comment": string }`   | Signed in only; re-posting edits          |

Leads append to `server/data/leads.jsonl`, users to `users.jsonl` and reviews to
`reviews.jsonl`. Swap the repository modules for a database client and nothing
above them changes.

## Site content

The copy and catalogue come from the legacy site at
[mannarubber.com](https://www.mannarubber.com/). The full extraction — every
page, the old sitemap, and the migration gaps — is in
[`legacy-site-content.md`](legacy-site-content.md) at the repo root.

`client/src/data/catalogue.ts` carries all 91 products across the five real
lines: 44 tread rubber patterns, 5 retreading processes, 16 compound grades, 5
reclaim grades and 21 moulded goods. The repetitive lines are built from seed
arrays through small factory functions, so adding a pattern is one line rather
than forty.

**The old site published names and prices-on-request but almost no technical
data.** The specs in the catalogue therefore carry only what the business
actually declared — brand, origin, HSN 4002 on compounds, minimum enquiry
quantity of one. Pattern dimensions, gauges, hardness figures and mileage
claims are deliberately absent. Get them from the works before adding them;
invented figures on a manufacturing catalogue are a warranty problem, not a
copy problem.

## Before going live

Outstanding items, all flagged in `legacy-site-content.md`:

- **Timeline milestones** — image-only on the old site, so the years and events
  could not be scraped. Needs the original graphic or the business.
- **Per-pattern tread copy** — only VIKING has a real description. The other 43
  patterns fall back to a shared honest placeholder.
- **Photography** — every tile still renders `PatternArt`. Swap for `<img>`
  once real product photography exists.
- **"Established" conflict** — body copy says three decades, the export profile
  says the Pvt. Ltd. was established in 2020. The stats band says `30+`.
- ~~**Two email addresses**~~ — settled: `site.email` is `mail@hi-techtreads.com`
  and is the only address the site publishes. `salesEmail` is gone.
- **Legal pages** — the old Privacy Policy and Terms are LINKER.store template
  boilerplate. `legalLinks` in `site.ts` still point at `#`.
- **Sample reviews** — set `SHOW_SAMPLE_REVIEWS` to `false` (see above).
