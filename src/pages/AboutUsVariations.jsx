/**
 * ABOUT US VARIATIONS — 3 production-quality About Us page layouts
 * HQ Aviation — The Robinson Specialists since 1990
 * Route: /about-us-variations
 *
 * Built with the same Framer Motion patterns, design tokens, and visual
 * language as FinalDraft, FinalMaintenance, and AircraftR66.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Picker from '../components/Picker';


/* ============================================================
   SHARED COMPONENTS
   ============================================================ */

function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ value, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const steps = 60;
    const inc = value / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(Math.floor(cur));
    }, 2000 / steps);
    return () => clearInterval(t);
  }, [isInView, value]);
  return <span ref={ref}>{isInView ? display.toLocaleString() : '0'}{suffix}</span>;
}

const MILESTONES = [
  ['1990', 'HQ Aviation established at Denham Aerodrome'],
  ['1994', 'First World Helicopter Aerobatics Championship'],
  ['1997', 'First piston-engine helicopter circumnavigation of the globe'],
  ['2002', 'First piston helicopter to the North Pole'],
  ['2005', 'First piston helicopter to the South Pole'],
  ['2012', 'Second World Championship — eighteen years after the first'],
  ['2018', 'Trains Tom Cruise for Mission: Impossible — Fallout'],
  ['2019', 'FAI Gold Rotorcraft Medal — highest honour in helicopter aviation'],
];

const SERVICES = [
  { num: '01', title: 'Flight Training', desc: 'CAA Approved Training Organisation. PPL(H) through CPL(H), with type ratings on the R22, R44, R66, and R88.' },
  { num: '02', title: 'Aircraft Sales', desc: 'Authorized Robinson Dealer. New and pre-owned helicopters with full handover, registration, and insurance support.' },
  { num: '03', title: 'Maintenance', desc: 'Authorized Service Centre. Annual inspections, 12-year overhauls, avionics upgrades, and complete refurbishments.' },
  { num: '04', title: 'Expeditions', desc: 'Polar aviation, English Channel crossings, and bespoke adventure flight planning across seven continents.' },
];


/* ============================================================
   V1 — THE DEFINITIVE
   Full production-quality About Us page matching the rhythm
   of FinalDraft and FinalMaintenance.
   ============================================================ */

function AboutV1() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.5], [1, 0.95]);

  const divRef = useRef(null);
  const { scrollYProgress: divScroll } = useScroll({ target: divRef, offset: ['start end', 'end start'] });
  const divY = useTransform(divScroll, [0, 1], ['-15%', '15%']);

  return (
    <>
      <style>{`
        /* ---- HERO ---- */
        .au31-hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; }
        .au31-hero__bg { position: absolute; inset: -10%; z-index: 1; }
        .au31-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au31-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%); }
        .au31-hero__content { position: relative; z-index: 3; text-align: center; color: #fff; max-width: 900px; padding: 0 2rem; }
        .au31-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.7); display: block; margin-bottom: 2rem; }
        .au31-hero__title { margin: 0; }
        .au31-hero__word { display: block; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1; text-transform: uppercase; letter-spacing: -0.02em; }
        .au31-hero__word--sub { color: rgba(255,255,255,0.7); }
        .au31-hero__divider { width: 80px; height: 1px; background: rgba(255,255,255,0.4); margin: 2rem auto; transform-origin: center; }
        .au31-hero__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); display: block; }
        .au31-hero__scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.75rem; z-index: 3; }
        .au31-hero__scroll-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .au31-hero__scroll-line { width: 1px; height: 50px; background: rgba(255,255,255,0.15); position: relative; overflow: hidden; }
        .au31-hero__scroll-dot { position: absolute; width: 1px; height: 30%; background: rgba(255,255,255,0.6); animation: au31Scroll 2s ease-in-out infinite; }
        @keyframes au31Scroll { 0% { top: -30%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

        /* ---- STATS STRIP ---- */
        .au31-stats { background: #1a1a1a; padding: 1.5rem 2rem; font-family: 'Space Grotesk', sans-serif; }
        .au31-stats__inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .au31-stats__item { flex: 1; text-align: center; }
        .au31-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 600; color: #fff; display: block; line-height: 1; margin-bottom: 4px; }
        .au31-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .au31-stats__sep { width: 1px; height: 40px; background: rgba(255,255,255,0.2); flex-shrink: 0; }

        /* ---- SHARED SECTION TOKENS ---- */
        .au31-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #888; display: block; margin-bottom: 1.5rem; }
        .au31-heading { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; margin: 0 0 2rem; text-transform: uppercase; }
        .au31-heading span:nth-child(1) { color: #1a1a1a; }
        .au31-heading span:nth-child(2) { color: #4a4a4a; }
        .au31-heading span:nth-child(3) { color: #7a7a7a; }
        .au31-body { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; line-height: 1.8; color: #666; }
        .au31-body p { margin: 0 0 1.5rem; }
        .au31-body p:last-child { margin-bottom: 0; }

        /* ---- INTRO ---- */
        .au31-intro { background: #faf9f6; padding: 8rem 2rem; text-align: center; }
        .au31-intro__inner { max-width: 700px; margin: 0 auto; }

        /* ---- SPLIT ---- */
        .au31-split { background: #fff; padding: 8rem 2rem; }
        .au31-split__inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .au31-split__img { overflow: hidden; }
        .au31-split__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au31-split__text { text-align: left; }

        /* ---- PARALLAX DIVIDER ---- */
        .au31-divider { position: relative; height: 400px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .au31-divider__bg { position: absolute; inset: -15%; z-index: 1; }
        .au31-divider__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au31-divider__overlay { position: absolute; inset: 0; z-index: 2; background: rgba(0,0,0,0.6); }
        .au31-divider__content { position: relative; z-index: 3; text-align: center; color: #fff; }
        .au31-divider__num { font-family: 'Share Tech Mono', monospace; font-size: clamp(4rem, 12vw, 9rem); font-weight: 500; line-height: 1; opacity: 0.15; display: block; }
        .au31-divider__label { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.7); }

        /* ---- FOUNDER ---- */
        .au31-founder { background: #faf9f6; padding: 8rem 2rem; font-family: 'Space Grotesk', sans-serif; }
        .au31-founder__inner { max-width: 1200px; margin: 0 auto; }
        .au31-founder__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; margin-top: 3rem; }
        .au31-founder__portrait img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au31-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-top: 1rem; display: block; }

        /* ---- DARK TIMELINE ---- */
        .au31-timeline { background: #1a1a1a; padding: 8rem 2rem; font-family: 'Space Grotesk', sans-serif; }
        .au31-timeline__inner { max-width: 800px; margin: 0 auto; text-align: center; }
        .au31-timeline .au31-pretext { color: rgba(255,255,255,0.5); }
        .au31-timeline .au31-heading span:nth-child(1) { color: #fff; }
        .au31-timeline .au31-heading span:nth-child(2) { color: rgba(255,255,255,0.7); }
        .au31-timeline .au31-heading span:nth-child(3) { color: rgba(255,255,255,0.5); }
        .au31-timeline__list { margin-top: 3rem; text-align: left; }
        .au31-timeline__item { display: flex; gap: 2rem; padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .au31-timeline__item:first-child { border-top: 1px solid rgba(255,255,255,0.1); }
        .au31-timeline__year { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); flex-shrink: 0; width: 60px; }
        .au31-timeline__desc { font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8); }

        /* ---- SERVICES ---- */
        .au31-services { background: #fff; padding: 8rem 2rem; font-family: 'Space Grotesk', sans-serif; }
        .au31-services__inner { max-width: 1200px; margin: 0 auto; }
        .au31-services__header { text-align: center; max-width: 700px; margin: 0 auto 3rem; }
        .au31-services__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .au31-services__card { padding: 2rem; border: 1px solid #e8e6e2; transition: all 0.3s ease; }
        .au31-services__card:hover { box-shadow: 0 10px 40px rgba(0,0,0,0.06); transform: translateY(-4px); }
        .au31-services__card-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; margin-bottom: 1rem; display: block; }
        .au31-services__card-title { font-size: 1.15rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.75rem; }
        .au31-services__card-desc { font-size: 0.9rem; line-height: 1.7; color: #666; margin: 0; }

        /* ---- CTA ---- */
        .au31-cta { background: #faf9f6; padding: 8rem 2rem; text-align: center; font-family: 'Space Grotesk', sans-serif; }
        .au31-cta__inner { max-width: 600px; margin: 0 auto; }
        .au31-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .au31-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; transition: all 0.3s ease; }
        .au31-btn--primary { background: #1a1a1a; color: #fff; }
        .au31-btn--primary:hover { background: #333; }
        .au31-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au31-btn--outline:hover { background: #1a1a1a; color: #fff; }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .au31-split__inner { grid-template-columns: 1fr; gap: 2rem; }
          .au31-founder__grid { grid-template-columns: 1fr; gap: 2rem; }
          .au31-services__grid { grid-template-columns: 1fr; }
          .au31-stats__inner { flex-wrap: wrap; }
          .au31-stats__sep { display: none; }
          .au31-stats__item { min-width: 45%; padding: 0.5rem 0; }
          .au31-cta__buttons { flex-direction: column; align-items: center; }
          .au31-timeline__item { flex-direction: column; gap: 0.5rem; }
          .au31-timeline__year { width: auto; }
        }
      `}</style>

      {/* HERO */}
      <section ref={heroRef} className="au31-hero">
        <motion.div className="au31-hero__bg" style={{ y: heroY }}>
          <img src="/assets/images/r66helis.jpg" alt="HQ Aviation Robinson R66 Fleet at Denham Aerodrome" />
        </motion.div>
        <div className="au31-hero__overlay" />
        <motion.div className="au31-hero__content" style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.span className="au31-hero__pretext" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            Est. 1990 &middot; Denham Aerodrome
          </motion.span>
          <h1 className="au31-hero__title">
            <motion.span className="au31-hero__word" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              The Robinson
            </motion.span>
            <motion.span className="au31-hero__word au31-hero__word--sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              Specialists
            </motion.span>
          </h1>
          <motion.div className="au31-hero__divider" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} />
          <motion.span className="au31-hero__coords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.0 }}>
            51.5751&deg;N &middot; 0.5059&deg;W &middot; EGLD
          </motion.span>
        </motion.div>
        <motion.div className="au31-hero__scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }}>
          <span className="au31-hero__scroll-label">Scroll</span>
          <div className="au31-hero__scroll-line"><div className="au31-hero__scroll-dot" /></div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="au31-stats">
        <div className="au31-stats__inner">
          <div className="au31-stats__item">
            <span className="au31-stats__value"><AnimatedNumber value={35} suffix="+" /></span>
            <span className="au31-stats__label">Years</span>
          </div>
          <div className="au31-stats__sep" />
          <div className="au31-stats__item">
            <span className="au31-stats__value"><AnimatedNumber value={12000} suffix="+" /></span>
            <span className="au31-stats__label">Flight Hours</span>
          </div>
          <div className="au31-stats__sep" />
          <div className="au31-stats__item">
            <span className="au31-stats__value"><AnimatedNumber value={500} suffix="+" /></span>
            <span className="au31-stats__label">Pilots Trained</span>
          </div>
          <div className="au31-stats__sep" />
          <div className="au31-stats__item">
            <span className="au31-stats__value"><AnimatedNumber value={7} /></span>
            <span className="au31-stats__label">Continents</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="au31-intro">
        <div className="au31-intro__inner">
          <Reveal>
            <span className="au31-pretext">01 &mdash; Our Story</span>
            <h2 className="au31-heading">
              <span>Built </span><span>On </span><span>Precision</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="au31-body">
              <p>Founded in 1990 by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown to become the United Kingdom's leading Robinson helicopter specialists. As an Authorized Robinson Dealer and Service Centre, we provide the full spectrum of helicopter services — from sales and training to maintenance and expeditions.</p>
              <p>What started as a single-helicopter training operation has, over three decades, evolved into a complete centre of excellence. Today our facility at Denham houses one of the largest Robinson fleets in Europe, supported by a team of CAA-approved engineers and instructors who share a relentless commitment to precision.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SPLIT: IMAGE + TEXT */}
      <section className="au31-split">
        <div className="au31-split__inner">
          <Reveal direction="left">
            <div className="au31-split__img">
              <img src="/assets/images/facility/hq-0007.jpg" alt="HQ Aviation engineer inspecting helicopter" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="au31-split__text">
              <span className="au31-pretext">Complete Helicopter Services</span>
              <div className="au31-body">
                <p>Every Robinson helicopter that passes through our facility receives the same standard of care — whether it's a student's first R22 or a client's turbine R66 returning from expedition. Our engineers hold approvals from the CAA, EASA, and FAA, and our workshops carry the full suite of Robinson special tooling.</p>
                <p>We train pilots from their first hover to their commercial licence. We sell new aircraft directly from the Robinson factory in Torrance, California, and maintain a rotating stock of pre-owned machines inspected to the same standard. When something goes wrong, we fix it. When something wears out, we rebuild it.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PARALLAX DIVIDER */}
      <section ref={divRef} className="au31-divider">
        <motion.div className="au31-divider__bg" style={{ y: divY }}>
          <img src="/assets/images/facility/hq-0089.jpg" alt="Engineer at work" />
        </motion.div>
        <div className="au31-divider__overlay" />
        <div className="au31-divider__content">
          <span className="au31-divider__num">02</span>
          <span className="au31-divider__label">Heritage</span>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="au31-founder">
        <div className="au31-founder__inner">
          <Reveal>
            <span className="au31-pretext">Captain Quentin Smith</span>
            <h2 className="au31-heading">
              <span>The </span><span>Man </span><span>Behind HQ</span>
            </h2>
          </Reveal>
          <div className="au31-founder__grid">
            <Reveal>
              <div className="au31-founder__portrait">
                <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith in the cockpit" />
                <span className="au31-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="au31-body" style={{ textAlign: 'left' }}>
                <p>Captain Quentin Smith is a two-time World Helicopter Aerobatics Champion, Guinness World Record holder, and recipient of the FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                <p>In 1997, he completed the first circumnavigation of the globe in a piston-engine helicopter — a Robinson R44 that flew 30,000 miles across 28 countries in 97 days. The aircraft now resides in the Smithsonian National Air and Space Museum.</p>
                <p>In 2002 and 2005, he piloted the first piston helicopter to the North and South Poles respectively — feats that remain unmatched. In 2018, Paramount Pictures selected Captain Smith to train Tom Cruise for the helicopter sequences in Mission: Impossible — Fallout.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DARK TIMELINE */}
      <section className="au31-timeline">
        <div className="au31-timeline__inner">
          <Reveal>
            <span className="au31-pretext">03 &mdash; Milestones</span>
            <h2 className="au31-heading">
              <span>Defining </span><span>Moments</span>
            </h2>
          </Reveal>
          <div className="au31-timeline__list">
            {MILESTONES.map(([year, desc], i) => (
              <Reveal key={year} delay={i * 0.08}>
                <div className="au31-timeline__item">
                  <span className="au31-timeline__year">{year}</span>
                  <span className="au31-timeline__desc">{desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="au31-services">
        <div className="au31-services__inner">
          <div className="au31-services__header">
            <Reveal>
              <span className="au31-pretext">04 &mdash; Services</span>
              <h2 className="au31-heading">
                <span>What </span><span>We </span><span>Do</span>
              </h2>
            </Reveal>
          </div>
          <div className="au31-services__grid">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.num} delay={i * 0.1}>
                <motion.div className="au31-services__card" whileHover={{ y: -4, transition: { duration: 0.3 } }}>
                  <span className="au31-services__card-num">{svc.num}</span>
                  <h3 className="au31-services__card-title">{svc.title}</h3>
                  <p className="au31-services__card-desc">{svc.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="au31-cta">
        <div className="au31-cta__inner">
          <Reveal>
            <span className="au31-pretext">Get In Touch</span>
            <h2 className="au31-heading">
              <span>Begin </span><span>Your </span><span>Journey</span>
            </h2>
            <div className="au31-cta__buttons">
              <Link className="au31-btn au31-btn--primary" to="/contact">Contact Us &rarr;</Link>
              <Link className="au31-btn au31-btn--outline" to="/fleet">Explore Fleet</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


/* ============================================================
   V2 — EDITORIAL ASYMMETRIC
   Magazine-style layout with strong horizontal bands and
   alternating image/text blocks. Same tokens, different rhythm.
   ============================================================ */

function AboutV2() {
  const parallaxRef = useRef(null);
  const { scrollYProgress: pScroll } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const pY = useTransform(pScroll, [0, 1], ['-15%', '15%']);

  return (
    <>
      <style>{`
        /* ---- OPENING SPLIT ---- */
        .au32 { font-family: 'Space Grotesk', sans-serif; }
        .au32-opening { display: grid; grid-template-columns: 55fr 45fr; min-height: 80vh; background: #faf9f6; }
        .au32-opening__img { overflow: hidden; position: relative; }
        .au32-opening__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .au32-opening__text { display: flex; flex-direction: column; justify-content: center; padding: 4rem 4rem 4rem 3rem; }
        .au32-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #888; display: block; margin-bottom: 1.5rem; }
        .au32-heading { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; margin: 0 0 2rem; text-transform: uppercase; }
        .au32-heading span:nth-child(1) { color: #1a1a1a; }
        .au32-heading span:nth-child(2) { color: #4a4a4a; }
        .au32-heading span:nth-child(3) { color: #7a7a7a; }
        .au32-body { font-size: 1.1rem; line-height: 1.8; color: #666; }
        .au32-body p { margin: 0 0 1.5rem; }
        .au32-body p:last-child { margin-bottom: 0; }
        .au32-coords { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: #999; display: block; margin-top: 2rem; }

        /* ---- PULL NUMBER ---- */
        .au32-pull { background: #fff; padding: 5rem 2rem; text-align: center; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .au32-pull__num { font-family: 'Share Tech Mono', monospace; font-size: clamp(5rem, 12vw, 10rem); font-weight: 500; line-height: 1; color: #1a1a1a; display: block; }
        .au32-pull__label { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-top: 1rem; }

        /* ---- CONTENT BLOCKS ---- */
        .au32-block { padding: 8rem 2rem; }
        .au32-block--warm { background: #faf9f6; }
        .au32-block--white { background: #fff; }
        .au32-block__inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .au32-block__inner--reverse { direction: rtl; }
        .au32-block__inner--reverse > * { direction: ltr; }
        .au32-block__img { overflow: hidden; }
        .au32-block__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au32-block__text {}

        /* ---- QUOTE BAND ---- */
        .au32-quote { background: #1a1a1a; padding: 6rem 2rem; text-align: center; }
        .au32-quote__inner { max-width: 800px; margin: 0 auto; }
        .au32-quote__text { font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 500; line-height: 1.4; color: #fff; font-style: italic; margin: 0 0 1.5rem; }
        .au32-quote__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); }

        /* ---- FOUNDER ---- */
        .au32-founder { padding: 8rem 2rem; background: #faf9f6; }
        .au32-founder__inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .au32-founder__portrait img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au32-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; display: block; margin-top: 1rem; }

        /* ---- STATS ROW ---- */
        .au32-stats { background: #fff; padding: 4rem 2rem; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .au32-stats__inner { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; }
        .au32-stats__item { text-align: center; flex: 1; }
        .au32-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 6px; }
        .au32-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
        .au32-stats__sep { width: 1px; height: 50px; background: #e8e6e2; flex-shrink: 0; align-self: center; }

        /* ---- TIMELINE ---- */
        .au32-timeline { background: #faf9f6; padding: 8rem 2rem; }
        .au32-timeline__inner { max-width: 800px; margin: 0 auto; }
        .au32-timeline__header { text-align: center; margin-bottom: 3rem; }
        .au32-timeline__item { display: flex; gap: 2rem; padding: 1.25rem 0; border-bottom: 1px solid #e8e6e2; }
        .au32-timeline__item:first-child { border-top: 1px solid #e8e6e2; }
        .au32-timeline__year { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.1em; color: #999; flex-shrink: 0; width: 60px; }
        .au32-timeline__desc { font-size: 0.95rem; line-height: 1.6; color: #666; }

        /* ---- PARALLAX IMAGE BREAK ---- */
        .au32-parallax { position: relative; height: 400px; overflow: hidden; }
        .au32-parallax__bg { position: absolute; inset: -15%; z-index: 1; }
        .au32-parallax__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au32-parallax__overlay { position: absolute; inset: 0; z-index: 2; background: rgba(0,0,0,0.5); }

        /* ---- CTA ---- */
        .au32-cta { background: #1a1a1a; padding: 6rem 2rem; text-align: center; }
        .au32-cta__inner { max-width: 600px; margin: 0 auto; }
        .au32-cta .au32-pretext { color: rgba(255,255,255,0.5); }
        .au32-cta .au32-heading span:nth-child(1) { color: #fff; }
        .au32-cta .au32-heading span:nth-child(2) { color: rgba(255,255,255,0.7); }
        .au32-cta .au32-heading span:nth-child(3) { color: rgba(255,255,255,0.5); }
        .au32-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .au32-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au32-btn--light { background: #fff; color: #1a1a1a; }
        .au32-btn--light:hover { background: #f5f5f2; }
        .au32-btn--ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        .au32-btn--ghost:hover { background: rgba(255,255,255,0.1); }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .au32-opening { grid-template-columns: 1fr; }
          .au32-opening__img { height: 50vh; }
          .au32-opening__text { padding: 3rem 2rem; }
          .au32-block__inner { grid-template-columns: 1fr; gap: 2rem; }
          .au32-block__inner--reverse { direction: ltr; }
          .au32-founder__inner { grid-template-columns: 1fr; gap: 2rem; }
          .au32-stats__inner { flex-wrap: wrap; gap: 1.5rem; }
          .au32-stats__sep { display: none; }
          .au32-stats__item { min-width: 45%; }
          .au32-timeline__item { flex-direction: column; gap: 0.5rem; }
          .au32-timeline__year { width: auto; }
          .au32-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au32">
        {/* OPENING SPLIT */}
        <section className="au32-opening">
          <Reveal direction="left">
            <div className="au32-opening__img">
              <img src="/assets/images/r66helis.jpg" alt="HQ Aviation Robinson R66 Fleet" />
            </div>
          </Reveal>
          <div className="au32-opening__text">
            <Reveal delay={0.3}>
              <span className="au32-pretext">Est. 1990 &middot; Denham Aerodrome</span>
              <h1 className="au32-heading">
                <span>The </span><span>Robinson </span><span>Specialists</span>
              </h1>
              <div className="au32-body">
                <p>Founded by Captain Quentin Smith, HQ Aviation is the United Kingdom's leading Robinson helicopter company. We are an Authorized Dealer, Authorized Service Centre, and CAA Approved Training Organisation — providing the complete spectrum of helicopter services from a single facility at Denham Aerodrome.</p>
              </div>
              <span className="au32-coords">51.5751&deg;N &middot; 0.5059&deg;W &middot; EGLD</span>
            </Reveal>
          </div>
        </section>

        {/* PULL NUMBER */}
        <section className="au32-pull">
          <Reveal>
            <span className="au32-pull__num">1990</span>
            <span className="au32-pull__label">Year established at Denham Aerodrome</span>
          </Reveal>
        </section>

        {/* BLOCK 1: TEXT LEFT, IMAGE RIGHT */}
        <section className="au32-block au32-block--warm">
          <div className="au32-block__inner">
            <Reveal direction="left">
              <div className="au32-block__text">
                <span className="au32-pretext">01 &mdash; Precision Engineering</span>
                <h2 className="au32-heading">
                  <span>Built </span><span>To </span><span>Standard</span>
                </h2>
                <div className="au32-body">
                  <p>Every Robinson helicopter that passes through our facility receives the same uncompromising standard of care. Our engineers hold approvals from the CAA, EASA, and FAA. Our workshops carry the full suite of Robinson special tooling — from blade balancers to turbine inspection equipment.</p>
                  <p>We don't cut corners. Annual inspections, 12-year overhauls, avionics upgrades, and complete rebuilds are performed to factory specification, every time.</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div className="au32-block__img">
                <img src="/assets/images/facility/hq-0007.jpg" alt="Engineer inspecting helicopter mechanics" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* BLOCK 2: IMAGE LEFT, TEXT RIGHT */}
        <section className="au32-block au32-block--white">
          <div className="au32-block__inner au32-block__inner--reverse">
            <Reveal direction="left">
              <div className="au32-block__text">
                <span className="au32-pretext">02 &mdash; Training &amp; Sales</span>
                <h2 className="au32-heading">
                  <span>From </span><span>First Hover </span><span>To Ownership</span>
                </h2>
                <div className="au32-body">
                  <p>We train pilots from their first tentative hover to their commercial licence — PPL(H), CPL(H), and type ratings on the R22, R44, R66, and R88. As an Authorized Robinson Dealer, we sell new aircraft directly from the factory in Torrance, California, and maintain a rotating stock of pre-owned machines inspected to the same rigorous standard.</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div className="au32-block__img">
                <img src="/assets/images/facility/hq-0294.jpg" alt="Robinson precision tooling" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* QUOTE BAND */}
        <section className="au32-quote">
          <div className="au32-quote__inner">
            <Reveal>
              <p className="au32-quote__text">&ldquo;We don't just fly helicopters. We've flown them to the North Pole, the South Pole, and around the world. We've trained world champions and Hollywood actors. And we've been doing it from this same aerodrome since 1990.&rdquo;</p>
              <span className="au32-quote__attr">Captain Quentin Smith &mdash; Founder</span>
            </Reveal>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="au32-founder">
          <div className="au32-founder__inner">
            <Reveal direction="left">
              <div>
                <img className="au32-founder__portrait" src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith flying" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                <span className="au32-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div>
                <span className="au32-pretext">The Founder</span>
                <h2 className="au32-heading">
                  <span>Captain </span><span>Quentin </span><span>Smith</span>
                </h2>
                <div className="au32-body">
                  <p>Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. Recipient of the FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                  <p>In 1997, he completed the first circumnavigation of the globe in a piston-engine helicopter. In 2002 and 2005, he piloted the first piston helicopter to the North and South Poles. In 2018, Paramount selected him to train Tom Cruise for Mission: Impossible — Fallout.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS ROW */}
        <section className="au32-stats">
          <div className="au32-stats__inner">
            <div className="au32-stats__item">
              <span className="au32-stats__value"><AnimatedNumber value={35} suffix="+" /></span>
              <span className="au32-stats__label">Years</span>
            </div>
            <div className="au32-stats__sep" />
            <div className="au32-stats__item">
              <span className="au32-stats__value"><AnimatedNumber value={12000} suffix="+" /></span>
              <span className="au32-stats__label">Flight Hours</span>
            </div>
            <div className="au32-stats__sep" />
            <div className="au32-stats__item">
              <span className="au32-stats__value"><AnimatedNumber value={500} suffix="+" /></span>
              <span className="au32-stats__label">Pilots Trained</span>
            </div>
            <div className="au32-stats__sep" />
            <div className="au32-stats__item">
              <span className="au32-stats__value"><AnimatedNumber value={7} /></span>
              <span className="au32-stats__label">Continents</span>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="au32-timeline">
          <div className="au32-timeline__inner">
            <div className="au32-timeline__header">
              <Reveal>
                <span className="au32-pretext">03 &mdash; Heritage</span>
                <h2 className="au32-heading">
                  <span>Defining </span><span>Moments</span>
                </h2>
              </Reveal>
            </div>
            {MILESTONES.map(([year, desc], i) => (
              <Reveal key={year} delay={i * 0.06}>
                <div className="au32-timeline__item">
                  <span className="au32-timeline__year">{year}</span>
                  <span className="au32-timeline__desc">{desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PARALLAX BREAK */}
        <section ref={parallaxRef} className="au32-parallax">
          <motion.div className="au32-parallax__bg" style={{ y: pY }}>
            <img src="/assets/images/expeditions/north-pole.jpg" alt="North Pole Expedition" />
          </motion.div>
          <div className="au32-parallax__overlay" />
        </section>

        {/* CTA */}
        <section className="au32-cta">
          <div className="au32-cta__inner">
            <Reveal>
              <span className="au32-pretext">Get In Touch</span>
              <h2 className="au32-heading">
                <span>Begin </span><span>Your </span><span>Journey</span>
              </h2>
              <div className="au32-cta__buttons">
                <Link className="au32-btn au32-btn--light" to="/contact">Contact Us &rarr;</Link>
                <Link className="au32-btn au32-btn--ghost" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V3 — TECHNICAL DOSSIER
   Card-based modular layout with structured data, section refs,
   and clean borders. Extends the au17__card pattern.
   ============================================================ */

function AboutV3() {
  return (
    <>
      <style>{`
        .au33 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; min-height: 100vh; }

        /* ---- HEADER MODULE ---- */
        .au33-header { background: #fff; padding: 4rem 2rem 0; border-bottom: 1px solid #e8e6e2; }
        .au33-header__inner { max-width: 1200px; margin: 0 auto; }
        .au33-header__top { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 3rem; }
        .au33-header__brand {}
        .au33-header__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au33-header__title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; margin: 0; text-transform: uppercase; }
        .au33-header__title span:nth-child(1) { color: #1a1a1a; }
        .au33-header__title span:nth-child(2) { color: #4a4a4a; }
        .au33-header__title span:nth-child(3) { color: #7a7a7a; }
        .au33-header__subtitle { font-size: 1rem; color: #666; margin-top: 0.75rem; line-height: 1.6; max-width: 500px; }
        .au33-header__data { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; }
        .au33-header__datum { display: flex; align-items: baseline; gap: 1rem; justify-content: flex-end; }
        .au33-header__datum-key { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
        .au33-header__datum-val { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.05em; color: #1a1a1a; }

        /* ---- IMAGE BAND ---- */
        .au33-image-band { width: 100%; overflow: hidden; }
        .au33-image-band img { width: 100%; height: 360px; object-fit: cover; display: block; }

        /* ---- CARD GRID ---- */
        .au33-grid { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        /* ---- CARD BASE ---- */
        .au33-card { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; transition: all 0.3s ease; }
        .au33-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
        .au33-card--full { grid-column: 1 / -1; }
        .au33-card__ref { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e8e6e2; }
        .au33-card__title { font-size: 1.15rem; font-weight: 600; color: #1a1a1a; margin: 0 0 1rem; }
        .au33-card__body { font-size: 0.95rem; line-height: 1.7; color: #666; }
        .au33-card__body p { margin: 0 0 1rem; }
        .au33-card__body p:last-child { margin-bottom: 0; }

        /* ---- STAT CARD ---- */
        .au33-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .au33-stat { text-align: center; padding: 1.5rem 1rem; border: 1px solid #e8e6e2; }
        .au33-stat__value { font-family: 'Share Tech Mono', monospace; font-size: 1.6rem; font-weight: 600; color: #1a1a1a; display: block; line-height: 1; margin-bottom: 6px; }
        .au33-stat__label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }

        /* ---- FOUNDER CARD ---- */
        .au33-founder { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start; }
        .au33-founder__img { overflow: hidden; }
        .au33-founder__img img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .au33-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-top: 0.75rem; display: block; }

        /* ---- TIMELINE CARD ---- */
        .au33-tl-item { display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f0efec; }
        .au33-tl-item:last-child { border-bottom: none; }
        .au33-tl-item:first-child { padding-top: 0; }
        .au33-tl-year { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.08em; color: #999; flex-shrink: 0; width: 48px; }
        .au33-tl-desc { font-size: 0.88rem; line-height: 1.6; color: #666; }

        /* ---- SERVICES CARD ---- */
        .au33-svc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .au33-svc { padding: 1.5rem; border: 1px solid #e8e6e2; transition: all 0.3s ease; }
        .au33-svc:hover { border-color: #1a1a1a; }
        .au33-svc__num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: #999; display: block; margin-bottom: 0.75rem; }
        .au33-svc__title { font-size: 1rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.5rem; }
        .au33-svc__desc { font-size: 0.82rem; line-height: 1.6; color: #888; }

        /* ---- CREDENTIALS CARD ---- */
        .au33-cred-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .au33-cred { display: flex; align-items: baseline; gap: 1rem; padding: 0.6rem 0; border-bottom: 1px solid #f0efec; }
        .au33-cred:last-child { border-bottom: none; }
        .au33-cred__label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; width: 140px; flex-shrink: 0; }
        .au33-cred__value { font-size: 0.9rem; color: #1a1a1a; }

        /* ---- CTA MODULE ---- */
        .au33-cta { background: #1a1a1a; padding: 4rem 2rem; text-align: center; margin-top: -1px; }
        .au33-cta__inner { max-width: 600px; margin: 0 auto; }
        .au33-cta__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); display: block; margin-bottom: 1rem; }
        .au33-cta__heading { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.1; margin: 0 0 2rem; text-transform: uppercase; }
        .au33-cta__heading span:nth-child(1) { color: #fff; }
        .au33-cta__heading span:nth-child(2) { color: rgba(255,255,255,0.7); }
        .au33-cta__heading span:nth-child(3) { color: rgba(255,255,255,0.5); }
        .au33-cta__buttons { display: flex; gap: 1rem; justify-content: center; }
        .au33-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au33-btn--light { background: #fff; color: #1a1a1a; }
        .au33-btn--light:hover { background: #f5f5f2; }
        .au33-btn--ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        .au33-btn--ghost:hover { background: rgba(255,255,255,0.1); }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .au33-header__top { flex-direction: column; gap: 2rem; }
          .au33-header__data { text-align: left; align-items: flex-start; }
          .au33-header__datum { justify-content: flex-start; }
          .au33-grid { grid-template-columns: 1fr; }
          .au33-founder { grid-template-columns: 1fr; }
          .au33-svc-grid { grid-template-columns: 1fr 1fr; }
          .au33-stat-grid { grid-template-columns: 1fr 1fr; }
          .au33-cta__buttons { flex-direction: column; align-items: center; }
        }
        @media (max-width: 480px) {
          .au33-svc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="au33">
        {/* HEADER MODULE */}
        <header className="au33-header">
          <div className="au33-header__inner">
            <div className="au33-header__top">
              <div className="au33-header__brand">
                <Reveal>
                  <span className="au33-header__pretext">Company Brief</span>
                  <h1 className="au33-header__title">
                    <span>HQ </span><span>Aviation</span>
                  </h1>
                  <p className="au33-header__subtitle">The United Kingdom's leading Robinson helicopter specialists. Authorized Dealer, Authorized Service Centre, and CAA Approved Training Organisation since 1990.</p>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                <div className="au33-header__data">
                  <div className="au33-header__datum">
                    <span className="au33-header__datum-key">Established</span>
                    <span className="au33-header__datum-val">1990</span>
                  </div>
                  <div className="au33-header__datum">
                    <span className="au33-header__datum-key">Location</span>
                    <span className="au33-header__datum-val">Denham Aerodrome</span>
                  </div>
                  <div className="au33-header__datum">
                    <span className="au33-header__datum-key">ICAO</span>
                    <span className="au33-header__datum-val">EGLD</span>
                  </div>
                  <div className="au33-header__datum">
                    <span className="au33-header__datum-key">Coordinates</span>
                    <span className="au33-header__datum-val">51.5751&deg;N / 0.5059&deg;W</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </header>

        {/* IMAGE BAND */}
        <Reveal>
          <div className="au33-image-band">
            <img src="/assets/images/r66helis.jpg" alt="HQ Aviation Robinson R66 Fleet" />
          </div>
        </Reveal>

        {/* CARD GRID */}
        <div className="au33-grid">

          {/* CARD: OUR STORY */}
          <Reveal>
            <div className="au33-card">
              <span className="au33-card__ref">Ref. 01 &mdash; Our Story</span>
              <h2 className="au33-card__title">Built On Precision</h2>
              <div className="au33-card__body">
                <p>Founded by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown from a single-helicopter training operation into a complete centre of excellence. Over three decades, we have maintained, sold, and trained pilots on more Robinson helicopters than any other facility in the country.</p>
                <p>Today our facility houses one of the largest Robinson fleets in Europe, supported by CAA-approved engineers and instructors who share a relentless commitment to doing things properly.</p>
              </div>
            </div>
          </Reveal>

          {/* CARD: BY THE NUMBERS */}
          <Reveal delay={0.1}>
            <div className="au33-card">
              <span className="au33-card__ref">Ref. 02 &mdash; By The Numbers</span>
              <h2 className="au33-card__title">At a Glance</h2>
              <div className="au33-stat-grid">
                <div className="au33-stat">
                  <span className="au33-stat__value"><AnimatedNumber value={35} suffix="+" /></span>
                  <span className="au33-stat__label">Years</span>
                </div>
                <div className="au33-stat">
                  <span className="au33-stat__value"><AnimatedNumber value={12000} suffix="+" /></span>
                  <span className="au33-stat__label">Flight Hours</span>
                </div>
                <div className="au33-stat">
                  <span className="au33-stat__value"><AnimatedNumber value={500} suffix="+" /></span>
                  <span className="au33-stat__label">Pilots Trained</span>
                </div>
                <div className="au33-stat">
                  <span className="au33-stat__value"><AnimatedNumber value={7} /></span>
                  <span className="au33-stat__label">Continents</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* CARD: FOUNDER (FULL WIDTH) */}
          <Reveal>
            <div className="au33-card au33-card--full">
              <span className="au33-card__ref">Ref. 03 &mdash; The Founder</span>
              <div className="au33-founder">
                <div className="au33-founder__img">
                  <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" />
                  <span className="au33-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
                </div>
                <div>
                  <h2 className="au33-card__title">Captain Quentin Smith</h2>
                  <div className="au33-card__body">
                    <p>Two-time World Helicopter Aerobatics Champion, Guinness World Record holder, and recipient of the FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                    <p>In 1997, he completed the first circumnavigation of the globe in a piston-engine helicopter — a Robinson R44 that flew 30,000 miles across 28 countries. The aircraft now resides in the Smithsonian. In 2002 and 2005, he piloted the first piston helicopter to the North and South Poles respectively.</p>
                    <p>In 2018, Paramount Pictures selected Captain Smith to train Tom Cruise for the helicopter sequences in Mission: Impossible — Fallout. The following year, the FAI awarded him the Gold Rotorcraft Medal.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* CARD: HERITAGE */}
          <Reveal>
            <div className="au33-card">
              <span className="au33-card__ref">Ref. 04 &mdash; Heritage</span>
              <h2 className="au33-card__title">Milestones</h2>
              {MILESTONES.map(([year, desc]) => (
                <div key={year} className="au33-tl-item">
                  <span className="au33-tl-year">{year}</span>
                  <span className="au33-tl-desc">{desc}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CARD: CREDENTIALS */}
          <Reveal delay={0.1}>
            <div className="au33-card">
              <span className="au33-card__ref">Ref. 05 &mdash; Credentials</span>
              <h2 className="au33-card__title">Accreditations</h2>
              <div className="au33-cred-list">
                <div className="au33-cred"><span className="au33-cred__label">Robinson</span><span className="au33-cred__value">Authorized Dealer &amp; Service Centre</span></div>
                <div className="au33-cred"><span className="au33-cred__label">UK CAA</span><span className="au33-cred__value">Approved Training Organisation</span></div>
                <div className="au33-cred"><span className="au33-cred__label">EASA</span><span className="au33-cred__value">Part 145 Approved Maintenance</span></div>
                <div className="au33-cred"><span className="au33-cred__label">FAA</span><span className="au33-cred__value">Repair Station Certificate</span></div>
                <div className="au33-cred"><span className="au33-cred__label">FAI</span><span className="au33-cred__value">Gold Rotorcraft Medal (Capt. Smith)</span></div>
                <div className="au33-cred"><span className="au33-cred__label">Guinness</span><span className="au33-cred__value">World Record Holder</span></div>
              </div>
            </div>
          </Reveal>

          {/* CARD: SERVICES (FULL WIDTH) */}
          <Reveal>
            <div className="au33-card au33-card--full">
              <span className="au33-card__ref">Ref. 06 &mdash; Services</span>
              <h2 className="au33-card__title">What We Do</h2>
              <div className="au33-svc-grid">
                {SERVICES.map((svc) => (
                  <motion.div key={svc.num} className="au33-svc" whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                    <span className="au33-svc__num">{svc.num}</span>
                    <h3 className="au33-svc__title">{svc.title}</h3>
                    <p className="au33-svc__desc">{svc.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <section className="au33-cta">
          <div className="au33-cta__inner">
            <Reveal>
              <span className="au33-cta__pretext">Get In Touch</span>
              <h2 className="au33-cta__heading">
                <span>Begin </span><span>Your </span><span>Journey</span>
              </h2>
              <div className="au33-cta__buttons">
                <Link className="au33-btn au33-btn--light" to="/contact">Contact Us &rarr;</Link>
                <Link className="au33-btn au33-btn--ghost" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V4 — DARK CINEMATIC
   Rolls-Royce / Ferrari inspired: dark backgrounds, opacity-based
   text hierarchy, cinematic full-bleed imagery, and a scroll-
   linked reveal line between sections.
   ============================================================ */

function AboutV4() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '35%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  const imgRef1 = useRef(null);
  const { scrollYProgress: img1Scroll } = useScroll({ target: imgRef1, offset: ['start end', 'end start'] });
  const img1Y = useTransform(img1Scroll, [0, 1], ['-10%', '10%']);

  const imgRef2 = useRef(null);
  const { scrollYProgress: img2Scroll } = useScroll({ target: imgRef2, offset: ['start end', 'end start'] });
  const img2Y = useTransform(img2Scroll, [0, 1], ['-10%', '10%']);

  return (
    <>
      <style>{`
        .au34 { font-family: 'Space Grotesk', sans-serif; background: #0f0f0f; color: #fff; }

        /* ---- HERO ---- */
        .au34-hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; display: flex; align-items: flex-end; justify-content: flex-start; }
        .au34-hero__bg { position: absolute; inset: -10%; z-index: 1; }
        .au34-hero__bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.7) brightness(0.6); }
        .au34-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(15,15,15,0.2) 0%, rgba(15,15,15,0.5) 40%, rgba(15,15,15,0.95) 100%); }
        .au34-hero__content { position: relative; z-index: 3; padding: 0 6vw 8vh; max-width: 750px; }
        .au34-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4); display: block; margin-bottom: 2rem; }
        .au34-hero__title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 700; line-height: 0.95; margin: 0; text-transform: uppercase; letter-spacing: -0.02em; }
        .au34-hero__title-sub { color: rgba(255,255,255,0.5); }
        .au34-hero__line { width: 60px; height: 1px; background: rgba(255,255,255,0.25); margin: 2.5rem 0; }
        .au34-hero__desc { font-size: 1rem; line-height: 1.75; color: rgba(255,255,255,0.55); max-width: 480px; }

        /* ---- SECTION REVEAL LINE ---- */
        .au34-reveal-line { height: 1px; background: rgba(255,255,255,0.08); margin: 0 6vw; position: relative; overflow: hidden; }
        .au34-reveal-line__inner { height: 100%; background: rgba(255,255,255,0.2); transform-origin: left; }

        /* ---- TEXT SECTION ---- */
        .au34-text { padding: 10vh 6vw; max-width: 1400px; margin: 0 auto; }
        .au34-text--centered { text-align: center; max-width: 700px; margin: 0 auto; padding: 10vh 2rem; }
        .au34-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.35); display: block; margin-bottom: 1.5rem; }
        .au34-heading { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; margin: 0 0 2rem; text-transform: uppercase; }
        .au34-heading--glow { color: #fff; }
        .au34-heading--mid { color: rgba(255,255,255,0.6); }
        .au34-heading--dim { color: rgba(255,255,255,0.35); }
        .au34-body { font-size: 1rem; line-height: 1.85; color: rgba(255,255,255,0.55); }
        .au34-body p { margin: 0 0 1.5rem; }
        .au34-body p:last-child { margin-bottom: 0; }

        /* ---- SPLIT ---- */
        .au34-split { display: grid; grid-template-columns: 55fr 45fr; min-height: 70vh; align-items: center; }
        .au34-split--reverse { grid-template-columns: 45fr 55fr; }
        .au34-split__img { position: relative; overflow: hidden; height: 100%; min-height: 500px; }
        .au34-split__img img { width: 100%; height: 100%; object-fit: cover; }
        .au34-split__text { padding: 6vh 5vw; }

        /* ---- FULL BLEED IMAGE ---- */
        .au34-fullbleed { position: relative; height: 50vh; min-height: 350px; overflow: hidden; }
        .au34-fullbleed__bg { position: absolute; inset: -10%; }
        .au34-fullbleed__bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.7); }
        .au34-fullbleed__overlay { position: absolute; inset: 0; background: rgba(15,15,15,0.6); }
        .au34-fullbleed__content { position: relative; z-index: 2; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
        .au34-fullbleed__quote { font-size: clamp(1.4rem, 3vw, 2.2rem); font-weight: 500; line-height: 1.4; color: #fff; font-style: italic; max-width: 700px; margin: 0 0 1.5rem; }
        .au34-fullbleed__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); }

        /* ---- STATS ---- */
        .au34-stats { padding: 5rem 6vw; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .au34-stats__inner { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; }
        .au34-stats__item { text-align: center; flex: 1; }
        .au34-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 600; color: #fff; display: block; line-height: 1; margin-bottom: 8px; }
        .au34-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .au34-stats__sep { width: 1px; height: 50px; background: rgba(255,255,255,0.1); flex-shrink: 0; align-self: center; }

        /* ---- TIMELINE ---- */
        .au34-timeline { padding: 10vh 6vw; }
        .au34-timeline__inner { max-width: 800px; margin: 0 auto; }
        .au34-timeline__list { margin-top: 3rem; }
        .au34-timeline__item { display: flex; gap: 3rem; padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .au34-timeline__item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .au34-timeline__year { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); flex-shrink: 0; width: 60px; }
        .au34-timeline__desc { font-size: 0.95rem; line-height: 1.65; color: rgba(255,255,255,0.6); }
        .au34-timeline__watermark { font-family: 'Share Tech Mono', monospace; font-size: clamp(5rem, 12vw, 9rem); font-weight: 200; color: rgba(255,255,255,0.03); position: absolute; right: 4vw; top: 50%; transform: translateY(-50%); pointer-events: none; }

        /* ---- CTA ---- */
        .au34-cta { padding: 10vh 2rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); }
        .au34-cta__inner { max-width: 600px; margin: 0 auto; }
        .au34-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .au34-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au34-btn--light { background: #fff; color: #0f0f0f; }
        .au34-btn--light:hover { background: #e8e6e2; }
        .au34-btn--ghost { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
        .au34-btn--ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

        @media (max-width: 768px) {
          .au34-split, .au34-split--reverse { grid-template-columns: 1fr; }
          .au34-split__img { min-height: 300px; }
          .au34-stats__inner { flex-wrap: wrap; gap: 2rem; }
          .au34-stats__sep { display: none; }
          .au34-stats__item { min-width: 45%; }
          .au34-timeline__item { flex-direction: column; gap: 0.5rem; }
          .au34-timeline__year { width: auto; }
          .au34-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au34">
        {/* HERO — Bottom-left aligned, cinematic gradient */}
        <section ref={heroRef} className="au34-hero">
          <motion.div className="au34-hero__bg" style={{ y: heroY }}>
            <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="Helicopter flying at dusk over English countryside" />
          </motion.div>
          <div className="au34-hero__overlay" />
          <motion.div className="au34-hero__content" style={{ opacity: heroOpacity }}>
            <motion.span className="au34-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              Est. 1990 &middot; Denham Aerodrome &middot; EGLD
            </motion.span>
            <h1 className="au34-hero__title">
              <motion.span style={{ display: 'block' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                The Robinson
              </motion.span>
              <motion.span className="au34-hero__title-sub" style={{ display: 'block' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 0.5, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                Specialists
              </motion.span>
            </h1>
            <motion.div className="au34-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: 'left' }} />
            <motion.p className="au34-hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
              The United Kingdom's leading Robinson helicopter company. Authorized Dealer, Service Centre, and Training Organisation since 1990.
            </motion.p>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="au34-stats">
          <div className="au34-stats__inner">
            <div className="au34-stats__item">
              <span className="au34-stats__value"><AnimatedNumber value={35} suffix="+" /></span>
              <span className="au34-stats__label">Years</span>
            </div>
            <div className="au34-stats__sep" />
            <div className="au34-stats__item">
              <span className="au34-stats__value"><AnimatedNumber value={12000} suffix="+" /></span>
              <span className="au34-stats__label">Flight Hours</span>
            </div>
            <div className="au34-stats__sep" />
            <div className="au34-stats__item">
              <span className="au34-stats__value"><AnimatedNumber value={500} suffix="+" /></span>
              <span className="au34-stats__label">Pilots Trained</span>
            </div>
            <div className="au34-stats__sep" />
            <div className="au34-stats__item">
              <span className="au34-stats__value"><AnimatedNumber value={7} /></span>
              <span className="au34-stats__label">Continents</span>
            </div>
          </div>
        </section>

        {/* INTRO TEXT — CENTERED */}
        <section className="au34-text--centered">
          <Reveal>
            <span className="au34-pretext">01 &mdash; Our Story</span>
            <h2 className="au34-heading">
              <span className="au34-heading--glow">Built </span>
              <span className="au34-heading--mid">On </span>
              <span className="au34-heading--dim">Precision</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="au34-body">
              <p>Founded in 1990 by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown to become the United Kingdom's leading Robinson helicopter specialists. What started as a single-helicopter training operation has, over three decades, evolved into a complete centre of excellence — sales, training, maintenance, and expeditions from a single facility.</p>
            </div>
          </Reveal>
        </section>

        <div className="au34-reveal-line">
          <motion.div className="au34-reveal-line__inner" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        {/* SPLIT: IMAGE + TEXT */}
        <section className="au34-split">
          <div ref={imgRef1} className="au34-split__img">
            <motion.img src="/assets/images/facility/hq-0007.jpg" alt="Engineer inspecting helicopter" style={{ y: img1Y }} />
          </div>
          <div className="au34-split__text">
            <Reveal>
              <span className="au34-pretext">Complete Helicopter Services</span>
              <h2 className="au34-heading">
                <span className="au34-heading--glow">Every </span>
                <span className="au34-heading--mid">Machine, </span>
                <span className="au34-heading--dim">Every Detail</span>
              </h2>
              <div className="au34-body">
                <p>Every Robinson that passes through our facility receives the same uncompromising standard of care. Our engineers hold approvals from the CAA, EASA, and FAA, and our workshops carry the full suite of Robinson special tooling.</p>
                <p>We train pilots from first hover to commercial licence. We sell new aircraft directly from the Robinson factory. When something wears out, we rebuild it to factory specification.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FULL-BLEED QUOTE */}
        <section className="au34-fullbleed">
          <div className="au34-fullbleed__bg">
            <img src="/assets/images/expeditions/north-pole.jpg" alt="North Pole expedition" />
          </div>
          <div className="au34-fullbleed__overlay" />
          <div className="au34-fullbleed__content">
            <Reveal>
              <div>
                <p className="au34-fullbleed__quote">&ldquo;We don't just fly helicopters. We've flown them to the North Pole, the South Pole, and around the world.&rdquo;</p>
                <span className="au34-fullbleed__attr">Captain Quentin Smith &mdash; Founder</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SPLIT REVERSE: TEXT + IMAGE */}
        <section className="au34-split au34-split--reverse">
          <div className="au34-split__text">
            <Reveal>
              <span className="au34-pretext">The Founder</span>
              <h2 className="au34-heading">
                <span className="au34-heading--glow">Captain </span>
                <span className="au34-heading--mid">Quentin </span>
                <span className="au34-heading--dim">Smith</span>
              </h2>
              <div className="au34-body">
                <p>Two-time World Helicopter Aerobatics Champion, Guinness World Record holder, and recipient of the FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                <p>In 1997, he completed the first circumnavigation of the globe in a piston-engine helicopter. In 2002 and 2005, he piloted the first piston helicopter to the North and South Poles. In 2018, Paramount selected him to train Tom Cruise for Mission: Impossible — Fallout.</p>
              </div>
            </Reveal>
          </div>
          <div ref={imgRef2} className="au34-split__img">
            <motion.img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" style={{ y: img2Y }} />
          </div>
        </section>

        <div className="au34-reveal-line">
          <motion.div className="au34-reveal-line__inner" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        {/* TIMELINE WITH WATERMARK */}
        <section className="au34-timeline" style={{ position: 'relative' }}>
          <span className="au34-timeline__watermark">1990</span>
          <div className="au34-timeline__inner">
            <Reveal>
              <span className="au34-pretext">02 &mdash; Heritage</span>
              <h2 className="au34-heading">
                <span className="au34-heading--glow">Defining </span>
                <span className="au34-heading--mid">Moments</span>
              </h2>
            </Reveal>
            <div className="au34-timeline__list">
              {MILESTONES.map(([year, desc], i) => (
                <Reveal key={year} delay={i * 0.07}>
                  <div className="au34-timeline__item">
                    <span className="au34-timeline__year">{year}</span>
                    <span className="au34-timeline__desc">{desc}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="au34-cta">
          <div className="au34-cta__inner">
            <Reveal>
              <span className="au34-pretext">Get In Touch</span>
              <h2 className="au34-heading">
                <span className="au34-heading--glow">Begin </span>
                <span className="au34-heading--mid">Your </span>
                <span className="au34-heading--dim">Journey</span>
              </h2>
              <div className="au34-cta__buttons">
                <Link className="au34-btn au34-btn--light" to="/contact">Contact Us &rarr;</Link>
                <Link className="au34-btn au34-btn--ghost" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V5 — SANCTUARY SCROLL
   Aman / Byredo inspired: warm backgrounds, maximum whitespace,
   single-thought sections, associative storytelling with slow
   "drift" reveal animations.
   ============================================================ */

function AboutV5() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  return (
    <>
      <style>{`
        .au35 { font-family: 'Space Grotesk', sans-serif; background: #F5F0EB; }

        /* ---- HERO ---- */
        .au35-hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; }
        .au35-hero__bg { position: absolute; inset: 0; }
        .au35-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au35-hero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(245,240,235,0) 0%, rgba(245,240,235,0.4) 60%, rgba(245,240,235,1) 100%); }
        .au35-hero__content { position: absolute; bottom: 10vh; left: 0; right: 0; z-index: 2; text-align: center; padding: 0 2rem; }
        .au35-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: #888; display: block; margin-bottom: 2rem; }
        .au35-hero__title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; line-height: 1.15; margin: 0; color: #2C2C2C; }
        .au35-hero__line { width: 40px; height: 1px; background: rgba(0,0,0,0.2); margin: 2rem auto 0; }

        /* ---- SINGLE THOUGHT ---- */
        .au35-thought { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 12vh 2rem; }
        .au35-thought__text { max-width: 540px; text-align: center; }
        .au35-thought__text p { font-size: 1.15rem; line-height: 2; color: #555; font-weight: 400; margin: 0; }
        .au35-thought__text p:first-child { font-size: 1.35rem; color: #2C2C2C; }

        /* ---- SINGLE IMAGE ---- */
        .au35-image { display: flex; align-items: center; justify-content: center; padding: 6vh 2rem; }
        .au35-image img { width: 60vw; max-width: 900px; aspect-ratio: 16/10; object-fit: cover; display: block; }

        /* ---- WIDE IMAGE ---- */
        .au35-wide { padding: 0 5vw; }
        .au35-wide img { width: 100%; aspect-ratio: 21/9; object-fit: cover; display: block; }

        /* ---- FOUNDER ---- */
        .au35-founder { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1200px; margin: 0 auto; padding: 10vh 4vw; }
        .au35-founder__portrait img { width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block; }
        .au35-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-top: 1rem; display: block; }
        .au35-founder__text {}
        .au35-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
        .au35-heading { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 300; line-height: 1.15; margin: 0 0 2rem; color: #2C2C2C; }
        .au35-body { font-size: 1rem; line-height: 1.9; color: rgba(44,44,44,0.6); }
        .au35-body p { margin: 0 0 1.5rem; }
        .au35-body p:last-child { margin-bottom: 0; }

        /* ---- TIMELINE ---- */
        .au35-timeline { max-width: 700px; margin: 0 auto; padding: 10vh 2rem; }
        .au35-timeline__header { text-align: center; margin-bottom: 3rem; }
        .au35-timeline__item { display: flex; gap: 2.5rem; padding: 1.25rem 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .au35-timeline__item:first-child { border-top: 1px solid rgba(0,0,0,0.06); }
        .au35-timeline__year { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.1em; color: #bbb; flex-shrink: 0; width: 55px; }
        .au35-timeline__desc { font-size: 0.92rem; line-height: 1.65; color: rgba(44,44,44,0.6); }

        /* ---- SERVICES ---- */
        .au35-services { max-width: 1100px; margin: 0 auto; padding: 10vh 2rem; }
        .au35-services__header { text-align: center; margin-bottom: 3rem; }
        .au35-services__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .au35-services__card { padding: 2.5rem 2rem; background: #fff; transition: all 0.4s ease; }
        .au35-services__card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.04); transform: translateY(-2px); }
        .au35-services__card-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; color: #bbb; display: block; margin-bottom: 1rem; }
        .au35-services__card-title { font-size: 1.1rem; font-weight: 500; color: #2C2C2C; margin: 0 0 0.75rem; }
        .au35-services__card-desc { font-size: 0.88rem; line-height: 1.7; color: rgba(44,44,44,0.55); margin: 0; }

        /* ---- CTA ---- */
        .au35-cta { padding: 10vh 2rem 12vh; text-align: center; }
        .au35-cta__inner { max-width: 500px; margin: 0 auto; }
        .au35-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .au35-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.4s ease; border: none; }
        .au35-btn--dark { background: #2C2C2C; color: #F5F0EB; }
        .au35-btn--dark:hover { background: #444; }
        .au35-btn--outline { background: transparent; color: #2C2C2C; border: 1px solid rgba(44,44,44,0.25); }
        .au35-btn--outline:hover { border-color: #2C2C2C; }

        @media (max-width: 768px) {
          .au35-founder { grid-template-columns: 1fr; gap: 2rem; }
          .au35-services__grid { grid-template-columns: 1fr; }
          .au35-image img { width: 90vw; }
          .au35-cta__buttons { flex-direction: column; align-items: center; }
          .au35-timeline__item { flex-direction: column; gap: 0.5rem; }
          .au35-timeline__year { width: auto; }
        }
      `}</style>

      <div className="au35">
        {/* HERO — Scale on scroll, warm fade to background */}
        <section ref={heroRef} className="au35-hero">
          <motion.div className="au35-hero__bg" style={{ scale: heroScale }}>
            <img src="/assets/images/r66helis.jpg" alt="Robinson R66 fleet at Denham" />
          </motion.div>
          <div className="au35-hero__overlay" />
          <motion.div className="au35-hero__content" style={{ opacity: heroOpacity }}>
            <motion.span className="au35-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}>
              Denham Aerodrome &middot; Since 1990
            </motion.span>
            <motion.h1 className="au35-hero__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
              The Robinson Specialists
            </motion.h1>
            <motion.div className="au35-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }} />
          </motion.div>
        </section>

        {/* THOUGHT 1 */}
        <div className="au35-thought">
          <Reveal>
            <div className="au35-thought__text">
              <p>We were founded on a simple conviction.</p>
              <p>That a helicopter company should do everything — train pilots, sell aircraft, maintain machines, and fly expeditions — and do all of it to the same uncompromising standard.</p>
            </div>
          </Reveal>
        </div>

        {/* IMAGE 1 */}
        <div className="au35-image">
          <Reveal>
            <img src="/assets/images/facility/hq-0089.jpg" alt="Hangar at Denham Aerodrome" />
          </Reveal>
        </div>

        {/* THOUGHT 2 */}
        <div className="au35-thought">
          <Reveal>
            <div className="au35-thought__text">
              <p>Over three decades, we have maintained, sold, and trained pilots on more Robinson helicopters than any other facility in the United Kingdom.</p>
            </div>
          </Reveal>
        </div>

        {/* IMAGE 2 */}
        <div className="au35-image">
          <Reveal>
            <img src="/assets/images/facility/hq-0007.jpg" alt="Precision engineering" />
          </Reveal>
        </div>

        {/* FOUNDER */}
        <section className="au35-founder">
          <Reveal direction="left">
            <div>
              <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" className="au35-founder__portrait" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
              <span className="au35-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="au35-founder__text">
              <span className="au35-pretext">The Founder</span>
              <h2 className="au35-heading">Captain Quentin Smith</h2>
              <div className="au35-body">
                <p>Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. Recipient of the FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                <p>In 1997, he completed the first circumnavigation of the globe in a piston-engine helicopter. In 2002 and 2005, he piloted the first piston helicopter to the North and South Poles. In 2018, Paramount selected him to train Tom Cruise for Mission: Impossible — Fallout.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* WIDE IMAGE */}
        <Reveal>
          <div className="au35-wide">
            <img src="/assets/images/expeditions/six-helis-in-North-Pole.jpg" alt="Expedition helicopters at the North Pole" />
          </div>
        </Reveal>

        {/* TIMELINE */}
        <section className="au35-timeline">
          <div className="au35-timeline__header">
            <Reveal>
              <span className="au35-pretext">Heritage</span>
              <h2 className="au35-heading">Defining Moments</h2>
            </Reveal>
          </div>
          {MILESTONES.map(([year, desc], i) => (
            <Reveal key={year} delay={i * 0.06}>
              <div className="au35-timeline__item">
                <span className="au35-timeline__year">{year}</span>
                <span className="au35-timeline__desc">{desc}</span>
              </div>
            </Reveal>
          ))}
        </section>

        {/* SERVICES */}
        <section className="au35-services">
          <div className="au35-services__header">
            <Reveal>
              <span className="au35-pretext">What We Do</span>
              <h2 className="au35-heading">Four Pillars</h2>
            </Reveal>
          </div>
          <div className="au35-services__grid">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.num} delay={i * 0.1}>
                <div className="au35-services__card">
                  <span className="au35-services__card-num">{svc.num}</span>
                  <h3 className="au35-services__card-title">{svc.title}</h3>
                  <p className="au35-services__card-desc">{svc.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="au35-cta">
          <div className="au35-cta__inner">
            <Reveal>
              <span className="au35-pretext">Get In Touch</span>
              <h2 className="au35-heading">Begin Your Journey</h2>
              <div className="au35-cta__buttons">
                <Link className="au35-btn au35-btn--dark" to="/contact">Contact Us &rarr;</Link>
                <Link className="au35-btn au35-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V6 — FRACTURED VELOCITY
   McLaren / Foster+Partners inspired: deliberately broken grid,
   staggered offsets, giant background numerals, diagonal
   clip-paths, and a sticky text column with scrolling imagery.
   ============================================================ */

function AboutV6() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  return (
    <>
      <style>{`
        .au36 { font-family: 'Space Grotesk', sans-serif; background: #fff; overflow-x: hidden; }

        /* ---- HERO ---- */
        .au36-hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; display: flex; align-items: center; }
        .au36-hero__bg { position: absolute; inset: -10%; z-index: 1; }
        .au36-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au36-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%); }
        .au36-hero__content { position: relative; z-index: 3; padding: 0 0 0 6vw; }
        .au36-hero__number { font-family: 'Share Tech Mono', monospace; font-size: clamp(8rem, 20vw, 16rem); font-weight: 100; line-height: 0.85; color: rgba(255,255,255,0.04); position: absolute; top: -2rem; left: -3vw; pointer-events: none; }
        .au36-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4); display: block; margin-bottom: 2rem; }
        .au36-hero__title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 800; line-height: 0.9; margin: 0; text-transform: uppercase; color: #fff; max-width: 600px; }
        .au36-hero__title-break { display: block; color: rgba(255,255,255,0.5); margin-top: 0.2em; }
        .au36-hero__line { width: 80px; height: 2px; background: #fff; margin: 2rem 0; }
        .au36-hero__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }

        /* ---- DIAGONAL SECTION ---- */
        .au36-diagonal { background: #faf9f6; clip-path: polygon(0 3%, 100% 0, 100% 97%, 0 100%); padding: 10vh 0; margin: -3vh 0; position: relative; }

        /* ---- STAGGERED BLOCKS ---- */
        .au36-block { position: relative; padding: 8rem 0; }
        .au36-block__number { font-family: 'Share Tech Mono', monospace; font-size: 8rem; font-weight: 100; color: rgba(0,0,0,0.04); position: absolute; left: -2vw; top: 4rem; line-height: 1; pointer-events: none; }
        .au36-block__content { max-width: 420px; }
        .au36-block--left .au36-block__content { margin-left: 15vw; }
        .au36-block--right .au36-block__content { margin-left: auto; margin-right: 15vw; }
        .au36-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
        .au36-heading { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; text-transform: uppercase; }
        .au36-heading span:nth-child(1) { color: #1a1a1a; }
        .au36-heading span:nth-child(2) { color: #4a4a4a; }
        .au36-heading span:nth-child(3) { color: #7a7a7a; }
        .au36-body { font-size: 0.95rem; line-height: 1.85; color: #666; }
        .au36-body p { margin: 0 0 1.25rem; }
        .au36-body p:last-child { margin-bottom: 0; }

        /* ---- WINDOW SPLIT ---- */
        .au36-window { display: grid; grid-template-columns: minmax(300px, 35%) 1fr; min-height: 80vh; }
        .au36-window__text { padding: 10vh 3rem 10vh 6vw; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: center; }
        .au36-window__images { display: flex; flex-direction: column; gap: 2px; }
        .au36-window__images img { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; }

        /* ---- DARK BAND ---- */
        .au36-dark { background: #1a1a1a; padding: 8rem 2rem; position: relative; overflow: hidden; }
        .au36-dark__inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 2; }
        .au36-dark .au36-pretext { color: rgba(255,255,255,0.35); }
        .au36-dark .au36-heading span:nth-child(1) { color: #fff; }
        .au36-dark .au36-heading span:nth-child(2) { color: rgba(255,255,255,0.6); }
        .au36-dark .au36-heading span:nth-child(3) { color: rgba(255,255,255,0.35); }
        .au36-dark__watermark { font-family: 'Share Tech Mono', monospace; font-size: clamp(6rem, 15vw, 12rem); font-weight: 100; color: rgba(255,255,255,0.03); position: absolute; right: 4vw; top: 50%; transform: translateY(-50%); pointer-events: none; }

        /* ---- TIMELINE ---- */
        .au36-tl-item { display: flex; gap: 2.5rem; padding: 1.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .au36-tl-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .au36-tl-year { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); flex-shrink: 0; width: 60px; }
        .au36-tl-desc { font-size: 0.92rem; line-height: 1.65; color: rgba(255,255,255,0.6); }

        /* ---- STATS STRIP ---- */
        .au36-stats { padding: 3rem 2rem; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; background: #fff; }
        .au36-stats__inner { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; }
        .au36-stats__item { text-align: center; flex: 1; }
        .au36-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; font-weight: 600; color: #1a1a1a; display: block; line-height: 1; margin-bottom: 6px; }
        .au36-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
        .au36-stats__sep { width: 1px; height: 50px; background: #e8e6e2; flex-shrink: 0; align-self: center; }

        /* ---- CTA ---- */
        .au36-cta { padding: 8rem 2rem; text-align: center; background: #faf9f6; }
        .au36-cta__inner { max-width: 600px; margin: 0 auto; }
        .au36-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .au36-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au36-btn--primary { background: #1a1a1a; color: #fff; }
        .au36-btn--primary:hover { background: #333; }
        .au36-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au36-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au36-block--left .au36-block__content,
          .au36-block--right .au36-block__content { margin-left: 2rem; margin-right: 2rem; }
          .au36-block__number { display: none; }
          .au36-window { grid-template-columns: 1fr; }
          .au36-window__text { border-right: none; padding: 4rem 2rem; }
          .au36-diagonal { clip-path: none; margin: 0; }
          .au36-stats__inner { flex-wrap: wrap; gap: 1.5rem; }
          .au36-stats__sep { display: none; }
          .au36-stats__item { min-width: 45%; }
          .au36-cta__buttons { flex-direction: column; align-items: center; }
          .au36-tl-item { flex-direction: column; gap: 0.5rem; }
          .au36-tl-year { width: auto; }
        }
      `}</style>

      <div className="au36">
        {/* HERO — Diagonal gradient, left-aligned, giant background number */}
        <section ref={heroRef} className="au36-hero">
          <motion.div className="au36-hero__bg" style={{ y: heroY }}>
            <img src="/assets/images/gallery/flying/flying--1.jpg" alt="Robinson helicopter in flight" />
          </motion.div>
          <div className="au36-hero__overlay" />
          <motion.div className="au36-hero__content" style={{ opacity: heroOpacity }}>
            <span className="au36-hero__number">HQ</span>
            <motion.span className="au36-hero__pretext" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              Est. 1990
            </motion.span>
            <h1 className="au36-hero__title">
              <motion.span style={{ display: 'block' }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                The Robinson
              </motion.span>
              <motion.span className="au36-hero__title-break" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.5, x: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                Specialists
              </motion.span>
            </h1>
            <motion.div className="au36-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.9 }} style={{ transformOrigin: 'left' }} />
            <motion.span className="au36-hero__coords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.1 }}>
              51.5751&deg;N &middot; 0.5059&deg;W &middot; EGLD
            </motion.span>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="au36-stats">
          <div className="au36-stats__inner">
            <div className="au36-stats__item">
              <span className="au36-stats__value"><AnimatedNumber value={35} suffix="+" /></span>
              <span className="au36-stats__label">Years</span>
            </div>
            <div className="au36-stats__sep" />
            <div className="au36-stats__item">
              <span className="au36-stats__value"><AnimatedNumber value={12000} suffix="+" /></span>
              <span className="au36-stats__label">Flight Hours</span>
            </div>
            <div className="au36-stats__sep" />
            <div className="au36-stats__item">
              <span className="au36-stats__value"><AnimatedNumber value={500} suffix="+" /></span>
              <span className="au36-stats__label">Pilots Trained</span>
            </div>
            <div className="au36-stats__sep" />
            <div className="au36-stats__item">
              <span className="au36-stats__value"><AnimatedNumber value={7} /></span>
              <span className="au36-stats__label">Continents</span>
            </div>
          </div>
        </section>

        {/* STAGGERED BLOCK — LEFT */}
        <div className="au36-block au36-block--left">
          <span className="au36-block__number">01</span>
          <Reveal direction="left">
            <div className="au36-block__content">
              <span className="au36-pretext">Our Story</span>
              <h2 className="au36-heading">
                <span>Built </span><span>On </span><span>Precision</span>
              </h2>
              <div className="au36-body">
                <p>Founded in 1990 by Captain Quentin Smith at Denham Aerodrome. Over three decades, we have maintained, sold, and trained pilots on more Robinson helicopters than any other facility in the country.</p>
                <p>Our engineers hold approvals from the CAA, EASA, and FAA. Our workshops carry the full suite of Robinson special tooling.</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* DIAGONAL SECTION */}
        <div className="au36-diagonal">
          {/* STAGGERED BLOCK — RIGHT */}
          <div className="au36-block au36-block--right" style={{ padding: '4rem 0' }}>
            <Reveal direction="right">
              <div className="au36-block__content">
                <span className="au36-pretext">Training &amp; Sales</span>
                <h2 className="au36-heading">
                  <span>From </span><span>First Hover </span><span>To Ownership</span>
                </h2>
                <div className="au36-body">
                  <p>We train pilots from their first tentative hover to their commercial licence — PPL(H), CPL(H), and type ratings across the full Robinson range. As an Authorized Robinson Dealer, we sell new aircraft directly from the factory in Torrance, California.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* WINDOW SPLIT — Sticky text, scrolling images */}
        <section className="au36-window">
          <div className="au36-window__text">
            <Reveal>
              <span className="au36-pretext">The Founder</span>
              <h2 className="au36-heading">
                <span>Captain </span><span>Quentin </span><span>Smith</span>
              </h2>
              <div className="au36-body">
                <p>Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. FAI Gold Rotorcraft Medal recipient.</p>
                <p>First piston-engine helicopter circumnavigation. First piston helicopter to the North Pole. First piston helicopter to the South Pole. Trained Tom Cruise for Mission: Impossible — Fallout.</p>
              </div>
            </Reveal>
          </div>
          <div className="au36-window__images">
            <Reveal><img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" /></Reveal>
            <Reveal delay={0.1}><img src="/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp" alt="South Pole expedition" /></Reveal>
            <Reveal delay={0.2}><img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="World Championship" /></Reveal>
          </div>
        </section>

        {/* DARK TIMELINE */}
        <section className="au36-dark">
          <span className="au36-dark__watermark">1990</span>
          <div className="au36-dark__inner">
            <Reveal>
              <span className="au36-pretext">Heritage</span>
              <h2 className="au36-heading" style={{ marginBottom: '3rem' }}>
                <span>Defining </span><span>Moments</span>
              </h2>
            </Reveal>
            {MILESTONES.map(([year, desc], i) => (
              <Reveal key={year} delay={i * 0.06}>
                <div className="au36-tl-item">
                  <span className="au36-tl-year">{year}</span>
                  <span className="au36-tl-desc">{desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="au36-cta">
          <div className="au36-cta__inner">
            <Reveal>
              <span className="au36-pretext">Get In Touch</span>
              <h2 className="au36-heading">
                <span>Begin </span><span>Your </span><span>Journey</span>
              </h2>
              <div className="au36-cta__buttons">
                <Link className="au36-btn au36-btn--primary" to="/contact">Contact Us &rarr;</Link>
                <Link className="au36-btn au36-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V7 — ACCORDION PANELS
   Ultra-compact: hero + horizontal accordion + marquee strip +
   compact founder + CTA. Everything in minimal vertical space.
   The accordion uses flex ratio animation (1 vs 4) from
   FlyingVariations V4.
   ============================================================ */

const ACCORDION_PANELS = [
  {
    num: '01',
    label: 'Our Story',
    title: 'Built On Precision',
    body: 'Founded in 1990 by Captain Quentin Smith at Denham Aerodrome. Over three decades, we have maintained, sold, and trained pilots on more Robinson helicopters than any other facility in the UK.',
    img: '/assets/images/facility/hq-0089.jpg',
  },
  {
    num: '02',
    label: 'Training',
    title: 'First Hover To CPL',
    body: 'CAA Approved Training Organisation. PPL(H) through CPL(H), with type ratings on the R22, R44, R66, and R88. Over 500 pilots trained from our Denham base.',
    img: '/assets/images/training/home-2312.jpg',
  },
  {
    num: '03',
    label: 'Maintenance',
    title: 'Factory Standard',
    body: 'Authorized Robinson Service Centre. Annual inspections, 12-year overhauls, avionics upgrades, and complete refurbishments — all to factory specification.',
    img: '/assets/images/facility/hq-0007.jpg',
  },
  {
    num: '04',
    label: 'Sales',
    title: 'New & Pre-Owned',
    body: 'Authorized Robinson Dealer. New aircraft direct from Torrance, California. Rotating stock of pre-owned machines inspected to the same rigorous standard.',
    img: '/assets/images/facility/main-sales-pic.jpg',
  },
  {
    num: '05',
    label: 'Expeditions',
    title: 'Seven Continents',
    body: 'Polar aviation, English Channel crossings, and bespoke adventure flight planning. The first piston helicopter to both Poles. Around the world in an R44.',
    img: '/assets/images/expeditions/north-pole.jpg',
  },
];

const MARQUEE_ITEMS = [
  'Est. 1990', 'Denham Aerodrome', 'Authorized Robinson Dealer', 'CAA Approved ATO',
  '12,000+ Flight Hours', '500+ Pilots Trained', '7 Continents', 'FAI Gold Medal',
  'World Helicopter Champion', 'Mission: Impossible', 'North Pole', 'South Pole',
];

function AboutV7() {
  const [activePanel, setActivePanel] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 0.95]);

  return (
    <>
      <style>{`
        .au37 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- COMPACT HERO ---- */
        .au37-hero { position: relative; height: 70vh; min-height: 500px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .au37-hero__bg { position: absolute; inset: -5%; z-index: 1; }
        .au37-hero__bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.8); }
        .au37-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%); }
        .au37-hero__content { position: relative; z-index: 3; text-align: center; color: #fff; padding: 0 2rem; }
        .au37-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.5); display: block; margin-bottom: 1.5rem; }
        .au37-hero__title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 0.95; margin: 0; text-transform: uppercase; }
        .au37-hero__title-sub { color: rgba(255,255,255,0.5); }
        .au37-hero__line { width: 50px; height: 1px; background: rgba(255,255,255,0.3); margin: 1.5rem auto 0; }

        /* ---- MARQUEE ---- */
        .au37-marquee { background: #1a1a1a; padding: 0.75rem 0; overflow: hidden; position: relative; }
        .au37-marquee::before, .au37-marquee::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none; }
        .au37-marquee::before { left: 0; background: linear-gradient(to right, #1a1a1a, transparent); }
        .au37-marquee::after { right: 0; background: linear-gradient(to left, #1a1a1a, transparent); }
        .au37-marquee__track { display: flex; gap: 3rem; width: max-content; animation: au37Scroll 40s linear infinite; }
        .au37-marquee__track:hover { animation-play-state: paused; }
        .au37-marquee__item { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; display: flex; align-items: center; gap: 3rem; }
        .au37-marquee__dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
        @keyframes au37Scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ---- ACCORDION ---- */
        .au37-accordion { display: flex; height: 500px; max-width: 1400px; margin: 0 auto; overflow: hidden; }
        .au37-accordion__panel { position: relative; overflow: hidden; cursor: pointer; transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .au37-accordion__panel--inactive { flex: 1; }
        .au37-accordion__panel--active { flex: 4; }
        .au37-accordion__img { position: absolute; inset: 0; }
        .au37-accordion__img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
        .au37-accordion__panel:hover .au37-accordion__img img { transform: scale(1.03); }
        .au37-accordion__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); transition: background 0.4s ease; }
        .au37-accordion__panel--active .au37-accordion__overlay { background: rgba(0,0,0,0.35); }
        .au37-accordion__label { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 2; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.7); white-space: nowrap; transition: opacity 0.3s ease; }
        .au37-accordion__panel--active .au37-accordion__label { opacity: 0; }
        .au37-accordion__content { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 2rem 2.5rem; color: #fff; opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s; }
        .au37-accordion__panel--active .au37-accordion__content { opacity: 1; transform: translateY(0); }
        .au37-accordion__num { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.5rem; }
        .au37-accordion__title { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .au37-accordion__body { font-size: 0.85rem; line-height: 1.7; color: rgba(255,255,255,0.7); max-width: 400px; }
        .au37-accordion__sep { width: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }

        /* ---- COMPACT FOUNDER ---- */
        .au37-founder { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; }
        .au37-founder__img { overflow: hidden; }
        .au37-founder__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au37-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; display: block; margin-top: 0.75rem; }
        .au37-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au37-heading { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; text-transform: uppercase; }
        .au37-heading span:nth-child(1) { color: #1a1a1a; }
        .au37-heading span:nth-child(2) { color: #4a4a4a; }
        .au37-heading span:nth-child(3) { color: #7a7a7a; }
        .au37-body { font-size: 0.95rem; line-height: 1.8; color: #666; }
        .au37-body p { margin: 0 0 1rem; }
        .au37-body p:last-child { margin-bottom: 0; }

        /* ---- HORIZONTAL TIMELINE ---- */
        .au37-htl { padding: 5rem 2rem; background: #1a1a1a; overflow: hidden; }
        .au37-htl__header { text-align: center; margin-bottom: 3rem; }
        .au37-htl .au37-pretext { color: rgba(255,255,255,0.4); }
        .au37-htl .au37-heading span:nth-child(1) { color: #fff; }
        .au37-htl .au37-heading span:nth-child(2) { color: rgba(255,255,255,0.6); }
        .au37-htl__track-wrap { position: relative; }
        .au37-htl__track-wrap::before, .au37-htl__track-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .au37-htl__track-wrap::before { left: 0; background: linear-gradient(to right, #1a1a1a, transparent); }
        .au37-htl__track-wrap::after { right: 0; background: linear-gradient(to left, #1a1a1a, transparent); }
        .au37-htl__track { display: flex; gap: 2rem; overflow-x: auto; scroll-behavior: smooth; padding: 1rem 80px 2rem; scrollbar-width: none; -ms-overflow-style: none; }
        .au37-htl__track::-webkit-scrollbar { display: none; }
        .au37-htl__card { flex-shrink: 0; width: 240px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); transition: all 0.3s ease; }
        .au37-htl__card:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
        .au37-htl__year { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 600; color: rgba(255,255,255,0.3); display: block; margin-bottom: 0.75rem; }
        .au37-htl__desc { font-size: 0.82rem; line-height: 1.6; color: rgba(255,255,255,0.55); }

        /* ---- COMPACT STATS ---- */
        .au37-stats { display: flex; justify-content: center; gap: 0; padding: 0; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; background: #fff; }
        .au37-stats__item { flex: 1; text-align: center; padding: 1.5rem 1rem; border-right: 1px solid #e8e6e2; }
        .au37-stats__item:last-child { border-right: none; }
        .au37-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; font-weight: 600; color: #1a1a1a; display: block; line-height: 1; margin-bottom: 4px; }
        .au37-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }

        /* ---- CTA ---- */
        .au37-cta { padding: 5rem 2rem; text-align: center; }
        .au37-cta__inner { max-width: 500px; margin: 0 auto; }
        .au37-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .au37-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au37-btn--primary { background: #1a1a1a; color: #fff; }
        .au37-btn--primary:hover { background: #333; }
        .au37-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au37-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au37-accordion { flex-direction: column; height: auto; }
          .au37-accordion__panel { min-height: 120px; }
          .au37-accordion__panel--active { min-height: 300px; }
          .au37-accordion__sep { width: 100%; height: 1px; }
          .au37-founder { grid-template-columns: 1fr; gap: 2rem; }
          .au37-stats { flex-wrap: wrap; }
          .au37-stats__item { min-width: 45%; border-bottom: 1px solid #e8e6e2; }
          .au37-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au37">
        {/* COMPACT HERO */}
        <section ref={heroRef} className="au37-hero">
          <div className="au37-hero__bg">
            <img src="/assets/images/r66helis.jpg" alt="HQ Aviation fleet" />
          </div>
          <div className="au37-hero__overlay" />
          <motion.div className="au37-hero__content" style={{ opacity: heroOpacity, scale: heroScale }}>
            <motion.span className="au37-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              Est. 1990 &middot; Denham Aerodrome
            </motion.span>
            <h1 className="au37-hero__title">
              <motion.span style={{ display: 'block' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                The Robinson
              </motion.span>
              <motion.span className="au37-hero__title-sub" style={{ display: 'block' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.5, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                Specialists
              </motion.span>
            </h1>
            <motion.div className="au37-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.7 }} />
          </motion.div>
        </section>

        {/* MARQUEE */}
        <div className="au37-marquee">
          <div className="au37-marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="au37-marquee__item">
                {item}
                <span className="au37-marquee__dot" />
              </span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="au37-stats">
          <div className="au37-stats__item">
            <span className="au37-stats__value"><AnimatedNumber value={35} suffix="+" /></span>
            <span className="au37-stats__label">Years</span>
          </div>
          <div className="au37-stats__item">
            <span className="au37-stats__value"><AnimatedNumber value={12000} suffix="+" /></span>
            <span className="au37-stats__label">Flight Hours</span>
          </div>
          <div className="au37-stats__item">
            <span className="au37-stats__value"><AnimatedNumber value={500} suffix="+" /></span>
            <span className="au37-stats__label">Pilots Trained</span>
          </div>
          <div className="au37-stats__item">
            <span className="au37-stats__value"><AnimatedNumber value={7} /></span>
            <span className="au37-stats__label">Continents</span>
          </div>
        </div>

        {/* ACCORDION */}
        <div className="au37-accordion">
          {ACCORDION_PANELS.map((panel, i) => (
            <React.Fragment key={panel.num}>
              {i > 0 && <div className="au37-accordion__sep" />}
              <div
                className={`au37-accordion__panel ${activePanel === i ? 'au37-accordion__panel--active' : 'au37-accordion__panel--inactive'}`}
                onClick={() => setActivePanel(i)}
                onMouseEnter={() => setActivePanel(i)}
              >
                <div className="au37-accordion__img">
                  <img src={panel.img} alt={panel.label} />
                </div>
                <div className="au37-accordion__overlay" />
                <span className="au37-accordion__label">{panel.label}</span>
                <div className="au37-accordion__content">
                  <span className="au37-accordion__num">{panel.num}</span>
                  <h3 className="au37-accordion__title">{panel.title}</h3>
                  <p className="au37-accordion__body">{panel.body}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* FOUNDER */}
        <section className="au37-founder">
          <Reveal direction="left">
            <div className="au37-founder__img">
              <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" />
              <span className="au37-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div>
              <span className="au37-pretext">The Founder</span>
              <h2 className="au37-heading">
                <span>Captain </span><span>Quentin </span><span>Smith</span>
              </h2>
              <div className="au37-body">
                <p>Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation.</p>
                <p>First piston helicopter circumnavigation. First to the North and South Poles. Trained Tom Cruise for Mission: Impossible — Fallout.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* HORIZONTAL SCROLLING TIMELINE */}
        <section className="au37-htl">
          <div className="au37-htl__header">
            <Reveal>
              <span className="au37-pretext">Heritage</span>
              <h2 className="au37-heading">
                <span>Defining </span><span>Moments</span>
              </h2>
            </Reveal>
          </div>
          <div className="au37-htl__track-wrap">
            <div className="au37-htl__track">
              {MILESTONES.map(([year, desc]) => (
                <div key={year} className="au37-htl__card">
                  <span className="au37-htl__year">{year}</span>
                  <span className="au37-htl__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="au37-cta">
          <div className="au37-cta__inner">
            <Reveal>
              <span className="au37-pretext">Get In Touch</span>
              <h2 className="au37-heading">
                <span>Begin </span><span>Your </span><span>Journey</span>
              </h2>
              <div className="au37-cta__buttons">
                <Link className="au37-btn au37-btn--primary" to="/contact">Contact Us &rarr;</Link>
                <Link className="au37-btn au37-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V8 — SCROLL RUNWAY TIMELINE
   Compact page with a vertical-to-horizontal scroll-driven
   timeline runway (from Experimentation.jsx Pattern 4). The
   milestones translate horizontally as you scroll vertically.
   Plus opposing marquee strips and clip-path image wipes.
   ============================================================ */

function AboutV8() {
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const innerRef = useRef(null);
  const [runwayH, setRunwayH] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!innerRef.current || !stickyRef.current) return;
      const overflow = innerRef.current.scrollWidth - stickyRef.current.clientWidth;
      const h = overflow + window.innerHeight;
      setRunwayH(h);
      if (runwayRef.current) runwayRef.current.style.height = h + 'px';
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const inner = innerRef.current;
    if (!runway || !sticky || !inner) return;
    const onScroll = () => {
      const rect = runway.getBoundingClientRect();
      const overflow = inner.scrollWidth - sticky.clientWidth;
      if (overflow <= 0) return;
      const scrolled = -rect.top;
      if (scrolled <= 0) {
        sticky.style.position = '';
        sticky.style.top = '';
        inner.style.transform = 'translateX(0)';
      } else if (scrolled < overflow) {
        sticky.style.position = 'fixed';
        sticky.style.top = '0';
        sticky.style.left = '0';
        sticky.style.right = '0';
        inner.style.transform = `translateX(${-scrolled}px)`;
      } else {
        sticky.style.position = 'absolute';
        sticky.style.top = overflow + 'px';
        sticky.style.left = '0';
        sticky.style.right = '0';
        inner.style.transform = `translateX(${-overflow}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stripRef = useRef(null);
  const { scrollYProgress: stripScroll } = useScroll({ target: stripRef, offset: ['start end', 'end start'] });
  const stripX1 = useTransform(stripScroll, [0, 1], ['5%', '-60%']);
  const stripX2 = useTransform(stripScroll, [0, 1], ['-40%', '5%']);

  return (
    <>
      <style>{`
        .au38 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- COMPACT HERO ---- */
        .au38-hero { background: #1a1a1a; padding: 6rem 2rem 5rem; text-align: center; }
        .au38-hero__inner { max-width: 700px; margin: 0 auto; }
        .au38-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.35); display: block; margin-bottom: 1.5rem; }
        .au38-hero__title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 0.95; margin: 0; text-transform: uppercase; color: #fff; }
        .au38-hero__title-sub { color: rgba(255,255,255,0.4); }
        .au38-hero__line { width: 50px; height: 1px; background: rgba(255,255,255,0.2); margin: 2rem auto; }
        .au38-hero__desc { font-size: 0.95rem; line-height: 1.75; color: rgba(255,255,255,0.5); max-width: 500px; margin: 0 auto; }

        /* ---- STATS STRIP ---- */
        .au38-stats { background: #fff; display: flex; border-bottom: 1px solid #e8e6e2; }
        .au38-stats__item { flex: 1; text-align: center; padding: 1.25rem 0.5rem; border-right: 1px solid #e8e6e2; }
        .au38-stats__item:last-child { border-right: none; }
        .au38-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; font-weight: 600; color: #1a1a1a; display: block; line-height: 1; margin-bottom: 4px; }
        .au38-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; }

        /* ---- WIPE IMAGE ---- */
        .au38-wipe { overflow: hidden; }
        .au38-wipe img { width: 100%; height: 280px; object-fit: cover; display: block; }

        /* ---- COMPACT TEXT ---- */
        .au38-text { max-width: 700px; margin: 0 auto; padding: 5rem 2rem; text-align: center; }
        .au38-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au38-heading { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; text-transform: uppercase; }
        .au38-heading span:nth-child(1) { color: #1a1a1a; }
        .au38-heading span:nth-child(2) { color: #4a4a4a; }
        .au38-heading span:nth-child(3) { color: #7a7a7a; }
        .au38-body { font-size: 0.95rem; line-height: 1.8; color: #666; }
        .au38-body p { margin: 0 0 1.25rem; }
        .au38-body p:last-child { margin-bottom: 0; }

        /* ---- OPPOSING STRIPS ---- */
        .au38-strips { padding: 4rem 0; overflow: hidden; background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .au38-strips__row { display: flex; gap: 1rem; white-space: nowrap; padding: 0.5rem 0; }
        .au38-strips__word { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; text-transform: uppercase; color: transparent; -webkit-text-stroke: 1px #d0ccc5; padding: 0 1rem; flex-shrink: 0; }
        .au38-strips__word--fill { color: #1a1a1a; -webkit-text-stroke: none; }

        /* ---- FOUNDER COMPACT ---- */
        .au38-founder { display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; align-items: center; max-width: 900px; margin: 0 auto; padding: 5rem 2rem; }
        .au38-founder__img img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .au38-founder__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; display: block; margin-top: 0.5rem; }

        /* ---- HORIZONTAL TIMELINE RUNWAY ---- */
        .au38-runway { position: relative; }
        .au38-runway__sticky { width: 100%; height: 100vh; overflow: hidden; display: flex; align-items: center; background: #1a1a1a; }
        .au38-runway__inner { display: flex; gap: 2rem; padding: 0 50vw 0 6vw; will-change: transform; }
        .au38-runway__card { flex-shrink: 0; width: 320px; padding: 2rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
        .au38-runway__card:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
        .au38-runway__year { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 200; color: rgba(255,255,255,0.2); display: block; margin-bottom: 1rem; }
        .au38-runway__desc { font-size: 0.88rem; line-height: 1.65; color: rgba(255,255,255,0.6); }
        .au38-runway__label { position: absolute; top: 2rem; left: 6vw; z-index: 2; }
        .au38-runway__label-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3); display: block; margin-bottom: 0.75rem; }
        .au38-runway__label-heading { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; text-transform: uppercase; color: #fff; margin: 0; }
        .au38-runway__progress { position: absolute; bottom: 2rem; left: 6vw; right: 6vw; height: 1px; background: rgba(255,255,255,0.08); z-index: 2; }
        .au38-runway__progress-fill { height: 100%; background: rgba(255,255,255,0.3); transition: width 0.1s linear; }

        /* ---- CTA ---- */
        .au38-cta { padding: 5rem 2rem; text-align: center; background: #faf9f6; }
        .au38-cta__inner { max-width: 500px; margin: 0 auto; }
        .au38-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .au38-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au38-btn--primary { background: #1a1a1a; color: #fff; }
        .au38-btn--primary:hover { background: #333; }
        .au38-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au38-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au38-stats { flex-wrap: wrap; }
          .au38-stats__item { min-width: 45%; border-bottom: 1px solid #e8e6e2; }
          .au38-founder { grid-template-columns: 1fr; gap: 2rem; }
          .au38-founder__img img { aspect-ratio: 4/3; }
          .au38-runway__sticky { height: auto; padding: 4rem 2rem; }
          .au38-runway__inner { flex-direction: column; padding: 0; transform: none !important; }
          .au38-runway__card { width: 100%; }
          .au38-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au38">
        {/* COMPACT DARK HERO */}
        <section className="au38-hero">
          <div className="au38-hero__inner">
            <motion.span className="au38-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              Est. 1990 &middot; Denham Aerodrome &middot; EGLD
            </motion.span>
            <h1 className="au38-hero__title">
              <motion.span style={{ display: 'block' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                The Robinson
              </motion.span>
              <motion.span className="au38-hero__title-sub" style={{ display: 'block' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.4, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                Specialists
              </motion.span>
            </h1>
            <motion.div className="au38-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
            <motion.p className="au38-hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.75 }}>
              The UK's leading Robinson helicopter company. Authorized Dealer, Service Centre, and Training Organisation.
            </motion.p>
          </div>
        </section>

        {/* STATS */}
        <div className="au38-stats">
          <div className="au38-stats__item"><span className="au38-stats__value"><AnimatedNumber value={35} suffix="+" /></span><span className="au38-stats__label">Years</span></div>
          <div className="au38-stats__item"><span className="au38-stats__value"><AnimatedNumber value={12000} suffix="+" /></span><span className="au38-stats__label">Flight Hours</span></div>
          <div className="au38-stats__item"><span className="au38-stats__value"><AnimatedNumber value={500} suffix="+" /></span><span className="au38-stats__label">Pilots Trained</span></div>
          <div className="au38-stats__item"><span className="au38-stats__value"><AnimatedNumber value={7} /></span><span className="au38-stats__label">Continents</span></div>
        </div>

        {/* CLIP-PATH WIPE IMAGE */}
        <motion.div className="au38-wipe" initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}>
          <img src="/assets/images/facility/hq-0089.jpg" alt="HQ Aviation facility" />
        </motion.div>

        {/* COMPACT TEXT */}
        <section className="au38-text">
          <Reveal>
            <span className="au38-pretext">Our Story</span>
            <h2 className="au38-heading"><span>Built </span><span>On </span><span>Precision</span></h2>
            <div className="au38-body">
              <p>Founded by Captain Quentin Smith at Denham Aerodrome. Over three decades, we have evolved from a single-helicopter training operation into the UK's complete Robinson centre of excellence — sales, training, maintenance, and expeditions from a single facility.</p>
            </div>
          </Reveal>
        </section>

        {/* OPPOSING SCROLL STRIPS */}
        <section ref={stripRef} className="au38-strips">
          <motion.div className="au38-strips__row" style={{ x: stripX1 }}>
            {['Training', 'Sales', 'Maintenance', 'Expeditions', 'Robinson', 'Denham', 'Training', 'Sales', 'Maintenance'].map((w, i) => (
              <span key={i} className={`au38-strips__word ${i % 3 === 0 ? 'au38-strips__word--fill' : ''}`}>{w}</span>
            ))}
          </motion.div>
          <motion.div className="au38-strips__row" style={{ x: stripX2 }}>
            {['R22', 'R44', 'R66', 'R88', 'PPL', 'CPL', 'Type Rating', 'R22', 'R44', 'R66'].map((w, i) => (
              <span key={i} className={`au38-strips__word ${i % 3 === 1 ? 'au38-strips__word--fill' : ''}`}>{w}</span>
            ))}
          </motion.div>
        </section>

        {/* FOUNDER */}
        <section className="au38-founder">
          <Reveal direction="left">
            <div>
              <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" />
              <span className="au38-founder__caption">Captain Q &mdash; Founder &amp; Chief Pilot</span>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div>
              <span className="au38-pretext">The Founder</span>
              <h2 className="au38-heading"><span>Captain </span><span>Quentin </span><span>Smith</span></h2>
              <div className="au38-body">
                <p>Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. FAI Gold Rotorcraft Medal. First piston-engine circumnavigation. First to both Poles. Trained Tom Cruise for Mission: Impossible — Fallout.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CLIP-PATH WIPE IMAGE 2 */}
        <motion.div className="au38-wipe" initial={{ clipPath: 'inset(0 0 0 100%)' }} whileInView={{ clipPath: 'inset(0 0 0 0%)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}>
          <img src="/assets/images/expeditions/north-pole.jpg" alt="North Pole expedition" />
        </motion.div>

        {/* HORIZONTAL TIMELINE RUNWAY */}
        <div ref={runwayRef} className="au38-runway">
          <div ref={stickyRef} className="au38-runway__sticky">
            <div className="au38-runway__label">
              <span className="au38-runway__label-pretext">Heritage</span>
              <h2 className="au38-runway__label-heading">Defining Moments</h2>
            </div>
            <div ref={innerRef} className="au38-runway__inner" style={{ paddingTop: '5rem' }}>
              {MILESTONES.map(([year, desc]) => (
                <div key={year} className="au38-runway__card">
                  <span className="au38-runway__year">{year}</span>
                  <span className="au38-runway__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="au38-cta">
          <div className="au38-cta__inner">
            <Reveal>
              <span className="au38-pretext">Get In Touch</span>
              <h2 className="au38-heading"><span>Begin </span><span>Your </span><span>Journey</span></h2>
              <div className="au38-cta__buttons">
                <Link className="au38-btn au38-btn--primary" to="/contact">Contact Us &rarr;</Link>
                <Link className="au38-btn au38-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V9 — TABBED DOSSIER
   Everything fits in minimal space. Tabbed content with
   crossfade panels, a horizontal progress bar timeline with
   clickable nodes, and a departure-board stats aesthetic.
   ============================================================ */

const TABS_DATA = [
  {
    key: 'story',
    label: '01 Our Story',
    title: 'Built On Precision',
    body: 'Founded in 1990 by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown to become the United Kingdom\'s leading Robinson helicopter specialists. Over three decades, we have maintained, sold, and trained pilots on more Robinson helicopters than any other facility in the country.',
    img: '/assets/images/facility/hq-0089.jpg',
  },
  {
    key: 'founder',
    label: '02 The Founder',
    title: 'Captain Quentin Smith',
    body: 'Two-time World Helicopter Aerobatics Champion. Guinness World Record holder. FAI Gold Rotorcraft Medal — the highest honour in international helicopter aviation. First piston helicopter circumnavigation of the globe, first to the North and South Poles. Trained Tom Cruise for Mission: Impossible — Fallout.',
    img: '/assets/images/team/quentin-smith-profile-picture-2.jpg',
  },
  {
    key: 'services',
    label: '03 Services',
    title: 'What We Do',
    body: 'Flight Training — CAA Approved, PPL(H) through CPL(H). Aircraft Sales — Authorized Robinson Dealer, new and pre-owned. Maintenance — Authorized Service Centre, annuals to full overhauls. Expeditions — Polar aviation, Channel crossings, bespoke adventure planning.',
    img: '/assets/images/facility/hq-0007.jpg',
  },
  {
    key: 'facility',
    label: '04 The Facility',
    title: 'Denham Aerodrome',
    body: 'Our facility at Denham houses one of the largest Robinson fleets in Europe. Full suite of Robinson special tooling. CAA, EASA, and FAA approved workshops. Classroom training, maintenance hangars, and dedicated flight operations — all from a single site 20 miles northwest of London.',
    img: '/assets/images/facility/busy-hangar.jpg',
  },
];

function AboutV9() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(0);

  return (
    <>
      <style>{`
        .au39 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- COMPACT HEADER ---- */
        .au39-header { background: #fff; padding: 3rem 2rem; border-bottom: 1px solid #e8e6e2; }
        .au39-header__inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end; }
        .au39-header__brand {}
        .au39-header__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 0.75rem; }
        .au39-header__title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1; margin: 0; text-transform: uppercase; }
        .au39-header__title span:nth-child(1) { color: #1a1a1a; }
        .au39-header__title span:nth-child(2) { color: #4a4a4a; }
        .au39-header__title span:nth-child(3) { color: #7a7a7a; }
        .au39-header__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: #999; text-align: right; }

        /* ---- DEPARTURE STATS ---- */
        .au39-departure { background: #0f1318; padding: 1.5rem 2rem; font-family: 'Share Tech Mono', monospace; position: relative; overflow: hidden; }
        .au39-departure::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px 1px, transparent 1px 3px); pointer-events: none; }
        .au39-departure__inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; position: relative; z-index: 1; }
        .au39-departure__item { text-align: center; flex: 1; }
        .au39-departure__value { font-size: 1.6rem; font-weight: 600; color: #fbbf24; display: block; line-height: 1; margin-bottom: 4px; text-shadow: 0 0 12px rgba(251,191,36,0.3); }
        .au39-departure__label { font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
        .au39-departure__sep { width: 1px; height: 40px; background: rgba(255,255,255,0.08); flex-shrink: 0; align-self: center; }

        /* ---- TABBED CONTENT ---- */
        .au39-tabs { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 0; }
        .au39-tabs__nav { display: flex; border-bottom: 1px solid #e8e6e2; }
        .au39-tabs__btn { padding: 0.75rem 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; background: none; border: none; cursor: pointer; transition: all 0.3s ease; position: relative; white-space: nowrap; }
        .au39-tabs__btn::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px; background: #1a1a1a; transform: scaleX(0); transition: transform 0.3s ease; }
        .au39-tabs__btn--active { color: #1a1a1a; }
        .au39-tabs__btn--active::after { transform: scaleX(1); }
        .au39-tabs__panels { position: relative; display: grid; min-height: 400px; }
        .au39-tabs__panel { grid-area: 1/1; opacity: 0; pointer-events: none; transition: opacity 0.5s ease; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; padding: 3rem 0; }
        .au39-tabs__panel--active { opacity: 1; pointer-events: auto; }
        .au39-tabs__panel-img { overflow: hidden; }
        .au39-tabs__panel-img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au39-tabs__panel-text {}
        .au39-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au39-heading { font-size: clamp(1.6rem, 2.5vw, 2rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.25rem; text-transform: uppercase; color: #1a1a1a; }
        .au39-body { font-size: 0.92rem; line-height: 1.8; color: #666; }

        /* ---- PROGRESS BAR TIMELINE ---- */
        .au39-timeline { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 4rem; }
        .au39-timeline__header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem; }
        .au39-timeline__bar { position: relative; height: 2px; background: #e8e6e2; margin-bottom: 2.5rem; }
        .au39-timeline__fill { position: absolute; top: 0; left: 0; height: 100%; background: #1a1a1a; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .au39-timeline__nodes { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; }
        .au39-timeline__node { width: 10px; height: 10px; border-radius: 50%; background: #e8e6e2; border: 2px solid #faf9f6; cursor: pointer; transition: all 0.3s ease; position: relative; z-index: 1; }
        .au39-timeline__node--active { background: #1a1a1a; transform: scale(1.3); }
        .au39-timeline__node--past { background: #999; }
        .au39-timeline__detail { display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: baseline; min-height: 60px; }
        .au39-timeline__year { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 200; color: rgba(26,26,26,0.2); line-height: 1; }
        .au39-timeline__desc { font-size: 0.92rem; line-height: 1.6; color: #666; }

        /* ---- CREDENTIALS STRIP ---- */
        .au39-creds { display: flex; flex-wrap: wrap; gap: 0; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; background: #fff; }
        .au39-cred { flex: 1; min-width: 150px; padding: 1rem 1.5rem; border-right: 1px solid #e8e6e2; }
        .au39-cred:last-child { border-right: none; }
        .au39-cred__label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; display: block; margin-bottom: 4px; }
        .au39-cred__value { font-size: 0.8rem; font-weight: 600; color: #1a1a1a; }

        /* ---- CTA ---- */
        .au39-cta { padding: 4rem 2rem; text-align: center; }
        .au39-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .au39-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au39-btn--primary { background: #1a1a1a; color: #fff; }
        .au39-btn--primary:hover { background: #333; }
        .au39-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au39-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au39-header__inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .au39-header__coords { text-align: left; }
          .au39-departure__inner { flex-wrap: wrap; gap: 1rem; }
          .au39-departure__sep { display: none; }
          .au39-departure__item { min-width: 45%; }
          .au39-tabs__nav { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
          .au39-tabs__nav::-webkit-scrollbar { display: none; }
          .au39-tabs__panel { grid-template-columns: 1fr; gap: 2rem; }
          .au39-creds { flex-direction: column; }
          .au39-cred { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .au39-cred:last-child { border-bottom: none; }
          .au39-timeline__detail { grid-template-columns: 1fr; gap: 0.5rem; }
          .au39-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au39">
        {/* HEADER */}
        <header className="au39-header">
          <div className="au39-header__inner">
            <div className="au39-header__brand">
              <span className="au39-header__pretext">About Us</span>
              <h1 className="au39-header__title">
                <span>HQ </span><span>Aviation</span>
              </h1>
            </div>
            <div className="au39-header__coords">
              51.5751&deg;N / 0.5059&deg;W<br />Denham Aerodrome &middot; EGLD
            </div>
          </div>
        </header>

        {/* DEPARTURE BOARD STATS */}
        <section className="au39-departure">
          <div className="au39-departure__inner">
            <div className="au39-departure__item">
              <span className="au39-departure__value"><AnimatedNumber value={35} suffix="+" /></span>
              <span className="au39-departure__label">Years</span>
            </div>
            <div className="au39-departure__sep" />
            <div className="au39-departure__item">
              <span className="au39-departure__value"><AnimatedNumber value={12000} suffix="+" /></span>
              <span className="au39-departure__label">Flight Hours</span>
            </div>
            <div className="au39-departure__sep" />
            <div className="au39-departure__item">
              <span className="au39-departure__value"><AnimatedNumber value={500} suffix="+" /></span>
              <span className="au39-departure__label">Pilots Trained</span>
            </div>
            <div className="au39-departure__sep" />
            <div className="au39-departure__item">
              <span className="au39-departure__value"><AnimatedNumber value={7} /></span>
              <span className="au39-departure__label">Continents</span>
            </div>
          </div>
        </section>

        {/* TABBED CONTENT */}
        <section className="au39-tabs">
          <div className="au39-tabs__nav">
            {TABS_DATA.map((tab, i) => (
              <button key={tab.key} className={`au39-tabs__btn ${activeTab === i ? 'au39-tabs__btn--active' : ''}`} onClick={() => setActiveTab(i)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="au39-tabs__panels">
            {TABS_DATA.map((tab, i) => (
              <div key={tab.key} className={`au39-tabs__panel ${activeTab === i ? 'au39-tabs__panel--active' : ''}`}>
                <div className="au39-tabs__panel-img">
                  <img src={tab.img} alt={tab.title} />
                </div>
                <div className="au39-tabs__panel-text">
                  <span className="au39-pretext">{tab.label}</span>
                  <h2 className="au39-heading">{tab.title}</h2>
                  <p className="au39-body">{tab.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CREDENTIALS */}
        <div className="au39-creds">
          <div className="au39-cred"><span className="au39-cred__label">Robinson</span><span className="au39-cred__value">Authorized Dealer &amp; Service Centre</span></div>
          <div className="au39-cred"><span className="au39-cred__label">UK CAA</span><span className="au39-cred__value">Approved Training Organisation</span></div>
          <div className="au39-cred"><span className="au39-cred__label">EASA</span><span className="au39-cred__value">Part 145 Maintenance</span></div>
          <div className="au39-cred"><span className="au39-cred__label">FAI</span><span className="au39-cred__value">Gold Rotorcraft Medal</span></div>
        </div>

        {/* PROGRESS BAR TIMELINE */}
        <section className="au39-timeline">
          <div className="au39-timeline__header">
            <div>
              <span className="au39-pretext">Heritage</span>
              <h2 className="au39-heading">Milestones</h2>
            </div>
          </div>
          <div className="au39-timeline__bar">
            <div className="au39-timeline__fill" style={{ width: `${(activeMilestone / (MILESTONES.length - 1)) * 100}%` }} />
            <div className="au39-timeline__nodes">
              {MILESTONES.map(([year], i) => (
                <div
                  key={year}
                  className={`au39-timeline__node ${i === activeMilestone ? 'au39-timeline__node--active' : i < activeMilestone ? 'au39-timeline__node--past' : ''}`}
                  onClick={() => setActiveMilestone(i)}
                  title={year}
                />
              ))}
            </div>
          </div>
          <motion.div
            className="au39-timeline__detail"
            key={activeMilestone}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="au39-timeline__year">{MILESTONES[activeMilestone][0]}</span>
            <span className="au39-timeline__desc">{MILESTONES[activeMilestone][1]}</span>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="au39-cta">
          <Reveal>
            <span className="au39-pretext">Get In Touch</span>
            <h2 className="au39-heading">Begin Your Journey</h2>
            <div className="au39-cta__buttons">
              <Link className="au39-btn au39-btn--primary" to="/contact">Contact Us &rarr;</Link>
              <Link className="au39-btn au39-btn--outline" to="/fleet">Explore Fleet</Link>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V10 — THE LOGBOOK
   Magazine-feature storytelling with real content: Q's actual
   quotes, expedition logbook entries with registrations, the
   Drake Passage survival story, Smithsonian connection. Uses a
   horizontal-scroll flight logbook and pull-quote typography.
   ============================================================ */

const LOGBOOK_ENTRIES = [
  {
    year: '1994',
    callsign: 'R22',
    route: 'MOSCOW',
    title: 'World Champion at 30',
    detail: 'Gold Medal, World Helicopter Championships. Flew a humble Robinson R22 — a piston training helicopter — against Russian pilots flying turbine machines on their home turf. First British pilot to win.',
    status: 'GOLD',
  },
  {
    year: '1997',
    callsign: 'G-MURY',
    route: 'EGLD → WORLD → EGLD',
    title: 'Around the World',
    detail: 'First piston-engine helicopter circumnavigation of the globe. Robinson R44 Astro, 28 countries, 97 days. Departed England eastbound via Italy, the Middle East, India, Russia, the Bering Strait, Alaska, across the USA, Greenland, Iceland, home.',
    status: 'FAI RECORD',
  },
  {
    year: '2002',
    callsign: 'G-NUDE',
    route: 'EGLD → 90°N',
    title: 'The North Pole',
    detail: 'First piston-powered helicopter to land at the Geographic North Pole. Robinson R44 Raven II, with Steve Brooks. Guinness World Record.',
    status: 'GUINNESS',
  },
  {
    year: '2003',
    callsign: 'G-NUDE',
    route: 'DRAKE PASSAGE',
    title: 'Engine Failure at 59°S',
    detail: '450 miles into the Drake Passage — the most treacherous waters on earth. A bang. Then silence. Controlled autorotation onto 5-metre swells. 9.5 hours in a life raft. Rescued by Chilean icebreaker via Breitling Emergency watch signal.',
    status: 'SURVIVED',
  },
  {
    year: '2005',
    callsign: 'R44',
    route: 'BUENOS AIRES → 90°S',
    title: 'The South Pole',
    detail: 'Landed 18 January 2005. Bright sunshine, -26°C, 9,300 feet elevation. First crew to fly a helicopter to both Poles. R44 operating at 14,000 feet density altitude.',
    status: 'GUINNESS',
  },
  {
    year: '2012',
    callsign: 'R22',
    route: 'WORLD CHAMPS',
    title: 'The Backwards Autorotation',
    detail: 'Second World Championship Gold — eighteen years after the first. Performed a backwards autorotation from 300 feet. Engine off, flying backwards, landing. Experts had deemed it impossible. Two years of practice in tiny increments.',
    status: 'GOLD',
  },
  {
    year: '2015',
    callsign: 'R44',
    route: 'THE POLAR TRIANGLE',
    title: 'Three North Poles, Solo',
    detail: 'First pilot to fly to the exact three North Poles in a single journey: Geographic, Magnetic, and the Pole of Inaccessibility — 700 miles from land in any direction.',
    status: 'FIRST',
  },
  {
    year: '2019',
    callsign: '—',
    route: 'FAI CEREMONY',
    title: 'Gold Rotorcraft Medal',
    detail: 'The highest individual honour in international helicopter aviation, awarded for a lifetime of achievement in rotorcraft.',
    status: 'FAI GOLD',
  },
];

function AboutV10() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  const logbookTrackRef = useRef(null);

  return (
    <>
      <style>{`
        .au40 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- QUOTE HERO ---- */
        .au40-hero { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; text-align: center; background: #faf9f6; position: relative; }
        .au40-hero__quote { font-size: clamp(1.8rem, 4vw, 3.2rem); font-weight: 300; line-height: 1.35; color: #1a1a1a; max-width: 800px; margin: 0 0 2rem; font-style: italic; }
        .au40-hero__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
        .au40-hero__line { width: 40px; height: 1px; background: rgba(0,0,0,0.15); margin: 2rem auto 0; }
        .au40-hero__scroll { position: absolute; bottom: 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .au40-hero__scroll-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; }
        .au40-hero__scroll-line { width: 1px; height: 40px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .au40-hero__scroll-dot { position: absolute; width: 1px; height: 30%; background: rgba(0,0,0,0.4); animation: au40Scroll 2s ease-in-out infinite; }
        @keyframes au40Scroll { 0% { top: -30%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

        /* ---- COMPACT INTRO ---- */
        .au40-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; align-items: center; }
        .au40-intro__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au40-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au40-heading { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.25rem; text-transform: uppercase; }
        .au40-heading span:nth-child(1) { color: #1a1a1a; }
        .au40-heading span:nth-child(2) { color: #4a4a4a; }
        .au40-heading span:nth-child(3) { color: #7a7a7a; }
        .au40-body { font-size: 0.95rem; line-height: 1.8; color: #666; }
        .au40-body p { margin: 0 0 1rem; }
        .au40-body p:last-child { margin-bottom: 0; }

        /* ---- PULL QUOTE ---- */
        .au40-pull { padding: 5rem 2rem; text-align: center; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; background: #fff; }
        .au40-pull__text { font-size: clamp(1.2rem, 2.5vw, 1.8rem); font-weight: 400; line-height: 1.5; color: #1a1a1a; max-width: 700px; margin: 0 auto 1rem; font-style: italic; }
        .au40-pull__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }

        /* ---- FLIGHT LOGBOOK ---- */
        .au40-logbook { background: #0f1318; padding: 4rem 0; position: relative; }
        .au40-logbook__header { padding: 0 6vw 2.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .au40-logbook .au40-pretext { color: rgba(255,255,255,0.3); }
        .au40-logbook .au40-heading span:nth-child(1) { color: #fff; }
        .au40-logbook .au40-heading span:nth-child(2) { color: rgba(255,255,255,0.5); }
        .au40-logbook__arrows { display: flex; gap: 0.5rem; }
        .au40-logbook__arrow { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.15); background: none; color: rgba(255,255,255,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s ease; }
        .au40-logbook__arrow:hover { border-color: rgba(255,255,255,0.4); color: #fff; }
        .au40-logbook__wrap { position: relative; }
        .au40-logbook__wrap::before, .au40-logbook__wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .au40-logbook__wrap::before { left: 0; background: linear-gradient(to right, #0f1318, transparent); }
        .au40-logbook__wrap::after { right: 0; background: linear-gradient(to left, #0f1318, transparent); }
        .au40-logbook__track { display: flex; gap: 1px; overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; padding: 0 6vw; }
        .au40-logbook__track::-webkit-scrollbar { display: none; }
        .au40-logbook__entry { flex-shrink: 0; width: 300px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 2rem; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .au40-logbook__entry:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
        .au40-logbook__entry-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .au40-logbook__year { font-family: 'Share Tech Mono', monospace; font-size: 1.6rem; font-weight: 200; color: rgba(255,255,255,0.25); }
        .au40-logbook__status { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; padding: 3px 8px; border: 1px solid; display: inline-block; }
        .au40-logbook__status--gold { color: #fbbf24; border-color: rgba(251,191,36,0.3); }
        .au40-logbook__status--record { color: #34d399; border-color: rgba(52,211,153,0.3); }
        .au40-logbook__status--survived { color: #f87171; border-color: rgba(248,113,113,0.3); }
        .au40-logbook__status--first { color: #60a5fa; border-color: rgba(96,165,250,0.3); }
        .au40-logbook__callsign { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); display: block; margin-bottom: 0.25rem; }
        .au40-logbook__route { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.35); display: block; margin-bottom: 1rem; }
        .au40-logbook__title { font-size: 1.05rem; font-weight: 600; color: #fff; margin: 0 0 0.75rem; }
        .au40-logbook__detail { font-size: 0.8rem; line-height: 1.65; color: rgba(255,255,255,0.45); flex: 1; }

        /* ---- DRAKE PASSAGE ---- */
        .au40-drake { position: relative; overflow: hidden; }
        .au40-drake__bg { position: absolute; inset: -10%; z-index: 1; }
        .au40-drake__bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.3) brightness(0.3); }
        .au40-drake__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(15,19,24,0.7) 0%, rgba(15,19,24,0.95) 100%); }
        .au40-drake__content { position: relative; z-index: 3; max-width: 800px; margin: 0 auto; padding: 6rem 2rem; }
        .au40-drake__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(248,113,113,0.5); display: block; margin-bottom: 1.5rem; }
        .au40-drake__heading { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 700; line-height: 1.1; color: #fff; margin: 0 0 2rem; text-transform: uppercase; }
        .au40-drake__text { font-size: 1rem; line-height: 1.9; color: rgba(255,255,255,0.6); }
        .au40-drake__text p { margin: 0 0 1.5rem; }
        .au40-drake__text p:last-child { margin-bottom: 0; }
        .au40-drake__quote { font-size: 1.15rem; font-style: italic; color: rgba(255,255,255,0.8); border-left: 2px solid rgba(248,113,113,0.3); padding-left: 1.5rem; margin: 2rem 0; }
        .au40-drake__data { display: flex; gap: 2rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .au40-drake__datum {}
        .au40-drake__datum-val { font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 600; color: #fff; display: block; line-height: 1; margin-bottom: 4px; }
        .au40-drake__datum-key { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); }

        /* ---- SMITHSONIAN ---- */
        .au40-smithsonian { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; align-items: center; }
        .au40-smithsonian__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .au40-smithsonian__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; color: #999; display: block; margin-top: 0.5rem; }
        .au40-smithsonian__data { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.5rem; }
        .au40-smithsonian__row { display: flex; align-items: baseline; gap: 1rem; padding: 0.4rem 0; border-bottom: 1px solid #f0efec; }
        .au40-smithsonian__key { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; width: 90px; flex-shrink: 0; }
        .au40-smithsonian__val { font-size: 0.85rem; color: #1a1a1a; }

        /* ---- DENHAM ---- */
        .au40-denham { background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; padding: 5rem 2rem; }
        .au40-denham__inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .au40-denham__facts { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
        .au40-denham__fact { display: flex; align-items: baseline; gap: 1rem; }
        .au40-denham__fact-key { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; width: 80px; flex-shrink: 0; }
        .au40-denham__fact-val { font-size: 0.85rem; color: #555; line-height: 1.5; }

        /* ---- TESTIMONIALS ---- */
        .au40-testimonials { padding: 5rem 0; overflow: hidden; position: relative; }
        .au40-testimonials::before, .au40-testimonials::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .au40-testimonials::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .au40-testimonials::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .au40-testimonials__header { padding: 0 2rem 2rem; text-align: center; }
        .au40-testimonials__track { display: flex; gap: 1.5rem; width: max-content; animation: au40TestimonialScroll 35s linear infinite; }
        .au40-testimonials__track:hover { animation-play-state: paused; }
        @keyframes au40TestimonialScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .au40-testimonial { flex-shrink: 0; width: 340px; padding: 2rem; background: #fff; border: 1px solid #e8e6e2; }
        .au40-testimonial__text { font-size: 0.88rem; line-height: 1.7; color: #555; font-style: italic; margin: 0 0 1rem; }
        .au40-testimonial__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; }

        /* ---- CTA ---- */
        .au40-cta { padding: 5rem 2rem; text-align: center; }
        .au40-cta__inner { max-width: 550px; margin: 0 auto; }
        .au40-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .au40-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au40-btn--primary { background: #1a1a1a; color: #fff; }
        .au40-btn--primary:hover { background: #333; }
        .au40-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au40-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au40-intro, .au40-smithsonian { grid-template-columns: 1fr; }
          .au40-denham__inner { grid-template-columns: 1fr; }
          .au40-drake__data { flex-wrap: wrap; }
          .au40-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au40">
        {/* QUOTE HERO */}
        <section ref={heroRef} className="au40-hero">
          <motion.div style={{ opacity: heroOpacity }}>
            <motion.p className="au40-hero__quote" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
              &ldquo;Flying is, above all, a beautiful thing that deserves to be enjoyed.&rdquo;
            </motion.p>
            <motion.span className="au40-hero__attr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
              Captain Quentin Smith &middot; Founder, HQ Aviation
            </motion.span>
            <motion.div className="au40-hero__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1.0 }} />
          </motion.div>
          <div className="au40-hero__scroll">
            <span className="au40-hero__scroll-label">Scroll</span>
            <div className="au40-hero__scroll-line"><div className="au40-hero__scroll-dot" /></div>
          </div>
        </section>

        {/* INTRO */}
        <section className="au40-intro">
          <Reveal direction="left">
            <div>
              <img src="/assets/images/facility/hq-0089.jpg" alt="HQ Aviation hangar at Denham" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div>
              <span className="au40-pretext">Hangar E &middot; Denham Aerodrome</span>
              <h2 className="au40-heading">
                <span>London's </span><span>Helicopter </span><span>Flight School</span>
              </h2>
              <div className="au40-body">
                <p>HQ Aviation is the United Kingdom's specialist Robinson helicopter company — an Authorized Dealer, Authorized Service Centre, Rolls-Royce RR300 Authorized Service Center, and CAA Approved Training Organisation. Open seven days a week from Denham Aerodrome, thirty minutes from central London, just inside the M25.</p>
                <p>More than a flight school. A community of people who share a love of helicopters.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* PULL QUOTE */}
        <section className="au40-pull">
          <Reveal>
            <p className="au40-pull__text">&ldquo;You can fly for hours over vast openness and there, over the horizon, slowly come the tall buildings of a city rising like the moon.&rdquo;</p>
            <span className="au40-pull__attr">Captain Q</span>
          </Reveal>
        </section>

        {/* FLIGHT LOGBOOK */}
        <section className="au40-logbook">
          <div className="au40-logbook__header">
            <div>
              <span className="au40-pretext">Flight Logbook</span>
              <h2 className="au40-heading">
                <span>The </span><span>Record</span>
              </h2>
            </div>
            <div className="au40-logbook__arrows">
              <button className="au40-logbook__arrow" onClick={() => logbookTrackRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}>&larr;</button>
              <button className="au40-logbook__arrow" onClick={() => logbookTrackRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}>&rarr;</button>
            </div>
          </div>
          <div className="au40-logbook__wrap">
            <div ref={logbookTrackRef} className="au40-logbook__track">
              {LOGBOOK_ENTRIES.map((entry) => (
                <div key={entry.year + entry.callsign} className="au40-logbook__entry">
                  <div className="au40-logbook__entry-top">
                    <span className="au40-logbook__year">{entry.year}</span>
                    <span className={`au40-logbook__status ${
                      entry.status.includes('GOLD') ? 'au40-logbook__status--gold' :
                      entry.status === 'SURVIVED' ? 'au40-logbook__status--survived' :
                      entry.status === 'FIRST' ? 'au40-logbook__status--first' :
                      'au40-logbook__status--record'
                    }`}>{entry.status}</span>
                  </div>
                  <span className="au40-logbook__callsign">{entry.callsign}</span>
                  <span className="au40-logbook__route">{entry.route}</span>
                  <h3 className="au40-logbook__title">{entry.title}</h3>
                  <p className="au40-logbook__detail">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DRAKE PASSAGE STORY */}
        <section className="au40-drake">
          <div className="au40-drake__bg">
            <img src="/assets/images/expeditions/antartica.jpg" alt="Antarctic waters" />
          </div>
          <div className="au40-drake__overlay" />
          <div className="au40-drake__content">
            <Reveal>
              <span className="au40-drake__pretext">27 January 2003 &middot; 59&deg;S &middot; Drake Passage</span>
              <h2 className="au40-drake__heading">No One Had Ever Survived a Ditching Here</h2>
              <div className="au40-drake__text">
                <p>Three months into an attempt to fly from the North Pole to the South Pole. 450 miles across the Drake Passage — 550 miles of the most treacherous waters on earth between South America and Antarctica. The Chilean government had advised the crossing was impossible.</p>
                <p>Then a bang. A technical issue with the engine, which went silent. Captain Smith executed a controlled autorotation onto undulating five-metre swells, keeping the helicopter level using rotor blade dynamics during water entry. His co-pilot Steve Brooks jumped from the sinking aircraft to retrieve the life raft — his strap catching the skid, decelerating his fall in what Q describes as &ldquo;one of the greatest heroic acts of behaviour ever.&rdquo;</p>
                <p>They survived 9.5 hours in a life raft. Q's father — a retired Fleet Air Arm Junglie who had packed that dinghy 35 years earlier — had included waterproof matches, fishing hooks, repair patches, and tinned water. All still intact. Q's Breitling Emergency watch transmitted on 121.5 MHz. A Chilean naval icebreaker found them.</p>
              </div>
              <p className="au40-drake__quote">&ldquo;No one had ever survived a ditching or sinking here before, and our chances of survival were zero.&rdquo;</p>
              <div className="au40-drake__data">
                <div className="au40-drake__datum"><span className="au40-drake__datum-val">G-NUDE</span><span className="au40-drake__datum-key">Aircraft</span></div>
                <div className="au40-drake__datum"><span className="au40-drake__datum-val">59&deg;S</span><span className="au40-drake__datum-key">Latitude</span></div>
                <div className="au40-drake__datum"><span className="au40-drake__datum-val">9.5 hrs</span><span className="au40-drake__datum-key">In Life Raft</span></div>
                <div className="au40-drake__datum"><span className="au40-drake__datum-val">121.5 MHz</span><span className="au40-drake__datum-key">Emergency Freq</span></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SMITHSONIAN */}
        <section className="au40-smithsonian">
          <Reveal direction="left">
            <div>
              <span className="au40-pretext">The Smithsonian Collection</span>
              <h2 className="au40-heading">
                <span>G-MURY </span><span>In The </span><span>Museum</span>
              </h2>
              <div className="au40-body">
                <p>The Robinson R44 Astro that circumnavigated the globe now resides in the Steven F. Udvar-Hazy Center of the Smithsonian National Air and Space Museum in Virginia — alongside the Space Shuttle Discovery and the Enola Gay. Donated by Frank Robinson and the Robinson Helicopter Company in 2004.</p>
              </div>
              <div className="au40-smithsonian__data">
                <div className="au40-smithsonian__row"><span className="au40-smithsonian__key">Aircraft</span><span className="au40-smithsonian__val">Robinson R44 Astro</span></div>
                <div className="au40-smithsonian__row"><span className="au40-smithsonian__key">Registration</span><span className="au40-smithsonian__val">G-MURY</span></div>
                <div className="au40-smithsonian__row"><span className="au40-smithsonian__key">Serial</span><span className="au40-smithsonian__val">c/n 0201 (built 1995)</span></div>
                <div className="au40-smithsonian__row"><span className="au40-smithsonian__key">Exhibition</span><span className="au40-smithsonian__val">Vertical Flight, Udvar-Hazy Center</span></div>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div className="au40-smithsonian__img">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition helicopter" />
              <span className="au40-smithsonian__caption">Inventory A20040117000 &middot; National Air and Space Museum</span>
            </div>
          </Reveal>
        </section>

        {/* DENHAM AERODROME */}
        <section className="au40-denham">
          <div className="au40-denham__inner">
            <Reveal direction="left">
              <div>
                <img src="/assets/images/facility/busy-hangar.jpg" alt="Inside HQ Aviation hangar" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.15}>
              <div>
                <span className="au40-pretext">The Base</span>
                <h2 className="au40-heading"><span>Denham </span><span>Aerodrome</span></h2>
                <div className="au40-body">
                  <p>Flying since 1917. Originally RAF Denham, a training school for Flight Cadets in the First World War. Four miles from Pinewood Studios. Just inside the M25, thirty minutes from central London.</p>
                </div>
                <div className="au40-denham__facts">
                  <div className="au40-denham__fact"><span className="au40-denham__fact-key">ICAO</span><span className="au40-denham__fact-val">EGLD</span></div>
                  <div className="au40-denham__fact"><span className="au40-denham__fact-key">Position</span><span className="au40-denham__fact-val">51.5751&deg;N / 0.5059&deg;W</span></div>
                  <div className="au40-denham__fact"><span className="au40-denham__fact-key">Runway</span><span className="au40-denham__fact-val">06/24 &middot; 775 metres paved</span></div>
                  <div className="au40-denham__fact"><span className="au40-denham__fact-key">Active</span><span className="au40-denham__fact-val">Since 1917 &middot; 108 years of flying</span></div>
                  <div className="au40-denham__fact"><span className="au40-denham__fact-key">Hours</span><span className="au40-denham__fact-val">Open 7 days, 09:00–17:00</span></div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIALS MARQUEE */}
        <section className="au40-testimonials">
          <div className="au40-testimonials__header">
            <Reveal>
              <span className="au40-pretext">What People Say</span>
            </Reveal>
          </div>
          <div className="au40-testimonials__track">
            {[
              { text: 'HQ Aviation is by far the best helicopter school in the UK. Much more than just a business — it\'s a community of caring people who all share a love of helicopters.', attr: 'PPL(H) Student' },
              { text: 'The staff is extremely organized and every experience I\'ve had with HQ has been fantastic. Great bunch and excellent team.', attr: 'Self-Fly Hire Pilot' },
              { text: 'Skilled instructors, friendly atmosphere, a lovely and cozy clubhouse. The most welcoming community in aviation.', attr: 'Training Client' },
              { text: 'Robinson helicopters are the best helicopters for private individuals. And HQ is the place to buy and maintain them.', attr: 'R66 Owner' },
              { text: 'HQ Aviation is by far the best helicopter school in the UK. Much more than just a business — it\'s a community of caring people who all share a love of helicopters.', attr: 'PPL(H) Student' },
              { text: 'The staff is extremely organized and every experience I\'ve had with HQ has been fantastic. Great bunch and excellent team.', attr: 'Self-Fly Hire Pilot' },
              { text: 'Skilled instructors, friendly atmosphere, a lovely and cozy clubhouse. The most welcoming community in aviation.', attr: 'Training Client' },
              { text: 'Robinson helicopters are the best helicopters for private individuals. And HQ is the place to buy and maintain them.', attr: 'R66 Owner' },
            ].map((t, i) => (
              <div key={i} className="au40-testimonial">
                <p className="au40-testimonial__text">&ldquo;{t.text}&rdquo;</p>
                <span className="au40-testimonial__attr">{t.attr}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="au40-cta">
          <div className="au40-cta__inner">
            <Reveal>
              <span className="au40-pretext">Ready For An Adventure?</span>
              <h2 className="au40-heading"><span>Begin </span><span>Your </span><span>Journey</span></h2>
              <div className="au40-cta__buttons">
                <Link className="au40-btn au40-btn--primary" to="/contact">Contact Us &rarr;</Link>
                <Link className="au40-btn au40-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V11 — THE FAMILY
   Warm, personal, community-focused. Real Q quotes as the
   narrative spine. Family lineage (Mike Smith, Borneo Junglie).
   Physics-meets-aviation philosophy. Interactive expedition
   cards that expand to reveal the real stories.
   ============================================================ */

const EXPEDITION_CARDS = [
  {
    id: 'circum',
    year: '1997',
    title: 'Around the World',
    subtitle: 'G-MURY &middot; R44 Astro &middot; 97 Days',
    short: 'First piston-engine helicopter circumnavigation. 28 countries.',
    full: 'Departed England eastbound via Italy, the Middle East, India, Southeast Asia, up into Russia, across the Bering Strait to Alaska, down into California, across the USA, up Canada\'s coast, home via Greenland, Iceland, and the Faroe Islands. The aircraft — G-MURY — now resides in the Smithsonian.',
    img: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  },
  {
    id: 'north',
    year: '2002',
    title: 'The North Pole',
    subtitle: 'G-NUDE &middot; R44 Raven II',
    short: 'First piston helicopter at the Geographic North Pole.',
    full: 'Flew with Steve Brooks to 90°N. The Robinson R44 Raven II — registration G-NUDE — became the first piston-powered helicopter to land at the North Pole. Guinness World Record confirmed.',
    img: '/assets/images/expeditions/north-pole.jpg',
  },
  {
    id: 'drake',
    year: '2003',
    title: 'Drake Passage',
    subtitle: 'G-NUDE &middot; Engine Failure at 59°S',
    short: 'Survived 9.5 hours in a life raft after ditching.',
    full: '450 miles into the most treacherous waters on earth. Engine failure. Autorotation onto 5-metre swells. His father\'s 35-year-old survival kit kept them alive. A Breitling Emergency watch broadcast on 121.5 MHz. Chilean icebreaker rescued them after 9.5 hours. "Our chances of survival were zero."',
    img: '/assets/images/expeditions/antartica.jpg',
  },
  {
    id: 'south',
    year: '2005',
    title: 'The South Pole',
    subtitle: 'R44 Raven II &middot; -26°C',
    short: 'First crew to reach both Poles by helicopter.',
    full: 'Landed 18 January 2005. Bright sunshine, -26°C. The South Pole sits at 9,300 feet above sea level. Q flew the R44 at up to 14,000 feet density altitude. Past Cape Horn, across the Drake Passage — the same waters that almost killed them two years earlier.',
    img: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
  },
  {
    id: 'triangle',
    year: '~2015',
    title: 'The Polar Triangle',
    subtitle: 'Solo &middot; Three North Poles',
    short: 'Geographic, Magnetic, and Pole of Inaccessibility — solo.',
    full: 'First pilot to fly to the exact three North Poles in a single journey. The Pole of Inaccessibility is 700 miles from land in any direction. "As a physicist, I am very attracted to a spot where all times become directions. At the poles, all times go through your body."',
    img: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
  },
];

function AboutV11() {
  const [expandedCard, setExpandedCard] = useState(null);

  const parallaxRef = useRef(null);
  const { scrollYProgress: pScroll } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const pY = useTransform(pScroll, [0, 1], ['-12%', '12%']);

  return (
    <>
      <style>{`
        .au41 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- WARM HERO ---- */
        .au41-hero { position: relative; height: 85vh; min-height: 600px; overflow: hidden; display: flex; align-items: flex-end; }
        .au41-hero__bg { position: absolute; inset: -10%; z-index: 1; }
        .au41-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au41-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(250,249,246,0) 0%, rgba(250,249,246,0.6) 50%, rgba(250,249,246,1) 100%); }
        .au41-hero__content { position: relative; z-index: 3; max-width: 700px; padding: 0 6vw 4rem; }
        .au41-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #888; display: block; margin-bottom: 1.5rem; }
        .au41-hero__title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; line-height: 1.15; margin: 0 0 1.5rem; color: #1a1a1a; }
        .au41-hero__title strong { font-weight: 700; }
        .au41-hero__desc { font-size: 1rem; line-height: 1.8; color: #555; max-width: 500px; }

        /* ---- FAMILY LINEAGE ---- */
        .au41-lineage { max-width: 900px; margin: 0 auto; padding: 5rem 2rem; }
        .au41-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .au41-heading { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; color: #1a1a1a; }
        .au41-body { font-size: 0.95rem; line-height: 1.9; color: #666; }
        .au41-body p { margin: 0 0 1.25rem; }
        .au41-body p:last-child { margin-bottom: 0; }
        .au41-body em { color: #444; font-style: italic; }
        .au41-lineage__quote { font-size: 1.15rem; line-height: 1.5; color: #1a1a1a; font-style: italic; border-left: 2px solid #d0ccc5; padding-left: 1.5rem; margin: 2rem 0; max-width: 600px; }
        .au41-lineage__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; display: block; margin-top: 0.75rem; }
        .au41-lineage__gen { display: grid; grid-template-columns: auto 1fr; gap: 1rem 2rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e8e6e2; align-items: baseline; }
        .au41-lineage__gen-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; }
        .au41-lineage__gen-val { font-size: 0.88rem; color: #555; line-height: 1.5; }

        /* ---- PARALLAX BREAK ---- */
        .au41-parallax { position: relative; height: 350px; overflow: hidden; }
        .au41-parallax__bg { position: absolute; inset: -15%; }
        .au41-parallax__bg img { width: 100%; height: 100%; object-fit: cover; }
        .au41-parallax__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }

        /* ---- PHILOSOPHY ---- */
        .au41-philosophy { background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .au41-philosophy__inner { max-width: 900px; margin: 0 auto; padding: 5rem 2rem; }
        .au41-philosophy__quotes { display: flex; flex-direction: column; gap: 3rem; margin-top: 2rem; }
        .au41-philosophy__q { display: grid; grid-template-columns: 40px 1fr; gap: 1.5rem; align-items: start; }
        .au41-philosophy__q-num { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 200; color: rgba(26,26,26,0.1); line-height: 1; }
        .au41-philosophy__q-text { font-size: 1rem; line-height: 1.8; color: #444; font-style: italic; }

        /* ---- EXPEDITION CARDS ---- */
        .au41-expeditions { padding: 5rem 2rem; }
        .au41-expeditions__header { max-width: 900px; margin: 0 auto 3rem; }
        .au41-expeditions__grid { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 1px; }
        .au41-exp { background: #fff; border: 1px solid #e8e6e2; cursor: pointer; transition: all 0.3s ease; overflow: hidden; }
        .au41-exp:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .au41-exp__header { display: grid; grid-template-columns: 70px 1fr auto; gap: 1.5rem; align-items: center; padding: 1.5rem 2rem; }
        .au41-exp__year { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 200; color: rgba(26,26,26,0.25); }
        .au41-exp__info {}
        .au41-exp__title { font-size: 1rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.25rem; }
        .au41-exp__subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.08em; color: #999; }
        .au41-exp__short { font-size: 0.85rem; color: #888; text-align: right; }
        .au41-exp__toggle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: #999; padding: 4px 10px; border: 1px solid #e8e6e2; background: none; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; margin-left: 1rem; }
        .au41-exp__toggle:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .au41-exp__detail { overflow: hidden; }
        .au41-exp__detail-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 0 2rem 2rem; }
        .au41-exp__detail-img img { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; }
        .au41-exp__detail-text { font-size: 0.88rem; line-height: 1.75; color: #666; padding-top: 0.5rem; }

        /* ---- COMMUNITY ---- */
        .au41-community { background: #fff; border-top: 1px solid #e8e6e2; padding: 5rem 2rem; text-align: center; }
        .au41-community__inner { max-width: 700px; margin: 0 auto; }
        .au41-community__reviews { display: flex; flex-direction: column; gap: 2rem; margin-top: 2rem; text-align: left; }
        .au41-community__review { padding: 1.5rem 0; border-bottom: 1px solid #f0efec; }
        .au41-community__review:last-child { border-bottom: none; }
        .au41-community__review-text { font-size: 0.95rem; line-height: 1.75; color: #555; font-style: italic; margin: 0 0 0.5rem; }
        .au41-community__review-attr { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; }

        /* ---- CTA ---- */
        .au41-cta { padding: 5rem 2rem; text-align: center; }
        .au41-cta__inner { max-width: 550px; margin: 0 auto; }
        .au41-cta__buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .au41-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .au41-btn--primary { background: #1a1a1a; color: #fff; }
        .au41-btn--primary:hover { background: #333; }
        .au41-btn--outline { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .au41-btn--outline:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .au41-exp__header { grid-template-columns: 1fr; gap: 0.5rem; }
          .au41-exp__short { text-align: left; }
          .au41-exp__detail-inner { grid-template-columns: 1fr; }
          .au41-lineage__gen { grid-template-columns: 1fr; }
          .au41-philosophy__q { grid-template-columns: 1fr; }
          .au41-philosophy__q-num { display: none; }
          .au41-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au41">
        {/* WARM HERO — fades into warm background */}
        <section className="au41-hero">
          <div className="au41-hero__bg">
            <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="Helicopter flying at golden hour" />
          </div>
          <div className="au41-hero__overlay" />
          <div className="au41-hero__content">
            <motion.span className="au41-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              Denham Aerodrome &middot; Since 1917
            </motion.span>
            <motion.h1 className="au41-hero__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
              A Cornishman, a physicist, and the <strong>most decorated helicopter pilot in British history.</strong>
            </motion.h1>
            <motion.p className="au41-hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
              This is the story of HQ Aviation.
            </motion.p>
          </div>
        </section>

        {/* FAMILY LINEAGE */}
        <section className="au41-lineage">
          <Reveal>
            <span className="au41-pretext">Origins</span>
            <h2 className="au41-heading">The Smith Family &amp; Flight</h2>
            <div className="au41-body">
              <p>Quentin Smith has been flying since the age of five. A Cornishman by birth and a physicist by training, he credits physics with providing <em>&ldquo;the wonderful joy of understanding of physical properties&rdquo;</em> — the forces that let a rotor blade, spinning under tension like a powered sycamore seed, carry a machine through the air.</p>
              <p>His father, Mike Smith, was a retired Lieutenant of the Fleet Air Arm — one of the original Borneo &ldquo;Junglies&rdquo; of 848 Naval Air Squadron, flying Wessex Mk 5s out of RNAS Culdrose into forward operating bases deep in the Borneo jungle. The elder Smith's discipline — his meticulous attention to survival preparation — would one day save his son's life at 59&deg; South in the Drake Passage.</p>
            </div>
            <p className="au41-lineage__quote">
              &ldquo;Alongside adventure is an obligation to share the beauty of your experience with others. There is absolutely an obligation to do that.&rdquo;
              <span className="au41-lineage__attr">Captain Q</span>
            </p>
            <div className="au41-lineage__gen">
              <span className="au41-lineage__gen-label">Father</span>
              <span className="au41-lineage__gen-val">Lt. Mike Smith &middot; Fleet Air Arm &middot; 848 NAS &middot; Borneo Junglies</span>
              <span className="au41-lineage__gen-label">Son</span>
              <span className="au41-lineage__gen-val">Capt. Quentin Smith &middot; 2x World Champion &middot; FAI Gold &middot; 12,000+ hrs PIC</span>
              <span className="au41-lineage__gen-label">Wife</span>
              <span className="au41-lineage__gen-val">Juliette Smith &middot; Company Secretary &middot; From Brittany</span>
            </div>
          </Reveal>
        </section>

        {/* PARALLAX BREAK */}
        <section ref={parallaxRef} className="au41-parallax">
          <motion.div className="au41-parallax__bg" style={{ y: pY }}>
            <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Q at World Championships" />
          </motion.div>
          <div className="au41-parallax__overlay" />
        </section>

        {/* PHILOSOPHY — Q's real quotes */}
        <section className="au41-philosophy">
          <div className="au41-philosophy__inner">
            <Reveal>
              <span className="au41-pretext">In Q's Words</span>
              <h2 className="au41-heading">A Philosophy of Flight</h2>
              <div className="au41-philosophy__quotes">
                <div className="au41-philosophy__q">
                  <span className="au41-philosophy__q-num">01</span>
                  <p className="au41-philosophy__q-text">&ldquo;Powered rotating wings, a bit like a powered sycamore seed. 99.9% of the population thinks helicopters drop like a brick if the engine fails — but autorotation provides a perfectly safe descent.&rdquo;</p>
                </div>
                <div className="au41-philosophy__q">
                  <span className="au41-philosophy__q-num">02</span>
                  <p className="au41-philosophy__q-text">&ldquo;As a physicist, I am very attracted to a spot where all times become directions. At the poles, all times go through your body.&rdquo;</p>
                </div>
                <div className="au41-philosophy__q">
                  <span className="au41-philosophy__q-num">03</span>
                  <p className="au41-philosophy__q-text">&ldquo;You can fly for hours over vast openness and there, over the horizon, slowly come the tall buildings of a city rising like the moon.&rdquo;</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* EXPANDABLE EXPEDITION CARDS */}
        <section className="au41-expeditions">
          <div className="au41-expeditions__header">
            <Reveal>
              <span className="au41-pretext">The Expeditions</span>
              <h2 className="au41-heading">Adventures That Changed Aviation</h2>
            </Reveal>
          </div>
          <div className="au41-expeditions__grid">
            {EXPEDITION_CARDS.map((exp) => (
              <div key={exp.id} className="au41-exp" onClick={() => setExpandedCard(expandedCard === exp.id ? null : exp.id)}>
                <div className="au41-exp__header">
                  <span className="au41-exp__year">{exp.year}</span>
                  <div className="au41-exp__info">
                    <h3 className="au41-exp__title">{exp.title}</h3>
                    <span className="au41-exp__subtitle" dangerouslySetInnerHTML={{ __html: exp.subtitle }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="au41-exp__short">{exp.short}</span>
                    <button className="au41-exp__toggle" onClick={(e) => { e.stopPropagation(); setExpandedCard(expandedCard === exp.id ? null : exp.id); }}>
                      {expandedCard === exp.id ? 'CLOSE' : 'READ'}
                    </button>
                  </div>
                </div>
                <motion.div
                  className="au41-exp__detail"
                  initial={false}
                  animate={{ height: expandedCard === exp.id ? 'auto' : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="au41-exp__detail-inner">
                    <div className="au41-exp__detail-img">
                      <img src={exp.img} alt={exp.title} />
                    </div>
                    <p className="au41-exp__detail-text">{exp.full}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="au41-community">
          <div className="au41-community__inner">
            <Reveal>
              <span className="au41-pretext">The Community</span>
              <h2 className="au41-heading">More Than a Flight School</h2>
              <div className="au41-body" style={{ textAlign: 'center' }}>
                <p>Open seven days a week. A cozy clubhouse. A team that treats every student, every owner, every engineer as family. This is what people say about us.</p>
              </div>
              <div className="au41-community__reviews">
                <div className="au41-community__review">
                  <p className="au41-community__review-text">&ldquo;HQ Aviation is by far the best helicopter school in the UK. Much more than just a business — it's a community of caring people who all share a love of helicopters.&rdquo;</p>
                  <span className="au41-community__review-attr">PPL(H) Student</span>
                </div>
                <div className="au41-community__review">
                  <p className="au41-community__review-text">&ldquo;The staff is extremely organized and every experience I've had with HQ has been fantastic. Great bunch and excellent team with a great atmosphere and top instructors.&rdquo;</p>
                  <span className="au41-community__review-attr">Self-Fly Hire Pilot</span>
                </div>
                <div className="au41-community__review">
                  <p className="au41-community__review-text">&ldquo;Skilled instructors, friendly atmosphere, a lovely and cozy clubhouse. The most welcoming community in aviation.&rdquo;</p>
                  <span className="au41-community__review-attr">Training Client</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="au41-cta">
          <div className="au41-cta__inner">
            <Reveal>
              <span className="au41-pretext">Ready For An Adventure?</span>
              <h2 className="au41-heading">Begin Your Journey</h2>
              <div className="au41-cta__buttons">
                <Link className="au41-btn au41-btn--primary" to="/contact">Contact Us &rarr;</Link>
                <Link className="au41-btn au41-btn--outline" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}


/* ============================================================
   V12 — FINAL
   The definitive About Us page. Combines the best of all
   previous variations with real researched content. Compact
   but cinematic. Every word earned.
   ============================================================ */

function AboutV12() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroContentY = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroContentOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  const dividerRef = useRef(null);
  const { scrollYProgress: divScroll } = useScroll({ target: dividerRef, offset: ['start end', 'end start'] });
  const divY = useTransform(divScroll, [0, 1], ['-12%', '12%']);

  const [expandedExp, setExpandedExp] = useState(null);
  const logbookRef = useRef(null);

  const FINAL_EXPEDITIONS = [
    { id: 'circum', year: '1997', callsign: 'G-MURY', title: 'Around the World', sub: 'R44 Astro \u00b7 28 countries \u00b7 97 days', short: 'First piston-engine helicopter circumnavigation of the globe.', full: 'Departed England eastbound. Italy, the Middle East, India, Southeast Asia, up into Russia, across the Bering Strait to Alaska, down into California, across the USA, Greenland, Iceland, home. The aircraft \u2014 G-MURY, serial c/n 0201 \u2014 now resides in the Smithsonian National Air and Space Museum.', img: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp', badge: 'FAI Record', badgeColor: '#34d399' },
    { id: 'north', year: '2002', callsign: 'G-NUDE', title: 'The North Pole', sub: 'R44 Raven II \u00b7 with Steve Brooks', short: 'First piston-powered helicopter at the Geographic North Pole.', full: 'Robinson R44 Raven II, registration G-NUDE. Flew with Steve Brooks to 90\u00b0N. Guinness World Record confirmed.', img: '/assets/images/expeditions/north-pole.jpg', badge: 'Guinness', badgeColor: '#60a5fa' },
    { id: 'drake', year: '2003', callsign: 'G-NUDE', title: 'Drake Passage', sub: 'Engine failure at 59\u00b0S \u00b7 9.5 hours in life raft', short: 'Survived a ditching in the most treacherous waters on earth.', full: '450 miles into the Drake Passage. Engine failure. Controlled autorotation onto five-metre swells. His father\u2019s survival kit \u2014 packed 35 years earlier by a Fleet Air Arm Junglie \u2014 kept them alive. A Breitling Emergency watch broadcast on 121.5 MHz. Chilean icebreaker rescued them after 9.5 hours. \u201CNo one had ever survived a ditching here before, and our chances of survival were zero.\u201D', img: '/assets/images/expeditions/antartica.jpg', badge: 'Survived', badgeColor: '#f87171' },
    { id: 'south', year: '2005', callsign: 'R44', title: 'The South Pole', sub: '18 Jan 2005 \u00b7 \u221226\u00b0C \u00b7 9,300 ft', short: 'First crew to fly a helicopter to both Poles.', full: 'Landed 18 January 2005. Bright sunshine, \u221226\u00b0C. The South Pole sits at 9,300 feet. Q flew the R44 at up to 14,000 feet density altitude \u2014 past Cape Horn, across the Drake Passage, the same waters that nearly killed them two years earlier.', img: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp', badge: 'Guinness', badgeColor: '#60a5fa' },
    { id: 'triangle', year: '~2015', callsign: 'R44', title: 'The Polar Triangle', sub: 'Solo \u00b7 Three North Poles in one journey', short: 'Geographic, Magnetic, and Pole of Inaccessibility \u2014 solo.', full: 'First pilot to fly to the exact three North Poles in a single journey. The Pole of Inaccessibility is 700 miles from land in any direction. \u201CAs a physicist, I am very attracted to a spot where all times become directions. At the poles, all times go through your body.\u201D', img: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', badge: 'First', badgeColor: '#a78bfa' },
  ];

  return (
    <>
      <style>{`
        .au42 { font-family: 'Space Grotesk', sans-serif; background: #faf9f6; }

        /* ---- HERO ---- */
        .about-hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; }
        .about-hero__bg { position: absolute; inset: 0; z-index: 1; overflow: hidden; }
        .about-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
        .about-hero__overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(250,249,246,0) 0%, rgba(250,249,246,0.3) 40%, rgba(250,249,246,0.85) 75%, rgba(250,249,246,1) 100%); }
        .about-hero__content { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; padding: 0 6vw 6vh; }
        .about-hero__pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #888; display: block; margin-bottom: 1.5rem; }
        .about-hero__title { font-size: clamp(2.8rem, 6vw, 5rem); font-weight: 300; line-height: 1.1; margin: 0 0 1.5rem; color: #1a1a1a; max-width: 800px; }
        .about-hero__title strong { font-weight: 700; }
        .about-hero__desc { font-size: 1rem; line-height: 1.75; color: #666; max-width: 520px; }

        /* ---- STATS ---- */
        .about-stats { display: flex; border-bottom: 1px solid #e8e6e2; background: #fff; }
        .about-stats__item { flex: 1; text-align: center; padding: 1.5rem 0.5rem; border-right: 1px solid #e8e6e2; }
        .about-stats__item:last-child { border-right: none; }
        .about-stats__value { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 600; color: #1a1a1a; display: block; line-height: 1; margin-bottom: 5px; }
        .about-stats__label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }

        /* ---- SECTION UTILS ---- */
        .about-pretext { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .about-heading { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; color: #1a1a1a; }
        .about-body { font-size: 0.95rem; line-height: 1.85; color: #666; }
        .about-body p { margin: 0 0 1.25rem; }
        .about-body p:last-child { margin-bottom: 0; }
        .about-body em { color: #444; }

        /* ---- TWO-COL ---- */
        .about-two { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1200px; margin: 0 auto; padding: 6rem 4vw; }
        .about-two__img { overflow: hidden; }
        .about-two__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }

        /* ---- PULL QUOTE ---- */
        .about-quote { padding: 5rem 2rem; text-align: center; background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .about-quote__text { font-size: clamp(1.3rem, 2.5vw, 2rem); font-weight: 300; line-height: 1.5; color: #1a1a1a; max-width: 720px; margin: 0 auto 1rem; font-style: italic; }
        .about-quote__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #bbb; }

        /* ---- PARALLAX DIVIDER ---- */
        .about-divider { position: relative; height: 400px; overflow: hidden; }
        .about-divider__bg { position: absolute; inset: -15%; z-index: 1; }
        .about-divider__bg img { width: 100%; height: 100%; object-fit: cover; }
        .about-divider__overlay { position: absolute; inset: 0; z-index: 2; background: rgba(0,0,0,0.4); }

        /* ---- PHILOSOPHY ---- */
        .about-philosophy { max-width: 800px; margin: 0 auto; padding: 6rem 2rem; }
        .about-philosophy__items { display: flex; flex-direction: column; gap: 2.5rem; margin-top: 2rem; }
        .about-philosophy__item { display: grid; grid-template-columns: 32px 1fr; gap: 1.25rem; align-items: start; }
        .about-philosophy__num { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; font-weight: 200; color: rgba(26,26,26,0.08); line-height: 1; padding-top: 2px; }
        .about-philosophy__text { font-size: 1rem; line-height: 1.85; color: #444; font-style: italic; }

        /* ---- EXPEDITIONS ---- */
        .about-expeditions { padding: 6rem 2rem; background: #0f1318; }
        .about-expeditions__header { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 2rem; }
        .about-expeditions .about-pretext { color: rgba(255,255,255,0.3); }
        .about-expeditions .about-heading { color: #fff; }
        .about-expeditions__arrows { display: flex; gap: 0.5rem; }
        .about-expeditions__arrow { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.12); background: none; color: rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s ease; }
        .about-expeditions__arrow:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
        .about-expeditions__wrap { position: relative; max-width: 1100px; margin: 0 auto; }
        .about-expeditions__wrap::before, .about-expeditions__wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none; }
        .about-expeditions__wrap::before { left: 0; background: linear-gradient(to right, #0f1318, transparent); }
        .about-expeditions__wrap::after { right: 0; background: linear-gradient(to left, #0f1318, transparent); }
        .about-expeditions__track { display: flex; gap: 1px; overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; }
        .about-expeditions__track::-webkit-scrollbar { display: none; }
        .about-exp { flex-shrink: 0; width: 340px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.3s ease; overflow: hidden; }
        .about-exp:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
        .about-exp__top { padding: 1.75rem 1.75rem 0; }
        .about-exp__meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
        .about-exp__year { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 200; color: rgba(255,255,255,0.2); }
        .about-exp__badge { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; padding: 2px 7px; border: 1px solid; text-transform: uppercase; }
        .about-exp__callsign { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); display: block; margin-bottom: 0.75rem; }
        .about-exp__title { font-size: 1.05rem; font-weight: 600; color: #fff; margin: 0 0 0.25rem; }
        .about-exp__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.06em; color: rgba(255,255,255,0.35); display: block; margin-bottom: 0.75rem; }
        .about-exp__short { font-size: 0.8rem; line-height: 1.6; color: rgba(255,255,255,0.45); padding-bottom: 1.5rem; }
        .about-exp__detail { overflow: hidden; }
        .about-exp__detail-inner { padding: 0 1.75rem 1.75rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .about-exp__detail-img { margin: 1.25rem 0; overflow: hidden; }
        .about-exp__detail-img img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .about-exp__detail-text { font-size: 0.8rem; line-height: 1.7; color: rgba(255,255,255,0.5); }

        /* ---- DENHAM ---- */
        .about-denham { max-width: 1200px; margin: 0 auto; padding: 6rem 4vw; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .about-denham__img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .about-denham__facts { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1.5rem; }
        .about-denham__fact { display: flex; align-items: baseline; gap: 1rem; padding: 0.35rem 0; border-bottom: 1px solid #f0efec; }
        .about-denham__fact:last-child { border-bottom: none; }
        .about-denham__fact-key { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; width: 70px; flex-shrink: 0; }
        .about-denham__fact-val { font-size: 0.85rem; color: #555; }

        /* ---- CREDENTIALS ---- */
        .about-creds { display: flex; background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .about-cred { flex: 1; padding: 1.25rem 1.5rem; border-right: 1px solid #e8e6e2; }
        .about-cred:last-child { border-right: none; }
        .about-cred__label { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 3px; }
        .about-cred__value { font-size: 0.78rem; font-weight: 600; color: #1a1a1a; }

        /* ---- TESTIMONIALS ---- */
        .about-testimonials { padding: 5rem 2rem; max-width: 800px; margin: 0 auto; }
        .about-testimonials__header { text-align: center; margin-bottom: 2.5rem; }
        .about-testimonials__list { display: flex; flex-direction: column; gap: 0; }
        .about-testimonial { padding: 1.5rem 0; border-bottom: 1px solid #e8e6e2; }
        .about-testimonial:first-child { border-top: 1px solid #e8e6e2; }
        .about-testimonial__text { font-size: 0.95rem; line-height: 1.75; color: #555; font-style: italic; margin: 0 0 0.5rem; }
        .about-testimonial__attr { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; }

        /* ---- CTA ---- */
        .about-cta { padding: 6rem 2rem; text-align: center; background: #1a1a1a; }
        .about-cta__inner { max-width: 550px; margin: 0 auto; }
        .about-cta .about-pretext { color: rgba(255,255,255,0.3); }
        .about-cta .about-heading { color: #fff; }
        .about-cta__desc { font-size: 0.95rem; line-height: 1.75; color: rgba(255,255,255,0.45); margin-bottom: 2rem; }
        .about-cta__buttons { display: flex; gap: 1rem; justify-content: center; }
        .about-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none; }
        .about-btn--light { background: #fff; color: #1a1a1a; }
        .about-btn--light:hover { background: #f0efec; color: #1a1a1a; }
        .about-btn--ghost { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); outline: 1px solid rgba(255,255,255,0.2); outline-offset: 3px; }
        .about-btn--ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; outline-color: rgba(255,255,255,0.5); }

        @media (max-width: 768px) {
          .about-hero__content { padding: 0 2rem 4vh; }
          .about-two, .about-denham { grid-template-columns: 1fr; gap: 2rem; padding-left: 2rem; padding-right: 2rem; }
          .about-stats { flex-wrap: wrap; }
          .about-stats__item { min-width: 45%; border-bottom: 1px solid #e8e6e2; }
          .about-creds { flex-direction: column; }
          .about-cred { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .about-cred:last-child { border-bottom: none; }
          .about-philosophy__item { grid-template-columns: 1fr; }
          .about-philosophy__num { display: none; }
          .about-cta__buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="au42">

        {/* ═══════════════ HERO ═══════════════ */}
        <section ref={heroRef} className="about-hero">
          <motion.div className="about-hero__bg" style={{ scale: heroImgScale }}>
            <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="Helicopter flying at golden hour over the English countryside" />
          </motion.div>
          <div className="about-hero__overlay" />
          <motion.div className="about-hero__content" style={{ y: heroContentY, opacity: heroContentOpacity }}>
            <motion.span className="about-hero__pretext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              Hangar E &middot; Denham Aerodrome &middot; Since 1990
            </motion.span>
            <motion.h1 className="about-hero__title" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
              A Cornishman, a physicist, and the <strong>most decorated helicopter pilot in British history.</strong>
            </motion.h1>
            <motion.p className="about-hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
              HQ Aviation is the United Kingdom's specialist Robinson helicopter company. Training, sales, maintenance, and expeditions — from a single facility thirty minutes from London.
            </motion.p>
          </motion.div>
        </section>

        {/* ═══════════════ STATS ═══════════════ */}
        <div className="about-stats">
          <div className="about-stats__item"><span className="about-stats__value"><AnimatedNumber value={35} suffix="+" /></span><span className="about-stats__label">Years</span></div>
          <div className="about-stats__item"><span className="about-stats__value"><AnimatedNumber value={12000} suffix="+" /></span><span className="about-stats__label">Flight Hours PIC</span></div>
          <div className="about-stats__item"><span className="about-stats__value"><AnimatedNumber value={7} /></span><span className="about-stats__label">Continents</span></div>
          <div className="about-stats__item"><span className="about-stats__value">2x</span><span className="about-stats__label">World Champion</span></div>
        </div>

        {/* ═══════════════ STORY ═══════════════ */}
        <section className="about-two">
          <Reveal direction="left">
            <div className="about-two__img">
              <img src="/assets/images/facility/hq-0089.jpg" alt="Inside the HQ Aviation hangar at Denham Aerodrome" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div>
              <span className="about-pretext">The Story</span>
              <h2 className="about-heading">London's Helicopter Flight School</h2>
              <div className="about-body">
                <p>Captain Quentin Smith has been flying since the age of five. A physicist by training, he founded HQ Aviation at Denham Aerodrome in 1990. What started as a single-helicopter training operation has, over three decades, grown into the UK's complete Robinson centre of excellence.</p>
                <p>Authorized Robinson Dealer and Service Centre. Rolls-Royce RR300 Authorized Service Center. CAA Approved Training Organisation. Open seven days a week, maintaining the biggest Robinson R66 fleet in Europe.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ QUOTE ═══════════════ */}
        <section className="about-quote">
          <Reveal>
            <p className="about-quote__text">&ldquo;Flying is, above all, a beautiful thing that deserves to be enjoyed.&rdquo;</p>
            <span className="about-quote__attr">Captain Q</span>
          </Reveal>
        </section>

        {/* ═══════════════ FOUNDER ═══════════════ */}
        <section className="about-two" style={{ direction: 'rtl' }}>
          <Reveal direction="right" delay={0.15}>
            <div style={{ direction: 'ltr' }}>
              <span className="about-pretext">The Founder</span>
              <h2 className="about-heading">Captain Quentin Smith</h2>
              <div className="about-body">
                <p>Two-time World Helicopter Aerobatics Champion. In Moscow in 1994, he flew a humble Robinson R22 against Russian pilots in turbine machines — and won. Eighteen years later he took gold again, performing a backwards autorotation from 300 feet that experts had deemed impossible.</p>
                <p>Guinness World Record holder. First piston helicopter circumnavigation of the globe. First to the North Pole. First to the South Pole. Recipient of the FAI Gold Rotorcraft Medal — the highest individual honour in international helicopter aviation.</p>
              </div>
            </div>
          </Reveal>
          <Reveal direction="left">
            <div className="about-two__img" style={{ direction: 'ltr' }}>
              <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Quentin Smith" />
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ PARALLAX ═══════════════ */}
        <section ref={dividerRef} className="about-divider">
          <motion.div className="about-divider__bg" style={{ y: divY }}>
            <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Q at the World Helicopter Championships" />
          </motion.div>
          <div className="about-divider__overlay" />
        </section>

        {/* ═══════════════ PHILOSOPHY ═══════════════ */}
        <section className="about-philosophy">
          <Reveal>
            <span className="about-pretext">In Q's Words</span>
            <h2 className="about-heading">A Philosophy of Flight</h2>
          </Reveal>
          <div className="about-philosophy__items">
            <Reveal delay={0.1}>
              <div className="about-philosophy__item">
                <span className="about-philosophy__num">01</span>
                <p className="about-philosophy__text">&ldquo;Powered rotating wings, a bit like a powered sycamore seed. 99.9% of the population thinks helicopters drop like a brick if the engine fails — but autorotation provides a perfectly safe descent.&rdquo;</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="about-philosophy__item">
                <span className="about-philosophy__num">02</span>
                <p className="about-philosophy__text">&ldquo;As a physicist, I am very attracted to a spot where all times become directions. At the poles, all times go through your body.&rdquo;</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="about-philosophy__item">
                <span className="about-philosophy__num">03</span>
                <p className="about-philosophy__text">&ldquo;You can fly for hours over vast openness and there, over the horizon, slowly come the tall buildings of a city rising like the moon.&rdquo;</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ EXPEDITIONS ═══════════════ */}
        <section className="about-expeditions">
          <div className="about-expeditions__header">
            <div>
              <span className="about-pretext">Flight Logbook</span>
              <h2 className="about-heading">The Expeditions</h2>
            </div>
            <div className="about-expeditions__arrows">
              <button className="about-expeditions__arrow" onClick={() => logbookRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}>&larr;</button>
              <button className="about-expeditions__arrow" onClick={() => logbookRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}>&rarr;</button>
            </div>
          </div>
          <div className="about-expeditions__wrap">
            <div ref={logbookRef} className="about-expeditions__track">
              {FINAL_EXPEDITIONS.map((exp) => (
                <div key={exp.id} className="about-exp" onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}>
                  <div className="about-exp__top">
                    <div className="about-exp__meta">
                      <span className="about-exp__year">{exp.year}</span>
                      <span className="about-exp__badge" style={{ color: exp.badgeColor, borderColor: exp.badgeColor + '4d' }}>{exp.badge}</span>
                    </div>
                    <span className="about-exp__callsign">{exp.callsign}</span>
                    <h3 className="about-exp__title">{exp.title}</h3>
                    <span className="about-exp__sub">{exp.sub}</span>
                    <p className="about-exp__short">{exp.short}</p>
                  </div>
                  <motion.div
                    className="about-exp__detail"
                    initial={false}
                    animate={{ height: expandedExp === exp.id ? 'auto' : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="about-exp__detail-inner">
                      <div className="about-exp__detail-img">
                        <img src={exp.img} alt={exp.title} />
                      </div>
                      <p className="about-exp__detail-text">{exp.full}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ DENHAM ═══════════════ */}
        <section className="about-denham">
          <Reveal direction="left">
            <div className="about-denham__img">
              <img src="/assets/images/facility/busy-hangar.jpg" alt="Inside the HQ Aviation facility" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <div>
              <span className="about-pretext">The Base</span>
              <h2 className="about-heading">Denham Aerodrome</h2>
              <div className="about-body">
                <p>Flying since 1917. Originally RAF Denham — a training school for Flight Cadets in the First World War. Four miles from Pinewood Studios. Just inside the M25, thirty minutes from central London.</p>
              </div>
              <div className="about-denham__facts">
                <div className="about-denham__fact"><span className="about-denham__fact-key">ICAO</span><span className="about-denham__fact-val">EGLD</span></div>
                <div className="about-denham__fact"><span className="about-denham__fact-key">Position</span><span className="about-denham__fact-val">51.5751&deg;N / 0.5059&deg;W</span></div>
                <div className="about-denham__fact"><span className="about-denham__fact-key">Runway</span><span className="about-denham__fact-val">06/24 &middot; 775m paved</span></div>
                <div className="about-denham__fact"><span className="about-denham__fact-key">Active</span><span className="about-denham__fact-val">Since 1917 &middot; 108 years of flying</span></div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ CREDENTIALS ═══════════════ */}
        <div className="about-creds">
          <div className="about-cred"><span className="about-cred__label">Robinson</span><span className="about-cred__value">Authorized Dealer &amp; Service Centre</span></div>
          <div className="about-cred"><span className="about-cred__label">Rolls-Royce</span><span className="about-cred__value">RR300 Service Center</span></div>
          <div className="about-cred"><span className="about-cred__label">UK CAA</span><span className="about-cred__value">Approved Training Org</span></div>
          <div className="about-cred"><span className="about-cred__label">FAI</span><span className="about-cred__value">Gold Rotorcraft Medal</span></div>
        </div>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="about-testimonials">
          <div className="about-testimonials__header">
            <Reveal>
              <span className="about-pretext">What People Say</span>
              <h2 className="about-heading">More Than a Flight School</h2>
            </Reveal>
          </div>
          <div className="about-testimonials__list">
            {[
              { text: 'HQ Aviation is by far the best helicopter school in the UK. Much more than just a business \u2014 it\u2019s a community of caring people who all share a love of helicopters.', attr: 'PPL(H) Student' },
              { text: 'The staff is extremely organized and every experience I\u2019ve had with HQ has been fantastic. Great bunch and excellent team with a great atmosphere and top instructors.', attr: 'Self-Fly Hire Pilot' },
              { text: 'Skilled instructors, friendly atmosphere, a lovely and cozy clubhouse. The most welcoming community in aviation.', attr: 'Training Client' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="about-testimonial">
                  <p className="about-testimonial__text">&ldquo;{t.text}&rdquo;</p>
                  <span className="about-testimonial__attr">{t.attr}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="about-cta">
          <div className="about-cta__inner">
            <Reveal>
              <span className="about-pretext">Ready For An Adventure?</span>
              <h2 className="about-heading">Begin Your Journey</h2>
              <p className="about-cta__desc">Whether you're learning to fly, buying your first helicopter, or planning an expedition to the edge of the world — it starts here, at Denham.</p>
              <div className="about-cta__buttons">
                <Link className="about-btn about-btn--light" to="/contact">Contact Us &rarr;</Link>
                <Link className="about-btn about-btn--ghost" to="/fleet">Explore Fleet</Link>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}


/* ============================================================
   PICKER CONFIGURATION
   ============================================================ */

const sections = {
  about: [
    { id: 'about-1', name: 'The Definitive', category: 'Full Page', desc: 'Complete production-ready About Us page with hero parallax, stats, story, founder, timeline, services, and CTA.' },
    { id: 'about-2', name: 'Editorial Asymmetric', category: 'Editorial', desc: 'Magazine-style layout with split opening, alternating content blocks, dark quote band, and horizontal stats.' },
    { id: 'about-3', name: 'Technical Dossier', category: 'Cards', desc: 'Modular card layout with structured data, section references, and clean bordered modules.' },
    { id: 'about-4', name: 'Dark Cinematic', category: 'Dark', desc: 'Rolls-Royce / Ferrari inspired: dark background, opacity-based text hierarchy, cinematic full-bleed imagery, scroll-linked reveal lines.' },
    { id: 'about-5', name: 'Sanctuary Scroll', category: 'Minimal', desc: 'Aman / Byredo inspired: warm background, maximum whitespace, single-thought sections, slow drift animations.' },
    { id: 'about-6', name: 'Fractured Velocity', category: 'Dynamic', desc: 'McLaren / Foster+Partners inspired: broken grid, staggered offsets, giant background numerals, diagonal clip-paths, window split.' },
    { id: 'about-7', name: 'Accordion Panels', category: 'Compact', desc: 'Ultra-compact: horizontal accordion with flex-ratio animation, infinite marquee strip, horizontal scrolling timeline cards.' },
    { id: 'about-8', name: 'Scroll Runway', category: 'Compact', desc: 'Vertical-to-horizontal scroll runway timeline, clip-path image wipes, opposing scroll-driven marquee strips.' },
    { id: 'about-9', name: 'Tabbed Dossier', category: 'Compact', desc: 'Minimal footprint: crossfading tabbed panels, departure-board stats, clickable progress-bar timeline with animated detail.' },
    { id: 'about-10', name: 'The Logbook', category: 'Story', desc: 'Real content: Q\'s actual quotes, horizontal flight logbook with registrations, Drake Passage survival story, Smithsonian connection, testimonial marquee.' },
    { id: 'about-11', name: 'The Family', category: 'Story', desc: 'Personal storytelling: family lineage (Borneo Junglie father), Q\'s physics philosophy in his own words, expandable expedition cards with real details.' },
    { id: 'about-12', name: 'Final', category: 'Final', desc: 'The definitive version. Real researched content, Q\'s actual quotes, expandable expedition logbook cards, Denham facts, credentials strip, testimonials, dark CTA.' },
  ],
};

const tabs = [
  { key: 'about', label: 'About Us', color: 'default' },
];

const variationMap = {
  'about-1': AboutV1,
  'about-2': AboutV2,
  'about-3': AboutV3,
  'about-4': AboutV4,
  'about-5': AboutV5,
  'about-6': AboutV6,
  'about-7': AboutV7,
  'about-8': AboutV8,
  'about-9': AboutV9,
  'about-10': AboutV10,
  'about-11': AboutV11,
  'about-12': AboutV12,
};


/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */

export default function AboutUsVariations() {
  const [currentVariation, setCurrentVariation] = useState('about-1');
  const VariationComponent = variationMap[currentVariation];

  return (
    <>
      <div style={{ minHeight: '100vh' }}>
        {VariationComponent ? <VariationComponent /> : <div style={{ padding: 80, textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', color: '#999' }}>Variation {currentVariation} — coming soon</div>}
      </div>
      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="about-us-variations-favorites"
        title="About Us Variations"
        onItemSelect={(item) => setCurrentVariation(item.id)}
      />
    </>
  );
}
