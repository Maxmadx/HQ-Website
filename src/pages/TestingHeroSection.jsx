/**
 * /testing-hero-section — isolated animation testing page
 *
 * Sticky switcher bar at top: pick V1 / V2 / V3.
 * Each variant switch remounts the engine (key prop) for a full reset.
 * Press D to toggle the debug panel.
 */
import { useState, useEffect } from 'react';
import { HeroEngine } from '../hero-variants/HeroEngine';
import { V1_CONFIG } from '../hero-variants/v1-current';
import { V2_CONFIG } from '../hero-variants/v2-phase-cfg';
import { V3_CONFIG } from '../hero-variants/v3-explore';
import { V4_CONFIG } from '../hero-variants/v4-wide-sweep';
import { V5_CONFIG } from '../hero-variants/v5-curtain';
import { V6_CONFIG } from '../hero-variants/v6-snap';

const VARIANTS = [
  { id: 'v1', label: 'V1', config: V1_CONFIG },
  { id: 'v2', label: 'V2', config: V2_CONFIG },
  { id: 'v3', label: 'V3', config: V3_CONFIG },
  { id: 'v4', label: 'V4', config: V4_CONFIG },
  { id: 'v5', label: 'V5', config: V5_CONFIG },
  { id: 'v6', label: 'V6', config: V6_CONFIG },
];

export default function TestingHeroSection() {
  const [activeId, setActiveId]     = useState('v1');
  const [debugOpen, setDebugOpen]   = useState(false);

  const variant = VARIANTS.find(v => v.id === activeId);

  const handleSwitch = (id) => {
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // D key toggles debug panel.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'd' || e.key === 'D') setDebugOpen(prev => !prev);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <SwitcherBar
        variants={VARIANTS}
        activeId={activeId}
        onSwitch={handleSwitch}
        debugOpen={debugOpen}
        description={variant.config.description}
      />

      {/*
        key={activeId} forces a full remount on variant change:
          - scroll position resets via handleSwitch
          - all motion values, refs, and state start fresh
          - no bleed between variants
      */}
      <HeroEngine
        key={activeId}
        config={variant.config}
        debugOpen={debugOpen}
      />

      {/* Breathing room below the hero */}
      <div style={{ height: '60vh', background: '#faf9f6' }} />
    </>
  );
}

// ─── Switcher bar ─────────────────────────────────────────────────────────────

function SwitcherBar({ variants, activeId, onSwitch, debugOpen, description }) {
  return (
    <>
      <style>{switcherCSS}</style>
      <div className="hsf-switcher">
        <span className="hsf-switcher__label">VARIANT</span>
        <div className="hsf-switcher__pills">
          {variants.map(v => (
            <button
              key={v.id}
              className={`hsf-switcher__pill ${v.id === activeId ? 'hsf-switcher__pill--active' : ''}`}
              onClick={() => onSwitch(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <span className="hsf-switcher__desc">{description}</span>
        <span className="hsf-switcher__hint">
          <kbd className="hsf-switcher__kbd">D</kbd>
          {debugOpen ? ' debug on' : ' debug'}
        </span>
      </div>
    </>
  );
}

const switcherCSS = `
  .hsf-switcher {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 99999;
    height: 40px;
    background: rgba(8,8,8,0.96);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
  }

  .hsf-switcher__label {
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .hsf-switcher__pills {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
  }

  .hsf-switcher__pill {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 3px 12px;
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .hsf-switcher__pill:hover {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.7);
  }

  .hsf-switcher__pill--active {
    background: #fff;
    color: #111;
    border-color: #fff;
  }

  .hsf-switcher__pill--active:hover {
    background: #f0f0f0;
    color: #111;
  }

  .hsf-switcher__desc {
    color: rgba(255,255,255,0.3);
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .hsf-switcher__hint {
    color: rgba(255,255,255,0.2);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .hsf-switcher__kbd {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 3px;
    padding: 1px 5px;
    font-family: inherit;
    font-size: 0.58rem;
  }

`;
