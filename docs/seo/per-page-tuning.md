# HQ Aviation — Per-Page SEO Tuning Proposals

**Date:** 2026-04-23
**Status:** ⏸️ AWAITING OWNER APPROVAL — page edits in Tasks 17–19 cannot start until this is approved.

This document is the **opinionated SEO playbook** for HQ Aviation's launch. It goes beyond per-page meta to define keyword strategy, geographic targeting, authority signals, schema augmentation, and topic clusters. Read the strategy preamble first — it explains the philosophy behind every page recommendation.

---

# Part 1 — Strategy preamble (read first)

## Goal

Capture every realistic search query that could put a buyer, student, or maintenance customer in front of HQ Aviation. Win the local pack for London + neighbouring counties. Build topical authority around Robinson helicopters in the UK so Google treats hqaviation.com as the canonical source.

## Three search-intent buckets every page should serve

| Intent | What the searcher wants | HQ pages best suited |
|--------|-------------------------|----------------------|
| **Transactional** | "buy / book / get a quote NOW" | Aircraft model pages, trial lessons, contact |
| **Commercial investigation** | "compare options before deciding" | Sales overview, training overview, maintenance |
| **Informational** | "answer my question / teach me" | Blog posts, FAQ sections inside pages |

A page that targets only one intent leaves traffic on the table. The strongest pages serve a primary intent in the H1/H2/CTA structure but capture adjacent informational queries via FAQ schema or in-page "What is…" sections.

## Geographic targeting framework

Three layers, applied in this order on every page where geography matters:

1. **Anchor: London.** Every training, maintenance, contact, and trial-lesson page leads with London, not Denham. People search "helicopter X London" 10–50× more than "helicopter X Denham". *They'll learn it's at Denham once they click.*
2. **Reinforce: counties.** Buckinghamshire, Hertfordshire, Berkshire, Surrey, Middlesex, Oxfordshire — woven into body copy so Google sees the wider catchment.
3. **Texture: nearby towns.** Uxbridge, Gerrards Cross, Beaconsfield, Watford, Slough, High Wycombe, Amersham, Chesham, Heathrow, Windsor, Marlow, Henley-on-Thames, Reading, Maidenhead. These appear in body copy + image alt text + FAQ answers, not in titles.

Already in JSON-LD via `AREA_SERVED`. Body copy needs to mirror it.

## Authority signals to weave into every relevant page

These are E-A-T (Expertise / Authoritativeness / Trust) signals — Google's biggest ranking factor for high-stakes queries (aviation training is high-stakes).

- **CAA Part-FCL Approved Training Organisation** (training pages) — provide ATO number if available
- **CAA Part-145 Approved Maintenance Organisation #[number]** (maintenance page) — number is mandatory
- **Robinson Helicopter Company Authorised Dealer** (sales + aircraft pages)
- **Robinson Helicopter Company Authorised Service Center** (maintenance page)
- **Years established** — "Since [year]" everywhere appropriate
- **Pilots trained / aircraft sold / hours flown** — concrete numbers if known
- **Notable instructors / examiners on staff** — Person schema for each (separate task — see appendix)
- **Insurance / safety record** — if positive, surface it

> **OWNER ACTION:** Confirm or correct the bracketed values above. They appear repeatedly in the per-page recommendations. *(Where I write `[CAA #?]` etc. below, that's where to drop them in.)*

## Differentiation hooks (vs Heli Air, Helicopter Centre, Helicopters of Hampshire, etc.)

These are angles to lean into in body copy across multiple pages:

- **Authorised Robinson dealer** — most schools aren't dealers. This means new aircraft, factory training, parts-on-shelf
- **All four Robinson types under one roof** (R22, R44, R66, R88) — most competitors miss at least one
- **Maintenance + sales + training + expeditions in one place** — Heli Air and Helicopter Centre split these; HQ is the one-stop offer
- **Denham Aerodrome location** — quietest controlled airfield near London, no slot constraints, no Heathrow noise abatement (vs e.g. Goodwood, Fairoaks)
- **Genuine ferry/expedition operation** — proves operational seriousness vs schools that only fly local circuits

---

# Part 2 — Per-page tuning (top 12 + bonus)

For each: **search intent · primary keyword · secondary keywords · long-tail · title · description · H1 · H2 questions for featured snippets · JSON-LD beyond baseline · internal links · body angle**.

Title format reminder: `<Seo>` appends ` | HQ Aviation` automatically. Targets below are the prefix only — keep ≤45 chars.

---

## 1. Landing — `/`
**File:** `src/pages/Experimentation.jsx`
**Search intent:** branded ("HQ Aviation") + top-of-funnel discovery ("helicopter london", "robinson dealer uk") + service-curious ("learn to fly helicopter london")
**Primary keyword:** `robinson helicopters london`
**Secondary:** `helicopter dealer uk`, `helicopter school london`, `helicopter training london`, `helicopter maintenance london`, `denham helicopter`
**Long-tail:** `where can I buy a robinson helicopter in the UK`, `is there a helicopter school near london`, `how do I become a helicopter pilot in london`

**Title:** `Robinson Helicopters London · Sales · Training · Maintenance`
**Description:** `UK's authorised Robinson Helicopter dealer at Denham, 30 minutes from central London. New R22, R44, R66 and R88 sales. PPL/CPL/type-rating training. CAA Part-145 maintenance. Worldwide expeditions.`
**H1 (suggest):** `HQ Aviation` *(brand-led — the visual hero already carries this; add a tagline subhead like "Robinson Helicopters · London")*

**H2 questions for featured snippets** (work into body content):
- "What does HQ Aviation do?"
- "Where is HQ Aviation based?"
- "How long does it take to fly to central London from Denham?"

**JSON-LD beyond baseline (already gets Org+WebSite+LocalBusiness site-wide):**
- Add `Service` blocks for the four primary services with `serviceType` values: "Aircraft Sales", "Pilot Training", "Aircraft Maintenance", "Helicopter Expeditions"

**Internal links to add (if not present):**
- → `/sales/new` ("Browse new Robinson aircraft")
- → `/training/ppl` ("Earn your PPL(H) in London")
- → `/maintenance` ("Robinson maintenance and overhauls")
- → `/training/trial-lessons` ("Take a trial helicopter lesson")
- → `/blog` ("Latest from the hangar")
- → `/contact` ("Visit us at Denham Aerodrome")

**Body angle:** the landing already exists and looks great visually — recommendation is to add a small "What we do" text section (good for SEO, low visual cost) that lists the four services with one-line descriptions and the four geographic anchors (London, Bucks, Herts, Berks).

---

## 2. Aircraft Sales overview — `/sales/new`
**File:** `src/pages/Sales.jsx`
**Search intent:** commercial investigation — comparing models or evaluating dealers
**Primary keyword:** `new robinson helicopters for sale uk`
**Secondary:** `buy a robinson helicopter uk`, `robinson dealer london`, `robinson helicopter sales`, `private helicopter for sale uk`, `new helicopter prices uk`
**Long-tail:** `how much does a new robinson helicopter cost uk`, `where to buy a new robinson r66 in the UK`, `robinson dealer near london`, `best new helicopter under £1m`

**Title:** `New Robinson Helicopters for Sale · UK Dealer`
**Description:** `Order a new Robinson R22, R44 Cadet, R44 Raven II, R66 Turbine or R88 from the UK's authorised Robinson dealer. Factory delivery to Denham, full warranty, parts on shelf, in-house maintenance and type-rating training. Speak to our sales team.`
**H1:** `New Robinson Helicopters for Sale`

**H2 questions:**
- "Which Robinson helicopter is right for me?"
- "How long is the delivery lead time?"
- "What's included with a new Robinson?"
- "Can I trade in my current helicopter?"

**JSON-LD beyond baseline:**
- `ItemList` with each aircraft model as a list item linking to its page
- `BreadcrumbList`

**Internal links:**
- → each aircraft model page (`/aircraft/r22|r44|r66|r88|h500`)
- → `/sales/pre-owned` ("Pre-owned aircraft inventory")
- → `/sales/rebuilds` ("Factory rebuilds")
- → `/maintenance` ("Continuing maintenance support")
- → `/training/type-rating` ("Type-rating training included")
- → `/contact` ("Speak to a sales consultant")

**Body angle:** lead with the dealer credential ("HQ Aviation is the UK's authorised Robinson Helicopter dealer"). Comparison table: Range / seats / price / typical use. Tradein/finance call-out. Lead-time chart per model.

---

## 3. Robinson R22 — `/aircraft/r22`
**File:** `src/pages/AircraftR22.jsx`
**Search intent:** commercial investigation (specs, price, training value) + transactional (buying one)
**Primary keyword:** `robinson r22 for sale uk`
**Secondary:** `robinson r22 price`, `r22 helicopter training`, `two-seat helicopter`, `new robinson r22 uk`, `r22 cost uk`
**Long-tail:** `how much does a new robinson r22 cost`, `is the r22 a good first helicopter`, `r22 vs cabri g2`, `r22 maintenance cost per hour`, `r22 hourly running cost uk`

**Title:** `Robinson R22 · New Aircraft Sales UK`
**Description:** `Buy a new Robinson R22 — the world's most popular training helicopter — from the UK's authorised Robinson dealer at Denham. Factory delivery, full warranty, type-rating training included. Two-seat piston, 122 mph cruise, 124 nm range.`
**H1:** `Robinson R22`

**H2 questions:**
- "How much does a Robinson R22 cost?"
- "Is the R22 hard to fly?"
- "What can I use the R22 for?"
- "What's included with a new R22?"
- "How long until I can take delivery of an R22?"

**JSON-LD beyond baseline (Plan already wires Product + Breadcrumb):**
- Add `Course` schema declaring this aircraft as the basis for a PPL(H) training course (`provider: HQAviation`, `educationalLevel: 'PPL(H)'`)
- Add `AggregateRating` if/when reviews are available

**Internal links:**
- → `/training/ppl` ("R22 is the standard PPL(H) trainer")
- → `/training/type-rating` ("R22 type-rating")
- → `/maintenance` ("R22 maintenance")
- → `/sales/pre-owned` ("Used R22s for sale")
- → `/aircraft/r44` ("Stepping up to the R44")
- → `/blog` ("R22 buyer's guide" — link to future blog post)

**Body angle:** specs table (seats, MTOW, fuel burn, cruise, range, ceiling); typical use cases; cost-per-hour breakdown; "what to expect" walkthrough; finance/leasing options.

---

## 4. Robinson R44 — `/aircraft/r44`
**File:** `src/pages/AircraftR44.jsx`
**Search intent:** commercial investigation + transactional (the most "popular owner-pilot" model)
**Primary keyword:** `robinson r44 for sale uk`
**Secondary:** `robinson r44 raven ii`, `robinson r44 cadet`, `four-seat helicopter`, `new r44 price uk`, `r44 dealer london`
**Long-tail:** `r44 raven ii vs cadet`, `how much does a new r44 cost`, `r44 fuel consumption`, `is the r44 worth it`, `r44 hourly cost uk`, `r44 vs bell jetranger`

**Title:** `Robinson R44 Raven II · New Sales UK`
**Description:** `Buy a new Robinson R44 Raven II or R44 Cadet from the UK's authorised Robinson dealer at Denham. Four-seat piston helicopter, 130 mph cruise, 348 nm range. Factory delivery, warranty, parts on shelf, in-house maintenance.`
**H1:** `Robinson R44`

**H2 questions:**
- "What's the difference between the Raven II and the Cadet?"
- "How much does a new Robinson R44 cost?"
- "How far can the R44 fly?"
- "What's the running cost per hour?"
- "Can the R44 carry four adults plus baggage?"

**JSON-LD beyond baseline:**
- `Product` (already in Plan) — add the `aggregateRating` slot if reviews exist
- `Course` for R44 type-rating

**Internal links:**
- → `/training/type-rating` ("R44 type-rating training")
- → `/maintenance`
- → `/sales/pre-owned`
- → `/aircraft/r22` ("Trained in the R22? Step up here")
- → `/aircraft/r66` ("Considering turbine? Compare with R66")
- → `/expeditions` ("R44 capability for long trips")

**Body angle:** Raven II vs Cadet comparison block (the #1 question buyers ask); operating-cost calculator; finance options; recent R44 deliveries gallery.

---

## 5. Robinson R66 — `/aircraft/r66`
**File:** `src/pages/AircraftR66.jsx`
**Search intent:** premium-buyer commercial investigation; high-value transactional
**Primary keyword:** `robinson r66 for sale uk`
**Secondary:** `robinson r66 turbine`, `five-seat turbine helicopter`, `r66 price uk`, `new r66 dealer london`, `rolls royce rr300 helicopter`
**Long-tail:** `how much does a robinson r66 cost`, `r66 vs jet ranger`, `r66 fuel burn`, `r66 hot and high performance`, `r66 vs h125`, `r66 cabin size`, `is the r66 worth the money`

**Title:** `Robinson R66 Turbine · New Sales UK`
**Description:** `Buy a new Robinson R66 Turbine — five-seat single-engine helicopter with Rolls-Royce RR300 — from the UK's authorised Robinson dealer at Denham. 120 kt cruise, 350 nm range, IFR-capable, factory delivery, warranty, in-house support.`
**H1:** `Robinson R66 Turbine`

**H2 questions:**
- "How much does a Robinson R66 cost?"
- "Is the R66 IFR-certified?"
- "What's the R66's hot-and-high performance?"
- "How does the R66 compare to a Bell 206?"
- "What's the cargo hook capacity?"
- "Can the R66 cross the Channel?"

**JSON-LD beyond baseline:**
- `Course` for R66 type-rating
- Optional `Product` `additionalProperty` blocks for technical specs (cruise speed, range, max gross weight) — Google parses these for rich card display

**Internal links:**
- → `/training/type-rating` ("R66 type-rating — the natural turbine step")
- → `/maintenance` ("R66 turbine maintenance")
- → `/expeditions` ("R66 — our preferred expedition aircraft")
- → `/contact`
- → `/aircraft/r44` ("Coming from the R44")
- → `/aircraft/r88` ("Considering twin-pilot ops? See the R88")

**Body angle:** turbine economics vs piston (eye-opening for first-time turbine buyers); IFR capability; cargo hook + cargo door + EMS roles; expedition track record.

---

## 6. Robinson R88 — `/aircraft/r88`
**File:** `src/pages/AircraftR88.jsx`
**Search intent:** very early — almost no UK-specific volume yet (R88 is new); chance to OWN this term
**Primary keyword:** `robinson r88`
**Secondary:** `robinson r88 turbine`, `eight-seat helicopter`, `new robinson helicopter 2026`, `robinson r88 price`, `r88 dealer uk`
**Long-tail:** `when is the robinson r88 available`, `robinson r88 specs`, `r88 vs h130`, `eight seat single engine helicopter`, `robinson r88 first delivery uk`

**Title:** `Robinson R88 · Eight-Seat Turbine — UK Dealer`
**Description:** `Reserve a Robinson R88 — the all-new eight-seat single-engine turbine — through the UK's authorised Robinson dealer at Denham. Pre-order now for early-window delivery slots. Specs, pricing and order process below.`
**H1:** `Robinson R88`

**H2 questions:**
- "When will the Robinson R88 be available?"
- "How much will the R88 cost?"
- "What engine does the R88 use?"
- "How does the R88 compare to the H130?"
- "Can I reserve a delivery slot now?"

**JSON-LD beyond baseline:**
- `Product` (already in Plan)
- `Offer` with `availability: 'PreOrder'` while pre-launch
- `Event` for any planned R88 introduction days/expos

**Internal links:**
- → `/sales/new` ("All new aircraft")
- → `/contact` ("Reserve a delivery slot")
- → `/aircraft/r66` ("Until R88 ships, the R66")
- → `/maintenance`

**Body angle:** "first to know" reservation pitch; spec preview; comparison vs Airbus H130 (the closest competitor); waiting-list mechanism.

---

## 7. PPL(H) Training — `/training/ppl`
**File:** `src/pages/FinalPPL.jsx`
**Search intent:** **massive volume + high commercial intent**. Mix of research ("how do I become a helicopter pilot") and buying ("ppl helicopter london")
**Primary keyword:** `ppl helicopter london`
**Secondary:** `ppl(h) london`, `helicopter pilot training london`, `learn to fly a helicopter london`, `private pilot licence helicopter`, `helicopter flight school london`, `helicopter flying lessons uk`, `helicopter school near london`
**Long-tail:** `how to become a helicopter pilot uk`, `how much does a helicopter ppl cost`, `how long does helicopter ppl take`, `ppl(h) syllabus uk`, `easiest helicopter to train in`, `helicopter pilot training near me`, `is helicopter ppl worth it`, `cheapest helicopter ppl uk`

**Title:** `PPL Helicopter Training · London`
**Description:** `Earn your Private Pilot Licence (Helicopter) at Denham Aerodrome — 30 minutes from central London. CAA-approved Part-FCL training organisation. R22 and R44 fleet, structured 45-hour syllabus, examiner-rated instructors. Trial lessons available.`
**H1:** `Private Pilot Licence (Helicopter)`

**H2 questions** *(each one captures a distinct featured-snippet opportunity)*:
- "How long does it take to get a helicopter PPL?"
- "How much does a helicopter PPL cost in the UK?"
- "What's the minimum age for a PPL(H)?"
- "Do I need any prior flying experience?"
- "What aircraft will I train on?"
- "What can I do once I have my PPL(H)?"
- "Where in London can I learn to fly a helicopter?"
- "Is the R22 the right aircraft to learn in?"

**JSON-LD beyond baseline (Plan adds FAQPage):**
- `Course` schema with `provider`, `educationalLevel: 'PPL(H)'`, `teaches`, `timeRequired`, `occupationalCredentialAwarded`, `courseMode: 'in-person'`, `instructor` array
- `Service` schema for "Pilot Training"
- `Person` schema for each named instructor (E-A-T signal — see appendix)
- `Place` schema linking to Denham Aerodrome

**Internal links:**
- → `/training/trial-lessons` ("Try a trial lesson before committing")
- → `/aircraft/r22` ("The aircraft you'll train on")
- → `/aircraft/r44` ("Step up to the R44")
- → `/training/commercial` ("Continuing to commercial?")
- → `/maintenance` ("Where the training fleet is maintained")
- → `/blog` ("PPL cost guide" — link future blog post)
- → `/contact` ("Book a discovery flight")

**Body angle:** detailed syllabus breakdown (45 hours minimum, ground school, exams); cost transparency (pull live data from Firestore `pricing` if practical, otherwise "from £XXX/hr"); instructor profiles (Person schema); typical timeline ("most students complete in 6–12 months at one lesson per week"); financing options; what you can do post-PPL (private flying, hour-building toward commercial). Address the price honestly — students search for cost and the page that answers wins.

---

## 8. Commercial Pilot Licence — `/training/commercial`
**File:** `src/pages/CPL.jsx`
**Search intent:** career-focused; people researching becoming professional helicopter pilots
**Primary keyword:** `cpl helicopter training uk`
**Secondary:** `commercial helicopter pilot training london`, `cpl(h) london`, `become a commercial helicopter pilot uk`, `helicopter career training`, `helicopter ATPL uk`, `professional pilot training helicopter`
**Long-tail:** `how to become a commercial helicopter pilot uk`, `cpl(h) cost uk`, `modular vs integrated cpl helicopter`, `cpl(h) requirements`, `commercial helicopter pilot salary uk`, `how long from ppl to cpl`, `helicopter pilot career path`, `military to civilian helicopter conversion`

**Title:** `CPL(H) · Commercial Helicopter Training`
**Description:** `Train as a commercial helicopter pilot at Denham Aerodrome, just outside London. CAA-approved CPL(H) modular path from PPL through CPL and beyond. Examiner-rated instructors, R22/R44/R66 fleet, career mentoring included.`
**H1:** `Commercial Pilot Licence (H)`

**H2 questions:**
- "What's the difference between PPL and CPL?"
- "How much does CPL(H) cost?"
- "How long does CPL(H) training take?"
- "Modular vs integrated — which is right for me?"
- "What jobs can I do with a CPL(H)?"
- "What's the typical commercial helicopter pilot salary?"
- "Can I convert my military rating?"

**JSON-LD beyond baseline:**
- `Course` with `educationalLevel: 'CPL(H)'`, `occupationalCategory` array (commercial pilot SOC codes)
- `Service` for "Commercial Pilot Training"
- `Person` for instructors
- `JobPosting`-adjacent content (career outcomes — informational, not actual job postings)

**Internal links:**
- → `/training/ppl` ("Start with a PPL(H)")
- → `/training/type-rating` ("Type ratings as part of the path")
- → `/training/advanced` ("Advanced training modules")
- → `/superyacht-ops` ("Superyacht as a career path")
- → `/pilot-provisioning` ("Pilot placement service")
- → `/blog` ("CPL career outcomes" — future blog post)

**Body angle:** career-path tree (PPL → hour building → CPL → type rating → first job); modular vs integrated comparison; typical timeline + cost (be specific); recent student outcomes (with permission); military-to-civilian conversion path.

---

## 9. Type Rating — `/training/type-rating`
**File:** `src/pages/TypeRating.jsx`
**Search intent:** existing pilots adding capability to their licence
**Primary keyword:** `robinson type rating london`
**Secondary:** `r44 type rating uk`, `r66 type rating uk`, `r22 type rating`, `helicopter type conversion london`, `r88 type rating`
**Long-tail:** `how long is r66 type rating`, `r44 to r66 conversion course`, `robinson type rating cost uk`, `do I need a type rating for a robinson`, `type rating recurrent training`, `helicopter type conversion near london`

**Title:** `Robinson Type Rating · R22 R44 R66 R88`
**Description:** `Add a Robinson R22, R44, R66 or R88 type rating to your existing helicopter licence. CAA-approved type-rating training at Denham Aerodrome — examiner-rated instructors, full conversion course or differences training, recurrency available.`
**H1:** `Robinson Type Ratings`

**H2 questions:**
- "Which Robinson types need a type rating?"
- "How long does an R66 type rating take?"
- "How much does R44 type rating cost?"
- "Is differences training enough or do I need a full type rating?"
- "Do I need recurrent training every year?"

**JSON-LD beyond baseline:**
- `Course` per type rating offered (4 separate Course objects in array — R22, R44, R66, R88) — each with own duration, prerequisites, occupationalCredentialAwarded

**Internal links:**
- → `/aircraft/r22|r44|r66|r88` (one per type listed)
- → `/training/ppl` ("Need a PPL first?")
- → `/training/commercial`
- → `/contact`

**Body angle:** matrix of types × course length × cost × prerequisites; recurrent training schedule; "do I need this?" decision tree.

---

## 10. Trial Lessons / Discovery Flights — `/training/trial-lessons`
**File:** `src/pages/DiscoveryFlight.jsx`
**Search intent:** **THREE distinct intents on one page** — needs to win all three:
1. Aspiring pilots ("first helicopter lesson")
2. Gift buyers ("helicopter experience gift london")
3. Bucket list / one-off thrill ("fly a helicopter london")

**Primary keyword:** `helicopter experience london` *(highest commercial intent + highest volume of the three)*
**Secondary:** `helicopter trial lesson london`, `fly a helicopter london`, `helicopter taster lesson`, `discovery helicopter flight uk`, `first helicopter lesson`, `helicopter introductory flight`, `take the controls helicopter`
**Long-tail:** `where can i fly a helicopter near london`, `helicopter experience near me`, `helicopter gift voucher london`, `what to expect on a helicopter trial lesson`, `is a helicopter trial flight worth it`, `helicopter experience for two people`, `30 minute helicopter lesson cost`, `60 minute helicopter lesson london`, `r22 vs r44 trial lesson`, `helicopter experience day denham`

**Title:** `Helicopter Experience · London`
**Description:** `Take the controls of a real Robinson helicopter on a guided trial lesson at Denham Aerodrome, just outside London. 30-minute or 60-minute options in R22, R44 or R66. Available daily, gift vouchers redeemable any date. Live pricing and booking on the page.`
**H1:** `Helicopter Trial Lessons`

**H2 questions** *(each captures a separate searcher mindset)*:
- "What is a helicopter trial lesson?"
- "How long is the lesson?"
- "Do I need any flying experience?"
- "What aircraft can I choose?"
- "Can I buy this as a gift?"
- "Where exactly is the lesson?"
- "Will I actually fly the helicopter?"
- "Is there a weight limit?"
- "What's included in the price?"
- "Can I bring family or friends to watch?"

**JSON-LD beyond baseline:**
- `Service` with `serviceType: 'Helicopter Trial Lesson'`
- `Offer` array — one per duration × aircraft combination, with `priceCurrency: 'GBP'`, `availability: 'InStock'` (price values pulled from live data — leave abstract `priceSpecification` if not known at build time)
- `AggregateRating` if reviews exist (huge for this page — gift buyers shop on reviews)
- `FAQPage` populated from the H2 questions above

**Internal links:**
- → `/training/ppl` ("Liked it? Continue to a full PPL(H)")
- → `/helicopter-tour-of-london` ("Or take a London helicopter tour")
- → `/aircraft/r22|r44|r66` ("Choose your aircraft")
- → `/contact` ("Buy a gift voucher")

**Body angle:** the gift-voucher angle is huge — explicit "buy as gift" CTA, voucher validity period, dietary/medical considerations, weight limits, what to wear, how long to allow, where to park, photography rules. **This page is a conversion goldmine if optimised — most competitors have generic copy.**

**URL note (consider for the future, NOT in this plan):** `/helicopter-experience-london` would beat `/training/trial-lessons` for the dominant search term. Adding it as a SECOND landing page with canonical pointing to `/training/trial-lessons` would let you target both URL slugs. Out of Plan 1 scope but worth a follow-up plan.

---

## 11. Maintenance — `/maintenance`
**File:** `src/pages/FinalMaintenance.jsx`
**Search intent:** owner-pilots looking for a service centre — low volume but high intent and high £/customer
**Primary keyword:** `robinson helicopter maintenance uk`
**Secondary:** `helicopter maintenance london`, `robinson service centre uk`, `part-145 helicopter maintenance`, `helicopter overhaul uk`, `robinson authorised service center`, `helicopter 100 hour inspection`
**Long-tail:** `where to service a robinson helicopter uk`, `robinson 100 hour inspection cost`, `robinson 12 year overhaul`, `helicopter annual inspection london`, `robinson service centre denham`, `helicopter mechanic near london`, `r44 50 hour inspection`, `r66 turbine maintenance`

**Title:** `Robinson Helicopter Maintenance · London`
**Description:** `Robinson Helicopter Company Authorised Service Center at Denham Aerodrome. CAA Part-145 #[?]. Routine inspections, scheduled maintenance, 12-year overhauls, AOG response. R22, R44, R66 and R88. Pickup and ferry available.`
**H1:** `Robinson Helicopter Maintenance & Overhauls`

**H2 questions:**
- "What maintenance does my Robinson need?"
- "How much does a 100-hour inspection cost?"
- "What's involved in the 12-year overhaul?"
- "Do you offer AOG support?"
- "Can you collect the aircraft?"
- "Are you a Robinson Authorised Service Center?"

**JSON-LD beyond baseline:**
- `Service` with `serviceType: 'Aircraft Maintenance'`, `provider: HQAviation`, `areaServed: AREA_SERVED`
- `Organization` `additionalType: ['MaintenanceOrganization']`
- The Plan's FAQPage from the H2 questions

**Internal links:**
- → `/parts` ("Genuine Robinson parts")
- → `/sales/new` ("Plan your next helicopter")
- → `/contact` ("Book maintenance")
- → `/aircraft/r22|r44|r66|r88` (one per type)

**Body angle:** maintenance schedule per type (calendar view); typical inspection costs (be transparent — owners shop on this); 100-hour vs annual breakdown; 12-year overhaul process; AOG response time guarantee; pickup/ferry service area (matches AREA_SERVED).

---

## 12. Contact — `/contact`
**File:** `src/pages/Contact.jsx`
**Search intent:** mostly navigational (people who already know HQ Aviation) + local search ("helicopter dealer near me", "helicopter school denham")
**Primary keyword:** `hq aviation contact`
**Secondary:** `helicopter dealer london contact`, `helicopter school denham contact`, `robinson dealer near me`, `denham aerodrome helicopter`
**Long-tail:** `how to get to denham aerodrome`, `denham aerodrome address`, `denham aerodrome postcode`, `helicopter school near uxbridge`, `robinson dealer near london`

**Title:** `Contact HQ Aviation · Denham Aerodrome`
**Description:** `Visit HQ Aviation at Denham Aerodrome (UB9 5DF), just 30 minutes from central London via the M40 or M25. Operations: +44 1895 833373. Maintenance: +44 1895 832833. Open Mon–Sun 08:30–17:00. Email Operations@HQAviation.com.`
**H1:** `Contact us`

**H2 questions:**
- "Where is HQ Aviation?"
- "How do I get to Denham Aerodrome?"
- "What are your opening hours?"
- "Who do I call about [sales / training / maintenance]?"
- "Is parking available?"
- "Where's the nearest train station?"

**JSON-LD beyond baseline:**
- Richer `LocalBusiness` with full `contactPoint` array (already planned — uses `CONTACT_POINTS` from `seoDefaults`)
- `Place` schema for Denham Aerodrome with geo + parking info
- Add `hasMap` field linking to Google Maps URL

**Internal links:**
- → `/training/trial-lessons` ("Book a trial lesson")
- → `/sales/new` ("Speak to sales")
- → `/maintenance` ("Speak to maintenance")
- → All four aircraft model pages (so customers pre-research before calling)

**Body angle:** detailed driving directions (M40 J1, M25 J16, A40); train station + taxi (Denham railway station, ~2 km); satnav coordinates; "what to expect when you visit"; on-site facilities (cafe, parking, bathrooms — basic but searched); accessibility info.

---

## 13. Expeditions — `/expeditions` *(bonus)*
**File:** `src/pages/FinalExpeditions.jsx`
**Search intent:** aspirational, very low volume but ZERO competition — easy ranking win + brand differentiator
**Primary keyword:** `helicopter expeditions`
**Secondary:** `worldwide helicopter trips`, `long range helicopter expedition`, `cross channel helicopter`, `helicopter adventure uk`, `bespoke helicopter trips`
**Long-tail:** `helicopter expedition to africa`, `cross channel helicopter trip cost`, `multi-day helicopter trip europe`, `private helicopter expedition`, `helicopter ferry pilot uk`, `helicopter expedition planning uk`

**Title:** `Worldwide Helicopter Expeditions`
**Description:** `Multi-day, long-range helicopter expeditions led by HQ Aviation pilots. Cross-Channel, cross-continent, and bespoke routes for owner-pilots and charter clients. Itinerary planning, route notation, fuel logistics, customs handling — everything taken care of.`
**H1:** `Expeditions`

**H2 questions:**
- "What's a helicopter expedition?"
- "Can I cross the Channel by helicopter?"
- "How far can a Robinson R66 fly?"
- "Do you plan custom expeditions?"
- "What aircraft are best for long trips?"

**JSON-LD beyond baseline:**
- `Service` with `serviceType: 'Helicopter Expeditions'`
- `Event` per planned expedition (if calendar exists)
- `TripPlanning` schema (use `TouristTrip` for past expeditions as case studies)

**Internal links:**
- → `/aircraft/r66` ("R66 — our preferred expedition aircraft")
- → `/training/advanced` ("Mountain / cross-country training")
- → `/blog` (link to past expedition write-ups)

**Body angle:** past expedition case studies with photos/maps; routing capabilities; fuel + customs services; bespoke quote process; mention specific iconic routes (Calais return, Le Touquet weekend, Alps tour, Africa overland).

---

# Part 3 — Bonus: pages worth creating (out of Plan 1 scope, captured for follow-up)

These are NEW pages that would unlock additional search traffic. Each gets its own future plan. Not blocking Plan 1.

| Proposed URL | Captures | Why |
|--------------|----------|-----|
| `/helicopter-experience-london` | "fly a helicopter london", "helicopter experience near me" | Slug matches dominant search term — beats `/training/trial-lessons` for that query. Canonical to `/training/trial-lessons`, body explicitly London-focused |
| `/helicopter-school-london` | "helicopter school london", "best helicopter school london" | Slug match — dominant query has no perfect-match URL today |
| `/helicopter-pilot-training-cost-uk` | "ppl helicopter cost", "how much to learn helicopter uk" | Cost-focused content marketing — captures research intent at top of training funnel |
| `/blog/robinson-r66-buyers-guide-uk` | "r66 buyers guide", "is r66 worth it" | Long-form per-model buyer's guide — captures investigation-intent for high-value buyers |
| `/blog/robinson-r44-vs-r66` | "r44 vs r66", "robinson piston vs turbine" | Comparison content ranks well + drives toward sales pages |
| `/blog/cost-of-ppl-helicopter-2026` | "cost of ppl helicopter", "is helicopter ppl worth it" | Annual cost-guide; links to /training/ppl |
| `/blog/become-helicopter-pilot-uk-guide` | "how to become a helicopter pilot uk" | Pillar content; links to PPL + CPL + trial lessons |
| `/instructors` | "[instructor name]", trust signals | Person schema for each instructor. Major E-A-T signal. |
| `/about-us/why-denham` | "best place to learn helicopter near london", "denham vs fairoaks" | Differentiation page about choosing Denham as a training base |

---

# Part 4 — Schema additions worth doing alongside Plan 1

These extend the JSON-LD library beyond the 7 builders we've shipped. Optional but high-value.

| Builder | Use on | Why |
|---------|--------|-----|
| `buildCourse({...})` | Each training page (PPL, CPL, type-rating, advanced) | Google's rich result for educational courses. Critical for training-page rankings. |
| `buildService({...})` | Maintenance, sales, expeditions, trial lessons | `Service` is the catch-all schema for offerings; helps Google categorise pages |
| `buildPerson({...})` | Instructor pages, blog post authors | E-A-T signal. Person schema with credentials = trust = ranking lift on YMYL queries (helicopter training arguably qualifies — safety stakes) |
| `buildEvent({...})` | Open days, R88 reveal events, expedition trips | Eligible for Google's events rich card |
| `buildVideoObject({...})` | Pages with embedded videos (R88 has capability.mp4 etc.) | Eligible for video carousel results |
| `buildAggregateRating({...})` | Once reviews are wired into Firestore | Star ratings in SERPs — biggest CTR lift available |

I'll add `buildCourse` and `buildService` in a small follow-up commit if approved (low cost).

---

# Part 5 — Authority signals checklist (before Tasks 17–19 land)

Before page edits go live, please confirm or provide:

- [ ] **CAA Part-FCL ATO number** — appears on all training pages
- [ ] **CAA Part-145 AMO number** — appears on /maintenance
- [ ] **Year HQ Aviation was established** — appears in landing + about + contact body copy
- [ ] **Robinson Authorised Dealer "since" year** — appears on /sales/new + each aircraft page
- [ ] **Names of named instructors** (with permission) — for Person schema and authority signals
- [ ] **Any awards / press mentions** — surfaced in body copy
- [ ] **R88 expected delivery window** for the UK — for the R88 page

---

# Owner approval

Mark one:

- [ ] **Approved as-is** — proceed with Tasks 17–19 page edits using the values above
- [ ] **Approved with edits** — see notes inline above
- [ ] **Needs further work** — see notes below

Notes:

> _(owner: edit titles, descriptions, H2 lists, internal links — anything. Anywhere I've made an assumption, override it. Then mark "Approved with edits" and I'll bake the final values in.)_

---

## Notes for the implementer (Tasks 17–19)

After approval:
- Use `<Seo title="…" description="…" />` from `src/components/seo/Seo.jsx`
- For aircraft pages (3–6) also pass `ogType="product"`, `ogImage` (page hero), `jsonLd={[buildProduct({…}), buildBreadcrumbList([…])]}`
- For training pages (7–10) compose `jsonLd={[buildFAQPage([…]), … and the future Course schema if shipped]}`
- For Contact (12) compose richer `LocalBusiness` with `contactPoint` array using `CONTACT_POINTS` from `seoDefaults`
- For trial lessons (10) — DO NOT hardcode prices; live values come from Firestore `pricing` collection (`discovery_*` IDs) and are shown in the page body
- H2 questions in this doc become H2 elements in the page body (they don't go in `<Seo>` tags)
- Authority signal placeholders (`[CAA #?]`, `since [year]`) — only insert real values once owner provides them; otherwise omit cleanly rather than ship `[?]`
