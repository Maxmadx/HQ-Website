'use strict';

// GDPR data minimisation: we store a truncated IP, never the full address.
// IPv4 is truncated to /24 (last octet zeroed); IPv6 to /48 (first 3 hextets).
// The full IP is still used in-memory for geo lookup — it just never hits the DB.

function truncateIpv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p) || Number(p) > 255) return null;
  }
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

function truncateIpv6(ip) {
  const halves = ip.split('::');
  if (halves.length > 2) return null;

  let hextets;
  if (halves.length === 2) {
    const left = halves[0] ? halves[0].split(':') : [];
    const right = halves[1] ? halves[1].split(':') : [];
    const fill = 8 - left.length - right.length;
    if (fill < 0) return null;
    hextets = [...left, ...Array(fill).fill('0'), ...right];
  } else {
    hextets = ip.split(':');
  }

  if (hextets.length !== 8) return null;
  for (const h of hextets) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(h)) return null;
  }

  // /48 — keep the first 3 hextets (leading zeros stripped), zero the rest.
  return `${hextets.slice(0, 3).map((h) => parseInt(h, 16).toString(16)).join(':')}::`;
}

/**
 * Truncate an IP address for GDPR-safe storage.
 * @param {string|null|undefined} ip  Raw IP (may be an IPv4-mapped IPv6 like ::ffff:1.2.3.4)
 * @returns {string|null}  Truncated IP, or null if input is empty/malformed.
 */
function truncateIp(ip) {
  if (!ip || typeof ip !== 'string') return null;
  let addr = ip.trim();
  if (!addr) return null;

  // Normalise IPv4-mapped IPv6 (::ffff:1.2.3.4) down to plain IPv4.
  const mapped = addr.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mapped) addr = mapped[1];

  if (addr.includes(':')) return truncateIpv6(addr);
  return truncateIpv4(addr);
}

module.exports = { truncateIp };
