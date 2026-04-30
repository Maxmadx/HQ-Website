// scripts/scrape-google-reviews.cjs
//
// Scrapes every Google Maps review for HQ Aviation Ltd and writes them to
// scripts/google-reviews.json. Drives Playwright directly (bypasses MCP).
//
// Why this exists: Google now hides review cards from anonymous sessions
// ("limited view"). To get the full list we need a signed-in browser. This
// script opens a headed Chromium with a persistent profile, waits for you
// to sign in once, then scrapes and saves the JSON. Subsequent runs reuse
// the saved cookies.
//
// Usage:
//   node scripts/scrape-google-reviews.cjs           # interactive, headed
//   node scripts/scrape-google-reviews.cjs --headless # after first sign-in
//
// Then seed Firestore with:
//   node scripts/seed-reviews.js --from-json scripts/google-reviews.json --force

const path = require('path');
const fs = require('fs');

const PLAYWRIGHT_PATH = '/usr/local/lib/node_modules/claude-playwright/node_modules/playwright';
const { chromium } = require(PLAYWRIGHT_PATH);

const PROFILE_DIR = path.join(__dirname, '..', '.claude', 'playwright-profile');
const OUTPUT = path.join(__dirname, 'google-reviews.json');
const PLACE_URL = 'https://www.google.com/maps/place/HQ+Aviation+Ltd/@51.5918637,-0.5143918,17z/data=!4m8!3m7!1s0x48766ed1ec88a2df:0x78f17fa958e197be!8m2!3d51.5918637!4d-0.5118169!9m1!1b1!16s%2Fg%2F1wfcnn43?hl=en';

const HEADLESS = process.argv.includes('--headless');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dismissConsent(page) {
  for (const lbl of ['Reject all', 'Accept all', 'I agree']) {
    const btn = page.locator(`button:has-text("${lbl}")`).first();
    try {
      if (await btn.isVisible({ timeout: 1500 })) {
        await btn.click();
        console.log(`[consent] clicked "${lbl}"`);
        await sleep(1200);
        return;
      }
    } catch {}
  }
}

async function waitForReviewsVisible(page, maxMinutes = 10) {
  const deadline = Date.now() + maxMinutes * 60 * 1000;
  console.log('[auth] waiting for review cards to appear (sign in if prompted)…');
  while (Date.now() < deadline) {
    const count = await page.locator('div[data-review-id]').count();
    if (count > 0) {
      console.log(`[auth] ${count} review card(s) visible — proceeding`);
      return true;
    }
    await sleep(2000);
  }
  return false;
}

async function sortByNewest(page) {
  try {
    const sortBtn = page.getByRole('button', { name: /^Sort/i }).first();
    if (await sortBtn.isVisible({ timeout: 3000 })) {
      await sortBtn.click();
      await sleep(500);
      const newest = page.getByRole('menuitemradio', { name: /^Newest/i }).first();
      if (await newest.isVisible({ timeout: 2000 })) {
        await newest.click();
        console.log('[sort] newest first');
        await sleep(1500);
      }
    }
  } catch (e) { console.log('[sort] skipped:', e.message); }
}

async function findScrollable(page) {
  return await page.evaluateHandle(() => {
    const cards = document.querySelectorAll('div[data-review-id]');
    if (!cards.length) return null;
    let el = cards[0];
    while (el && el !== document.body) {
      const cs = getComputedStyle(el);
      const overflowing = cs.overflowY === 'auto' || cs.overflowY === 'scroll';
      if (overflowing && el.scrollHeight > el.clientHeight + 20) return el;
      el = el.parentElement;
    }
    return null;
  });
}

async function loadAllReviews(page) {
  const handle = await findScrollable(page);
  const isNull = await handle.evaluate((n) => n === null);
  if (isNull) {
    console.log('[scroll] no scrollable container — using window scroll');
    return;
  }
  let last = 0;
  let stable = 0;
  for (let i = 0; i < 100 && stable < 5; i++) {
    await page.evaluate((el) => { el.scrollTop = el.scrollHeight; }, handle);
    await sleep(900);
    const count = await page.locator('div[data-review-id]').count();
    process.stdout.write(`\r[scroll] iter ${i} → ${count} reviews`);
    if (count === last) stable++; else { stable = 0; last = count; }
  }
  process.stdout.write('\n');
}

async function expandTruncated(page) {
  const more = page.locator('button:has-text("More")');
  const n = await more.count();
  for (let i = 0; i < n; i++) {
    try { await more.nth(i).click({ timeout: 500 }); } catch {}
  }
  console.log(`[expand] clicked ${n} "More" buttons`);
  await sleep(400);
}

async function extract(page) {
  return await page.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('div[data-review-id]')) {
      const id = card.getAttribute('data-review-id') || '';
      const author = (card.querySelector('div.d4r55, button[jsaction*="reviewerLink"] div')?.textContent || '').trim();
      const ratingEl = card.querySelector('[role="img"][aria-label*="star"], span[aria-label*="star"]');
      const m = (ratingEl?.getAttribute('aria-label') || '').match(/(\d)\s*star/i);
      const rating = m ? Number(m[1]) : null;
      const date = (card.querySelector('span.rsqaWe, span.xRkPPb')?.textContent || '').trim();
      const text = (card.querySelector('span.wiI7pd, div.MyEned span')?.textContent || '').trim();
      out.push({ id, author, rating, date, text });
    }
    return out;
  });
}

(async () => {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });
  console.log(`[profile] ${PROFILE_DIR}`);

  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: HEADLESS,
    channel: 'chrome',
    viewport: { width: 1280, height: 900 },
    locale: 'en-GB',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());

  console.log(`[nav] ${PLACE_URL}`);
  await page.goto(PLACE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(2500);
  await dismissConsent(page);

  const ok = await waitForReviewsVisible(page, HEADLESS ? 1 : 10);
  if (!ok) {
    console.error('[fatal] no reviews appeared. Run without --headless and sign in to Google.');
    await ctx.close();
    process.exit(1);
  }

  await sortByNewest(page);
  await loadAllReviews(page);
  await expandTruncated(page);
  const reviews = await extract(page);

  fs.writeFileSync(OUTPUT, JSON.stringify(reviews, null, 2));
  console.log(`[done] ${reviews.length} reviews → ${OUTPUT}`);
  await ctx.close();
})().catch((e) => { console.error('[fatal]', e); process.exit(1); });
