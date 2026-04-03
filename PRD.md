# HQ Aviation Website — Product Requirements Document

**Date:** 2026-02-04
**Status:** Draft
**Version:** 1.0

---

## 1. Project Overview

HQ Aviation is a Robinson helicopter dealership, pilot training school, and maintenance facility based near London, UK. The website is the primary online presence for the business — it needs to showcase the aircraft fleet, sell helicopters, market training and experience flights, and allow visitors to purchase apparel.

The site was originally built on Squarespace and has been exported into a self-hosted static site, served locally via a Node.js / Express.js server (`server.js`, port 7500). All content, assets, and routing currently live in this exported codebase. There is no database; everything is file-based.

---

## 2. Who Uses This Site

- **Prospective buyers** looking at Robinson R44, R66, and R88 helicopters (new, used, recently sold).
- **Aspiring pilots** researching discovery flights, PPL(H) training, and self-fly hire.
- **Existing customers** returning for news, gallery, or to purchase apparel.
- **The business owner (Quentin Smith)** who needs the site to accurately represent HQ Aviation and be maintainable going forward.

---

## 3. Site Structure (Current State)

The site has 53 HTML pages organised into six logical groups, reflected in the navigation:

| Section | Key Pages |
|---|---|
| About | Home, About Us, Meet the Team, Quentin Smith |
| Aircraft Fleet | R44 (+ variants), R66 (+ variants), R88 (+ variants) |
| Aircraft Sales | Compare, New Aircraft, Used Aircraft, Recently Sold |
| Services | Discovery Flights, Flying, Training FAQ, Hangarage, Tours, Expeditions |
| Gallery & Media | Gallery, News, Images of Q, Miscellaneous |
| Shop & Support | Apparel, Store, Contact |

**Root pages:** `public/index.html` (home), `public/store.html` (shop).
**All other pages:** `public/pages/*.html`, served via clean URLs (e.g. `/r66`, `/about-us`).
**Assets:** CSS, JS, and images live in `public/assets/`.

---

## 4. Technical Setup

| Component | Detail |
|---|---|
| Server | Express.js (`server.js`), port 7500 |
| Routing | Clean URLs — `/r66` resolves to `public/pages/r66.html`. Legacy folder paths (e.g. `/r66/file.html`) 301-redirect to `/file`. |
| Navigation | Custom hamburger menu defined in `nav-new.html`. Injected into every page at request time by the server. Uses CSS variables for theming (`--nav-bg`, `--nav-accent`, etc.). |
| Styles & Scripts | Exported Squarespace bundles (minified). Custom site styles in `assets/css/site.css`. |
| Commerce | Squarespace commerce stack is present in the HTML/JS but points back to Squarespace APIs — not functional locally without the original Squarespace backend. |
| Fonts | Typekit and Google Fonts (Playfair Display) load from external CDNs. |

---

## 5. Core Requirements

These are the baseline things the site must do:

1. **All 53 pages load and render correctly** at `localhost:7500`. Navigation links resolve. Images and stylesheets load.
2. **Navigation works on every page.** The hamburger menu must open, display all six sections, and link to the correct destinations. It must close on link tap, overlay click, or ESC key.
3. **Clean URLs work.** Visiting `/r66` serves the R66 page. Visiting `/r66.html` also works (or redirects cleanly). Legacy nested paths redirect correctly.
4. **Mobile-responsive.** The site must be usable on phones and tablets. The navigation hamburger must appear and function on small screens.
5. **Images load.** All 260+ product, team, and editorial images must resolve from their paths in the HTML.
6. **Contact form is reachable.** The `/contact` page must be accessible (form submission backend is a separate concern).
7. **Apparel / Store pages are accessible.** The pages must load; actual checkout flow is out of scope until a backend decision is made.

---

## 6. Content Priorities

The business sells and rents helicopters. The page hierarchy should reflect that:

- The **home page** is the entry point — it must load fast and orient visitors to the main offerings.
- **Aircraft detail pages** (R44, R66, R88 and their sub-variants) are the highest-value content. They need accurate images and specs.
- **Discovery Flights** is likely the lowest-friction conversion — someone books a flight before buying a helicopter. That page should be prominent and easy to find.
- **Contact** needs to be reachable from anywhere on the site.

---

## 7. Known Issues to Address (identified from the code)

These are things that exist in the current codebase and will need attention:

- **Page titles say "HQ Aviation (Copy)."** All `<title>` and OG meta tags carry this "(Copy)" suffix from the Squarespace clone. Needs to be cleaned to "HQ Aviation."
- **Canonical URLs point to Squarespace.** Every page has `<link rel="canonical">` pointing to `ellipse-crimson-z3jz.squarespace.com`. These need updating once a real domain is decided.
- **Favicon loads from Squarespace CDN.** It will break if that CDN link expires. A local favicon should be served instead.
- **Two navigation systems exist in `index.html`.** The home page has both an older `.nav-toggle` / `.site-nav-menu` block and the newer `.hq-nav-*` system. The old one should be removed.
- **Desktop navigation is hidden.** The `.hq-nav-menu` styles set `display: none` for screens above 768px. There is no visible navigation on desktop at all — only the hamburger exists, and it is also hidden at that breakpoint. Desktop nav needs a solution.
- **Duplicate asset folders at root level.** `css/`, `js/`, and `images/` folders exist at the project root alongside `public/assets/`. These appear to be leftover copies from before the restructure and can likely be removed.
- **Test and diagnostic pages are publicly served.** Pages like `nav-test.html`, `diagnostic.html`, and `test-nav-standalone.html` are reachable in the browser. They should not be in production.
- **Store currency defaults to USD** in the Squarespace context config, but `selectedCurrency` is GBP. If commerce is re-enabled, this needs to be consistent.

---

## 8. Out of Scope (for now)

- Live e-commerce / payment processing (requires backend decisions).
- Blog/CMS functionality (Squarespace-specific, not functional in static export).
- SEO / deployment to a production domain (depends on hosting decisions).
- Performance optimisation or asset bundling.

---

## 9. How to Run (for reference)

```bash
cd /path/to/Squarespace
npm install
npm start
# Site is at http://localhost:7500
```
