# R22 Page Upgrade — Design Spec

**Date:** 2026-04-21
**Status:** Draft (awaiting approval)
**Target:** `src/pages/AircraftR22.jsx`, route `/aircraft/r22`
**Reference pages:** `AircraftR44.jsx`, `AircraftR66.jsx`, `AircraftR88.jsx`

---

## Overview

The R22 page is about half the length of its siblings (2,730 lines vs 4,190–5,391) and lacks the component-based architecture, sticky-scroll treatment, and visual-language depth of R44/R66/R88. This spec brings R22 to parity: modern R66/R88-style architecture, shared design tokens, sticky-scroll specs stack, and four new sections (Highlights band, Why-Trainer, Variant Comparison, Fleet lineup) plus an expanded Captain Quentin Smith narrative.

Two sections were explicitly scoped **out**:
- **Variants shared-layout animated tab upgrade** — the existing AnimatePresence tabs stay (the three variants still surface via the Specifications variant selector and the Variant Comparison table).
- **Engine partnership section** — R22's Lycoming story is not marketed separately; engine detail lives inside the Specifications table.

---

## Architecture

Match the R66/R88 pattern:

```jsx
export default function AircraftR22() {
  // hooks: useScroll for hero, usePageImages('r22'), useCmsHighlight()
  return (
    <div className="r22-page">
      <R22Styles />
      <R22Header />
      <main>
        <R22Hero />
        <div className="r22-sticky-stack">
          <R22Highlights />
          <R22Introduction />
          <R22Specifications />
        </div>
        <R22FlightCharacteristics />
        <R22WhyTrainer />
        <R22VariantComparison />
        <R22HistoryTimeline />
        <R22Champion />
        <R22Fleet />
        <R22Variants />
        <R22Gallery />
        <R22CTA />
      </main>
      <FooterMinimal />
    </div>
  );
}
```

**Notes on order:**
- Flight Characteristics is lifted out of the sticky stack so the sticky blur handoff ends cleanly on Specs.
- Existing Variants tab section (Beta / Beta II / Mariner with PDFs) stays near the bottom as a reference block rather than a hero narrative; the heavy lifting moves to the Variant Comparison table higher up.

**Design tokens** (sourced from R66/R88 styles):

| Token | Value |
|-------|-------|
| Page background | `#faf9f6` |
| Primary text | `#1a1a1a` |
| Mid text | `#4a4a4a` |
| Light text | `#7a7a7a` |
| Accent (reserved, used sparingly) | brand orange, existing |
| Heading font | Space Grotesk |
| Spec / eyebrow font | Share Tech Mono |
| Eyebrow class | `.r22-pre-text` — uppercase, 0.75rem, letter-spacing 0.25em, color `#999` |
| Button class | `.r22-btn` (primary + outline) matching R66 |

**Shared utilities preserved:**
- `Reveal` — fade+slide-in on viewport entry (existing in R22)
- `AnimatedNumber` — count-up on viewport entry (existing)
- Framer Motion: `motion`, `useScroll`, `useTransform`, `useInView`, `AnimatePresence`, `LayoutGroup`
- `FooterMinimal`, `usePageImages('r22')`, `useCmsHighlight()`

---

## Data objects (hardcoded in-file, matching R44/R66/R88 pattern)

### `R22_VARIANT_DATA`

```js
const R22_VARIANT_DATA = [
  {
    id: 'beta',
    name: 'R22 Beta',
    years: '1985–1995',
    engine: 'Lycoming O-320-B2C',
    power: '160 HP (derated to 124 HP continuous)',
    mtow: '1,370 lb',
    seats: 2,
    fuel: '19.2 US gal',
    floats: 'No',
    notable: 'The variant that defined the modern trainer market.',
  },
  {
    id: 'beta-ii',
    name: 'R22 Beta II',
    years: '1996–Present',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP (derated to 131 HP continuous)',
    mtow: '1,370 lb',
    seats: 2,
    fuel: '19.2 US gal',
    floats: 'No',
    notable: 'Current production model — improved hot-and-high performance.',
  },
  {
    id: 'mariner',
    name: 'R22 Mariner',
    years: '1990–2010',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP (derated to 131 HP continuous)',
    mtow: '1,370 lb',
    seats: 2,
    fuel: '19.2 US gal',
    floats: 'Pop-out floats fitted',
    notable: 'Float-equipped variant for coastal and marine operations.',
  },
];
```

### `R22_HIGHLIGHTS` (sticky "AT A GLANCE" band)

```js
const R22_HIGHLIGHTS = [
  { label: 'Seats', value: '2' },
  { label: 'MTOW', value: '1,370 lb' },
  { label: 'Cruise', value: '96 kts' },
  { label: 'Built since 1979', value: '4,800+' },
];
```

### `R22_WHY_TRAINER`

```js
const R22_WHY_TRAINER = [
  {
    eyebrow: 'Economics',
    title: 'The most affordable way to fly',
    copy: 'Hourly rates typically run a third of turbine training and around half of heavier piston types. That keeps PPL(H) syllabi attainable and lets students build real hours rather than rationed ones.',
    stat: { value: '≈£300/hr', caption: 'Typical UK wet rate' },
  },
  {
    eyebrow: 'Skill transfer',
    title: 'Controls that tell you everything',
    copy: 'Direct push-rod controls with no hydraulic assistance mean every input is felt. Pilots trained on the R22 read rotor state instinctively — a habit that carries over to every heavier type they fly afterwards.',
    stat: { value: 'Zero hydraulics', caption: 'Pure mechanical feedback' },
  },
  {
    eyebrow: 'Industry standard',
    title: 'The textbook light trainer',
    copy: 'EASA, CAA and FAA syllabi are built around the R22. Instructor ratings, type-specific Awareness Training (SFAR 73 / UK equivalent) and examiner standards all assume it.',
    stat: { value: '4,800+', caption: 'Delivered worldwide' },
  },
];
```

### `R22_HISTORY` (existing 7 events, 2012 entry extended)

Keep the other six entries unchanged. Replace the 2012 entry with:

```js
{
  year: '2012',
  title: 'World Champion Aircraft',
  description:
    'Captain Quentin Smith wins the World Helicopter Aerobatic Championship in Russia flying the R22 — the only piston trainer ever to take the title, and the defining moment that confirmed the aircraft\'s handling pedigree beyond the training arena.',
}
```

### `R22_FLIGHT_CHARACTERISTICS`

Preserve the existing three items verbatim. Restyle cards to match the R66/R88 feature-card aesthetic (icon top-left, eyebrow, title, body — consistent with the Why-Trainer cards).

---

## Section-by-section

### 1. Hero — *Upgrade*

**Layout:** Full-bleed background, R22 cutout image aligned right. Title "R22" + word-by-word staggered tagline: "The World's Most Popular Training Helicopter". Three hero stats under the headline (4,800+ Built · Since 1975 · #1 Trainer). Scroll-down cue at bottom.

**Upgrade details:**
- Apply scroll-driven opacity + scale to the aircraft image (mirror R66's `useTransform(scrollYProgress, [0, 0.5], [1, 0.95])` + Y translate).
- Re-tune headline typography to the R66/R88 scale (`clamp(3rem, 8vw, 6.5rem)`, tracking `-0.03em`).
- Stats bar styled with `.r22-pre-text` eyebrows + Share Tech Mono numerals.

**Copy (unchanged from existing):** "R22" / "The World's Most Popular Training Helicopter" / stats.

**CMS marker:** `data-cms-section="r22-hero"` (new — enables future image override).

---

### 2. Highlights — "AT A GLANCE" band — *New*

**Layout:** Full-width sticky band that appears below the hero and stays pinned while the Introduction scrolls past. Four stat pills rendered from `R22_HIGHLIGHTS`, Share Tech Mono values above Space Grotesk labels, separated by hairline dividers. Blurs and lightens (via CSS variable `--r22-stack-blur`) as the Specifications section rises beneath.

**Visual model:** R66's sticky highlights band, adapted to four pills instead of three.

**Copy:**
- Eyebrow: "AT A GLANCE"
- Pills: `Seats · 2` · `MTOW · 1,370 lb` · `Cruise · 96 kts` · `Built since 1979 · 4,800+`

---

### 3. Introduction — *Upgrade*

**Layout:** Two-column sticky-scroll. Left column (60%): pre-text eyebrow "ORIGINS", heading "Designed by Frank Robinson. Proven by four decades of students.", three paragraphs of prose. Right column (40%): R22 cutout image (`r22-cutout.png`) with subtle parallax lift.

**Copy:**

> Frank Robinson drew the R22 in 1973 with a single objective: make personal helicopter flight affordable without compromising integrity. He had left Hughes and Bell in pursuit of a light two-seater that private pilots could actually own and instructors could actually teach on — a gap the industry had failed to close in thirty years.
>
> The first flight in 1975 proved the design; production began in 1979. Four decades later, more than 4,800 airframes have been delivered and the R22 remains the default first helicopter for the majority of rotary pilots worldwide. Every Beta II rolling off the Torrance line today is the direct descendant of that original prototype.
>
> The reason the design has endured is not nostalgia. It is that the R22's combination of low inertia, direct controls and honest handling creates pilots who understand rotorcraft at a mechanical level — and that understanding transfers to every aircraft they fly afterwards.

---

### 4. Specifications — *Upgrade*

**Layout:** R44-style split layout inside the sticky stack. Left column: blueprint diagram (`r22blueprint.jpg`) with overlaid dimension annotations. Right column: variant selector (three chip-style buttons — Beta / Beta II / Mariner) above a spec table. Table rows:

| Specification | Beta | Beta II | Mariner |
|--|--|--|--|
| Powerplant | Lycoming O-320-B2C | Lycoming O-360-J2A | Lycoming O-360-J2A |
| Power (takeoff / continuous) | 160 HP / 124 HP | 145 HP / 131 HP | 145 HP / 131 HP |
| Maximum gross weight | 1,370 lb | 1,370 lb | 1,370 lb |
| Maximum speed (Vne) | 102 kts | 102 kts | 102 kts |
| Cruise speed | 96 kts | 96 kts | 96 kts |
| Range (no reserve) | 240 nm | 240 nm | 220 nm |
| Hover ceiling IGE | 9,400 ft | 9,400 ft | 9,400 ft |
| Useful load | 440 lb | 440 lb | 400 lb |
| Rotor diameter | 25 ft 2 in | 25 ft 2 in | 25 ft 2 in |
| Seats | 2 | 2 | 2 |
| Fuel capacity | 19.2 US gal | 19.2 US gal | 19.2 US gal |
| Landing gear | Skids | Skids | Pop-out floats |

The selector swaps the visible column. Sticky on scroll, blur-out when the next section rises.

**CMS marker:** `data-cms-section="r22-specifications"`.

---

### 5. Flight Characteristics — *Keep, refresh*

**Layout:** Three cards in a row, each with icon (top-left), eyebrow, title, body. Cards restyled to match the Why-Trainer card aesthetic.

**Content:** Existing three items unchanged — Low-Inertia Rotor System, Direct Push-Rod Controls, Builds Superior Skills. Icons unchanged.

---

### 6. Why the R22 Trains the World — *New*

**Layout:** Section heading ("Why the world trains on the R22"), three feature cards driven from `R22_WHY_TRAINER` — each card has eyebrow, title, body paragraph, and a stat callout at the bottom. Below the cards, a horizontal stat bar with four `AnimatedNumber` counters: `4,800+` delivered · `≈£300/hr` typical rate · `0.7` fatal accidents per 100k hours (post-SFAR 73) · `40+` years in production.

**Narrative intent:** Parallel to R66's "Why Turbine?" — but framed around training economics, skill transfer, and regulatory standard.

---

### 7. Variant Comparison — *New*

**Layout:** R44-style multi-select comparison. Heading "Compare the R22 family". Three pill-style checkboxes at the top (Beta / Beta II / Mariner), all selected by default. Below, a comparison table rendered from `R22_VARIANT_DATA` showing rows: Years produced, Engine, Power, MTOW, Seating, Fuel capacity, Floats, Notable. Unchecking a variant hides its column.

Why include it when there are only three variants? It is the visual language of the reference pages — and it gives the Mariner proper standing next to the Beta family instead of burying it in tabs.

---

### 8. History Timeline — *Keep, weave Captain Q in*

**Layout:** Existing animated-dots timeline. No structural change.

**Content:** Existing 7 events. The 2012 entry's description is expanded (see `R22_HISTORY` above) so it hands off cleanly into the Champion section that follows.

---

### 9. Champion — Captain Quentin Smith — *Upgrade*

**Layout:** Two-column section. Left column: full narrative. Right column: portrait / R22 photo with `data-cms-section="r22-champion"` so imagery can be swapped through the admin panel. Eyebrow "THE RECORD HOLDER", headline "Captain Q and the R22".

**Copy:**

> In 2012, Captain Quentin Smith took an R22 to Russia and won the World Helicopter Aerobatic Championship — the only piston trainer ever to claim the title, in a field otherwise contested by purpose-built turbine types. It was not a quiet win. It was a direct statement about what the R22 is capable of when flown by someone who understands it completely.
>
> Captain Q's flying predates the championship by decades. He is the first pilot to have circumnavigated the globe pole-to-pole by helicopter, a feat that required every skill the R22 teaches and none of the systems that modern types provide. HQ Aviation's instruction ethos — that a pilot trained properly on the R22 can fly anything — comes directly from this lineage.
>
> Every student who trains with us at Denham trains in the aircraft that a world champion chose to prove his point.

**CMS marker:** `data-cms-section="r22-champion"` — falls back to `british-team-r22.webp` or a Captain Q portrait if one is uploaded.

---

### 10. HQ Fleet Lineup — *New*

**Layout:** Full-bleed photo section using `hq-r22-lineup.jpg`. Overlay eyebrow "THE DENHAM FLEET" and short caption: *"Four R22 Beta IIs. Forty years of design discipline on the same apron."* No body copy beyond the caption.

**CMS marker:** `data-cms-section="r22-fleet"`.

---

### 11. Variants (existing tab block) — *Keep*

**Layout:** No structural change. Existing AnimatePresence tab switcher with three variants, brochure/EOC PDF download links, features list. Restyled to match the new design tokens only.

**Rationale for keeping:** The PDF download CTAs and feature bullet lists have real utility for prospective buyers. The Comparison table covers the "glance" need; this section covers the "deeper dive + download" need.

---

### 12. Gallery — *Upgrade*

**Layout:** Convert from 5-image uniform grid to R88-style masonry:
- Two featured wide items (span 2 columns): `r22-red-volcano-front-alpha-v3.png`, `hq-r22-lineup.jpg`
- Regular items: `r22-cutout.png`, `r22blueprint.jpg`, `british-team-r22.webp`
- Hover shows caption label overlay
- Click opens lightbox (preserve existing `AnimatePresence` modal)

**CMS marker:** `data-cms-section="r22-gallery"` (already in place). Falls back to `SECTION_MAP['r22-gallery']` in `src/lib/imageSections.js`.

---

### 13. CTA — *Upgrade*

**Layout:** Full-bleed accent section. Heading "Start Your R22 Journey". R44-style custom select ("I'm interested in…") with four options, each routing to the existing enquire form with the correct prefill:

1. Trial lesson → `/enquire?type=trial-lesson&aircraft=r22`
2. Full PPL(H) training → `/enquire?type=ppl&aircraft=r22`
3. Aircraft sales → `/enquire?type=sales&aircraft=r22`
4. General enquiry → `/enquire?type=general&aircraft=r22`

Secondary button: "Explore training" → `/training`.

---

## CMS sections added

| Section | Marker | Fallback |
|---|---|---|
| Hero | `r22-hero` | `r22-cutout.png` (existing) |
| Specifications | `r22-specifications` | `r22blueprint.jpg` (existing) |
| Champion | `r22-champion` | `british-team-r22.webp` (existing) |
| Fleet | `r22-fleet` | `hq-r22-lineup.jpg` (existing) |
| Gallery | `r22-gallery` | Existing `SECTION_MAP['r22-gallery']` |

Each new marker needs a default entry in `src/lib/imageSections.js` — single image per section except Gallery — so the admin Images panel surfaces it.

---

## Implementation phasing

Three phases, each a shippable checkpoint and a natural commit boundary.

### Phase 1 — Foundation

- Extract inline styles into an `R22Styles()` component; re-express tokens to the R66/R88 palette and typography.
- Break the monolithic JSX body into component functions (`R22Hero`, `R22Introduction`, `R22Specifications`, `R22FlightCharacteristics`, `R22HistoryTimeline`, `R22Champion`, `R22Variants`, `R22Gallery`, `R22CTA`) preserving the current content 1:1.
- Restyle existing sections to the new tokens — no content changes, no structural changes.

**Exit criteria:** The page renders identically in terms of information but visibly polished; the file is organised as components; no regressions in existing CMS integrations.

### Phase 2 — Sticky stack + upgraded existing sections

- Wrap Highlights + Introduction + Specifications in `<div className="r22-sticky-stack">`.
- Add `R22Highlights` component.
- Upgrade `R22Introduction` to two-column sticky layout.
- Upgrade `R22Specifications` to blueprint split-layout with variant selector.
- Upgrade `R22Hero` with scroll-driven transforms.
- Upgrade `R22Gallery` to masonry.
- Upgrade `R22CTA` with dropdown select + prefilled enquire routes.

**Exit criteria:** Sticky-scroll behaviour works across desktop viewports; variant selector drives specs table correctly; gallery lightbox still functions.

### Phase 3 — New sections + final copy

- Add `R22WhyTrainer`, `R22VariantComparison`, `R22Fleet`.
- Expand `R22Champion` with full narrative and `data-cms-section="r22-champion"`.
- Extend 2012 `R22_HISTORY` entry.
- Add new CMS section defaults to `src/lib/imageSections.js`.
- Final copy pass — tighten prose, verify all in-page links, confirm enquire-form prefill keys match what `/enquire` expects.

**Exit criteria:** All 13 sections present; all new CMS markers have admin entries; visual QA matches R44/R66/R88 density.

---

## Out of scope

- New imagery. All new sections default to existing assets in the repo. Captain Q portrait and additional gallery images can be dropped in through the admin panel after launch without a code change.
- R22 family brochure / EOC PDF refresh — the current URLs from Robinson's CDN are preserved.
- Changes to any other `/aircraft/*` page.
- Mobile-specific layouts beyond what the existing responsive utilities handle — test and tweak within Phase 2/3, but no bespoke mobile components.

---

## Open questions

1. **Enquire form prefill keys** — confirm that `/enquire` accepts `?type=trial-lesson&aircraft=r22` style params in the existing implementation. If the param names differ, the CTA routes in §13 will need to match them.
2. **Champion imagery** — is there a Captain Q with R22 photo available outside the repo that should be added to `public/assets/` as a Phase 3 default, or is the CMS fallback to `british-team-r22.webp` acceptable at launch?
