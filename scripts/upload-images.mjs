// Upload helicopter images to Firebase Storage and update Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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
const storage = getStorage(app);

// Map helicopter registrations to local image files
const imageMapping = {
  'G-HQAV': [ // R66 Turbine
    { file: 'public/assets/images/blue-r66-palo-verde-front-v4.png', alt: 'R66 front view', isPrimary: true },
    { file: 'public/assets/images/blue-r66-palo-verde-left-v4.png', alt: 'R66 left side', isPrimary: false },
    { file: 'public/assets/images/blue-palo-verde-front-right-v4.png', alt: 'R66 front right', isPrimary: false }
  ],
  'G-HELI': [ // R44 Raven II
    { file: 'public/assets/images/hq-0209.jpg', alt: 'R44 Raven II exterior', isPrimary: true },
    { file: 'public/assets/images/hq-0213.jpg', alt: 'R44 Raven II detail', isPrimary: false }
  ],
  'G-CADN': [ // R44 Cadet
    { file: 'public/assets/images/hq-0345.jpg', alt: 'R44 Cadet exterior', isPrimary: true }
  ],
  'G-BETA': [ // R22 Beta II (sold)
    { file: 'public/assets/images/hq-0388.jpg', alt: 'R22 Beta II', isPrimary: true }
  ],
  'G-RAVN': [ // R44 Raven I (sold)
    { file: 'public/assets/images/hq-0391.jpg', alt: 'R44 Raven I', isPrimary: true }
  ]
};

async function uploadImage(localPath, storagePath) {
  if (!existsSync(localPath)) {
    console.log(`  ⚠ File not found: ${localPath}`);
    return null;
  }

  const fileBuffer = readFileSync(localPath);
  const storageRef = ref(storage, storagePath);

  try {
    await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error(`  ✗ Upload failed for ${localPath}:`, error.message);
    return null;
  }
}

async function uploadHelicopterImages() {
  console.log('Fetching helicopters from Firestore...\n');

  const snapshot = await getDocs(collection(db, 'helicopters'));
  const helicopters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (const helicopter of helicopters) {
    const reg = helicopter.registration;
    const images = imageMapping[reg];

    if (!images) {
      console.log(`⚠ No images mapped for ${helicopter.model} (${reg})`);
      continue;
    }

    console.log(`\nUploading images for ${helicopter.model} (${reg})...`);

    const uploadedImages = [];

    for (const img of images) {
      const fileName = img.file.split('/').pop();
      const storagePath = `helicopters/${reg}/${fileName}`;

      console.log(`  Uploading ${fileName}...`);
      const url = await uploadImage(img.file, storagePath);

      if (url) {
        uploadedImages.push({
          url: url,
          alt: img.alt,
          isPrimary: img.isPrimary
        });
        console.log(`  ✓ Uploaded: ${fileName}`);
      }
    }

    if (uploadedImages.length > 0) {
      // Update Firestore document with image URLs
      const docRef = doc(db, 'helicopters', helicopter.id);
      await updateDoc(docRef, { images: uploadedImages });
      console.log(`  ✓ Updated Firestore with ${uploadedImages.length} images`);
    }
  }

  console.log('\n\nDone!');
  process.exit(0);
}

uploadHelicopterImages();
