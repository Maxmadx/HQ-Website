// scripts/prerender.mjs
//
// Build-time prerender: emits a per-route HTML file under dist/ with the
// route-specific <title>, <meta description>, og:/twitter: tags and canonical
// pre-injected — so non-JS crawlers (Slack/Twitter/LinkedIn/iMessage link
// previews, Bing, DuckDuckGo) and the first paint see the right meta without
// waiting for React + react-helmet-async to mount.
//
// Firebase Hosting serves dist/<route>/index.html for a request to /<route>
// before falling through to the SPA rewrite, so the prerendered files take
// over automatically.
//
// Run after `vite build`. Wired into the `build` npm script.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const { getMetaForPath } = require(join(projectRoot, 'src/lib/getMetaForPath.js'));
const { PUBLIC_ROUTES } = await import(
  pathToFileURL(join(projectRoot, 'src/lib/seoRoutes.js')).href
);

const SITE_URL = 'https://hqaviation.com';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderMetaBlock({ title, description, ogImage, canonicalUrl }) {
  const og = ogImage && (ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`);
  return [
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="HQ Aviation">`,
    og ? `<meta property="og:image" content="${escapeHtml(og)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    og ? `<meta name="twitter:image" content="${escapeHtml(og)}">` : '',
  ].filter(Boolean).join('\n    ');
}

const templatePath = join(projectRoot, 'dist/index.html');
const template = readFileSync(templatePath, 'utf-8');

if (!template.includes('<!--SSR_HEAD-->')) {
  console.error('[prerender] dist/index.html missing <!--SSR_HEAD--> placeholder — aborting.');
  process.exit(1);
}

let count = 0;
const skipped = [];

for (const route of PUBLIC_ROUTES) {
  const meta = getMetaForPath(route.path);
  if (!meta) {
    skipped.push(route.path);
    continue;
  }

  const canonicalUrl = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  const headBlock = renderMetaBlock({ ...meta, canonicalUrl });

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<link rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`)
    .replace('<!--SSR_HEAD-->', headBlock);

  const outPath = route.path === '/'
    ? templatePath
    : join(projectRoot, 'dist', route.path, 'index.html');

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  count++;
}

console.log(`[prerender] Wrote ${count} per-route HTML files.`);
if (skipped.length) {
  console.warn(`[prerender] Skipped ${skipped.length} routes with no meta: ${skipped.join(', ')}`);
}
