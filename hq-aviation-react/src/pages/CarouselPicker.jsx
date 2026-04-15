/**
 * CAROUSEL PICKER - 10 Carousel Variations
 *
 * Built from first principles with different animation approaches.
 * Use arrow keys to navigate, F to favorite, M to minimize picker.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Picker from '../components/Picker';

// ============================================
// SLIDE DATA
// ============================================

const slides = [
  {
    id: 0,
    title: 'Discovery Flight',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations.',
    cta: 'Learn More',
    link: '/training/trial-lessons'
  },
  {
    id: 1,
    title: 'Private Pilot Licence',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'The obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
    cta: 'Learn More',
    link: '/training/ppl'
  },
  {
    id: 2,
    title: 'Commercial Pilot Licence',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. 155 hrs of flying time post licence is required.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 3,
    title: 'Type Rating',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by flight training.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 4,
    title: 'Night Rating',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. 100 hrs of flying post licence is required.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 5,
    title: 'Self-Fly Hire',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements on a short or long term basis.',
    cta: 'Learn More',
    link: '/services'
  }
];

// ============================================
// CAROUSEL 1: FADE
// ============================================

function CarouselFade({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--fade">
      <div className="carousel__slides">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`carousel__slide ${idx === activeSlide ? 'active' : ''}`}
          >
            <div className="carousel__image">
              <img src={slide.image} alt={slide.title} />
            </div>
            <div className="carousel__content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
        <div className="carousel__dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`carousel__dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
      </div>

      <style>{`
        .carousel--fade {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }
        .carousel--fade .carousel__slides {
          position: relative;
          height: 500px;
        }
        .carousel--fade .carousel__slide {
          position: absolute;
          inset: 0;
          display: flex;
          gap: 3rem;
          align-items: center;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .carousel--fade .carousel__slide.active {
          opacity: 1;
          pointer-events: auto;
        }
        .carousel--fade .carousel__image {
          flex: 1;
          height: 100%;
        }
        .carousel--fade .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        .carousel--fade .carousel__content {
          flex: 1;
          padding: 2rem;
        }
        .carousel--fade .carousel__content h3 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }
        .carousel--fade .carousel__content p {
          color: #666;
          line-height: 1.8;
          margin: 0 0 2rem;
        }
        .carousel--fade .carousel__btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          transition: background 0.3s;
        }
        .carousel--fade .carousel__btn:hover {
          background: #333;
        }
        .carousel--fade .carousel__nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .carousel--fade .carousel__nav button {
          width: 40px;
          height: 40px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s;
        }
        .carousel--fade .carousel__nav button:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .carousel--fade .carousel__dots {
          display: flex;
          gap: 0.5rem;
        }
        .carousel--fade .carousel__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s;
        }
        .carousel--fade .carousel__dot.active {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 2: HORIZONTAL SLIDE
// ============================================

function CarouselSlide({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--slide">
      <div className="carousel__track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
        {slides.map((slide, idx) => (
          <div key={idx} className="carousel__slide">
            <div className="carousel__image">
              <img src={slide.image} alt={slide.title} />
            </div>
            <div className="carousel__content">
              <span className="carousel__num">{String(idx + 1).padStart(2, '0')}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta} →</Link>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>‹</button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>›</button>

      <style>{`
        .carousel--slide {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          overflow: hidden;
        }
        .carousel--slide .carousel__track {
          display: flex;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .carousel--slide .carousel__slide {
          flex: 0 0 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          padding: 2rem;
          box-sizing: border-box;
        }
        .carousel--slide .carousel__image {
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 12px;
        }
        .carousel--slide .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--slide .carousel__content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .carousel--slide .carousel__num {
          font-size: 4rem;
          font-weight: 100;
          color: #e0e0e0;
          line-height: 1;
          margin-bottom: 1rem;
        }
        .carousel--slide .carousel__content h3 {
          font-size: 1.75rem;
          font-weight: 600;
          margin: 0 0 1rem;
        }
        .carousel--slide .carousel__content p {
          color: #666;
          line-height: 1.7;
          margin: 0 0 2rem;
        }
        .carousel--slide .carousel__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 0.25rem;
          width: fit-content;
          transition: gap 0.3s;
        }
        .carousel--slide .carousel__btn:hover {
          gap: 1rem;
        }
        .carousel--slide .carousel__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border: none;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-radius: 50%;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s;
        }
        .carousel--slide .carousel__arrow:hover {
          background: #1a1a1a;
          color: #fff;
        }
        .carousel--slide .carousel__arrow--prev { left: 1rem; }
        .carousel--slide .carousel__arrow--next { right: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 3: COVER FLOW (3D)
// ============================================

function CarouselCoverFlow({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--coverflow">
      <div className="carousel__stage">
        {slides.map((slide, idx) => {
          const offset = idx - activeSlide;
          const isActive = idx === activeSlide;
          const translateX = offset * 200;
          const translateZ = isActive ? 100 : -100;
          const rotateY = offset * -25;
          const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3;
          const scale = isActive ? 1 : 0.8;

          return (
            <div
              key={idx}
              className={`carousel__card ${isActive ? 'active' : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 10 - Math.abs(offset)
              }}
              onClick={() => setActiveSlide(idx)}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="carousel__card-info">
                <h3>{slide.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="carousel__info">
        <h3>{slides[activeSlide].title}</h3>
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>

      <div className="carousel__controls">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
        <span>{activeSlide + 1} / {slides.length}</span>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
      </div>

      <style>{`
        .carousel--coverflow {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        .carousel--coverflow .carousel__stage {
          height: 350px;
          perspective: 1000px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .carousel--coverflow .carousel__card {
          position: absolute;
          width: 300px;
          height: 280px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .carousel--coverflow .carousel__card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--coverflow .carousel__card-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: #fff;
        }
        .carousel--coverflow .carousel__card-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }
        .carousel--coverflow .carousel__card.active {
          cursor: default;
        }
        .carousel--coverflow .carousel__info {
          margin-top: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .carousel--coverflow .carousel__info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }
        .carousel--coverflow .carousel__info p {
          color: #666;
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }
        .carousel--coverflow .carousel__btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .carousel--coverflow .carousel__controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .carousel--coverflow .carousel__controls button {
          width: 40px;
          height: 40px;
          border: 2px solid #1a1a1a;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .carousel--coverflow .carousel__controls button:hover {
          background: #1a1a1a;
          color: #fff;
        }
        .carousel--coverflow .carousel__controls span {
          font-size: 0.9rem;
          color: #999;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 4: CARD STACK
// ============================================

function CarouselStack({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--stack">
      <div className="carousel__deck">
        {slides.map((slide, idx) => {
          const offset = idx - activeSlide;
          const isActive = idx === activeSlide;
          const isPast = offset < 0;

          return (
            <div
              key={idx}
              className={`carousel__card ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
              style={{
                transform: isPast
                  ? `translateX(-120%) rotate(-5deg)`
                  : `translateY(${offset * 15}px) scale(${1 - offset * 0.05})`,
                opacity: isPast ? 0 : Math.max(0, 1 - offset * 0.2),
                zIndex: slides.length - Math.abs(offset)
              }}
            >
              <div className="carousel__card-inner">
                <div className="carousel__image">
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className="carousel__content">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  {isActive && <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} disabled={activeSlide === 0}>Previous</button>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next →</button>
      </div>

      <style>{`
        .carousel--stack {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .carousel--stack .carousel__deck {
          position: relative;
          height: 450px;
        }
        .carousel--stack .carousel__card {
          position: absolute;
          top: 0;
          left: 50%;
          width: 90%;
          max-width: 600px;
          transform: translateX(-50%);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .carousel--stack .carousel__card.past {
          pointer-events: none;
        }
        .carousel--stack .carousel__card-inner {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .carousel--stack .carousel__image {
          height: 250px;
          overflow: hidden;
        }
        .carousel--stack .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--stack .carousel__content {
          padding: 2rem;
        }
        .carousel--stack .carousel__content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
        }
        .carousel--stack .carousel__content p {
          color: #666;
          line-height: 1.6;
          margin: 0 0 1.5rem;
          font-size: 0.95rem;
        }
        .carousel--stack .carousel__btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          border-radius: 4px;
        }
        .carousel--stack .carousel__nav {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .carousel--stack .carousel__nav button {
          padding: 0.75rem 2rem;
          background: transparent;
          border: 2px solid #1a1a1a;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s;
        }
        .carousel--stack .carousel__nav button:hover:not(:disabled) {
          background: #1a1a1a;
          color: #fff;
        }
        .carousel--stack .carousel__nav button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 5: TABS + CENTER FOCUS
// ============================================

function CarouselTabs({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--tabs">
      <div className="carousel__tabs">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          >
            {slide.title}
          </button>
        ))}
      </div>

      <div className="carousel__body">
        <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>‹</button>

        <div className="carousel__viewport">
          {slides.map((slide, idx) => {
            const offset = idx - activeSlide;
            const isActive = idx === activeSlide;
            const isPrev = offset === -1 || (activeSlide === 0 && idx === slides.length - 1);
            const isNext = offset === 1 || (activeSlide === slides.length - 1 && idx === 0);

            let translateX = '0%';
            let scale = 0.7;
            let opacity = 0;

            if (isActive) {
              translateX = '0%';
              scale = 1;
              opacity = 1;
            } else if (isPrev) {
              translateX = '-85%';
              scale = 0.85;
              opacity = 0.5;
            } else if (isNext) {
              translateX = '85%';
              scale = 0.85;
              opacity = 0.5;
            }

            return (
              <div
                key={idx}
                className={`carousel__slide ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  opacity,
                  zIndex: isActive ? 10 : 5
                }}
                onClick={() => !isActive && setActiveSlide(idx)}
              >
                <img src={slide.image} alt={slide.title} />
                <div className="carousel__overlay">
                  <h3>{slide.title}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>›</button>
      </div>

      <div className="carousel__info">
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>

      <style>{`
        .carousel--tabs {
          max-width: 1100px;
          margin: 0 auto;
        }
        .carousel--tabs .carousel__tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 1rem;
        }
        .carousel--tabs .carousel__tab {
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #999;
          cursor: pointer;
          transition: color 0.3s;
        }
        .carousel--tabs .carousel__tab:hover {
          color: #333;
        }
        .carousel--tabs .carousel__tab.active {
          color: #1a1a1a;
          border-bottom: 2px solid #1a1a1a;
          margin-bottom: -1rem;
          padding-bottom: calc(0.5rem + 1rem - 2px);
        }
        .carousel--tabs .carousel__body {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel--tabs .carousel__viewport {
          position: relative;
          width: 100%;
          height: 400px;
          overflow: hidden;
        }
        .carousel--tabs .carousel__slide {
          position: absolute;
          top: 0;
          left: 50%;
          width: 55%;
          height: 100%;
          margin-left: -27.5%;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .carousel--tabs .carousel__slide.active {
          cursor: default;
        }
        .carousel--tabs .carousel__slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--tabs .carousel__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: #fff;
        }
        .carousel--tabs .carousel__overlay h3 {
          margin: 0;
          font-size: 1.25rem;
        }
        .carousel--tabs .carousel__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 45px;
          height: 45px;
          border: none;
          background: rgba(255,255,255,0.95);
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 20;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }
        .carousel--tabs .carousel__arrow:hover {
          background: #1a1a1a;
          color: #fff;
        }
        .carousel--tabs .carousel__arrow--prev { left: 1rem; }
        .carousel--tabs .carousel__arrow--next { right: 1rem; }
        .carousel--tabs .carousel__info {
          text-align: center;
          max-width: 600px;
          margin: 2rem auto 0;
        }
        .carousel--tabs .carousel__info p {
          color: #666;
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }
        .carousel--tabs .carousel__btn {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: transparent;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 2px solid #1a1a1a;
          transition: all 0.3s;
        }
        .carousel--tabs .carousel__btn:hover {
          background: #1a1a1a;
          color: #fff;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 6: VERTICAL
// ============================================

function CarouselVertical({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--vertical">
      <div className="carousel__sidebar">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            className={`carousel__sidebar-item ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          >
            <span className="carousel__sidebar-num">{String(idx + 1).padStart(2, '0')}</span>
            <span className="carousel__sidebar-title">{slide.title}</span>
          </button>
        ))}
      </div>

      <div className="carousel__main">
        <div className="carousel__track" style={{ transform: `translateY(-${activeSlide * 100}%)` }}>
          {slides.map((slide, idx) => (
            <div key={idx} className="carousel__slide">
              <div className="carousel__image">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="carousel__content">
                <span className="carousel__label">Training Course</span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .carousel--vertical {
          display: flex;
          max-width: 1100px;
          margin: 0 auto;
          height: 500px;
          gap: 2rem;
        }
        .carousel--vertical .carousel__sidebar {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .carousel--vertical .carousel__sidebar-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 3px solid transparent;
        }
        .carousel--vertical .carousel__sidebar-item:hover {
          background: #f5f5f5;
        }
        .carousel--vertical .carousel__sidebar-item.active {
          background: #f5f5f5;
          border-left-color: #1a1a1a;
        }
        .carousel--vertical .carousel__sidebar-num {
          font-size: 0.75rem;
          color: #999;
          font-family: monospace;
        }
        .carousel--vertical .carousel__sidebar-title {
          font-size: 0.85rem;
          font-weight: 500;
        }
        .carousel--vertical .carousel__main {
          flex: 1;
          overflow: hidden;
          border-radius: 12px;
        }
        .carousel--vertical .carousel__track {
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .carousel--vertical .carousel__slide {
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .carousel--vertical .carousel__image {
          height: 100%;
        }
        .carousel--vertical .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--vertical .carousel__content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #f9f9f9;
        }
        .carousel--vertical .carousel__label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 1rem;
        }
        .carousel--vertical .carousel__content h3 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 1rem;
        }
        .carousel--vertical .carousel__content p {
          color: #666;
          line-height: 1.7;
          margin: 0 0 2rem;
        }
        .carousel--vertical .carousel__btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 7: FILMSTRIP
// ============================================

function CarouselFilmstrip({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--filmstrip">
      <div className="carousel__content">
        <span className="carousel__counter">{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <h3>{slides[activeSlide].title}</h3>
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>

      <div className="carousel__strip-container">
        <div className="carousel__strip" style={{ transform: `translateX(calc(-${activeSlide * 180}px + 50% - 90px))` }}>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel__thumb ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="carousel__thumb-overlay"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>← Previous</button>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next →</button>
      </div>

      <style>{`
        .carousel--filmstrip {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }
        .carousel--filmstrip .carousel__content {
          margin-bottom: 3rem;
        }
        .carousel--filmstrip .carousel__counter {
          font-family: monospace;
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 1rem;
          display: block;
        }
        .carousel--filmstrip .carousel__content h3 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }
        .carousel--filmstrip .carousel__content p {
          max-width: 500px;
          margin: 0 auto 2rem;
          color: #666;
          line-height: 1.7;
        }
        .carousel--filmstrip .carousel__btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }
        .carousel--filmstrip .carousel__strip-container {
          overflow: hidden;
          padding: 1rem 0;
        }
        .carousel--filmstrip .carousel__strip {
          display: flex;
          gap: 1rem;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          width: fit-content;
        }
        .carousel--filmstrip .carousel__thumb {
          width: 160px;
          height: 120px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }
        .carousel--filmstrip .carousel__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--filmstrip .carousel__thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          transition: opacity 0.3s;
        }
        .carousel--filmstrip .carousel__thumb:hover .carousel__thumb-overlay {
          opacity: 0.6;
        }
        .carousel--filmstrip .carousel__thumb.active {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .carousel--filmstrip .carousel__thumb.active .carousel__thumb-overlay {
          opacity: 0;
        }
        .carousel--filmstrip .carousel__nav {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .carousel--filmstrip .carousel__nav button {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
        }
        .carousel--filmstrip .carousel__nav button:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 8: SPLIT SCREEN
// ============================================

function CarouselSplit({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--split">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel__image ${idx === activeSlide ? 'active' : ''}`}
            >
              <img src={slide.image} alt={slide.title} />
            </div>
          ))}
        </div>
      </div>

      <div className="carousel__right">
        <div className="carousel__content-stack">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel__content ${idx === activeSlide ? 'active' : ''}`}
            >
              <span className="carousel__num">{String(idx + 1).padStart(2, '0')}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta} →</Link>
            </div>
          ))}
        </div>

        <div className="carousel__progress">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`carousel__progress-item ${idx === activeSlide ? 'active' : ''} ${idx < activeSlide ? 'past' : ''}`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>

        <div className="carousel__nav">
          <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
          <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
        </div>
      </div>

      <style>{`
        .carousel--split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 550px;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
        }
        .carousel--split .carousel__left {
          position: relative;
          overflow: hidden;
        }
        .carousel--split .carousel__images {
          height: 100%;
        }
        .carousel--split .carousel__image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease, transform 0.6s ease;
          transform: scale(1.1);
        }
        .carousel--split .carousel__image.active {
          opacity: 1;
          transform: scale(1);
        }
        .carousel--split .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--split .carousel__right {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
          position: relative;
        }
        .carousel--split .carousel__content-stack {
          position: relative;
          min-height: 300px;
        }
        .carousel--split .carousel__content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease;
          pointer-events: none;
        }
        .carousel--split .carousel__content.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .carousel--split .carousel__num {
          display: block;
          font-size: 3rem;
          font-weight: 100;
          color: rgba(255,255,255,0.2);
          margin-bottom: 1rem;
        }
        .carousel--split .carousel__content h3 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }
        .carousel--split .carousel__content p {
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin: 0 0 2rem;
        }
        .carousel--split .carousel__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          padding-bottom: 0.25rem;
        }
        .carousel--split .carousel__btn:hover {
          border-color: #fff;
        }
        .carousel--split .carousel__progress {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        .carousel--split .carousel__progress-item {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }
        .carousel--split .carousel__progress-item.active,
        .carousel--split .carousel__progress-item.past {
          background: #fff;
        }
        .carousel--split .carousel__nav {
          position: absolute;
          bottom: 4rem;
          right: 4rem;
          display: flex;
          gap: 0.5rem;
        }
        .carousel--split .carousel__nav button {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .carousel--split .carousel__nav button:hover {
          background: #fff;
          color: #1a1a1a;
          border-color: #fff;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 9: MINIMAL ARROWS ONLY
// ============================================

function CarouselMinimal({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--minimal">
      <div className="carousel__container">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`carousel__slide ${idx === activeSlide ? 'active' : ''}`}
          >
            <div className="carousel__inner">
              <div className="carousel__image">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="carousel__content">
                <div className="carousel__header">
                  <span className="carousel__index">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="carousel__divider"></span>
                  <span className="carousel__total">{String(slides.length).padStart(2, '0')}</span>
                </div>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>

      <style>{`
        .carousel--minimal {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 4rem;
        }
        .carousel--minimal .carousel__container {
          position: relative;
          overflow: hidden;
        }
        .carousel--minimal .carousel__slide {
          display: none;
        }
        .carousel--minimal .carousel__slide.active {
          display: block;
          animation: minimalFadeIn 0.4s ease;
        }
        @keyframes minimalFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .carousel--minimal .carousel__inner {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .carousel--minimal .carousel__image {
          aspect-ratio: 4/3;
          border-radius: 4px;
          overflow: hidden;
        }
        .carousel--minimal .carousel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--minimal .carousel__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          font-family: monospace;
          font-size: 0.9rem;
          color: #999;
        }
        .carousel--minimal .carousel__divider {
          width: 30px;
          height: 1px;
          background: #ddd;
        }
        .carousel--minimal .carousel__content h3 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 1.5rem;
          line-height: 1.2;
        }
        .carousel--minimal .carousel__content p {
          color: #666;
          line-height: 1.8;
          margin: 0 0 2rem;
        }
        .carousel--minimal .carousel__btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .carousel--minimal .carousel__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border: 1px solid #e0e0e0;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          z-index: 10;
        }
        .carousel--minimal .carousel__arrow:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .carousel--minimal .carousel__arrow--prev { left: 0; }
        .carousel--minimal .carousel__arrow--next { right: 0; }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL 10: EDITORIAL / MAGAZINE
// ============================================

function CarouselEditorial({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--editorial">
      <div className="carousel__hero">
        <div className="carousel__hero-images">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel__hero-image ${idx === activeSlide ? 'active' : ''}`}
            >
              <img src={slide.image} alt={slide.title} />
            </div>
          ))}
        </div>
        <div className="carousel__hero-overlay">
          <span className="carousel__category">Training</span>
          <h2 className="carousel__title">{slides[activeSlide].title}</h2>
        </div>
      </div>

      <div className="carousel__bar">
        <div className="carousel__counter">
          <span className="carousel__current">{String(activeSlide + 1).padStart(2, '0')}</span>
          <span className="carousel__separator">/</span>
          <span className="carousel__total">{String(slides.length).padStart(2, '0')}</span>
        </div>

        <div className="carousel__description">
          <p>{slides[activeSlide].description}</p>
        </div>

        <div className="carousel__actions">
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
        </div>

        <div className="carousel__controls">
          <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>Prev</button>
          <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next</button>
        </div>
      </div>

      <div className="carousel__thumbnails">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            className={`carousel__thumb ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          >
            <img src={slide.image} alt={slide.title} />
            <span>{slide.title}</span>
          </button>
        ))}
      </div>

      <style>{`
        .carousel--editorial {
          max-width: 1200px;
          margin: 0 auto;
        }
        .carousel--editorial .carousel__hero {
          position: relative;
          height: 450px;
          overflow: hidden;
          border-radius: 8px;
        }
        .carousel--editorial .carousel__hero-images {
          height: 100%;
        }
        .carousel--editorial .carousel__hero-image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.05);
          transition: all 0.8s ease;
        }
        .carousel--editorial .carousel__hero-image.active {
          opacity: 1;
          transform: scale(1);
        }
        .carousel--editorial .carousel__hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel--editorial .carousel__hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 4rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: #fff;
        }
        .carousel--editorial .carousel__category {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #fff;
          color: #1a1a1a;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
        }
        .carousel--editorial .carousel__title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .carousel--editorial .carousel__bar {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: 3rem;
          align-items: center;
          padding: 2rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .carousel--editorial .carousel__counter {
          font-family: monospace;
          font-size: 1.25rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .carousel--editorial .carousel__current {
          font-weight: 700;
        }
        .carousel--editorial .carousel__separator,
        .carousel--editorial .carousel__total {
          color: #999;
        }
        .carousel--editorial .carousel__description p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          max-width: 400px;
        }
        .carousel--editorial .carousel__btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
        .carousel--editorial .carousel__controls {
          display: flex;
          gap: 0.5rem;
        }
        .carousel--editorial .carousel__controls button {
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s;
        }
        .carousel--editorial .carousel__controls button:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .carousel--editorial .carousel__thumbnails {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }
        .carousel--editorial .carousel__thumb {
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .carousel--editorial .carousel__thumb:hover,
        .carousel--editorial .carousel__thumb.active {
          opacity: 1;
        }
        .carousel--editorial .carousel__thumb img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        .carousel--editorial .carousel__thumb span {
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL VARIATIONS MAP
// ============================================

const carouselComponents = {
  'carousel-1': CarouselFade,
  'carousel-2': CarouselSlide,
  'carousel-3': CarouselCoverFlow,
  'carousel-4': CarouselStack,
  'carousel-5': CarouselTabs,
  'carousel-6': CarouselVertical,
  'carousel-7': CarouselFilmstrip,
  'carousel-8': CarouselSplit,
  'carousel-9': CarouselMinimal,
  'carousel-10': CarouselEditorial,
};

// ============================================
// PICKER SECTIONS
// ============================================

const sections = {
  carousels: [
    { id: 'carousel-1', name: 'Fade', category: 'Simple', desc: 'Clean fade transition between slides' },
    { id: 'carousel-2', name: 'Horizontal Slide', category: 'Classic', desc: 'Traditional horizontal sliding with large numbers' },
    { id: 'carousel-3', name: 'Cover Flow', category: '3D', desc: 'Apple-inspired 3D perspective rotation' },
    { id: 'carousel-4', name: 'Card Stack', category: 'Stack', desc: 'Cards stacked that slide away on navigate' },
    { id: 'carousel-5', name: 'Tabs + Center', category: 'Navigation', desc: 'Tab navigation with center-focused slides' },
    { id: 'carousel-6', name: 'Vertical', category: 'Layout', desc: 'Sidebar navigation with vertical sliding' },
    { id: 'carousel-7', name: 'Filmstrip', category: 'Thumbnails', desc: 'Centered filmstrip with thumbnail navigation' },
    { id: 'carousel-8', name: 'Split Screen', category: 'Editorial', desc: 'Dark split-screen with progress bar' },
    { id: 'carousel-9', name: 'Minimal', category: 'Minimal', desc: 'Clean minimal with large arrow buttons' },
    { id: 'carousel-10', name: 'Editorial', category: 'Magazine', desc: 'Magazine-style with hero image and thumbnails' },
  ],
};

const tabs = [
  { key: 'carousels', label: 'Carousels', color: 'default' },
];

// ============================================
// MAIN COMPONENT
// ============================================

function CarouselPicker() {
  const [currentItem, setCurrentItem] = useState(sections.carousels[0]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Reset slide when changing carousel
  useEffect(() => {
    setActiveSlide(0);
  }, [currentItem]);

  const CarouselComponent = carouselComponents[currentItem?.id];

  return (
    <div className="carousel-picker">
      <div className="carousel-picker__preview">
        <div className="carousel-picker__header">
          <h1>Training Courses</h1>
          <p>Explore our comprehensive helicopter training programs</p>
        </div>

        <div className="carousel-picker__carousel">
          {CarouselComponent && (
            <CarouselComponent
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
            />
          )}
        </div>
      </div>

      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="hq-carousel-picker-favorites"
        title="Carousel Picker"
        onItemSelect={setCurrentItem}
        initialIndex={0}
      />

      <style>{`
        .carousel-picker {
          min-height: 100vh;
          background: #faf9f6;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
        .carousel-picker__preview {
          padding: 4rem 2rem 10rem;
        }
        .carousel-picker__header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .carousel-picker__header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .carousel-picker__header p {
          color: #666;
          margin: 0;
        }
        .carousel-picker__carousel {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default CarouselPicker;
