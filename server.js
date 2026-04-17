/**
 * HQ Aviation Production Server
 * Static file server for Squarespace exported site
 */
'use strict';

require('dotenv').config();

// In production, fail fast if required env vars are missing
if (process.env.NODE_ENV === 'production') {
  const REQUIRED_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
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
const { createPaymentIntent, handleWebhook } = require('./api/stripe');
const leadsRouter = require('./api/leads');
const stripeDiscoveryRouter = require('./api/stripe-discovery');
const analyticsRouter = require('./api/analytics-api');
const pressClickRouter = require('./api/press-click');

const app = express();
app.set('trust proxy', 1); // Read real IP from X-Forwarded-For (required for req.ip behind proxies)
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
  const { aircraft, duration, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage } = req.body || {};

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
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

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
app.use('/api/analytics', express.json(), analyticsRouter);

// ============================================
// PRESS CLICK ROUTES
// ============================================
app.use('/api/press-click', express.json(), pressClickRouter);

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
