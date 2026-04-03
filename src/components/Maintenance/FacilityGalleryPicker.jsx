/**
 * FACILITY GALLERY PICKER
 *
 * Refined gallery variants for HQ Aviation maintenance facility.
 * Luxury minimal aviation aesthetic.
 *
 * Brand Identity:
 * - Typography: Space Grotesk (headlines), Share Tech Mono (technical)
 * - Colors: #1a1a1a (charcoal), #faf9f6 (warm white), #f0efec (contrast)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const facilityImages = [
  { id: 1, src: '/assets/images/facility/hangar-main.jpg', alt: 'Main Hangar', caption: 'Primary maintenance hangar' },
  { id: 2, src: '/assets/images/facility/workshop.jpg', alt: 'Workshop', caption: 'Precision engineering workshop' },
  { id: 3, src: '/assets/images/facility/engine-bay.jpg', alt: 'Engine Bay', caption: 'Turbine overhaul facility' },
  { id: 4, src: '/assets/images/facility/avionics-lab.jpg', alt: 'Avionics Lab', caption: 'Avionics testing suite' },
  { id: 5, src: '/assets/images/facility/paint-booth.jpg', alt: 'Paint Booth', caption: 'Climate-controlled paint booth' },
  { id: 6, src: '/assets/images/facility/parts-storage.jpg', alt: 'Parts Storage', caption: 'OEM parts inventory' },
];

// ============================================
// VARIANT 1: CLEAN GRID
// Simple, elegant 3-column grid
// ============================================
const CleanGrid = ({ images }) => (
  <section className="fgal fgal-clean">
    <div className="fgal-clean__inner">
      <div className="fgal-clean__header">
        <span className="fgal-clean__label">Our Facility</span>
        <h2 className="fgal-clean__title">Purpose-Built for Excellence</h2>
      </div>
      <div className="fgal-clean__grid">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-clean__item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="fgal-clean__img">
              <img src={img.src} alt={img.alt} />
            </div>
            <div className="fgal-clean__meta">
              <span className="fgal-clean__name">{img.alt}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-clean {
        background: #faf9f6;
        padding: 6rem 2rem;
      }
      .fgal-clean__inner {
        max-width: 1200px;
        margin: 0 auto;
      }
      .fgal-clean__header {
        text-align: center;
        margin-bottom: 4rem;
      }
      .fgal-clean__label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #888;
        display: block;
        margin-bottom: 1rem;
      }
      .fgal-clean__title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
      .fgal-clean__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      .fgal-clean__item {
        cursor: pointer;
      }
      .fgal-clean__img {
        aspect-ratio: 4/3;
        overflow: hidden;
        background: #e8e6e2;
      }
      .fgal-clean__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      .fgal-clean__item:hover .fgal-clean__img img {
        transform: scale(1.05);
      }
      .fgal-clean__meta {
        padding: 1rem 0;
      }
      .fgal-clean__name {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        color: #1a1a1a;
      }
      @media (max-width: 900px) {
        .fgal-clean__grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      }
      @media (max-width: 600px) {
        .fgal-clean__grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 2: NUMBERED MINIMAL
// Numbered items with clean typography
// ============================================
const NumberedMinimal = ({ images }) => (
  <section className="fgal fgal-numbered">
    <div className="fgal-numbered__inner">
      <div className="fgal-numbered__header">
        <span className="fgal-numbered__label">Facility</span>
        <h2 className="fgal-numbered__title">Where Precision Meets Craft</h2>
      </div>
      <div className="fgal-numbered__grid">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-numbered__item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <span className="fgal-numbered__num">{String(i + 1).padStart(2, '0')}</span>
            <div className="fgal-numbered__img">
              <img src={img.src} alt={img.alt} />
            </div>
            <div className="fgal-numbered__info">
              <h3>{img.alt}</h3>
              <p>{img.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-numbered {
        background: #fff;
        padding: 6rem 2rem;
      }
      .fgal-numbered__inner {
        max-width: 1200px;
        margin: 0 auto;
      }
      .fgal-numbered__header {
        margin-bottom: 4rem;
      }
      .fgal-numbered__label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #999;
      }
      .fgal-numbered__title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.5rem, 3vw, 2rem);
        font-weight: 600;
        color: #1a1a1a;
        margin: 0.5rem 0 0;
      }
      .fgal-numbered__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem 2rem;
      }
      .fgal-numbered__item {
        position: relative;
      }
      .fgal-numbered__num {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem;
        color: #ccc;
        display: block;
        margin-bottom: 0.75rem;
      }
      .fgal-numbered__img {
        aspect-ratio: 3/2;
        overflow: hidden;
        background: #f0efec;
        margin-bottom: 1rem;
      }
      .fgal-numbered__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(20%);
        transition: all 0.5s ease;
      }
      .fgal-numbered__item:hover .fgal-numbered__img img {
        filter: grayscale(0%);
        transform: scale(1.03);
      }
      .fgal-numbered__info h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.25rem;
        color: #1a1a1a;
      }
      .fgal-numbered__info p {
        font-size: 0.85rem;
        color: #666;
        margin: 0;
      }
      @media (max-width: 900px) {
        .fgal-numbered__grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 600px) {
        .fgal-numbered__grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 3: HERO + GRID
// Large hero image with supporting grid
// ============================================
const HeroGrid = ({ images }) => (
  <section className="fgal fgal-hero">
    <div className="fgal-hero__inner">
      <motion.div
        className="fgal-hero__main"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img src={images[0]?.src} alt={images[0]?.alt} />
        <div className="fgal-hero__overlay">
          <span className="fgal-hero__label">Our Facility</span>
          <h2>Denham Aerodrome</h2>
          <p>Home to Robinson Helicopter's UK service centre since 1982</p>
        </div>
      </motion.div>
      <div className="fgal-hero__grid">
        {images.slice(1, 5).map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-hero__item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <img src={img.src} alt={img.alt} />
            <span>{img.alt}</span>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-hero {
        background: #1a1a1a;
        padding: 4rem 2rem;
      }
      .fgal-hero__inner {
        max-width: 1200px;
        margin: 0 auto;
      }
      .fgal-hero__main {
        position: relative;
        aspect-ratio: 21/9;
        overflow: hidden;
        margin-bottom: 1.5rem;
      }
      .fgal-hero__main img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .fgal-hero__overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 3rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        color: #fff;
      }
      .fgal-hero__label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        opacity: 0.6;
      }
      .fgal-hero__overlay h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 600;
        margin: 0.5rem 0;
      }
      .fgal-hero__overlay p {
        font-size: 1rem;
        opacity: 0.8;
        margin: 0;
        max-width: 400px;
      }
      .fgal-hero__grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
      .fgal-hero__item {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
      }
      .fgal-hero__item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .fgal-hero__item:hover img {
        transform: scale(1.05);
      }
      .fgal-hero__item span {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.8rem;
        color: #fff;
      }
      @media (max-width: 900px) {
        .fgal-hero__grid { grid-template-columns: repeat(2, 1fr); }
        .fgal-hero__main { aspect-ratio: 16/9; }
      }
      @media (max-width: 600px) {
        .fgal-hero__grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 4: ASYMMETRIC MASONRY
// Editorial-style asymmetric layout
// ============================================
const AsymmetricMasonry = ({ images }) => (
  <section className="fgal fgal-asym">
    <div className="fgal-asym__inner">
      <div className="fgal-asym__header">
        <h2>Our Facility</h2>
        <p>State-of-the-art maintenance centre at Denham Aerodrome</p>
      </div>
      <div className="fgal-asym__grid">
        <motion.div
          className="fgal-asym__large"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <img src={images[0]?.src} alt={images[0]?.alt} />
          <div className="fgal-asym__caption">
            <span>01</span>
            <h3>{images[0]?.alt}</h3>
          </div>
        </motion.div>
        <div className="fgal-asym__stack">
          {images.slice(1, 3).map((img, i) => (
            <motion.div
              key={img.id}
              className="fgal-asym__small"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <img src={img.src} alt={img.alt} />
              <div className="fgal-asym__caption">
                <span>{String(i + 2).padStart(2, '0')}</span>
                <h3>{img.alt}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="fgal-asym__row">
        {images.slice(3, 6).map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-asym__item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <img src={img.src} alt={img.alt} />
            <div className="fgal-asym__caption">
              <span>{String(i + 4).padStart(2, '0')}</span>
              <h3>{img.alt}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-asym {
        background: #f0efec;
        padding: 6rem 2rem;
      }
      .fgal-asym__inner {
        max-width: 1200px;
        margin: 0 auto;
      }
      .fgal-asym__header {
        margin-bottom: 3rem;
      }
      .fgal-asym__header h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 0.5rem;
      }
      .fgal-asym__header p {
        font-size: 1rem;
        color: #666;
        margin: 0;
      }
      .fgal-asym__grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .fgal-asym__large {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
      }
      .fgal-asym__stack {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .fgal-asym__small {
        position: relative;
        flex: 1;
        overflow: hidden;
      }
      .fgal-asym__row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
      .fgal-asym__item {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
      }
      .fgal-asym__large img,
      .fgal-asym__small img,
      .fgal-asym__item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      .fgal-asym__large:hover img,
      .fgal-asym__small:hover img,
      .fgal-asym__item:hover img {
        transform: scale(1.05);
      }
      .fgal-asym__caption {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1.5rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        width: 100%;
      }
      .fgal-asym__caption span {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem;
        color: rgba(255,255,255,0.5);
        display: block;
        margin-bottom: 0.25rem;
      }
      .fgal-asym__caption h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        color: #fff;
        margin: 0;
      }
      @media (max-width: 900px) {
        .fgal-asym__grid { grid-template-columns: 1fr; }
        .fgal-asym__row { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 600px) {
        .fgal-asym__row { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 5: HORIZONTAL SCROLL
// Elegant horizontal scrolling gallery
// ============================================
const HorizontalScroll = ({ images }) => (
  <section className="fgal fgal-scroll">
    <div className="fgal-scroll__header">
      <div className="fgal-scroll__text">
        <span className="fgal-scroll__label">Gallery</span>
        <h2>Inside Our Facility</h2>
      </div>
      <p>Scroll to explore our state-of-the-art maintenance centre</p>
    </div>
    <div className="fgal-scroll__track">
      <div className="fgal-scroll__slides">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-scroll__slide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="fgal-scroll__img">
              <img src={img.src} alt={img.alt} />
            </div>
            <div className="fgal-scroll__meta">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{img.alt}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-scroll {
        background: #faf9f6;
        padding: 5rem 0;
      }
      .fgal-scroll__header {
        max-width: 1200px;
        margin: 0 auto 3rem;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .fgal-scroll__label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #999;
      }
      .fgal-scroll__header h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(1.5rem, 3vw, 2rem);
        font-weight: 600;
        color: #1a1a1a;
        margin: 0.5rem 0 0;
      }
      .fgal-scroll__header p {
        font-size: 0.9rem;
        color: #888;
        margin: 0;
      }
      .fgal-scroll__track {
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .fgal-scroll__track::-webkit-scrollbar {
        display: none;
      }
      .fgal-scroll__slides {
        display: flex;
        gap: 1.5rem;
        padding: 0 2rem;
        width: max-content;
      }
      .fgal-scroll__slide {
        width: 400px;
        flex-shrink: 0;
      }
      .fgal-scroll__img {
        aspect-ratio: 3/2;
        overflow: hidden;
        background: #e8e6e2;
      }
      .fgal-scroll__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .fgal-scroll__slide:hover .fgal-scroll__img img {
        transform: scale(1.05);
      }
      .fgal-scroll__meta {
        padding: 1rem 0;
        display: flex;
        align-items: baseline;
        gap: 1rem;
      }
      .fgal-scroll__meta span {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem;
        color: #ccc;
      }
      .fgal-scroll__meta h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        color: #1a1a1a;
        margin: 0;
      }
      @media (max-width: 600px) {
        .fgal-scroll__header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        .fgal-scroll__slide { width: 300px; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 6: SPLIT SHOWCASE
// Large image with list navigation
// ============================================
const SplitShowcase = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="fgal fgal-split">
      <div className="fgal-split__inner">
        <div className="fgal-split__image">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]?.src}
              alt={images[activeIndex]?.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </div>
        <div className="fgal-split__nav">
          <div className="fgal-split__header">
            <span>Our Facility</span>
            <h2>Explore the Centre</h2>
          </div>
          <div className="fgal-split__list">
            {images.map((img, i) => (
              <button
                key={img.id}
                className={`fgal-split__item ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <span className="fgal-split__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fgal-split__name">{img.alt}</span>
                <span className="fgal-split__arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .fgal-split {
          background: #1a1a1a;
        }
        .fgal-split__inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          min-height: 600px;
        }
        .fgal-split__image {
          position: relative;
          overflow: hidden;
        }
        .fgal-split__image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fgal-split__nav {
          padding: 4rem 3rem;
          display: flex;
          flex-direction: column;
        }
        .fgal-split__header {
          margin-bottom: 3rem;
        }
        .fgal-split__header span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .fgal-split__header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #fff;
          margin: 0.5rem 0 0;
        }
        .fgal-split__list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .fgal-split__item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        .fgal-split__item:hover,
        .fgal-split__item.active {
          padding-left: 1rem;
        }
        .fgal-split__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
          width: 24px;
        }
        .fgal-split__name {
          flex: 1;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.6);
          transition: color 0.3s ease;
        }
        .fgal-split__item:hover .fgal-split__name,
        .fgal-split__item.active .fgal-split__name {
          color: #fff;
        }
        .fgal-split__arrow {
          font-size: 1rem;
          color: rgba(255,255,255,0.3);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }
        .fgal-split__item:hover .fgal-split__arrow,
        .fgal-split__item.active .fgal-split__arrow {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 900px) {
          .fgal-split__inner {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .fgal-split__image {
            aspect-ratio: 16/9;
          }
        }
      `}</style>
    </section>
  );
};

// ============================================
// VARIANT 7: MINIMAL DARK
// Dark theme with understated elegance
// ============================================
const MinimalDark = ({ images }) => (
  <section className="fgal fgal-dark">
    <div className="fgal-dark__inner">
      <div className="fgal-dark__intro">
        <h2>Our Facility</h2>
        <div className="fgal-dark__line"></div>
      </div>
      <div className="fgal-dark__grid">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="fgal-dark__item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="fgal-dark__img">
              <img src={img.src} alt={img.alt} />
            </div>
            <span>{img.alt}</span>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`
      .fgal-dark {
        background: #0f0f0f;
        padding: 6rem 2rem;
      }
      .fgal-dark__inner {
        max-width: 1200px;
        margin: 0 auto;
      }
      .fgal-dark__intro {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 4rem;
      }
      .fgal-dark__intro h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #fff;
        margin: 0;
        white-space: nowrap;
      }
      .fgal-dark__line {
        flex: 1;
        height: 1px;
        background: rgba(255,255,255,0.15);
      }
      .fgal-dark__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: rgba(255,255,255,0.1);
      }
      .fgal-dark__item {
        background: #0f0f0f;
        padding: 1rem;
      }
      .fgal-dark__img {
        aspect-ratio: 4/3;
        overflow: hidden;
        margin-bottom: 1rem;
      }
      .fgal-dark__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        opacity: 0.8;
        transition: all 0.5s ease;
      }
      .fgal-dark__item:hover .fgal-dark__img img {
        filter: grayscale(0%);
        opacity: 1;
        transform: scale(1.03);
      }
      .fgal-dark__item span {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.5);
        transition: color 0.3s ease;
      }
      .fgal-dark__item:hover span {
        color: #fff;
      }
      @media (max-width: 900px) {
        .fgal-dark__grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 600px) {
        .fgal-dark__grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

// ============================================
// VARIANT 8: FULL WIDTH SLIDER
// Cinematic full-width image slider
// ============================================
const FullWidthSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="fgal fgal-slider">
      <div className="fgal-slider__viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="fgal-slider__slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={images[current]?.src} alt={images[current]?.alt} />
            <div className="fgal-slider__overlay" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="fgal-slider__ui">
        <div className="fgal-slider__info">
          <span className="fgal-slider__label">Our Facility</span>
          <h2>{images[current]?.alt}</h2>
          <p>{images[current]?.caption}</p>
        </div>
        <div className="fgal-slider__controls">
          <button onClick={prev} aria-label="Previous">←</button>
          <span className="fgal-slider__count">
            {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <button onClick={next} aria-label="Next">→</button>
        </div>
      </div>
      <style>{`
        .fgal-slider {
          position: relative;
          height: 80vh;
          min-height: 500px;
          background: #0f0f0f;
        }
        .fgal-slider__viewport {
          position: absolute;
          inset: 0;
        }
        .fgal-slider__slide {
          position: absolute;
          inset: 0;
        }
        .fgal-slider__slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fgal-slider__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
        }
        .fgal-slider__ui {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .fgal-slider__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .fgal-slider__info h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 600;
          color: #fff;
          margin: 0.5rem 0;
        }
        .fgal-slider__info p {
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
        .fgal-slider__controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .fgal-slider__controls button {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #fff;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .fgal-slider__controls button:hover {
          background: #fff;
          color: #1a1a1a;
        }
        .fgal-slider__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
        }
        @media (max-width: 600px) {
          .fgal-slider__ui { flex-direction: column; align-items: flex-start; gap: 2rem; }
        }
      `}</style>
    </section>
  );
};

// ============================================
// GALLERY VARIANTS CONFIG
// ============================================
const galleryVariants = [
  { id: 'clean', name: 'Clean Grid', component: CleanGrid, category: 'Grid' },
  { id: 'numbered', name: 'Numbered Minimal', component: NumberedMinimal, category: 'Grid' },
  { id: 'hero', name: 'Hero + Grid', component: HeroGrid, category: 'Featured' },
  { id: 'asym', name: 'Asymmetric Masonry', component: AsymmetricMasonry, category: 'Editorial' },
  { id: 'scroll', name: 'Horizontal Scroll', component: HorizontalScroll, category: 'Interactive' },
  { id: 'split', name: 'Split Showcase', component: SplitShowcase, category: 'Interactive' },
  { id: 'dark', name: 'Minimal Dark', component: MinimalDark, category: 'Dark' },
  { id: 'slider', name: 'Full Width Slider', component: FullWidthSlider, category: 'Cinematic' },
];

// ============================================
// MAIN PICKER COMPONENT
// ============================================
const FacilityGalleryPicker = ({ images = facilityImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const currentVariant = galleryVariants[currentIndex];
  const GalleryComponent = currentVariant.component;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % galleryVariants.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + galleryVariants.length) % galleryVariants.length);
      if (e.key === 'm' || e.key === 'M') setMinimized((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fgal-picker">
      <div className="fgal-picker__preview">
        <GalleryComponent images={images} />
      </div>

      <div className={`fgal-picker__panel ${minimized ? 'minimized' : ''}`}>
        <div className="fgal-picker__bar" onClick={() => setMinimized(!minimized)}>
          <span className="fgal-picker__count">{currentIndex + 1}/{galleryVariants.length}</span>
          <span className="fgal-picker__name">{currentVariant.name}</span>
          <span className="fgal-picker__toggle">{minimized ? '▲' : '▼'}</span>
        </div>
        {!minimized && (
          <div className="fgal-picker__body">
            <div className="fgal-picker__nav">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + galleryVariants.length) % galleryVariants.length)}>← Prev</button>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % galleryVariants.length)}>Next →</button>
            </div>
            <div className="fgal-picker__cat">{currentVariant.category}</div>
            <div className="fgal-picker__grid">
              {galleryVariants.map((v, i) => (
                <button
                  key={v.id}
                  className={`fgal-picker__thumb ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="fgal-picker__hints">
              <kbd>←</kbd><kbd>→</kbd> Navigate &nbsp; <kbd>M</kbd> Minimize
            </div>
          </div>
        )}
      </div>

      <style>{`
        .fgal-picker__panel {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 320px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
        }
        .fgal-picker__panel.minimized {
          width: auto;
        }
        .fgal-picker__bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #1a1a1a;
          color: #fff;
          cursor: pointer;
        }
        .fgal-picker__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          opacity: 0.5;
        }
        .fgal-picker__name {
          flex: 1;
          font-weight: 500;
          font-size: 0.85rem;
        }
        .fgal-picker__toggle {
          opacity: 0.5;
          font-size: 0.7rem;
        }
        .fgal-picker__body {
          padding: 1rem;
        }
        .fgal-picker__nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .fgal-picker__nav button {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          font-family: inherit;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .fgal-picker__nav button:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .fgal-picker__cat {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.75rem;
        }
        .fgal-picker__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 1rem;
        }
        .fgal-picker__thumb {
          aspect-ratio: 1;
          border: 1px solid #e8e6e2;
          background: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .fgal-picker__thumb:hover {
          border-color: #1a1a1a;
        }
        .fgal-picker__thumb.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .fgal-picker__hints {
          font-size: 0.7rem;
          color: #999;
        }
        .fgal-picker__hints kbd {
          background: #f0efec;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: inherit;
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  );
};

export default FacilityGalleryPicker;
export { galleryVariants, facilityImages };
