/**
 * HQ Aviation Production Server
 * Static file server for Squarespace exported site
 */
'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
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
