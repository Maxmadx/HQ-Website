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
  test: {
    setupFiles: ['./api/test-setup.js', './src/test-setup.js'],
    exclude: ['**/node_modules/**', '**/.worktrees/**', 'firestore-rules.test.js'],
  },
})
