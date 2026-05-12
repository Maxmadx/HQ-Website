import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initGA4, initClarity } from './lib/analytics.js'

// Client-side analytics bootstrap. Both calls are no-ops if their env var
// is unset, so dev environments without VITE_GA_MEASUREMENT_ID /
// VITE_CLARITY_PROJECT_ID stay clean. UK PECR consent gating lives inside
// the init functions (`_canTrack()` in analytics.js) — see docs/analytics-setup.md.
initGA4(import.meta.env.VITE_GA_MEASUREMENT_ID);
initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
