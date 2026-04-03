/**
 * PARALLAX PICKER - TRAINING SECTION VARIATIONS
 * 37 distinctive parallax designs for the Training section.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// PARALLAX SECTION COMPONENT
// ============================================

function ParallaxSection({
  image,
  alt,
  height = 400,
  overlayStyle = {},
  parallaxAmount = 15,
  imageFilter = 'none',
  contentAlign = 'center',
  borderRadius = 0,
  children,
  customOverlay = null,
  customStyles = {},
  className = '',
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${parallaxAmount}%`, `${parallaxAmount}%`]);

  const alignmentStyles = {
    left: { alignItems: 'flex-start', textAlign: 'left' },
    center: { alignItems: 'center', textAlign: 'center' },
    right: { alignItems: 'flex-end', textAlign: 'right' },
  };

  return (
    <section
      className={`parallax-var ${className}`}
      ref={sectionRef}
      style={{
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
        ...customStyles,
      }}
    >
      <div className="parallax-var__image-container">
        <motion.img
          src={image}
          alt={alt}
          className="parallax-var__image"
          style={{
            y,
            filter: imageFilter,
          }}
        />
      </div>

      {customOverlay || (
        <div className="parallax-var__overlay" style={overlayStyle} />
      )}

      <div
        className="parallax-var__content"
        style={{
          ...alignmentStyles[contentAlign],
        }}
      >
        {children}
      </div>
    </section>
  );
}

const IMAGES = {
  training1: '/assets/images/gallery/flying/flying-.jpg',
  training2: '/assets/images/gallery/carousel/rotating-4.jpg',
  training3: '/assets/images/gallery/carousel/rotating-3.jpg',
  training4: '/assets/images/gallery/carousel/rotating-2.jpg',
  training5: '/assets/images/gallery/carousel/rotating-1.jpg',
};

// ============================================
// 37 PARALLAX VARIATIONS
// ============================================

const parallaxVariations = [
  // 1: Editorial Minimalist (KEPT - good for about section with image watermark)
  {
    id: 'parallax-01',
    name: 'Editorial Minimalist',
    category: 'Minimal',
    desc: 'Clean magazine-style layout with refined typography',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
            <svg className="var-editorial__wave var-editorial__wave--tl" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M0,0 L200,0 L200,50 Q150,80 100,60 Q50,40 0,80 L0,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-editorial__wave var-editorial__wave--br" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M200,200 L0,200 L0,150 Q50,120 100,140 Q150,160 200,120 L200,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-editorial"
      >
        <div className="var-editorial__number">01</div>
        <div className="var-editorial__divider"></div>
        <span className="var-editorial__label">Flight Academy</span>
        <h2 className="var-editorial__title">TRAINING</h2>
        <p className="var-editorial__desc">Master the art of rotary flight</p>
      </ParallaxSection>
    ),
  },

  // 2: Newspaper Editorial (KEPT - big transparent text)
  {
    id: 'parallax-02',
    name: 'Newspaper Editorial',
    category: 'Editorial',
    desc: 'Classic newspaper layout with large transparent headline',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(245,243,240,0.92)' }}
        className="var-newspaper"
      >
        <div className="var-newspaper__bg-text">TRAINING</div>
        <div className="var-newspaper__header">
          <span className="var-newspaper__date">SECTION 01</span>
          <div className="var-newspaper__divider"></div>
          <span className="var-newspaper__edition">HQ AVIATION</span>
        </div>
        <h2 className="var-newspaper__title">Flight Training</h2>
        <div className="var-newspaper__subtitle">
          <span></span>
          <p>Professional helicopter instruction</p>
          <span></span>
        </div>
        <p className="var-newspaper__desc">Begin your journey to becoming a certified helicopter pilot with our comprehensive training programs.</p>
      </ParallaxSection>
    ),
  },

  // 3: Parallax Layers (KEPT - with wavy components top-left and bottom-right)
  {
    id: 'parallax-03',
    name: 'Parallax Layers',
    category: 'Texture',
    desc: 'Layered depth with wavy decorative elements',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-layers"
      >
        <svg className="var-layers__wave var-layers__wave--top" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0,50 Q100,0 200,50 T400,50 L400,0 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
        <svg className="var-layers__wave var-layers__wave--bottom" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0,50 Q100,100 200,50 T400,50 L400,100 L0,100 Z" fill="rgba(255,255,255,0.08)"/>
        </svg>
        <div className="var-layers__bg-text">TRAINING</div>
        <div className="var-layers__content">
          <span className="var-layers__number">01</span>
          <span className="var-layers__label">FLIGHT ACADEMY</span>
          <h2 className="var-layers__title">Training</h2>
          <p className="var-layers__desc">Professional helicopter instruction</p>
        </div>
      </ParallaxSection>
    ),
  },

  // 4: Halftone (KEPT - cool font)
  {
    id: 'parallax-04',
    name: 'Halftone',
    category: 'Texture',
    desc: 'Retro print halftone dot pattern with bold type',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        imageFilter="contrast(1.1) brightness(0.9)"
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(10,10,10,0.4)' }} />
            <div className="var-halftone__dots"></div>
          </>
        }
        className="var-halftone"
      >
        <span className="var-halftone__number">01</span>
        <h2 className="var-halftone__title">TRAINING</h2>
        <p className="var-halftone__desc">PROFESSIONAL HELICOPTER INSTRUCTION</p>
      </ParallaxSection>
    ),
  },

  // 5: Liquid Fluid (KEPT - with blur increasing away from text)
  {
    id: 'parallax-05',
    name: 'Liquid Fluid',
    category: 'Modern',
    desc: 'Organic fluid shapes with radial blur effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        className="var-liquid"
      >
        <div className="var-liquid__blur-overlay"></div>
        <div className="var-liquid__blob var-liquid__blob--1"></div>
        <div className="var-liquid__blob var-liquid__blob--2"></div>
        <span className="var-liquid__number">01</span>
        <span className="var-liquid__label">FLIGHT ACADEMY</span>
        <h2 className="var-liquid__title">Training</h2>
        <p className="var-liquid__desc">Professional helicopter instruction</p>
      </ParallaxSection>
    ),
  },

  // 6: White Strips (NEW - two white strips left, two right)
  {
    id: 'parallax-06',
    name: 'White Strips',
    category: 'Minimal',
    desc: 'Clean vertical white strips framing the content',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-strips"
      >
        <div className="var-strips__lines">
          <div className="var-strips__line var-strips__line--l1"></div>
          <div className="var-strips__line var-strips__line--l2"></div>
          <div className="var-strips__line var-strips__line--r1"></div>
          <div className="var-strips__line var-strips__line--r2"></div>
        </div>
        <span className="var-strips__number">01</span>
        <span className="var-strips__label">FLIGHT ACADEMY</span>
        <h2 className="var-strips__title">TRAINING</h2>
        <p className="var-strips__desc">Professional helicopter instruction</p>
      </ParallaxSection>
    ),
  },

  // 7: Glassmorphism Strips (NEW - frosted glass strips)
  {
    id: 'parallax-07',
    name: 'Glassmorphism Strips',
    category: 'Modern',
    desc: 'Frosted glass vertical strips with blur effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.3)' }}
        className="var-glass-strips"
      >
        <div className="var-glass-strips__lines">
          <div className="var-glass-strips__line var-glass-strips__line--l1"></div>
          <div className="var-glass-strips__line var-glass-strips__line--l2"></div>
          <div className="var-glass-strips__line var-glass-strips__line--r1"></div>
          <div className="var-glass-strips__line var-glass-strips__line--r2"></div>
        </div>
        <span className="var-glass-strips__number">01</span>
        <span className="var-glass-strips__label">FLIGHT ACADEMY</span>
        <h2 className="var-glass-strips__title">TRAINING</h2>
        <p className="var-glass-strips__desc">Professional helicopter instruction</p>
      </ParallaxSection>
    ),
  },

  // 8: Cinematic Letterbox
  {
    id: 'parallax-08',
    name: 'Cinematic Letterbox',
    category: 'Film',
    desc: 'Widescreen cinema bars with dramatic framing',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        className="var-cinema"
      >
        <div className="var-cinema__bar var-cinema__bar--top"></div>
        <div className="var-cinema__bar var-cinema__bar--bottom"></div>
        <span className="var-cinema__number">01</span>
        <h2 className="var-cinema__title">TRAINING</h2>
        <p className="var-cinema__desc">Your story begins here</p>
      </ParallaxSection>
    ),
  },

  // 9: Topographic Lines
  {
    id: 'parallax-09',
    name: 'Topographic Lines',
    category: 'Technical',
    desc: 'Terrain contour line aesthetic',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(10,25,40,0.85)' }}
        className="var-topo"
      >
        <div className="var-topo__lines"></div>
        <span className="var-topo__number">01</span>
        <span className="var-topo__label">ELEVATION</span>
        <h2 className="var-topo__title">TRAINING</h2>
        <p className="var-topo__desc">Navigate your path to certification</p>
      </ParallaxSection>
    ),
  },

  // 10: Aviation Gauge
  {
    id: 'parallax-10',
    name: 'Aviation Gauge',
    category: 'Technical',
    desc: 'Instrument panel inspired circular design',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(15,15,20,0.85)' }}
        className="var-gauge"
      >
        <div className="var-gauge__ring">
          <div className="var-gauge__ticks"></div>
          <div className="var-gauge__inner">
            <span className="var-gauge__number">01</span>
            <h2 className="var-gauge__title">TRAINING</h2>
            <span className="var-gauge__label">FLIGHT HOURS</span>
          </div>
        </div>
      </ParallaxSection>
    ),
  },

  // 11: Horizon Split
  {
    id: 'parallax-11',
    name: 'Horizon Split',
    category: 'Layout',
    desc: 'Sky meets ground with bold horizon line',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        className="var-horizon"
        customOverlay={
          <div className="var-horizon__overlay">
            <div className="var-horizon__sky"></div>
            <div className="var-horizon__line"></div>
            <div className="var-horizon__ground"></div>
          </div>
        }
      >
        <span className="var-horizon__number">01</span>
        <h2 className="var-horizon__title">TRAINING</h2>
        <p className="var-horizon__desc">Where earth meets sky</p>
      </ParallaxSection>
    ),
  },

  // 12: Radar Sweep
  {
    id: 'parallax-12',
    name: 'Radar Sweep',
    category: 'Technical',
    desc: 'Animated radar screen aesthetic',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,15,10,0.9)' }}
        className="var-radar"
      >
        <div className="var-radar__screen">
          <div className="var-radar__sweep"></div>
          <div className="var-radar__rings"></div>
          <div className="var-radar__content">
            <span className="var-radar__number">01</span>
            <h2 className="var-radar__title">TRAINING</h2>
            <span className="var-radar__label">LOCKED ON TARGET</span>
          </div>
        </div>
      </ParallaxSection>
    ),
  },

  // 13: Flight Logbook
  {
    id: 'parallax-13',
    name: 'Flight Logbook',
    category: 'Vintage',
    desc: 'Paper texture with ruled lines',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(245,240,230,0.95)' }}
        className="var-logbook"
      >
        <div className="var-logbook__lines"></div>
        <div className="var-logbook__margin"></div>
        <div className="var-logbook__content">
          <span className="var-logbook__date">Section 01</span>
          <h2 className="var-logbook__title">Training</h2>
          <p className="var-logbook__entry">Begin your journey as a helicopter pilot with professional instruction at Denham Aerodrome.</p>
        </div>
      </ParallaxSection>
    ),
  },

  // 14: Altitude Bands
  {
    id: 'parallax-14',
    name: 'Altitude Bands',
    category: 'Technical',
    desc: 'Horizontal gradient altitude stripes',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        className="var-altitude"
        customOverlay={
          <div className="var-altitude__bands">
            <div className="var-altitude__band" style={{background: 'rgba(0,50,100,0.7)'}}></div>
            <div className="var-altitude__band" style={{background: 'rgba(0,80,120,0.6)'}}></div>
            <div className="var-altitude__band" style={{background: 'rgba(0,100,150,0.5)'}}></div>
            <div className="var-altitude__band" style={{background: 'rgba(0,120,180,0.4)'}}></div>
            <div className="var-altitude__band" style={{background: 'rgba(100,180,220,0.3)'}}></div>
          </div>
        }
      >
        <span className="var-altitude__number">01</span>
        <span className="var-altitude__label">FLIGHT LEVEL</span>
        <h2 className="var-altitude__title">TRAINING</h2>
        <p className="var-altitude__desc">Reach new heights</p>
      </ParallaxSection>
    ),
  },

  // 15: Cockpit HUD
  {
    id: 'parallax-15',
    name: 'Cockpit HUD',
    category: 'Technical',
    desc: 'Heads-up display style interface',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.6)' }}
        className="var-hud"
      >
        <div className="var-hud__frame">
          <div className="var-hud__corner var-hud__corner--tl"></div>
          <div className="var-hud__corner var-hud__corner--tr"></div>
          <div className="var-hud__corner var-hud__corner--bl"></div>
          <div className="var-hud__corner var-hud__corner--br"></div>
        </div>
        <div className="var-hud__data var-hud__data--left">
          <span>ALT: 2500ft</span>
          <span>SPD: 120kts</span>
        </div>
        <div className="var-hud__data var-hud__data--right">
          <span>HDG: 270°</span>
          <span>VS: +500</span>
        </div>
        <span className="var-hud__number">01</span>
        <h2 className="var-hud__title">TRAINING</h2>
        <span className="var-hud__label">SYSTEM ACTIVE</span>
      </ParallaxSection>
    ),
  },

  // 16: Wind Tunnel
  {
    id: 'parallax-16',
    name: 'Wind Tunnel',
    category: 'Motion',
    desc: 'Speed lines streaming effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-wind"
      >
        <div className="var-wind__lines">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="var-wind__line" style={{animationDelay: `${i * 0.15}s`}}></div>
          ))}
        </div>
        <span className="var-wind__number">01</span>
        <h2 className="var-wind__title">TRAINING</h2>
        <p className="var-wind__desc">Feel the speed</p>
      </ParallaxSection>
    ),
  },

  // 17: Cloud Layers
  {
    id: 'parallax-17',
    name: 'Cloud Layers',
    category: 'Organic',
    desc: 'Soft cloud overlays at different depths',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'linear-gradient(to bottom, rgba(135,180,220,0.3), rgba(0,0,0,0.5))' }}
        className="var-clouds"
      >
        <div className="var-clouds__layer var-clouds__layer--1"></div>
        <div className="var-clouds__layer var-clouds__layer--2"></div>
        <span className="var-clouds__number">01</span>
        <span className="var-clouds__label">ABOVE THE CLOUDS</span>
        <h2 className="var-clouds__title">Training</h2>
        <p className="var-clouds__desc">Soar beyond limits</p>
      </ParallaxSection>
    ),
  },

  // 18: Departure Board
  {
    id: 'parallax-18',
    name: 'Departure Board',
    category: 'Retro',
    desc: 'Airport flip board typography',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(20,20,25,0.9)' }}
        className="var-departure"
      >
        <div className="var-departure__board">
          <div className="var-departure__row">
            <span className="var-departure__cell">01</span>
            <span className="var-departure__cell var-departure__cell--main">TRAINING</span>
            <span className="var-departure__cell">DENHAM</span>
          </div>
          <div className="var-departure__row var-departure__row--sub">
            <span>FLIGHT</span>
            <span>ACADEMY</span>
            <span>BOARDING</span>
          </div>
        </div>
      </ParallaxSection>
    ),
  },

  // 19: Compass Navigation
  {
    id: 'parallax-19',
    name: 'Compass Navigation',
    category: 'Technical',
    desc: 'Compass rose themed design',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(15,25,35,0.85)' }}
        className="var-compass"
      >
        <div className="var-compass__rose">
          <div className="var-compass__cardinal var-compass__cardinal--n">N</div>
          <div className="var-compass__cardinal var-compass__cardinal--e">E</div>
          <div className="var-compass__cardinal var-compass__cardinal--s">S</div>
          <div className="var-compass__cardinal var-compass__cardinal--w">W</div>
          <div className="var-compass__inner">
            <span className="var-compass__number">01</span>
            <h2 className="var-compass__title">TRAINING</h2>
          </div>
        </div>
        <p className="var-compass__desc">Find your direction</p>
      </ParallaxSection>
    ),
  },

  // 20: Aerial Grid
  {
    id: 'parallax-20',
    name: 'Aerial Grid',
    category: 'Technical',
    desc: 'Survey grid pattern overlay',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-grid"
      >
        <div className="var-grid__overlay"></div>
        <div className="var-grid__crosshair"></div>
        <span className="var-grid__coords">51.5751°N / 0.5059°W</span>
        <span className="var-grid__number">01</span>
        <h2 className="var-grid__title">TRAINING</h2>
        <p className="var-grid__desc">Precision mapping your future</p>
      </ParallaxSection>
    ),
  },

  // 21: Night Vision
  {
    id: 'parallax-21',
    name: 'Night Vision',
    category: 'Technical',
    desc: 'Green tactical night vision effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        imageFilter="brightness(1.2) contrast(1.1) saturate(0) sepia(1) hue-rotate(70deg)"
        overlayStyle={{ background: 'rgba(0,20,0,0.4)' }}
        className="var-nvg"
      >
        <div className="var-nvg__scanlines"></div>
        <div className="var-nvg__vignette"></div>
        <span className="var-nvg__number">01</span>
        <h2 className="var-nvg__title">TRAINING</h2>
        <span className="var-nvg__label">[ NVG ACTIVE ]</span>
      </ParallaxSection>
    ),
  },

  // 22: Sunset Gradient
  {
    id: 'parallax-22',
    name: 'Sunset Gradient',
    category: 'Organic',
    desc: 'Warm sunset horizon colors',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        className="var-sunset"
        customOverlay={
          <div className="var-sunset__gradient"></div>
        }
      >
        <span className="var-sunset__number">01</span>
        <span className="var-sunset__label">GOLDEN HOUR</span>
        <h2 className="var-sunset__title">Training</h2>
        <p className="var-sunset__desc">Chase the horizon</p>
      </ParallaxSection>
    ),
  },

  // 23: Carbon Fiber
  {
    id: 'parallax-23',
    name: 'Carbon Fiber',
    category: 'Premium',
    desc: 'Textured carbon fiber material',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(20,20,25,0.85)' }}
        className="var-carbon"
      >
        <div className="var-carbon__texture"></div>
        <span className="var-carbon__number">01</span>
        <span className="var-carbon__label">PRECISION ENGINEERED</span>
        <h2 className="var-carbon__title">TRAINING</h2>
        <p className="var-carbon__desc">Built for performance</p>
      </ParallaxSection>
    ),
  },

  // 24: Jet Stream
  {
    id: 'parallax-24',
    name: 'Jet Stream',
    category: 'Motion',
    desc: 'Flowing wind current patterns',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(10,20,40,0.7)' }}
        className="var-jetstream"
      >
        <svg className="var-jetstream__flow" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path className="var-jetstream__path" d="M-50,200 Q200,100 400,200 T850,200" />
          <path className="var-jetstream__path var-jetstream__path--2" d="M-50,250 Q200,150 400,250 T850,250" />
          <path className="var-jetstream__path var-jetstream__path--3" d="M-50,150 Q200,50 400,150 T850,150" />
        </svg>
        <span className="var-jetstream__number">01</span>
        <h2 className="var-jetstream__title">TRAINING</h2>
        <p className="var-jetstream__desc">Ride the current</p>
      </ParallaxSection>
    ),
  },

  // 25: Bold Horizon Line
  {
    id: 'parallax-25',
    name: 'Bold Horizon',
    category: 'Minimal',
    desc: 'Strong horizontal line emphasis',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-boldline"
      >
        <div className="var-boldline__line"></div>
        <span className="var-boldline__number">01</span>
        <h2 className="var-boldline__title">TRAINING</h2>
        <p className="var-boldline__desc">Draw the line to excellence</p>
      </ParallaxSection>
    ),
  },

  // 26: Flight Route
  {
    id: 'parallax-26',
    name: 'Flight Route',
    category: 'Technical',
    desc: 'Dotted flight path design',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.6)' }}
        className="var-route"
      >
        <svg className="var-route__path" viewBox="0 0 800 400">
          <circle cx="100" cy="300" r="8" fill="#fff"/>
          <path d="M100,300 Q250,100 400,200 T700,100" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" fill="none"/>
          <circle cx="700" cy="100" r="8" fill="#fff"/>
          <text x="100" y="340" fill="rgba(255,255,255,0.6)" fontSize="12">START</text>
          <text x="670" y="80" fill="rgba(255,255,255,0.6)" fontSize="12">CERTIFIED</text>
        </svg>
        <span className="var-route__number">01</span>
        <h2 className="var-route__title">TRAINING</h2>
        <p className="var-route__desc">Plot your course</p>
      </ParallaxSection>
    ),
  },

  // 27: Chrome Reflection
  {
    id: 'parallax-27',
    name: 'Chrome Reflection',
    category: 'Premium',
    desc: 'Metallic gradient shine effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'linear-gradient(135deg, rgba(40,40,50,0.9) 0%, rgba(80,80,90,0.7) 50%, rgba(40,40,50,0.9) 100%)' }}
        className="var-chrome"
      >
        <span className="var-chrome__number">01</span>
        <span className="var-chrome__label">PREMIUM EXPERIENCE</span>
        <h2 className="var-chrome__title">TRAINING</h2>
        <p className="var-chrome__desc">Polish your skills</p>
      </ParallaxSection>
    ),
  },

  // 28: Altitude Scale
  {
    id: 'parallax-28',
    name: 'Altitude Scale',
    category: 'Technical',
    desc: 'Vertical ruler measurement design',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.6)' }}
        className="var-scale"
      >
        <div className="var-scale__ruler">
          <div className="var-scale__mark"><span>5000</span></div>
          <div className="var-scale__mark"><span>4000</span></div>
          <div className="var-scale__mark"><span>3000</span></div>
          <div className="var-scale__mark"><span>2000</span></div>
          <div className="var-scale__mark"><span>1000</span></div>
        </div>
        <span className="var-scale__number">01</span>
        <h2 className="var-scale__title">TRAINING</h2>
        <p className="var-scale__desc">Measure your progress</p>
      </ParallaxSection>
    ),
  },

  // 29: Runway Stripes
  {
    id: 'parallax-29',
    name: 'Runway Stripes',
    category: 'Bold',
    desc: 'Airport runway marking stripes',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-runway"
      >
        <div className="var-runway__stripes">
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
        </div>
        <span className="var-runway__number">01</span>
        <h2 className="var-runway__title">TRAINING</h2>
        <span className="var-runway__designation">RWY 27</span>
      </ParallaxSection>
    ),
  },

  // 30: Control Tower
  {
    id: 'parallax-30',
    name: 'Control Tower',
    category: 'Layout',
    desc: 'Architectural tower framing',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-tower"
      >
        <div className="var-tower__frame">
          <div className="var-tower__window"></div>
        </div>
        <span className="var-tower__number">01</span>
        <h2 className="var-tower__title">TRAINING</h2>
        <p className="var-tower__desc">Command your future</p>
      </ParallaxSection>
    ),
  },

  // 31: Formation Flight
  {
    id: 'parallax-31',
    name: 'Formation Flight',
    category: 'Layout',
    desc: 'Multiple offset layered elements',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.6)' }}
        className="var-formation"
      >
        <div className="var-formation__layers">
          <span className="var-formation__shadow var-formation__shadow--3">TRAINING</span>
          <span className="var-formation__shadow var-formation__shadow--2">TRAINING</span>
          <span className="var-formation__shadow var-formation__shadow--1">TRAINING</span>
          <h2 className="var-formation__title">TRAINING</h2>
        </div>
        <span className="var-formation__number">01</span>
        <p className="var-formation__desc">Fly in formation</p>
      </ParallaxSection>
    ),
  },

  // 32: Throttle Quadrant
  {
    id: 'parallax-32',
    name: 'Throttle Quadrant',
    category: 'Technical',
    desc: 'Mechanical lever aesthetic',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(15,15,20,0.9)' }}
        className="var-throttle"
      >
        <div className="var-throttle__panel">
          <div className="var-throttle__lever">
            <div className="var-throttle__handle"></div>
            <div className="var-throttle__track"></div>
          </div>
          <div className="var-throttle__markings">
            <span>IDLE</span>
            <span>CRUISE</span>
            <span>MAX</span>
          </div>
        </div>
        <span className="var-throttle__number">01</span>
        <h2 className="var-throttle__title">TRAINING</h2>
        <span className="var-throttle__label">POWER UP</span>
      </ParallaxSection>
    ),
  },

  // 33: Sectional Chart
  {
    id: 'parallax-33',
    name: 'Sectional Chart',
    category: 'Technical',
    desc: 'Aviation navigation chart style',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(240,235,220,0.92)' }}
        className="var-chart"
      >
        <div className="var-chart__grid"></div>
        <div className="var-chart__airspace"></div>
        <span className="var-chart__number">01</span>
        <h2 className="var-chart__title">Training</h2>
        <p className="var-chart__desc">Chart your course to success</p>
        <span className="var-chart__airport">EGLD • DENHAM</span>
      </ParallaxSection>
    ),
  },

  // 34: Afterburner
  {
    id: 'parallax-34',
    name: 'Afterburner',
    category: 'Bold',
    desc: 'Fiery gradient intensity',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        className="var-afterburner"
        customOverlay={
          <div className="var-afterburner__gradient"></div>
        }
      >
        <span className="var-afterburner__number">01</span>
        <h2 className="var-afterburner__title">TRAINING</h2>
        <p className="var-afterburner__desc">Ignite your passion</p>
      </ParallaxSection>
    ),
  },

  // 35: Morse Code
  {
    id: 'parallax-35',
    name: 'Morse Code',
    category: 'Technical',
    desc: 'Dots and dashes communication pattern',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(10,15,25,0.85)' }}
        className="var-morse"
      >
        <div className="var-morse__code">
          <span className="var-morse__dash"></span>
          <span className="var-morse__dot"></span>
          <span className="var-morse__dot"></span>
          <span className="var-morse__dot"></span>
        </div>
        <span className="var-morse__number">01</span>
        <h2 className="var-morse__title">TRAINING</h2>
        <span className="var-morse__label">- .-. .- .. -. .. -. --.</span>
      </ParallaxSection>
    ),
  },

  // 36: Minimalist Corner
  {
    id: 'parallax-36',
    name: 'Minimalist Corner',
    category: 'Minimal',
    desc: 'Clean corner bracket framing',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
        className="var-corner"
      >
        <div className="var-corner__bracket var-corner__bracket--tl"></div>
        <div className="var-corner__bracket var-corner__bracket--br"></div>
        <span className="var-corner__number">01</span>
        <span className="var-corner__label">FLIGHT ACADEMY</span>
        <h2 className="var-corner__title">Training</h2>
        <p className="var-corner__desc">Framed for success</p>
      </ParallaxSection>
    ),
  },

  // 37: Double Exposure
  {
    id: 'parallax-37',
    name: 'Double Exposure',
    category: 'Artistic',
    desc: 'Overlapping imagery blend effect',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        className="var-double"
      >
        <div className="var-double__overlay-img" style={{backgroundImage: `url(${IMAGES.training1})`}}></div>
        <span className="var-double__number">01</span>
        <span className="var-double__label">DUAL PERSPECTIVE</span>
        <h2 className="var-double__title">TRAINING</h2>
        <p className="var-double__desc">See beyond the surface</p>
      </ParallaxSection>
    ),
  },

  // 38: Runway Stripes (black lines on image)
  {
    id: 'parallax-38',
    name: 'Runway Stripes',
    category: 'Aviation',
    desc: 'Black runway markings with heading numbers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.3)' }}
        className="var-runway"
      >
        <div className="var-runway__stripes">
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
          <div className="var-runway__stripe"></div>
        </div>
        <span className="var-runway__heading var-runway__heading--top">27</span>
        <span className="var-runway__heading var-runway__heading--bottom">09</span>
        <div className="var-runway__content">
          <span className="var-runway__label">FLIGHT ACADEMY</span>
          <h2 className="var-runway__title">TRAINING</h2>
          <p className="var-runway__desc">Clear for takeoff</p>
        </div>
      </ParallaxSection>
    ),
  },

  // 39: Runway Tarmac (stripes on tarmac-colored band)
  {
    id: 'parallax-39',
    name: 'Runway Tarmac',
    category: 'Aviation',
    desc: 'Runway stripes on asphalt-colored band',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={500}
        overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        className="var-tarmac"
      >
        <div className="var-tarmac__runway">
          <span className="var-tarmac__heading var-tarmac__heading--top">27</span>
          <div className="var-tarmac__stripes">
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
            <div className="var-tarmac__stripe"></div>
          </div>
          <span className="var-tarmac__heading var-tarmac__heading--bottom">09</span>
        </div>
        <div className="var-tarmac__content">
          <span className="var-tarmac__label">FLIGHT ACADEMY</span>
          <h2 className="var-tarmac__title">TRAINING</h2>
          <p className="var-tarmac__desc">Runway to the skies</p>
        </div>
      </ParallaxSection>
    ),
  },

  // 40: Wave Top
  {
    id: 'parallax-40',
    name: 'Wave Top',
    category: 'Waves',
    desc: 'Single white wave at top',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-wave-top__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,60 Q1080,120 720,60 Q360,0 0,60 L0,0 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 41: Wave Bottom
  {
    id: 'parallax-41',
    name: 'Wave Bottom',
    category: 'Waves',
    desc: 'Single white wave at bottom',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-wave-bottom__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,60 Q1080,0 720,60 Q360,120 0,60 L0,120 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 42: Double Wave
  {
    id: 'parallax-42',
    name: 'Double Wave',
    category: 'Waves',
    desc: 'Waves at top and bottom',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-double-wave__top" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,50 Q1200,100 960,50 Q720,0 480,50 Q240,100 0,50 L0,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-double-wave__bottom" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,50 Q1200,0 960,50 Q720,100 480,50 Q240,0 0,50 L0,100 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 43: Layered Waves
  {
    id: 'parallax-43',
    name: 'Layered Waves',
    category: 'Waves',
    desc: 'Multiple layered waves at bottom',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave var-layered__wave--1" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,100 Q1080,40 720,80 Q360,120 0,60 L0,150 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--2" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,110 Q1080,60 720,100 Q360,140 0,80 L0,150 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--3" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,120 Q1080,80 720,110 Q360,140 0,100 L0,150 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 44: Wave Sides
  {
    id: 'parallax-44',
    name: 'Wave Sides',
    category: 'Waves',
    desc: 'Vertical waves on left and right',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-wave-sides__left" viewBox="0 0 120 500" preserveAspectRatio="none">
              <path d="M0,0 L0,500 L60,500 Q120,400 60,300 Q0,200 60,100 Q120,0 60,0 L0,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-wave-sides__right" viewBox="0 0 120 500" preserveAspectRatio="none">
              <path d="M120,0 L120,500 L60,500 Q0,400 60,300 Q120,200 60,100 Q0,0 60,0 L120,0 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 45: Corner Waves
  {
    id: 'parallax-45',
    name: 'Corner Waves',
    category: 'Waves',
    desc: 'Waves in all four corners',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-corner-wave__tl" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M0,0 L200,0 L200,40 Q100,80 40,40 Q0,0 0,100 L0,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-corner-wave__tr" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M200,0 L0,0 L0,40 Q100,80 160,40 Q200,0 200,100 L200,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-corner-wave__bl" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M0,200 L200,200 L200,160 Q100,120 40,160 Q0,200 0,100 L0,200 Z" fill="#fff"/>
            </svg>
            <svg className="var-corner-wave__br" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M200,200 L0,200 L0,160 Q100,120 160,160 Q200,200 200,100 L200,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 46: Diagonal Wave
  {
    id: 'parallax-46',
    name: 'Diagonal Wave',
    category: 'Waves',
    desc: 'Wave cutting diagonally across',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-diagonal__wave" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 L0,70 Q25,60 50,70 Q75,80 100,65 L100,100 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 47: Blob Wave
  {
    id: 'parallax-47',
    name: 'Blob Wave',
    category: 'Waves',
    desc: 'Organic blob shapes in corners',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-blob__shape var-blob__shape--tl" viewBox="0 0 200 200">
              <path d="M0,0 Q80,-20 120,60 Q160,140 80,160 Q0,180 -20,100 Q-40,20 0,0 Z" fill="#fff"/>
            </svg>
            <svg className="var-blob__shape var-blob__shape--br" viewBox="0 0 200 200">
              <path d="M200,200 Q120,220 80,140 Q40,60 120,40 Q200,20 220,100 Q240,180 200,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 48: Sharp Waves
  {
    id: 'parallax-48',
    name: 'Sharp Waves',
    category: 'Waves',
    desc: 'Angular zigzag wave pattern',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-sharp__wave var-sharp__wave--top" viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,40 L1200,80 L960,40 L720,80 L480,40 L240,80 L0,40 Z" fill="#fff"/>
            </svg>
            <svg className="var-sharp__wave var-sharp__wave--bottom" viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 L1440,80 L1440,40 L1200,0 L960,40 L720,0 L480,40 L240,0 L0,40 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 49: Gradient Wave
  {
    id: 'parallax-49',
    name: 'Gradient Wave',
    category: 'Waves',
    desc: 'Wave with gradient fill',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-gradient-wave__svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
                </linearGradient>
              </defs>
              <path d="M0,200 L1440,200 L1440,100 Q1080,0 720,100 Q360,200 0,100 L0,200 Z" fill="url(#waveGrad)"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 50: Thick Wave
  {
    id: 'parallax-50',
    name: 'Thick Wave',
    category: 'Waves',
    desc: 'Bold thick wave at bottom',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.3)' }} />
            <svg className="var-thick__wave" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path d="M0,250 L1440,250 L1440,80 Q1080,0 720,120 Q360,240 0,100 L0,250 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 51: Subtle Wave
  {
    id: 'parallax-51',
    name: 'Subtle Wave',
    category: 'Waves',
    desc: 'Gentle subtle wave',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-subtle__wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,60 L1440,60 L1440,40 Q1080,20 720,40 Q360,60 0,35 L0,60 Z" fill="rgba(255,255,255,0.8)"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 52: Wave Frame
  {
    id: 'parallax-52',
    name: 'Wave Frame',
    category: 'Waves',
    desc: 'Waves framing all edges',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="var-frame__waves">
              <svg className="var-frame__top" viewBox="0 0 1440 50" preserveAspectRatio="none">
                <path d="M0,0 L1440,0 L1440,30 Q720,60 0,30 Z" fill="#fff"/>
              </svg>
              <svg className="var-frame__bottom" viewBox="0 0 1440 50" preserveAspectRatio="none">
                <path d="M0,50 L1440,50 L1440,20 Q720,-10 0,20 Z" fill="#fff"/>
              </svg>
              <svg className="var-frame__left" viewBox="0 0 50 500" preserveAspectRatio="none">
                <path d="M0,0 L0,500 L30,500 Q60,250 30,0 Z" fill="#fff"/>
              </svg>
              <svg className="var-frame__right" viewBox="0 0 50 500" preserveAspectRatio="none">
                <path d="M50,0 L50,500 L20,500 Q-10,250 20,0 Z" fill="#fff"/>
              </svg>
            </div>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 53: Overlapping Waves
  {
    id: 'parallax-53',
    name: 'Overlapping Waves',
    category: 'Waves',
    desc: 'Multiple overlapping wave layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.3)' }} />
            <svg className="var-overlap__wave var-overlap__wave--1" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,150 Q1200,50 960,120 Q720,190 480,100 Q240,10 0,80 L0,200 Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <svg className="var-overlap__wave var-overlap__wave--2" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,120 Q1200,180 960,80 Q720,0 480,100 Q240,180 0,120 L0,200 Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
            <svg className="var-overlap__wave var-overlap__wave--3" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,160 Q1080,100 720,140 Q360,180 0,140 L0,200 Z" fill="rgba(255,255,255,0.7)"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 54: Single Side Wave
  {
    id: 'parallax-54',
    name: 'Single Side Wave',
    category: 'Waves',
    desc: 'Wave on left side only',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-single-side__wave" viewBox="0 0 200 500" preserveAspectRatio="none">
              <path d="M0,0 L0,500 L100,500 Q200,400 100,300 Q0,200 100,100 Q200,0 100,0 L0,0 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 55: Wave Cutout
  {
    id: 'parallax-55',
    name: 'Wave Cutout',
    category: 'Waves',
    desc: 'White with wave cutout revealing image',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <svg className="var-cutout__mask" viewBox="0 0 1440 500" preserveAspectRatio="none">
              <defs>
                <mask id="waveCutout">
                  <rect width="1440" height="500" fill="white"/>
                  <ellipse cx="720" cy="250" rx="400" ry="180" fill="black"/>
                </mask>
              </defs>
              <rect width="1440" height="500" fill="rgba(255,255,255,0.95)" mask="url(#waveCutout)"/>
            </svg>
          </>
        }
        className="var-wave-common var-cutout"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 56: Ripple Waves
  {
    id: 'parallax-56',
    name: 'Ripple Waves',
    category: 'Waves',
    desc: 'Concentric ripple pattern',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="var-ripple__circles">
              <div className="var-ripple__circle var-ripple__circle--1"></div>
              <div className="var-ripple__circle var-ripple__circle--2"></div>
              <div className="var-ripple__circle var-ripple__circle--3"></div>
            </div>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 57: Wave Stripes
  {
    id: 'parallax-57',
    name: 'Wave Stripes',
    category: 'Waves',
    desc: 'Multiple thin wave stripes',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="var-wave-stripes__container">
              <svg className="var-wave-stripes__line" viewBox="0 0 1440 20" preserveAspectRatio="none">
                <path d="M0,10 Q360,0 720,10 Q1080,20 1440,10" stroke="#fff" strokeWidth="2" fill="none"/>
              </svg>
              <svg className="var-wave-stripes__line" viewBox="0 0 1440 20" preserveAspectRatio="none">
                <path d="M0,10 Q360,20 720,10 Q1080,0 1440,10" stroke="#fff" strokeWidth="2" fill="none"/>
              </svg>
              <svg className="var-wave-stripes__line" viewBox="0 0 1440 20" preserveAspectRatio="none">
                <path d="M0,10 Q360,0 720,10 Q1080,20 1440,10" stroke="#fff" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 58: Asymmetric Wave
  {
    id: 'parallax-58',
    name: 'Asymmetric Wave',
    category: 'Waves',
    desc: 'Uneven asymmetric wave design',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-asym__wave-top" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,0 L400,0 L400,80 Q500,150 700,60 Q900,-30 1000,50 L1000,0 L1440,0 L1440,30 Q1200,80 1000,30 L1000,50 Q900,-30 700,60 Q500,150 400,80 L400,0 L0,0 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 59: Wave Portal
  {
    id: 'parallax-59',
    name: 'Wave Portal',
    category: 'Waves',
    desc: 'Waves forming a portal shape',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-portal__frame" viewBox="0 0 1440 500" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,500 L0,500 Z M200,50 Q720,100 1240,50 L1240,450 Q720,400 200,450 Z" fill="#fff" fillRule="evenodd"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // ============================================
  // LAYERED WAVE VARIATIONS (60-79)
  // Based on parallax-43, varying style and intensity
  // ============================================

  // 60: Layered Waves - Tall & Dramatic
  {
    id: 'parallax-60',
    name: 'Layered Tall',
    category: 'Layered Waves',
    desc: 'Tall dramatic layered waves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave var-layered__wave--1" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path d="M0,250 L1440,250 L1440,120 Q1080,20 720,100 Q360,180 0,60 L0,250 Z" fill="rgba(255,255,255,0.2)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--2" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path d="M0,250 L1440,250 L1440,150 Q1080,60 720,130 Q360,200 0,100 L0,250 Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--3" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path d="M0,250 L1440,250 L1440,180 Q1080,100 720,160 Q360,220 0,140 L0,250 Z" fill="rgba(255,255,255,0.7)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--4" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path d="M0,250 L1440,250 L1440,210 Q1080,150 720,190 Q360,230 0,180 L0,250 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 61: Layered Waves - Subtle & Thin
  {
    id: 'parallax-61',
    name: 'Layered Subtle',
    category: 'Layered Waves',
    desc: 'Subtle thin layered waves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave var-layered__wave--1" viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 L1440,80 L1440,50 Q1080,30 720,50 Q360,70 0,40 L0,80 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--2" viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 L1440,80 L1440,60 Q1080,45 720,60 Q360,75 0,55 L0,80 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave var-layered__wave--3" viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 L1440,80 L1440,70 Q1080,60 720,70 Q360,80 0,65 L0,80 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 62: Layered Waves - Five Layers
  {
    id: 'parallax-62',
    name: 'Layered Five',
    category: 'Layered Waves',
    desc: 'Five layered waves gradient',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,80 Q1080,40 720,80 Q360,120 0,60 L0,200 Z" fill="rgba(255,255,255,0.15)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,100 Q1080,60 720,100 Q360,140 0,80 L0,200 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,120 Q1080,80 720,120 Q360,160 0,100 L0,200 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,150 Q1080,110 720,150 Q360,180 0,130 L0,200 Z" fill="rgba(255,255,255,0.75)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,175 Q1080,150 720,175 Q360,195 0,160 L0,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 63: Layered Waves - Two Layers Bold
  {
    id: 'parallax-63',
    name: 'Layered Duo',
    category: 'Layered Waves',
    desc: 'Two bold layered waves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,80 Q1080,0 720,80 Q360,160 0,40 L0,180 Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,140 Q1080,80 720,130 Q360,170 0,100 L0,180 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 64: Layered Waves - Top Position
  {
    id: 'parallax-64',
    name: 'Layered Top',
    category: 'Layered Waves',
    desc: 'Layered waves at top',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered-top__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,50 Q1080,110 720,70 Q360,30 0,90 L0,0 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered-top__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,40 Q1080,90 720,50 Q360,10 0,70 L0,0 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered-top__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,25 Q1080,60 720,35 Q360,10 0,50 L0,0 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 65: Layered Waves - Top & Bottom
  {
    id: 'parallax-65',
    name: 'Layered Both',
    category: 'Layered Waves',
    desc: 'Layered waves top and bottom',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            {/* Top waves */}
            <svg className="var-layered-top__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,40 Q1080,80 720,50 Q360,20 0,60 L0,0 Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
            <svg className="var-layered-top__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,25 Q1080,50 720,30 Q360,10 0,40 L0,0 Z" fill="#fff"/>
            </svg>
            {/* Bottom waves */}
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,60 Q1080,20 720,50 Q360,80 0,40 L0,100 Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,75 Q1080,50 720,70 Q360,90 0,60 L0,100 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 66: Layered Waves - Aggressive Curves
  {
    id: 'parallax-66',
    name: 'Layered Aggressive',
    category: 'Layered Waves',
    desc: 'Sharp aggressive wave curves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,60 Q1200,180 960,40 Q720,160 480,20 Q240,140 0,80 L0,200 Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,100 Q1200,180 960,80 Q720,160 480,60 Q240,140 0,120 L0,200 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,150 Q1200,180 960,130 Q720,170 480,120 Q240,160 0,160 L0,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 67: Layered Waves - Gentle Curves
  {
    id: 'parallax-67',
    name: 'Layered Gentle',
    category: 'Layered Waves',
    desc: 'Soft gentle wave curves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 68: Layered Waves - Reverse Opacity
  {
    id: 'parallax-68',
    name: 'Layered Reverse',
    category: 'Layered Waves',
    desc: 'Solid to transparent gradient',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,100 Q1080,40 720,80 Q360,120 0,60 L0,150 Z" fill="#fff"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,110 Q1080,60 720,100 Q360,140 0,80 L0,150 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,125 Q1080,90 720,120 Q360,145 0,105 L0,150 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 69: Layered Waves - High Frequency
  {
    id: 'parallax-69',
    name: 'Layered Ripple',
    category: 'Layered Waves',
    desc: 'High frequency ripple waves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,60 Q1320,90 1200,50 Q1080,80 960,40 Q840,70 720,50 Q600,80 480,40 Q360,70 240,50 Q120,80 0,55 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,80 Q1320,100 1200,70 Q1080,95 960,65 Q840,90 720,70 Q600,95 480,65 Q360,90 240,70 Q120,95 0,75 L0,120 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1320,110 1200,95 Q1080,108 960,92 Q840,105 720,95 Q600,108 480,92 Q360,105 240,95 Q120,108 0,98 L0,120 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 70: Layered Waves - Asymmetric
  {
    id: 'parallax-70',
    name: 'Layered Asymmetric',
    category: 'Layered Waves',
    desc: 'Asymmetric uneven layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,140 Q1200,40 800,100 Q400,160 0,60 L0,180 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,120 Q1100,160 700,80 Q300,140 0,100 L0,180 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,160 Q1000,120 600,150 Q200,170 0,140 L0,180 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 71: Layered Waves - Stacked Tight
  {
    id: 'parallax-71',
    name: 'Layered Stacked',
    category: 'Layered Waves',
    desc: 'Tightly stacked wave layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,40 Q1080,60 720,30 Q360,50 0,45 L0,100 Z" fill="rgba(255,255,255,0.2)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,50 Q1080,65 720,45 Q360,60 0,55 L0,100 Z" fill="rgba(255,255,255,0.35)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,60 Q1080,70 720,55 Q360,68 0,65 L0,100 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,70 Q1080,78 720,68 Q360,76 0,75 L0,100 Z" fill="rgba(255,255,255,0.7)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0,100 L1440,100 L1440,82 Q1080,88 720,80 Q360,86 0,85 L0,100 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 72: Layered Waves - Wide Spacing
  {
    id: 'parallax-72',
    name: 'Layered Spaced',
    category: 'Layered Waves',
    desc: 'Wide spaced wave layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 300" preserveAspectRatio="none">
              <path d="M0,300 L1440,300 L1440,100 Q1080,40 720,100 Q360,160 0,60 L0,300 Z" fill="rgba(255,255,255,0.2)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 300" preserveAspectRatio="none">
              <path d="M0,300 L1440,300 L1440,200 Q1080,150 720,200 Q360,250 0,170 L0,300 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 300" preserveAspectRatio="none">
              <path d="M0,300 L1440,300 L1440,270 Q1080,250 720,270 Q360,285 0,260 L0,300 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 73: Layered Waves - Left Weighted
  {
    id: 'parallax-73',
    name: 'Layered Left',
    category: 'Layered Waves',
    desc: 'Waves weighted to left side',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,130 Q1200,100 800,120 Q400,60 0,20 L0,150 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,140 Q1200,120 800,135 Q400,90 0,60 L0,150 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,145 Q1200,138 800,145 Q400,120 0,100 L0,150 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 74: Layered Waves - Right Weighted
  {
    id: 'parallax-74',
    name: 'Layered Right',
    category: 'Layered Waves',
    desc: 'Waves weighted to right side',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,20 Q1040,60 640,120 Q240,100 0,130 L0,150 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,60 Q1040,90 640,135 Q240,120 0,140 L0,150 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0,150 L1440,150 L1440,100 Q1040,120 640,145 Q240,138 0,145 L0,150 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 75: Layered Waves - Zigzag Layers
  {
    id: 'parallax-75',
    name: 'Layered Zigzag',
    category: 'Layered Waves',
    desc: 'Sharp zigzag layered pattern',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,50 L1200,80 L960,40 L720,70 L480,30 L240,60 L0,45 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 L1200,90 L960,65 L720,85 L480,60 L240,80 L0,70 L0,120 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,95 L1200,105 L960,92 L720,102 L480,90 L240,100 L0,95 L0,120 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 76: Layered Waves - Minimal Two
  {
    id: 'parallax-76',
    name: 'Layered Minimal',
    category: 'Layered Waves',
    desc: 'Minimal two thin layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,60 L1440,60 L1440,30 Q1080,15 720,30 Q360,45 0,25 L0,60 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,60 L1440,60 L1440,45 Q1080,38 720,48 Q360,55 0,42 L0,60 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 77: Layered Waves - Ocean Swell
  {
    id: 'parallax-77',
    name: 'Layered Swell',
    category: 'Layered Waves',
    desc: 'Ocean swell style waves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,120 C1320,80 1200,140 1080,100 C960,60 840,120 720,80 C600,40 480,100 360,60 C240,20 120,80 0,50 L0,200 Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,150 C1320,120 1200,160 1080,130 C960,100 840,140 720,110 C600,80 480,120 360,90 C240,60 120,100 0,80 L0,200 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,175 C1320,160 1200,180 1080,165 C960,150 840,170 720,155 C600,140 480,160 360,145 C240,130 120,150 0,140 L0,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 78: Layered Waves - Feathered Edge
  {
    id: 'parallax-78',
    name: 'Layered Feather',
    category: 'Layered Waves',
    desc: 'Soft feathered edge layers',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,90 Q1360,70 1280,85 Q1200,100 1120,80 Q1040,60 960,75 Q880,90 800,70 Q720,50 640,65 Q560,80 480,60 Q400,40 320,55 Q240,70 160,50 Q80,30 0,45 L0,180 Z" fill="rgba(255,255,255,0.2)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,120 Q1360,105 1280,115 Q1200,125 1120,110 Q1040,95 960,105 Q880,115 800,100 Q720,85 640,95 Q560,105 480,90 Q400,75 320,85 Q240,95 160,80 Q80,65 0,75 L0,180 Z" fill="rgba(255,255,255,0.45)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,150 Q1360,140 1280,148 Q1200,155 1120,145 Q1040,135 960,143 Q880,150 800,140 Q720,130 640,138 Q560,145 480,135 Q400,125 320,133 Q240,140 160,130 Q80,120 0,128 L0,180 Z" fill="rgba(255,255,255,0.7)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,180 L1440,180 L1440,168 Q1200,162 960,170 Q720,175 480,167 Q240,160 0,165 L0,180 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 79: Layered Waves - Dramatic Peak
  {
    id: 'parallax-79',
    name: 'Layered Peak',
    category: 'Layered Waves',
    desc: 'Central dramatic wave peak',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,150 Q1200,180 960,100 Q720,20 480,100 Q240,180 0,150 L0,200 Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,170 Q1200,185 960,130 Q720,70 480,130 Q240,185 0,170 L0,200 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,185 Q1200,192 960,160 Q720,120 480,160 Q240,192 0,185 L0,200 Z" fill="rgba(255,255,255,0.75)"/>
            </svg>
            <svg className="var-layered__wave" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,200 L1440,200 L1440,195 Q1200,198 960,180 Q720,160 480,180 Q240,198 0,195 L0,200 Z" fill="#fff"/>
            </svg>
          </>
        }
        className="var-wave-common"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // ============================================
  // TYPOGRAPHY VARIATIONS (80-99)
  // 20 distinctive font combinations with waves
  // ============================================

  // 80: Didot Elegance - Classic editorial luxury
  {
    id: 'parallax-80',
    name: 'Didot Elegance',
    category: 'Typography',
    desc: 'Classic editorial luxury with high contrast serif',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--80"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 81: Futura Bold - Geometric modernist
  {
    id: 'parallax-81',
    name: 'Futura Bold',
    category: 'Typography',
    desc: 'Geometric modernist with clean precision',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--81"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 82: Playfair Display - Romantic serif
  {
    id: 'parallax-82',
    name: 'Playfair Romantic',
    category: 'Typography',
    desc: 'Romantic transitional serif with dramatic contrast',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--82"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 83: Oswald Condensed - Athletic impact
  {
    id: 'parallax-83',
    name: 'Oswald Athletic',
    category: 'Typography',
    desc: 'Condensed athletic impact with vertical emphasis',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--83"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 84: Cormorant Garamond - French elegance
  {
    id: 'parallax-84',
    name: 'Cormorant French',
    category: 'Typography',
    desc: 'Refined French elegance with delicate serifs',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--84"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 85: Archivo Black - Industrial strength
  {
    id: 'parallax-85',
    name: 'Archivo Industrial',
    category: 'Typography',
    desc: 'Industrial strength with heavy weight',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--85"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 86: Libre Baskerville - Classic literary
  {
    id: 'parallax-86',
    name: 'Baskerville Literary',
    category: 'Typography',
    desc: 'Classic literary with timeless appeal',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--86"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 87: Monoton - Retro display
  {
    id: 'parallax-87',
    name: 'Monoton Retro',
    category: 'Typography',
    desc: 'Retro inline display with vintage flair',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--87"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 88: Crimson Pro - Refined reading
  {
    id: 'parallax-88',
    name: 'Crimson Refined',
    category: 'Typography',
    desc: 'Refined reading serif with warmth',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--88"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 89: Righteous - Art deco rounded
  {
    id: 'parallax-89',
    name: 'Righteous Deco',
    category: 'Typography',
    desc: 'Art deco rounded with geometric curves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--89"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 90: Spectral - Modern transitional
  {
    id: 'parallax-90',
    name: 'Spectral Modern',
    category: 'Typography',
    desc: 'Modern transitional with screen optimization',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--90"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 91: Abril Fatface - Poster bold
  {
    id: 'parallax-91',
    name: 'Abril Poster',
    category: 'Typography',
    desc: 'Bold poster face with dramatic presence',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--91"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 92: Josefin Sans - Vintage geometric
  {
    id: 'parallax-92',
    name: 'Josefin Vintage',
    category: 'Typography',
    desc: 'Vintage geometric sans with elegance',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--92"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 93: Lora - Contemporary serif
  {
    id: 'parallax-93',
    name: 'Lora Contemporary',
    category: 'Typography',
    desc: 'Contemporary serif with brushed curves',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--93"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 94: Raleway - Elegant thin
  {
    id: 'parallax-94',
    name: 'Raleway Elegant',
    category: 'Typography',
    desc: 'Elegant ultra-thin with refined lines',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--94"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 95: Merriweather - Readable serif
  {
    id: 'parallax-95',
    name: 'Merriweather Readable',
    category: 'Typography',
    desc: 'Highly readable serif with pleasant weight',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--95"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 96: Staatliches - Bold display
  {
    id: 'parallax-96',
    name: 'Staatliches Bold',
    category: 'Typography',
    desc: 'Bold display with German Bauhaus influence',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--96"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 97: Vollkorn - Warm text
  {
    id: 'parallax-97',
    name: 'Vollkorn Warm',
    category: 'Typography',
    desc: 'Warm text face with organic character',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--97"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 98: Cinzel - Ancient capitals
  {
    id: 'parallax-98',
    name: 'Cinzel Ancient',
    category: 'Typography',
    desc: 'Ancient Roman capitals with classical dignity',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--98"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },

  // 99: Italiana - Fashion forward
  {
    id: 'parallax-99',
    name: 'Italiana Fashion',
    category: 'Typography',
    desc: 'Fashion forward with runway elegance',
    render: () => (
      <ParallaxSection
        image={IMAGES.training1}
        alt="Training"
        height={400}
        customOverlay={
          <>
            <div className="parallax-var__overlay" style={{ background: 'rgba(0,0,0,0.45)' }} />
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
            </svg>
            <svg className="var-typo__wave var-typo__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </>
        }
        className="var-typo var-typo--99"
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">Training</h2>
        <p className="parallax-section__text">From first flight to commercial certification</p>
      </ParallaxSection>
    ),
  },
];

// ============================================
// PICKER COMPONENT
// ============================================

function ParallaxPicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('parallax-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const displayedVariations = showFavoritesOnly
    ? parallaxVariations.filter(v => favorites.includes(v.id))
    : parallaxVariations;

  const currentVariation = displayedVariations[currentIndex] || displayedVariations[0];

  useEffect(() => {
    localStorage.setItem('parallax-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentIndex >= displayedVariations.length) {
      setCurrentIndex(Math.max(0, displayedVariations.length - 1));
    }
  }, [displayedVariations.length, currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % displayedVariations.length);
  }, [displayedVariations.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + displayedVariations.length) % displayedVariations.length);
  }, [displayedVariations.length]);

  const toggleFavorite = useCallback(() => {
    if (!currentVariation) return;
    setFavorites(prev =>
      prev.includes(currentVariation.id)
        ? prev.filter(id => id !== currentVariation.id)
        : [...prev, currentVariation.id]
    );
  }, [currentVariation]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowRight': goToNext(); break;
        case 'ArrowLeft': goToPrev(); break;
        case 'f': case 'F': toggleFavorite(); break;
        case 'm': case 'M': setIsMinimized(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, toggleFavorite]);

  const isFavorite = currentVariation && favorites.includes(currentVariation.id);

  // Check if current variation is a wave (40-59)
  const isWaveVariation = currentVariation && parseInt(currentVariation.id.replace('parallax-', '')) >= 40;

  return (
    <div className="parallax-picker-page">
      <style>{styles}</style>

      <div className="parallax-preview">
        {isWaveVariation && (
          <div className="picker-spacer">
            <span className="picker-spacer__text">Content Above</span>
          </div>
        )}
        {currentVariation && currentVariation.render()}
        {isWaveVariation && (
          <div className="picker-spacer">
            <span className="picker-spacer__text">Content Below</span>
          </div>
        )}
      </div>

      <div className={`picker ${isMinimized ? 'minimized' : ''}`}>
        <div className="picker__collapsed-bar" onClick={() => setIsMinimized(false)}>
          <div className="picker__collapsed-info">
            <span className="picker__collapsed-name">{currentVariation?.name}</span>
            <span className="picker__collapsed-counter">{currentIndex + 1}/{displayedVariations.length}</span>
          </div>
          <div className="picker__collapsed-nav">
            <button className="picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goToPrev(); }}>←</button>
            <button className="picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goToNext(); }}>→</button>
          </div>
        </div>

        <div className="picker__main">
          <div className="picker__header">
            <h3 className="picker__title">Parallax Variations</h3>
            <button className="picker__minimize" onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="picker__content">
            <div className="picker__info">
              <span className="picker__id">{currentVariation?.id}</span>
              <h4 className="picker__name">{currentVariation?.name}</h4>
              <span className="picker__category">{currentVariation?.category}</span>
              <p className="picker__desc">{currentVariation?.desc}</p>
            </div>

            <div className="picker__nav">
              <button className="picker__btn" onClick={goToPrev}>← Prev</button>
              <span className="picker__counter">{currentIndex + 1} / {displayedVariations.length}</span>
              <button className="picker__btn" onClick={goToNext}>Next →</button>
            </div>

            <div className="picker__actions">
              <button
                className={`picker__fav ${isFavorite ? 'picker__fav--active' : ''}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '★ Favorited' : '☆ Favorite'}
              </button>
              <button
                className={`picker__filter ${showFavoritesOnly ? 'picker__filter--active' : ''}`}
                onClick={() => setShowFavoritesOnly(prev => !prev)}
              >
                {showFavoritesOnly ? 'Show All' : `Favorites (${favorites.length})`}
              </button>
            </div>

            <div className="picker__shortcuts">
              <span>← → Navigate</span>
              <span>F Favorite</span>
              <span>M Minimize</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Bebas+Neue&family=Cormorant+Garamond:wght@400;500;600&family=Archivo+Black&family=DM+Serif+Display&family=Oswald:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;700&family=Caveat:wght@400;500;600;700&family=Abril+Fatface&family=Cinzel:wght@400;500;600;700&family=Crimson+Pro:wght@400;500;600;700&family=Italiana&family=Josefin+Sans:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700;900&family=Monoton&family=Raleway:wght@100;200;300;400;500;600;700&family=Righteous&family=Spectral:wght@400;500;600;700&family=Staatliches&family=Vollkorn:wght@400;500;600;700&display=swap');

  .parallax-picker-page {
    min-height: 100vh;
    background: #0a0a0a;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }

  .parallax-preview {
    padding: 100vh 0;
  }

  /* ===== BASE PARALLAX STYLES ===== */
  .parallax-var {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100vw;
    clip-path: inset(0);
  }

  .parallax-var__image-container {
    position: absolute;
    inset: -20%;
    z-index: 0;
  }

  .parallax-var__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .parallax-var__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .parallax-var__content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    width: 100%;
    color: #fff;
  }

  /* ===== 1: EDITORIAL MINIMALIST ===== */
  .var-editorial .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-editorial__wave {
    position: absolute;
    width: 250px;
    height: 250px;
    z-index: 2;
    pointer-events: none;
  }

  .var-editorial__wave--tl {
    top: 0;
    left: 0;
  }

  .var-editorial__wave--br {
    bottom: 0;
    right: 0;
  }

  .var-editorial__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 1rem;
  }

  .var-editorial__divider {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent);
    margin-bottom: 1.5rem;
  }

  .var-editorial__label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    font-style: italic;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.75rem;
  }

  .var-editorial__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.15em;
    line-height: 0.9;
    margin: 0 0 1rem;
  }

  .var-editorial__desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  /* ===== 2: NEWSPAPER EDITORIAL ===== */
  .var-newspaper .parallax-var__content {
    align-items: center;
    text-align: center;
    color: #1a1a1a;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  .var-newspaper__bg-text {
    position: absolute;
    font-family: 'Playfair Display', serif;
    font-size: clamp(6rem, 18vw, 14rem);
    font-weight: 700;
    color: rgba(0,0,0,0.04);
    letter-spacing: 0.02em;
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
  }

  .var-newspaper__header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .var-newspaper__date,
  .var-newspaper__edition {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: #666;
  }

  .var-newspaper__divider {
    width: 1px;
    height: 12px;
    background: #ccc;
  }

  .var-newspaper__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 7vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    color: #1a1a1a;
    position: relative;
    z-index: 1;
  }

  .var-newspaper__subtitle {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .var-newspaper__subtitle span {
    flex: 1;
    height: 1px;
    background: #1a1a1a;
  }

  .var-newspaper__subtitle p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-style: italic;
    color: #444;
    margin: 0;
    white-space: nowrap;
  }

  .var-newspaper__desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    line-height: 1.7;
    color: #333;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  /* ===== 3: PARALLAX LAYERS ===== */
  .var-layers .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-layers__wave {
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }

  .var-layers__wave--top {
    top: 0;
    left: 0;
    width: 40%;
    height: auto;
  }

  .var-layers__wave--bottom {
    bottom: 0;
    right: 0;
    width: 40%;
    height: auto;
  }

  .var-layers__bg-text {
    position: absolute;
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(8rem, 25vw, 20rem);
    font-weight: 400;
    color: rgba(255,255,255,0.03);
    letter-spacing: 0.05em;
    white-space: nowrap;
    pointer-events: none;
  }

  .var-layers__content {
    position: relative;
  }

  .var-layers__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    display: block;
    margin-bottom: 0.5rem;
  }

  .var-layers__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    display: block;
    margin-bottom: 0.75rem;
  }

  .var-layers__title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    margin: 0 0 1rem;
  }

  .var-layers__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 4: HALFTONE ===== */
  .var-halftone .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-halftone__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 6px 6px;
    pointer-events: none;
    z-index: 1;
  }

  .var-halftone__number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.4em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 1rem;
  }

  .var-halftone__title {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(5rem, 15vw, 10rem);
    font-weight: 400;
    text-transform: uppercase;
    margin: 0;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .var-halftone__desc {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.85rem;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.6);
    margin: 1.5rem 0 0;
  }

  /* ===== 5: LIQUID FLUID ===== */
  .var-liquid .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-liquid__blur-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.5) 100%);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    mask-image: radial-gradient(circle at 50% 50%, transparent 0%, transparent 25%, black 60%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 0%, transparent 25%, black 60%);
    pointer-events: none;
  }

  .var-liquid__blob {
    position: absolute;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    animation: liquidBlob 8s ease-in-out infinite;
    filter: blur(40px);
  }

  .var-liquid__blob--1 {
    width: 350px;
    height: 350px;
    background: rgba(99, 102, 241, 0.25);
    top: -80px;
    left: -80px;
    animation-delay: 0s;
  }

  .var-liquid__blob--2 {
    width: 280px;
    height: 280px;
    background: rgba(236, 72, 153, 0.2);
    bottom: -60px;
    right: -60px;
    animation-delay: 2s;
  }

  @keyframes liquidBlob {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }

  .var-liquid__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-liquid__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.75rem;
  }

  .var-liquid__title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    margin: 0 0 1rem;
  }

  .var-liquid__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 6: WHITE STRIPS ===== */
  .var-strips .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-strips__lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .var-strips__line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: rgba(255,255,255,0.8);
  }

  .var-strips__line--l1 { left: 15%; }
  .var-strips__line--l2 { left: calc(15% + 12px); }
  .var-strips__line--r1 { right: 15%; }
  .var-strips__line--r2 { right: calc(15% + 12px); }

  .var-strips__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-strips__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.75rem;
  }

  .var-strips__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-strips__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 7: GLASSMORPHISM STRIPS ===== */
  .var-glass-strips .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-glass-strips__lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .var-glass-strips__line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-left: 1px solid rgba(255,255,255,0.2);
    border-right: 1px solid rgba(255,255,255,0.2);
  }

  .var-glass-strips__line--l1 { left: 12%; }
  .var-glass-strips__line--l2 { left: calc(12% + 50px); }
  .var-glass-strips__line--r1 { right: 12%; }
  .var-glass-strips__line--r2 { right: calc(12% + 50px); }

  .var-glass-strips__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-glass-strips__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.75rem;
  }

  .var-glass-strips__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-glass-strips__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 8: CINEMATIC LETTERBOX ===== */
  .var-cinema .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-cinema__bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 60px;
    background: #000;
    z-index: 3;
  }

  .var-cinema__bar--top { top: 0; }
  .var-cinema__bar--bottom { bottom: 0; }

  .var-cinema__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-cinema__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.15em;
    margin: 0 0 1rem;
  }

  .var-cinema__desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-style: italic;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 9: TOPOGRAPHIC LINES ===== */
  .var-topo .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-topo__lines {
    position: absolute;
    inset: 0;
    background-image:
      repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px);
    pointer-events: none;
  }

  .var-topo__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(100,180,255,0.6);
    margin-bottom: 0.5rem;
  }

  .var-topo__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(100,180,255,0.5);
    margin-bottom: 0.75rem;
  }

  .var-topo__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 500;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-topo__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
  }

  /* ===== 10: AVIATION GAUGE ===== */
  .var-gauge .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-gauge__ring {
    width: 320px;
    height: 320px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .var-gauge__ring::before {
    content: '';
    position: absolute;
    inset: 15px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50%;
  }

  .var-gauge__ticks {
    position: absolute;
    inset: 0;
    background-image:
      repeating-conic-gradient(from 0deg, rgba(255,255,255,0.3) 0deg 2deg, transparent 2deg 30deg);
    border-radius: 50%;
  }

  .var-gauge__inner {
    text-align: center;
  }

  .var-gauge__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    display: block;
    margin-bottom: 0.5rem;
  }

  .var-gauge__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-gauge__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.5);
  }

  /* ===== 11: HORIZON SPLIT ===== */
  .var-horizon .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-horizon__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
  }

  .var-horizon__sky {
    flex: 1;
    background: linear-gradient(to bottom, rgba(100,150,200,0.5), rgba(150,180,220,0.3));
  }

  .var-horizon__line {
    height: 4px;
    background: #fff;
    box-shadow: 0 0 20px rgba(255,255,255,0.5);
  }

  .var-horizon__ground {
    flex: 1;
    background: linear-gradient(to bottom, rgba(80,60,40,0.4), rgba(40,30,20,0.6));
  }

  .var-horizon__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-horizon__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-horizon__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 12: RADAR SWEEP ===== */
  .var-radar .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-radar__screen {
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: rgba(0,50,30,0.8);
    border: 3px solid rgba(0,255,100,0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .var-radar__rings {
    position: absolute;
    inset: 0;
    background-image:
      repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 50px, rgba(0,255,100,0.1) 50px, rgba(0,255,100,0.1) 51px);
  }

  .var-radar__sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, rgba(0,255,100,0.8), transparent);
    transform-origin: left center;
    animation: radarSweep 4s linear infinite;
  }

  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .var-radar__content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .var-radar__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(0,255,100,0.6);
    display: block;
    margin-bottom: 0.5rem;
  }

  .var-radar__title {
    font-family: 'Source Code Pro', monospace;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
    color: rgba(0,255,100,0.9);
    text-shadow: 0 0 10px rgba(0,255,100,0.5);
  }

  .var-radar__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: rgba(0,255,100,0.5);
  }

  /* ===== 13: FLIGHT LOGBOOK ===== */
  .var-logbook .parallax-var__content {
    align-items: flex-start;
    padding: 3rem 4rem;
    color: #333;
  }

  .var-logbook__lines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(transparent 0, transparent 31px, rgba(150,180,200,0.3) 31px, rgba(150,180,200,0.3) 32px);
    pointer-events: none;
  }

  .var-logbook__margin {
    position: absolute;
    left: 60px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(220,100,100,0.4);
    pointer-events: none;
  }

  .var-logbook__content {
    position: relative;
    margin-left: 40px;
    max-width: 500px;
  }

  .var-logbook__date {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 0.5rem;
    display: block;
  }

  .var-logbook__title {
    font-family: 'Caveat', cursive;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 1rem;
  }

  .var-logbook__entry {
    font-family: 'Caveat', cursive;
    font-size: 1.4rem;
    line-height: 1.8;
    color: #333;
    margin: 0;
  }

  /* ===== 14: ALTITUDE BANDS ===== */
  .var-altitude .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-altitude__bands {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
  }

  .var-altitude__band {
    flex: 1;
  }

  .var-altitude__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-altitude__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.75rem;
  }

  .var-altitude__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-altitude__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  /* ===== 15: COCKPIT HUD ===== */
  .var-hud .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-hud__frame {
    position: absolute;
    inset: 40px;
    pointer-events: none;
  }

  .var-hud__corner {
    position: absolute;
    width: 40px;
    height: 40px;
  }

  .var-hud__corner::before,
  .var-hud__corner::after {
    content: '';
    position: absolute;
    background: rgba(0,255,200,0.6);
  }

  .var-hud__corner--tl { top: 0; left: 0; }
  .var-hud__corner--tl::before { top: 0; left: 0; width: 100%; height: 2px; }
  .var-hud__corner--tl::after { top: 0; left: 0; width: 2px; height: 100%; }

  .var-hud__corner--tr { top: 0; right: 0; }
  .var-hud__corner--tr::before { top: 0; right: 0; width: 100%; height: 2px; }
  .var-hud__corner--tr::after { top: 0; right: 0; width: 2px; height: 100%; }

  .var-hud__corner--bl { bottom: 0; left: 0; }
  .var-hud__corner--bl::before { bottom: 0; left: 0; width: 100%; height: 2px; }
  .var-hud__corner--bl::after { bottom: 0; left: 0; width: 2px; height: 100%; }

  .var-hud__corner--br { bottom: 0; right: 0; }
  .var-hud__corner--br::before { bottom: 0; right: 0; width: 100%; height: 2px; }
  .var-hud__corner--br::after { bottom: 0; right: 0; width: 2px; height: 100%; }

  .var-hud__data {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(0,255,200,0.7);
  }

  .var-hud__data--left { left: 60px; top: 50%; transform: translateY(-50%); }
  .var-hud__data--right { right: 60px; top: 50%; transform: translateY(-50%); text-align: right; }

  .var-hud__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(0,255,200,0.5);
    margin-bottom: 0.5rem;
  }

  .var-hud__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
    color: rgba(0,255,200,0.9);
    text-shadow: 0 0 20px rgba(0,255,200,0.3);
  }

  .var-hud__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: rgba(0,255,200,0.6);
  }

  /* ===== 16: WIND TUNNEL ===== */
  .var-wind .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-wind__lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .var-wind__line {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
    animation: windLine 2s linear infinite;
  }

  .var-wind__line:nth-child(1) { top: 10%; width: 30%; }
  .var-wind__line:nth-child(2) { top: 20%; width: 40%; }
  .var-wind__line:nth-child(3) { top: 30%; width: 25%; }
  .var-wind__line:nth-child(4) { top: 40%; width: 50%; }
  .var-wind__line:nth-child(5) { top: 50%; width: 35%; }
  .var-wind__line:nth-child(6) { top: 60%; width: 45%; }
  .var-wind__line:nth-child(7) { top: 70%; width: 30%; }
  .var-wind__line:nth-child(8) { top: 80%; width: 40%; }
  .var-wind__line:nth-child(9) { top: 15%; width: 35%; }
  .var-wind__line:nth-child(10) { top: 35%; width: 28%; }
  .var-wind__line:nth-child(11) { top: 55%; width: 42%; }
  .var-wind__line:nth-child(12) { top: 75%; width: 33%; }

  @keyframes windLine {
    0% { left: -50%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }

  .var-wind__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-wind__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 500;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
    font-style: italic;
  }

  .var-wind__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 17: CLOUD LAYERS ===== */
  .var-clouds .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-clouds__layer {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .var-clouds__layer--1 {
    background: radial-gradient(ellipse 80% 40% at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 70%);
  }

  .var-clouds__layer--2 {
    background: radial-gradient(ellipse 60% 30% at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 60%);
  }

  .var-clouds__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-clouds__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.75rem;
  }

  .var-clouds__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    font-style: italic;
    margin: 0 0 1rem;
  }

  .var-clouds__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 18: DEPARTURE BOARD ===== */
  .var-departure .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-departure__board {
    background: #1a1a1a;
    padding: 2rem 3rem;
    border-radius: 4px;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
  }

  .var-departure__row {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .var-departure__row--sub {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: rgba(255,200,0,0.7);
  }

  .var-departure__cell {
    font-family: 'Source Code Pro', monospace;
    font-size: 1rem;
    letter-spacing: 0.1em;
    color: rgba(255,200,0,0.9);
  }

  .var-departure__cell--main {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem;
    letter-spacing: 0.15em;
    color: #fff;
  }

  /* ===== 19: COMPASS NAVIGATION ===== */
  .var-compass .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-compass__rose {
    width: 300px;
    height: 300px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .var-compass__rose::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50%;
  }

  .var-compass__cardinal {
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem;
    color: rgba(255,255,255,0.6);
  }

  .var-compass__cardinal--n { top: 10px; left: 50%; transform: translateX(-50%); }
  .var-compass__cardinal--s { bottom: 10px; left: 50%; transform: translateX(-50%); }
  .var-compass__cardinal--e { right: 10px; top: 50%; transform: translateY(-50%); }
  .var-compass__cardinal--w { left: 10px; top: 50%; transform: translateY(-50%); }

  .var-compass__inner {
    text-align: center;
  }

  .var-compass__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    display: block;
    margin-bottom: 0.5rem;
  }

  .var-compass__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0;
  }

  .var-compass__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 1.5rem 0 0;
  }

  /* ===== 20: AERIAL GRID ===== */
  .var-grid .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-grid__overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  .var-grid__crosshair {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
  }

  .var-grid__crosshair::before,
  .var-grid__crosshair::after {
    content: '';
    position: absolute;
    background: rgba(255,255,255,0.3);
  }

  .var-grid__crosshair::before {
    width: 1px;
    height: 120px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .var-grid__crosshair::after {
    width: 120px;
    height: 1px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .var-grid__coords {
    position: absolute;
    bottom: 30px;
    right: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.5);
  }

  .var-grid__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-grid__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 500;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-grid__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
  }

  /* ===== 21: NIGHT VISION ===== */
  .var-nvg .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-nvg__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.1) 2px,
      rgba(0,0,0,0.1) 4px
    );
    pointer-events: none;
  }

  .var-nvg__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
  }

  .var-nvg__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(0,255,100,0.5);
    margin-bottom: 0.5rem;
  }

  .var-nvg__title {
    font-family: 'Source Code Pro', monospace;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 700;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
    color: rgba(0,255,100,0.9);
    text-shadow: 0 0 20px rgba(0,255,100,0.5);
  }

  .var-nvg__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: rgba(0,255,100,0.6);
  }

  /* ===== 22: SUNSET GRADIENT ===== */
  .var-sunset .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-sunset__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      rgba(255,100,50,0.3) 0%,
      rgba(255,150,80,0.4) 30%,
      rgba(255,200,150,0.3) 50%,
      rgba(100,100,150,0.4) 70%,
      rgba(30,30,60,0.6) 100%);
  }

  .var-sunset__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-sunset__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,220,180,0.8);
    margin-bottom: 0.75rem;
  }

  .var-sunset__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    font-style: italic;
    margin: 0 0 1rem;
  }

  .var-sunset__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  /* ===== 23: CARBON FIBER ===== */
  .var-carbon .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-carbon__texture {
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(45deg,
        transparent 0, transparent 10px,
        rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px),
      repeating-linear-gradient(-45deg,
        transparent 0, transparent 10px,
        rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px);
    pointer-events: none;
  }

  .var-carbon__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.5rem;
  }

  .var-carbon__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.75rem;
  }

  .var-carbon__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 600;
    letter-spacing: 0.05em;
    margin: 0 0 1rem;
  }

  .var-carbon__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
  }

  /* ===== 24: JET STREAM ===== */
  .var-jetstream .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-jetstream__flow {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .var-jetstream__path {
    fill: none;
    stroke: rgba(255,255,255,0.15);
    stroke-width: 2;
    stroke-dasharray: 10 20;
    animation: jetFlow 3s linear infinite;
  }

  .var-jetstream__path--2 {
    stroke: rgba(255,255,255,0.1);
    animation-delay: 1s;
  }

  .var-jetstream__path--3 {
    stroke: rgba(255,255,255,0.08);
    animation-delay: 2s;
  }

  @keyframes jetFlow {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: -60; }
  }

  .var-jetstream__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-jetstream__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 500;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
    font-style: italic;
  }

  .var-jetstream__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 25: BOLD HORIZON LINE ===== */
  .var-boldline .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-boldline__line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 8px;
    background: #fff;
    transform: translateY(-50%);
  }

  .var-boldline__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-boldline__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-boldline__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 26: FLIGHT ROUTE ===== */
  .var-route .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-route__path {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .var-route__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-route__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-route__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 27: CHROME REFLECTION ===== */
  .var-chrome .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-chrome__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.5rem;
  }

  .var-chrome__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.75rem;
  }

  .var-chrome__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 500;
    letter-spacing: 0.05em;
    margin: 0 0 1rem;
    background: linear-gradient(180deg, #fff 0%, #aaa 40%, #fff 50%, #888 60%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .var-chrome__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
  }

  /* ===== 28: ALTITUDE SCALE ===== */
  .var-scale .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-scale__ruler {
    position: absolute;
    left: 40px;
    top: 20%;
    bottom: 20%;
    width: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .var-scale__mark {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .var-scale__mark::before {
    content: '';
    width: 15px;
    height: 2px;
    background: rgba(255,255,255,0.5);
  }

  .var-scale__mark span {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.6rem;
    color: rgba(255,255,255,0.5);
  }

  .var-scale__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-scale__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-scale__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 29: RUNWAY STRIPES ===== */
  .var-runway .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-runway__stripes {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
  }

  .var-runway__stripe {
    width: 60px;
    height: 8px;
    background: #fff;
  }

  .var-runway__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-runway__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-runway__designation {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.6);
  }

  /* ===== 30: CONTROL TOWER ===== */
  .var-tower .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-tower__frame {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 100px;
    border: 3px solid rgba(255,255,255,0.3);
    border-bottom: none;
    border-radius: 100px 100px 0 0;
  }

  .var-tower__window {
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 90px 90px 0 0;
  }

  .var-tower__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
    margin-top: 80px;
  }

  .var-tower__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-tower__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 31: FORMATION FLIGHT ===== */
  .var-formation .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-formation__layers {
    position: relative;
  }

  .var-formation__shadow {
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .var-formation__shadow--3 {
    top: -12px;
    left: -12px;
    color: rgba(255,255,255,0.1);
  }

  .var-formation__shadow--2 {
    top: -8px;
    left: -8px;
    color: rgba(255,255,255,0.2);
  }

  .var-formation__shadow--1 {
    top: -4px;
    left: -4px;
    color: rgba(255,255,255,0.3);
  }

  .var-formation__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0;
    position: relative;
  }

  .var-formation__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin: 1rem 0 0.5rem;
  }

  .var-formation__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 32: THROTTLE QUADRANT ===== */
  .var-throttle .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-throttle__panel {
    position: absolute;
    left: 60px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .var-throttle__lever {
    position: relative;
    width: 20px;
    height: 150px;
  }

  .var-throttle__track {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: rgba(255,255,255,0.2);
    transform: translateX(-50%);
    border-radius: 2px;
  }

  .var-throttle__handle {
    position: absolute;
    left: 50%;
    top: 20%;
    width: 30px;
    height: 20px;
    background: #fff;
    transform: translateX(-50%);
    border-radius: 4px;
  }

  .var-throttle__markings {
    display: flex;
    flex-direction: column;
    gap: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.5);
  }

  .var-throttle__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-throttle__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-throttle__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.6);
  }

  /* ===== 33: SECTIONAL CHART ===== */
  .var-chart .parallax-var__content {
    align-items: center;
    text-align: center;
    color: #333;
  }

  .var-chart__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
  }

  .var-chart__airspace {
    position: absolute;
    top: 20%;
    right: 15%;
    width: 120px;
    height: 120px;
    border: 2px dashed rgba(0,100,200,0.4);
    border-radius: 50%;
    pointer-events: none;
  }

  .var-chart__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .var-chart__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 600;
    margin: 0 0 1rem;
    color: #1a1a1a;
  }

  .var-chart__desc {
    font-size: 1rem;
    color: #555;
    margin: 0 0 1rem;
  }

  .var-chart__airport {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: rgba(0,100,200,0.8);
    background: rgba(0,100,200,0.1);
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }

  /* ===== 34: AFTERBURNER ===== */
  .var-afterburner .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-afterburner__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
      rgba(255,50,0,0.5) 0%,
      rgba(255,100,0,0.4) 20%,
      rgba(255,150,50,0.3) 40%,
      rgba(255,200,100,0.2) 60%,
      transparent 80%);
  }

  .var-afterburner__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-afterburner__title {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    margin: 0 0 1rem;
    color: #fff;
    text-shadow: 0 0 40px rgba(255,100,0,0.5);
  }

  .var-afterburner__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  /* ===== 35: MORSE CODE ===== */
  .var-morse .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-morse__code {
    display: flex;
    gap: 8px;
    margin-bottom: 1.5rem;
  }

  .var-morse__dash {
    width: 30px;
    height: 8px;
    background: rgba(255,255,255,0.6);
    border-radius: 4px;
  }

  .var-morse__dot {
    width: 8px;
    height: 8px;
    background: rgba(255,255,255,0.6);
    border-radius: 50%;
  }

  .var-morse__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-morse__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-morse__label {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.4);
  }

  /* ===== 36: MINIMALIST CORNER ===== */
  .var-corner .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-corner__bracket {
    position: absolute;
    width: 80px;
    height: 80px;
  }

  .var-corner__bracket::before,
  .var-corner__bracket::after {
    content: '';
    position: absolute;
    background: rgba(255,255,255,0.6);
  }

  .var-corner__bracket--tl {
    top: 40px;
    left: 40px;
  }

  .var-corner__bracket--tl::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }

  .var-corner__bracket--tl::after {
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
  }

  .var-corner__bracket--br {
    bottom: 40px;
    right: 40px;
  }

  .var-corner__bracket--br::before {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 2px;
  }

  .var-corner__bracket--br::after {
    bottom: 0;
    right: 0;
    width: 2px;
    height: 100%;
  }

  .var-corner__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-corner__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.75rem;
  }

  .var-corner__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    font-style: italic;
    margin: 0 0 1rem;
  }

  .var-corner__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 37: DOUBLE EXPOSURE ===== */
  .var-double .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-double__overlay-img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    mix-blend-mode: overlay;
    opacity: 0.5;
    pointer-events: none;
  }

  .var-double__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-double__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.75rem;
  }

  .var-double__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;
  }

  .var-double__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 38: RUNWAY STRIPES ===== */
  .var-runway .parallax-var__content {
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .var-runway__stripes {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    pointer-events: none;
  }

  .var-runway__stripe {
    width: 4px;
    height: 100%;
    background: rgba(0,0,0,0.8);
  }

  .var-runway__heading {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4rem;
    font-weight: 400;
    color: rgba(0,0,0,0.7);
    letter-spacing: 0.1em;
    z-index: 2;
  }

  .var-runway__heading--top {
    top: 20px;
  }

  .var-runway__heading--bottom {
    bottom: 20px;
  }

  .var-runway__content {
    position: relative;
    z-index: 3;
    background: rgba(255,255,255,0.95);
    padding: 2rem 3rem;
    text-align: center;
  }

  .var-runway__label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .var-runway__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
    color: #1a1a1a;
  }

  .var-runway__desc {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
  }

  /* ===== 39: RUNWAY TARMAC ===== */
  .var-tarmac .parallax-var__content {
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-direction: row;
    gap: 3rem;
  }

  .var-tarmac__runway {
    width: 120px;
    height: 100%;
    position: absolute;
    left: 15%;
    top: 0;
    background: #2a2a2a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
  }

  .var-tarmac__stripes {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex: 1;
    justify-content: center;
    padding: 30px 0;
  }

  .var-tarmac__stripe {
    width: 60px;
    height: 30px;
    background: #fff;
  }

  .var-tarmac__heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    font-weight: 400;
    color: #fff;
    letter-spacing: 0.1em;
  }

  .var-tarmac__heading--top {
    margin-top: 10px;
  }

  .var-tarmac__heading--bottom {
    margin-bottom: 10px;
  }

  .var-tarmac__content {
    position: relative;
    z-index: 3;
    margin-left: auto;
    margin-right: 10%;
    text-align: left;
  }

  .var-tarmac__label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.75rem;
  }

  .var-tarmac__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 10vw, 7rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    margin: 0 0 0.75rem;
    color: #fff;
  }

  .var-tarmac__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }

  /* ===== 40: WAVE TOP ===== */
  /* ===== COMMON WAVE VARIATION STYLES (FinalDraft matching) ===== */
  .var-wave-common .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-wave-common .parallax-section__number-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .var-wave-common .parallax-section__line {
    width: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
  }

  .var-wave-common .parallax-section__number {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.7);
  }

  .var-wave-common .parallax-section__label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1rem;
  }

  .var-wave-common .parallax-section__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
    color: #fff;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }

  .var-wave-common .parallax-section__text {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 400px;
    margin: 0 auto;
  }

  /* Cutout variation dark text */
  .var-wave-common.var-cutout .parallax-section__line {
    background: rgba(0, 0, 0, 0.3);
  }
  .var-wave-common.var-cutout .parallax-section__number {
    color: #666;
  }
  .var-wave-common.var-cutout .parallax-section__label {
    color: #666;
  }
  .var-wave-common.var-cutout .parallax-section__title {
    color: #1a1a1a;
    text-shadow: none;
  }
  .var-wave-common.var-cutout .parallax-section__text {
    color: #666;
  }

  /* White spacer sections for picker preview */
  .picker-spacer {
    height: 200px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .picker-spacer__text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #ccc;
  }

  /* ===== 40: WAVE TOP ===== */
  .var-wave-top__wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 2;
  }

  .var-wave-top__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-wave-top__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-wave-top__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 41: WAVE BOTTOM ===== */
  .var-wave-bottom .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-wave-bottom__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 2;
  }

  .var-wave-bottom__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-wave-bottom__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-wave-bottom__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 42: DOUBLE WAVE ===== */
  .var-double-wave .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-double-wave__top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 2;
  }

  .var-double-wave__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 2;
  }

  .var-double-wave__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-double-wave__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-double-wave__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 43: LAYERED WAVES ===== */
  .var-layered .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-layered__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    z-index: 2;
  }

  .var-layered__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-layered__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-layered__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 44: WAVE SIDES ===== */
  .var-wave-sides .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-wave-sides__left {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 100%;
    z-index: 2;
  }

  .var-wave-sides__right {
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 100%;
    z-index: 2;
  }

  .var-wave-sides__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-wave-sides__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-wave-sides__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 45: CORNER WAVES ===== */
  .var-corner-wave .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-corner-wave__tl,
  .var-corner-wave__tr,
  .var-corner-wave__bl,
  .var-corner-wave__br {
    position: absolute;
    width: 200px;
    height: 200px;
    z-index: 2;
  }

  .var-corner-wave__tl { top: 0; left: 0; }
  .var-corner-wave__tr { top: 0; right: 0; }
  .var-corner-wave__bl { bottom: 0; left: 0; }
  .var-corner-wave__br { bottom: 0; right: 0; }

  .var-corner-wave__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-corner-wave__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-corner-wave__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 46: DIAGONAL WAVE ===== */
  .var-diagonal .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-diagonal__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    z-index: 2;
  }

  .var-diagonal__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-diagonal__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-diagonal__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 47: BLOB WAVE ===== */
  .var-blob .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-blob__shape {
    position: absolute;
    width: 300px;
    height: 300px;
    z-index: 2;
  }

  .var-blob__shape--tl {
    top: -50px;
    left: -50px;
  }

  .var-blob__shape--br {
    bottom: -50px;
    right: -50px;
  }

  .var-blob__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-blob__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-blob__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 48: SHARP WAVES ===== */
  .var-sharp .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-sharp__wave {
    position: absolute;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 2;
  }

  .var-sharp__wave--top { top: 0; }
  .var-sharp__wave--bottom { bottom: 0; }

  .var-sharp__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-sharp__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-sharp__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 49: GRADIENT WAVE ===== */
  .var-gradient-wave .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-gradient-wave__svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    z-index: 2;
  }

  .var-gradient-wave__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-gradient-wave__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-gradient-wave__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 50: THICK WAVE ===== */
  .var-thick .parallax-var__content {
    align-items: center;
    text-align: center;
    padding-bottom: 100px;
  }

  .var-thick__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 250px;
    z-index: 2;
  }

  .var-thick__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-thick__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-thick__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 51: SUBTLE WAVE ===== */
  .var-subtle .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-subtle__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 2;
  }

  .var-subtle__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-subtle__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-subtle__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 52: WAVE FRAME ===== */
  .var-frame .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-frame__waves {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .var-frame__top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }

  .var-frame__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }

  .var-frame__left {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 100%;
  }

  .var-frame__right {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 100%;
  }

  .var-frame__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-frame__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-frame__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 53: OVERLAPPING WAVES ===== */
  .var-overlap .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-overlap__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    z-index: 2;
  }

  .var-overlap__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-overlap__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-overlap__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 54: SINGLE SIDE WAVE ===== */
  .var-single-side .parallax-var__content {
    align-items: flex-end;
    text-align: right;
    padding-right: 60px;
  }

  .var-single-side__wave {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    z-index: 2;
  }

  .var-single-side__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-single-side__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-single-side__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 55: WAVE CUTOUT ===== */
  .var-cutout .parallax-var__content {
    align-items: center;
    text-align: center;
    color: #1a1a1a;
  }

  .var-cutout__mask {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .var-cutout__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .var-cutout__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
    color: #1a1a1a;
  }

  .var-cutout__desc {
    font-size: 1rem;
    color: #666;
  }

  /* ===== 56: RIPPLE WAVES ===== */
  .var-ripple .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-ripple__circles {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
  }

  .var-ripple__circle {
    position: absolute;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
  }

  .var-ripple__circle--1 {
    width: 200px;
    height: 200px;
  }

  .var-ripple__circle--2 {
    width: 350px;
    height: 350px;
  }

  .var-ripple__circle--3 {
    width: 500px;
    height: 500px;
  }

  .var-ripple__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-ripple__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-ripple__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 57: WAVE STRIPES ===== */
  .var-wave-stripes .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-wave-stripes__container {
    position: absolute;
    bottom: 40px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 2;
  }

  .var-wave-stripes__line {
    width: 100%;
    height: 20px;
  }

  .var-wave-stripes__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-wave-stripes__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-wave-stripes__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 58: ASYMMETRIC WAVE ===== */
  .var-asym .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-asym__wave-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150px;
    z-index: 2;
  }

  .var-asym__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-asym__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-asym__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== 59: WAVE PORTAL ===== */
  .var-portal .parallax-var__content {
    align-items: center;
    text-align: center;
  }

  .var-portal__frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .var-portal__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .var-portal__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 0.5rem;
  }

  .var-portal__desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
  }

  /* ===== PICKER STYLES ===== */
  .picker {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 420px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 100000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: all 0.3s ease;
  }

  .picker.minimized {
    transform: translateY(calc(100% - 44px));
  }

  .picker__collapsed-bar {
    display: none;
    height: 44px;
    background: #0a0a0a;
    border-radius: 16px 16px 0 0;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    cursor: pointer;
  }

  .picker.minimized .picker__collapsed-bar { display: flex; }

  .picker__collapsed-info { display: flex; align-items: center; gap: 12px; font-size: 13px; }
  .picker__collapsed-name { font-weight: 600; }
  .picker__collapsed-counter { opacity: 0.6; font-size: 11px; }
  .picker__collapsed-nav { display: flex; gap: 8px; }

  .picker__collapsed-btn {
    width: 28px; height: 28px; border: none;
    background: rgba(255,255,255,0.1); color: #fff;
    border-radius: 6px; cursor: pointer; font-size: 14px;
  }

  .picker__collapsed-btn:hover { background: rgba(255,255,255,0.2); }

  .picker__main { display: block; }
  .picker.minimized .picker__main { visibility: hidden; height: 0; overflow: hidden; }

  .picker__header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; border-bottom: 1px solid #e5e5e5;
  }

  .picker__title { font-size: 14px; font-weight: 700; margin: 0; }

  .picker__minimize {
    width: 28px; height: 28px; border: 1px solid #e5e5e5;
    background: #fff; border-radius: 6px; cursor: pointer; font-size: 14px;
  }

  .picker__minimize:hover { background: #f5f5f5; }

  .picker__content { padding: 16px; }

  .picker__info { margin-bottom: 16px; }
  .picker__id { font-size: 11px; color: #999; letter-spacing: 0.05em; }
  .picker__name { font-size: 18px; font-weight: 700; margin: 4px 0; }
  .picker__category {
    display: inline-block; font-size: 10px; font-weight: 600;
    color: #666; background: #f0f0f0; padding: 3px 8px;
    border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .picker__desc { font-size: 13px; color: #666; margin: 8px 0 0; line-height: 1.4; }

  .picker__nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }

  .picker__btn {
    padding: 8px 16px; border: 1px solid #e5e5e5;
    background: #fff; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 500;
  }

  .picker__btn:hover { background: #f5f5f5; }

  .picker__counter { font-size: 13px; color: #666; font-weight: 500; }

  .picker__actions { display: flex; gap: 8px; margin-bottom: 12px; }

  .picker__fav, .picker__filter {
    flex: 1; padding: 8px; border: 1px solid #e5e5e5;
    background: #fff; border-radius: 8px; cursor: pointer;
    font-size: 12px; font-weight: 500;
  }

  .picker__fav:hover, .picker__filter:hover { background: #f5f5f5; }
  .picker__fav--active { background: #fef3c7; border-color: #fcd34d; }
  .picker__filter--active { background: #e0e7ff; border-color: #818cf8; }

  .picker__shortcuts {
    display: flex; gap: 12px; justify-content: center;
    font-size: 10px; color: #999;
  }

  /* ============================================
     TYPOGRAPHY VARIATIONS (80-99)
     20 distinctive font combinations
     ============================================ */

  /* Base typography variation styles */
  .var-typo .parallax-var__content {
    align-items: center;
    text-align: center;
    color: #fff;
  }

  .var-typo .parallax-section__number-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .var-typo .parallax-section__line {
    width: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
  }

  .var-typo .parallax-section__number {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.7);
  }

  .var-typo .parallax-section__label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    color: rgba(255,255,255,0.8);
  }

  .var-typo .parallax-section__title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
    color: #fff;
  }

  .var-typo .parallax-section__text {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.9);
    max-width: 400px;
    margin: 0 auto;
  }

  .var-typo__wave {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 2;
    pointer-events: none;
  }

  .var-typo__wave--top {
    top: 0;
    height: 60px;
  }

  .var-typo__wave--bottom {
    bottom: 0;
    height: 120px;
  }

  /* 80: Didot Elegance */
  .var-typo--80 .parallax-section__label {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    letter-spacing: 0.4em;
  }
  .var-typo--80 .parallax-section__title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-style: normal;
  }
  .var-typo--80 .parallax-section__text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-style: italic;
  }

  /* 81: Futura Bold - Geometric modernist */
  .var-typo--81 .parallax-section__label {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
    letter-spacing: 0.5em;
  }
  .var-typo--81 .parallax-section__title {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .var-typo--81 .parallax-section__text {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
  }

  /* 82: Playfair Romantic */
  .var-typo--82 .parallax-section__label {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    letter-spacing: 0.3em;
  }
  .var-typo--82 .parallax-section__title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-style: italic;
    letter-spacing: -0.01em;
  }
  .var-typo--82 .parallax-section__text {
    font-family: 'Playfair Display', serif;
    font-weight: 400;
  }

  /* 83: Oswald Athletic */
  .var-typo--83 .parallax-section__label {
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    letter-spacing: 0.4em;
  }
  .var-typo--83 .parallax-section__title {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .var-typo--83 .parallax-section__text {
    font-family: 'Oswald', sans-serif;
    font-weight: 300;
  }

  /* 84: Cormorant French */
  .var-typo--84 .parallax-section__label {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    letter-spacing: 0.5em;
  }
  .var-typo--84 .parallax-section__title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    font-size: clamp(3.5rem, 10vw, 7rem);
  }
  .var-typo--84 .parallax-section__text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.3rem;
  }

  /* 85: Archivo Industrial */
  .var-typo--85 .parallax-section__label {
    font-family: 'Source Code Pro', monospace;
    font-weight: 500;
    letter-spacing: 0.3em;
  }
  .var-typo--85 .parallax-section__title {
    font-family: 'Archivo Black', sans-serif;
    font-weight: 400;
    letter-spacing: 0.02em;
  }
  .var-typo--85 .parallax-section__text {
    font-family: 'Source Code Pro', monospace;
    font-weight: 400;
  }

  /* 86: Baskerville Literary */
  .var-typo--86 .parallax-section__label {
    font-family: 'Libre Baskerville', serif;
    font-style: italic;
    letter-spacing: 0.25em;
  }
  .var-typo--86 .parallax-section__title {
    font-family: 'Libre Baskerville', serif;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: none;
  }
  .var-typo--86 .parallax-section__text {
    font-family: 'Libre Baskerville', serif;
    font-weight: 400;
  }

  /* 87: Monoton Retro */
  .var-typo--87 .parallax-section__label {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.5em;
  }
  .var-typo--87 .parallax-section__title {
    font-family: 'Monoton', cursive;
    font-weight: 400;
    letter-spacing: 0.1em;
    font-size: clamp(2.5rem, 7vw, 5rem);
  }
  .var-typo--87 .parallax-section__text {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.1em;
  }

  /* 88: Crimson Refined */
  .var-typo--88 .parallax-section__label {
    font-family: 'Crimson Pro', serif;
    font-weight: 400;
    letter-spacing: 0.4em;
  }
  .var-typo--88 .parallax-section__title {
    font-family: 'Crimson Pro', serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-size: clamp(3.5rem, 9vw, 6.5rem);
  }
  .var-typo--88 .parallax-section__text {
    font-family: 'Crimson Pro', serif;
    font-weight: 400;
    font-size: 1.2rem;
  }

  /* 89: Righteous Deco */
  .var-typo--89 .parallax-section__label {
    font-family: 'Righteous', cursive;
    letter-spacing: 0.4em;
  }
  .var-typo--89 .parallax-section__title {
    font-family: 'Righteous', cursive;
    font-weight: 400;
    letter-spacing: 0.05em;
  }
  .var-typo--89 .parallax-section__text {
    font-family: 'Righteous', cursive;
    font-weight: 400;
  }

  /* 90: Spectral Modern */
  .var-typo--90 .parallax-section__label {
    font-family: 'Spectral', serif;
    font-weight: 500;
    letter-spacing: 0.35em;
  }
  .var-typo--90 .parallax-section__title {
    font-family: 'Spectral', serif;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .var-typo--90 .parallax-section__text {
    font-family: 'Spectral', serif;
    font-weight: 400;
  }

  /* 91: Abril Poster */
  .var-typo--91 .parallax-section__label {
    font-family: 'Lora', serif;
    font-style: italic;
    letter-spacing: 0.3em;
  }
  .var-typo--91 .parallax-section__title {
    font-family: 'Abril Fatface', cursive;
    font-weight: 400;
    letter-spacing: 0.02em;
    font-size: clamp(3.5rem, 10vw, 7rem);
  }
  .var-typo--91 .parallax-section__text {
    font-family: 'Lora', serif;
    font-weight: 400;
  }

  /* 92: Josefin Vintage */
  .var-typo--92 .parallax-section__label {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
    letter-spacing: 0.5em;
  }
  .var-typo--92 .parallax-section__title {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 600;
    letter-spacing: 0.15em;
  }
  .var-typo--92 .parallax-section__text {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
  }

  /* 93: Lora Contemporary */
  .var-typo--93 .parallax-section__label {
    font-family: 'Lora', serif;
    font-weight: 400;
    letter-spacing: 0.35em;
  }
  .var-typo--93 .parallax-section__title {
    font-family: 'Lora', serif;
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0;
    text-transform: none;
  }
  .var-typo--93 .parallax-section__text {
    font-family: 'Lora', serif;
    font-weight: 400;
  }

  /* 94: Raleway Elegant */
  .var-typo--94 .parallax-section__label {
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
    letter-spacing: 0.6em;
  }
  .var-typo--94 .parallax-section__title {
    font-family: 'Raleway', sans-serif;
    font-weight: 100;
    letter-spacing: 0.2em;
    font-size: clamp(3rem, 9vw, 6.5rem);
  }
  .var-typo--94 .parallax-section__text {
    font-family: 'Raleway', sans-serif;
    font-weight: 300;
  }

  /* 95: Merriweather Readable */
  .var-typo--95 .parallax-section__label {
    font-family: 'Merriweather', serif;
    font-weight: 400;
    letter-spacing: 0.3em;
  }
  .var-typo--95 .parallax-section__title {
    font-family: 'Merriweather', serif;
    font-weight: 900;
    letter-spacing: -0.01em;
    text-transform: none;
  }
  .var-typo--95 .parallax-section__text {
    font-family: 'Merriweather', serif;
    font-weight: 400;
  }

  /* 96: Staatliches Bold */
  .var-typo--96 .parallax-section__label {
    font-family: 'Staatliches', cursive;
    letter-spacing: 0.5em;
  }
  .var-typo--96 .parallax-section__title {
    font-family: 'Staatliches', cursive;
    font-weight: 400;
    letter-spacing: 0.08em;
    font-size: clamp(3.5rem, 11vw, 7.5rem);
  }
  .var-typo--96 .parallax-section__text {
    font-family: 'Staatliches', cursive;
    font-weight: 400;
  }

  /* 97: Vollkorn Warm */
  .var-typo--97 .parallax-section__label {
    font-family: 'Vollkorn', serif;
    font-weight: 400;
    letter-spacing: 0.35em;
  }
  .var-typo--97 .parallax-section__title {
    font-family: 'Vollkorn', serif;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: none;
  }
  .var-typo--97 .parallax-section__text {
    font-family: 'Vollkorn', serif;
    font-weight: 400;
    font-size: 1.15rem;
  }

  /* 98: Cinzel Ancient */
  .var-typo--98 .parallax-section__label {
    font-family: 'Cinzel', serif;
    font-weight: 400;
    letter-spacing: 0.5em;
  }
  .var-typo--98 .parallax-section__title {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    letter-spacing: 0.15em;
  }
  .var-typo--98 .parallax-section__text {
    font-family: 'Cinzel', serif;
    font-weight: 400;
  }

  /* 99: Italiana Fashion */
  .var-typo--99 .parallax-section__label {
    font-family: 'Italiana', serif;
    letter-spacing: 0.5em;
  }
  .var-typo--99 .parallax-section__title {
    font-family: 'Italiana', serif;
    font-weight: 400;
    letter-spacing: 0.1em;
    font-size: clamp(3rem, 9vw, 6.5rem);
  }
  .var-typo--99 .parallax-section__text {
    font-family: 'Italiana', serif;
    font-weight: 400;
  }
`;

export default ParallaxPicker;
