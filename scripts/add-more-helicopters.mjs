// Add more test helicopters to Firestore
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

// Use existing uploaded images
const img1 = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HQAV%2Fblue-r66-palo-verde-front-v4.png?alt=media&token=3084cb09-4600-47bd-adf8-873b980b541d';
const img2 = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HQAV%2Fblue-r66-palo-verde-left-v4.png?alt=media&token=e8f1c2a3-5b4d-4e6f-8a9b-0c1d2e3f4a5b';
const img3 = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HQAV%2Fblue-palo-verde-front-right-v4.png?alt=media&token=a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const img4 = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HELI%2Fhq-0209.jpg?alt=media';
const img5 = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HELI%2Fhq-0213.jpg?alt=media';

const helicopters = [
  // More available helicopters
  {
    model: "Robinson R44 Clipper II",
    manufacturer: "Robinson",
    year: 2022,
    registration: "G-CLIP",
    serialNumber: "15234",
    totalHours: 320,
    price: 420000,
    priceDisplay: "£420,000",
    status: "available",
    condition: "Excellent",
    description: "Like-new R44 Clipper II with pop-out floats. Perfect for coastal operations.",
    highlights: ["Pop-out floats", "Corrosion protection", "Low hours"],
    images: [
      { url: img1, alt: "R44 Clipper II exterior", isPrimary: true },
      { url: img4, alt: "R44 Clipper II side view", isPrimary: false },
      { url: img5, alt: "R44 Clipper II detail", isPrimary: false }
    ],
    featured: true,
    sortOrder: 4,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    soldAt: null
  },
  {
    model: "Robinson R66 Marine",
    manufacturer: "Robinson",
    year: 2020,
    registration: "G-MARI",
    serialNumber: "0756",
    totalHours: 580,
    price: 720000,
    priceDisplay: "£720,000",
    status: "available",
    condition: "Excellent",
    description: "Turbine-powered R66 with full marine kit. Emergency floats and corrosion protection.",
    highlights: ["Marine kit", "Emergency floats", "Full corrosion treatment", "Garmin avionics"],
    images: [
      { url: img1, alt: "R66 Marine exterior", isPrimary: true },
      { url: img2, alt: "R66 Marine left side", isPrimary: false },
      { url: img3, alt: "R66 Marine front right", isPrimary: false },
      { url: img4, alt: "R66 Marine cockpit", isPrimary: false }
    ],
    featured: true,
    sortOrder: 5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    soldAt: null
  },
  {
    model: "Robinson R22 Beta II",
    manufacturer: "Robinson",
    year: 2018,
    registration: "G-TRNG",
    serialNumber: "4956",
    totalHours: 1800,
    price: 165000,
    priceDisplay: "£165,000",
    status: "available",
    condition: "Good",
    description: "Well-maintained training aircraft with fresh overhaul. Ideal for flight schools.",
    highlights: ["Fresh overhaul", "Training configured", "Full logs"],
    images: [
      { url: img4, alt: "R22 Beta II exterior", isPrimary: true },
      { url: img5, alt: "R22 Beta II detail", isPrimary: false }
    ],
    featured: false,
    sortOrder: 6,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    soldAt: null
  },
  {
    model: "Robinson R44 Raven I",
    manufacturer: "Robinson",
    year: 2016,
    registration: "G-RVNI",
    serialNumber: "13567",
    totalHours: 1450,
    price: 285000,
    priceDisplay: "£285,000",
    status: "available",
    condition: "Very Good",
    description: "Carburetted R44 with economical running costs. Great private helicopter.",
    highlights: ["Economical", "Well maintained", "Recent inspection"],
    images: [
      { url: img4, alt: "R44 Raven I exterior", isPrimary: true },
      { url: img5, alt: "R44 Raven I interior", isPrimary: false },
      { url: img1, alt: "R44 Raven I side", isPrimary: false }
    ],
    featured: false,
    sortOrder: 7,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    soldAt: null
  },
  // More sold helicopters
  {
    model: "Robinson R66 Turbine",
    manufacturer: "Robinson",
    year: 2018,
    registration: "G-TURB",
    serialNumber: "0623",
    totalHours: 890,
    price: 580000,
    priceDisplay: "SOLD",
    status: "sold",
    condition: "Excellent",
    description: "Well-equipped R66 sold to private owner.",
    highlights: ["Turbine power", "Air conditioning"],
    images: [
      { url: img1, alt: "R66 Turbine exterior", isPrimary: true },
      { url: img2, alt: "R66 Turbine side", isPrimary: false },
      { url: img3, alt: "R66 Turbine detail", isPrimary: false }
    ],
    featured: false,
    sortOrder: 97,
    createdAt: Timestamp.fromDate(new Date("2023-08-01")),
    updatedAt: Timestamp.fromDate(new Date("2023-11-15")),
    soldAt: Timestamp.fromDate(new Date("2023-11-15"))
  },
  {
    model: "Robinson R44 Cadet",
    manufacturer: "Robinson",
    year: 2019,
    registration: "G-CDTT",
    serialNumber: "31089",
    totalHours: 650,
    price: 280000,
    priceDisplay: "SOLD",
    status: "sold",
    condition: "Excellent",
    description: "Low-hour Cadet sold to training school.",
    highlights: ["Training ready", "Low hours"],
    images: [
      { url: img4, alt: "R44 Cadet exterior", isPrimary: true },
      { url: img5, alt: "R44 Cadet interior", isPrimary: false }
    ],
    featured: false,
    sortOrder: 96,
    createdAt: Timestamp.fromDate(new Date("2023-06-01")),
    updatedAt: Timestamp.fromDate(new Date("2023-10-20")),
    soldAt: Timestamp.fromDate(new Date("2023-10-20"))
  },
  {
    model: "Robinson R22 Alpha",
    manufacturer: "Robinson",
    year: 2012,
    registration: "G-ALPH",
    serialNumber: "4123",
    totalHours: 2400,
    price: 95000,
    priceDisplay: "SOLD",
    status: "sold",
    condition: "Good",
    description: "High-time R22 sold for continued training use.",
    highlights: ["Budget option", "Full history"],
    images: [
      { url: img4, alt: "R22 Alpha exterior", isPrimary: true }
    ],
    featured: false,
    sortOrder: 95,
    createdAt: Timestamp.fromDate(new Date("2023-04-01")),
    updatedAt: Timestamp.fromDate(new Date("2023-07-10")),
    soldAt: Timestamp.fromDate(new Date("2023-07-10"))
  }
];

async function addHelicopters() {
  console.log('Adding more helicopters to Firestore...\n');

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

addHelicopters();
