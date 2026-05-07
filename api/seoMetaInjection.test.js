import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const express = require('express');
const path = require('path');
const seoMetaInjection = require('./seoMetaInjection');
const cache = require('./seoMetaCache');

function makeApp(opts = {}) {
  const app = express();
  app.use(seoMetaInjection({
    indexHtmlPath: path.join(__dirname, '__fixtures__', 'index.html'),
    getMetaForStaticPath: opts.getMetaForStaticPath || (() => null),
    getMetaForDynamicPath: opts.getMetaForDynamicPath || (async () => null),
  }));
  app.use((req, res) => res.status(404).send('not handled'));
  return app;
}

beforeEach(() => cache.flush());

describe('seoMetaInjection', () => {
  it('injects meta for a static route', async () => {
    const app = makeApp({
      getMetaForStaticPath: (p) => p === '/aircraft/r44' ? {
        title: 'R44', description: 'desc', ogImage: '/og.jpg',
        canonicalUrl: 'https://hqaviation.com/aircraft/r44',
      } : null,
    });
    const res = await request(app).get('/aircraft/r44');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>R44 | HQ Aviation</title>');
    expect(res.text).not.toContain('<!--SSR_HEAD-->');
  });
  it('injects meta for a dynamic route', async () => {
    const app = makeApp({
      getMetaForDynamicPath: async (p) => p.startsWith('/blog/') ? {
        title: 'Post', description: 'd', ogImage: '/c.jpg',
        canonicalUrl: 'https://hqaviation.com/blog/abc',
      } : null,
    });
    const res = await request(app).get('/blog/abc');
    expect(res.text).toContain('<title>Post | HQ Aviation</title>');
  });
  it('falls through for unknown paths', async () => {
    const app = makeApp();
    const res = await request(app).get('/totally-unknown');
    expect(res.status).toBe(404);
  });
  it('caches subsequent identical requests', async () => {
    let calls = 0;
    const getMeta = () => { calls += 1; return { title: 'x', description: 'y', ogImage: '/z.jpg', canonicalUrl: 'https://hqaviation.com/x' }; };
    const app = makeApp({ getMetaForStaticPath: getMeta });
    await request(app).get('/x');
    await request(app).get('/x');
    expect(calls).toBe(1);
  });
});
