import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry, Sentry } from './lib/sentry.js'
import { initGA } from './lib/ga.js'
import { initClarity } from './lib/clarity.js'
import App from './App.jsx'
import { initGA4, initClarity } from './lib/analytics.js'

// Client-side analytics bootstrap. Both calls are no-ops if their env var
// is unset, so dev environments without VITE_GA_MEASUREMENT_ID /
// VITE_CLARITY_PROJECT_ID stay clean. UK PECR consent gating lives inside
// the init functions (`_canTrack()` in analytics.js) — see docs/analytics-setup.md.
initGA4(import.meta.env.VITE_GA_MEASUREMENT_ID);
initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);

initSentry();
initGA();
initClarity();

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
