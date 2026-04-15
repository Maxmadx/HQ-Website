// Seed script to add sample helicopters to Firestore
// Run with: node scripts/seed-helicopters.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize with default credentials (uses gcloud auth)
initializeApp({
  projectId: 'hq-website-4abc7'
});

const db = getFirestore();

const helicopters = [
  {
    model: "Robinson R66 Turbine",
    manufacturer: "Robinson",
    year: 2021,
    registration: "G-HQAV",
    serialNumber: "0987",
    totalHours: 450,
    price: 650000,
    priceDisplay: "£650,000",
    status: "available",
    condition: "Excellent",
    description: "Exceptional low-hour R66 with full options package. One owner from new, maintained by HQ Aviation since delivery. Fresh 100-hour inspection completed.",
    highlights: ["Single owner from new", "Full leather interior", "Air conditioning", "Garmin avionics suite"],
    specs: {
      engine: "Rolls-Royce RR300",
      engineHours: 450,
      engineTBO: 3000,
      avionics: ["Garmin G500H", "GTN 750", "GTX 345"],
      equipment: ["Air conditioning", "Leather seats", "USB charging"]
    },
    images: [
      { url: "/assets/images/helicopters/r66-exterior.jpg", alt: "R66 exterior view", isPrimary: true }
    ],
    featured: true,
    sortOrder: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    soldAt: null
  },
  {
    model: "Robinson R44 Raven II",
    manufacturer: "Robinson",
    year: 2019,
    registration: "G-HELI",
    serialNumber: "14892",
    totalHours: 1250,
    price: 350000,
    priceDisplay: "£350,000",
    status: "available",
    condition: "Excellent",
    description: "Well-maintained R44 Raven II with comprehensive equipment list. Regular maintenance by HQ Aviation service center.",
    highlights: ["New blades at 1000 hours", "HQ Aviation maintained", "Full service history"],
    specs: {
      engine: "Lycoming IO-540",
      engineHours: 1250,
      engineTBO: 2200,
      avionics: ["Garmin GTN 650", "GTX 345 Transponder"],
      equipment: ["Pop-out floats", "Leather seats"]
    },
    images: [
      { url: "/assets/images/helicopters/r44-exterior.jpg", alt: "R44 exterior view", isPrimary: true }
    ],
    featured: true,
    sortOrder: 2,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
    soldAt: null
  },
  {
    model: "Robinson R44 Cadet",
    manufacturer: "Robinson",
    year: 2020,
    registration: "G-CADN",
    serialNumber: "31045",
    totalHours: 800,
    price: 295000,
    priceDisplay: "£295,000",
    status: "available",
    condition: "Very Good",
    description: "Perfect training aircraft or economical personal helicopter. Two-seat configuration with excellent visibility.",
    highlights: ["Low operating costs", "Perfect for training", "Excellent visibility"],
    specs: {
      engine: "Lycoming O-540",
      engineHours: 800,
      engineTBO: 2200
    },
    images: [
      { url: "/assets/images/helicopters/r44-cadet.jpg", alt: "R44 Cadet exterior", isPrimary: true }
    ],
    featured: false,
    sortOrder: 3,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    soldAt: null
  },
  {
    model: "Robinson R22 Beta II",
    manufacturer: "Robinson",
    year: 2017,
    registration: "G-BETA",
    serialNumber: "4892",
    totalHours: 2100,
    price: 145000,
    priceDisplay: "SOLD",
    status: "sold",
    condition: "Good",
    description: "Reliable R22 with good time remaining. Sold to a new private pilot.",
    highlights: ["Good engine time remaining", "Complete logbooks"],
    specs: {
      engine: "Lycoming O-360",
      engineHours: 2100,
      engineTBO: 2200
    },
    images: [
      { url: "/assets/images/helicopters/r22-beta.jpg", alt: "R22 Beta II", isPrimary: true }
    ],
    featured: false,
    sortOrder: 99,
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2024-01-10"),
    soldAt: new Date("2024-01-10")
  },
  {
    model: "Robinson R44 Raven I",
    manufacturer: "Robinson",
    year: 2015,
    registration: "G-RAVN",
    serialNumber: "13245",
    totalHours: 1800,
    price: 275000,
    priceDisplay: "SOLD",
    status: "sold",
    condition: "Good",
    description: "Solid R44 with carburetted engine. Sold to commercial operator.",
    highlights: ["Charter-ready", "Commercial maintenance"],
    specs: {
      engine: "Lycoming O-540",
      engineHours: 1800,
      engineTBO: 2200
    },
    images: [
      { url: "/assets/images/helicopters/r44-raven1.jpg", alt: "R44 Raven I", isPrimary: true }
    ],
    featured: false,
    sortOrder: 98,
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-12-20"),
    soldAt: new Date("2023-12-20")
  }
];

async function seedHelicopters() {
  console.log('Adding helicopters to Firestore...\n');

  for (const helicopter of helicopters) {
    try {
      const docRef = await db.collection('helicopters').add(helicopter);
      console.log(`✓ Added: ${helicopter.model} (${helicopter.registration}) - ID: ${docRef.id}`);
    } catch (error) {
      console.error(`✗ Failed to add ${helicopter.model}:`, error.message);
    }
  }

  console.log('\nDone! Check Firebase Console to verify.');
}

seedHelicopters();
