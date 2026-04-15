# HQ Aviation Admin Panel — Master Architecture

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin panel for HQ Aviation that lets the site owner manage images, aircraft listings, blog posts, pricing, leads, user uploads, reviews, and see analytics — all without touching code.

**Architecture:** Firebase (Firestore + Auth + Storage) as the data layer; existing Express server extended with admin API routes; React admin pages at `/admin/*` protected by Firebase Auth. The public site reads from Firestore for dynamic content (listings, blog, pricing, reviews) and fires lightweight tracking events.

**Tech Stack:** React 19, React Router 7, Firebase 12 (Firestore, Auth, Storage), Express 4, Stripe, Vitest

---

## Subsystem Overview

This project is split into 6 sequential sub-plans. Each is independently testable and deployable. Implement in this order — each plan's output is a dependency of the next.

| Order | Plan file | What it delivers |
|-------|-----------|-----------------|
| 1 | `01-foundation.md` | Firebase client config, Admin auth + protected routes, Admin shell layout/sidebar |
| 2 | `02-image-management.md` | Image slot IDs on every `<img>`, Firestore slot registry, Admin upload/replace UI |
| 3 | `03-content-cms.md` | Aircraft listings CRUD, Blog engine, Pricing control panel |
| 4 | `04-lead-management.md` | All CTAs/forms → Firestore leads, Lead dashboard, Stripe discovery-flight direct |
| 5 | `05-analytics.md` | Lightweight page/click tracking, Analytics dashboard in admin |
| 6 | `06-wall-reviews.md` | Wall of Cool upload moderation, Google review curation panel |

---

## Database Schema (Firestore)

### `listings/{id}`
```
model: string               // "R44 Raven II"
registration: string        // "G-RROB"
year: number                // 2019
price: number               // 12500000 (pence, avoids float)
priceDisplay: string        // "£125,000"
status: 'for_sale'|'sold'|'reserved'|'coming_soon'
type: 'new'|'pre-owned'|'rebuilt'
description: string
specs: { engine, avionics, hours, ttl }
images: [{ url: string, alt: string, isPrimary: boolean }]
featured: boolean
createdAt: Timestamp
updatedAt: Timestamp
```

### `blog_posts/{id}`
```
title: string
slug: string                // url-safe, unique
excerpt: string
content: string             // Markdown
coverImage: string          // Storage URL
status: 'draft'|'published'
tags: string[]
publishedAt: Timestamp | null
createdAt: Timestamp
updatedAt: Timestamp
```

### `pricing/{id}`
```
// id = service key e.g. "discovery_r22_30min"
label: string               // "R22 — 30 min Discovery Flight"
price: number               // pence
description: string
category: 'discovery'|'training'|'rebuild'|'maintenance'|'sales'
updatedAt: Timestamp
```

### `leads/{id}`
```
name: string
email: string
phone: string
subject: string
message: string
source: string              // page pathname
status: 'new'|'contacted'|'qualified'|'closed'
notes: string
createdAt: Timestamp
updatedAt: Timestamp
```

### `image_slots/{slotId}`
```
// slotId = "home-hero-main", "expedition-cinematic-bg", etc.
page: string
section: string
description: string
currentImageUrl: string
updatedAt: Timestamp
```

### `wall_of_cool/{id}`
```
imageUrl: string            // Firebase Storage URL
userName: string
caption: string
status: 'pending'|'approved'|'rejected'
submittedAt: Timestamp
```

### `reviews/{id}`
```
googleReviewId: string
author: string
rating: number
text: string
date: string
avatarUrl: string
visible: boolean
displayOrder: number
```

### `page_events/{id}`
```
sessionId: string
page: string
eventType: 'pageview'|'cta_click'|'form_submit'|'image_view'
elementId: string | null
referrer: string
userAgent: string
timestamp: Timestamp
```

---

## Image Slot ID Convention

Every image on the site gets a `data-slot-id` attribute following this pattern:

```
{page}-{section}-{descriptor}
```

Examples:
- `home-hero-main` — hero background on homepage
- `home-expedition-globe` — globe underlay on home expeditions section
- `expedition-cinematic-bg` — expedition video/image background
- `maintenance-hero-bg` — maintenance page hero
- `sales-r44-primary` — R44 primary listing image
- `facility-gallery-01` through `facility-gallery-08`

Galleries get sequential suffixes (`-01`, `-02`, etc.).

---

## Admin Route Map

```
/admin                    → Dashboard (stats overview)
/admin/images             → Image slot grid + replace modal
/admin/listings           → Listings table
/admin/listings/new       → Create listing form
/admin/listings/:id       → Edit listing form
/admin/blog               → Blog posts table
/admin/blog/new           → Blog editor
/admin/blog/:id           → Edit blog post
/admin/pricing            → Pricing table (inline edit)
/admin/leads              → Leads table + status management
/admin/wall-of-cool       → Pending / approved / rejected uploads
/admin/reviews            → Review grid (toggle visible, reorder)
/admin/analytics          → Page views + top pages + lead sources
```

---

## Environment Variables to Add

Add to `.env` and `.env.example`:

```
# Firebase Client (prefix VITE_ for Vite exposure)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side, no VITE_ prefix)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Admin
ADMIN_EMAIL=owner@hqaviation.co.uk
```

---

## Files Created Across All Sub-Plans

```
src/lib/firebase.js                    — Firebase client init
src/lib/analytics.js                   — trackEvent() utility
src/hooks/useAdmin.js                  — auth state hook
src/hooks/useFirestore.js              — Firestore CRUD helpers

src/pages/admin/AdminLogin.jsx
src/pages/admin/AdminDashboard.jsx
src/pages/admin/AdminImages.jsx
src/pages/admin/AdminListings.jsx
src/pages/admin/AdminListingEdit.jsx
src/pages/admin/AdminBlog.jsx
src/pages/admin/AdminBlogEdit.jsx
src/pages/admin/AdminPricing.jsx
src/pages/admin/AdminLeads.jsx
src/pages/admin/AdminWallOfCool.jsx
src/pages/admin/AdminReviews.jsx
src/pages/admin/AdminAnalytics.jsx

src/components/admin/AdminRoute.jsx    — Protected route wrapper
src/components/admin/AdminLayout.jsx   — Sidebar + topbar shell
src/components/admin/ImageSlot.jsx     — Wrapper for trackable <img>
src/components/admin/StatusBadge.jsx   — Listing status badge

api/admin.js                           — Admin Firestore API helpers
api/leads.js                           — Lead capture POST endpoint
api/images.js                          — Image upload + slot update
api/analytics-api.js                   — Analytics event ingestion

firestore.rules                        — Updated security rules
storage.rules                          — Updated storage rules
```
