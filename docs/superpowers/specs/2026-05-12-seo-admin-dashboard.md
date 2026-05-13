# SEO Admin Dashboard — Spec

**Status:** draft
**Author:** assisted via Claude Code
**Date:** 2026-05-12
**Tracking issue:** none yet — open before implementation
**Implementation plan:** TBD (separate `plans/` doc, after this spec is approved)

## Problem

SEO is currently maintained via code edits:
- Per-page titles/descriptions live in `src/lib/getMetaForPath.js` (hard-coded map)
- JSON-LD schemas built in `src/components/seo/jsonLd.js`
- Sitemap entries in `src/lib/seoRoutes.js`
- Canonical redirects in `src/lib/seoRoutes.js#CANONICAL_REDIRECTS` + `api/seoRedirects.js`

Every adjustment requires a developer + a PR + a Cloud Run/Hosting redeploy. Marketing/content team can't iterate on copy without engineering. As Google penalises stale or thin SEO content, this is a bottleneck.

## Goals

Build an admin-only dashboard at `/admin/seo` that lets non-engineers:

1. **Per-page meta editing** — change title, description, ogImage for any canonical route. Live preview of SERP snippet. Save → Firestore → SSR-injected on next page load (or runtime fetch in Seo component).
2. **Per-page JSON-LD overrides** — JSON editor with schema validation for org-wide tweaks (e.g. update prices, ratings, opening hours per page).
3. **Canonical redirects management** — add/remove URL redirects without code edits. Writes to Firestore, read by `api/seoRedirects.js` at request time.
4. **Sitemap monitoring** — show current sitemap entries with last-indexed date (pulled from GSC API), flag stale or 404 entries.
5. **Indexing health snapshot** — pull GSC + Bing Webmaster data: indexed page count, errors, top queries per page. Read-only.

## Non-goals

- Bulk content editing (use the existing CMS for blog/marketplace items)
- Multi-site / multi-locale (single GB site)
- A/B testing of titles/descriptions (out of scope; defer)
- Search Console-style coverage reports (link out to GSC instead)
- AI-generated copy suggestions (Phase 4, separate spec)

## Proposed solution

### Data model (Firestore)

New collection `seo_overrides`:
```
{
  id: "/aircraft/r22",              // doc ID = canonical path
  title: "...",                     // optional override; null = use code default
  description: "...",
  ogImage: "...",
  jsonLdOverrides: { ... },         // partial JSON-LD merged into code defaults
  updatedAt: serverTimestamp,
  updatedBy: userId,
}
```

New collection `seo_redirects`:
```
{
  id: "/old-path",
  to: "/new-path",
  type: "301",
  enabledAt: serverTimestamp,
  createdBy: userId,
}
```

### Read path

- `src/components/seo/Seo.jsx` — on render, query `seo_overrides/<path>`. If present, merge over code defaults. If absent, use code defaults verbatim.
- `api/seoRedirects.js` — at request time, check Firestore `seo_redirects` collection AND in-code `CANONICAL_REDIRECTS`. In-code wins (developer-set redirects are immutable from UI).
- Cache reads at the Cloud Run edge for 5 min to absorb burst.

### Write path

`/admin/seo/edit/:path` page:
- Form fields: title, description, ogImage URL picker, JSON-LD textarea (Monaco editor)
- Save button → Firestore upsert
- Live SERP preview using current values
- Validation: title ≤60 chars, description ≤160 chars, JSON-LD parseable

`/admin/seo/redirects`:
- Table of `seo_redirects`
- Add row: from + to + click save → Firestore add
- Delete with confirm

### Routes & guards

- `/admin/seo` → dashboard index (links to all subviews)
- `/admin/seo/pages` → list of canonical pages, click to edit
- `/admin/seo/pages/:encodedPath` → edit one page
- `/admin/seo/redirects` → manage redirects
- `/admin/seo/sitemap` → sitemap health
- All protected by existing `AdminRoute` guard

## Architecture

```
Marketing user → /admin/seo/...
                ↓
            Firestore: seo_overrides, seo_redirects
                ↓ (on page load by any visitor)
            Seo.jsx queries seo_overrides → merge → Helmet render
                                          ↓
                            (also cached at api/seoMetaInjection.js for SSR-injected HEAD)
```

## Files (new)

| Path | Responsibility |
|---|---|
| `src/pages/admin/AdminSeo.jsx` | Dashboard index |
| `src/pages/admin/AdminSeoPageList.jsx` | List of canonical pages |
| `src/pages/admin/AdminSeoPageEdit.jsx` | Edit one page |
| `src/pages/admin/AdminSeoRedirects.jsx` | Manage redirects |
| `src/pages/admin/AdminSeoSitemap.jsx` | Sitemap health |
| `src/lib/seoOverrides.js` | Firestore client wrapper |
| `firestore.rules` (modify) | Allow admin-only read/write on new collections |
| `api/seoOverrides.js` | (optional) read-path API for SSR injection |

## Files (modify)

| Path | Why |
|---|---|
| `src/components/seo/Seo.jsx` | Merge Firestore override before render |
| `api/seoRedirects.js` | Merge Firestore redirects with in-code map |
| `api/seoMetaInjection.js` | Same merge for server-side HEAD injection |
| `src/components/admin/AdminLayout.jsx` | Add SEO nav link |

## Open questions

1. **Schema validation depth.** JSON-LD has 30+ types. Do we ship a generic JSON editor (developer power-user) or schema-aware forms (slower to build, friendlier)? **Recommend:** generic JSON editor + per-type templates for the 6 schemas we actually use (Organization, LocalBusiness, Product, Article, FAQPage, Course).
2. **Cache invalidation.** Edits in admin should appear in production within ~5 min. Options: (a) Firestore listener in Seo.jsx (real-time but heavy on quota), (b) timed cache + manual "clear cache" admin action. **Recommend:** (b) — timed 5-min cache, "Publish & Clear" button.
3. **Cloud Run SSR-injected meta vs client-side Helmet.** Current `api/seoMetaInjection.js` only fires for Cloud Run-routed requests; Hosting-served static index.html bypasses it. Spec #18 (server meta re-arch) addresses this. **Decision:** ship admin dashboard targeting client-side first; SSR injection becomes a follow-up after #18 lands.
4. **Audit log.** Should every meta edit emit a Firestore audit doc? **Recommend:** yes — minimal `seo_audit_log` collection with `before/after/who/when` for accountability.

## Acceptance criteria

- [ ] Marketing user can change a page's title and see it on production within 5 min
- [ ] Marketing user can add a 301 redirect without engineering involvement
- [ ] Existing code-defined defaults still work when Firestore has no override
- [ ] All admin routes gated behind auth + admin role
- [ ] Audit log shows who changed what when
- [ ] No regression on existing 757-test suite

## Effort estimate

3-5 days for the MVP (per-page meta editing + redirects + audit log). Sitemap monitoring + GSC integration is a separate, smaller follow-up (1-2 days).

## Out of scope (Phase 4 follow-ups)

- AI-generated title/description suggestions (Claude API → suggest, user accepts)
- A/B testing
- Multi-language
- Bulk operations (CSV import)
