'use strict';

const express = require('express');
const logger = require('./lib/logger.js');
// firebase-admin is lazy-loaded inside the request handler so the test
// suite can require this module without env vars / firebase init.

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

async function fetchDynamicEntries(db) {
  const entries = [];

  try {
    const listings = await db.collection('listings').where('status', '==', 'active').get();
    for (const doc of listings.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/sales/pre-owned/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.8 });
    }
  } catch (e) { logger.error({ err: e }, '[sitemap] listings fetch failed'); }

  try {
    const blogs = await db.collection('blogs').where('published', '==', true).get();
    for (const doc of blogs.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/blog/${doc.id}`, lastmod, changefreq: 'monthly', priority: 0.6 });
    }
  } catch (e) { logger.error({ err: e }, '[sitemap] blogs fetch failed'); }

  try {
    const misc = await db.collection('misc_items').where('status', '==', 'active').get();
    for (const doc of misc.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/misc/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.5 });
    }
  } catch (e) { logger.error({ err: e }, '[sitemap] misc fetch failed'); }

  try {
    const parts = await db.collection('parts').where('status', '==', 'active').get();
    for (const doc of parts.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/parts/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.7 });
    }
  } catch (e) { logger.error({ err: e }, '[sitemap] parts fetch failed'); }

  return entries;
}

async function buildSitemap(db) {
  const dynamicEntries = await fetchDynamicEntries(db);
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
      const admin = require('./firebase-admin');
      const db = admin.firestore();
      cache.xml = await buildSitemap(db);
      cache.expiresAt = now + CACHE_TTL_MS;
    }
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(cache.xml);
  } catch (err) {
    logger.error({ err }, '[sitemap] failed');
    res.status(500).send('<?xml version="1.0"?><error>sitemap generation failed</error>');
  }
});

// Test seam: build sitemap with an injected db (avoids initialising firebase-admin in tests)
router.buildSitemapForTest = (db) => buildSitemap(db);
router.flushSitemapCache = () => { cache = { xml: null, expiresAt: 0 }; };

module.exports = router;
