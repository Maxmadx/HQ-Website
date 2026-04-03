/**
 * FINAL PPL PAGE - Redesigned
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #2563eb (accent)
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';

// Animated reveal wrapper
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Floating particle animation
function FloatingParticles() {
  return (
    <div className="fppl-particles">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fppl-particle"
          initial={{ opacity: 0, y: 100, x: Math.random() * 100 - 50 }}
          animate={{
            opacity: [0, 0.3, 0],
            y: [100, -100],
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
          style={{ left: `${10 + i * 15}%` }}
        />
      ))}
    </div>
  );
}

// Animated counter
function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FinalPPL() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const faqs = [
    {
      q: 'How long does it take to get a PPL(H)?',
      a: 'Typically 6-12 months depending on your schedule and weather conditions. Most students train 1-2 times per week, building skills progressively.',
    },
    {
      q: 'Do I need any previous flying experience?',
      a: 'No prior experience is needed. We teach you everything from the very basics during your first lesson. Everyone starts somewhere.',
    },
    {
      q: 'Can I fly in winter?',
      a: 'Yes, weather permitting! In fact, experiencing challenging weather conditions with a qualified instructor is one of the best times to fly. One of the greatest benefits of training in the UK is that it makes better pilots—pilots who are more conscientious and truly understand the effects of weather and wind on flying as part of their core training process.',
      featured: true,
    },
    {
      q: 'What medical certificate do I need?',
      a: 'You\'ll need a Class 2 medical or LAPL medical. It\'s a straightforward examination from a CAA-approved doctor, similar to a thorough check-up.',
    },
    {
      q: 'Is financing available?',
      a: 'Yes, we offer various payment structures to suit your circumstances. Speak with us about spreading the cost of training.',
    },
  ];

  return (
    <div className="fppl">
      {/* ========== HERO: Split Layout with Boarding Pass ========== */}
      <section ref={heroRef} className="fppl-hero">
        {/* Background image */}
        <motion.div
          className="fppl-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="" />
        </motion.div>
        <div className="fppl-hero__overlay" />

        {/* Main content */}
        <motion.div
          className="fppl-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="fppl-hero__left">
            <motion.span
              className="fppl-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              PPL(H) TRAINING
            </motion.span>

            <div className="fppl-hero__headline">
              <motion.span
                className="fppl-hero__word fppl-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                LEARN
              </motion.span>
              <motion.span
                className="fppl-hero__word fppl-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                TO
              </motion.span>
              <motion.span
                className="fppl-hero__word fppl-hero__word--3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                FLY
              </motion.span>
            </div>

            <motion.div
              className="fppl-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Boarding Pass - Compact with Perforation */}
            <motion.div
              className="fppl-hero__ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fppl-hero__ticket-main">
                <div className="fppl-hero__ticket-header">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="fppl-hero__ticket-logo" />
                  <span className="fppl-hero__ticket-type">BOARDING PASS</span>
                  <span className="fppl-hero__ticket-class">PPL(H)</span>
                </div>
                <div className="fppl-hero__ticket-route">
                  <div className="fppl-hero__ticket-point">
                    <span className="fppl-hero__ticket-code">STUDENT</span>
                    <span className="fppl-hero__ticket-city">Beginner</span>
                  </div>
                  <div className="fppl-hero__ticket-arrow">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                      <path d="M0 4H22M22 4L18 1M22 4L18 7" stroke="#999" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div className="fppl-hero__ticket-point">
                    <span className="fppl-hero__ticket-code">PILOT</span>
                    <span className="fppl-hero__ticket-city">Licensed</span>
                  </div>
                </div>
              </div>
              <div className="fppl-hero__ticket-perf">
                <div className="fppl-hero__ticket-perf-hole fppl-hero__ticket-perf-hole--top"></div>
                <div className="fppl-hero__ticket-perf-hole fppl-hero__ticket-perf-hole--bottom"></div>
              </div>
              <div className="fppl-hero__ticket-stub">
                <div className="fppl-hero__ticket-stub-row">
                  <div><span className="fppl-hero__ticket-lbl">HRS</span><span>45+</span></div>
                  <div><span className="fppl-hero__ticket-lbl">GATE</span><span>EGLD</span></div>
                  <div><span className="fppl-hero__ticket-lbl">SEAT</span><span>1A</span></div>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="fppl-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              The journey of a lifetime starts with a single lesson. Master the art of helicopter flight with expert instructors.
            </motion.p>
          </div>
        </motion.div>

      </section>

      {/* ========== INTRO: Instructor Network ========== */}
      <section className="fppl-intro">
        <div className="fppl-intro__container">
          <Reveal>
            <div className="fppl-intro__header">
              <span className="fppl-pre-text">World-Class Training</span>
              <h2>
                <span className="fppl-text--dark">Training</span>{' '}
                <span className="fppl-text--mid">Under</span>{' '}
                <span className="fppl-text--light">Extraordinary Instructors</span>
              </h2>
              <p>
                If the quality of instructing counts for anything—and it certainly does—you will learn at an
                exceptionally high standard, develop no bad habits, and become a better pilot at a much faster
                pace with our rigorous, hands-on training program.
              </p>
            </div>
          </Reveal>

          <div className="fppl-intro__network">
            <Reveal delay={0.2}>
              <div className="fppl-intro__q-card">
                <div className="fppl-intro__q-image">
                  <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith" />
                </div>
                <div className="fppl-intro__q-info">
                  <h3>Quentin Smith</h3>
                  <span className="fppl-intro__q-title">Founder & Chief Instructor</span>
                  <div className="fppl-intro__q-stats">
                    <div className="fppl-intro__q-stat">
                      <span className="fppl-intro__stat-value"><AnimatedNumber value="18000" />+</span>
                      <span className="fppl-intro__stat-label">Instructing Hours</span>
                    </div>
                    <div className="fppl-intro__divider" />
                    <div className="fppl-intro__q-stat">
                      <span className="fppl-intro__stat-value"><AnimatedNumber value="35" />+</span>
                      <span className="fppl-intro__stat-label">Years Teaching</span>
                    </div>
                  </div>
                  <p>
                    Quentin has dedicated his life to teaching pilots to fly to the highest possible standard.
                    World Helicopter Champion and the first person to fly a helicopter to the South Pole and back.
                    Every instructor at HQ has been trained by him.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="fppl-intro__team">
                <span className="fppl-intro__team-label">Our Instructor Team</span>
                <div className="fppl-intro__instructors">
                  {[
                    { title: 'Senior FI', num: '01' },
                    { title: 'Flight Instructor', num: '02' },
                    { title: 'Type Instructor', num: '03' },
                    { title: 'New FI', num: '04' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="fppl-intro__instructor"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                    >
                      <span className="fppl-intro__instructor-num">{item.num}</span>
                      <span className="fppl-intro__instructor-title">{item.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== GROUND SCHOOL: 9 Subjects ========== */}
      <section className="fppl-ground">
        <div className="fppl-ground__container">
          <Reveal>
            <div className="fppl-section-header">
              <span className="fppl-pre-text">Theory Training</span>
              <h2>
                <span className="fppl-text--dark">9</span>{' '}
                <span className="fppl-text--mid">Ground School</span>{' '}
                <span className="fppl-text--light">Subjects</span>
              </h2>
            </div>
          </Reveal>

          <div className="fppl-ground__grid">
            {[
              { num: '01', title: 'Air Law', desc: 'Regulations & procedures' },
              { num: '02', title: 'Navigation', desc: 'Charts & flight planning' },
              { num: '03', title: 'Meteorology', desc: 'Weather understanding' },
              { num: '04', title: 'Human Performance', desc: 'Physiology & psychology' },
              { num: '05', title: 'Principles of Flight', desc: 'Aerodynamics' },
              { num: '06', title: 'Operations', desc: 'Flight procedures' },
              { num: '07', title: 'Performance', desc: 'Weight & balance' },
              { num: '08', title: 'Communications', desc: 'Radio procedures' },
              { num: '09', title: 'Aircraft Knowledge', desc: 'Systems & engines' },
            ].map((subject, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div
                  className="fppl-ground__card"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <span className="fppl-ground__num">{subject.num}</span>
                  <div className="fppl-ground__text">
                    <h4>{subject.title}</h4>
                    <p>{subject.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOURS BREAKDOWN ========== */}
      <section className="fppl-hours">
        <div className="fppl-hours__container">
          <Reveal>
            <div className="fppl-section-header">
              <span className="fppl-pre-text">Flight Hours</span>
              <h2>
                <span className="fppl-text--dark">Training</span>{' '}
                <span className="fppl-text--mid">Hour</span>{' '}
                <span className="fppl-text--light">Breakdown</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="fppl-hours__card">
              <div className="fppl-hours__bars">
                {[
                  { label: 'Dual Instruction', hours: '25', unit: 'hours minimum', percent: 55, color: '#2563eb' },
                  { label: 'Solo Flight', hours: '10', unit: 'hours minimum', percent: 22, color: '#1a1a1a' },
                  { label: 'Cross-Country', hours: '5', unit: 'hours minimum', percent: 11, color: '#22c55e' },
                  { label: 'Solo Cross-Country', hours: '5', unit: 'hours minimum', percent: 11, color: '#6366f1' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="fppl-hours__row"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="fppl-hours__row-header">
                      <span className="fppl-hours__label">{item.label}</span>
                      <span className="fppl-hours__value">{item.hours} <small>{item.unit}</small></span>
                    </div>
                    <div className="fppl-hours__bar-track">
                      <motion.div
                        className="fppl-hours__bar-fill"
                        style={{ background: item.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="fppl-hours__total">
                <span className="fppl-hours__total-label">Total Minimum</span>
                <span className="fppl-hours__total-value">45 <small>hours</small></span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== COSTS: Clean Rates + Bulk Pricing ========== */}
      <section className="fppl-costs">
        <div className="fppl-costs__container">
          <Reveal>
            <div className="fppl-section-header">
              <span className="fppl-label">Transparent Pricing</span>
              <h2>Flight Training Rates</h2>
              <p>Clear, honest pricing with no hidden fees</p>
            </div>
          </Reveal>

          <div className="fppl-costs__grid">
            <Reveal delay={0.1}>
              <div className="fppl-costs__card">
                <h4>Robinson R22</h4>
                <p>Entry-level piston helicopter</p>
                <div className="fppl-costs__rates">
                  <div className="fppl-costs__rate-row">
                    <span className="fppl-costs__rate-label">With Instructor</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£275</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                  <div className="fppl-costs__rate-row fppl-costs__rate-row--solo">
                    <span className="fppl-costs__rate-label">Solo</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£220</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="fppl-costs__card">
                <h4>Robinson R44</h4>
                <p>4-seater, more stable platform</p>
                <div className="fppl-costs__rates">
                  <div className="fppl-costs__rate-row">
                    <span className="fppl-costs__rate-label">With Instructor</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£395</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                  <div className="fppl-costs__rate-row fppl-costs__rate-row--solo">
                    <span className="fppl-costs__rate-label">Solo</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£340</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="fppl-costs__card">
                <h4>Robinson R66</h4>
                <p>Turbine, professional experience</p>
                <div className="fppl-costs__rates">
                  <div className="fppl-costs__rate-row">
                    <span className="fppl-costs__rate-label">With Instructor</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£595</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                  <div className="fppl-costs__rate-row fppl-costs__rate-row--solo">
                    <span className="fppl-costs__rate-label">Solo</span>
                    <div className="fppl-costs__rate">
                      <span className="fppl-costs__amount">£540</span>
                      <span className="fppl-costs__per">/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.35}>
            <p className="fppl-costs__vat-note">*All prices exclude VAT</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="fppl-costs__included">
              <div className="fppl-costs__included-inner">
                <span className="fppl-costs__check-icon">✓</span>
                <span className="fppl-costs__included-text">Ground School</span>
                <span className="fppl-costs__included-badge">INCLUDED</span>
              </div>
              <p>Complete ground school theory course included with all training packages</p>
            </div>
          </Reveal>

          {/* Bulk Hour Pricing */}
          <Reveal delay={0.4}>
            <div className="fppl-costs__bulk">
              <div className="fppl-costs__bulk-header">
                <h3>Bulk Hour Packages</h3>
                <span className="fppl-costs__bulk-tag">Save More</span>
              </div>
              <p className="fppl-costs__bulk-intro">
                Commit to more hours upfront and receive discounted rates
              </p>
              <div className="fppl-costs__bulk-grid">
                <motion.div
                  className="fppl-costs__bulk-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="fppl-costs__bulk-hours">10 Hours</span>
                  <span className="fppl-costs__bulk-discount">5% off</span>
                  <span className="fppl-costs__bulk-desc">Great for getting started</span>
                </motion.div>
                <motion.div
                  className="fppl-costs__bulk-card fppl-costs__bulk-card--featured"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="fppl-costs__bulk-hours">25 Hours</span>
                  <span className="fppl-costs__bulk-discount">10% off</span>
                  <span className="fppl-costs__bulk-desc">Most popular choice</span>
                </motion.div>
                <motion.div
                  className="fppl-costs__bulk-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="fppl-costs__bulk-hours">45+ Hours</span>
                  <span className="fppl-costs__bulk-discount">15% off</span>
                  <span className="fppl-costs__bulk-desc">Full PPL commitment</span>
                </motion.div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="fppl-costs__cta">
              <a href="/contact" className="fppl-btn fppl-btn--primary">Get Personalized Quote</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FAQ: Text Based ========== */}
      <section className="fppl-faq">
        <div className="fppl-faq__container">
          <Reveal>
            <div className="fppl-section-header">
              <span className="fppl-label">Common Questions</span>
              <h2>Frequently Asked Questions</h2>
            </div>
          </Reveal>

          <div className="fppl-faq__list">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className={`fppl-faq__item ${openFaq === i ? 'fppl-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="fppl-faq__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="fppl-faq__content">
                    <h4>
                      {faq.q}
                      <span className="fppl-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <motion.div
                      className="fppl-faq__answer"
                      initial={false}
                      animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="fppl-faq__more">
              <a href="/training/faq" className="fppl-btn fppl-btn--outline">View All FAQs</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== CTA: Discovery Flight ========== */}
      <section id="discovery" className="fppl-discovery">
        <div className="fppl-discovery__inner">
          <div className="fppl-discovery__image">
            <motion.img
              src="/assets/images/gallery/carousel/rotating1.jpg"
              alt="Discovery flight over countryside"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            />
            <div className="fppl-discovery__image-overlay" />
          </div>

          <div className="fppl-discovery__content">
            <Reveal>
              <div className="fppl-discovery__header">
                <span className="fppl-pre-text">Your First Flight</span>
                <h2>
                  <span className="fppl-text--dark">Discovery</span>{' '}
                  <span className="fppl-text--mid">Flight</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="fppl-discovery__desc">
                The best way to know if helicopter flying is for you is to experience it firsthand.
                Take the controls of a Robinson helicopter and discover the freedom of vertical flight.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="fppl-discovery__details">
                <div className="fppl-discovery__detail">
                  <span className="fppl-discovery__detail-num">30</span>
                  <span className="fppl-discovery__detail-label">Minutes Flight Time</span>
                </div>
                <div className="fppl-discovery__detail-divider" />
                <div className="fppl-discovery__detail">
                  <span className="fppl-discovery__detail-num">01</span>
                  <span className="fppl-discovery__detail-label">Dedicated Instructor</span>
                </div>
                <div className="fppl-discovery__detail-divider" />
                <div className="fppl-discovery__detail">
                  <span className="fppl-discovery__detail-num">✓</span>
                  <span className="fppl-discovery__detail-label">Counts Towards PPL</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="fppl-discovery__price-block">
                <div className="fppl-discovery__price">
                  <span className="fppl-discovery__price-from">From</span>
                  <span className="fppl-discovery__price-amount">£199</span>
                </div>
                <div className="fppl-discovery__actions">
                  <a href="/contact?subject=discovery-flight" className="fppl-btn fppl-btn--primary">
                    Book Discovery Flight
                  </a>
                  <a href="/store/gifts" className="fppl-link">
                    Gift Vouchers Available
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== CTA: Visit Us ========== */}
      <section className="fppl-visit">
        {/* Content */}
        <div className="fppl-visit__content-wrap">
          <div className="fppl-visit__content">
            <Reveal>
              <div className="fppl-visit__header">
                <span className="fppl-pre-text">Denham Aerodrome, UK</span>
                <h2>
                  <span className="fppl-text--dark">Visit</span>{' '}
                  <span className="fppl-text--mid">Our</span>{' '}
                  <span className="fppl-text--light">Hangar</span>
                </h2>
                <p>
                  Our helicopter collection is extensive. If you love helicopters as much as we do,
                  come visit us anytime during working hours. We'll give you a tour you won't forget.
                </p>
              </div>
            </Reveal>

            {/* Image Gallery Strip */}
            <Reveal delay={0.1}>
              <div className="fppl-visit__gallery gallery-v3">
                <div className="fppl-visit__gallery-track">
                  {[
                    { src: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'Helicopter in flight' },
                    { src: '/assets/images/gallery/carousel/rotating2.jpg', alt: 'Scenic flying' },
                    { src: '/assets/images/gallery/flying/foggy-evening-flying.jpg', alt: 'Evening flight' },
                    { src: '/assets/images/gallery/carousel/rotating8.jpg', alt: 'Helicopter adventure' },
                  ].map((img, i) => (
                    <motion.div
                      key={i}
                      className="fppl-visit__gallery-item"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                    >
                      <img src={img.src} alt={img.alt} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="fppl-visit__note-wrap">
                <div className="fppl-visit__note-divider"></div>
                <span className="fppl-visit__note-title">If You Love Helicopters</span>
                <p className="fppl-visit__note">
                  No appointment needed · Coffee always on · Pilots happy to chat · Extensive Fleet
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== COMPACT SUMMARY: Hours & Costs ========== */}
      <section className="fppl-summary">
        <div className="fppl-summary__container">
          <Reveal>
            <div className="fppl-summary__grid">
              {/* Hours Summary */}
              <div className="fppl-summary__block">
                <span className="fppl-summary__label">Minimum Training Hours</span>
                <div className="fppl-summary__hours">
                  <div className="fppl-summary__hour-item">
                    <span className="fppl-summary__hour-val">25</span>
                    <span className="fppl-summary__hour-label">Dual</span>
                  </div>
                  <span className="fppl-summary__hour-plus">+</span>
                  <div className="fppl-summary__hour-item">
                    <span className="fppl-summary__hour-val">10</span>
                    <span className="fppl-summary__hour-label">Solo</span>
                  </div>
                  <span className="fppl-summary__hour-plus">+</span>
                  <div className="fppl-summary__hour-item">
                    <span className="fppl-summary__hour-val">10</span>
                    <span className="fppl-summary__hour-label">X-Country</span>
                  </div>
                  <span className="fppl-summary__hour-eq">=</span>
                  <div className="fppl-summary__hour-item fppl-summary__hour-item--total">
                    <span className="fppl-summary__hour-val">45</span>
                    <span className="fppl-summary__hour-label">Minimum</span>
                  </div>
                </div>
              </div>

              <div className="fppl-summary__divider"></div>

              {/* Rates Summary */}
              <div className="fppl-summary__block">
                <span className="fppl-summary__label">Transparent Pricing</span>
                <p className="fppl-summary__subtitle">Clear, honest pricing with no hidden fees</p>
                <div className="fppl-summary__rates">
                  <div className="fppl-summary__rate">
                    <span className="fppl-summary__rate-aircraft">R22</span>
                    <span className="fppl-summary__rate-price">£275<small>/hr</small></span>
                  </div>
                  <div className="fppl-summary__rate-divider"></div>
                  <div className="fppl-summary__rate">
                    <span className="fppl-summary__rate-aircraft">R44</span>
                    <span className="fppl-summary__rate-price">£395<small>/hr</small></span>
                  </div>
                  <div className="fppl-summary__rate-divider"></div>
                  <div className="fppl-summary__rate">
                    <span className="fppl-summary__rate-aircraft">R66</span>
                    <span className="fppl-summary__rate-price">£595<small>/hr</small></span>
                  </div>
                </div>
                <span className="fppl-summary__vat">*All prices exclude VAT · Block booking discounts available</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="fppl-summary__included">
              <span className="fppl-summary__included-check">✓</span>
              <span className="fppl-summary__included-text">Ground School</span>
              <span className="fppl-summary__included-badge">INCLUDED</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .fppl {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .fppl-label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          font-weight: 400;
          margin-bottom: 0.75rem;
        }

        .fppl-accent { color: #2563eb; }

        .fppl-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .fppl-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .fppl-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        /* Buttons */
        .fppl-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 400;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .fppl-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .fppl-btn--primary:hover {
          background: #333;
        }

        .fppl-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .fppl-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .fppl-btn--large {
          padding: 1.1rem 2.5rem;
          font-size: 0.8rem;
        }

        /* ===== HERO ===== */
        .fppl-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .fppl-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .fppl-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fppl-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .fppl-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem 2rem;
        }

        .fppl-hero__left {
          max-width: 550px;
        }

        .fppl-hero__label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .fppl-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .fppl-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .fppl-hero__word--1 {
          color: #1a1a1a;
        }

        .fppl-hero__word--2 {
          color: #4a4a4a;
        }

        .fppl-hero__word--3 {
          color: #7a7a7a;
        }

        .fppl-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .fppl-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
        }

        /* Boarding Pass Ticket - Compact with Perforation */
        .fppl-hero__ticket {
          display: flex;
          align-items: stretch;
          background: #fff;
          max-width: 320px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
        }

        .fppl-hero__ticket-main {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e8e6e2;
          border-right: none;
          border-radius: 8px 0 0 8px;
          position: relative;
        }

        .fppl-hero__ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          gap: 0.5rem;
        }

        .fppl-hero__ticket-logo {
          height: 14px;
          width: auto;
          opacity: 0.8;
        }

        .fppl-hero__ticket-type {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          flex: 1;
          text-align: center;
        }

        .fppl-hero__ticket-class {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          background: #f5f5f2;
          padding: 0.15rem 0.4rem;
        }

        .fppl-hero__ticket-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .fppl-hero__ticket-point {
          text-align: center;
        }

        .fppl-hero__ticket-code {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .fppl-hero__ticket-city {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fppl-hero__ticket-arrow {
          display: flex;
          align-items: center;
        }

        /* Perforation Effect */
        .fppl-hero__ticket-perf {
          width: 14px;
          background: #fff;
          position: relative;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }

        .fppl-hero__ticket-perf::before {
          content: '';
          position: absolute;
          top: 6px;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background-image: repeating-linear-gradient(
            to bottom,
            #ccc 0px,
            #ccc 3px,
            transparent 3px,
            transparent 6px
          );
        }

        /* Half circle holes */
        .fppl-hero__ticket-perf-hole {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 6px;
          background: #faf9f6;
          overflow: hidden;
        }

        .fppl-hero__ticket-perf-hole--top {
          top: -1px;
          border-radius: 0 0 6px 6px;
          border: 1px solid #e8e6e2;
          border-top: none;
        }

        .fppl-hero__ticket-perf-hole--bottom {
          bottom: -1px;
          border-radius: 6px 6px 0 0;
          border: 1px solid #e8e6e2;
          border-bottom: none;
        }

        /* Stub Section */
        .fppl-hero__ticket-stub {
          background: #fafafa;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e8e6e2;
          border-left: none;
          border-radius: 0 8px 8px 0;
          display: flex;
          align-items: center;
        }

        .fppl-hero__ticket-stub-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .fppl-hero__ticket-stub-row > div {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .fppl-hero__ticket-lbl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.45rem;
          color: #999;
          letter-spacing: 0.1em;
          min-width: 28px;
        }

        .fppl-hero__ticket-stub-row > div > span:not(.fppl-hero__ticket-lbl) {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 600;
          font-size: 0.7rem;
          color: #1a1a1a;
        }


        /* Particles - keep for other sections */
        .fppl-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .fppl-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #1a1a1a;
          border-radius: 50%;
        }

        /* ===== INTRO ===== */
        .fppl-intro {
          padding: 8rem 2rem;
          background: #fff;
        }

        .fppl-intro__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fppl-intro__header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .fppl-intro__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
        }

        .fppl-intro__header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .fppl-intro__network {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fppl-intro__q-card {
          display: flex;
          gap: 2.5rem;
          background: #faf9f6;
          padding: 2.5rem;
          border-radius: 0;
          position: relative;
        }

        .fppl-intro__q-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: #1a1a1a;
        }

        .fppl-intro__q-image {
          position: relative;
          flex-shrink: 0;
        }

        .fppl-intro__q-image img {
          width: 180px;
          height: 180px;
          object-fit: cover;
        }

        .fppl-intro__q-info h3 {
          margin: 0 0 0.25rem;
          font-size: 1.5rem;
          text-transform: uppercase;
        }

        .fppl-intro__q-title {
          display: block;
          color: #666;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .fppl-intro__q-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .fppl-intro__divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        .fppl-intro__q-stat {
          text-align: center;
        }

        .fppl-intro__stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-intro__stat-label {
          font-size: 0.65rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .fppl-intro__q-info p {
          color: #666;
          line-height: 1.8;
          margin: 0;
        }

        .fppl-intro__team {
          text-align: center;
          margin-top: 3rem;
          padding-top: 3rem;
          border-top: 1px solid #e8e6e2;
        }

        .fppl-intro__team-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .fppl-intro__instructors {
          display: flex;
          justify-content: center;
          gap: 1px;
          background: #e8e6e2;
        }

        .fppl-intro__instructor {
          background: #fff;
          padding: 1.5rem 2rem;
          text-align: center;
          min-width: 140px;
        }

        .fppl-intro__instructor-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
          margin-bottom: 0.5rem;
        }

        .fppl-intro__instructor-title {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ===== GROUND SCHOOL ===== */
        .fppl-ground {
          padding: 8rem 2rem;
          background: #fff;
        }

        .fppl-ground__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fppl-ground__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
        }

        .fppl-ground__card {
          background: #faf9f6;
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          cursor: default;
        }

        .fppl-ground__num {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .fppl-ground__text h4 {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .fppl-ground__text p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        /* ===== HOURS BREAKDOWN ===== */
        .fppl-hours {
          padding: 8rem 2rem;
          background: #faf9f6;
        }

        .fppl-hours__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .fppl-hours__card {
          background: #fff;
          padding: 2.5rem;
          border: 1px solid #e8e6e2;
        }

        .fppl-hours__bars {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .fppl-hours__row-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .fppl-hours__label {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .fppl-hours__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
        }

        .fppl-hours__value small {
          font-weight: 400;
          font-size: 0.8rem;
          color: #888;
          margin-left: 0.25rem;
        }

        .fppl-hours__bar-track {
          height: 8px;
          background: #e8e6e2;
          overflow: hidden;
        }

        .fppl-hours__bar-fill {
          height: 100%;
        }

        .fppl-hours__total {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .fppl-hours__total-label {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fppl-hours__total-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #2563eb;
          line-height: 1;
        }

        .fppl-hours__total-value small {
          font-size: 1rem;
          font-weight: 400;
          color: #888;
          margin-left: 0.25rem;
        }

        /* ===== COSTS ===== */
        .fppl-costs {
          padding: 8rem 2rem;
          background: #faf9f6;
        }

        .fppl-costs__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fppl-costs__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .fppl-costs__card {
          background: #fff;
          padding: 2rem;
          text-align: center;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .fppl-costs__card:hover {
          border-color: #1a1a1a;
        }

        .fppl-costs__card h4 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fppl-costs__card p {
          color: #888;
          font-size: 0.85rem;
          margin: 0 0 1.5rem;
        }

        .fppl-costs__rates {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fppl-costs__rate-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #faf9f6;
          border-left: 3px solid #2563eb;
        }

        .fppl-costs__rate-row--solo {
          background: #f5f4f0;
          border-left-color: #888;
        }

        .fppl-costs__rate-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          font-weight: 500;
        }

        .fppl-costs__rate {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .fppl-costs__amount {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-costs__per {
          color: #888;
          font-size: 0.8rem;
        }

        .fppl-costs__vat-note {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .fppl-costs__included {
          background: linear-gradient(90deg, #d4edda, #c3e6cb);
          padding: 1.5rem 2rem;
          text-align: center;
          margin-bottom: 3rem;
        }

        .fppl-costs__included-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .fppl-costs__check-icon {
          width: 28px;
          height: 28px;
          background: #28a745;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .fppl-costs__included-text {
          font-weight: 600;
          color: #155724;
        }

        .fppl-costs__included-badge {
          background: #28a745;
          color: #fff;
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .fppl-costs__included p {
          margin: 0;
          color: #155724;
          font-size: 0.9rem;
        }

        /* Bulk Pricing */
        .fppl-costs__bulk {
          background: #fff;
          padding: 3rem;
          border: 1px solid #e8e6e2;
        }

        .fppl-costs__bulk-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .fppl-costs__bulk-header h3 {
          margin: 0;
          font-size: 1.3rem;
          text-transform: uppercase;
        }

        .fppl-costs__bulk-tag {
          background: #2563eb;
          color: #fff;
          padding: 0.25rem 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fppl-costs__bulk-intro {
          text-align: center;
          color: #666;
          margin-bottom: 2rem;
        }

        .fppl-costs__bulk-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .fppl-costs__bulk-card {
          background: #faf9f6;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid transparent;
          cursor: default;
        }

        .fppl-costs__bulk-card--featured {
          background: #1a1a1a;
          color: #fff;
        }

        .fppl-costs__bulk-hours {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .fppl-costs__bulk-discount {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .fppl-costs__bulk-card--featured .fppl-costs__bulk-discount {
          color: #fff;
        }

        .fppl-costs__bulk-desc {
          font-size: 0.8rem;
          color: #888;
        }

        .fppl-costs__bulk-card--featured .fppl-costs__bulk-desc {
          color: rgba(255,255,255,0.6);
        }

        .fppl-costs__cta {
          text-align: center;
          margin-top: 3rem;
        }

        /* ===== FAQ ===== */
        .fppl-faq {
          padding: 8rem 2rem;
          background: #fff;
        }

        .fppl-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .fppl-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .fppl-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .fppl-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .fppl-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .fppl-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .fppl-faq__content {
          flex: 1;
        }

        .fppl-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .fppl-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .fppl-faq__answer {
          overflow: hidden;
        }

        .fppl-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .fppl-faq__more {
          text-align: center;
          margin-top: 3rem;
        }

        /* ===== PRE-TEXT & GRADIENT TEXT ===== */
        .fppl-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .fppl-text--dark { color: #1a1a1a; }
        .fppl-text--mid { color: #4a4a4a; }
        .fppl-text--light { color: #7a7a7a; }

        .fppl-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
          transition: border-color 0.3s ease;
        }

        .fppl-link:hover {
          border-color: #1a1a1a;
        }

        .fppl-link svg {
          transition: transform 0.3s ease;
        }

        .fppl-link:hover svg {
          transform: translateX(3px);
        }

        /* ===== DISCOVERY CTA ===== */
        .fppl-discovery {
          background: #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .fppl-discovery__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 700px;
        }

        .fppl-discovery__image {
          position: relative;
          overflow: hidden;
        }

        .fppl-discovery__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fppl-discovery__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(26,26,26,0.3) 0%, transparent 50%);
        }

        .fppl-discovery__content {
          padding: 5rem 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
        }

        .fppl-discovery__content .fppl-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .fppl-discovery__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 2rem;
        }

        .fppl-discovery__header .fppl-text--dark { color: #fff; }
        .fppl-discovery__header .fppl-text--mid { color: rgba(255,255,255,0.6); }

        .fppl-discovery__desc {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          max-width: 480px;
        }

        .fppl-discovery__details {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .fppl-discovery__detail {
          text-align: center;
        }

        .fppl-discovery__detail-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .fppl-discovery__detail-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
        }

        .fppl-discovery__detail-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
        }

        .fppl-discovery__price-block {
          display: flex;
          align-items: flex-end;
          gap: 3rem;
        }

        .fppl-discovery__price {
          display: flex;
          flex-direction: column;
        }

        .fppl-discovery__price-from {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.25rem;
        }

        .fppl-discovery__price-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .fppl-discovery__actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fppl-discovery__actions .fppl-btn--primary {
          background: #fff;
          color: #1a1a1a;
        }

        .fppl-discovery__actions .fppl-btn--primary:hover {
          background: #f0f0f0;
        }

        .fppl-discovery__actions .fppl-link {
          color: rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,0.3);
        }

        .fppl-discovery__actions .fppl-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        /* ===== VISIT CTA ===== */
        .fppl-visit {
          background: #faf9f6;
        }

        .fppl-visit__content-wrap {
          padding: 6rem 2rem;
        }

        /* Gallery Styles */
        .fppl-visit__gallery {
          margin: 1rem 0 3rem;
          width: 100vw;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }

        .fppl-visit__gallery-track {
          display: flex;
          gap: 4px;
        }

        .fppl-visit__gallery-item {
          flex: 1;
          min-width: 0;
          aspect-ratio: 4/3;
          overflow: hidden;
          position: relative;
        }

        .fppl-visit__gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .fppl-visit__gallery-item:hover img {
          transform: scale(1.05);
        }

        /* V3: Seamless Panorama */
        .gallery-v3 {
          position: relative;
        }

        .gallery-v3::before,
        .gallery-v3::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 40%;
          z-index: 2;
          pointer-events: none;
        }

        .gallery-v3::before {
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%);
        }

        .gallery-v3::after {
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%);
        }

        .gallery-v3 .fppl-visit__gallery-track {
          gap: 0;
        }

        .gallery-v3 .fppl-visit__gallery-item {
          aspect-ratio: 16/9;
        }

        .gallery-v3 .fppl-visit__gallery-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 15%, rgba(128,128,128,0.25) 50%, transparent 85%);
          z-index: 3;
        }


        .fppl-visit__content {
          max-width: 900px;
          margin: 0 auto;
        }

        .fppl-visit__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .fppl-visit__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .fppl-visit__header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto;
        }

        .fppl-visit__details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .fppl-visit__detail-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .fppl-visit__detail-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .fppl-visit__detail-text {
          display: flex;
          flex-direction: column;
        }

        .fppl-visit__detail-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .fppl-visit__detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .fppl-visit__detail-value--mono {
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-visit__detail-sub {
          font-size: 0.85rem;
          color: #888;
        }

        .fppl-visit__detail-sub--mono {
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-visit__fleet {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 2.5rem;
        }

        .fppl-visit__fleet-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 1rem;
        }

        .fppl-visit__fleet-list {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .fppl-visit__fleet-list span {
          padding: 0.6rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .fppl-visit__fleet-list span:hover {
          border-color: #1a1a1a;
        }

        .fppl-visit__cta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .fppl-visit__note-wrap {
          text-align: center;
          margin-top: 2rem;
        }

        .fppl-visit__note-divider {
          width: 60px;
          height: 1px;
          background: #e8e6e2;
          margin: 0 auto 1.5rem;
        }

        .fppl-visit__note-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          display: block;
          margin-bottom: 0.5rem;
        }

        .fppl-visit__note {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
        }

        /* ===== COMPACT SUMMARY ===== */
        .fppl-summary {
          background: #1a1a1a;
          padding: 3rem 2rem;
        }

        .fppl-summary__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fppl-summary__grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .fppl-summary__block {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .fppl-summary__divider {
          width: 1px;
          height: 80px;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        .fppl-summary__label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 1rem;
        }

        .fppl-summary__hours {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .fppl-summary__hour-item {
          text-align: center;
        }

        .fppl-summary__hour-val {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .fppl-summary__hour-label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          margin-top: 0.25rem;
        }

        .fppl-summary__hour-plus,
        .fppl-summary__hour-eq {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: rgba(255,255,255,0.3);
        }

        .fppl-summary__hour-item--total .fppl-summary__hour-val {
          color: #2563eb;
          font-size: 1.75rem;
        }

        .fppl-summary__rates {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .fppl-summary__rate {
          text-align: center;
        }

        .fppl-summary__rate-aircraft {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.25rem;
        }

        .fppl-summary__rate-price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .fppl-summary__rate-price small {
          font-size: 0.7rem;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
        }

        .fppl-summary__rate-divider {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.15);
        }

        .fppl-summary__subtitle {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          margin: -0.5rem 0 1rem;
        }

        .fppl-summary__vat {
          display: block;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.75rem;
          font-style: italic;
        }

        .fppl-summary__included {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 1rem 2rem;
          margin-top: 2rem;
        }

        .fppl-summary__included-check {
          width: 22px;
          height: 22px;
          background: #22c55e;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .fppl-summary__included-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
        }

        .fppl-summary__included-badge {
          background: #22c55e;
          color: #fff;
          padding: 0.25rem 0.6rem;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .fppl-hero__panel {
            display: none;
          }

          .fppl-hero__grid {
            grid-template-columns: 1fr;
          }

          .fppl-discovery__inner {
            grid-template-columns: 40% 60%;
            min-height: 500px;
          }

          .fppl-discovery__content {
            padding: 3rem 2rem;
          }

          .fppl-visit__details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .fppl-visit__cta {
            flex-direction: column;
            gap: 1rem;
          }

          .fppl-ground__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .fppl-costs__grid,
          .fppl-costs__bulk-grid {
            grid-template-columns: 1fr;
          }

          .fppl-ground__grid {
            grid-template-columns: 1fr;
          }

          .fppl-hours__card {
            padding: 2rem 1.5rem;
          }

          .fppl-hours__total-value {
            font-size: 2rem;
          }

          .fppl-intro__q-card {
            flex-direction: column;
            text-align: center;
          }

          .fppl-intro__q-image {
            margin: 0 auto;
          }

          .fppl-intro__q-stats {
            justify-content: center;
          }

          .fppl-faq__item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .fppl-faq__item--featured {
            margin: 0;
            padding: 1.5rem;
          }

          .fppl-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .fppl-hero__content {
            padding: 5rem 2rem 2rem;
            justify-content: center;
          }

          .fppl-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .fppl-hero__headline {
            align-items: center;
          }

          .fppl-hero__divider-line {
            margin: 1.5rem auto;
          }

          .fppl-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .fppl-hero__ticket {
            max-width: 280px;
            margin: 0 auto 1.5rem;
          }

          .fppl-hero__ticket-perf-hole {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 100%);
          }

          .fppl-hero__ticket-stub-row {
            gap: 0.25rem;
          }

          .fppl-discovery__inner {
            grid-template-columns: 35% 65%;
            min-height: auto;
          }

          .fppl-discovery__content {
            padding: 2rem 1.5rem;
          }

          .fppl-discovery__header h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .fppl-discovery__desc {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }

          .fppl-discovery__details {
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
          }

          .fppl-discovery__detail-num {
            font-size: 1.25rem;
          }

          .fppl-discovery__detail-divider {
            width: 40px;
            height: 1px;
          }

          .fppl-discovery__price-block {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .fppl-discovery__price-amount {
            font-size: 2rem;
          }

          .fppl-visit__fleet-list {
            flex-wrap: wrap;
            justify-content: center;
          }

          .fppl-intro__instructors {
            flex-wrap: wrap;
          }

          .fppl-intro__instructor {
            min-width: calc(50% - 1px);
          }
        }

        @media (max-width: 480px) {
          .fppl-discovery__inner {
            grid-template-columns: 30% 70%;
          }

          .fppl-discovery__content {
            padding: 1.5rem 1rem;
          }

          .fppl-discovery__header h2 {
            font-size: 1.25rem;
          }

          .fppl-discovery__desc {
            font-size: 0.85rem;
            line-height: 1.6;
          }

          .fppl-discovery__details {
            gap: 0.75rem;
          }

          .fppl-discovery__detail-num {
            font-size: 1rem;
            margin-bottom: 0.25rem;
          }

          .fppl-discovery__detail-label {
            font-size: 0.55rem;
          }

          .fppl-discovery__price-amount {
            font-size: 1.5rem;
          }

          .fppl-discovery__actions {
            width: 100%;
          }

          .fppl-discovery__actions .fppl-btn {
            width: 100%;
            text-align: center;
            padding: 0.75rem 1rem;
            font-size: 0.65rem;
          }

          .fppl-visit__detail-card {
            flex-direction: column;
            text-align: center;
          }

          .fppl-visit__detail-icon {
            align-self: center;
          }

          .fppl-intro__instructors {
            gap: 1px;
          }

          .fppl-intro__instructor {
            min-width: calc(50% - 1px);
            padding: 1rem;
          }

          .fppl-summary__grid {
            flex-direction: column;
            gap: 2rem;
          }

          .fppl-summary__hours {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .fppl-summary__rates {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .fppl-summary__rate-divider {
            display: none;
          }

          .fppl-summary__divider {
            display: none;
          }

          .fppl-summary__included {
            padding: 0.75rem 1rem;
            gap: 0.5rem;
          }

          .fppl-summary__included-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FinalPPL;
