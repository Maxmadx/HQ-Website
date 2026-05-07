// src/lib/getMetaForPath.js
//
// Returns the SEO meta block for a static public route. Used by both:
//   - the server-side SEO injection middleware (api/seoMetaInjection.js,
//     mounted in server.js — CommonJS), AND
//   - any future ESM caller (e.g. tests, Vite-bundled code).
//
// Authored as a UMD-ish dual file so a CommonJS `require()` and a Vitest
// `import` both work without a build step. See sitemap.js for the same
// project pattern (long-term: migrate api/ to ESM).

'use strict';

const SITE_URL = 'https://hqaviation.com';
const DEFAULT_OG_IMAGE = '/og-default.jpg';

// Mirror of src/lib/seoRoutes.js#PUBLIC_ROUTES (paths only). If you change
// one, change both. Same convention as api/sitemap.js.
const PUBLIC_ROUTE_PATHS = new Set([
  '/',
  '/about-us',
  '/about-us/captain-q',
  '/about-us/team',
  '/contact',
  '/sales/new',
  '/sales/pre-owned',
  '/sales/rebuilds',
  '/aircraft/r22',
  '/aircraft/r44',
  '/aircraft/r66',
  '/aircraft/r88',
  '/aircraft/h500',
  '/training/ppl',
  '/training/commercial',
  '/training/type-rating',
  '/training/night-rating',
  '/training/trial-lessons',
  '/training/advanced',
  '/maintenance',
  '/expeditions',
  '/helicopter-tour-of-london',
  '/superyacht-ops',
  '/pilot-provisioning',
  '/aircraft-consulting',
  '/parts',
  '/self-fly-hire',
  '/fleet',
  '/misc',
  '/blog',
  '/testimonials',
]);

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
  '/aircraft/h500': {
    title: 'Hughes/Schweizer 300 (H500) — Reference',
    description: "The Hughes/Schweizer 300 (H500) — a piston-engine helicopter with a long history. Reference page; HQ Aviation does not sell new H500 aircraft.",
    ogImage: '/og-default.jpg',
  },
  '/training/ppl': {
    title: 'Helicopter PPL — Private Pilot Licence Training London',
    description: 'EASA PPL(H) training in Robinson R22 or R44 from Denham — 30 min from London. From your first flight to qualified pilot in 45–55 hours.',
    ogImage: '/og-default.jpg',
  },
  '/training/commercial': {
    title: 'Helicopter CPL — Commercial Pilot Licence Training UK',
    description: 'EASA CPL(H) training in Robinson R44 or R66 from Denham — modular pathway from PPL.',
    ogImage: '/og-default.jpg',
  },
  '/training/type-rating': {
    title: 'Helicopter Type Rating Training — UK Robinson Dealer',
    description: 'Type rating training on Robinson R22, R44, R66 from Denham. Single-engine helicopter type ratings for new pilots.',
    ogImage: '/og-default.jpg',
  },
  '/training/night-rating': {
    title: 'Helicopter Night Rating — UK Helicopter Training',
    description: 'Night flying rating in Robinson R44 or R66 from Denham — 5h dual instruction.',
    ogImage: '/og-default.jpg',
  },
  '/training/trial-lessons': {
    title: 'Helicopter Trial Lesson — Discovery Flight from Denham',
    description: 'Take the controls of a Robinson helicopter at Denham Aerodrome — 30 min from London. R22, R44 or R66. Gift vouchers available.',
    ogImage: '/assets/images/r66helis.jpg',
  },
  '/training/advanced': {
    title: 'Advanced Helicopter Training — UK Pilot Skills',
    description: 'Advanced post-licence training — confined areas, autorotations, formation flying.',
    ogImage: '/og-default.jpg',
  },
  '/maintenance': {
    title: 'Helicopter Maintenance — Robinson Authorised Service Centre',
    description: 'Authorised Robinson service centre at Denham. R22, R44, R66 maintenance, overhauls, ARC, repairs. UK CAA Part 145 approved.',
    ogImage: '/og-default.jpg',
  },
  '/expeditions': {
    title: 'Helicopter Expeditions — Worldwide Adventures',
    description: 'Worldwide helicopter expedition support — Arctic, Africa, Asia. Robinson and Bell aircraft. Custom multi-day adventures.',
    ogImage: '/og-default.jpg',
  },
  '/helicopter-tour-of-london': {
    title: 'Helicopter Tour of London — 30 Minutes Over the City',
    description: 'Take a 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome. London Eye, Tower Bridge, Canary Wharf.',
    ogImage: '/assets/images/gallery/london-tour/above-westminster.jpg',
  },
  '/aircraft-consulting': {
    title: 'Helicopter Pre-Purchase & Acquisition Consulting | UK',
    description: 'Independent pre-purchase inspection and aircraft acquisition consulting from Robinson dealer at Denham.',
    ogImage: '/og-default.jpg',
  },
  '/leaseback': {
    title: 'Helicopter Leaseback — UK Aircraft Owner Programme',
    description: "Earn revenue from your helicopter through HQ Aviation's leaseback programme. Robinson R44 / R66 placements at Denham.",
    ogImage: '/og-default.jpg',
  },
  '/self-fly-hire': {
    title: 'Helicopter Self-Fly Hire — Denham, London',
    description: 'Self-fly hire of Robinson R22, R44, R66 helicopters from Denham, 30 min from London.',
    ogImage: '/og-default.jpg',
  },
  '/superyacht-ops': {
    title: 'Superyacht Helicopter Operations — UK Support',
    description: 'Helicopter operations support for superyachts — flight crew, deck-landing, refuelling, route planning.',
    ogImage: '/og-default.jpg',
  },
  '/pilot-provisioning': {
    title: 'Helicopter Pilot Provisioning — Contract Crew, UK',
    description: 'Qualified helicopter pilot supply and contract crew for owner-operators and yacht operators.',
    ogImage: '/og-default.jpg',
  },
  '/parts': {
    title: 'Robinson Helicopter Parts — Authorised Dealer',
    description: 'Genuine Robinson Helicopter parts — authorised distributor at Denham. R22, R44, R66 spares and components.',
    ogImage: '/og-default.jpg',
  },
  '/about-us': {
    title: 'About HQ Aviation — UK Robinson Dealer at Denham',
    description: "HQ Aviation — UK's premier Robinson Helicopter dealer at Denham Aerodrome. Sales, training, maintenance, expeditions.",
    ogImage: '/og-default.jpg',
  },
  '/blog': {
    title: 'HQ Aviation Blog — Helicopter Flying & Aviation Insights',
    description: 'Articles on helicopter flying, training, ownership, and aviation life from the HQ Aviation team.',
    ogImage: '/og-default.jpg',
  },
};

const DEFAULT_META = {
  title: 'HQ Aviation',
  description: "UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions.",
  ogImage: DEFAULT_OG_IMAGE,
};

function getMetaForPath(path) {
  // Only static routes. Dynamic patterns (with :param or matching dynamic
  // patterns like /blog/:id) must be resolved by the middleware via Firestore.
  if (path.includes(':') || /^\/(blog|sales\/pre-owned|misc)\/[^/]+$/.test(path)) {
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

module.exports = { getMetaForPath };
