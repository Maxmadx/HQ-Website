# HQ Aviation Website — Product Requirements Document

**Date:** 2026-05-12
**Status:** Live
**Version:** 2.0 (supersedes the 2026-02-04 v1.0 written pre-React-migration)

---

## 1. What this site is

HQ Aviation is a Robinson helicopter dealership, pilot training school, parts supplier, and maintenance facility based near London, UK. This site is the primary online presence: it showcases the fleet, accepts deposits and bookings for discovery flights and PPL training, sells apparel and miscellaneous merchandise, captures sales enquiries on used aircraft and parts, runs a blog, and gives the business owner (Quentin Smith) and his team an admin panel to manage all of it without a developer in the loop.

The site replaces a Squarespace export. As of 2026-05-12 the migration to a React 19 SPA + Express backend on Google Cloud Run is ~70% complete (pre-production hardening, performance, accessibility, and codebase health remain). The remaining work is captured in the roadmap at `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md`.

## 2. Who uses this site

- **Prospective helicopter buyers** — research R22, R44, R66, R88; compare specs; view recently-sold aircraft; ultimately make contact for a quote. The buy flow is offline (high-ticket negotiation) but the site captures the enquiry.
- **Aspiring pilots** — discovery flights (low-friction first purchase, ~£200-£500), PPL(H) training, self-fly hire. Discovery flight is the canonical entry point.
- **Returning customers** — apparel, parts, news, gallery.
- **Wedding / corporate charter clients** — book London tours and bespoke flights.
- **Business owner (Quentin Smith) and team** — admin panel for FAQs, comparables, SFH events and partners, bookings, leads, blog posts.

## 3. Site surface (live, 2026-05-12)

Public routes are defined in `src/App.jsx`. Major groupings:

| Section | Pages |
|---|---|
| **Home & about** | `/`, `/home`, `/about-us`, `/about-us/captain-q` |
| **Aircraft fleet** | `/aircraft/r22`, `/aircraft/r44`, `/aircraft/r66`, `/aircraft/r88`, `/aircraft/h500`, `/fleet`, `/rhc-configurator` |
| **Aircraft sales** | `/aircraft-comparison`, `/sales/new`, `/sales/pre-owned`, `/sales/pre-owned/:id`, `/sales/rebuilds` |
| **Training** | `/training/ppl`, `/training/trial-lessons`, `/training/type-rating`, `/training/night-rating`, `/training/commercial`, `/training/advanced`, `/training/faq`, `/self-fly-hire` |
| **Maintenance & ops** | `/maintenance`, `/superyacht-ops`, `/pilot-provisioning`, `/aircraft-consulting`, `/leaseback` |
| **Experiences** | `/expeditions`, `/helicopter-tour-of-london` |
| **Commerce** | `/parts`, `/parts/enquiry`, `/parts/:id`, `/misc`, `/misc/:id` |
| **Content** | `/blog`, `/blog/:postId`, `/testimonials` |
| **Conversion** | `/booking-confirmed`, `/london-tour-checkout`, `/london-tour-confirmed`, `/checkout` |
| **Admin** | `/admin/*` — role-gated via Firebase custom claims |

Dev-only picker / variation pages live in `src/pages/` but are gated by `import.meta.env.DEV` and don't ship to production routes.

## 4. Revenue flows (live)

Each handled by a Stripe PaymentIntent created server-side, with metadata copied into Firestore on successful webhook ingestion.

- **Discovery flight booking** — `/api/create-payment-intent` → Stripe → `webhook` → `recordBooking` to Firestore `bookings/` + confirmation email + post-checkout upsell pill.
- **London tour booking** — `/api/create-london-tour-payment-intent` → same shape.
- **Apparel & misc** — `/api/create-misc-payment-intent` with line items + sizes; writes to `misc_marketplace/`.
- **Cart recovery** — `node-cron` sweep catches abandoned carts after a quiet-hours-respecting delay; sends one recovery email per cart with an unsubscribe token.

Aircraft sales themselves do **not** go through Stripe (six- to seven-figure offline transactions). The site captures the lead via enquiry forms and hands off to Quentin.

## 5. Lead-capture flows (live)

- **General contact form** — `/api/leads` → Firestore `leads/` + email to ops.
- **Parts enquiry** — `/api/parts-enquiry` with structured fields (part number, aircraft type, urgency).
- **Press / media clicks** — `/api/press-click` for funnel analytics.
- **Newsletter / blog signup** — not implemented as of 2026-05-12; some pages have UI placeholders but there is no submit handler or backing endpoint. Tracked as a future feature.

## 6. Admin panel scope

Built April 2026. Live admin surfaces under `/admin/*`, role-gated by a Firebase custom claim `role: admin`. Subsurfaces:

- **FAQ management** (`/admin/faqs`) — CRUD for FAQ entries surfaced on training/sales/etc pages; backed by `api/admin-faqs.js`.
- **Comparables** (`/admin/comparables`) — used-aircraft listings with image upload; writes directly via the Firestore client SDK (no server-side API).
- **Image-editing mode** (`/admin/images`) — visual editor for all site pages; switches image content slots across every page section with a per-page tab bar.
- **Text-editing mode** (`/admin/text`) — inline copy editor for all managed text fields across the site; saves to the Firestore `site_text` collection.
- **Used-aircraft listings** (`/admin/listings`) — CRUD for the used-aircraft inventory (separate from comparables); supports image upload and a per-listing edit view at `/admin/listings/:id`.
- **Self-fly hire events and partners** (`/admin/where-when`) — single surface managing both SFH destination partners and event partners; backed by `api/admin-sfh-events.js` and `api/admin-sfh-partners.js`.
- **Bookings overview** (`/admin/bookings`) — read/filter view of all discovery flight and London tour bookings written to Firestore by the payment webhook.
- **Misc-marketplace orders** (`/admin/misc/orders`) — order management for apparel and miscellaneous merchandise; backed by `api/misc-marketplace.js`.
- **Wall-of-cool moderation** (`/admin/wall-of-cool`) — approve/reject user-submitted gallery entries; backed by `api/wall-of-cool.js`.
- **Blog post CRUD** (`/admin/blog`) — create, edit, and delete blog posts; per-post edit view at `/admin/blog/:id`.
- **Parts catalogue and enquiries** (`/admin/parts`) — manage parts listings and review incoming enquiries; per-part edit at `/admin/parts/:id`; enquiries at `/admin/parts/enquiries`.
- **Leads overview** (`/admin/leads`) — view and filter all contact-form and sales-enquiry leads written to Firestore.
- **Analytics** (`/admin/analytics`) — internal funnel and traffic dashboard.
- **Reviews** (`/admin/reviews`) — moderate and publish customer reviews.
- **Pricing** (`/admin/pricing`) — update discovery flight and training pricing displayed across the site.
- **Aircraft specs** (`/admin/aircraft-specs`) — edit per-model spec data displayed on aircraft pages; per-model edit at `/admin/aircraft-specs/:model`.

Detailed flow traces in `docs/user-flows.md` (created in Phase 0 Task 6; may not yet exist on older branches).

## 7. Non-functional requirements

These are the bars Phase 1–3 of the roadmap must clear.

| Area | Bar |
|---|---|
| Performance | Lighthouse mobile Performance ≥ 90 on `/`, `/training/trial-lessons`, `/aircraft/r66` |
| Accessibility | Modal + form a11y baseline (focus trap, aria-modal, ESC) on every dialog; `axe-core` runs on every modal/form test and produces zero serious/critical violations; Lighthouse mobile Accessibility ≥ 95 on `/`, `/training/trial-lessons`, `/aircraft/r66` |
| SEO | Every public route has title, description, canonical, og:image, and where applicable structured data (Product, LocalBusiness, BreadcrumbList) |
| Security | helmet + CSP enforced; Firestore rules with field-level validation; rate limits on all payment endpoints; explicit deny on server-only collections |
| Reliability | Webhook failures surface in Sentry within 60 s; graceful shutdown drains in-flight requests on Cloud Run revision swap |
| Observability | Structured JSON logs tagged with release SHA; every payment endpoint logged with `requestId` and latency |
| Test coverage | CI gates merges on `npm test`; ≥ 80% line coverage on `api/**` enforced by `vitest --coverage`; component + page + Firestore-rules test scaffolding present (coverage targets for `src/**` set in Phase 3) |
| Repo health | Fresh-clone size < 50 MB; no source file > 2 000 LoC outside `dist/` |

## 8. Out of scope (this roadmap)

Tracked separately, not in the hardening roadmap:

- R22 → R44 upgrade upsell — stranded on `feat/plan-c-r22-r44-upgrade` (100 unmerged commits, last commit 2026-05-12). Merge-or-kill decision required before Phase 2 starts.
- Aircraft Sales enquiry / quote CTA — the read-only listings need a captured-lead funnel. Needs its own brainstorming cycle.
- Analytics-funnel rebuild — five archived plans (Apr 29 – May 1) were abandoned; if revisited, start from a fresh spec.
- Full TypeScript migration — see `docs/infra-decisions.md` §3.

## 9. How to run

See `README.md`.

## 10. Decision history

- **2026-02-04** — v1.0 PRD written when the site was a static Squarespace export served from Express.
- **2026-04** — admin panel built (see `docs/superpowers/plans/2026-04-08-admin-panel-master.md` and child plans).
- **2026-04** — React 19 migration in flight; pages progressively re-implemented as `.jsx` components.
- **2026-04** — Stripe checkout live for discovery flights.
- **2026-05** — image-optimisation pipeline D0–D3 shipped; D4 measurement queued.
- **2026-05-11** — Cloud Run deployment with Firebase Hosting rewrites for `/api/**`, `/sitemap.xml`, `/robots.txt`.
- **2026-05-12** — site-hardening roadmap drafted; v2.0 PRD (this doc).
- **2026-05-12** — §3 routes table corrected to match `src/App.jsx` (template routes `/r22`, `/discovery-flights`, `/hangarage`, `/tours`, `/apparel`, `/store`, `/gallery`, `/news`, `/wall-of-cool`, `/contact` do not exist; replaced with actual paths).
