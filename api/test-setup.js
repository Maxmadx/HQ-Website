'use strict';

// Intercept firebase-admin BEFORE any test module loads it.
// This runs via vitest setupFiles, before any test file imports resolve.
const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  if (request === 'firebase-admin' ||
      (parent && parent.filename && parent.filename.includes('firebase-admin.js') && request === 'firebase-admin')) {
    return {
      apps: [true],
      credential: { cert: () => ({}) },
      initializeApp: () => {},
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: false }),
            set: async () => {},
            update: async () => {},
          }),
        }),
        FieldValue: { serverTimestamp: () => null },
        Timestamp: { fromMillis: (ms) => ({ seconds: Math.floor(ms / 1000) }) },
      }),
    };
  }
  return originalLoad.apply(this, arguments);
};
