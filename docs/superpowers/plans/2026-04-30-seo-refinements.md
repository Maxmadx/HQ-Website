# SEO Refinements Implementation Plan (Trimmed)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer the high-value SEO refinements on top of PR #1 (`seo-launch-readiness`) — server-side meta injection (the main event), URL canonicalisation, 301 redirect enforcement, expanded JSON-LD coverage on under-served pages, image CLS hygiene, and a custom 404. **Plus a deferred follow-up:** the `/misc → /store` rename and per-part Product schema for `/parts` (after the parts-storefront redesign) ship in a separate PR.

**Trim history:** Original plan had 28 tasks; trimmed to 11 by dropping low-impact ceremony (a documentation-only file, server-start `<lastmod>` for static routes, an over-engineered audit script with TDD harness) and deferring the `/misc → /store` rename and `/parts` Product schema to follow-up work.

**Architecture:** Branches off `main` *after PR #1 merges*. Extends PR #1's existing infrastructure (`<Seo>`, `seoRoutes.js`, `seoDefaults.js`, `jsonLd.js`, `api/sitemap.js`) — no new SEO subsystem, just additions. Server-side meta injection added as a new Express middleware (`api/seoMetaInjection.js`) reading static-route metadata from a new `getMetaForPath` and dynamic-route metadata from Firestore. URL canonicalisation and redirects added to `server.js` as middleware before the SPA fallthrough.

**Tech Stack:** React 19, react-router-dom v7, react-helmet-async (PR #1), Express 4 (server.js), Firebase Admin SDK (Firestore reads for dynamic meta), Vite 8, Vitest 4 + jsdom.

**Reference files:**
- Spec: `docs/superpowers/specs/2026-04-30-seo-refinements-design.md`
- Existing infra: `src/components/seo/Seo.jsx`, `src/components/seo/jsonLd.js`, `src/lib/seoRoutes.js`, `src/lib/seoDefaults.js`, `api/sitemap.js`, `public/robots.txt`
- Test patterns: `src/components/seo/jsonLd.test.js`
- Express patterns: `api/leads.js`, `api/analytics-api.js`

**Commit discipline:** one commit per task. Prefix `feat(seo):` for new behaviour, `chore(seo):` for refactors, `docs(seo):` for docs, `fix(seo):` for bugs. **One commit per task — do not batch.**

**Pre-flight gate:** Worktree at `/Users/maximussmith/Downloads/HQ-Website-main-seo-ref` on branch `feat/seo-refinements`. Branch is at `main` post-PR-#1 merge. Tasks A and B already complete (worktree + canonicalUrl helpers).

**Deferred to follow-up PRs (do NOT implement here):**
- `/misc → /store` rename (was original Tasks 7–12) — slug polish; minimal SEO benefit; mechanical migration that deserves its own focused PR
- `/parts` Product schema (was original Task 19) — meaningless until the parts-storefront redesign lands and gives parts real per-item data
- Static sitemap `<lastmod>` from server-start timestamp (was original Task 26) — search engines don't aggressively recrawl static pages on `lastmod` changes
- `docs/seo/canonical-rules.md` standalone doc (was original Task 27) — folded into the final PR description

---

## Already complete

- **Task A:** Pre-flight gate cleared, worktree at `/Users/maximussmith/Downloads/HQ-Website-main-seo-ref` created on `feat/seo-refinements`.
- **Task B:** `src/lib/canonicalUrl.js` + tests (commit `2b43d4e`).

---

## Task 1: URL canonicalisation Express middleware

Enforces non-www, no trailing slash, HTTPS via 301 in production. Skipped in dev to avoid breaking localhost.

**Files:**
- Modify: `server.js` (add middleware near the top, after `app.set('trust proxy', 1)`)

**Pre-flight:** confirm with user whether HTTPS is enforced upstream (Cloudflare / hosting provider). Including the HTTPS-force is harmless either way (regex won't match if traffic is already HTTPS).

- [ ] **Step 1:** Find the insertion point in `server.js`

```bash
grep -n "app.set('trust proxy'" server.js
```

- [ ] **Step 2:** Add the middleware immediately after `app.set('trust proxy', 1)`

```js
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
  const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return res.redirect(301, `https://${finalHost}${path}${search}`);
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

Expected: `HTTP/1.1 301` and `Location: https://hqaviation.com/aircraft/r44`.

- [ ] **Step 4:** Commit

```bash
git add server.js
git commit -m "feat(seo): canonicalise URLs (https, non-www, no trailing slash) via 301"
```

---

## Task 2: 301 redirect enforcement for `CANONICAL_REDIRECTS`

PR #1's `seoRoutes.js` already exports `CANONICAL_REDIRECTS` as a `{ from: to }` map. This task adds `/home` and enforces the lot with hard 301s.

**Files:**
- Modify: `src/lib/seoRoutes.js` (add `/home → /` to CANONICAL_REDIRECTS)
- Create: `api/seoRedirects.js` (CommonJS mirror — api/ is CJS, src/ is ESM)
- Modify: `server.js` (add middleware after Task 1's middleware)

- [ ] **Step 1:** Confirm current shape

```bash
grep -A 10 "CANONICAL_REDIRECTS = " src/lib/seoRoutes.js
```

- [ ] **Step 2:** Add `/home → /` entry to `CANONICAL_REDIRECTS` in `src/lib/seoRoutes.js`

```js
// In the CANONICAL_REDIRECTS object, add:
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

- [ ] **Step 4:** Add the redirect middleware in `server.js` (after Task 1's canonicalisation middleware, before the static fallthrough)

```js
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

Expected: both `HTTP/1.1 301` with correct `Location`.

- [ ] **Step 6:** Commit

```bash
git add server.js api/seoRedirects.js src/lib/seoRoutes.js
git commit -m "feat(seo): enforce 301 redirects for legacy duplicate URLs"
```

---

## Task 3: NotFound page + catch-all route

Custom 404 with links to popular sections; wired as the catch-all `<Route path="*">` last in `App.jsx`.

**Files:**
- Create: `src/pages/NotFound.jsx`
- Modify: `src/App.jsx` (add import + catch-all route as the LAST `<Route>`)

(Skipping a dedicated component test — testing that React Router renders the right links is theatre. A smoke check via curl is enough.)

- [ ] **Step 1:** Write the component

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

- [ ] **Step 2:** Wire the catch-all in `src/App.jsx`

Add the import alongside the other page imports:

```jsx
import NotFound from './pages/NotFound';
```

Add the catch-all as the LAST `<Route>` inside `<Routes>`:

```jsx
{/* Catch-all 404 — must be the last Route */}
<Route path="*" element={<NotFound />} />
```

- [ ] **Step 3:** Smoke test in dev

```bash
npm run dev:vite &
VITE_PID=$!
sleep 4
curl -s http://localhost:5173/this-route-does-not-exist | grep -c "Page Not Found\|404"
kill $VITE_PID
```

Expected: prints `1` or higher.

- [ ] **Step 4:** Commit

```bash
git add src/pages/NotFound.jsx src/App.jsx
git commit -m "feat(seo): custom 404 NotFound page wired as catch-all route"
```

---

## Task 4: `buildTouristTrip` + wire on London tour page

`buildTouristTrip` is added to `jsonLd.js` and used on `/helicopter-tour-of-london` paired with Product. Single combined task.

**Files:**
- Modify: `src/components/seo/jsonLd.js`
- Modify: `src/components/seo/jsonLd.test.js`
- Modify: `src/pages/HelicopterTourOfLondon.jsx`

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

- [ ] **Step 2:** Run tests (FAIL)

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

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

- [ ] **Step 4:** Run tests (PASS)

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

- [ ] **Step 5:** Wire `<Seo>` on `/helicopter-tour-of-london`

In `src/pages/HelicopterTourOfLondon.jsx`, add imports near the top:

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildTouristTrip, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';
```

Add `<Seo>` inside the component's JSX root:

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

- [ ] **Step 6:** Build

```bash
npm run build
```

- [ ] **Step 7:** Commit

```bash
git add src/components/seo/jsonLd.js src/components/seo/jsonLd.test.js src/pages/HelicopterTourOfLondon.jsx
git commit -m "feat(seo): add buildTouristTrip + wire Product+TouristTrip on London tour page"
```

---

## Task 5: Product schema on `/training/trial-lessons` (DiscoveryFlight)

PR #1 already has the trial-lessons Offer block (`trialOffers` array) in DiscoveryFlight. Audit current `<Seo>` usage; if it uses Course, replace with Product.

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

- [ ] **Step 1:** Inspect current usage

```bash
grep -E "buildCourse|buildProduct|<Seo " src/pages/DiscoveryFlight.jsx | head -10
```

- [ ] **Step 2:** Replace any Course schema with Product. Use the existing `trialOffers` array (already built in PR #1) as the AggregateOffer.

```jsx
// Imports (replace if buildCourse is imported):
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';

// In the JSX, the <Seo> block:
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

## Task 6: Course schema on remaining training pages + H500 informational page

PR #1 wires `buildCourse` only on `TypeRating.jsx`. Mirror on the four remaining training pages. Plus add `<Seo>` (no Product) on `/aircraft/h500` since HQ doesn't sell new H500s.

**Files:**
- Modify: `src/pages/PPL.jsx` (or `FinalPPL.jsx` — confirm via App.jsx mapping for `/training/ppl`)
- Modify: `src/pages/CPL.jsx`
- Modify: `src/pages/NightRating.jsx`
- Modify: `src/pages/AdvancedTraining.jsx`
- Modify: `src/pages/AircraftH500.jsx`

Per-page values:

| Page | Course/page name | Description |
|---|---|---|
| `PPL` | "Private Pilot Licence (PPL-H)" | "EASA PPL(H) training in Robinson R22 or R44 from Denham — typically 45–55 hours." |
| `CPL` | "Commercial Pilot Licence (CPL-H)" | "EASA CPL(H) training in Robinson R44 or R66 from Denham — modular pathway from PPL." |
| `NightRating` | "Night Rating (Helicopter)" | "Night flying rating in Robinson R44 or R66 from Denham — 5h dual instruction." |
| `AdvancedTraining` | "Advanced Helicopter Training" | "Advanced post-licence training — confined areas, autorotations, formation flying." |
| `AircraftH500` | "Hughes/Schweizer 300 (H500) — Reference" | "The Hughes/Schweizer 300 (H500) — a piston-engine helicopter with a long history. Reference page; HQ Aviation does not sell new H500 aircraft." |

- [ ] **Step 1 (per training page):** Add imports

```jsx
import { buildCourse, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';
```

- [ ] **Step 2 (per training page):** Add or extend `<Seo>` with Course + BreadcrumbList. Example for PPL:

```jsx
<Seo
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

- [ ] **Step 3:** Repeat for CPL, NightRating, AdvancedTraining with their respective values.

- [ ] **Step 4:** For `AircraftH500.jsx`, add imports + `<Seo>` with BreadcrumbList only (NO Product):

```jsx
import Seo from '../components/seo/Seo';
import { buildBreadcrumbList } from '../components/seo/jsonLd';

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

- [ ] **Step 5:** Build

```bash
npm run build
```

- [ ] **Step 6:** Commit

```bash
git add src/pages/PPL.jsx src/pages/CPL.jsx src/pages/NightRating.jsx src/pages/AdvancedTraining.jsx src/pages/AircraftH500.jsx
git commit -m "feat(seo): wire Course schema on PPL/CPL/NightRating/AdvancedTraining + Seo on H500"
```

---

## Task 7: Service schema on remaining service pages

PR #1 wires `buildService` only on `FinalMaintenance.jsx`. Mirror on six more pages.

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx`
- Modify: `src/pages/Leaseback.jsx`
- Modify: `src/pages/SelfFlyHire.jsx`
- Modify: `src/pages/SuperYachtOps.jsx`
- Modify: `src/pages/PilotProvisioning.jsx`
- Modify: `src/pages/FinalExpeditions.jsx`

Per-page values:

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

## Task 8: ItemList + Product schema on `/misc` (current store)

`/misc` is the customer-facing route for the store today (`/misc → /store` rename is deferred). Wire ItemList on the index and Product on the detail page.

**Files:**
- Modify: `src/pages/Misc.jsx` (index)
- Modify: `src/pages/MiscItemDetail.jsx` (detail)

- [ ] **Step 1:** In `Misc.jsx`, after the items load, build an ItemList JSON-LD block

```jsx
import Seo from '../components/seo/Seo';
import { buildItemList, buildBreadcrumbList } from '../components/seo/jsonLd';

const itemListJsonLd = items.length > 0 ? buildItemList({
  name: 'HQ Store',
  items: items.map((it) => ({ name: it.name, path: `/misc/${it.id}` })),
}) : null;

<Seo
  title="HQ Store — Aviation Apparel & Merchandise"
  description="Branded aviation apparel and merchandise from HQ Aviation. T-shirts, jackets, watches, and more."
  jsonLd={[
    itemListJsonLd,
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Store', path: '/misc' },
    ]),
  ].filter(Boolean)}
/>
```

- [ ] **Step 2:** In `MiscItemDetail.jsx`, build a full Product per item

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

const productJsonLd = item ? buildProduct({
  name: item.name,
  description: item.description,
  image: item.imageUrl || item.images?.[0],
  brand: 'HQ Aviation',
  url: `${SITE_URL}/misc/${item.id}`,
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
      { name: 'Store', path: '/misc' },
      ...(item ? [{ name: item.name, path: `/misc/${item.id}` }] : []),
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
git add src/pages/Misc.jsx src/pages/MiscItemDetail.jsx
git commit -m "feat(seo): wire ItemList + Product JSON-LD on store pages"
```

---

## Task 9: Server-side meta injection (the centrepiece — `getMetaForPath` + sentinel + middleware)

Express stamps title / description / OG / canonical / Twitter into the raw HTML response on every page request. Single combined task — three artefacts but they only ship together.

**Files:**
- Create: `src/lib/getMetaForPath.js` + tests
- Create: `api/seoMetaCache.js`
- Create: `api/seoMetaInjection.js` + tests + fixture
- Modify: `index.html` (add `<!--SSR_HEAD-->` sentinel)
- Modify: `server.js` (mount middleware before SPA fallthrough)

- [ ] **Step 1:** Create `src/lib/getMetaForPath.js`

```js
// src/lib/getMetaForPath.js
import { SITE_URL, DEFAULT_OG_IMAGE } from './seoDefaults';
import { PUBLIC_ROUTES } from './seoRoutes';

// Mirror of the per-page-tuned title/description chosen during PR #1's
// per-page tuning pass. When extending, READ docs/seo/per-page-tuning.md
// (v2) and copy entries verbatim.
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
  // Extend with one entry per PUBLIC_ROUTES path. Routes without a hand-tuned
  // entry fall through to DEFAULT_META below.
};

const DEFAULT_META = {
  title: 'HQ Aviation',
  description: "UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions.",
  ogImage: DEFAULT_OG_IMAGE,
};

const PUBLIC_ROUTE_PATHS = new Set(PUBLIC_ROUTES.map((r) => r.path));

export function getMetaForPath(path) {
  if (path.includes(':') || /^\/(blog|sales\/pre-owned|misc)\/[^/]+$/.test(path)) {
    return null; // dynamic — handled by middleware via Firestore
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

- [ ] **Step 2:** Add the test in `src/lib/getMetaForPath.test.js`

```js
import { describe, it, expect } from 'vitest';
import { getMetaForPath } from './getMetaForPath';

describe('getMetaForPath', () => {
  it('returns meta for the homepage', () => {
    const m = getMetaForPath('/');
    expect(m.title).toBeTruthy();
    expect(m.canonicalUrl).toBe('https://hqaviation.com/');
  });
  it('returns meta for an aircraft page', () => {
    const m = getMetaForPath('/aircraft/r44');
    expect(m.title).toMatch(/r44/i);
  });
  it('returns null for an unknown path', () => {
    expect(getMetaForPath('/this-does-not-exist')).toBeNull();
  });
  it('returns null for a dynamic path', () => {
    expect(getMetaForPath('/blog/some-post-id')).toBeNull();
  });
});
```

Run: `npx vitest run src/lib/getMetaForPath.test.js` — should PASS.

- [ ] **Step 3:** Create `api/seoMetaCache.js`

```js
'use strict';

const TTL_MS = 5 * 60 * 1000;
const MAX = 200;
const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) { store.delete(key); return null; }
  store.delete(key);
  store.set(key, entry);
  return entry.value;
}
function set(key, value) {
  if (store.has(key)) store.delete(key);
  if (store.size >= MAX) store.delete(store.keys().next().value);
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
function flush() { store.clear(); }

module.exports = { get, set, flush };
```

- [ ] **Step 4:** Create the test fixture

```bash
mkdir -p api/__fixtures__
```

`api/__fixtures__/index.html`:

```html
<!doctype html>
<html><head>
<title>HQ Aviation</title>
<!--SSR_HEAD-->
</head><body><div id="root"></div></body></html>
```

- [ ] **Step 5:** Create `api/seoMetaInjection.js`

```js
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
module.exports.renderHead = renderHead;
```

- [ ] **Step 6:** Test in `api/seoMetaInjection.test.js`

```js
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
        title: 'R44', description: 'desc', ogImage: '/og.jpg',
        canonicalUrl: 'https://hqaviation.com/aircraft/r44',
      } : null,
    });
    const res = await request(app).get('/aircraft/r44');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>R44 | HQ Aviation</title>');
    expect(res.text).not.toContain('<!--SSR_HEAD-->');
  });
  it('injects meta for a dynamic route', async () => {
    const app = makeApp({
      getMetaForDynamicPath: async (p) => p.startsWith('/blog/') ? {
        title: 'Post', description: 'd', ogImage: '/c.jpg',
        canonicalUrl: 'https://hqaviation.com/blog/abc',
      } : null,
    });
    const res = await request(app).get('/blog/abc');
    expect(res.text).toContain('<title>Post | HQ Aviation</title>');
  });
  it('falls through for unknown paths', async () => {
    const app = makeApp();
    const res = await request(app).get('/totally-unknown');
    expect(res.status).toBe(404);
  });
  it('caches subsequent identical requests', async () => {
    let calls = 0;
    const getMeta = () => { calls += 1; return { title: 'x', description: 'y', ogImage: '/z.jpg', canonicalUrl: 'https://hqaviation.com/x' }; };
    const app = makeApp({ getMetaForStaticPath: getMeta });
    await request(app).get('/x');
    await request(app).get('/x');
    expect(calls).toBe(1);
  });
});
```

Run: `npx vitest run api/seoMetaInjection.test.js` — should PASS, 4 tests.

- [ ] **Step 7:** Add the sentinel to `index.html`

```html
    <!--SSR_HEAD-->
  </head>
```

- [ ] **Step 8:** Wire into `server.js`

```js
// Near the top with other requires:
const path = require('path');
const seoMetaInjection = require('./api/seoMetaInjection');
const { getMetaForPath } = require('./src/lib/getMetaForPath');

// BEFORE the SPA static-file fallthrough:
app.use(seoMetaInjection({
  indexHtmlPath: path.join(__dirname, 'dist', 'index.html'),
  getMetaForStaticPath: getMetaForPath,
  getMetaForDynamicPath: async (reqPath) => {
    const admin = require('./api/firebase-admin');
    const db = admin.firestore();

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

    const miscMatch = reqPath.match(/^\/misc\/([^/]+)$/);
    if (miscMatch) {
      const doc = await db.collection('misc_items').doc(miscMatch[1]).get();
      if (!doc.exists) return null;
      const d = doc.data();
      return {
        title: d.name || 'Store Item',
        description: d.description || '',
        ogImage: d.imageUrl || d.images?.[0] || '/og-default.jpg',
        canonicalUrl: `https://hqaviation.com/misc/${doc.id}`,
      };
    }

    return null;
  },
}));
```

**Critical:** `indexHtmlPath` MUST be `dist/index.html` (the built artefact with bundled `<script>` tags), NOT the source `index.html`. The middleware is bypassed in dev (vite serves `index.html` directly).

- [ ] **Step 9:** Production smoke test

```bash
npm run build
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 2
curl -s http://localhost:7500/aircraft/r44 | grep -E "title|description|canonical" | head -10
kill $SERVER_PID
```

Expected: shows R44-specific title, description, and canonical link in raw HTML.

- [ ] **Step 10:** Commit

```bash
git add src/lib/getMetaForPath.js src/lib/getMetaForPath.test.js api/seoMetaCache.js api/seoMetaInjection.js api/seoMetaInjection.test.js api/__fixtures__/index.html index.html server.js
git commit -m "feat(seo): server-side meta injection middleware (static + dynamic routes)"
```

---

## Task 10: Image dimensions — inline audit + fixes + regression test

Strip the over-engineered audit script (function + tests + CLI). Use a one-shot inline grep to find offenders, fix them, and add a single regression test that prevents future `<img>` without dimensions in canonical pages.

**Files:**
- Modify: many `src/pages/*.jsx` and `src/components/**/*.jsx` (offenders)
- Create: `src/lib/canonicalImgDimensions.test.js` (the regression test)

- [ ] **Step 1:** Inline audit to produce a list of offenders

```bash
# Find <img> tags without both width AND height. Skip experimental files.
grep -rn '<img\b' src/pages src/components \
  --include='*.jsx' --include='*.js' \
  | grep -v -E 'Variations|Picker|Test|Wireframes|ComponentShowcase|Experimentation|FinalDraft|MobileSecondSection|HeroVariations|HeroPathPicker|JourneyPicker|ParallaxPicker|ScrollPathTest|VideoSliderPicker|TestimonialsPicker|OwnershipPicker|PPLPicker|ArrowPicker|CarouselPicker|AccordionVariations|AwardVariations|R66BenefitsVariations|ExpeditionPhilosophyVariations|ExpeditionPhilosophyJVariations|FlyingVariations|WallOfCool[A-Z]' \
  | grep -v -E 'width=' \
  > /tmp/img-no-width.txt
wc -l /tmp/img-no-width.txt
```

This is the offender list to fix.

- [ ] **Step 2:** Pause for user review of the list before edits begin (gate)

> Show the user `/tmp/img-no-width.txt`. Confirm scope: fix the canonical-page offenders only, or fix everything?

- [ ] **Step 3 (per offender):** Determine actual pixel dimensions

```bash
sips -g pixelWidth -g pixelHeight public/<path-to-image>
```

- [ ] **Step 4 (per offender):** Edit the JSX to add `width={N}` and `height={N}`. Example:

```jsx
// Before
<img src="/assets/images/hero.jpg" alt="Hero" />

// After
<img src="/assets/images/hero.jpg" alt="Hero" width={2400} height={1600} />
```

- [ ] **Step 5:** Add the regression test

```js
// src/lib/canonicalImgDimensions.test.js
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const EXPERIMENTAL = /(Variations|Picker|Test|Wireframes|ComponentShowcase|Experimentation|FinalDraft|MobileSecondSection|HeroVariations|HeroPathPicker|JourneyPicker|ParallaxPicker|ScrollPathTest|VideoSliderPicker|TestimonialsPicker|OwnershipPicker|PPLPicker|ArrowPicker|CarouselPicker|AccordionVariations|AwardVariations|R66BenefitsVariations|ExpeditionPhilosophyVariations|ExpeditionPhilosophyJVariations|FlyingVariations|WallOfCool[A-Z])/;
const IMG_RE = /<img\b([^>]*?)\/?>/gms;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) yield full;
  }
}

describe('canonical-page <img> dimensions', () => {
  it('every <img> on a canonical page has both width and height', () => {
    const offenders = [];
    for (const dir of ['src/pages', 'src/components']) {
      const abs = path.join(ROOT, dir);
      if (!fs.existsSync(abs)) continue;
      for (const file of walk(abs)) {
        if (EXPERIMENTAL.test(path.relative(ROOT, file))) continue;
        const content = fs.readFileSync(file, 'utf8');
        let m;
        while ((m = IMG_RE.exec(content))) {
          const attrs = m[1];
          if (!/\bwidth\s*=/.test(attrs) || !/\bheight\s*=/.test(attrs)) {
            const before = content.slice(0, m.index);
            const line = (before.match(/\n/g) || []).length + 1;
            offenders.push(`${path.relative(ROOT, file)}:${line}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 6:** Run the regression test

```bash
npx vitest run src/lib/canonicalImgDimensions.test.js
```

Expected: PASS once all canonical offenders are fixed.

- [ ] **Step 7:** Commits — one per logical batch (per page or ~10 fixes)

```bash
git add src/pages/<file>.jsx
git commit -m "fix(seo): add width/height to <img> in <PageName>"
```

When canonical offenders reach zero, commit the regression test:

```bash
git add src/lib/canonicalImgDimensions.test.js
git commit -m "test(seo): regression test for canonical-page <img> dimensions"
```

---

## Task 11: Final integration check + open PR

**Files:** none

- [ ] **Step 1:** Full test suite

```bash
npm test
```

Expected: PASS (the pre-existing Firebase env-key and `react-simple-maps` test failures are acceptable; flag in PR description if persistent).

- [ ] **Step 2:** Production build + smoke

```bash
npm run build
NODE_ENV=production node server.js &
SERVER_PID=$!
sleep 3

# 1. Static route meta injected
curl -s http://localhost:7500/aircraft/r44 | grep -c '<title>Robinson R44'

# 2. /home 301
curl -I http://localhost:7500/home 2>&1 | grep -E "301|Location"

# 3. /aircraft-sales/new/r44 301
curl -I http://localhost:7500/aircraft-sales/new/r44 2>&1 | grep -E "301|Location"

# 4. www → non-www 301
curl -I -H "Host: www.hqaviation.com" http://localhost:7500/ 2>&1 | grep -E "301|Location"

kill $SERVER_PID
```

Expected: all four checks produce expected output.

- [ ] **Step 3:** Push and open PR

```bash
git push -u origin feat/seo-refinements
gh pr create --base main --head feat/seo-refinements --title "SEO refinements (server meta injection, redirects, schema, CLS)" --body "$(cat <<'EOF'
## Summary

Implements `docs/superpowers/specs/2026-04-30-seo-refinements-design.md`. Trimmed to the high-value subset; deferred items in the table below.

### Highlights

- **Server-side meta injection** — Express stamps title / description / OG / canonical / Twitter into the raw HTML response. Solves social scrapers (Facebook, Twitter, LinkedIn, iMessage, Slack, WhatsApp) and Bing.
- **URL canonicalisation** — non-www, no trailing slash, HTTPS, all enforced via 301.
- **301 redirects** for 7 legacy duplicate URLs (`/home`, `/final-ppl`, `/type-rating`, `/aircraft-sales/new/{r22,r44,r66,r88}`).
- **JSON-LD additions** — `buildTouristTrip`; Course schema wired on PPL/CPL/NightRating/AdvancedTraining; Service schema wired on six service pages; Product schema added on London tour, discovery flights, store + store items; H500 reference page gets `<Seo>` with no Product schema (informational only).
- **Image CLS hygiene** — every `<img>` on canonical pages has explicit width/height; vitest regression test fails CI if any future regression sneaks in.
- **Custom 404 page** — `NotFound.jsx` linking to popular sections, wired as the catch-all route.

### Canonical URL rules (folded from the dropped `canonical-rules.md` doc)

- Canonical form: HTTPS, non-www (`hqaviation.com`), no trailing slash (root excepted)
- Express enforces with 301 (canonicalisation middleware in `server.js`)
- Permanent redirects in `api/seoRedirects.js` (mirror of `src/lib/seoRoutes.js#CANONICAL_REDIRECTS`)
- `robots.txt` allows all routes; per-page `<meta name="robots" content="noindex">` does the indexing block (never `Disallow:` a path you want Google to honour `noindex` on)

### Deferred to follow-up PRs (not in this PR)

| Item | Why deferred |
|---|---|
| `/misc → /store` rename | Slug polish; minimal SEO benefit; mechanical migration deserves its own PR |
| `/parts` per-part Product schema | Meaningless until the parts-storefront redesign lands |
| Static sitemap `<lastmod>` | Search engines don't aggressively recrawl static pages on lastmod |

### Verification

- `npm test` — SEO tests passing
- `npm run build` — clean
- Smoke tests for static / dynamic / redirect / sitemap behaviour pass

### Test plan

- [ ] View source on each major canonical page → confirm correct meta in raw HTML (not just after JS hydration)
- [ ] Share a link to `/blog/<post>` on Slack / WhatsApp / LinkedIn → preview card shows post's cover image, title, description (the social-scraper test that motivated this PR)
- [ ] Visit `/aircraft-sales/new/r66` → 301 to `/aircraft/r66`; visit `/home` → 301 to `/`
- [ ] Visit a non-existent route → see the new NotFound page (with `<meta name="robots" content="noindex">`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4:** Note the PR URL.

---

## Self-Review

**Spec coverage (8 deliverables):**
- #1 server-side meta injection → Task 9 ✓
- #2 URL canonicalisation → Task 1 ✓
- #3 301 redirects → Task 2 ✓
- #4 `/misc → /store` rename → DEFERRED to follow-up PR
- #5 drop H500 Product schema → Task 6 ✓
- #6 expanded JSON-LD → Tasks 4, 5, 6, 7, 8 ✓
- #7 image CLS → Task 10 ✓
- #8 sitemap lastmod + robots → robots verification folded into PR description; static lastmod DROPPED (low value)

Plus the gap from the SEO checklist:
- Custom 404 page → Task 3 ✓

**Placeholder scan:** none.

**Type / API consistency:** `getMetaForPath` (Task 9) takes a path string and returns null or an object with `{ title, description, ogImage, canonicalUrl }`. Same shape consumed by `seoMetaInjection` (Task 9 same task). `buildTouristTrip` signature in Task 4 matches its use site. ✓

**Scope check:** one PR. 11 tasks. Tasks 1–3 are foundations; 4–8 are schema wiring; 9 is the architectural piece; 10 is mechanical CLS fixes; 11 is final integration. Each independently sequenceable but ships as one coherent improvement.
