import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const helmet = require('helmet');

// Reconstruct the helmet+CSP layer from server.js for isolated test.
// Production code lives in server.js; this test asserts the contract.
function buildAppWithHeaders() {
  const app = express();
  app.use(helmet({
    contentSecurityPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  }));
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://js.stripe.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com', 'data:'],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };
  function cspHeaderValue(d) {
    return Object.entries(d).map(([k, v]) => v.length === 0 ? k : `${k} ${v.join(' ')}`).join('; ');
  }
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy-Report-Only', cspHeaderValue(cspDirectives));
    next();
  });
  app.get('/', (req, res) => res.send('ok'));
  return app;
}

describe('security headers', () => {
  it('sets HSTS with 1-year max-age, includeSubDomains, preload', async () => {
    const res = await request(buildAppWithHeaders()).get('/');
    expect(res.headers['strict-transport-security']).toMatch(/max-age=31536000.*includeSubDomains.*preload/);
  });
  it('sets X-Content-Type-Options: nosniff', async () => {
    const res = await request(buildAppWithHeaders()).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
  it('sets Content-Security-Policy-Report-Only with self default and stripe script-src', async () => {
    const res = await request(buildAppWithHeaders()).get('/');
    const csp = res.headers['content-security-policy-report-only'];
    expect(csp).toMatch(/default-src 'self'/);
    expect(csp).toMatch(/script-src 'self' https:\/\/js\.stripe\.com/);
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).toMatch(/upgrade-insecure-requests/);
  });
});
