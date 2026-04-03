/**
 * HQ AVIATION - HERO VARIATION TEST PAGE
 * Browse and compare 20 different hero styles
 */

import { useState, useCallback } from 'react';
import Picker from '../components/Picker';
import { heroVariations } from '../components/HeroVariations';

// Import hero variation styles
import '../assets/css/hero-variations.css';

function HeroTest() {
  const [currentHero, setCurrentHero] = useState(heroVariations[0]);

  // Organize variations into categories for the picker
  const sections = {
    architectural: heroVariations.filter(h => h.category === 'Architectural'),
    cinematic: heroVariations.filter(h => h.category === 'Cinematic'),
    glassmorphism: heroVariations.filter(h => h.category === 'Glassmorphism'),
    editorial: heroVariations.filter(h => h.category === 'Editorial'),
    immersive: heroVariations.filter(h => h.category === 'Immersive'),
    bento: heroVariations.filter(h => h.category === 'Bento'),
    kinetic: heroVariations.filter(h => h.category === 'Kinetic'),
    minimal: heroVariations.filter(h => h.category === 'Minimal'),
    dark: heroVariations.filter(h => h.category === 'Dark'),
    split: heroVariations.filter(h => h.category === 'Split'),
    interactive: heroVariations.filter(h => h.category === 'Interactive'),
    effect: heroVariations.filter(h => h.category === 'Effect'),
    premium: heroVariations.filter(h => h.category === 'Premium'),
    brandIdentity: heroVariations.filter(h => h.category === 'Brand Identity'),
    luxuryMinimal: heroVariations.filter(h => h.category === 'Luxury Minimal'),
    brandSystems: heroVariations.filter(h => h.category === 'Brand Systems'),
  };

  // Filter out empty sections
  const filteredSections = Object.fromEntries(
    Object.entries(sections).filter(([_, items]) => items.length > 0)
  );

  // Tab configuration with colors
  const tabs = [
    { key: 'architectural', label: 'Architectural', color: 'default' },
    { key: 'cinematic', label: 'Cinematic', color: 'purple' },
    { key: 'glassmorphism', label: 'Glass', color: 'blue' },
    { key: 'editorial', label: 'Editorial', color: 'default' },
    { key: 'immersive', label: 'Immersive', color: 'green' },
    { key: 'bento', label: 'Bento', color: 'orange' },
    { key: 'kinetic', label: 'Kinetic', color: 'purple' },
    { key: 'minimal', label: 'Minimal', color: 'default' },
    { key: 'dark', label: 'Dark', color: 'default' },
    { key: 'split', label: 'Split', color: 'blue' },
    { key: 'interactive', label: 'Interactive', color: 'green' },
    { key: 'effect', label: 'Effect', color: 'orange' },
    { key: 'premium', label: 'Premium', color: 'purple' },
    { key: 'brandIdentity', label: 'Brand ID', color: 'green' },
    { key: 'luxuryMinimal', label: 'Luxury', color: 'default' },
    { key: 'brandSystems', label: 'Brand Systems', color: 'purple' },
  ].filter(tab => filteredSections[tab.key]);

  const handleItemSelect = useCallback((item) => {
    setCurrentHero(item);
  }, []);

  // Get the current hero component
  const CurrentHeroComponent = currentHero?.Component;

  return (
    <div className="hero-test-page">
      {/* Render the current hero variation */}
      {CurrentHeroComponent && <CurrentHeroComponent />}

      {/* Picker Component */}
      <Picker
        sections={filteredSections}
        tabs={tabs}
        storageKey="hq-hero-picker-favorites"
        title="Hero Variations"
        onItemSelect={handleItemSelect}
        initialTab="architectural"
      />

      {/* Info overlay */}
      <div className="hero-test-info">
        <div className="hero-test-info__badge">
          {currentHero?.category}
        </div>
        <div className="hero-test-info__id">
          {currentHero?.id}
        </div>
      </div>

      <style>{`
        .hero-test-page {
          position: relative;
          min-height: 100vh;
        }

        .hero-test-info {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .hero-test-info__badge {
          background: rgba(224, 74, 47, 0.9);
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-test-info__id {
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 11px;
        }

        /* Hide header/footer on this test page */
        .hq-header,
        .hq-footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default HeroTest;
