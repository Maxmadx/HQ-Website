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

function factory({ indexHtmlPath, getMetaForStaticPath, getMetaForDynamicPath, serve404OnUnknownPath = false }) {
  // Fail-soft: in the Cloud Run + Firebase Hosting architecture, Express never
  // serves the SPA (Hosting does), so index.html isn't in the container. Skip
  // initialisation if the template can't be read — middleware becomes a no-op.
  let TEMPLATE = null;
  try {
    TEMPLATE = fs.readFileSync(indexHtmlPath, 'utf8');
  } catch (err) {
    console.warn(`[seo] meta-injection disabled: ${indexHtmlPath} not readable (${err.code || err.message}). This is expected on Cloud Run where Hosting serves the SPA.`);
  }

  return async function seoMetaInjection(req, res, next) {
    if (!TEMPLATE) return next();
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
    if (!meta) {
      // Unknown path on an SPA route. Two options:
      // (a) serve404OnUnknownPath: return 404 + SPA shell so React renders
      //     NotFound — fixes Google's "soft 404" detection for SPA architecture
      // (b) fall through (default — back-compat for setups that have their own
      //     downstream 404 handler)
      if (serve404OnUnknownPath) {
        const fallbackHead = [
          '<title>Page Not Found | HQ Aviation</title>',
          '<meta name="description" content="The page you were looking for doesn\'t exist or has moved.">',
          '<meta name="robots" content="noindex, nofollow">',
        ].join('\n    ');
        const html = TEMPLATE.replace('<!--SSR_HEAD-->', fallbackHead);
        res.status(404);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
      return next();
    }

    const head = renderHead(meta);
    const html = TEMPLATE.replace('<!--SSR_HEAD-->', head);
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  };
}

module.exports = factory;
module.exports.renderHead = renderHead;
