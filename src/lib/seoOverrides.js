// src/lib/seoOverrides.js
//
// Firestore client wrapper for the SEO admin dashboard (spec 15 MVP).
//
// Collection: seo_overrides
// Doc ID = canonical path (Firestore-safe encoding via encodeURIComponent)
// Doc shape: { title?, description?, ogImage?, updatedAt, updatedBy }
//
// Reads are cached per page-load (no real-time listener — overrides change
// at marketing-iteration speed, not real-time). Writes use serverTimestamp.

import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

const COLLECTION = 'seo_overrides';

function pathToId(path) {
  // Firestore doc IDs can't contain '/'. URL-encode.
  return encodeURIComponent(path);
}

function idToPath(id) {
  return decodeURIComponent(id);
}

const cache = new Map();

export async function getOverrideForPath(path) {
  if (cache.has(path)) return cache.get(path);
  try {
    const snap = await getDoc(doc(db, COLLECTION, pathToId(path)));
    const data = snap.exists() ? snap.data() : null;
    cache.set(path, data);
    return data;
  } catch (err) {
    console.error('[seoOverrides] get failed:', err.message);
    return null;
  }
}

export async function listOverrides() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({
    path: idToPath(d.id),
    ...d.data(),
  }));
}

export async function saveOverride(path, fields) {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be signed in to save overrides');
  const payload = {
    title: fields.title?.trim() || null,
    description: fields.description?.trim() || null,
    ogImage: fields.ogImage?.trim() || null,
    updatedAt: serverTimestamp(),
    updatedBy: user.email || user.uid,
  };
  await setDoc(doc(db, COLLECTION, pathToId(path)), payload, { merge: false });
  cache.delete(path);
}

export async function clearOverride(path) {
  await deleteDoc(doc(db, COLLECTION, pathToId(path)));
  cache.delete(path);
}
