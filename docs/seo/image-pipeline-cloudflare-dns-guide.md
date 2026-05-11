# Cloudflare Free-tier DNS Migration — User Guide

## What this gets you

Free CDN in front of `hqaviation.com`:
- **Edge caching** of static assets (including the optimised image variants from Phase D1)
- **HTTP/3** automatic — faster connection setup on modern browsers
- **Brotli compression** for HTML / CSS / JS — typically 15–25% smaller than gzip
- **DDoS protection** — Cloudflare absorbs traffic spikes
- **Free TLS certificate** — auto-renewed
- **Analytics** — basic page-view stats

No image optimisation features (those are paid Cloudflare Images at $5+/mo). Just a free CDN sitting in front of the existing host.

## Pre-flight checklist

- [ ] Know the current DNS provider (Namecheap / GoDaddy / Cloudflare directly / Google Domains / etc.)
- [ ] Know the registrar login
- [ ] Know the production server's public IP address (or hostname target if it's a managed host)
- [ ] 30 minutes free — DNS propagation can take up to a few hours but most propagates in < 15 min

## Steps

### 1. Sign up Cloudflare (5 min)

1. Go to https://www.cloudflare.com — click "Sign Up", create a free account.
2. Verify your email.

### 2. Add the site (5 min)

1. Click "Add a Site" — enter `hqaviation.com`.
2. Choose the **Free plan** at the bottom — explicit click required (Cloudflare nudges you toward paid).
3. Cloudflare scans existing DNS records. **Review carefully:** confirm the A / AAAA / MX / TXT records match what you expect. If anything's missing, add it before proceeding.
4. Click "Continue".

### 3. Change nameservers at the registrar (15 min)

1. Cloudflare gives you two nameserver hostnames (e.g. `aria.ns.cloudflare.com` and `bob.ns.cloudflare.com`).
2. Log into your DNS provider's control panel.
3. Find the domain → DNS / Nameserver settings.
4. Replace existing nameservers with Cloudflare's two.
5. Save.

(Specifics vary per registrar — Cloudflare's onboarding flow has provider-specific guides.)

### 4. Wait for activation (5 min – 24 hours)

1. Cloudflare emails when activation completes — usually < 1 hour, sometimes minutes.
2. Until then, the site continues to resolve via the old nameservers — no downtime.

### 5. Recommended Cloudflare settings (10 min, after activation)

In the Cloudflare dashboard for the site:

- **SSL/TLS → Overview**: set encryption mode to **"Full (strict)"**. Requires the origin server to have a valid TLS cert. If origin is plain HTTP, use "Flexible" first then upgrade.
- **SSL/TLS → Edge Certificates**: enable **"Always Use HTTPS"** (forces HTTP → HTTPS at the edge — duplicates server.js's redirect but cheaper at the edge).
- **Speed → Optimization**: enable **"Brotli"**, **"Auto Minify"** (HTML, CSS, JS).
- **Caching → Configuration**: set **Browser Cache TTL** to "Respect Existing Headers" (the optimised-image variants set their own `Cache-Control: max-age=31536000, immutable`).
- **Network**: enable **HTTP/3 (QUIC)**.
- **Network**: enable **0-RTT Connection Resumption**.

### 6. Verify

After activation:

```bash
curl -I https://hqaviation.com/ 2>&1 | grep -E "^cf-|^server:|^alt-svc:"
```

Expected to see:
- `server: cloudflare`
- `cf-ray: <id>` (proves traffic is routed through Cloudflare)
- `alt-svc: h3=":443"` (HTTP/3 advertised)

### 7. Test image cache

```bash
curl -I https://hqaviation.com/og-default.jpg 2>&1 | grep -E "cf-cache-status|age"
```

First request: `cf-cache-status: MISS` (or `EXPIRED`).
Second request (within seconds): `cf-cache-status: HIT` and an `age` header showing seconds-since-cache.

## Rollback

If something breaks: in the registrar's DNS settings, revert nameservers to the original values. Propagation back is the same: usually < 1 hour.

No data is lost; Cloudflare doesn't proxy data, it just routes traffic.
