import { describe, it, expect } from 'vitest';
import sitemapRouter from './sitemap.js';

function fakeCollection(name) {
  return {
    where: () => ({
      get: async () => {
        if (name === 'listings') {
          return {
            docs: [
              { id: 'lst-1', data: () => ({ updatedAt: { toDate: () => new Date('2026-04-01') } }) },
            ],
          };
        }
        if (name === 'blogs') {
          return {
            docs: [
              { id: 'post-a', data: () => ({ updatedAt: { toDate: () => new Date('2026-03-15') } }) },
            ],
          };
        }
        return { docs: [] };
      },
    }),
  };
}

const fakeDb = { collection: fakeCollection };

describe('sitemap.xml generation', () => {
  it('produces XML containing static routes', async () => {
    const xml = await sitemapRouter.buildSitemapForTest(fakeDb);
    expect(xml).toMatch(/^<\?xml/);
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<loc>https://hqaviation.com/</loc>');
    expect(xml).toContain('<loc>https://hqaviation.com/aircraft/r66</loc>');
    expect(xml).toContain('<loc>https://hqaviation.com/training/ppl</loc>');
  });

  it('includes dynamic listing URLs from Firestore', async () => {
    const xml = await sitemapRouter.buildSitemapForTest(fakeDb);
    expect(xml).toContain('<loc>https://hqaviation.com/sales/pre-owned/lst-1</loc>');
  });

  it('includes dynamic blog URLs from Firestore', async () => {
    const xml = await sitemapRouter.buildSitemapForTest(fakeDb);
    expect(xml).toContain('<loc>https://hqaviation.com/blog/post-a</loc>');
  });

  it('does NOT include dev or noindex routes', async () => {
    const xml = await sitemapRouter.buildSitemapForTest(fakeDb);
    expect(xml).not.toContain('/hero-test');
    expect(xml).not.toContain('/checkout');
    expect(xml).not.toContain('/admin');
  });

  it('emits valid lastmod dates for dynamic entries', async () => {
    const xml = await sitemapRouter.buildSitemapForTest(fakeDb);
    expect(xml).toContain('<lastmod>2026-04-01</lastmod>');
    expect(xml).toContain('<lastmod>2026-03-15</lastmod>');
  });
});
