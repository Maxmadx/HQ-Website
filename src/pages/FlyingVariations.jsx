/**
 * FLYING VARIATIONS TEST PAGE
 *
 * 10 reimaginations of the "Explore Our Courses" section
 * (fd-section fd-section--with-carousel in FinalDraft).
 * Same design system: Space Grotesk, Share Tech Mono,
 * #faf9f6 / #1a1a1a palette, architectural grid lines.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Picker from '../components/Picker';

// ============================================
// SHARED DATA & CONSTANTS
// ============================================

const TRAINING_SLIDES = [
  {
    title: 'Discovery Flight',
    image: '/assets/images/gallery/carousel/rotating1.jpg',
    description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations: After a pre-flight briefing, you will enjoy a full hands-on flying experience with one of our instructors.',
    cta: 'Learn More',
    link: '/training/trial-lessons',
    duration: '1 hour',
    tag: 'First step',
  },
  {
    title: 'Private Pilot Licence',
    image: '/assets/images/gallery/carousel/rotating2.jpg',
    description: 'Let aside the ground exams that most students self study before taking the tests on site, the obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
    cta: 'Learn More',
    link: '/training/ppl',
    duration: '45+ hours',
    tag: 'Foundation',
  },
  {
    title: 'Commercial Pilot Licence',
    image: '/assets/images/gallery/carousel/rotating-3.jpg',
    description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. To achieve this, 155 hrs of flying time post licence is required, of which 50 hrs must be Pilot In Command (PIC).',
    cta: 'Learn More',
    link: '/training',
    duration: '155+ hours',
    tag: 'Professional',
  },
  {
    title: 'Type Rating',
    image: '/assets/images/gallery/carousel/rotating-4.jpg',
    description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by a minimum of 5 Hrs of flight training will suffice to put you to the Type Rating test.',
    cta: 'Learn More',
    link: '/training/type-rating',
    duration: '5+ hours',
    tag: 'Specialisation',
  },
  {
    title: 'Night Rating',
    image: '/assets/images/gallery/carousel/rotating6.jpg',
    description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. To achieve this, 100 hrs of flying post licence is required, of which 60 Hrs must be Pilot In Command.',
    cta: 'Learn More',
    link: '/training',
    duration: '100+ hours',
    tag: 'Advanced',
  },
  {
    title: 'Self-Fly Hire',
    image: '/assets/images/gallery/carousel/rotating8.jpg',
    description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements, either on a short term hiring or on a long term leasing basis.',
    cta: 'Learn More',
    link: '/services',
    duration: 'Flexible',
    tag: 'Freedom',
  },
  {
    title: 'Tours of London',
    image: '/assets/images/lifestyle/london-battersea-heliport.jpg',
    description: 'Experience London from above with a breathtaking helicopter tour. Fly over iconic landmarks including the Tower of London, Buckingham Palace, the London Eye, and the Thames — an unforgettable aerial perspective of one of the world\'s greatest cities.',
    cta: 'Learn More',
    link: '/helicopter-tour-of-london',
    duration: '30 minutes',
    tag: 'Experience',
  },
];

const pad = (n) => String(n + 1).padStart(2, '0');

const SectionHeader = ({ subtitle = 'Training', title = 'Explore Our Courses', desc, light = false }) => (
  <div className={`fv__header ${light ? 'fv__header--light' : ''}`}>
    <div className="fv__header-divider" />
    <span className="fv__header-sub">{subtitle}</span>
    <h2 className="fv__header-title">{title}</h2>
    {desc && <p className="fv__header-desc">{desc}</p>}
  </div>
);

const ArrowLeft = ({ onClick, light = false }) => (
  <button className={`fv__arrow ${light ? 'fv__arrow--light' : ''}`} onClick={onClick} aria-label="Previous">
    <svg width="48" height="20" viewBox="0 0 48 20">
      <line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const ArrowRight = ({ onClick, light = false }) => (
  <button className={`fv__arrow ${light ? 'fv__arrow--light' : ''}`} onClick={onClick} aria-label="Next">
    <svg width="48" height="20" viewBox="0 0 48 20">
      <line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);


// ============================================
// V1 - CURRENT BASELINE
// Tab-based carousel with numbered tabs,
// text|divider|image, progress bar
// ============================================
const FlyingV1 = () => {
  const [active, setActive] = useState(2);
  const next = () => setActive((p) => (p + 1) % TRAINING_SLIDES.length);
  const prev = () => setActive((p) => (p - 1 + TRAINING_SLIDES.length) % TRAINING_SLIDES.length);

  return (
    <section className="fv-section fv-v1">
      <SectionHeader desc="From your first discovery flight to advanced commercial ratings, our experienced instructors guide you every step of the way." />
      <div className="fv-v1__carousel">
        {/* Tabs */}
        <div className="fv-v1__tabs-wrap">
          <div className="fv-v1__tabs">
            {TRAINING_SLIDES.map((s, i) => (
              <button key={i} className={`fv-v1__tab ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                <span className="fv-v1__tab-num">{pad(i)}</span>
                <span className="fv-v1__tab-title">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="fv-v1__body">
          <ArrowLeft onClick={prev} />
          <div className="fv-v1__main">
            <div className="fv-v1__text">
              {TRAINING_SLIDES.map((s, i) => (
                <div key={i} className={`fv-v1__slide ${i === active ? 'active' : ''}`}>
                  <div className="fv-v1__title-row">
                    <div className="fv-v1__num-wrap">
                      <span className="fv-v1__inline-num">{pad(i)}</span>
                    </div>
                    <h3>{s.title}</h3>
                  </div>
                  <p>{s.description}</p>
                  <Link to={s.link} className="fv__btn">
                    <span>{s.cta}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              ))}
            </div>
            <div className="fv-v1__divider" />
            <div className="fv-v1__image">
              {TRAINING_SLIDES.map((s, i) => (
                <img key={i} src={s.image} alt={s.title} className={i === active ? 'active' : ''} />
              ))}
            </div>
          </div>
          <ArrowRight onClick={next} />
        </div>

        {/* Progress */}
        <div className="fv-v1__progress">
          <div className="fv-v1__progress-bar" style={{ width: `${((active + 1) / TRAINING_SLIDES.length) * 100}%` }} />
        </div>
      </div>
    </section>
  );
};


// ============================================
// V2 - FULL BLEED CARD STACK
// Large image cards that crossfade,
// course info overlaid at bottom
// ============================================
const FlyingV2 = () => {
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % TRAINING_SLIDES.length);
  const prev = () => setActive((p) => (p - 1 + TRAINING_SLIDES.length) % TRAINING_SLIDES.length);
  const slide = TRAINING_SLIDES[active];

  return (
    <section className="fv-section fv-v2">
      <div className="fv-v2__image-stack">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={slide.image}
            alt={slide.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fv-v2__bg"
          />
        </AnimatePresence>
        <div className="fv-v2__overlay" />
      </div>

      <div className="fv-v2__top">
        <span className="fv-v2__label">Training</span>
        <h2 className="fv-v2__section-title">Explore Our Courses</h2>
      </div>

      <div className="fv-v2__content">
        <div className="fv-v2__nav">
          <ArrowLeft onClick={prev} light />
          <span className="fv-v2__counter">{pad(active)} / {pad(TRAINING_SLIDES.length - 1)}</span>
          <ArrowRight onClick={next} light />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fv-v2__info"
          >
            <span className="fv-v2__tag">{slide.tag}</span>
            <h3 className="fv-v2__title">{slide.title}</h3>
            <p className="fv-v2__desc">{slide.description}</p>
            <Link to={slide.link} className="fv__btn fv__btn--light">
              <span>{slide.cta}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fv-v2__dots">
        {TRAINING_SLIDES.map((_, i) => (
          <button key={i} className={`fv-v2__dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </section>
  );
};


// ============================================
// V3 - MAGAZINE SPREAD
// Editorial two-column layout: big image left,
// elegant type right, page-number inspired nav
// ============================================
const FlyingV3 = () => {
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % TRAINING_SLIDES.length);
  const prev = () => setActive((p) => (p - 1 + TRAINING_SLIDES.length) % TRAINING_SLIDES.length);
  const slide = TRAINING_SLIDES[active];

  return (
    <section className="fv-section fv-v3">
      <div className="fv-v3__spread">
        {/* Left: Image */}
        <div className="fv-v3__image-side">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="fv-v3__image-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={slide.image} alt={slide.title} />
            </motion.div>
          </AnimatePresence>
          <div className="fv-v3__image-caption">
            <span className="fv-v3__page-num">{pad(active)}</span>
            <span className="fv-v3__sep" />
            <span className="fv-v3__tag">{slide.tag}</span>
          </div>
        </div>

        {/* Spine */}
        <div className="fv-v3__spine" />

        {/* Right: Content */}
        <div className="fv-v3__content-side">
          <div className="fv-v3__section-label">
            <span>Training Programme</span>
            <span className="fv-v3__section-line" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="fv-v3__text"
            >
              <span className="fv-v3__duration">{slide.duration}</span>
              <h3 className="fv-v3__title">{slide.title}</h3>
              <p className="fv-v3__desc">{slide.description}</p>
              <Link to={slide.link} className="fv__btn">
                <span>{slide.cta}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="fv-v3__nav">
            <ArrowLeft onClick={prev} />
            <div className="fv-v3__page-indicator">
              {TRAINING_SLIDES.map((_, i) => (
                <button key={i} className={`fv-v3__page-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                  {pad(i)}
                </button>
              ))}
            </div>
            <ArrowRight onClick={next} />
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V4 - ACCORDION PANELS
// Horizontal strips that expand on click,
// revealing image + description
// ============================================
const FlyingV4 = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="fv-section fv-v4">
      <SectionHeader />
      <div className="fv-v4__accordion">
        {TRAINING_SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={i}
              className={`fv-v4__panel ${isActive ? 'active' : ''}`}
              layout
              onClick={() => setActive(i)}
              style={{ flex: isActive ? 4 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fv-v4__panel-header">
                <span className="fv-v4__panel-num">{pad(i)}</span>
                <span className={`fv-v4__panel-title ${isActive ? 'active' : ''}`}>{slide.title}</span>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="fv-v4__panel-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="fv-v4__panel-image">
                      <img src={slide.image} alt={slide.title} />
                    </div>
                    <div className="fv-v4__panel-text">
                      <span className="fv-v4__panel-tag">{slide.tag}</span>
                      <p>{slide.description}</p>
                      <div className="fv-v4__panel-meta">
                        <span>{slide.duration}</span>
                      </div>
                      <Link to={slide.link} className="fv__btn">
                        <span>{slide.cta}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};


// ============================================
// V5 - BENTO GRID
// All courses visible in a responsive grid,
// hover to reveal details, clean cards
// ============================================
const FlyingV5 = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="fv-section fv-v5">
      <SectionHeader desc="From your first discovery flight to advanced commercial ratings." />
      <div className="fv-v5__grid">
        {TRAINING_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`fv-v5__card ${i === 0 ? 'fv-v5__card--large' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="fv-v5__card-image">
              <img src={slide.image} alt={slide.title} />
              <div className={`fv-v5__card-overlay ${hovered === i ? 'active' : ''}`}>
                <p className="fv-v5__card-desc">{slide.description}</p>
                <Link to={slide.link} className="fv__btn fv__btn--light fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
            <div className="fv-v5__card-footer">
              <span className="fv-v5__card-num">{pad(i)}</span>
              <div>
                <h3 className="fv-v5__card-title">{slide.title}</h3>
                <span className="fv-v5__card-duration">{slide.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// V6 - NUMBERED LIST + HOVER PREVIEW
// Ultra-minimal: big list of course names,
// hovering shows image that follows cursor
// ============================================
const FlyingV6 = () => {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <section className="fv-section fv-v6" ref={sectionRef} onMouseMove={handleMouseMove}>
      <SectionHeader />
      <div className="fv-v6__list">
        {TRAINING_SLIDES.map((slide, i) => (
          <Link
            key={i}
            to={slide.link}
            className={`fv-v6__item ${hovered === i ? 'active' : ''} ${hovered !== null && hovered !== i ? 'faded' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="fv-v6__item-num">{pad(i)}</span>
            <span className="fv-v6__item-title">{slide.title}</span>
            <span className="fv-v6__item-duration">{slide.duration}</span>
            <svg className="fv-v6__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Floating image preview */}
      <div
        className={`fv-v6__preview ${hovered !== null ? 'active' : ''}`}
        style={{ left: mousePos.x + 20, top: mousePos.y - 100 }}
      >
        {hovered !== null && <img src={TRAINING_SLIDES[hovered].image} alt="" />}
      </div>
    </section>
  );
};


// ============================================
// V7 - LEARNING PATH / TIMELINE
// Visual progression path from beginner to
// advanced, connected by a dotted line
// ============================================
const FlyingV7 = () => {
  const [active, setActive] = useState(null);
  const pathRef = useRef(null);
  const isInView = useInView(pathRef, { once: true, amount: 0.3 });

  return (
    <section className="fv-section fv-v7">
      <SectionHeader title="Your Flight Path" desc="A structured journey from first flight to certified professional." />
      <div className="fv-v7__path" ref={pathRef}>
        <div className={`fv-v7__line ${isInView ? 'active' : ''}`} />
        {TRAINING_SLIDES.map((slide, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              className={`fv-v7__node ${isLeft ? 'fv-v7__node--left' : 'fv-v7__node--right'} ${active === i ? 'active' : ''}`}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="fv-v7__node-dot" />
              <div className="fv-v7__node-card">
                <div className="fv-v7__node-header">
                  <span className="fv-v7__node-num">{pad(i)}</span>
                  <span className="fv-v7__node-tag">{slide.tag}</span>
                </div>
                <h3 className="fv-v7__node-title">{slide.title}</h3>
                <span className="fv-v7__node-duration">{slide.duration}</span>

                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fv-v7__node-expand"
                    >
                      <img src={slide.image} alt={slide.title} className="fv-v7__node-image" />
                      <p>{slide.description}</p>
                      <Link to={slide.link} className="fv__btn fv__btn--sm">
                        <span>{slide.cta}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};


// ============================================
// V8 - SPLIT SCREEN COMPARE
// Two courses shown side-by-side, selector
// buttons for each side, detailed comparison
// ============================================
const FlyingV8 = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(1);
  const slideL = TRAINING_SLIDES[left];
  const slideR = TRAINING_SLIDES[right];

  return (
    <section className="fv-section fv-v8">
      <SectionHeader title="Compare Courses" desc="Select two courses to see side-by-side." />
      <div className="fv-v8__selectors">
        {TRAINING_SLIDES.map((s, i) => (
          <button
            key={i}
            className={`fv-v8__sel ${i === left ? 'fv-v8__sel--left' : ''} ${i === right ? 'fv-v8__sel--right' : ''}`}
            onClick={() => {
              if (i !== right) setLeft(i);
              else { setLeft(right); setRight(left); }
            }}
            onContextMenu={(e) => { e.preventDefault(); if (i !== left) setRight(i); }}
          >
            <span className="fv-v8__sel-num">{pad(i)}</span>
            <span>{s.title}</span>
          </button>
        ))}
        <div className="fv-v8__sel-hint">Click to set left · Right-click to set right</div>
      </div>
      <div className="fv-v8__compare">
        <div className="fv-v8__side">
          <div className="fv-v8__side-image"><img src={slideL.image} alt={slideL.title} /></div>
          <div className="fv-v8__side-info">
            <span className="fv-v8__side-tag">{slideL.tag}</span>
            <h3>{slideL.title}</h3>
            <p>{slideL.description}</p>
            <div className="fv-v8__side-meta"><span>{slideL.duration}</span></div>
            <Link to={slideL.link} className="fv__btn fv__btn--sm"><span>{slideL.cta}</span></Link>
          </div>
        </div>
        <div className="fv-v8__vs">VS</div>
        <div className="fv-v8__side">
          <div className="fv-v8__side-image"><img src={slideR.image} alt={slideR.title} /></div>
          <div className="fv-v8__side-info">
            <span className="fv-v8__side-tag">{slideR.tag}</span>
            <h3>{slideR.title}</h3>
            <p>{slideR.description}</p>
            <div className="fv-v8__side-meta"><span>{slideR.duration}</span></div>
            <Link to={slideR.link} className="fv__btn fv__btn--sm"><span>{slideR.cta}</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V9 - FILMSTRIP CAROUSEL
// Horizontal filmstrip of all course thumbnails,
// selected one expands with full details above
// ============================================
const FlyingV9 = () => {
  const [active, setActive] = useState(0);
  const slide = TRAINING_SLIDES[active];
  const stripRef = useRef(null);

  useEffect(() => {
    if (stripRef.current) {
      const btn = stripRef.current.children[active];
      if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [active]);

  return (
    <section className="fv-section fv-v9">
      <SectionHeader />
      <div className="fv-v9__detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="fv-v9__detail-inner"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <div className="fv-v9__detail-image">
              <img src={slide.image} alt={slide.title} />
            </div>
            <div className="fv-v9__detail-content">
              <span className="fv-v9__detail-tag">{slide.tag}</span>
              <h3 className="fv-v9__detail-title">{slide.title}</h3>
              <p className="fv-v9__detail-desc">{slide.description}</p>
              <div className="fv-v9__detail-row">
                <span className="fv-v9__detail-duration">{slide.duration}</span>
                <Link to={slide.link} className="fv__btn fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fv-v9__strip" ref={stripRef}>
        {TRAINING_SLIDES.map((s, i) => (
          <button key={i} className={`fv-v9__thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
            <img src={s.image} alt={s.title} />
            <div className="fv-v9__thumb-overlay">
              <span className="fv-v9__thumb-num">{pad(i)}</span>
              <span className="fv-v9__thumb-name">{s.title}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="fv-v9__progress">
        <div className="fv-v9__progress-bar" style={{ width: `${((active + 1) / TRAINING_SLIDES.length) * 100}%` }} />
      </div>
    </section>
  );
};


// ============================================
// V10 - VERTICAL SCROLL REVEAL
// Each course section triggered by scroll,
// parallax images, staggered text entry
// ============================================
const ScrollCourse = ({ slide, index, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, once: false });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`fv-v10__course ${isLeft ? 'fv-v10__course--left' : 'fv-v10__course--right'}`}>
      <motion.div
        className="fv-v10__course-image"
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={slide.image} alt={slide.title} />
      </motion.div>
      <motion.div
        className="fv-v10__course-content"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="fv-v10__course-num">{pad(index)}</div>
        <span className="fv-v10__course-tag">{slide.tag}</span>
        <h3 className="fv-v10__course-title">{slide.title}</h3>
        <p className="fv-v10__course-desc">{slide.description}</p>
        <div className="fv-v10__course-row">
          <span className="fv-v10__course-duration">{slide.duration}</span>
          <Link to={slide.link} className="fv__btn fv__btn--sm">
            <span>{slide.cta}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </motion.div>
      {!isLast && <div className="fv-v10__connector" />}
    </div>
  );
};

const FlyingV10 = () => (
  <section className="fv-section fv-v10">
    <SectionHeader title="Your Flight Path" desc="Scroll through our training programme." />
    <div className="fv-v10__courses">
      {TRAINING_SLIDES.map((slide, i) => (
        <ScrollCourse key={i} slide={slide} index={i} isLast={i === TRAINING_SLIDES.length - 1} />
      ))}
    </div>
  </section>
);


// ============================================
// V11 - VERTICAL ACCORDION
// Like V4 but vertical bands — stacked rows that
// expand vertically on click. Image spans full width.
// ============================================
const FlyingV11 = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="fv-section fv-v11">
      <SectionHeader />
      <div className="fv-v11__stack">
        {TRAINING_SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={i}
              className={`fv-v11__row ${isActive ? 'active' : ''}`}
              animate={{ height: isActive ? 420 : 64 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(i)}
            >
              <div className="fv-v11__row-header">
                <span className="fv-v11__row-num">{pad(i)}</span>
                <h3 className="fv-v11__row-title">{slide.title}</h3>
                <span className="fv-v11__row-duration">{slide.duration}</span>
                <svg className={`fv-v11__chevron ${isActive ? 'open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="fv-v11__row-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <div className="fv-v11__row-image"><img src={slide.image} alt={slide.title} /></div>
                    <div className="fv-v11__row-content">
                      <span className="fv-v11__row-tag">{slide.tag}</span>
                      <p>{slide.description}</p>
                      <Link to={slide.link} className="fv__btn fv__btn--sm">
                        <span>{slide.cta}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};


// ============================================
// V12 - STAGGERED MASONRY
// Masonry-style cards at different heights,
// all visible. Scroll reveals each one with
// stagger. No hover needed — everything exposed.
// ============================================
const MasonryCard = ({ slide, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="fv-v12__card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fv-v12__card-image"><img src={slide.image} alt={slide.title} /></div>
      <div className="fv-v12__card-body">
        <div className="fv-v12__card-top">
          <span className="fv-v12__card-num">{pad(index)}</span>
          <span className="fv-v12__card-tag">{slide.tag}</span>
        </div>
        <h3 className="fv-v12__card-title">{slide.title}</h3>
        <p className="fv-v12__card-desc">{slide.description}</p>
        <div className="fv-v12__card-footer">
          <span className="fv-v12__card-duration">{slide.duration}</span>
          <Link to={slide.link} className="fv__btn fv__btn--sm">
            <span>{slide.cta}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const FlyingV12 = () => (
  <section className="fv-section fv-v12">
    <SectionHeader desc="From your first discovery flight to advanced commercial ratings." />
    <div className="fv-v12__masonry">
      {TRAINING_SLIDES.map((slide, i) => (
        <MasonryCard key={i} slide={slide} index={i} />
      ))}
    </div>
  </section>
);


// ============================================
// V13 - FULL-WIDTH STACKED SECTIONS
// Each course is a full-width section with image
// bg on one side and content on the other.
// Alternating layout. All visible on scroll.
// ============================================
const StackedSection = ({ slide, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`fv-v13__block ${isEven ? 'fv-v13__block--left' : 'fv-v13__block--right'}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="fv-v13__block-image"
        initial={{ clipPath: isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }}
        animate={isInView ? { clipPath: 'inset(0 0% 0 0%)' } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={slide.image} alt={slide.title} />
      </motion.div>
      <motion.div
        className="fv-v13__block-content"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="fv-v13__block-num">{pad(index)}</div>
        <span className="fv-v13__block-tag">{slide.tag}</span>
        <h3 className="fv-v13__block-title">{slide.title}</h3>
        <p className="fv-v13__block-desc">{slide.description}</p>
        <div className="fv-v13__block-row">
          <span className="fv-v13__block-duration">{slide.duration}</span>
          <Link to={slide.link} className="fv__btn fv__btn--sm">
            <span>{slide.cta}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FlyingV13 = () => (
  <section className="fv-section fv-v13">
    <SectionHeader title="Your Flight Path" desc="Scroll through our training programme." />
    {TRAINING_SLIDES.map((slide, i) => (
      <StackedSection key={i} slide={slide} index={i} />
    ))}
  </section>
);


// ============================================
// V14 - HORIZONTAL SCROLL CARDS
// Horizontally scrollable row of large cards.
// Snap-scroll. Each card is a full course
// with image + info.
// ============================================
const FlyingV14 = () => {
  const scrollRef = useRef(null);

  return (
    <section className="fv-section fv-v14">
      <SectionHeader />
      <div className="fv-v14__scroll" ref={scrollRef}>
        {TRAINING_SLIDES.map((slide, i) => (
          <div key={i} className="fv-v14__card">
            <div className="fv-v14__card-image"><img src={slide.image} alt={slide.title} /></div>
            <div className="fv-v14__card-body">
              <div className="fv-v14__card-header">
                <span className="fv-v14__card-num">{pad(i)}</span>
                <span className="fv-v14__card-tag">{slide.tag}</span>
              </div>
              <h3 className="fv-v14__card-title">{slide.title}</h3>
              <p className="fv-v14__card-desc">{slide.description}</p>
              <div className="fv-v14__card-footer">
                <span className="fv-v14__card-duration">{slide.duration}</span>
                <Link to={slide.link} className="fv__btn fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fv-v14__hint">
        <span>Scroll horizontally</span>
        <svg width="30" height="10" viewBox="0 0 30 10"><line x1="0" y1="5" x2="24" y2="5" stroke="#ccc" strokeWidth="1" /><polyline points="20 1 26 5 20 9" fill="none" stroke="#ccc" strokeWidth="1" /></svg>
      </div>
    </section>
  );
};


// ============================================
// V15 - DARK BENTO GRID
// Like V5 but dark theme with gold accents.
// Luxury feel. All visible. Hover reveals desc.
// ============================================
const FlyingV15 = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="fv-section fv-v15">
      <SectionHeader light title="Explore Our Courses" desc="From your first discovery flight to advanced commercial ratings." />
      <div className="fv-v15__grid">
        {TRAINING_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`fv-v15__card ${i === 0 ? 'fv-v15__card--hero' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="fv-v15__card-image">
              <img src={slide.image} alt={slide.title} />
              <div className={`fv-v15__card-overlay ${hovered === i ? 'active' : ''}`}>
                <p>{slide.description}</p>
                <Link to={slide.link} className="fv__btn fv__btn--light fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
            <div className="fv-v15__card-footer">
              <span className="fv-v15__card-num">{pad(i)}</span>
              <div>
                <h3 className="fv-v15__card-title">{slide.title}</h3>
                <span className="fv-v15__card-meta">{slide.tag} · {slide.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// V16 - OVERLAPPING CARDS STACK
// Cards physically overlapping, each slightly
// offset. Click/hover to "pull out" a card.
// ============================================
const FlyingV16 = () => {
  const [active, setActive] = useState(null);

  return (
    <section className="fv-section fv-v16">
      <SectionHeader />
      <div className="fv-v16__stack">
        {TRAINING_SLIDES.map((slide, i) => (
          <motion.div
            key={i}
            className={`fv-v16__card ${active === i ? 'active' : ''}`}
            animate={{
              x: active === i ? 30 : 0,
              y: active === i ? -10 : i * 8,
              scale: active === i ? 1.02 : 1,
              zIndex: active === i ? 20 : TRAINING_SLIDES.length - i,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActive(active === i ? null : i)}
            style={{ top: i * 60 }}
          >
            <div className="fv-v16__card-left">
              <div className="fv-v16__card-image"><img src={slide.image} alt={slide.title} /></div>
            </div>
            <div className="fv-v16__card-right">
              <div className="fv-v16__card-header">
                <span className="fv-v16__card-num">{pad(i)}</span>
                <span className="fv-v16__card-tag">{slide.tag}</span>
              </div>
              <h3 className="fv-v16__card-title">{slide.title}</h3>
              {active === i && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <p className="fv-v16__card-desc">{slide.description}</p>
                  <div className="fv-v16__card-row">
                    <span className="fv-v16__card-duration">{slide.duration}</span>
                    <Link to={slide.link} className="fv__btn fv__btn--sm">
                      <span>{slide.cta}</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// V17 - IMAGE GRID + SIDE DETAIL
// Thumbnail grid on the left, detail panel on
// the right. Click a thumbnail to see full info.
// ============================================
const FlyingV17 = () => {
  const [active, setActive] = useState(0);
  const slide = TRAINING_SLIDES[active];

  return (
    <section className="fv-section fv-v17">
      <SectionHeader />
      <div className="fv-v17__layout">
        <div className="fv-v17__thumbs">
          {TRAINING_SLIDES.map((s, i) => (
            <button key={i} className={`fv-v17__thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
              <img src={s.image} alt={s.title} />
              <div className="fv-v17__thumb-info">
                <span className="fv-v17__thumb-num">{pad(i)}</span>
                <span className="fv-v17__thumb-title">{s.title}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="fv-v17__detail">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="fv-v17__detail-inner"
            >
              <div className="fv-v17__detail-image"><img src={slide.image} alt={slide.title} /></div>
              <span className="fv-v17__detail-tag">{slide.tag}</span>
              <h3 className="fv-v17__detail-title">{slide.title}</h3>
              <p className="fv-v17__detail-desc">{slide.description}</p>
              <div className="fv-v17__detail-row">
                <span className="fv-v17__detail-duration">{slide.duration}</span>
                <Link to={slide.link} className="fv__btn fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V18 - ZIGZAG SCROLL
// Like V10 but tighter — image + content in
// a zigzag pattern with connecting diagonal
// lines. More compact, editorial feel.
// ============================================
const ZigzagItem = ({ slide, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`fv-v18__item ${isEven ? 'fv-v18__item--left' : 'fv-v18__item--right'}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fv-v18__item-image">
        <img src={slide.image} alt={slide.title} />
        <span className="fv-v18__item-num">{pad(index)}</span>
      </div>
      <div className="fv-v18__item-content">
        <span className="fv-v18__item-tag">{slide.tag} · {slide.duration}</span>
        <h3 className="fv-v18__item-title">{slide.title}</h3>
        <p className="fv-v18__item-desc">{slide.description}</p>
        <Link to={slide.link} className="fv__btn fv__btn--sm">
          <span>{slide.cta}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </motion.div>
  );
};

const V18_HSCROLL_TITLES = ['Commercial Pilot Licence', 'Self-Fly Hire', 'Night Rating', 'Tours of London'];
const V18_ZIGZAG_SLIDES = TRAINING_SLIDES.filter(s => !V18_HSCROLL_TITLES.includes(s.title));
const V18_HSCROLL_SLIDES = TRAINING_SLIDES.filter(s => V18_HSCROLL_TITLES.includes(s.title));

const FlyingV18 = () => {
  const scrollRef = useRef(null);

  return (
    <section className="fv-section fv-v18">
      <SectionHeader />
      <div className="fv-v18__zigzag">
        {V18_ZIGZAG_SLIDES.map((slide, i) => (
          <ZigzagItem key={i} slide={slide} index={i} />
        ))}
      </div>
      <div className="fv-v18__hscroll" ref={scrollRef}>
        {V18_HSCROLL_SLIDES.map((slide, i) => (
          <div key={i} className="fv-v14__card">
            <div className="fv-v14__card-image"><img src={slide.image} alt={slide.title} /></div>
            <div className="fv-v14__card-body">
              <div className="fv-v14__card-header">
                <span className="fv-v14__card-num">{pad(V18_ZIGZAG_SLIDES.length + i)}</span>
                <span className="fv-v14__card-tag">{slide.tag}</span>
              </div>
              <h3 className="fv-v14__card-title">{slide.title}</h3>
              <p className="fv-v14__card-desc">{slide.description}</p>
              <div className="fv-v14__card-footer">
                <span className="fv-v14__card-duration">{slide.duration}</span>
                <Link to={slide.link} className="fv__btn fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// V19 - FEATURE ROWS
// Each course as a clean horizontal row with
// image left, text right. Minimal dividers.
// All visible. Simple, elegant, scannable.
// ============================================
const FeatureRow = ({ slide, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="fv-v19__row"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="fv-v19__row-image"><img src={slide.image} alt={slide.title} /></div>
      <div className="fv-v19__row-content">
        <div className="fv-v19__row-header">
          <span className="fv-v19__row-num">{pad(index)}</span>
          <span className="fv-v19__row-tag">{slide.tag}</span>
          <span className="fv-v19__row-duration">{slide.duration}</span>
        </div>
        <h3 className="fv-v19__row-title">{slide.title}</h3>
        <p className="fv-v19__row-desc">{slide.description}</p>
        <Link to={slide.link} className="fv__btn fv__btn--sm">
          <span>{slide.cta}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </motion.div>
  );
};

const FlyingV19 = () => (
  <section className="fv-section fv-v19">
    <SectionHeader desc="From your first discovery flight to advanced commercial ratings." />
    <div className="fv-v19__rows">
      {TRAINING_SLIDES.map((slide, i) => (
        <FeatureRow key={i} slide={slide} index={i} />
      ))}
    </div>
  </section>
);


// ============================================
// V20 - INTERACTIVE MAP / PROGRESSION BAR
// Horizontal progression bar with nodes.
// Click a node to expand it below. Visual
// shows the journey from beginner to advanced.
// ============================================
const FlyingV20 = () => {
  const [active, setActive] = useState(0);
  const slide = TRAINING_SLIDES[active];

  return (
    <section className="fv-section fv-v20">
      <SectionHeader title="Your Flight Path" />
      <div className="fv-v20__bar">
        <div className="fv-v20__bar-line" />
        <div className="fv-v20__bar-progress" style={{ width: `${(active / (TRAINING_SLIDES.length - 1)) * 100}%` }} />
        {TRAINING_SLIDES.map((s, i) => (
          <button
            key={i}
            className={`fv-v20__node ${i === active ? 'active' : ''} ${i < active ? 'passed' : ''}`}
            style={{ left: `${(i / (TRAINING_SLIDES.length - 1)) * 100}%` }}
            onClick={() => setActive(i)}
          >
            <div className="fv-v20__node-dot" />
            <span className="fv-v20__node-label">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="fv-v20__detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="fv-v20__detail-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="fv-v20__detail-image"><img src={slide.image} alt={slide.title} /></div>
            <div className="fv-v20__detail-content">
              <div className="fv-v20__detail-header">
                <span className="fv-v20__detail-num">{pad(active)}</span>
                <span className="fv-v20__detail-tag">{slide.tag}</span>
              </div>
              <h3 className="fv-v20__detail-title">{slide.title}</h3>
              <p className="fv-v20__detail-desc">{slide.description}</p>
              <div className="fv-v20__detail-row">
                <span className="fv-v20__detail-duration">{slide.duration}</span>
                <Link to={slide.link} className="fv__btn fv__btn--sm">
                  <span>{slide.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};


// ============================================
// PICKER SETUP
// ============================================

const flyingVariations = [
  { id: 'v1-tabs-carousel', name: 'Tabbed Carousel (Current)', category: 'Current', desc: 'Numbered tabs, text|divider|image grid, arrow navigation, progress bar', Component: FlyingV1 },
  { id: 'v2-fullbleed-cards', name: 'Full Bleed Card Stack', category: 'Full Bleed', desc: 'Full-width image background with crossfade, overlaid course info, dot navigation', Component: FlyingV2 },
  { id: 'v3-magazine', name: 'Magazine Spread', category: 'Editorial', desc: 'Two-column editorial layout: large image left, elegant typography right, page-number nav', Component: FlyingV3 },
  { id: 'v4-accordion', name: 'Accordion Panels', category: 'Interactive', desc: 'Horizontal strips that expand on click, revealing course image + description', Component: FlyingV4 },
  { id: 'v5-bento', name: 'Bento Grid Gallery', category: 'Grid', desc: 'All courses visible as responsive grid cards, hover to reveal description', Component: FlyingV5 },
  { id: 'v6-list-hover', name: 'Numbered List + Hover Preview', category: 'Minimal', desc: 'Ultra-minimal list of course names with floating image that follows cursor', Component: FlyingV6 },
  { id: 'v7-timeline', name: 'Learning Path Timeline', category: 'Interactive', desc: 'Alternating left/right nodes connected by a vertical path line, click to expand', Component: FlyingV7 },
  { id: 'v8-compare', name: 'Side-by-Side Compare', category: 'Interactive', desc: 'Two courses shown side-by-side for detailed comparison', Component: FlyingV8 },
  { id: 'v9-filmstrip', name: 'Filmstrip Carousel', category: 'Carousel', desc: 'Horizontal thumbnail strip at bottom, selected course expands with full details above', Component: FlyingV9 },
  { id: 'v10-scroll-reveal', name: 'Vertical Scroll Reveal', category: 'Scroll', desc: 'Each course triggered by scroll with parallax images and staggered text animations', Component: FlyingV10 },
  { id: 'v11-vert-accordion', name: 'Vertical Accordion', category: 'Interactive', desc: 'Stacked rows that expand vertically on click, full-width image reveal', Component: FlyingV11 },
  { id: 'v12-masonry', name: 'Staggered Masonry', category: 'Grid', desc: 'Masonry-style cards at varied heights, scroll-triggered stagger reveal, all info exposed', Component: FlyingV12 },
  { id: 'v13-stacked-sections', name: 'Full-Width Stacked', category: 'Scroll', desc: 'Full-width alternating blocks with clip-path image reveal and slide-in text', Component: FlyingV13 },
  { id: 'v14-horizontal-cards', name: 'Horizontal Scroll Cards', category: 'Carousel', desc: 'Horizontally scrollable snap-scroll row of large course cards', Component: FlyingV14 },
  { id: 'v15-dark-bento', name: 'Dark Bento Grid', category: 'Grid', desc: 'Like V5 but dark theme with gold accents, luxury feel, hover reveals description', Component: FlyingV15 },
  { id: 'v16-overlapping', name: 'Overlapping Card Stack', category: 'Interactive', desc: 'Physically overlapping cards, click to pull one out, cascading depth effect', Component: FlyingV16 },
  { id: 'v17-grid-detail', name: 'Thumbnail Grid + Detail', category: 'Grid', desc: 'Clickable thumbnail grid on left, full detail panel on right', Component: FlyingV17 },
  { id: 'v18-zigzag', name: 'Zigzag Scroll', category: 'Scroll', desc: 'Tight zigzag pattern with scroll-triggered reveals, compact editorial feel', Component: FlyingV18 },
  { id: 'v19-feature-rows', name: 'Feature Rows', category: 'Scroll', desc: 'Clean horizontal rows, image left + text right, minimal dividers, all visible', Component: FlyingV19 },
  { id: 'v20-progress-bar', name: 'Progress Bar Navigator', category: 'Interactive', desc: 'Horizontal progression bar with clickable nodes, shows journey from beginner to advanced', Component: FlyingV20 },
];

const pickerSections = {
  current: flyingVariations.filter(h => h.category === 'Current'),
  fullbleed: flyingVariations.filter(h => h.category === 'Full Bleed'),
  editorial: flyingVariations.filter(h => h.category === 'Editorial'),
  interactive: flyingVariations.filter(h => h.category === 'Interactive'),
  grid: flyingVariations.filter(h => h.category === 'Grid'),
  minimal: flyingVariations.filter(h => h.category === 'Minimal'),
  carousel: flyingVariations.filter(h => h.category === 'Carousel'),
  scroll: flyingVariations.filter(h => h.category === 'Scroll'),
};

const filteredSections = Object.fromEntries(
  Object.entries(pickerSections).filter(([_, items]) => items.length > 0)
);

const tabs = [
  { key: 'current', label: 'Current', color: 'default' },
  { key: 'fullbleed', label: 'Full Bleed', color: 'blue' },
  { key: 'editorial', label: 'Editorial', color: 'orange' },
  { key: 'interactive', label: 'Interactive', color: 'green' },
  { key: 'grid', label: 'Grid', color: 'purple' },
  { key: 'minimal', label: 'Minimal', color: 'default' },
  { key: 'carousel', label: 'Carousel', color: 'blue' },
  { key: 'scroll', label: 'Scroll', color: 'green' },
].filter(tab => filteredSections[tab.key]);


// ============================================
// MAIN PAGE
// ============================================

function FlyingVariations() {
  const [current, setCurrent] = useState(flyingVariations[0]);

  const handleItemSelect = useCallback((item) => {
    setCurrent(item);
    window.scrollTo({ top: 0 });
  }, []);

  const CurrentComponent = current?.Component;

  return (
    <div className="fv-page">
      {CurrentComponent && <CurrentComponent />}

      <Picker
        sections={filteredSections}
        tabs={tabs}
        storageKey="hq-flying-variations"
        title="Course Section Variations"
        onItemSelect={handleItemSelect}
        initialTab="current"
      />

      <div className="fv-info">
        <div className="fv-info__badge">{current?.category}</div>
        <div className="fv-info__id">{current?.id}</div>
      </div>

      <style>{styles}</style>
    </div>
  );
}


// ============================================
// STYLES
// ============================================

const styles = `
  /* ===== PAGE ===== */
  .fv-page {
    position: relative;
    min-height: 100vh;
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #faf9f6;
    color: #1a1a1a;
  }
  .fv-info {
    position: fixed; top: 20px; right: 20px; z-index: 99999;
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .fv-info__badge {
    background: rgba(224,74,47,0.9); color: #fff; padding: 6px 12px;
    border-radius: 20px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .fv-info__id {
    font-family: 'Share Tech Mono', monospace; font-size: 10px;
    color: #999; letter-spacing: 0.05em;
  }

  /* ===== SHARED ===== */
  .fv-section {
    padding: 4rem 2rem 6rem;
    max-width: 100%;
    overflow: hidden;
  }
  .fv__header {
    text-align: center; margin-bottom: 3rem;
  }
  .fv__header--light { color: #fff; }
  .fv__header-divider {
    width: 60px; height: 1px; background: #e8e6e2;
    margin: 0 auto 1.5rem;
  }
  .fv__header--light .fv__header-divider { background: rgba(255,255,255,0.3); }
  .fv__header-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
    display: block; margin-bottom: 0.75rem;
  }
  .fv__header--light .fv__header-sub { color: rgba(255,255,255,0.5); }
  .fv__header-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700; text-transform: uppercase;
    margin: 0 0 1rem; color: #1a1a1a;
  }
  .fv__header--light .fv__header-title { color: #fff; }
  .fv__header-desc {
    font-size: 1rem; line-height: 1.7; color: #666;
    max-width: 550px; margin: 0 auto;
  }
  .fv__header--light .fv__header-desc { color: rgba(255,255,255,0.6); }

  .fv__arrow {
    padding: 0.75rem 1rem; border: none; background: transparent;
    cursor: pointer; color: #d1d5db; transition: color 0.3s ease;
  }
  .fv__arrow:hover { color: #111827; }
  .fv__arrow--light { color: rgba(255,255,255,0.4); }
  .fv__arrow--light:hover { color: #fff; }

  .fv__btn {
    position: relative; display: inline-flex; align-items: center;
    justify-content: space-between; gap: 1rem;
    padding: 0.75rem 1.5rem; background: transparent;
    color: #111827; text-decoration: none;
    font-size: 0.75rem; text-transform: uppercase;
    letter-spacing: 0.1em; overflow: hidden;
    transition: all 0.4s ease;
    border: 1px solid #111827; border-radius: 8px;
  }
  .fv__btn::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 0; height: 100%; background: #111827;
    transition: width 0.4s ease; z-index: 0; border-radius: 8px;
  }
  .fv__btn:hover::before { width: 100%; }
  .fv__btn:hover { color: #fff; }
  .fv__btn span, .fv__btn svg { position: relative; z-index: 1; }
  .fv__btn--light { color: #fff; border-color: rgba(255,255,255,0.4); }
  .fv__btn--light::before { background: #fff; }
  .fv__btn--light:hover { color: #111827; }
  .fv__btn--sm { padding: 0.5rem 1rem; font-size: 0.7rem; }

  /* ===== V1 - TABBED CAROUSEL ===== */
  .fv-v1 { background: #fff; }
  .fv-v1__carousel {
    max-width: 1000px; margin: 0 auto; background: #fff;
    padding: 2rem; border-radius: 16px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .fv-v1__tabs-wrap { position: relative; margin-bottom: 2rem; }
  .fv-v1__tabs-wrap::before,
  .fv-v1__tabs-wrap::after {
    content: ''; position: absolute; top: 0; bottom: 0;
    width: 40px; pointer-events: none; z-index: 1;
  }
  .fv-v1__tabs-wrap::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
  .fv-v1__tabs-wrap::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
  .fv-v1__tabs {
    display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none;
  }
  .fv-v1__tabs::-webkit-scrollbar { display: none; }
  .fv-v1__tab {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer;
  }
  .fv-v1__tab-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; font-weight: 600; color: #d1d5db;
  }
  .fv-v1__tab-title {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: #9ca3af; white-space: nowrap;
  }
  .fv-v1__tab.active {
    border-bottom: 1px solid #111827; margin-bottom: -0.75rem;
    padding-bottom: calc(0.5rem + 0.75rem - 1px);
  }
  .fv-v1__tab.active .fv-v1__tab-title { color: #111827; }
  .fv-v1__body { display: flex; align-items: center; gap: 1.5rem; }
  .fv-v1__main {
    flex: 1; display: grid; grid-template-columns: 1fr auto 1fr;
    gap: 2rem; align-items: stretch;
  }
  .fv-v1__divider { width: 1px; height: 120px; background: #e5e7eb; align-self: center; }
  .fv-v1__text { display: flex; align-items: center; }
  .fv-v1__text { position: relative; display: grid; }
  .fv-v1__slide {
    grid-area: 1 / 1; opacity: 0; pointer-events: none;
    display: flex; flex-direction: column; height: 100%;
    background: transparent; border-radius: 12px;
    padding: 1.5rem; border: 1px solid #e5e7eb;
    transition: opacity 0.3s ease;
  }
  .fv-v1__slide.active { opacity: 1; pointer-events: auto; }
  .fv-v1__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
  .fv-v1__num-wrap {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;
  }
  .fv-v1__num-wrap::before, .fv-v1__num-wrap::after {
    content: ''; width: 30px; height: 1px; background: #e5e7eb;
  }
  .fv-v1__inline-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 2.5rem; font-weight: 300; color: #d1d5db; line-height: 1;
  }
  .fv-v1__slide h3 {
    font-size: 1.25rem; font-weight: 500; margin: 0;
    text-transform: uppercase; text-align: center;
    color: #111827; letter-spacing: 0.1em;
  }
  .fv-v1__slide p {
    color: #6b7280; line-height: 1.7; margin: 0;
    padding: 10px 0 20px; font-size: 0.95rem; text-align: center;
  }
  .fv-v1__slide .fv__btn { margin-top: auto; }
  .fv-v1__image {
    position: relative; border-radius: 8px; overflow: hidden;
    border: 1px solid #e5e7eb; min-height: 280px;
  }
  .fv-v1__image img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; opacity: 0; transition: opacity 0.5s ease;
  }
  .fv-v1__image img.active { opacity: 1; }
  .fv-v1__progress { height: 1px; background: #e5e7eb; margin-top: 2rem; overflow: hidden; }
  .fv-v1__progress-bar { height: 100%; background: #111827; transition: width 0.4s ease; }

  /* ===== V2 - FULL BLEED ===== */
  .fv-v2 {
    position: relative; min-height: 85vh; background: #0a0a0a;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0; overflow: hidden;
  }
  .fv-v2__image-stack { position: absolute; inset: 0; }
  .fv-v2__bg { width: 100%; height: 100%; object-fit: cover; }
  .fv-v2__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
  }
  .fv-v2__top {
    position: absolute; top: 3rem; left: 50%; transform: translateX(-50%);
    text-align: center; z-index: 10;
  }
  .fv-v2__label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.5rem;
  }
  .fv-v2__section-title {
    font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em; color: #fff; margin: 0;
  }
  .fv-v2__content {
    position: relative; z-index: 10; padding: 3rem 4rem 4rem;
  }
  .fv-v2__nav {
    display: flex; align-items: center; gap: 2rem;
    margin-bottom: 2rem;
  }
  .fv-v2__counter {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4);
  }
  .fv-v2__tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.75rem;
  }
  .fv-v2__title {
    font-size: clamp(1.5rem, 4vw, 3rem); font-weight: 700;
    color: #fff; margin: 0 0 1rem; text-transform: uppercase;
    letter-spacing: -0.01em;
  }
  .fv-v2__desc {
    color: rgba(255,255,255,0.6); line-height: 1.7;
    font-size: 0.95rem; max-width: 550px; margin: 0 0 2rem;
  }
  .fv-v2__dots {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; z-index: 10;
  }
  .fv-v2__dot {
    width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);
    background: transparent; cursor: pointer; padding: 0; transition: all 0.3s ease;
  }
  .fv-v2__dot.active { background: #fff; border-color: #fff; }

  /* ===== V3 - MAGAZINE SPREAD ===== */
  .fv-v3 { background: #faf9f6; padding: 0; }
  .fv-v3__spread {
    display: grid; grid-template-columns: 1fr 1px 1fr;
    min-height: 80vh;
  }
  .fv-v3__image-side { position: relative; overflow: hidden; }
  .fv-v3__image-wrap { position: absolute; inset: 0; }
  .fv-v3__image-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v3__image-caption {
    position: absolute; bottom: 2rem; left: 2rem;
    display: flex; align-items: center; gap: 1rem; z-index: 5;
  }
  .fv-v3__page-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 2rem; font-weight: 300; color: #fff;
  }
  .fv-v3__sep { width: 30px; height: 1px; background: rgba(255,255,255,0.3); }
  .fv-v3__tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }
  .fv-v3__spine { background: #e8e6e2; }
  .fv-v3__content-side {
    display: flex; flex-direction: column; justify-content: center;
    padding: 3rem 3rem 3rem 4rem;
  }
  .fv-v3__section-label {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 2rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #999;
  }
  .fv-v3__section-line { flex: 1; height: 1px; background: #e8e6e2; }
  .fv-v3__duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
    display: block; margin-bottom: 1rem;
  }
  .fv-v3__title {
    font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.01em;
    color: #1a1a1a; margin: 0 0 1.5rem;
  }
  .fv-v3__desc {
    color: #666; line-height: 1.8; font-size: 0.95rem;
    margin: 0 0 2rem; max-width: 450px;
  }
  .fv-v3__nav {
    display: flex; align-items: center; gap: 1rem;
    margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e8e6e2;
  }
  .fv-v3__page-indicator {
    display: flex; gap: 0.25rem; flex: 1; justify-content: center;
  }
  .fv-v3__page-dot {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; color: #ccc; background: none;
    border: none; cursor: pointer; padding: 0.25rem 0.5rem;
    transition: color 0.3s ease;
  }
  .fv-v3__page-dot.active { color: #1a1a1a; }

  /* ===== V4 - ACCORDION ===== */
  .fv-v4 { background: #faf9f6; }
  .fv-v4__accordion {
    display: flex; gap: 2px; max-width: 1200px; margin: 0 auto;
    height: 500px;
  }
  .fv-v4__panel {
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 12px; overflow: hidden; cursor: pointer;
    display: flex; flex-direction: column;
    transition: flex 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
  }
  .fv-v4__panel-header {
    padding: 1.5rem 1rem;
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem;
  }
  .fv-v4__panel-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v4__panel-title {
    font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.1em; color: #999;
    writing-mode: vertical-rl; text-orientation: mixed;
    transition: all 0.3s ease;
  }
  .fv-v4__panel-title.active {
    writing-mode: horizontal-tb; font-size: 0.75rem; color: #1a1a1a;
  }
  .fv-v4__panel-content {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2rem; padding: 0 1.5rem 1.5rem; flex: 1;
    overflow: hidden;
  }
  .fv-v4__panel-image {
    border-radius: 8px; overflow: hidden;
  }
  .fv-v4__panel-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v4__panel-text { display: flex; flex-direction: column; }
  .fv-v4__panel-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; margin-bottom: 0.5rem;
  }
  .fv-v4__panel-text p {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1rem;
  }
  .fv-v4__panel-meta {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.1em; color: #999;
    margin-bottom: 1rem;
  }
  .fv-v4__panel-text .fv__btn { margin-top: auto; }

  /* ===== V5 - BENTO GRID ===== */
  .fv-v5 { background: #faf9f6; }
  .fv-v5__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 1rem; max-width: 1100px; margin: 0 auto;
  }
  .fv-v5__card--large { grid-column: span 2; grid-row: span 2; }
  .fv-v5__card {
    border-radius: 12px; overflow: hidden;
    border: 1px solid #e8e6e2; background: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .fv-v5__card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .fv-v5__card-image {
    position: relative; overflow: hidden;
    height: 200px;
  }
  .fv-v5__card--large .fv-v5__card-image { height: 100%; min-height: 350px; }
  .fv-v5__card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .fv-v5__card:hover .fv-v5__card-image img { transform: scale(1.05); }
  .fv-v5__card-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; flex-direction: column;
    justify-content: flex-end; padding: 1.5rem;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .fv-v5__card-overlay.active { opacity: 1; }
  .fv-v5__card-desc {
    color: rgba(255,255,255,0.8); font-size: 0.85rem;
    line-height: 1.6; margin: 0 0 1rem;
  }
  .fv-v5__card-footer {
    padding: 1rem 1.25rem; display: flex; gap: 1rem; align-items: center;
  }
  .fv-v5__card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v5__card-title {
    font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0; color: #1a1a1a;
  }
  .fv-v5__card-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== V6 - NUMBERED LIST ===== */
  .fv-v6 { background: #faf9f6; position: relative; }
  .fv-v6__list { max-width: 900px; margin: 0 auto; }
  .fv-v6__item {
    display: flex; align-items: center; gap: 2rem;
    padding: 2rem 1.5rem; border-bottom: 1px solid #e8e6e2;
    text-decoration: none; color: #1a1a1a;
    transition: all 0.3s ease; cursor: pointer;
  }
  .fv-v6__item:first-child { border-top: 1px solid #e8e6e2; }
  .fv-v6__item.faded { opacity: 0.3; }
  .fv-v6__item.active { padding-left: 2.5rem; }
  .fv-v6__item-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 2rem; font-weight: 300; color: #d1d5db;
    min-width: 50px;
    transition: color 0.3s ease;
  }
  .fv-v6__item.active .fv-v6__item-num { color: #1a1a1a; }
  .fv-v6__item-title {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.02em; flex: 1;
    transition: letter-spacing 0.3s ease;
  }
  .fv-v6__item.active .fv-v6__item-title { letter-spacing: 0.05em; }
  .fv-v6__item-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.1em; color: #999;
  }
  .fv-v6__item-arrow {
    color: #d1d5db; transition: all 0.3s ease;
  }
  .fv-v6__item.active .fv-v6__item-arrow {
    color: #1a1a1a; transform: translate(4px, -4px);
  }
  .fv-v6__preview {
    position: absolute; z-index: 100; pointer-events: none;
    width: 300px; height: 200px; border-radius: 8px;
    overflow: hidden; opacity: 0;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    transition: opacity 0.2s ease;
  }
  .fv-v6__preview.active { opacity: 1; }
  .fv-v6__preview img { width: 100%; height: 100%; object-fit: cover; }

  /* ===== V7 - TIMELINE PATH ===== */
  .fv-v7 { background: #faf9f6; }
  .fv-v7__path {
    position: relative; max-width: 800px; margin: 0 auto;
    padding: 2rem 0;
  }
  .fv-v7__line {
    position: absolute; left: 50%; top: 0; bottom: 0;
    width: 1px; background: #e8e6e2;
    transform: scaleY(0); transform-origin: top;
    transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fv-v7__line.active { transform: scaleY(1); }
  .fv-v7__node {
    display: flex; align-items: flex-start; gap: 2rem;
    margin-bottom: 2rem; position: relative;
    cursor: pointer;
  }
  .fv-v7__node--left { flex-direction: row; padding-right: 52%; }
  .fv-v7__node--right { flex-direction: row-reverse; padding-left: 52%; }
  .fv-v7__node-dot {
    position: absolute; left: 50%; top: 1.5rem;
    width: 12px; height: 12px; border-radius: 50%;
    background: #fff; border: 2px solid #e8e6e2;
    transform: translateX(-50%);
    transition: all 0.3s ease; z-index: 5;
  }
  .fv-v7__node.active .fv-v7__node-dot {
    background: #1a1a1a; border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(26,26,26,0.15);
  }
  .fv-v7__node-card {
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 12px; padding: 1.5rem;
    transition: box-shadow 0.3s ease; flex: 1;
  }
  .fv-v7__node.active .fv-v7__node-card {
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .fv-v7__node-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
  }
  .fv-v7__node-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.25rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v7__node-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; padding: 2px 8px;
    border: 1px solid #e8e6e2; border-radius: 4px;
  }
  .fv-v7__node-title {
    font-size: 1.1rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0; color: #1a1a1a;
  }
  .fv-v7__node-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
  }
  .fv-v7__node-expand { overflow: hidden; }
  .fv-v7__node-image {
    width: 100%; height: 150px; object-fit: cover;
    border-radius: 8px; margin: 1rem 0;
  }
  .fv-v7__node-expand p {
    color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1rem;
  }

  /* ===== V8 - COMPARE ===== */
  .fv-v8 { background: #faf9f6; }
  .fv-v8__selectors {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    justify-content: center; margin-bottom: 2rem;
    max-width: 900px; margin-left: auto; margin-right: auto;
  }
  .fv-v8__sel {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; padding: 0.5rem 1rem;
    border: 1px solid #e8e6e2; border-radius: 8px;
    background: #fff; cursor: pointer; display: flex; align-items: center;
    gap: 0.5rem; transition: all 0.3s ease; color: #999;
  }
  .fv-v8__sel--left { border-color: #1a1a1a; color: #1a1a1a; background: #f5f4f1; }
  .fv-v8__sel--right { border-color: #e04a2f; color: #e04a2f; background: #fef5f3; }
  .fv-v8__sel-num {
    font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #d1d5db;
  }
  .fv-v8__sel--left .fv-v8__sel-num { color: #1a1a1a; }
  .fv-v8__sel--right .fv-v8__sel-num { color: #e04a2f; }
  .fv-v8__sel-hint {
    width: 100%; text-align: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.1em; color: #ccc;
    text-transform: uppercase; margin-top: 0.5rem;
  }
  .fv-v8__compare {
    display: grid; grid-template-columns: 1fr auto 1fr;
    gap: 2rem; max-width: 1000px; margin: 0 auto;
    align-items: start;
  }
  .fv-v8__vs {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.2em; color: #d1d5db;
    align-self: center; padding: 1rem;
  }
  .fv-v8__side {
    background: #fff; border: 1px solid #e8e6e2; border-radius: 12px;
    overflow: hidden;
  }
  .fv-v8__side-image { height: 220px; overflow: hidden; }
  .fv-v8__side-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v8__side-info { padding: 1.5rem; }
  .fv-v8__side-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; display: block; margin-bottom: 0.5rem;
  }
  .fv-v8__side-info h3 {
    font-size: 1.1rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0 0 1rem; color: #1a1a1a;
  }
  .fv-v8__side-info p {
    color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1rem;
  }
  .fv-v8__side-meta {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.1em; color: #999;
    margin-bottom: 1rem;
  }

  /* ===== V9 - FILMSTRIP ===== */
  .fv-v9 { background: #fff; }
  .fv-v9__detail {
    max-width: 1000px; margin: 0 auto 2rem;
    border: 1px solid #e8e6e2; border-radius: 16px;
    overflow: hidden; background: #fff;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .fv-v9__detail-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 350px;
  }
  .fv-v9__detail-image { overflow: hidden; }
  .fv-v9__detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v9__detail-content {
    padding: 2.5rem; display: flex; flex-direction: column;
    justify-content: center;
  }
  .fv-v9__detail-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; display: block; margin-bottom: 0.75rem;
  }
  .fv-v9__detail-title {
    font-size: clamp(1.25rem, 2.5vw, 2rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.02em;
    margin: 0 0 1rem; color: #1a1a1a;
  }
  .fv-v9__detail-desc {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1.5rem;
  }
  .fv-v9__detail-row {
    display: flex; align-items: center; gap: 1.5rem; margin-top: auto;
  }
  .fv-v9__detail-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.1em; color: #999;
  }
  .fv-v9__strip {
    display: flex; gap: 0.5rem; max-width: 1000px; margin: 0 auto;
    padding: 0 0 0.5rem;
    overflow-x: auto; scrollbar-width: none;
  }
  .fv-v9__strip::-webkit-scrollbar { display: none; }
  .fv-v9__thumb {
    position: relative; flex-shrink: 0;
    width: 160px; height: 100px; border-radius: 8px;
    overflow: hidden; cursor: pointer; border: 2px solid transparent;
    transition: all 0.3s ease; padding: 0; background: none;
  }
  .fv-v9__thumb.active { border-color: #1a1a1a; }
  .fv-v9__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v9__thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0.5rem;
  }
  .fv-v9__thumb-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; color: rgba(255,255,255,0.5);
  }
  .fv-v9__thumb-name {
    font-size: 0.6rem; font-weight: 600; color: #fff;
    text-transform: uppercase; letter-spacing: 0.03em;
  }
  .fv-v9__progress {
    height: 1px; background: #e8e6e2; max-width: 1000px;
    margin: 1rem auto 0; overflow: hidden;
  }
  .fv-v9__progress-bar { height: 100%; background: #1a1a1a; transition: width 0.4s ease; }

  /* ===== V10 - SCROLL REVEAL ===== */
  .fv-v10 { background: #faf9f6; padding-bottom: 4rem; }
  .fv-v10__courses { max-width: 1000px; margin: 0 auto; }
  .fv-v10__course {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 3rem; align-items: center;
    padding: 3rem 0; position: relative;
  }
  .fv-v10__course--right { direction: rtl; }
  .fv-v10__course--right > * { direction: ltr; }
  .fv-v10__course-image { border-radius: 12px; overflow: hidden; }
  .fv-v10__course-image img { width: 100%; height: 280px; object-fit: cover; display: block; }
  .fv-v10__course-content { }
  .fv-v10__course-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 3rem; font-weight: 300; color: #e8e6e2;
    line-height: 1; margin-bottom: 0.5rem;
  }
  .fv-v10__course-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; display: block; margin-bottom: 0.75rem;
  }
  .fv-v10__course-title {
    font-size: 1.5rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.02em; margin: 0 0 1rem; color: #1a1a1a;
  }
  .fv-v10__course-desc {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1.5rem;
  }
  .fv-v10__course-row {
    display: flex; align-items: center; gap: 1.5rem;
  }
  .fv-v10__course-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.1em; color: #999;
  }
  .fv-v10__connector {
    position: absolute; bottom: 0; left: 50%;
    width: 1px; height: 3rem; background: #e8e6e2;
    transform: translateX(-50%);
  }

  /* ===== V11 - VERTICAL ACCORDION ===== */
  .fv-v11 { background: #faf9f6; }
  .fv-v11__stack { max-width: 900px; margin: 0 auto; }
  .fv-v11__row {
    border: 1px solid #e8e6e2; border-radius: 12px;
    margin-bottom: 0.5rem; overflow: hidden;
    background: #fff; cursor: pointer;
    transition: box-shadow 0.3s ease;
  }
  .fv-v11__row.active { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .fv-v11__row-header {
    display: flex; align-items: center; gap: 1.5rem;
    padding: 1rem 1.5rem; min-height: 64px; box-sizing: border-box;
  }
  .fv-v11__row-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.25rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v11__row-title {
    font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0; color: #1a1a1a; flex: 1;
  }
  .fv-v11__row-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.1em; color: #999;
  }
  .fv-v11__chevron {
    color: #ccc; transition: transform 0.3s ease;
  }
  .fv-v11__chevron.open { transform: rotate(180deg); color: #1a1a1a; }
  .fv-v11__row-body {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.5rem; padding: 0 1.5rem 1.5rem;
  }
  .fv-v11__row-image { border-radius: 8px; overflow: hidden; height: 220px; }
  .fv-v11__row-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v11__row-content { display: flex; flex-direction: column; }
  .fv-v11__row-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; margin-bottom: 0.5rem;
  }
  .fv-v11__row-content p {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1rem;
  }
  .fv-v11__row-content .fv__btn { margin-top: auto; }

  /* ===== V12 - MASONRY ===== */
  .fv-v12 { background: #faf9f6; }
  .fv-v12__masonry {
    columns: 2; column-gap: 1.5rem;
    max-width: 1000px; margin: 0 auto;
  }
  .fv-v12__card {
    break-inside: avoid; margin-bottom: 1.5rem;
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 12px; overflow: hidden;
  }
  .fv-v12__card:nth-child(odd) .fv-v12__card-image { height: 220px; }
  .fv-v12__card:nth-child(even) .fv-v12__card-image { height: 160px; }
  .fv-v12__card-image { overflow: hidden; }
  .fv-v12__card-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v12__card-body { padding: 1.25rem; }
  .fv-v12__card-top {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
  }
  .fv-v12__card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.25rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v12__card-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; border: 1px solid #e8e6e2; padding: 2px 8px; border-radius: 4px;
  }
  .fv-v12__card-title {
    font-size: 1rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0 0 0.75rem; color: #1a1a1a;
  }
  .fv-v12__card-desc {
    color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1rem;
  }
  .fv-v12__card-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .fv-v12__card-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== V13 - FULL-WIDTH STACKED ===== */
  .fv-v13 { background: #faf9f6; padding-bottom: 2rem; }
  .fv-v13__block {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 400px; margin-bottom: 1px;
  }
  .fv-v13__block--right { direction: rtl; }
  .fv-v13__block--right > * { direction: ltr; }
  .fv-v13__block-image { overflow: hidden; }
  .fv-v13__block-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .fv-v13__block-content {
    display: flex; flex-direction: column; justify-content: center;
    padding: 3rem;
  }
  .fv-v13__block-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 3rem; font-weight: 300; color: #e8e6e2; line-height: 1;
  }
  .fv-v13__block-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; margin: 0.5rem 0 0.75rem;
  }
  .fv-v13__block-title {
    font-size: 1.5rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.02em; margin: 0 0 1rem; color: #1a1a1a;
  }
  .fv-v13__block-desc {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1.5rem;
  }
  .fv-v13__block-row { display: flex; align-items: center; gap: 1.5rem; }
  .fv-v13__block-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== V14 - HORIZONTAL SCROLL CARDS ===== */
  .fv-v14 { background: #faf9f6; }
  .fv-v14__scroll {
    display: flex; gap: 1.5rem;
    overflow-x: auto; scroll-snap-type: x mandatory;
    padding: 0 2rem 1rem; scrollbar-width: none;
  }
  .fv-v14__scroll::-webkit-scrollbar { display: none; }
  .fv-v14__card {
    flex-shrink: 0; width: 260px;
    scroll-snap-align: start;
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 10px; overflow: hidden;
  }
  .fv-v14__card-image { height: 140px; overflow: hidden; }
  .fv-v14__card-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v14__card-body { padding: 1rem; }
  .fv-v14__card-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
  }
  .fv-v14__card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v14__card-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999;
  }
  .fv-v14__card-title {
    font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0 0 0.5rem; color: #1a1a1a;
  }
  .fv-v14__card-desc {
    color: #666; line-height: 1.5; font-size: 0.75rem; margin: 0 0 0.75rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .fv-v14__card-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .fv-v14__card-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
  }
  .fv-v14__hint {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #ccc;
  }

  /* ===== V15 - DARK BENTO ===== */
  .fv-v15 { background: #0a0a0a; }
  .fv-v15__grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem; max-width: 1100px; margin: 0 auto;
  }
  .fv-v15__card--hero { grid-column: span 2; grid-row: span 2; }
  .fv-v15__card {
    border-radius: 8px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    background: #111; transition: border-color 0.3s ease;
  }
  .fv-v15__card:hover { border-color: rgba(200,170,110,0.2); }
  .fv-v15__card-image { position: relative; overflow: hidden; height: 180px; }
  .fv-v15__card--hero .fv-v15__card-image { height: 100%; min-height: 320px; }
  .fv-v15__card-image img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease; filter: brightness(0.85);
  }
  .fv-v15__card:hover .fv-v15__card-image img { transform: scale(1.05); filter: brightness(1); }
  .fv-v15__card-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 1.25rem; opacity: 0; transition: opacity 0.3s ease;
  }
  .fv-v15__card-overlay.active { opacity: 1; }
  .fv-v15__card-overlay p {
    color: rgba(255,255,255,0.7); font-size: 0.8rem; line-height: 1.6;
    margin: 0 0 1rem;
  }
  .fv-v15__card-footer {
    padding: 0.75rem 1rem; display: flex; gap: 0.75rem; align-items: center;
  }
  .fv-v15__card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.25rem; font-weight: 300; color: rgba(200,170,110,0.4);
  }
  .fv-v15__card-title {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0; color: #fff;
  }
  .fv-v15__card-meta {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
  }

  /* ===== V16 - OVERLAPPING STACK ===== */
  .fv-v16 { background: #faf9f6; }
  .fv-v16__stack {
    position: relative; max-width: 800px; margin: 0 auto;
    height: 500px;
  }
  .fv-v16__card {
    position: absolute; left: 0; right: 0;
    display: grid; grid-template-columns: 200px 1fr;
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 12px; overflow: hidden; cursor: pointer;
    transition: box-shadow 0.3s ease;
  }
  .fv-v16__card.active { box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
  .fv-v16__card-left { }
  .fv-v16__card-image { height: 100%; min-height: 80px; }
  .fv-v16__card-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v16__card-right { padding: 1rem 1.5rem; }
  .fv-v16__card-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;
  }
  .fv-v16__card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v16__card-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999;
  }
  .fv-v16__card-title {
    font-size: 0.9rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0; color: #1a1a1a;
  }
  .fv-v16__card-desc {
    color: #666; line-height: 1.6; font-size: 0.8rem; margin: 0.5rem 0 0.75rem;
  }
  .fv-v16__card-row { display: flex; align-items: center; gap: 1rem; }
  .fv-v16__card-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== V17 - GRID + DETAIL ===== */
  .fv-v17 { background: #faf9f6; }
  .fv-v17__layout {
    display: grid; grid-template-columns: 280px 1fr;
    gap: 2rem; max-width: 1100px; margin: 0 auto;
  }
  .fv-v17__thumbs {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .fv-v17__thumb {
    position: relative; border-radius: 8px; overflow: hidden;
    height: 100px; cursor: pointer; border: 2px solid transparent;
    transition: border-color 0.3s ease; padding: 0; background: none;
  }
  .fv-v17__thumb.active { border-color: #1a1a1a; }
  .fv-v17__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v17__thumb-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding: 1.5rem 0.5rem 0.4rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .fv-v17__thumb-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; color: rgba(255,255,255,0.5);
  }
  .fv-v17__thumb-title {
    font-size: 0.5rem; font-weight: 600; color: #fff;
    text-transform: uppercase; letter-spacing: 0.03em;
  }
  .fv-v17__detail {
    background: #fff; border: 1px solid #e8e6e2;
    border-radius: 12px; overflow: hidden;
  }
  .fv-v17__detail-inner { padding: 0; }
  .fv-v17__detail-image { height: 250px; overflow: hidden; }
  .fv-v17__detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v17__detail-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; display: block; padding: 1.5rem 1.5rem 0;
  }
  .fv-v17__detail-title {
    font-size: 1.25rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0.5rem 0 0.75rem; color: #1a1a1a;
    padding: 0 1.5rem;
  }
  .fv-v17__detail-desc {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1.25rem;
    padding: 0 1.5rem;
  }
  .fv-v17__detail-row {
    display: flex; align-items: center; gap: 1.5rem;
    padding: 0 1.5rem 1.5rem;
  }
  .fv-v17__detail-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== V18 - ZIGZAG ===== */
  .fv-v18 { background: #faf9f6; }
  .fv-v18__zigzag { max-width: 900px; margin: 0 auto; }
  .fv-v18__item {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2rem; align-items: center;
    padding: 2rem 0; border-bottom: 1px solid #e8e6e2;
  }
  .fv-v18__item--right { direction: rtl; }
  .fv-v18__item--right > * { direction: ltr; }
  .fv-v18__item-image {
    position: relative; border-radius: 10px;
    overflow: hidden; height: 220px;
  }
  .fv-v18__item-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v18__item-num {
    position: absolute; top: 0.75rem; left: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem; font-weight: 300; color: rgba(255,255,255,0.5);
  }
  .fv-v18__item-content { }
  .fv-v18__item-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #999; display: block; margin-bottom: 0.5rem;
  }
  .fv-v18__item-title {
    font-size: 1.2rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0 0 0.75rem; color: #1a1a1a;
  }
  .fv-v18__item-desc {
    color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1.25rem;
  }

  /* V18 horizontal scroll cards at bottom */
  .fv-v18__hscroll {
    display: flex; gap: 1.5rem;
    overflow-x: auto; scroll-snap-type: x mandatory;
    padding: 2rem 2rem 1rem; scrollbar-width: none;
    max-width: 900px; margin: 0 auto;
  }
  .fv-v18__hscroll::-webkit-scrollbar { display: none; }
  .fv-v18__hscroll .fv-v14__card { min-width: 260px; }

  /* ===== V19 - FEATURE ROWS ===== */
  .fv-v19 { background: #faf9f6; }
  .fv-v19__rows { max-width: 1000px; margin: 0 auto; }
  .fv-v19__row {
    display: grid; grid-template-columns: 280px 1fr;
    gap: 2rem; align-items: center;
    padding: 2rem 0; border-bottom: 1px solid #e8e6e2;
  }
  .fv-v19__row-image { border-radius: 10px; overflow: hidden; height: 180px; }
  .fv-v19__row-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v19__row-content { }
  .fv-v19__row-header {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;
  }
  .fv-v19__row-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v19__row-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #999;
  }
  .fv-v19__row-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
    margin-left: auto;
  }
  .fv-v19__row-title {
    font-size: 1.1rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0 0 0.75rem; color: #1a1a1a;
  }
  .fv-v19__row-desc {
    color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1.25rem;
  }

  /* ===== V20 - PROGRESS BAR ===== */
  .fv-v20 { background: #faf9f6; }
  .fv-v20__bar {
    position: relative; max-width: 900px; margin: 0 auto 3rem;
    height: 60px;
  }
  .fv-v20__bar-line {
    position: absolute; top: 50%; left: 0; right: 0;
    height: 2px; background: #e8e6e2;
    transform: translateY(-50%);
  }
  .fv-v20__bar-progress {
    position: absolute; top: 50%; left: 0;
    height: 2px; background: #1a1a1a;
    transform: translateY(-50%);
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fv-v20__node {
    position: absolute; top: 50%; transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; background: none; border: none; cursor: pointer; padding: 0;
  }
  .fv-v20__node-dot {
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff; border: 2px solid #e8e6e2;
    transition: all 0.3s ease;
  }
  .fv-v20__node.active .fv-v20__node-dot {
    background: #1a1a1a; border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(26,26,26,0.15);
  }
  .fv-v20__node.passed .fv-v20__node-dot {
    background: #1a1a1a; border-color: #1a1a1a;
  }
  .fv-v20__node-label {
    font-size: 0.5rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: #999;
    white-space: nowrap; max-width: 80px;
    overflow: hidden; text-overflow: ellipsis;
    transition: color 0.3s ease;
  }
  .fv-v20__node.active .fv-v20__node-label { color: #1a1a1a; }
  .fv-v20__detail {
    max-width: 900px; margin: 0 auto;
    border: 1px solid #e8e6e2; border-radius: 16px;
    overflow: hidden; background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .fv-v20__detail-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 300px;
  }
  .fv-v20__detail-image { overflow: hidden; }
  .fv-v20__detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .fv-v20__detail-content {
    padding: 2rem; display: flex; flex-direction: column; justify-content: center;
  }
  .fv-v20__detail-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
  }
  .fv-v20__detail-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 2rem; font-weight: 300; color: #d1d5db;
  }
  .fv-v20__detail-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999;
  }
  .fv-v20__detail-title {
    font-size: 1.25rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.03em; margin: 0 0 0.75rem; color: #1a1a1a;
  }
  .fv-v20__detail-desc {
    color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0 0 1.25rem;
  }
  .fv-v20__detail-row { display: flex; align-items: center; gap: 1.5rem; }
  .fv-v20__detail-duration {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; color: #999; letter-spacing: 0.1em;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .fv-v1__main { grid-template-columns: 1fr; gap: 1.5rem; }
    .fv-v1__divider { display: none; }
    .fv-v1__image { min-height: 200px; }
    .fv-v1__body { flex-direction: column; gap: 1rem; }
    .fv-v1__body .fv__arrow { display: none; }
    .fv-v2__content { padding: 2rem; }
    .fv-v3__spread { grid-template-columns: 1fr; grid-template-rows: 40vh 1px 1fr; }
    .fv-v3__content-side { padding: 2rem; }
    .fv-v4__accordion { flex-direction: column; height: auto; }
    .fv-v4__panel-title { writing-mode: horizontal-tb !important; }
    .fv-v4__panel-content { grid-template-columns: 1fr; }
    .fv-v5__grid { grid-template-columns: 1fr; }
    .fv-v5__card--large { grid-column: span 1; grid-row: span 1; }
    .fv-v6__preview { display: none; }
    .fv-v6__item { gap: 1rem; padding: 1.5rem 1rem; }
    .fv-v7__node--left, .fv-v7__node--right { padding-left: 3rem; padding-right: 0; flex-direction: row; }
    .fv-v7__line { left: 1rem; }
    .fv-v7__node-dot { left: 1rem; }
    .fv-v8__compare { grid-template-columns: 1fr; }
    .fv-v8__vs { text-align: center; padding: 0.5rem; }
    .fv-v9__detail-inner { grid-template-columns: 1fr; }
    .fv-v9__detail-image { height: 200px; }
    .fv-v10__course { grid-template-columns: 1fr; gap: 1.5rem; }
    .fv-v10__course--right { direction: ltr; }
    .fv-v11__row-body { grid-template-columns: 1fr; }
    .fv-v11__row-image { height: 180px; }
    .fv-v12__masonry { columns: 1; }
    .fv-v13__block { grid-template-columns: 1fr; min-height: auto; }
    .fv-v13__block--right { direction: ltr; }
    .fv-v13__block-image { height: 250px; }
    .fv-v13__block-content { padding: 2rem; }
    .fv-v14__card { width: 280px; }
    .fv-v15__grid { grid-template-columns: 1fr; }
    .fv-v15__card--hero { grid-column: span 1; grid-row: span 1; }
    .fv-v16__stack { height: auto; }
    .fv-v16__card { position: relative; top: auto !important; grid-template-columns: 120px 1fr; margin-bottom: 0.5rem; }
    .fv-v17__layout { grid-template-columns: 1fr; }
    .fv-v17__thumbs { grid-template-columns: repeat(3, 1fr); }
    .fv-v17__thumb { height: 80px; }
    .fv-v18__item { grid-template-columns: 1fr; gap: 1rem; }
    .fv-v18__item--right { direction: ltr; }
    .fv-v18__item-image { height: 180px; }
    .fv-v19__row { grid-template-columns: 1fr; }
    .fv-v19__row-image { height: 200px; }
    .fv-v20__bar { height: auto; padding: 1rem 0; }
    .fv-v20__node { position: relative; left: auto !important; top: auto; transform: none; }
    .fv-v20__bar { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
    .fv-v20__bar-line, .fv-v20__bar-progress { display: none; }
    .fv-v20__detail-inner { grid-template-columns: 1fr; }
    .fv-v20__detail-image { height: 200px; }
  }
`;

export default FlyingVariations;
