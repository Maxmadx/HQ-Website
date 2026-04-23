import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/approved-components.css';

// Import all approved components
import TrainingSummary from '../components/Training/TrainingSummary';
import BeforeAfter from '../components/Rebuilds/BeforeAfter';
import FacilityGallery from '../components/Maintenance/FacilityGallery';
import FacilityServicesCarousel from '../components/Maintenance/FacilityServicesCarousel';
import FacilityServicesDetail from '../components/Maintenance/FacilityServicesDetail';
import ExpeditionDepartureBoard from '../components/Expeditions/ExpeditionDepartureBoard';
import ExpeditionPassportStamps from '../components/Expeditions/ExpeditionPassportStamps';
import ExpeditionVideoSlider from '../components/Expeditions/ExpeditionVideoSlider';
import ExpeditionSplitFlap from '../components/Expeditions/ExpeditionSplitFlap';
import ExpeditionBarcode from '../components/Expeditions/ExpeditionBarcode';
import ExpeditionStackedLayers from '../components/Expeditions/ExpeditionStackedLayers';

import {
  TestimonialSlider,
  AsSeenIn,
  StatsCounter,
  PartnerLogos,
  SocialProofWall,
  WhyChooseUs,
  FounderStory,
  BeforeAfterStory,
  TeamPreview,
  ProcessSteps,
  LifestyleImagery,
  TopGearMoment,
  ScrollingStrips,
  FleetShowcaseCarousel,
  ModelSpotlight,
  InteractiveFleetExplorer,
  R88Announcement,
  CTASplit,
  LimitedSlotsCounter,
  PriceLockBanner,
  FAQAccordion,
  LocationHighlight,
  RecentNews,
  UpcomingEvents,
  HelicopterVsFixedWing,
  GroundSchoolPreview,
  TypeRatingCards,
  PilotHourBreakdown,
  CostTransparency,
  FerryFlightServices,
  AircraftLeasebackRevenue,
  SelfFlyHireRates,
  DestinationPartners,
  AdditionalServices,
  HangarageFeatures,
  AircraftManagement,
  RegulatoryCompliance,
  WorldRecordTimeline,
  PolarAchievement,
  MountainFlyingHazards,
  OwnershipBenefits,
  WhyFlyHelicopterMini,
  WhyFlyHelicopterCard,
  WhyFlyHelicopterCompact,
  MegaFooter,
  // Adventure & Expedition Components
  TopographicBackground,
  PolaroidPhotoTrail,
  CompassNavigation,
  TripRegistrationCard,
  AviationDividers,
  PassportStamps,
  CountdownBlocks,
  FloatingStars,
  ParallaxCloudLayers,
  CompassRoseFooter,
  CoordinateGridOverlay,
  TypewriterEffect,
  StaggeredReveal,
} from '../components';

// Expedition Destinations (moved from FinalExpeditions)
const expDestinations = {
  polar: [
    { name: 'North Pole', coords: '90.0000°N', duration: '14 Days', image: '/assets/images/expeditions/north-pole.jpg', link: '/expeditions/north-pole' },
    { name: 'South Pole', coords: '90.0000°S', duration: '21 Days', image: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp', link: '/expeditions/south-pole' },
    { name: 'Greenland', coords: '71.7069°N', duration: '10 Days', image: '/assets/images/expeditions/antartica.jpg', link: '/expeditions/greenland-2025' },
    { name: 'Antarctica', coords: '82.8628°S', duration: '18 Days', image: '/assets/images/expeditions/antartica.jpg', link: '/expeditions/antarctica' },
  ],
  european: [
    { name: 'Scottish Highlands', coords: '57.4596°N', duration: '5 Days', image: '/assets/images/expeditions/channel.jpg', link: '/expeditions/scotland' },
    { name: 'Norwegian Fjords', coords: '61.4720°N', duration: '7 Days', image: '/assets/images/expeditions/channel.jpg', link: '/expeditions/norway' },
    { name: 'Swiss Alps', coords: '46.8182°N', duration: '4 Days', image: '/assets/images/expeditions/channel.jpg', link: '/expeditions/alps' },
    { name: 'Iceland', coords: '64.9631°N', duration: '6 Days', image: '/assets/images/expeditions/channel.jpg', link: '/expeditions/iceland' },
  ],
  tropical: [
    { name: 'Bahamas', coords: '25.0343°N', duration: '7 Days', image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp', link: '/expeditions/destinations/bahamas' },
    { name: 'Costa Rica', coords: '9.7489°N', duration: '8 Days', image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp', link: '/expeditions/destinations/costa-rica' },
  ],
};

function ExpeditionDestinations() {
  const [activeRegion, setActiveRegion] = useState('polar');
  return (
    <section className="fexp-destinations">
      <div className="fexp-destinations__container">
        <div className="fexp-section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>Choose Your Adventure</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: '0.5rem' }}>
            <span style={{ color: '#1a1a1a' }}>Expedition </span>
            <span style={{ color: '#7a7a7a' }}>Destinations</span>
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[
            { id: 'polar', label: 'Polar Adventures' },
            { id: 'european', label: 'European Journeys' },
            { id: 'tropical', label: 'Tropical Escapes' },
          ].map((region) => (
            <button
              key={region.id}
              onClick={() => setActiveRegion(region.id)}
              style={{
                padding: '0.6rem 1.25rem', border: '1px solid #ddd', borderRadius: '100px', cursor: 'pointer',
                fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                background: activeRegion === region.id ? '#1a1a1a' : '#fff', color: activeRegion === region.id ? '#fff' : '#1a1a1a',
                transition: 'all 0.2s',
              }}
            >
              {region.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {expDestinations[activeRegion]?.map((dest) => (
            <Link key={dest.name} to={dest.link} style={{ textDecoration: 'none', color: 'inherit', background: '#faf9f6', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e8e6e2' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{dest.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999' }}>{dest.duration}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
          <Link to="/expeditions/bespoke" style={{ display: 'inline-block', padding: '0.85rem 2rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Plan a Bespoke Expedition
          </Link>
        </div>
      </div>
    </section>
  );
}

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: '1.5rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2rem',
    background: '#1a1a1a',
    color: '#fff',
    marginTop: '4rem'
  }}>
    {children}
  </h2>
);

/**
 * About V8 — Two-column layout with rotating card
 * Moved from Experimentation.jsx to approved components
 */
function AboutV8() {
  const [slide, setSlide] = useState(0);

  const benefits = [
    { verb: 'Join', noun: 'a Community', desc: 'Connect with fellow pilots, business leaders, and adventurers who share your passion for aviation at exclusive flying events and beyond.' },
    { verb: 'Enjoy', noun: 'the Journey', desc: "For a pilot, the journey is never just a means of getting somewhere — it is the experience itself. The best memories are made not at the destination, but somewhere above the clouds on the way there." },
    { verb: 'Land', noun: 'Anywhere', desc: 'No runways needed. Land at private estates, yachts, remote locations, and city centres.' },
    { verb: 'Gain', noun: 'Business Edge', desc: 'Multiple destinations in the same day is now possible, at great distances apart. People to see that are just too far to justify travelling by other methods — it can be done just like that.' },
    { verb: 'Create', noun: 'Family Memories', desc: 'Create unforgettable experiences with loved ones. Weekend trips become extraordinary adventures.' },
    { verb: 'Experience', noun: 'True Freedom', desc: 'Go where you want, when you want. The ultimate expression of personal freedom and independence.' },
    { verb: 'Arrive', noun: 'Differently', desc: 'Fly directly into exclusive events — race courses, Goodwood festivals, and more. The kind of access that speaks for itself.' },
    { verb: 'Achieve', noun: 'Your Dreams', desc: "Join an elite group who have mastered one of aviation's most challenging and rewarding skills." },
    { verb: 'Explore', noun: 'The World', desc: 'From Alpine peaks to Mediterranean coasts, the helicopter opens a world of expedition possibilities.' },
  ];

  const images = [
    '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    '/assets/images/facility/hq-0035.jpg',
    '/assets/images/expeditions/channel.jpg',
    '/assets/images/facility/hq-0089.jpg',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/expeditions/antartica.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/facility/hq-0053.jpg',
    '/assets/images/facility/hq-0167.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => setSlide(prev => (prev + 1) % benefits.length), 4000);
    return () => clearInterval(timer);
  }, [benefits.length]);

  return (
    <div style={{ padding: '3rem 2rem', background: '#e8e4df' }}>
      <style>{`
        .abt-v8__layout { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 2rem; align-items: stretch; text-align: left; max-width: 1100px; margin: 0 auto; }
        .abt-v8__layout::before { content: ''; grid-column: 2; grid-row: 1; background: linear-gradient(to bottom, transparent, #d6d2cc, transparent); }
        .abt-v8__left { display: flex; flex-direction: column; justify-content: center; }
        .abt-v8__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #a09080; display: block; margin-bottom: 1.5rem; }
        .abt-v8__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 2rem; color: #2a2218; }
        .abt-v8__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; line-height: 1.8; color: #6b5e50; margin: 0 0 1.25rem; }
        .abt-v8__tagline { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: #a09080; display: block; margin: 0.5rem 0 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.08); }
        .abt-v8__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #f0ece6; background: #2a2218; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: background 0.3s; }
        .abt-v8__cta:hover { background: #3d3225; color: #f0ece6; }
        .abt-v8__right { display: flex; flex-direction: column; }
        .abt-v8__card { flex: 1; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; overflow: hidden; background: #e8e4df; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .abt-v8__img { height: 210px; position: relative; overflow: hidden; }
        .abt-v8__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
        .abt-v8__slide.active { opacity: 1; }
        .abt-v8__body { flex: 1; padding: 1.25rem; position: relative; display: grid; }
        .abt-v8__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(30,26,20,0.65) 0%, rgba(30,26,20,0.62) 75%, rgba(30,26,20,0.3) 90%, rgba(30,26,20,0) 100%); pointer-events: none; z-index: 0; }
        .abt-v8__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
        .abt-v8__item.active { opacity: 1; }
        .abt-v8__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .abt-v8__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #e0e0e0; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .abt-v8__body p { font-size: 0.8rem; line-height: 1.6; font-family: 'Space Grotesk', sans-serif; color: rgba(255,255,255,0.7); }
        .abt-v8__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 2px solid rgba(0,0,0,0.1); }
        .abt-v8__dots { display: flex; gap: 4px; }
        .abt-v8__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
        .abt-v8__dot.active { background: #1a1a1a; }
        .abt-v8__arrows { display: flex; gap: 0.25rem; }
        .abt-v8__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
        .abt-v8__arrows button:hover { border-color: #1a1a1a; }
        @media (max-width: 768px) {
          .abt-v8__layout { grid-template-columns: 1fr; gap: 2rem; }
          .abt-v8__layout::before { display: none; }
        }
      `}</style>
      <div className="abt-v8__layout">
        <div className="abt-v8__left">
          <span className="abt-v8__pre">About HQ Aviation</span>
          <h2 className="abt-v8__headline">Where Passion<br/>Meets Precision</h2>
          <p className="abt-v8__text">Founded in 2010 by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown into the UK's leading Robinson helicopter specialists. What started as one pilot's vision is now home to a community of pilots, engineers, and adventurers who share one thing — a love of flying.</p>
          <p className="abt-v8__text">For over three decades, we've trained hundreds of pilots, sold and maintained Robinson helicopters across the fleet — R22, R44, and R66 — and led expeditions to some of the most remote places on earth.</p>
          <span className="abt-v8__tagline">Training · Sales · Maintenance · Expeditions</span>
          <Link to="/about-us" className="abt-v8__cta">Learn More <span>→</span></Link>
        </div>
        <div className="abt-v8__right">
          <div className="abt-v8__card">
            <div className="abt-v8__img">
              {images.map((s, i) => (
                <div key={i} className={`abt-v8__slide ${i === slide ? 'active' : ''}`} style={{ backgroundImage: `url(${s})` }} />
              ))}
            </div>
            <div className="abt-v8__body">
              {benefits.map((b, i) => (
                <div key={i} className={`abt-v8__item ${i === slide ? 'active' : ''}`}>
                  <h3 className="abt-v8__verb">{b.verb}</h3>
                  <h4 className="abt-v8__noun">{b.noun}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="abt-v8__footer">
              <div className="abt-v8__dots">
                {benefits.map((_, i) => (
                  <div key={i} className={`abt-v8__dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
                ))}
              </div>
              <div className="abt-v8__arrows">
                <button onClick={() => setSlide(prev => prev === 0 ? benefits.length - 1 : prev - 1)} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button onClick={() => setSlide(prev => prev === benefits.length - 1 ? 0 : prev + 1)} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * HighlightReel — Expedition highlight video with play button overlay
 * Moved from FinalExpeditions.jsx for safekeeping
 */
function HighlightReel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const highlightVideoId = 'gREwO1BDxXA';

  return (
    <section style={{ padding: '5rem 2rem 0', background: '#faf9f6', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .hl-highlight::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 200px; height: 1px; background: linear-gradient(90deg, transparent, #999, transparent); }
        .hl-highlight__placeholder { position: relative; aspect-ratio: 16/9; background: #1a1a1a; overflow: hidden; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .hl-highlight__placeholder img { width: 100%; height: 100%; object-fit: cover; }
        .hl-highlight__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        .hl-highlight__play-btn { width: 90px; height: 90px; border: 2px solid #fff; border-radius: 50%; background: transparent; cursor: pointer; position: relative; transition: all 0.2s ease; }
        .hl-highlight__play-btn span { position: absolute; top: 50%; left: 55%; transform: translate(-50%, -50%); width: 0; height: 0; border-left: 20px solid #fff; border-top: 12px solid transparent; border-bottom: 12px solid transparent; }
        .hl-highlight__play-btn:hover { background: rgba(255,255,255,0.15); transform: scale(1.08); }
        .hl-highlight__label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; color: #fff; font-weight: 500; }
        .hl-highlight__iframe-wrap { position: relative; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; }
        .hl-highlight__iframe-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
      `}</style>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#999' }}>Experience The Adventure</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', margin: '0.5rem 0 0' }}>
            <span style={{ color: '#1a1a1a' }}>Expedition </span>
            <span style={{ color: '#999' }}>Highlights</span>
          </h2>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          {!isPlaying ? (
            <div className="hl-highlight__placeholder">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition Highlights" />
              <div className="hl-highlight__overlay">
                <button className="hl-highlight__play-btn" onClick={() => setIsPlaying(true)}><span></span></button>
                <span className="hl-highlight__label">Watch Highlight Reel</span>
              </div>
            </div>
          ) : (
            <div className="hl-highlight__iframe-wrap">
              <iframe src={`https://www.youtube.com/embed/${highlightVideoId}?autoplay=1&rel=0`} title="Expedition Highlights" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * RatesPricing — Tabbed pricing section with collapsible drawer
 * Moved from Experimentation.jsx for safekeeping
 */
function RatesPricing() {
  const [pricingTab, setPricingTab] = useState('training');
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <div>
      <style>{`
        .fd-pricing { background: #faf9f6; padding: 3rem 0; }
        .fd-pricing__header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 1rem 0; }
        .fd-pricing__header .fd-pricing__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 0.5rem; }
        .fd-pricing__header .fd-pricing__title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: #1a1a1a; margin: 0; }
        .fd-pricing__toggle { background: none; border: 1px solid #e8e6e2; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.3s; }
        .fd-pricing__toggle:hover { border-color: #1a1a1a; }
        .fd-pricing__toggle-icon { font-size: 1.4rem; line-height: 1; color: #1a1a1a; display: block; transition: transform 0.4s ease; }
        .fd-pricing__toggle-icon--open { transform: rotate(45deg); }
        .fd-pricing__collapsible { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
        .fd-pricing--open .fd-pricing__collapsible { max-height: 3000px; transition: max-height 0.7s ease; }
        .fd-pricing--open { padding: 3rem 0 6rem; }
        .fd-pricing__inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .fd-pricing__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #777; line-height: 1.7; margin-bottom: 2rem; }
        .fd-pricing__tabs { display: flex; gap: 0; margin-bottom: 2.5rem; border-bottom: 1px solid #e8e6e2; }
        .fd-pricing__tab { all: unset; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.75rem 1.5rem; border-bottom: 2px solid transparent; color: #999; transition: all 0.2s; }
        .fd-pricing__tab:hover { color: #555; }
        .fd-pricing__tab--active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
        .fd-pricing__table-wrap { margin-bottom: 2rem; }
        .fd-pricing__table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .fd-pricing__table th { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid #e8e6e2; }
        .fd-pricing__table td { padding: 1rem; border-bottom: 1px solid #f0eee9; font-size: 0.85rem; color: #333; vertical-align: top; }
        .fd-pricing__table td strong { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        .fd-pricing__table td span { display: block; font-size: 0.75rem; color: #777; margin-top: 0.25rem; }
        .fd-pricing__price { font-family: 'Space Grotesk', sans-serif; font-weight: 700; white-space: nowrap; }
        .fd-pricing__table-highlight { background: #f2efea; }
        .fd-pricing__note { background: #fff; border: 1px solid #e8e6e2; padding: 1.25rem 1.5rem; font-size: 0.8rem; color: #555; line-height: 1.6; margin-bottom: 0.75rem; }
        .fd-pricing__note strong { font-family: 'Space Grotesk', sans-serif; color: #1a1a1a; }
        .fd-pricing__valet-intro { font-size: 0.9rem; color: #555; line-height: 1.7; margin-bottom: 2rem; }
        .fd-pricing__table--valet td, .fd-pricing__table--valet th { text-align: center; }
        .fd-pricing__table--valet td:first-child, .fd-pricing__table--valet th:first-child { text-align: left; }
        .fd-pricing__valet-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 1.5rem; }
        .fd-pricing__valet-tier { background: #fff; border: 1px solid #e8e6e2; padding: 1.5rem; }
        .fd-pricing__valet-tier h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.75rem; }
        .fd-pricing__valet-tier ul { list-style: none; padding: 0; margin: 0; }
        .fd-pricing__valet-tier li { font-size: 0.75rem; color: #555; padding: 0.35rem 0; border-bottom: 1px solid #f5f3f0; }
        .fd-pricing__valet-tier li:last-child { border-bottom: none; }
        .fd-pricing__hangarage-includes { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; margin-bottom: 0.75rem; }
        .fd-pricing__hangarage-includes h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1.25rem; }
        .fd-pricing__hangarage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .fd-pricing__hangarage-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #444; }
        .fd-pricing__hangarage-item i { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #e8e6e2; color: #999; font-size: 0.8rem; flex-shrink: 0; }
        @media (max-width: 768px) {
          .fd-pricing__valet-tiers { grid-template-columns: 1fr; }
          .fd-pricing__table { font-size: 0.75rem; }
          .fd-pricing__hangarage-grid { grid-template-columns: repeat(2, 1fr); }
          .fd-pricing__tabs { flex-wrap: wrap; }
          .fd-pricing__table-wrap { overflow-x: auto; }
        }
      `}</style>
      <section className={`fd-pricing ${pricingOpen ? 'fd-pricing--open' : ''}`} id="pricing">
        <div className="fd-pricing__inner">
          <div className="fd-pricing__header" onClick={() => setPricingOpen(!pricingOpen)}>
            <div>
              <span className="fd-pricing__pre">Transparent Pricing</span>
              <h2 className="fd-pricing__title">Rates &amp; Pricing</h2>
            </div>
            <button className="fd-pricing__toggle" aria-label={pricingOpen ? 'Collapse' : 'Expand'}>
              <span className={`fd-pricing__toggle-icon ${pricingOpen ? 'fd-pricing__toggle-icon--open' : ''}`}>+</span>
            </button>
          </div>
          <div className="fd-pricing__collapsible">
            <p className="fd-pricing__desc">
              We believe in transparent pricing. No hidden fees, no surprise charges. Here's what everything costs.
            </p>

            <div className="fd-pricing__tabs">
              {[
                { id: 'training', label: 'Training' },
                { id: 'hire', label: 'Self-Fly Hire' },
                { id: 'hangarage', label: 'Hangarage' },
                { id: 'valet', label: 'Valet Services' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`fd-pricing__tab ${pricingTab === tab.id ? 'fd-pricing__tab--active' : ''}`}
                  onClick={() => setPricingTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {pricingTab === 'training' && (
              <div className="fd-pricing__table-wrap">
                <table className="fd-pricing__table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Discovery Flight Day</strong><br /><span>Two hours of flying, briefings, logbook entry</span></td>
                      <td>1 Day</td>
                      <td className="fd-pricing__price">From £299</td>
                    </tr>
                    <tr>
                      <td><strong>Private Pilot Licence — PPL(H)</strong><br /><span>Min 45 hours flight training, ground school, exams</span></td>
                      <td>6-12 Months</td>
                      <td className="fd-pricing__price">From £15,000</td>
                    </tr>
                    <tr>
                      <td><strong>Commercial Pilot Licence — CPL(H)</strong><br /><span>155 hours total, 50 hours PIC, skill test</span></td>
                      <td>Varies</td>
                      <td className="fd-pricing__price">POA</td>
                    </tr>
                    <tr>
                      <td><strong>Type Rating</strong><br /><span>Ground course + min 5 hours flight training</span></td>
                      <td>1-2 Weeks</td>
                      <td className="fd-pricing__price">POA</td>
                    </tr>
                    <tr>
                      <td><strong>Night Rating</strong><br /><span>100 hours + 60 hours PIC required</span></td>
                      <td>Varies</td>
                      <td className="fd-pricing__price">POA</td>
                    </tr>
                    <tr className="fd-pricing__table-highlight">
                      <td><strong>5-Day Ground School</strong><br /><span>All 9 PPL theory exams, guaranteed pass, small groups</span></td>
                      <td>5 Days</td>
                      <td className="fd-pricing__price">£1,500 + VAT</td>
                    </tr>
                  </tbody>
                </table>
                <div className="fd-pricing__note">
                  <strong>Mission Rate Flying:</strong> Supporting such a large fleet with client helicopters around the UK can mean our
                  engineers need to be moved, helicopters must go to get custom avionics, etc. This allows you access to flying
                  at mission rate prices for these trips — a significant saving over standard rates.
                </div>
                <div className="fd-pricing__note">
                  <strong>Happy Hour Flying:</strong> Ask about our off-peak rates for flexible pilots who can fly at shorter notice.
                </div>
              </div>
            )}

            {pricingTab === 'hire' && (
              <div className="fd-pricing__table-wrap">
                <table className="fd-pricing__table">
                  <thead>
                    <tr>
                      <th>Aircraft</th>
                      <th>Seats</th>
                      <th>Hourly Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Robinson R22</strong><br /><span>Hour building, local flights, training continuation</span></td>
                      <td>2</td>
                      <td className="fd-pricing__price">From £275/hr</td>
                    </tr>
                    <tr>
                      <td><strong>Robinson R44 Raven II</strong><br /><span>Touring, weekends away, business flights</span></td>
                      <td>4</td>
                      <td className="fd-pricing__price">From £395/hr</td>
                    </tr>
                    <tr>
                      <td><strong>Robinson R66 Turbine</strong><br /><span>Long-range touring, G500H TXi, HeliSAS autopilot, aux tank</span></td>
                      <td>5</td>
                      <td className="fd-pricing__price">From £595/hr</td>
                    </tr>
                  </tbody>
                </table>
                <div className="fd-pricing__note">
                  We only charge for actual flying time. No membership fees, no bulk payments up front. Discounts available
                  when hours are purchased in larger quantities. 28-day recency check required for safety.
                </div>
              </div>
            )}

            {pricingTab === 'hangarage' && (
              <div className="fd-pricing__table-wrap">
                <p className="fd-pricing__valet-intro">
                  Secure, heated hangarage at Denham Aerodrome — just 30 minutes from central London. Our facility
                  offers 24/7 access, dedicated ground crew, CCTV surveillance, and organised landing slots. Whether
                  you're parking overnight or need a permanent home for your aircraft, we have options to suit.
                </p>
                <table className="fd-pricing__table">
                  <thead>
                    <tr>
                      <th>Aircraft Type</th>
                      <th>Short Stay (1 Day)</th>
                      <th>Weekly (7 Days+)</th>
                      <th>Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>R22 / Cabri G2</strong><br /><span>Light single — compact footprint</span></td>
                      <td className="fd-pricing__price">£75/day</td>
                      <td className="fd-pricing__price">£350/week</td>
                      <td className="fd-pricing__price">£950/month</td>
                    </tr>
                    <tr>
                      <td><strong>R44 / R66</strong><br /><span>Medium single — standard bay</span></td>
                      <td className="fd-pricing__price">£120/day</td>
                      <td className="fd-pricing__price">£550/week</td>
                      <td className="fd-pricing__price">£1,500/month</td>
                    </tr>
                    <tr>
                      <td><strong>AS350 / Bell 206 / 505</strong><br /><span>Light single turbine — larger footprint</span></td>
                      <td className="fd-pricing__price">£160/day</td>
                      <td className="fd-pricing__price">£750/week</td>
                      <td className="fd-pricing__price">£2,200/month</td>
                    </tr>
                    <tr>
                      <td><strong>AW109 / AW169 / EC135</strong><br /><span>Medium twin — wide bay required</span></td>
                      <td className="fd-pricing__price">£250/day</td>
                      <td className="fd-pricing__price">£1,200/week</td>
                      <td className="fd-pricing__price">£3,500/month</td>
                    </tr>
                  </tbody>
                </table>
                <div className="fd-pricing__hangarage-includes">
                  <h4>All Hangarage Includes</h4>
                  <div className="fd-pricing__hangarage-grid">
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-warehouse"></i>
                      <span>Heated, secure hangar</span>
                    </div>
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-video"></i>
                      <span>24/7 CCTV surveillance</span>
                    </div>
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-users"></i>
                      <span>Dedicated ground crew</span>
                    </div>
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-plane-arrival"></i>
                      <span>Organised landing slots</span>
                    </div>
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-key"></i>
                      <span>24/7 owner access</span>
                    </div>
                    <div className="fd-pricing__hangarage-item">
                      <i className="fas fa-plug"></i>
                      <span>GPU &amp; ground power</span>
                    </div>
                  </div>
                </div>
                <div className="fd-pricing__note">
                  <strong>Long-term contracts:</strong> Discounted rates available for 6-month and 12-month commitments.
                  Leaseback programme members receive preferential hangarage rates. Contact us for a bespoke quote.
                </div>
                <div className="fd-pricing__note">
                  <strong>Visiting aircraft:</strong> Short stay parking on the apron is available for day visitors at reduced rates.
                  Pre-book your slot with our operations team to guarantee availability.
                </div>
              </div>
            )}

            {pricingTab === 'valet' && (
              <div className="fd-pricing__table-wrap">
                <p className="fd-pricing__valet-intro">
                  We provide exterior &amp; interior aircraft cleaning and polishing from our conveniently located
                  hangar at Elstree Aerodrome. Our expert team use the best products and tools to clean &amp; polish
                  your aircraft with the utmost care.
                </p>
                <table className="fd-pricing__table fd-pricing__table--valet">
                  <thead>
                    <tr>
                      <th>Aircraft Type</th>
                      <th>Mini Valet</th>
                      <th>Full Valet</th>
                      <th>Deluxe Valet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>R22 / R44</strong></td>
                      <td>£160</td>
                      <td>£220</td>
                      <td>£360</td>
                    </tr>
                    <tr>
                      <td><strong>R66 / B505 / 206 / 120</strong></td>
                      <td>£180</td>
                      <td>£300</td>
                      <td>£450</td>
                    </tr>
                    <tr>
                      <td><strong>AS350 / 55 / 109 / 119</strong></td>
                      <td>£260</td>
                      <td>£400</td>
                      <td>£600</td>
                    </tr>
                    <tr>
                      <td><strong>A139 / 169 / 902 or similar</strong></td>
                      <td>£390</td>
                      <td>£600</td>
                      <td>£900</td>
                    </tr>
                  </tbody>
                </table>
                <div className="fd-pricing__valet-tiers">
                  <div className="fd-pricing__valet-tier">
                    <h4>Mini Valet</h4>
                    <ul>
                      <li>Exterior Wash</li>
                      <li>Interior Vacuum</li>
                      <li>Window Clean</li>
                      <li>Soot Removal</li>
                    </ul>
                  </div>
                  <div className="fd-pricing__valet-tier">
                    <h4>Full Valet</h4>
                    <ul>
                      <li>Everything in Mini</li>
                      <li>Interior Detailing</li>
                      <li>Leather &amp; Upholstery Clean</li>
                      <li>Window Polish</li>
                    </ul>
                  </div>
                  <div className="fd-pricing__valet-tier">
                    <h4>Deluxe Valet</h4>
                    <ul>
                      <li>Everything in Full</li>
                      <li>Exterior Hand Polish</li>
                      <li>Headsets Cleaned</li>
                      <li>Interior Sanitise</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const ComponentShowcase = () => {
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>HQ Aviation</h1>
        <p style={{ opacity: 0.7 }}>Approved Components Showcase</p>
        <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.5 }}>
          Each component includes feedback notes from approved-components.json
        </p>
      </header>

      {/* Trust & Credibility */}
      <SectionTitle>Trust & Credibility</SectionTitle>
      <TestimonialSlider />
      <AsSeenIn />
      <StatsCounter />
      <PartnerLogos />
      <SocialProofWall />

      {/* Content Sections */}
      <SectionTitle>Content Sections</SectionTitle>
      <AboutV8 />
      <LifestyleImagery />
      <WhyChooseUs />
      <FounderStory />
      <BeforeAfterStory />
      <TeamPreview />
      <ProcessSteps />
      <TopGearMoment />
      <ScrollingStrips sticky={false} />

      {/* Fleet & Aircraft */}
      <SectionTitle>Fleet & Aircraft</SectionTitle>
      <ModelSpotlight />
      <FleetShowcaseCarousel />
      <InteractiveFleetExplorer />
      <R88Announcement />

      {/* Conversion */}
      <SectionTitle>Conversion Components</SectionTitle>
      <LimitedSlotsCounter />
      <PriceLockBanner />
      <CTASplit />

      {/* Training */}
      <SectionTitle>Training</SectionTitle>
      <TrainingSummary />
      <GroundSchoolPreview />
      <PilotHourBreakdown />
      <CostTransparency />
      <TypeRatingCards />

      {/* Services */}
      <SectionTitle>Services</SectionTitle>
      <RatesPricing />
      <HangarageFeatures />
      <FacilityGallery />
      <FacilityServicesCarousel />
      <FacilityServicesDetail />
      <AircraftManagement />
      <FerryFlightServices />
      <SelfFlyHireRates />
      <DestinationPartners />
      <AdditionalServices />
      <AircraftLeasebackRevenue />
      <RegulatoryCompliance />

      {/* Expeditions */}
      <SectionTitle>Expeditions & Achievements</SectionTitle>
      <WorldRecordTimeline />
      <PolarAchievement />
      <MountainFlyingHazards />
      <ExpeditionPassportStamps />
      <ExpeditionDepartureBoard />
      <ExpeditionVideoSlider title="Expedition Footage" />
      <HighlightReel />
      <ExpeditionSplitFlap />
      <ExpeditionBarcode />
      <ExpeditionStackedLayers />
      <ExpeditionDestinations />

      {/* Lifestyle */}
      <SectionTitle>Lifestyle</SectionTitle>
      <OwnershipBenefits />
      <WhyFlyHelicopterMini />
      <WhyFlyHelicopterCard />
      <WhyFlyHelicopterCompact />

      {/* Information */}
      <SectionTitle>Information</SectionTitle>
      <RecentNews />
      <UpcomingEvents />
      <LocationHighlight />
      <FAQAccordion />
      <HelicopterVsFixedWing />

      {/* Adventure & Expedition Components */}
      <SectionTitle>Adventure Components</SectionTitle>
      <TopographicBackground />
      <CompassNavigation />
      <PolaroidPhotoTrail />
      <TripRegistrationCard />
      <PassportStamps />
      <CountdownBlocks />
      <AviationDividers />

      {/* Backgrounds & Decorative */}
      <SectionTitle>Backgrounds & Decorative</SectionTitle>
      <FloatingStars />
      <ParallaxCloudLayers />
      <CoordinateGridOverlay />

      {/* Animations */}
      <SectionTitle>Animations</SectionTitle>
      <TypewriterEffect />
      <StaggeredReveal />

      {/* Sales / Rebuilds */}
      <SectionTitle>Sales / Rebuilds</SectionTitle>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <BeforeAfter />
      </div>

      {/* Footer */}
      <SectionTitle>Footer</SectionTitle>
      <MegaFooter />
      <CompassRoseFooter />
    </div>
  );
};

export default ComponentShowcase;
