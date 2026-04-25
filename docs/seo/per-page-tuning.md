# HQ Aviation — SEO Strategy & Per-Page Specification (v3)

**Date:** 2026-04-24
**Status:** ⏸️ AWAITING OWNER APPROVAL — Tranche A page edits cannot start until Part 14 approval gates are signed.
**Replaces:** v2 (archived at `per-page-tuning-v2-archived.md`) and v1 (archived at `per-page-tuning-v1-archived.md`).
**Research basis:** every factual claim in this document has been independently verified via public sources (Robinson Helicopter Company, UK CAA, Google Search Central, schema.org, Whitespark, Sterling Sky, Companies House, competitor websites, SERP inspection). Source URLs are inline throughout. Unverified items are labelled `[unverified]` and carry an explicit action to verify before publication.

---

## Change log vs v2

v2 called itself "per-page tuning" but proposed large content build-outs, had title-length violations against its own rule, used `HQ Aviation` in the Contact prefix that gets auto-suffixed to `| HQ Aviation` (duplicate), set the landing H1 to bare `HQ Aviation` (no query terms), deferred the two biggest-winnable URL moves to unscheduled footnotes, had no keyword-volume data, no effort×impact scoring, no internal-link graph, no measurement plan, no Core Web Vitals story, no supporting-content plan, overclaimed HQ as "the UK's authorised Robinson dealer" (Sloane, Heli Air, and HQ all publicly claim authorised status — HQ is one of ~3), treated the Robinson R88 as a current sales target when it is pre-certification (FAA target 2028–2029), and repeated several schema claims that are provably wrong (FAQPage→AI Overviews cargo-cult, Course carousel rules, AggregateRating via third-party API — Google explicitly forbids aggregating third-party reviews into own-site schema).

v3 splits the work into three independent tranches, enforces a real character budget, introduces a prioritisation matrix, names the URL architecture explicitly, adds the internal-link matrix, adds image + CWV + measurement sections, corrects the schema claims, de-blocks the owner-approval waterfall, pivots HQ's positioning to verifiable differentiators (Rolls-Royce RR300 Authorised Service Center since 2019 + founder 55 yrs experience + Denham/London proximity), and reframes R88 from a sales page to a pre-cert interest-registration page.

---

## Part 0 — Scope & tranching

Previous plan coupled all the work into Tasks 17–19 behind a single owner approval. v3 splits along honest scope boundaries so each tranche ships independently:

| Tranche | Scope | Needs owner inputs? | Est. effort | Ships |
|---|---|---|---|---|
| **A — On-page tuning** | Titles, metas, H1s, per-page canonicals, schema builders, OG titles/images, one `<Seo>` prop addition | No | ~1 dev-day | First, ASAP |
| **B — Authority signals** | ATO number, Part-145 number, established year, third-party reviews aggregate, named CFI | Yes (see Part 13) | <1 dev-day once inputs arrive | When owner delivers values |
| **C — Content & new URLs** | Body-section rewrites, new pages (`/helicopter-experience-london`, `/instructors`, R44 variant split), supporting blog cluster, image renaming + `srcset` rollout | Some (instructor bios, case studies) | ~4–6 dev-days across 3–4 weeks | After A ships, in stages |

Tranches A and B are reversible; Tranche C is the larger programme. Shipping A first gets the fastest SERP signal and lets us measure the tuning's effect before committing to C.

---

## Part 1 — Customer profile

**Helicopter ownership and training is a service people travel for** — buyers are HNW individuals + corporates whose home or office is anywhere from central London out to the M25–M40 wealth belt. *Denham itself has no meaningful customer base.*

Geographic targeting, in priority order:

1. **London** — primary anchor. Highest search volume + highest concentration of HNW buyers. Mayfair, Knightsbridge, Belgravia, Chelsea, Holland Park, Kensington, Hampstead, Highgate, St John's Wood, Notting Hill, Richmond, Chiswick.
2. **England / UK** — sales queries. Helicopter buyers shop nationally; dealer authorisation matters more than dealer location.
3. **Wealthy Home Counties commuter belt** — *the actual catchment for training, maintenance, trial lessons*. Used on page-specific geo blocks with page-appropriate angles (see Part 6 — no verbatim repetition across pages). By drive time from Denham:
   - **5–15 min:** Beaconsfield, Gerrards Cross, Chalfont St Giles, Stoke Poges, Burnham, Iver
   - **15–30 min:** Marlow, Cookham, Bourne End, Amersham, Chesham, Northwood, Chorleywood, Radlett, Rickmansworth, Watford, Slough, Maidenhead, Windsor, Eton
   - **30–45 min:** Henley-on-Thames, Reading, Cobham, Esher, Oxshott, Wentworth, Sunningdale, Ascot, Richmond, Twickenham
4. **Denham** — *trust signal in body content, not a primary keyword target*. Present as the physical base + GBP anchor, not in title real estate except on `/contact`.

---

## Part 2 — Baseline rankings

**Method:** April 2026 SERP inspection via public web search (US-weighted, not a logged-out UK incognito — treat positions as **directional indicators**, not definitive). All values must be re-checked from a London residential IP and, post-launch, replaced with Google Search Console "Queries" data. GSC verification is itself a Tranche A deliverable.

| Query | v2 claim | April 2026 directional SERP | Delta |
|---|---|---|---|
| robinson helicopter dealer uk | HQ #1 | **Heli Air #1, HQ #2** (robinsonheli.com #3, Sloane #5) | v2 overclaimed |
| helicopter dealer near london | HQ #1 | HQ #1 ✓ (Heli Air #3, Castle Air #4) | confirmed |
| ppl helicopter london | HQ page 1 | **Elstree #1, HQ #2** (ICE #3, helicopterservices #6) | confirmed as page 1 |
| robinson helicopter maintenance uk | HQ page 1 | **robinsonheli.com/training/maintenance-course #1, HQ #2** (Heliserve #3) | confirmed as page 1 |
| helicopter school denham | HQ #1 | (not spot-checked; low-volume hyperlocal) | carry v2 claim `[unverified]` |
| robinson r66 for sale uk | not ranking | Europlane #1, ExclusiveAircraft #2, ATA #3 — HQ absent top 5 | confirmed absent |
| robinson r44 for sale uk | not ranking | Heli Air #1, UKHeliSales #2, AvBuyer #3 — HQ absent top 5 | confirmed absent |
| helicopter trial lesson uk | unknown | WonderDays #1, IntoTheBlue #2, ICE #3 — HQ absent | aggregator-dominated |
| helicopter experience london | aggregator-dominated | Adventure001 #1, FlyDays #2, TripAdvisor #3, **The London Helicopter (Redhill) #4** — HQ absent | confirmed + new competitor surfaced |
| robinson type rating uk | unknown | (not spot-checked) | Tranche A action |

**Key corrections vs v2:**
- **HQ is #2 not #1 for "robinson helicopter dealer uk"** — Heli Air outranks. The v2 "defend #1" framing is wrong; the real work is "overtake Heli Air for #1".
- **HQ is absent** from top-5 for per-aircraft sales queries — the Tranche A aircraft-leaf edits are pure offense, not defense.
- **The London Helicopter** (Redhill-based, thelondonhelicopter.com) is a significant competitor in the "helicopter experience london" SERP alongside aggregators. Added to Part 5.
- **Castle Air, Elite Helicopters, Flying Pig Helicopters, Exclusive Aircraft, ATA Aviation, Heliserve, UKAS** all surface in HQ's target SERPs — v2's 7-competitor table was incomplete. See Part 5.

**Tranche A verification action (owner or SEO lead, before Tranche A ships):**
1. Verify GSC ownership of hqaviation.com. If not yet verified, verify now.
2. Pull GSC "Queries" report for last 28 days, export to `docs/seo/rankings-baseline-{date}.csv`.
3. Run a London-IP incognito check for each of the 10 queries above (desktop + mobile); log rank, date, device.
4. Update this table with verified numbers before Tranche A edits go live, so post-launch deltas are measurable.

---

## Part 3 — Keyword targets & prioritisation matrix

v2 treated every page as equally urgent. v3 scores each page on four dimensions and produces an execution order. Scores are qualitative (H/M/L) until real GSC/Keyword-Planner/Ahrefs volume data exists — volume-tier cells marked `[placeholder]` must be filled with actual figures before approval.

**Scoring rubric:**
- **Volume** — estimated UK monthly searches for the page's primary query. H = ≥500/mo, M = 100–500, L = <100.
- **Winnability** — SERP-analysis signal. H = competitor at #1 is a thin homepage or DA <40; M = page-1 is mixed; L = aggregator-dominated (Trustpilot, BuyAGift, IntoTheBlue).
- **Commercial value** — revenue weight of the page. H = sales lead, M = training funnel, L = info.
- **Effort** — tuning cost. S = title/meta/schema only (Tranche A), M = one new section, L = new URL or multi-section content build (Tranche C).

| # | Page | Primary query | Volume | Win | Value | Effort | Tranche |
|---|---|---|---|---|---|---|---|
| 1 | `/aircraft/r66` | robinson r66 for sale uk | M [placeholder] | H | H | S→M | A (+C) |
| 2 | `/aircraft/r44` | robinson r44 for sale uk | M [placeholder] | H | H | S→M | A (+C) |
| 3 | `/sales/new` | new robinson helicopters uk | M [placeholder] | H | H | S→M | A (+C) |
| 4 | `/` (landing) | robinson helicopter dealer uk | M [placeholder] | H (currently #1 per v2) | H | S | A |
| 5 | `/training/ppl` | ppl helicopter london | M [placeholder] | M | H | S→M | A (+C) |
| 6 | `/maintenance` | robinson helicopter maintenance uk | L–M [placeholder] | M (currently p1) | H | S→M | A (+C) |
| 7 | `/training/trial-lessons` | helicopter trial lesson uk | M [placeholder] | M | M | S | A |
| 8 | **[NEW] `/helicopter-experience-london`** | helicopter experience london | H [placeholder] | L (aggregators) | M | L | C |
| 9 | `/training/type-rating` | robinson type rating uk | L [placeholder] | H | M | S | A |
| 10 | `/aircraft/r22` | robinson r22 for sale uk | L [placeholder] | H | M | S | A |
| 11 | `/aircraft/r88` | robinson r88 uk | L (new model, building) | H | H | S→M | A (+C) |
| 12 | `/training/commercial` | cpl helicopter training uk | L [placeholder] | M | M | S | A |
| 13 | `/expeditions` | helicopter expeditions | L [placeholder] | H | L | S | A |
| 14 | `/contact` | branded + denham aerodrome | L | L (GBP-driven) | L | S | A |

Execution order for Tranche A = table row order (1–7, 9–14). Items 8 + the R44 variant split are Tranche C. Items marked S→M get the S edit in Tranche A and the M content expansion in Tranche C.

**No page scores H/H/H that we're punting.** The honest tradeoff: `/helicopter-experience-london` would be H-volume + H-value but L-winnability against aggregators — it earns its own dedicated sprint, not a line of prose in a different doc.

---

## Part 4 — URL architecture & cannibalisation plan

v2 had four `/training/*` leaves plus a landing page all hinting at the same "helicopter training" intent, and `/sales/new` overlapping with per-aircraft leaves on "for sale UK" queries. No canonical plan, no hub/leaf assignment. This causes cannibalisation.

v3 names the structure:

### Sales funnel

```
/sales/new (hub)           → intent: "I want a new Robinson dealer in the UK"
                              target: new robinson helicopters uk / authorised dealer
                              role: overview + funnel into leaves
                              canonical: self
                              indexable: yes
     │
     ├── /aircraft/r22     → intent: "I want to buy/know-about an R22"
     ├── /aircraft/r44     → intent: "I want to buy/know-about an R44"
     ├── /aircraft/r66     → intent: "I want to buy/know-about an R66"
     └── /aircraft/r88     → intent: "R88 launch interest / ordering"
                              canonical: self
                              indexable: yes
                              MUST NOT target "robinson helicopter dealer" —
                              hub owns that. Leaves target per-model queries only.
```

`/aircraft/*` pages also reachable at legacy paths (per seo-audit: "Duplicate aircraft URLs canonicalised pending Task 21"). **Tranche A closing action:** confirm legacy paths 301-redirect to `/aircraft/{model}` or carry a canonical pointing there. No leaf should be accessible at two self-canonical URLs.

### Training funnel

```
/training (hub)            → intent: "what pilot training does HQ offer?"
                              role: navigation hub only (thin content currently)
                              DECISION REQUIRED: either
                                (a) content-build the hub (Tranche C) and
                                    target "helicopter pilot training uk" from it; OR
                                (b) noindex the hub and let leaves rank.
                              RECOMMEND: (b) for Tranche A, revisit for Tranche C.
     │
     ├── /training/ppl             → "ppl helicopter london/uk"
     ├── /training/commercial      → "cpl helicopter training uk"
     ├── /training/type-rating     → "robinson type rating uk"
     └── /training/trial-lessons   → "helicopter trial lesson uk"
```

Each training leaf MUST NOT target the generic umbrella "helicopter pilot training" — the hub (if indexed) or leaf most relevant to the query owns it. Rule: leaf titles include the course name (PPL/CPL/Type/Trial), not the umbrella noun alone.

### Other routes

- `/maintenance` — no hub/leaf split. Self-canonical, indexable.
- `/expeditions` — self-canonical, indexable.
- `/contact` — self-canonical, indexable (ranking is GBP-driven anyway).
- `/` (landing) — self-canonical, indexable. Targets dealer umbrella + branded.
- Tranche C `/helicopter-experience-london` — new URL, self-canonical, indexable, distinct content angle (gift-focused) from `/training/trial-lessons`. **Not a canonical to `/training/trial-lessons`** — distinct intent warrants a distinct page.

### Anti-cannibalisation rules (enforce in every Tranche A edit)

1. **One canonical URL per topic.** If the same H1 would fit two pages, one must be re-scoped.
2. **Titles must differ on at least one keyword-level noun.** `/training/ppl` = "PPL(H)"; `/training/commercial` = "CPL(H)"; no overlap on the course noun.
3. **Hub pages mention leaves with internal links; leaves don't compete for hub queries.** See Part 7.

---

## Part 5 — Competitive landscape (research-verified April 2026)

Corrects and expands v2's 7-row table. Self-claims marked where present — Sloane and Heli Air both publicly position as *the* UK Robinson distributor; HQ cannot.

### UK Robinson authorised dealers (all three claim the status)

| Competitor | Base(s) | Self-claim | Where they win | What HQ takes |
|---|---|---|---|---|
| **Sloane Helicopters** (sloanehelicopters.com) | Sywell (Northamptonshire NN6 0BN) + London Elstree + Northolt + Enniskillen NI | "Sole UK and Ireland Distributor"; "UK's first Robinson dealer since 1975" | Sales queries via DA — ranks for "near london" despite 80 mi distance; also named UK R88 dealer in press | HQ cannot claim "first" or "sole"; differentiate on London proximity + RR300 service + factory-direct via Global Rotors |
| **Heli Air** (heliair.com) | Wycombe Air Park (HQ) + Wellesbourne + Manchester + Gloucester + Cumbernauld (**no longer operates from Denham** per owner) | "Licensed UK Distributor of the full range of new Robinson Helicopters" | Per-model sales via WooCommerce `/product-category/` taxonomy (e.g. `/product-category/pre-owned-and-used-helicopters/used-robinson-r44/`); maintenance via `/helicopter-maintenance-2/` + Part-145 + Part-147 | Mirror per-model page density; differentiate on **authorised dealer + RR300 Authorised Service Center** (HQ holds RR300 approval, verified via HeliHub 2019); Heli Air does not publicly claim RR300 ASC |
| **HQ Aviation / Global Rotors** (hqaviation.com) | Denham (UB9 5DF) | "Official approved Robinson Factory distributor" via Global Rotors division | "helicopter dealer near london" (#1), "robinson helicopter dealer uk" (#2), "ppl helicopter london" (page 1), "robinson helicopter maintenance uk" (page 1) | (our side) |

### Specialist / service-centre competitors

| Competitor | Base | Notes |
|---|---|---|
| **Heliserve** (heliserve.co.uk) | Leeds Heliport | Robinson-approved service centre; ranks #3 for "robinson helicopter maintenance uk" |
| **UK Aviation Services (UKAS)** (ukaviationservices.com) | Blackpool | Robinson + Bell authorised service centre |
| **ATS Aero** (atsaero.co.uk) | — | CAA Part-145 UK.145.00456 for R22 + R44 (Robinson-branded status unconfirmed) |
| **Europlane Sales** (europlanesales.com) | White Waltham, Maidenhead SL6 3NJ | **R66 sales — ranks #1 for "robinson r66 for sale uk"** with title *"Robinson R66 For Sale In The UK – Europlane Sales Ltd"*. Publishes **separate URLs per variant**: `/aircraft-for-sale/robinson-r44-raven-i/`, `/aircraft-for-sale/robinson-r44-raven-ii-4/`, with further Clipper + Cadet variants. CAA CAO UK.CAO.0114 for R44 maintenance. |

### Training / experience competitors

| Competitor | Base | Where they win | Pattern to note |
|---|---|---|---|
| **Elstree Helicopters** (elstreehelicopters.co.uk) | Elstree | **#1 for "ppl helicopter london"** | Per-product URLs (e.g. `/product/robinson-r22-trial-lesson/`), visible prices (R22 30-min £178–290, R44 range £229–625 per duration) |
| **ICE Helicopters** (icehelicopters.com) | Elstree (Borehamwood WD6 3AN) | Trial lessons via geo-stacked slug: `/helicopter-trial-lessons-borehamwood-hertfordshire-essex/` | Mirror with **London** scope for `/helicopter-experience-london` (Tranche C) |
| **Helicopter Services** (helicopterservices.co.uk, V21 Ltd, AOC GB2128) | White Waltham | "ppl helicopter london" (page 1) | Benefit-led phrasing *"fly helicopters privately with a PPL(H)"* in page copy (exact H1 element not confirmed) |
| **Castle Air** (castleair.co.uk) | Trebrown, Cornwall + London Heliport | Page 1 for "helicopter dealer near london" | DA-driven; operates London Heliport service |
| **Elite Helicopters** (elitehelicopters.co.uk) | Goodwood | Page 1 for "ppl helicopter london" + "helicopter trial lesson uk" | Shopify-style commerce URLs |
| **Flying Pig Helicopters** (flyingpighelicopters.co.uk) | — | Page 1 for "ppl helicopter london" | Owner should spot-check; new to the landscape |

### Experience / aggregator SERP (dominates "helicopter experience london")

| Surface | Notes |
|---|---|
| **Adventure001, FlyDays, WonderDays, IntoTheBlue, BuyAGift, Trustpilot, TripAdvisor** | Experience-voucher aggregators. Own the SERP for "helicopter experience london". |
| **The London Helicopter** (thelondonhelicopter.com) | Redhill-based but owns the "London Helicopter" brand; position 4 for "helicopter experience london". Direct competitor — missing from v2's landscape. |
| **Wingly, Helijet, Helicentre** | Long-tail / side SERP. |

### Strategic gaps

1. **RR300 Authorised Service Center** is HQ's single-most-unique competitive asset (confirmed 2019 via HeliHub). No other UK competitor publicly claims RR300 ASC. This is the ownable angle for `/maintenance` and `/aircraft/r66`.
2. **Per-aircraft page density** — Europlane wins R66 with a dedicated per-variant URL; Heli Air wins R44 with their WooCommerce taxonomy. HQ currently has no per-variant R44 URLs and is absent from top 5 for both queries. Tranche C opportunity: variant splits.
3. **Helicopter Services + Elstree both use above-fold pricing transparency on training pages**; HQ does not. Tranche C: mirror.
4. **HQ is now the sole major Robinson operator at Denham** — Heli Air previously had a Denham base but no longer operates there (owner-confirmed). The "Denham" geo angle is defensible as a clean differentiator. Use "Robinson at Denham" language with confidence on landing + maintenance.

*Sources (all Part 5 rows):* sloanehelicopters.com/about-us, heliair.com/new-helicopter-sales, heliair.com/helicopter-maintenance-2, hqaviation.com, helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center, heliserve.co.uk/about-us, ukaviationservices.com, europlanesales.com/aircraft-for-sale/robinson-r66, europlanesales.com/aircraft-for-sale/robinson-r44-raven-i, europlanesales.com/aircraft-for-sale/robinson-r44-raven-ii-4, icehelicopters.com/helicopter-trial-lessons-borehamwood-hertfordshire-essex, elstreehelicopters.co.uk, helicopterservices.co.uk/training/private-pilot-licence.

---

## Part 6 — Per-page specifications (Tranches A + B)

### Character budget (enforced)

The `<Seo>` component (confirmed at `src/components/seo/Seo.jsx:25`) hardcodes ` | HQ Aviation` (14 chars including leading space) to every `title` prop. Google truncates titles at ~580px (~60 chars desktop).

**Rules for Tranche A:**
1. **Title prefix ≤ 45 chars.** With the append, total ≤ 59.
2. **Title prefix MUST NOT contain "HQ Aviation"** (would produce "HQ Aviation | HQ Aviation"). Enforced across Part 6 — no prefix below breaks this.
3. **One small code change (Tranche A deliverable):** extend `<Seo>` to accept an optional `suppressBrandSuffix` boolean or `fullTitle` override. Needed for `/contact` (tight char budget) and to allow cleaner OG titles (og:site_name already carries brand; og:title duplicating it is suboptimal). ~10 lines in `Seo.jsx`. Logged in Part 11.
4. **Meta descriptions ≤ 155 chars.** Lead with value-prop, include primary query word in natural prose, one differentiator, one action. Geography appears once, not as a list.
5. **H1 carries the primary query noun + geo modifier.** H1 can exceed the title's char budget.
6. **OG title defaults to full title unless `fullTitle` override used**; **OG image must be a per-page 1200×630 JPEG ≤300 KB** (defaults to `/og-default.jpg` today).

---

### 6.1 Landing — `/`

**File:** `src/pages/Experimentation.jsx`
**Primary query:** `robinson helicopter dealer uk` (directional Heli Air #1, HQ #2 per Part 2) + `robinson helicopters london`
**Title prefix (40 chars):** `Robinson Helicopter Dealer · London & UK`
**Full title (54 chars):** `Robinson Helicopter Dealer · London & UK | HQ Aviation`
**Meta (151 chars):** `Robinson Helicopter Company authorised dealer at Denham, 30 minutes from central London. New R22, R44, R66 sales. PPL & CPL training. CAA Part-145 maintenance.`
**H1:** `Robinson Helicopter Sales, Training & Maintenance — Denham, 30 min from London`
**OG image:** existing `/og-default.jpg` (R66 hero crop) — adequate for Tranche A; consider bespoke crop in Tranche C.
**Schema:** site-wide Organization + WebSite + LocalBusiness (already wired). Add nothing page-specific.
**Canonical:** self. **Indexable:** yes.

**Positioning language rules (apply site-wide):**
- **CORRECT:** "Robinson Helicopter Company authorised dealer at Denham" / "Robinson authorised dealer and Rolls-Royce RR300 authorised service centre" / "a UK Robinson authorised dealer"
- **INCORRECT — do not use:** "the UK's authorised Robinson dealer" / "the only UK Robinson dealer" / "the UK's first Robinson dealer" (Sloane holds the 1975-first claim) / "sole UK distributor" (Sloane's self-claim — not HQ's to take)
- **Verifiable differentiators to lean on:** (a) Rolls-Royce **RR300 Authorised Service Center** — HQ is the only UK competitor publicly claiming this [source: helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center]; (b) **Global Rotors** — HQ's direct-to-factory division; (c) founder Quentin Smith **55 years** aviation experience; (d) Denham = M40 J1 = 30 min central London.

**Tranche A body edit (minor):**
- Above-fold, add one paragraph naming the 4 services (Sales, Training, Maintenance, Expeditions) and the verifiable differentiator stack (RR300 ASC + 55-yr founder + London proximity). Outbound link the "Robinson authorised" claim to [`robinsonheli.com/dealers-and-service-centers`](https://www.robinsonheli.com/dealers-and-service-centers) — the canonical trust-signal target.

**Tranche C body additions (defer):**
- Links row to each of the 4 service hubs with descriptive anchors.
- Single-sentence catchment line naming "London and the Home Counties commuter belt" — enumerated town list lives on the specific pages where it fits (PPL for commuting students, Trial Lessons for HNW gift-buyers, Maintenance for owner-pilot airfields).

---

### 6.2 New Aircraft Sales overview — `/sales/new`

**File:** `src/pages/Sales.jsx`
**Primary query:** `new robinson helicopters uk` + `robinson authorised dealer uk`
**Title prefix (38 chars):** `New Robinson Helicopters for Sale · UK`
**Meta (155 chars):** `Order a new Robinson R22, R44 Raven II, R44 Cadet or R66 Turbine from HQ Aviation at Denham — a Robinson authorised dealer with in-house CAA Part-145 maintenance.`
**H1:** `New Robinson Helicopters for Sale — Authorised Dealer, Denham`
**OG image:** new 1200×630 hero of fleet lineup. Tranche A deliverable.
**Schema:**
- `ItemList` of the current-production aircraft leaves with name + url (R22 Beta II, R44 Raven II, R44 Cadet, R66 Turbine; **R88 excluded — see 6.6**, pre-certification)
- `BreadcrumbList`: Home → New Aircraft Sales
- NO `Product` at hub level (Products belong on leaves)
**Canonical:** self. **Indexable:** yes.
**Role per Part 4:** hub — targets dealer umbrella; DOES NOT target per-model queries (leaves own those).

**Tranche A copy rule:** "UK's authorised Robinson dealer" is inaccurate (Sloane + Heli Air + HQ all hold authorised status). Use "Robinson authorised dealer" or "a UK Robinson Helicopter Company authorised dealer". Outbound link to [`robinsonheli.com/dealers-and-service-centers`](https://www.robinsonheli.com/dealers-and-service-centers).

**Tranche C body additions:**
- Fleet comparison table (model, seats, cruise, range, typical use). Price-band column decisions:
  - Robinson publishes **quarterly USD price lists** as public PDFs (e.g. [R22 Beta II 1 July 2025](https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/rhc_r22_pricelist_1_july_2025_2d4ce837c6.pdf); [R44 Raven II & Clipper II 1 July 2025](https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/rhc_r44_2_pricelist_1_july_2025_7e3f9b83a6.pdf)).
  - Known 2025 base list prices (USD, ex-factory): R22 Beta II ~$375k; R44 Raven II ~$615k base / ~$700–720k typical with options; R66 Turbine / NxG ~$1.46M–$1.56M depending on config.
  - **Robinson announced a 5% price increase effective 1 January 2026.**
  - **UK delivered price** = USD base + transport + VAT + GBP/USD FX — do not publish hard GBP figures without a "from / POA / subject to FX" qualifier.
  - Owner decision: (i) publish indicative GBP bands with qualifier, (ii) link out to Robinson's USD PDFs + FX note, or (iii) omit price column. This is the one remaining Gate A owner decision (Part 14).
- "Authorised Robinson dealer" — HQ Aviation Ltd was incorporated **2011** (Companies House #07587658); exact Robinson dealer-appointment year is not publicly stated — optional Tranche B input, otherwise omit the year.
- Trade-in / finance / delivery lead-time block.
- Outbound link to [Robinson dealer directory](https://www.robinsonheli.com/dealers-and-service-centers).

---

### 6.3–6.6 Aircraft model leaves — `/aircraft/{r22,r44,r66,r88}`

**Files:** `src/pages/AircraftR22.jsx`, `AircraftR44.jsx`, `AircraftR66.jsx`, `AircraftR88.jsx`

**NOTE — R88 is split out to 6.6 as a separate page spec.** R88 is pre-certification (FAA target 2028–2029, first flight late 2026 per Robinson/Flight Global reporting) and **cannot be sold in the UK until after FAA certification plus EASA/CAA validation**. Treating it as a current sales target (as v2 did) is misleading to both users and Google. R22, R44, R66 are current-production sales pages; R88 is a distinct "register interest" page.

### 6.3–6.5 Current-production aircraft leaves — `/aircraft/{r22,r44,r66}`

**Title prefixes (all ≤45):**

| Model | Title prefix | Total w/ brand |
|---|---|---|
| R22 | `Robinson R22 for Sale · UK Dealer` (33) | 47 |
| R44 | `Robinson R44 Raven II · For Sale UK` (35) | 49 |
| R66 | `Robinson R66 Turbine · For Sale UK` (34) | 48 |

**Meta pattern (≤155), example R66:**
> `Buy a new Robinson R66 Turbine — five-seat single-engine Rolls-Royce RR300 — from HQ Aviation at Denham, a Robinson authorised dealer and RR300 service centre.`

**Per-model meta details (all research-verified):**

- **R22 Beta II:** "two-seat **Lycoming O-360** trainer, entry-level Robinson". [Source: [Robinson R22 Beta II official page](https://www.robinsonheli.com/helicopters/r22-beta-ii).] v2 said O-320 — **incorrect**, the Beta II uses a four-cylinder Lycoming **O-360** (carbureted, derated 131 hp T/O / 124 hp continuous).
- **R44 Raven II:** "four-seat, **Lycoming IO-540** fuel-injected piston, Raven II is the current-production premium piston". HQ should also offer the **R44 Cadet** (same airframe as legacy Raven I; **O-540 carbureted**, derated 210 hp T/O / 185 hp cont.) and optionally **R44 Clipper II** (floats). [Source: [Robinson R44 Raven II/Clipper II page](https://www.robinsonheli.com/helicopters/r44-raven-ii-clipper-ii); [R44 Cadet page](https://www.robinsonheli.com/helicopters/r44-cadet).] v2's "IO-540" is correct only for the Raven II — don't use as a universal R44 engine claim.
- **R66 Turbine:** "five-seat (1 + 4) single-engine, **Rolls-Royce RR300 turboshaft** (270 shp T/O / 224 shp continuous), also available as Turbine Marine (floats) and next-gen **R66 NxG** configuration". [Source: [Robinson R66 page](https://www.robinsonheli.com/r66-turbine-r66-turbine-marine-helicopters).] **HQ's RR300 Authorised Service Center status is the on-page differentiator here** — prominently state it.

**H1 pattern:** `Robinson [Model] [Variant] — Robinson Authorised Dealer`
- R22: `Robinson R22 Beta II — New Helicopters for Sale, Robinson Authorised Dealer`
- R44: `Robinson R44 Raven II (and R44 Cadet) — Robinson Authorised Dealer`
- R66: `Robinson R66 Turbine — Robinson Authorised Dealer & RR300 Service Centre`

**OG image:** per-model hero cropped to 1200×630, model name baked in. Tranche A.

**Schema:**
- `Product` per page with `name`, `brand: { "@type": "Brand", "name": "Robinson Helicopter Company" }` (the **legal entity** is "Robinson Helicopter Company, Incorporated" — use full form in structured data, shorter forms in prose), `model`, `description`, `image[]`. **Omit `offers` entirely** unless owner approves a published price band — see Part 11.1.
- `BreadcrumbList`: Home → New Aircraft Sales → [Model]
- One `Course` entry per page for the model's type rating (R22, R44, R66 = 3 courses → satisfies Google's 3-course carousel minimum when combined with /training pages — see Part 11.2).
- **NO `AggregateRating`** at all on these pages (Part 11.3 — Google explicitly forbids aggregating third-party reviews into own-site schema).

**Canonical:** self. **Legacy duplicate URLs:** 301 or `rel=canonical` to `/aircraft/{model}`. Confirm during Tranche A.

**Tranche C body additions per leaf:**
- **Operating economics block** — fuel burn (imperial + litres/hr), maintenance interval summary (HQ holds the RR300 ASC for R66), indicative £/hr running cost, insurance band. Original first-hand content competitors don't publish.
- **"What's included with a new HQ delivery"** — ferry to owner's base, type-rating credit, first-year inspections, parts inventory access (+ **RR300 ASC service for R66**).
- **Use cases / typical owner profile** — counters generic spec-sheet content.
- **FAQ section (4–6 Q/A, H3-per-question)** — "How long from order to delivery?", "What's included?", "Can I finance?", "Type rating cost?", "Maintenance packages?"

**Tranche C (R44 only):** evaluate **Raven II vs Cadet vs Clipper II** split into separate URLs — Europlane Sales ranks for per-variant URLs (`/aircraft-for-sale/robinson-r44-raven-i/`, `/aircraft-for-sale/robinson-r44-raven-ii-4/`, etc.). **Raven I is no longer in production** — don't mirror Europlane's Raven-I URL; do mirror the Raven-II + Cadet + Clipper-II split pattern. Requires new routes + new body content per variant. Separate sprint.

---

### 6.6 R88 register-interest page — `/aircraft/r88`

**File:** `src/pages/AircraftR88.jsx` (retain URL; change page role entirely)

**Critical reframe vs v2/v3-pre-research:** The Robinson R88 is **pre-certification**, not a current sales product. Verified facts:
- **Unveiled** 9 March 2025 at Verticon. [Source: [Vertical Mag launch coverage](https://verticalmag.com/news/robinson-launches-r88-designed-to-be-next-gen-pickup-truck-for-utility-sector/).]
- **Seats: 10 total (2 pilot + 8 passenger)** — v2 called it "8-seat"; that's the cabin count, not the aircraft total. Correct usage: "10-seat utility helicopter" or "2 + 8 configuration".
- **Engine:** single **Safran Arriel 2W, 1,000 shp turboshaft** (not a generic "turbine" — the Safran partnership is a key fact).
- **Certification:** First flight targeted late 2026; **FAA certification targeted 2028–2029** per Robinson CEO David Smith. [Source: [Flight Global — R88 first-flight target](https://www.flightglobal.com/helicopters/robinson-chief-smith-hails-r88s-rapid-progress-and-maintains-2026-first-flight-target/166567.article).]
- **Orders:** ~160 taken as of late 2025.
- **Launch price:** USD $3.3M standard config. [Source: [Robinson R88 European debut press release](https://www.robinsonheli.com/press/highly-capable-affordable-robinson-r88-helicopter-makes-european-debut-in-germany-november-18-20-2025).]
- **UK deliveries:** None possible before FAA cert + EASA/CAA validation. **2028 is the earliest plausible first UK delivery date.** Owner to confirm HQ has any R88 orders in hand.

**Title prefix (36 chars):** `Robinson R88 · 10-Seat Utility Turbine`
**Full title (50 chars):** `Robinson R88 · 10-Seat Utility Turbine | HQ Aviation`
**Meta (154 chars):** `The new Robinson R88 — 10-seat utility turbine, Safran Arriel 2W, targeting FAA certification 2028–2029. Register early UK delivery interest with HQ Aviation.`
**H1:** `Robinson R88 — 10-Seat Utility Turbine, First UK Delivery Interest`
**OG image:** official Robinson R88 press image cropped to 1200×630. Tranche A — source from Robinson press kit.
**Schema:**
- NO `Product` with `offers` (the aircraft is not available to buy — would mislead).
- Use `CreativeWork` or a `Product` with `releaseDate` and `availability: "PreOrder"`, no price.
- `BreadcrumbList`: Home → New Aircraft Sales → R88.
- NO `Course` (no R88 type rating exists yet).
- NO `AggregateRating`.

**Canonical:** self. **Indexable:** yes (informational, not commercial intent — targets "robinson r88" as an informational query).

**Tranche A body:**
- Honest framing: "The R88 is Robinson's new 10-seat utility helicopter, currently in pre-certification development. First flight targeted late 2026; FAA certification expected 2028–2029. This page lets owner-pilots and utility operators register delivery interest with HQ Aviation."
- **Do NOT** publish a "buy now" CTA. Publish a "register interest" form instead.
- Cite Robinson's press release as the authority for every spec claim.

**Tranche C:** as UK certification approaches, this page can evolve into a full sales page — plan revision for 2028.

**Exclusion from /sales/new ItemList (see 6.2):** include R88 as a link in the hub but not as a for-sale ListItem.

---

### 6.7 PPL(H) Training — `/training/ppl`

**File:** `src/pages/FinalPPL.jsx`
**Primary query:** `ppl helicopter london` (claimed page 1 [unverified] — push to top 3)
**Title prefix (35 chars):** `PPL(H) Helicopter Training · London`
**Meta (151 chars):** `Earn your PPL(H) at Denham, 30 minutes from central London. CAA-approved Part-FCL ATO. R22 & R44 fleet. Transparent costs, examiner-rated instructors.`
**H1:** `PPL(H) Helicopter Pilot Training — London`
**Visible H2 (benefit-led per competitor pattern):** `Learn to fly a helicopter and hold a real licence — not just an experience`

**OG image:** student at controls, R44 cockpit, 1200×630. Tranche A.

**Schema:**
- `Course` (provider=LocalBusiness) — feeds the eventual 3-course carousel with /cpl, /type-rating, /trial-lessons. Carousel eligibility is a Google-side consequence, not a prerequisite — ship Course on this page standalone.
- `BreadcrumbList`: Home → Training → PPL(H)
- `FAQPage` — OPTIONAL. Ship prose FAQ with H3 questions regardless; wrap in FAQPage schema if desired, but don't expect rich-snippet display (Google restricts FAQ rich results to gov/health authorities). **Do NOT justify FAQPage on "AI Overview citation" — there is no evidence for this.** The FAQ's real value is the prose itself helping users and being crawlable.

**Canonical:** self. **Indexable:** yes. **Rule:** must NOT target "helicopter training uk" umbrella — `/training` hub (or absence of one) owns umbrella.

**Tranche A tuning-only:** title + meta + H1 + Course schema.

**Tranche C body additions:**
- **Transparent cost breakdown above fold** (verified figures):
  - UK PPL(H) total typical cost: **£20,000–£35,000+** (CAA minimum is 45 flight hours; UK national average is 60–90 hours — publish both). [Sources: [FLYER — helicopter PPL cost](https://flyer.co.uk/feature/learn-to-fly-how-much-does-a-helicopter-ppl-cost/), [PPL Club 2026 guide](https://www.pplclub.co.uk/clubguides/cost-of-uk-ppl).]
  - Hourly rates: quote HQ's own current R22 + R44 rates (owner to confirm — competitors quote £350+VAT R22, £500+VAT R44).
  - **CAA Class 2 medical: £180–£280 typical** (CAA admin £11.15 + AME doctor fee £100–£250). v2's "~£190" was the low end only. [Source: [CAA Class 2 medical application](https://www.caa.co.uk/general-aviation/pilot-licences/applications/medical/apply-for-a-class-2-medical-certificate/); [PPL Club medicals guide](https://www.pplclub.co.uk/clubguides/uk-medicals-guide).]
  - **PPL(H) skills test examiner fee: ~£350** (range £350–£375, sometimes +VAT) plus ~2 hrs aircraft hire. v2's "~£300" was low. [Source: [PPL Club cost guide](https://www.pplclub.co.uk/clubguides/cost-of-uk-ppl).]
  - Mirror Elstree Helicopters' and Helicopter Services' above-fold pricing-card pattern.
- **CAA Part-FCL ATO reference** + outbound link to the CAA's published ATO list. **Correction vs v2:** the CAA does NOT maintain a searchable ATO database — the authoritative list is [Standards Document 31](https://www.caa.co.uk/publication/download/13488) (PDF, currently V215, 31 March 2026 issue, 86 pages). Describe as "published in the CAA's Standards Document 31", not "CAA register". ATO number format is **`GBR.ATO.XXXX`** (4-digit). HQ's specific number is a Tranche B lookup — owner or SEO lead must open Doc 31 PDF and Cmd-F "HQ Aviation" to extract.
- **Named Chief Flying Instructor** with credentials. **Correction vs v2:** there is **no public UK CAA pilot register** — the [CAA "Verify your licence" service](https://www.caa.co.uk/commercial-industry/pilot-licences/applications/verify-your-licence/) is gated, consent-based, and initiated per-request by the pilot for a named recipient (NAA or employer). Outbound-linking a CFI's name to a "CAA pilot register" does not work — there is no such URL. Alternatives that do work:
  - Display the CFI's **CAA examiner authorisation reference** (e.g. "CAA Examiner Authorisation #[ref]") on-page.
  - Link out to HQ's entry in Standards Document 31 (the ATO entry cites the CFI by name).
  - Publish a signed statement of the CFI's hours/ratings, verifiable via employer reference on request.
- **"Convenient from…" geographic block — PPL-specific angle:** commuting students. Drive times from towns where a working student would live: 30 min Mayfair/Chelsea, 15 min Beaconsfield/Gerrards Cross, 25 min Marlow, 30 min Chorleywood/Rickmansworth. Different town selection from Trial Lessons (6.10).
- **FAQ section** (prose + H3 Q/A): "How long does PPL(H) take?" / "How much does it cost end-to-end?" / "What aircraft will I train on?" / "Where do students come from?" / "What's the medical requirement?" / "Can I do it part-time?"

---

### 6.8 CPL(H) — `/training/commercial`

**File:** `src/pages/CPL.jsx`
**Primary query:** `cpl helicopter training uk` + `commercial helicopter pilot training`
**Title prefix (37 chars):** `CPL(H) Commercial Pilot Training · UK`
**Meta (147 chars):** `CPL(H) commercial helicopter pilot training at Denham. CAA-approved modular path from PPL through hour-building, CPL theory, skills test and type rating.`
**H1:** `CPL(H) Commercial Helicopter Pilot Training`
**OG image:** R66 turbine hero (turbine signals commercial progression). Tranche A.
**Schema:** `Course` + `BreadcrumbList`. Optional `FAQPage`.
**Canonical:** self. **Indexable:** yes.
**Rule:** must NOT target "pilot training uk" umbrella — this page owns the CPL variant, not the generic umbrella.

**Tranche A:** title + meta + H1 + Course schema.

**Tranche C body additions:**
- **Career path tree** — PPL → hour-building → CPL theory → CPL flight → type rating → first job (instruction / corporate / offshore / tours).
- **Modular vs integrated comparison.**
- **Named CPL alumni outcomes** (with permission) — social proof + E-E-A-T.
- **Typical timeline + total cost band.**

---

### 6.9 Type Rating — `/training/type-rating`

**File:** `src/pages/TypeRating.jsx`
**Primary query:** `robinson type rating uk` + per-model variants
**Title prefix (39 chars):** `Robinson Type Ratings · R22 R44 R66 R88`
**Meta (153 chars):** `Add a Robinson R22, R44, R66 or R88 type rating to your helicopter licence. CAA-approved at Denham, 30 min from London. Full conversion or differences.`
**H1:** `Robinson Type Rating Training — R22, R44, R66, R88`
**OG image:** four-panel collage of the four models on ramp. Tranche A.
**Schema:** array of 4 `Course` entries (one per type). This alone satisfies any Course-carousel minimum once Google re-crawls.
**Canonical:** self. **Indexable:** yes.

**Tranche A:** title + meta + H1 + 4× Course schema.

**Tranche C body additions:**
- **Type × duration × prerequisite × cost matrix** (4 rows, 4 columns).
- **Recurrency / refresher schedule** per type.
- **"Differences training vs full type rating" decision aid.**
- Inbound deep-links from each `/aircraft/{model}` leaf's "type rating" CTA.

---

### 6.10 Trial Lessons — `/training/trial-lessons`

**File:** `src/pages/DiscoveryFlight.jsx`
**Primary query (this URL):** `helicopter trial lesson uk`
**Secondary URL (Tranche C):** `/helicopter-experience-london` — see 6.14.
**Title prefix (33 chars):** `Helicopter Trial Lessons · London`
**Meta (155 chars):** `Take the controls of a Robinson helicopter on a guided trial lesson at Denham — 30 min from Mayfair. 30 or 60 minutes in R22, R44 or R66. Daily. Gift vouchers.`
**H1:** `Helicopter Trial Lessons — Denham, 30 Minutes from Central London`
**OG image:** bright, aspirational cockpit POV shot or landing scene, 1200×630. Critical for social CTR on gift-shopping funnels. Tranche A.

**Schema:**
- `Service` (`serviceType: "Helicopter Trial Lesson"`, `provider: LocalBusiness`, `areaServed: London + surrounding counties`)
- One `Offer` per duration × model. **Price values MUST come from live Firestore (same source as visible prices) server-side — JSON-LD and DOM price must match exactly or Google flags inconsistency.** If prices aren't wired, omit `Offer` prices (use `offers: { @type: "AggregateOffer" }` with no numeric price, or just omit `offers`). Do NOT hardcode.
- One `Course` entry (counts toward type-rating carousel minimum as a fourth course).
- NO `AggregateRating` until third-party feed exists (Part 11.3).
- `BreadcrumbList`: Home → Training → Trial Lessons.

**Canonical:** self. **Indexable:** yes.

**Tranche A:** title + meta + H1 + schema. NO body changes.

**Tranche C body additions:**
- **Dual hero CTA — "Book for myself" / "Buy as a gift"** (separates conversion funnels from first scroll — gift buyers are ~50% of this intent).
- **Gift voucher mechanics** — validity, transferability, redemption, personalisation options.
- **What to expect** — duration, weight limits, dress, parking, photography allowed, can family watch.
- **"Convenient from…" block — gift-buyer HNW angle:** Mayfair, Chelsea, Notting Hill, Holland Park, Hampstead, Belgravia, St John's Wood + a handful of commuter towns (Ascot, Wentworth, Cobham, Richmond). Different angle + different town selection from PPL (see 6.7).
- Internal link to `/helicopter-experience-london` once that page exists.

---

### 6.11 Maintenance — `/maintenance`

**File:** `src/pages/FinalMaintenance.jsx`
**Primary query:** `robinson helicopter maintenance uk` (directional rank #2 per Part 2; Robinson's own maintenance-course page ranks #1 for this query — that's a training page, not a UK service competitor, so HQ's practical competition is Heliserve #3 onward)
**Title prefix (36 chars):** `Robinson Helicopter Maintenance · UK`
**Meta (155 chars):** `Robinson authorised service centre and Rolls-Royce RR300 authorised service centre at Denham. CAA Part-145 for R22, R44, R66. AOG response across the south-east.`
**H1:** `Robinson Helicopter Maintenance & Overhauls — Authorised RR300 Service Centre`
**OG image:** workshop shot with R44/R66 on jacks, 1200×630. Tranche A.

**RR300 differentiator (unique to HQ in UK competitor set):** HQ is a **Rolls-Royce RR300 Authorized Service Center** (confirmed April 2019 per [HeliHub coverage](https://www.helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center/)). The RR300 is the turbine engine in the R66. No other UK Robinson competitor (Heliserve, UKAS, Heli Air, Sloane) publicly claims RR300 ASC status. This is the single strongest verifiable angle HQ has in the maintenance SERP — lead with it on this page and on `/aircraft/r66`.

**Schema:**
- `Service` (`serviceType: "Helicopter Maintenance"`, `provider: LocalBusiness`). Include `areaServed` as a GeoCircle around UB9 5DF with a large radius (south-east-of-England coverage is realistic).
- `BreadcrumbList`
- Optional `FAQPage` — ship prose FAQ regardless; schema is inert in SERP per Part 11.4.
**Canonical:** self. **Indexable:** yes.

**Tranche A:** title + meta + H1 + Service schema + RR300 above-fold callout.

**Tranche C body additions:**
- **Maintenance schedule matrix per type** — 50hr / 100hr / annual / 12-year — calendar/visual block.
- **Indicative cost-band per inspection category** (owners search on this).
- **CAA Part-145 number + Robinson Authorised Service Center badge** — outbound links to verifiable sources (Tranche B).
- **Service catchment block — owner-pilot airfield angle:** Fairoaks, White Waltham, Wycombe Air Park, Stapleford, Elstree, Goodwood, Blackbushe. Pickup and ferry UK-wide. Different angle (airfields not towns) from PPL/Trial Lessons blocks — owners don't search by hometown, they search by base airfield. This is the honest differentiator.

---

### 6.12 Contact — `/contact`

**File:** `src/pages/Contact.jsx`
**Primary query:** branded + `denham aerodrome helicopter`
**Title prefix (34 chars):** `Contact · Denham Aerodrome UB9 5DF`
**Full title (48 chars):** `Contact · Denham Aerodrome UB9 5DF | HQ Aviation`
**Meta (154 chars):** `Visit HQ Aviation at Denham Aerodrome (UB9 5DF), 30 min from central London via M40 J1. Ops +44 1895 833373. Maintenance +44 1895 832833. Open seven days a week.`
**H1:** `Contact HQ Aviation — Denham Aerodrome`
**OG image:** aerial of the aerodrome / signage, 1200×630. Tranche A.

**Schema:** richer `LocalBusiness` with full `contactPoint` array (already in `seoDefaults.CONTACT_POINTS` per seo-audit). Add `geo` (51.5094, -0.5083 — central Denham Aerodrome; verify with owner) + `openingHoursSpecification`. Operator of the aerodrome is **Bickerton's Aerodromes Ltd** (not BAA) — useful context in body copy if location history is discussed, not required in schema.

**Canonical:** self. **Indexable:** yes.

**Tranche A:** title + meta + H1. Confirm LocalBusiness `contactPoint` array renders. **Owner input needed:** exact opening-hours window (v2 stated 08:30–17:00; research couldn't verify the precise times — owner to confirm).

**Tranche C body additions:**
- **Directions (verified):**
  - **M40 J1** (A40 Denham Roundabout / Denham Interchange) — primary.
  - **M40 J1a = M25 J16** (free-flow interchange) — from the M25 / orbital side.
  - Do NOT phrase as "M40 J1 and M25 J16" as if they were alternatives; J1a IS J16, the same junction. [Source: [M40 motorway — Wikipedia](https://en.wikipedia.org/wiki/M40_motorway); [roads.org.uk Denham Interchange](https://www.roads.org.uk/motorway/m40/190).]
- **Nearest rail: Denham railway station**, **Chiltern Main Line**, served by Chiltern Railways, direct to London Marylebone in ~30 min. Station sits at North Orbital Road, Denham Green — short taxi/walk to the aerodrome (owner to confirm exact road distance). Gerrards Cross station (also Chiltern Main Line) is ~1.7 mi from the aerodrome. Do NOT claim the station is "at" the aerodrome. No London Underground service to Denham. [Source: [Chiltern Railways — Denham station](https://www.chilternrailways.co.uk/train-stations/denham); [Denham railway station — Wikipedia](https://en.wikipedia.org/wiki/Denham_railway_station).]
- **what3words:** v2 included a placeholder — do NOT publish a guess. Fetch the exact triplet from [what3words.com](https://what3words.com/) by dropping a pin on the HQ Aviation / Bickerton's reception at UB9 5DF before publishing. Owner action, Tranche C.
- **"Who to call" matrix** — Sales / Training / Maintenance / General → matched phone number.
- Map embed + parking + on-site facilities.

**Reminder:** local-pack rankings are substantially GBP-driven (see Part 11.5). This page tunes for branded navigation queries, not local-pack position. **GBP primary category** should be set to exactly **"Aviation training institute"** (Google's official category string) — v2 said "Aviation training school" which is not the exact taxonomy label. Secondaries: "Aircraft dealer", "Aircraft maintenance", optionally "Heliport". "Helicopter charter" only if HQ operates paid charter. [Source: [Google business-profile category guidelines](https://support.google.com/business/answer/3038177).]

---

### 6.13 Expeditions — `/expeditions`

**File:** `src/pages/FinalExpeditions.jsx`
**Primary query:** `helicopter expeditions` (low volume, low competition, easy ranking — L/L/H winnability but L commercial value)
**Title prefix (32 chars):** `Worldwide Helicopter Expeditions`
**Meta (150 chars):** `Multi-day long-range helicopter expeditions led by HQ Aviation pilots. Cross-Channel, cross-continent, bespoke routes, itinerary, fuel and customs handled.`
**H1:** `Helicopter Expeditions — Worldwide, Fully Managed`
**OG image:** in-flight shot over dramatic terrain. Tranche A.
**Schema:** `Service` + optional `Event` per planned trip. **Canonical:** self. **Indexable:** yes.

**Tranche A:** title + meta + H1 + Service schema.

**Tranche C body additions:** past expedition case studies with maps, route-capability block, "what's included" service tier, bespoke-quote process.

---

### 6.14 [NEW — Tranche C] Helicopter Experience London — `/helicopter-experience-london`

**File:** to be created.
**Primary query:** `helicopter experience london` — H volume, L winnability (aggregator-dominated SERP: Trustpilot, BuyAGift, IntoTheBlue, Adventure001). Low odds of #1 but even position 5–8 above aggregators is high-value traffic.
**Title prefix (36 chars):** `Helicopter Experience · London & M25`
**Meta (155 chars):** `Private helicopter experience lessons from a CAA-approved school 30 minutes from central London. Take the controls of a Robinson R22, R44 or R66. Gift vouchers.`
**H1:** `Helicopter Experience — London, CAA-Approved, Gift Vouchers`

**Why a separate page, not a canonical to `/training/trial-lessons`:**
- Distinct intent — gift buyer, not pilot prospect.
- Distinct SERP — aggregators vs training schools.
- Distinct conversion funnel — voucher-first, experience-focused.
- Canonical to a different-angle page = Google picks its own canonical and we lose both.

**Schema:**
- `Service` with `serviceType: "Helicopter Experience"` + `areaServed: London`
- `Offer` per experience tier with **live prices** matching DOM.
- `Product` for gift voucher SKUs.
- `BreadcrumbList`: Home → Helicopter Experience London.

**Internal linking:** inbound from `/training/trial-lessons`, landing, footer. Outbound to `/training/ppl` ("continue to full training") and `/contact`.

**Canonical:** self. **Indexable:** yes. Do NOT canonical to `/training/trial-lessons`.

**Estimated effort:** 2–3 dev-days (new route + component + content + images + schema + offer data). Warrants its own sprint, not a footnote.

---

## Part 7 — Internal-link matrix

v2 had zero. Each Tranche A page edit includes wiring the outbound links listed below. Anchor text is descriptive, not just "click here" / "learn more".

| From ↓ / Link to → | `/` | `/sales/new` | `/aircraft/r22` | r44 | r66 | r88 | `/training/ppl` | cpl | type-rating | trial-lessons | `/maintenance` | `/expeditions` | `/contact` | `/helicopter-experience-london` (C) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **/** | — | "New Robinson helicopters for sale" | | | "R66 Turbine" (hero link) | | "Learn to fly — PPL(H) training" | | | "Book a trial lesson" | "CAA Part-145 maintenance" | "Worldwide expeditions" | "Visit us at Denham" | (C) |
| **/sales/new** | "Home" | — | "Robinson R22" | "Robinson R44 Raven II" | "Robinson R66 Turbine" | "Robinson R88" | | | "Type rating training" | | "In-house maintenance" | | "Speak to sales" | |
| **/aircraft/r22** | ↑ | "New aircraft overview" | — | "Step up to the R44" | | | "Learn on the R22 — PPL(H)" | | "R22 type rating" | | "R22 maintenance" | | | |
| **/aircraft/r44** | ↑ | "New aircraft overview" | "Start on the R22" | — | "Step up to the R66" | | "Train on the R44" | | "R44 type rating" | | "R44 maintenance" | | | |
| **/aircraft/r66** | ↑ | "New aircraft overview" | | "R44 Raven II" | — | "R88 — eight-seat turbine" | | "Commercial pilot training" | "R66 type rating" | | "R66 maintenance" | | | |
| **/aircraft/r88** | ↑ | "New aircraft overview" | | | "R66 Turbine" | — | | | "R88 type rating" | | "R88 maintenance" | | "Register interest" | |
| **/training/ppl** | ↑ | | "Train on R22" | "Train on R44" | | | — | "Continue to CPL" | "Type rating next" | "Trial lesson first?" | | | "Enquire / book" | |
| **/training/commercial** | ↑ | | | | | | "Start with PPL" | — | "Add type ratings" | | | | "Enquire" | |
| **/training/type-rating** | ↑ | "New aircraft for sale" | "R22 type rating" | "R44 type rating" | "R66 type rating" | "R88 type rating" | | | — | | | | "Enquire" | |
| **/training/trial-lessons** | ↑ | | | | | | "Continue to PPL(H)" | | | — | | | "Book / voucher" | (C) "London-focused experience" |
| **/maintenance** | ↑ | | "R22 maintenance" | "R44 maintenance" | "R66 maintenance" | "R88 maintenance" | | | | | — | | "AOG contact" | |
| **/expeditions** | ↑ | | | | | | | | | | | — | "Enquire" | |
| **/contact** | ↑ | "New aircraft" | | | | | "Training" | | | "Trial lessons" | "Maintenance" | | — | |
| **/helicopter-experience-london (C)** | ↑ | | | | | | "Continue to PPL" | | | "Full trial-lesson range" | | | "Book" | — |

**Footer:** every page gets a compact footer with links to the 5 hubs: `/sales/new`, `/training/ppl` (as the most-searched leaf), `/maintenance`, `/expeditions`, `/contact`. Keeps the graph dense for crawlers.

---

## Part 8 — Supporting content cluster (Tranche C)

v2 had nothing. A small editorial layer of 8–12 posts accelerates commercial-page authority — especially for higher-difficulty queries where content depth matters more than inbound links (we don't have many).

| # | Post | Supports | Primary query |
|---|---|---|---|
| 1 | How much does PPL(H) cost in the UK? (2026 breakdown) | `/training/ppl` | ppl h cost uk |
| 2 | How long does a helicopter licence take? | `/training/ppl` | how long to get helicopter licence uk |
| 3 | R44 vs R66 — which Robinson suits your mission? | `/aircraft/r44`, `/aircraft/r66` | r44 vs r66 |
| 4 | Robinson R66 running costs — fuel, maintenance, insurance | `/aircraft/r66` | r66 running cost |
| 5 | Moving up from R22 to R44 — what the type rating covers | `/training/type-rating`, `/aircraft/r44` | r22 to r44 type rating |
| 6 | CPL(H) career paths — instructor, offshore, corporate, tours | `/training/commercial` | helicopter pilot career uk |
| 7 | Trial helicopter lesson — what to expect, what to bring | `/training/trial-lessons` | what to expect helicopter lesson |
| 8 | Helicopter gift voucher UK — what to know before you buy | `/training/trial-lessons`, `/helicopter-experience-london` (C) | helicopter gift voucher uk |
| 9 | CAA Part-145 explained — what owner-pilots should check | `/maintenance` | caa part 145 helicopter |
| 10 | Getting to Denham Aerodrome from central London | `/contact`, `/training/ppl`, `/training/trial-lessons` | denham aerodrome london |
| 11 | Robinson R88 — what we know about the eight-seat turbine | `/aircraft/r88` | robinson r88 |
| 12 | Helicopter expedition planning — fuel, customs, routing | `/expeditions` | helicopter expedition planning |

Each post: 1200–1800 words, H1 matching query, 2–3 outbound internal links to the supported commercial page(s), `Article` schema (builder exists per seo-audit), author byline (Tranche B). Publication cadence: 1 post/week for 12 weeks after Tranche A ships.

---

## Part 9 — Image SEO specification

v2 was one bullet. Real spec:

### Filename convention

`{brand}-{model}-{view}-{modifier}-{year}.{ext}`
- Good: `robinson-r66-turbine-exterior-denham-2026.jpg`, `robinson-r44-raven-ii-cockpit-2025.jpg`, `ppl-training-r22-student-denham.jpg`
- Bad: `IMG_3472.JPG`, `hero.jpg`, `photo-1.jpg`

Lowercase, hyphens not underscores, no spaces, no double-hyphens.

### `<img>` attribute checklist

Every image below the fold and above:

```html
<img
  src="/images/robinson-r66-turbine-exterior-1200.webp"
  srcset="/images/robinson-r66-turbine-exterior-480.webp 480w,
          /images/robinson-r66-turbine-exterior-768.webp 768w,
          /images/robinson-r66-turbine-exterior-1200.webp 1200w,
          /images/robinson-r66-turbine-exterior-1920.webp 1920w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1200" height="800"
  loading="lazy"
  alt="Robinson R66 Turbine exterior parked at Denham Aerodrome"
/>
```

**Rules:**
- `width` + `height` always set (prevents CLS).
- `loading="lazy"` below fold; **LCP image (above-fold hero) gets `fetchpriority="high"` and NO lazy**.
- `srcset` at 480/768/1200/1920 widths, WebP primary, JPEG fallback via `<picture>` if older-browser coverage matters.
- `alt` = one descriptive sentence (≤125 chars), includes the model + context, NOT a keyword dump.
- Decorative images `alt=""`.

### `ImageObject` schema (aircraft galleries)

For each `/aircraft/{model}` page, the primary 3–5 gallery images get `ImageObject` entries inside the `Product` JSON-LD:

```json
{
  "@type": "ImageObject",
  "contentUrl": "https://hqaviation.com/images/robinson-r66-turbine-exterior-1200.jpg",
  "caption": "Robinson R66 Turbine on the ramp at Denham Aerodrome",
  "width": 1200,
  "height": 800
}
```

### Delivery

- WebP primary. AVIF if infra supports (check bundler). JPEG fallback only where WebP support uncertain.
- Compression target: ≤200 KB per 1200w image, ≤80 KB per 768w.
- Serve from `/public/assets/images/` (existing layout per `public/assets/images/new-aircraft/`).
- CDN or cache-control headers: 30-day cache, immutable where content-addressed.

### Rollout priority (Tranche C)

1. `/aircraft/r66` gallery (winnable money SERP)
2. `/aircraft/r44` gallery
3. Landing hero
4. `/training/trial-lessons` hero (social-share image)
5. Remaining pages

---

## Part 10 — Core Web Vitals / technical performance

v2 ignored CWV entirely. Per the companion `seo-audit.md`, the main JS chunk is 4,093 KB raw / 852 KB gzipped — heavy. On the visually-rich pages (landing, aircraft leaves, PPL, trial lessons), this risks poor LCP and INP, and CWV are ranking signals.

### Targets (per page)

| Metric | Target | Notes |
|---|---|---|
| LCP | ≤ 2.5s (mobile 4G) | Hero image must be preloaded + `fetchpriority="high"` |
| INP | ≤ 200ms | Framer Motion + heavy JS can blow this on page-enter animations |
| CLS | ≤ 0.1 | All `<img>` must have width/height; fonts via `font-display: swap` with size-adjust |

### Page-level flags (Tranche A checks)

| Page | CWV risk | Mitigation (Tranche A) | Mitigation (Tranche C/post) |
|---|---|---|---|
| `/` | High (landing is animation-heavy) | Preload LCP hero image; add width/height | Route-based code splitting (see seo-audit) |
| `/aircraft/*` | Medium (image-heavy) | width/height on gallery; lazy below-fold | Convert galleries to WebP (Part 9) |
| `/training/ppl` | Medium | Preload hero; eager above-fold | Evaluate video autoplay impact on INP |
| `/training/trial-lessons` | Medium | Same as above | Offer prices rendered server-side to avoid CLS |
| `/maintenance` | Low | Basic width/height audit | — |
| `/contact` | Low | Map embed lazy-loaded | — |

### Cross-cutting (not blocking Tranche A)

- Route-based code splitting. Already flagged in seo-audit as post-Plan-1. Worth explicit follow-up spec.
- Font audit — Google Fonts vs self-hosted subset. Self-hosted usually wins CWV.
- Animation entrance audit — Framer Motion's `initial → animate` sequences can delay INP if heavy.

---

## Part 11 — Schema corrections & builder inventory

v2 had 5 critical fixes, several of which were overclaimed. Corrected list:

### 11.1 `buildProduct()` `priceSpecification: "POA"` — disqualifies Product rich result ✅ (v2 correct)

Our shipped `buildProduct()` emits `priceSpecification: { price: "POA" }`. Google's Product snippet validator requires numeric prices. Non-numeric strings disqualify the rich result.
*[Source: Google Search Central — Product Snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)*

**Fix:** rewrite `buildProduct()` to:
- Omit `offers` entirely when no price is stated (still valid Product).
- OR accept an `offers` argument: `{price, priceCurrency}` or `{lowPrice, highPrice, priceCurrency}` (AggregateOffer).

Aircraft pages (R22/R44/R66/R88): omit `offers`. If owner approves publishing price bands, swap to `AggregateOffer`. Decision gate in Tranche A.

**Effort:** ~20 lines in `src/lib/seoBuilders/*` or equivalent. Tranche A, before per-page rollout.

### 11.2 `buildCourse()` — valid markup, carousel-only rich result (research corrections)

v2 said Course-carousel eligibility "requires ≥3 courses marked up site-wide" and framed `buildCourse()` as a Task 19 blocker. Corrected per research:

- A single `Course` entry is **valid markup** — it validates in Rich Results Test and is consumed by other systems — but **is not a rich-result carrier on its own**. Google's Course rich-result surface is the **carousel**, which requires **≥3 courses marked up** (site-wide or on a single list page). v3's earlier phrasing "individual Course entries earn SERP eligibility on their own merits" was too generous. [Source: [Google Search Central — Course structured data](https://developers.google.com/search/docs/appearance/structured-data/course).]
- With HQ's four training leaves (PPL, CPL, Type Rating, Trial Lessons) each shipping one `Course` (and `/training/type-rating` shipping 4 Course entries for R22/R44/R66/R88), the 3-course minimum is easily satisfied.
- `buildCourse()` can ship alongside the training-page edits, not before — not a gating prerequisite.

**CourseInfo deprecation — precise dates:** CourseInfo was **announced deprecated 12 June 2025** in the "Simplifying the search results page" Search Central post; Search Console UI / Rich Results Test / search-appearance filters stopped reporting it on **9 September 2025**; API support ended December 2025. Don't use CourseInfo. [Sources: [Google Search Central — Simplifying search results (June 2025)](https://developers.google.com/search/blog/2025/06/simplifying-search-results); [Search Engine Roundtable coverage](https://www.seroundtable.com/google-search-console-deprecated-structured-data-40083.html).]

### 11.3 `AggregateRating` — DO NOT attempt on-site (v3 corrected from earlier assumption)

**Material correction from my previous v3 draft.** Earlier v3 said: "wire Google Places API rating into LocalBusiness schema." That is **incorrect** — Google explicitly forbids it:

> "Google no longer displays review rich results for the schema types `LocalBusiness` and `Organization` (and their subtypes) in cases when the entity being reviewed controls the reviews themselves." Aggregating reviews or ratings from other websites (including Google Places) into your own site's schema is specifically called out as non-compliant. [Source: [Google Search Central — Making Review Rich Results More Helpful (Sept 2019, still in force)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful); [Review snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).]

**Correct handling:**
- **DO NOT** attach `AggregateRating` to `LocalBusiness`, `Organization`, or any subtype on HQ's own site using any third-party source (Google Places, Trustpilot, Reviews.io, etc.).
- **DO NOT** display SERP star ratings via on-site schema for the org-level entity. It will not render stars and risks a Google manual action.
- **Star ratings come from Google Business Profile natively** — they render in the Map Pack / Google Maps / Knowledge Panel automatically once GBP has reviews. No site-level schema needed. Focus GBP review acquisition instead (Part 11.5).
- **Trustpilot** is a Google Ads Seller Ratings partner — ratings can display in paid search ads, not in organic SERPs via site schema. If HQ runs Google Ads, worth integrating on the Ads side only.
- **Product-level AggregateRating** (on aircraft leaves) is technically allowed when reviews are genuine third-party and per-SKU, but HQ doesn't have per-aircraft-leaf review volume. Skip.

**Net: no `AggregateRating` on this site, period, until per-product reviews exist at volume. Remove the Tranche B "Trustpilot/Places API integration" row entirely.**

### 11.4 `FAQPage` schema — ship the FAQ prose, schema is optional (v2 overclaimed)

v2 twice justified `FAQPage` on "AI Overview citation". There is **no published evidence** from Google, OpenAI, Anthropic, or Perplexity that `FAQPage` JSON-LD drives LLM citation. Correction:

- FAQPage rich results in SERP are restricted to government/health-authority domains since Aug 2023.
- For commercial sites, FAQPage schema is inert in SERP but harmless.
- **Real value of a FAQ section is the prose itself** — crawlable, answers user intent, satisfies Helpful Content. H3-per-question is enough; schema is a belt-and-braces extra.

**Recommendation:** ship FAQ prose with H3 questions + plain-text answers on PPL, CPL, Type Rating, Trial Lessons, Maintenance. Wrap in FAQPage schema if cheap, don't expect rich-snippet appearance, don't justify on AI Overviews.

### 11.5 Google Business Profile + dedicated service pages (Whitespark 2026 — research-corrected)

v2's shorthand "8 of the top 10 local-pack factors are GBP-driven" was directionally right but incomplete. Whitespark's 2026 Local Search Ranking Factors report (published late 2025 / early 2026 by Darren Shaw) actually finds:
- **GBP signals ~32% of local-pack ranking weight** (still the largest single category).
- **Dedicated service pages on the website are the #1 signal for local organic rankings, and #2 for AI-search visibility.**

This is the research basis for v3's entire "build focused service pages" thesis — Whitespark's finding directly supports the per-page-tuning plan. GBP matters, *and* so do the on-site service pages this document specs. [Source: [Whitespark 2026 Local Search Ranking Factors](https://whitespark.ca/local-search-ranking-factors/).]

Sterling Sky longitudinal testing separately confirms GBP service-area settings (the "Service Area" field) have **no measurable ranking effect** — rankings snap to the verified physical address. A further Sterling Sky 8,186-business study also found that being categorised as a Service-Area Business *negatively* correlates with "near me" rankings. [Sources: [Sterling Sky — Service Area in GBP](https://www.sterlingsky.ca/does-the-service-area-in-google-my-business-impact-ranking/); [Sterling Sky — Near Me 2025](https://www.sterlingsky.ca/what-gets-you-ranking-for-near-me-2025/).]

**Owner action (Tranche B):**
- Verify HQ Aviation's Google Business Profile ownership.
- Primary category: **"Aviation training institute"** (exact Google category string — not "Aviation training school"). Secondaries: **"Aircraft dealer"** (for the sales arm), **"Aircraft maintenance"** (for the Part-145 arm), optionally **"Heliport"**. Use "Helicopter charter" only if HQ operates paid charter. [Source: [Google business-profile category guidelines](https://support.google.com/business/answer/3038177).]
- Set the location as **address-based, not service-area** (the physical-address signal is what Map Pack uses; SAB setting hurts "near me" per Sterling Sky).
- Complete opening hours, post regularly, request reviews from clients across different counties (county names in review text build geo-relevance organically).

Not blocking Tranche A. Flag it so it doesn't silently not happen.

### 11.6 YMYL / E-E-A-T (v2 overreach softened)

v2 classified helicopter training as YMYL based on "physical safety". Google's Quality Rater Guidelines YMYL examples (Sept 2025) focus on medical, financial, legal, and civic-safety content — aviation *instruction* isn't a clear-cut example. Correction:

- Aviation training is YMYL-*adjacent* at best. Buying a £500,000+ helicopter touches Finance YMYL more cleanly than PPL training touches Safety YMYL.
- The named-instructor recommendation stands on its own merits: trust signal, social proof, conversion lift. Don't justify it primarily via YMYL.

*[Source: Google Search Quality Rater Guidelines, Sept 2025](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)*

### 11.7 `<Seo>` component enhancement (new, Tranche A)

`src/components/seo/Seo.jsx` line 25 hardcodes ` | ${ORG_NAME}` append. Needed:

```jsx
export default function Seo({ title, fullTitle, suppressBrandSuffix = false, ... }) {
  // ...
  const computedTitle = fullTitle
    ? fullTitle
    : suppressBrandSuffix || !title
      ? (title || ORG_NAME)
      : `${title} | ${ORG_NAME}`;
  // ...
}
```

Same logic applied to `og:title`. Needed for `/contact` (tight char budget and brand already in prefix), and for any future page wanting a bespoke title. Test covered in existing `Seo.test.jsx`.

**Effort:** ~10 lines + 2 test cases. Tranche A, first thing.

---

## Part 12 — Measurement & success criteria

v2 had none. Without criteria, nobody can tell if this worked.

### 30 days post-Tranche-A

- GSC verified (if not already) — document at `docs/seo/setup.md` per seo-audit.
- All 13 priority pages indexed (verify via GSC URL Inspection).
- All 13 priority pages pass Rich Results Test for the schema shipped.
- Baseline GSC impressions recorded per-page in this doc's companion `seo-audit.md`.
- Core Web Vitals baseline per-page (PSI + real-user data from GSC Core Web Vitals report).

### 60 days

- Rank tracking for the 14 target queries in Part 3 (tool: Ahrefs / Semrush / GSC average position).
- CTR audit on GSC "Queries" data — any page ranking positions 4–10 with CTR <2% gets a meta-description rewrite.
- Any page ranking >20 for its primary query flagged for Tranche C content expansion.

### 90 days

- Organic sessions to the 13 priority pages (GA4), baseline + delta.
- **Business KPIs:**
  - Trial-lesson bookings from organic traffic
  - Contact-form submissions tagged "sales" from organic
  - Contact-form submissions tagged "maintenance" from organic
- Rank movement vs Part 2 baseline on all 14 queries.
- Pass/fail per page against target-query goal:
  - **Pass:** primary-query rank improved by ≥3 positions OR is top-3
  - **Fail:** primary-query rank unchanged or worse → triggers Tranche C for that page (content expansion) if not already scheduled

### Kill / escalate criteria

- Page stuck >20 after 90 days despite Tranche A + Tranche C attempts → re-evaluate target query (maybe wrong query), or re-evaluate page structure (maybe cannibalised).
- Any page drops out of existing top-10 post-edit → roll back the title/meta change on that page within 48 hours. Tranche A edits are atomic per-page for easy rollback.

---

## Part 13 — Authority signals (Tranche B) — research-resolved where possible

v3 pre-research listed 9 "owner delivers" rows. Research has resolved 4 of those from public sources. The updated list below separates **(i) already verified from public data** (no owner action — use the citation shown), **(ii) owner lookup from public PDFs** (SEO lead or owner extracts from a public PDF), and **(iii) genuinely owner-only inputs**.

### (i) Already verified — use citation directly

| Signal | Pages | Value | Source |
|---|---|---|---|
| Robinson Authorised Service Center status | /maintenance | "Robinson authorised service centre" (generic — avoid "the UK's" since Heliserve, UKAS, Sloane et al. also hold this) | [robinsonheli.com/dealers-and-service-centers](https://www.robinsonheli.com/dealers-and-service-centers) |
| Rolls-Royce RR300 Authorised Service Center | /maintenance, /aircraft/r66 | "Rolls-Royce RR300 Authorized Service Center (approved 2019)" | [helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center](https://www.helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center) |
| Robinson authorised dealer status | /, /sales/new, /aircraft/* | "Robinson authorised dealer" (generic — avoid "the UK's", "sole", "first") | [robinsonheli.com/dealers-and-service-centers](https://www.robinsonheli.com/dealers-and-service-centers) + HQ's own Global Rotors division reference |
| HQ Aviation Ltd incorporation year | /, /sales/new | 2011 (Companies House #07587658) | [find-and-update.company-information.service.gov.uk/company/07587658](https://find-and-update.company-information.service.gov.uk/company/07587658) |
| Founder experience | landing + /about | "Founder Quentin Smith — 55 years aviation experience (as of 2026)" | hqaviation.com/about (verify exact phrasing as currently on-site) |
| R88 facts & status | /aircraft/r88 | 10-seat (2+8), Safran Arriel 2W 1,000 shp, FAA cert target 2028–2029, first flight late 2026, USD $3.3M launch price, ~160 orders | [Robinson press release](https://www.robinsonheli.com/press/highly-capable-affordable-robinson-r88-helicopter-makes-european-debut-in-germany-november-18-20-2025); [Vertical Mag](https://verticalmag.com/news/robinson-launches-r88-designed-to-be-next-gen-pickup-truck-for-utility-sector/); [Flight Global](https://www.flightglobal.com/helicopters/robinson-chief-smith-hails-r88s-rapid-progress-and-maintains-2026-first-flight-target/166567.article) |
| Aircraft engine/spec facts | /aircraft/* | R22 Beta II Lycoming O-360; R44 Raven II Lycoming IO-540 (Cadet uses O-540 carbureted); R66 Turbine Rolls-Royce RR300 | [Robinson R22](https://www.robinsonheli.com/helicopters/r22-beta-ii), [R44 Raven II/Clipper II](https://www.robinsonheli.com/helicopters/r44-raven-ii-clipper-ii), [R44 Cadet](https://www.robinsonheli.com/helicopters/r44-cadet), [R66](https://www.robinsonheli.com/r66-turbine-r66-turbine-marine-helicopters) |
| Robinson pricing context | /sales/new, /aircraft/* | R22 ~$375k; R44 Raven II ~$615k base; R66 ~$1.46M–$1.56M; **5% price increase effective 1 Jan 2026** | Robinson quarterly price-list PDFs (linked in 6.2) |
| CAA Class 2 medical cost range | /training/ppl | £180–£280 (CAA admin £11.15 + AME £100–£250) | [CAA Class 2 application](https://www.caa.co.uk/general-aviation/pilot-licences/applications/medical/apply-for-a-class-2-medical-certificate/); [PPL Club medicals guide](https://www.pplclub.co.uk/clubguides/uk-medicals-guide) |
| PPL(H) skills-test examiner fee | /training/ppl | ~£350 (range £350–£375, sometimes +VAT) + ~2 hr aircraft hire | [PPL Club cost guide](https://www.pplclub.co.uk/clubguides/cost-of-uk-ppl) |
| UK PPL(H) minimum hours | /training/ppl | 45 hrs (CAA Part-FCL minimum); UK national average 60–90 hrs | [CAA PPL(H) page](https://www.caa.co.uk/general-aviation/pilot-licences/helicopters/private-pilot-licence-for-helicopters/) |

### (ii) Owner / SEO-lead lookup from public PDFs (no owner authoring needed)

| Signal | Pages | Action | Source |
|---|---|---|---|
| HQ's CAA Part-FCL ATO number (`GBR.ATO.XXXX` format, 4-digit) | /training/ppl, /training/commercial, /training/type-rating | Open Standards Document 31 PDF, Cmd-F "HQ Aviation" | [CAA Doc 31 PDF (V215, 31 Mar 2026)](https://www.caa.co.uk/publication/download/13488) |
| HQ's CAA Part-145 AMO number (`UK.145.XXXXX` format, 5-digit) | /maintenance | Open CAA Part-145 approved-organisations PDF, Cmd-F "HQ Aviation" | [CAA Part-145 hub](https://www.caa.co.uk/commercial-industry/aircraft/airworthiness/organisation-and-maintenance-programme-approvals/approved-airworthiness-organisations/) |
| what3words for Denham Aerodrome reception | /contact | Open what3words.com, pin the reception entrance at UB9 5DF, copy the triplet | [what3words.com](https://what3words.com/) |
| Exact opening hours | /contact, sitewide schema | Confirm from hqaviation.com/contact (v2 stated 08:30–17:00 but exact times weren't verifiable via search snippets) | hqaviation.com/contact |

### (iii) Genuine owner-only inputs (cannot research)

| Signal | Pages | Needed | Owner delivers? |
|---|---|---|---|
| Named Chief Flying Instructor profile + CAA examiner authorisation number | /training/ppl | CFI name, bio (with CFI's consent), **CAA examiner authorisation reference** (there is no public CAA pilot register — display the authorisation number on-page instead) | [ ] |
| Exact Robinson dealer-appointment year | /, /sales/new (optional) | YYYY (Companies House shows company incorporation 2011; Robinson dealer appointment year is not publicly stated) | [ ] (optional — if not supplied, omit the year) |
| Decision: publish price bands on aircraft leaves? | /sales/new, /aircraft/* | (i) GBP band with "POA / subject to FX" qualifier, (ii) link out to Robinson's USD PDFs with FX note, or (iii) omit price column | [ ] |
| Current R22 / R44 / R66 hourly rates (training + charter) | /training/ppl, /training/commercial, /training/trial-lessons | £/hr per type, VAT status | [ ] |
| R88 order status — does HQ have any R88 orders in hand? | /aircraft/r88 | Y/N + count if yes | [ ] |

**Stage-gate:** Tranche A ships with (i) filled from citations immediately, (ii) swapped in once SEO lead does the PDF lookup (~1 hour work — not blocking), and (iii) rolling in as owner provides. Tranche A does NOT wait for (iii).

---

## Part 14 — Approval gates

Three independent approvals — not a single waterfall:

### Gate A — Tranche A (on-page tuning)

- [ ] **Approved as-is** — proceed with title/meta/H1/schema edits per Part 6, image attribute audit per Part 9, internal-link matrix per Part 7, `<Seo>` prop extension per 11.7, schema-builder fixes per 11.1–11.2. Placeholders omitted where authority values not yet supplied (Tranche B will fill).
- [ ] **Approved with edits** — mark up Part 6 inline, re-submit.
- [ ] **Blocked** — owner notes required below.

### Gate B — Tranche B (authority signals)

- [ ] **Proceed with partials** — ship each signal as it's delivered; don't batch.
- [ ] **Batch-wait** — wait until all signals collected, ship together.

### Gate C — Tranche C (content expansion + new URLs)

- [ ] **Approved in principle** — schedule sprints for: R66 content expansion → R44 content expansion → `/helicopter-experience-london` build → supporting blog cluster (post 1/week, 12 weeks).
- [ ] **Approved with scope edits** — note changes.
- [ ] **Defer** — revisit after Tranche A measurement at Day 30.

### Open questions for owner (resolve before Gate A approval)

v3-pre-research listed 4 questions. Three have been answered by public research; the remaining real decisions are:

1. **Price-column decision on aircraft leaves** — three options (Part 6.2): (a) indicative GBP bands with "POA / subject to FX" qualifier, (b) link out to Robinson's quarterly USD price-list PDFs with an FX note, or (c) omit price column and keep `offers` omitted from Product schema. Recommended: (b) — honest, verifiable, doesn't hard-code a GBP number that rots against USD moves.
2. **Named CFI for /training/ppl** — consent + bio + CAA examiner authorisation number? Or ship without named CFI (trust-signal lift will be smaller but page still valid).
3. **Execution order** — the prioritisation in Part 3 puts /aircraft/r66 first. Does that match business priority? (Alternative orderings: put /maintenance first to lean on RR300 ASC; put /training/ppl first to convert against Elstree's #1.)
4. **R88 page role** — confirm that `/aircraft/r88` is positioned as a "register interest" page (Part 6.6), not a sales page. Does HQ have any actual R88 orders in hand? If yes, shape the page accordingly; if no, keep it informational.

Questions v3-pre-research asked but research has now answered (no owner action needed — answers baked into the document):
- ~~Is HQ the *only* UK-authorised Robinson dealer?~~ **No** — Sloane (self-claims "sole UK distributor since 1975") and Heli Air (self-claims "licensed UK Distributor") both hold authorised status. v3 framing throughout: "a Robinson authorised dealer" not "the". HQ's verifiable differentiator is RR300 Authorised Service Center (no other UK competitor publicly holds this).
- ~~Approve instructor CAA-register links?~~ **Not applicable** — there is no public UK CAA pilot register. Display CAA examiner authorisation number on-page instead.
- ~~R88 first UK delivery window?~~ **Not plausible before 2028+** — R88 is pre-certification, FAA cert target 2028–2029, EASA/CAA validation after. UK deliveries before 2028 are not realistic regardless of dealer orders.

---

## Appendix — Summary of changes

### vs v2 (original critique addressed in v3)

| v2 critique | v3 section addressing it |
|---|---|
| 1. Title-length violations | Part 6 character budget rules; every title recomputed and length-stamped |
| 2. Brand duplication on Contact | Part 6.12 + Part 11.7 (`<Seo>` prop) |
| 3. Landing H1 = "HQ Aviation" | Part 6.1 (H1 contains query + geo + differentiator) |
| 4. No keyword volume | Part 3 (prioritisation matrix with `[placeholder]` blocking approval); Part 2 (directional SERP positions from April 2026 research) |
| 5. No effort×impact model | Part 3 (scoring rubric + execution order) |
| 6. Biggest URLs punted | Part 6.14 `/helicopter-experience-london` promoted into Tranche C item 8 |
| 7. "Content-deep" no target | Part 8 word-count targets; Part 6 content sections specified |
| 8. Scope dishonesty | Part 0 tranching splits tuning from content build-out |
| 9. Geo-block duplication | Part 6.7, 6.10, 6.11 each use a different geo angle (students / gift-buyers / owner-airfields) |
| 10. Cannibalisation | Part 4 URL architecture + hub/leaf rules + anti-cannibalisation rules |
| 11. No internal-link graph | Part 7 matrix |
| 12. No supporting content | Part 8 cluster |
| 13. Meta-description stuffing | Part 6 metas rewritten for CTR |
| 14. FAQPage / AI Overview cargo-cult | Part 11.4 corrected |
| 15. Course minimum-3 misstated | Part 11.2 corrected (single Course = valid markup but NOT a rich-result carrier) |
| 16. AggregateRating API | Part 11.3 MATERIAL CORRECTION — do not attempt on-site AggregateRating at all; Google forbids aggregating third-party reviews into own-site schema |
| 17. No CWV | Part 10 |
| 18. Image SEO one-liner | Part 9 full spec |
| 19. Rewrite metas for CTR | Part 6 metas |
| 20. Ranking-claim methodology | Part 2 with directional April 2026 SERP check + method-statement |

### v3 research-round corrections (owner-flagged insufficient research)

| Claim in v3-pre-research | Status after research | Fix applied |
|---|---|---|
| "HQ is the UK's authorised Robinson dealer" (implicit "the") | CONTRADICTED | Throughout Part 6: "a Robinson authorised dealer"; positioning rules in 6.1 |
| R22 engine "Lycoming O-320" | CONTRADICTED | 6.3 corrected to Lycoming O-360 (per robinsonheli.com R22 page) |
| R44 variants included Raven I | OBSOLETE (Raven I no longer in production) | 6.4 scope = Raven II + Cadet + Clipper II |
| R44 engine "IO-540" as universal | PARTIAL | 6.4: IO-540 is Raven II only; Cadet = O-540 carbureted |
| R88 "8-seat turbine, first UK delivery [placeholder]" | CONTRADICTED — pre-cert, FAA target 2028–2029 | 6.6 reframed as register-interest page, not sales; correct specs (10 seats, Safran Arriel 2W) |
| CAA Class 2 medical "~£190" | PARTIAL — low end only | 6.7: range £180–£280 |
| PPL(H) skills test "~£300" | PARTIAL — low | 6.7: ~£350 examiner fee + aircraft hire |
| "Link to CAA pilot register" | CONTRADICTED — no such public register | 6.7: display CFI CAA examiner authorisation number on-page instead |
| "CAA ATO register with search interface" | CONTRADICTED — it's a PDF (Doc 31) | 6.7 + Part 13 updated; SEO lead to extract number from PDF |
| "Wire Google Places API into LocalBusiness AggregateRating" | EXPLICITLY FORBIDDEN by Google | Part 11.3 rewritten; no on-site AggregateRating |
| Course carousel "single Course entries earn SERP eligibility" | TOO GENEROUS | Part 11.2: single Course = valid markup, not a rich-result carrier |
| CourseInfo deprecated "September 2025" | IMPRECISE | Part 11.2: announced 12 Jun 2025, tooling removed 9 Sep 2025 |
| Denham operator implied BAA / "Denham Aerodrome Ltd" | CONTRADICTED | 6.12: Bickerton's Aerodromes Ltd |
| "M40 J1 and M25 J16" as two alternatives | PARTIAL — J1a = J16 is one interchange | 6.12 corrected |
| "Denham station" implied at the aerodrome | MISLEADING | 6.12: Chiltern Main Line, ~30 min to Marylebone, short distance from aerodrome; Gerrards Cross 1.7 mi alternative |
| Whitespark "8 of 10 top factors GBP-driven" | OVERSIMPLIFIED | Part 11.5: GBP ~32% weight; **service pages are the #1 local-organic signal** (supports v3 thesis) |
| GBP primary category "Aviation training school" | WRONG EXACT STRING | 6.12 + Part 11.5: "Aviation training institute" |
| Owner question: "Is HQ the only UK Robinson dealer?" | Answered by research | Removed from Part 14 |
| Owner question: "R88 first UK delivery window?" | Not plausible before 2028 | Removed from Part 14 |
| Owner question: "CAA pilot register links?" | No such register exists | Removed from Part 14 |
| All competitor URL/title claims from v2 | VERIFIED — patterns still live | Part 5 expanded with more competitors (The London Helicopter, Castle Air, Elite, Flying Pig) |
| HQ's RR300 Authorised Service Center status | VERIFIED (HeliHub 2019) | 6.11 lead differentiator; 6.1 positioning stack; Part 13 (i) |
| Founder 55-yr experience | VERIFIED (hqaviation.com) | 6.1 positioning stack; Part 13 (i) |
| HQ Aviation Ltd incorporation year | VERIFIED (Companies House 2011) | Part 13 (i) |

### Cross-references for new research citations

All source URLs are inline in the sections above. Master list: Robinson Helicopter Company, UK Civil Aviation Authority, Companies House, HeliHub, Vertical Mag, Flight Global, Google Search Central, schema.org, Whitespark, Sterling Sky, PPL Club, FLYER, Yorkshire Helicopters, competitor websites (Sloane, Heli Air, Europlane, ICE, Elstree, Helicopter Services, Heliserve, UKAS), and standard Wikipedia pages for verifiable aircraft specs.
