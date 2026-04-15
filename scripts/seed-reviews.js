// scripts/seed-reviews.js
// Seeds the 7 hardcoded reviews into Firestore reviews collection.
// Safe to re-run only if collection is empty — checks first.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');

const reviews = [
  { author: 'Patrick C.',  role: 'Helicopter Owner · R44 Raven II',        rating: 5, displayOrder: 1, text: "HQ Aviation has been looking after my R44 for over five years now. The level of care and attention to detail from David Cross and his engineering team is second to none. They treat my aircraft as if it were their own." },
  { author: 'Andy B.',     role: 'Trial Lesson Student',                    rating: 5, displayOrder: 2, text: "What an incredible day. From the moment I arrived, the team made me feel completely at ease. The briefing was thorough, and then actually flying the helicopter — there's nothing quite like it. I'm already looking at booking my PPL course." },
  { author: 'Luca L.',     role: 'Helicopter Owner · R66 Turbine',          rating: 5, displayOrder: 3, text: "The leaseback programme has been fantastic for offsetting ownership costs. HQ manages everything — maintenance, scheduling, insurance coordination. My R66 pays for itself, and I still fly it whenever I want." },
  { author: 'Geoff R.',    role: 'PPL(H) · Self-Fly Hire Regular',          rating: 5, displayOrder: 4, text: "The walk-in, walk-out self-fly hire is exactly what I wanted after getting my licence. No membership fees, no hassle. I book an R44, it's fuelled and ready on the pad. Last month I flew to Le Touquet for lunch — try doing that by car." },
  { author: 'Maxim K.',    role: 'Helicopter Owner · R22 Beta II',          rating: 5, displayOrder: 5, text: "Bought my R22 through HQ and they've maintained it impeccably since. The engineering team genuinely cares. When my 2,200-hour overhaul came up, they walked me through every option and the rebuild came back better than factory." },
  { author: 'Sarah H.',    role: 'PPL Student · Hour Building',             rating: 5, displayOrder: 6, text: "The instructors at HQ are patient, professional and genuinely passionate about teaching. I started my PPL in January and passed my skills test in September. The ground school was brilliant — passed all nine exams first time." },
  { author: 'James M.',    role: 'Expedition Participant · Iceland 2024',   rating: 5, displayOrder: 7, text: "Flying to Iceland with Captain Q was a once-in-a-lifetime experience. The planning was meticulous, the flying was extraordinary, and the camaraderie between the group was something I'll never forget. Already signed up for the next one." },
];

async function main() {
  const db = admin.firestore();
  const col = db.collection('reviews');

  // Check if already seeded
  const existing = await col.limit(1).get();
  if (!existing.empty) {
    console.log('reviews collection already has data — skipping seed.');
    process.exit(0);
  }

  const batch = db.batch();
  for (const r of reviews) {
    batch.set(col.doc(), {
      ...r,
      date: '',
      visible: true,
      avatarUrl: '',
    });
  }
  await batch.commit();
  console.log(`✓ Seeded ${reviews.length} reviews into Firestore.`);
  process.exit(0);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
