'use strict';

const TTL_MS = 5 * 60 * 1000;
const MAX = 200;
const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) { store.delete(key); return null; }
  store.delete(key);
  store.set(key, entry);
  return entry.value;
}

function set(key, value) {
  if (store.has(key)) store.delete(key);
  if (store.size >= MAX) store.delete(store.keys().next().value);
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}

function flush() { store.clear(); }

module.exports = { get, set, flush };
