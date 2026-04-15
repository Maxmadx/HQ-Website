# Production Go-Live Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the 7 remaining pre-production setup steps so the admin panel is fully operational.

**Architecture:** All infrastructure files (rules, indexes, seeds, admin claim script) already exist. Work is: one file edit (add missing Firestore index), four CLI deploy commands, and two seed script runs.

**Tech Stack:** Firebase CLI, Firebase Admin SDK (Node.js), Firestore, Firebase Storage

---

## Pre-flight: verify Firebase CLI login

- [ ] **Step 1: Check Firebase CLI is installed and logged in**

Run: `firebase projects:list`
Expected: lists `hq-website-4abc7` in the output.

If not logged in, run: `firebase login` (opens browser).
If Firebase CLI not installed: `npm install -g firebase-tools`

---

### Task 1: Add missing page_events Firestore index

**Files:**
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the page_events index**

In `firestore.indexes.json`, add to the `indexes` array:

```json
{
  "collectionGroup": "page_events",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "timestamp", "order": "DESCENDING" }
  ]
}
```

Final file should have 4 indexes total (3 helicopters + 1 page_events).

- [ ] **Step 2: Commit**

```bash
git add firestore.indexes.json
git commit -m "chore: add page_events timestamp index for analytics query"
```

---

### Task 2: Deploy Firestore rules and indexes

**Files:**
- Read: `firestore.rules` (already written)
- Read: `firestore.indexes.json` (just updated)

- [ ] **Step 1: Deploy**

Run: `firebase deploy --only firestore`
Expected output ends with: `✔  Deploy complete!`

If it fails with "index already building", that's fine — Firebase queues them.

---

### Task 3: Deploy Storage rules

**Files:**
- Read: `storage.rules` (already written)

- [ ] **Step 1: Deploy**

Run: `firebase deploy --only storage`
Expected output ends with: `✔  Deploy complete!`

---

### Task 4: Create the admin user

**Files:**
- Read: `scripts/set-admin-claim.js` (already written)

**Pre-condition:** The owner must have already signed in to the app at `/admin/login` at least once using `owner@hqaviation.co.uk` — this creates their Firebase Auth account. If they haven't, have them do that first, then run this step.

- [ ] **Step 1: Set super_admin claim**

Run: `node scripts/set-admin-claim.js owner@hqaviation.co.uk`
Expected:
```
✅ Set role=super_admin on owner@hqaviation.co.uk (uid: ...)
   User must sign out and sign back in for the new token to take effect.
```

- [ ] **Step 2: Have the owner sign out and back in**

The custom claim only takes effect after a fresh token is issued. Owner must sign out of `/admin`, then sign back in.

---

### Task 5: Seed image_slots collection

**Files:**
- Read: `scripts/seed-image-slots.js` (already written — 15 slots across 7 pages)

- [ ] **Step 1: Run seed script**

Run: `node scripts/seed-image-slots.js`
Expected: lists each slot as `added <slotId>`, ends with `Done. Created: 15  Skipped: 0`

Safe to re-run — it skips existing slots.

---

### Task 6: Seed pricing collection

**Files:**
- Read: `scripts/seed-pricing.js` (already written — 6 discovery flight SKUs in pence)

**Note:** Prices are in pence (GBP). Verify prices match what the owner wants before running. Current values: R22 30min=£180, R44 30min=£305, R66 30min=£450, R22 60min=£360, R44 60min=£605, R66 60min=£850.

- [ ] **Step 1: Confirm prices with owner (if not already done)**

Check `scripts/seed-pricing.js` prices against the owner's current price list. Edit if needed.

- [ ] **Step 2: Run seed script**

Run: `node scripts/seed-pricing.js`
Expected: lists each item as `created <id>`, ends with `Done. Created: 6  Updated: 0`

Safe to re-run — it updates existing docs rather than duplicating.

---

## Done

After all tasks complete:
1. Admin panel is fully live at `/admin`
2. Firestore and Storage rules are enforced
3. Analytics queries work (page_events index deployed)
4. Owner can log in as super_admin and manage all content
5. Stripe discovery checkout reads prices from Firestore
