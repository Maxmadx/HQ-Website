# Aircraft Consulting Page Redesign — Design Spec

**Date:** 2026-04-28
**Status:** Draft (awaiting approval)
**Target:** `src/pages/AircraftConsulting.jsx`, route `/aircraft-consulting`
**Approach:** Approach B — restructure with a "consulting menu" lens (keep existing visual grammar; rework copy and information architecture)

---

## Overview

The current `/aircraft-consulting` page reads as "Pre-Purchase Inspection plus a few add-ons." The hero, intro, "Why It Matters" cards, and process flow are all PPI-shaped, with three other services (Ownership Advisory, Fleet Planning, Acquisition Services) tacked on as siblings that the narrative never speaks to. A reader who arrived for management retainer, valuation, or expert-witness work bounces.

This redesign repositions the page as broad helicopter consulting with Robinson depth at the bench. It keeps the existing 9-section visual grammar (hero → intro → services → why → process → credentials → enquiry → FAQ → CTA) and the existing component CSS namespace (`ac-*`), but rewrites copy and information architecture so every service has a place in the narrative.

**Out of scope:**
- New page-level layout components or design tokens — the existing `ac-*` styles stay
- Animation / motion changes (Framer Motion config preserved)
- Hero photography swap (current parallax photo treatment preserved)
- FAQ content authoring — the page is CMS-driven (`data-cms-section="faqs-aircraft-consulting"`); this spec lists categories the CMS should cover, not the FAQ entries themselves
- Visual rebuild of the page — explicitly Approach B, not Approach C

---

## Positioning & voice

**Positioning:** *Helicopter consulting, with Robinson at the bench.* HQ consults across helicopter ownership broadly — acquisition, management, valuation, expert work, insurance, TCO, import/export — and brings factory-authorised Robinson depth to the work where type-specific expertise is what the client is paying for (pre-purchase, technical disputes, type-specific valuations). The page should leave a buyer thinking *"these are helicopter consultants who happen to be the deepest Robinson people in the country"* — not the other way round.

**Tagline:** *Helicopter consulting. Robinson specialists.*

**Voice (preserve from current page):**
- Editorial, understated, confident
- Em dashes welcome; no exclamation points; no marketing-speak
- UK English (*authorised, organisation, modelling, specialise*)
- Buyer-centric framing — what the client gets, not what HQ does
- The current intro paragraph (line ~363, *"draws on the same hangar floor, logbook library, and maintenance experience"*) is the tone target

---

## Page structure

Same 9 sections, same order, all repurposed:

| # | Section | Change |
|---|---|---|
| 1 | Hero | New headline (tagline), broadened sub. Parallax photo and badge stats unchanged. |
| 2 | Intro | Heading "Independent. Thorough. Honest." stays. Body broadens from PPI to lifecycle. Stats block unchanged (500+, 35+, Factory Authorised). |
| 3 | Services | **4 cards → 8 cards in 3 groups.** New scope-badge taxonomy. Card structure extended. |
| 4 | Why It Matters | **4 cards → 3 cards.** Full copy rewrite. Buyer-centric throughlines that work across all 8 services. CSS grid adjusts from 2x2 to 3-across (desktop) / 1-across (mobile). |
| 5 | Process | **PPI-only 5-step → service-agnostic 5-step.** Generalised copy; no service-specific timelines. |
| 6 | Credentials | Structure unchanged. Copy broadens beyond PPI framing. |
| 7 | Enquiry form | Service-type selector becomes the entry point. Conditional follow-up fields per service. Same submission endpoint. |
| 8 | FAQ | CMS-driven; broaden category list (no FAQ content authored in this spec). |
| 9 | CTA | Service-agnostic copy refresh. |

---

## Section 1 — Hero

**Keep:**
- `ac-hero` parallax photo treatment
- Hero word reveal animation (`ac-hero__word--1`, `ac-hero__word--2`)
- Badge block (`ac-hero__badge`) with two stats

**Change:**
- Headline: *Helicopter consulting. Robinson specialists.* (split across the two animated words: "Helicopter consulting." / "Robinson specialists.")
- Eyebrow label: *Helicopter consulting* → keep, or replace with *For buyers, owners, and disputes*
- Sub-headline (currently PPI-flavored): rewrite to one line covering the breadth, e.g. *Independent advice across the helicopter ownership lifecycle — from short-list to settlement.*
- Badge stats unchanged: *Independent / Advice* and *35+ Years / Experience*

---

## Section 2 — Intro

**Keep:**
- `ac-intro` two-column layout (text left, image right)
- Heading: *Independent. Thorough. Honest.*
- Stats strip: 500+ Aircraft Assessed · 35+ Years · Factory Authorised
- Image and caption (`Factory Authorised Service Centre`)

**Change body copy:** broaden from PPI emphasis to lifecycle emphasis. Two paragraphs:

> Paragraph 1: who hires HQ and for what — buyers shortlisting their first helicopter, owners running one or more, lawyers and insurers needing an independent expert. Lead with the breadth.

> Paragraph 2 (preserve in spirit, rewrite scope): the same hangar floor, logbook library, and maintenance experience that informs every Robinson service centre engagement is what backs every consulting opinion HQ writes — for any helicopter, not just Robinsons.

---

## Section 3 — Services (4 → 8 cards in 3 groups)

### Groups

1. **Buying a helicopter** — Pre-Purchase Inspection · Acquisition Advisory · Valuation & Appraisal
2. **Owning & operating** — Aircraft Management · Operating Cost & TCO · Insurance Advisory · Import / Export & Register Transfer
3. **Independent expert work** — Expert Witness & Litigation Support *(Valuation cross-references here for legal use)*

Each group title renders as an anchor heading inside the services section, with its cards grouped beneath. The third group has one card by design — different audience (lawyers, insurers, fleet managers in disputes), not the same buyer in a different mode.

### Card structure (extends existing `ac-service-card`)

```
[number]   [scope badge]
Title
Short description (1-2 sentences, buyer-centric)
What's included (5-6 bullets)
[Enquire CTA — pre-fills serviceType in the form]
```

### Scope badge taxonomy

The existing `tag` field is repurposed into a scope badge:

| Badge | Applies to | Meaning |
|---|---|---|
| `Robinson only` | Pre-Purchase Inspection | Factory AMO authorisation required |
| `All helicopters` | Acquisition · Management · TCO · Insurance · Import/Export | Type-agnostic consulting work |
| `All helicopters · Robinson-deep` | Valuation · Expert Witness | Available for any helicopter; deeper for Robinsons |

Optional secondary chip (small, below or beside the badge): *Retainer* on Aircraft Management; *Most common* preserved on Pre-Purchase Inspection.

### The 8 services (data array)

Replaces the current `services` array (line ~202). Removals: `Ownership Advisory` (replaced by Aircraft Management + TCO + Insurance) and `Fleet Planning` (de-scoped).

```js
const services = [
  // GROUP: Buying a helicopter
  {
    num: '01',
    group: 'buying',
    title: 'Pre-Purchase Inspection',
    scope: 'Robinson only',
    chip: 'Most common',
    description: "A full airframe, engine, avionics, and logbook inspection of any Robinson helicopter under offer. Factory-authorised verdict in writing — buy, renegotiate, or walk — within 48 hours.",
    includes: [
      'Physical airframe inspection',
      'Engine and systems check',
      'Full logbook audit',
      'Written report with photography',
      'Rectification cost estimates',
      'Price-position guidance',
    ],
    enquiry: 'pre-purchase-inspection',
  },
  {
    num: '02',
    group: 'buying',
    title: 'Acquisition Advisory',
    scope: 'All helicopters',
    description: "We find the right aircraft, negotiate the deal, manage independent surveys, and run the paperwork through to delivery. A hands-off route to ownership for buyers who'd rather hire it done.",
    includes: [
      'Aircraft sourcing in the UK and abroad',
      'Seller and broker negotiation',
      'Independent survey management',
      'Import/export documentation',
      'Delivery coordination and handover',
      'First-year operating support',
    ],
    enquiry: 'acquisition-advisory',
  },
  {
    num: '03',
    group: 'buying',
    title: 'Valuation & Appraisal',
    scope: 'All helicopters · Robinson-deep',
    description: "An independent written value opinion for purchase, finance, insurance, tax, lease return, divorce, or estate purposes. Methodology you can hand to a banker, lender, lawyer, or insurer.",
    includes: [
      'Inspection-based or desk-based valuation',
      'Robinson type-specific market context',
      'Methodology and comparables',
      'Litigation-ready report formats',
      'Lender / insurer-acceptable templates',
      'Single-aircraft or fleet portfolio',
    ],
    enquiry: 'valuation',
  },

  // GROUP: Owning & operating
  {
    num: '04',
    group: 'owning',
    title: 'Aircraft Management',
    scope: 'All helicopters',
    chip: 'Retainer',
    description: "An ongoing relationship for owners who'd rather not run the aircraft themselves. We oversee maintenance, engineer relationships, scheduling, and keep the file in order so the aircraft stays serviceable and saleable.",
    includes: [
      'Maintenance scheduling oversight',
      'Engineer and operator coordination',
      'Records and documentation upkeep',
      'Hangarage, insurance, and currency tracking',
      'Quarterly cost reviews',
      'Single point of contact across the lifecycle',
    ],
    enquiry: 'aircraft-management',
  },
  {
    num: '05',
    group: 'owning',
    title: 'Operating Cost & TCO',
    scope: 'All helicopters',
    description: "A defensible total cost of ownership model for a specific aircraft, fleet, or use case. Numbers built from real maintenance bills and live insurance market — not OEM brochures.",
    includes: [
      'Type-specific fixed and variable costs',
      'One, five, and ten-year projections',
      'Maintenance reserves modelling',
      'Hours-flown sensitivity and break-even',
      'Financing scenario comparisons',
      'Cross-type comparison',
    ],
    enquiry: 'tco-modelling',
  },
  {
    num: '06',
    group: 'owning',
    title: 'Insurance Advisory',
    scope: 'All helicopters',
    description: "Independent review of hull and liability cover, broker introductions, and policy comparisons. We read the policy with the aircraft in mind — what's actually flown, where, and by whom — not just what's quoted.",
    includes: [
      'Cover review against operating reality',
      'Broker selection and introduction',
      'Policy and exclusion comparison',
      'Claims advocacy and support',
      'Renewal-cycle reviews',
      'Lessor and financier requirement alignment',
    ],
    enquiry: 'insurance-advisory',
  },
  {
    num: '07',
    group: 'owning',
    title: 'Import / Export & Register Transfer',
    scope: 'All helicopters',
    description: "Cross-border transactions and register transfers handled end-to-end — UK CAA, FAA, IoM, Guernsey — with the documentation, customs, and airworthiness pieces sequenced correctly.",
    includes: [
      'Import and export documentation',
      'Customs and duty handling',
      'De-registration and re-registration',
      'Airworthiness review handover',
      'Transit and ferry coordination',
      'VAT and tax sequencing in partnership',
    ],
    enquiry: 'import-export',
  },

  // GROUP: Independent expert work
  {
    num: '08',
    group: 'expert',
    title: 'Expert Witness & Litigation Support',
    scope: 'All helicopters · Robinson-deep',
    description: "Independent expert opinion for legal, insurance, and dispute matters. Written reports, expert determination, and court-acceptable testimony — drawn from 35 years on the hangar floor.",
    includes: [
      'Pre-action expert opinion',
      'Formal CPR Part 35 expert reports',
      'Insurance loss adjusting support',
      'Maintenance dispute resolution',
      'Sale dispute and warranty claims',
      'Single joint expert appointments',
    ],
    enquiry: 'expert-witness',
  },
];
```

### Rendering changes

- Add a `group` field on each service; render the group header before the first card of each group.
- Replace the existing `tag` rendering with the `scope` badge plus optional `chip` chip.
- The `Enquire` CTA on each card scrolls to the enquiry form and pre-fills `serviceType` with the card's `enquiry` value (current page already has `serviceType` in form state — minimal wiring).

---

## Section 4 — Why It Matters (4 → 3 cards)

Replaces the `independencePoints` data array (line ~244). Card 01 ("Paid by you, not the deal") is removed entirely on the user's call — it reads as defensive and the no-commission point is implicit in a fee-for-service consulting model.

```js
const independencePoints = [
  {
    num: '01',
    title: "What you can't see, we can",
    desc: "Every aircraft we look at — to buy, to manage, to value, or to defend — is read through a working hangar floor and 500+ transactions of memory. Photos, seller demos, broker write-ups, and OEM brochures don't catch what we catch. For Robinsons specifically, factory authorisation means we know the type at the level the people who built it do.",
  },
  {
    num: '02',
    title: 'What good actually looks like',
    desc: "Thirty-five years across the Robinson fleet means we know what 500-hour wear looks like, what 1,500-hour wear looks like, what's normal for a 2010 R44, and what's drifting. That context is what a first-time buyer or single-aircraft owner doesn't have — and what makes the difference between an opinion and an answer.",
  },
  {
    num: '03',
    title: 'A clear position, not a hedged one',
    desc: "Every engagement ends with something concrete — a number, a verdict, or a position you can act on. We get hired to make calls, not to write neutral surveys you have to interpret yourself. That's true of a pre-purchase report, a TCO model, a cover review, or an expert opinion in a dispute.",
  },
];
```

### CSS adjustment

The current `ac-why__grid` is likely 2x2. With three cards it becomes lopsided. Adjust to:
- Desktop (≥960px): 3 columns, equal width
- Tablet (≥640px): 1 column with widened cards
- Mobile (<640px): 1 column

Confirm exact breakpoints from the existing `ac-*` token system before editing.

---

## Section 5 — How It Works (Process)

Replaces the `processSteps` array (line ~229). PPI-specific copy ("48 hours of inspection", "buy/negotiate/walk recommendation") generalised so the same five steps fit any service.

```js
const processSteps = [
  {
    num: '01',
    title: 'Brief',
    description: "Tell us what you need. We confirm scope and whether we're the right firm.",
  },
  {
    num: '02',
    title: 'Scope & fee',
    description: "Written, upfront. What's in, what's out, what it costs. Fixed where possible; capped where not.",
  },
  {
    num: '03',
    title: 'Engagement',
    description: 'The work itself: an inspection, a market search, a model build, a documentation sequence, a written opinion.',
  },
  {
    num: '04',
    title: 'Deliverable',
    description: 'In writing. Report, valuation, TCO model, policy recommendation, expert opinion — with a clear position you can act on.',
  },
  {
    num: '05',
    title: 'Continued',
    description: 'Open line afterwards. Available to talk through findings, support negotiations, take the next call. For retainer clients, this is the relationship.',
  },
];
```

The existing `duration` field on each step is **removed** — no service-specific timelines are surfaced on the page.

---

## Section 6 — Credentials

Structure unchanged. Copy broadens beyond PPI framing in three of the four:

| Card | Treatment |
|---|---|
| Robinson Authorised Service Centre | Reframe so it reads as the depth source behind every Robinson engagement on the menu. Suggested: *"Factory-authorised on every Robinson type — the qualification that backs the inspection, the valuation, the expert opinion, and every Robinson recommendation HQ writes."* |
| CAA Part 145 Approved | Current copy fine. |
| 35 Years of Robinson Experience | Current copy fine. |
| 500+ Transactions Supported | Reframe from "acquisitions, sales, ownership transitions" to span the full menu including disputes and valuations. Suggested: *"Acquisitions, ownership transitions, valuations, and disputes — a track record across the helicopter ownership lifecycle, not just at the point of sale."* |

---

## Section 7 — Enquiry form

The form `serviceType` field already exists in state (`useState({ ..., serviceType: '', ... })`). The dropdown becomes the **entry point** for the form — the user selects what they're enquiring about first, and the visible follow-up fields adapt.

### Service-type options (8)

Match the `enquiry` slug on each service card so the "Enquire" CTA pre-fills correctly:
`pre-purchase-inspection · acquisition-advisory · valuation · aircraft-management · tco-modelling · insurance-advisory · import-export · expert-witness`

### Conditional fields by service

| Service | Always-visible fields | Conditional fields |
|---|---|---|
| Pre-Purchase Inspection | name, email, phone, message | registration, asking price, target inspection date |
| Acquisition Advisory | name, email, phone, message | budget range, intended use, timeline |
| Valuation & Appraisal | name, email, phone, message | registration, purpose (purchase / finance / insurance / tax / legal) |
| Aircraft Management | name, email, phone, message | aircraft type, ownership status (own / sole-own / SPV / lease) |
| Operating Cost & TCO | name, email, phone, message | aircraft type(s), expected annual hours |
| Insurance Advisory | name, email, phone, message | aircraft type, current renewal date |
| Import / Export | name, email, phone, message | aircraft type, from registry, to registry |
| Expert Witness | name, email, phone, message | matter type (purchase / maintenance / insurance / accident), party (claimant / defendant / single joint) |

### Implementation notes

- Same submission endpoint as today.
- Form state expands with the new optional fields; only the fields visible for the selected service are validated and submitted.
- If the user changes `serviceType`, prior service-specific field values clear (avoid stale data on submission).
- An empty `serviceType` shows only the always-visible fields and a prompt to choose a service.

---

## Section 8 — FAQ

Page is CMS-driven via `data-cms-section="faqs-aircraft-consulting"`. This spec defines the **categories** the CMS should cover; FAQ entries themselves are not authored here.

**Categories to cover:**
- Pricing model (fixed-fee / capped / retainer; how fees are quoted)
- Working with non-Robinson helicopters (which services apply, where Robinson-only stops)
- Working alongside the buyer's solicitor, broker, or insurer
- Geographic coverage (UK, EU, international)
- Expert witness scope (CPR Part 35, single joint expert, instructions accepted from)
- Confidentiality and disclosure across services
- How the management retainer works (term, exit, what's covered)
- Insurance advisory — is HQ a broker (no — independent advisory, broker introductions only)

---

## Section 9 — CTA

Service-agnostic copy refresh. Headline: *Tell us what you're working on.* Subhead reuses contact details already on the page. Single primary action — scrolls to the enquiry form (or opens it on mobile).

---

## Component / file impact

| File | Change |
|---|---|
| `src/pages/AircraftConsulting.jsx` | Update `services`, `independencePoints`, `processSteps`, `credentials` data arrays. Update hero / intro / CTA copy. Add group rendering in services section. Replace `tag` with `scope` + optional `chip` rendering. Wire `serviceType` pre-fill from service card CTAs. Add conditional field rendering in enquiry form. Adjust `ac-why__grid` CSS for 3-card layout. |
| FAQ CMS content | Author or update FAQ entries against the new categories listed in Section 8. Out of scope for the implementation plan that follows this spec — owned by content. |
| Tests | Snapshot or visual checks for the services section's new grouping; form integration tests for service-type-specific field visibility and submission payload. |

---

## Risks & open questions

- **CMS hero override.** The hero section has `data-cms-section="ac-hero"` — if any of the headline / sub copy is currently overridden by CMS, the JSX defaults below won't take effect. Verify before editing whether CMS values exist for the hero, intro, or FAQ sections; if they do, those need updating in the admin UI as part of rollout.
- **`AircraftConsultingHeader`.** Page-specific header sub-component (line 255). Not modified here. If it contains a tagline or hero text that conflicts with the new positioning, it needs a follow-up edit.
- **Routing for service deep-links.** Service cards anchor to in-page sections rather than separate routes in this spec. If the user later wants individual `/aircraft-consulting/<service>` pages, that's a separate redesign.
- **Robinson-deep claim on Valuation & Expert Witness.** Confirm with the business that the firm is comfortable making "deeper for Robinsons" the published claim on these two services.
- **No timelines published.** The user explicitly chose not to surface per-service timelines. The "Scope & fee" step still implies a timeline is *agreed* — that's intentional.
