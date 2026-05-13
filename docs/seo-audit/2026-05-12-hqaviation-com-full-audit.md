# hqaviation.com — Full SEO / GEO / AEO Audit Report

**Audit type:** Full Audit
**Audit date:** 2026-05-12
**Audited URL:** https://hqaviation.com (Squarespace v7.1 live production site)
**Prepared by:** Claude (SEO / GEO / AEO Skill by Alex Labat, adapted to Claude Code)

---

## Executive Summary

hqaviation.com is a Squarespace site with **outstanding raw brand equity** (Captain Quentin "Q" Smith — first helicopter pilot to fly to both poles, twice aerobatic world champion, 55 years' experience; CAA Part 145 approved; official Robinson factory distributor at Denham Aerodrome) but **structurally weak technical execution**. The site is essentially a single-page architecture: the homepage holds nine H1 tags and 1,494 words, while every other URL is either a 100–400-word stub, a default Squarespace placeholder (`/new-page-1`), or a redirect to the wrong destination (`/about-us` → `/discovery-flight-1`). Only 4 URLs are listed in the sitemap, so Google sees roughly a quarter of the real site. Robots.txt explicitly blocks every major AI crawler (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot, cohere-ai, Bytespider), which neutralises Generative Engine Optimisation potential before content is even considered.

The migration to the new custom codebase is a once-in-a-decade chance to fix every issue below in one architectural reset. None of the findings here are difficult to fix in a custom React build — they are difficult to fix *in Squarespace*, which is why they have persisted.

| Dimension | Score | Status | Key Takeaway |
|---|---|---|---|
| **SEO** | 4/10 | Needs Work | Sitemap broken, redirects mis-targeted, 9 H1s on home, thin deep pages, schema is generic boilerplate |
| **GEO** | 3/10 | Needs Work | Robots.txt blocks every AI crawler; Person schema for Q is absent; entity graph squandered |
| **AEO** | 4/10 | Needs Work | FAQ content exists but no FAQPage schema; no HowTo; no Speakable; no answer-paragraph format |
| **Combined** | **11/30** | **Needs Work** | |

---

## Pages Audited

| URL | Page Type | Notes |
|---|---|---|
| `https://hqaviation.com/` | Root / homepage | Canonical to `/`, 333KB, 1,494 visible words. Identical visual content to `/home` (different ETag/byte content) |
| `https://hqaviation.com/home` | Duplicate of root | Canonical correctly points to `/`. Sitemap lists this URL not `/` — sitemap/canonical conflict |
| `https://hqaviation.com/about` | About page | 170 words, 1 H1, 0 H2, 0 H3, 2 images. Thin |
| `https://hqaviation.com/about-us` | **Broken redirect** | **302 → `/discovery-flight-1`**. Wrong type (should be 301), wrong destination (should be `/about`). Header nav still links here |
| `https://hqaviation.com/helicopter-training` | Service page | 429 words, 1 H1, 0 H2, 9 H3. Reasonable depth but no Course schema |
| `https://hqaviation.com/helicopter-maintenance` | Service page | 291 words, 1 H1, 0 H2, 6 H3. CAA Part 145 mention buried, not structured |
| `https://hqaviation.com/helicopter-sales` | Service page | 276 words, 1 H1, 0 H2, 4 H3. **3 images have empty alt** |
| `https://hqaviation.com/contact` | Contact page | 100 words, 1 H1. Has good meta description with NAP data |
| `https://hqaviation.com/news` | News index | **83 words — page is empty**. No articles. Misses every blog/content-marketing opportunity |
| `https://hqaviation.com/discovery-flight-1` | Product landing | **Empty meta description**, 1 H1. Canonical to self. Identical byte-for-byte to `/about-us` |
| `https://hqaviation.com/discovery-flight-1/discovery-flight-x` | Product page | **2 H1s**, trailing space in `<title>`, has Product + AggregateOffer schema (£180–£605, 4 offers) |
| `https://hqaviation.com/new-page-1` | **Squarespace placeholder** | Title literally `"HQ Aviation — New Page"`, empty meta description, **no H1**, no content. **In the live sitemap.** |

---

## SEO Analysis — Score 4/10 (Needs Work)

### Technical On-Page

| Signal | Finding | Status |
|---|---|---|
| Title tags | Present on every page. Format: `"HQ Aviation — [Page]"` (brand-first). `/discovery-flight-x` has a **trailing space** in the title. Length 32–62 chars — within range | Needs Attention |
| Meta descriptions | Present on `/`, `/about`, `/helicopter-*`, `/contact`, `/news`. **Empty on `/discovery-flight-1` AND `/new-page-1`** — both indexable | Needs Attention |
| Canonical tags | Self-referencing, present on every page. `/home` correctly canonicalises to `/` | Good |
| Sitemap | **Lists only 4 URLs**: `/home`, `/new-page-1`, `/discovery-flight-1`, `/discovery-flight-1/discovery-flight-x`. **Missing**: `/about`, `/helicopter-training`, `/helicopter-maintenance`, `/helicopter-sales`, `/contact`, `/news`. **Lists** `/home` (a duplicate that canonicalises elsewhere) **and** `/new-page-1` (the placeholder). Lists `/home` instead of `/` — conflicts with canonical | **Missing / Critical** |
| Robots.txt | Squarespace default. Standard `/config`, `/search`, `/account` disallows. Sitemap pointer present | Good (for traditional bots) |
| Robots meta | Not set on any page → defaults to `index,follow` | Good |
| Viewport meta | `initial-scale=1` present everywhere | Good |
| H1 hierarchy | **Homepage has 9 H1 tags** (`about us`, `Offer the gift of flight!`, `helicopter FLYING Services`, `Maintenance`, `Helicopter SALES`, `Contact Us`, `News`, `collaborations`, `FAQ`). `/discovery-flight-x` has **2 H1s**. `/new-page-1` has **0 H1s** | **Missing / Critical** |
| H2/H3 logic | H2 on homepage: 3. H3 on homepage: 20 (incl. several `&nbsp;`-only H3s). Hierarchy is inverted — H1s should be H2/H3, and "FAQ" should be the parent with each question as H2 not H3 | Needs Attention |
| URL structure | `/discovery-flight-1` (numbered), `/discovery-flight-1/discovery-flight-x` (placeholder-style nested URL), `/new-page-1` (default name). `/home` exists alongside `/`. None of the service URLs use locality keywords (`-london`, `-uk`, `-denham`) | Needs Attention |
| Internal linking | Header nav links to `/about-us` (broken 302), `/about` (correct), AND both exist. Footer copyright says "© HQ Aviation 2025" while audit date is 2026-05-12 — out of date | Needs Attention |
| og:image | URL is `http://...` not `https://...` — mixed-content warning on https pages | Needs Attention |
| Twitter Card | `summary` set everywhere. Should be `summary_large_image` for richer pin previews | Needs Attention |
| Image alt text | 79 images on home, 19 with empty alt (`alt=""`). `/helicopter-sales` has 3 empty alts on 5 images | Needs Attention |
| Image performance | Home page uses `loading="lazy"` on 18 images and `srcset` on 18 — Squarespace handles this reasonably | Good |
| HTTPS / HSTS | HTTPS enforced, HSTS header present (`max-age=0` though — should be `≥31536000`) | Needs Attention |
| Sitemap/canonical alignment | Sitemap lists `/home` but canonical of `/home` says `/`. Google sees conflicting signals about the canonical home URL | Needs Attention |
| hreflang | Not present. Acceptable for UK-only target, but worth a conscious decision | Good (for now) |

### Content Quality

| Signal | Finding | Status |
|---|---|---|
| Total word count | ~3,300 words sitewide across 11 pages. Home: 1,494 / Training: 429 / Maintenance: 291 / Sales: 276 / About: 170 / Contact: 100 / News: 83 / New-page-1: 76 | Needs Attention |
| Pillar content depth | **None**. No 1,500+ word pillar pages on "Helicopter Training London", "PPL(H) Course Guide", or similar — for the most-Googled UK helicopter-school keywords, the site has no shot at ranking on content depth | **Missing** |
| Freshness signals | No publication dates. No "last updated". News page is empty. Footer copyright still says "© HQ Aviation 2025" | Needs Attention |
| Keyword targeting | Service pages target reasonable terms ("PPL(H)", "type rating", "Robinson dealer London") in metadata but body content doesn't reinforce them with structure/lists | Needs Attention |
| Readability | Conversational, scannable on home page. Service pages are short paragraphs without bullets or callouts | Needs Attention |
| Trust signals in content | Q's North Pole / South Pole / aerobatic world champion claims are mentioned in body text but never visually framed as credentials with a date, source, or photo | Needs Attention |

### Structured Data

| Signal | Finding | Status |
|---|---|---|
| JSON-LD blocks | Every page has the **same 3 blocks**: `WebSite`, `Organization`, `LocalBusiness`. Only the product page adds a 4th: `Product` + `AggregateOffer` (£180–£605, 4 offers, InStock) | Needs Attention |
| @context | All blocks use `http://schema.org` (HTTP). Google's preferred URI is `https://schema.org` | Needs Attention |
| Organization schema | Has legalName, address, email, telephone, sameAs (4 social). **Missing**: `logo`, `foundingDate`, `founder` (which would be Quentin Smith), `numberOfEmployees`, `award` | Needs Attention |
| LocalBusiness | Has address, openingHours, name. **Missing**: `@id`, `priceRange`, `geo` (lat/long for Denham Aerodrome), `currenciesAccepted`, `paymentAccepted`, `areaServed`, `hasOfferCatalog` | Needs Attention |
| Person schema (for Q) | **Not present anywhere on the site**. World-class E-E-A-T signal (twice aerobatic world champion, first to reach both poles by helicopter, founder, instructor) is invisible to search engines as an entity | **Missing / Critical** |
| Course schema | **Not present**. PPL(H), CPL(H), Type Rating, Night Rating each warrant a `Course` block with `educationalCredentialAwarded`, `provider`, `coursePrerequisites`, `timeRequired` | **Missing** |
| Service schema | **Not present** for `/helicopter-maintenance` or `/helicopter-sales`. Both are textbook `Service` candidates | **Missing** |
| FAQPage schema | **Not present** — even though `/` has a visible FAQ section with 6 questions | **Missing** |
| BreadcrumbList | **Not present** anywhere | **Missing** |
| Review / AggregateRating | **Not present**. No testimonials, no Google Reviews integration | **Missing** |
| Product schema details | Present on `/discovery-flight-x` but description is truncated mid-sentence; missing `image[]` (only single image), `sku`, `brand` is a string not Organization, `aggregateRating` absent | Needs Attention |

---

## GEO Analysis — Score 3/10 (Needs Work)

GEO targets AI-powered answer engines (ChatGPT Search, Claude, Perplexity, Gemini, Google AI Overviews). Where SEO rewards ranking, GEO rewards being *cited* — and citation requires (a) the crawler being allowed in and (b) the page making facts cleanly extractable.

### E-E-A-T Assessment

| Signal | Finding | Status |
|---|---|---|
| Author / founder identity | "Quentin Q Smith" is named in body copy but **never marked up as a Person entity**. No bio page, no headshot with credentials, no `<address>` or `rel="author"` markup | Needs Attention |
| Credentials surfaced | "First helicopter pilot to reach the North Pole", "first to reach the South Pole", "first to circumnavigate the world", "Twice Aerobatic World Champion", "55 years of experience" — all in prose only. No `award` schema, no certification logos visible | Needs Attention |
| About / Team page | `/about` exists but is 170 words with no H2/H3 and no team roster. No instructor profiles | Needs Attention |
| Organization clarity | Organization schema declares HQ Aviation Ltd cleanly with NAP + 4 social profiles | Good |
| Contact accessibility | NAP visible in footer of every page (phone, email, full Denham address). `/contact` page is short but well-described in meta | Good |
| External authority links | `/home` links out to authoritative sources: robinsonheli.com (manufacturer), avbuyer.com (dealer listing), egld.com (Denham Aerodrome). Helpful for the entity graph | Good |
| Reciprocal authority (backlinks) | Not assessable via HTML fetch — run Ahrefs/Semrush domain audit separately | N/A (external tool) |

### Content for AI Synthesis

| Signal | Finding | Status |
|---|---|---|
| Factual density | Decent on `/home` (specific hours, prices, hour-requirements per licence, helicopter types). But facts aren't surfaced as a quick-extract list — they're prose | Needs Attention |
| Clear claims at the top | Home opens with "Established by world renowned helicopter pilot Quentin 'Q' Smith, HQ Aviation is London's helicopter flight school, with over 55 years of experience" — strong opening line for AI extraction | Good |
| Originality / unique perspective | The Q biography and aerobatic-world-champion angle is highly original — no other UK school can claim this. But it's a paragraph, not a structured fact set | Needs Attention |
| Entity disambiguation | "HQ Aviation" / "HQ Aviation Ltd" / "HQ" used inconsistently. `sameAs` links help disambiguate | Good |
| Comprehensiveness | Course descriptions are 2–3 sentences each. AI engines synthesising "how to get a PPL(H) in the UK" won't have enough to cite | Needs Attention |
| Source citation | Internal-only — no citations of CAA regulations, no links to Robinson Helicopter Company spec sheets, no external authority references for the claimed records | Needs Attention |

### Technical GEO

| Signal | Finding | Status |
|---|---|---|
| AI crawler access | **`robots.txt` explicitly blocks**: AI2Bot, Amazonbot, **anthropic-ai**, Applebot-Extended, Bytespider, CCBot, **ClaudeBot**, cohere-ai, **GPTBot**, **Google-Extended** | **Missing / Critical** |
| Rich schema types | Only WebSite + Organization + LocalBusiness sitewide; Product on one page. Missing every type AI engines weight heavily (Person, Article, Course, FAQ, HowTo) | **Missing** |
| HTTPS / security | TLS 1.3 served, HSTS present (though `max-age=0`) | Good |
| Clean crawlability | No `noindex`; no JS-only content blocks on key pages | Good |
| sameAs / entity graph | Organization sameAs links to YouTube, Facebook, Instagram, TikTok — but Q himself has no entity graph (no Wikidata, no Wikipedia, no Person sameAs) | Needs Attention |
| Speakable markup | Not present anywhere | Needs Attention |

---

## AEO Analysis — Score 4/10 (Needs Work)

### Featured Snippet Eligibility

| Signal | Finding | Status |
|---|---|---|
| Direct answer paragraphs | Course descriptions on home page open with the requirement count ("a minimum of 45 hrs", "155 hrs of flying time post licence", "100 hrs of flying post licence") — perfect featured-snippet bait, but not formatted as concise paragraphs under question-headings | Needs Attention |
| Definition patterns | "Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot" — decent definition style | Good |
| List content | No numbered step lists ("How to get your PPL(H) in 5 steps…"), no bullet-style overview lists. Schema dropdown selectors only | Needs Attention |
| Table content | No comparison tables (e.g., R22 vs R44, PPL vs CPL). A side-by-side table is gold for table snippets | **Missing** |

### Structured Answer Formats

| Signal | Finding | Status |
|---|---|---|
| FAQ schema | **Not present**, even though the homepage has 6 visible FAQ questions: "Where is HQ Aviation based?", "What does HQ Aviation do?", "Who is 'Q'?", "How long does is take to get my helicopter license 'PPL(H)'?", "What is HQ Aviation like?", "At what age can you fly?" (note typo: *is take*) | **Missing** |
| HowTo schema | Not present. The PPL(H) journey ("ground school → 45 hrs flight → 10 hrs solo → test") is a textbook HowTo candidate | **Missing** |
| Question-phrased headings | FAQ section uses question H3s — but they're nested under an H1 of just "FAQ". Should be H2s under a topic H1 | Needs Attention |
| Speakable schema | Not present | **Missing** |

### Voice Search Readiness

| Signal | Finding | Status |
|---|---|---|
| Conversational tone | Home content reads naturally ("Stop dreaming and start flying", "Should you want to master the Art of Auto-Rotations") | Good |
| Long-tail coverage | "Where", "What", "Who", "How long", "At what age" all answered in FAQ — strong base for voice queries | Good |
| Local signals | NAP consistent across pages. LocalBusiness schema present. Mentions "London" and "Denham Aerodrome" prominently. **No `geo` coordinates** in schema | Needs Attention |
| Speakable markup | Not present | **Missing** |

---

## Priority Recommendations

| Priority | Issue | Dimension | Effort | Impact |
|---|---|---|---|---|
| 🔴 **Critical** | `/about-us` 302-redirects to `/discovery-flight-1`. Should be a 301 to `/about` (or made into the real About page). Header nav still links to `/about-us` | SEO | Low | High |
| 🔴 **Critical** | `/new-page-1` is a live, indexed Squarespace placeholder with no H1, empty meta description, and is in the sitemap. **Delete it** (or 410) | SEO | Low | High |
| 🔴 **Critical** | Sitemap lists only 4 URLs and conflicts with canonical (`/home` vs `/`). Regenerate to list `/`, `/about`, `/helicopter-training`, `/helicopter-maintenance`, `/helicopter-sales`, `/discovery-flight-1`, `/discovery-flight-1/discovery-flight-x`, `/contact`, `/news` and drop `/home` + `/new-page-1` | SEO | Low | High |
| 🔴 **Critical** | `robots.txt` blocks every AI crawler. Remove `User-agent: anthropic-ai`, `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `cohere-ai`, `Bytespider` disallow blocks. *Decision required:* allow AI training vs allow AI search-engine crawl. At minimum, allow the search-engine variants (e.g. `GPTBot`, `ClaudeBot-User`, `OAI-SearchBot`, `PerplexityBot`, `Google-Extended`) so the site can be **cited** even if not used as training data | GEO | Low | **Very High** |
| 🔴 **Critical** | Homepage has 9 H1 tags. Reduce to exactly one H1 (e.g. "HQ Aviation — Helicopter Training, Sales & Maintenance at Denham Aerodrome, London"). Demote `about us`, `FLYING`, etc. to H2 | SEO | Medium | High |
| 🟠 **High** | Add `Person` schema for Quentin "Q" Smith with `award` array (North Pole record, South Pole record, twice aerobatic world champion), `jobTitle: Founder & Chief Flying Instructor`, `worksFor: HQ Aviation Ltd`, `birthPlace`, `nationality`. Link in `Organization.founder`. **This is the single biggest E-E-A-T win on the site** | GEO | Medium | **Very High** |
| 🟠 **High** | Add `FAQPage` schema to the homepage covering the 6 existing questions (fix the typo: *"How long does is take"* → *"How long does it take"*). Eligible for People Also Ask | AEO | Low | High |
| 🟠 **High** | Add `Course` schema to `/helicopter-training` covering PPL(H), CPL(H), Type Rating, Night Rating with `educationalCredentialAwarded`, `timeRequired`, `provider` | GEO + SEO | Medium | High |
| 🟠 **High** | Build deep service pages with real content depth. Current `/helicopter-training` (429 words), `/helicopter-maintenance` (291), `/helicopter-sales` (276), `/about` (170), `/news` (83) all need to be 1,000–1,500 words with H2/H3 structure, FAQs, and pricing tables | SEO + Content | High | High |
| 🟠 **High** | Fix `/discovery-flight-1` empty meta description and the byte-identical content vs `/about-us`. The latter shouldn't even exist | SEO | Low | High |
| 🟡 **Medium** | Add `Service` schema to `/helicopter-maintenance` (CAA Part 145) and `/helicopter-sales` (Robinson factory distributor) | GEO + SEO | Low | Medium |
| 🟡 **Medium** | Add `BreadcrumbList` schema to every page beyond home | SEO | Low | Medium |
| 🟡 **Medium** | Upgrade `og:image` URL from `http://` to `https://` (current mixed-content warning); change Twitter Card from `summary` to `summary_large_image` and supply 1200×630 images per page | SEO | Low | Medium |
| 🟡 **Medium** | Reframe `<title>` tags keyword-first: `"Helicopter Training London — PPL(H) Courses | HQ Aviation"` instead of `"HQ Aviation — Helicopter Pilot Training"`. Same for sales/maintenance. Brand last | SEO | Low | Medium |
| 🟡 **Medium** | Fix trailing space in `/discovery-flight-x` `<title>` | SEO | Low | Low |
| 🟡 **Medium** | Update `@context` from `http://schema.org` to `https://schema.org` | SEO + GEO | Low | Low |
| 🟡 **Medium** | LocalBusiness: add `geo`, `priceRange`, `paymentAccepted`, `areaServed`, `@id`. Add `HelicopterTrainingSchool` / `SchoolOfDrivers` style sub-type if applicable | GEO | Low | Medium |
| 🟡 **Medium** | Add `HowTo` schema for "How to become a UK helicopter pilot (PPL(H))" | AEO | Medium | Medium |
| 🟡 **Medium** | Populate `/news`. The empty news page signals abandonment. Even 6 short posts about deliveries, rebuilds, expeditions, instructor profiles would add ~6,000 words of indexable content | Content | Medium | Medium |
| 🟡 **Medium** | Fix empty `alt=""` on 3 images on `/helicopter-sales` and 19 on `/home` | SEO + a11y | Low | Medium |
| 🟢 **Quick Win** | Footer says "© HQ Aviation 2025" while real date is 2026-05-12. Auto-generate from `Date.now()` in the codebase migration | SEO | Trivial | Low |
| 🟢 **Quick Win** | Add `SpeakableSpecification` on the FAQ block for voice-search snippets | AEO | Low | Low |
| 🟢 **Quick Win** | Drop or 301 `/home` → `/`. They duplicate content with conflicting canonical/sitemap signals | SEO | Trivial | Medium |
| 🟢 **Quick Win** | Set HSTS `max-age` to a real value (e.g. `31536000; includeSubDomains`) in the new infra (Cloudflare/Vercel/Netlify) | SEO | Low | Low |
| 🟢 **Quick Win** | Add `aggregateRating` (e.g. Google Reviews count) to Organization and Product schema once a reviews integration exists | GEO + AEO | Medium | Medium |

---

## What's Working Well

| Strength | Evidence |
|---|---|
| **Brand entity is genuinely best-in-class** | Quentin "Q" Smith's record-setting biography is unique in UK helicopter training. Plus CAA Part 145, Robinson factory distributor, Denham Aerodrome anchor |
| **Meta descriptions on key pages are good** | `/helicopter-training`, `/helicopter-maintenance`, `/helicopter-sales`, `/contact`, `/news` all have 150–250 char descriptions with locality keywords and a benefit framing |
| **Canonical tags self-reference cleanly** | Every audited page has a self-canonical, `/home` correctly canonicalises to `/` |
| **HTTPS enforced sitewide** | All pages served over TLS 1.3, HSTS header sent (length needs increasing but the header exists) |
| **Lazy loading + srcset on home** | 18 images lazy-loaded with `srcset` — image performance basics are in place |
| **Conversational, voice-friendly tone** | "Stop dreaming and start flying" / "Should you want to master the Art of Auto-Rotations" reads well and aligns with voice search |
| **NAP consistency** | Phone, address, email visible on every page footer with identical formatting |
| **Social entity graph** | Organization schema has 4 `sameAs` links (YouTube, Facebook, Instagram, TikTok), which strengthens entity recognition |
| **External authority outbound links** | Links to robinsonheli.com (manufacturer), avbuyer.com (industry directory), Denham Aerodrome (egld.com), Helipaddy — all helpful entity signals |
| **Product schema with real offer data** | `/discovery-flight-x` has AggregateOffer with £180–£605, 4 offers, InStock |

---

## What This Audit Can't Tell You (Run Separately)

| Signal | Where to check |
|---|---|
| Core Web Vitals (LCP, INP, CLS) | https://pagespeed.web.dev/?url=https://hqaviation.com — run on **mobile** specifically |
| Backlink profile / domain authority | Ahrefs, Semrush, or Moz domain overview |
| Actual indexation status in Google | Google Search Console → Coverage. Confirm `/new-page-1`, `/about-us` redirect, `/home`, `/discovery-flight-1` aren't all indexed as duplicates |
| Search Console queries / impressions / clicks | GSC → Performance → Queries (last 16 months) |
| Mobile rendering issues | Chrome DevTools device emulation, plus Google's mobile-friendly test |
| Schema validation | https://validator.schema.org/ paste each block in |
| Rich results eligibility | https://search.google.com/test/rich-results |

---

## Recommended Migration Strategy (specific to your DNS cutoff plan)

Because you're moving from Squarespace to your custom codebase (`HQ-Website-main`), the cleanest sequence is:

1. **Before cutoff** — fix the broken redirects + delete `/new-page-1` in Squarespace, OR ensure the new codebase implements:
   - `301` (not 302) from `/about-us` → `/about`
   - `410 Gone` (or no route) for `/new-page-1`
   - `301` from `/home` → `/`
   - `301` from `/discovery-flight-1/discovery-flight-x` → a clean URL like `/discovery-flight/book` or `/discovery-flight`
2. **At cutoff** — submit a fresh `sitemap.xml` to Google Search Console listing all real URLs. Drop the legacy Squarespace sitemap.
3. **At cutoff** — replace robots.txt with a custom one that drops the AI-bot blocks (or keeps a deliberate subset). At minimum, allow `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` for citation.
4. **First sprint after cutoff** — implement `Person`, `Course`, `FAQPage`, `Service`, `BreadcrumbList` schema. These compound over weeks as AI engines re-crawl.
5. **First content sprint** — flesh out `/about` to 800+ words with team roster, write 6 news posts to populate `/news`, add a real testimonials section.

A custom React codebase makes every single recommendation in the matrix above straightforward to ship. Squarespace's template constraints (forced H1 tags per section block, default placeholder URLs, hard-coded robots.txt) are *the* reason most of these issues exist.

---

## Glossary

**SEO (Search Engine Optimization)** — optimising for ranking in traditional results pages (Google, Bing) via on-page signals, technical health, content depth, and backlinks.

**GEO (Generative Engine Optimization)** — optimising for being *cited as a source* by AI-powered answer engines (ChatGPT Search, Perplexity, Claude, Gemini, Google AI Overviews). Wins come from clean entity markup, allowed crawl access for AI bots, factual density, and external authority signals.

**AEO (Answer Engine Optimization)** — optimising for direct-answer surfaces (Google featured snippets, People Also Ask, voice assistants). Wins come from question-phrased headings, concise 40–60-word answer paragraphs, FAQ schema, HowTo schema, and table/list formats.

**E-E-A-T** — Experience, Expertise, Authoritativeness, Trustworthiness. Google's quality framework, particularly weighted for "Your Money Your Life" topics (which flight training arguably touches via safety).

---

*Prepared 2026-05-12 by Claude using the SEO / GEO / AEO Skill by Alex Labat, adapted for Claude Code (local Markdown delivery).*
