'use strict';
/**
 * Seed script: pricing collection
 * Run with: node scripts/seed-pricing.js
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 *
 * All prices are stored in pence (GBP). £180 = 18000 pence.
 * Document IDs are the canonical lookup keys used by:
 *   - api/stripe.js        (Stripe charge amounts)
 *   - src/hooks/usePricing.js  (frontend display)
 *   - src/pages/admin/AdminPricing.jsx  (admin editing)
 *
 * Safe to re-run — existing docs are updated, not duplicated.
 */

require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const PRICING = [
  // ── Discovery Flights — charged via Stripe ──────────────────────────────────
  { id: 'discovery_r22_30min', label: 'R22 Discovery Flight (30 min)', category: 'discovery', price: 18000, description: '30-minute trial lesson in a Robinson R22' },
  { id: 'discovery_r22_60min', label: 'R22 Discovery Flight (60 min)', category: 'discovery', price: 36000, description: '60-minute trial lesson in a Robinson R22' },
  { id: 'discovery_r44_30min', label: 'R44 Discovery Flight (30 min)', category: 'discovery', price: 30500, description: '30-minute trial lesson in a Robinson R44' },
  { id: 'discovery_r44_60min', label: 'R44 Discovery Flight (60 min)', category: 'discovery', price: 60500, description: '60-minute trial lesson in a Robinson R44' },
  { id: 'discovery_r66_30min', label: 'R66 Discovery Flight (30 min)', category: 'discovery', price: 45000, description: '30-minute trial lesson in a Robinson R66' },
  { id: 'discovery_r66_60min', label: 'R66 Discovery Flight (60 min)', category: 'discovery', price: 85000, description: '60-minute trial lesson in a Robinson R66' },

  // ── Training Hourly Rates — display only ────────────────────────────────────
  { id: 'training_r22_hr', label: 'R22 Training (per hour)',  category: 'training', price: 27500, description: 'Dual instruction rate in Robinson R22' },
  { id: 'training_r44_hr', label: 'R44 Training (per hour)',  category: 'training', price: 39500, description: 'Dual instruction rate in Robinson R44' },
  { id: 'training_r66_hr', label: 'R66 Training (per hour)',  category: 'training', price: 59500, description: 'Dual instruction rate in Robinson R66' },

  // ── Type Ratings — display only (from price) ────────────────────────────────
  { id: 'type_rating_r22', label: 'R22 Type Rating (from)',   category: 'type-rating', price: 240000, description: 'Minimum 5 hours, skills test included, RHC Safety Course required' },
  { id: 'type_rating_r44', label: 'R44 Type Rating (from)',   category: 'type-rating', price: 320000, description: 'Minimum 5 hours, skills test included, RHC Safety Course required' },
  { id: 'type_rating_r66', label: 'R66 Type Rating (from)',   category: 'type-rating', price: 950000, description: 'Minimum 10 hours, turbine differences training' },

  // ── Self-Fly Hire Rates — display only ─────────────────────────────────────
  { id: 'sfh_r22_wet',   label: 'R22 Wet Rate (per hour)',          category: 'sfh', price: 30000, description: 'Includes fuel. Currency and checkout requirements apply.' },
  { id: 'sfh_r22_block', label: 'R22 Block Rate (per hour, 10 hrs)', category: 'sfh', price: 28500, description: '10-hour block booking discount.' },
  { id: 'sfh_r44_wet',   label: 'R44 Wet Rate (per hour)',          category: 'sfh', price: 45000, description: 'Includes fuel. Currency and checkout requirements apply.' },
  { id: 'sfh_r44_block', label: 'R44 Block Rate (per hour, 10 hrs)', category: 'sfh', price: 42500, description: '10-hour block booking discount.' },
  { id: 'sfh_r66_wet',   label: 'R66 Wet Rate (per hour)',          category: 'sfh', price: 75000, description: 'Includes fuel. Currency and checkout requirements apply.' },
  { id: 'sfh_r66_block', label: 'R66 Block Rate (per hour, 10 hrs)', category: 'sfh', price: 71000, description: '10-hour block booking discount.' },

  // ── Additional Services — display only ─────────────────────────────────────
  { id: 'addon_safety_pilot', label: 'Safety Pilot (per hour)', category: 'additional', price: 15000, description: 'Experienced pilot accompanies your flight' },
  { id: 'addon_customs',      label: 'Customs Handling',        category: 'additional', price:  7500, description: 'International flight paperwork assistance' },

  // ── PPL(H) Cost Estimates — display only (ranges stored as from/to pairs) ──
  { id: 'costs_training_from', label: 'Flight Training — from', category: 'costs', price: 1600000, description: 'Minimum 45 hours required' },
  { id: 'costs_training_to',   label: 'Flight Training — to',   category: 'costs', price: 2000000, description: 'Most students complete in 50–60 hours' },
  { id: 'costs_exams_from',    label: 'Exam Fees — from',       category: 'costs', price:   50000, description: 'CAA theory exams (9 papers) plus skills test fee' },
  { id: 'costs_exams_to',      label: 'Exam Fees — to',         category: 'costs', price:   80000, description: 'CAA theory exams (9 papers) plus skills test fee' },
  { id: 'costs_medical_from',  label: 'Medical Certificate — from', category: 'costs', price: 20000, description: 'Class 2 medical, CAA-approved examiner' },
  { id: 'costs_medical_to',    label: 'Medical Certificate — to',   category: 'costs', price: 30000, description: 'Class 2 medical, CAA-approved examiner' },
  { id: 'costs_total_from',    label: 'Typical Total — from',   category: 'costs', price: 1700000, description: 'Typical total investment for a PPL(H)' },
  { id: 'costs_total_to',      label: 'Typical Total — to',     category: 'costs', price: 2200000, description: 'Typical total investment for a PPL(H)' },
];

async function seed() {
  const col = db.collection('pricing');
  let created = 0;
  let updated = 0;

  for (const item of PRICING) {
    const { id, ...data } = item;
    const ref = col.doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`  updated  ${id}`);
      updated++;
    } else {
      await ref.set({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`  created  ${id}`);
      created++;
    }
  }

  console.log(`\nDone. Created: ${created}  Updated: ${updated}`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
