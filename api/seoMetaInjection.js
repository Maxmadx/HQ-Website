'use strict';

const fs = require('fs');
const cache = require('./seoMetaCache');
const logger = require('./lib/logger.js');

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
  // Fail-soft: in the Cloud Run + Firebase Hosting architecture, Express never
  // serves the SPA (Hosting does), so index.html isn't in the container. Skip
  // initialisation if the template can't be read — middleware becomes a no-op.
  let TEMPLATE = null;
  try {
    TEMPLATE = fs.readFileSync(indexHtmlPath, 'utf8');
  } catch (err) {
    logger.warn({ indexHtmlPath, err }, `[seo] meta-injection disabled: ${indexHtmlPath} not readable (${err.code || err.message}). This is expected on Cloud Run where Hosting serves the SPA.`);
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
        catch (e) { logger.error({ err: e }, '[seo] dynamic meta failed'); meta = null; }
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
