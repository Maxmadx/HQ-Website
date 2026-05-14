import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry, Sentry } from './lib/sentry.js'
import App from './App.jsx'
import { initGA4, initClarity } from './lib/analytics.js'

// Client-side analytics bootstrap. src/lib/analytics.js is the canonical
// analytics module (GA4 + Microsoft Clarity + consent gating via _canTrack()).
// Both calls are no-ops if their env var is unset, so dev environments without
// VITE_GA_MEASUREMENT_ID / VITE_CLARITY_PROJECT_ID stay clean.
// NOTE: src/lib/ga.js and src/lib/clarity.js are superseded by analytics.js —
// ga.js is still imported by App.jsx's RouteTracker for trackPageView; both
// are flagged for follow-up consolidation. See docs/analytics-setup.md.
initGA4(import.meta.env.VITE_GA_MEASUREMENT_ID);
initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);
initSentry();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page. If the problem persists, contact support.</p>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
