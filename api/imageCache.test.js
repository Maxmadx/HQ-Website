// api/imageCache.test.js
import { describe, it, expect, vi } from 'vitest';
const { createCache } = require('./imageCache');

describe('imageCache', () => {
  it('returns null for missing keys', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    expect(cache.get('missing')).toBeNull();
  });

  it('stores and retrieves an entry', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', { foo: 'bar' }, 100);
    expect(cache.get('a')).toEqual({ foo: 'bar' });
  });

  it('expires entries past TTL', () => {
    vi.useFakeTimers();
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', { foo: 'bar' }, 100);
    expect(cache.get('a')).toEqual({ foo: 'bar' });
    vi.advanceTimersByTime(1001);
    expect(cache.get('a')).toBeNull();
    vi.useRealTimers();
  });

  it('evicts oldest entries when byte limit exceeded', () => {
    const cache = createCache({ maxBytes: 300, ttlMs: 60000 });
    cache.set('a', 'A', 100);
    cache.set('b', 'B', 100);
    cache.set('c', 'C', 100);
    expect(cache.get('a')).toBe('A'); // not yet evicted
    cache.set('d', 'D', 100); // now at 400 > 300
    expect(cache.get('a')).toBeNull(); // 'a' evicted (oldest insertion)
    expect(cache.get('d')).toBe('D'); // 'd' still there
  });

  it('reports stats', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'A', 100);
    cache.set('b', 'B', 200);
    const s = cache.stats();
    expect(s.entries).toBe(2);
    expect(s.bytes).toBe(300);
  });

  it('flush() empties the cache', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'A', 100);
    cache.flush();
    expect(cache.get('a')).toBeNull();
    expect(cache.stats().entries).toBe(0);
  });

  it('updating an existing key replaces the entry and adjusts bytes', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'first', 100);
    cache.set('a', 'second', 200);
    expect(cache.get('a')).toBe('second');
    expect(cache.stats().bytes).toBe(200);
  });
});
