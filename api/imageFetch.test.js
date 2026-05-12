// api/imageFetch.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const { fetchSource, MAX_BYTES, TIMEOUT_MS } = require('./imageFetch');

describe('fetchSource', () => {
  let originalFetch;
  beforeEach(() => { originalFetch = globalThis.fetch; });
  afterEach(() => { globalThis.fetch = originalFetch; });

  it('returns buffer + content-type on success', async () => {
    const payload = new Uint8Array([1, 2, 3, 4]);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(payload.buffer),
    });
    const r = await fetchSource('https://example.com/x.jpg');
    expect(r.contentType).toBe('image/jpeg');
    expect(Buffer.isBuffer(r.buffer) || r.buffer instanceof Uint8Array).toBe(true);
    expect(r.buffer.length).toBe(4);
  });

  it('throws if response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchSource('https://example.com/missing.jpg')).rejects.toThrow(/404/);
  });

  it('throws if content-length exceeds MAX_BYTES', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([
        ['content-type', 'image/jpeg'],
        ['content-length', String(MAX_BYTES + 1)],
      ]),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
    await expect(fetchSource('https://example.com/big.jpg')).rejects.toThrow(/too large/);
  });

  it('throws if buffer exceeds MAX_BYTES even when content-length missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(MAX_BYTES + 100)),
    });
    await expect(fetchSource('https://example.com/big.jpg')).rejects.toThrow(/too large/);
  });
});
