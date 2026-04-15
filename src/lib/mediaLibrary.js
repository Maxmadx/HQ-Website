/**
 * mediaLibrary.js — central media store helpers.
 *
 * Images live in Firebase Storage at  media-library/{timestamp}-{filename}
 * and are indexed in Firestore collection  media_library  (one doc per image).
 *
 * The Firestore index lets us list/sort without needing Storage listAll(),
 * and lets us attach metadata (name, size, uploadedAt).
 */

import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';

/** Upload a File to the media library and create the Firestore index doc. */
export async function uploadToMediaLibrary(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `media-library/${Date.now()}-${safeName}`;
  const sRef = storageRef(storage, path);
  await uploadBytes(sRef, file);
  const url = await getDownloadURL(sRef);
  const docRef = await addDoc(collection(db, 'media_library'), {
    url,
    name: file.name,
    storagePath: path,
    size: file.size,
    uploadedAt: serverTimestamp(),
  });
  return { id: docRef.id, url, name: file.name, storagePath: path, size: file.size };
}

/** Fetch all media library images, newest first. */
export async function listMediaLibrary() {
  const snap = await getDocs(
    query(collection(db, 'media_library'), orderBy('uploadedAt', 'desc')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Delete an image from both Firestore and Storage. */
export async function deleteFromMediaLibrary(id, storagePath) {
  await deleteDoc(doc(db, 'media_library', id));
  if (storagePath) {
    try {
      await deleteObject(storageRef(storage, storagePath));
    } catch {
      // best-effort — file may have already been removed
    }
  }
}

/** Format bytes → human-readable string. */
export function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
