# HQ Aviation — Per-Page SEO Tuning Proposals

**Date:** 2026-04-23
**Status:** ⏸️ AWAITING OWNER APPROVAL — page edits in Tasks 17–19 cannot start until this is approved.

For each page below: target keywords, recommended title (≤60 chars), meta description (70–160 chars), H1, and 2–3 internal-link suggestions. Edit any cell as needed, then mark the approval checkboxes at the bottom.

**Title format note:** the `<Seo>` component appends ` | HQ Aviation` automatically. Titles below are the *prefix* portion — keep them under ~45 chars to leave room for the suffix without truncation in Google's 60-char SERP cap.

---

## 1. Landing — `/`
**File:** `src/pages/Experimentation.jsx`
**Page intent:** umbrella positioning, capture top-of-funnel, drive into the three primary verticals (sales, training, maintenance)
**Primary keyword:** robinson helicopter dealer uk
**Secondary keywords:** helicopter training london, helicopter maintenance denham, robinson helicopter sales

**Title (prefix, ≤45 chars):** `Robinson Helicopter Dealer · Training · Maintenance`
**Description (70–160):** `UK Robinson Helicopter dealer based at Denham Aerodrome. Aircraft sales, PPL/CPL/type-rating training, factory-grade maintenance and worldwide expeditions.`
**H1 (suggest):** `HQ Aviation` *(keep — landing should anchor brand; subheadings carry the keywords)*
**Internal links to add (if not present):**
- → `/sales/new` ("Browse new Robinson aircraft")
- → `/training/ppl` ("Earn your PPL(H)")
- → `/maintenance` ("Maintenance and overhauls")

---

## 2. Aircraft Sales overview — `/sales/new`
**File:** `src/pages/Sales.jsx` *(verify — may be `AircraftSales.jsx`)*
**Page intent:** index page for the new-aircraft lineup
**Primary keyword:** new robinson helicopter for sale uk
**Secondary keywords:** buy robinson r44 uk, buy robinson r66 uk, robinson dealer

**Title:** `New Robinson Helicopters For Sale`
**Description:** `Buy a new Robinson R22, R44, R66 or R88 from the UK's authorised Robinson dealer. Full delivery, warranty and ongoing maintenance support included.`
**H1:** `New Robinson Helicopters`
**Internal links:**
- → each aircraft model page (`/aircraft/r22|r44|r66|r88`)
- → `/sales/pre-owned` ("Pre-owned aircraft")
- → `/contact` ("Speak to a sales consultant")

---

## 3. Robinson R22 — `/aircraft/r22`
**File:** `src/pages/AircraftR22.jsx`
**Page intent:** product page, training-aircraft positioning
**Primary keyword:** robinson r22 for sale uk
**Secondary keywords:** robinson r22 price, r22 helicopter training, two-seat helicopter

**Title:** `Robinson R22 — New Aircraft Sales`
**Description:** `The Robinson R22 is the world's most popular training helicopter. Buy new from the UK's authorised Robinson dealer at Denham Aerodrome. Full warranty, parts and support.`
**H1:** `Robinson R22` *(keep model name as the primary heading)*
**Internal links:**
- → `/training/ppl` ("R22 is the standard PPL(H) trainer")
- → `/maintenance` ("R22 maintenance")
- → `/sales/pre-owned` ("Used R22s for sale")

---

## 4. Robinson R44 — `/aircraft/r44`
**File:** `src/pages/AircraftR44.jsx`
**Primary keyword:** robinson r44 for sale uk
**Secondary keywords:** robinson r44 raven ii, four-seat helicopter, r44 cadet

**Title:** `Robinson R44 — New Aircraft Sales`
**Description:** `Buy a new Robinson R44 Raven II or Cadet from the UK's authorised Robinson dealer. Four-seat piston helicopter with proven reliability. Delivery and support included.`
**H1:** `Robinson R44`
**Internal links:**
- → `/training/type-rating` ("R44 type-rating training")
- → `/maintenance`
- → `/sales/pre-owned`

---

## 5. Robinson R66 — `/aircraft/r66`
**File:** `src/pages/AircraftR66.jsx`
**Primary keyword:** robinson r66 for sale uk
**Secondary keywords:** robinson r66 turbine, five-seat turbine helicopter, r66 price

**Title:** `Robinson R66 Turbine — New Sales`
**Description:** `The Robinson R66 Turbine: five-seat helicopter with Rolls-Royce RR300 powerplant. Buy new from the UK's authorised Robinson dealer at Denham. Full delivery support.`
**H1:** `Robinson R66 Turbine`
**Internal links:**
- → `/training/type-rating`
- → `/maintenance`
- → `/contact`

---

## 6. Robinson R88 — `/aircraft/r88`
**File:** `src/pages/AircraftR88.jsx`
**Primary keyword:** robinson r88
**Secondary keywords:** robinson r88 turbine, eight-seat helicopter, new robinson helicopter, r88 price

**Title:** `Robinson R88 — Eight-Seat Turbine`
**Description:** `The all-new Robinson R88: eight-seat single-engine turbine. Reserve yours through the UK's authorised Robinson dealer at Denham Aerodrome.`
**H1:** `Robinson R88`
**Internal links:**
- → `/sales/new` ("All new aircraft")
- → `/contact` ("Reserve a delivery slot")
- → `/maintenance`

---

## 7. PPL(H) Training — `/training/ppl`
**File:** `src/pages/FinalPPL.jsx`
**Primary keyword:** ppl helicopter training london
**Secondary keywords:** ppl(h), private pilot licence helicopter, learn to fly a helicopter uk, helicopter flying lessons denham

**Title:** `PPL(H) — Helicopter Pilot Training`
**Description:** `Earn your Private Pilot Licence (Helicopter) at Denham Aerodrome, just outside London. CAA-approved instructors, R22 and R44 training fleet, structured 45-hour syllabus.`
**H1:** `Private Pilot Licence (H)`
**Internal links:**
- → `/training/trial-lessons` ("Try a trial flight first")
- → `/aircraft/r22` ("Aircraft you'll train on")
- → `/contact` ("Book a discovery flight")

---

## 8. Commercial Pilot Training — `/training/commercial`
**File:** `src/pages/CPL.jsx`
**Primary keyword:** cpl helicopter training uk
**Secondary keywords:** commercial helicopter pilot, cpl(h), helicopter commercial licence

**Title:** `CPL(H) — Commercial Helicopter Training`
**Description:** `Become a commercial helicopter pilot. CPL(H) training at Denham Aerodrome with CAA-approved instructors. Modular and integrated paths from PPL through to ATPL.`
**H1:** `Commercial Pilot Licence (H)`
**Internal links:**
- → `/training/ppl` ("Start with a PPL(H)")
- → `/training/type-rating`
- → `/superyacht-ops` ("Superyacht operations career path")

---

## 9. Type Rating — `/training/type-rating`
**File:** `src/pages/TypeRating.jsx`
**Primary keyword:** robinson type rating training
**Secondary keywords:** r44 type rating, r66 type rating, helicopter type conversion uk

**Title:** `Type Rating — R44, R66 and Beyond`
**Description:** `Add a Robinson R44 or R66 type rating to your existing helicopter licence. Structured conversion training at Denham Aerodrome with examiner-rated instructors.`
**H1:** `Type Rating Training`
**Internal links:**
- → `/aircraft/r44`
- → `/aircraft/r66`
- → `/training/ppl`

---

## 10. Trial Lessons — `/training/trial-lessons`
**File:** `src/pages/DiscoveryFlight.jsx`
**Primary keyword:** helicopter trial lesson london
**Secondary keywords:** discovery helicopter flight, learn to fly helicopter, helicopter experience day, first helicopter lesson

**Title:** `Helicopter Trial Lessons`
**Description:** `Take the controls of a real helicopter on a guided trial flight. 30 or 60-minute lessons available daily at Denham Aerodrome, just outside London. From £180.`
**H1:** `Helicopter Trial Lessons`
**Internal links:**
- → `/training/ppl` ("Continue to a full PPL(H)")
- → `/helicopter-tour-of-london` ("Or take a London tour")
- → `/contact`

---

## 11. Maintenance — `/maintenance`
**File:** `src/pages/FinalMaintenance.jsx`
**Primary keyword:** robinson helicopter maintenance uk
**Secondary keywords:** helicopter service centre denham, r22 maintenance, r44 maintenance, r66 maintenance, robinson factory authorised

**Title:** `Robinson Helicopter Maintenance`
**Description:** `Robinson factory-authorised maintenance, overhauls and inspections at Denham Aerodrome. Full R22, R44, R66 and R88 support. CAA Part-145 approved organisation.`
**H1:** `Maintenance & Overhauls`
**Internal links:**
- → `/parts` ("Genuine Robinson parts")
- → `/sales/new`
- → `/contact`

---

## 12. Contact — `/contact`
**File:** `src/pages/Contact.jsx`
**Primary keyword:** hq aviation denham
**Secondary keywords:** robinson helicopter dealer contact, helicopter training london contact, denham aerodrome helicopter

**Title:** `Contact HQ Aviation`
**Description:** `Visit HQ Aviation at Denham Aerodrome, just 30 minutes from central London. Operations: +44 1895 833373. Maintenance: +44 1895 832833. Email Operations@HQAviation.com.`
**H1:** `Contact us`
**Internal links:**
- → `/training/trial-lessons` ("Book a trial lesson")
- → `/sales/new` ("Speak to sales")
- → `/maintenance` ("Speak to maintenance")

---

## 13 (bonus). Expeditions — `/expeditions`
*Included because it's high-uniqueness content with low keyword competition — easy ranking win.*
**File:** `src/pages/FinalExpeditions.jsx`
**Primary keyword:** helicopter expeditions
**Secondary keywords:** worldwide helicopter trips, helicopter adventure travel, long-range helicopter expedition

**Title:** `Worldwide Helicopter Expeditions`
**Description:** `Multi-day, long-range helicopter expeditions guided by HQ Aviation pilots. Cross-channel, cross-continent, and bespoke routes for owner-pilots and charter clients.`
**H1:** `Expeditions`
**Internal links:**
- → `/aircraft/r66` ("R66 — the expedition aircraft")
- → `/training/advanced`
- → `/contact`

---

## Owner approval

Mark one:

- [ ] **Approved as-is** — proceed with Tasks 17–19 page edits using the values above
- [ ] **Approved with edits** — see notes inline above
- [ ] **Needs rework** — see notes below

Notes:

> _(owner: write any specific changes here)_

---

## Notes for the implementer (Tasks 17–19)

Once approved:
- Use the `<Seo title="…" description="…" />` from `src/components/seo/Seo.jsx` (already shipped)
- For aircraft pages (3–6) also pass `ogType="product"`, an `ogImage` (use the page's hero), and `jsonLd={[buildProduct({…}), buildBreadcrumbList([…])]}`
- For training pages (7–10) consider `jsonLd={[buildFAQPage([…])]}` if the page has static FAQs
- For Contact (12) compose a richer `LocalBusiness` with `contactPoint` array (the two phones/emails from `seoDefaults.CONTACT_POINTS`)
- H1 changes that conflict with existing visual hero copy: leave the existing H1 alone if the proposed H1 would break the design — record the conflict in `docs/seo/seo-audit.md` and discuss with owner
