// Update sold helicopter images in Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

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

const testImageUrl = 'https://firebasestorage.googleapis.com/v0/b/hq-website-4abc7.firebasestorage.app/o/helicopters%2FG-HQAV%2Fblue-r66-palo-verde-front-v4.png?alt=media&token=3084cb09-4600-47bd-adf8-873b980b541d';

async function updateSoldImages() {
  console.log('Fetching sold helicopters from Firestore...\n');

  const q = query(collection(db, 'helicopters'), where('status', '==', 'sold'));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const helicopter = docSnap.data();
    console.log(`Updating ${helicopter.model} (${helicopter.registration})...`);

    const newImages = [
      { url: testImageUrl, alt: `${helicopter.model} - Test Image`, isPrimary: true }
    ];

    await updateDoc(doc(db, 'helicopters', docSnap.id), { images: newImages });
    console.log(`✓ Updated images for ${helicopter.registration}`);
  }

  console.log('\nDone!');
  process.exit(0);
}

updateSoldImages();
