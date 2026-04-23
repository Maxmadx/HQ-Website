# HQ Aviation — Per-Page SEO Tuning (v2, research-grounded)

**Date:** 2026-04-23
**Status:** ⏸️ AWAITING OWNER APPROVAL — page edits in Tasks 17–19 cannot start until this is approved.

This v2 replaces v1 (archived at `per-page-tuning-v1-archived.md`). Recommendations below are grounded in actual SERP analysis (top-3 ranking competitors fetched and inspected) and Google's current published best-practice guidance, not opinion. Citations are inline.

---

## Customer profile (anchors all geographic decisions below)

**Helicopter ownership and training is a service people travel for** — buyers are HNW individuals + corporates whose home or office is anywhere from central London out to the M25–M40 wealth belt. *Denham itself has no meaningful customer base.* Geographic targeting accordingly:

1. **London** — primary anchor. Highest search volume + highest concentration of HNW buyers. Mayfair, Knightsbridge, Belgravia, Chelsea, Holland Park, Kensington, Hampstead, Highgate, St John's Wood, Notting Hill, Richmond, Chiswick.
2. **England / UK** — sales queries. Helicopter buyers shop nationally; the dealer's location matters less than the dealer's authorised status.
3. **Wealthy Home Counties commuter belt** — *the actual catchment for training, maintenance, trial lessons*. Listed by drive time from Denham:
   - **5–15 min:** Beaconsfield, Gerrards Cross, Chalfont St Giles, Stoke Poges, Burnham, Iver
   - **15–30 min:** Marlow, Cookham, Bourne End, Amersham, Chesham, Northwood, Chorleywood, Radlett, Rickmansworth, Watford, Slough, Maidenhead, Windsor, Eton
   - **30–45 min:** Henley-on-Thames, Reading (catchment edge), Cobham, Esher, Oxshott, Wentworth, Sunningdale, Ascot, Sunninghill, Richmond, Twickenham, Hampstead Garden Suburb
4. **Denham** — *trust signal in body content, not a primary keyword target*. Mention as the physical base, the catchment angle, and the local-pack/GBP anchor — but don't waste title real estate on it.

## What HQ already ranks for (defend, don't over-invest)

Pre-launch, Google already surfaces HQ Aviation for some queries:

- **#1 for "new helicopter dealer uk"** (defend — high-value)
- **#1 for "helicopter dealer near london"** (defend — high-value)
- **Page 1 for "ppl helicopter london"** (push to top 3 — high-value)
- **Page 1 for "robinson helicopter maintenance uk"** (push to top 3 — high-value)
- **#1 for "helicopter school denham"** (incidentally — low-volume hyper-local term, costs nothing to keep but not a strategic priority)

The job is partly **defensive** (don't break existing London/UK ranks) and partly **offensive** (new optimised landing pages where competitors only have homepages).

## The competitive landscape (from SERP research)

| Competitor | Base | Where they win |
|---|---|---|
| **Heli Air** (heliair.com) | High Wycombe + UK-wide | Sales queries (R44, R66, "robinson for sale uk") via `/product-category/` per-model pages, plus maintenance via long domain-authority |
| **Europlane Sales** (europlanesales.com) | Maidenhead | "Robinson R66 for sale UK", "R44 for sale UK" — wins via exact-match titles like *"Robinson R66 For Sale In The UK"* and per-variant pages (R44 Raven I and R44 Raven II as separate URLs) |
| **Sloane Helicopters** | Northampton | Sales queries via DA — appears even for "near london" despite 80mi distance |
| **ICE Helicopters** (icehelicopters.com) | Elstree | Training + trial lessons, partly via geo-specific inner pages like `/helicopter-trial-lessons-borehamwood-hertfordshire-essex/` |
| **Elstree Helicopters** | Elstree | "PPL helicopter london", "trial lessons" — pricing cards visible above fold |
| **Helicopter Services** (helicopterservices.co.uk) | White Waltham | "PPL helicopter london" with benefit-led H1 *"Fly helicopters privately with a PPL(H)"* |
| **Adventure001 / BuyAGift / IntoTheBlue / Trustpilot** | (aggregators) | "Helicopter experience london" — almost the entire SERP. Hard to crack without a commerce-style page |

**Strategic gap to exploit:** for the highest-intent training and maintenance queries, *almost no competitor has a dedicated, well-optimised inner landing page*. They mostly rank with homepages. HQ can win position #1 by simply shipping a focused, content-deep inner page where they only have a homepage.

---

## Critical fixes & follow-ups (do these before or alongside per-page edits)

These are derived from Google's current published guidance and apply *across* the site, not page-by-page. Some are bug fixes to code we've already shipped.

### 1. **BUG: `buildProduct()` uses `"price": "POA"` — Google rejects this**

Our shipped `buildProduct()` produces `priceSpecification: { "@type": "PriceSpecification", price: "POA" }`. Google's product structured-data validator requires a numeric value; a non-numeric string disqualifies the rich snippet.
*[Source: Google Search Central — Product Snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)*

**Fix:** rewrite `buildProduct()` so it can either (a) omit `Offer` entirely when no price is stated, or (b) emit `AggregateOffer` with `lowPrice`/`highPrice` if a range is known. Two options:

- **Aircraft pages (R22, R44, R66, R88):** omit `Offer`, rely on `aggregateRating` (if available) or just the basic Product fields. Eligibility for the Product rich snippet is preserved without a price.
- **If owner wants to publish guide ranges:** use `AggregateOffer` like `{lowPrice: 280000, highPrice: 350000, priceCurrency: "GBP"}`. Owner discretion.

I'll ship this fix as a small follow-on commit before Task 18 (aircraft pages).

### 2. **`buildCourse()` builder needed (training pages)**

Google supports `Course` schema for the course-list carousel rich result. Eligibility requires **at least 3 courses marked up site-wide**.
*[Source: Google Search Central — Course structured data](https://developers.google.com/search/docs/appearance/structured-data/course)*

PPL(H), CPL(H), Type Rating, and Trial Lesson together exceed the minimum. Ship a `buildCourse({name, description, provider, ...})` builder before Task 19 (training page edits).

**Note:** the older `CourseInfo` structured data was deprecated September 2025. Don't use it.
*[Source: Google Search Central — Course Info (deprecated)](https://developers.google.com/search/docs/appearance/structured-data/course-info)*

### 3. **AggregateRating must come from a third-party platform, not our own data**

Google explicitly disqualifies self-controlled review entities from star rich snippets. Embedding our own review widget and feeding the average into `AggregateRating` schema produces no stars and risks a manual action.
*[Source: Google Search Central — Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)*

**Fix:** wire Trustpilot or Google Reviews aggregate API into the schema (separate effort — out of Plan 1 scope, captured here so it's not silently skipped).

### 4. **Google Business Profile is the dominant local-pack lever (not the website)**

Whitespark's 2026 Local Search Ranking Factors report puts 8 of the top 10 local-pack ranking factors as GBP-driven, not website-driven. Primary GBP category is the single biggest signal.
*[Source: Whitespark — 2026 Local Search Ranking Factors](https://whitespark.ca/local-search-ranking-factors/)*

Sterling Sky's longitudinal testing also confirms GBP service-area settings have **no measurable ranking effect** — rankings snap to the verified physical address. So `areaServed` in JSON-LD is semantically correct but won't win local pack positions on its own.
*[Source: Sterling Sky — Does Service Area Impact Ranking?](https://www.sterlingsky.ca/does-the-service-area-in-google-my-business-impact-ranking/)*

**Action (separate to Plan 1, owner to do):** verify HQ Aviation's Google Business Profile, set primary category (probably "Helicopter charter" or "Aviation training school" — pick the dominant revenue use case), set complete hours, post regularly, request reviews from clients in different counties (these mention towns and build geo-relevance organically).

### 5. **YMYL classification — helicopter training is high-stakes content**

Google's Search Quality Rater Guidelines (Sept 2025) classify any topic affecting "physical safety" as YMYL. Aviation training qualifies. Pages will be evaluated against the **highest E-E-A-T standard**.
*[Source: Google Search Quality Rater Guidelines, Sept 2025](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)*

The single fastest lift: publish named instructor profiles linked to verifiable external entities (CAA pilot register lookup, LinkedIn). That's a separate page-build (out of Plan 1 scope), but every training page should reference *the existence* of named instructors with credentials.

---

## Per-page tuning

Title format reminder: the `<Seo>` component appends ` | HQ Aviation` automatically. Targets below are the prefix only — ≤45 chars to stay within Google's ~60-char SERP cap.

For each page I list: **target query · title · meta · H1 · schema · 3 key body sections to add or strengthen · evidence**.

---

### 1. Landing — `/`
**File:** `src/pages/Experimentation.jsx`
**Target query:** branded + "robinson helicopter dealer uk" / "robinson helicopters london"
**Title:** `Robinson Helicopters London · Sales · Training · Maintenance`
**Meta description:** `Authorised Robinson Helicopter dealer just outside London. New R22, R44, R66 and R88 sales UK-wide. PPL/CPL/type-rating training 30 minutes from central London — convenient from Mayfair, Chelsea, Cobham, Beaconsfield, Marlow. CAA Part-145 maintenance. Worldwide expeditions.`
**H1:** `HQ Aviation` *(brand-led; visual hero already carries this)*
**Schema (already wired site-wide):** Organization + WebSite + LocalBusiness
**Body sections to add or strengthen:**
- Short "What we do" text section listing the 4 services with one-line descriptions (Helpful Content signal — Google rewards content that lets users "learn enough to achieve their goal")
- "Robinson Authorised Dealer" badge with link to Robinson's own dealer verification page (verifiable trust signal — see Topic 3 best practices)
- "Serving London and the wealthy commuter belt — Mayfair, Chelsea, Hampstead, Cobham, Wentworth, Beaconsfield, Marlow, Henley, Ascot — plus all of Buckinghamshire, Hertfordshire, Berkshire, Surrey, Middlesex and Oxfordshire" line for geo-semantics + HNW signalling

**Evidence:** Heli Air's homepage ranks #1 for "robinson helicopter for sale uk" partly because their title ("Helicopter Sales - Heli Air - New and Used Robinson Helicopters, Bell Helicopters") explicitly names the OEM. We can mirror this, but our differentiator is *authorised* (Heli Air isn't).

---

### 2. Aircraft Sales overview — `/sales/new`
**File:** `src/pages/Sales.jsx`
**Target query:** `new robinson helicopter dealer uk` (HQ already #1 — defend) + `new robinson helicopters for sale uk`
**Title:** `New Robinson Helicopters For Sale · UK Authorised Dealer`
**Meta description:** `Order a new Robinson R22, R44 Raven II, R44 Cadet, R66 Turbine or R88 from the UK's authorised Robinson Helicopter Company dealer at Denham. Factory delivery, full warranty, parts on shelf, in-house maintenance.`
**H1:** `New Robinson Helicopters for Sale`
**Schema:** ItemList with each aircraft model as listItem + BreadcrumbList
**Body sections:**
- Comparison table: model · seats · cruise speed · range · typical use · indicative price band (numerical, used in `AggregateOffer`)
- "Authorised Dealer since [year]" + Robinson dealer-network link (Topic 3 trust signal)
- Trade-in / finance / delivery lead-time block

**Evidence:** Heli Air ranks for sales queries by having separate per-model categories. Europlane Sales ranks for `/aircraft-stock/.../robinson/` brand-filtered taxonomy. HQ's pattern of `/aircraft/r22|r44|r66|r88` is cleaner than either — focus the overview on *dealer authorisation* (the differentiator competitors lack).

---

### 3–6. Aircraft model pages — `/aircraft/r22|r44|r66|r88`
**Files:** `src/pages/AircraftR22.jsx`, `AircraftR44.jsx`, `AircraftR66.jsx`, `AircraftR88.jsx`
**Target query (R66 example):** `robinson r66 for sale uk` (Europlanesales currently #1)
**Title pattern:** `Robinson [Model] · For Sale UK · Authorised Dealer`

Per-page values (use as defaults, edit any):

| Model | Title | H1 |
|---|---|---|
| R22 | `Robinson R22 · For Sale UK · Authorised Dealer` | `Robinson R22` |
| R44 | `Robinson R44 Raven II · For Sale UK · Dealer` | `Robinson R44` |
| R66 | `Robinson R66 Turbine · For Sale UK · Dealer` | `Robinson R66 Turbine` |
| R88 | `Robinson R88 · 8-Seat Turbine · UK Dealer` | `Robinson R88` |

**Meta description (R66 example, adapt per model):** `Buy a new Robinson R66 Turbine — five-seat single-engine helicopter, Rolls-Royce RR300 engine — from the UK's authorised Robinson dealer at Denham. Factory delivery, warranty, in-house maintenance and type-rating training included.`

**Schema:**
- `Product` **without `Offer`** (until owner approves a price range) — see Critical Fix #1 above
- `BreadcrumbList`: Home → Aircraft Sales → [Model]
- Eventually `Course` (built in Critical Fix #2) for the type-rating course associated with each model

**Body sections to add or strengthen** (Topic 3 helpful-content guidance):
- **Operating economics block** — fuel burn, maintenance intervals, indicative running cost £/hr, insurance band. *This is original first-hand content competitors don't publish.* Major Helpful Content signal.
- **"What's included with a new HQ delivery"** — ferry to your base, type-rating credit, parts inventory access, first-year maintenance checks. Surfaces dealer differentiation.
- **Real-world use cases** — owner profiles, missions the model suits, charter potential. Counters generic spec-sheet content competitors rely on.

**Image SEO:** rename hero/gallery files to descriptive slugs (e.g. `robinson-r66-turbine-exterior-2025.jpg`), add `ImageObject` schema where practical. Aircraft sales is a visually-driven category; Google Images is a real referral source.
*[Source: Google Search Central — Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)*

**Evidence:** Europlanesales wins #1 for "Robinson R66 for sale UK" with the title `"Robinson R66 For Sale In The UK - Europlane Sales Ltd"` — exact match. We mirror that pattern (`Robinson R66 Turbine · For Sale UK · Dealer`) and add the "Authorised Dealer" angle they lack. Europlanesales also publishes R44 Raven I and R44 Raven II as separate URLs — opportunity for HQ as a future enhancement (out of Plan 1 scope: would need new routes).

---

### 7. PPL(H) Training — `/training/ppl`
**File:** `src/pages/FinalPPL.jsx`
**Target query:** `ppl helicopter london` (HQ already page 1 — climb to top 3)
**Title:** `PPL(H) Helicopter Pilot Training · London`
**Meta description:** `Earn your Private Pilot Licence (Helicopter) just outside London — 30 minutes from Mayfair, 15 from Beaconsfield, 35 from Cobham. CAA-approved Part-FCL Approved Training Organisation. R22 and R44 fleet, 45-hour syllabus, examiner-rated instructors.`
**H1:** `PPL(H) Helicopter Pilot Training in London`

**Schema:** `Course` (one entry — combined with R44 type-rating + CPL + trial lesson satisfies Google's 3-course minimum) + `FAQPage` (for AI Overview citation, NOT SERP rich snippets — see Critical Fix #2)

**Body sections to add or strengthen** (Topic 2 helpful-content guidance + YMYL E-E-A-T):
- **Transparent cost breakdown** — hourly aircraft rates, ground school, exam fees, CAA medical (~£190), skills test (~£300). Hiding price fails Helpful Content. *[Source: Google Helpful Content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)*
- **CAA Part-FCL ATO badge + ATO number** + link to CAA approved-organisation register. Single biggest E-E-A-T lift for YMYL content.
- **Named Chief Flying Instructor** with credentials and link to CAA pilot-licence register. *[Source: Google Search Quality Rater Guidelines, Sept 2025](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)*
- **"Convenient from…" geographic block** with drive times: 30 min from Mayfair / Chelsea, 35 from Cobham / Wentworth, 25 from Marlow / Henley, 15 from Beaconsfield / Gerrards Cross. Captures the HNW commuter-belt "near me" intent and signals you serve the right catchment.
- **FAQ block** answering "How long does PPL(H) take?", "How much does it cost?", "What aircraft will I train on?", "Where in London do students typically come from?" — self-contained, ≤300 words each, matches visible page text. (For AI Overviews per current FAQ schema policy.)

**Evidence:** Helicopterservices.co.uk wins `/training/private-pilot-licence` slot with benefit-led H1 *"Fly helicopters privately with a PPL(H)"* — softer angle than competitors' keyword-stuffed H1s. Elstree Helicopters wins partly via pricing cards above the fold. We can borrow both: a benefit-led H2/intro under the keyword H1, and visible cost transparency above the fold.

---

### 8. CPL(H) — `/training/commercial`
**File:** `src/pages/CPL.jsx`
**Target query:** `cpl helicopter training uk` + `commercial helicopter pilot training london`
**Title:** `CPL(H) Commercial Helicopter Training · London`
**Meta description:** `Train as a commercial helicopter pilot at Denham Aerodrome, just outside London. CAA-approved CPL(H) modular path from PPL through to ATPL. Examiner-rated instructors, R22/R44/R66 fleet, structured career mentoring.`
**H1:** `CPL(H) Commercial Helicopter Training`
**Schema:** `Course` + breadcrumb. (FAQPage if FAQ section exists.)
**Body sections:** career-path tree (PPL→hour-building→CPL→type-rating→first job); modular vs integrated comparison; named CPL outcomes (with permission); typical timeline + total cost band.

---

### 9. Type Rating — `/training/type-rating`
**File:** `src/pages/TypeRating.jsx`
**Target query:** `robinson type rating uk` / `r66 type rating uk` / `r44 type rating uk`
**Title:** `Robinson Type Ratings · R22 R44 R66 R88 · London`
**Meta description:** `Add a Robinson R22, R44, R66 or R88 type rating to your existing helicopter licence. CAA-approved type-rating training 30 minutes from central London — examiner-rated instructors, full conversion or differences training, recurrency available.`
**H1:** `Robinson Type Rating Training`
**Schema:** array of 4 `Course` entries (one per type) — these alone satisfy the 3-course minimum.
**Body sections:** matrix of types × course duration × prerequisites × indicative cost; recurrent/refresher schedule; "differences vs full type" decision aid.

---

### 10. Trial Lessons — `/training/trial-lessons`
**File:** `src/pages/DiscoveryFlight.jsx`
**Target query:** `helicopter experience london` (dominated by aggregators) + `helicopter trial lesson uk` (more winnable)
**Title:** `Helicopter Trial Lessons · London`
**Meta description:** `Take the controls of a real Robinson helicopter on a guided trial lesson just outside London — 30 minutes from Mayfair, easy from Cobham, Marlow, Beaconsfield. 30-minute or 60-minute options in R22, R44 or R66. Available daily. Gift vouchers redeemable any future date.`
**H1:** `Helicopter Trial Lessons`

**Schema:**
- `Service` (`serviceType: "Helicopter Trial Lesson"`)
- `Offer` per duration × aircraft combination — **populate `price` server-side from live Firestore prices** so JSON-LD always matches visible price (avoids Google validation error). Critical Fix #4 below.
- `AggregateRating` ONLY if Trustpilot/Google Reviews aggregate is wired (not our own data — see Critical Fix #3)
- `FAQPage` for AI Overview citation

**Body sections** (Topic 4 multi-intent guidance):
- **Dual hero CTA** — "Book for myself" / "Buy as a gift" (separates conversion funnels from the first scroll)
- **Gift voucher mechanics** — validity period, transferability, redemption process (gift buyers shop on these specifics)
- **What to expect** — duration, weight limits, what to wear, parking, photography, can family watch (all common pre-purchase concerns; resolves intent without forcing a phone call)
- **"Convenient from…" block** — drive times from Mayfair, Chelsea, Cobham, Wentworth, Beaconsfield, Marlow, Ascot, Henley, Richmond. Trial-lesson buyers are gift-givers in HNW areas — meeting them with their hometown by name signals the right audience match.

**URL note (out of Plan 1 scope):** Adding a separate page at `/helicopter-experience-london` with canonical pointing here would let HQ target both URL slugs. Worth a follow-up plan — `/helicopter-experience-london` exact-matches the dominant gift-market query but gift-buyers + experience-seekers also dominate the same SERP. *[Source: SERP research for Q4]*

**Evidence:** ICE Helicopters captures a secondary position with `/helicopter-trial-lessons-borehamwood-hertfordshire-essex/` — pure geo + service slug. Elite Helicopter Flights uses `/products/trial-helicopter-lesson-cabri-g2` (Shopify product URL) for commerce-style conversion. We don't need their slug today, but matching their *intent serving* (book + gift + spec selector) is critical.

---

### 11. Maintenance — `/maintenance`
**File:** `src/pages/FinalMaintenance.jsx`
**Target query:** `robinson helicopter maintenance uk` (HQ already page 1)
**Title:** `Robinson Helicopter Maintenance · UK · CAA Part-145`
**Meta description:** `Robinson Helicopter Company Authorised Service Center near London. CAA Part-145 [number]. Routine inspections, scheduled maintenance, 12-year overhauls, AOG response across the south-east. R22, R44, R66 and R88. Pickup and ferry available UK-wide.`
**H1:** `Robinson Helicopter Maintenance & Overhauls`
**Schema:** `Service` (`serviceType: "Helicopter Maintenance"`) + `FAQPage` (AI Overview)
**Body sections:**
- **Maintenance schedule per type** (50hr / 100hr / annual / 12-year) — calendar/visual block
- **Indicative cost transparency** for inspection categories. Owners search on cost; the page that answers wins.
- **CAA Part-145 number + Robinson Authorised Service Center badge** — both link to verifiable external sources. Major trust signal.
- **Service catchment block** — owner-pilots based at Fairoaks, White Waltham, Wycombe Air Park, Stapleford, Elstree, Goodwood etc. Pickup and ferry available across the south-east. Names the airfields where target customers actually base their aircraft (much higher signal than naming towns for this audience).

**Evidence:** Heli Air ranks for this query with `/helicopter-maintenance-2/` — title `"Helicopter Maintenance - Robinson, Bell, Airbus - CAMO & P145"`. The `-2` suffix is technical-debt hangover from URL migration; their slug hygiene is poor. HQ's clean `/maintenance` slug + Part-145 + Authorised Service Center claim is structurally stronger.

---

### 12. Contact — `/contact`
**File:** `src/pages/Contact.jsx`
**Target query:** branded + `denham aerodrome helicopter` / `helicopter dealer near me` (the latter is a GBP query, not website-driven)
**Title:** `Contact HQ Aviation · Denham Aerodrome (UB9 5DF)`
**Meta description:** `Visit HQ Aviation at Denham Aerodrome (UB9 5DF), 30 minutes from central London via the M40 or M25. Operations: +44 1895 833373. Maintenance: +44 1895 832833. Open Mon–Sun 08:30–17:00. Email Operations@HQAviation.com.`
**H1:** `Contact us`
**Schema:** richer `LocalBusiness` with full `contactPoint` array (already in `seoDefaults.CONTACT_POINTS`)
**Body sections:**
- Driving directions (M40 J1 / M25 J16 / A40), nearest station (Denham railway), satnav coordinates
- "Who to call" matrix — Sales / Training / Maintenance / General with the right number for each
- Map embed + parking + on-site facilities

**Reminder:** local pack rankings will be 80%+ driven by Google Business Profile setup, not this page. See Critical Fix #4.

---

### 13. Expeditions — `/expeditions` *(bonus)*
**File:** `src/pages/FinalExpeditions.jsx`
**Target query:** `helicopter expeditions` (low competition, easy ranking win)
**Title:** `Worldwide Helicopter Expeditions · UK`
**Meta description:** `Multi-day, long-range helicopter expeditions led by HQ Aviation pilots. Cross-Channel, cross-continent, and bespoke routes for owner-pilots and charter clients. Itinerary planning, fuel logistics, customs handling — fully managed.`
**H1:** `Helicopter Expeditions`
**Schema:** `Service` + (optional) `Event` per planned expedition trip
**Body sections:** past expedition case studies with maps; routing capabilities; "what's included" service tier; bespoke quote process.

---

## Summary of follow-on work this surfaces (not in Plan 1)

These are real items that should be tracked but aren't blocking Plan 1's launch:

1. **Fix `buildProduct()` to handle missing/range pricing** (small follow-on commit before Task 18 — I'll do this in the same window)
2. **Add `buildCourse()` builder** (small follow-on commit before Task 19 — I'll do this too)
3. **Wire third-party reviews aggregate** for `AggregateRating` (Trustpilot/Google Reviews API — separate plan)
4. **Set up Google Business Profile properly** with primary category, complete sections, posts schedule (owner action — separate to website work; I can write a setup guide)
5. **Build a `/helicopter-experience-london` URL** to capture the dominant gift-market query (separate plan)
6. **Build a `/instructors` page** with named instructors + CAA register links (E-E-A-T lift; separate plan)
7. **Image filename audit + `ImageObject` schema** for aircraft images (Google Images traffic; separate plan)

---

## Authority signals to gather (owner action — needed before page-edit values are final)

These appear as `[number]` / `[year]` placeholders in titles and meta descriptions above. Provide values before approval, or I'll omit them rather than ship `[?]`:

- [ ] **CAA Part-FCL Approved Training Organisation number** — appears on training pages
- [ ] **CAA Part-145 Approved Maintenance Organisation number** — appears on /maintenance
- [ ] **Year HQ Aviation was established / authorised by Robinson** — appears on /sales/new + landing
- [ ] **Trustpilot or Google Reviews aggregate URL** — needed before any star ratings appear
- [ ] **R88 expected first UK delivery window** — appears on /aircraft/r88

---

## Owner approval

Mark one:

- [ ] **Approved as-is** — proceed with Tasks 17–19. I'll ship the two builder fixes (Critical Fix #1 + #2) as small commits ahead of the page edits, and omit any `[bracketed]` placeholders that don't have values yet.
- [ ] **Approved with edits** — edit titles/meta inline above, mark this checkbox, tell me to proceed.
- [ ] **Needs further work** — note below.

Notes:
> _(owner: any wording changes, or any of the bracketed placeholders to fill)_
