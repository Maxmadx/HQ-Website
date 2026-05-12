// api/imageFetch.js
'use strict';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIMEOUT_MS = 10_000; // 10 seconds

/**
 * Fetch an image from a remote URL with size + timeout caps.
 * Returns { buffer: Buffer, contentType: string } on success.
 * Throws on HTTP error, timeout, or oversize response.
 *
 * MUST be called only after validateSrc() — this function trusts the URL.
 */
async function fetchSource(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`source fetch failed: ${res.status}`);
  }

  const contentLength = Number(res.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
    throw new Error(`source too large: ${contentLength} bytes`);
  }

  const ab = await res.arrayBuffer();
  if (ab.byteLength > MAX_BYTES) {
    throw new Error(`source too large: ${ab.byteLength} bytes`);
  }

  return {
    buffer: Buffer.from(ab),
    contentType: res.headers.get('content-type') || 'application/octet-stream',
  };
}

module.exports = { fetchSource, MAX_BYTES, TIMEOUT_MS };
