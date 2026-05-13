// api/image.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
const request = require('supertest');
const express = require('express');
const sharp = require('sharp');
const imageRouter = require('./image');
const { _cache } = require('./image');

async function makeOpaqueBuffer(w, h) {
  return sharp({ create: { width: w, height: h, channels: 3, background: { r: 100, g: 150, b: 200 } } })
    .jpeg({ quality: 80 })
    .toBuffer();
}

beforeEach(() => { _cache.flush(); });

function makeApp() {
  const app = express();
  app.use('/api/image', imageRouter);
  return app;
}

describe('GET /api/image', { timeout: 30000 }, () => {
  it('400 on missing src', async () => {
    const res = await request(makeApp()).get('/api/image?w=400&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed origin', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://example.com/x.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed width', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x') + '&w=999&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed format', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x') + '&w=400&fmt=gif');
    expect(res.status).toBe(400);
  });

  it('502 when source fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/missing.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(502);
  });

  it('200 + AVIF body when source fetch succeeds', async () => {
    const srcBuf = await makeOpaqueBuffer(1200, 800);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg'], ['content-length', String(srcBuf.length)]]),
      arrayBuffer: () => Promise.resolve(srcBuf.buffer.slice(srcBuf.byteOffset, srcBuf.byteOffset + srcBuf.byteLength)),
    });
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/avif');
    expect(res.headers['cache-control']).toMatch(/immutable/);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('serves second request from cache (no second fetch call)', async () => {
    const srcBuf = await makeOpaqueBuffer(1200, 800);
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(srcBuf.buffer.slice(srcBuf.byteOffset, srcBuf.byteOffset + srcBuf.byteLength)),
    });
    globalThis.fetch = fetchSpy;
    const url = '/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x.jpg') + '&w=400&fmt=webp';
    await request(makeApp()).get(url);
    await request(makeApp()).get(url);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
