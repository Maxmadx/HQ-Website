// Seed script using Firebase Web SDK (no service account needed)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKuC4hkk2WCWwE6CvkmeGrDVXBIHiNTkY",
  authDomain: "hq-website-4abc7.firebaseapp.com",
  projectId: "hq-website-4abc7",
  storageBucket: "hq-website-4abc7.firebasestorage.app",
  messagingSenderId: "532380073113",
  appId: "1:532380073113:web:f6d23ff50966e24eee8c08"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    description: "Exceptional low-hour R66 with full options package. One owner from new, maintained by HQ Aviation since delivery.",
    highlights: ["Single owner from new", "Full leather interior", "Air conditioning", "Garmin avionics suite"],
    images: [{ url: "/assets/images/helicopters/r66-exterior.jpg", alt: "R66 exterior view", isPrimary: true }],
    featured: true,
    sortOrder: 1,
    createdAt: Timestamp.fromDate(new Date("2024-01-15")),
    updatedAt: Timestamp.now(),
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
    description: "Well-maintained R44 Raven II with comprehensive equipment list. Regular maintenance by HQ Aviation.",
    highlights: ["New blades at 1000 hours", "HQ Aviation maintained", "Full service history"],
    images: [{ url: "/assets/images/helicopters/r44-exterior.jpg", alt: "R44 exterior view", isPrimary: true }],
    featured: true,
    sortOrder: 2,
    createdAt: Timestamp.fromDate(new Date("2024-01-20")),
    updatedAt: Timestamp.now(),
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
    description: "Perfect training aircraft or economical personal helicopter.",
    highlights: ["Low operating costs", "Perfect for training", "Excellent visibility"],
    images: [{ url: "/assets/images/helicopters/r44-cadet.jpg", alt: "R44 Cadet exterior", isPrimary: true }],
    featured: false,
    sortOrder: 3,
    createdAt: Timestamp.fromDate(new Date("2024-02-01")),
    updatedAt: Timestamp.now(),
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
    images: [{ url: "/assets/images/helicopters/r22-beta.jpg", alt: "R22 Beta II", isPrimary: true }],
    featured: false,
    sortOrder: 99,
    createdAt: Timestamp.fromDate(new Date("2023-11-01")),
    updatedAt: Timestamp.fromDate(new Date("2024-01-10")),
    soldAt: Timestamp.fromDate(new Date("2024-01-10"))
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
    images: [{ url: "/assets/images/helicopters/r44-raven1.jpg", alt: "R44 Raven I", isPrimary: true }],
    featured: false,
    sortOrder: 98,
    createdAt: Timestamp.fromDate(new Date("2023-09-15")),
    updatedAt: Timestamp.fromDate(new Date("2023-12-20")),
    soldAt: Timestamp.fromDate(new Date("2023-12-20"))
  }
];

async function seedHelicopters() {
  console.log('Adding helicopters to Firestore...\n');

  for (const helicopter of helicopters) {
    try {
      const docRef = await addDoc(collection(db, 'helicopters'), helicopter);
      console.log(`✓ Added: ${helicopter.model} (${helicopter.registration}) - ID: ${docRef.id}`);
    } catch (error) {
      console.error(`✗ Failed to add ${helicopter.model}:`, error.message);
    }
  }

  console.log('\nDone!');
  process.exit(0);
}

seedHelicopters();
