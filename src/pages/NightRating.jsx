/**
 * NIGHT RATING PAGE
 *
 * A comprehensive page for pilots who want to extend their flying
 * privileges beyond sunset with a Night Rating qualification.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Theme: Dark starfield (inspired by FloatingStars component)
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import styles for Header/Navigation
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import Seo from '../components/seo/Seo';
import { buildCourse, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

/**
 * NIGHT RATING PAGE HEADER COMPONENT
 * Spotlight animation header consistent with other final pages
 * Uses light-on-dark colors for the dark-themed hero
 */
function NightRatingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);
      setColorDark(scrollY > 300);
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      {/* Menu Panel */}
      <HqMenuPanel open={menuOpen} onClose={closeMenu} />

      {/* Menu Button */}
      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Header with Spotlight */}
      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`
        }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left"></div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="Header-branding-logo"
                loading="lazy"
                decoding="async"
                width={405}
                height={245}
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/expeditions" className="Header-nav-folder-item">Worldwide Expeditions</Link>
                    <Link to="/expeditions/calendar" className="Header-nav-folder-item">HQ Trips</Link>
                    <Link to="/services" className="Header-nav-folder-item">Ferry Flights</Link>
                  </span>
                </span>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// Animated reveal wrapper
function Reveal({ children, delay = 0, direction = 'up', duration = 0.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Generate random stars for the hero starfield
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }
  return stars;
}

function NightRating() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const nrGridRef = useRef(null);
  const [nrActiveCard, setNrActiveCard] = useState(0);

  // Enquiry form state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enqName, setEnqName] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqLicence, setEnqLicence] = useState('');
  const [enqHours, setEnqHours] = useState('');
  const [enqMessage, setEnqMessage] = useState('');

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    if (!enqName || !enqEmail) { setEnquiryError('Name and email are required.'); return; }
    setEnquirySubmitting(true);
    setEnquiryError('');
    try {
      const message = [
        enqLicence ? `Current licence: ${enqLicence}` : '',
        enqHours ? `Total flight hours: ${enqHours}` : '',
        enqMessage ? `Message: ${enqMessage}` : '',
      ].filter(Boolean).join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enqName,
          email: enqEmail,
          phone: enqPhone,
          subject: 'Night Rating Enquiry',
          message,
          source: 'night-rating-cta',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setEnquirySubmitted(true);
    } catch {
      setEnquiryError('Something went wrong. Please try again or call us directly.');
    } finally {
      setEnquirySubmitting(false);
    }
  }
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Memoize stars so they don't regenerate on re-render
  const stars = useMemo(() => generateStars(100), []);

  // Training process steps
  const processSteps = [
    {
      num: '01',
      title: 'Ground School',
      duration: '1-2 Days',
      description: 'Comprehensive theory covering night operations, visual illusions, spatial disorientation, physiological factors, equipment requirements, and flight planning considerations specific to night flying.',
    },
    {
      num: '02',
      title: 'Dual Night Circuits',
      duration: '2-3 Hours',
      description: 'Circuit work at Denham Aerodrome with its excellent lighting systems. Learn to judge height and distance using runway lights, develop night scan patterns, and practise approaches and landings in altered visual conditions.',
    },
    {
      num: '03',
      title: 'Night Navigation',
      duration: '2-3 Hours',
      description: 'Cross-country navigation exercises learning to read a new landscape of lights: towns, motorways, and illuminated features. Includes flight to and from another aerodrome and emergency procedures training.',
    },
    {
      num: '04',
      title: 'Skills Test',
      duration: '1-2 Hours',
      description: 'Final assessment with a CAA examiner demonstrating your ability to handle all aspects of night operations safely. Upon passing, the Night Rating is entered in your licence.',
    },
  ];

  const { faqs } = useFaqs('night-rating', { visibleOnly: true });

  // Prerequisites
  const prerequisites = [
    { icon: '01', label: 'PPL(H) Holder', description: 'Valid Private Pilot Licence for Helicopters' },
    { icon: '02', label: '100 Hours Total', description: 'Minimum total flight time accumulated' },
    { icon: '03', label: '60 Hours PIC', description: 'As Pilot in Command, demonstrating experience' },
    { icon: '04', label: 'Medical Certificate', description: 'Valid Class 2 medical or LAPL medical' },
  ];

  return (
    <div className="nr">
      <Seo
        title="Helicopter Night Rating — UK Helicopter Training"
        description="Night flying rating in Robinson R44 or R66 from Denham — 5h dual instruction."
        jsonLd={[
          buildCourse({
            name: 'Night Rating (Helicopter)',
            description: 'Night flying rating in Robinson R44 or R66 from Denham, 5h dual instruction.',
            url: `${SITE_URL}/training/night-rating`,
            courseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'in-person',
              location: 'Denham Aerodrome, UK',
            },
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Training', path: '/training/night-rating' },
            { name: 'Night Rating', path: '/training/night-rating' },
          ]),
        ]}
      />
      <NightRatingHeader />

      {/* ========== HERO SECTION — Dark Starfield ========== */}
      <section ref={heroRef} className="nr-hero">
        {/* Starfield background */}
        <div className="nr-hero__stars">
          {stars.map((star) => (
            <div
              key={star.id}
              className="nr-star"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div className="nr-hero__moon" />

        <motion.div
          className="nr-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="nr-hero__left">
            <motion.span
              className="nr-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Advanced Training
            </motion.span>

            <div className="nr-hero__headline">
              <motion.span
                className="nr-hero__word nr-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                NIGHT
              </motion.span>
              <motion.span
                className="nr-hero__word nr-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                RATING
              </motion.span>
            </div>

            <motion.div
              className="nr-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Night Rating Badge Card */}
            <motion.div
              className="nr-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="nr-hero__badge-header">
                <span className="nr-hero__badge-label">Qualification</span>
                <span className="nr-hero__badge-type">NIGHT RATING</span>
              </div>
              <div className="nr-hero__badge-content">
                <div className="nr-hero__badge-stat">
                  <span className="nr-hero__badge-num">5</span>
                  <span className="nr-hero__badge-desc">Min Flight Hours</span>
                </div>
                <div className="nr-hero__badge-divider" />
                <div className="nr-hero__badge-stat">
                  <span className="nr-hero__badge-num">100</span>
                  <span className="nr-hero__badge-desc">Hrs Post-Licence</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="nr-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Extend your flying beyond sunset. The Night Rating opens a new dimension of aviation,
              cities glittering below, smooth air, quiet radio, and experiences that daylight flying simply cannot match.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== OVERVIEW SECTION ========== */}
      <section className="nr-overview">
        <div className="nr-overview__container">
          <Reveal>
            <div className="nr-overview__header">
              <span className="nr-pre-text">Fly After Dark</span>
              <h2>
                <span className="nr-text--dark">Extend</span>{' '}
                <span className="nr-text--mid">Your</span>{' '}
                <span className="nr-text--light">Horizons</span>
              </h2>
              <p>
                The Night Rating is an additional qualification that allows Private Pilot Licence
                holders to exercise the privileges of their licence during the hours of darkness.
                Without this rating, PPL holders are restricted to flight from thirty minutes
                before sunrise to thirty minutes after sunset. The Night Rating removes this
                limitation, opening up the full twenty-four hours of the clock to your flying.
              </p>
            </div>
          </Reveal>

          <div
            className="nr-overview__grid"
            ref={nrGridRef}
            onScroll={() => {
              const el = nrGridRef.current;
              if (!el) return;
              const total = el.scrollWidth - el.clientWidth;
              const idx = Math.round((el.scrollLeft / total) * 2);
              setNrActiveCard(Math.max(0, Math.min(2, idx)));
            }}
          >
            <Reveal delay={0} duration={0.3}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">01</span>
                <h3>Practical Flexibility</h3>
                <p>
                  No longer must you rush to complete a flight before sunset or cancel because
                  winter daylight hours are too short. Cross-country flights that would be
                  impossible in a single winter day become feasible. Evening departures and
                  arrivals open up entirely new possibilities.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05} duration={0.3}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">02</span>
                <h3>A Different World</h3>
                <p>
                  London viewed from a helicopter at night becomes a living map of light and
                  shadow, the Thames a dark ribbon winding through illuminated streets. The peace of
                  night flying, the radio quieter, the airspace less congested, offers a meditative
                  quality many pilots find profoundly satisfying.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} duration={0.3}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">03</span>
                <h3>Sharper Skills</h3>
                <p>
                  Night flying demands greater precision, more thorough planning, and heightened
                  situational awareness. Pilots who complete a Night Rating invariably report
                  that their daylight flying improves as well. The disciplines learned at night
                  carry over into all operations.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="nr-overview__dots">
            {[0, 1, 2].map(i => (
              <span key={i} className={`nr-overview__dot${nrActiveCard === i ? ' nr-overview__dot--active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== REQUIREMENTS SECTION ========== */}
      <section className="nr-prereq">
        <div className="nr-prereq__container">
          <Reveal>
            <div className="nr-section-header">
              <span className="nr-pre-text">Before You Begin</span>
              <h2>
                <span className="nr-text--dark">Prerequisites</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-prereq__grid">
            {prerequisites.map((prereq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="nr-prereq__card">
                  <div className="nr-prereq__icon">{prereq.icon}</div>
                  <div className="nr-prereq__text">
                    <h4>{prereq.label}</h4>
                    <p>{prereq.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ========== TRAINING PROCESS ========== */}
      <section className="nr-process">
        <div className="nr-process__container">
          <Reveal>
            <div className="nr-section-header nr-section-header--light">
              <span className="nr-pre-text nr-pre-text--light">The Journey</span>
              <h2>
                <span className="nr-text--white">Training</span>{' '}
                <span className="nr-text--white-mid">Process</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="nr-process__step">
                  <div className="nr-process__step-num">{step.num}</div>
                  <div className="nr-process__step-content">
                    <div className="nr-process__step-header">
                      <h4>{step.title}</h4>
                      <span className="nr-process__step-duration">{step.duration}</span>
                    </div>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="nr-faq" data-cms-section="faqs-night-rating">
        <div className="nr-faq__container">
          <Reveal>
            <div className="nr-section-header">
              <span className="nr-pre-text">Common Questions</span>
              <h2>
                <span className="nr-text--dark">Frequently</span>{' '}
                <span className="nr-text--mid">Asked</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`nr-faq__item ${openFaq === i ? 'nr-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="nr-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="nr-faq__content">
                    <h4>
                      {faq.question}
                      <span className="nr-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="nr-faq__answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {!showAllFaqs && faqs.length > 6 && (
            <button className="nr-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="nr-cta">
        <div className="nr-cta__inner">
          <div className="nr-cta__stars">
            {stars.slice(0, 40).map((star) => (
              <div
                key={`cta-${star.id}`}
                className="nr-star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity * 0.6,
                  animationDelay: star.animationDelay,
                  animationDuration: star.animationDuration,
                }}
              />
            ))}
          </div>
          <div className="nr-cta__content">
            <Reveal>
              <span className="nr-pre-text nr-pre-text--light">Ready to Fly at Night?</span>
              <h2>
                <span className="nr-text--white">Discover the</span>{' '}
                <span className="nr-text--white-mid">Night Sky</span>
              </h2>
              <p>
                Contact our training team to discuss the Night Rating, review your logbook,
                and check whether you meet the prerequisites. Training is typically conducted
                during winter months when early darkness makes scheduling practical.
              </p>

              {!enquiryOpen && !enquirySubmitted && (
                <div className="nr-cta__buttons">
                  <button
                    type="button"
                    className="nr-btn nr-btn--primary nr-btn--white"
                    onClick={() => setEnquiryOpen(true)}
                  >
                    Enquire Now
                  </button>
                  <Link to="/training" className="nr-cta__link">
                    View All Training
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              )}

              {enquiryOpen && !enquirySubmitted && (
                <form className="nr-enquiry-form" onSubmit={handleEnquirySubmit}>
                  <div className="nr-enquiry-form__header">
                    <span className="nr-enquiry-form__badge">Night Rating Enquiry</span>
                    <button type="button" className="nr-enquiry-form__back" onClick={() => { setEnquiryOpen(false); setEnquiryError(''); }}>
                      ← Back
                    </button>
                  </div>

                  <div className="nr-enquiry-form__row">
                    <div className="nr-enquiry-form__field">
                      <label className="nr-enquiry-form__label">Name <span className="nr-enquiry-form__required">*</span></label>
                      <input className="nr-enquiry-form__input" type="text" placeholder="Full name" value={enqName} onChange={e => setEnqName(e.target.value)} required />
                    </div>
                    <div className="nr-enquiry-form__field">
                      <label className="nr-enquiry-form__label">Email <span className="nr-enquiry-form__required">*</span></label>
                      <input className="nr-enquiry-form__input" type="email" placeholder="you@example.com" value={enqEmail} onChange={e => setEnqEmail(e.target.value)} required />
                    </div>
                    <div className="nr-enquiry-form__field">
                      <label className="nr-enquiry-form__label">Phone</label>
                      <input className="nr-enquiry-form__input" type="tel" placeholder="+44" value={enqPhone} onChange={e => setEnqPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="nr-enquiry-form__row">
                    <div className="nr-enquiry-form__field">
                      <label className="nr-enquiry-form__label">Current Licence</label>
                      <select className="nr-enquiry-form__input nr-enquiry-form__select" value={enqLicence} onChange={e => setEnqLicence(e.target.value)}>
                        <option value="">Select licence</option>
                        <option value="Student Pilot">Student Pilot</option>
                        <option value="PPL(H)">PPL(H)</option>
                        <option value="CPL(H)">CPL(H)</option>
                        <option value="ATPL(H)">ATPL(H)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="nr-enquiry-form__field">
                      <label className="nr-enquiry-form__label">Total Flight Hours</label>
                      <input className="nr-enquiry-form__input" type="number" placeholder="e.g. 120" min="0" value={enqHours} onChange={e => setEnqHours(e.target.value)} />
                    </div>
                  </div>

                  <div className="nr-enquiry-form__field">
                    <label className="nr-enquiry-form__label">Message <span className="nr-enquiry-form__optional">(optional)</span></label>
                    <textarea className="nr-enquiry-form__input nr-enquiry-form__textarea" placeholder="Any questions, preferred dates, or other details…" rows={3} value={enqMessage} onChange={e => setEnqMessage(e.target.value)} />
                  </div>

                  {enquiryError && <p className="nr-enquiry-form__error">{enquiryError}</p>}

                  <div className="nr-enquiry-form__footer">
                    <button type="submit" className="nr-btn nr-btn--primary" disabled={enquirySubmitting}>
                      {enquirySubmitting ? 'Sending…' : 'Send Enquiry'}
                    </button>
                  </div>
                </form>
              )}

              {enquirySubmitted && (
                <div className="nr-enquiry-form__success">
                  <div className="nr-enquiry-form__success-icon">✓</div>
                  <p className="nr-enquiry-form__success-title">Enquiry Received</p>
                  <p className="nr-enquiry-form__success-body">We'll be in touch shortly. In the meantime feel free to call us on <a href="tel:+441895833373">+44 1895 833 373</a>.</p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== STARFIELD KEYFRAMES ===== */
        @keyframes nr-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* ===== BASE ===== */
        .nr {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: var(--hq-background, #faf9f6);
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .nr-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .nr-pre-text--light {
          color: rgba(255,255,255,0.5);
        }

        .nr-text--dark { color: #1a1a1a; }
        .nr-text--mid { color: #4a4a4a; }
        .nr-text--light { color: #7a7a7a; }
        .nr-text--white { color: #ffffff; }
        .nr-text--white-mid { color: rgba(255,255,255,0.6); }

        .nr-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .nr-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .nr-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .nr-section-header--light p {
          color: rgba(255,255,255,0.7);
        }

        /* Stars */
        .nr-star {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.3);
          animation: nr-twinkle ease-in-out infinite;
          pointer-events: none;
        }

        /* Buttons */
        .nr-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          text-align: center;
        }

        .nr-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .nr-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .nr-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .nr-btn--white:hover {
          background: #f0f0f0;
        }

        /* ===== HERO — Dark Starfield ===== */
        .nr-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: linear-gradient(180deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%);
        }

        .nr-hero__stars {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nr-hero__moon {
          position: absolute;
          top: 12%;
          right: 12%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fffde7 0%, #ffecb3 50%, #fff8e1 100%);
          box-shadow: 0 0 60px 15px rgba(255, 253, 231, 0.2);
          opacity: 0.85;
          z-index: 1;
        }

        .nr-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
        }

        .nr-hero__left {
          max-width: 550px;
        }

        .nr-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 1.5rem;
        }

        .nr-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .nr-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .nr-hero__word--1 {
          background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nr-hero__word--2 {
          background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nr-hero__divider-line {
          width: 80px;
          height: 2px;
          background: rgba(255,255,255,0.4);
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .nr-hero__sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.8;
          max-width: 420px;
        }

        /* Hero Badge Card — Dark variant */
        .nr-hero__badge {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          max-width: 280px;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .nr-hero__badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nr-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }

        .nr-hero__badge-type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          background: rgba(255,255,255,0.1);
          padding: 0.15rem 0.5rem;
        }

        .nr-hero__badge-content {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem;
        }

        .nr-hero__badge-stat {
          text-align: center;
        }

        .nr-hero__badge-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .nr-hero__badge-desc {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nr-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
        }

        /* ===== OVERVIEW SECTION ===== */
        .nr-overview {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .nr-overview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .nr-overview__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .nr-overview__header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .nr-overview__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .nr-overview__header p {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .nr-overview__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .nr-overview__card {
          background: var(--hq-background, #faf9f6);
          padding: 2rem;
          border-left: 3px solid #1a1a1a;
        }

        .nr-overview__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
          margin-bottom: 1rem;
          display: block;
        }

        .nr-overview__card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
        }

        .nr-overview__card p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .nr-overview__dots {
          display: none;
        }

        /* ===== PREREQUISITES ===== */
        .nr-prereq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .nr-prereq__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .nr-prereq__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          align-items: stretch;
        }

        .nr-prereq__grid > div {
          height: 100%;
        }

        .nr-prereq__card {
          display: flex;
          align-items: center;
          height: 100%;
          box-sizing: border-box;
          gap: 1.25rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
        }

        .nr-prereq__icon {
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .nr-prereq__text h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }

        .nr-prereq__text p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

/* ===== PROCESS SECTION ===== */
        .nr-process {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .nr-process__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .nr-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .nr-process__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nr-process__step:last-child {
          border-bottom: none;
        }

        .nr-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          padding-top: 0.2rem;
        }

        .nr-process__step-content {
          flex: 1;
        }

        .nr-process__step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .nr-process__step-header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
        }

        .nr-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
        }

        .nr-process__step-content p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }

/* ===== FAQ SECTION ===== */
        .nr-faq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .nr-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .nr-faq__list {
          display: flex;
          flex-direction: column;
        }

        .nr-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .nr-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .nr-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .nr-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .nr-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .nr-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .nr-faq__content {
          flex: 1;
        }

        .nr-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .nr-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .nr-faq__answer {
          overflow: hidden;
        }

        .nr-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== CTA SECTION ===== */
        .nr-cta {
          background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0a0a12 100%);
          position: relative;
          overflow: hidden;
        }

        .nr-cta__inner {
          position: relative;
          min-height: 400px;
        }

        .nr-cta__stars {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nr-cta__content {
          position: relative;
          z-index: 1;
          padding: 5rem 2rem;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }

        .nr-cta__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0.5rem 0 1.5rem;
        }

        .nr-cta__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .nr-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .nr-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .nr-cta__link:hover {
          color: #fff;
        }

        .nr-cta__link svg {
          transition: transform 0.3s ease;
        }

        .nr-cta__link:hover svg {
          transform: translateX(3px);
        }

        /* ===== ENQUIRY FORM ===== */
        .nr-enquiry-form {
          margin-top: 2rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          text-align: left;
        }

        .nr-enquiry-form__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .nr-enquiry-form__badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
        }

        .nr-enquiry-form__back {
          background: none;
          border: none;
          color: #bbb;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .nr-enquiry-form__back:hover { color: #1a1a1a; }

        .nr-enquiry-form__row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .nr-enquiry-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .nr-enquiry-form__row .nr-enquiry-form__field {
          margin-bottom: 0;
        }

        .nr-enquiry-form__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
        }

        .nr-enquiry-form__required { color: #c00; }
        .nr-enquiry-form__optional { color: #bbb; font-size: 0.55rem; text-transform: none; letter-spacing: 0; font-family: 'Space Grotesk', sans-serif; }

        .nr-enquiry-form__input {
          background: #faf9f6;
          border: 1px solid #e0ddd8;
          padding: 0.65rem 0.85rem;
          color: #1a1a1a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.88rem;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .nr-enquiry-form__input::placeholder { color: #bbb; }
        .nr-enquiry-form__input:focus { outline: none; border-color: #999; }
        .nr-enquiry-form__input option { background: #fff; color: #1a1a1a; }

        .nr-enquiry-form__select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.85rem center;
          padding-right: 2.5rem;
          cursor: pointer;
        }

        .nr-enquiry-form__textarea { resize: vertical; min-height: 80px; }

        .nr-enquiry-form__error {
          color: #c00;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          margin-bottom: 0.75rem;
        }

        .nr-enquiry-form__footer {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
        }

        @media (max-width: 768px) {
          .nr-enquiry-form__footer .nr-btn {
            width: 100%;
          }
        }

        .nr-enquiry-form__success {
          margin-top: 2rem;
          padding: 2rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-align: center;
        }

        .nr-enquiry-form__success-icon {
          width: 44px;
          height: 44px;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: #1a1a1a;
          margin: 0 auto 1rem;
        }

        .nr-enquiry-form__success-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }

        .nr-enquiry-form__success-body {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .nr-enquiry-form__success-body a {
          color: #1a1a1a;
          text-decoration: none;
        }
        .nr-enquiry-form__success-body a:hover { color: #333; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .nr-overview__grid {
            grid-template-columns: 1fr;
          }

          .nr-prereq__grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 768px) {
          .nr-hero__content {
            padding: 6rem 2rem 2rem;
            justify-content: center;
          }

          .nr-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .nr-hero__headline {
            align-items: center;
          }

          .nr-hero__divider-line {
            margin: 1.5rem auto;
          }

          .nr-hero__badge {
            margin: 0 auto 1.5rem;
          }

          .nr-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .nr-process__step {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nr-cta__buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .nr-overview__grid {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 0;
            padding-bottom: 0.5rem;
            align-items: stretch;
          }
          .nr-overview__grid::-webkit-scrollbar { display: none; }
          .nr-overview__grid > div {
            flex: 0 0 100%;
            scroll-snap-align: center;
            display: flex;
            flex-direction: column;
          }
          .nr-overview__grid .nr-overview__card {
            flex: 1;
          }
          .nr-overview__dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding-top: 1rem;
          }
          .nr-overview__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ccc8c1;
            transition: background 0.2s;
          }
          .nr-overview__dot--active {
            background: #1a1a1a;
          }
        }
      `}</style>
    </div>
  );
}

export default NightRating;
