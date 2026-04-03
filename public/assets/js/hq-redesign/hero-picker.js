/**
 * HQ Aviation Hero Version Picker
 * Comprehensive A/B testing tool with 12+ distinct hero designs
 *
 * Each version represents a fundamentally different approach:
 * - Different layouts (centered, split, asymmetric)
 * - Different content strategies (emotional, trust, action, product)
 * - Different visual treatments (light, dark, gradient, video)
 * - Different animation styles
 */

(function() {
  'use strict';

  // ============================================
  // HERO VERSION DEFINITIONS
  // ============================================

  const HERO_VERSIONS = [
    // --------------------------------------------
    // CATEGORY: MINIMAL & ELEGANT
    // --------------------------------------------
    {
      id: 'minimal-centered',
      category: 'Minimal',
      title: 'Minimal Centered',
      description: 'Tesla-inspired. Full-bleed image, centered text, maximum whitespace. Single CTA.',
      render: () => `
        <div class="hq-hero-v hq-hero-minimal-centered">
          <div class="hero-bg">
            <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="R66 over Alps">
          </div>
          <div class="hero-overlay hero-overlay--subtle"></div>
          <div class="hero-content">
            <h1 class="hero-headline hero-headline--display">Elevate Your Journey</h1>
            <p class="hero-tagline">Robinson helicopter specialists since 1990</p>
            <a href="#helicopter-sales" class="hero-cta hero-cta--primary">Explore Aircraft</a>
          </div>
          <div class="hero-scroll-indicator">
            <span>Scroll</span>
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </div>
      `
    },
    {
      id: 'minimal-left',
      category: 'Minimal',
      title: 'Minimal Left-Aligned',
      description: 'Asymmetric composition. Text anchored left, breathing room right. Editorial feel.',
      render: () => `
        <div class="hq-hero-v hq-hero-minimal-left">
          <div class="hero-bg">
            <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Helicopter expedition">
          </div>
          <div class="hero-overlay hero-overlay--gradient-right"></div>
          <div class="hero-content">
            <span class="hero-overline">Robinson Helicopter Dealer</span>
            <h1 class="hero-headline">The Sky<br>Awaits</h1>
            <p class="hero-tagline">Sales • Training • Maintenance</p>
            <div class="hero-cta-group">
              <a href="#helicopter-sales" class="hero-cta hero-cta--primary">View Aircraft</a>
              <a href="#contact" class="hero-cta hero-cta--ghost">Contact Us</a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'minimal-statement',
      category: 'Minimal',
      title: 'Bold Statement',
      description: 'Oversized typography dominates. Image serves the text. Maximum impact.',
      render: () => `
        <div class="hq-hero-v hq-hero-minimal-statement">
          <div class="hero-bg">
            <img src="/assets/images/facility/busy-hangar.jpg" alt="HQ Aviation hangar">
          </div>
          <div class="hero-overlay hero-overlay--dark"></div>
          <div class="hero-content">
            <h1 class="hero-headline hero-headline--massive">FLY</h1>
            <p class="hero-tagline hero-tagline--spaced">SALES &nbsp;•&nbsp; TRAINING &nbsp;•&nbsp; MAINTENANCE</p>
            <a href="#helicopter-flying" class="hero-cta hero-cta--underline">Begin Your Journey →</a>
          </div>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: SPLIT LAYOUTS
    // --------------------------------------------
    {
      id: 'split-50-50',
      category: 'Split',
      title: 'Split 50/50',
      description: 'Equal split. Image right, content left. Clean separation. Professional.',
      render: () => `
        <div class="hq-hero-v hq-hero-split-50">
          <div class="hero-split-content">
            <div class="hero-content">
              <span class="hero-overline">UK's Premier Robinson Dealer</span>
              <h1 class="hero-headline">Your Aviation<br>Partner</h1>
              <p class="hero-tagline">From first flight to fleet management. Three decades of helicopter expertise at Denham Aerodrome.</p>
              <div class="hero-stats">
                <div class="hero-stat"><span class="hero-stat-value">30+</span><span class="hero-stat-label">Years</span></div>
                <div class="hero-stat"><span class="hero-stat-value">500+</span><span class="hero-stat-label">Aircraft Sold</span></div>
                <div class="hero-stat"><span class="hero-stat-value">1000+</span><span class="hero-stat-label">Pilots Trained</span></div>
              </div>
              <a href="#helicopter-sales" class="hero-cta hero-cta--primary">Explore Our Fleet</a>
            </div>
          </div>
          <div class="hero-split-image">
            <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Robinson R66">
          </div>
        </div>
      `
    },
    {
      id: 'split-reverse',
      category: 'Split',
      title: 'Split Reversed',
      description: 'Image left, content right. Cockpit view creates depth. Immersive entry point.',
      render: () => `
        <div class="hq-hero-v hq-hero-split-reverse">
          <div class="hero-split-image">
            <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Cockpit view">
          </div>
          <div class="hero-split-content hero-split-content--cream">
            <div class="hero-content">
              <span class="hero-overline">Flight Training</span>
              <h1 class="hero-headline hero-headline--dark">Learn to Fly<br>Helicopters</h1>
              <p class="hero-tagline hero-tagline--dark">Professional PPL(H) training from CAA-approved instructors. From zero experience to licensed pilot.</p>
              <div class="hero-cta-group">
                <a href="#helicopter-training" class="hero-cta hero-cta--dark">View Courses</a>
                <a href="/pages/discovery-flights" class="hero-cta hero-cta--outline-dark">Book Trial Flight - £299</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'split-asymmetric',
      category: 'Split',
      title: 'Asymmetric Split',
      description: '60/40 split with overlapping elements. Dynamic tension. Modern editorial.',
      render: () => `
        <div class="hq-hero-v hq-hero-split-asymmetric">
          <div class="hero-bg-section">
            <img src="/assets/images/team/british-helicopter-team.webp" alt="British Helicopter Team">
          </div>
          <div class="hero-content-card">
            <span class="hero-badge">Robinson Authorized Dealer</span>
            <h1 class="hero-headline hero-headline--dark">Excellence in<br>Every Detail</h1>
            <p class="hero-tagline hero-tagline--dark">EASA Part-145 certified maintenance. Factory-trained engineers. Genuine Robinson parts.</p>
            <a href="#maintenance" class="hero-cta hero-cta--dark">Our Services</a>
            <div class="hero-certifications">
              <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA" class="hero-cert-logo">
              <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson" class="hero-cert-logo" onerror="this.style.display='none'">
            </div>
          </div>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: PRODUCT SHOWCASE
    // --------------------------------------------
    {
      id: 'product-hero',
      category: 'Product',
      title: 'Product Showcase',
      description: 'Aircraft as hero. Floating specs. Configurator-style. Premium product page feel.',
      render: () => `
        <div class="hq-hero-v hq-hero-product">
          <div class="hero-bg hero-bg--gradient"></div>
          <div class="hero-product-image">
            <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="Robinson R66 Turbine">
          </div>
          <div class="hero-product-content">
            <span class="hero-overline">New Aircraft</span>
            <h1 class="hero-headline hero-headline--dark">Robinson R66 Turbine</h1>
            <p class="hero-tagline hero-tagline--dark">The world's best-selling turbine helicopter. Powerful, reliable, refined.</p>
            <div class="hero-cta-group">
              <a href="/pages/r66" class="hero-cta hero-cta--dark">Configure Yours</a>
              <a href="#contact" class="hero-cta hero-cta--outline-dark">Request Quote</a>
            </div>
          </div>
          <div class="hero-product-specs">
            <div class="hero-spec"><span class="hero-spec-value">300</span><span class="hero-spec-label">SHP</span></div>
            <div class="hero-spec"><span class="hero-spec-value">4</span><span class="hero-spec-label">Seats</span></div>
            <div class="hero-spec"><span class="hero-spec-value">350</span><span class="hero-spec-label">NM Range</span></div>
            <div class="hero-spec"><span class="hero-spec-value">140</span><span class="hero-spec-label">KTS Cruise</span></div>
          </div>
        </div>
      `
    },
    {
      id: 'product-lineup',
      category: 'Product',
      title: 'Product Lineup',
      description: 'Multiple aircraft. Comparison teaser. Drives exploration of full range.',
      render: () => `
        <div class="hq-hero-v hq-hero-lineup">
          <div class="hero-bg hero-bg--dark"></div>
          <div class="hero-content hero-content--top">
            <span class="hero-overline hero-overline--light">The Robinson Range</span>
            <h1 class="hero-headline">Find Your Perfect Aircraft</h1>
          </div>
          <div class="hero-lineup-grid">
            <a href="/pages/r22" class="hero-lineup-item">
              <div class="lineup-image"><img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22" onerror="this.parentElement.innerHTML='<div class=lineup-placeholder>R22</div>'"></div>
              <h3 class="lineup-name">R22</h3>
              <p class="lineup-desc">Training & Personal</p>
            </a>
            <a href="/pages/r44" class="hero-lineup-item">
              <div class="lineup-image"><img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44" onerror="this.parentElement.innerHTML='<div class=lineup-placeholder>R44</div>'"></div>
              <h3 class="lineup-name">R44</h3>
              <p class="lineup-desc">Versatile 4-Seat</p>
            </a>
            <a href="/pages/r66" class="hero-lineup-item hero-lineup-item--featured">
              <div class="lineup-badge">Most Popular</div>
              <div class="lineup-image"><img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4-1.png" alt="R66"></div>
              <h3 class="lineup-name">R66 Turbine</h3>
              <p class="lineup-desc">Power & Luxury</p>
            </a>
          </div>
          <a href="/used-aircraft" class="hero-cta hero-cta--ghost hero-cta--centered">View Pre-Owned Aircraft</a>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: IMMERSIVE & CINEMATIC
    // --------------------------------------------
    {
      id: 'cinematic-dark',
      category: 'Cinematic',
      title: 'Cinematic Dark',
      description: 'Moody, atmospheric. Dramatic lighting. Premium luxury positioning.',
      render: () => `
        <div class="hq-hero-v hq-hero-cinematic">
          <div class="hero-bg">
            <img src="/assets/images/legacy/dated/20251217_183027.jpg" alt="Helicopter at dusk" onerror="this.src='/assets/images/facility/busy-hangar.jpg'">
          </div>
          <div class="hero-overlay hero-overlay--cinematic"></div>
          <div class="hero-content">
            <h1 class="hero-headline hero-headline--elegant">Beyond<br>Boundaries</h1>
            <p class="hero-tagline">Where precision meets passion. Where engineering meets artistry.</p>
            <div class="hero-cta-group hero-cta-group--stacked">
              <a href="#helicopter-sales" class="hero-cta hero-cta--primary hero-cta--large">Discover Our Aircraft</a>
              <a href="#contact" class="hero-cta hero-cta--text">Schedule a Consultation</a>
            </div>
          </div>
          <div class="hero-ambient-text">HQ AVIATION</div>
        </div>
      `
    },
    {
      id: 'cinematic-video',
      category: 'Cinematic',
      title: 'Video Background',
      description: 'Looping video creates motion and life. Fallback to image. Premium feel.',
      render: () => `
        <div class="hq-hero-v hq-hero-video">
          <div class="hero-video-container">
            <video autoplay muted loop playsinline poster="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp">
              <source src="/assets/video/hero-loop.mp4" type="video/mp4">
            </video>
            <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Helicopter flight" class="hero-video-fallback">
          </div>
          <div class="hero-overlay hero-overlay--video"></div>
          <div class="hero-content">
            <h1 class="hero-headline">Experience Flight</h1>
            <p class="hero-tagline">Book your discovery flight and see the world from above</p>
            <a href="/pages/discovery-flights" class="hero-cta hero-cta--primary hero-cta--large">Book Now - £299</a>
          </div>
          <button class="hero-video-control" aria-label="Pause video">
            <svg class="icon-pause" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            <svg class="icon-play" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>
      `
    },
    {
      id: 'parallax-layers',
      category: 'Cinematic',
      title: 'Parallax Layers',
      description: 'Multi-layer depth effect. Text and image move at different speeds. Dynamic.',
      render: () => `
        <div class="hq-hero-v hq-hero-parallax">
          <div class="hero-parallax-bg" data-speed="0.3">
            <img src="/assets/images/expeditions/antartica.jpg" alt="Antarctic expedition" onerror="this.src='/assets/images/used-aircraft/r66/chris-r66-alps.jpg'">
          </div>
          <div class="hero-overlay hero-overlay--gradient-up"></div>
          <div class="hero-parallax-content" data-speed="0.6">
            <span class="hero-overline">Helicopter Expeditions</span>
            <h1 class="hero-headline hero-headline--display">Adventure<br>Reimagined</h1>
            <p class="hero-tagline">From the Alps to Antarctica. Custom expeditions for the bold.</p>
            <a href="/pages/expeditions" class="hero-cta hero-cta--primary">Plan Your Expedition</a>
          </div>
          <div class="hero-parallax-foreground" data-speed="0.9"></div>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: TRUST & CREDIBILITY
    // --------------------------------------------
    {
      id: 'trust-heritage',
      category: 'Trust',
      title: 'Heritage Focus',
      description: 'Emphasizes 30+ years experience. Testimonials. Trust signals prominent.',
      render: () => `
        <div class="hq-hero-v hq-hero-trust">
          <div class="hero-bg">
            <img src="/assets/images/facility/busy-hangar.jpg" alt="HQ Aviation hangar">
          </div>
          <div class="hero-overlay hero-overlay--trust"></div>
          <div class="hero-content">
            <div class="hero-trust-badge">
              <span class="trust-years">30+</span>
              <span class="trust-text">Years of Excellence</span>
            </div>
            <h1 class="hero-headline">Trusted by Pilots<br>Worldwide</h1>
            <div class="hero-testimonial">
              <blockquote>"The team at HQ Aviation made buying my R66 seamless. Their expertise is unmatched."</blockquote>
              <cite>— James H., R66 Owner</cite>
            </div>
            <div class="hero-trust-logos">
              <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA Approved">
              <img src="/assets/images/logos/partners/bhalogo.jpg" alt="British Helicopter Association">
            </div>
            <a href="#contact" class="hero-cta hero-cta--primary">Speak With Our Team</a>
          </div>
        </div>
      `
    },
    {
      id: 'trust-stats',
      category: 'Trust',
      title: 'Statistics Led',
      description: 'Numbers tell the story. Animated counters. Data-driven trust building.',
      render: () => `
        <div class="hq-hero-v hq-hero-stats">
          <div class="hero-bg hero-bg--ivory"></div>
          <div class="hero-content hero-content--dark">
            <span class="hero-overline hero-overline--accent">By The Numbers</span>
            <h1 class="hero-headline hero-headline--dark">Results That<br>Speak</h1>
            <div class="hero-stats-grid">
              <div class="hero-stat-large">
                <span class="stat-value" data-count="500">0</span>
                <span class="stat-label">Aircraft Sold</span>
              </div>
              <div class="hero-stat-large">
                <span class="stat-value" data-count="1200">0</span>
                <span class="stat-label">Pilots Trained</span>
              </div>
              <div class="hero-stat-large">
                <span class="stat-value" data-count="50000">0</span>
                <span class="stat-label">Flight Hours Logged</span>
              </div>
              <div class="hero-stat-large">
                <span class="stat-value" data-count="30">0</span>
                <span class="stat-label">Years Experience</span>
              </div>
            </div>
            <a href="#helicopter-sales" class="hero-cta hero-cta--dark">Join Our Legacy</a>
          </div>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: ACTION ORIENTED
    // --------------------------------------------
    {
      id: 'action-booking',
      category: 'Action',
      title: 'Direct Booking',
      description: 'Embedded booking widget. Reduce friction. Convert immediately.',
      render: () => `
        <div class="hq-hero-v hq-hero-booking">
          <div class="hero-bg">
            <img src="/assets/images/team/british-helicopter-team.webp" alt="Training flight">
          </div>
          <div class="hero-overlay hero-overlay--booking"></div>
          <div class="hero-split-content">
            <div class="hero-content">
              <span class="hero-overline">Discovery Flights</span>
              <h1 class="hero-headline">Take the Controls</h1>
              <p class="hero-tagline">Experience the thrill of helicopter flight with a 30-minute trial lesson.</p>
            </div>
          </div>
          <div class="hero-booking-card">
            <h3 class="booking-title">Book Your Flight</h3>
            <div class="booking-price">
              <span class="price-amount">£299</span>
              <span class="price-duration">30 min flight</span>
            </div>
            <ul class="booking-includes">
              <li>✓ Pre-flight briefing</li>
              <li>✓ Hands-on controls</li>
              <li>✓ Certificate of flight</li>
              <li>✓ Photo opportunity</li>
            </ul>
            <a href="/pages/discovery-flights" class="hero-cta hero-cta--primary hero-cta--full">Book Now</a>
            <p class="booking-note">Or call <a href="tel:+441753868976">01onal753 868976</a></p>
          </div>
        </div>
      `
    },
    {
      id: 'action-dual-cta',
      category: 'Action',
      title: 'Dual Path CTA',
      description: 'Two clear paths: Buy or Learn. Segments audience immediately.',
      render: () => `
        <div class="hq-hero-v hq-hero-dual">
          <div class="hero-dual-section hero-dual-section--buy">
            <div class="hero-bg">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66 for sale">
            </div>
            <div class="hero-overlay hero-overlay--subtle"></div>
            <div class="hero-content">
              <span class="hero-overline">Aircraft Sales</span>
              <h2 class="hero-headline">Buy</h2>
              <p class="hero-tagline">New & pre-owned Robinson helicopters</p>
              <a href="#helicopter-sales" class="hero-cta hero-cta--primary">View Aircraft</a>
            </div>
          </div>
          <div class="hero-dual-section hero-dual-section--learn">
            <div class="hero-bg">
              <img src="/assets/images/team/british-helicopter-team.webp" alt="Flight training">
            </div>
            <div class="hero-overlay hero-overlay--subtle"></div>
            <div class="hero-content">
              <span class="hero-overline">Flight Training</span>
              <h2 class="hero-headline">Learn</h2>
              <p class="hero-tagline">PPL(H) courses & discovery flights</p>
              <a href="#helicopter-training" class="hero-cta hero-cta--primary">Start Training</a>
            </div>
          </div>
          <div class="hero-dual-divider">
            <span>OR</span>
          </div>
        </div>
      `
    },

    // --------------------------------------------
    // CATEGORY: EDITORIAL & STORYTELLING
    // --------------------------------------------
    {
      id: 'editorial-magazine',
      category: 'Editorial',
      title: 'Magazine Style',
      description: 'Editorial layout with featured article feel. Headline as art.',
      render: () => `
        <div class="hq-hero-v hq-hero-magazine">
          <div class="hero-magazine-grid">
            <div class="magazine-header">
              <span class="magazine-issue">Since 1990</span>
              <h1 class="magazine-masthead">HQ Aviation</h1>
              <span class="magazine-tagline">The Art of Helicopter Excellence</span>
            </div>
            <div class="magazine-feature">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Featured">
            </div>
            <div class="magazine-sidebar">
              <div class="magazine-story">
                <span class="story-category">Featured</span>
                <h2 class="story-title">Adventures Beyond Horizons</h2>
                <p class="story-excerpt">From Antarctic expeditions to Alpine crossings, discover extraordinary journeys.</p>
                <a href="/pages/expeditions" class="story-link">Read More →</a>
              </div>
              <div class="magazine-story">
                <span class="story-category">New Aircraft</span>
                <h2 class="story-title">The R66 NxG Arrives</h2>
                <p class="story-excerpt">Next generation turbine. Now available for order.</p>
                <a href="/pages/r66" class="story-link">Explore →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'editorial-story',
      category: 'Editorial',
      title: 'Story Scroll',
      description: 'Narrative intro that invites scrolling. Sets up the journey.',
      render: () => `
        <div class="hq-hero-v hq-hero-story">
          <div class="hero-story-stage hero-story-stage--1">
            <div class="story-text">
              <p class="story-line">In 1990, a passion for flight became a mission.</p>
            </div>
          </div>
          <div class="hero-story-stage hero-story-stage--2">
            <div class="story-text">
              <p class="story-line">Today, that mission has helped hundreds take to the skies.</p>
            </div>
          </div>
          <div class="hero-story-stage hero-story-stage--3">
            <div class="hero-bg">
              <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Flying free">
            </div>
            <div class="hero-overlay hero-overlay--subtle"></div>
            <div class="story-text story-text--final">
              <h1 class="hero-headline">Your Story<br>Starts Here</h1>
              <a href="#helicopter-flying" class="hero-cta hero-cta--primary">Begin</a>
            </div>
          </div>
        </div>
      `
    }
  ];

  // ============================================
  // HERO STYLES
  // ============================================

  const HERO_STYLES = `
    /* ========================================
       BASE HERO STYLES
       ======================================== */

    .hq-hero-v {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .hq-hero-v * {
      box-sizing: border-box;
    }

    /* Backgrounds */
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .hero-bg img,
    .hero-bg video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-bg--gradient {
      background: linear-gradient(135deg, #FAFAF8 0%, #F5F5F2 50%, #E8E6E1 100%);
    }

    .hero-bg--dark {
      background: #0A0A0A;
    }

    .hero-bg--ivory {
      background: #FAFAF8;
    }

    /* Overlays */
    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .hero-overlay--subtle {
      background: linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.25) 40%, rgba(10,10,10,0.5) 80%, rgba(10,10,10,0.7) 100%);
    }

    .hero-overlay--dark {
      background: linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.7) 100%);
    }

    .hero-overlay--gradient-right {
      background: linear-gradient(to right, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.4) 50%, transparent 100%);
    }

    .hero-overlay--gradient-up {
      background: linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.3) 50%, transparent 100%);
    }

    .hero-overlay--cinematic {
      background: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.9) 100%);
    }

    .hero-overlay--video {
      background: rgba(10,10,10,0.4);
    }

    .hero-overlay--trust {
      background: linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 100%);
    }

    .hero-overlay--booking {
      background: linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.3) 100%);
    }

    /* Content */
    .hero-content {
      position: relative;
      z-index: 2;
      padding: 2rem;
      max-width: 800px;
      text-align: center;
    }

    .hero-content--top {
      align-self: flex-start;
      padding-top: 120px;
    }

    .hero-content--dark {
      color: #0A0A0A;
    }

    /* Typography */
    .hero-overline {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #E04A2F;
      margin-bottom: 1rem;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.2s forwards;
    }

    .hero-overline--light {
      color: rgba(255,255,255,0.8);
    }

    .hero-overline--accent {
      color: #E04A2F;
    }

    .hero-headline {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.5rem, 8vw, 5.5rem);
      font-weight: 700;
      line-height: 1.1;
      color: #FFFFFF;
      margin: 0 0 1.5rem;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 40px rgba(0,0,0,0.3);
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.3s forwards;
    }

    .hero-headline--dark {
      color: #0A0A0A;
      text-shadow: none;
    }

    .hero-headline--display {
      font-size: clamp(3rem, 10vw, 7rem);
    }

    .hero-headline--massive {
      font-size: clamp(5rem, 20vw, 15rem);
      letter-spacing: 0.1em;
    }

    .hero-headline--elegant {
      font-style: italic;
      font-weight: 400;
    }

    .hero-tagline {
      font-family: 'Inter', sans-serif;
      font-size: clamp(1rem, 2vw, 1.25rem);
      font-weight: 400;
      line-height: 1.6;
      color: rgba(255,255,255,0.85);
      margin: 0 0 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.4s forwards;
    }

    .hero-tagline--dark {
      color: #666666;
    }

    .hero-tagline--spaced {
      letter-spacing: 0.3em;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* CTAs */
    .hero-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 2rem;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.5s forwards;
    }

    .hero-cta--primary {
      background: #E04A2F;
      color: #FFFFFF;
      border: 2px solid #E04A2F;
    }

    .hero-cta--primary:hover {
      background: #C93E25;
      border-color: #C93E25;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(224,74,47,0.4);
    }

    .hero-cta--dark {
      background: #0A0A0A;
      color: #FFFFFF;
      border: 2px solid #0A0A0A;
    }

    .hero-cta--dark:hover {
      background: #1A1A1A;
    }

    .hero-cta--ghost {
      background: transparent;
      color: #FFFFFF;
      border: 2px solid rgba(255,255,255,0.5);
    }

    .hero-cta--ghost:hover {
      background: rgba(255,255,255,0.1);
      border-color: #FFFFFF;
    }

    .hero-cta--outline-dark {
      background: transparent;
      color: #0A0A0A;
      border: 2px solid #0A0A0A;
    }

    .hero-cta--outline-dark:hover {
      background: #0A0A0A;
      color: #FFFFFF;
    }

    .hero-cta--underline {
      background: transparent;
      color: #FFFFFF;
      border: none;
      border-bottom: 2px solid #FFFFFF;
      border-radius: 0;
      padding: 0.5rem 0;
    }

    .hero-cta--text {
      background: transparent;
      color: rgba(255,255,255,0.7);
      border: none;
      padding: 0.5rem 1rem;
    }

    .hero-cta--text:hover {
      color: #FFFFFF;
    }

    .hero-cta--large {
      padding: 1.25rem 2.5rem;
      font-size: 1rem;
    }

    .hero-cta--full {
      width: 100%;
    }

    .hero-cta--centered {
      margin: 2rem auto 0;
    }

    .hero-cta-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.5s forwards;
    }

    .hero-cta-group--stacked {
      flex-direction: column;
      align-items: center;
    }

    /* Stats */
    .hero-stats {
      display: flex;
      gap: 2rem;
      margin: 2rem 0;
      justify-content: center;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.45s forwards;
    }

    .hero-stat {
      text-align: center;
    }

    .hero-stat-value {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .hero-stat-label {
      display: block;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .hero-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin: 3rem 0;
    }

    @media (max-width: 768px) {
      .hero-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .hero-stat-large {
      text-align: center;
      padding: 1.5rem;
    }

    .hero-stat-large .stat-value {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 3rem;
      font-weight: 700;
      color: #E04A2F;
    }

    .hero-stat-large .stat-label {
      display: block;
      font-size: 0.875rem;
      color: #666666;
      margin-top: 0.5rem;
    }

    /* Scroll Indicator */
    .hero-scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.7);
      z-index: 2;
      opacity: 0;
      animation: heroFadeIn 0.8s ease-out 0.8s forwards;
    }

    .hero-scroll-indicator span {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }

    .hero-scroll-indicator svg {
      width: 24px;
      height: 24px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      animation: scrollBounce 2s ease-in-out infinite;
    }

    /* ========================================
       SPLIT LAYOUTS
       ======================================== */

    .hq-hero-split-50,
    .hq-hero-split-reverse {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 1024px) {
      .hq-hero-split-50,
      .hq-hero-split-reverse {
        grid-template-columns: 1fr;
      }
    }

    .hero-split-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      background: #0A0A0A;
    }

    .hero-split-content--cream {
      background: #FAFAF8;
    }

    .hero-split-content .hero-content {
      text-align: left;
      max-width: 500px;
    }

    .hero-split-image {
      position: relative;
      min-height: 100vh;
      background: #F5F5F2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-split-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Asymmetric Split */
    .hq-hero-split-asymmetric {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      background: #FAFAF8;
    }

    @media (max-width: 1024px) {
      .hq-hero-split-asymmetric {
        grid-template-columns: 1fr;
      }
    }

    .hero-bg-section {
      position: relative;
      min-height: 100vh;
    }

    .hero-bg-section img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-content-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4rem;
    }

    .hero-content-card .hero-headline {
      font-size: clamp(2rem, 4vw, 3.5rem);
    }

    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #E04A2F;
      color: #FFFFFF;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .hero-certifications {
      display: flex;
      gap: 1.5rem;
      margin-top: 2rem;
      align-items: center;
    }

    .hero-cert-logo {
      height: 40px;
      width: auto;
      opacity: 0.7;
    }

    /* ========================================
       PRODUCT SHOWCASE
       ======================================== */

    .hq-hero-product {
      flex-direction: column;
      padding: 6rem 2rem;
    }

    .hero-product-image {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 800px;
      margin-bottom: 2rem;
    }

    .hero-product-image img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
    }

    .hero-product-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 600px;
    }

    .hero-product-specs {
      position: absolute;
      bottom: 4rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 3rem;
      z-index: 2;
      background: rgba(255,255,255,0.95);
      padding: 1.5rem 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    }

    .hero-spec {
      text-align: center;
    }

    .hero-spec-value {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #0A0A0A;
    }

    .hero-spec-label {
      display: block;
      font-size: 0.625rem;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Product Lineup */
    .hq-hero-lineup {
      flex-direction: column;
      padding: 6rem 2rem;
    }

    .hero-lineup-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1200px;
      width: 100%;
      margin: 3rem auto;
      z-index: 2;
    }

    @media (max-width: 768px) {
      .hero-lineup-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .hero-lineup-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .hero-lineup-item:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.2);
      transform: translateY(-4px);
    }

    .hero-lineup-item--featured {
      background: rgba(224,74,47,0.1);
      border-color: #E04A2F;
    }

    .lineup-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.25rem 0.75rem;
      background: #E04A2F;
      color: #FFFFFF;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-radius: 4px;
    }

    .lineup-image {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .lineup-image img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }

    .lineup-placeholder {
      font-size: 3rem;
      font-weight: 700;
      color: rgba(255,255,255,0.2);
    }

    .lineup-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 0.25rem;
    }

    .lineup-desc {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.6);
      margin: 0;
    }

    /* ========================================
       CINEMATIC
       ======================================== */

    .hero-ambient-text {
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(4rem, 15vw, 12rem);
      font-weight: 800;
      color: rgba(255,255,255,0.03);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
    }

    /* Video Hero */
    .hero-video-container {
      position: absolute;
      inset: 0;
    }

    .hero-video-container video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-video-fallback {
      display: none;
    }

    .hero-video-container video:not([src]),
    .hero-video-container video[src=""] {
      display: none;
    }

    .hero-video-container video:not([src]) + .hero-video-fallback,
    .hero-video-container video[src=""] + .hero-video-fallback {
      display: block;
    }

    .hero-video-control {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      transition: background 0.3s ease;
    }

    .hero-video-control:hover {
      background: rgba(255,255,255,0.3);
    }

    .hero-video-control svg {
      width: 20px;
      height: 20px;
      fill: #FFFFFF;
    }

    .hero-video-control .icon-play {
      display: none;
    }

    .hero-video-control.paused .icon-pause {
      display: none;
    }

    .hero-video-control.paused .icon-play {
      display: block;
    }

    /* ========================================
       TRUST
       ======================================== */

    .hero-trust-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 2rem;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .trust-years {
      font-family: 'Montserrat', sans-serif;
      font-size: 3rem;
      font-weight: 800;
      color: #E04A2F;
      line-height: 1;
    }

    .trust-text {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    .hero-testimonial {
      max-width: 500px;
      margin: 2rem auto;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.4s forwards;
    }

    .hero-testimonial blockquote {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.25rem;
      font-style: italic;
      color: rgba(255,255,255,0.9);
      margin: 0 0 1rem;
    }

    .hero-testimonial cite {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.6);
      font-style: normal;
    }

    .hero-trust-logos {
      display: flex;
      gap: 2rem;
      justify-content: center;
      align-items: center;
      margin: 2rem 0;
      opacity: 0;
      animation: heroFadeUp 0.8s ease-out 0.5s forwards;
    }

    .hero-trust-logos img {
      height: 50px;
      width: auto;
      filter: brightness(0) invert(1);
      opacity: 0.7;
    }

    /* ========================================
       BOOKING
       ======================================== */

    .hq-hero-booking {
      display: grid;
      grid-template-columns: 1fr 400px;
      align-items: center;
    }

    @media (max-width: 1024px) {
      .hq-hero-booking {
        grid-template-columns: 1fr;
      }
    }

    .hq-hero-booking .hero-split-content {
      background: transparent;
      justify-content: flex-start;
      padding-left: 8%;
    }

    .hero-booking-card {
      position: relative;
      z-index: 2;
      background: #FFFFFF;
      padding: 2.5rem;
      border-radius: 16px;
      margin: 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .booking-title {
      font-family: 'Inter', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #0A0A0A;
      margin: 0 0 1rem;
    }

    .booking-price {
      margin-bottom: 1.5rem;
    }

    .price-amount {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #E04A2F;
    }

    .price-duration {
      display: block;
      font-size: 0.875rem;
      color: #666666;
    }

    .booking-includes {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
    }

    .booking-includes li {
      padding: 0.5rem 0;
      font-size: 0.875rem;
      color: #333333;
      border-bottom: 1px solid #F5F5F5;
    }

    .booking-note {
      font-size: 0.75rem;
      color: #666666;
      text-align: center;
      margin-top: 1rem;
    }

    .booking-note a {
      color: #E04A2F;
      text-decoration: none;
    }

    /* ========================================
       DUAL CTA
       ======================================== */

    .hq-hero-dual {
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: relative;
    }

    @media (max-width: 768px) {
      .hq-hero-dual {
        grid-template-columns: 1fr;
      }
    }

    .hero-dual-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-dual-section .hero-content {
      text-align: center;
    }

    .hero-dual-section .hero-headline {
      font-size: clamp(3rem, 8vw, 6rem);
    }

    .hero-dual-divider {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #0A0A0A;
      z-index: 3;
    }

    /* ========================================
       EDITORIAL
       ======================================== */

    .hq-hero-magazine {
      background: #FAFAF8;
      padding: 0;
    }

    .hero-magazine-grid {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
      width: 100%;
    }

    @media (max-width: 1024px) {
      .hero-magazine-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
      }
    }

    .magazine-header {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem 2rem;
      border-bottom: 1px solid #E8E6E1;
    }

    .magazine-issue {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #999999;
    }

    .magazine-masthead {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      color: #0A0A0A;
      margin: 0.5rem 0;
    }

    .magazine-tagline {
      font-size: 0.875rem;
      color: #666666;
      font-style: italic;
    }

    .magazine-feature {
      position: relative;
    }

    .magazine-feature img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .magazine-sidebar {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      border-left: 1px solid #E8E6E1;
    }

    .magazine-story {
      padding-bottom: 2rem;
      border-bottom: 1px solid #E8E6E1;
    }

    .magazine-story:last-child {
      border-bottom: none;
    }

    .story-category {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #E04A2F;
    }

    .story-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #0A0A0A;
      margin: 0.5rem 0;
    }

    .story-excerpt {
      font-size: 0.875rem;
      color: #666666;
      line-height: 1.6;
    }

    .story-link {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #0A0A0A;
      text-decoration: none;
    }

    /* Story Scroll */
    .hq-hero-story {
      flex-direction: column;
      justify-content: flex-start;
      padding: 0;
    }

    .hero-story-stage {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hero-story-stage--1 {
      background: #0A0A0A;
    }

    .hero-story-stage--2 {
      background: #1A1A1A;
    }

    .hero-story-stage--3 {
      min-height: 100vh;
    }

    .story-text {
      max-width: 800px;
      padding: 2rem;
      text-align: center;
    }

    .story-line {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      color: #FFFFFF;
      line-height: 1.5;
      margin: 0;
    }

    .story-text--final {
      position: relative;
      z-index: 2;
    }

    /* ========================================
       ANIMATIONS
       ======================================== */

    @keyframes heroFadeUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes heroFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(8px); }
    }

    /* Left-aligned hero */
    .hq-hero-minimal-left .hero-content {
      text-align: left;
      padding-left: 8%;
      max-width: 700px;
      margin-right: auto;
    }
  `;

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  let currentIndex = 0;
  let favorites = [];
  let pickerVisible = true;
  let pickerElement = null;
  let heroContainer = null;

  function loadState() {
    try {
      const savedFavorites = localStorage.getItem('hq-hero-favorites');
      favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      const savedIndex = localStorage.getItem('hq-hero-current');
      const index = parseInt(savedIndex, 10);
      if (!isNaN(index) && index >= 0 && index < HERO_VERSIONS.length) {
        currentIndex = index;
      }
    } catch (e) {
      console.warn('Failed to load hero picker state:', e);
    }
  }

  function saveState() {
    localStorage.setItem('hq-hero-favorites', JSON.stringify(favorites));
    localStorage.setItem('hq-hero-current', currentIndex.toString());
  }

  // ============================================
  // HERO RENDERING
  // ============================================

  function renderHero(version) {
    if (!heroContainer) return;

    // Add transition
    heroContainer.style.opacity = '0';
    heroContainer.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      heroContainer.innerHTML = version.render();
      heroContainer.style.opacity = '1';

      // Initialize any interactive elements
      initHeroInteractions();
    }, 300);
  }

  function initHeroInteractions() {
    // Video controls
    const videoControl = document.querySelector('.hero-video-control');
    const video = document.querySelector('.hq-hero-video video');

    if (videoControl && video) {
      videoControl.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          videoControl.classList.remove('paused');
        } else {
          video.pause();
          videoControl.classList.add('paused');
        }
      });
    }

    // Stat counters
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
    });
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // NAVIGATION
  // ============================================

  function goNext() {
    currentIndex = (currentIndex + 1) % HERO_VERSIONS.length;
    renderHero(HERO_VERSIONS[currentIndex]);
    saveState();
    updatePicker();
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + HERO_VERSIONS.length) % HERO_VERSIONS.length;
    renderHero(HERO_VERSIONS[currentIndex]);
    saveState();
    updatePicker();
  }

  function goToVersion(index) {
    if (index >= 0 && index < HERO_VERSIONS.length) {
      currentIndex = index;
      renderHero(HERO_VERSIONS[currentIndex]);
      saveState();
      updatePicker();
    }
  }

  function toggleFavorite() {
    const currentId = HERO_VERSIONS[currentIndex].id;
    const index = favorites.indexOf(currentId);

    if (index === -1) {
      favorites.push(currentId);
    } else {
      favorites.splice(index, 1);
    }

    saveState();
    updatePicker();
  }

  function isFavorited() {
    return favorites.includes(HERO_VERSIONS[currentIndex].id);
  }

  // ============================================
  // PICKER UI
  // ============================================

  function createPicker() {
    const picker = document.createElement('div');
    picker.className = 'hq-hero-picker';
    picker.innerHTML = `
      <div class="picker-container">
        <div class="picker-header">
          <span class="picker-title">Hero A/B Testing</span>
          <div class="picker-header-actions">
            <button class="picker-grid-btn" title="View all versions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button class="picker-close-btn" title="Close picker">&times;</button>
          </div>
        </div>

        <div class="picker-content">
          <div class="picker-category"></div>
          <div class="picker-nav">
            <button class="picker-nav-btn picker-prev" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="picker-info">
              <div class="picker-counter"></div>
              <h3 class="picker-option-title"></h3>
              <p class="picker-option-desc"></p>
            </div>
            <button class="picker-nav-btn picker-next" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <button class="picker-favorite-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Favorite</span>
          </button>
        </div>

        <div class="picker-footer">
          <div class="picker-hints">
            <span><kbd>←</kbd><kbd>→</kbd> Navigate</span>
            <span><kbd>↑</kbd> Favorite</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div class="picker-fav-count"></div>
        </div>
      </div>

      <div class="picker-grid-overlay">
        <div class="picker-grid-header">
          <h2>All Hero Versions</h2>
          <button class="picker-grid-close">&times;</button>
        </div>
        <div class="picker-grid-content"></div>
      </div>
    `;

    // Add picker styles
    const pickerStyles = document.createElement('style');
    pickerStyles.textContent = `
      .hq-hero-picker {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .picker-container {
        background: #FFFFFF;
        border-radius: 12px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.2);
        width: 420px;
        overflow: hidden;
      }

      .picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 18px;
        background: #0A0A0A;
        color: #FFFFFF;
      }

      .picker-title {
        font-weight: 600;
        font-size: 0.875rem;
      }

      .picker-header-actions {
        display: flex;
        gap: 8px;
      }

      .picker-grid-btn,
      .picker-close-btn {
        background: none;
        border: none;
        color: #FFFFFF;
        cursor: pointer;
        padding: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .picker-grid-btn:hover,
      .picker-close-btn:hover {
        opacity: 1;
      }

      .picker-grid-btn svg {
        width: 18px;
        height: 18px;
      }

      .picker-close-btn {
        font-size: 1.5rem;
        line-height: 1;
      }

      .picker-content {
        padding: 20px;
      }

      .picker-category {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #E04A2F;
        margin-bottom: 8px;
        text-align: center;
      }

      .picker-nav {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .picker-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 1px solid #E8E6E1;
        border-radius: 8px;
        background: #FAFAF8;
        cursor: pointer;
        color: #0A0A0A;
        transition: all 0.2s;
      }

      .picker-nav-btn:hover {
        background: #E8E6E1;
      }

      .picker-nav-btn svg {
        width: 20px;
        height: 20px;
      }

      .picker-info {
        flex: 1;
        text-align: center;
      }

      .picker-counter {
        font-size: 0.75rem;
        color: #999999;
        margin-bottom: 4px;
      }

      .picker-option-title {
        font-size: 1rem;
        font-weight: 600;
        color: #0A0A0A;
        margin: 0 0 6px;
      }

      .picker-option-desc {
        font-size: 0.8rem;
        color: #666666;
        margin: 0;
        line-height: 1.4;
      }

      .picker-favorite-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        margin-top: 16px;
        padding: 12px;
        border: 1px solid #E8E6E1;
        border-radius: 8px;
        background: #FAFAF8;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        color: #666666;
        transition: all 0.2s;
      }

      .picker-favorite-btn:hover {
        background: #E8E6E1;
      }

      .picker-favorite-btn svg {
        width: 18px;
        height: 18px;
      }

      .picker-favorite-btn.active {
        background: #FEF3C7;
        border-color: #F59E0B;
        color: #D97706;
      }

      .picker-favorite-btn.active svg {
        fill: currentColor;
      }

      .picker-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 18px;
        background: #FAFAF8;
        border-top: 1px solid #E8E6E1;
      }

      .picker-hints {
        display: flex;
        gap: 14px;
        font-size: 0.7rem;
        color: #999999;
      }

      .picker-hints kbd {
        display: inline-block;
        padding: 2px 6px;
        background: #FFFFFF;
        border: 1px solid #E8E6E1;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.65rem;
      }

      .picker-fav-count {
        font-size: 0.75rem;
        font-weight: 600;
        color: #D97706;
      }

      /* Grid overlay */
      .picker-grid-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(10,10,10,0.95);
        z-index: 100000;
        overflow-y: auto;
      }

      .picker-grid-overlay.active {
        display: block;
      }

      .picker-grid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 32px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .picker-grid-header h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0;
      }

      .picker-grid-close {
        background: none;
        border: none;
        color: #FFFFFF;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.7;
      }

      .picker-grid-close:hover {
        opacity: 1;
      }

      .picker-grid-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 24px 32px;
      }

      .picker-grid-item {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .picker-grid-item:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.2);
      }

      .picker-grid-item.active {
        border-color: #E04A2F;
      }

      .picker-grid-item.favorited::after {
        content: '★';
        position: absolute;
        top: 12px;
        right: 12px;
        color: #F59E0B;
      }

      .grid-item-category {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #E04A2F;
        margin-bottom: 4px;
      }

      .grid-item-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0 0 4px;
      }

      .grid-item-desc {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.6);
        margin: 0;
        line-height: 1.4;
      }

      @media (max-width: 480px) {
        .hq-hero-picker {
          bottom: 16px;
          right: 16px;
          left: 16px;
        }
        .picker-container {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(pickerStyles);

    // Event listeners
    picker.querySelector('.picker-close-btn').addEventListener('click', closePicker);
    picker.querySelector('.picker-prev').addEventListener('click', goPrev);
    picker.querySelector('.picker-next').addEventListener('click', goNext);
    picker.querySelector('.picker-favorite-btn').addEventListener('click', toggleFavorite);
    picker.querySelector('.picker-grid-btn').addEventListener('click', openGridView);
    picker.querySelector('.picker-grid-close').addEventListener('click', closeGridView);

    // Build grid view
    const gridContent = picker.querySelector('.picker-grid-content');
    HERO_VERSIONS.forEach((version, index) => {
      const item = document.createElement('div');
      item.className = 'picker-grid-item';
      item.innerHTML = `
        <div class="grid-item-category">${version.category}</div>
        <h3 class="grid-item-title">${version.title}</h3>
        <p class="grid-item-desc">${version.description}</p>
      `;
      item.addEventListener('click', () => {
        goToVersion(index);
        closeGridView();
      });
      gridContent.appendChild(item);
    });

    document.body.appendChild(picker);
    return picker;
  }

  function updatePicker() {
    if (!pickerElement) return;

    const version = HERO_VERSIONS[currentIndex];
    const favorited = isFavorited();

    pickerElement.querySelector('.picker-category').textContent = version.category;
    pickerElement.querySelector('.picker-counter').textContent = `${currentIndex + 1} / ${HERO_VERSIONS.length}`;
    pickerElement.querySelector('.picker-option-title').textContent = version.title;
    pickerElement.querySelector('.picker-option-desc').textContent = version.description;

    const favBtn = pickerElement.querySelector('.picker-favorite-btn');
    favBtn.className = 'picker-favorite-btn' + (favorited ? ' active' : '');
    favBtn.querySelector('span').textContent = favorited ? 'Favorited' : 'Favorite';

    const favCount = pickerElement.querySelector('.picker-fav-count');
    favCount.textContent = favorites.length > 0 ? `${favorites.length} favorited` : '';

    // Update grid items
    const gridItems = pickerElement.querySelectorAll('.picker-grid-item');
    gridItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
      item.classList.toggle('favorited', favorites.includes(HERO_VERSIONS[index].id));
    });
  }

  function openGridView() {
    pickerElement.querySelector('.picker-grid-overlay').classList.add('active');
  }

  function closeGridView() {
    pickerElement.querySelector('.picker-grid-overlay').classList.remove('active');
  }

  function closePicker() {
    if (pickerElement) {
      pickerElement.querySelector('.picker-container').style.display = 'none';
      pickerVisible = false;
    }
  }

  function openPicker() {
    if (pickerElement) {
      pickerElement.querySelector('.picker-container').style.display = 'block';
      pickerVisible = true;
    }
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  function handleKeyDown(e) {
    // Don't interfere with inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        goNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        break;
      case 'ArrowUp':
        e.preventDefault();
        toggleFavorite();
        break;
      case 'Escape':
        e.preventDefault();
        const gridOverlay = pickerElement?.querySelector('.picker-grid-overlay');
        if (gridOverlay?.classList.contains('active')) {
          closeGridView();
        } else {
          closePicker();
        }
        break;
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Find or create hero container
    const existingHero = document.querySelector('.hq-hero');
    if (!existingHero) {
      console.warn('No .hq-hero element found');
      return;
    }

    // Create wrapper
    heroContainer = document.createElement('div');
    heroContainer.className = 'hq-hero-wrapper';
    heroContainer.style.cssText = 'position: relative; min-height: 100vh;';
    existingHero.parentNode.insertBefore(heroContainer, existingHero);
    existingHero.remove();

    // Add hero styles
    const styleEl = document.createElement('style');
    styleEl.textContent = HERO_STYLES;
    document.head.appendChild(styleEl);

    // Load state
    loadState();

    // Create picker
    pickerElement = createPicker();

    // Render initial hero
    renderHero(HERO_VERSIONS[currentIndex]);
    updatePicker();

    // Keyboard events
    window.addEventListener('keydown', handleKeyDown);

    console.log(`🎨 Hero Picker loaded with ${HERO_VERSIONS.length} versions`);
    console.log('Categories:', [...new Set(HERO_VERSIONS.map(v => v.category))].join(', '));
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.HQHeroPicker = {
    next: goNext,
    prev: goPrev,
    goTo: goToVersion,
    favorite: toggleFavorite,
    open: openPicker,
    close: closePicker,
    openGrid: openGridView,
    getVersions: () => HERO_VERSIONS,
    getFavorites: () => [...favorites],
    getCurrentVersion: () => HERO_VERSIONS[currentIndex],
    getCurrentIndex: () => currentIndex
  };

})();
