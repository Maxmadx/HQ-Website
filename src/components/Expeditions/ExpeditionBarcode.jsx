/**
 * ExpeditionBarcode
 *
 * Modern barcode/scanner style display of expedition destinations.
 * Each destination has a unique generated barcode pattern.
 * Clicking a destination expands a gallery section below.
 */

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { usePageImages } from '../../hooks/usePageImages';

const defaultDestinations = [
  {
    id: 'arctic',
    name: 'Arctic',
    distance: '2,500 nm',
    year: '2022',
    image: '/assets/images/expeditions/north-pole.jpg',
    gallery: [
      '/assets/images/expeditions/north-pole.jpg',
      '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      '/assets/images/expeditions/antartica.jpg',
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    ],
    description: 'Journey to the top of the world, where ice meets sky in an endless expanse of white.'
  },
  {
    id: 'iceland',
    name: 'Iceland',
    distance: '1,200 nm',
    year: '2019',
    image: '/assets/images/expeditions/channel.jpg',
    gallery: [
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
      '/assets/images/expeditions/antartica.jpg',
    ],
    description: 'Land of fire and ice: volcanic landscapes, glaciers, and the Northern Lights.'
  },
  {
    id: 'morocco',
    name: 'Morocco',
    distance: '1,100 nm',
    year: '2021',
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    gallery: [
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/north-pole.jpg',
      '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
    ],
    description: 'From the Atlas Mountains to the Sahara Desert, a journey through ancient landscapes.'
  },
  {
    id: 'norway',
    name: 'Norway',
    distance: '650 nm',
    year: '2018',
    image: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
    gallery: [
      '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      '/assets/images/expeditions/north-pole.jpg',
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/antartica.jpg',
    ],
    description: 'Navigate the dramatic fjords and witness the midnight sun over Scandinavia.'
  },
  {
    id: 'alps',
    name: 'Alps',
    distance: '500 nm',
    year: '2020',
    image: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
    gallery: [
      '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
    ],
    description: 'Soar above snow-capped peaks and pristine alpine valleys.'
  },
  {
    id: 'greenland',
    name: 'Greenland',
    distance: '2,100 nm',
    year: '2023',
    image: '/assets/images/expeditions/antartica.jpg',
    gallery: [
      '/assets/images/expeditions/antartica.jpg',
      '/assets/images/expeditions/north-pole.jpg',
      '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
    ],
    description: 'Explore the world\'s largest island: icebergs, remote settlements, and untouched wilderness.'
  },
  {
    id: 'bahamas',
    name: 'Bahamas',
    distance: '4,200 nm',
    year: '2025',
    image: '/assets/images/expeditions/channel.jpg',
    gallery: [
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
      '/assets/images/expeditions/antartica.jpg',
    ],
    description: 'Island hop across turquoise waters and pristine white sand beaches.'
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    distance: '5,100 nm',
    year: '2026',
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    gallery: [
      '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      '/assets/images/expeditions/channel.jpg',
      '/assets/images/expeditions/north-pole.jpg',
      '/assets/images/expeditions/antartica.jpg',
    ],
    description: 'Rainforests, volcanoes, and coastlines, pure tropical adventure.'
  },
];

// Generate deterministic barcode pattern from string
export function generateBarcode(str, length = 30) {
  const bars = [];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < length; i++) {
    const val = (hash >> (i % 16)) & 1;
    bars.push(val);
  }
  return bars;
}

function ExpeditionBarcode({
  destinations = defaultDestinations,
  onSelect,
}) {
  const ref = useRef(null);
  const galleryRef = useRef(null);
  const gridRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedId, setSelectedId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isNarrow, setIsNarrow] = useState(
    () => window.matchMedia('(max-width: 450px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 450px)');
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const pageImages = usePageImages('home');
  const cmsDestinations = useMemo(() => {
    const thumbs = pageImages['home-exped-barcode-thumbs'] ?? [];
    return destinations.map((d, i) => {
      const cmsGallery = pageImages[`home-exped-gallery-${d.id}`];
      return {
        ...d,
        image: thumbs[i]?.url ?? d.image,
        gallery: cmsGallery?.length > 0 ? cmsGallery.map(img => img.url) : d.gallery,
      };
    });
  }, [destinations, pageImages]);

  const scrollBarcode = useCallback((direction) => {
    const el = scrollWrapperRef.current;
    if (!el) return;
    const scrollAmount = el.offsetWidth * 0.6;
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }, []);

  const barcodes = useMemo(() => {
    const barCount = isNarrow ? 15 : 25;
    return cmsDestinations.map(d => ({
      ...d,
      code: generateBarcode(d.id + d.name, barCount)
    }));
  }, [cmsDestinations, isNarrow]);

  const selectedDestination = barcodes.find(d => d.id === selectedId);

  const handleSelect = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
      onSelect?.(null);
    } else {
      setSelectedId(id);
      onSelect?.(id);
      // Scroll down to show first barcode row (never scroll up)
      setTimeout(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const firstItem = grid.querySelector('.exp-barcode__item');
        if (!firstItem) return;
        const rect = firstItem.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        const targetY = window.scrollY + rect.top - (isMobile ? 160 : 120);
        // Only scroll down, never up
        if (targetY > window.scrollY) {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section className="exp-barcode" ref={ref}>
      <div className="exp-barcode__container">
        {/* Grid wrapper with compass background */}
        <div className="exp-barcode__scroll-row">
          <button className="exp-barcode__scroll-chevron exp-barcode__scroll-chevron--left" onClick={() => scrollBarcode(-1)} aria-label="Scroll left">&#8249;</button>
          <div className="exp-barcode__grid-wrapper" ref={scrollWrapperRef}>
            <div className="exp-barcode__grid" ref={gridRef}>
            {/* Center map pin */}
            <div className="exp-barcode__pin">
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#1a1a1a"/>
                <circle cx="14" cy="14" r="5.5" fill="#fff"/>
              </svg>
            </div>
            {barcodes.map((item, i) => (
              <motion.div
                key={item.id}
                className={`exp-barcode__item ${selectedId === item.id ? 'exp-barcode__item--active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <div className="exp-barcode__hover-overlay">
                  <span className="exp-barcode__hover-text">Click to See Trip</span>
                </div>
                <div className="exp-barcode__top">
                  <div className="exp-barcode__thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="exp-barcode__right">
                    <span className="exp-barcode__dest">{item.name}</span>
                    <div className="exp-barcode__bars">
                      {item.code.map((bar, j) => (
                        <div
                          key={j}
                          className="exp-barcode__bar"
                          style={{
                            width: bar ? (((j % 3) + 1) * 1.2) : 1,
                            background: bar ? '#1a1a1a' : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
          <button className="exp-barcode__scroll-chevron exp-barcode__scroll-chevron--right" onClick={() => scrollBarcode(1)} aria-label="Scroll right">&#8250;</button>
        </div>

        {/* Expandable Gallery Section */}
        <AnimatePresence>
          {selectedDestination && (
            <motion.div
              ref={galleryRef}
              className="exp-barcode__gallery"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="exp-barcode__gallery-inner">
                {/* Gallery Header */}
                <div className="exp-barcode__gallery-header">
                  <div className="exp-barcode__gallery-title-wrap">
                    <span className="exp-barcode__gallery-pre">Expedition Gallery</span>
                    <h3 className="exp-barcode__gallery-title">{selectedDestination.name}</h3>
                  </div>
                  <div className="exp-barcode__gallery-meta">
                    <span className="exp-barcode__gallery-distance">{selectedDestination.distance}</span>
                    <span className="exp-barcode__gallery-divider">|</span>
                    <span className="exp-barcode__gallery-year">{selectedDestination.year}</span>
                  </div>
                  <button
                    className="exp-barcode__gallery-close"
                    onClick={() => { setSelectedId(null); onSelect?.(null); }}
                    aria-label="Close gallery"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="exp-barcode__gallery-desc">{selectedDestination.description}</p>

                {/* Image Grid */}
                <div className="exp-barcode__gallery-grid">
                  {selectedDestination.gallery.map((img, idx) => (
                    <motion.div
                      key={idx}
                      className="exp-barcode__gallery-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      onClick={() => setLightboxImage(img)}
                    >
                      <img src={img} alt={`${selectedDestination.name} - ${idx + 1}`} />
                      <div className="exp-barcode__gallery-item-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                      <span className="exp-barcode__gallery-item-num">{String(idx + 1).padStart(2, '0')}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              className="exp-barcode__lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
            >
              <motion.img
                src={lightboxImage}
                alt="Gallery preview"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
              <button className="exp-barcode__lightbox-close">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .exp-barcode {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: transparent;
          padding: 12px 2rem 6px;
          position: relative;
          overflow-x: hidden;
          overflow-y: visible;
        }

        .exp-barcode__compass-bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .exp-barcode__compass-svg {
          width: auto;
          height: 100%;
          max-height: 100%;
          aspect-ratio: 1;
        }

        .exp-barcode__compass-dir {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          fill: #1a1a1a;
          letter-spacing: 0.1em;
        }

        .exp-barcode__compass-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 700;
          fill: #1a1a1a;
          letter-spacing: 0.2em;
        }

        .exp-barcode__container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .exp-barcode__grid-wrapper {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .exp-barcode__grid {
          display: grid;
          grid-template-columns: 200px 200px 2rem 200px 200px;
          justify-content: center;
          gap: 1rem;
          align-items: start;
          position: relative;
          z-index: 2;
        }

        .exp-barcode__pin {
          grid-column: 3;
          grid-row: 1 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          opacity: 0.25;
        }

        .exp-barcode__item:nth-child(2) { grid-column: 1; }
        .exp-barcode__item:nth-child(3) { grid-column: 2; }
        .exp-barcode__item:nth-child(4) { grid-column: 4; }
        .exp-barcode__item:nth-child(5) { grid-column: 5; }
        .exp-barcode__item:nth-child(6) { grid-column: 1; grid-row: 2; }
        .exp-barcode__item:nth-child(7) { grid-column: 2; grid-row: 2; }
        .exp-barcode__item:nth-child(8) { grid-column: 4; grid-row: 2; }
        .exp-barcode__item:nth-child(9) { grid-column: 5; grid-row: 2; }

        .exp-barcode__item {
          padding: 0.4rem 1rem;
          min-height: 60px;
          display: flex;
          align-items: center;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.95);
          cursor: pointer;
          backdrop-filter: blur(4px);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .exp-barcode__item:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .exp-barcode__hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 8px;
          z-index: 3;
        }
        .exp-barcode__item:hover .exp-barcode__hover-overlay {
          opacity: 1;
        }
        .exp-barcode__hover-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          padding: 0.4rem 1rem;
          margin: 0 0.75rem;
          border: 1px solid rgba(0,0,0,0.3);
          border-radius: 4px;
        }

        .exp-barcode__item--active {
          border-color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .exp-barcode__item--active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #1a1a1a;
        }

        .exp-barcode__top {
          display: flex;
          gap: 0.5rem;
          align-items: stretch;
          width: 100%;
        }
        .exp-barcode__right {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .exp-barcode__thumb {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 4px;
          overflow: hidden;
        }

        .exp-barcode__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .exp-barcode__bars {
          display: flex;
          gap: 1px;
          flex: 0 1 20px;
          min-width: 0;
          align-items: stretch;
          padding: 2px 0.35rem;
          background: #fafafa;
          border-radius: 3px;
          overflow: hidden;
        }

        .exp-barcode__bar {
          height: 100%;
          border-radius: 1px;
        }

        .exp-barcode__dest {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #1a1a1a;
          text-align: left;
          padding-left: 0.35rem;
          margin-bottom: 0.25rem;
          white-space: nowrap;
        }

        .exp-barcode__meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #888;
        }

        .exp-barcode__connector {
          position: absolute;
          height: 2px;
          background: #3b82f6;
          z-index: 1;
          pointer-events: none;
        }

        .exp-barcode__connector--top-left { top: 50px; left: 21%; width: calc(23% - 1rem); transform-origin: left center; }
        .exp-barcode__connector--top-right { top: 50px; right: 21%; width: calc(23% - 1rem); transform-origin: right center; }
        .exp-barcode__connector--bottom-left { bottom: 50px; left: 21%; width: calc(23% - 1rem); transform-origin: left center; }
        .exp-barcode__connector--bottom-right { bottom: 50px; right: 21%; width: calc(23% - 1rem); transform-origin: right center; }

        /* Gallery Section */
        .exp-barcode__gallery {
          overflow: hidden;
          margin-top: 2rem;
        }

        .exp-barcode__gallery-inner {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .exp-barcode__gallery-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .exp-barcode__gallery-title-wrap {
          flex: 1;
          text-align: left;
        }

        .exp-barcode__gallery-pre {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .exp-barcode__gallery-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .exp-barcode__gallery-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #666;
        }

        .exp-barcode__gallery-divider {
          color: #ccc;
        }

        .exp-barcode__gallery-close {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e8e6e2;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.2s ease;
        }

        .exp-barcode__gallery-close:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .exp-barcode__gallery-desc {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          margin: 0 0 2rem 0;
          max-width: 600px;
        }

        .exp-barcode__gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .exp-barcode__gallery-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background: #e8e6e2;
        }

        .exp-barcode__gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .exp-barcode__gallery-item:hover img {
          transform: scale(1.05);
        }

        .exp-barcode__gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 26, 26, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .exp-barcode__gallery-item:hover .exp-barcode__gallery-item-overlay {
          background: rgba(26, 26, 26, 0.4);
          opacity: 1;
        }

        .exp-barcode__gallery-item-num {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #fff;
          background: rgba(26, 26, 26, 0.7);
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          letter-spacing: 0.1em;
        }

        /* Lightbox */
        .exp-barcode__lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          cursor: pointer;
        }

        .exp-barcode__lightbox img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .exp-barcode__lightbox-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .exp-barcode__lightbox-close:hover {
          opacity: 1;
        }

        /* Scroll row + chevrons — hidden on desktop */
        .exp-barcode__scroll-row {
          display: contents;
        }
        .exp-barcode__scroll-chevron {
          display: none;
        }

        @media (max-width: 900px) {
          .exp-barcode__scroll-row {
            display: flex;
            align-items: center;
            gap: 0;
          }
          .exp-barcode__scroll-chevron {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border: 1px solid #ccc8c1;
            background: transparent;
            color: #999;
            font-size: 1.1rem;
            font-family: 'Share Tech Mono', monospace;
            cursor: pointer;
            flex-shrink: 0;
            padding: 0;
            line-height: 1;
            transition: all 0.2s;
          }
          .exp-barcode__scroll-chevron--left {
            margin-right: 6px;
          }
          .exp-barcode__scroll-chevron--right {
            margin-left: 6px;
          }
          .exp-barcode__scroll-chevron:active {
            color: #1a1a1a;
            border-color: #1a1a1a;
          }
          .exp-barcode__grid-wrapper {
            flex: 1;
            min-width: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1rem;
            scrollbar-width: none;
          }
          .exp-barcode__grid-wrapper::-webkit-scrollbar {
            display: none;
          }
          .exp-barcode__grid {
            display: grid;
            grid-template-columns: repeat(4, calc(50% - 0.5rem));
            grid-template-rows: auto auto;
            grid-auto-flow: column;
            justify-content: start;
            width: auto;
          }
          .exp-barcode__grid .exp-barcode__pin {
            display: none;
          }
          .exp-barcode__grid .exp-barcode__item {
            grid-column: auto !important;
            grid-row: auto !important;
          }
          .exp-barcode__compass-bg {
            display: none;
          }
          .exp-barcode__connector {
            display: none;
          }
          .exp-barcode__gallery-pre {
            display: none;
          }
          .exp-barcode__gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .exp-barcode__gallery-header {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }

        @media (max-width: 500px) {
          .exp-barcode {
            padding: 2rem 0.75rem;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
          }
          .exp-barcode__gallery-inner {
            padding: 1.5rem;
          }
          .exp-barcode__gallery-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .exp-barcode__gallery-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 380px) {
          /* Grid wrapper fills full width; chevrons wrap to a centred second row */
          .exp-barcode__scroll-row {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.25rem;
          }

          .exp-barcode__grid-wrapper {
            order: 1;
            flex: 0 0 100%;
            min-width: 0;
          }

          .exp-barcode__scroll-chevron--left {
            order: 2;
            margin-right: 0;
          }

          .exp-barcode__scroll-chevron--right {
            order: 3;
            margin-left: 0;
          }

          /* Tighten the card grid column gap and fix column widths to match */
          .exp-barcode__grid {
            gap: 0.5rem;
            grid-template-columns: repeat(4, calc(50% - 0.25rem));
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionBarcode;
