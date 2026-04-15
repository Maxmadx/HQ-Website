/**
 * useCmsTextHighlight — reads ?text-highlight=<sectionId> from the URL and
 * applies a pulsing indigo border to the matching [data-cms-text-section] element.
 *
 * Mirror of the image-highlight logic in Experimentation.jsx, but for text sections.
 * Color: indigo (#6366f1) to distinguish from image highlights (amber).
 *
 * Usage: call this hook once inside any page component.
 */

import { useEffect } from 'react';

export function useCmsTextHighlight() {
  useEffect(() => {
    const highlight = new URLSearchParams(window.location.search).get('text-highlight');
    if (!highlight) return;

    // Inject pulse keyframe once
    if (!document.getElementById('cms-text-hl-style')) {
      const s = document.createElement('style');
      s.id = 'cms-text-hl-style';
      s.textContent =
        '@keyframes cmsTextHlPulse{0%,100%{box-shadow:0 0 0 3px #6366f1,0 0 30px rgba(99,102,241,0.35)}50%{box-shadow:0 0 0 3px #6366f1,0 0 8px rgba(99,102,241,0.1)}}';
      document.head.appendChild(s);
    }

    // Floating label
    const label = document.createElement('div');
    label.id = 'cms-text-hl-label';
    Object.assign(label.style, {
      position: 'fixed', top: '80px', right: '24px', zIndex: '99999',
      background: '#6366f1', color: '#fff',
      fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '700',
      padding: '5px 12px', borderRadius: '6px', pointerEvents: 'none',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
    });
    label.textContent = `Text: ${highlight}`;
    document.body.appendChild(label);

    // Apply highlight
    const el = document.querySelector(`[data-cms-text-section="${highlight}"]`);
    if (el) {
      el.style.outline = '3px solid #6366f1';
      el.style.outlineOffset = '4px';
      el.style.animation = 'cmsTextHlPulse 1.8s ease-in-out infinite';
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
    }

    return () => { document.getElementById('cms-text-hl-label')?.remove(); };
  }, []);
}
