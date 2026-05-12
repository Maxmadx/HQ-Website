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
  '/home': '/',
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
