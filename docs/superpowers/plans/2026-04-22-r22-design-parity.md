# R22 Design Parity Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the visual-parity gap between `/aircraft/r22` and its siblings `/aircraft/r44`, `/aircraft/r66`, `/aircraft/r88`. The previous R22 upgrade (21 commits through 2026-04-22) matched section order and decomposition but missed the richer visual treatments that define the family: thumbnail-driven variant picker, thumbnail card-grid comparison with conditional reveal + dark table, R66-style timeline rail with status markers, and a few smaller typography polish items.

**Architecture:** All changes edit `src/pages/AircraftR22.jsx` only. Robinson Beta II side profile (`/assets/images/new-aircraft/r22/r22-beta-ii-left.png`) is the canonical silhouette for all R22 variants (Alpha / Beta / Beta II all share the airframe; Mariner has floats but no official art exists — placeholder same silhouette). Patterns are mirrored precisely from R44 (variant picker + comparison) and R66 (timeline). No new files. No new dependencies.

**Tech Stack:** Same as the rest of the R22 page — React 19, Framer Motion (`motion`, `LayoutGroup`, `useInView`), inline-styled via `<style>` tag in `R22Styles()`.

**Reference files:**
- `src/pages/AircraftR44.jsx` — variant picker (function at 1465, CSS 3312–3753) and comparison (function at 1328, CSS 4336–4559)
- `src/pages/AircraftR66.jsx` — timeline (function at 908, CSS 2472–2598)
- `src/pages/AircraftR22.jsx` — target; `R22Specifications` at ~1700, `R22VariantComparison` at ~2158, `R22HistoryTimeline` at ~1664 (line numbers approximate, pre-remediation)

**Commit discipline:** one commit per task. Prefix: `feat(r22):` for new work, `refactor(r22):` for replacements.

---

## Task 1: Variant picker — thumbnail tab grid with side-profile swap

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — `R22Specifications` component + `R22_VARIANT_DATA` constant + `R22Styles` template literal

**Outcome:** R22 variant picker inside Specifications section matches R44's 5-column thumbnail tab pattern. Each tab shows a side-profile thumbnail (greyscaled inactive, full colour active). Selecting a tab swaps the large side-profile image on the right using Framer `LayoutGroup` + `layoutId` for smooth morph. Below the active image, a row of use-case tag pills appears.

### Design reference — R44 pattern

JSX skeleton (from `AircraftR44.jsx:1481–1545`):
```jsx
<LayoutGroup id="r44-variants">
  <div className="r44-variants__card">
    <div className="r44-variants__tabs">
      {r44Variants.map((variant, i) => (
        <button className={`r44-variants__tab ${activeVariant === i ? 'active' : ''}`} onClick={() => setActiveVariant(i)}>
          {activeVariant !== i && (
            <motion.span className="r44-variants__tab-thumb" layoutId={`r44-variant-img-${i}`}>
              <img src={variant.image} alt="" loading="lazy" />
            </motion.span>
          )}
          <motion.span className="r44-variants__tab-label" layout>
            <span className="r44-variants__tab-sub">{variant.subtitle}</span>
            <span className="r44-variants__tab-name">{variant.name}</span>
          </motion.span>
        </button>
      ))}
    </div>
    <div className="r44-variants__content">
      <div className="r44-variants__image">
        <div className="r44-variants__image-headline">
          <div className="r44-variants__image-headline-inner">
            <span className="r44-variants__eyebrow">{active.subtitle}</span>
            <h3>R44 {active.name}</h3>
            <p className="r44-variants__tagline">{active.tagline}</p>
            <div className="r44-variants__divider" />
          </div>
        </div>
        <motion.span className="r44-variants__image-inner" layoutId={`r44-variant-img-${activeVariant}`}>
          <img src={active.image} alt={`${active.name} configuration`} />
        </motion.span>
        <div className="r44-variants__use-case-tags">
          {active.useCases.map((uc, i) => (<span className="r44-variants__use-case-tag">{uc}</span>))}
        </div>
      </div>
    </div>
  </div>
</LayoutGroup>
```

Full CSS to mirror is at `AircraftR44.jsx:3312–3753`. Copy the selectors verbatim into R22, substituting `r44` → `r22`. All sizes, colors, gradients, transitions stay identical.

### R22 variant data

`R22_VARIANT_DATA` already exists — extend each entry with `image`, `subtitle`, `tagline`, and `useCases`:

```js
const R22_VARIANT_DATA = [
  {
    key: 'alpha',
    name: 'Alpha',
    subtitle: 'Original Production',
    tagline: 'Where it all began.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Heritage airframe', 'Club fleets'],
    years: '1979–1981',
    engine: 'Lycoming O-320-A2C, 150 HP',
    power: '124 HP / 104 HP cont.',
    mtow: '1,300 lb',
    range: '180 nm',
    usefulLoad: '450 lb',
    landingGear: 'Skids',
    notable: 'Inaugural production model',
  },
  {
    key: 'beta',
    name: 'Beta',
    subtitle: 'Carbureted Upgrade',
    tagline: 'The workhorse trainer.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Ab-initio PPL training', 'Hour building'],
    years: '1985–1995',
    engine: 'Lycoming O-320-B2C, 160 HP',
    power: '160 HP / 124 HP cont.',
    mtow: '1,370 lb',
    range: '200 nm',
    usefulLoad: '490 lb',
    landingGear: 'Skids',
    notable: 'Uprated engine, longer TBO',
  },
  {
    key: 'beta-ii',
    name: 'Beta II',
    subtitle: 'Current Production',
    tagline: 'The benchmark piston trainer.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Flight schools', 'Private PPL', 'Type-rating machine'],
    years: '1995–present',
    engine: 'Lycoming O-360-J2A, 145 HP cont.',
    power: '145 HP / 131 HP cont.',
    mtow: '1,370 lb',
    range: '200 nm',
    usefulLoad: '490 lb',
    landingGear: 'Skids',
    notable: '2,200-hour TBO; Robinson Safety Course',
  },
  {
    key: 'mariner',
    name: 'Mariner',
    subtitle: 'Amphibious Variant',
    tagline: 'The R22, now with floats.',
    // Placeholder: no distinct skids-removed art exists on Robinson's CDN.
    // Same silhouette — use-case tags + tagline carry the differentiation.
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Over-water', 'Shoreline ops'],
    years: '1983–present',
    engine: 'Lycoming O-360-J2A, 145 HP cont.',
    power: '145 HP / 131 HP cont.',
    mtow: '1,370 lb',
    range: '220 nm',
    usefulLoad: 'Varies w/ floats',
    landingGear: 'Pop-out floats',
    notable: 'Factory-float option, emergency deploy',
  },
];
```

### Steps

- [ ] **Step 1: Extend `R22_VARIANT_DATA`** at its current declaration site (search for `R22_VARIANT_DATA = [` in AircraftR22.jsx). Add the `image`, `subtitle`, `tagline`, `useCases` fields shown above. Keep all existing fields intact. Grep confirms: only the spec selector should read from this object today.

- [ ] **Step 2: Locate `R22Specifications`** (search `function R22Specifications`). Keep the section header, overview paragraph, and blueprint block that already exist. Replace the pill-style variant selector (inside `.r22-specs__variant-pills` or similar) with a new sub-block `.r22-variants__card` containing `.r22-variants__tabs` and `.r22-variants__content` exactly mirroring the R44 JSX above (prefix swapped). Ensure `import { motion, LayoutGroup }` is present at file top (it already is).

- [ ] **Step 3: Add R22-prefixed CSS** to `R22Styles()` by copying R44's CSS block at `AircraftR44.jsx:3312–3753` and replacing every `r44` class token with `r22`. Place the block inside `R22Styles` near the existing `.r22-specs` rules. Do not change any dimensions, colors, or transitions — verbatim port.

- [ ] **Step 4: Wire `useCases` tags** inside `.r22-variants__image` using `<div className="r22-variants__use-case-tags">` with children `<span className="r22-variants__use-case-tag">`. The absolute-positioned bottom-right placement is already covered by the ported CSS.

- [ ] **Step 5: Responsive check** — the R44 CSS includes `@media (max-width: 1000px)`, `@media (max-width: 900px)`, `@media (max-width: 700px)` overrides at 3695–3753 that shift the tab grid to 3-col then 1-col with thumbnail reshaping. Port these verbatim with the prefix swap.

- [ ] **Step 6: Verify** — `npm run build` succeeds; dev server renders the R22 page with four tabs in a row on desktop, thumbnails swapping, use-case tags visible.

- [ ] **Step 7: Commit** —
```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): adopt R44 thumbnail variant picker with side-profile swap"
```

---

## Task 2: Comparison table — thumbnail card picker + conditional render + dark header

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — `R22VariantComparison` component + `R22Styles`

**Outcome:** Comparison section picker replaced with R44-style thumbnail card grid. Table only renders once at least one variant is selected. Table header row uses dark (`#1a1a1a`) background with white text. `Share Tech Mono` cell values. Adds a 9th row so R22 table depth matches R44's 9 rows (current: 8 rows). Retains the "last remaining column cannot be removed" behavior from the current implementation.

### Design reference — R44 pattern

JSX skeleton (from `AircraftR44.jsx:1328–1458`). Port the structure identically: a `.r44-comparison__picker` block with `-label` (showing selected count + Clear button), then `-grid` of `-card` buttons, each containing `-check` (checkbox indicator), `-thumb` (52×36 px image tile), `-text` (name + tag). Below, conditionally renders `.r44-comparison__table-wrapper` containing a `<table>` with `<thead>` (dark bg) and `<tbody>` (light rows).

CSS to mirror: `AircraftR44.jsx:4336–4559`. Verbatim port with `r44` → `r22` substitution.

### R22 comparison data

Introduce `R22_COMPARISON_COLUMNS` (if not already present) alongside the existing comparison-row data:

```js
const R22_COMPARISON_COLUMNS = [
  { key: 'alpha',   name: 'Alpha',   tag: 'Original',      image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'beta',    name: 'Beta',    tag: 'Carbureted',    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'beta-ii', name: 'Beta II', tag: 'Current',       image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'mariner', name: 'Mariner', tag: 'Amphibious',    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
];
```

### R22 comparison rows (9, matching R44 depth)

```js
const R22_COMPARISON_ROWS = [
  { label: 'Introduced',       key: 'years' },
  { label: 'Engine',           key: 'engine' },
  { label: 'Fuel System',      key: 'fuelSystem', fallback: 'Carbureted' }, // NEW — default carburetted for all R22 variants
  { label: 'Power',            key: 'power' },
  { label: 'Max Gross Weight', key: 'mtow' },
  { label: 'Useful Load',      key: 'usefulLoad' },
  { label: 'Range',            key: 'range' },
  { label: 'Landing Gear',     key: 'landingGear' },
  { label: 'Best For',         key: 'notable' },
];
```

Add `fuelSystem: 'Carbureted'` to each variant in `R22_VARIANT_DATA` (all four are carbureted — not a point of difference on R22, but included for structural parity with R44).

### Steps

- [ ] **Step 1: Add `R22_COMPARISON_COLUMNS` constant** near the top of the comparison section or alongside `R22_VARIANT_DATA`. Shape per above.

- [ ] **Step 2: Extend `R22_VARIANT_DATA`** entries from Task 1 with `fuelSystem: 'Carbureted'` on each of the four variants.

- [ ] **Step 3: Replace `R22VariantComparison` function body.** Keep the section header + intro text. Replace the pill-toggle block with the R44 picker pattern (card grid with thumbnails). Replace the always-visible table with a conditional block: `{hasSelection && ...}`. The row-render path uses `R22_VARIANT_DATA.find(v => v.key === col.key)[row.key] || row.fallback || '—'`.

- [ ] **Step 4: Preserve "last column cannot be removed"** — the current implementation had this rule. Port it: `toggleKey` should no-op if removing would drop length to 0. Add an `aria-disabled` / visual "locked" state on the last-active card (R44 doesn't have this, but R22 had it and it's good UX — keep it).

- [ ] **Step 5: Port CSS** from `AircraftR44.jsx:4336–4559` with `r44` → `r22` substitution. Insert in `R22Styles` replacing the existing `.r22-compare__*` block (delete all old R22 comparison CSS — do not leave orphans).

- [ ] **Step 6: Verify** — `npm run build` succeeds; comparison table not visible until a variant card is clicked; clicking a second/third reveals the table with dark header; clicking the last selected card does not empty the table (stays with one column).

- [ ] **Step 7: Commit** —
```bash
git add src/pages/AircraftR22.jsx
git commit -m "refactor(r22): comparison card-picker, conditional table, dark header"
```

---

## Task 3: History timeline — R66-style rail with animated progress + status markers

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — `R22HistoryTimeline` component + the `HistoryTimelineDots` helper (DELETE it; not reusable elsewhere per grep) + `R22Styles`

**Outcome:** Timeline inside the history section matches R66's pattern: vertical rail with a progress line, 50×50 circular markers, three status states (completed = solid black with checkmark, active = bordered with inner pulse, upcoming = outlined with grey dot), year badge inline, title+description beside marker.

### Design reference — R66 pattern

JSX skeleton (from `AircraftR66.jsx:922–945`):
```jsx
<div className="r22-timeline__track">
  <div className="r22-timeline__line">
    <div className="r22-timeline__line-progress" />
  </div>
  {historyEvents.map((event, i) => (
    <Reveal key={i} delay={i * 0.12}>
      <div className={`r22-timeline__item r22-timeline__item--${event.status || 'completed'}`}>
        <div className="r22-timeline__marker">
          {event.status === 'active' && <div className="r22-timeline__pulse" />}
          {event.status === 'upcoming' && <div className="r22-timeline__dot" />}
          {(!event.status || event.status === 'completed') && <i className="fas fa-check"></i>}
        </div>
        <div className="r22-timeline__content">
          <span className="r22-timeline__year">{event.year}</span>
          <div className="r22-timeline__text">
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </Reveal>
  ))}
</div>
```

CSS to mirror: `AircraftR66.jsx:2472–2598`. Verbatim port (`r66` → `r22`).

### Status assignment for R22 events

Extend the seven history events R22 already has:

```js
const R22_HISTORY = [
  { year: '1973', title: 'Design Begins',          status: 'completed', description: '...' },
  { year: '1975', title: 'First Flight',           status: 'completed', description: '...' },
  { year: '1979', title: 'Production Begins',      status: 'completed', description: '...' },
  { year: '1996', title: 'Beta II Introduction',   status: 'completed', description: '...' },
  { year: '1997', title: 'Safety Milestone',       status: 'completed', description: '...' },
  { year: '2012', title: 'World Champion Aircraft',status: 'completed', description: '...' },
  { year: '2024', title: '4,800+ Built',           status: 'active',    description: '...' },
];
```

(All existing events stay completed except the most recent 2024 entry, which is `active` to signify "ongoing" with the pulse animation.)

### Steps

- [ ] **Step 1: Replace `R22HistoryTimeline` body** — remove the existing `<div className="r22-history__timeline">` + `<HistoryTimelineDots events={...} />` pattern. Inline the R66 track/line/items JSX above (prefix swapped). Preserve the surrounding `.r22-history` section, section header, and the left-side `.r22-history__image` (blueprint). The new track replaces only the timeline column.

- [ ] **Step 2: Delete `HistoryTimelineDots`** helper (current definition ~line 290). `R22HistoryTimeline` is its only caller per grep; removing it trims dead code.

- [ ] **Step 3: Extend `R22_HISTORY` event array** with `status` field as shown above.

- [ ] **Step 4: Port CSS** from `AircraftR66.jsx:2472–2598` with `r66` → `r22` substitution. Place inside `R22Styles()` near the existing `.r22-history` block. Keep the existing `.r22-history__image`, `.r22-history__content`, `.r22-history__timeline` (wrapper) rules — they still wrap the new track.

- [ ] **Step 5: Remove obsolete `.r22-timeline__dot` / `.r22-timeline__line` rules** from the old `HistoryTimelineDots` styling if they conflict with the new ones (grep for `.r22-timeline` to inventory, dedupe, and keep only the ported R66 versions).

- [ ] **Step 6: Verify** — `npm run build` passes; 2024 entry pulses, all prior entries show checkmark; progress line renders continuously behind markers.

- [ ] **Step 7: Commit** —
```bash
git add src/pages/AircraftR22.jsx
git commit -m "refactor(r22): adopt R66 timeline rail with status-aware markers"
```

---

## Task 4: Typography cleanup + use-case tag polish + QA sweep

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

**Outcome:** Removes stray `'Courier New'` fallback from pre-text font stack for sibling consistency. Verifies section-header max-width conforms to a single rule. One dev-server smoke test.

### Steps

- [ ] **Step 1: Font stack cleanup** — grep `AircraftR22.jsx` for `'Courier New'`. Any occurrence inside the `.r22-pre-text` font-family declaration drops the `'Courier New'` entry so the stack reads `'Share Tech Mono', monospace` (matching R44/R66/R88).

- [ ] **Step 2: Section header max-width audit** — grep for `.r22-section-header` in the styles block. Siblings use 650px (R44) or unset (R66). If R22 sets 700px, lower to 650px for family consistency. (This is a tiny visual delta; accept if user overrides.)

- [ ] **Step 3: Smoke test** — `npm run build` succeeds. Launch dev server (if not already) and verify: hero loads, sticky stack pins, variant picker responds to clicks, comparison picker conditionally reveals table, timeline pulses on 2024. No console errors.

- [ ] **Step 4: Final commit** —
```bash
git add src/pages/AircraftR22.jsx
git commit -m "refactor(r22): tighten font stack and section header rhythm to match siblings"
```

---

## Appendix — Why these changes

| Gap | User quote | Root cause |
|-----|-----------|-----------|
| Variant picker lacks side profile | "the variant picker not including the side profile of the r22" | Original spec matched section order but not R44's tab-thumbnail pattern |
| Timeline mismatch | "the timeline not matching the design of the timeline we've developped on the other pages" | Custom HistoryTimelineDots instead of R66's rail+marker pattern |
| Comparison table mismatch | "the comparison table not matching the style of the comparison table of the r44 section" | Plain pills + always-visible light table vs R44's thumbnail cards + conditional + dark header |
| Font inconsistency | "even from the font" | Stray `'Courier New'` fallback on pre-text |
| Layout mismatch | "to the layout" | Addressed in prior upgrade commits — sticky stack, section order now match |

## Appendix — Assets used

All references point to committed local files (commit `0985b0f`):
- `/assets/images/new-aircraft/r22/r22-beta-ii-left.png` — Robinson-sourced Beta II side profile, used for all four variants in picker + comparison thumbnails
- `/assets/images/new-aircraft/r22/r22-beta-ii-specification-diagram.png` — available if specs section wants to swap away from `r22blueprint.jpg` (not required by this plan)
- 2026 PDFs (brochure, EOC, avionics, accessories, pricelist) are available but not wired in by this plan — can surface in a follow-up.
