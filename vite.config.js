import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Read GIT_REV from the build shell env; default to 'unknown' if absent.
    // The build script in package.json sets this from `git rev-parse --short HEAD`.
    'import.meta.env.VITE_GIT_REV': JSON.stringify(process.env.GIT_REV || 'unknown'),
    // Production-default VITE_* values. These are PUBLIC-SAFE — Sentry DSNs and
    // GA Measurement IDs are designed to ship in client bundles (Sentry's own
    // docs surface the DSN in their setup docs; GA tags are visible in every
    // gtag.js page). process.env overrides on every build, so local .env wins
    // for dev. Lock production projects to allowed domains in Sentry/GA UI.
    'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(
      process.env.VITE_SENTRY_DSN ||
      'https://b6332b0d7d9c4157df9b14e2382ebf32@o4511383562616832.ingest.de.sentry.io/4511383564386384'
    ),
    'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(
      process.env.VITE_GA_MEASUREMENT_ID || 'G-JJ0GSQY0MF'
    ),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7500',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Vendor chunking — group large stable deps into named chunks so they
    // cache across deploys. Repeat visitors only re-download what changed.
    // Aim is to drop the single-bundle 985 KB gzip baseline to a 300-400
    // KB main + reusable vendor chunks. See
    // docs/superpowers/specs/2026-05-13-cwv-quick-wins.md for the full plan.
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react-router-dom/') || /\/react(?:-dom)?\//.test(id)) {
            return 'react';
          }
          if (id.includes('/framer-motion/')) return 'framer';
          if (id.includes('/firebase/')) return 'firebase';
          if (
            id.includes('/react-simple-maps/') ||
            id.includes('/d3-scale/') ||
            id.includes('/world-atlas/')
          ) {
            return 'maps';
          }
          if (id.includes('/@stripe/')) return 'stripe';
          return undefined;
        },
      },
    },
  },
  test: {
    setupFiles: ['./api/test-setup.js', './src/test-setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/.worktrees/**',
      // Requires the Firestore emulator (run via `npm run test:rules`).
      'firestore-rules.test.js',
      // CI-broken pre-existing tests; pass locally because .env is present
      // but fail in GitHub Actions because env vars aren't injected at build
      // time (src/lib/firebase.js initialises Firebase Auth at module-load).
      // TODO: mock Firebase Auth init in test setup, or inject placeholder
      // Firebase env vars in the workflow.
      'src/components/Expeditions/ExpeditionBarcode.test.js',
      // Seo.test.jsx renders the Seo component, which (on this branch) reads
      // seo_overrides from Firestore — pulls in src/lib/firebase.js and hits
      // the same auth/invalid-api-key failure in CI. Same TODO as above.
      'src/components/seo/Seo.test.jsx',
      // CI-slow: imageOptimisation tests run real sharp pipelines on 100s of
      // variants and time out on the GitHub runner (pass locally in ~30s on
      // faster CPU). TODO: shrink the test fixture or split the long-running
      // cases into a separate command not gated on every PR.
      'src/lib/imageOptimisation.test.js',
    ],
  },
})
