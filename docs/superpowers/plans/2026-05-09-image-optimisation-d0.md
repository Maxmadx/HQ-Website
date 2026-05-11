# Image Optimisation — Phase D0 (Pre-flight Gates) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validate that the image-optimisation architecture (spec `2026-05-09-image-optimisation-design.md`) can actually ship on the current production host before any implementation begins. Produce a prereqs report that either green-lights D1–D3 or surfaces required scope changes.

**Architecture:** All checks are read-only inspections + small spike scripts that run against the existing repo and the production deploy target. No production code is modified. Output is a single markdown doc (`docs/seo/image-pipeline-d0-prereqs.md`) consolidating findings and a green-light/red-light decision for D1–D3.

**Tech Stack:** Node 20+, sharp 0.33+, existing repo patterns, no new runtime dependencies committed (sharp is installed for the spike but not committed at this phase).

**Reference files:**
- Spec: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` (the "Phase D0" section is the canonical requirements list)
- Existing deploy config: `firebase.json`, `package.json` scripts, any `vercel.json` / `render.yaml` / `fly.toml` if present
- Existing image inventory: `public/assets/images/` (~100+ files)
- Existing CMS code: `api/firebase-admin.js`, admin upload paths, Firestore data shape

**Commit discipline:** one commit per task. Prefix `docs(d0):` for documentation, `chore(d0):` for spike scripts, `fix(d0):` for any cleanup discovered during audits. **One commit per task.**

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `scripts/d0-verify-sharp.js` | One-shot spike: installs sharp, reads metadata of one fixture image, transforms it to AVIF, writes to a temp dir. Run during D0a; deleted before D0 closes if sharp won't be permanently committed. |
| `docs/seo/image-pipeline-d0-prereqs.md` | The deliverable. Consolidates findings from every D0 task. Has a "Green-light decision" section at the end. |
| `docs/seo/image-pipeline-cloudflare-dns-guide.md` | Step-by-step user-facing guide for D0d (Cloudflare free-tier DNS migration). Manual user action; no code. |

### Modified files

None during D0. The point is to make scope decisions before touching production code.

---

## Task 1: Set up D0 worktree

**Files:**
- No code changes

- [ ] **Step 1:** Confirm current branch is `main` and tree is clean

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
git status
git branch --show-current
```

Expected: `On branch main` with `nothing to commit, working tree clean` (or modest unrelated changes — flag any concerning state).

- [ ] **Step 2:** Pull latest main

```bash
git pull origin main
```

- [ ] **Step 3:** Create worktree on a fresh branch

```bash
git worktree add ../HQ-Website-main-d0 -b feat/image-pipeline-d0
cd ../HQ-Website-main-d0
```

Expected: directory `HQ-Website-main-d0` exists, branch `feat/image-pipeline-d0` checked out.

- [ ] **Step 4:** Install dependencies and verify baseline build

```bash
npm install --legacy-peer-deps
npm run build
```

Expected: deps install, `vite build` completes without errors.

(No commit yet — setup only.)

---

## Task 2: D0a — Identify the production deploy target

**Files:**
- No file changes (read-only inspection)

The runtime endpoint (Layer 2 in the spec) needs sharp + writable disk on the production host. Determining the target is the first step.

- [ ] **Step 1:** Inspect deploy configuration files

```bash
ls firebase.json vercel.json render.yaml fly.toml app.yaml Procfile 2>&1
cat firebase.json 2>/dev/null
cat package.json | grep -A2 '"scripts"'
```

Expected: identify which (if any) deploy platforms are configured. Common patterns:
- Firebase Hosting only (static)
- Firebase Hosting + Firebase Functions (serverless Node)
- Render / Fly / Railway (traditional Node host)
- Vercel (mixed — static + serverless)
- Plain VPS / Docker (free-form)

- [ ] **Step 2:** Inspect `server.js` for hosting hints

```bash
grep -E "PORT|process.env\.PORT|listen|module.exports" server.js | head -10
```

Look for: explicit port reading, deployment-specific env vars, comments mentioning the host.

- [ ] **Step 3:** Check git log for deployment commits

```bash
git log --all --oneline | grep -iE "deploy|render|fly|vercel|firebase functions|cloud run" | head -10
```

- [ ] **Step 4:** Document findings (no commit yet — accumulate into Task 7's report)

Write a temporary scratchpad note (`/tmp/d0-host.txt`) capturing:
- Identified host (or "unknown — needs user input")
- Whether the host runs Node continuously or per-invocation (serverless)
- Whether the host has writable disk

If the host can't be determined from config alone, mark this task as **NEEDS_CONTEXT** and ask the user directly.

---

## Task 3: D0a — Sharp install + spike

**Files:**
- Create: `scripts/d0-verify-sharp.js`

- [ ] **Step 1:** Install sharp temporarily (will not commit lockfile changes)

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-d0
npm install --legacy-peer-deps --no-save sharp
```

Expected: install completes; if it fails because of native binary issues on this dev machine, that's already informative — record the failure and check whether the target platform differs.

- [ ] **Step 2:** Write the spike script

Create `scripts/d0-verify-sharp.js`:

```js
'use strict';

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  const repoRoot = path.resolve(__dirname, '..');

  // 1. Find a sample image
  const candidates = [
    'public/assets/images/logos/hq/hq-aviation-logo-black.png',
    'public/og-default.jpg',
  ];
  let sample = null;
  for (const c of candidates) {
    const full = path.join(repoRoot, c);
    if (fs.existsSync(full)) { sample = full; break; }
  }
  if (!sample) throw new Error('No sample image found in expected paths');

  console.log(`Sample: ${path.relative(repoRoot, sample)}`);

  // 2. Read metadata
  const meta = await sharp(sample).metadata();
  console.log(`Metadata: format=${meta.format} width=${meta.width} height=${meta.height} hasAlpha=${meta.hasAlpha}`);

  // 3. Transform to AVIF, WebP, JPEG/PNG
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sharp-spike-'));
  console.log(`Output: ${tmpDir}`);

  const fallbackFmt = meta.hasAlpha ? 'png' : 'jpeg';
  const fallbackExt = meta.hasAlpha ? 'png' : 'jpg';

  await sharp(sample).resize({ width: 800, withoutEnlargement: true }).avif({ quality: 50, effort: 6 }).toFile(path.join(tmpDir, 'sample-800.avif'));
  await sharp(sample).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 75 }).toFile(path.join(tmpDir, 'sample-800.webp'));
  await sharp(sample).resize({ width: 800, withoutEnlargement: true })[fallbackFmt]({ quality: 80 }).toFile(path.join(tmpDir, `sample-800.${fallbackExt}`));

  // 4. Verify outputs are readable images
  for (const ext of ['avif', 'webp', fallbackExt]) {
    const out = path.join(tmpDir, `sample-800.${ext}`);
    const stats = fs.statSync(out);
    const outMeta = await sharp(out).metadata();
    console.log(`  ${ext}: ${stats.size} bytes, ${outMeta.width}x${outMeta.height}`);
  }

  // 5. Disk-cache write test
  const cacheDir = path.join(repoRoot, '.image-cache-test');
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(cacheDir, 'test.txt'), 'ok');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('Disk cache write test: OK');

  console.log('\n✓ sharp spike complete');
}

main().catch((err) => {
  console.error('✗ sharp spike failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
```

- [ ] **Step 3:** Run the spike

```bash
node scripts/d0-verify-sharp.js
```

Expected output (success):

```
Sample: public/assets/images/logos/hq/hq-aviation-logo-black.png
Metadata: format=png width=405 height=245 hasAlpha=true
Output: /var/folders/.../sharp-spike-XXXX
  avif: <bytes> 800x484
  webp: <bytes> 800x484
  png: <bytes> 800x484
Disk cache write test: OK

✓ sharp spike complete
```

If anything fails (sharp install error, transform error, write permission error): record verbatim in `/tmp/d0-sharp.txt` and continue to Task 4. The result determines whether Layer 2 (runtime endpoint) is feasible.

- [ ] **Step 4:** Commit the spike script

```bash
git add scripts/d0-verify-sharp.js
git commit -m "chore(d0): add sharp install + transform spike script"
```

(The spike script stays committed — useful for re-running on a new deploy host. Remove later if `sharp` ends up not in the codebase at all.)

---

## Task 4: D0b — Audit source filenames

**Files:**
- No file changes (read-only inspection)

Even with the parallel-directory variant scheme, source filenames matter — sharp can fail on non-ASCII names, very long paths, or unusual extensions.

- [ ] **Step 1:** Inventory all source images

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-d0
find public/assets/images -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.webp' \) > /tmp/d0-sources.txt
wc -l /tmp/d0-sources.txt
```

Record the count.

- [ ] **Step 2:** Check for problematic filenames

```bash
# Names with spaces (common cause of issues)
grep ' ' /tmp/d0-sources.txt > /tmp/d0-spaces.txt
wc -l /tmp/d0-spaces.txt

# Names with non-ASCII characters
LC_ALL=C grep -E '[^[:print:]]|[^[:ascii:]]' /tmp/d0-sources.txt > /tmp/d0-nonascii.txt
wc -l /tmp/d0-nonascii.txt

# Names matching the variant pattern <basename>-<digits>.<ext>
# (would only matter if we DIDN'T use a separate optimised/ dir, but worth knowing)
grep -E '\-[0-9]+\.(jpe?g|png|webp)$' /tmp/d0-sources.txt > /tmp/d0-variant-shaped.txt
wc -l /tmp/d0-variant-shaped.txt

# Very long path lengths (> 200 chars — most filesystems handle 255 but be safe)
awk '{ if (length($0) > 200) print length($0), $0 }' /tmp/d0-sources.txt > /tmp/d0-long.txt
wc -l /tmp/d0-long.txt
```

Each result file is empty = good. Non-empty = needs review.

- [ ] **Step 3:** Categorise files by extension

```bash
awk -F. '{ print tolower($NF) }' /tmp/d0-sources.txt | sort | uniq -c | sort -rn
```

Expected: counts per extension. Useful for sizing PR D1's work.

- [ ] **Step 4:** Identify files smaller than 50 KB (skip-by-size threshold)

```bash
while read -r f; do
  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$size" -lt 51200 ]; then echo "$size $f"; fi
done < /tmp/d0-sources.txt > /tmp/d0-small.txt
wc -l /tmp/d0-small.txt
```

These will be copied unchanged through the pipeline.

- [ ] **Step 5:** Identify files larger than 1 MB (Layer 1's biggest wins)

```bash
while read -r f; do
  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$size" -gt 1048576 ]; then echo "$size $f"; fi
done < /tmp/d0-sources.txt | sort -rn > /tmp/d0-big.txt
head -20 /tmp/d0-big.txt
```

These dominate the bytes-served-per-request problem. The Shyam photos should be at the top.

(Findings accumulate into Task 7's report. No commit yet.)

---

## Task 5: D0c — Audit CMS image URL patterns

**Files:**
- No file changes (read-only inspection)

The Layer 2 allowlist must cover every origin the admin app actually uploads to.

- [ ] **Step 1:** Grep the codebase for image-source URL patterns

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-d0

# Firebase Storage URLs
grep -rnE 'firebasestorage\.googleapis\.com|storage\.googleapis\.com' src/ api/ scripts/ 2>/dev/null > /tmp/d0-fb-urls.txt
wc -l /tmp/d0-fb-urls.txt
head -20 /tmp/d0-fb-urls.txt

# Other CDN URLs that might appear
grep -rnE 'cloudfront\.net|amazonaws\.com|cdn\.|imgix\.net|cloudinary\.com' src/ api/ scripts/ 2>/dev/null > /tmp/d0-other-cdn.txt
wc -l /tmp/d0-other-cdn.txt

# Direct hqaviation.com asset references (already covered by Layer 1, but worth noting)
grep -rnE 'https?://(www\.)?hqaviation\.com/' src/ api/ scripts/ 2>/dev/null > /tmp/d0-self-urls.txt
wc -l /tmp/d0-self-urls.txt
```

- [ ] **Step 2:** Inspect Firebase Storage upload paths in the admin app

```bash
grep -rnE "ref\(.*storage|uploadBytes|getDownloadURL" src/ 2>/dev/null | head -10
```

Look for: which collections/folders the admin uploads to. Common patterns: `images/`, `blog-covers/`, `listings/<id>/photos/`.

- [ ] **Step 3:** Inspect existing Firestore-stored URLs (if accessible)

The seed scripts in `scripts/seed-*.js` reference image URLs. Skim them:

```bash
grep -E "imageUrl|coverImage|images:|src:|url:" scripts/seed-*.js 2>/dev/null | head -30
```

Look for: actual URL formats stored in Firestore. Confirm they all match the allowlist.

- [ ] **Step 4:** Identify any third-party image hosts in use

If the search in Step 1 surfaced unexpected origins (e.g., a marketing CDN, social-media images), they need to be added to the allowlist OR explicitly rejected (will render plain `<img src>` without optimisation).

(Findings into Task 7's report.)

---

## Task 6: D0d — Cloudflare DNS preparation guide

**Files:**
- Create: `docs/seo/image-pipeline-cloudflare-dns-guide.md`

The user does this in browser; no code. Produce a step-by-step guide so it's ready to execute when the user has 30 minutes.

- [ ] **Step 1:** Identify current DNS provider

```bash
# If the user has DNS info handy in the repo (unlikely but possible)
grep -rE "dns|nameserver" docs/ 2>/dev/null | head
```

Otherwise: the guide assumes the user knows their registrar and will check at runtime.

- [ ] **Step 2:** Write the guide

Create `docs/seo/image-pipeline-cloudflare-dns-guide.md`:

```markdown
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
```

- [ ] **Step 3:** Commit the guide

```bash
git add docs/seo/image-pipeline-cloudflare-dns-guide.md
git commit -m "docs(d0): Cloudflare free-tier DNS migration guide for user execution"
```

---

## Task 7: Compile the prereqs report

**Files:**
- Create: `docs/seo/image-pipeline-d0-prereqs.md`

This is the deliverable. Consolidates findings from Tasks 2–5 into a single doc that either green-lights D1–D3 or surfaces required scope changes.

- [ ] **Step 1:** Build the report from accumulated findings

Create `docs/seo/image-pipeline-d0-prereqs.md` with this structure (fill in real values from `/tmp/d0-*.txt` files):

```markdown
# Image Pipeline — Phase D0 Pre-flight Prereqs Report

**Date:** 2026-05-09
**Spec:** docs/superpowers/specs/2026-05-09-image-optimisation-design.md
**Branch:** feat/image-pipeline-d0

## Summary

[One sentence: green-light or red-light, with the highest-impact finding.]

## D0a — Production deploy target

**Identified host:** [Firebase Hosting + Functions / Render / VPS / unknown]

**Evidence:**
- [What you found in firebase.json / vercel.json / etc.]
- [Relevant package.json scripts]
- [Comments or env-var clues from server.js]

**Implication for Layer 2:**
- [Can sharp run there? Y/N]
- [Is disk writable? Y/N]
- [If serverless: is cold-start tolerable? — Y/N with reasoning]

## D0a — Sharp spike result

**Result:** [PASS / FAIL]

[If PASS: paste the spike output. If FAIL: paste the error verbatim and the platform on which it ran.]

**Implication for Layer 2:** [Layer 2 ships as designed / Layer 2 needs redesign / Layer 2 dropped — accept that CMS images stay un-optimised until redeploy]

## D0b — Source filename audit

**Total sources:** [N]

**By extension:**
- jpg: [N]
- png: [N]
- webp: [N]
- jpeg: [N]

**Sources < 50 KB (will be copied unchanged):** [N]

**Sources > 1 MB (Layer 1's highest-impact wins):** [N]
Top offenders:
- [size] [path]
- [size] [path]
- ...

**Problematic filenames:**
- With spaces: [N — usually 0]
- Non-ASCII: [N — usually 0]
- Variant-pattern-shaped (matters only if NOT using separate optimised/ dir): [N]
- Path > 200 chars: [N — usually 0]

**Implication for Layer 1:** [No filename issues / minor renames recommended / blocking issue: <details>]

## D0c — CMS image URL audit

**Origins observed in code:**
- [origin] — [count of references]
- [origin] — [count of references]

**Existing `<Seo>` allowlist (from `src/components/seo/Seo.jsx` if applicable):** [paste list]

**Allowlist required for Layer 2:**
- `firebasestorage.googleapis.com` — [Y/N seen in code]
- `storage.googleapis.com` — [Y/N seen in code]
- `hqaviation.com` — [Y/N seen in code]
- `[other origins found, if any]` — [why they're in use]

**Implication for Layer 2:** [Allowlist as specced is sufficient / extend allowlist with: <list> / blocking issue: <details>]

## D0d — Cloudflare DNS

Status: [Guide written, awaiting user execution / In progress / Complete]

User-facing guide: `docs/seo/image-pipeline-cloudflare-dns-guide.md`

## Green-light decision

| Phase | Status |
|---|---|
| D1 (build-time pipeline) | [GREEN / RED — reason] |
| D2 (`<Image>` component + rollout) | [GREEN / RED — reason] |
| D3 (runtime endpoint) | [GREEN / RED — reason] |
| D4 (validation) | [GREEN / RED — reason] |

## Required scope changes (if any)

[List any spec deviations needed based on findings. Common cases:]
- [If sharp doesn't run on prod: drop Layer 2 entirely; CMS images stay un-optimised]
- [If allowlist needs extending: add `<origin>` to spec section "Validation"]
- [If filenames have problematic chars: rename N files before D1]
- [If host is read-only: switch Layer 2 cache to in-memory or skip Layer 2]

## Next steps

If all GREEN: invoke `superpowers:writing-plans` to produce the D1 implementation plan.
If any RED: revise the spec, then re-evaluate.
```

- [ ] **Step 2:** Fill in every section with real findings (not placeholders)

Use the contents of `/tmp/d0-host.txt`, `/tmp/d0-sharp.txt`, `/tmp/d0-sources.txt`, `/tmp/d0-spaces.txt`, `/tmp/d0-nonascii.txt`, `/tmp/d0-small.txt`, `/tmp/d0-big.txt`, `/tmp/d0-fb-urls.txt`, `/tmp/d0-other-cdn.txt`, `/tmp/d0-self-urls.txt` to populate.

- [ ] **Step 3:** Make the green-light decision honestly

For each phase D1–D4, choose GREEN or RED based on findings, with a reason. Don't paper over real problems — the whole point of D0 is to surface them.

- [ ] **Step 4:** Commit the report

```bash
git add docs/seo/image-pipeline-d0-prereqs.md
git commit -m "docs(d0): pre-flight prereqs report — green/red-light for D1-D3"
```

---

## Task 8: Push branch + open PR (or merge directly to main)

**Files:**
- No file changes

D0 produced two doc files (`d0-prereqs.md`, `cloudflare-dns-guide.md`) and one spike script (`d0-verify-sharp.js`). No production code changed. This can ship as a small PR or merge directly to main — at the user's discretion.

- [ ] **Step 1:** Push the branch

```bash
git push -u origin feat/image-pipeline-d0
```

- [ ] **Step 2:** Open a PR

```bash
gh pr create --base main --head feat/image-pipeline-d0 --title "Image pipeline Phase D0 — pre-flight prereqs" --body "$(cat <<'EOF'
## Summary

Phase D0 of the image-optimisation work (spec `2026-05-09-image-optimisation-design.md`). Pre-flight gates only — no production code changes. Validates that the architecture can ship before D1 begins.

## What's in

- `scripts/d0-verify-sharp.js` — sharp install + transform spike, reusable on any deploy host
- `docs/seo/image-pipeline-d0-prereqs.md` — consolidated findings + green/red-light decision per phase
- `docs/seo/image-pipeline-cloudflare-dns-guide.md` — step-by-step user-facing guide for Phase D0d (Cloudflare free-tier DNS migration)

## Decision

[Paste the "Green-light decision" table from the prereqs report.]

## Required scope changes (if any)

[Paste from the prereqs report. If none: "None — spec ships as designed."]

## Next step

[If all GREEN: "Invoke `writing-plans` for Phase D1." If any RED: "Revise spec to address: <items>".]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3:** Note the PR URL.

---

## Self-Review

**Spec coverage:** every D0 task in the spec → a numbered task in this plan. ✓
- D0a (sharp + host) → Tasks 2 + 3
- D0b (source filename audit) → Task 4
- D0c (allowlist audit) → Task 5
- D0d (Cloudflare DNS user guide) → Task 6
- Consolidated decision → Task 7
- Ship → Task 8

**Placeholder scan:** none. Every step has actual commands and concrete expected output. The prereqs report template has explicit `[N]` and `[reason]` markers but those are values to be filled in during execution, not unfinished placeholders in the plan itself.

**Type / API consistency:** the spike script's output format is fed into the prereqs report; both use `format / width / height / hasAlpha` consistently. ✓

**Scope check:** one PR. 8 tasks, all independent inspections + one synthesis doc. No production-code changes — appropriately scoped for a pre-flight gate phase. ✓
