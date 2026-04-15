/**
 * ARROW PICKER - 4 Final Arrow Selections
 */

import React, { useState, useEffect } from 'react';
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
    description: 'The obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo.',
    cta: 'Learn More',
    link: '/training/ppl'
  },
  {
    id: 2,
    title: 'Commercial Pilot Licence',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 3,
    title: 'Type Rating',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 4,
    title: 'Night Rating',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 5,
    title: 'Self-Fly Hire',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'With an impressive fleet of over 30 helicopters, HQ will facilitate your flying requirements.',
    cta: 'Learn More',
    link: '/services'
  }
];

// ============================================
// BASE CAROUSEL COMPONENT
// ============================================

function BaseCarousel({ activeSlide, setActiveSlide, arrowStyle, ArrowPrev, ArrowNext }) {
  return (
    <div className={`carousel carousel--arrows carousel--arrows-${arrowStyle}`}>
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            >
              <span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="carousel__tab-title">{slide.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="carousel__body">
        <ArrowPrev onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} />

        <div className="carousel__main">
          <div className="carousel__image">
            {slides.map((slide, idx) => (
              <img
                key={idx}
                src={slide.image}
                alt={slide.title}
                className={idx === activeSlide ? 'active' : ''}
              />
            ))}
          </div>

          <div className="carousel__divider"></div>

          <div className="carousel__content">
            <div className="carousel__counter">
              <span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span>
            </div>

            <div className="carousel__text-content" key={activeSlide}>
              <h3>{slides[activeSlide].title}</h3>
              <p>{slides[activeSlide].description}</p>
              <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
            </div>
          </div>
        </div>

        <ArrowNext onClick={() => setActiveSlide((activeSlide + 1) % slides.length)} />
      </div>

      <div className="carousel__sticks">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// ARROW 1: Long Arrow Thick
// ============================================

function Arrow1({ activeSlide, setActiveSlide }) {
  const Prev = ({ onClick }) => (
    <button className="arrow arrow--1" onClick={onClick}>
      <svg width="48" height="20" viewBox="0 0 48 20">
        <line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
  const Next = ({ onClick }) => (
    <button className="arrow arrow--1" onClick={onClick}>
      <svg width="48" height="20" viewBox="0 0 48 20">
        <line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
  return (
    <>
      <BaseCarousel activeSlide={activeSlide} setActiveSlide={setActiveSlide} arrowStyle="1" ArrowPrev={Prev} ArrowNext={Next} />
      <style>{`
        .carousel--arrows-1 .arrow--1 {
          padding: 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #bbb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .carousel--arrows-1 .arrow--1:hover {
          color: #1a1a1a;
        }
      `}</style>
    </>
  );
}

// ============================================
// ARROW 2: Pulse Triple
// ============================================

function Arrow2({ activeSlide, setActiveSlide }) {
  const Prev = ({ onClick }) => (
    <button className="arrow arrow--2" onClick={onClick}>
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="14 18 8 12 14 6" className="c1"></polyline>
        <polyline points="22 18 16 12 22 6" className="c2"></polyline>
        <polyline points="30 18 24 12 30 6" className="c3"></polyline>
      </svg>
    </button>
  );
  const Next = ({ onClick }) => (
    <button className="arrow arrow--2" onClick={onClick}>
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 18 12 12 6 6" className="c1"></polyline>
        <polyline points="14 18 20 12 14 6" className="c2"></polyline>
        <polyline points="22 18 28 12 22 6" className="c3"></polyline>
      </svg>
    </button>
  );
  return (
    <>
      <BaseCarousel activeSlide={activeSlide} setActiveSlide={setActiveSlide} arrowStyle="2" ArrowPrev={Prev} ArrowNext={Next} />
      <style>{`
        .carousel--arrows-2 .arrow--2 {
          padding: 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .carousel--arrows-2 .arrow--2 .c1 { opacity: 0.4; }
        .carousel--arrows-2 .arrow--2 .c2 { opacity: 0.7; }
        .carousel--arrows-2 .arrow--2 .c3 { opacity: 1; }
        .carousel--arrows-2 .arrow--2:hover {
          color: #1a1a1a;
        }
        .carousel--arrows-2 .arrow--2:hover .c1 { animation: pulse2 0.6s ease infinite; }
        .carousel--arrows-2 .arrow--2:hover .c2 { animation: pulse2 0.6s ease infinite 0.1s; }
        .carousel--arrows-2 .arrow--2:hover .c3 { animation: pulse2 0.6s ease infinite 0.2s; }
        @keyframes pulse2 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ============================================
// ARROW 3: Minimal Line
// ============================================

function Arrow3({ activeSlide, setActiveSlide }) {
  const Prev = ({ onClick }) => (
    <button className="arrow arrow--3" onClick={onClick}>
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line x1="32" y1="8" x2="2" y2="8" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="8" x2="8" y2="2" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="8" x2="8" y2="14" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </button>
  );
  const Next = ({ onClick }) => (
    <button className="arrow arrow--3" onClick={onClick}>
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line x1="0" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="1"/>
        <line x1="30" y1="8" x2="24" y2="2" stroke="currentColor" strokeWidth="1"/>
        <line x1="30" y1="8" x2="24" y2="14" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </button>
  );
  return (
    <>
      <BaseCarousel activeSlide={activeSlide} setActiveSlide={setActiveSlide} arrowStyle="3" ArrowPrev={Prev} ArrowNext={Next} />
      <style>{`
        .carousel--arrows-3 .arrow--3 {
          padding: 1rem;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .carousel--arrows-3 .arrow--3:hover {
          color: #1a1a1a;
        }
      `}</style>
    </>
  );
}

// ============================================
// ARROW 4: Triple Fade
// ============================================

function Arrow4({ activeSlide, setActiveSlide }) {
  const Prev = ({ onClick }) => (
    <button className="arrow arrow--4" onClick={onClick}>
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="14 18 8 12 14 6" opacity="0.3"></polyline>
        <polyline points="22 18 16 12 22 6" opacity="0.6"></polyline>
        <polyline points="30 18 24 12 30 6" opacity="1"></polyline>
      </svg>
    </button>
  );
  const Next = ({ onClick }) => (
    <button className="arrow arrow--4" onClick={onClick}>
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 18 12 12 6 6" opacity="1"></polyline>
        <polyline points="14 18 20 12 14 6" opacity="0.6"></polyline>
        <polyline points="22 18 28 12 22 6" opacity="0.3"></polyline>
      </svg>
    </button>
  );
  return (
    <>
      <BaseCarousel activeSlide={activeSlide} setActiveSlide={setActiveSlide} arrowStyle="4" ArrowPrev={Prev} ArrowNext={Next} />
      <style>{`
        .carousel--arrows-4 .arrow--4 {
          padding: 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #bbb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .carousel--arrows-4 .arrow--4:hover {
          color: #1a1a1a;
        }
      `}</style>
    </>
  );
}

// ============================================
// ARROW VARIATIONS MAP
// ============================================

const arrowComponents = {
  'arrow-1': Arrow1,
  'arrow-2': Arrow2,
  'arrow-3': Arrow3,
  'arrow-4': Arrow4,
};

// ============================================
// PICKER SECTIONS
// ============================================

const sections = {
  arrows: [
    { id: 'arrow-1', name: 'Long Arrow Thick', category: 'Arrow', desc: 'Extended arrow with bold line' },
    { id: 'arrow-2', name: 'Pulse Triple', category: 'Animated', desc: 'Three chevrons with opacity pulse' },
    { id: 'arrow-3', name: 'Minimal Line', category: 'Arrow', desc: 'Simple thin arrow line' },
    { id: 'arrow-4', name: 'Triple Fade', category: 'Chevron', desc: 'Three chevrons with opacity fade' },
  ],
};

const tabs = [
  { key: 'arrows', label: 'Arrow Styles', color: 'green' },
];

// ============================================
// BASE STYLES
// ============================================

const baseStyles = `
  .carousel--arrows {
    max-width: 1000px;
    margin: 0 auto;
  }
  .carousel--arrows .carousel__tabs-wrapper {
    position: relative;
  }
  .carousel--arrows .carousel__tabs-wrapper::before,
  .carousel--arrows .carousel__tabs-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    pointer-events: none;
    z-index: 1;
  }
  .carousel--arrows .carousel__tabs-wrapper::before {
    left: 0;
    background: linear-gradient(to right, #faf9f6 0%, transparent 100%);
  }
  .carousel--arrows .carousel__tabs-wrapper::after {
    right: 0;
    background: linear-gradient(to left, #faf9f6 0%, transparent 100%);
  }
  .carousel--arrows .carousel__tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.75rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-left: 40px;
    padding-right: 40px;
  }
  .carousel--arrows .carousel__tabs::-webkit-scrollbar {
    display: none;
  }
  .carousel--arrows .carousel__tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .carousel--arrows .carousel__tab-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: #bbb;
    transition: color 0.3s;
  }
  .carousel--arrows .carousel__tab-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #999;
    transition: color 0.3s;
  }
  .carousel--arrows .carousel__tab:hover .carousel__tab-num { color: #999; }
  .carousel--arrows .carousel__tab:hover .carousel__tab-title { color: #333; }
  .carousel--arrows .carousel__tab.active {
    border-bottom: 2px solid #1a1a1a;
    margin-bottom: -0.75rem;
    padding-bottom: calc(0.5rem + 0.75rem - 2px);
  }
  .carousel--arrows .carousel__tab.active .carousel__tab-num { color: #666; }
  .carousel--arrows .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
  .carousel--arrows .carousel__body {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .carousel--arrows .carousel__main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 3rem;
    align-items: center;
    min-height: 350px;
  }
  .carousel--arrows .carousel__image {
    position: relative;
    aspect-ratio: 4/3;
    border-radius: 8px;
    overflow: hidden;
  }
  .carousel--arrows .carousel__image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transform: scale(1.02);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .carousel--arrows .carousel__image img.active {
    opacity: 1;
    transform: scale(1);
  }
  .carousel--arrows .carousel__divider {
    width: 1px;
    height: 180px;
    background: linear-gradient(to bottom, transparent, #ddd, transparent);
  }
  .carousel--arrows .carousel__content { padding: 1.5rem 0; }
  .carousel--arrows .carousel__counter {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    font-family: 'Share Tech Mono', monospace;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }
  .carousel--arrows .carousel__current {
    font-size: 4rem;
    font-weight: 700;
    color: #999;
    line-height: 1;
    display: inline-block;
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .carousel--arrows .carousel__text-content {
    animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.1s;
    opacity: 0;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .carousel--arrows .carousel__content h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    text-transform: uppercase;
  }
  .carousel--arrows .carousel__content p {
    color: #666;
    line-height: 1.7;
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
  }
  .carousel--arrows .carousel__btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #1a1a1a;
    color: #fff;
    text-decoration: none;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .carousel--arrows .carousel__sticks {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  .carousel--arrows .carousel__stick {
    width: 40px;
    height: 3px;
    background: #e0e0e0;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
  }
  .carousel--arrows .carousel__stick.active { background: #1a1a1a; }
`;

// ============================================
// MAIN COMPONENT
// ============================================

function ArrowPicker() {
  const [currentItem, setCurrentItem] = useState(sections.arrows[0]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [currentItem]);

  const ArrowComponent = arrowComponents[currentItem?.id];

  return (
    <div className="arrow-picker">
      <style>{baseStyles}</style>

      <div className="arrow-picker__preview">
        <div className="arrow-picker__header">
          <h1>Training Courses</h1>
          <p>Select your preferred arrow style</p>
        </div>

        <div className="arrow-picker__carousel">
          {ArrowComponent && (
            <ArrowComponent
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
            />
          )}
        </div>
      </div>

      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="hq-arrow-picker-favorites"
        title="Arrow Style Picker"
        onItemSelect={setCurrentItem}
        initialIndex={0}
      />

      <style>{`
        .arrow-picker {
          min-height: 100vh;
          background: #faf9f6;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
        .arrow-picker__preview {
          padding: 4rem 2rem 10rem;
        }
        .arrow-picker__header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .arrow-picker__header h1 {
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .arrow-picker__header p {
          color: #666;
          margin: 0;
        }
        .arrow-picker__carousel {
          max-width: 1100px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default ArrowPicker;
