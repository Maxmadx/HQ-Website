import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

/**
 * Fetch all docs from a collection ordered by createdAt desc.
 * Returns array of { id, ...data }.
 */
export async function getCollection(collectionName) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Fetch all docs without ordering (for collections without createdAt).
 */
export async function getCollectionUnordered(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add a new doc. Adds createdAt + updatedAt timestamps.
 * Returns the new doc id.
 */
export async function createDoc(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Update an existing doc by id. Sets updatedAt timestamp.
 */
export async function updateDocById(collectionName, id, data) {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/**
 * Delete a doc by id.
 */
export async function deleteDocById(collectionName, id) {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}

/**
 * React hook: subscribe to a collection with live updates.
 * Returns { docs, loading, error }.
 */
export function useCollection(collectionName, orderByField = 'createdAt') {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName, orderByField]);

  return { docs, loading, error };
}

/**
 * Subscribe to a single doc by collection + id.
 * Returns { data, loading, error }. data is { id, ...fields } or null if doc missing.
 */
export function useDocument(collectionName, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !id) {
      setLoading(false);
      return;
    }
    const ref = doc(db, collectionName, id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [collectionName, id]);

  return { data, loading, error };
}
