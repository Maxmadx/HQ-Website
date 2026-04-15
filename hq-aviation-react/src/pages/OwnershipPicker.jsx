import React from 'react';
import { OwnershipBenefitsPicker } from '../components';

/**
 * Ownership Benefits Picker Page
 * Browse 50 alternative designs for the Helicopter Ownership Benefits section
 *
 * Access at: /ownership-picker
 *
 * Features:
 * - 50 unique design variations organized by category
 * - Keyboard navigation (← → to browse, F to favorite, M to minimize)
 * - Favorites system with localStorage persistence
 * - Grid view to see all options at once
 * - Copy favorites to clipboard
 *
 * Categories:
 * - Layouts (9): Cinematic, Timeline, Magazine, Full Bleed, Sticky, Newspaper, Layers, Catalog, Chapters
 * - Cards (11): Masonry, Icons, Photo, Feature, Bento, Polaroid, 3D, Floating, Mosaic, Metro, Hexagon
 * - Interactive (9): Accordion, Comparison, DataViz, Dashboard, Flip, Sidebar, Spotlight, SplitReveal, Tabbed
 * - Testimonial (3): Spotlight, Quote Grid, Chat Conversation
 * - Minimal (5): List, Checklist, Ribbons, Progress, Zen Garden
 * - Hero (2): Hero Impact, Grand Finale
 * - Cinematic (4): Gallery, Film Strip, Radial, Marquee
 * - Themed (7): Blueprint, Museum, Boarding Pass, Watch Dial, Cockpit, Awards, Postcard
 */

const OwnershipPicker = () => {
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <OwnershipBenefitsPicker />
    </div>
  );
};

export default OwnershipPicker;
