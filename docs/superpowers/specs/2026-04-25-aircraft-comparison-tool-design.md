# Aircraft Comparison Tool — Design Spec

**Date:** 2026-04-25
**Status:** Draft, pending review
**Owner:** Maximus / HQ Aviation
**Implementation surface:** new public page `/aircraft-comparison`, new admin section `/admin/comparables`, new Firestore collection `comparables` and singleton `settings/comparison-defaults`.

---

## 1. Context and intent

HQ Aviation is a UK Robinson dealer. The existing Compare Aircraft section on `/sales/new` (Sales.jsx, line ~1200) covers only the Robinson lineup — R22, R44 family, R66, R88 — using a chip-based selector and a static specs table.

A meaningful share of inbound buyers are already comparing Robinsons against non-Robinson alternatives (Bell 505, AS350, Bell 206 used market, etc.) before they arrive on site. Today, those buyers either bounce or rely on inferior third-party comparison tools.

This spec describes a new dedicated tool at `/aircraft-comparison` that serves those comparison-shoppers honestly — Robinson cost data sourced from HQ's own MX records, non-Robinson cost data from clearly-labelled public sources — with an interactive 5-year TCO estimator on top.

### Strategic positioning

The tool is **reactive**, not promotional:

- It exists for buyers already shopping competitively — it is NOT a marketing surface that *invites* comparison-shopping.
- It will not be linked from primary navigation.
- The existing Robinson-only chip section on `/sales/new` is unchanged. The new tool is reachable only via direct link / inbound search.
- Goal: **win** the buyer who is already comparing — not create comparison-shoppers among existing Robinson-curious traffic.

### Honest comparison framing

- HQ data on Robinsons: badged **verified** (HQ internal MX records).
- Non-Robinson data: badged **estimate** (industry sources, cited per aircraft).
- Fuel-price assumption shown plainly in the page footer.
- "Before resale value" labelling on TCO — residual value explicitly out of scope for v1.
- A "Spot a mistake?" affordance lets visitors flag suspect numbers; submissions land in the existing `/admin/leads` queue.

---

## 2. Catalog scope

**~14–18 aircraft** across five classes:

| Class | Aircraft |
|---|---|
| Trainer | R22 Beta II · Cabri G2 · Schweizer 300CBi |
| Light Piston | R44 Raven II · R44 Cadet · Enstrom 280FX/480B |
| Light Turbine (in production) | R66 Turbine · Bell 505 Jet Ranger X |
| Light Turbine (used market) | Bell 206 JetRanger / LongRanger · MD500/520 · EC120 Colibri |
| Medium Turbine | R88 · AS350 / H125 · EC130 / H130 · Bell 407 |
| Twin Turbine | Bell 429 · EC135 / H135 |

Used-market aircraft (Bell 206, MD500, EC120) are in scope because Robinson loses real sales to them on residual value — this is precisely the comparison HQ wins, and skipping it would be a missed credibility opportunity.

**Out of scope for v1:** Hughes 269/300, Bell 47, AW109, MD600N, AS355.

---

## 3. Data model

### Collection: `comparables` — one document per aircraft

```js
{
  // Identification
  id: "r66-turbine",                  // Firestore doc ID = slug
  manufacturer: "Robinson",
  model: "R66 Turbine",
  displayName: "R66",                 // short label for chips
  class: "light-turbine",             // trainer | light-piston | light-turbine | medium-turbine | twin-turbine
  marketStatus: "in-production",      // in-production | used-only
  isRobinson: true,                   // drives chip vs search visibility
  fuelType: "jet-a1",                 // avgas-100ll | jet-a1
  imagePath: "/assets/images/aircraft/r66.jpg",

  // Performance specs
  specs: {
    seats: 5,
    engine: "Rolls-Royce RR300",
    maxSpeedKts: 140,
    cruiseSpeedKts: 120,
    rangeNm: 350,
    enduranceHrs: 3.0,
    usefulLoadLbs: 1270,
    fuelCapacityGal: 73.3,
    hoverCeilingIgeFt: 10000,
    mtowLbs: 2700,
  },

  // Costs — per hour
  costsPerHour: {
    fuelBurnGph: 22,                  // gallons/hr — fuel £ computed at render
    mxScheduled: 95,                  // GBP/hr scheduled MX accrual
    engineReserve: 80,                // GBP/hr engine overhaul fund
    airframeReserve: 35,              // GBP/hr airframe component reserves
  },

  // Costs — annual fixed
  costsAnnual: {
    insurance: 18000,                 // GBP/yr UK private hull + liability
    annualInspection: 4500,
    hangarage: 8000,                  // optional; many private owners are home-based
  },

  // Acquisition
  acquisition: {
    priceNewGbp: 1290000,             // null if marketStatus === "used-only"
    priceUsedRangeGbp: { low: 950000, high: 1180000 },
  },

  // Provenance
  costsSource: "HQ internal MX records, fleet of 8 aircraft",
  costsConfidence: "verified",        // verified | estimate
  costsLastUpdated: <Timestamp>,
}
```

### Singleton: `settings/comparison-defaults`

```js
{
  fuelPrice: {
    avgas100llGbpPerGal: 8.50,
    jetA1GbpPerGal: 7.80,
  },
  defaults: {
    hoursPerYear: 100,
    yearsOfOwnership: 5,
  },
  lastUpdated: <Timestamp>,
}
```

### Computed at render — never stored

```
fuelCostPerHour    = fuelBurnGph × fuelPrice[fuelType]
docPerHour         = fuelCostPerHour + mxScheduled + engineReserve + airframeReserve
annualFixed        = insurance + annualInspection + hangarage
totalCostPerYear   = annualFixed + (hoursPerYear × docPerHour)
fiveYearTCO        = priceNewGbp + (years × totalCostPerYear)
                     // No residual subtraction in v1; UI labels "before resale value"
```

All formulas live in `src/lib/tco.js` as pure functions, fully unit-tested.

### Schema decisions

- **Two cost groups** (`costsPerHour` / `costsAnnual`) mirror how operators actually budget; render as two distinct subsections in the breakdown table.
- **No residual value in v1.** Volatile, source-dependent, easily disputed. UI labels TCO "before resale value" — honest framing, defers a hard problem.
- **`costsConfidence` drives a visible badge.** Verified (neutral grey) for HQ-sourced; Estimate (amber) for non-Robinson. Always rendered alongside the data it qualifies.
- **Used-only aircraft** set `priceNewGbp: null` and only the used range renders.
- **All currency is GBP, UK context** for v1. Schema can carry currency later (YAGNI).

---

## 4. Architecture

### Routes

```
Public:
  /aircraft-comparison          → AircraftComparison.jsx
                                   URL state: ?models=r66,bell-505&hours=150&years=5

Admin (guarded by AdminRoute):
  /admin/comparables            → AdminComparables.jsx (list + defaults modal)
  /admin/comparables/:id        → AdminComparableEdit.jsx
  /admin/comparables/new        → AdminComparableEdit.jsx (create mode)
```

### File tree

```
src/
├── pages/
│   ├── AircraftComparison.jsx          # public page
│   └── admin/
│       ├── AdminComparables.jsx        # list/table view + defaults modal
│       └── AdminComparableEdit.jsx     # edit/create form
├── components/
│   └── AircraftComparison/
│       ├── ComparisonSelector.jsx      # Robinson chips + non-Robinson search
│       ├── SpecsTable.jsx
│       ├── CostBreakdownTable.jsx
│       ├── TCOSummary.jsx              # hours/years inputs + bottom-line cards
│       ├── ReportMistakeModal.jsx      # the "Spot a mistake?" form
│       └── ComparisonCTA.jsx           # "talk to our team"
├── hooks/
│   ├── useComparables.js               # fetches collection, cached for session
│   ├── useComparisonDefaults.js        # fetches the singleton settings doc
│   └── useComparisonState.js           # reads/writes URL params
└── lib/
    ├── tco.js                          # pure TCO math, fully unit-tested
    └── comparablesSchema.js            # shared shape used by page + admin
```

### Data flow

```
Firestore comparables collection + settings/comparison-defaults
   ↓ (read on mount, cached in memory for session)
useComparables() / useComparisonDefaults() hooks
   ↓
AircraftComparison.jsx orchestrates
   ↓
URL ?models= → filter selected aircraft
URL ?hours=, ?years= → TCO inputs (fall back to defaults singleton)
   ↓
Render: Selector · SpecsTable · CostBreakdownTable · TCOSummary · CTA · ReportMistakeModal
   ↓
lib/tco.js computes derived values live on every input change
```

### Why this shape

- **One Firestore collection, one admin page** — matches the existing `/admin/listings` + `/admin/listings/:id` pattern. Owner sees a familiar UI.
- **Page logic is small.** `AircraftComparison.jsx` orchestrates; the heavy lifting is in 5 focused sub-components, each ~80–150 lines. None grow into another `Sales.jsx` (currently 7,686 lines).
- **TCO math is pure and isolated.** `lib/tco.js` takes cost data + inputs, returns numbers. Easy to unit-test, easy to verify when buyers question a figure.
- **URL is the source of truth for selection.** No global state, no localStorage. Refresh = same state. Shareable links work for free.
- **Admin and public share `comparablesSchema.js`** — one definition of what fields exist. Adding a cost field later means changing one file.

---

## 5. UI / UX

### Page composition (top → bottom)

1. **Hero** — short headline + 1–2 sentences of honest framing: "Robinson figures from HQ's own MX records; other manufacturers from publicly sourced industry data, clearly labelled."
2. **Selector**:
   - Robinson lineup as a visible chip rail (R22 / R44 family / R66 / R88).
   - "Compare against another aircraft" search input below — type to filter; results grouped by class with class headings.
   - Selected aircraft show as removable pills with their provenance badge.
3. **Specs table** — column per aircraft. Header carries provenance badge. Rows: seats, cruise, range, useful load, fuel cap, hover ceiling, MTOW, engine.
4. **Cost breakdown** — same column layout. Two grouped subsections: **Per hour** (fuel computed live, scheduled MX, engine reserve, airframe reserve, → DOC/hr total) and **Annual fixed** (insurance, annual inspection, hangarage, → fixed/yr total). "Spot a mistake?" link directly underneath.
5. **TCO summary** — hours/year + years controls inline. Below them, one card per selected aircraft showing 5-year total, broken into acquisition + 5 × annual. Labelled "before resale value." "Spot a mistake?" link underneath.
6. **CTA strip** — "Want a tailored ownership analysis from our team?" — inline form: name, email, free-text. Selected aircraft are auto-attached. Submits via existing `POST /api/leads` with `source: "comparison-tool"`.
7. **Sources & methodology accordion** — every aircraft's source listed. Fuel-price assumption shown plainly. How TCO is calculated.

### UI states

| State | Behaviour |
|---|---|
| 0 selected | Hero + selector visible. Comparison sections collapse to a placeholder ("Select two or more aircraft above to start comparing"). Sources/methodology accordion shown by default. |
| 1 selected | A single spec card. Gentle prompt to add another. Cost & TCO sections hidden. |
| 2–3 selected | Full layout. |
| Loading | Skeleton bones in selector + spec area. Cached data from previous session shown instantly while revalidating. |
| Firestore error | Inline notice in the selector slot: "Couldn't load aircraft data — please refresh, or call our team on [number]." Page never goes fully blank. |

### Mobile

- Specs/cost tables: column-per-aircraft with horizontal scroll inside the table; sticky first column ("Spec" label).
- TCO cards stack vertically (one full-width card per aircraft).
- Selector chips wrap; search becomes full-width.
- Hours/years controls collapse to two large dropdowns.

### Provenance UI

- Every aircraft column header carries a small badge: **verified** (neutral grey) or **estimate** (amber).
- Tap/hover the badge → tooltip with `costsSource` text and `costsLastUpdated` date.
- Footer "Sources & methodology" accordion lists every aircraft's source explicitly.
- Fuel-price assumption shown plainly in the page footer.

### "Report a mistake" flow

- Subtle "Spot a mistake?" link under both the cost-breakdown table and the TCO summary.
- Each cost row also gets an inline flag icon on hover (desktop) / long-press menu (mobile) to report that specific cell.
- Modal pre-fills aircraft + field. Free-text "what should it be / your source." Optional email.
- Submits via existing `POST /api/leads`:
  ```js
  {
    source: "comparison-mistake-report",
    aircraftId: "bell-505",
    field: "insurance",
    currentValue: 24000,
    suggestedValue: 18000,   // optional
    message: "...",
    email: "..."             // optional
  }
  ```
- Reports show in `/admin/leads` with the source tag — admin reviews and decides whether to update.
- The visible affordance itself signals "we stand behind these numbers and want to be told if we got it wrong." Most submissions will be ignored; the few that are right get acted on.

---

## 6. Admin flow

### Sidebar nav addition

One entry slotted into the existing `NAV_ITEMS` array in `AdminLayout.jsx`:

```js
{ to: '/admin/comparables', icon: '🚁', label: 'Comparables' }
```

Slotted between Listings and Misc Items.

### List view — `/admin/comparables`

- Table: model · manufacturer · class · provenance badge · last updated · edit link.
- Filters: class · source (verified/estimate) · status (in-production/used-only).
- Sort by last-updated to find stale data.
- Header buttons: **+ Add aircraft** · **⚙ Edit defaults**.
- Stale-data tile on the admin dashboard: count of aircraft where `costsLastUpdated > 6 months ago`.

### Edit view — `/admin/comparables/:id`

Single sectioned form mirroring the schema:

- **Identification:** doc ID (slug — editable on create, locked on edit), manufacturer, display name, model, class, status, fuel type, isRobinson checkbox.
- **Performance specs:** all spec fields.
- **Costs — per hour:** fuel burn, scheduled MX, engine reserve, airframe reserve.
- **Costs — annual fixed:** insurance, annual inspection, hangarage.
- **Acquisition:** price new (nullable for used-only), used range low/high.
- **Provenance:** source description, confidence dropdown.

Buttons: Save changes (atomic write of full doc, stamps `costsLastUpdated`); Delete (two-step confirm warning that inbound URL links with this slug will silently break).

Validation:
- Required: model, manufacturer, class, isRobinson, fuelType, costsConfidence, slug (on create).
- Numeric fields ≥ 0.
- `priceNewGbp` required unless `marketStatus === "used-only"`.
- Slug uniqueness checked on create.

### Defaults modal

Triggered by **⚙ Edit defaults** on the list page. Edits the singleton `settings/comparison-defaults`. Four fields: Avgas £/gal · Jet A1 £/gal · default hours/yr · default years. Save closes; changing fuel price recomputes every TCO instantly.

### Permissions

- Existing `AdminRoute` guard applies automatically.
- Firestore rules (additions):
  ```
  match /comparables/{id} {
    allow read: if true;
    allow write: if request.auth.token.role in ['admin', 'super_admin'];
  }
  match /settings/comparison-defaults {
    allow read: if true;
    allow write: if request.auth.token.role in ['admin', 'super_admin'];
  }
  ```

### Existing infrastructure reused

- `useFirestore` hook (`useCollection`, `updateDocById`, `createDoc`, `deleteDocById`)
- `AdminLayout` + `AdminRoute`
- `/api/leads` endpoint (rate-limited) for both the CTA form and the mistake-report form
- `/admin/leads` queue surfaces both with a source tag

---

## 7. Resilience

### Error handling

- **Firestore unreachable on first load** → page renders the hero + selector with a graceful inline notice; never goes fully blank.
- **Firestore save fails on admin** → toast error, form state retained, no lost edits. Existing `useFirestore` hook surfaces error states.
- **Unknown slug in URL** (`?models=foo,bar`) → silently dropped, rest of page renders.
- **Invalid TCO input** (`?hours=abc`, negative numbers, NaN) → fall back to defaults from `settings/comparison-defaults`.
- **Missing cost field on a doc** → render "—" in the cell. Don't crash the comparison because one field is missing.
- **Defensive coercion** in `lib/tco.js`: every numeric input passes through `Number()` with a sensible fallback. Math never returns NaN to the UI.
- **Stale-while-revalidate**: `useComparables()` caches the last successful read for the session.

### Testing

- **Unit tests for `lib/tco.js`** — every formula. Fuel cost = burn × price; DOC/hr; annual fixed; 5-year TCO. Edge cases: used-only aircraft with `priceNewGbp: null`, missing hangarage, zero hours/yr.
- **Unit tests for `lib/comparablesSchema.js`** — required fields, numeric validation, slug format, used-only logic.
- **Component tests:** `ComparisonSelector` adds/removes pills; `useComparisonState` reads & writes URL params; >3 aircraft selection rejected.
- **Integration test (one happy path):** mount `AircraftComparison` with stubbed Firestore, select R66 + Bell 505, change hours/yr from 100 to 200, assert displayed TCO numbers move correctly.
- **Admin tests:** create new aircraft → appears in list; save → Firestore mock receives correct payload; delete confirm modal blocks accidents; slug uniqueness on create.
- No E2E (Playwright/Cypress) in v1. Manual smoke test in dev before deploy.

### Observability

- Existing `PageTracker` logs page views automatically.
- Custom events via existing `analytics.js`: `comparison_models_changed` (selected slugs), `tco_inputs_changed` (hours/years), `comparison_cta_clicked`, `comparison_mistake_reported` (aircraft + field). Reveals which pairings buyers actually compare.
- Stale-data dashboard tile (counts aircraft where `costsLastUpdated > 6 months ago`).
- Lead-capture form submissions land in `/admin/leads` with `source: "comparison-tool"`; mistake reports with `source: "comparison-mistake-report"`.

### Performance

- One Firestore read on mount: ~14–18 docs + 1 settings doc. ~5–10 KB payload, single round-trip.
- TCO math: microseconds for ≤3 aircraft × ~6 fields. No memo needed.
- Selector chips: plain CSS, no Framer Motion (matches existing chip pattern).
- No virtualization needed (max 3 columns).

### Security

- Firestore rules (above): public read on `comparables` and the defaults singleton; admin claim required for writes.
- No HTML rendered from Firestore data — every field is plain text or a number. No XSS surface.
- Existing `AdminRoute` + `useAdmin` custom-claim check applies to all admin routes.
- Lead-capture rate limiting already in place on `/api/leads`.

### Accessibility

- Selector chips are `<button>` elements; keyboard-focusable, Space/Enter toggles.
- Tables use semantic `<table><thead><tbody>`; column headers carry aircraft name + provenance text.
- Verified/estimate badges aren't colour-only — text label is always rendered alongside.
- TCO inputs are `<input type="number">` with `min`, `max`, `step`, and labels.

---

## 8. Out of scope (Phase 2 candidates)

Documented here so the boundary is explicit. None of these block v1.

- **Residual value / depreciation curves.** v1 labels TCO "before resale value." Phase 2 could fetch broker-listing trend data if a credible source emerges.
- **Pre-built "popular comparison" landing pages.** Owner explicitly opted out (the tool is reactive, not promotional). If SEO traffic shows demand, this is the lever.
- **Per-region cost adjustments** (UK base × multiplier for EU / US).
- **Aircraft images / hero shots.** v1 is text-only; images can plug into existing `image_slots` infra later.
- **"Compare against your current aircraft" mode** (input the buyer's existing aircraft details to compute the upgrade delta).
- **>3 aircraft comparison.** v1 caps at 3 to keep tables scannable.

---

## 9. Open questions

These need resolution before / during implementation. None block writing the implementation plan, but each should be answered before that step ships.

1. **Cost-data research seeding.** Initial 14–18 aircraft cost figures must be gathered before the page is useful. Four parallel research agents are dispatched on 2026-04-25 to gather public-source data; output to `docs/superpowers/research/2026-04-25-comparables-{robinson,bell-md,airbus,piston-trainer}.md`. Robinson figures must be verified against HQ's internal MX records before seeding Firestore. **Owner action:** review the research output and adjust against HQ's real data once agents complete.

2. **CTA form fields.** Current spec: name, email, auto-attached selected aircraft, free-text. Confirm or adjust.

3. **Phone number for the error state.** Does HQ have a sales line to display? If not, fall back to `/contact` link.

4. **Catalog sort order.** Current spec: by-class then alphabetical, with class headings in the search dropdown. Confirm.

5. **Image plan.** v1 is text-only. If HQ wants thumbnails in the selector / spec table for v1, that adds a sub-task to source 14–18 consistent aircraft photos.

---

## 10. Upgrade path: static → Firestore (already taken)

This spec adopts Firestore-backed editable data from the start (per owner decision). The earlier-considered alternative — static JSON in `src/data/aircraft.js` — is not used. Documented here as a record of the decision.

---

## 11. Implementation effort estimate

Rough scope (writing-plans skill will produce the detailed plan):

- **Schema + hooks + TCO math:** small. Pure functions and Firestore reads. Heavy unit-test coverage. ~1 day.
- **Public page + sub-components:** medium. Five focused components. ~2 days.
- **Admin list + edit + defaults modal:** medium. Mirrors existing `/admin/listings` patterns. ~1.5 days.
- **Report-a-mistake modal + lead source wiring:** small. Reuses existing `/api/leads`. ~0.5 day.
- **Firestore rules + initial seeding:** small once research data is verified. ~0.5 day.
- **Manual smoke test + responsive polish:** small. ~0.5 day.

**Total v1 build (excluding research data collection):** ~6 days of focused work.

The cost-data research is the long-tail item. Initial public-source data lands within the day (parallel agents); HQ verification of Robinson figures and review of non-Robinson estimates is the human bottleneck before Firestore seeding.
