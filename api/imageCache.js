// api/imageCache.js
'use strict';

/**
 * createCache({ maxBytes, ttlMs }) → { get, set, flush, stats }
 *
 * In-memory LRU cache for image variants. Cloud Run has no persistent
 * disk, so this is the only cache layer. Each entry tracks its own byte
 * count for accurate eviction. TTL ensures stale variants get re-fetched
 * eventually even if the cache is hot.
 *
 * Map iteration order is insertion order in JavaScript; LRU eviction
 * deletes from the head of the map.
 */
function createCache({ maxBytes, ttlMs }) {
  const store = new Map();
  let totalBytes = 0;

  function evictExpired() {
    const now = Date.now();
    for (const [k, entry] of store) {
      if (now >= entry.expiresAt) {
        store.delete(k);
        totalBytes -= entry.bytes;
      } else {
        break; // entries are inserted in order — if this one isn't expired, later ones aren't either
      }
    }
  }

  function evictToFit(neededBytes) {
    while (totalBytes + neededBytes > maxBytes && store.size > 0) {
      const oldestKey = store.keys().next().value;
      const oldest = store.get(oldestKey);
      store.delete(oldestKey);
      totalBytes -= oldest.bytes;
    }
  }

  return {
    get(key) {
      evictExpired();
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() >= entry.expiresAt) {
        store.delete(key);
        totalBytes -= entry.bytes;
        return null;
      }
      return entry.value;
    },

    set(key, value, bytes) {
      if (store.has(key)) {
        totalBytes -= store.get(key).bytes;
        store.delete(key);
      }
      evictToFit(bytes);
      store.set(key, { value, bytes, expiresAt: Date.now() + ttlMs });
      totalBytes += bytes;
    },

    flush() {
      store.clear();
      totalBytes = 0;
    },

    stats() {
      return { entries: store.size, bytes: totalBytes };
    },
  };
}

module.exports = { createCache };
