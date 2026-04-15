// Firebase Configuration for HQ Aviation
const firebaseConfig = {
  apiKey: "AIzaSyAKuC4hkk2WCWwE6CvkmeGrDVXBIHiNTkY",
  authDomain: "hq-website-4abc7.firebaseapp.com",
  projectId: "hq-website-4abc7",
  storageBucket: "hq-website-4abc7.firebasestorage.app",
  messagingSenderId: "532380073113",
  appId: "1:532380073113:web:f6d23ff50966e24eee8c08",
  measurementId: "G-JJ0GSQY0MF"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, firebaseConfig };
