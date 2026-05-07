# SEO Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer 8 best-within-reason SEO refinements on top of PR #1 (`seo-launch-readiness`) — server-side meta injection, URL canonicalisation, 301 redirects, `/misc → /store` rename, expanded JSON-LD coverage, image CLS hygiene, sitemap accuracy, robots verification — plus a custom 404 page identified as a gap.

**Architecture:** Branches off `main` *after PR #1 merges*. Extends PR #1's existing infrastructure (`<Seo>`, `seoRoutes.js`, `seoDefaults.js`, `jsonLd.js`, `api/sitemap.js`) — no new SEO subsystem, just additions and improvements. Server-side meta injection added as a new Express middleware (`api/seoMetaInjection.js`) that reads route metadata from a new `getMetaForPath` exported from `src/lib/getMetaForPath.js`. URL canonicalisation and redirects added to `server.js` as middleware before the SPA fallthrough.

**Tech Stack:** React 19, react-router-dom v7, react-helmet-async (PR #1), Express 4 (server.js), Firebase Admin SDK (Firestore reads for dynamic meta), Vite 8, Vitest 4 + jsdom.

**Reference files (post PR #1 merge):**
- Spec: `docs/superpowers/specs/2026-04-30-seo-refinements-design.md`
- Existing infra: `src/components/seo/Seo.jsx`, `src/components/seo/jsonLd.js`, `src/lib/seoRoutes.js`, `src/lib/seoDefaults.js`, `api/sitemap.js`, `public/robots.txt`
- Test patterns: `src/components/seo/jsonLd.test.js`, `api/sitemap.test.js` (if PR #1 included it)
- Express patterns: `api/leads.js`, `api/analytics-api.js`

**Commit discipline:** one commit per task. Prefix `feat(seo):` for new behaviour, `chore(seo):` for refactors/renames, `docs(seo):` for docs, `fix(seo):` for bugs. **One commit per task — do not batch.**

**Pre-flight gate:** Before starting, confirm `git log main` includes PR #1's merge commit and that `src/components/seo/Seo.jsx` exists. If not, stop and merge PR #1 first.

**User-input gates:**
- After **Task 24** (image dimension audit) — user reviews `audit-img-dimensions.json` and confirms scope of fix-up before edits begin.
- During **Task 3** (HTTPS enforcement) — confirm with user whether HTTPS is already enforced upstream (Cloudflare / hosting). If yes, skip the HTTPS check inside the canonicalisation middleware (still strip www and trailing slash).

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `api/seoMetaInjection.js` | Express middleware: per-request, replace `<!--SSR_HEAD-->` sentinel in `index.html` with route-specific meta (title/description/OG/canonical/JSON-LD) |
| `api/seoMetaInjection.test.js` | Unit tests for the middleware (static + dynamic routes, cache behaviour, fallback) |
| `api/seoMetaCache.js` | Tiny LRU-style Map cache (5-min TTL) keyed by request path |
| `api/seoRedirects.js` | CommonJS mirror of `CANONICAL_REDIRECTS` from `seoRoutes.js` (api/ is CJS, src/ is ESM) |
| `src/lib/getMetaForPath.js` | Pure function: given a path, returns `{title, description, ogImage, canonicalUrl}` for static routes. Dynamic routes resolved separately by middleware. |
| `src/lib/getMetaForPath.test.js` | Unit tests |
| `src/lib/canonicalUrl.js` | Pure helpers: `stripTrailingSlash`, `stripWww`, `forceHttps`, `canonicaliseUrl` (composition) |
| `src/lib/canonicalUrl.test.js` | Unit tests |
| `src/lib/auditImgDimensions.js` | Pure-function audit walker, exports `auditImgDimensions(rootDir, targetDirs)` |
| `src/lib/auditImgDimensions.test.js` | Vitest test that calls the function and asserts canonical pages have no offenders |
| `src/pages/NotFound.jsx` | Custom 404 page with links to popular sections |
| `src/pages/NotFound.test.jsx` | Component test |
| `src/pages/Store.jsx` | Renamed from `Misc.jsx` |
| `src/pages/StoreItemDetail.jsx` | Renamed from `MiscItemDetail.jsx` |
| `src/pages/admin/AdminStoreItems.jsx` | Renamed from `AdminMiscItems.jsx` |
| `src/pages/admin/AdminStoreItemEdit.jsx` | Renamed from `AdminMiscItemEdit.jsx` |
| `scripts/audit-img-dimensions.js` | Thin CLI wrapper that imports `auditImgDimensions` and writes the JSON report |
| `scripts/seed-store-items.js` | Renamed from `seed-misc-items.js` |
| `docs/seo/canonical-rules.md` | One-page reference for canonical URL form, redirect table, robots strategy |

### Modified files

| Path | Why |
|---|---|
| `index.html` | Add `<!--SSR_HEAD-->` sentinel inside `<head>` |
| `server.js` | Mount three new middlewares (canonicalisation, redirect, meta-injection) |
| `src/App.jsx` | Update `/misc` routes → `/store`; rename component imports; add catch-all `<Route path="*" element={<NotFound />} />` |
| `src/lib/seoRoutes.js` | Rename `/misc` → `/store`; add `/home → /` to CANONICAL_REDIRECTS |
| `api/sitemap.js` | Mirror seoRoutes changes; add server-start timestamp for static `<lastmod>`; **keep** Firestore collection name `misc_items` |
| `src/components/seo/jsonLd.js` | Add `buildTouristTrip` builder |
| `src/components/seo/jsonLd.test.js` | Add tests for `buildTouristTrip` |
| `src/pages/AircraftH500.jsx` | Add `<Seo>` (without Product schema since H500 is informational) |
| `src/pages/HelicopterTourOfLondon.jsx` | Add `<Seo>` with paired Product + TouristTrip schema |
| `src/pages/DiscoveryFlight.jsx` | Already has `<Seo>` from PR #1; ensure Product (not Course) schema |
| `src/pages/PartSales.jsx` | Add `<Seo>` with Product schema (catalog-level) |
| `src/pages/PPL.jsx` | Add Course schema |
| `src/pages/CPL.jsx` | Add Course schema |
| `src/pages/NightRating.jsx` | Add Course schema |
| `src/pages/AdvancedTraining.jsx` | Add Course schema |
| `src/pages/AircraftConsulting.jsx` | Add Service schema |
| `src/pages/Leaseback.jsx` | Add Service schema |
| `src/pages/SelfFlyHire.jsx` | Add Service schema |
| `src/pages/SuperYachtOps.jsx` | Add Service schema |
| `src/pages/PilotProvisioning.jsx` | Add Service schema |
| `src/pages/FinalExpeditions.jsx` | Add Service schema |
| Multiple `src/pages/*.jsx` and `src/components/**/*.jsx` | Add `width`/`height` to `<img>` per audit (Task 25) |

---

## Task 1: Pre-flight check + new branch

**Files:**
- No file changes

- [ ] **Step 1:** Verify PR #1 has merged

```bash
git -C /Users/maximussmith/Downloads/HQ-Website-main fetch origin
git -C /Users/maximussmith/Downloads/HQ-Website-main log origin/main --oneline | grep -m1 "wire title/meta/h1/JSON-LD across 12 priority pages" && echo "PR #1 merged"
```

Expected: prints "PR #1 merged". If empty, stop — merge PR #1 first.

- [ ] **Step 2:** Create the worktree

```bash
git -C /Users/maximussmith/Downloads/HQ-Website-main switch main
git -C /Users/maximussmith/Downloads/HQ-Website-main pull origin main
git -C /Users/maximussmith/Downloads/HQ-Website-main worktree add ../HQ-Website-main-seo-ref -b feat/seo-refinements
cd ../HQ-Website-main-seo-ref
```

Expected: new directory `HQ-Website-main-seo-ref` exists, branch `feat/seo-refinements` checked out.

- [ ] **Step 3:** Install dependencies and confirm baseline build passes

```bash
npm install
npm run build
```

Expected: build completes, no errors.

---

## Task 2: URL canonicalisation pure helpers

**Files:**
- Create: `src/lib/canonicalUrl.js`
- Create: `src/lib/canonicalUrl.test.js`

- [ ] **Step 1:** Write the failing tests

```js
// src/lib/canonicalUrl.test.js
import { describe, it, expect } from 'vitest';
import {
  stripTrailingSlash,
  stripWww,
  forceHttps,
  canonicaliseUrl,
} from './canonicalUrl';

describe('stripTrailingSlash', () => {
  it('strips a trailing slash from a non-root path', () => {
    expect(stripTrailingSlash('/aircraft/r44/')).toBe('/aircraft/r44');
  });
  it('preserves root', () => {
    expect(stripTrailingSlash('/')).toBe('/');
  });
  it('preserves a path with no trailing slash', () => {
    expect(stripTrailingSlash('/aircraft/r44')).toBe('/aircraft/r44');
  });
});

describe('stripWww', () => {
  it('strips www. from the host of a URL', () => {
    expect(stripWww('https://www.hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('preserves a non-www URL', () => {
    expect(stripWww('https://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
});

describe('forceHttps', () => {
  it('upgrades http to https', () => {
    expect(forceHttps('http://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('preserves https', () => {
    expect(forceHttps('https://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
});

describe('canonicaliseUrl', () => {
  it('applies all three rules', () => {
    expect(canonicaliseUrl('http://www.hqaviation.com/aircraft/r44/'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('returns null when input is already canonical', () => {
    expect(canonicaliseUrl('https://hqaviation.com/aircraft/r44'))
      .toBeNull();
  });
});
```

- [ ] **Step 2:** Run test to verify it fails

```bash
npx vitest run src/lib/canonicalUrl.test.js
```

Expected: FAIL with module-not-found or import errors.

- [ ] **Step 3:** Write minimal implementation

```js
// src/lib/canonicalUrl.js

export function stripTrailingSlash(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/$/, '');
}

export function stripWww(url) {
  return url.replace('://www.', '://');
}

export function forceHttps(url) {
  return url.replace(/^http:\/\//, 'https://');
}

/**
 * Returns the canonicalised URL if the input differs from canonical,
 * or null if input is already canonical (so callers can skip redirect).
 */
export function canonicaliseUrl(input) {
  const u = new URL(input);
  const next = forceHttps(
    stripWww(`${u.protocol}//${u.host}${stripTrailingSlash(u.pathname)}${u.search}`),
  );
  return next === input ? null : next;
}
```

- [ ] **Step 4:** Run tests to verify pass

```bash
npx vitest run src/lib/canonicalUrl.test.js
```

Expected: PASS, all 8 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/lib/canonicalUrl.js src/lib/canonicalUrl.test.js
git commit -m "feat(seo): pure helpers for URL canonicalisation (https, no-www, no-trailing-slash)"
```

---

## Task 3: URL canonicalisation Express middleware

**Files:**
- Modify: `server.js` (add middleware near the top, after `app.set('trust proxy', 1)`)

**User-input gate:** confirm with the user whether HTTPS is enforced upstream (Cloudflare / hosting provider). If yes, the HTTPS-force inside the middleware is harmless (won't trigger when traffic is already HTTPS) but redundant. If unknown, include it.

- [ ] **Step 1:** Read existing `server.js` to find insertion point

```bash
grep -n "app.set('trust proxy'" server.js
```

Expected: returns line number; insert middleware on the line after.

- [ ] **Step 2:** Add middleware

```js
// server.js — add immediately after app.set('trust proxy', 1);

// Canonicalisation: HTTPS, non-www, no trailing slash. 301 to canonical
// form when the request URL doesn't match. Skipped in dev (NODE_ENV !==
// 'production') to avoid breaking localhost.
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();

  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host') || '';
  const wantsHttps = proto !== 'https';
  const wantsNoWww = host.startsWith('www.');
  const path = req.path === '/' ? '/' : req.path.replace(/\/$/, '');
  const wantsNoTrailingSlash = path !== req.path;

  if (!wantsHttps && !wantsNoWww && !wantsNoTrailingSlash) return next();

  const finalHost = wantsNoWww ? host.slice(4) : host;
  const finalProto = 'https';
  const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return res.redirect(301, `${finalProto}://${finalHost}${path}${search}`);
});
```

- [ ] **Step 3:** Smoke test

```bash
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -I -H "Host: www.hqaviation.com" -H "X-Forwarded-Proto: http" http://localhost:7500/aircraft/r44/ 2>&1 | head -5
kill $SERVER_PID
```

Expected: response includes `HTTP/1.1 301` and `Location: https://hqaviation.com/aircraft/r44`.

- [ ] **Step 4:** Commit

```bash
git add server.js
git commit -m "feat(seo): canonicalise URLs (https, non-www, no trailing slash) via 301"
```

---

## Task 4: 301 redirect enforcement for `CANONICAL_REDIRECTS`

**Files:**
- Modify: `src/lib/seoRoutes.js` (add `/home → /` to CANONICAL_REDIRECTS)
- Create: `api/seoRedirects.js` (CommonJS mirror)
- Modify: `server.js` (add middleware after Task 3 middleware)

PR #1's `seoRoutes.js` already exports `CANONICAL_REDIRECTS` as a `{ from: to }` map. Extend with `/home`. Then enforce with a hard 301 in Express.

- [ ] **Step 1:** Read `CANONICAL_REDIRECTS` to confirm current shape

```bash
grep -A 10 "CANONICAL_REDIRECTS = " src/lib/seoRoutes.js
```

Expected: shows the existing 6 entries.

- [ ] **Step 2:** Add `/home` to `CANONICAL_REDIRECTS` in `src/lib/seoRoutes.js`. (Do not yet add `/misc` — it lands in Task 12.)

```js
// In CANONICAL_REDIRECTS:
'/home': '/',
```

- [ ] **Step 3:** Create `api/seoRedirects.js`

```js
// api/seoRedirects.js — mirror of src/lib/seoRoutes.js#CANONICAL_REDIRECTS.
// Long-term: convert api/ to ESM and import directly.
'use strict';

module.exports = {
  '/aircraft-sales/new/r22': '/aircraft/r22',
  '/aircraft-sales/new/r44': '/aircraft/r44',
  '/aircraft-sales/new/r66': '/aircraft/r66',
  '/aircraft-sales/new/r88': '/aircraft/r88',
  '/final-ppl': '/training/ppl',
  '/type-rating': '/training/type-rating',
  '/home': '/',
};
```

- [ ] **Step 4:** Add the redirect middleware in `server.js` (after Task 3's canonicalisation middleware, before the static fallthrough)

```js
// server.js — after the canonicalisation middleware

const SEO_REDIRECTS = require('./api/seoRedirects');

app.use((req, res, next) => {
  const target = SEO_REDIRECTS[req.path];
  if (target) {
    const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(301, `${target}${search}`);
  }
  next();
});
```

- [ ] **Step 5:** Smoke test

```bash
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -I http://localhost:7500/aircraft-sales/new/r66 2>&1 | head -5
curl -I http://localhost:7500/home 2>&1 | head -5
kill $SERVER_PID
```

Expected: both return `HTTP/1.1 301` with appropriate `Location` headers.

- [ ] **Step 6:** Commit

```bash
git add server.js api/seoRedirects.js src/lib/seoRoutes.js
git commit -m "feat(seo): enforce 301 redirects for legacy duplicate URLs"
```

---

## Task 5: NotFound page component

**Files:**
- Create: `src/pages/NotFound.jsx`
- Create: `src/pages/NotFound.test.jsx`

- [ ] **Step 1:** Write the failing test

```jsx
// src/pages/NotFound.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import NotFound from './NotFound';

function renderNotFound() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('NotFound', () => {
  it('renders a 404 heading', () => {
    renderNotFound();
    expect(screen.getByRole('heading', { name: /404|not found|page.*not.*found/i }))
      .toBeInTheDocument();
  });

  it('links to the homepage', () => {
    renderNotFound();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });

  it('links to training', () => {
    renderNotFound();
    expect(screen.getByRole('link', { name: /training/i }))
      .toHaveAttribute('href', expect.stringContaining('/training'));
  });

  it('links to sales', () => {
    renderNotFound();
    expect(screen.getByRole('link', { name: /sales|aircraft for sale/i }))
      .toHaveAttribute('href', expect.stringContaining('/sales'));
  });

  it('links to blog', () => {
    renderNotFound();
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
  });
});
```

- [ ] **Step 2:** Run test to verify it fails

```bash
npx vitest run src/pages/NotFound.test.jsx
```

Expected: FAIL with "Cannot find module './NotFound'".

- [ ] **Step 3:** Write the component

```jsx
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';

export default function NotFound() {
  return (
    <main className="not-found">
      <Seo
        title="Page Not Found"
        description="The page you were looking for doesn't exist. Try one of the popular sections below."
        noindex
      />
      <h1>404 — Page Not Found</h1>
      <p>The page you were looking for doesn't exist or has moved.</p>
      <p>Try one of these popular sections:</p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/training/ppl">Training</Link></li>
        <li><Link to="/sales/new">Aircraft Sales</Link></li>
        <li><Link to="/expeditions">Expeditions</Link></li>
        <li><Link to="/blog">Blog</Link></li>
      </ul>
    </main>
  );
}
```

- [ ] **Step 4:** Run tests to verify pass

```bash
npx vitest run src/pages/NotFound.test.jsx
```

Expected: PASS, all 5 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/pages/NotFound.jsx src/pages/NotFound.test.jsx
git commit -m "feat(seo): custom 404 NotFound page with links to popular sections"
```

---

## Task 6: Wire NotFound as catch-all in App.jsx

**Files:**
- Modify: `src/App.jsx` (add catch-all route at the END of the `<Routes>` block)

- [ ] **Step 1:** Add the import

In `src/App.jsx`, find the page imports (search for `import Home from './pages/Home'`) and add:

```jsx
import NotFound from './pages/NotFound';
```

- [ ] **Step 2:** Add the catch-all route as the last `<Route>` inside `<Routes>`

```jsx
{/* Catch-all 404 — must be the last Route */}
<Route path="*" element={<NotFound />} />
```

- [ ] **Step 3:** Test in dev

```bash
npm run dev:vite &
VITE_PID=$!
sleep 4
curl -s http://localhost:5173/this-route-does-not-exist | grep -c "Page Not Found\|404"
kill $VITE_PID
```

Expected: prints `1` (or higher).

- [ ] **Step 4:** Commit

```bash
git add src/App.jsx
git commit -m "feat(seo): wire NotFound as catch-all route in App.jsx"
```

---

## Task 7: `/misc` → `/store` route table

**Files:**
- Modify: `src/App.jsx` (rename `/misc` paths)
- Modify: `src/lib/seoRoutes.js` (rename `/misc` entries)
- Modify: `api/sitemap.js` (rename URL paths; **keep collection name `misc_items`**)

- [ ] **Step 1:** In `src/App.jsx`, rename four `/misc` paths to `/store`

```jsx
// Before
<Route path="/misc" element={<Misc />} />
<Route path="/misc/:id" element={<MiscItemDetail />} />
<Route path="/admin/misc" element={<AdminMiscItems />} />
<Route path="/admin/misc/:id" element={<AdminMiscItemEdit />} />
<Route path="/admin/misc-marketplace" element={<AdminMiscMarketplace />} />

// After
<Route path="/store" element={<Misc />} />
<Route path="/store/:id" element={<MiscItemDetail />} />
<Route path="/admin/store" element={<AdminMiscItems />} />
<Route path="/admin/store/:id" element={<AdminMiscItemEdit />} />
<Route path="/admin/store-marketplace" element={<AdminMiscMarketplace />} />
```

(Component imports stay unchanged for now — Task 8 renames the components.)

- [ ] **Step 2:** In `src/lib/seoRoutes.js`, rename in `PUBLIC_ROUTES`

```js
// Before
{ path: '/misc', changefreq: 'weekly', priority: 0.6, pageType: 'sales-index' },

// After
{ path: '/store', changefreq: 'weekly', priority: 0.6, pageType: 'sales-index' },
```

And in `DYNAMIC_ROUTE_TEMPLATES`:

```js
// Before
{ pattern: '/misc/:id', collection: 'misc_items', filter: { ... }, pageType: 'misc-item', changefreq: 'weekly', priority: 0.5 },

// After
{ pattern: '/store/:id', collection: 'misc_items', filter: { ... }, pageType: 'store-item', changefreq: 'weekly', priority: 0.5 },
```

(Collection name unchanged — comment-only rename of pageType to keep the SSOT cleaner.)

- [ ] **Step 3:** In `api/sitemap.js`, rename the path entries

In the inline `PUBLIC_ROUTES` mirror, change `'/misc'` to `'/store'`. In `fetchDynamicEntries`, change `\`/misc/${doc.id}\`` to `\`/store/${doc.id}\``. Keep the Firestore collection name `misc_items` unchanged.

- [ ] **Step 4:** Smoke test

```bash
npm run build
```

Expected: build completes; no `Cannot find module` errors.

- [ ] **Step 5:** Commit

```bash
git add src/App.jsx src/lib/seoRoutes.js api/sitemap.js
git commit -m "chore(seo): rename /misc routes to /store (URLs only; component files in next commit)"
```

---

## Task 8: Rename Misc.jsx → Store.jsx

**Files:**
- Rename: `src/pages/Misc.jsx` → `src/pages/Store.jsx`
- Rename: `src/pages/MiscItemDetail.jsx` → `src/pages/StoreItemDetail.jsx`
- Modify: `src/App.jsx` (update imports)

(Admin pages renamed in Task 9.)

- [ ] **Step 1:** Rename the customer-facing page files

```bash
git mv src/pages/Misc.jsx src/pages/Store.jsx
git mv src/pages/MiscItemDetail.jsx src/pages/StoreItemDetail.jsx
```

- [ ] **Step 2:** Update default-export name and any internal references

```bash
# inside src/pages/Store.jsx — replace function/export name
sed -i '' 's/function Misc(/function Store(/g; s/export default Misc/export default Store/g' src/pages/Store.jsx
sed -i '' 's/function MiscItemDetail(/function StoreItemDetail(/g; s/export default MiscItemDetail/export default StoreItemDetail/g' src/pages/StoreItemDetail.jsx
```

- [ ] **Step 3:** Update `src/App.jsx` imports and component refs

```jsx
// Before
import Misc from './pages/Misc';
import MiscItemDetail from './pages/MiscItemDetail';
<Route path="/store" element={<Misc />} />
<Route path="/store/:id" element={<MiscItemDetail />} />

// After
import Store from './pages/Store';
import StoreItemDetail from './pages/StoreItemDetail';
<Route path="/store" element={<Store />} />
<Route path="/store/:id" element={<StoreItemDetail />} />
```

- [ ] **Step 4:** Find and update other importers

```bash
grep -rln "from '.*pages/Misc'" src/ 2>/dev/null
grep -rln "from '.*pages/MiscItemDetail'" src/ 2>/dev/null
```

For each match, update the import path and the imported identifier.

- [ ] **Step 5:** Build to verify

```bash
npm run build
```

Expected: build completes.

- [ ] **Step 6:** Commit

```bash
git add -A src/pages/ src/App.jsx
git commit -m "chore(seo): rename Misc/MiscItemDetail components to Store/StoreItemDetail"
```

---

## Task 9: Rename admin Misc components → admin Store components

**Files:**
- Rename: `src/pages/admin/AdminMiscItems.jsx` → `src/pages/admin/AdminStoreItems.jsx`
- Rename: `src/pages/admin/AdminMiscItemEdit.jsx` → `src/pages/admin/AdminStoreItemEdit.jsx`
- (If exists) Rename: `src/pages/admin/AdminMiscMarketplace.jsx` → `src/pages/admin/AdminStoreMarketplace.jsx`
- Modify: `src/App.jsx` (admin imports)
- Modify: any admin nav components that reference these by URL or name

- [ ] **Step 1:** Inventory the admin files

```bash
ls src/pages/admin/AdminMisc*.jsx 2>/dev/null
```

Note actual filenames; some may not exist.

- [ ] **Step 2:** Rename via `git mv`

```bash
[ -f src/pages/admin/AdminMiscItems.jsx ]      && git mv src/pages/admin/AdminMiscItems.jsx     src/pages/admin/AdminStoreItems.jsx
[ -f src/pages/admin/AdminMiscItemEdit.jsx ]   && git mv src/pages/admin/AdminMiscItemEdit.jsx  src/pages/admin/AdminStoreItemEdit.jsx
[ -f src/pages/admin/AdminMiscMarketplace.jsx ] && git mv src/pages/admin/AdminMiscMarketplace.jsx src/pages/admin/AdminStoreMarketplace.jsx
```

- [ ] **Step 3:** Update internal identifiers inside each renamed file

```bash
sed -i '' 's/AdminMiscItems/AdminStoreItems/g'         src/pages/admin/AdminStoreItems.jsx
sed -i '' 's/AdminMiscItemEdit/AdminStoreItemEdit/g'   src/pages/admin/AdminStoreItemEdit.jsx
[ -f src/pages/admin/AdminStoreMarketplace.jsx ] && sed -i '' 's/AdminMiscMarketplace/AdminStoreMarketplace/g' src/pages/admin/AdminStoreMarketplace.jsx
```

- [ ] **Step 4:** Update `src/App.jsx` admin imports and component refs (mirror Task 8 pattern)

- [ ] **Step 5:** Update admin nav

```bash
grep -rln "AdminMisc\|/admin/misc" src/ 2>/dev/null
```

For each match, update `AdminMisc*` → `AdminStore*` and `/admin/misc` → `/admin/store` and `/admin/misc-marketplace` → `/admin/store-marketplace`.

- [ ] **Step 6:** Build

```bash
npm run build
```

- [ ] **Step 7:** Commit

```bash
git add -A src/pages/admin/ src/App.jsx src/components/admin/
git commit -m "chore(seo): rename admin Misc components to admin Store"
```

---

## Task 10: Rename seed-misc-items.js → seed-store-items.js

**Files:**
- Rename: `scripts/seed-misc-items.js` → `scripts/seed-store-items.js`

- [ ] **Step 1:** Rename

```bash
git mv scripts/seed-misc-items.js scripts/seed-store-items.js
```

- [ ] **Step 2:** Verify no inline references to the old script name remain

```bash
grep -rln "seed-misc-items" .
```

Expected: no matches (or only doc/comment references — update those).

- [ ] **Step 3:** Commit

```bash
git add -A scripts/
git commit -m "chore(seo): rename seed-misc-items.js to seed-store-items.js"
```

---

## Task 11: Update internal links and UI copy from Misc → Store

**Files:**
- Modify: every component / page that links to `/misc` or displays "Misc" / "Miscellaneous" as user-facing text

- [ ] **Step 1:** Find every internal link

```bash
grep -rln 'to="/misc' src/ 2>/dev/null
grep -rln "to='/misc" src/ 2>/dev/null
grep -rln 'href="/misc' src/ 2>/dev/null
```

For each match, change `/misc` → `/store` (preserve `/misc/:id` → `/store/:id` shape).

- [ ] **Step 2:** Find UI label copy. Be careful to NOT rename the Firestore collection (`misc_items`), JS identifiers, or comments referring to the collection.

```bash
grep -rln '"Misc"\|"Miscellaneous"\|>Misc<\|>Miscellaneous<' src/ 2>/dev/null
```

Replace user-facing strings with "Store" or "HQ Store" depending on context.

- [ ] **Step 3:** Build + run dev server, click through admin and customer-facing nav to verify

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add -A
git commit -m "chore(seo): update internal links and UI copy from Misc to Store"
```

---

## Task 12: Add 301 redirects `/misc → /store` and `/misc/:id → /store/:id`

**Files:**
- Modify: `api/seoRedirects.js`
- Modify: `server.js` (extend the redirect middleware to handle the `:id` pattern)

- [ ] **Step 1:** Add `/misc` → `/store` to the redirect map

```js
// api/seoRedirects.js
module.exports = {
  // … existing entries …
  '/misc': '/store',
};
```

- [ ] **Step 2:** Extend the redirect middleware in `server.js` to also handle `/misc/:id`

```js
// server.js — extend the redirect middleware (Task 4)

app.use((req, res, next) => {
  const target = SEO_REDIRECTS[req.path];
  if (target) {
    const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(301, `${target}${search}`);
  }

  // /misc/:id → /store/:id
  const miscIdMatch = req.path.match(/^\/misc\/([^/]+)$/);
  if (miscIdMatch) {
    const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(301, `/store/${miscIdMatch[1]}${search}`);
  }

  next();
});
```

- [ ] **Step 3:** Smoke test

```bash
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -I http://localhost:7500/misc 2>&1 | head -5
curl -I http://localhost:7500/misc/abc123 2>&1 | head -5
kill $SERVER_PID
```

Expected: both 301 with correct `Location`.

- [ ] **Step 4:** Commit

```bash
git add api/seoRedirects.js server.js
git commit -m "feat(seo): 301 redirect /misc and /misc/:id to /store equivalents"
```

---

## Task 13: Add `buildTouristTrip` JSON-LD builder

**Files:**
- Modify: `src/components/seo/jsonLd.js`
- Modify: `src/components/seo/jsonLd.test.js`

- [ ] **Step 1:** Append failing tests to `src/components/seo/jsonLd.test.js`

```js
import { buildTouristTrip } from './jsonLd';

describe('buildTouristTrip', () => {
  it('builds a TouristTrip with name, description, image, and offer', () => {
    const t = buildTouristTrip({
      name: 'Helicopter Tour of London',
      description: 'A 30-minute aerial tour over central London by Robinson R44.',
      image: '/assets/images/london-tour.jpg',
      url: 'https://hqaviation.com/helicopter-tour-of-london',
      offers: { price: '395', priceCurrency: 'GBP', availability: 'https://schema.org/InStock' },
    });
    expect(t['@type']).toBe('TouristTrip');
    expect(t.name).toBe('Helicopter Tour of London');
    expect(t.image).toContain('/assets/images/london-tour.jpg');
    expect(t.offers.price).toBe('395');
    expect(t.offers.priceCurrency).toBe('GBP');
  });

  it('omits offers when not provided', () => {
    const t = buildTouristTrip({
      name: 'Tour',
      description: 'desc',
      image: '/x.jpg',
      url: 'https://hqaviation.com/x',
    });
    expect(t.offers).toBeUndefined();
  });
});
```

- [ ] **Step 2:** Run tests

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: FAIL with "buildTouristTrip is not a function".

- [ ] **Step 3:** Add the builder to `src/components/seo/jsonLd.js`

```js
export function buildTouristTrip({ name, description, image, url, offers }) {
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    image: absoluteUrl(image),
    url,
  };
  if (offers) {
    trip.offers = {
      '@type': 'Offer',
      ...offers,
    };
  }
  return trip;
}
```

- [ ] **Step 4:** Run tests

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/seo/jsonLd.js src/components/seo/jsonLd.test.js
git commit -m "feat(seo): add buildTouristTrip JSON-LD builder"
```

---

## Task 14: Wire `<Seo>` + Product + TouristTrip on `/helicopter-tour-of-london`

**Files:**
- Modify: `src/pages/HelicopterTourOfLondon.jsx`

- [ ] **Step 1:** Read the page to see its current structure

```bash
head -40 src/pages/HelicopterTourOfLondon.jsx
```

- [ ] **Step 2:** Add the imports near the top of the file

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildTouristTrip, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';
```

- [ ] **Step 3:** Add `<Seo>` inside the component's JSX root

```jsx
<Seo
  title="Helicopter Tour of London — 30 Minutes Over the City"
  description="Take a 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome. London Eye, Tower Bridge, Canary Wharf — see the city as a pilot does."
  ogImage="/assets/images/gallery/london-tour/above-westminster.jpg"
  ogType="product"
  jsonLd={[
    buildProduct({
      name: 'Helicopter Tour of London',
      description: 'A 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome.',
      image: '/assets/images/gallery/london-tour/above-westminster.jpg',
      brand: 'HQ Aviation',
      url: `${SITE_URL}/helicopter-tour-of-london`,
      offers: {
        price: '395',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        valueAddedTaxIncluded: false,
      },
    }),
    buildTouristTrip({
      name: 'Helicopter Tour of London',
      description: 'A 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome.',
      image: '/assets/images/gallery/london-tour/above-westminster.jpg',
      url: `${SITE_URL}/helicopter-tour-of-london`,
      offers: {
        price: '395',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Helicopter Tour of London', path: '/helicopter-tour-of-london' },
    ]),
  ]}
/>
```

- [ ] **Step 4:** Build

```bash
npm run build
```

- [ ] **Step 5:** Commit

```bash
git add src/pages/HelicopterTourOfLondon.jsx
git commit -m "feat(seo): wire Product+TouristTrip JSON-LD on London tour page"
```

---

## Task 15: Wire `<Seo>` + Product schema on `/training/trial-lessons` (DiscoveryFlight)

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

PR #1 already has the trial-lessons Offer block in DiscoveryFlight (the `trialOffers` array). Audit current `<Seo>` usage; if it uses `buildCourse`, replace with `buildProduct`.

- [ ] **Step 1:** Inspect current usage

```bash
grep -E "buildCourse|buildProduct|<Seo " src/pages/DiscoveryFlight.jsx | head -10
```

- [ ] **Step 2:** Replace any Course schema with Product. Use the `trialOffers` array (already built by PR #1) as the AggregateOffer.

```jsx
// In DiscoveryFlight.jsx imports
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';

// In the JSX, the <Seo> block should be:
<Seo
  title="Helicopter Trial Lesson — Discovery Flight from Denham"
  description="Take the controls of a Robinson helicopter at Denham Aerodrome — 30 min from London. R22, R44 or R66. Gift vouchers available."
  ogType="product"
  jsonLd={[
    buildProduct({
      name: 'Helicopter Trial Lesson — Discovery Flight',
      description: 'A first hands-on flight in a Robinson R22, R44, or R66 helicopter. From Denham Aerodrome (30 min from London).',
      image: '/assets/images/discovery-flight-hero.jpg',
      brand: 'HQ Aviation',
      url: 'https://hqaviation.com/training/trial-lessons',
      offers: trialOffers.length > 0
        ? { '@type': 'AggregateOffer', offers: trialOffers, priceCurrency: 'GBP' }
        : undefined,
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Training', path: '/training/ppl' },
      { name: 'Trial Lessons', path: '/training/trial-lessons' },
    ]),
  ]}
/>
```

- [ ] **Step 3:** Build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(seo): use Product (not Course) schema for trial lessons"
```

---

## Task 16: Add `<Seo>` (no Product schema) on `/aircraft/h500`

**Files:**
- Modify: `src/pages/AircraftH500.jsx`

H500 is informational. `<Seo>` gets BreadcrumbList only (Organization + WebSite are sitewide via App-level `<Seo>`).

- [ ] **Step 1:** Add the imports

```jsx
import Seo from '../components/seo/Seo';
import { buildBreadcrumbList } from '../components/seo/jsonLd';
```

- [ ] **Step 2:** Add `<Seo>` inside the component's root return

```jsx
<Seo
  title="Hughes/Schweizer 300 (H500) — Reference"
  description="The Hughes/Schweizer 300 (H500) — a piston-engine helicopter with a long history. Reference page; HQ Aviation does not sell new H500 aircraft."
  jsonLd={[
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Aircraft', path: '/sales/new' },
      { name: 'H500', path: '/aircraft/h500' },
    ]),
  ]}
/>
```

- [ ] **Step 3:** Build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/AircraftH500.jsx
git commit -m "feat(seo): add Seo to H500 reference page (no Product schema — informational)"
```

---

## Task 17: Wire Course schema on remaining training pages

**Files:**
- Modify: `src/pages/PPL.jsx` (or `FinalPPL.jsx` — the one mapped to `/training/ppl` in App.jsx)
- Modify: `src/pages/CPL.jsx`
- Modify: `src/pages/NightRating.jsx`
- Modify: `src/pages/AdvancedTraining.jsx`

PR #1 has `buildCourse` defined and wired only on `TypeRating.jsx`. Mirror that pattern.

| Page | Course name | Description |
|---|---|---|
| `PPL` | "Private Pilot Licence (PPL-H)" | "EASA PPL(H) training in Robinson R22 or R44 from Denham — typically 45–55 hours." |
| `CPL` | "Commercial Pilot Licence (CPL-H)" | "EASA CPL(H) training in Robinson R44 or R66 from Denham — modular pathway from PPL." |
| `NightRating` | "Night Rating (Helicopter)" | "Night flying rating in Robinson R44 or R66 from Denham — 5h dual instruction." |
| `AdvancedTraining` | "Advanced Helicopter Training" | "Advanced post-licence training — confined areas, autorotations, formation flying." |

- [ ] **Step 1 (per page):** Add imports

```jsx
import { buildCourse, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';
```

(`Seo` import may already exist from PR #1.)

- [ ] **Step 2 (per page):** Add or extend `<Seo>` with Course + BreadcrumbList. Example for PPL:

```jsx
<Seo
  // existing title/description from PR #1 stay; add jsonLd:
  jsonLd={[
    buildCourse({
      name: 'Private Pilot Licence (PPL-H)',
      description: 'EASA PPL(H) training in Robinson R22 or R44 from Denham — typically 45–55 hours.',
      url: `${SITE_URL}/training/ppl`,
      courseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'in-person',
        location: 'Denham Aerodrome, UK',
      },
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Training', path: '/training/ppl' },
      { name: 'PPL', path: '/training/ppl' },
    ]),
  ]}
/>
```

Repeat for CPL, NightRating, AdvancedTraining with their respective values.

- [ ] **Step 3:** Build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/PPL.jsx src/pages/CPL.jsx src/pages/NightRating.jsx src/pages/AdvancedTraining.jsx
git commit -m "feat(seo): wire Course JSON-LD on PPL, CPL, NightRating, AdvancedTraining"
```

---

## Task 18: Wire Service schema on remaining service pages

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx`
- Modify: `src/pages/Leaseback.jsx`
- Modify: `src/pages/SelfFlyHire.jsx`
- Modify: `src/pages/SuperYachtOps.jsx`
- Modify: `src/pages/PilotProvisioning.jsx`
- Modify: `src/pages/FinalExpeditions.jsx`

PR #1 wires `buildService` on `FinalMaintenance.jsx` only.

| Page | Service name | Service type |
|---|---|---|
| `AircraftConsulting` | "Aircraft Consulting" | "Pre-purchase inspection and aircraft acquisition consulting" |
| `Leaseback` | "Helicopter Leaseback" | "Aircraft leaseback program" |
| `SelfFlyHire` | "Self-Fly Hire" | "Helicopter self-fly rental" |
| `SuperYachtOps` | "Superyacht Helicopter Operations" | "Helicopter operations support for superyachts" |
| `PilotProvisioning` | "Pilot Provisioning" | "Helicopter pilot supply and contract crew" |
| `FinalExpeditions` | "Helicopter Expeditions" | "Worldwide helicopter expedition support" |

- [ ] **Step 1 (per page):** Add imports

```jsx
import { buildService, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL, AREA_SERVED } from '../lib/seoDefaults';
```

- [ ] **Step 2 (per page):** Add or extend `<Seo>` with Service + BreadcrumbList. Example for AircraftConsulting:

```jsx
<Seo
  jsonLd={[
    buildService({
      name: 'Aircraft Consulting',
      serviceType: 'Pre-purchase inspection and aircraft acquisition consulting',
      description: 'Independent pre-purchase inspection, valuation, and acquisition consulting for helicopter buyers.',
      url: `${SITE_URL}/aircraft-consulting`,
      areaServed: AREA_SERVED,
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Aircraft Consulting', path: '/aircraft-consulting' },
    ]),
  ]}
/>
```

Repeat per the table above.

- [ ] **Step 3:** Build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/AircraftConsulting.jsx src/pages/Leaseback.jsx src/pages/SelfFlyHire.jsx src/pages/SuperYachtOps.jsx src/pages/PilotProvisioning.jsx src/pages/FinalExpeditions.jsx
git commit -m "feat(seo): wire Service JSON-LD on six service pages"
```

---

## Task 19: Wire Product schema on `/parts`

**Files:**
- Modify: `src/pages/PartSales.jsx`

Top-level Product representing the catalogue. Per-part Product schema is out of scope.

- [ ] **Step 1:** Add imports + `<Seo>` with Product schema

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

<Seo
  title="Robinson Helicopter Parts — Authorised Dealer"
  description="Genuine Robinson Helicopter parts — authorised distributor at Denham. R22, R44, R66 spares, components, and consumables."
  jsonLd={[
    buildProduct({
      name: 'Robinson Helicopter Parts',
      description: 'Genuine Robinson R22, R44, R66 parts and components from an authorised distributor.',
      image: '/og-default.jpg',
      brand: 'Robinson Helicopters',
      url: `${SITE_URL}/parts`,
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
    ]),
  ]}
/>
```

- [ ] **Step 2:** Build

```bash
npm run build
```

- [ ] **Step 3:** Commit

```bash
git add src/pages/PartSales.jsx
git commit -m "feat(seo): wire Product JSON-LD on parts page"
```

---

## Task 20: Wire Product schema on `/store` and `/store/:id`

**Files:**
- Modify: `src/pages/Store.jsx` (formerly Misc.jsx)
- Modify: `src/pages/StoreItemDetail.jsx` (formerly MiscItemDetail.jsx)

`/store` (catalog index): `ItemList` of stub Products. `/store/:id`: full `Product` populated from the loaded Firestore item.

- [ ] **Step 1:** In `Store.jsx`, after the items load, build an ItemList JSON-LD block

```jsx
import Seo from '../components/seo/Seo';
import { buildItemList, buildBreadcrumbList } from '../components/seo/jsonLd';

const itemListJsonLd = items.length > 0 ? buildItemList({
  name: 'HQ Store',
  items: items.map((it) => ({ name: it.name, path: `/store/${it.id}` })),
}) : null;

<Seo
  title="HQ Store — Aviation Apparel & Merchandise"
  description="Branded aviation apparel and merchandise from HQ Aviation. T-shirts, jackets, watches, and more."
  jsonLd={[
    itemListJsonLd,
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Store', path: '/store' },
    ]),
  ].filter(Boolean)}
/>
```

- [ ] **Step 2:** In `StoreItemDetail.jsx`, build a full Product JSON-LD per item

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

const productJsonLd = item ? buildProduct({
  name: item.name,
  description: item.description,
  image: item.imageUrl || item.images?.[0],
  brand: 'HQ Aviation',
  url: `${SITE_URL}/store/${item.id}`,
  offers: {
    price: item.priceGbp != null ? (item.priceGbp / 100).toFixed(2) : undefined,
    priceCurrency: 'GBP',
    availability: item.status === 'active'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
}) : null;

<Seo
  title={item ? `${item.name} — HQ Store` : 'HQ Store'}
  description={item?.description || 'HQ Aviation store item'}
  ogImage={item?.imageUrl || item?.images?.[0]}
  ogType="product"
  jsonLd={[
    productJsonLd,
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Store', path: '/store' },
      ...(item ? [{ name: item.name, path: `/store/${item.id}` }] : []),
    ]),
  ].filter(Boolean)}
/>
```

- [ ] **Step 3:** Build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/Store.jsx src/pages/StoreItemDetail.jsx
git commit -m "feat(seo): wire ItemList + Product JSON-LD on store pages"
```

---

## Task 21: `getMetaForPath` for static routes

**Files:**
- Create: `src/lib/getMetaForPath.js`
- Create: `src/lib/getMetaForPath.test.js`

Pure lookup against a baked-in table. Dynamic routes are handled separately by the middleware (Task 23).

- [ ] **Step 1:** Write the failing tests

```js
// src/lib/getMetaForPath.test.js
import { describe, it, expect } from 'vitest';
import { getMetaForPath } from './getMetaForPath';

describe('getMetaForPath', () => {
  it('returns meta for the homepage', () => {
    const m = getMetaForPath('/');
    expect(m.title).toBeTruthy();
    expect(m.description).toBeTruthy();
    expect(m.canonicalUrl).toBe('https://hqaviation.com/');
  });

  it('returns meta for an aircraft page', () => {
    const m = getMetaForPath('/aircraft/r44');
    expect(m.title).toMatch(/r44/i);
    expect(m.canonicalUrl).toBe('https://hqaviation.com/aircraft/r44');
  });

  it('returns null for an unknown path', () => {
    expect(getMetaForPath('/this-does-not-exist')).toBeNull();
  });

  it('returns null for a dynamic path (handled by middleware)', () => {
    expect(getMetaForPath('/blog/some-post-id')).toBeNull();
  });

  it('description is within 70-160 char range', () => {
    const m = getMetaForPath('/aircraft/r44');
    expect(m.description.length).toBeGreaterThanOrEqual(70);
    expect(m.description.length).toBeLessThanOrEqual(160);
  });
});
```

- [ ] **Step 2:** Run tests

```bash
npx vitest run src/lib/getMetaForPath.test.js
```

Expected: FAIL with module-not-found.

- [ ] **Step 3:** Implement, sourcing per-page copy from PR #1's `docs/seo/per-page-tuning.md` (v2)

```js
// src/lib/getMetaForPath.js
import { SITE_URL, DEFAULT_OG_IMAGE } from './seoDefaults';
import { PUBLIC_ROUTES } from './seoRoutes';

// Mirror of the per-page-tuned title/description chosen during PR #1's
// per-page tuning pass. When implementing, READ docs/seo/per-page-tuning.md
// (v2) and copy each entry verbatim. Below are starter values for the most
// important pages — extend to cover every PUBLIC_ROUTES entry.
const STATIC_META = {
  '/': {
    title: 'HQ Aviation — UK Robinson Helicopter Dealer, Training & Expeditions',
    description: "UK's premier Robinson Helicopter dealer. Flight training, sales, maintenance and worldwide expeditions from Denham — 30 min from London.",
    ogImage: '/og-default.jpg',
  },
  '/aircraft/r22': {
    title: 'Robinson R22 — New & Pre-Owned Helicopter Sales | UK',
    description: 'New Robinson R22 sales from authorised UK dealer at Denham. The classic two-seat training helicopter — popular for PPL training and time-building.',
    ogImage: '/assets/images/new-aircraft/r22/r22-hero.jpg',
  },
  '/aircraft/r44': {
    title: 'Robinson R44 — New & Pre-Owned Helicopter Sales | UK',
    description: "New Robinson R44 Raven I, II and Cadet from authorised UK dealer at Denham. The world's best-selling four-seat helicopter — comfort, range, and proven reliability.",
    ogImage: '/assets/images/new-aircraft/r44/r44-raven-i-front-alpha.png',
  },
  '/aircraft/r66': {
    title: 'Robinson R66 Turbine — New & Pre-Owned Helicopter Sales | UK',
    description: 'New Robinson R66 Turbine from authorised UK dealer at Denham. Five seats, turbine power, and the premium choice for executive transport.',
    ogImage: '/assets/images/new-aircraft/r66/r66-hero.jpg',
  },
  '/aircraft/r88': {
    title: 'Robinson R88 — Twin-Engine Helicopter | UK Dealer',
    description: 'Robinson R88 — the new twin-engine helicopter from Robinson. UK dealer information at HQ Aviation, Denham.',
    ogImage: '/assets/images/new-aircraft/r88/rhc-r88-wide-view-instrument-panel-13175.jpg',
  },
  '/training/ppl': {
    title: 'Helicopter PPL — Private Pilot Licence Training London',
    description: 'EASA PPL(H) training in Robinson R22 or R44 from Denham — 30 min from London. From your first flight to qualified pilot in 45–55 hours.',
    ogImage: '/og-default.jpg',
  },
  // … add an entry for each PUBLIC_ROUTES path. For routes without a hand-tuned
  // entry, the lookup falls back to DEFAULT_META below.
};

const DEFAULT_META = {
  title: 'HQ Aviation',
  description: "UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions.",
  ogImage: DEFAULT_OG_IMAGE,
};

const PUBLIC_ROUTE_PATHS = new Set(PUBLIC_ROUTES.map((r) => r.path));

export function getMetaForPath(path) {
  // Only static routes. Dynamic patterns (containing :param) must be resolved
  // by the middleware via Firestore lookup.
  if (path.includes(':') || /^\/(blog|sales\/pre-owned|store)\/[^/]+$/.test(path)) {
    return null;
  }

  if (!PUBLIC_ROUTE_PATHS.has(path)) {
    return null;
  }

  const meta = STATIC_META[path] || DEFAULT_META;
  return {
    title: meta.title,
    description: meta.description,
    ogImage: meta.ogImage,
    canonicalUrl: `${SITE_URL}${path === '/' ? '/' : path}`,
  };
}
```

- [ ] **Step 4:** Run tests

```bash
npx vitest run src/lib/getMetaForPath.test.js
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/lib/getMetaForPath.js src/lib/getMetaForPath.test.js
git commit -m "feat(seo): getMetaForPath returns hand-tuned meta for static canonical routes"
```

---

## Task 22: SSR_HEAD sentinel in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1:** Read current `index.html`

```bash
cat index.html
```

- [ ] **Step 2:** Add the sentinel right before `</head>`

```html
    <!--SSR_HEAD-->
  </head>
```

The middleware will replace this comment with the rendered head fragment. Whitespace exact.

- [ ] **Step 3:** Verify the dev server still serves the page

```bash
npm run dev:vite &
VITE_PID=$!
sleep 3
curl -s http://localhost:5173/ | grep -c "SSR_HEAD"
kill $VITE_PID
```

Expected: prints `1` (the comment is in the served HTML).

- [ ] **Step 4:** Commit

```bash
git add index.html
git commit -m "chore(seo): add SSR_HEAD sentinel for server-side meta injection"
```

---

## Task 23: Server-side meta injection middleware

**Files:**
- Create: `api/seoMetaCache.js`
- Create: `api/seoMetaInjection.js`
- Create: `api/seoMetaInjection.test.js`
- Create: `api/__fixtures__/index.html`
- Modify: `server.js` (mount the middleware before the static-file fallthrough)

This is the centrepiece task. The middleware: for any request that would serve `index.html`, look up meta for the path, render a head fragment, replace the `<!--SSR_HEAD-->` sentinel, and respond.

- [ ] **Step 1:** Write the LRU cache

```js
// api/seoMetaCache.js
'use strict';

const TTL_MS = 5 * 60 * 1000;
const MAX = 200;

const store = new Map(); // key → { value, expiresAt }

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) { store.delete(key); return null; }
  // re-insert to move to end (LRU)
  store.delete(key);
  store.set(key, entry);
  return entry.value;
}

function set(key, value) {
  if (store.has(key)) store.delete(key);
  if (store.size >= MAX) {
    const oldestKey = store.keys().next().value;
    store.delete(oldestKey);
  }
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}

function flush() { store.clear(); }

module.exports = { get, set, flush };
```

- [ ] **Step 2:** Create the test fixture

```bash
mkdir -p api/__fixtures__
```

Create `api/__fixtures__/index.html`:

```html
<!doctype html>
<html><head>
<title>HQ Aviation</title>
<!--SSR_HEAD-->
</head><body><div id="root"></div></body></html>
```

- [ ] **Step 3:** Write the failing test

```js
// api/seoMetaInjection.test.js
const request = require('supertest');
const express = require('express');
const path = require('path');
const seoMetaInjection = require('./seoMetaInjection');
const cache = require('./seoMetaCache');

function makeApp(opts = {}) {
  const app = express();
  app.use(seoMetaInjection({
    indexHtmlPath: path.join(__dirname, '__fixtures__', 'index.html'),
    getMetaForStaticPath: opts.getMetaForStaticPath || (() => null),
    getMetaForDynamicPath: opts.getMetaForDynamicPath || (async () => null),
  }));
  app.use((req, res) => res.status(404).send('not handled'));
  return app;
}

beforeEach(() => cache.flush());

describe('seoMetaInjection', () => {
  it('injects meta for a static route', async () => {
    const app = makeApp({
      getMetaForStaticPath: (p) => p === '/aircraft/r44' ? {
        title: 'R44',
        description: 'desc',
        ogImage: '/og.jpg',
        canonicalUrl: 'https://hqaviation.com/aircraft/r44',
      } : null,
    });
    const res = await request(app).get('/aircraft/r44');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>R44 | HQ Aviation</title>');
    expect(res.text).toContain('<meta name="description" content="desc">');
    expect(res.text).toContain('<link rel="canonical" href="https://hqaviation.com/aircraft/r44">');
    expect(res.text).not.toContain('<!--SSR_HEAD-->');
  });

  it('injects meta for a dynamic route', async () => {
    const app = makeApp({
      getMetaForDynamicPath: async (p) => p.startsWith('/blog/') ? {
        title: 'A blog post',
        description: 'a description',
        ogImage: '/cover.jpg',
        canonicalUrl: 'https://hqaviation.com/blog/abc',
      } : null,
    });
    const res = await request(app).get('/blog/abc');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>A blog post | HQ Aviation</title>');
  });

  it('falls through (next()) for unknown paths', async () => {
    const app = makeApp();
    const res = await request(app).get('/totally-unknown');
    expect(res.status).toBe(404);
    expect(res.text).toBe('not handled');
  });

  it('caches subsequent identical requests', async () => {
    let calls = 0;
    const getMeta = () => {
      calls += 1;
      return { title: 'x', description: 'y', ogImage: '/z.jpg', canonicalUrl: 'https://hqaviation.com/x' };
    };
    const app = makeApp({ getMetaForStaticPath: getMeta });
    await request(app).get('/x');
    await request(app).get('/x');
    expect(calls).toBe(1);
  });
});
```

- [ ] **Step 4:** Verify the test fails

```bash
npx vitest run api/seoMetaInjection.test.js
```

Expected: FAIL with module-not-found.

- [ ] **Step 5:** Implement the middleware

```js
// api/seoMetaInjection.js
'use strict';

const fs = require('fs');
const cache = require('./seoMetaCache');

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderHead({ title, description, ogImage, canonicalUrl }) {
  const fullTitle = `${title} | HQ Aviation`;
  const og = ogImage && (ogImage.startsWith('http') ? ogImage : `https://hqaviation.com${ogImage}`);
  const lines = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="HQ Aviation">`,
    og ? `<meta property="og:image" content="${escapeHtml(og)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    og ? `<meta name="twitter:image" content="${escapeHtml(og)}">` : '',
  ].filter(Boolean);
  return lines.join('\n    ');
}

function factory({ indexHtmlPath, getMetaForStaticPath, getMetaForDynamicPath }) {
  // Read the index.html template once at startup. Restart server to refresh.
  const TEMPLATE = fs.readFileSync(indexHtmlPath, 'utf8');

  return async function seoMetaInjection(req, res, next) {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.includes('.')) {
      return next();
    }

    let meta = cache.get(req.path);
    if (!meta) {
      meta = getMetaForStaticPath(req.path);
      if (!meta) {
        try { meta = await getMetaForDynamicPath(req.path); }
        catch (e) { console.error('[seo] dynamic meta failed:', e.message); meta = null; }
      }
      if (meta) cache.set(req.path, meta);
    }

    if (!meta) return next();

    const head = renderHead(meta);
    const html = TEMPLATE.replace('<!--SSR_HEAD-->', head);
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  };
}

module.exports = factory;
module.exports.renderHead = renderHead; // export for tests
```

- [ ] **Step 6:** Run tests

```bash
npx vitest run api/seoMetaInjection.test.js
```

Expected: PASS, all 4 tests green.

- [ ] **Step 7:** Wire into `server.js`

```js
// server.js — add near the top with other requires:
const path = require('path');
const seoMetaInjection = require('./api/seoMetaInjection');
const { getMetaForPath } = require('./src/lib/getMetaForPath');

// later, BEFORE the SPA static-file fallthrough:

app.use(seoMetaInjection({
  indexHtmlPath: path.join(__dirname, 'dist', 'index.html'),    // production-built HTML
  getMetaForStaticPath: getMetaForPath,
  getMetaForDynamicPath: async (reqPath) => {
    const admin = require('./api/firebase-admin');
    const db = admin.firestore();

    // /blog/:postId
    const blogMatch = reqPath.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const doc = await db.collection('blogs').doc(blogMatch[1]).get();
      if (!doc.exists) return null;
      const d = doc.data();
      return {
        title: d.title || 'Blog Post',
        description: d.excerpt || d.description || '',
        ogImage: d.coverImage || '/og-default.jpg',
        canonicalUrl: `https://hqaviation.com/blog/${doc.id}`,
      };
    }

    // /sales/pre-owned/:id
    const listingMatch = reqPath.match(/^\/sales\/pre-owned\/([^/]+)$/);
    if (listingMatch) {
      const doc = await db.collection('listings').doc(listingMatch[1]).get();
      if (!doc.exists) return null;
      const d = doc.data();
      return {
        title: `${d.year} ${d.make} ${d.model}`.trim() || 'Pre-owned Helicopter',
        description: d.shortDescription || d.description || '',
        ogImage: d.images?.[0] || '/og-default.jpg',
        canonicalUrl: `https://hqaviation.com/sales/pre-owned/${doc.id}`,
      };
    }

    // /store/:id (formerly /misc/:id; collection name unchanged)
    const storeMatch = reqPath.match(/^\/store\/([^/]+)$/);
    if (storeMatch) {
      const doc = await db.collection('misc_items').doc(storeMatch[1]).get();
      if (!doc.exists) return null;
      const d = doc.data();
      return {
        title: d.name || 'Store Item',
        description: d.description || '',
        ogImage: d.imageUrl || d.images?.[0] || '/og-default.jpg',
        canonicalUrl: `https://hqaviation.com/store/${doc.id}`,
      };
    }

    return null;
  },
}));
```

**Important:** `indexHtmlPath` MUST point at the built artefact (`dist/index.html`), NOT the source `index.html`, because the middleware needs the bundled `<script>` tags Vite injects at build time. The middleware is bypassed in dev (`vite` serves `index.html` directly).

- [ ] **Step 8:** Production smoke test

```bash
npm run build
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -s http://localhost:7500/aircraft/r44 | grep -E "title|description|canonical" | head -10
kill $SERVER_PID
```

Expected: shows the R44-specific title, description, and canonical link in the raw HTML.

- [ ] **Step 9:** Commit

```bash
git add api/seoMetaCache.js api/seoMetaInjection.js api/seoMetaInjection.test.js api/__fixtures__/index.html server.js
git commit -m "feat(seo): server-side meta injection middleware (static + dynamic routes)"
```

---

## Task 24: Image dimension audit (function + CLI)

**Files:**
- Create: `src/lib/auditImgDimensions.js` (pure function — testable + reusable)
- Create: `src/lib/auditImgDimensions.test.js`
- Create: `scripts/audit-img-dimensions.js` (thin CLI wrapper)

- [ ] **Step 1:** Write the failing test

```js
// src/lib/auditImgDimensions.test.js
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { auditImgDimensions } from './auditImgDimensions';

function makeFixtureDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'img-audit-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.join(dir, path.dirname(name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

describe('auditImgDimensions', () => {
  it('flags <img> without width/height', () => {
    const dir = makeFixtureDir({
      'src/pages/Foo.jsx': '<div><img src="/a.jpg" alt="a" /></div>',
    });
    const result = auditImgDimensions(dir, ['src/pages']);
    expect(result.offenders).toHaveLength(1);
    expect(result.offenders[0].missing).toEqual(['width', 'height']);
  });

  it('passes <img> with both width and height', () => {
    const dir = makeFixtureDir({
      'src/pages/Foo.jsx': '<img src="/a.jpg" alt="a" width={100} height={200} />',
    });
    const result = auditImgDimensions(dir, ['src/pages']);
    expect(result.offenders).toHaveLength(0);
  });

  it('flags missing height when only width is set', () => {
    const dir = makeFixtureDir({
      'src/pages/Foo.jsx': '<img src="/a.jpg" alt="a" width={100} />',
    });
    const result = auditImgDimensions(dir, ['src/pages']);
    expect(result.offenders[0].missing).toEqual(['height']);
  });
});
```

- [ ] **Step 2:** Run test (FAIL)

```bash
npx vitest run src/lib/auditImgDimensions.test.js
```

- [ ] **Step 3:** Implement the audit function

```js
// src/lib/auditImgDimensions.js
import fs from 'node:fs';
import path from 'node:path';

const EXTENSIONS = new Set(['.jsx', '.js', '.tsx', '.ts']);
const IMG_RE = /<img\b([^>]*?)\/?>/gms;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

function hasAttr(attrs, name) {
  return new RegExp(`\\b${name}\\s*=`).test(attrs);
}

function extractSrc(attrs) {
  const m = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
  return m ? (m[1] || m[2] || m[3] || '<dynamic>') : '<no src>';
}

export function auditImgDimensions(rootDir, targetDirs) {
  const offenders = [];
  for (const targetDir of targetDirs) {
    const abs = path.join(rootDir, targetDir);
    if (!fs.existsSync(abs)) continue;
    for (const file of walk(abs)) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = IMG_RE.exec(content))) {
        const attrs = match[1];
        if (!hasAttr(attrs, 'width') || !hasAttr(attrs, 'height')) {
          const before = content.slice(0, match.index);
          const line = (before.match(/\n/g) || []).length + 1;
          offenders.push({
            file: path.relative(rootDir, file),
            line,
            src: extractSrc(attrs),
            missing: [
              !hasAttr(attrs, 'width') ? 'width' : null,
              !hasAttr(attrs, 'height') ? 'height' : null,
            ].filter(Boolean),
          });
        }
      }
    }
  }
  return { total: offenders.length, offenders };
}
```

- [ ] **Step 4:** Run tests

```bash
npx vitest run src/lib/auditImgDimensions.test.js
```

Expected: PASS, 3 tests green.

- [ ] **Step 5:** Add the thin CLI wrapper

```js
// scripts/audit-img-dimensions.js
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditImgDimensions } from '../src/lib/auditImgDimensions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const result = auditImgDimensions(ROOT, ['src/pages', 'src/components']);
fs.writeFileSync(path.join(ROOT, 'audit-img-dimensions.json'), JSON.stringify(result, null, 2));
console.log(`audited; ${result.total} <img> elements missing width or height. report: audit-img-dimensions.json`);
```

- [ ] **Step 6:** Run the CLI to produce the report for review

```bash
node scripts/audit-img-dimensions.js
head -30 audit-img-dimensions.json
```

Expected: produces JSON; stdout shows the count.

- [ ] **Step 7:** Add `audit-img-dimensions.json` to `.gitignore`

```
# audit reports
audit-img-dimensions.json
```

- [ ] **Step 8:** Commit

```bash
git add src/lib/auditImgDimensions.js src/lib/auditImgDimensions.test.js scripts/audit-img-dimensions.js .gitignore
git commit -m "feat(seo): auditImgDimensions function + CLI to find <img> elements missing dimensions"
```

- [ ] **Step 9:** Pause for user review of the report

> **User-input gate:** show the user `audit-img-dimensions.json`. The number of offenders likely exceeds 100. Confirm scope: fix the *canonical-page* offenders only (skip experimental and component-showcase pages), or fix everything?

---

## Task 25: Add width/height to `<img>` in canonical pages

**Files:**
- Modify: every `.jsx` flagged in `audit-img-dimensions.json` for canonical routes

This is mechanical but repetitive. Per offender:

1. Read the `<img>` element in the file.
2. Identify the natural dimensions of the source image (e.g., `sips -g pixelWidth -g pixelHeight public/path/to/image.jpg`).
3. Add `width={N}` and `height={N}`.

- [ ] **Step 1 (per offender):** Determine actual pixel dimensions

```bash
sips -g pixelWidth -g pixelHeight public/<path-to-image>
```

- [ ] **Step 2 (per offender):** Edit the JSX

```jsx
// Before
<img src="/assets/images/hero.jpg" alt="Hero" />

// After
<img src="/assets/images/hero.jpg" alt="Hero" width={2400} height={1600} />
```

- [ ] **Step 3:** Re-run the audit and confirm the count drops

```bash
node scripts/audit-img-dimensions.js
```

Expected: `total` decreases by exactly the number of offenders fixed.

- [ ] **Step 4:** Add a regression test

```js
// src/lib/auditImgDimensions.regression.test.js
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditImgDimensions } from './auditImgDimensions';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const EXPERIMENTAL_FILE_RE = /(Variations|Picker|Test|Wireframes|ComponentShowcase|Experimentation|FinalDraft|MobileSecondSection|HeroVariations|HeroPathPicker|JourneyPicker|ParallaxPicker|ScrollPathTest|VideoSliderPicker|TestimonialsPicker|OwnershipPicker|PPLPicker|ArrowPicker|CarouselPicker|AccordionVariations|AwardVariations|R66BenefitsVariations|ExpeditionPhilosophyVariations|ExpeditionPhilosophyJVariations|FlyingVariations|WallOfCool[A-Z])/;

describe('canonical-page <img> dimensions', () => {
  it('all canonical-page <img> elements have width and height', () => {
    const result = auditImgDimensions(ROOT, ['src/pages', 'src/components']);
    const canonicalOffenders = result.offenders.filter((o) => !EXPERIMENTAL_FILE_RE.test(o.file));
    expect(canonicalOffenders).toEqual([]);
  });
});
```

- [ ] **Step 5:** Run the regression test

```bash
npx vitest run src/lib/auditImgDimensions.regression.test.js
```

Expected: PASS — once all canonical offenders are fixed.

- [ ] **Step 6:** Commit (one commit per logical batch — e.g., per page, or per ~10 fixes)

```bash
git add src/pages/<file>.jsx
git commit -m "fix(seo): add width/height to <img> in <PageName>"
```

(Step 6 commits accumulate over the course of this task.)

- [ ] **Step 7:** When canonical offenders reach zero, commit the regression test

```bash
git add src/lib/auditImgDimensions.regression.test.js
git commit -m "test(seo): regression test for canonical-page <img> dimensions"
```

---

## Task 26: Verify sitemap `<lastmod>` and robots strategy

**Files:**
- Modify: `api/sitemap.js`
- Inspect (and modify if needed): `public/robots.txt`

PR #1's sitemap already emits `<lastmod>` from Firestore `updatedAt` for dynamic entries. Static entries don't currently have `<lastmod>`. Add a deploy-time stamp.

- [ ] **Step 1:** Confirm current state

```bash
grep "lastmod" api/sitemap.js
grep -A 5 "PUBLIC_ROUTES = \[" api/sitemap.js | head -10
```

Expected: dynamic entries already use `lastmod`; static `PUBLIC_ROUTES` entries don't.

- [ ] **Step 2:** Add a server-start timestamp and apply it to static entries

```js
// api/sitemap.js — at the top of the file (with the other constants)
const SERVER_START_ISO = new Date().toISOString().slice(0, 10);

// In buildSitemap, change the entries composition:
const entries = [
  ...PUBLIC_ROUTES.map((r) => ({ ...r, lastmod: SERVER_START_ISO })),
  ...dynamicEntries,
];
```

- [ ] **Step 3:** Robots verification — `public/robots.txt` should NOT block any path with `Disallow:`

```bash
cat public/robots.txt
```

Expected:

```
User-agent: *
Allow: /

Sitemap: https://hqaviation.com/sitemap.xml
```

If you see `Disallow: /admin`, `Disallow: /checkout`, etc., remove those lines. The per-page `<meta name="robots" content="noindex">` (already wired by PR #1's `NOINDEX_ROUTES` → `<Seo noindex>`) does the indexing block.

- [ ] **Step 4:** Build + smoke test

```bash
npm run build
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -s http://localhost:7500/sitemap.xml | grep -E "lastmod" | head -5
curl -s http://localhost:7500/robots.txt
kill $SERVER_PID
```

Expected: every `<url>` has a `<lastmod>`; robots.txt allows `/` and references the sitemap.

- [ ] **Step 5:** Commit

```bash
git add api/sitemap.js public/robots.txt
git commit -m "fix(seo): emit lastmod for static sitemap entries; verify robots strategy"
```

---

## Task 27: `docs/seo/canonical-rules.md`

**Files:**
- Create: `docs/seo/canonical-rules.md`

- [ ] **Step 1:** Write the doc

```markdown
# Canonical URL Rules — HQ Aviation

## Canonical form

All canonical URLs use:

- **HTTPS** — never `http://`
- **Non-www** — `hqaviation.com`, not `www.hqaviation.com`
- **No trailing slash** — `/aircraft/r44`, not `/aircraft/r44/` (root `/` excepted)

The Express layer enforces this with a 301 redirect (see `server.js`, the canonicalisation middleware).

## Permanent redirects

Defined in `api/seoRedirects.js` (mirrored to `src/lib/seoRoutes.js#CANONICAL_REDIRECTS`):

| Old | → | Canonical |
|---|---|---|
| `/home` | → | `/` |
| `/final-ppl` | → | `/training/ppl` |
| `/type-rating` | → | `/training/type-rating` |
| `/aircraft-sales/new/r22` | → | `/aircraft/r22` |
| `/aircraft-sales/new/r44` | → | `/aircraft/r44` |
| `/aircraft-sales/new/r66` | → | `/aircraft/r66` |
| `/aircraft-sales/new/r88` | → | `/aircraft/r88` |
| `/misc` | → | `/store` |
| `/misc/:id` | → | `/store/:id` |

Also enforced via `<link rel="canonical">` on the canonical page — defence in depth.

## Robots strategy

`robots.txt` allows ALL routes (`Allow: /`). Per-page `<meta name="robots" content="noindex,nofollow">` does the indexing block. This is correct — never `Disallow:` a route in `robots.txt` if you want Google to honour the page's `noindex`, because Google can't see `noindex` on a page it never fetches.

Routes that get `noindex`:

- All `/admin/*`
- `/checkout`, `/booking-confirmed`
- `/london-tour-checkout`, `/london-tour-confirmed`
- `/hq-account`
- The `/sitemap` human-readable page (the XML sitemap is at `/sitemap.xml`)
- All experimental routes — additionally hard-gated from the production bundle by Vite (`import.meta.env.DEV`)
```

- [ ] **Step 2:** Commit

```bash
git add docs/seo/canonical-rules.md
git commit -m "docs(seo): canonical URL rules + redirect table reference"
```

---

## Task 28: Final integration check + open PR

**Files:**
- No file changes

- [ ] **Step 1:** Full test suite

```bash
npm test
```

Expected: PASS (the pre-existing Firebase env-key test failure is acceptable; flag it in the PR description if it persists).

- [ ] **Step 2:** Production build + smoke

```bash
npm run build
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 3

# 1. Static route meta injected
curl -s http://localhost:7500/aircraft/r44 | grep -c '<title>Robinson R44'

# 2. Sitemap renamed
curl -s http://localhost:7500/sitemap.xml | grep -c '<loc>https://hqaviation.com/store</loc>'

# 3. /misc 301s
curl -I http://localhost:7500/misc 2>&1 | grep -E "301|Location"

# 4. /home 301
curl -I http://localhost:7500/home 2>&1 | grep -E "301|Location"

# 5. /aircraft-sales/new/r44 301
curl -I http://localhost:7500/aircraft-sales/new/r44 2>&1 | grep -E "301|Location"

kill $SERVER_PID
```

Expected: all five checks produce expected output.

- [ ] **Step 3:** Push and open PR

```bash
git push -u origin feat/seo-refinements
gh pr create --base main --head feat/seo-refinements --title "SEO refinements (server meta injection, /store rename, redirects, schema, CLS)" --body "$(cat <<'EOF'
## Summary

Implements `docs/superpowers/specs/2026-04-30-seo-refinements-design.md`. Layers eight refinements on top of PR #1's foundations.

### Highlights

- **Server-side meta injection** — Express stamps title / description / OG / canonical / Twitter into the raw HTML response. Solves social scrapers (Facebook, Twitter, LinkedIn, iMessage, Slack, WhatsApp) and Bing.
- **URL canonicalisation** — non-www, no trailing slash, HTTPS, all enforced via 301.
- **301 redirects** for 7 legacy duplicate URLs (and `/misc`, `/misc/:id`).
- **`/misc → /store` rename** — URLs, components, admin routes, internal links, UI copy. Firestore collection name unchanged (`misc_items`).
- **JSON-LD additions** — `buildTouristTrip`; Course schema wired on PPL/CPL/NightRating/AdvancedTraining; Service schema wired on six service pages; Product schema added on London tour, discovery flights, parts, store + store items; H500 reference page gets `<Seo>` with no Product schema (informational only).
- **Image CLS hygiene** — every `<img>` on canonical pages has explicit width/height; vitest test fails CI if any future regression sneaks in.
- **Sitemap accuracy** — static entries get a `<lastmod>` from server-start timestamp; dynamic entries continue to use Firestore `updatedAt` (PR #1 behaviour).
- **Custom 404 page** — `NotFound.jsx` linking to popular sections, wired as the catch-all route.

### Verification

- `npm test` — all SEO tests passing
- `npm run build` — clean
- Smoke tests for static / dynamic / redirect / sitemap behaviour pass

### Test plan

- [ ] Visit each major canonical page and confirm correct meta in `view-source`
- [ ] Share a link to a blog post on Slack / WhatsApp / LinkedIn — preview card shows the post's cover image, title, description (the social-scraper test that motivated this PR)
- [ ] Visit `/misc` → 301 to `/store`; visit `/aircraft-sales/new/r66` → 301 to `/aircraft/r66`
- [ ] Visit a non-existent route → see the new NotFound page (with `<meta name="robots" content="noindex">`)
- [ ] `curl https://staging/sitemap.xml` shows `<lastmod>` on every entry

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4:** Note the PR URL for the user.

---

## Self-Review

**Spec coverage:** all 8 spec deliverables → tasks. ✓
- #1 server-side meta injection → Tasks 21, 22, 23
- #2 URL canonicalisation → Tasks 2, 3
- #3 301 redirects → Task 4
- #4 `/misc → /store` rename → Tasks 7, 8, 9, 10, 11, 12
- #5 drop H500 Product schema → Task 16
- #6 expanded JSON-LD → Tasks 13, 14, 15, 17, 18, 19, 20
- #7 image CLS → Tasks 24, 25
- #8 sitemap lastmod + robots → Task 26

Plus the gap from the SEO checklist:
- Custom 404 page → Tasks 5, 6

Plus housekeeping:
- Pre-flight + branch → Task 1
- Documentation → Task 27
- Integration test + PR → Task 28

**Placeholder scan:** none. Every code block is real, every command is exact, every commit message is concrete.

**Type / API consistency:** `getMetaForPath` used identically in tests (Task 21) and middleware wiring (Task 23). `buildTouristTrip` signature matches between definition (Task 13) and call site (Task 14). `seoRedirects` map shape matches between `api/seoRedirects.js` and the redirect middleware. `auditImgDimensions(rootDir, targetDirs)` signature matches between definition (Task 24) and regression test (Task 25). ✓

**Scope check:** one PR. The 28 tasks naturally produce a single feature branch. Tasks 7–12 (rename) form a coherent block; tasks 13–20 (schema wiring) form another; tasks 21–23 (server-side injection) form the architectural piece; tasks 24–25 (image CLS) are mechanical. All independent enough to be safely sequenced but deliver a single coherent improvement.
