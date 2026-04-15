import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TEXT_SECTIONS_BY_PAGE, TEXT_SECTION_MAP } from '../lib/textSections';

const cache = {};

function buildDefaults(pageKey) {
  const map = {};
  (TEXT_SECTIONS_BY_PAGE[pageKey] ?? []).forEach((section) => {
    map[section.id] = {};
    section.fields.forEach((field) => {
      map[section.id][field.id] = field.default;
    });
  });
  return map;
}

export function usePageText(pageKey) {
  const [textMap, setTextMap] = useState(() => cache[pageKey] ?? buildDefaults(pageKey));

  useEffect(() => {
    if (cache[pageKey]) {
      setTextMap(cache[pageKey]);
      return;
    }
    const defaults = buildDefaults(pageKey);
    const q = query(collection(db, 'site_text'), where('page', '==', pageKey));
    getDocs(q)
      .then((snap) => {
        const merged = { ...defaults };
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.fields && Object.keys(data.fields).length > 0) {
            merged[docSnap.id] = { ...defaults[docSnap.id], ...data.fields };
          }
        });
        cache[pageKey] = merged;
        setTextMap(merged);
      })
      .catch(() => {});
  }, [pageKey]);

  const t = (sectionId, fieldId) =>
    textMap[sectionId]?.[fieldId] ??
    TEXT_SECTION_MAP[sectionId]?.fields.find((f) => f.id === fieldId)?.default ??
    '';

  return { textMap, t };
}
