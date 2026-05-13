# Content Audit + Alt-Text Audit — Spec

**Status:** draft
**Date:** 2026-05-12
**Implementation plan:** TBD

## Problem

SEO foundations are now solid (per-page meta, JSON-LD, sitemap, image optimisation, CLS controlled). The remaining gaps are content quality:

1. **Per-page tuning beyond top 12.** The original SEO Phase 1 (PR #1) tuned 12 high-priority pages. ~30 secondary pages still carry generic defaults from `getMetaForPath.js` — title/description that don't speak to search intent.
2. **Image alt-text audit.** ~500+ images across the site. Many have `alt=""` (decorative) or generic alts like `alt="image"`. Google Image Search misses the long-tail; accessibility (WCAG 2.1 1.1.1) suffers.
3. **Thin content pages.** Some service/feature pages have <200 words of unique copy. Google flags as thin → may not index.

## Goals

1. **Per-page tuning** — every canonical page in `seoRoutes.js#STATIC_ROUTES` has a unique, intent-matched title + description (≤60 / ≤160 chars).
2. **Alt-text coverage** — every non-decorative `<img>` / `<Image>` has descriptive alt text. Decorative imgs explicitly `alt=""`.
3. **Thin-page rescue** — every canonical page has ≥300 words of unique body copy.

## Non-goals

- Blog post audit (separate workflow, ongoing)
- Marketplace item descriptions (CMS-controlled)
- Translation (single-locale)
- Schema markup changes (covered in #15)

## Proposed solution

### Phase A: audit (1-2 days)

Build small one-shot scripts to enumerate the work:

1. `scripts/audit-page-meta.mjs` — walks `seoRoutes.js#STATIC_ROUTES`, reads `getMetaForPath.js`, outputs CSV: `path | title | description | titleLen | descLen | isGeneric`.
2. `scripts/audit-alt-text.mjs` — greps every `<img>` / `<Image>` in `src/pages/` + `src/components/`, extracts `alt=` value, classifies: empty / generic / descriptive / dynamic-from-data. Outputs CSV per file.
3. `scripts/audit-word-count.mjs` — for each canonical page, count user-visible text (strip JSX, attributes, comments). Output: `path | wordCount | isThin (<300)`.

Commit the CSV outputs to `docs/audits/`.

### Phase B: tune (3-5 days)

For each page in the audit CSV with `isGeneric=true`:
- Read the page's content (h1, sub-headers, intent)
- Write a unique title + description that matches search intent
- Update `getMetaForPath.js` (or `seo_overrides` collection if #15 admin dashboard shipped)

For thin pages: write 100-300 additional words of unique copy. Coordinate with marketing for tone.

### Phase C: alt-text fix (1-2 days)

For each img with empty / generic alt:
- If decorative: confirm `alt=""` (no change needed)
- If informational: write descriptive alt (≤125 chars, includes target keyword where relevant)
- For dynamic alts (`alt={item.name}`): no fix needed (CMS-controlled)

## Files

| Path | Type | Why |
|---|---|---|
| `scripts/audit-page-meta.mjs` | new | Phase A enumeration |
| `scripts/audit-alt-text.mjs` | new | Phase A enumeration |
| `scripts/audit-word-count.mjs` | new | Phase A enumeration |
| `docs/audits/2026-05-page-meta.csv` | new artifact | committed audit output |
| `docs/audits/2026-05-alt-text.csv` | new artifact | |
| `docs/audits/2026-05-word-count.csv` | new artifact | |
| `src/lib/getMetaForPath.js` | modify | Phase B tuning |
| 30+ component files | modify | Phase C alt-text |

## Approach trade-off

**Bulk-edit per file (mechanical)** vs **page-by-page rewrite (judgmental)**:
- Mechanical → fast, low quality, may produce keyword-stuffed alts
- Judgmental → slow, high quality, requires content judgment per page

**Recommend: hybrid.** Mechanical script generates a draft based on h1/page-context heuristics, human reviewer (marketing or me) approves/edits. Net: ~2x faster than pure judgment, 90% of the quality.

## Open questions

1. **Marketing review loop.** Each title/description should ideally have marketing sign-off. How heavy is that loop? **Recommend:** batch into 5-page reviews; share a Google Sheet with title/desc/page; mark approved → I bulk-update.
2. **Alt-text length cap.** Google ignores >125 char alts. Some images need more context. **Recommend:** 125 char hard cap; if more context needed, expand the surrounding body copy instead.
3. **Order of phases.** A/B/C are independent — can parallelise. **Recommend:** A first (audit is cheap, surfaces real scope), then B in parallel with C.

## Acceptance criteria

- [ ] Audit CSVs committed showing current state
- [ ] Every canonical page in `STATIC_ROUTES` has non-generic title + description
- [ ] No `<img>` on a canonical page has `alt=""` unless explicitly decorative (commented)
- [ ] No canonical page has <300 words of unique body copy
- [ ] Regression: 757-test suite still passes; no CLS regression

## Effort

A: 1-2 days  ·  B: 3-5 days  ·  C: 1-2 days  ·  Total: ~1-2 weeks elapsed (most is content writing, not code)

## Sequencing

Phase B (page tuning) is **easier** if Spec #15 (SEO admin dashboard) ships first — marketing can self-serve without engineering PRs. Otherwise B requires many code PRs. **Recommend:** ship #15 first, then this spec.
