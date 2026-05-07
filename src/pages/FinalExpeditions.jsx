/**
 * FINAL EXPEDITIONS PAGE
 *
 * A comprehensive expeditions showcase combining:
 * - Hero-focused design (FinalPPL style) with "Expedition Passport"
 * - Animated journey lines (world map concept)
 * - Regional parallax showcases
 * - Captain Q expedition leader section
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

// Import Expedition components
import ExpeditionBarcode from '../components/Expeditions/ExpeditionBarcode';
import ExpeditionVideoSlider from '../components/Expeditions/ExpeditionVideoSlider';
import HqMenuPanel from '../components/HqMenuPanel';

// CMS hook
import { usePageText } from '../hooks/usePageText';
import { useFaqs } from '../hooks/useFaqs';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import Seo from '../components/seo/Seo';
import { buildService, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL, AREA_SERVED } from '../lib/seoDefaults';

/**
 * EXPEDITIONS PAGE HEADER COMPONENT
 * Same spotlight animation as FinalPPL
 */
function ExpeditionsHeader() {
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

// Parallax Section Component
function ParallaxSection({ image, alt, children, className = '' }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section className={`fexp-parallax ${className}`} ref={sectionRef}>
      <div className="fexp-parallax__image-container">
        <motion.img
          src={image}
          alt={alt}
          className="fexp-parallax__image"
          style={{ y }}
        />
      </div>
      <div className="fexp-parallax__overlay"></div>
      <div className="fexp-parallax__content">
        {children}
      </div>
    </section>
  );
}

// Expedition destinations data
const destinations = {
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

// Upcoming expeditions data
const upcomingExpeditions = [
  {
    title: 'Greenland Explorer',
    date: 'August 2025',
    image: '/assets/images/expeditions/antartica.jpg',
    description: '10-day expedition to Greenland\'s remote fjords and ice caps. A once-in-a-lifetime polar adventure.',
    badge: 'New',
    link: '/expeditions/greenland-2025'
  },
  {
    title: 'Iceland: Northern Lights',
    date: 'March 2026',
    image: '/assets/images/expeditions/channel.jpg',
    description: '7-day expedition chasing the aurora borealis across Iceland\'s volcanic landscape.',
    badge: 'Spaces Available',
    link: '/expeditions/calendar/iceland-march-2026'
  },
  {
    title: 'Scottish Highlands Tour',
    date: 'June 2026',
    image: '/assets/images/expeditions/channel.jpg',
    description: '5-day journey through the Highlands, staying at exclusive lodges and castles.',
    badge: 'Filling Fast',
    link: '/expeditions/calendar/scotland-june-2026'
  },
];

// FAQ data is now managed via Firestore — see useFaqs('expeditions')

// ==================== NEW DATA FOR 20 ADDITIONAL COMPONENTS ====================

// 1. Stats data for StatsCounter component
const expeditionStats = [
  { value: '15', suffix: '+', label: 'Years Experience', icon: 'fa-calendar' },
  { value: '7', suffix: '', label: 'Continents Explored', icon: 'fa-globe' },
  { value: '18000', suffix: '+', label: 'Flight Hours', icon: 'fa-clock' },
  { value: '150', suffix: '+', label: 'Expeditions Completed', icon: 'fa-route' },
  { value: '3', suffix: '', label: 'World Records', icon: 'fa-trophy' },
];

// 2. Testimonials data
const testimonials = [
  {
    quote: "Flying to the South Pole with Captain Q was the most extraordinary adventure of my life. His expertise and calm demeanor made me feel completely safe in the most remote place on Earth.",
    author: "James Thornton",
    title: "CEO, Thornton Capital",
    expedition: "South Pole 2023",
    image: "/assets/images/testimonials/testimonial-1.jpg",
  },
  {
    quote: "The attention to detail on our Iceland expedition was remarkable. From the helicopter handling to the luxury lodges, everything was perfect. An unforgettable experience.",
    author: "Sarah Mitchell",
    title: "Adventure Photographer",
    expedition: "Iceland Northern Lights 2024",
    image: "/assets/images/testimonials/testimonial-2.jpg",
  },
  {
    quote: "I've traveled the world, but nothing compares to seeing Greenland's ice caps from the air. HQ Aviation creates moments that stay with you forever.",
    author: "Michael Chen",
    title: "Tech Entrepreneur",
    expedition: "Greenland Explorer 2024",
    image: "/assets/images/testimonials/testimonial-3.jpg",
  },
];

// 4. Sample itinerary data
const sampleItinerary = [
  { day: 1, title: 'Arrival & Briefing', location: 'Denham Aerodrome', desc: 'Meet the team, helicopter briefing, and dinner at a local gastropub.' },
  { day: 2, title: 'Departure Flight', location: 'Channel Crossing', desc: 'Early morning departure, crossing the English Channel with stunning coastal views.' },
  { day: 3, title: 'Mountain Approach', location: 'Alpine Valleys', desc: 'Navigate through breathtaking mountain passes, landing at a remote chalet.' },
  { day: 4, title: 'Summit Day', location: 'Peak Landing', desc: 'Weather permitting, land near glacier formations for photography.' },
  { day: 5, title: 'Return Journey', location: 'Multiple Stops', desc: 'Scenic route back with stops at historic sites and local villages.' },
];

// 5. Safety features data
const safetyFeatures = [
  { icon: 'fa-shield-alt', title: 'Certified Aircraft', desc: 'All helicopters maintained to the highest CAA standards with regular inspections.' },
  { icon: 'fa-user-shield', title: 'Expert Pilots', desc: '18,000+ hours experience with specialized polar and mountain training.' },
  { icon: 'fa-satellite', title: 'Satellite Tracking', desc: 'Real-time GPS tracking and satellite communication on all flights.' },
  { icon: 'fa-first-aid', title: 'Emergency Ready', desc: 'Full survival equipment and medical supplies on every expedition.' },
  { icon: 'fa-cloud-sun', title: 'Weather Monitoring', desc: 'Advanced meteorological analysis for optimal flight conditions.' },
  { icon: 'fa-handshake', title: 'Insured & Licensed', desc: 'Comprehensive insurance coverage for all participants and destinations.' },
];

// 6. Fleet data for HelicopterFleet component
const helicopterFleet = [
  { model: 'Robinson R66', image: '/assets/images/aircraft/r66-expedition.jpg', capacity: '4 passengers', range: '350 nm', features: ['Turbine Engine', 'Climate Control', 'Panoramic Windows'] },
  { model: 'Robinson R44', image: '/assets/images/aircraft/r44-expedition.jpg', capacity: '3 passengers', range: '300 nm', features: ['Proven Reliability', 'Excellent Visibility', 'Compact Design'] },
];

// 7. Packing list data
const packingList = {
  essential: ['Passport & Travel Documents', 'Warm Layered Clothing', 'Waterproof Outer Layer', 'Comfortable Walking Boots', 'Sunglasses (UV Protection)', 'Personal Medications'],
  recommended: ['Camera Equipment', 'Binoculars', 'Personal Snacks', 'Travel Pillow', 'Entertainment for Ground Days', 'Portable Battery Pack'],
  provided: ['Survival Suits', 'Immersion Equipment', 'Communication Devices', 'First Aid Kit', 'Emergency Rations', 'Safety Briefing Materials'],
};

// 8. Seasonal calendar data
const seasonalCalendar = [
  { region: 'Arctic', best: 'May - Aug', avoid: 'Nov - Feb', temp: '-5°C to 15°C', highlight: 'Midnight Sun' },
  { region: 'Antarctica', best: 'Nov - Feb', avoid: 'May - Aug', temp: '-10°C to 5°C', highlight: 'Penguin Colonies' },
  { region: 'Iceland', best: 'Sep - Mar', avoid: 'Jun - Aug', temp: '-5°C to 10°C', highlight: 'Northern Lights' },
  { region: 'Alps', best: 'Jun - Sep', avoid: 'Dec - Feb', temp: '5°C to 20°C', highlight: 'Clear Mountain Views' },
  { region: 'Caribbean', best: 'Dec - Apr', avoid: 'Aug - Oct', temp: '25°C to 32°C', highlight: 'Perfect Weather' },
];

// 9. Pricing tiers data
const pricingTiers = [
  { name: 'Explorer', price: '8,500', duration: '4-5 days', features: ['European Destinations', 'Shared Expedition (4 pax)', 'Luxury Lodge Accommodation', 'Professional Photography'], badge: 'Most Popular' },
  { name: 'Pioneer', price: '15,000', duration: '7-10 days', features: ['Extended European Routes', 'Semi-Private (2 pax)', 'Premium Accommodation', 'Personal Photographer', 'Gourmet Dining Package'], badge: null },
  { name: 'Legend', price: '45,000', duration: '14-21 days', features: ['Polar Expeditions', 'Private Charter', 'World-Class Lodges', 'Dedicated Support Team', 'Custom Itinerary', 'Documentary Crew'], badge: 'Ultimate' },
];

// 10. Awards data
const awards = [
  { year: '2023', title: 'Best Adventure Experience', org: 'Luxury Travel Awards' },
  { year: '2022', title: 'Excellence in Aviation', org: 'HAI Salute to Excellence' },
  { year: '2021', title: 'World Record', org: 'Guinness World Records', detail: 'Solo South Pole Flight' },
  { year: '2019', title: 'Aerobatics Champion', org: 'World Helicopter Championship' },
];

// 11. Media mentions data
const mediaMentions = [
  { outlet: 'The Times', quote: 'Captain Q is the undisputed master of helicopter expeditions.', logo: '/assets/images/media/times-logo.svg' },
  { outlet: 'Telegraph', quote: 'An experience that redefines adventure travel.', logo: '/assets/images/media/telegraph-logo.svg' },
  { outlet: 'Forbes', quote: 'The ultimate way to explore our planet.', logo: '/assets/images/media/forbes-logo.svg' },
  { outlet: 'Robb Report', quote: 'Luxury meets adventure at 10,000 feet.', logo: '/assets/images/media/robb-report-logo.svg' },
];

// 12. Comparison data
const expeditionComparison = [
  { feature: 'Duration', european: '4-7 Days', polar: '14-21 Days', tropical: '5-10 Days' },
  { feature: 'Group Size', european: '2-4 Passengers', polar: '2 Passengers', tropical: '2-4 Passengers' },
  { feature: 'Accommodation', european: 'Luxury Lodges', polar: 'Expedition Camps', tropical: 'Beach Resorts' },
  { feature: 'Flight Hours', european: '8-15 Hours', polar: '40-60 Hours', tropical: '10-20 Hours' },
  { feature: 'Physical Level', european: 'Moderate', polar: 'Challenging', tropical: 'Easy' },
  { feature: 'Starting Price', european: '£8,500', polar: '£45,000', tropical: '£12,000' },
];

// 13. Booking steps data
const bookingSteps = [
  { step: 1, title: 'Enquire', desc: 'Contact us with your dream destination and preferred dates.', icon: 'fa-envelope' },
  { step: 2, title: 'Consult', desc: 'Speak with our expedition team to customize your journey.', icon: 'fa-comments' },
  { step: 3, title: 'Plan', desc: 'Receive your detailed itinerary and expedition briefing.', icon: 'fa-map' },
  { step: 4, title: 'Prepare', desc: 'We provide packing lists, briefing materials, and logistics.', icon: 'fa-suitcase' },
  { step: 5, title: 'Depart', desc: 'Meet at Denham and begin your adventure of a lifetime.', icon: 'fa-helicopter' },
];

// 14. Timeline data for Captain Q's expedition history
const expeditionTimeline = [
  { year: '2010', title: 'HQ Aviation Founded', desc: 'Established at Denham Aerodrome, UK' },
  { year: '2004', title: 'First Polar Expedition', desc: 'Arctic Circle crossing in Robinson R44' },
  { year: '2013', title: 'Antarctic Achievement', desc: 'First solo helicopter flight to South Pole' },
  { year: '2016', title: 'World Circumnavigation', desc: 'First helicopter round-the-world via both poles' },
  { year: '2019', title: 'Aerobatics Champion', desc: 'Two-time World Helicopter Aerobatics winner' },
  { year: '2024', title: 'Expedition Program Launch', desc: 'Opening expeditions to private clients' },
];

// 15. Partner logos data
const partners = [
  { name: 'Robinson Helicopters', logo: '/assets/images/partners/robinson-logo.svg', type: 'Aircraft Partner' },
  { name: 'Antarctic Logistics', logo: '/assets/images/partners/ale-logo.svg', type: 'Logistics Partner' },
  { name: 'Luxury Lodges', logo: '/assets/images/partners/lodges-logo.svg', type: 'Accommodation Partner' },
  { name: 'Garmin Aviation', logo: '/assets/images/partners/garmin-logo.svg', type: 'Technology Partner' },
];

// 16. Featured quote
const featuredQuote = {
  text: "The moment you lift off and leave the ground behind, you enter a world that few will ever know. Flying to the ends of the Earth isn't just about the destination. It's about the profound shift in perspective that changes how you see everything.",
  author: "Captain Quentin Smith",
  context: "On why he leads expeditions",
};

// 17. Video showcase data
const featuredVideo = {
  thumbnail: '/assets/images/expeditions/video-thumbnail.jpg',
  videoUrl: 'https://www.youtube.com/embed/example',
  title: 'Expedition to the South Pole',
  duration: '12:34',
  description: 'Follow Captain Q on his record-breaking solo flight to the South Pole and back.',
};

// 18. Split content sections
const splitSections = [
  {
    image: '/assets/images/expeditions/split-adventure.jpg',
    title: 'Adventure Awaits',
    subtitle: 'Beyond the Horizon',
    text: 'Every expedition begins with a simple question: where have you always dreamed of going? From the aurora-lit skies of Iceland to the pristine ice of Antarctica, we transform dreams into reality.',
    align: 'left',
  },
  {
    image: '/assets/images/expeditions/split-expertise.jpg',
    title: 'Unmatched Expertise',
    subtitle: 'Decades of Experience',
    text: 'With over 18,000 flight hours and three world records, Captain Q brings unparalleled skill to every journey. His calm confidence has guided clients through some of the most challenging flying conditions on Earth.',
    align: 'right',
  },
];

// ==================== NEW COMPONENT FUNCTIONS ====================

// 1. Stats Counter Section
function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="fexp-stats">
      <div className="fexp-stats__container">
        {expeditionStats.map((stat, i) => (
          <motion.div
            key={i}
            className="fexp-stats__item"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <i className={`fas ${stat.icon}`}></i>
            <span className="fexp-stats__value">
              {isInView && <AnimatedNumber value={stat.value} suffix={stat.suffix} />}
            </span>
            <span className="fexp-stats__label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// 2. Highlight Reel Video
function HighlightReel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const linesRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, amount: 0.3 });
  const linesInView = useInView(linesRef, { once: true, amount: 0.5, margin: "0px 0px -200px 0px" });
  const pageImages = usePageImages('expeditions');

  // YouTube video ID for the highlight reel compilation
  const highlightVideoId = 'gREwO1BDxXA'; // "Fly" video - replace with actual highlight reel

  return (
    <section className="fexp-highlight" ref={videoRef}>
      <div ref={linesRef} className={`fexp-highlight__lines ${linesInView ? 'visible' : ''}`}>
        <span className="fexp-highlight__line fexp-highlight__line--1"></span>
        <span className="fexp-highlight__line fexp-highlight__line--2"></span>
        <span className="fexp-highlight__line fexp-highlight__line--3"></span>
      </div>
      <div className="fexp-highlight__container">
        <Reveal>
          <div className="fexp-section-header">
            <span className="fexp-pre-text">Experience The Adventure</span>
            <h2>
              <span className="fexp-text--dark">Expedition</span>{' '}
              <span className="fexp-text--mid">Highlights</span>
            </h2>
          </div>
        </Reveal>

        <motion.div
          className="fexp-highlight__video"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!isPlaying ? (
            <div className="fexp-highlight__placeholder" data-cms-section="expeditions-highlight">
              <img
                src={pageImages['expeditions-highlight']?.[0]?.url || '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp'}
                alt="Expedition Highlights"
              />
              <div className="fexp-highlight__overlay">
                <button
                  className="fexp-highlight__play-btn"
                  onClick={() => setIsPlaying(true)}
                >
                  <span></span>
                </button>
                <span className="fexp-highlight__label">Watch Highlight Reel</span>
              </div>
            </div>
          ) : (
            <div className="fexp-highlight__iframe-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${highlightVideoId}?autoplay=1&rel=0`}
                title="Expedition Highlights"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}


// 3. Video Showcase
function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="fexp-video">
      <div className="fexp-video__container">
        <Reveal>
          <div className="fexp-section-header fexp-section-header--light">
            <span className="fexp-pre-text fexp-pre-text--light">Watch</span>
            <h2>
              <span style={{ color: '#fff' }}>Featured</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Documentary</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="fexp-video__player">
            {!isPlaying ? (
              <div className="fexp-video__thumbnail">
                <img src={featuredVideo.thumbnail} alt={featuredVideo.title} />
                <div className="fexp-video__overlay" />
                <button className="fexp-video__play" onClick={() => setIsPlaying(true)}>
                  <span>▶</span>
                </button>
                <div className="fexp-video__info">
                  <span className="fexp-video__duration">{featuredVideo.duration}</span>
                  <h3>{featuredVideo.title}</h3>
                </div>
              </div>
            ) : (
              <iframe
                src={`${featuredVideo.videoUrl}?autoplay=1`}
                title={featuredVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <p className="fexp-video__desc">{featuredVideo.description}</p>
        </Reveal>
      </div>
    </section>
  );
}

// 5. Sample Itinerary
function ItinerarySection() {
  return (
    <section className="fexp-itinerary">
      <div className="fexp-itinerary__container">
        <Reveal>
          <div className="fexp-section-header">
            <span className="fexp-pre-text">Example Journey</span>
            <h2>
              <span className="fexp-text--dark">Sample</span>{' '}
              <span className="fexp-text--mid">Itinerary</span>
            </h2>
            <p className="fexp-section-desc">A 5-day Alpine expedition overview</p>
          </div>
        </Reveal>

        <div className="fexp-itinerary__timeline">
          {sampleItinerary.map((day, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="fexp-itinerary__day">
                <div className="fexp-itinerary__marker">
                  <span className="fexp-itinerary__day-num">Day {day.day}</span>
                  <div className="fexp-itinerary__line" />
                </div>
                <div className="fexp-itinerary__content">
                  <span className="fexp-itinerary__location">{day.location}</span>
                  <h4>{day.title}</h4>
                  <p>{day.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Safety Section
function SafetySection() {
  return (
    <section className="fexp-safety">
      <div className="fexp-safety__container">
        <div className="fexp-safety__left">
          <Reveal>
            <span className="fexp-pre-text">Your Safety</span>
            <h2>
              <span className="fexp-text--dark">Safety</span>{' '}
              <span className="fexp-text--mid">First</span>
            </h2>
            <p className="fexp-safety__intro">
              Every aspect of our expeditions is designed with safety as the primary consideration.
              Our impeccable record is a testament to our rigorous standards and expert team.
            </p>
          </Reveal>
        </div>
        <div className="fexp-safety__right">
          <div className="fexp-safety__grid">
            {safetyFeatures.map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="fexp-safety__item">
                  <i className={`fas ${feature.icon}`}></i>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. Helicopter Fleet
function FleetSection({ pageImages = {} }) {
  return (
    <section className="fexp-fleet" data-cms-section="expeditions-fleet">
      <div className="fexp-fleet__container">
        <Reveal>
          <div className="fexp-section-header fexp-section-header--light">
            <span className="fexp-pre-text fexp-pre-text--light">Our Aircraft</span>
            <h2>
              <span style={{ color: '#fff' }}>Expedition</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Fleet</span>
            </h2>
          </div>
        </Reveal>

        <div className="fexp-fleet__grid">
          {helicopterFleet.map((heli, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="fexp-fleet__card">
                <div className="fexp-fleet__image">
                  <img src={pageImages['expeditions-fleet']?.[i]?.url || heli.image} alt={heli.model} />
                </div>
                <div className="fexp-fleet__info">
                  <h3>{heli.model}</h3>
                  <div className="fexp-fleet__specs">
                    <span><strong>Capacity:</strong> {heli.capacity}</span>
                    <span><strong>Range:</strong> {heli.range}</span>
                  </div>
                  <ul className="fexp-fleet__features">
                    {heli.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 9. Seasonal Calendar
function SeasonalCalendar() {
  return (
    <section className="fexp-seasonal">
      <div className="fexp-seasonal__container">
        <Reveal>
          <div className="fexp-section-header">
            <span className="fexp-pre-text">Planning</span>
            <h2>
              <span className="fexp-text--dark">Best</span>{' '}
              <span className="fexp-text--mid">Times</span>{' '}
              <span className="fexp-text--light">To Visit</span>
            </h2>
          </div>
        </Reveal>

        <div className="fexp-seasonal__table-wrapper">
          <table className="fexp-seasonal__table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Best Season</th>
                <th>Avoid</th>
                <th>Temperature</th>
                <th>Highlight</th>
              </tr>
            </thead>
            <tbody>
              {seasonalCalendar.map((row, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <tr>
                    <td><strong>{row.region}</strong></td>
                    <td className="fexp-seasonal__best">{row.best}</td>
                    <td className="fexp-seasonal__avoid">{row.avoid}</td>
                    <td>{row.temp}</td>
                    <td>{row.highlight}</td>
                  </tr>
                </Reveal>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// 10. Pricing Tiers
function PricingSection() {
  return (
    <section className="fexp-pricing">
      <div className="fexp-pricing__container">
        <Reveal>
          <div className="fexp-section-header">
            <span className="fexp-pre-text">Investment</span>
            <h2>
              <span className="fexp-text--dark">Expedition</span>{' '}
              <span className="fexp-text--mid">Packages</span>
            </h2>
          </div>
        </Reveal>

        <div className="fexp-pricing__grid">
          {pricingTiers.map((tier, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className={`fexp-pricing__card ${tier.badge === 'Ultimate' ? 'fexp-pricing__card--featured' : ''}`}>
                {tier.badge && <span className="fexp-pricing__badge">{tier.badge}</span>}
                <h3>{tier.name}</h3>
                <div className="fexp-pricing__price">
                  <span className="fexp-pricing__currency">£</span>
                  <span className="fexp-pricing__amount">{tier.price}</span>
                  <span className="fexp-pricing__suffix">pp</span>
                </div>
                <span className="fexp-pricing__duration">{tier.duration}</span>
                <ul className="fexp-pricing__features">
                  {tier.features.map((f, j) => (
                    <li key={j}><i className="fas fa-check"></i> {f}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


// 12. Comparison Table
function ComparisonTable() {
  return (
    <section className="fexp-comparison">
      <div className="fexp-comparison__container">
        <Reveal>
          <div className="fexp-section-header">
            <span className="fexp-pre-text">At A Glance</span>
            <h2>
              <span className="fexp-text--dark">Compare</span>{' '}
              <span className="fexp-text--mid">Expeditions</span>
            </h2>
          </div>
        </Reveal>

        <div className="fexp-comparison__table-wrapper">
          <table className="fexp-comparison__table">
            <thead>
              <tr>
                <th></th>
                <th>European</th>
                <th>Polar</th>
                <th>Tropical</th>
              </tr>
            </thead>
            <tbody>
              {expeditionComparison.map((row, i) => (
                <tr key={i}>
                  <td className="fexp-comparison__feature">{row.feature}</td>
                  <td>{row.european}</td>
                  <td>{row.polar}</td>
                  <td>{row.tropical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// 14. Booking Steps Waitlist (CTA → form, posts to /api/leads)
function BookingStepsWaitlist() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tripInterest, setTripInterest] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) { setError('Name is required'); return; }
    if (!email) { setError('Email is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const body = [
        tripInterest ? `Trip interest: ${tripInterest}` : '',
        notes ? `Notes: ${notes}` : '',
      ].filter(Boolean).join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          subject: 'Expedition Waitlist Enquiry',
          message: body || 'No additional information provided.',
          source: 'expedition-waitlist',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fexp-bs-waitlist">
      <div className="fexp-bs-waitlist__inner">
        {!formOpen && !submitted && (
          <div className="fexp-waitlist-cta">
            <button
              type="button"
              className="fexp-waitlist-cta__btn"
              onClick={() => setFormOpen(true)}
            >
              Register Interest <span>→</span>
            </button>
          </div>
        )}

        {formOpen && !submitted && (
          <form className="fexp-waitlist-form" onSubmit={handleSubmit}>
            <div className="fexp-waitlist-form__header">
              <span className="fexp-waitlist-form__badge">Trip Waitlist</span>
              <button
                type="button"
                className="fexp-waitlist-form__back"
                onClick={() => { setFormOpen(false); setError(''); }}
              >
                ← Back
              </button>
            </div>

            <div className="fexp-waitlist-form__row fexp-waitlist-form__row--2col">
              <div className="fexp-waitlist-form__field">
                <label className="fexp-waitlist-form__label">Name <span style={{ color: '#c00' }}>*</span></label>
                <input
                  className="fexp-waitlist-form__input"
                  type="text"
                  placeholder="Full name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="fexp-waitlist-form__field">
                <label className="fexp-waitlist-form__label">Email <span style={{ color: '#c00' }}>*</span></label>
                <input
                  className="fexp-waitlist-form__input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="fexp-waitlist-form__row fexp-waitlist-form__row--2col">
              <div className="fexp-waitlist-form__field">
                <label className="fexp-waitlist-form__label">Phone <span className="fexp-waitlist-form__optional">(optional)</span></label>
                <input
                  className="fexp-waitlist-form__input"
                  type="tel"
                  placeholder="+44"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className="fexp-waitlist-form__field">
                <label className="fexp-waitlist-form__label">Trip Interest <span className="fexp-waitlist-form__optional">(optional)</span></label>
                <input
                  className="fexp-waitlist-form__input"
                  type="text"
                  placeholder="e.g. Arctic, Iceland, Bahamas"
                  value={tripInterest}
                  onChange={e => setTripInterest(e.target.value)}
                />
              </div>
            </div>

            <div className="fexp-waitlist-form__field">
              <label className="fexp-waitlist-form__label">Anything Else <span className="fexp-waitlist-form__optional">(optional)</span></label>
              <textarea
                className="fexp-waitlist-form__input fexp-waitlist-form__textarea"
                placeholder="Experience level, timeframe, group size, dream destinations…"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {error && <p className="fexp-waitlist-form__error">{error}</p>}
            <div className="fexp-waitlist-form__footer">
              <button type="submit" className="fexp-waitlist-form__submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Register Interest'}
              </button>
              <span className="fexp-waitlist-form__note">We'll be in touch when new trips open.</span>
            </div>
          </form>
        )}

        {submitted && (
          <div className="fexp-waitlist-form__success">
            <span className="fexp-waitlist-form__success-icon">✓</span>
            <p className="fexp-waitlist-form__success-title">You're on the list</p>
            <p className="fexp-waitlist-form__success-sub">Thank you. We'll be in touch as soon as new expeditions are announced.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 14. Booking Steps
function BookingSteps() {
  return (
    <section className="fexp-booking-steps">
      <div className="fexp-booking-steps__container">
        <Reveal>
          <div className="fexp-section-header fexp-section-header--light">
            <span className="fexp-pre-text fexp-pre-text--light">The Process</span>
            <h2>
              <span style={{ color: '#fff' }}>How</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>It Works</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="fexp-booking-steps__intro">
            Register your interest and we'll let you know when new trips open. Or tell us where you want to go and we'll plan a bespoke expedition just for you.
          </p>
        </Reveal>

        <div className="fexp-booking-steps__layout">
          <div className="fexp-booking-steps__track">
            {bookingSteps.map((step, i) => (
              <Reveal key={i} delay={0.2 + i * 0.06}>
                <div className="fexp-step-h">
                  <div className="fexp-step-h__head">
                    <span className="fexp-step-h__num">{String(step.step).padStart(2, '0')}</span>
                  </div>
                  <h4 className="fexp-step-h__title">{step.title}</h4>
                  <p className="fexp-step-h__desc">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.55}>
            <BookingStepsWaitlist />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// 15. Expedition Philosophy — J10 (Choreographed Motion)
const PHILOSOPHY_FEATURES = [
  {
    code: 'PHIL-01',
    field: 'Operations',
    title: 'Operations Team',
    body:
      'Our dedicated team works behind the scenes, with ground contacts in ' +
      'constant communication, facilitating every aspect of travel for a ' +
      'seamless experience.',
  },
  {
    code: 'PHIL-02',
    field: 'Method',
    title: 'Real-World Skills',
    body:
      "You'll learn valuable flying skills in fully immersive, real-world " +
      "scenarios that can't be replicated in a classroom.",
  },
  {
    code: 'PHIL-03',
    field: 'Process',
    title: 'Full Preparation',
    body:
      'We provide packing lists, safety gear, briefing materials, and handle ' +
      'all logistics so you can focus on the adventure.',
  },
];

const PHILOSOPHY_HEADLINE = [
  { t: 'A helicopter',   w: 'dark' },
  { t: 'as the gateway', w: 'mid' },
  { t: 'to the world.',  w: 'light' },
];

function ExpeditionHistory() {
  const { t } = usePageText('expeditions');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <section className="fexp-philosophy">
      <div className={`fexp-philo-j ${inView ? 'is-in' : ''}`} ref={ref}>
        <div className="fexp-philo-j__band">
          <div className="fexp-philo-j__band-inner">
            <span className="fexp-philo-j__eye">PHILOSOPHY</span>
            <h2 className="fexp-philo-j__head">
              {PHILOSOPHY_HEADLINE.map((p, i) => (
                <span key={i} className={`fexp-philo-j__text--${p.w}`}>
                  {p.t}{i < PHILOSOPHY_HEADLINE.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className="fexp-philo-j__copy">
              {t('expeditions-intro', 'description')}
            </p>
            <p className="fexp-philo-j__copy fexp-philo-j__copy--quiet">
              We also offer fully bespoke expeditions tailored to your dreams. Tell us where you want to go, and we'll make it happen.
            </p>
          </div>
          <div className="fexp-philo-j__sweep" aria-hidden="true" />
        </div>

        <div className="fexp-philo-j__triptych">
          {PHILOSOPHY_FEATURES.map((f, i) => (
            <article
              key={f.code}
              className="fexp-philo-j__panel"
              style={{ '--d': `${i * 0.12}s` }}
            >
              <div className="fexp-philo-j__num">{String(i + 1).padStart(2, '0')}</div>
              <span className="fexp-philo-j__code">{f.code} · {f.field.toUpperCase()}</span>
              <h4 className="fexp-philo-j__title">{f.title}</h4>
              <p className="fexp-philo-j__body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


// 18. Split Image/Text Sections
function SplitSection({ section }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className={`fexp-split fexp-split--${section.align}`}>
      <motion.div
        className="fexp-split__image"
        initial={{ opacity: 0, x: section.align === 'left' ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={section.image} alt={section.title} />
      </motion.div>
      <motion.div
        className="fexp-split__content"
        initial={{ opacity: 0, x: section.align === 'left' ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="fexp-pre-text">{section.subtitle}</span>
        <h2>{section.title}</h2>
        <p>{section.text}</p>
      </motion.div>
    </section>
  );
}

// 19. Newsletter Signup
function TripWaitlistForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    destinations: [],
    goals: '',
    timeframe: '',
    budget: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDestinationToggle = (dest) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const destinationOptions = ['Arctic', 'Iceland', 'Greenland', 'Norway', 'Alps', 'Morocco', 'Bahamas', 'Costa Rica', 'Other'];
  const experienceLevels = [
    { value: 'none', label: 'No helicopter experience' },
    { value: 'passenger', label: 'Flown as a passenger' },
    { value: 'student', label: 'Currently learning to fly' },
    { value: 'ppl', label: 'Hold a PPL(H)' },
    { value: 'cpl', label: 'Hold a CPL(H) or higher' },
  ];

  return (
    <section className="fexp-newsletter">
      <div className="fexp-newsletter__container">
        <div className={`fexp-waitlist ${isExpanded ? 'fexp-waitlist--expanded' : ''}`}>
          {!submitted ? (
            <>
              <div className="fexp-waitlist__header" onClick={() => !isExpanded && setIsExpanded(true)}>
                <div className="fexp-waitlist__header-row">
                  <div className="fexp-waitlist__header-text">
                    <span className="fexp-label">LIMITED SPACES</span>
                    <h3>Join Our Trip Waitlist</h3>
                  </div>
                  {!isExpanded && (
                    <button
                      type="button"
                      className="fexp-btn fexp-btn--primary fexp-waitlist__expand-btn"
                      onClick={() => setIsExpanded(true)}
                    >
                      Register Interest
                    </button>
                  )}
                </div>
                {isExpanded && (
                  <p>Be the first to know about upcoming expeditions and secure your spot.</p>
                )}
              </div>

              {isExpanded && (
                <>
                  <div className="fexp-waitlist__progress">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`fexp-waitlist__step ${step >= s ? 'active' : ''}`}>
                        <span className="fexp-waitlist__step-num">{s}</span>
                        <span className="fexp-waitlist__step-label">
                          {s === 1 ? 'About You' : s === 2 ? 'Experience' : 'Interests'}
                        </span>
                      </div>
                    ))}
                  </div>

              <form className="fexp-waitlist__form" onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="fexp-waitlist__fields">
                    <div className="fexp-waitlist__field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="fexp-waitlist__fields">
                    <div className="fexp-waitlist__field">
                      <label>Your Helicopter Experience *</label>
                      <div className="fexp-waitlist__options">
                        {experienceLevels.map(level => (
                          <label key={level.value} className="fexp-waitlist__option">
                            <input
                              type="radio"
                              name="experience"
                              value={level.value}
                              checked={formData.experience === level.value}
                              onChange={handleChange}
                            />
                            <span>{level.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>Preferred Timeframe</label>
                      <select name="timeframe" value={formData.timeframe} onChange={handleChange}>
                        <option value="">Select timeframe...</option>
                        <option value="3months">Within 3 months</option>
                        <option value="6months">Within 6 months</option>
                        <option value="1year">Within 1 year</option>
                        <option value="flexible">I'm flexible</option>
                      </select>
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>Budget Range (per person)</label>
                      <select name="budget" value={formData.budget} onChange={handleChange}>
                        <option value="">Select budget range...</option>
                        <option value="under10k">Under £10,000</option>
                        <option value="10k-20k">£10,000 - £20,000</option>
                        <option value="20k-50k">£20,000 - £50,000</option>
                        <option value="50k+">£50,000+</option>
                        <option value="flexible">Flexible / Not sure</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="fexp-waitlist__fields">
                    <div className="fexp-waitlist__field">
                      <label>Which destinations interest you? *</label>
                      <div className="fexp-waitlist__destinations">
                        {destinationOptions.map(dest => (
                          <button
                            key={dest}
                            type="button"
                            className={`fexp-waitlist__dest-btn ${formData.destinations.includes(dest) ? 'selected' : ''}`}
                            onClick={() => handleDestinationToggle(dest)}
                          >
                            {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>What are you hoping to get out of this trip?</label>
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder="Tell us about your dream expedition... Adventure? Photography? Challenging yourself? Building flying hours? Meeting like-minded people?"
                        rows="3"
                      />
                    </div>
                    <div className="fexp-waitlist__field">
                      <label>Anything else we should know?</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Special requirements, questions, or additional information..."
                        rows="2"
                      />
                    </div>
                  </div>
                )}

                <div className="fexp-waitlist__actions">
                  {step > 1 && (
                    <button type="button" className="fexp-btn fexp-btn--outline" onClick={prevStep}>
                      ← Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" className="fexp-btn fexp-btn--primary" onClick={nextStep}>
                      Continue →
                    </button>
                  ) : (
                    <button type="submit" className="fexp-btn fexp-btn--primary">
                      Join Waitlist
                    </button>
                  )}
                </div>
              </form>
                </>
              )}
            </>
          ) : (
            <div className="fexp-waitlist__success">
              <div className="fexp-waitlist__success-icon">✓</div>
              <h3>You're on the list!</h3>
              <p>Thank you for your interest, {formData.name.split(' ')[0]}. We'll be in touch soon with upcoming expedition opportunities that match your preferences.</p>
              <div className="fexp-waitlist__success-next">
                <span>What happens next?</span>
                <ul>
                  <li>We'll review your preferences</li>
                  <li>You'll receive early access to upcoming trips</li>
                  <li>Our team will reach out to discuss your ideal expedition</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// 20. Scroll Progress Indicator
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fexp-scroll-progress">
      <div className="fexp-scroll-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

function FinalExpeditions() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeRegion, setActiveRegion] = useState('polar');
  const pageImages = usePageImages('expeditions');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const { faqs } = useFaqs('expeditions', { visibleOnly: true });
  const { t } = usePageText('expeditions');
  const { t: tHome } = usePageText('home');

  // Build destinations array from Firestore-backed text
  const cmsDestinations = [
    {
      id: 'arctic',
      name: tHome('home-exped-destinations', 'arctic_name'),
      distance: tHome('home-exped-destinations', 'arctic_distance'),
      year: tHome('home-exped-destinations', 'arctic_year'),
      image: '/assets/images/expeditions/north-pole.jpg',
      gallery: [
        '/assets/images/expeditions/north-pole.jpg',
        '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
        '/assets/images/expeditions/antartica.jpg',
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      ],
      description: tHome('home-exped-destinations', 'arctic_desc'),
    },
    {
      id: 'iceland',
      name: tHome('home-exped-destinations', 'iceland_name'),
      distance: tHome('home-exped-destinations', 'iceland_distance'),
      year: tHome('home-exped-destinations', 'iceland_year'),
      image: '/assets/images/expeditions/channel.jpg',
      gallery: [
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
        '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
        '/assets/images/expeditions/antartica.jpg',
      ],
      description: tHome('home-exped-destinations', 'iceland_desc'),
    },
    {
      id: 'morocco',
      name: tHome('home-exped-destinations', 'morocco_name'),
      distance: tHome('home-exped-destinations', 'morocco_distance'),
      year: tHome('home-exped-destinations', 'morocco_year'),
      image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      gallery: [
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/north-pole.jpg',
        '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      ],
      description: tHome('home-exped-destinations', 'morocco_desc'),
    },
    {
      id: 'norway',
      name: tHome('home-exped-destinations', 'norway_name'),
      distance: tHome('home-exped-destinations', 'norway_distance'),
      year: tHome('home-exped-destinations', 'norway_year'),
      image: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      gallery: [
        '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
        '/assets/images/expeditions/north-pole.jpg',
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/antartica.jpg',
      ],
      description: tHome('home-exped-destinations', 'norway_desc'),
    },
    {
      id: 'alps',
      name: tHome('home-exped-destinations', 'alps_name'),
      distance: tHome('home-exped-destinations', 'alps_distance'),
      year: tHome('home-exped-destinations', 'alps_year'),
      image: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
      gallery: [
        '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
      ],
      description: tHome('home-exped-destinations', 'alps_desc'),
    },
    {
      id: 'greenland',
      name: tHome('home-exped-destinations', 'greenland_name'),
      distance: tHome('home-exped-destinations', 'greenland_distance'),
      year: tHome('home-exped-destinations', 'greenland_year'),
      image: '/assets/images/expeditions/antartica.jpg',
      gallery: [
        '/assets/images/expeditions/antartica.jpg',
        '/assets/images/expeditions/north-pole.jpg',
        '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
        '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
      ],
      description: tHome('home-exped-destinations', 'greenland_desc'),
    },
    {
      id: 'bahamas',
      name: tHome('home-exped-destinations', 'bahamas_name'),
      distance: tHome('home-exped-destinations', 'bahamas_distance'),
      year: tHome('home-exped-destinations', 'bahamas_year'),
      image: '/assets/images/expeditions/channel.jpg',
      gallery: [
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
        '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
        '/assets/images/expeditions/antartica.jpg',
      ],
      description: tHome('home-exped-destinations', 'bahamas_desc'),
    },
    {
      id: 'costa-rica',
      name: tHome('home-exped-destinations', 'costarica_name'),
      distance: tHome('home-exped-destinations', 'costarica_distance'),
      year: tHome('home-exped-destinations', 'costarica_year'),
      image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
      gallery: [
        '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
        '/assets/images/expeditions/channel.jpg',
        '/assets/images/expeditions/north-pole.jpg',
        '/assets/images/expeditions/antartica.jpg',
      ],
      description: tHome('home-exped-destinations', 'costarica_desc'),
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="fexp">
      <Seo
        title="Worldwide Helicopter Expeditions"
        description="Multi-day long-range helicopter expeditions led by HQ Aviation pilots. Cross-Channel, cross-continent, bespoke routes, itinerary, fuel and customs handled."
        jsonLd={[
          buildService({
            name: 'Helicopter Expeditions',
            serviceType: 'Worldwide helicopter expedition support',
            description: 'Worldwide helicopter expedition support — Arctic, Africa, Asia. Robinson and Bell aircraft. Custom multi-day adventures.',
            url: `${SITE_URL}/expeditions`,
            areaServed: AREA_SERVED,
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Expeditions', path: '/expeditions' },
          ]),
        ]}
      />
      <h1 style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Worldwide Helicopter Expeditions — Led by HQ Aviation Pilots, United Kingdom UK
      </h1>
      <ExpeditionsHeader />

      {/* ========== HERO: Expedition Passport ========== */}
      <section ref={heroRef} className="fexp-hero" data-cms-section="expeditions-hero">
        <motion.div
          className="fexp-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={pageImages['expeditions-hero']?.[0]?.url || '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp'} alt="" />
        </motion.div>
        <div className="fexp-hero__overlay" />

        <motion.div
          className="fexp-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="fexp-hero__left">
            <motion.span
              className="fexp-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('expeditions-hero', 'pre_label')}
            </motion.span>

            <div className="fexp-hero__headline">
              <motion.span
                className="fexp-hero__word fexp-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                EXPLORE
              </motion.span>
              <motion.span
                className="fexp-hero__word fexp-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                THE
              </motion.span>
              <motion.span
                className="fexp-hero__word fexp-hero__word--3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                UNREACHABLE
              </motion.span>
            </div>

            <motion.div
              className="fexp-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Expedition Passport */}
            <motion.div
              className="fexp-hero__passport"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fexp-hero__passport-main">
                <div className="fexp-hero__passport-header">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="fexp-hero__passport-logo" />
                  <span className="fexp-hero__passport-type">EXPEDITION PASS</span>
                  <span className="fexp-hero__passport-class">WORLDWIDE</span>
                </div>
                <div className="fexp-hero__passport-route">
                  <div className="fexp-hero__passport-point">
                    <span className="fexp-hero__passport-code">EGLD</span>
                    <span className="fexp-hero__passport-city">Denham</span>
                  </div>
                  <div className="fexp-hero__passport-arrow">
                    <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
                      <path d="M0 4H38M38 4L34 1M38 4L34 7" stroke="#999" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div className="fexp-hero__passport-point">
                    <span className="fexp-hero__passport-code">WORLD</span>
                    <span className="fexp-hero__passport-city">Anywhere</span>
                  </div>
                </div>
              </div>
              <div className="fexp-hero__passport-perf"></div>
              <div className="fexp-hero__passport-stub">
                <div className="fexp-hero__passport-stub-row">
                  <div><span className="fexp-hero__passport-lbl">CONTINENTS</span><span>7</span></div>
                  <div><span className="fexp-hero__passport-lbl">RECORDS</span><span>3</span></div>
                  <div><span className="fexp-hero__passport-lbl">SINCE</span><span>2010</span></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="fexp-hero__coords"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <span>51.5751°N</span>
              <span className="fexp-hero__coords-divider">|</span>
              <span>0.5059°W</span>
            </motion.div>

            <motion.p
              className="fexp-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              {t('expeditions-hero', 'subtitle')}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== EXPEDITION BARCODE GRID ========== */}
      <section className="fexp-journey-section">
        <Reveal>
          <div className="fexp-journey-section__header">
            <span className="fexp-pre-text">From Denham to the Ends of the Earth</span>
            <h2 className="fexp-journey-section__title">Where Will You Go?</h2>
          </div>
        </Reveal>
        <Reveal>
          <ExpeditionBarcode destinations={cmsDestinations} />
        </Reveal>
      </section>

      {/* ========== VIDEO SLIDER ========== */}
      <ExpeditionVideoSlider title="Expedition Footage" />

      {/* ========== NEW: EXPEDITION HISTORY ========== */}
      <ExpeditionHistory />

      {/* ========== ITINERARY REMOVED ========== */}

      {/* ========== NEW: BOOKING STEPS ========== */}
      <BookingSteps />

      {/* ========== FAQ SECTION ========== */}
      <section className="fexp-faq" data-cms-section="faqs-expeditions">
        <div className="fexp-faq__container fexp-faq__container--full">
          <div className="fexp-faq__right">
            <Reveal>
              <div className="fexp-faq__header">
                <span className="fexp-label">Common Questions</span>
                <h3>FAQ</h3>
              </div>
            </Reveal>

            <div className="fexp-faq__list">
              {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
                <Reveal key={faq.id} delay={i * 0.05}>
                  <div
                    className={`fexp-faq__item ${openFaq === i ? 'fexp-faq__item--open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div className="fexp-faq__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="fexp-faq__content">
                      <h4>
                        {faq.question}
                        <span className="fexp-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                      </h4>
                      <motion.div
                        className="fexp-faq__answer"
                        initial={false}
                        animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            {!showAllFaqs && faqs.length > 6 && (
              <button className="fexp-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
            )}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .fexp {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .fexp-label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          font-weight: 400;
          margin-bottom: 0.75rem;
        }

        .fexp-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .fexp-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Text colors */
        .fexp-text--dark { color: #1a1a1a; }
        .fexp-text--mid { color: #4a4a4a; }
        .fexp-text--light { color: #7a7a7a; }
        .fexp-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }
        .fexp-pre-text--light { color: rgba(255,255,255,0.5); }

        /* Buttons */
        .fexp-btn {
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
          text-align: center;
        }

        .fexp-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .fexp-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .fexp-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .fexp-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .fexp-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .fexp-btn--white:hover {
          background: #f0f0f0;
        }

        .fexp-btn--block {
          display: block;
          width: 100%;
        }

        /* ===== HERO ===== */
        .fexp-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .fexp-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .fexp-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .fexp-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 6rem 4rem 2rem;
        }

        .fexp-hero__left {
          max-width: 600px;
        }

        .fexp-hero__label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .fexp-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .fexp-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(2.5rem, 7vw, 5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .fexp-hero__word--1 { color: #1a1a1a; }
        .fexp-hero__word--2 { color: #4a4a4a; }
        .fexp-hero__word--3 { color: #7a7a7a; }

        .fexp-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .fexp-hero__coords {
          display: flex;
          gap: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .fexp-hero__coords-divider {
          color: #ccc;
        }

        .fexp-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 450px;
        }

        /* Expedition Passport */
        .fexp-hero__passport {
          display: flex;
          align-items: stretch;
          background: #fff;
          max-width: 380px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
        }

        .fexp-hero__passport-main {
          flex: 1;
          padding: 1rem 1.25rem;
          position: relative;
        }

        .fexp-hero__passport-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          gap: 0.5rem;
        }

        .fexp-hero__passport-logo {
          height: 14px;
          width: auto;
          opacity: 0.8;
        }

        .fexp-hero__passport-type {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          flex: 1;
          text-align: center;
        }

        .fexp-hero__passport-class {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          background: #f5f5f2;
          padding: 0.2rem 0.5rem;
        }

        .fexp-hero__passport-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .fexp-hero__passport-point {
          text-align: center;
        }

        .fexp-hero__passport-code {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
        }

        .fexp-hero__passport-city {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fexp-hero__passport-arrow {
          display: flex;
          align-items: center;
        }

        .fexp-hero__passport-perf {
          width: 14px;
          background: #fff;
          position: relative;
        }

        .fexp-hero__passport-perf::before {
          content: '';
          position: absolute;
          top: 8px;
          bottom: 8px;
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

        .fexp-hero__passport-stub {
          background: #fafafa;
          padding: 0.75rem;
          display: flex;
          align-items: center;
        }

        .fexp-hero__passport-stub-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .fexp-hero__passport-stub-row > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fexp-hero__passport-lbl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.45rem;
          color: #999;
          letter-spacing: 0.1em;
          min-width: 55px;
        }

        .fexp-hero__passport-stub-row > div > span:not(.fexp-hero__passport-lbl) {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 600;
          font-size: 0.75rem;
          color: #1a1a1a;
        }

        /* ===== JOURNEY / BARCODE SECTION ===== */
        .fexp-journey-section {
          padding: 4rem 2rem;
          background: #fff;
          position: relative;
          z-index: 10;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }


        .fexp-journey-section__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .fexp-journey-section__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0;
        }

        /* ===== PHILOSOPHY SECTION (J10 — choreographed motion) ===== */
        .fexp-philosophy {
          padding: 5rem 2rem 6rem;
          background: #faf9f6;
          position: relative;
          z-index: 2;
        }

        .fexp-philo-j {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
        }

        .fexp-philo-j__text--dark  { color: #faf9f6; font-weight: 500; }
        .fexp-philo-j__text--mid   { color: rgba(250,249,246,0.75); font-weight: 300; }
        .fexp-philo-j__text--light { color: rgba(250,249,246,0.5);  font-weight: 300; }

        .fexp-philo-j__band {
          background: #0e0e0e;
          color: #faf9f6;
          padding: 3.25rem 2.5rem 5rem;
          margin-bottom: -2.5rem;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fexp-philo-j.is-in .fexp-philo-j__band {
          opacity: 1;
          transform: translateY(0);
        }

        .fexp-philo-j__band-inner { max-width: 760px; }

        .fexp-philo-j__eye {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 1rem;
        }

        .fexp-philo-j__head {
          font-size: clamp(2rem, 4.8vw, 3.8rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin: 0 0 1.25rem;
        }

        .fexp-philo-j__copy {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.75);
          margin: 0 0 0.5rem;
        }
        .fexp-philo-j__copy--quiet {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }

        .fexp-philo-j__sweep {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: #faf9f6;
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.9s ease 0.4s;
        }
        .fexp-philo-j.is-in .fexp-philo-j__sweep { transform: scaleX(1); }

        .fexp-philo-j__triptych {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e0deda;
          margin: 0 1.5rem;
          position: relative;
          z-index: 2;
          box-shadow: 0 14px 36px rgba(0,0,0,0.12);
        }

        .fexp-philo-j__panel {
          background: #faf9f6;
          padding: 2.25rem 1.85rem;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.6s ease var(--d, 0s),
            transform 0.6s ease var(--d, 0s),
            box-shadow 0.25s ease;
        }
        .fexp-philo-j.is-in .fexp-philo-j__panel {
          opacity: 1;
          transform: translateY(0);
        }
        .fexp-philo-j__panel:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .fexp-philo-j__num {
          font-size: 2.6rem;
          font-weight: 200;
          color: #1a1a1a;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 0.85rem;
        }
        .fexp-philo-j__code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: #aaa;
          display: block;
          margin-bottom: 0.6rem;
        }
        .fexp-philo-j__title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 0.55rem;
        }
        .fexp-philo-j__body {
          font-size: 0.85rem;
          line-height: 1.65;
          color: #666;
          margin: 0;
        }

        @media (max-width: 900px) {
          .fexp-philo-j__triptych {
            grid-template-columns: 1fr;
            margin: 0;
          }
          .fexp-philo-j__band {
            margin-bottom: 0;
            padding: 2.5rem 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fexp-philo-j__band,
          .fexp-philo-j__panel,
          .fexp-philo-j__sweep {
            transition: none !important;
          }
          .fexp-philo-j__band,
          .fexp-philo-j__panel {
            opacity: 1;
            transform: none;
          }
          .fexp-philo-j__sweep { transform: scaleX(1); }
        }

        .fexp-btn--sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        /* ===== PARALLAX SECTIONS ===== */
        .fexp-parallax {
          position: relative;
          height: 450px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: inset(0);
        }

        .fexp-parallax__image-container {
          position: absolute;
          inset: -15%;
          z-index: 0;
        }

        .fexp-parallax__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-parallax__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 1;
        }

        .fexp-parallax__content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
        }

        .fexp-parallax__number-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .fexp-parallax__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .fexp-parallax__line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
        }

        .fexp-parallax__label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .fexp-parallax__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          opacity: 0.85;
        }

        .fexp-parallax__text {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ===== DESTINATIONS ===== */
        .fexp-destinations {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fexp-destinations__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .fexp-destinations__tabs {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .fexp-destinations__tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid #e8e6e2;
          font-family: inherit;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fexp-destinations__tab:hover {
          border-color: #1a1a1a;
        }

        .fexp-destinations__tab--active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .fexp-destinations__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .fexp-dest-card {
          display: block;
          text-decoration: none;
          color: inherit;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .fexp-dest-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .fexp-dest-card__image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .fexp-dest-card__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .fexp-dest-card:hover .fexp-dest-card__image img {
          transform: scale(1.05);
        }

        .fexp-dest-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }

        .fexp-dest-card__coords {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.1em;
        }


        .fexp-dest-card__content {
          padding: 1.25rem;
        }

        .fexp-dest-card__content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .fexp-dest-card__meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #666;
        }

        .fexp-dest-card__arrow {
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .fexp-dest-card:hover .fexp-dest-card__arrow {
          transform: translateX(5px);
        }

        .fexp-destinations__bespoke {
          text-align: center;
        }

        .fexp-destinations__bespoke p {
          color: #666;
          margin-bottom: 1rem;
        }

        /* ===== WHAT'S INCLUDED ===== */
        .fexp-included {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .fexp-included__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fexp-section-header--light {
          color: #fff;
        }

        .fexp-included__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        .fexp-included__item {
          color: #fff;
        }

        .fexp-included__item i {
          font-size: 2.5rem;
          margin-bottom: 1.25rem;
          color: rgba(255,255,255,0.8);
        }

        .fexp-included__item h4 {
          font-size: 1rem;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fexp-included__item p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }

        /* ===== UPCOMING EXPEDITIONS ===== */
        .fexp-upcoming {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .fexp-upcoming__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .fexp-upcoming__title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .fexp-upcoming__icon {
          font-size: 1.25rem;
          color: #1a1a1a;
          opacity: 0.3;
        }

        .fexp-upcoming__icon--left {
          transform: scaleX(-1);
        }

        .fexp-upcoming__grid {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scroll-snap-type: x mandatory;
        }

        .fexp-upcoming__grid > div {
          flex: 0 0 320px;
          scroll-snap-align: start;
        }

        .fexp-upcoming__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fexp-upcoming__image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .fexp-upcoming__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-upcoming__badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 0.75rem;
          border-radius: 2px;
        }

        .fexp-upcoming__content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .fexp-upcoming__date {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }

        .fexp-upcoming__content h3 {
          margin: 0 0 0.75rem;
          font-size: 1.1rem;
        }

        .fexp-upcoming__content p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .fexp-upcoming__cta {
          text-align: center;
        }

        /* ===== FAQ SECTION ===== */
        .fexp-faq {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fexp-faq__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 3rem;
          align-items: start;
        }

        .fexp-faq__container--full {
          display: block;
        }

        .fexp-faq__divider {
          width: 1px;
          height: 100%;
          min-height: 400px;
          background: linear-gradient(to bottom, transparent, #e0deda 20%, #e0deda 80%, transparent);
        }

        .fexp-faq__header {
          margin-bottom: 2rem;
        }

        .fexp-faq__header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .fexp-faq__list {
          display: flex;
          flex-direction: column;
        }

        .fexp-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .fexp-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .fexp-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .fexp-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .fexp-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .fexp-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .fexp-faq__content {
          flex: 1;
        }

        .fexp-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .fexp-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .fexp-faq__answer {
          overflow: hidden;
        }

        .fexp-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* Contact Card */
        .fexp-contact-card {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .fexp-contact-card__header {
          margin-bottom: 1.5rem;
        }

        .fexp-contact-card__header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .fexp-contact-card__desc {
          color: #666;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .fexp-contact-card__details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .fexp-contact-card__detail {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .fexp-contact-card__label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }

        .fexp-contact-card__detail a {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
        }

        .fexp-contact-card__detail a:hover {
          text-decoration: underline;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .fexp-leader__card {
            grid-template-columns: 1fr;
          }

          .fexp-leader__image {
            max-width: 280px;
            margin: 0 auto;
          }

          .fexp-leader__info {
            text-align: center;
          }

          .fexp-leader__stats {
            justify-content: center;
          }

          .fexp-leader__achievements {
            align-items: center;
          }

          .fexp-faq__container {
            grid-template-columns: 1fr;
          }

          .fexp-faq__divider {
            width: 100%;
            height: 1px;
            min-height: auto;
            background: linear-gradient(to right, transparent, #e0deda 20%, #e0deda 80%, transparent);
          }

          .fexp-included__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .fexp-upcoming__grid > div {
            flex: 0 0 280px;
          }
        }

        @media (max-width: 768px) {
          .fexp-hero__content {
            padding: 5rem 2rem 2rem;
            justify-content: center;
          }

          .fexp-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .fexp-hero__headline {
            align-items: center;
          }

          .fexp-hero__divider-line {
            margin: 1.5rem auto;
          }

          .fexp-hero__coords {
            justify-content: center;
          }

          .fexp-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .fexp-hero__passport {
            max-width: 320px;
            margin: 0 auto 1.5rem;
          }

          .fexp-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .fexp-included__grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .fexp-destinations__grid {
            grid-template-columns: 1fr;
          }

          .fexp-leader__stats {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .fexp-leader__divider {
            display: none;
          }
        }

        /* ========================================== */
        /* NEW COMPONENT STYLES (20 Components)      */
        /* ========================================== */

        /* 1. SCROLL PROGRESS */
        .fexp-scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(0,0,0,0.1);
          z-index: 100000;
        }

        .fexp-scroll-progress__bar {
          height: 100%;
          background: #1a1a1a;
          transition: width 0.1s ease;
        }

        /* 2. STATS COUNTER */
        .fexp-stats {
          position: relative;
          z-index: 10;
          padding: 1.5rem 2rem;
          background: #1a1a1a;
        }

        .fexp-stats__container {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .fexp-stats__item {
          text-align: center;
          color: #fff;
        }

        .fexp-stats__item i {
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.4rem;
          display: block;
        }

        .fexp-stats__value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }

        .fexp-stats__label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45);
        }

        @media (max-width: 1024px) {
          .fexp-stats__container {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 768px) {
          .fexp-stats__container {
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
          }
          .fexp-stats__value {
            font-size: 1.1rem;
          }
          .fexp-stats__label {
            font-size: 0.5rem;
          }
        }

        /* HIGHLIGHT REEL */
        .fexp-highlight {
          padding: 5rem 2rem 0;
          background: #faf9f6;
          position: relative;
          overflow: hidden;
        }


        .fexp-highlight__lines {
          position: absolute;
          top: 40%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 30px;
          z-index: 0;
          pointer-events: none;
        }

        .fexp-highlight__line {
          height: 1px;
          width: 100%;
          background: #ccc;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 1.2s ease-out;
        }

        .fexp-highlight__lines.visible .fexp-highlight__line {
          transform: scaleX(1);
        }

        .fexp-highlight__lines.visible .fexp-highlight__line--1 {
          transition-delay: 0.15s;
        }

        .fexp-highlight__lines.visible .fexp-highlight__line--2 {
          transition-delay: 0s;
        }

        .fexp-highlight__lines.visible .fexp-highlight__line--3 {
          transition-delay: 0.15s;
        }

        .fexp-highlight__container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .fexp-highlight__video {
          margin-bottom: 1.5rem;
        }

        .fexp-highlight__placeholder {
          position: relative;
          aspect-ratio: 16/9;
          background: #1a1a1a;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .fexp-highlight__placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-highlight__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .fexp-highlight__play-btn {
          width: 90px;
          height: 90px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .fexp-highlight__play-btn span {
          position: absolute;
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-left: 20px solid #fff;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
        }

        .fexp-highlight__play-btn:hover {
          background: rgba(255,255,255,0.15);
          transform: scale(1.08);
        }

        .fexp-highlight__label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #fff;
          font-weight: 500;
        }

        .fexp-highlight__iframe-wrap {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 8px;
          overflow: hidden;
        }

        .fexp-highlight__iframe-wrap iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .fexp-highlight__caption {
          text-align: center;
          font-size: 0.95rem;
          color: #666;
          font-style: italic;
        }

        .fexp-highlight__description {
          max-width: 800px;
          margin: 2rem auto 0;
          text-align: center;
        }

        .fexp-highlight__description p {
          font-size: 1rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 1.25rem;
        }

        .fexp-highlight__description p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .fexp-highlight {
            padding: 3rem 1rem;
          }

          .fexp-highlight__play-btn {
            width: 70px;
            height: 70px;
          }

          .fexp-highlight__play-btn span {
            border-left: 16px solid #fff;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }
        }

        /* 4. VIDEO */
        .fexp-video {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .fexp-video__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fexp-video__player {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 8px;
          overflow: hidden;
        }

        .fexp-video__thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .fexp-video__thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-video__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
        }

        .fexp-video__play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: transparent;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fexp-video__play:hover {
          background: rgba(255,255,255,0.1);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .fexp-video__info {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          color: #fff;
        }

        .fexp-video__duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .fexp-video__info h3 {
          font-size: 1.25rem;
          margin: 0.5rem 0 0;
        }

        .fexp-video__player iframe {
          width: 100%;
          height: 100%;
        }

        .fexp-video__desc {
          text-align: center;
          color: rgba(255,255,255,0.6);
          margin-top: 1.5rem;
        }

        /* 6. ITINERARY (COMPACT) */
        .fexp-itinerary {
          padding: 3rem 2rem;
          background: #faf9f6;
        }

        .fexp-itinerary__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fexp-section-desc {
          color: #666;
          margin-top: 0.5rem;
        }

        .fexp-itinerary__timeline {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .fexp-itinerary__day {
          display: flex;
          flex-direction: column;
        }

        .fexp-itinerary__marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .fexp-itinerary__day-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          letter-spacing: 0.1em;
          background: #1a1a1a;
          color: #fff;
          padding: 0.35rem 0.75rem;
          border-radius: 3px;
        }

        .fexp-itinerary__line {
          display: none;
        }

        .fexp-itinerary__content {
          flex: 1;
          background: #fff;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e8e6e2;
        }

        .fexp-itinerary__location {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #999;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .fexp-itinerary__content h4 {
          margin: 0.35rem 0;
          font-size: 0.9rem;
        }

        .fexp-itinerary__content p {
          margin: 0;
          color: #666;
          font-size: 0.75rem;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .fexp-itinerary__timeline {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .fexp-itinerary__timeline {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* 7. SAFETY */
        .fexp-safety {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fexp-safety__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: start;
        }

        .fexp-safety__left h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
        }

        .fexp-safety__intro {
          color: #666;
          line-height: 1.7;
        }

        .fexp-safety__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .fexp-safety__item {
          padding: 1.5rem;
          background: #faf9f6;
          border-radius: 8px;
        }

        .fexp-safety__item i {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
          display: block;
        }

        .fexp-safety__item h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .fexp-safety__item p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .fexp-safety__container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .fexp-safety__grid {
            grid-template-columns: 1fr;
          }
        }

        /* 8. FLEET */
        .fexp-fleet {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .fexp-fleet__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fexp-fleet__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .fexp-fleet__card {
          background: #252525;
          border-radius: 8px;
          overflow: hidden;
        }

        .fexp-fleet__image {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .fexp-fleet__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-fleet__info {
          padding: 1.5rem;
          color: #fff;
        }

        .fexp-fleet__info h3 {
          margin: 0 0 1rem;
          font-size: 1.25rem;
        }

        .fexp-fleet__specs {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        .fexp-fleet__features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .fexp-fleet__features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        .fexp-fleet__features li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .fexp-fleet__grid {
            grid-template-columns: 1fr;
          }
        }

        /* 10. SEASONAL CALENDAR */
        .fexp-seasonal {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fexp-seasonal__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fexp-seasonal__table-wrapper {
          overflow-x: auto;
        }

        .fexp-seasonal__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .fexp-seasonal__table th {
          text-align: left;
          padding: 1rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fexp-seasonal__table td {
          padding: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .fexp-seasonal__table tr:hover td {
          background: #faf9f6;
        }

        .fexp-seasonal__best {
          color: #4CAF50;
        }

        .fexp-seasonal__avoid {
          color: #e04a2f;
        }

        /* 11. PRICING */
        .fexp-pricing {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .fexp-pricing__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .fexp-pricing__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .fexp-pricing__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          position: relative;
        }

        .fexp-pricing__card--featured {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
          transform: scale(1.05);
        }

        .fexp-pricing__badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #e04a2f;
          color: #fff;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 1rem;
          border-radius: 20px;
        }

        .fexp-pricing__card h3 {
          margin: 1rem 0 0.5rem;
          font-size: 1.25rem;
          text-transform: uppercase;
        }

        .fexp-pricing__price {
          margin: 1rem 0;
        }

        .fexp-pricing__currency {
          font-size: 1.25rem;
          vertical-align: top;
        }

        .fexp-pricing__amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
        }

        .fexp-pricing__suffix {
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .fexp-pricing__duration {
          display: block;
          font-size: 0.8rem;
          color: inherit;
          opacity: 0.6;
          margin-bottom: 1.5rem;
        }

        .fexp-pricing__features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          text-align: left;
        }

        .fexp-pricing__features li {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fexp-pricing__card--featured .fexp-pricing__features li {
          border-color: rgba(255,255,255,0.1);
        }

        .fexp-pricing__features li i {
          color: #4CAF50;
        }

        @media (max-width: 1024px) {
          .fexp-pricing__card--featured {
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .fexp-pricing__grid {
            grid-template-columns: 1fr;
          }
        }

        /* 12. AWARDS */
        /* 13. COMPARISON */
        .fexp-comparison {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fexp-comparison__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fexp-comparison__table-wrapper {
          overflow-x: auto;
        }

        .fexp-comparison__table {
          width: 100%;
          border-collapse: collapse;
        }

        .fexp-comparison__table th {
          padding: 1rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
        }

        .fexp-comparison__table th:first-child {
          background: transparent;
        }

        .fexp-comparison__table td {
          padding: 1rem;
          border-bottom: 1px solid #e8e6e2;
          text-align: center;
          font-size: 0.9rem;
        }

        .fexp-comparison__feature {
          font-weight: 600;
          text-align: left !important;
        }

        /* 15. BOOKING STEPS */
        .fexp-booking-steps {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .fexp-booking-steps__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* STEPS LAYOUT */
        .fexp-booking-steps__layout {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        /* SECTION INTRO COPY (sits above the timeline) */
        .fexp-booking-steps__intro {
          max-width: 640px;
          margin: 0 auto 3.5rem;
          text-align: center;
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.7);
        }

        /* HORIZONTAL STEP TIMELINE — centered numbers sit ON the rule, breaking it */
        .fexp-booking-steps__track {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 3rem;
          padding-top: 0.75rem;
          position: relative;
        }
        .fexp-booking-steps__track::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 1.575rem;  /* vertical centre of the 1.65rem-tall number chip */
          height: 1px;
          background: rgba(255,255,255,0.22);
          z-index: 0;
        }
        .fexp-step-h {
          position: relative;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .fexp-step-h__head {
          display: inline-flex;
          align-items: center;
          height: 1.65rem;
          padding: 0 0.95rem;
          margin-bottom: 2.25rem;
          background: #1a1a1a;
          position: relative;
          z-index: 1;
        }
        .fexp-step-h__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.7);
          background: none;
          padding: 0;
          line-height: 1;
        }
        .fexp-step-h__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .fexp-step-h__desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0;
          max-width: 200px;
        }
        @media (max-width: 900px) {
          .fexp-booking-steps__track { grid-template-columns: repeat(2, 1fr); row-gap: 2.5rem; }
          .fexp-booking-steps__track::before { display: none; }
        }
        @media (max-width: 560px) {
          .fexp-booking-steps__track { grid-template-columns: 1fr; }
        }

        .fexp-step {
          display: flex;
          gap: 1.25rem;
        }

        .fexp-step__left {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
        }

        .fexp-step__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fexp-step__line {
          width: 1px;
          flex: 1;
          background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
          min-height: 20px;
        }

        .fexp-step__content {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding-bottom: 2rem;
        }

        .fexp-step__icon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }

        .fexp-step__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.3rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .fexp-step__desc {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.55;
          margin: 0;
          max-width: 280px;
        }

        /* BOOKING-STEPS WAITLIST WRAPPER (kept transparent — the dark section shows through) */
        .fexp-bs-waitlist {
          width: 100%;
          background: transparent;
        }
        .fexp-bs-waitlist__inner {
          background: transparent;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* WAITLIST CTA (no card — sits on dark section, full-width) + FORM */
        .fexp-waitlist-cta {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          width: 100%;
          padding: 0;
          background: transparent;
          margin: 0;
        }
        .fexp-waitlist-cta__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1rem;
        }
        .fexp-waitlist-cta__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 1rem;
        }
        .fexp-waitlist-cta__sub {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          margin: 0 auto 1.75rem;
          max-width: 460px;
        }
        .fexp-waitlist-cta__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          width: 100%;
          padding: 1.25rem 2.6rem;
          background: #faf9f6;
          color: #1a1a1a;
          border: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .fexp-waitlist-cta__btn:hover {
          background: #fff;
          transform: translateY(-1px);
        }
        .fexp-waitlist-cta__btn span {
          transition: transform 0.25s ease;
        }
        .fexp-waitlist-cta__btn:hover span {
          transform: translateX(4px);
        }

        .fexp-waitlist-form {
          background: #fff;
          border: 1px solid #e0deda;
          padding: 1.75rem;
          width: 100%;
          box-sizing: border-box;
          text-align: left;
        }
        .fexp-waitlist-form__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .fexp-waitlist-form__badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          background: #1a1a1a;
          color: #fff;
          padding: 0.3rem 0.7rem;
        }
        .fexp-waitlist-form__back {
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
        .fexp-waitlist-form__back:hover { color: #1a1a1a; }
        .fexp-waitlist-form__row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: end;
        }
        .fexp-waitlist-form__row--2col { grid-template-columns: repeat(2, 1fr); }
        .fexp-waitlist-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .fexp-waitlist-form__row .fexp-waitlist-form__field { margin-bottom: 0; }
        .fexp-waitlist-form__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          white-space: nowrap;
        }
        .fexp-waitlist-form__optional {
          color: #ccc;
          font-size: 0.55rem;
          text-transform: none;
          letter-spacing: 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .fexp-waitlist-form__input {
          background: #faf9f6;
          border: 1px solid #e0ddd8;
          padding: 0.7rem 0.9rem;
          color: #1a1a1a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.88rem;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .fexp-waitlist-form__input::placeholder { color: #bbb; }
        .fexp-waitlist-form__input:focus { outline: none; border-color: #1a1a1a; }
        .fexp-waitlist-form__textarea { resize: vertical; min-height: 80px; }
        .fexp-waitlist-form__error {
          font-size: 0.78rem;
          color: #c00;
          margin-bottom: 0.75rem;
        }
        .fexp-waitlist-form__footer {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .fexp-waitlist-form__submit {
          padding: 0.8rem 2rem;
          background: #1a1a1a;
          border: none;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fexp-waitlist-form__submit:hover:not(:disabled) { background: #333; }
        .fexp-waitlist-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .fexp-waitlist-form__note {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          color: #bbb;
        }
        .fexp-waitlist-form__success {
          background: #fff;
          border: 1px solid #e0deda;
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .fexp-waitlist-form__success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          font-size: 1.1rem;
          margin: 0 auto 1rem;
        }
        .fexp-waitlist-form__success-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }
        .fexp-waitlist-form__success-sub {
          font-size: 0.82rem;
          color: #888;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .fexp-booking-steps__layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .fexp-bs-waitlist__inner {
            padding: 0;
          }
          .fexp-waitlist-form__row,
          .fexp-waitlist-form__row--2col {
            grid-template-columns: 1fr;
          }
        }

        /* 16. HISTORY TIMELINE */
        .fexp-history {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .fexp-history__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fexp-history__timeline {
          position: relative;
          padding: 2rem 0;
        }

        .fexp-history__line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e8e6e2;
          transform: translateX(-50%);
        }

        .fexp-history__item {
          position: relative;
          width: 50%;
          padding: 1rem 2rem;
        }

        .fexp-history__item.left {
          text-align: right;
          padding-right: 3rem;
        }

        .fexp-history__item.right {
          margin-left: 50%;
          padding-left: 3rem;
        }

        .fexp-history__dot {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #1a1a1a;
          border-radius: 50%;
          top: 1.5rem;
        }

        .fexp-history__item.left .fexp-history__dot {
          right: -6px;
        }

        .fexp-history__item.right .fexp-history__dot {
          left: -6px;
        }

        .fexp-history__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.1em;
        }

        .fexp-history__content h4 {
          margin: 0.5rem 0;
          font-size: 1rem;
        }

        .fexp-history__content p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .fexp-history__line {
            left: 20px;
          }
          .fexp-history__item {
            width: 100%;
            text-align: left !important;
            padding-left: 50px !important;
            padding-right: 0 !important;
          }
          .fexp-history__item.right {
            margin-left: 0;
          }
          .fexp-history__dot {
            left: 14px !important;
            right: auto !important;
          }
        }

        /* 18. LEADER + QUOTE COMBINED */
        .fexp-leader-quote {
          padding: 3.5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .fexp-leader-quote__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fexp-leader-quote__card {
          position: relative;
          background: #fff;
          border: 1px solid #e8e4d9;
          border-radius: 2px;
          padding: 2.5rem;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr auto;
          gap: 2rem 2.5rem;
          overflow: hidden;
        }

        .fexp-leader-quote__path {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          color: #d0ccc4;
          opacity: 0.5;
          pointer-events: none;
        }

        .fexp-leader-quote__portrait {
          grid-row: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .fexp-leader-quote__portrait-ring {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .fexp-leader-quote__portrait-ring img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        .fexp-leader-quote__compass {
          width: 36px;
          height: 36px;
          color: #b8860b;
          opacity: 0.7;
        }

        .fexp-leader-quote__content {
          grid-row: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fexp-leader-quote__role {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #b8860b;
          margin-bottom: 0.25rem;
        }

        .fexp-leader-quote__name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1rem;
          letter-spacing: 0.02em;
        }

        .fexp-leader-quote__quote {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0 0 1.25rem;
          padding-left: 1rem;
          border-left: 2px solid #daa520;
        }

        .fexp-leader-quote__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .fexp-leader-quote__cta span {
          transition: transform 0.2s ease;
        }

        .fexp-leader-quote__cta:hover {
          color: #b8860b;
        }

        .fexp-leader-quote__cta:hover span {
          transform: translateX(4px);
        }

        .fexp-leader-quote__stats {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e8e4d9;
        }

        .fexp-leader-quote__stat {
          text-align: center;
        }

        .fexp-leader-quote__stat-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .fexp-leader-quote__stat-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #888;
        }

        .fexp-leader-quote__stat-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(180deg, transparent, #d0ccc4, transparent);
        }

        @media (max-width: 700px) {
          .fexp-leader-quote__card {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 2rem 1.5rem;
          }

          .fexp-leader-quote__portrait {
            justify-self: center;
          }

          .fexp-leader-quote__content {
            align-items: center;
          }

          .fexp-leader-quote__quote {
            border-left: none;
            padding-left: 0;
            border-top: 2px solid #daa520;
            padding-top: 1rem;
          }

          .fexp-leader-quote__cta {
            justify-content: center;
          }

          .fexp-leader-quote__stats {
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .fexp-leader-quote__stat-divider {
            display: none;
          }
        }

        /* 19. SPLIT SECTIONS */
        .fexp-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }

        .fexp-split--right {
          direction: rtl;
        }

        .fexp-split--right > * {
          direction: ltr;
        }

        .fexp-split__image {
          overflow: hidden;
        }

        .fexp-split__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fexp-split__content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          background: #faf9f6;
        }

        .fexp-split__content h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
        }

        .fexp-split__content p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .fexp-split {
            grid-template-columns: 1fr;
          }
          .fexp-split--right {
            direction: ltr;
          }
          .fexp-split__image {
            height: 300px;
          }
          .fexp-split__content {
            padding: 3rem 2rem;
          }
        }

        /* NOW BOARDING SECTION */
        .fexp-boarding {
          padding: 3rem 2rem;
          background: #0a0a0a;
        }

        .fexp-boarding__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .fexp-boarding__announcement {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .fexp-boarding__now {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.2em;
          text-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .fexp-boarding__call {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 0.5rem;
        }

        .fexp-boarding__board {
          margin-bottom: 1.5rem;
        }

        .fexp-boarding__board .exp-board {
          padding: 0;
          background: transparent;
        }

        .fexp-boarding__board .exp-board__container {
          max-width: 100%;
        }

        .fexp-boarding__board .exp-board__header {
          padding: 1rem 1.5rem;
        }

        .fexp-boarding__board .exp-board__title {
          font-size: 1rem;
        }

        .fexp-boarding__board .exp-board__cols {
          padding: 0.75rem 1.5rem;
          font-size: 0.65rem;
        }

        .fexp-boarding__board .exp-board__row {
          padding: 0.75rem 1.5rem;
        }

        .fexp-boarding__board .exp-board__dest {
          font-size: 1rem;
        }

        .fexp-boarding__board .exp-board__status--boarding {
          background: rgba(251, 191, 36, 0.3);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.5);
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        .fexp-boarding__cta {
          text-align: center;
        }

        @media (max-width: 768px) {
          .fexp-boarding {
            padding: 2rem 1rem;
          }

          .fexp-boarding__now {
            font-size: 1.25rem;
          }
        }

        /* 20. TRIP WAITLIST FORM */
        .fexp-newsletter {
          padding: 3rem 2rem;
          background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
        }

        .fexp-newsletter__container {
          max-width: 600px;
          margin: 0 auto;
        }

        .fexp-waitlist {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .fexp-waitlist__header {
          margin-bottom: 1.25rem;
        }

        .fexp-waitlist__header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .fexp-waitlist:not(.fexp-waitlist--expanded) .fexp-waitlist__header {
          margin-bottom: 0;
          cursor: pointer;
        }

        .fexp-waitlist:not(.fexp-waitlist--expanded) .fexp-waitlist__header-row {
          flex-wrap: wrap;
        }

        .fexp-waitlist--expanded .fexp-waitlist__header {
          text-align: center;
        }

        .fexp-waitlist--expanded .fexp-waitlist__header-row {
          justify-content: center;
        }

        .fexp-waitlist__header-text {
          flex: 1;
        }

        .fexp-waitlist--expanded .fexp-waitlist__header-text {
          flex: none;
        }

        .fexp-waitlist__header h3 {
          font-size: 1.25rem;
          margin: 0.25rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fexp-waitlist__header p {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.5;
          max-width: 450px;
          margin: 0.75rem auto 0;
        }

        .fexp-waitlist__expand-btn {
          white-space: nowrap;
          flex-shrink: 0;
        }

        .fexp-waitlist__progress {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .fexp-waitlist__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          opacity: 0.4;
          transition: opacity 0.3s;
        }

        .fexp-waitlist__step.active {
          opacity: 1;
        }

        .fexp-waitlist__step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e8e6e2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          transition: all 0.3s;
        }

        .fexp-waitlist__step.active .fexp-waitlist__step-num {
          background: #1a1a1a;
          color: #fff;
        }

        .fexp-waitlist__step-label {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fexp-waitlist__fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fexp-waitlist__field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.35rem;
        }

        .fexp-waitlist__field input,
        .fexp-waitlist__field select,
        .fexp-waitlist__field textarea {
          width: 100%;
          padding: 0.7rem 0.85rem;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          background: #fff;
        }

        .fexp-waitlist__field input:focus,
        .fexp-waitlist__field select:focus,
        .fexp-waitlist__field textarea:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.1);
        }

        .fexp-waitlist__field textarea {
          resize: vertical;
          min-height: 80px;
        }

        .fexp-waitlist__options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fexp-waitlist__option {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.85rem;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .fexp-waitlist__option:hover {
          border-color: #1a1a1a;
          background: #faf9f6;
        }

        .fexp-waitlist__option input {
          width: auto;
          margin: 0;
        }

        .fexp-waitlist__option input:checked + span {
          font-weight: 600;
        }

        .fexp-waitlist__destinations {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .fexp-waitlist__dest-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e8e6e2;
          border-radius: 25px;
          background: #fff;
          font-family: inherit;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fexp-waitlist__dest-btn:hover {
          border-color: #1a1a1a;
        }

        .fexp-waitlist__dest-btn.selected {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .fexp-waitlist__actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
        }

        .fexp-waitlist__success {
          text-align: center;
          padding: 1.5rem 0;
        }

        .fexp-waitlist__success-icon {
          width: 60px;
          height: 60px;
          background: #22c55e;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
        }

        .fexp-waitlist__success h3 {
          font-size: 1.75rem;
          margin: 0 0 0.75rem;
        }

        .fexp-waitlist__success > p {
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        .fexp-waitlist__success-next {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8f7f4;
          border-radius: 8px;
          text-align: left;
        }

        .fexp-waitlist__success-next span {
          font-weight: 700;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .fexp-waitlist__success-next ul {
          margin: 0;
          padding-left: 1.25rem;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.8;
        }

        @media (max-width: 768px) {
          .fexp-newsletter {
            padding: 3rem 1rem;
          }

          .fexp-waitlist {
            padding: 2rem 1.5rem;
          }

          .fexp-waitlist__header h3 {
            font-size: 1.5rem;
          }

          .fexp-waitlist__progress {
            gap: 1rem;
          }

          .fexp-waitlist__step-label {
            font-size: 0.65rem;
          }

          .fexp-waitlist__actions {
            flex-direction: column-reverse;
          }

          .fexp-waitlist__actions .fexp-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default FinalExpeditions;
