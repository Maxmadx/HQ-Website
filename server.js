/**
 * HQ Aviation Production Server
 * Static file server for Squarespace exported site
 */
'use strict';

require('dotenv').config();

// In production, fail fast if required env vars are missing
if (process.env.NODE_ENV === 'production') {
  const REQUIRED_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'SITE_URL'];
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const { createPaymentIntent, createLondonTourPaymentIntent, createMiscPaymentIntent, createUpgradePaymentIntent, handleWebhook, recordBooking, recordUpgrade } = require('./api/stripe');
const { getBooking } = require('./api/booking');
const leadsRouter = require('./api/leads');
const stripeDiscoveryRouter = require('./api/stripe-discovery');
const analyticsRouter = require('./api/analytics-api');
const cartsRouter = require('./api/carts');
const pressClickRouter = require('./api/press-click');
const sitemapRouter = require('./api/sitemap');
const gscRouter = require('./api/gsc-api');
const SEO_REDIRECTS = require('./api/seoRedirects');
const seoMetaInjection = require('./api/seoMetaInjection');
const { getMetaForPath } = require('./src/lib/getMetaForPath');

// parts-enquiry is ESM; eagerly start the import so it resolves before first request.
// Track import errors so we can return 500 to clients instead of hanging.
let partsEnquiryRouter = null;
let partsEnquiryImportError = null;
const partsEnquiryReady = import('./api/parts-enquiry.js')
  .then((m) => { partsEnquiryRouter = m.default; })
  .catch((err) => {
    partsEnquiryImportError = err;
    console.error('[parts-enquiry] failed to load module:', err.message);
  });

const app = express();
app.set('trust proxy', 1); // Read real IP from X-Forwarded-For (required for req.ip behind proxies)

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

app.use((req, res, next) => {
  const target = SEO_REDIRECTS[req.path];
  if (target) {
    const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(301, `${target}${search}`);
  }
  next();
});

const PORT = process.env.PORT || 7500;
const publicDir = path.join(__dirname, 'public');
const pagesDir = path.join(publicDir, 'pages');

// ============================================
// MIDDLEWARE
// ============================================

// Enable gzip compression for all responses
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block'
  });
  next();
});

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// SEO META INJECTION (server-side rendering of <title>, meta description,
// canonical, Open Graph, Twitter card). Mounted BEFORE static-file serving
// so it runs for clean HTML routes; the middleware itself skips paths
// containing a `.` (assets) or starting with /api or /admin.
//
// indexHtmlPath: prefer dist/index.html (production-built artefact with
// the <!--SSR_HEAD--> sentinel); fall back to source index.html so the
// server still boots when `npm run build` hasn't been run yet.
// ============================================
const seoIndexHtmlPath = (() => {
  const built = path.join(__dirname, 'dist', 'index.html');
  const source = path.join(__dirname, 'index.html');
  return fs.existsSync(built) ? built : source;
})();

app.use(seoMetaInjection({
  indexHtmlPath: seoIndexHtmlPath,
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
      // Real Firestore shape: images is an array of objects {url, alt, isPrimary}
      const primaryImage = d.images?.find?.((i) => i.isPrimary)?.url || d.images?.[0]?.url || '/og-default.jpg';
      return {
        title: d.name || 'Store Item',
        description: d.description || '',
        ogImage: primaryImage,
        canonicalUrl: `https://hqaviation.com/misc/${doc.id}`,
      };
    }

    return null;
  },
}));

// Static assets - NO CACHING for development
app.use('/assets', express.static(path.join(publicDir, 'assets'), {
  maxAge: 0,
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
}));

// Also serve assets at root paths (js/, css/, images/) for original HTML compatibility
app.use('/js', express.static(path.join(publicDir, 'assets', 'js')));
app.use('/css', express.static(path.join(publicDir, 'assets', 'css')));
app.use('/images', express.static(path.join(publicDir, 'assets', 'images')));

// Admin app static files
app.use('/admin', express.static(path.join(publicDir, 'admin'), {
  index: 'index.html'
}));

// Admin app - serve index.html for all admin routes (client-side routing)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'index.html'));
});

// ============================================
// HELPERS
// ============================================

/**
 * Serve HTML file with proper headers
 */
function serveHtmlFile(filePath, res) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${filePath}:`, err.message);
      return res.status(404).send('<!DOCTYPE html><html><head><title>404</title></head><body><h1>Page Not Found</h1></body></html>');
    }

    res.set({
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600'
    });
    res.send(data);
  });
}

/**
 * Check if file exists and is readable
 */
function fileExists(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.R_OK, (err) => {
      resolve(!err);
    });
  });
}

// ============================================
// ROUTES
// ============================================

// ============================================
// STRIPE API ROUTES
// ============================================

// POST /api/create-payment-intent
// Creates a Stripe PaymentIntent using server-side validated price.
// Uses express.json() middleware inline so it doesn't affect the webhook route.
app.post('/api/create-payment-intent', express.json(), async (req, res) => {
  const { aircraft, duration, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage, addons, fulfilment, shippingAddress, cartId, referredByCode } = req.body || {};

  // Validate presence
  if (!aircraft || !duration || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate duration is a known value
  const durationNum = Number(duration);
  if (durationNum !== 30 && durationNum !== 60) {
    return res.status(400).json({ error: 'Invalid duration' });
  }

  // Basic email format check
  if (!customerEmail.includes('@') || customerEmail.length < 5) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Sanitise phone — keep only digits, spaces, +, -, ()
  const sanitisedPhone = String(customerPhone).replace(/[^\d\s+\-()]/g, '').slice(0, 20);

  try {
    const paymentIntent = await createPaymentIntent({
      aircraft,
      duration: durationNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
      wantsVoucher: !!wantsVoucher,
      voucherLocation: wantsVoucher ? String(voucherLocation || '').slice(0, 300) : '',
      voucherMessage: wantsVoucher ? String(voucherMessage || '').slice(0, 150) : '',
      addons,
      fulfilment,
      shippingAddress,
      cartId: cartId || '',
      referredByCode,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/create-london-tour-payment-intent
app.post('/api/create-london-tour-payment-intent', express.json(), async (req, res) => {
  const { experience, timeOfDay, quantity, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage } = req.body || {};

  if (!experience || !timeOfDay || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['shared', 'private'].includes(experience)) {
    return res.status(400).json({ error: 'Invalid experience type' });
  }
  if (!['day', 'sunset', 'night'].includes(timeOfDay)) {
    return res.status(400).json({ error: 'Invalid time of day' });
  }
  const qtyNum = Number(quantity);
  if (!Number.isInteger(qtyNum) || qtyNum < 1 || qtyNum > 4) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  if (!customerEmail.includes('@') || customerEmail.length < 5) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const sanitisedPhone = String(customerPhone).replace(/[^\d\s+\-()]/g, '').slice(0, 20);

  try {
    const paymentIntent = await createLondonTourPaymentIntent({
      experience,
      timeOfDay,
      quantity: qtyNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
      wantsVoucher: !!wantsVoucher,
      voucherLocation: wantsVoucher ? String(voucherLocation || '').slice(0, 300) : '',
      voucherMessage: wantsVoucher ? String(voucherMessage || '').slice(0, 150) : '',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/create-misc-payment-intent
// Creates a Stripe PaymentIntent for a misc item purchase. Price validated server-side.
app.post('/api/create-misc-payment-intent', express.json(), async (req, res) => {
  const { itemId, qty, customerName, customerEmail, customerPhone, shippingAddress, size } = req.body || {};

  if (!itemId || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!customerEmail.includes('@') || customerEmail.length < 5) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  const qtyNum = Number(qty);
  if (!Number.isInteger(qtyNum) || qtyNum < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  const sanitisedPhone = String(customerPhone).replace(/[^\d\s+\-()]/g, '').slice(0, 20);

  try {
    const paymentIntent = await createMiscPaymentIntent({
      itemId,
      qty: qtyNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
      shippingAddress,
      size,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/create-upgrade-payment-intent
app.post('/api/create-upgrade-payment-intent', express.json(), async (req, res) => {
  try {
    const { originalPaymentIntentId, newDuration } = req.body || {};
    const out = await createUpgradePaymentIntent({ originalPaymentIntentId, newDuration: Number(newDuration) });
    res.json(out);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal error' });
  }
});

// POST /api/record-booking
// Called by the client confirmation page right after Stripe payment succeeds.
// Verifies the payment intent with Stripe and writes the booking to Firestore.
// Safe to call multiple times — idempotent.
app.post('/api/record-booking', express.json(), async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const booking = await recordBooking(paymentIntentId);
    res.json({ ok: true, booking });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/record-upgrade
// Called by the upgrade modal right after Stripe confirms the upgrade payment.
// Verifies the upgrade PI with Stripe and applies the upgrade to the booking
// in Firestore. Idempotent — if the webhook already applied it, returns
// { alreadyApplied: true }. Lets the admin see the upgrade even when the
// Stripe webhook doesn't deliver.
app.post('/api/record-upgrade', express.json(), async (req, res) => {
  try {
    const { upgradePaymentIntentId } = req.body;
    const result = await recordUpgrade(upgradePaymentIntentId);
    res.json({ ok: true, ...result });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/booking/:paymentIntentId
// Returns the booking record for /booking-confirmed and /upgrade pages.
// PI ID is the access token — no auth header needed.
app.get('/api/booking/:paymentIntentId', getBooking);

// POST /api/webhook
// Receives Stripe webhook events. MUST use express.raw() — Stripe requires
// the raw body buffer to verify the webhook signature. Do NOT use express.json() here.
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await handleWebhook(req);
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    // Return a static message — never expose internal error details to Stripe callers.
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Cloud Run / uptimerobot health probe — cheap, no auth, no I/O.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// LEADS API ROUTES
// ============================================
app.use('/api/leads', express.json(), leadsRouter);

// ============================================
// STRIPE DISCOVERY CHECKOUT ROUTES
// ============================================
app.use('/api/stripe/discovery-checkout', express.json(), stripeDiscoveryRouter);

// ============================================
// ANALYTICS ROUTES
// ============================================
app.use('/api/analytics', express.json({ limit: '16kb' }), analyticsRouter);

// ============================================
// CARTS ROUTES
// ============================================
app.use('/api/carts', express.json({ limit: '16kb' }), cartsRouter);

// ============================================
// PRESS CLICK ROUTES
// ============================================
app.use('/api/press-click', express.json(), pressClickRouter);

// ============================================
// SITEMAP — public, no auth (search engines fetch this)
// ============================================
app.use(sitemapRouter);

// ============================================
// GSC ROUTES
// ============================================
app.use('/api/gsc', express.json(), gscRouter);

// ============================================
// WALL OF COOL ROUTES
// ============================================
const wallOfCoolRouter = require('./api/wall-of-cool');
app.use('/api/wall-of-cool', express.json(), wallOfCoolRouter);

// ============================================
// ADMIN FAQ ROUTES
// ============================================
const adminFaqsRouter = require('./api/admin-faqs');
app.use('/api/admin/faqs', express.json(), adminFaqsRouter);

const adminSfhPartnersRouter = require('./api/admin-sfh-partners');
app.use('/api/admin/sfh-partners', express.json(), adminSfhPartnersRouter);

const adminSfhEventsRouter = require('./api/admin-sfh-events');
app.use('/api/admin/sfh-events', express.json(), adminSfhEventsRouter);

// ============================================
// MISC MARKETPLACE ROUTES
// ============================================
const miscMarketplaceRouter = require('./api/misc-marketplace');
app.use('/api/misc-enquiry', express.json(), miscMarketplaceRouter);

// ============================================
// PARTS ENQUIRY ROUTES
// ============================================
app.use('/api/parts-enquiry', express.json(), async (req, res, next) => {
  if (!partsEnquiryRouter) await partsEnquiryReady;
  if (partsEnquiryImportError) {
    return res.status(500).json({ error: 'Parts enquiry module failed to load' });
  }
  partsEnquiryRouter(req, res, next);
});

/**
 * Root route: serve index.html
 */
app.get('/', (req, res) => {
  serveHtmlFile(path.join(publicDir, 'index.html'), res);
});

/**
 * Store route
 */
app.get('/store', (req, res) => {
  serveHtmlFile(path.join(publicDir, 'store.html'), res);
});

/**
 * Legacy redirects for old Squarespace folder structure
 * /folder/file.html → /file
 */
app.get('/:folder/:file', (req, res, next) => {
  const { folder, file } = req.params;
  const legacyFolders = [
    'apparel',
    'r66',
    'r88',
    'discovery-flight-1',
    'recently-sold-aircraft',
    'used-aircraft'
  ];

  if (legacyFolders.includes(folder) && file.endsWith('.html')) {
    const cleanUrl = '/' + file.replace('.html', '');
    return res.redirect(301, cleanUrl);
  }

  next();
});

/**
 * Catch-all route handler
 * - Files with extensions → serve statically from public/
 * - Clean URLs (no extension) → try pages/<name>.html
 * - Fallback → index.html
 */
app.get('*', async (req, res) => {
  const urlPath = req.path;

  // Static file request (has extension)
  if (path.extname(urlPath)) {
    const filePath = path.join(publicDir, urlPath);

    if (await fileExists(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send('File not found');
    }
  }

  // Clean URL: try pages/<name>.html
  const pageName = urlPath.replace(/^\//, '').replace(/\.html$/, '');
  const htmlPath = path.join(pagesDir, pageName + '.html');

  if (await fileExists(htmlPath)) {
    serveHtmlFile(htmlPath, res);
  } else {
    // Fallback to index.html
    serveHtmlFile(path.join(publicDir, 'index.html'), res);
  }
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).send('<!DOCTYPE html><html><head><title>404</title></head><body><h1>Page Not Found</h1></body></html>');
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Internal Server Error</h1></body></html>');
});

// ============================================
// CART RECOVERY CRON (Phase 3)
// ============================================
if (process.env.CART_RECOVERY_AUTO === 'true') {
  const cron = require('node-cron');
  const { runRecoveryTick } = require('./api/cart-recovery-runner');

  console.log('[cart-recovery] auto mode ENABLED — scheduling every 15 minutes');
  cron.schedule('*/15 * * * *', () => {
    runRecoveryTick(new Date()).catch((err) => {
      console.error('[cart-recovery] tick threw:', err.message);
    });
  });
} else {
  console.log('[cart-recovery] auto mode DISABLED (set CART_RECOVERY_AUTO=true to enable)');
}

// ============================================
// GSC SYNC CRON (Phase 4)
// ============================================
if (process.env.GSC_SYNC_AUTO === 'true') {
  const cron = require('node-cron');
  const { runGscSync } = require('./api/gsc-sync');

  console.log('[gsc-sync] auto mode ENABLED — scheduling daily at 03:00 Europe/London');
  cron.schedule('0 3 * * *', () => {
    runGscSync({}).catch((err) => {
      console.error('[gsc-sync] tick threw:', err.message);
    });
  }, { timezone: 'Europe/London' });
} else {
  console.log('[gsc-sync] auto mode DISABLED (set GSC_SYNC_AUTO=true to enable)');
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n🚀 HQ Aviation Server');
  console.log('━'.repeat(50));
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Dir: ${publicDir}`);
  console.log(`   Env: ${process.env.NODE_ENV || 'development'}`);
  console.log('━'.repeat(50));
  console.log('✅ Compression enabled');
  console.log('✅ Security headers active');
  console.log('✅ Static caching active');
  console.log('✅ Legacy redirects active');
  console.log('\nPress Ctrl+C to stop.\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n\n🛑 Server shutting down gracefully...');
  process.exit(0);
});
