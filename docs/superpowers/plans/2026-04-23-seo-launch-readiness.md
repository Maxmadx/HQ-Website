# SEO Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the HQ Aviation site from SPA-with-no-per-route-meta to launch-ready SEO baseline. Adds per-route `<title>`/`<meta>`/Open Graph/canonical/JSON-LD via `react-helmet-async`, ships dynamic `sitemap.xml` + `robots.txt`, hard-gates dev/test routes from production, and hand-tunes titles/descriptions/H1s for the top 12 customer-facing pages.

**Architecture:** A single `<Seo>` component (`src/components/seo/Seo.jsx`) renders all head tags plus optional JSON-LD blocks, driven by a single source of truth in `src/lib/seoRoutes.js`. JSON-LD builders live in `src/components/seo/jsonLd.js`. Site-wide defaults (org name, OG image, address, geo) in `src/lib/seoDefaults.js`. The dynamic `sitemap.xml` route in `api/sitemap.js` composes from `seoRoutes.js` + Firestore listings + Firestore blog posts. Dev/test routes (~30) get gated behind `import.meta.env.DEV` and disappear from the production bundle entirely.

**Tech Stack:** React 19, react-router-dom v7, react-helmet-async (new), Express 4 (server.js), Firebase Admin SDK (Firestore reads for sitemap), Vite 8 (build tool with `import.meta.env.DEV` dead-code elimination), Vitest 4 + jsdom (existing test pattern).

**Reference files:**
- Spec: `docs/superpowers/specs/2026-04-23-seo-launch-readiness-design.md`
- Existing test patterns: `src/lib/analytics.test.js`, `src/components/Expeditions/ExpeditionBarcode.test.js`, `api/stripe.test.js`
- Existing Express router pattern: `api/leads.js`, `api/analytics-api.js`
- Existing Firebase Admin init: `api/firebase-admin.js`
- Routes inventory: `src/App.jsx:130-260`

**Commit discipline:** one commit per task. Prefix `feat(seo):` for new code, `chore(seo):` for config/asset, `docs(seo):` for docs.

**User-input gates:**
- After **Task 17** (per-page tuning doc) — user reviews and approves draft titles/descriptions before any page edits.
- Before **Task 12** (sitemap) — confirm `https://hqaviation.com` is the canonical URL (already confirmed in spec).
- During **Task 5** (defaults) — owner provides exact phone, postcode, geo coordinates, opening hours for `LocalBusiness` schema.

---

## Task 1: Install `react-helmet-async`

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Outcome:** `react-helmet-async@^2` is a project dependency.

- [ ] **Step 1:** Install the package

```bash
npm install react-helmet-async
```

Expected: package added under `dependencies`, lock file updated.

- [ ] **Step 2:** Verify install

```bash
node -e "console.log(require('react-helmet-async/package.json').version)"
```

Expected: prints a version string starting with `2.` (or similar).

- [ ] **Step 3:** Commit

```bash
git add package.json package-lock.json
git commit -m "chore(seo): add react-helmet-async dependency"
```

---

## Task 2: Create `src/lib/seoDefaults.js`

**Files:**
- Create: `src/lib/seoDefaults.js`

**Outcome:** Single module exporting site-wide constants used by `<Seo>` and all JSON-LD builders.

**Note for engineer:** the `PHONE`, `POSTAL_CODE`, `GEO_LATITUDE`, `GEO_LONGITUDE`, and `OPENING_HOURS` values are placeholders. Pause and ask the owner for the exact values before completing this task — they are baked into structured data that Google reads.

- [ ] **Step 1:** Create the file

```js
// src/lib/seoDefaults.js

export const SITE_URL = 'https://hqaviation.com';
export const ORG_NAME = 'HQ Aviation';
export const ORG_LEGAL_NAME = 'HQ Aviation Ltd'; // confirm with owner
export const ORG_DESCRIPTION =
  "UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions. Based at Denham Aerodrome, London.";
export const ORG_LOGO_PATH = '/assets/images/logos/hq/hq-aviation-logo-black.png';
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const TWITTER_HANDLE = ''; // empty until owner provides
export const DEFAULT_LANG = 'en-GB';
export const DEFAULT_LOCALE = 'en_GB';

export const PHONE = '+44-1895-833333'; // PLACEHOLDER — confirm with owner
export const EMAIL = 'info@hqaviation.com'; // confirm with owner

export const ADDRESS = {
  streetAddress: 'Denham Aerodrome',
  addressLocality: 'Denham',
  addressRegion: 'Buckinghamshire',
  postalCode: 'UB9 5DF', // PLACEHOLDER — confirm with owner
  addressCountry: 'GB',
};

export const GEO = {
  latitude: 51.5897, // PLACEHOLDER — Denham approx
  longitude: -0.5141,
};

export const OPENING_HOURS = [
  // PLACEHOLDER — confirm with owner. Schema.org opening-hours format.
  'Mo-Fr 09:00-17:30',
  'Sa 09:00-16:00',
];

export const SAME_AS = [
  // Social profile URLs — owner to confirm
  // 'https://www.instagram.com/hqaviation',
  // 'https://www.facebook.com/hqaviation',
];

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}
```

- [ ] **Step 2:** Verify it imports cleanly

```bash
node --input-type=module -e "import('./src/lib/seoDefaults.js').then(m => console.log(Object.keys(m)))"
```

Expected: prints array of all exported names.

- [ ] **Step 3:** Commit

```bash
git add src/lib/seoDefaults.js
git commit -m "feat(seo): add site-wide SEO defaults module"
```

---

## Task 3: Create `src/lib/seoRoutes.js` (single source of truth)

**Files:**
- Create: `src/lib/seoRoutes.js`

**Outcome:** One module that drives the sitemap generator, the robots.txt generator, the audit crawler (Plan 2), and the dev-route gate. Every route classification lives here.

- [ ] **Step 1:** Create the file

```js
// src/lib/seoRoutes.js

/**
 * PUBLIC_ROUTES: real customer-facing routes that should be in sitemap.xml,
 * crawled by the SEO audit, and indexable by search engines.
 *
 * pageType drives the JSON-LD template the audit expects each page to have.
 */
export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0, pageType: 'landing' },
  { path: '/about-us', changefreq: 'monthly', priority: 0.7, pageType: 'about' },
  { path: '/about-us/captain-q', changefreq: 'monthly', priority: 0.5, pageType: 'about' },
  { path: '/about-us/team', changefreq: 'monthly', priority: 0.6, pageType: 'about' },
  { path: '/contact', changefreq: 'monthly', priority: 0.8, pageType: 'contact' },
  { path: '/sales/new', changefreq: 'weekly', priority: 0.9, pageType: 'sales-index' },
  { path: '/sales/pre-owned', changefreq: 'daily', priority: 0.9, pageType: 'sales-index' },
  { path: '/sales/rebuilds', changefreq: 'weekly', priority: 0.7, pageType: 'sales-index' },
  { path: '/aircraft/r22', changefreq: 'monthly', priority: 0.9, pageType: 'aircraft' },
  { path: '/aircraft/r44', changefreq: 'monthly', priority: 0.9, pageType: 'aircraft' },
  { path: '/aircraft/r66', changefreq: 'monthly', priority: 0.9, pageType: 'aircraft' },
  { path: '/aircraft/r88', changefreq: 'monthly', priority: 0.9, pageType: 'aircraft' },
  { path: '/aircraft/h500', changefreq: 'monthly', priority: 0.7, pageType: 'aircraft' },
  { path: '/training/ppl', changefreq: 'monthly', priority: 0.9, pageType: 'training' },
  { path: '/training/commercial', changefreq: 'monthly', priority: 0.8, pageType: 'training' },
  { path: '/training/type-rating', changefreq: 'monthly', priority: 0.8, pageType: 'training' },
  { path: '/training/night-rating', changefreq: 'monthly', priority: 0.7, pageType: 'training' },
  { path: '/training/trial-lessons', changefreq: 'monthly', priority: 0.8, pageType: 'training' },
  { path: '/training/advanced', changefreq: 'monthly', priority: 0.7, pageType: 'training' },
  { path: '/maintenance', changefreq: 'monthly', priority: 0.8, pageType: 'service' },
  { path: '/expeditions', changefreq: 'monthly', priority: 0.7, pageType: 'service' },
  { path: '/helicopter-tour-of-london', changefreq: 'monthly', priority: 0.8, pageType: 'service' },
  { path: '/superyacht-ops', changefreq: 'monthly', priority: 0.6, pageType: 'service' },
  { path: '/pilot-provisioning', changefreq: 'monthly', priority: 0.6, pageType: 'service' },
  { path: '/aircraft-consulting', changefreq: 'monthly', priority: 0.6, pageType: 'service' },
  { path: '/parts', changefreq: 'monthly', priority: 0.6, pageType: 'service' },
  { path: '/self-fly-hire', changefreq: 'monthly', priority: 0.7, pageType: 'service' },
  { path: '/fleet', changefreq: 'monthly', priority: 0.7, pageType: 'service' },
  { path: '/misc', changefreq: 'weekly', priority: 0.6, pageType: 'sales-index' },
  { path: '/blog', changefreq: 'weekly', priority: 0.8, pageType: 'blog-index' },
  { path: '/testimonials', changefreq: 'monthly', priority: 0.5, pageType: 'about' },
];

/**
 * Dynamic-route templates. The sitemap composes URLs by querying the
 * matching Firestore collection.
 */
export const DYNAMIC_ROUTE_TEMPLATES = [
  {
    pattern: '/sales/pre-owned/:id',
    collection: 'listings',
    filter: { field: 'status', op: '==', value: 'active' },
    pageType: 'used-aircraft',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    pattern: '/blog/:postId',
    collection: 'blogs',
    filter: { field: 'published', op: '==', value: true },
    pageType: 'blog-post',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    pattern: '/misc/:id',
    collection: 'misc_items',
    filter: { field: 'status', op: '==', value: 'active' },
    pageType: 'misc-item',
    changefreq: 'weekly',
    priority: 0.5,
  },
];

/**
 * Routes that exist in production but should not be indexed.
 * Get a <meta name="robots" content="noindex"> via <Seo noindex>.
 * Also added to robots.txt Disallow.
 */
export const NOINDEX_ROUTES = [
  '/checkout',
  '/booking-confirmed',
  '/london-tour-checkout',
  '/london-tour-confirmed',
  '/hq-account',
  '/sitemap', // the human-readable sitemap component, not /sitemap.xml
];

/**
 * Routes that must be redirected to a canonical equivalent for SEO
 * purposes (rel=canonical points to the canonical URL).
 * key: duplicate URL, value: canonical URL
 */
export const CANONICAL_REDIRECTS = {
  '/aircraft-sales/new/r22': '/aircraft/r22',
  '/aircraft-sales/new/r44': '/aircraft/r44',
  '/aircraft-sales/new/r66': '/aircraft/r66',
  '/aircraft-sales/new/r88': '/aircraft/r88',
  '/final-ppl': '/training/ppl',
  '/type-rating': '/training/type-rating',
};

/**
 * Dev/test/picker routes. Hard-gated behind import.meta.env.DEV in App.jsx
 * so they are stripped from production bundle. Also added to robots.txt
 * Disallow as a defence-in-depth measure.
 */
export const DEV_ONLY_ROUTES = [
  '/hero-test',
  '/hero-section-test',
  '/hero-section-final',
  '/hero-section-final-testing',
  '/testing-hero-section',
  '/award-variations',
  '/mobile-second-section',
  '/sfh-variations',
  '/wireframes',
  '/accordion-variations',
  '/r66-benefits-variations',
  '/about-us-variations',
  '/flying-variations',
  '/final-draft',
  '/experimentation',
  '/experimentation-2',
  '/endofmarchversion',
  '/sfhtests',
  '/authorisedservicecentercard',
  '/scroll-path-test',
  '/carousel-picker',
  '/carousel-picker-v2',
  '/arrow-picker',
  '/components',
  '/hero-path-picker',
  '/parallax-picker',
  '/ownership-picker',
  '/ppl-picker',
  '/final-why-fly-a-helicopter',
  '/sales/sliding-gallery-variations',
  '/sales/pre-owned-2',
  '/sales/pre-owned-variations',
  '/journey-lines-picker',
  '/journey-picker',
  '/video-slider-picker',
  '/testimonials-picker',
];
```

- [ ] **Step 2:** Verify

```bash
node --input-type=module -e "import('./src/lib/seoRoutes.js').then(m => console.log('public:', m.PUBLIC_ROUTES.length, 'dev:', m.DEV_ONLY_ROUTES.length, 'noindex:', m.NOINDEX_ROUTES.length))"
```

Expected: prints counts (public should be ~30, dev should be ~36, noindex should be 6).

- [ ] **Step 3:** Commit

```bash
git add src/lib/seoRoutes.js
git commit -m "feat(seo): add seoRoutes single source of truth"
```

---

## Task 4: Build `<Seo>` component with tests

**Files:**
- Create: `src/components/seo/Seo.jsx`
- Create: `src/components/seo/Seo.test.jsx`

**Outcome:** One component that renders `<title>`, `<meta description>`, canonical, Open Graph, Twitter card, optional `noindex`, and any number of JSON-LD blocks. Pure declarative — pages just drop one of these in.

- [ ] **Step 1:** Write the failing test

```jsx
// src/components/seo/Seo.test.jsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Seo from './Seo';

function renderWithHelmet(ui) {
  const helmetContext = {};
  render(<HelmetProvider context={helmetContext}>{ui}</HelmetProvider>);
  return helmetContext.helmet;
}

describe('Seo', () => {
  it('renders title with org suffix', () => {
    const helmet = renderWithHelmet(<Seo title="Aircraft Sales" description="Buy a Robinson" />);
    expect(helmet.title.toString()).toContain('Aircraft Sales | HQ Aviation');
  });

  it('renders meta description', () => {
    const helmet = renderWithHelmet(<Seo title="X" description="A clear description" />);
    expect(helmet.meta.toString()).toContain('A clear description');
  });

  it('renders canonical from explicit prop', () => {
    const helmet = renderWithHelmet(<Seo title="X" canonical="https://hqaviation.com/foo" />);
    expect(helmet.link.toString()).toContain('rel="canonical"');
    expect(helmet.link.toString()).toContain('https://hqaviation.com/foo');
  });

  it('renders Open Graph and Twitter tags', () => {
    const helmet = renderWithHelmet(<Seo title="X" description="D" />);
    const meta = helmet.meta.toString();
    expect(meta).toContain('og:title');
    expect(meta).toContain('og:description');
    expect(meta).toContain('og:image');
    expect(meta).toContain('twitter:card');
  });

  it('renders noindex when prop set', () => {
    const helmet = renderWithHelmet(<Seo title="X" noindex />);
    expect(helmet.meta.toString()).toContain('noindex');
  });

  it('does not render robots tag when noindex false', () => {
    const helmet = renderWithHelmet(<Seo title="X" />);
    expect(helmet.meta.toString()).not.toContain('noindex');
  });

  it('renders one JSON-LD script per block', () => {
    const helmet = renderWithHelmet(
      <Seo title="X" jsonLd={[{ '@type': 'A' }, { '@type': 'B' }]} />
    );
    const script = helmet.script.toString();
    expect(script.match(/application\/ld\+json/g)?.length).toBe(2);
    expect(script).toContain('"@type":"A"');
    expect(script).toContain('"@type":"B"');
  });
});
```

- [ ] **Step 2:** Install test deps if missing

```bash
npm ls @testing-library/react || npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Expected: package available.

- [ ] **Step 3:** Run test to confirm it fails

```bash
npx vitest run src/components/seo/Seo.test.jsx
```

Expected: FAIL — `Cannot find module './Seo'`.

- [ ] **Step 4:** Implement the component

```jsx
// src/components/seo/Seo.jsx
import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  ORG_NAME,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  DEFAULT_LANG,
  DEFAULT_LOCALE,
  absoluteUrl,
} from '../../lib/seoDefaults';

export default function Seo({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const canonicalUrl = canonical || `${SITE_URL}${normalizedPath}`;
  const image = absoluteUrl(ogImage || DEFAULT_OG_IMAGE);
  const fullTitle = title ? `${title} | ${ORG_NAME}` : ORG_NAME;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={DEFAULT_LANG} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={ORG_NAME} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
```

- [ ] **Step 5:** Run tests to confirm pass

```bash
npx vitest run src/components/seo/Seo.test.jsx
```

Expected: PASS — all 7 tests green.

- [ ] **Step 6:** Commit

```bash
git add src/components/seo/Seo.jsx src/components/seo/Seo.test.jsx package.json package-lock.json
git commit -m "feat(seo): add Seo component with helmet-driven head tags"
```

---

## Task 5: JSON-LD builders — `Organization` and `WebSite`

**Files:**
- Create: `src/components/seo/jsonLd.js`
- Create: `src/components/seo/jsonLd.test.js`

**Outcome:** Pure functions that return well-formed schema.org JSON-LD objects. Site-wide builders (Organization, WebSite) come first; per-page builders are added in Tasks 6 and 7.

- [ ] **Step 1:** Write the failing test

```js
// src/components/seo/jsonLd.test.js
import { describe, it, expect } from 'vitest';
import { buildOrganization, buildWebSite } from './jsonLd';

describe('buildOrganization', () => {
  it('returns Organization with required fields', () => {
    const org = buildOrganization();
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('HQ Aviation');
    expect(org.url).toBe('https://hqaviation.com');
    expect(org.logo).toMatch(/^https:\/\/hqaviation.com/);
  });
});

describe('buildWebSite', () => {
  it('returns WebSite with SearchAction', () => {
    const site = buildWebSite();
    expect(site['@type']).toBe('WebSite');
    expect(site.url).toBe('https://hqaviation.com');
    expect(site.potentialAction['@type']).toBe('SearchAction');
    expect(site.potentialAction.target).toContain('{search_term_string}');
  });
});
```

- [ ] **Step 2:** Run test to confirm it fails

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: FAIL — `Cannot find module './jsonLd'`.

- [ ] **Step 3:** Implement the builders

```js
// src/components/seo/jsonLd.js
import {
  SITE_URL,
  ORG_NAME,
  ORG_LEGAL_NAME,
  ORG_DESCRIPTION,
  ORG_LOGO_PATH,
  PHONE,
  EMAIL,
  ADDRESS,
  GEO,
  OPENING_HOURS,
  SAME_AS,
  absoluteUrl,
} from '../../lib/seoDefaults';

export function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    description: ORG_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl(ORG_LOGO_PATH),
    telephone: PHONE,
    email: EMAIL,
    sameAs: SAME_AS,
  };
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-GB',
  };
}
```

- [ ] **Step 4:** Run test to confirm pass

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: PASS — both tests green.

- [ ] **Step 5:** Commit

```bash
git add src/components/seo/jsonLd.js src/components/seo/jsonLd.test.js
git commit -m "feat(seo): add Organization and WebSite JSON-LD builders"
```

---

## Task 6: JSON-LD builders — `LocalBusiness` and `BreadcrumbList`

**Files:**
- Modify: `src/components/seo/jsonLd.js`
- Modify: `src/components/seo/jsonLd.test.js`

**Outcome:** Two more builders. `LocalBusiness` for the contact + landing pages (Google Business Profile-equivalent structured data); `BreadcrumbList` for nested pages.

- [ ] **Step 1:** Write the failing tests (append)

```js
// append to src/components/seo/jsonLd.test.js
import { buildLocalBusiness, buildBreadcrumbList } from './jsonLd';

describe('buildLocalBusiness', () => {
  it('returns LocalBusiness with address and geo', () => {
    const lb = buildLocalBusiness();
    expect(lb['@type']).toBe('LocalBusiness');
    expect(lb.address['@type']).toBe('PostalAddress');
    expect(lb.address.addressLocality).toBe('Denham');
    expect(lb.geo.latitude).toBeCloseTo(51.5897);
    expect(Array.isArray(lb.openingHoursSpecification) || typeof lb.openingHours === 'string' || Array.isArray(lb.openingHours)).toBe(true);
  });
});

describe('buildBreadcrumbList', () => {
  it('returns ordered list of BreadcrumbItems', () => {
    const bc = buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Aircraft', path: '/aircraft' },
      { name: 'R66', path: '/aircraft/r66' },
    ]);
    expect(bc['@type']).toBe('BreadcrumbList');
    expect(bc.itemListElement).toHaveLength(3);
    expect(bc.itemListElement[0].position).toBe(1);
    expect(bc.itemListElement[2].item).toBe('https://hqaviation.com/aircraft/r66');
  });
});
```

- [ ] **Step 2:** Run tests to confirm new ones fail

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: FAIL — `buildLocalBusiness is not defined`.

- [ ] **Step 3:** Implement both builders (append to `jsonLd.js`)

```js
// append to src/components/seo/jsonLd.js

export function buildLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: absoluteUrl(ORG_LOGO_PATH),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.streetAddress,
      addressLocality: ADDRESS.addressLocality,
      addressRegion: ADDRESS.addressRegion,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    openingHours: OPENING_HOURS,
    priceRange: '£££',
  };
}

export function buildBreadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
```

- [ ] **Step 4:** Run tests to confirm pass

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: PASS — all 4 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/components/seo/jsonLd.js src/components/seo/jsonLd.test.js
git commit -m "feat(seo): add LocalBusiness and BreadcrumbList JSON-LD builders"
```

---

## Task 7: JSON-LD builders — `Product`, `Article`, `FAQPage`

**Files:**
- Modify: `src/components/seo/jsonLd.js`
- Modify: `src/components/seo/jsonLd.test.js`

**Outcome:** Per-page-type builders. `Product` for aircraft pages; `Article` for blog posts; `FAQPage` for any page using the FAQ accordion.

- [ ] **Step 1:** Write the failing tests (append)

```js
// append to src/components/seo/jsonLd.test.js
import { buildProduct, buildArticle, buildFAQPage } from './jsonLd';

describe('buildProduct', () => {
  it('returns Product schema', () => {
    const p = buildProduct({
      name: 'Robinson R66',
      description: 'Five-seat turbine',
      image: '/img/r66.jpg',
      brand: 'Robinson Helicopters',
      url: '/aircraft/r66',
    });
    expect(p['@type']).toBe('Product');
    expect(p.name).toBe('Robinson R66');
    expect(p.image).toBe('https://hqaviation.com/img/r66.jpg');
    expect(p.brand['@type']).toBe('Brand');
    expect(p.brand.name).toBe('Robinson Helicopters');
    expect(p.offers['@type']).toBe('Offer');
  });
});

describe('buildArticle', () => {
  it('returns Article schema with required fields', () => {
    const a = buildArticle({
      headline: 'My post',
      description: 'About flying',
      image: '/img/post.jpg',
      datePublished: '2026-04-01',
      dateModified: '2026-04-10',
      authorName: 'Jane Pilot',
      url: '/blog/my-post',
    });
    expect(a['@type']).toBe('Article');
    expect(a.headline).toBe('My post');
    expect(a.author.name).toBe('Jane Pilot');
    expect(a.datePublished).toBe('2026-04-01');
    expect(a.publisher['@id']).toBe('https://hqaviation.com/#organization');
  });
});

describe('buildFAQPage', () => {
  it('returns FAQPage with mainEntity questions', () => {
    const f = buildFAQPage([
      { q: 'Where are you?', a: 'Denham.' },
      { q: 'Cost?', a: 'POA.' },
    ]);
    expect(f['@type']).toBe('FAQPage');
    expect(f.mainEntity).toHaveLength(2);
    expect(f.mainEntity[0]['@type']).toBe('Question');
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('Denham.');
  });
});
```

- [ ] **Step 2:** Run tests to confirm new ones fail

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: FAIL — `buildProduct is not defined`.

- [ ] **Step 3:** Implement (append to `jsonLd.js`)

```js
// append to src/components/seo/jsonLd.js

export function buildProduct({ name, description, image, brand = 'Robinson Helicopters', url, offers }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: absoluteUrl(image),
    brand: { '@type': 'Brand', name: brand },
    url: absoluteUrl(url),
    offers: offers || {
      '@type': 'Offer',
      url: absoluteUrl(url),
      availability: 'https://schema.org/InStock',
      priceCurrency: 'GBP',
      priceSpecification: { '@type': 'PriceSpecification', price: 'POA' },
    },
  };
}

export function buildArticle({ headline, description, image, datePublished, dateModified, authorName, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image ? absoluteUrl(image) : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Person', name: authorName || ORG_NAME },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(url) },
  };
}

export function buildFAQPage(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
```

- [ ] **Step 4:** Run tests to confirm pass

```bash
npx vitest run src/components/seo/jsonLd.test.js
```

Expected: PASS — all 7 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/components/seo/jsonLd.js src/components/seo/jsonLd.test.js
git commit -m "feat(seo): add Product, Article, FAQPage JSON-LD builders"
```

---

## Task 8: Wrap App in `<HelmetProvider>` + add site-wide JSON-LD

**Files:**
- Modify: `src/App.jsx`

**Outcome:** All pages can use `<Seo>`. Site-wide Organization + WebSite + LocalBusiness JSON-LD blocks render on every page (declared once in App, no per-page repeat).

- [ ] **Step 1:** Open `src/App.jsx`. Find the existing import block at the top.

- [ ] **Step 2:** Add imports

```jsx
import { HelmetProvider } from 'react-helmet-async';
import Seo from './components/seo/Seo';
import { buildOrganization, buildWebSite, buildLocalBusiness } from './components/seo/jsonLd';
```

- [ ] **Step 3:** Locate the top-level `<Router>` element (around line 130). Wrap it in `<HelmetProvider>` and add a site-wide `<Seo>` for default JSON-LD only:

Before:
```jsx
return (
  <Router>
    <ScrollToTop />
    {/* ... */}
    <Routes>
      {/* ... */}
    </Routes>
  </Router>
);
```

After:
```jsx
return (
  <HelmetProvider>
    <Router>
      <Seo jsonLd={[buildOrganization(), buildWebSite(), buildLocalBusiness()]} />
      <ScrollToTop />
      {/* ... */}
      <Routes>
        {/* ... */}
      </Routes>
    </Router>
  </HelmetProvider>
);
```

Note: per-page `<Seo>` calls override the site-wide `<title>`/`<description>` because react-helmet uses last-wins for non-array tags. JSON-LD scripts accumulate.

- [ ] **Step 4:** Start dev server and verify

```bash
npm run dev
```

Open `http://localhost:5173` (or whatever port Vite reports). View source. Confirm:
- `<title>HQ Aviation</title>` appears
- 3 `<script type="application/ld+json">` blocks appear in `<head>` (Organization, WebSite, LocalBusiness)
- No JS errors in browser console

- [ ] **Step 5:** Commit

```bash
git add src/App.jsx
git commit -m "feat(seo): wrap app in HelmetProvider with site-wide JSON-LD"
```

---

## Task 9: Hard-gate dev/test routes via `import.meta.env.DEV`

**Files:**
- Modify: `src/App.jsx`

**Outcome:** Dev/test routes (~36 of them) only register in development. Production bundle ships ~30% smaller (estimate). Visiting `/hero-test` etc. on production returns the 404 component.

- [ ] **Step 1:** Open `src/App.jsx`. At top of `App` function (or just before `return`), add:

```jsx
const SHOW_DEV_ROUTES = import.meta.env.DEV; // flip to true to ship dev routes
```

- [ ] **Step 2:** Wrap each dev route from the list in `src/lib/seoRoutes.js#DEV_ONLY_ROUTES`. The simplest pattern is a single conditional fragment that contains all of them. Inside `<Routes>`, locate the contiguous block of dev/test routes and wrap:

```jsx
{SHOW_DEV_ROUTES && (
  <>
    <Route path="/hero-test" element={<HeroTest />} />
    <Route path="/hero-section-test" element={<HeroSectionTest />} />
    {/* ...every route whose path appears in DEV_ONLY_ROUTES */}
  </>
)}
```

The dev routes are scattered across `src/App.jsx` lines 136–192 (with non-dev routes interleaved). Move them into one contiguous `{SHOW_DEV_ROUTES && (<>…</>)}` block to keep the production tree clean. Keep the non-dev routes (`/training/ppl`, `/training/type-rating`, `/components`-not-in-dev-list, `/sitemap`, etc.) outside the block.

**Cross-check against `DEV_ONLY_ROUTES`** before moving each route — if it's in the array it goes inside the block; if not, it stays outside.

- [ ] **Step 3:** Verify production build does not include dev components

```bash
npm run build
```

Then:

```bash
grep -r "HeroTest" dist/assets/*.js | head -5
```

Expected: no output (the `HeroTest` component name should not appear in any production JS chunk).

- [ ] **Step 4:** Verify dev mode still works

```bash
npm run dev
```

Visit `http://localhost:5173/hero-test` and confirm the page loads.

- [ ] **Step 5:** Commit

```bash
git add src/App.jsx
git commit -m "chore(seo): hard-gate dev/test routes via import.meta.env.DEV"
```

---

## Task 10: Create `public/robots.txt`

**Files:**
- Create: `public/robots.txt`

**Outcome:** Search engines see explicit allow/disallow rules and the sitemap reference.

- [ ] **Step 1:** Create the file

```
User-agent: *
Allow: /

# Admin and account areas
Disallow: /admin
Disallow: /admin/
Disallow: /hq-account

# Checkout / confirmation pages (no SEO value, contain transient state)
Disallow: /checkout
Disallow: /booking-confirmed
Disallow: /london-tour-checkout
Disallow: /london-tour-confirmed

# Internal sitemap component (use /sitemap.xml instead)
Disallow: /sitemap
Allow: /sitemap.xml

# Defence-in-depth: dev/test routes are stripped from prod build but list here too
Disallow: /hero-test
Disallow: /hero-section-test
Disallow: /carousel-picker
Disallow: /arrow-picker
Disallow: /ownership-picker
Disallow: /ppl-picker
Disallow: /journey-picker
Disallow: /journey-lines-picker
Disallow: /parallax-picker
Disallow: /testimonials-picker
Disallow: /video-slider-picker
Disallow: /hero-path-picker
Disallow: /scroll-path-test
Disallow: /wireframes
Disallow: /accordion-variations
Disallow: /award-variations
Disallow: /sfh-variations
Disallow: /flying-variations
Disallow: /about-us-variations
Disallow: /r66-benefits-variations
Disallow: /sales/sliding-gallery-variations
Disallow: /sales/pre-owned-variations
Disallow: /sales/pre-owned-2
Disallow: /experimentation
Disallow: /experimentation-2
Disallow: /endofmarchversion
Disallow: /final-draft
Disallow: /sfhtests
Disallow: /authorisedservicecentercard
Disallow: /components
Disallow: /mobile-second-section
Disallow: /testing-hero-section

# Honor Googlebot crawl rate (default is fine; left here for future tuning)
# Crawl-delay: 1

Sitemap: https://hqaviation.com/sitemap.xml
```

- [ ] **Step 2:** Verify file present

```bash
ls -la public/robots.txt && head -3 public/robots.txt
```

Expected: file exists, prints first 3 lines.

- [ ] **Step 3:** Commit

```bash
git add public/robots.txt
git commit -m "feat(seo): add robots.txt"
```

---

## Task 11: Build dynamic `sitemap.xml` Express router with tests

**Files:**
- Create: `api/sitemap.js`
- Create: `api/sitemap.test.js`

**Outcome:** `GET /sitemap.xml` returns a valid XML sitemap composed from `seoRoutes.js` + Firestore `listings` (active) + Firestore `blogs` (published) + Firestore `misc_items` (active). 1-hour in-memory cache.

**Design note:** since `src/lib/seoRoutes.js` uses ESM (frontend) but `api/*` is CommonJS (backend), duplicate the route data via a small JSON file (or inline the public-routes list in the API). Inlining is simpler — see Step 4. If you want a single source of truth across both worlds later, convert `api/` to ESM (separate effort, not in this plan).

- [ ] **Step 1:** Write the failing test

```js
// api/sitemap.test.js
const { describe, it, expect, vi, beforeEach } = require('vitest');
const express = require('express');
const request = require('supertest');

vi.mock('./firebase-admin', () => ({
  db: {
    collection: (name) => ({
      where: () => ({
        get: async () => {
          if (name === 'listings') {
            return {
              docs: [
                { id: 'lst-1', data: () => ({ updatedAt: { toDate: () => new Date('2026-04-01') } }) },
              ],
            };
          }
          if (name === 'blogs') {
            return {
              docs: [
                { id: 'post-a', data: () => ({ updatedAt: { toDate: () => new Date('2026-03-15') } }) },
              ],
            };
          }
          if (name === 'misc_items') {
            return { docs: [] };
          }
          return { docs: [] };
        },
      }),
    }),
  },
}));

const sitemapRouter = require('./sitemap');

describe('GET /sitemap.xml', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(sitemapRouter);
  });

  it('returns 200 and XML content type', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/xml/);
  });

  it('includes static routes', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.text).toContain('<loc>https://hqaviation.com/</loc>');
    expect(res.text).toContain('<loc>https://hqaviation.com/aircraft/r66</loc>');
    expect(res.text).toContain('<loc>https://hqaviation.com/training/ppl</loc>');
  });

  it('includes dynamic listing URLs from Firestore', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.text).toContain('<loc>https://hqaviation.com/sales/pre-owned/lst-1</loc>');
  });

  it('includes dynamic blog URLs from Firestore', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.text).toContain('<loc>https://hqaviation.com/blog/post-a</loc>');
  });

  it('does NOT include dev or noindex routes', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.text).not.toContain('/hero-test');
    expect(res.text).not.toContain('/checkout');
  });
});
```

- [ ] **Step 2:** Install supertest if missing

```bash
npm ls supertest || npm install --save-dev supertest
```

- [ ] **Step 3:** Run test to confirm it fails

```bash
npx vitest run api/sitemap.test.js
```

Expected: FAIL — `Cannot find module './sitemap'`.

- [ ] **Step 4:** Implement the router

```js
// api/sitemap.js
'use strict';

const express = require('express');
const { db } = require('./firebase-admin');

const router = express.Router();

const SITE_URL = 'https://hqaviation.com';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Inline mirror of src/lib/seoRoutes.js#PUBLIC_ROUTES.
// If you change one, change both. Long-term: convert api/ to ESM and import.
const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about-us', changefreq: 'monthly', priority: 0.7 },
  { path: '/about-us/captain-q', changefreq: 'monthly', priority: 0.5 },
  { path: '/about-us/team', changefreq: 'monthly', priority: 0.6 },
  { path: '/contact', changefreq: 'monthly', priority: 0.8 },
  { path: '/sales/new', changefreq: 'weekly', priority: 0.9 },
  { path: '/sales/pre-owned', changefreq: 'daily', priority: 0.9 },
  { path: '/sales/rebuilds', changefreq: 'weekly', priority: 0.7 },
  { path: '/aircraft/r22', changefreq: 'monthly', priority: 0.9 },
  { path: '/aircraft/r44', changefreq: 'monthly', priority: 0.9 },
  { path: '/aircraft/r66', changefreq: 'monthly', priority: 0.9 },
  { path: '/aircraft/r88', changefreq: 'monthly', priority: 0.9 },
  { path: '/aircraft/h500', changefreq: 'monthly', priority: 0.7 },
  { path: '/training/ppl', changefreq: 'monthly', priority: 0.9 },
  { path: '/training/commercial', changefreq: 'monthly', priority: 0.8 },
  { path: '/training/type-rating', changefreq: 'monthly', priority: 0.8 },
  { path: '/training/night-rating', changefreq: 'monthly', priority: 0.7 },
  { path: '/training/trial-lessons', changefreq: 'monthly', priority: 0.8 },
  { path: '/training/advanced', changefreq: 'monthly', priority: 0.7 },
  { path: '/maintenance', changefreq: 'monthly', priority: 0.8 },
  { path: '/expeditions', changefreq: 'monthly', priority: 0.7 },
  { path: '/helicopter-tour-of-london', changefreq: 'monthly', priority: 0.8 },
  { path: '/superyacht-ops', changefreq: 'monthly', priority: 0.6 },
  { path: '/pilot-provisioning', changefreq: 'monthly', priority: 0.6 },
  { path: '/aircraft-consulting', changefreq: 'monthly', priority: 0.6 },
  { path: '/parts', changefreq: 'monthly', priority: 0.6 },
  { path: '/self-fly-hire', changefreq: 'monthly', priority: 0.7 },
  { path: '/fleet', changefreq: 'monthly', priority: 0.7 },
  { path: '/misc', changefreq: 'weekly', priority: 0.6 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { path: '/testimonials', changefreq: 'monthly', priority: 0.5 },
];

let cache = { xml: null, expiresAt: 0 };

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

function urlEntry({ path, lastmod, changefreq, priority }) {
  const loc = `${SITE_URL}${path}`;
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority != null ? `    <priority>${priority.toFixed(1)}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function fetchDynamicEntries() {
  const entries = [];

  try {
    const listings = await db.collection('listings').where('status', '==', 'active').get();
    for (const doc of listings.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/sales/pre-owned/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.8 });
    }
  } catch (e) { console.error('[sitemap] listings fetch failed:', e.message); }

  try {
    const blogs = await db.collection('blogs').where('published', '==', true).get();
    for (const doc of blogs.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/blog/${doc.id}`, lastmod, changefreq: 'monthly', priority: 0.6 });
    }
  } catch (e) { console.error('[sitemap] blogs fetch failed:', e.message); }

  try {
    const misc = await db.collection('misc_items').where('status', '==', 'active').get();
    for (const doc of misc.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/misc/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.5 });
    }
  } catch (e) { console.error('[sitemap] misc fetch failed:', e.message); }

  return entries;
}

async function buildSitemap() {
  const dynamicEntries = await fetchDynamicEntries();
  const entries = [...PUBLIC_ROUTES, ...dynamicEntries];
  const body = entries.map(urlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

router.get('/sitemap.xml', async (req, res) => {
  try {
    const now = Date.now();
    if (!cache.xml || now >= cache.expiresAt) {
      cache.xml = await buildSitemap();
      cache.expiresAt = now + CACHE_TTL_MS;
    }
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(cache.xml);
  } catch (err) {
    console.error('[sitemap] failed:', err);
    res.status(500).send('<?xml version="1.0"?><error>sitemap generation failed</error>');
  }
});

// Exposed for testing — flushes cache
router.flushSitemapCache = () => { cache = { xml: null, expiresAt: 0 }; };

module.exports = router;
```

- [ ] **Step 5:** Run test to confirm pass

```bash
npx vitest run api/sitemap.test.js
```

Expected: PASS — all 5 tests green.

- [ ] **Step 6:** Commit

```bash
git add api/sitemap.js api/sitemap.test.js package.json package-lock.json
git commit -m "feat(seo): dynamic sitemap.xml with Firestore listings + blogs"
```

---

## Task 12: Wire sitemap router in `server.js`

**Files:**
- Modify: `server.js`

**Outcome:** `GET /sitemap.xml` is reachable from the running server.

- [ ] **Step 1:** Open `server.js`. Find the existing router imports near the top (around line 22–28).

- [ ] **Step 2:** Add the require

```js
const sitemapRouter = require('./api/sitemap');
```

- [ ] **Step 3:** Find where other routers are mounted (search for `app.use(leadsRouter)` or similar). After the other router mounts, add:

```js
app.use(sitemapRouter);
```

(Note: no path prefix — the router itself defines `/sitemap.xml`.)

- [ ] **Step 4:** Start the server and verify

```bash
npm run dev
```

In a second terminal:

```bash
curl -s http://localhost:7500/sitemap.xml | head -20
```

Expected: prints XML starting with `<?xml version="1.0"…>` followed by `<urlset>` and `<url>` entries.

- [ ] **Step 5:** Commit

```bash
git add server.js
git commit -m "feat(seo): mount sitemap router in server.js"
```

---

## Task 13: Generate `public/og-default.png` from existing hero

**Files:**
- Create: `public/og-default.png` (1200×630 PNG)

**Outcome:** Default Open Graph image exists at the URL referenced in `seoDefaults.DEFAULT_OG_IMAGE`. Owner can later swap the file without touching code.

**Note for engineer:** pick a strong, brand-recognisable hero image from `public/assets/images/`. Look in `public/assets/images/new-aircraft/` or hero folders for high-resolution helicopter shots with the HQ branding visible. The image should be visually striking when shown at link-card size (~600px wide on most platforms).

- [ ] **Step 1:** Identify a candidate source image

```bash
find public/assets/images -name "*.jpg" -o -name "*.png" | xargs ls -lhS 2>/dev/null | head -20
```

Pick a 1920×1080 (or wider) hero shot with subject offset to one side (so a 1200×630 crop doesn't cut the helicopter in half).

- [ ] **Step 2:** Crop to 1200×630 using `sips` (built-in on macOS) or ImageMagick

Using sips (macOS):
```bash
# Replace SOURCE with chosen path
SOURCE="public/assets/images/new-aircraft/r66/r66-hero.jpg"
mkdir -p public
sips -Z 1400 "$SOURCE" --out /tmp/og-resized.jpg
sips -c 630 1200 /tmp/og-resized.jpg --out public/og-default.png -s format png
```

If sips isn't available, use ImageMagick:
```bash
magick "$SOURCE" -resize 1400x -gravity center -crop 1200x630+0+0 +repage public/og-default.png
```

- [ ] **Step 3:** Verify dimensions

```bash
sips -g pixelWidth -g pixelHeight public/og-default.png
```

Expected: `pixelWidth: 1200`, `pixelHeight: 630`.

- [ ] **Step 4:** Commit

```bash
git add public/og-default.png
git commit -m "chore(seo): add default Open Graph image (1200x630 hero crop)"
```

---

## Task 14: Improve `index.html` baseline meta

**Files:**
- Modify: `index.html`

**Outcome:** Crawlers that don't execute JavaScript still see solid meta. JS-enabled crawlers will see the per-page `<Seo>` overrides.

- [ ] **Step 1:** Open `index.html`.

- [ ] **Step 2:** Replace the `<head>` baseline section (the `<title>` + `<meta description>` + add new tags). Final `<head>` should contain (preserving existing font + favicon links):

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/assets/images/logos/hq/hq-aviation-logo-black.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Baseline SEO (overridden per-route by react-helmet-async) -->
  <title>HQ Aviation | Robinson Helicopter Dealer, Training & Expeditions</title>
  <meta name="description" content="UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions. Based at Denham Aerodrome, London." />
  <link rel="canonical" href="https://hqaviation.com/" />

  <!-- Open Graph baseline -->
  <meta property="og:site_name" content="HQ Aviation" />
  <meta property="og:title" content="HQ Aviation | Robinson Helicopter Dealer, Training & Expeditions" />
  <meta property="og:description" content="UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions. Based at Denham Aerodrome, London." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://hqaviation.com/" />
  <meta property="og:image" content="https://hqaviation.com/og-default.png" />
  <meta property="og:locale" content="en_GB" />

  <!-- Twitter baseline -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="HQ Aviation | Robinson Helicopter Dealer, Training & Expeditions" />
  <meta name="twitter:description" content="UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions. Based at Denham Aerodrome, London." />
  <meta name="twitter:image" content="https://hqaviation.com/og-default.png" />

  <!-- Existing fonts and Font Awesome (KEEP AS-IS) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
```

Keep `<html lang="en-GB">` as-is.

- [ ] **Step 3:** Verify dev server still starts

```bash
npm run dev
```

Visit `http://localhost:5173/` and view source. Confirm new tags appear and react-helmet adds JSON-LD scripts after.

- [ ] **Step 4:** Commit

```bash
git add index.html
git commit -m "feat(seo): add baseline OG/Twitter/canonical to index.html"
```

---

## Task 15: Hand-write initial `docs/seo/seo-audit.md`

**Files:**
- Create: `docs/seo/seo-audit.md`

**Outcome:** A standing audit/notes document the owner can read pre-launch. Plan 2 (admin SEO tab) will regenerate this from real audit runs; this version is the by-hand baseline.

- [ ] **Step 1:** Audit the current state by hand. For each top page (landing, /aircraft, /aircraft/r22, /aircraft/r44, /aircraft/r66, /aircraft/r88, /training/ppl, /training/commercial, /training/type-rating, /training/trial-lessons, /maintenance, /contact, /expeditions), open the page in a browser (after Tasks 1–14 are done) and note: title, description, h1, image-alt coverage. Use the `searchfit-seo:seo-audit` skill if available to assist with the audit framework.

- [ ] **Step 2:** Write the audit doc

```markdown
# HQ Aviation SEO Audit — Pre-Launch Baseline

**Date:** 2026-04-23 (regenerated automatically by /admin/seo from Plan 2)
**Auditor:** hand-written initial baseline
**Production domain:** https://hqaviation.com (pre-launch)

## Summary

[Fill in after walking the site post-Tasks 1–14.]

Site composite score: TBD/100 (will be computed by /admin/seo)
Pages audited: 31 (PUBLIC_ROUTES) + dynamic listings + dynamic blogs

## Foundational infrastructure status

| Item | Status |
|------|--------|
| Per-route `<title>` and `<meta description>` | ✓ via `<Seo>` component |
| Canonical URLs | ✓ auto-generated, manual override supported |
| `robots.txt` | ✓ at `public/robots.txt` |
| `sitemap.xml` | ✓ dynamic at `/sitemap.xml` |
| Open Graph + Twitter card | ✓ baseline in `index.html`, per-page via `<Seo>` |
| JSON-LD: Organization | ✓ site-wide |
| JSON-LD: WebSite | ✓ site-wide |
| JSON-LD: LocalBusiness | ✓ site-wide |
| JSON-LD: Product (aircraft pages) | [pending Task 17] |
| JSON-LD: Article (blog posts) | [pending Task 18] |
| JSON-LD: FAQPage | [pending Task 19] |
| JSON-LD: BreadcrumbList | [pending Task 19] |
| Default OG image | ✓ at `/og-default.png` (1200×630) |
| Dev/test routes hard-gated | ✓ via `import.meta.env.DEV` |
| Duplicate aircraft URLs canonicalised | [pending Task 20] |

## Pages audited (post Tasks 1–14)

| URL | Title | Description | H1 | Score |
|-----|-------|-------------|----|----|
| / | [observe] | [observe] | [observe] | [observe] |
| /aircraft | … | … | … | … |
[repeat for all PUBLIC_ROUTES]

## Critical issues

[Fill in after audit walk. Examples to look for:]
- Pages with duplicate titles
- Pages missing description
- Pages with multiple `<h1>` or no `<h1>`
- Images missing `alt`
- Word count < 100

## Quick wins

[Fill in. Examples:]
- Pages currently ranking 4–10 for tracked queries (post-launch, populates from GSC)
- Pages with high impressions / low CTR (title tuning)

## Per-page tuning

See `docs/seo/per-page-tuning.md` for the proposed top-12 page tunings (owner-approval gate before implementation in Tasks 17–19).
```

- [ ] **Step 3:** Commit

```bash
mkdir -p docs/seo
git add docs/seo/seo-audit.md
git commit -m "docs(seo): add hand-written initial SEO audit baseline"
```

---

## Task 16: Generate `docs/seo/per-page-tuning.md` for top 12 — OWNER APPROVAL GATE

**Files:**
- Create: `docs/seo/per-page-tuning.md`

**Outcome:** Proposed title, description, H1, and internal-link suggestions for each of the 12 priority pages. **Engineer must stop after writing this and ask the owner to review before editing any page files.**

**Note for engineer:** invoke the `searchfit-seo:on-page-seo` skill (and `searchfit-seo:keyword-clustering` for keyword grouping) to generate keyword-driven proposals. Do not invent target keywords without skill assistance.

The 12 pages:
1. `/` (landing — `Experimentation.jsx`)
2. `/sales/new` (aircraft sales overview)
3. `/aircraft/r22`
4. `/aircraft/r44`
5. `/aircraft/r66`
6. `/aircraft/r88`
7. `/training/ppl`
8. `/training/commercial`
9. `/training/type-rating`
10. `/training/trial-lessons`
11. `/maintenance`
12. `/contact`

- [ ] **Step 1:** For each page, run `searchfit-seo:on-page-seo` against the existing source file (e.g. `src/pages/AircraftR66.jsx`) to get a tuning recommendation.

- [ ] **Step 2:** Write the tuning doc

```markdown
# HQ Aviation — Per-Page SEO Tuning Proposals

**Date:** 2026-04-23
**Status:** Awaiting owner approval before page edits (Tasks 17–19).

For each page below: target keywords, recommended title (≤60 chars), meta description (70–160 chars), H1, and 2–3 internal-link suggestions. Owner: edit any cell as needed, then approve.

---

## 1. Landing — `/`
**File:** `src/pages/Experimentation.jsx`
**Primary keyword:** [from skill output, e.g. "helicopter sales london"]
**Secondary keywords:** [list]
**Title (≤60 chars):** [proposal]
**Description (70–160):** [proposal]
**H1:** [proposal — confirm matches existing visual hero]
**Internal links to add:** [3 suggestions]

[…repeat for pages 2–12 with concrete proposals from skill output…]

---

## Owner approval

- [ ] Approved as-is
- [ ] Approved with edits below

```

- [ ] **Step 3:** Commit

```bash
git add docs/seo/per-page-tuning.md
git commit -m "docs(seo): proposed per-page tuning for top 12 (awaiting owner approval)"
```

- [ ] **Step 4:** **STOP. Surface to owner: "Please review `docs/seo/per-page-tuning.md` and approve before I edit page files in Tasks 17–19."** Wait for explicit approval before continuing.

---

## Task 17: Apply approved tuning to landing + sales pages with `<Seo>`

**Files:**
- Modify: `src/pages/Experimentation.jsx` (landing — `/`)
- Modify: `src/pages/AircraftSales.jsx` or whichever component handles `/sales/new`

**Outcome:** Top of each page renders an `<Seo>` block with owner-approved title, description, and (where appropriate) Product or BreadcrumbList JSON-LD.

- [ ] **Step 1:** Open `src/pages/Experimentation.jsx`. Find the top of the default-exported component (the JSX `return`).

- [ ] **Step 2:** Add import at top of file

```jsx
import Seo from '../components/seo/Seo';
```

- [ ] **Step 3:** Insert `<Seo>` as the first JSX element inside the returned fragment, using values from the approved per-page-tuning doc:

```jsx
<Seo
  title="<approved title>"
  description="<approved description>"
/>
```

(Landing page does **not** need Product schema — site-wide Organization/WebSite/LocalBusiness already render globally.)

- [ ] **Step 4:** Repeat for `/sales/new` page component. Add `<Seo>` with approved title/description.

- [ ] **Step 5:** Verify

```bash
npm run dev
```

Visit `/` and `/sales/new`. View source, confirm `<title>` and `<meta description>` reflect approved values.

- [ ] **Step 6:** Commit

```bash
git add src/pages/Experimentation.jsx src/pages/AircraftSales.jsx  # adjust path if different
git commit -m "feat(seo): apply tuning to landing and /sales/new"
```

---

## Task 18: Apply approved tuning + `Product` schema to all 4 aircraft pages

**Files:**
- Modify: `src/pages/AircraftR22.jsx`
- Modify: `src/pages/AircraftR44.jsx`
- Modify: `src/pages/AircraftR66.jsx`
- Modify: `src/pages/AircraftR88.jsx`

**Outcome:** Each aircraft page declares its own title/description/H1 (via the existing component, which has the H1 already — only `<Seo>` needs adding) and Product JSON-LD.

- [ ] **Step 1:** For `AircraftR66.jsx`, add imports

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
```

- [ ] **Step 2:** At top of returned JSX

```jsx
<Seo
  title="<approved title for R66>"
  description="<approved description for R66>"
  ogType="product"
  ogImage="/assets/images/new-aircraft/r66/<chosen-hero>.jpg"
  jsonLd={[
    buildProduct({
      name: 'Robinson R66 Turbine',
      description: '<approved Product schema description>',
      image: '/assets/images/new-aircraft/r66/<chosen-hero>.jpg',
      brand: 'Robinson Helicopters',
      url: '/aircraft/r66',
    }),
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Aircraft Sales', path: '/sales/new' },
      { name: 'Robinson R66', path: '/aircraft/r66' },
    ]),
  ]}
/>
```

- [ ] **Step 3:** Repeat for R22, R44, R88. Each gets its own approved title/description and Product entry — adjust `name`, `description`, `image`, `url`, BreadcrumbList accordingly.

- [ ] **Step 4:** Verify

```bash
npm run dev
```

Visit each aircraft URL, view source, confirm `<title>` reflects the model name and JSON-LD `<script>` block contains a `Product` with the right `name` and `url`.

- [ ] **Step 5:** Commit

```bash
git add src/pages/AircraftR22.jsx src/pages/AircraftR44.jsx src/pages/AircraftR66.jsx src/pages/AircraftR88.jsx
git commit -m "feat(seo): apply tuning + Product schema to aircraft pages"
```

---

## Task 19: Apply approved tuning to training, maintenance, contact, expeditions pages

**Files:**
- Modify: `src/pages/FinalPPL.jsx` (`/training/ppl`)
- Modify: `src/pages/CPL.jsx` (`/training/commercial`)
- Modify: `src/pages/TypeRating.jsx` (`/training/type-rating`)
- Modify: `src/pages/DiscoveryFlight.jsx` (`/training/trial-lessons`)
- Modify: `src/pages/FinalMaintenance.jsx` (`/maintenance`)
- Modify: `src/pages/Contact.jsx` (`/contact`)
- Modify: `src/pages/FinalExpeditions.jsx` (`/expeditions`)

**Outcome:** All 7 remaining priority pages have approved `<Seo>` blocks. Contact also gets a `LocalBusiness` JSON-LD (a fuller version than the site-wide one — with `contactPoint` array). FAQ-bearing pages get `FAQPage` schema if their FAQs are static enough to enumerate.

- [ ] **Step 1:** For each page, apply the same pattern as Task 18:
  - Add `import Seo from '../components/seo/Seo';`
  - Add `import { … } from '../components/seo/jsonLd';` for any per-page JSON-LD
  - Insert `<Seo title="…" description="…" jsonLd={[…]} />` at top of returned JSX

- [ ] **Step 2:** For `Contact.jsx`, additionally compose a richer `LocalBusiness` JSON-LD with `contactPoint`:

```jsx
import { buildLocalBusiness } from '../components/seo/jsonLd';

const contactPageLocalBusiness = {
  ...buildLocalBusiness(),
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+44-1895-833333', // owner-confirmed value from seoDefaults
    contactType: 'customer service',
    areaServed: 'GB',
    availableLanguage: ['English'],
  }],
};

// then in JSX
<Seo title="<approved>" description="<approved>" jsonLd={[contactPageLocalBusiness]} />
```

- [ ] **Step 3:** For pages with static FAQ content (check each by-hand — likely `/training/ppl`, `/training/trial-lessons`, `/maintenance`), add `FAQPage` schema. Example:

```jsx
import { buildFAQPage } from '../components/seo/jsonLd';

const pplFaq = buildFAQPage([
  { q: 'How long does it take to get a PPL?', a: 'Typically 6–12 months at one lesson per week.' },
  // … extract from page content
]);

<Seo title="…" description="…" jsonLd={[pplFaq]} />
```

If FAQs already live in JSON/JS data on the page, reuse that source rather than duplicating.

- [ ] **Step 4:** Verify each page renders with correct head tags and JSON-LD

```bash
npm run dev
```

Walk all 7 URLs. View source on each, confirm `<title>` reflects approved value and JSON-LD blocks present where intended.

- [ ] **Step 5:** Commit

```bash
git add src/pages/FinalPPL.jsx src/pages/CPL.jsx src/pages/TypeRating.jsx src/pages/DiscoveryFlight.jsx src/pages/FinalMaintenance.jsx src/pages/Contact.jsx src/pages/FinalExpeditions.jsx
git commit -m "feat(seo): apply tuning + LocalBusiness/FAQPage schema to training, maintenance, contact, expeditions"
```

---

## Task 20: Wire `<Seo>` on all remaining public pages with audit-driven defaults

**Files:** every page component listed in `src/lib/seoRoutes.js#PUBLIC_ROUTES` not already touched in Tasks 17–19. Examples:

- `src/pages/AboutUs.jsx` (`/about-us`)
- `src/pages/CaptainQ.jsx` (`/about-us/captain-q`)
- `src/pages/Team.jsx` (`/about-us/team`)
- `src/pages/UsedSales.jsx` (`/sales/pre-owned`)
- `src/pages/Rebuilds.jsx` (`/sales/rebuilds`)
- `src/pages/AircraftH500.jsx` (`/aircraft/h500`)
- `src/pages/NightRating.jsx` (`/training/night-rating`)
- `src/pages/AdvancedTraining.jsx` (`/training/advanced`)
- `src/pages/HelicopterTourOfLondon.jsx` (`/helicopter-tour-of-london`)
- `src/pages/SuperYachtOps.jsx` (`/superyacht-ops`)
- `src/pages/PilotProvisioning.jsx` (`/pilot-provisioning`)
- `src/pages/AircraftConsulting.jsx` (`/aircraft-consulting`)
- `src/pages/PartSales.jsx` (`/parts`)
- `src/pages/SelfFlyHire.jsx` (`/self-fly-hire`)
- `src/pages/Fleet.jsx` (`/fleet`)
- `src/pages/Misc.jsx` (`/misc`)
- `src/pages/Blog.jsx` (`/blog`)
- `src/pages/Testimonials.jsx` (`/testimonials`)
- `src/pages/UsedAircraftDetail.jsx` (`/sales/pre-owned/:id`)
- `src/pages/MiscItemDetail.jsx` (`/misc/:id`)
- `src/pages/BlogPost.jsx` (`/blog/:postId`)
- `src/pages/DynamicBlogPost.jsx` (Firestore-driven blog post)

**Outcome:** Every public page declares a `<Seo>` block. No page is left with the generic site-wide title.

**Tuning approach for these non-priority pages:** the engineer derives a sensible title/description from the page's existing H1 and intro paragraph rather than running each through skill-based keyword research (that's expensive and over-investment for B-tier pages). Pattern:

```jsx
<Seo
  title="<page topic, ≤55 chars>"
  description="<the page's intro paragraph, edited to 70–160 chars>"
/>
```

For dynamic detail pages (`/sales/pre-owned/:id`, `/blog/:postId`, etc.), pull title/description from the Firestore document that's already loaded in component state. Example for `UsedAircraftDetail.jsx`:

```jsx
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';

// inside component, where `listing` is the loaded Firestore doc
{listing && (
  <Seo
    title={`${listing.year} ${listing.model} for sale`}
    description={listing.shortDescription || listing.description?.slice(0, 155)}
    ogType="product"
    ogImage={listing.images?.[0]}
    jsonLd={[
      buildProduct({
        name: `${listing.year} ${listing.model}`,
        description: listing.description,
        image: listing.images?.[0],
        brand: listing.manufacturer || 'Robinson Helicopters',
        url: `/sales/pre-owned/${listing.id}`,
      }),
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Pre-Owned', path: '/sales/pre-owned' },
        { name: `${listing.year} ${listing.model}`, path: `/sales/pre-owned/${listing.id}` },
      ]),
    ]}
  />
)}
```

For blog detail (`BlogPost.jsx` and `DynamicBlogPost.jsx`):

```jsx
import { buildArticle, buildBreadcrumbList } from '../components/seo/jsonLd';

{post && (
  <Seo
    title={post.title}
    description={post.excerpt || post.subtitle}
    ogType="article"
    ogImage={post.featuredImage}
    jsonLd={[
      buildArticle({
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        authorName: post.author,
        url: `/blog/${post.slug || post.id}`,
      }),
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug || post.id}` },
      ]),
    ]}
  />
)}
```

For NOINDEX_ROUTES (`/checkout`, `/booking-confirmed`, etc.) — also add `<Seo noindex>`:

```jsx
<Seo title="Checkout" noindex />
```

- [ ] **Step 1:** Walk the page list. For each, add `import Seo from '…';` and an `<Seo>` block at top of returned JSX. For dynamic pages, follow the patterns above.

- [ ] **Step 2:** Verify a sample of pages

```bash
npm run dev
```

Visit at least one of each type (one static page, one detail page, one noindex page). View source. Confirm `<title>` differs per page.

- [ ] **Step 3:** Commit (this can be one big commit or split by section if you prefer — single commit is fine here)

```bash
git add src/pages/
git commit -m "feat(seo): wire <Seo> on remaining public pages with audit-driven defaults"
```

---

## Task 21: Canonical-URL handling for duplicate aircraft routes

**Files:**
- Modify: `src/pages/AircraftR22.jsx`, `AircraftR44.jsx`, `AircraftR66.jsx`, `AircraftR88.jsx`

**Outcome:** When a user lands on `/aircraft-sales/new/r66`, the page tells search engines that `/aircraft/r66` is the canonical URL — collapsing duplicate-content risk while keeping both URLs reachable.

**Approach:** the existing `<Seo>` block in each aircraft page (added in Task 18) auto-generates canonical from `window.location.pathname`. Override it to always point to the `/aircraft/...` form regardless of which URL the user landed on.

- [ ] **Step 1:** In each of the 4 aircraft page files, change the `<Seo>` block added in Task 18 to set `canonical` explicitly:

```jsx
<Seo
  title="<approved>"
  description="<approved>"
  canonical="https://hqaviation.com/aircraft/r66"  // <-- new explicit override
  ogType="product"
  ogImage="…"
  jsonLd={[…]}
/>
```

(The `<link rel="canonical">` will then point to `/aircraft/r66` whether the user is on `/aircraft/r66` or `/aircraft-sales/new/r66`.)

- [ ] **Step 2:** Verify

```bash
npm run dev
```

Visit `http://localhost:5173/aircraft-sales/new/r66`. View source. Confirm:
```
<link data-rh="true" rel="canonical" href="https://hqaviation.com/aircraft/r66"/>
```

- [ ] **Step 3:** Commit

```bash
git add src/pages/AircraftR22.jsx src/pages/AircraftR44.jsx src/pages/AircraftR66.jsx src/pages/AircraftR88.jsx
git commit -m "feat(seo): canonicalise duplicate aircraft URLs to /aircraft/* form"
```

---

## Task 22: Final verification pass + audit doc update

**Files:**
- Modify: `docs/seo/seo-audit.md`

**Outcome:** Walk every public route, confirm meta+canonical+JSON-LD render correctly, fill in the audit table written by hand in Task 15.

- [ ] **Step 1:** Run dev server and full test suite

```bash
npm run dev
```

In a second terminal:

```bash
npx vitest run
```

Expected: all tests pass (existing + new SEO tests). The pre-existing `api/stripe.test.js` may still fail on missing Firebase creds — that's not a regression.

- [ ] **Step 2:** Build production bundle

```bash
npm run build
```

Expected: build succeeds. Note any warnings.

- [ ] **Step 3:** Verify production bundle does not include dev-route components

```bash
grep -lE "HeroTest|CarouselPicker|HeroPathPicker|OwnershipPicker" dist/assets/*.js
```

Expected: no matches.

- [ ] **Step 4:** Walk every URL in `src/lib/seoRoutes.js#PUBLIC_ROUTES`. For each, view source and record in the audit doc table:
- title (length OK?)
- description (length OK? unique?)
- canonical present?
- og:image present?
- JSON-LD blocks present and valid?

Use Google's Rich Results test (paste rendered HTML into https://search.google.com/test/rich-results) to validate JSON-LD on a sample of pages.

- [ ] **Step 5:** Update `docs/seo/seo-audit.md` with the actual observed values + a Critical Issues section listing anything found.

- [ ] **Step 6:** Verify sitemap.xml end-to-end

```bash
curl -s http://localhost:7500/sitemap.xml | grep -c "<url>"
```

Expected: prints a count ≥ 31 (all PUBLIC_ROUTES + any active listings + any published blogs).

- [ ] **Step 7:** Commit

```bash
git add docs/seo/seo-audit.md
git commit -m "docs(seo): post-implementation audit with observed page values"
```

---

## Self-review checklist (engineer runs before declaring done)

- [ ] Every URL in `PUBLIC_ROUTES` has a unique `<title>` (verified by walking source)
- [ ] Every URL in `PUBLIC_ROUTES` has a unique `<meta description>`
- [ ] Every URL in `PUBLIC_ROUTES` has a `<link rel="canonical">`
- [ ] Every URL in `PUBLIC_ROUTES` has `og:title`/`og:description`/`og:image`
- [ ] Every page has at most one `<h1>` (sample-checked, full check comes from Plan 2's audit)
- [ ] `Organization`, `WebSite`, `LocalBusiness` JSON-LD render on every page
- [ ] Aircraft pages have `Product` JSON-LD
- [ ] Blog detail pages have `Article` JSON-LD
- [ ] Contact page has richer `LocalBusiness` with `contactPoint`
- [ ] At least 3 pages have `BreadcrumbList`
- [ ] `/checkout` etc. have `<meta name="robots" content="noindex">`
- [ ] Duplicate aircraft URLs canonicalise to `/aircraft/*`
- [ ] `/sitemap.xml` returns 200 with valid XML and ≥ 31 `<url>` entries
- [ ] `/robots.txt` returns 200
- [ ] Production build does not include dev-route component code
- [ ] All vitest tests pass (excluding pre-existing stripe.test.js Firebase-cred failure)
- [ ] `docs/seo/seo-audit.md` populated with observed values
- [ ] `docs/seo/per-page-tuning.md` shows owner approval

---

## Out of scope (handled in future plans)

- **Plan 2 — SEO Admin Tab** (Phase 3 from spec): on-page audit crawler with Puppeteer, GSC + PSI integration, Firestore collections, all `/admin/seo/*` routes and components.
- **Plan 3 — AI Visibility & Smart Fixes** (Phase 4 from spec): Claude API integration for AI mention tracking and one-click recommendation fixes.
- Owner-side one-time setup (GSC verification, service account JSON) — happens after this plan ships and before Plan 2 starts. Captured in `docs/seo/setup.md` (to be authored as part of Plan 2).
