// src/lib/canonicalUrl.js

export function stripTrailingSlash(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/$/, '');
}

export function stripWww(url) {
  return url.replace('://www.', '://');
}

export function forceHttps(url) {
  return url.replace(/^http:\/\//, 'https://');
}

/**
 * Returns the canonicalised URL if the input differs from canonical,
 * or null if input is already canonical (so callers can skip redirect).
 */
export function canonicaliseUrl(input) {
  const u = new URL(input);
  const next = forceHttps(
    stripWww(`${u.protocol}//${u.host}${stripTrailingSlash(u.pathname)}${u.search}`),
  );
  return next === input ? null : next;
}
