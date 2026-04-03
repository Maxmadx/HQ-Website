/**
 * PPL (Private Pilot License) Details Page
 *
 * Editorial/magazine aesthetic with:
 * - Dramatic hero with large typography
 * - Journey timeline visualization
 * - Layered sections with parallax-like depth
 * - Data-rich but visually elegant presentation
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Animated counter component
function AnimatedNumber({ value, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const incrementTime = (duration * 1000) / end;
      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{isInView ? displayValue : 0}{suffix}
    </span>
  );
}

// Reveal on scroll component
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PPL() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Training stages data
  const trainingStages = [
    {
      phase: '01',
      title: 'Ground School',
      hours: '~100 hrs',
      description: 'Master the theoretical knowledge required for safe flight operations.',
      topics: ['Air Law', 'Navigation', 'Meteorology', 'Aircraft Systems', 'Human Performance', 'Flight Planning']
    },
    {
      phase: '02',
      title: 'Dual Training',
      hours: '35 hrs min',
      description: 'Fly with your instructor, learning the fundamental skills of helicopter control.',
      topics: ['Hovering', 'Transitions', 'Circuit Work', 'Emergencies', 'Navigation', 'Radio Communications']
    },
    {
      phase: '03',
      title: 'Solo Flight',
      hours: '10 hrs min',
      description: 'Take command of the aircraft alone, building confidence and competence.',
      topics: ['Solo Circuits', 'Solo Navigation', 'Cross-Country', 'Consolidation']
    },
    {
      phase: '04',
      title: 'Skills Test',
      hours: '~2 hrs',
      description: 'Demonstrate your abilities to a CAA examiner and earn your wings.',
      topics: ['Oral Examination', 'Flight Test', 'Emergency Procedures', 'Navigation Exercise']
    }
  ];

  // Requirements data
  const requirements = [
    { label: 'Minimum Age', value: '17', note: 'years old' },
    { label: 'Medical', value: 'Class 2', note: 'or LAPL medical' },
    { label: 'Flight Hours', value: '45', note: 'minimum total' },
    { label: 'Solo Hours', value: '10', note: 'minimum' },
    { label: 'Ground Exams', value: '9', note: 'subjects' },
    { label: 'Cross-Country', value: '185', note: 'km solo nav' }
  ];

  // FAQ items
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      q: 'How long does it take to get a PPL(H)?',
      a: 'Most students complete their PPL(H) in 6-12 months, depending on how frequently they can fly. Flying 2-3 times per week typically leads to faster progress and better retention of skills.'
    },
    {
      q: 'What medical certificate do I need?',
      a: 'You need at least a Class 2 medical certificate or a LAPL medical. We recommend obtaining your medical before starting training to avoid any surprises. We can recommend approved Aviation Medical Examiners.'
    },
    {
      q: 'Can I train year-round?',
      a: 'Yes! Helicopters can operate in a wide range of weather conditions. Training in varied conditions actually makes you a better, more confident pilot. However, we never compromise on safety.'
    },
    {
      q: 'What happens after I get my PPL(H)?',
      a: 'Your PPL(H) allows you to fly helicopters for private purposes. Many pilots continue to build hours, add ratings (night, type ratings), or work toward a commercial license. The sky is truly the limit.'
    },
    {
      q: 'Is financing available?',
      a: 'We offer flexible payment plans and can discuss financing options. Many students pay as they go rather than upfront. Contact us to discuss what works best for your situation.'
    }
  ];

  return (
    <div className="ppl-page">
      {/* ===== HERO SECTION ===== */}
      <section className="ppl-hero" ref={heroRef}>
        <motion.div
          className="ppl-hero__bg"
          style={{ scale: heroScale, y: heroY }}
        >
          <img
            src="/assets/images/training/helicopter-training.webp"
            alt="Helicopter flight training"
          />
          <div className="ppl-hero__overlay"></div>
        </motion.div>

        <motion.div className="ppl-hero__content" style={{ opacity: heroOpacity }}>
          <div className="ppl-hero__breadcrumb">
            <Link to="/">Home</Link>
            <span className="ppl-hero__breadcrumb-sep">/</span>
            <Link to="/training">Training</Link>
            <span className="ppl-hero__breadcrumb-sep">/</span>
            <span>PPL(H)</span>
          </div>

          <div className="ppl-hero__label">
            <span className="ppl-hero__label-line"></span>
            <span>Private Pilot License</span>
            <span className="ppl-hero__label-line"></span>
          </div>

          <h1 className="ppl-hero__title">
            <span className="ppl-hero__title-line">Your Wings</span>
            <span className="ppl-hero__title-line ppl-hero__title-line--accent">Await</span>
          </h1>

          <p className="ppl-hero__subtitle">
            The PPL(H) is your gateway to the freedom of helicopter flight.
            Learn to command the skies with HQ Aviation.
          </p>

          <div className="ppl-hero__stats">
            <div className="ppl-hero__stat">
              <span className="ppl-hero__stat-value">45</span>
              <span className="ppl-hero__stat-label">Min. Flight Hours</span>
            </div>
            <div className="ppl-hero__stat-divider"></div>
            <div className="ppl-hero__stat">
              <span className="ppl-hero__stat-value">9</span>
              <span className="ppl-hero__stat-label">Ground Exams</span>
            </div>
            <div className="ppl-hero__stat-divider"></div>
            <div className="ppl-hero__stat">
              <span className="ppl-hero__stat-value">6-12</span>
              <span className="ppl-hero__stat-label">Months Typical</span>
            </div>
          </div>

          <div className="ppl-hero__scroll">
            <span>Discover the journey</span>
            <div className="ppl-hero__scroll-line">
              <span></span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="ppl-intro">
        <div className="ppl-intro__container">
          <RevealSection className="ppl-intro__content">
            <span className="ppl-section-number">01</span>
            <h2 className="ppl-intro__title">
              The Private Pilot License is your first step into aviation
            </h2>
            <div className="ppl-intro__text">
              <p>
                The PPL(H) — Private Pilot License (Helicopters) — grants you the privilege
                to fly helicopters for private purposes. Whether you dream of weekend adventures,
                visiting friends across the country, or simply experiencing the pure joy of flight,
                this is where it all begins.
              </p>
              <p>
                At HQ Aviation, we've been training pilots since 2010. Our structured approach,
                experienced instructors, and modern fleet ensure you receive the highest quality
                training at Denham Aerodrome.
              </p>
            </div>
          </RevealSection>

          <RevealSection className="ppl-intro__image" delay={0.2}>
            <img
              src="/assets/images/gallery/flying/flying-.jpg"
              alt="Student pilot in training"
            />
            <div className="ppl-intro__image-caption">
              <span className="ppl-intro__image-caption-num">30+</span>
              <span>Years of training excellence</span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== REQUIREMENTS ===== */}
      <section className="ppl-requirements">
        <div className="ppl-requirements__container">
          <RevealSection>
            <div className="ppl-requirements__header">
              <span className="ppl-section-number">02</span>
              <h2>Entry Requirements</h2>
              <p>What you need to begin your PPL(H) journey</p>
            </div>
          </RevealSection>

          <div className="ppl-requirements__grid">
            {requirements.map((req, index) => (
              <RevealSection key={req.label} delay={index * 0.1}>
                <div className="ppl-requirement">
                  <span className="ppl-requirement__value">
                    <AnimatedNumber value={req.value.replace(/\D/g, '') || '0'} />
                    {req.value.replace(/\d/g, '')}
                  </span>
                  <span className="ppl-requirement__label">{req.label}</span>
                  <span className="ppl-requirement__note">{req.note}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRAINING JOURNEY ===== */}
      <section className="ppl-journey">
        <div className="ppl-journey__container">
          <RevealSection className="ppl-journey__header">
            <span className="ppl-section-number">03</span>
            <h2>The Training Journey</h2>
            <p>From first flight to skills test — your path to earning wings</p>
          </RevealSection>

          <div className="ppl-journey__timeline">
            {trainingStages.map((stage, index) => (
              <RevealSection
                key={stage.phase}
                className="ppl-stage"
                delay={index * 0.15}
              >
                <div className="ppl-stage__marker">
                  <span className="ppl-stage__phase">{stage.phase}</span>
                  <div className="ppl-stage__line"></div>
                </div>
                <div className="ppl-stage__content">
                  <div className="ppl-stage__header">
                    <h3 className="ppl-stage__title">{stage.title}</h3>
                    <span className="ppl-stage__hours">{stage.hours}</span>
                  </div>
                  <p className="ppl-stage__description">{stage.description}</p>
                  <div className="ppl-stage__topics">
                    {stage.topics.map(topic => (
                      <span key={topic} className="ppl-stage__topic">{topic}</span>
                    ))}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COSTS ===== */}
      <section className="ppl-costs">
        <div className="ppl-costs__container">
          <RevealSection className="ppl-costs__header">
            <span className="ppl-section-number">04</span>
            <h2>Investment</h2>
            <p>Transparent pricing for your training journey</p>
          </RevealSection>

          <div className="ppl-costs__grid">
            <RevealSection className="ppl-cost-card ppl-cost-card--featured">
              <div className="ppl-cost-card__badge">Most Popular</div>
              <h3 className="ppl-cost-card__title">Complete PPL(H) Package</h3>
              <div className="ppl-cost-card__price">
                <span className="ppl-cost-card__currency">£</span>
                <span className="ppl-cost-card__amount">15,000</span>
                <span className="ppl-cost-card__period">from</span>
              </div>
              <ul className="ppl-cost-card__features">
                <li>45 hours flight training minimum</li>
                <li>Ground school materials</li>
                <li>CAA exam fees (9 subjects)</li>
                <li>Skills test fee</li>
                <li>Landing fees included</li>
                <li>Headset loan</li>
              </ul>
              <p className="ppl-cost-card__note">
                *Based on minimum hours. Most students require 50-60 hours.
              </p>
              <Link to="/contact" className="ppl-cost-card__btn">
                Get Detailed Quote
              </Link>
            </RevealSection>

            <RevealSection className="ppl-cost-card" delay={0.1}>
              <h3 className="ppl-cost-card__title">Pay As You Fly</h3>
              <div className="ppl-cost-card__price">
                <span className="ppl-cost-card__currency">£</span>
                <span className="ppl-cost-card__amount">295</span>
                <span className="ppl-cost-card__period">per hour</span>
              </div>
              <ul className="ppl-cost-card__features">
                <li>R22 dual instruction rate</li>
                <li>Flexible scheduling</li>
                <li>No upfront commitment</li>
                <li>Pay per lesson</li>
                <li>Ground school separate</li>
              </ul>
              <p className="ppl-cost-card__note">
                R44 and R66 training available at different rates.
              </p>
              <Link to="/contact" className="ppl-cost-card__btn ppl-cost-card__btn--outline">
                View All Rates
              </Link>
            </RevealSection>

            <RevealSection className="ppl-cost-card" delay={0.2}>
              <h3 className="ppl-cost-card__title">Ground School Only</h3>
              <div className="ppl-cost-card__price">
                <span className="ppl-cost-card__currency">£</span>
                <span className="ppl-cost-card__amount">1,200</span>
                <span className="ppl-cost-card__period">complete</span>
              </div>
              <ul className="ppl-cost-card__features">
                <li>All 9 subject areas</li>
                <li>Study materials included</li>
                <li>Mock exams</li>
                <li>Classroom sessions</li>
                <li>Online resources</li>
              </ul>
              <p className="ppl-cost-card__note">
                Self-study options also available.
              </p>
              <Link to="/contact" className="ppl-cost-card__btn ppl-cost-card__btn--outline">
                Enquire Now
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="ppl-faq">
        <div className="ppl-faq__container">
          <RevealSection className="ppl-faq__header">
            <span className="ppl-section-number">05</span>
            <h2>Common Questions</h2>
          </RevealSection>

          <div className="ppl-faq__list">
            {faqs.map((faq, index) => (
              <RevealSection key={index} delay={index * 0.1}>
                <div
                  className={`ppl-faq__item ${openFaq === index ? 'ppl-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="ppl-faq__question">
                    <span>{faq.q}</span>
                    <span className="ppl-faq__icon">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </div>
                  <div className="ppl-faq__answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ppl-cta">
        <div className="ppl-cta__container">
          <RevealSection>
            <div className="ppl-cta__content">
              <h2 className="ppl-cta__title">
                <span>Ready to Begin</span>
                <span>Your Journey?</span>
              </h2>
              <p className="ppl-cta__text">
                Take the first step toward earning your wings. Book a discovery flight
                to experience helicopter flight firsthand, or contact us to discuss
                your training goals.
              </p>
              <div className="ppl-cta__buttons">
                <Link to="/training/trial-lessons" className="ppl-cta__btn ppl-cta__btn--primary">
                  Book Discovery Flight
                  <span className="ppl-cta__btn-arrow">→</span>
                </Link>
                <Link to="/contact" className="ppl-cta__btn ppl-cta__btn--secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </RevealSection>

          <div className="ppl-cta__image">
            <img
              src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp"
              alt="Helicopter in flight"
            />
          </div>
        </div>
      </section>

      <style>{`
        /* ===== PPL PAGE STYLES ===== */
        .ppl-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: var(--hq-background, #faf9f6);
          color: var(--hq-primary, #1a1a1a);
        }

        .ppl-section-number {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--hq-muted, #888);
          margin-bottom: 1rem;
        }

        /* ===== HERO ===== */
        .ppl-hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ppl-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .ppl-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ppl-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
        }

        .ppl-hero__content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: #fff;
          max-width: 900px;
          padding: 2rem;
        }

        .ppl-hero__breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          opacity: 0.7;
        }

        .ppl-hero__breadcrumb a {
          color: inherit;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .ppl-hero__breadcrumb a:hover {
          opacity: 1;
        }

        .ppl-hero__breadcrumb-sep {
          opacity: 0.5;
        }

        .ppl-hero__label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin-bottom: 1.5rem;
        }

        .ppl-hero__label-line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
        }

        .ppl-hero__title {
          margin: 0 0 1.5rem;
        }

        .ppl-hero__title-line {
          display: block;
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .ppl-hero__title-line--accent {
          color: var(--hq-accent, #E04A2F);
        }

        .ppl-hero__subtitle {
          font-size: 1.125rem;
          line-height: 1.7;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .ppl-hero__stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .ppl-hero__stat {
          text-align: center;
        }

        .ppl-hero__stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .ppl-hero__stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .ppl-hero__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.3);
        }

        .ppl-hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .ppl-hero__scroll span:first-child {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }

        .ppl-hero__scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .ppl-hero__scroll-line span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: #fff;
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% { top: -30%; }
          100% { top: 100%; }
        }

        /* ===== INTRODUCTION ===== */
        .ppl-intro {
          padding: 8rem 2rem;
          background: #fff;
        }

        .ppl-intro__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .ppl-intro__title {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 2rem;
        }

        .ppl-intro__text {
          color: var(--hq-body, #666);
          line-height: 1.8;
        }

        .ppl-intro__text p {
          margin-bottom: 1.5rem;
        }

        .ppl-intro__image {
          position: relative;
        }

        .ppl-intro__image img {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        .ppl-intro__image-caption {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: var(--hq-primary, #1a1a1a);
          color: #fff;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .ppl-intro__image-caption-num {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .ppl-intro__image-caption span:last-child {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        /* ===== REQUIREMENTS ===== */
        .ppl-requirements {
          padding: 8rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .ppl-requirements__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .ppl-requirements__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .ppl-requirements__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .ppl-requirements__header p {
          color: var(--hq-body, #666);
          font-size: 1.125rem;
        }

        .ppl-requirements__grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1px;
          background: var(--hq-border, #e8e6e2);
        }

        .ppl-requirement {
          background: #fff;
          padding: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ppl-requirement__value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--hq-primary, #1a1a1a);
        }

        .ppl-requirement__label {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ppl-requirement__note {
          font-size: 0.75rem;
          color: var(--hq-muted, #888);
        }

        /* ===== TRAINING JOURNEY ===== */
        .ppl-journey {
          padding: 8rem 2rem;
          background: #fff;
        }

        .ppl-journey__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .ppl-journey__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .ppl-journey__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .ppl-journey__header p {
          color: var(--hq-body, #666);
          font-size: 1.125rem;
        }

        .ppl-journey__timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .ppl-stage {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 2rem;
        }

        .ppl-stage__marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ppl-stage__phase {
          width: 50px;
          height: 50px;
          border: 2px solid var(--hq-primary, #1a1a1a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .ppl-stage__line {
          width: 2px;
          flex: 1;
          background: var(--hq-border, #e8e6e2);
          margin-top: 1rem;
        }

        .ppl-stage:last-child .ppl-stage__line {
          display: none;
        }

        .ppl-stage__content {
          padding-bottom: 3rem;
        }

        .ppl-stage__header {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ppl-stage__title {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .ppl-stage__hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.875rem;
          color: var(--hq-muted, #888);
        }

        .ppl-stage__description {
          color: var(--hq-body, #666);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .ppl-stage__topics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ppl-stage__topic {
          padding: 0.35rem 0.75rem;
          background: var(--hq-background, #faf9f6);
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* ===== COSTS ===== */
        .ppl-costs {
          padding: 8rem 2rem;
          background: var(--hq-primary, #1a1a1a);
          color: #fff;
        }

        .ppl-costs__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .ppl-costs__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .ppl-costs__header .ppl-section-number {
          color: rgba(255, 255, 255, 0.5);
        }

        .ppl-costs__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .ppl-costs__header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.125rem;
        }

        .ppl-costs__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .ppl-cost-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2.5rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .ppl-cost-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .ppl-cost-card--featured {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--hq-accent, #E04A2F);
        }

        .ppl-cost-card__badge {
          position: absolute;
          top: -12px;
          left: 2rem;
          background: var(--hq-accent, #E04A2F);
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ppl-cost-card__title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .ppl-cost-card__price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 2rem;
        }

        .ppl-cost-card__currency {
          font-size: 1.5rem;
          font-weight: 600;
          opacity: 0.7;
        }

        .ppl-cost-card__amount {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
        }

        .ppl-cost-card__period {
          font-size: 0.875rem;
          opacity: 0.7;
          margin-left: 0.5rem;
        }

        .ppl-cost-card__features {
          list-style: none;
          margin-bottom: 1.5rem;
        }

        .ppl-cost-card__features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .ppl-cost-card__features li:last-child {
          border-bottom: none;
        }

        .ppl-cost-card__note {
          font-size: 0.75rem;
          opacity: 0.6;
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .ppl-cost-card__btn {
          display: block;
          width: 100%;
          padding: 1rem;
          background: #fff;
          color: var(--hq-primary, #1a1a1a);
          text-align: center;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }

        .ppl-cost-card__btn:hover {
          background: var(--hq-accent, #E04A2F);
          color: #fff;
        }

        .ppl-cost-card__btn--outline {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .ppl-cost-card__btn--outline:hover {
          background: #fff;
          color: var(--hq-primary, #1a1a1a);
          border-color: #fff;
        }

        /* ===== FAQ ===== */
        .ppl-faq {
          padding: 8rem 2rem;
          background: #fff;
        }

        .ppl-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .ppl-faq__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .ppl-faq__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
        }

        .ppl-faq__list {
          display: flex;
          flex-direction: column;
        }

        .ppl-faq__item {
          border-bottom: 1px solid var(--hq-border, #e8e6e2);
          cursor: pointer;
        }

        .ppl-faq__question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          font-size: 1.125rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .ppl-faq__item:hover .ppl-faq__question {
          color: var(--hq-accent, #E04A2F);
        }

        .ppl-faq__icon {
          font-size: 1.5rem;
          font-weight: 300;
          width: 30px;
          text-align: center;
        }

        .ppl-faq__answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
        }

        .ppl-faq__item--open .ppl-faq__answer {
          max-height: 300px;
          padding-bottom: 1.5rem;
        }

        .ppl-faq__answer p {
          color: var(--hq-body, #666);
          line-height: 1.8;
        }

        /* ===== CTA ===== */
        .ppl-cta {
          position: relative;
          padding: 8rem 2rem;
          background: var(--hq-background, #faf9f6);
          overflow: hidden;
        }

        .ppl-cta__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .ppl-cta__title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .ppl-cta__title span {
          display: block;
        }

        .ppl-cta__title span:last-child {
          color: var(--hq-accent, #E04A2F);
        }

        .ppl-cta__text {
          color: var(--hq-body, #666);
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .ppl-cta__buttons {
          display: flex;
          gap: 1rem;
        }

        .ppl-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .ppl-cta__btn--primary {
          background: var(--hq-primary, #1a1a1a);
          color: #fff;
        }

        .ppl-cta__btn--primary:hover {
          background: var(--hq-accent, #E04A2F);
        }

        .ppl-cta__btn--secondary {
          background: transparent;
          color: var(--hq-primary, #1a1a1a);
          border: 1px solid var(--hq-border, #e8e6e2);
        }

        .ppl-cta__btn--secondary:hover {
          border-color: var(--hq-primary, #1a1a1a);
        }

        .ppl-cta__btn-arrow {
          transition: transform 0.3s ease;
        }

        .ppl-cta__btn:hover .ppl-cta__btn-arrow {
          transform: translateX(4px);
        }

        .ppl-cta__image {
          position: relative;
        }

        .ppl-cta__image img {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .ppl-requirements__grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .ppl-costs__grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }

          .ppl-intro__container,
          .ppl-cta__container {
            grid-template-columns: 1fr;
          }

          .ppl-intro__image {
            order: -1;
          }

          .ppl-cta__image {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .ppl-requirements__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ppl-hero__stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .ppl-hero__stat-divider {
            width: 40px;
            height: 1px;
          }

          .ppl-stage {
            grid-template-columns: 50px 1fr;
            gap: 1rem;
          }

          .ppl-stage__phase {
            width: 40px;
            height: 40px;
            font-size: 0.75rem;
          }

          .ppl-cta__buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .ppl-requirements__grid {
            grid-template-columns: 1fr;
          }

          .ppl-intro__image-caption {
            right: 0;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default PPL;
