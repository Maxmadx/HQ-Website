/**
 * useCmsHighlight — reads ?highlight=<sectionId> from the URL and
 * scrolls to + outlines the matching [data-cms-section] element.
 * Used by every page that has CMS-managed image sections.
 */
import { useEffect } from 'react';

export function useCmsHighlight() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('highlight');
    if (!id) return;
    const el = document.querySelector(`[data-cms-section="${id}"]`);
    if (!el) return;
    el.style.outline = '3px solid #f59e0b';
    el.style.outlineOffset = '4px';
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  }, []);
}
