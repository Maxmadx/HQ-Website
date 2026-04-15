/**
 * imageHelpers.js — shared utilities for the image CMS.
 * Imported by AdminImages and ImageEditDrawer.
 */

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { SECTION_MAP } from './imageSections';

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function uploadToStorage(sectionId, file) {
  const path = `site-images/${sectionId}/${Date.now()}-${file.name}`;
  const sRef = storageRef(storage, path);
  await uploadBytes(sRef, file);
  return getDownloadURL(sRef);
}

export async function persistSection(sectionId, images) {
  const meta = SECTION_MAP[sectionId];
  await setDoc(doc(db, 'site_images', sectionId), {
    page:      meta.page,
    name:      meta.name,
    type:      meta.type,
    images:    images.map((img, i) => ({ ...img, order: i })),
    updatedAt: serverTimestamp(),
  });
}
