/**
 * HQ Aviation - Comprehensive Page Variation System
 * Maximum variety for A/B testing heroes, sections, and full page layouts
 */

(function() {
  'use strict';

  // ============================================
  // SECTION DEFINITIONS
  // ============================================

  const SECTIONS = {

    // ----------------------------------------
    // HERO VARIATIONS (25+ designs)
    // ----------------------------------------
    heroes: [
      // MINIMAL CATEGORY
      {
        id: 'hero-minimal-centered',
        category: 'Minimal',
        name: 'Centered Statement',
        desc: 'Tesla-style. Full-bleed image, centered text, single CTA.',
        html: `
          <section class="hq-section hq-hero hq-hero--minimal-centered">
            <div class="hq-hero__bg"><img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="R66 Alps"></div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-bottom"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline hq-text-hero">Elevate Your Journey</h1>
              <p class="hq-hero__tagline">Robinson helicopter specialists since 1990</p>
              <a href="#aircraft" class="hq-btn hq-btn--primary hq-btn--lg">Explore Aircraft</a>
            </div>
            <div class="hq-hero__scroll"><span>Scroll</span><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>
          </section>`
      },
      {
        id: 'hero-minimal-left',
        category: 'Minimal',
        name: 'Left Aligned',
        desc: 'Asymmetric. Text anchored left with breathing room.',
        html: `
          <section class="hq-section hq-hero hq-hero--minimal-left">
            <div class="hq-hero__bg"><img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition"></div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-right"></div>
            <div class="hq-hero__content hq-hero__content--left">
              <span class="hq-overline">Robinson Helicopter Dealer</span>
              <h1 class="hq-hero__headline hq-text-hero">The Sky<br>Awaits</h1>
              <p class="hq-hero__tagline">Sales • Training • Maintenance</p>
              <div class="hq-btn-group">
                <a href="#aircraft" class="hq-btn hq-btn--primary">View Aircraft</a>
                <a href="#contact" class="hq-btn hq-btn--ghost">Contact Us</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'hero-minimal-bold',
        category: 'Minimal',
        name: 'Bold Statement',
        desc: 'Oversized single word. Maximum impact.',
        html: `
          <section class="hq-section hq-hero hq-hero--minimal-bold">
            <div class="hq-hero__bg"><img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar"></div>
            <div class="hq-hero__overlay hq-hero__overlay--dark"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline hq-text-massive">FLY</h1>
              <p class="hq-hero__tagline hq-hero__tagline--spaced">SALES • TRAINING • MAINTENANCE</p>
              <a href="#start" class="hq-btn hq-btn--underline">Begin Your Journey →</a>
            </div>
          </section>`
      },
      {
        id: 'hero-minimal-two-line',
        category: 'Minimal',
        name: 'Two-Line Headline',
        desc: 'Stacked headline with elegant break.',
        html: `
          <section class="hq-section hq-hero hq-hero--minimal-centered">
            <div class="hq-hero__bg"><img src="/assets/images/team/british-helicopter-team.webp" alt="Team"></div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-bottom"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline hq-text-hero">Freedom<br><em>Redefined</em></h1>
              <p class="hq-hero__tagline">Where aviation dreams take flight</p>
              <a href="#discover" class="hq-btn hq-btn--primary hq-btn--lg">Discover More</a>
            </div>
          </section>`
      },

      // SPLIT CATEGORY
      {
        id: 'hero-split-50',
        category: 'Split',
        name: '50/50 Split',
        desc: 'Equal split. Content left, image right.',
        html: `
          <section class="hq-section hq-hero hq-hero--split-50">
            <div class="hq-hero__split-content">
              <div class="hq-hero__content hq-hero__content--left">
                <span class="hq-overline">UK's Premier Robinson Dealer</span>
                <h1 class="hq-hero__headline">Your Aviation<br>Partner</h1>
                <p class="hq-hero__tagline">From first flight to fleet management. Three decades of excellence.</p>
                <div class="hq-hero__stats">
                  <div class="hq-stat"><span class="hq-stat__value">30+</span><span class="hq-stat__label">Years</span></div>
                  <div class="hq-stat"><span class="hq-stat__value">500+</span><span class="hq-stat__label">Aircraft</span></div>
                  <div class="hq-stat"><span class="hq-stat__value">1000+</span><span class="hq-stat__label">Pilots</span></div>
                </div>
                <a href="#fleet" class="hq-btn hq-btn--primary">Explore Our Fleet</a>
              </div>
            </div>
            <div class="hq-hero__split-image">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
            </div>
          </section>`
      },
      {
        id: 'hero-split-reverse',
        category: 'Split',
        name: 'Split Reversed',
        desc: 'Image left, content right. Cream background.',
        html: `
          <section class="hq-section hq-hero hq-hero--split-reverse">
            <div class="hq-hero__split-image">
              <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Training">
            </div>
            <div class="hq-hero__split-content hq-hero__split-content--cream">
              <div class="hq-hero__content hq-hero__content--left hq-hero__content--dark">
                <span class="hq-overline">Flight Training</span>
                <h1 class="hq-hero__headline">Learn to Fly<br>Helicopters</h1>
                <p class="hq-hero__tagline">PPL(H) training from CAA-approved instructors. Zero to licensed pilot.</p>
                <div class="hq-btn-group">
                  <a href="#training" class="hq-btn hq-btn--dark">View Courses</a>
                  <a href="#trial" class="hq-btn hq-btn--outline-dark">Book Trial - £299</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'hero-split-asymmetric',
        category: 'Split',
        name: 'Asymmetric 60/40',
        desc: '60/40 split with overlapping card.',
        html: `
          <section class="hq-section hq-hero hq-hero--split-asymmetric">
            <div class="hq-hero__bg-section">
              <img src="/assets/images/team/british-helicopter-team.webp" alt="Team">
            </div>
            <div class="hq-hero__card">
              <span class="hq-badge hq-badge--primary">Robinson Authorized</span>
              <h1 class="hq-hero__headline hq-hero__headline--dark">Excellence in<br>Every Detail</h1>
              <p class="hq-hero__tagline hq-hero__tagline--dark">EASA Part-145 certified. Factory-trained engineers.</p>
              <a href="#services" class="hq-btn hq-btn--dark">Our Services</a>
              <div class="hq-hero__logos">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
              </div>
            </div>
          </section>`
      },
      {
        id: 'hero-split-diagonal',
        category: 'Split',
        name: 'Diagonal Split',
        desc: 'Angled divider between content and image.',
        html: `
          <section class="hq-section hq-hero hq-hero--split-diagonal">
            <div class="hq-hero__split-content">
              <div class="hq-hero__content hq-hero__content--left">
                <span class="hq-overline">New Aircraft</span>
                <h1 class="hq-hero__headline">R66 Turbine</h1>
                <p class="hq-hero__tagline">Power, reliability, and luxury combined.</p>
                <a href="#r66" class="hq-btn hq-btn--primary">Configure Yours</a>
              </div>
            </div>
            <div class="hq-hero__split-image hq-hero__split-image--diagonal">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66">
            </div>
          </section>`
      },

      // PRODUCT CATEGORY
      {
        id: 'hero-product-showcase',
        category: 'Product',
        name: 'Product Showcase',
        desc: 'Aircraft as hero with floating specs.',
        html: `
          <section class="hq-section hq-hero hq-hero--product">
            <div class="hq-hero__bg hq-hero__bg--gradient-light"></div>
            <div class="hq-hero__product-image">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66 Turbine">
            </div>
            <div class="hq-hero__content hq-hero__content--center hq-hero__content--dark">
              <span class="hq-overline">New Aircraft</span>
              <h1 class="hq-hero__headline">Robinson R66 Turbine</h1>
              <p class="hq-hero__tagline">The world's best-selling turbine helicopter.</p>
              <div class="hq-btn-group">
                <a href="#configure" class="hq-btn hq-btn--dark">Configure Yours</a>
                <a href="#quote" class="hq-btn hq-btn--outline-dark">Request Quote</a>
              </div>
            </div>
            <div class="hq-hero__specs">
              <div class="hq-spec"><span class="hq-spec__value">300</span><span class="hq-spec__label">SHP</span></div>
              <div class="hq-spec"><span class="hq-spec__value">4</span><span class="hq-spec__label">Seats</span></div>
              <div class="hq-spec"><span class="hq-spec__value">350</span><span class="hq-spec__label">NM Range</span></div>
              <div class="hq-spec"><span class="hq-spec__value">140</span><span class="hq-spec__label">KTS</span></div>
            </div>
          </section>`
      },
      {
        id: 'hero-product-lineup',
        category: 'Product',
        name: 'Product Lineup',
        desc: 'Multiple aircraft grid. Drives exploration.',
        html: `
          <section class="hq-section hq-hero hq-hero--lineup">
            <div class="hq-hero__bg hq-hero__bg--dark"></div>
            <div class="hq-hero__content hq-hero__content--top">
              <span class="hq-overline hq-overline--light">The Robinson Range</span>
              <h1 class="hq-hero__headline">Find Your Aircraft</h1>
            </div>
            <div class="hq-hero__lineup-grid">
              <a href="#r22" class="hq-lineup-card">
                <div class="hq-lineup-card__image"><img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22"></div>
                <h3 class="hq-lineup-card__name">R22</h3>
                <p class="hq-lineup-card__desc">Training & Personal</p>
              </a>
              <a href="#r44" class="hq-lineup-card">
                <div class="hq-lineup-card__image"><img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44"></div>
                <h3 class="hq-lineup-card__name">R44</h3>
                <p class="hq-lineup-card__desc">Versatile 4-Seat</p>
              </a>
              <a href="#r66" class="hq-lineup-card hq-lineup-card--featured">
                <span class="hq-lineup-card__badge">Most Popular</span>
                <div class="hq-lineup-card__image"><img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4-1.png" alt="R66"></div>
                <h3 class="hq-lineup-card__name">R66 Turbine</h3>
                <p class="hq-lineup-card__desc">Power & Luxury</p>
              </a>
            </div>
            <a href="/used-aircraft" class="hq-btn hq-btn--ghost">View Pre-Owned →</a>
          </section>`
      },
      {
        id: 'hero-product-comparison',
        category: 'Product',
        name: 'Comparison View',
        desc: 'Side-by-side aircraft comparison teaser.',
        html: `
          <section class="hq-section hq-hero hq-hero--comparison">
            <div class="hq-hero__bg hq-hero__bg--ivory"></div>
            <div class="hq-hero__content hq-hero__content--top hq-hero__content--dark">
              <span class="hq-overline">Compare Models</span>
              <h1 class="hq-hero__headline">Which Robinson<br>Is Right For You?</h1>
            </div>
            <div class="hq-hero__comparison-grid">
              <div class="hq-compare-item">
                <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                <h3>R44 Raven II</h3>
                <ul class="hq-compare-specs">
                  <li>4 Seats</li>
                  <li>Piston Engine</li>
                  <li>From £POA</li>
                </ul>
              </div>
              <div class="hq-compare-vs">VS</div>
              <div class="hq-compare-item">
                <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                <h3>R66 Turbine</h3>
                <ul class="hq-compare-specs">
                  <li>4+1 Seats</li>
                  <li>Turbine Engine</li>
                  <li>From £POA</li>
                </ul>
              </div>
            </div>
            <a href="#compare" class="hq-btn hq-btn--dark">Full Comparison</a>
          </section>`
      },

      // CINEMATIC CATEGORY
      {
        id: 'hero-cinematic-dark',
        category: 'Cinematic',
        name: 'Cinematic Dark',
        desc: 'Moody, atmospheric. Premium luxury feel.',
        html: `
          <section class="hq-section hq-hero hq-hero--cinematic">
            <div class="hq-hero__bg"><img src="/assets/images/legacy/dated/20251217_183027.jpg" alt="Dusk"></div>
            <div class="hq-hero__overlay hq-hero__overlay--cinematic"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline hq-text-elegant">Beyond<br>Boundaries</h1>
              <p class="hq-hero__tagline">Where precision meets passion</p>
              <div class="hq-btn-group hq-btn-group--stacked">
                <a href="#aircraft" class="hq-btn hq-btn--primary hq-btn--lg">Discover Our Aircraft</a>
                <a href="#contact" class="hq-btn hq-btn--text">Schedule a Consultation</a>
              </div>
            </div>
            <div class="hq-hero__ambient">HQ AVIATION</div>
          </section>`
      },
      {
        id: 'hero-cinematic-video',
        category: 'Cinematic',
        name: 'Video Background',
        desc: 'Looping video with fallback image.',
        html: `
          <section class="hq-section hq-hero hq-hero--video">
            <div class="hq-hero__video-container">
              <video autoplay muted loop playsinline poster="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp">
                <source src="/assets/video/hero-loop.mp4" type="video/mp4">
              </video>
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Flight" class="hq-hero__video-fallback">
            </div>
            <div class="hq-hero__overlay hq-hero__overlay--video"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline">Experience Flight</h1>
              <p class="hq-hero__tagline">Book your discovery flight today</p>
              <a href="#book" class="hq-btn hq-btn--primary hq-btn--lg">Book Now - £299</a>
            </div>
            <button class="hq-hero__video-control" aria-label="Pause video">
              <span class="hq-icon-pause">❚❚</span>
              <span class="hq-icon-play">▶</span>
            </button>
          </section>`
      },
      {
        id: 'hero-cinematic-parallax',
        category: 'Cinematic',
        name: 'Parallax Layers',
        desc: 'Multi-layer depth effect on scroll.',
        html: `
          <section class="hq-section hq-hero hq-hero--parallax">
            <div class="hq-hero__parallax-bg" data-speed="0.3">
              <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Alps">
            </div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-up"></div>
            <div class="hq-hero__content hq-hero__content--center" data-speed="0.6">
              <span class="hq-overline">Helicopter Expeditions</span>
              <h1 class="hq-hero__headline hq-text-hero">Adventure<br>Reimagined</h1>
              <p class="hq-hero__tagline">From the Alps to Antarctica</p>
              <a href="#expeditions" class="hq-btn hq-btn--primary">Plan Your Expedition</a>
            </div>
          </section>`
      },
      {
        id: 'hero-cinematic-fade',
        category: 'Cinematic',
        name: 'Crossfade Gallery',
        desc: 'Auto-fading background images.',
        html: `
          <section class="hq-section hq-hero hq-hero--crossfade">
            <div class="hq-hero__crossfade">
              <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Alps" class="active">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition">
              <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
            </div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-bottom"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <h1 class="hq-hero__headline hq-text-hero">Three Decades<br>of Excellence</h1>
              <p class="hq-hero__tagline">Robinson helicopter specialists</p>
              <a href="#about" class="hq-btn hq-btn--primary">Our Story</a>
            </div>
          </section>`
      },

      // TRUST CATEGORY
      {
        id: 'hero-trust-heritage',
        category: 'Trust',
        name: 'Heritage Focus',
        desc: '30+ years experience front and center.',
        html: `
          <section class="hq-section hq-hero hq-hero--trust">
            <div class="hq-hero__bg"><img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar"></div>
            <div class="hq-hero__overlay hq-hero__overlay--trust"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <div class="hq-hero__trust-badge">
                <span class="hq-hero__trust-years">30+</span>
                <span class="hq-hero__trust-text">Years of Excellence</span>
              </div>
              <h1 class="hq-hero__headline">Trusted by Pilots<br>Worldwide</h1>
              <div class="hq-hero__testimonial">
                <blockquote>"The team at HQ Aviation made buying my R66 seamless."</blockquote>
                <cite>— James H., R66 Owner</cite>
              </div>
              <div class="hq-hero__logos">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
                <img src="/assets/images/logos/partners/bhalogo.jpg" alt="BHA">
              </div>
              <a href="#contact" class="hq-btn hq-btn--primary">Speak With Our Team</a>
            </div>
          </section>`
      },
      {
        id: 'hero-trust-stats',
        category: 'Trust',
        name: 'Statistics Led',
        desc: 'Numbers tell the story. Animated counters.',
        html: `
          <section class="hq-section hq-hero hq-hero--stats">
            <div class="hq-hero__bg hq-hero__bg--ivory"></div>
            <div class="hq-hero__content hq-hero__content--center hq-hero__content--dark">
              <span class="hq-overline">By The Numbers</span>
              <h1 class="hq-hero__headline">Results That<br>Speak</h1>
              <div class="hq-hero__stats-grid">
                <div class="hq-stat-lg"><span class="hq-stat-lg__value" data-count="500">0</span><span class="hq-stat-lg__label">Aircraft Sold</span></div>
                <div class="hq-stat-lg"><span class="hq-stat-lg__value" data-count="1200">0</span><span class="hq-stat-lg__label">Pilots Trained</span></div>
                <div class="hq-stat-lg"><span class="hq-stat-lg__value" data-count="50000">0</span><span class="hq-stat-lg__label">Flight Hours</span></div>
                <div class="hq-stat-lg"><span class="hq-stat-lg__value" data-count="30">0</span><span class="hq-stat-lg__label">Years</span></div>
              </div>
              <a href="#aircraft" class="hq-btn hq-btn--dark">Join Our Legacy</a>
            </div>
          </section>`
      },
      {
        id: 'hero-trust-testimonials',
        category: 'Trust',
        name: 'Testimonial Slider',
        desc: 'Customer quotes with rotating carousel.',
        html: `
          <section class="hq-section hq-hero hq-hero--testimonials">
            <div class="hq-hero__bg"><img src="/assets/images/team/british-helicopter-team.webp" alt="Team"></div>
            <div class="hq-hero__overlay hq-hero__overlay--dark"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <span class="hq-overline">What Our Clients Say</span>
              <div class="hq-hero__testimonial-slider">
                <div class="hq-testimonial-slide active">
                  <blockquote>"Outstanding service from start to finish. Highly recommend."</blockquote>
                  <cite>— Michael S., Private Pilot</cite>
                </div>
                <div class="hq-testimonial-slide">
                  <blockquote>"The best helicopter training school in the UK, hands down."</blockquote>
                  <cite>— Sarah T., PPL Student</cite>
                </div>
              </div>
              <div class="hq-hero__testimonial-dots">
                <button class="active"></button>
                <button></button>
              </div>
              <a href="#testimonials" class="hq-btn hq-btn--primary">Read More Reviews</a>
            </div>
          </section>`
      },

      // ACTION CATEGORY
      {
        id: 'hero-action-booking',
        category: 'Action',
        name: 'Direct Booking',
        desc: 'Embedded booking card. Reduce friction.',
        html: `
          <section class="hq-section hq-hero hq-hero--booking">
            <div class="hq-hero__bg"><img src="/assets/images/team/british-helicopter-team.webp" alt="Training"></div>
            <div class="hq-hero__overlay hq-hero__overlay--booking"></div>
            <div class="hq-hero__split-content">
              <div class="hq-hero__content hq-hero__content--left">
                <span class="hq-overline">Discovery Flights</span>
                <h1 class="hq-hero__headline">Take the Controls</h1>
                <p class="hq-hero__tagline">Experience 30 minutes of flight time with a professional instructor.</p>
              </div>
            </div>
            <div class="hq-hero__booking-card">
              <h3>Book Your Flight</h3>
              <div class="hq-booking-price">
                <span class="hq-booking-price__amount">£299</span>
                <span class="hq-booking-price__duration">30 min flight</span>
              </div>
              <ul class="hq-booking-includes">
                <li>✓ Pre-flight briefing</li>
                <li>✓ Hands-on controls</li>
                <li>✓ Certificate of flight</li>
                <li>✓ Photo opportunity</li>
              </ul>
              <a href="#book" class="hq-btn hq-btn--primary hq-btn--full">Book Now</a>
              <p class="hq-booking-note">Or call <a href="tel:+441753868976">01753 868976</a></p>
            </div>
          </section>`
      },
      {
        id: 'hero-action-dual',
        category: 'Action',
        name: 'Dual Path CTA',
        desc: 'Two paths: Buy or Learn. Segments instantly.',
        html: `
          <section class="hq-section hq-hero hq-hero--dual">
            <div class="hq-hero__dual-section hq-hero__dual-section--buy">
              <div class="hq-hero__bg"><img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66"></div>
              <div class="hq-hero__overlay hq-hero__overlay--subtle"></div>
              <div class="hq-hero__content">
                <span class="hq-overline">Aircraft Sales</span>
                <h2 class="hq-hero__headline hq-text-5xl">Buy</h2>
                <p class="hq-hero__tagline">New & pre-owned helicopters</p>
                <a href="#aircraft" class="hq-btn hq-btn--primary">View Aircraft</a>
              </div>
            </div>
            <div class="hq-hero__dual-section hq-hero__dual-section--learn">
              <div class="hq-hero__bg"><img src="/assets/images/team/british-helicopter-team.webp" alt="Training"></div>
              <div class="hq-hero__overlay hq-hero__overlay--subtle"></div>
              <div class="hq-hero__content">
                <span class="hq-overline">Flight Training</span>
                <h2 class="hq-hero__headline hq-text-5xl">Learn</h2>
                <p class="hq-hero__tagline">PPL(H) & discovery flights</p>
                <a href="#training" class="hq-btn hq-btn--primary">Start Training</a>
              </div>
            </div>
            <div class="hq-hero__dual-divider"><span>OR</span></div>
          </section>`
      },
      {
        id: 'hero-action-triple',
        category: 'Action',
        name: 'Triple Path',
        desc: 'Three clear paths: Buy, Learn, Service.',
        html: `
          <section class="hq-section hq-hero hq-hero--triple">
            <div class="hq-hero__bg hq-hero__bg--dark"></div>
            <div class="hq-hero__content hq-hero__content--top">
              <h1 class="hq-hero__headline">How Can We Help?</h1>
            </div>
            <div class="hq-hero__triple-grid">
              <a href="#aircraft" class="hq-path-card">
                <div class="hq-path-card__icon">🚁</div>
                <h3 class="hq-path-card__title">Buy an Aircraft</h3>
                <p class="hq-path-card__desc">New & pre-owned Robinson helicopters</p>
              </a>
              <a href="#training" class="hq-path-card">
                <div class="hq-path-card__icon">📚</div>
                <h3 class="hq-path-card__title">Learn to Fly</h3>
                <p class="hq-path-card__desc">PPL(H) courses & trial lessons</p>
              </a>
              <a href="#services" class="hq-path-card">
                <div class="hq-path-card__icon">🔧</div>
                <h3 class="hq-path-card__title">Get Service</h3>
                <p class="hq-path-card__desc">Maintenance, parts & management</p>
              </a>
            </div>
          </section>`
      },
      {
        id: 'hero-action-form',
        category: 'Action',
        name: 'Inline Form',
        desc: 'Contact form embedded in hero.',
        html: `
          <section class="hq-section hq-hero hq-hero--form">
            <div class="hq-hero__bg"><img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar"></div>
            <div class="hq-hero__overlay hq-hero__overlay--gradient-right"></div>
            <div class="hq-hero__split-content">
              <div class="hq-hero__content hq-hero__content--left">
                <span class="hq-overline">Get In Touch</span>
                <h1 class="hq-hero__headline">Let's Talk<br>Helicopters</h1>
                <p class="hq-hero__tagline">Whether you're buying, training, or need service—we're here to help.</p>
              </div>
            </div>
            <div class="hq-hero__form-card">
              <form class="hq-form">
                <input type="text" placeholder="Your Name" class="hq-input">
                <input type="email" placeholder="Email Address" class="hq-input">
                <select class="hq-select">
                  <option>I'm interested in...</option>
                  <option>Buying an aircraft</option>
                  <option>Flight training</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
                <textarea placeholder="Tell us more..." class="hq-textarea"></textarea>
                <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Send Message</button>
              </form>
            </div>
          </section>`
      },

      // EDITORIAL CATEGORY
      {
        id: 'hero-editorial-magazine',
        category: 'Editorial',
        name: 'Magazine Style',
        desc: 'Editorial layout with featured article feel.',
        html: `
          <section class="hq-section hq-hero hq-hero--magazine">
            <div class="hq-hero__magazine-grid">
              <div class="hq-magazine-header">
                <span class="hq-magazine-issue">Since 1990</span>
                <h1 class="hq-magazine-masthead">HQ Aviation</h1>
                <span class="hq-magazine-tagline">The Art of Helicopter Excellence</span>
              </div>
              <div class="hq-magazine-feature">
                <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Featured">
              </div>
              <div class="hq-magazine-sidebar">
                <div class="hq-magazine-story">
                  <span class="hq-magazine-story__cat">Featured</span>
                  <h2 class="hq-magazine-story__title">Adventures Beyond Horizons</h2>
                  <p class="hq-magazine-story__excerpt">From Antarctic expeditions to Alpine crossings.</p>
                  <a href="#" class="hq-magazine-story__link">Read More →</a>
                </div>
                <div class="hq-magazine-story">
                  <span class="hq-magazine-story__cat">New Aircraft</span>
                  <h2 class="hq-magazine-story__title">The R66 NxG Arrives</h2>
                  <p class="hq-magazine-story__excerpt">Next generation turbine. Now available.</p>
                  <a href="#" class="hq-magazine-story__link">Explore →</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'hero-editorial-story',
        category: 'Editorial',
        name: 'Story Scroll',
        desc: 'Narrative intro that invites scrolling.',
        html: `
          <section class="hq-section hq-hero hq-hero--story">
            <div class="hq-hero__story-stage hq-hero__story-stage--1">
              <p class="hq-story-line">In 1990, a passion for flight became a mission.</p>
            </div>
            <div class="hq-hero__story-stage hq-hero__story-stage--2">
              <p class="hq-story-line">Today, that mission has helped hundreds take to the skies.</p>
            </div>
            <div class="hq-hero__story-stage hq-hero__story-stage--3">
              <div class="hq-hero__bg"><img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Flying"></div>
              <div class="hq-hero__overlay hq-hero__overlay--subtle"></div>
              <div class="hq-hero__content hq-hero__content--center">
                <h1 class="hq-hero__headline hq-text-hero">Your Story<br>Starts Here</h1>
                <a href="#begin" class="hq-btn hq-btn--primary">Begin</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'hero-editorial-quote',
        category: 'Editorial',
        name: 'Large Quote',
        desc: 'Founder quote as hero statement.',
        html: `
          <section class="hq-section hq-hero hq-hero--quote">
            <div class="hq-hero__bg hq-hero__bg--charcoal"></div>
            <div class="hq-hero__content hq-hero__content--center">
              <blockquote class="hq-hero__blockquote">
                "Flying is not just about the destination—it's about the freedom to explore the world from a perspective few ever experience."
              </blockquote>
              <cite class="hq-hero__cite">— Quentin Smith, Founder</cite>
              <a href="#about" class="hq-btn hq-btn--ghost">Our Story</a>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // AIRCRAFT SECTION VARIATIONS
    // ----------------------------------------
    aircraft: [
      {
        id: 'aircraft-grid-3',
        category: 'Grid',
        name: '3-Column Cards',
        desc: 'Standard grid with hover effects.',
        html: `
          <section class="hq-section hq-aircraft hq-aircraft--grid-3" id="aircraft">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Fleet</span>
                <h2 class="hq-section-title">Featured Aircraft</h2>
              </div>
              <div class="hq-aircraft__grid hq-aircraft__grid--3">
                <a href="#r66" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                  </div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R66 Turbine</h3>
                    <p class="hq-aircraft-card__desc">5-seat turbine helicopter with exceptional performance.</p>
                  </div>
                </a>
                <a href="#r44" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                  </div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R44 Raven II</h3>
                    <p class="hq-aircraft-card__desc">Versatile 4-seat piston helicopter.</p>
                  </div>
                </a>
                <a href="#r22" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22">
                  </div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R22 Beta II</h3>
                    <p class="hq-aircraft-card__desc">World's most popular training helicopter.</p>
                  </div>
                </a>
              </div>
              <div class="hq-section-footer">
                <a href="/used-aircraft" class="hq-btn hq-btn--outline">View All Aircraft</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'aircraft-featured-large',
        category: 'Featured',
        name: 'Large Featured',
        desc: 'One large featured + two smaller.',
        html: `
          <section class="hq-section hq-aircraft hq-aircraft--featured-large" id="aircraft">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Fleet</span>
                <h2 class="hq-section-title">Featured Aircraft</h2>
              </div>
              <div class="hq-aircraft__featured-layout">
                <a href="#r66" class="hq-aircraft-card hq-aircraft-card--large">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66">
                    <span class="hq-badge hq-badge--featured">Featured</span>
                  </div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson R66 Turbine</span>
                    <h3 class="hq-aircraft-card__name">The Ultimate in Personal Aviation</h3>
                    <p class="hq-aircraft-card__desc">300 SHP Rolls-Royce RR300 turbine engine. 5 seats. Glass cockpit available.</p>
                    <span class="hq-btn hq-btn--dark">Learn More →</span>
                  </div>
                </a>
                <div class="hq-aircraft__side-cards">
                  <a href="#r44" class="hq-aircraft-card hq-aircraft-card--horizontal">
                    <div class="hq-aircraft-card__image">
                      <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                    </div>
                    <div class="hq-aircraft-card__body">
                      <span class="hq-aircraft-card__model">Robinson</span>
                      <h3 class="hq-aircraft-card__name">R44 Raven II</h3>
                    </div>
                  </a>
                  <a href="#r22" class="hq-aircraft-card hq-aircraft-card--horizontal">
                    <div class="hq-aircraft-card__image">
                      <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22">
                    </div>
                    <div class="hq-aircraft-card__body">
                      <span class="hq-aircraft-card__model">Robinson</span>
                      <h3 class="hq-aircraft-card__name">R22 Beta II</h3>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'aircraft-carousel',
        category: 'Carousel',
        name: 'Horizontal Scroll',
        desc: 'Horizontal carousel with peek.',
        html: `
          <section class="hq-section hq-aircraft hq-aircraft--carousel" id="aircraft">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--with-nav">
                <div>
                  <span class="hq-overline">Our Fleet</span>
                  <h2 class="hq-section-title">Featured Aircraft</h2>
                </div>
                <div class="hq-carousel-nav">
                  <button class="hq-carousel-btn hq-carousel-btn--prev">←</button>
                  <button class="hq-carousel-btn hq-carousel-btn--next">→</button>
                </div>
              </div>
            </div>
            <div class="hq-aircraft__carousel">
              <div class="hq-aircraft__carousel-track">
                <a href="#r66" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image"><img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66"></div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R66 Turbine</h3>
                  </div>
                </a>
                <a href="#r44" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image"><img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44"></div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R44 Raven II</h3>
                  </div>
                </a>
                <a href="#r22" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image"><img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22"></div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Robinson</span>
                    <h3 class="hq-aircraft-card__name">R22 Beta II</h3>
                  </div>
                </a>
                <a href="#used" class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image hq-aircraft-card__image--placeholder">
                    <span>Pre-Owned</span>
                  </div>
                  <div class="hq-aircraft-card__body">
                    <span class="hq-aircraft-card__model">Various</span>
                    <h3 class="hq-aircraft-card__name">Used Aircraft</h3>
                  </div>
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'aircraft-comparison-table',
        category: 'Comparison',
        name: 'Comparison Table',
        desc: 'Side-by-side specs comparison.',
        html: `
          <section class="hq-section hq-aircraft hq-aircraft--comparison" id="aircraft">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Compare Models</span>
                <h2 class="hq-section-title">Find Your Perfect Helicopter</h2>
              </div>
              <div class="hq-comparison-table">
                <div class="hq-comparison-table__header">
                  <div class="hq-comparison-table__cell"></div>
                  <div class="hq-comparison-table__cell">
                    <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22">
                    <h3>R22 Beta II</h3>
                  </div>
                  <div class="hq-comparison-table__cell">
                    <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                    <h3>R44 Raven II</h3>
                  </div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured">
                    <span class="hq-badge">Popular</span>
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                    <h3>R66 Turbine</h3>
                  </div>
                </div>
                <div class="hq-comparison-table__row">
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--label">Seats</div>
                  <div class="hq-comparison-table__cell">2</div>
                  <div class="hq-comparison-table__cell">4</div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured">5</div>
                </div>
                <div class="hq-comparison-table__row">
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--label">Engine</div>
                  <div class="hq-comparison-table__cell">Piston</div>
                  <div class="hq-comparison-table__cell">Piston</div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured">Turbine</div>
                </div>
                <div class="hq-comparison-table__row">
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--label">Cruise Speed</div>
                  <div class="hq-comparison-table__cell">96 kts</div>
                  <div class="hq-comparison-table__cell">113 kts</div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured">140 kts</div>
                </div>
                <div class="hq-comparison-table__row">
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--label">Range</div>
                  <div class="hq-comparison-table__cell">185 nm</div>
                  <div class="hq-comparison-table__cell">300 nm</div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured">350 nm</div>
                </div>
                <div class="hq-comparison-table__footer">
                  <div class="hq-comparison-table__cell"></div>
                  <div class="hq-comparison-table__cell"><a href="#r22" class="hq-btn hq-btn--outline hq-btn--sm">Learn More</a></div>
                  <div class="hq-comparison-table__cell"><a href="#r44" class="hq-btn hq-btn--outline hq-btn--sm">Learn More</a></div>
                  <div class="hq-comparison-table__cell hq-comparison-table__cell--featured"><a href="#r66" class="hq-btn hq-btn--primary hq-btn--sm">Learn More</a></div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'aircraft-masonry',
        category: 'Masonry',
        name: 'Masonry Grid',
        desc: 'Pinterest-style varied heights.',
        html: `
          <section class="hq-section hq-aircraft hq-aircraft--masonry" id="aircraft">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Fleet</span>
                <h2 class="hq-section-title">Aircraft Collection</h2>
              </div>
              <div class="hq-aircraft__masonry">
                <a href="#r66" class="hq-masonry-card hq-masonry-card--tall">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66">
                  <div class="hq-masonry-card__overlay">
                    <h3>R66 Turbine</h3>
                    <span>5 Seats • Turbine</span>
                  </div>
                </a>
                <a href="#r44" class="hq-masonry-card">
                  <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                  <div class="hq-masonry-card__overlay">
                    <h3>R44 Raven II</h3>
                    <span>4 Seats • Piston</span>
                  </div>
                </a>
                <a href="#hangar" class="hq-masonry-card">
                  <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
                  <div class="hq-masonry-card__overlay">
                    <h3>Visit Our Hangar</h3>
                    <span>Denham Aerodrome</span>
                  </div>
                </a>
                <a href="#r22" class="hq-masonry-card hq-masonry-card--tall">
                  <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22">
                  <div class="hq-masonry-card__overlay">
                    <h3>R22 Beta II</h3>
                    <span>2 Seats • Training</span>
                  </div>
                </a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // SERVICES/TRAINING SECTION VARIATIONS
    // ----------------------------------------
    services: [
      {
        id: 'services-icons-4',
        category: 'Icons',
        name: '4-Column Icons',
        desc: 'Icon-led service cards in a row.',
        html: `
          <section class="hq-section hq-services hq-services--icons-4" id="services">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">What We Do</span>
                <h2 class="hq-section-title">Our Services</h2>
              </div>
              <div class="hq-services__grid hq-services__grid--4">
                <a href="#sales" class="hq-service-card">
                  <div class="hq-service-card__icon">🚁</div>
                  <h3 class="hq-service-card__title">Aircraft Sales</h3>
                  <p class="hq-service-card__desc">New & pre-owned Robinson helicopters</p>
                </a>
                <a href="#training" class="hq-service-card">
                  <div class="hq-service-card__icon">📚</div>
                  <h3 class="hq-service-card__title">Flight Training</h3>
                  <p class="hq-service-card__desc">PPL(H) courses & discovery flights</p>
                </a>
                <a href="#maintenance" class="hq-service-card">
                  <div class="hq-service-card__icon">🔧</div>
                  <h3 class="hq-service-card__title">Maintenance</h3>
                  <p class="hq-service-card__desc">EASA Part-145 certified facility</p>
                </a>
                <a href="#management" class="hq-service-card">
                  <div class="hq-service-card__icon">📋</div>
                  <h3 class="hq-service-card__title">Management</h3>
                  <p class="hq-service-card__desc">Complete aircraft management</p>
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'services-split-image',
        category: 'Split',
        name: 'Split with Image',
        desc: 'Half image, half services list.',
        html: `
          <section class="hq-section hq-services hq-services--split" id="services">
            <div class="hq-services__image">
              <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
            </div>
            <div class="hq-services__content">
              <span class="hq-overline">Full Service</span>
              <h2 class="hq-section-title">Everything Under<br>One Roof</h2>
              <ul class="hq-services__list">
                <li class="hq-services__item">
                  <h3>Aircraft Sales</h3>
                  <p>Authorized Robinson dealer for new and pre-owned helicopters.</p>
                </li>
                <li class="hq-services__item">
                  <h3>Flight Training</h3>
                  <p>CAA-approved training from PPL(H) to instructor ratings.</p>
                </li>
                <li class="hq-services__item">
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 certified with factory-trained engineers.</p>
                </li>
                <li class="hq-services__item">
                  <h3>Management</h3>
                  <p>Hangarage, leaseback, and full aircraft management.</p>
                </li>
              </ul>
              <a href="#contact" class="hq-btn hq-btn--dark">Get in Touch</a>
            </div>
          </section>`
      },
      {
        id: 'services-hover-cards',
        category: 'Cards',
        name: 'Hover Reveal Cards',
        desc: 'Cards that reveal more on hover.',
        html: `
          <section class="hq-section hq-services hq-services--hover" id="services">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Services</span>
                <h2 class="hq-section-title">What We Offer</h2>
              </div>
              <div class="hq-services__grid hq-services__grid--2">
                <a href="#sales" class="hq-hover-card">
                  <div class="hq-hover-card__bg">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Sales">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3 class="hq-hover-card__title">Aircraft Sales</h3>
                    <p class="hq-hover-card__desc">New and pre-owned Robinson helicopters. Expert guidance from selection to delivery.</p>
                    <span class="hq-hover-card__link">Learn More →</span>
                  </div>
                </a>
                <a href="#training" class="hq-hover-card">
                  <div class="hq-hover-card__bg">
                    <img src="/assets/images/team/british-helicopter-team.webp" alt="Training">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3 class="hq-hover-card__title">Flight Training</h3>
                    <p class="hq-hover-card__desc">From trial lessons to commercial licenses. CAA-approved instructors.</p>
                    <span class="hq-hover-card__link">Learn More →</span>
                  </div>
                </a>
                <a href="#maintenance" class="hq-hover-card">
                  <div class="hq-hover-card__bg">
                    <img src="/assets/images/facility/busy-hangar.jpg" alt="Maintenance">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3 class="hq-hover-card__title">Maintenance</h3>
                    <p class="hq-hover-card__desc">EASA Part-145. Full overhauls, 100-hour inspections, AOG support.</p>
                    <span class="hq-hover-card__link">Learn More →</span>
                  </div>
                </a>
                <a href="#expeditions" class="hq-hover-card">
                  <div class="hq-hover-card__bg">
                    <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expeditions">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3 class="hq-hover-card__title">Expeditions</h3>
                    <p class="hq-hover-card__desc">Worldwide helicopter adventures. Alps, Arctic, and beyond.</p>
                    <span class="hq-hover-card__link">Learn More →</span>
                  </div>
                </a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TRUST/STATS SECTION VARIATIONS
    // ----------------------------------------
    trust: [
      {
        id: 'trust-stats-simple',
        category: 'Stats',
        name: 'Simple Stats Row',
        desc: 'Clean 4-column stats.',
        html: `
          <section class="hq-section hq-trust hq-trust--stats-simple">
            <div class="hq-container">
              <div class="hq-trust__stats hq-trust__stats--4">
                <div class="hq-stat-block">
                  <span class="hq-stat-block__value">30+</span>
                  <span class="hq-stat-block__label">Years Experience</span>
                </div>
                <div class="hq-stat-block">
                  <span class="hq-stat-block__value">500+</span>
                  <span class="hq-stat-block__label">Aircraft Sold</span>
                </div>
                <div class="hq-stat-block">
                  <span class="hq-stat-block__value">1,200+</span>
                  <span class="hq-stat-block__label">Pilots Trained</span>
                </div>
                <div class="hq-stat-block">
                  <span class="hq-stat-block__value">50K+</span>
                  <span class="hq-stat-block__label">Flight Hours</span>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'trust-logos-bar',
        category: 'Logos',
        name: 'Logo Bar',
        desc: 'Certification logos in a strip.',
        html: `
          <section class="hq-section hq-trust hq-trust--logos">
            <div class="hq-container">
              <p class="hq-trust__label">Trusted & Certified By</p>
              <div class="hq-trust__logos">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
                <img src="/assets/images/logos/partners/bhalogo.jpg" alt="British Helicopter Association">
                <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson">
                <img src="/assets/images/logos/certifications/easa1.png" alt="EASA">
              </div>
            </div>
          </section>`
      },
      {
        id: 'trust-testimonial-single',
        category: 'Testimonial',
        name: 'Single Testimonial',
        desc: 'Large featured testimonial.',
        html: `
          <section class="hq-section hq-trust hq-trust--testimonial">
            <div class="hq-container">
              <div class="hq-testimonial-featured">
                <blockquote class="hq-testimonial-featured__quote">
                  "From my first discovery flight to purchasing my own R66, HQ Aviation has been exceptional. Their expertise and service are second to none."
                </blockquote>
                <div class="hq-testimonial-featured__author">
                  <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="James H." class="hq-testimonial-featured__avatar">
                  <div>
                    <cite class="hq-testimonial-featured__name">James Harrison</cite>
                    <span class="hq-testimonial-featured__title">R66 Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'trust-testimonials-grid',
        category: 'Testimonial',
        name: 'Testimonials Grid',
        desc: '3-column testimonial cards.',
        html: `
          <section class="hq-section hq-trust hq-trust--testimonials-grid">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Testimonials</span>
                <h2 class="hq-section-title">What Our Clients Say</h2>
              </div>
              <div class="hq-testimonials__grid">
                <div class="hq-testimonial-card">
                  <div class="hq-testimonial-card__stars">★★★★★</div>
                  <blockquote class="hq-testimonial-card__quote">"Outstanding training school. Couldn't recommend more highly."</blockquote>
                  <cite class="hq-testimonial-card__author">— Sarah T., PPL Student</cite>
                </div>
                <div class="hq-testimonial-card">
                  <div class="hq-testimonial-card__stars">★★★★★</div>
                  <blockquote class="hq-testimonial-card__quote">"The maintenance team is thorough and professional."</blockquote>
                  <cite class="hq-testimonial-card__author">— Michael R., R44 Owner</cite>
                </div>
                <div class="hq-testimonial-card">
                  <div class="hq-testimonial-card__stars">★★★★★</div>
                  <blockquote class="hq-testimonial-card__quote">"Made buying my first helicopter an absolute pleasure."</blockquote>
                  <cite class="hq-testimonial-card__author">— David K., R66 Owner</cite>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TEAM SECTION VARIATIONS
    // ----------------------------------------
    team: [
      {
        id: 'team-grid-4',
        category: 'Grid',
        name: 'Team Grid',
        desc: '4-column team member cards with hover bio.',
        html: `
          <section class="hq-section hq-team hq-team--grid" id="team">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Team</span>
                <h2 class="hq-section-title">Meet the Experts</h2>
                <p class="hq-section-subtitle">Three decades of combined aviation experience</p>
              </div>
              <div class="hq-team__grid">
                <div class="hq-team-card">
                  <div class="hq-team-card__image">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith">
                    <div class="hq-team-card__overlay">
                      <p>Founder & Chief Pilot with 30+ years experience. Led expeditions to 50+ countries.</p>
                      <div class="hq-team-card__social">
                        <a href="#">LinkedIn</a>
                      </div>
                    </div>
                  </div>
                  <div class="hq-team-card__info">
                    <h3 class="hq-team-card__name">Quentin Smith</h3>
                    <span class="hq-team-card__role">Founder & Chief Pilot</span>
                  </div>
                </div>
                <div class="hq-team-card">
                  <div class="hq-team-card__image">
                    <img src="/assets/images/team/mackie-alcantara-profile-picture.jpg" alt="Sarah Mitchell">
                    <div class="hq-team-card__overlay">
                      <p>Head of Training with 5,000+ flight instruction hours. Former RAF pilot.</p>
                    </div>
                  </div>
                  <div class="hq-team-card__info">
                    <h3 class="hq-team-card__name">Sarah Mitchell</h3>
                    <span class="hq-team-card__role">Head of Training</span>
                  </div>
                </div>
                <div class="hq-team-card">
                  <div class="hq-team-card__image">
                    <img src="/assets/images/team/for-england-282-29.jpg" alt="James Crawford">
                    <div class="hq-team-card__overlay">
                      <p>Chief Engineer with factory training from Robinson and Rolls-Royce.</p>
                    </div>
                  </div>
                  <div class="hq-team-card__info">
                    <h3 class="hq-team-card__name">James Crawford</h3>
                    <span class="hq-team-card__role">Chief Engineer</span>
                  </div>
                </div>
                <div class="hq-team-card">
                  <div class="hq-team-card__image">
                    <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Emma Wilson">
                    <div class="hq-team-card__overlay">
                      <p>Sales Director specializing in aircraft acquisition and client relations.</p>
                    </div>
                  </div>
                  <div class="hq-team-card__info">
                    <h3 class="hq-team-card__name">Emma Wilson</h3>
                    <span class="hq-team-card__role">Sales Director</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'team-founder-spotlight',
        category: 'Featured',
        name: 'Founder Spotlight',
        desc: 'Large founder feature with story.',
        html: `
          <section class="hq-section hq-team hq-team--founder" id="team">
            <div class="hq-team__founder-split">
              <div class="hq-team__founder-image">
                <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Quentin Smith">
              </div>
              <div class="hq-team__founder-content">
                <span class="hq-overline">Our Story</span>
                <h2 class="hq-section-title">A Passion That<br>Took Flight</h2>
                <p class="hq-lead">In 1990, Quentin Smith transformed his love for aviation into HQ Aviation—now the UK's premier Robinson helicopter center.</p>
                <blockquote class="hq-team__founder-quote">
                  "Every person who walks through our doors shares one thing: the dream of flight. Our job is to make that dream a reality."
                </blockquote>
                <div class="hq-team__founder-stats">
                  <div class="hq-stat-mini">
                    <span class="hq-stat-mini__value">15,000+</span>
                    <span class="hq-stat-mini__label">Flight Hours</span>
                  </div>
                  <div class="hq-stat-mini">
                    <span class="hq-stat-mini__value">50+</span>
                    <span class="hq-stat-mini__label">Countries Flown</span>
                  </div>
                  <div class="hq-stat-mini">
                    <span class="hq-stat-mini__value">7</span>
                    <span class="hq-stat-mini__label">World Records</span>
                  </div>
                </div>
                <a href="#about" class="hq-btn hq-btn--dark">Read Full Story</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // GALLERY SECTION VARIATIONS
    // ----------------------------------------
    gallery: [
      {
        id: 'gallery-masonry',
        category: 'Masonry',
        name: 'Photo Masonry',
        desc: 'Pinterest-style photo gallery.',
        html: `
          <section class="hq-section hq-gallery hq-gallery--masonry" id="gallery">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Gallery</span>
                <h2 class="hq-section-title">Adventures in Flight</h2>
              </div>
              <div class="hq-gallery__masonry">
                <a href="#" class="hq-gallery-item hq-gallery-item--tall">
                  <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Alps Flight">
                  <div class="hq-gallery-item__caption">Alpine Expedition 2024</div>
                </a>
                <a href="#" class="hq-gallery-item">
                  <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
                  <div class="hq-gallery-item__caption">Our Facility</div>
                </a>
                <a href="#" class="hq-gallery-item">
                  <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition">
                  <div class="hq-gallery-item__caption">World Tour</div>
                </a>
                <a href="#" class="hq-gallery-item hq-gallery-item--wide">
                  <img src="/assets/images/team/british-helicopter-team.webp" alt="Team">
                  <div class="hq-gallery-item__caption">Training Team</div>
                </a>
                <a href="#" class="hq-gallery-item">
                  <img src="/assets/images/legacy/dated/20251217_183027.jpg" alt="Sunset">
                  <div class="hq-gallery-item__caption">Golden Hour</div>
                </a>
                <a href="#" class="hq-gallery-item hq-gallery-item--tall">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                  <div class="hq-gallery-item__caption">R66 Showcase</div>
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'gallery-fullscreen-slider',
        category: 'Slider',
        name: 'Fullscreen Slider',
        desc: 'Full-width image slideshow.',
        html: `
          <section class="hq-section hq-gallery hq-gallery--fullscreen" id="gallery">
            <div class="hq-gallery__slider">
              <div class="hq-gallery__slide active">
                <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Alps">
                <div class="hq-gallery__slide-caption">
                  <h3>Alpine Crossing</h3>
                  <p>Mont Blanc expedition with our R66 fleet</p>
                </div>
              </div>
              <div class="hq-gallery__slide">
                <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition">
                <div class="hq-gallery__slide-caption">
                  <h3>Around the World</h3>
                  <p>Record-breaking global circumnavigation</p>
                </div>
              </div>
              <div class="hq-gallery__slide">
                <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
                <div class="hq-gallery__slide-caption">
                  <h3>Our Facility</h3>
                  <p>State-of-the-art hangar at Denham Aerodrome</p>
                </div>
              </div>
            </div>
            <div class="hq-gallery__nav">
              <button class="hq-gallery__nav-btn hq-gallery__nav-prev">←</button>
              <div class="hq-gallery__dots">
                <button class="active"></button>
                <button></button>
                <button></button>
              </div>
              <button class="hq-gallery__nav-btn hq-gallery__nav-next">→</button>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FAQ SECTION VARIATIONS
    // ----------------------------------------
    faq: [
      {
        id: 'faq-accordion',
        category: 'Accordion',
        name: 'FAQ Accordion',
        desc: 'Expandable question/answer format.',
        html: `
          <section class="hq-section hq-faq hq-faq--accordion" id="faq">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">FAQ</span>
                <h2 class="hq-section-title">Common Questions</h2>
              </div>
              <div class="hq-faq__list">
                <div class="hq-faq-item active">
                  <button class="hq-faq-item__question">
                    How long does it take to get a helicopter license?
                    <span class="hq-faq-item__icon">+</span>
                  </button>
                  <div class="hq-faq-item__answer">
                    <p>A Private Pilot License (PPL-H) requires a minimum of 45 flight hours. Most students complete their training in 3-6 months, depending on weather and availability. We offer intensive courses for faster completion.</p>
                  </div>
                </div>
                <div class="hq-faq-item">
                  <button class="hq-faq-item__question">
                    What's included in a discovery flight?
                    <span class="hq-faq-item__icon">+</span>
                  </button>
                  <div class="hq-faq-item__answer">
                    <p>Our £299 discovery flight includes a pre-flight briefing, 30 minutes of flight time with hands-on controls, a certificate of flight, and photo opportunities. No prior experience needed.</p>
                  </div>
                </div>
                <div class="hq-faq-item">
                  <button class="hq-faq-item__question">
                    Do you offer financing for aircraft purchases?
                    <span class="hq-faq-item__icon">+</span>
                  </button>
                  <div class="hq-faq-item__answer">
                    <p>Yes, we work with specialist aviation finance providers to offer competitive rates. We can arrange financing for both new and pre-owned aircraft with flexible terms.</p>
                  </div>
                </div>
                <div class="hq-faq-item">
                  <button class="hq-faq-item__question">
                    What maintenance services do you provide?
                    <span class="hq-faq-item__icon">+</span>
                  </button>
                  <div class="hq-faq-item__answer">
                    <p>We're EASA Part-145 certified for all Robinson models. Services include 100-hour inspections, annual inspections, 12-year overhauls, engine changes, and AOG support.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'faq-two-column',
        category: 'Grid',
        name: 'Two Column FAQ',
        desc: 'Side-by-side FAQ layout.',
        html: `
          <section class="hq-section hq-faq hq-faq--two-col" id="faq">
            <div class="hq-container">
              <div class="hq-faq__split">
                <div class="hq-faq__header-sticky">
                  <span class="hq-overline">Questions?</span>
                  <h2 class="hq-section-title">We've Got Answers</h2>
                  <p>Can't find what you're looking for? Get in touch with our team.</p>
                  <a href="#contact" class="hq-btn hq-btn--primary">Contact Us</a>
                </div>
                <div class="hq-faq__grid">
                  <div class="hq-faq-card">
                    <h3>Training Requirements</h3>
                    <p>You need to be at least 17 years old and pass a Class 2 medical examination. No prior flying experience is required.</p>
                  </div>
                  <div class="hq-faq-card">
                    <h3>Flight Training Cost</h3>
                    <p>PPL(H) training costs approximately £15,000-£20,000 depending on aircraft type and how quickly you progress.</p>
                  </div>
                  <div class="hq-faq-card">
                    <h3>New vs Pre-Owned</h3>
                    <p>We offer both new factory-ordered Robinson helicopters and carefully inspected pre-owned aircraft with full histories.</p>
                  </div>
                  <div class="hq-faq-card">
                    <h3>Aircraft Management</h3>
                    <p>Full management includes hangarage, insurance, maintenance scheduling, and optional leaseback programs.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FEATURES/BENEFITS SECTION VARIATIONS
    // ----------------------------------------
    features: [
      {
        id: 'features-icon-grid',
        category: 'Grid',
        name: 'Icon Feature Grid',
        desc: '6-feature grid with icons.',
        html: `
          <section class="hq-section hq-features hq-features--grid" id="features">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Why Choose Us</span>
                <h2 class="hq-section-title">The HQ Advantage</h2>
              </div>
              <div class="hq-features__grid">
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">🏆</div>
                  <h3 class="hq-feature-item__title">30+ Years Experience</h3>
                  <p class="hq-feature-item__desc">Three decades as the UK's leading Robinson helicopter specialist.</p>
                </div>
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">✈️</div>
                  <h3 class="hq-feature-item__title">Factory Authorized</h3>
                  <p class="hq-feature-item__desc">Official Robinson dealer with factory-trained engineers.</p>
                </div>
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">🔧</div>
                  <h3 class="hq-feature-item__title">EASA Part-145</h3>
                  <p class="hq-feature-item__desc">Certified maintenance facility for all Robinson models.</p>
                </div>
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">📚</div>
                  <h3 class="hq-feature-item__title">CAA Approved</h3>
                  <p class="hq-feature-item__desc">Registered training organization with excellent pass rates.</p>
                </div>
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">🌍</div>
                  <h3 class="hq-feature-item__title">Global Expeditions</h3>
                  <p class="hq-feature-item__desc">Join world-record holding pilots on adventures worldwide.</p>
                </div>
                <div class="hq-feature-item">
                  <div class="hq-feature-item__icon">🤝</div>
                  <h3 class="hq-feature-item__title">Full Support</h3>
                  <p class="hq-feature-item__desc">From purchase to maintenance to management—we're here.</p>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'features-alternating',
        category: 'Alternating',
        name: 'Alternating Features',
        desc: 'Zig-zag image and text layout.',
        html: `
          <section class="hq-section hq-features hq-features--alternating" id="features">
            <div class="hq-container">
              <div class="hq-feature-row">
                <div class="hq-feature-row__content">
                  <span class="hq-overline">Sales</span>
                  <h3 class="hq-feature-row__title">Find Your Perfect Aircraft</h3>
                  <p>New factory orders or carefully selected pre-owned—we guide you through the entire acquisition process with transparent pricing and expert advice.</p>
                  <ul class="hq-feature-row__list">
                    <li>Factory-direct new aircraft orders</li>
                    <li>Thoroughly inspected pre-owned options</li>
                    <li>Trade-in and finance arrangements</li>
                  </ul>
                  <a href="#aircraft" class="hq-btn hq-btn--outline">View Aircraft</a>
                </div>
                <div class="hq-feature-row__image">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Aircraft Sales">
                </div>
              </div>
              <div class="hq-feature-row hq-feature-row--reverse">
                <div class="hq-feature-row__content">
                  <span class="hq-overline">Training</span>
                  <h3 class="hq-feature-row__title">Learn From the Best</h3>
                  <p>Our CAA-approved instructors have trained over 1,200 pilots. From your first discovery flight to advanced ratings, we're with you every step.</p>
                  <ul class="hq-feature-row__list">
                    <li>Discovery flights from £299</li>
                    <li>PPL(H) and CPL(H) courses</li>
                    <li>Type ratings and instructor courses</li>
                  </ul>
                  <a href="#training" class="hq-btn hq-btn--outline">Start Training</a>
                </div>
                <div class="hq-feature-row__image">
                  <img src="/assets/images/team/british-helicopter-team.webp" alt="Flight Training">
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // NEWSLETTER SECTION VARIATIONS
    // ----------------------------------------
    newsletter: [
      {
        id: 'newsletter-simple',
        category: 'Simple',
        name: 'Simple Newsletter',
        desc: 'Clean email signup bar.',
        html: `
          <section class="hq-section hq-newsletter hq-newsletter--simple">
            <div class="hq-container">
              <div class="hq-newsletter__content">
                <div class="hq-newsletter__text">
                  <h3 class="hq-newsletter__title">Stay in the Loop</h3>
                  <p class="hq-newsletter__desc">Get aviation news, flight tips, and exclusive offers delivered to your inbox.</p>
                </div>
                <form class="hq-newsletter__form">
                  <input type="email" placeholder="Enter your email" class="hq-input">
                  <button type="submit" class="hq-btn hq-btn--primary">Subscribe</button>
                </form>
              </div>
            </div>
          </section>`
      },
      {
        id: 'newsletter-feature',
        category: 'Featured',
        name: 'Featured Newsletter',
        desc: 'Newsletter with image and benefits.',
        html: `
          <section class="hq-section hq-newsletter hq-newsletter--featured">
            <div class="hq-newsletter__split">
              <div class="hq-newsletter__image">
                <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Newsletter">
              </div>
              <div class="hq-newsletter__content-side">
                <span class="hq-overline">Newsletter</span>
                <h3 class="hq-newsletter__title">Join the Flight Club</h3>
                <p class="hq-newsletter__desc">Get exclusive access to:</p>
                <ul class="hq-newsletter__benefits">
                  <li>✓ Early aircraft availability alerts</li>
                  <li>✓ Training tips from our instructors</li>
                  <li>✓ Expedition stories and photos</li>
                  <li>✓ Special subscriber-only offers</li>
                </ul>
                <form class="hq-newsletter__form hq-newsletter__form--stacked">
                  <input type="email" placeholder="Your email address" class="hq-input">
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Join Now</button>
                </form>
                <p class="hq-newsletter__privacy">We respect your privacy. Unsubscribe anytime.</p>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // BLOG/NEWS SECTION VARIATIONS
    // ----------------------------------------
    blog: [
      {
        id: 'blog-featured-grid',
        category: 'Grid',
        name: 'Blog Featured Grid',
        desc: 'Large featured post with smaller grid.',
        html: `
          <section class="hq-section hq-blog hq-blog--featured-grid" id="news">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--with-nav">
                <div>
                  <span class="hq-overline">Latest News</span>
                  <h2 class="hq-section-title">From the Hangar</h2>
                </div>
                <a href="/blog" class="hq-btn hq-btn--outline">View All Posts</a>
              </div>
              <div class="hq-blog__layout">
                <a href="#" class="hq-blog-card hq-blog-card--featured">
                  <div class="hq-blog-card__image">
                    <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Alpine Expedition">
                    <span class="hq-blog-card__category">Expeditions</span>
                  </div>
                  <div class="hq-blog-card__body">
                    <time class="hq-blog-card__date">December 15, 2024</time>
                    <h3 class="hq-blog-card__title">Alpine Adventure: Our R66 Fleet Conquers Mont Blanc</h3>
                    <p class="hq-blog-card__excerpt">Join us on an incredible journey as our team navigates the challenging Alpine terrain in our Robinson R66 helicopters.</p>
                    <span class="hq-blog-card__link">Read More →</span>
                  </div>
                </a>
                <div class="hq-blog__side-posts">
                  <a href="#" class="hq-blog-card hq-blog-card--horizontal">
                    <div class="hq-blog-card__image">
                      <img src="/assets/images/facility/busy-hangar.jpg" alt="Maintenance">
                    </div>
                    <div class="hq-blog-card__body">
                      <time class="hq-blog-card__date">December 10, 2024</time>
                      <h3 class="hq-blog-card__title">Winter Maintenance Tips for Robinson Owners</h3>
                    </div>
                  </a>
                  <a href="#" class="hq-blog-card hq-blog-card--horizontal">
                    <div class="hq-blog-card__image">
                      <img src="/assets/images/team/british-helicopter-team.webp" alt="Training">
                    </div>
                    <div class="hq-blog-card__body">
                      <time class="hq-blog-card__date">December 5, 2024</time>
                      <h3 class="hq-blog-card__title">Student Spotlight: From Zero to PPL in 4 Months</h3>
                    </div>
                  </a>
                  <a href="#" class="hq-blog-card hq-blog-card--horizontal">
                    <div class="hq-blog-card__image">
                      <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                    </div>
                    <div class="hq-blog-card__body">
                      <time class="hq-blog-card__date">December 1, 2024</time>
                      <h3 class="hq-blog-card__title">New R66 Delivery: Custom Configuration Guide</h3>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // LOCATION/MAP SECTION VARIATIONS
    // ----------------------------------------
    location: [
      {
        id: 'location-split-map',
        category: 'Split',
        name: 'Split Map',
        desc: 'Map with contact details side by side.',
        html: `
          <section class="hq-section hq-location hq-location--split" id="location">
            <div class="hq-location__map">
              <div class="hq-map-placeholder">
                <div class="hq-map-placeholder__content">
                  <span class="hq-map-placeholder__icon">📍</span>
                  <span>Interactive Map</span>
                </div>
              </div>
            </div>
            <div class="hq-location__content">
              <span class="hq-overline">Visit Us</span>
              <h2 class="hq-section-title">Denham Aerodrome</h2>
              <p class="hq-location__address">
                HQ Aviation<br>
                Denham Aerodrome<br>
                Tilehouse Lane<br>
                Buckinghamshire UB9 5DF
              </p>
              <div class="hq-location__details">
                <div class="hq-location__detail">
                  <strong>Hours</strong>
                  <p>Monday - Friday: 8am - 6pm<br>Saturday: 9am - 4pm<br>Sunday: By appointment</p>
                </div>
                <div class="hq-location__detail">
                  <strong>Contact</strong>
                  <p>Tel: <a href="tel:+441753868976">01753 868976</a><br>
                  Email: <a href="mailto:info@hqaviation.com">info@hqaviation.com</a></p>
                </div>
              </div>
              <a href="https://maps.google.com" target="_blank" class="hq-btn hq-btn--primary">Get Directions</a>
            </div>
          </section>`
      },
      {
        id: 'location-full-width',
        category: 'Full Width',
        name: 'Full Width Location',
        desc: 'Full-width map with floating card.',
        html: `
          <section class="hq-section hq-location hq-location--fullwidth" id="location">
            <div class="hq-location__map-full">
              <div class="hq-map-placeholder hq-map-placeholder--full">
                <div class="hq-map-placeholder__content">
                  <span class="hq-map-placeholder__icon">🗺️</span>
                  <span>Full Width Interactive Map</span>
                </div>
              </div>
            </div>
            <div class="hq-location__card">
              <h3>HQ Aviation</h3>
              <p>Denham Aerodrome, Buckinghamshire UB9 5DF</p>
              <div class="hq-location__card-row">
                <a href="tel:+441753868976" class="hq-btn hq-btn--primary hq-btn--sm">Call Us</a>
                <a href="https://maps.google.com" target="_blank" class="hq-btn hq-btn--outline hq-btn--sm">Directions</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // PROCESS/STEPS SECTION VARIATIONS
    // ----------------------------------------
    process: [
      {
        id: 'process-timeline',
        category: 'Timeline',
        name: 'Process Timeline',
        desc: 'Numbered step-by-step process.',
        html: `
          <section class="hq-section hq-process hq-process--timeline" id="process">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">How It Works</span>
                <h2 class="hq-section-title">Your Path to the Skies</h2>
              </div>
              <div class="hq-process__timeline">
                <div class="hq-process-step">
                  <div class="hq-process-step__number">01</div>
                  <div class="hq-process-step__content">
                    <h3>Discovery Flight</h3>
                    <p>Experience flight firsthand with a 30-minute trial lesson. You'll take the controls and discover if helicopter flying is for you.</p>
                  </div>
                </div>
                <div class="hq-process-step">
                  <div class="hq-process-step__number">02</div>
                  <div class="hq-process-step__content">
                    <h3>Ground School</h3>
                    <p>Learn aviation theory with our comprehensive ground school program covering meteorology, navigation, and regulations.</p>
                  </div>
                </div>
                <div class="hq-process-step">
                  <div class="hq-process-step__number">03</div>
                  <div class="hq-process-step__content">
                    <h3>Flight Training</h3>
                    <p>Build your skills through structured flight lessons with experienced instructors. Minimum 45 hours required for PPL(H).</p>
                  </div>
                </div>
                <div class="hq-process-step">
                  <div class="hq-process-step__number">04</div>
                  <div class="hq-process-step__content">
                    <h3>Skills Test</h3>
                    <p>Demonstrate your proficiency to a CAA examiner and earn your Private Pilot License (Helicopters).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'process-cards-horizontal',
        category: 'Cards',
        name: 'Horizontal Process',
        desc: 'Side-by-side step cards.',
        html: `
          <section class="hq-section hq-process hq-process--horizontal" id="process">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Buying Made Simple</span>
                <h2 class="hq-section-title">How to Buy Your Helicopter</h2>
              </div>
              <div class="hq-process__cards">
                <div class="hq-process-card">
                  <span class="hq-process-card__number">1</span>
                  <div class="hq-process-card__icon">💬</div>
                  <h3>Consultation</h3>
                  <p>Discuss your requirements, budget, and intended use with our sales team.</p>
                </div>
                <div class="hq-process__arrow">→</div>
                <div class="hq-process-card">
                  <span class="hq-process-card__number">2</span>
                  <div class="hq-process-card__icon">🔍</div>
                  <h3>Selection</h3>
                  <p>Choose from new factory orders or our inspected pre-owned inventory.</p>
                </div>
                <div class="hq-process__arrow">→</div>
                <div class="hq-process-card">
                  <span class="hq-process-card__number">3</span>
                  <div class="hq-process-card__icon">📝</div>
                  <h3>Purchase</h3>
                  <p>We handle paperwork, financing, registration, and insurance.</p>
                </div>
                <div class="hq-process__arrow">→</div>
                <div class="hq-process-card">
                  <span class="hq-process-card__number">4</span>
                  <div class="hq-process-card__icon">🚁</div>
                  <h3>Delivery</h3>
                  <p>Collect your aircraft with full handover training and documentation.</p>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // SOCIAL PROOF SECTION VARIATIONS
    // ----------------------------------------
    social: [
      {
        id: 'social-instagram',
        category: 'Instagram',
        name: 'Instagram Feed',
        desc: 'Photo grid from social media.',
        html: `
          <section class="hq-section hq-social hq-social--instagram" id="social">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">@hqaviation</span>
                <h2 class="hq-section-title">Follow Our Adventures</h2>
              </div>
              <div class="hq-social__grid">
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 1.2k</span>
                  </div>
                </a>
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/facility/busy-hangar.jpg" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 892</span>
                  </div>
                </a>
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 2.1k</span>
                  </div>
                </a>
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/team/british-helicopter-team.webp" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 756</span>
                  </div>
                </a>
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/legacy/dated/20251217_183027.jpg" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 1.8k</span>
                  </div>
                </a>
                <a href="#" class="hq-social-item">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Instagram">
                  <div class="hq-social-item__overlay">
                    <span>❤️ 943</span>
                  </div>
                </a>
              </div>
              <div class="hq-section-footer">
                <a href="https://instagram.com/hqaviation" target="_blank" class="hq-btn hq-btn--outline">
                  Follow on Instagram
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'social-stats-bar',
        category: 'Stats',
        name: 'Social Stats Bar',
        desc: 'Community statistics showcase.',
        html: `
          <section class="hq-section hq-social hq-social--stats">
            <div class="hq-container">
              <div class="hq-social__stats-bar">
                <div class="hq-social-stat">
                  <div class="hq-social-stat__icon">📸</div>
                  <div class="hq-social-stat__value">12.5K</div>
                  <div class="hq-social-stat__label">Instagram Followers</div>
                </div>
                <div class="hq-social-stat">
                  <div class="hq-social-stat__icon">🎥</div>
                  <div class="hq-social-stat__value">850K</div>
                  <div class="hq-social-stat__label">YouTube Views</div>
                </div>
                <div class="hq-social-stat">
                  <div class="hq-social-stat__icon">✈️</div>
                  <div class="hq-social-stat__value">500+</div>
                  <div class="hq-social-stat__label">Aircraft Delivered</div>
                </div>
                <div class="hq-social-stat">
                  <div class="hq-social-stat__icon">⭐</div>
                  <div class="hq-social-stat__value">4.9</div>
                  <div class="hq-social-stat__label">Google Rating</div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FLEET SHOWCASE SECTION VARIATIONS
    // ----------------------------------------
    fleet: [
      {
        id: 'fleet-interactive',
        category: 'Interactive',
        name: 'Interactive Fleet',
        desc: 'Tabbed fleet explorer.',
        html: `
          <section class="hq-section hq-fleet hq-fleet--interactive" id="fleet">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Our Fleet</span>
                <h2 class="hq-section-title">Explore Our Aircraft</h2>
              </div>
              <div class="hq-fleet__explorer">
                <div class="hq-fleet__tabs">
                  <button class="hq-fleet__tab active" data-aircraft="r66">R66 Turbine</button>
                  <button class="hq-fleet__tab" data-aircraft="r44">R44 Raven II</button>
                  <button class="hq-fleet__tab" data-aircraft="r22">R22 Beta II</button>
                </div>
                <div class="hq-fleet__display">
                  <div class="hq-fleet__aircraft active" data-aircraft="r66">
                    <div class="hq-fleet__image">
                      <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                    </div>
                    <div class="hq-fleet__info">
                      <h3>Robinson R66 Turbine</h3>
                      <p>The pinnacle of personal aviation. 5-seat turbine helicopter with Rolls-Royce power.</p>
                      <div class="hq-fleet__specs-grid">
                        <div class="hq-fleet__spec">
                          <span class="hq-fleet__spec-value">300</span>
                          <span class="hq-fleet__spec-label">SHP</span>
                        </div>
                        <div class="hq-fleet__spec">
                          <span class="hq-fleet__spec-value">5</span>
                          <span class="hq-fleet__spec-label">Seats</span>
                        </div>
                        <div class="hq-fleet__spec">
                          <span class="hq-fleet__spec-value">140</span>
                          <span class="hq-fleet__spec-label">Knots</span>
                        </div>
                        <div class="hq-fleet__spec">
                          <span class="hq-fleet__spec-value">350</span>
                          <span class="hq-fleet__spec-label">NM Range</span>
                        </div>
                      </div>
                      <div class="hq-fleet__actions">
                        <a href="#r66" class="hq-btn hq-btn--primary">Configure Yours</a>
                        <a href="#quote" class="hq-btn hq-btn--outline">Request Quote</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // PILOT SUCCESS STORIES
    // ----------------------------------------
    pilots: [
      {
        id: 'pilots-success-stories',
        category: 'Stories',
        name: 'Pilot Success Stories',
        desc: 'Student testimonial cards.',
        html: `
          <section class="hq-section hq-pilots hq-pilots--stories" id="pilots">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Success Stories</span>
                <h2 class="hq-section-title">From Students to Pilots</h2>
              </div>
              <div class="hq-pilots__grid">
                <div class="hq-pilot-card">
                  <div class="hq-pilot-card__image">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Michael S.">
                    <div class="hq-pilot-card__badge">PPL(H) 2024</div>
                  </div>
                  <div class="hq-pilot-card__content">
                    <h3 class="hq-pilot-card__name">Michael Stevens</h3>
                    <p class="hq-pilot-card__journey">Career changer at 45. Zero experience to licensed pilot in 5 months.</p>
                    <blockquote class="hq-pilot-card__quote">"The instructors made complex concepts simple. Best decision I ever made."</blockquote>
                  </div>
                </div>
                <div class="hq-pilot-card">
                  <div class="hq-pilot-card__image">
                    <img src="/assets/images/team/mackie-alcantara-profile-picture.jpg" alt="Sarah T.">
                    <div class="hq-pilot-card__badge">CPL(H) 2024</div>
                  </div>
                  <div class="hq-pilot-card__content">
                    <h3 class="hq-pilot-card__name">Sarah Thompson</h3>
                    <p class="hq-pilot-card__journey">From discovery flight to commercial pilot. Now flying professionally.</p>
                    <blockquote class="hq-pilot-card__quote">"HQ Aviation gave me wings and a career. Forever grateful."</blockquote>
                  </div>
                </div>
                <div class="hq-pilot-card">
                  <div class="hq-pilot-card__image">
                    <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="James R.">
                    <div class="hq-pilot-card__badge">FI(H) 2023</div>
                  </div>
                  <div class="hq-pilot-card__content">
                    <h3 class="hq-pilot-card__name">James Richardson</h3>
                    <p class="hq-pilot-card__journey">PPL student who fell in love with teaching. Now an instructor here.</p>
                    <blockquote class="hq-pilot-card__quote">"Full circle. Learning here, now teaching here. Dream job."</blockquote>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FINANCING SECTION
    // ----------------------------------------
    financing: [
      {
        id: 'financing-options',
        category: 'Options',
        name: 'Financing Options',
        desc: 'Aircraft finance packages.',
        html: `
          <section class="hq-section hq-financing hq-financing--options" id="financing">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Finance</span>
                <h2 class="hq-section-title">Flexible Financing Options</h2>
                <p class="hq-section-subtitle">Make aircraft ownership accessible with our partner financing solutions</p>
              </div>
              <div class="hq-financing__grid">
                <div class="hq-financing-card">
                  <div class="hq-financing-card__header">
                    <h3>Standard Finance</h3>
                    <div class="hq-financing-card__rate">From 6.9% APR</div>
                  </div>
                  <ul class="hq-financing-card__features">
                    <li>✓ 20% minimum deposit</li>
                    <li>✓ Terms up to 10 years</li>
                    <li>✓ Fixed monthly payments</li>
                    <li>✓ New & pre-owned aircraft</li>
                  </ul>
                  <a href="#contact" class="hq-btn hq-btn--outline hq-btn--full">Get Quote</a>
                </div>
                <div class="hq-financing-card hq-financing-card--featured">
                  <span class="hq-badge hq-badge--primary">Most Popular</span>
                  <div class="hq-financing-card__header">
                    <h3>Balloon Finance</h3>
                    <div class="hq-financing-card__rate">Lower Monthlies</div>
                  </div>
                  <ul class="hq-financing-card__features">
                    <li>✓ 10% minimum deposit</li>
                    <li>✓ Reduced monthly payments</li>
                    <li>✓ Balloon payment at end</li>
                    <li>✓ Refinance or pay out</li>
                  </ul>
                  <a href="#contact" class="hq-btn hq-btn--primary hq-btn--full">Get Quote</a>
                </div>
                <div class="hq-financing-card">
                  <div class="hq-financing-card__header">
                    <h3>Lease Options</h3>
                    <div class="hq-financing-card__rate">Tax Efficient</div>
                  </div>
                  <ul class="hq-financing-card__features">
                    <li>✓ Business tax benefits</li>
                    <li>✓ Operating or finance lease</li>
                    <li>✓ Flexible terms</li>
                    <li>✓ Maintenance packages</li>
                  </ul>
                  <a href="#contact" class="hq-btn hq-btn--outline hq-btn--full">Get Quote</a>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // EVENTS/COUNTDOWN SECTION
    // ----------------------------------------
    events: [
      {
        id: 'events-upcoming',
        category: 'List',
        name: 'Upcoming Events',
        desc: 'Events calendar showcase.',
        html: `
          <section class="hq-section hq-events hq-events--upcoming" id="events">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Events</span>
                <h2 class="hq-section-title">Upcoming at HQ Aviation</h2>
              </div>
              <div class="hq-events__list">
                <a href="#" class="hq-event-card">
                  <div class="hq-event-card__date">
                    <span class="hq-event-card__day">15</span>
                    <span class="hq-event-card__month">JAN</span>
                  </div>
                  <div class="hq-event-card__content">
                    <span class="hq-event-card__type">Open Day</span>
                    <h3 class="hq-event-card__title">Winter Open Day & Discovery Flight Offers</h3>
                    <p class="hq-event-card__details">10am - 4pm • Denham Aerodrome • Free Entry</p>
                  </div>
                  <div class="hq-event-card__cta">
                    <span class="hq-btn hq-btn--outline hq-btn--sm">Register</span>
                  </div>
                </a>
                <a href="#" class="hq-event-card">
                  <div class="hq-event-card__date">
                    <span class="hq-event-card__day">28</span>
                    <span class="hq-event-card__month">JAN</span>
                  </div>
                  <div class="hq-event-card__content">
                    <span class="hq-event-card__type">Webinar</span>
                    <h3 class="hq-event-card__title">PPL vs CPL: Which Licence is Right For You?</h3>
                    <p class="hq-event-card__details">7pm - 8:30pm • Online • Free</p>
                  </div>
                  <div class="hq-event-card__cta">
                    <span class="hq-btn hq-btn--outline hq-btn--sm">Join</span>
                  </div>
                </a>
                <a href="#" class="hq-event-card">
                  <div class="hq-event-card__date">
                    <span class="hq-event-card__day">10</span>
                    <span class="hq-event-card__month">FEB</span>
                  </div>
                  <div class="hq-event-card__content">
                    <span class="hq-event-card__type">Expedition</span>
                    <h3 class="hq-event-card__title">Scotland Fly-Out: Highland Adventure</h3>
                    <p class="hq-event-card__details">4 days • All experience levels • Limited spots</p>
                  </div>
                  <div class="hq-event-card__cta">
                    <span class="hq-btn hq-btn--primary hq-btn--sm">Book</span>
                  </div>
                </a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // VIDEO SECTION VARIATIONS
    // ----------------------------------------
    video: [
      {
        id: 'video-featured',
        category: 'Featured',
        name: 'Featured Video',
        desc: 'Large embedded video with overlay.',
        html: `
          <section class="hq-section hq-video hq-video--featured" id="video">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Watch</span>
                <h2 class="hq-section-title">Experience the Dream</h2>
              </div>
              <div class="hq-video__player">
                <div class="hq-video__thumbnail">
                  <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Video Thumbnail">
                  <button class="hq-video__play-btn">
                    <span class="hq-video__play-icon">▶</span>
                  </button>
                  <div class="hq-video__duration">3:45</div>
                </div>
                <div class="hq-video__info">
                  <h3>Alpine Expedition: Behind the Scenes</h3>
                  <p>Join Quentin Smith and the HQ Aviation team on our latest alpine crossing adventure.</p>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'video-gallery',
        category: 'Gallery',
        name: 'Video Gallery',
        desc: 'Multiple video thumbnails.',
        html: `
          <section class="hq-section hq-video hq-video--gallery" id="video">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Videos</span>
                <h2 class="hq-section-title">Watch & Learn</h2>
              </div>
              <div class="hq-video__grid">
                <a href="#" class="hq-video-card">
                  <div class="hq-video-card__thumbnail">
                    <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Video">
                    <span class="hq-video-card__duration">5:22</span>
                    <div class="hq-video-card__play">▶</div>
                  </div>
                  <h4 class="hq-video-card__title">World Record Circumnavigation</h4>
                </a>
                <a href="#" class="hq-video-card">
                  <div class="hq-video-card__thumbnail">
                    <img src="/assets/images/team/british-helicopter-team.webp" alt="Video">
                    <span class="hq-video-card__duration">12:08</span>
                    <div class="hq-video-card__play">▶</div>
                  </div>
                  <h4 class="hq-video-card__title">A Day in Flight Training</h4>
                </a>
                <a href="#" class="hq-video-card">
                  <div class="hq-video-card__thumbnail">
                    <img src="/assets/images/facility/busy-hangar.jpg" alt="Video">
                    <span class="hq-video-card__duration">8:45</span>
                    <div class="hq-video-card__play">▶</div>
                  </div>
                  <h4 class="hq-video-card__title">100-Hour Inspection Explained</h4>
                </a>
                <a href="#" class="hq-video-card">
                  <div class="hq-video-card__thumbnail">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Video">
                    <span class="hq-video-card__duration">6:30</span>
                    <div class="hq-video-card__play">▶</div>
                  </div>
                  <h4 class="hq-video-card__title">R66 Turbine Walkaround</h4>
                </a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // EXPEDITION SECTION
    // ----------------------------------------
    expedition: [
      {
        id: 'expedition-showcase',
        category: 'Showcase',
        name: 'Expedition Showcase',
        desc: 'Adventure highlight section.',
        html: `
          <section class="hq-section hq-expedition hq-expedition--showcase" id="expedition">
            <div class="hq-expedition__bg">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Expedition">
            </div>
            <div class="hq-expedition__overlay"></div>
            <div class="hq-container">
              <div class="hq-expedition__content">
                <span class="hq-overline hq-overline--light">Expeditions</span>
                <h2 class="hq-expedition__title">Adventure Awaits</h2>
                <p class="hq-expedition__text">Join world-record holding pilots on extraordinary helicopter journeys. From Alpine crossings to Arctic expeditions.</p>
                <div class="hq-expedition__destinations">
                  <div class="hq-destination">
                    <span class="hq-destination__name">Alps</span>
                    <span class="hq-destination__status">Next: March 2025</span>
                  </div>
                  <div class="hq-destination">
                    <span class="hq-destination__name">Scotland</span>
                    <span class="hq-destination__status">Next: February 2025</span>
                  </div>
                  <div class="hq-destination">
                    <span class="hq-destination__name">Iceland</span>
                    <span class="hq-destination__status">Next: June 2025</span>
                  </div>
                </div>
                <a href="#expeditions" class="hq-btn hq-btn--primary hq-btn--lg">Explore Expeditions</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // COMPARE SECTION
    // ----------------------------------------
    compare: [
      {
        id: 'compare-new-used',
        category: 'Comparison',
        name: 'New vs Pre-Owned',
        desc: 'Compare buying options.',
        html: `
          <section class="hq-section hq-compare hq-compare--new-used" id="compare">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Buying Guide</span>
                <h2 class="hq-section-title">New vs Pre-Owned</h2>
                <p class="hq-section-subtitle">Both options have their advantages. Let us help you decide.</p>
              </div>
              <div class="hq-compare__grid">
                <div class="hq-compare-column">
                  <div class="hq-compare-column__header">
                    <h3>New Aircraft</h3>
                  </div>
                  <ul class="hq-compare-column__list">
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Full factory warranty
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Custom configuration
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Latest avionics & features
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Zero hours, no history concerns
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--con">
                      <span class="hq-compare-column__icon">−</span>
                      Higher initial cost
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--con">
                      <span class="hq-compare-column__icon">−</span>
                      Factory lead times
                    </li>
                  </ul>
                  <a href="#new-aircraft" class="hq-btn hq-btn--primary hq-btn--full">Order New</a>
                </div>
                <div class="hq-compare-column">
                  <div class="hq-compare-column__header">
                    <h3>Pre-Owned Aircraft</h3>
                  </div>
                  <ul class="hq-compare-column__list">
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Lower purchase price
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Immediate availability
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Known maintenance history
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--pro">
                      <span class="hq-compare-column__icon">✓</span>
                      Slower depreciation
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--con">
                      <span class="hq-compare-column__icon">−</span>
                      Limited configuration options
                    </li>
                    <li class="hq-compare-column__item hq-compare-column__item--con">
                      <span class="hq-compare-column__icon">−</span>
                      Existing wear & hours
                    </li>
                  </ul>
                  <a href="#used-aircraft" class="hq-btn hq-btn--outline hq-btn--full">Browse Pre-Owned</a>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // PARTNERS/LOGOS SECTION
    // ----------------------------------------
    partners: [
      {
        id: 'partners-marquee',
        category: 'Marquee',
        name: 'Partner Marquee',
        desc: 'Scrolling partner logos.',
        html: `
          <section class="hq-section hq-partners hq-partners--marquee">
            <div class="hq-container">
              <p class="hq-partners__label">Trusted Partners & Certifications</p>
            </div>
            <div class="hq-partners__marquee">
              <div class="hq-partners__track">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
                <img src="/assets/images/logos/partners/bhalogo.jpg" alt="BHA">
                <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson">
                <img src="/assets/images/logos/partners/pooleys.png" alt="Rolls-Royce">
                <img src="/assets/images/logos/certifications/easa1.png" alt="EASA">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
                <img src="/assets/images/logos/partners/bhalogo.jpg" alt="BHA">
                <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson">
                <img src="/assets/images/logos/partners/pooleys.png" alt="Rolls-Royce">
                <img src="/assets/images/logos/certifications/easa1.png" alt="EASA">
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // QUOTE/HIGHLIGHT SECTION
    // ----------------------------------------
    quote: [
      {
        id: 'quote-large',
        category: 'Large',
        name: 'Large Quote',
        desc: 'Full-width inspirational quote.',
        html: `
          <section class="hq-section hq-quote hq-quote--large">
            <div class="hq-container">
              <blockquote class="hq-quote__text">
                "The moment you leave the ground, you leave behind more than just the earth—you leave behind limitations, expectations, and boundaries."
              </blockquote>
              <cite class="hq-quote__author">
                <span class="hq-quote__name">Quentin Smith</span>
                <span class="hq-quote__title">Founder, HQ Aviation</span>
              </cite>
            </div>
          </section>`
      },
      {
        id: 'quote-with-image',
        category: 'Image',
        name: 'Quote with Image',
        desc: 'Quote alongside portrait.',
        html: `
          <section class="hq-section hq-quote hq-quote--with-image">
            <div class="hq-quote__split">
              <div class="hq-quote__image-side">
                <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Quentin Smith">
              </div>
              <div class="hq-quote__content-side">
                <blockquote class="hq-quote__text">
                  "After flying around the world twice and setting seven world records, I still get butterflies before every takeoff. That's the magic of helicopter flight—it never gets old."
                </blockquote>
                <cite class="hq-quote__author">
                  <span class="hq-quote__name">Quentin Smith</span>
                  <span class="hq-quote__title">Chief Pilot & World Record Holder</span>
                </cite>
                <div class="hq-quote__achievements">
                  <span>🌍 Circumnavigated the globe twice</span>
                  <span>🏆 7 world records</span>
                  <span>✈️ 15,000+ flight hours</span>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // CTA SECTION VARIATIONS
    // ----------------------------------------
    cta: [
      {
        id: 'cta-simple-centered',
        category: 'Simple',
        name: 'Centered CTA',
        desc: 'Simple centered call to action.',
        html: `
          <section class="hq-section hq-cta hq-cta--centered">
            <div class="hq-container">
              <h2 class="hq-cta__title">Ready to Take Flight?</h2>
              <p class="hq-cta__text">Contact our team to discuss your aviation needs.</p>
              <div class="hq-btn-group hq-btn-group--center">
                <a href="#contact" class="hq-btn hq-btn--primary hq-btn--lg">Get in Touch</a>
                <a href="tel:+441753868976" class="hq-btn hq-btn--outline hq-btn--lg">Call Us</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'cta-with-image',
        category: 'Image',
        name: 'CTA with Background',
        desc: 'Full-width with background image.',
        html: `
          <section class="hq-section hq-cta hq-cta--image">
            <div class="hq-cta__bg">
              <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Flying">
            </div>
            <div class="hq-cta__overlay"></div>
            <div class="hq-container">
              <div class="hq-cta__content">
                <h2 class="hq-cta__title">Your Aviation Journey<br>Starts Here</h2>
                <p class="hq-cta__text">Book a discovery flight or speak with our team about your aircraft needs.</p>
                <a href="#book" class="hq-btn hq-btn--primary hq-btn--lg">Book Discovery Flight - £299</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'cta-split-contact',
        category: 'Split',
        name: 'Split Contact CTA',
        desc: 'Contact info on left, form on right.',
        html: `
          <section class="hq-section hq-cta hq-cta--split-contact" id="contact">
            <div class="hq-cta__info">
              <span class="hq-overline">Contact Us</span>
              <h2 class="hq-cta__title">Let's Talk</h2>
              <div class="hq-contact-details">
                <div class="hq-contact-item">
                  <span class="hq-contact-item__icon">📍</span>
                  <div>
                    <strong>Address</strong>
                    <p>HQ Aviation, Denham Aerodrome, Buckinghamshire UB9 5DF</p>
                  </div>
                </div>
                <div class="hq-contact-item">
                  <span class="hq-contact-item__icon">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:+441753868976">+44 1753 868976</a></p>
                  </div>
                </div>
                <div class="hq-contact-item">
                  <span class="hq-contact-item__icon">✉️</span>
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:info@hqaviation.com">info@hqaviation.com</a></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="hq-cta__form">
              <form class="hq-form">
                <div class="hq-form__row">
                  <input type="text" placeholder="Name" class="hq-input">
                  <input type="email" placeholder="Email" class="hq-input">
                </div>
                <select class="hq-select">
                  <option>I'm interested in...</option>
                  <option>Aircraft Sales</option>
                  <option>Flight Training</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
                <textarea placeholder="Your message..." class="hq-textarea"></textarea>
                <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Send Message</button>
              </form>
            </div>
          </section>`
      }
    ],

    // ============================================
    // NEW BLUE TAB ELEMENTS (Mix & Match Set 2)
    // ============================================

    // ----------------------------------------
    // PRICING SECTIONS (Blue Tab)
    // ----------------------------------------
    pricing: [
      {
        id: 'pricing-tiers-3',
        category: 'Tiers',
        name: '3-Tier Pricing Table',
        desc: 'Classic pricing comparison with featured middle tier.',
        html: `
          <section class="hq-section hq-pricing hq-pricing--tiers" id="pricing">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Pricing</span>
                <h2 class="hq-section-title">Training Packages</h2>
                <p class="hq-section-subtitle">Choose the path that suits your aviation goals</p>
              </div>
              <div class="hq-pricing__grid hq-pricing__grid--3">
                <div class="hq-pricing-card">
                  <div class="hq-pricing-card__header">
                    <h3 class="hq-pricing-card__name">Discovery</h3>
                    <p class="hq-pricing-card__desc">Perfect first experience</p>
                  </div>
                  <div class="hq-pricing-card__price">
                    <span class="hq-pricing-card__currency">£</span>
                    <span class="hq-pricing-card__amount">299</span>
                  </div>
                  <ul class="hq-pricing-card__features">
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> 30-min trial flight</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Pre-flight briefing</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Hands-on flying</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Certificate</li>
                  </ul>
                  <a href="#book" class="hq-btn hq-btn--outline hq-btn--full">Book Now</a>
                </div>
                <div class="hq-pricing-card hq-pricing-card--featured">
                  <div class="hq-pricing-card__badge">Most Popular</div>
                  <div class="hq-pricing-card__header">
                    <h3 class="hq-pricing-card__name">PPL(H) Complete</h3>
                    <p class="hq-pricing-card__desc">Full private pilot license</p>
                  </div>
                  <div class="hq-pricing-card__price">
                    <span class="hq-pricing-card__currency">£</span>
                    <span class="hq-pricing-card__amount">28,500</span>
                  </div>
                  <ul class="hq-pricing-card__features">
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> 45 hours flight time</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Ground school included</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> All exam fees</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Skills test included</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Headset loan</li>
                  </ul>
                  <a href="#book" class="hq-btn hq-btn--primary hq-btn--full">Get Started</a>
                </div>
                <div class="hq-pricing-card">
                  <div class="hq-pricing-card__header">
                    <h3 class="hq-pricing-card__name">Hour Building</h3>
                    <p class="hq-pricing-card__desc">Build experience solo</p>
                  </div>
                  <div class="hq-pricing-card__price">
                    <span class="hq-pricing-card__currency">£</span>
                    <span class="hq-pricing-card__amount">395</span>
                    <span class="hq-pricing-card__period">/hour</span>
                  </div>
                  <ul class="hq-pricing-card__features">
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> R22 or R44 available</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Flexible scheduling</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Landing fees included</li>
                    <li><svg class="hq-icon hq-icon--check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Block discounts</li>
                  </ul>
                  <a href="#book" class="hq-btn hq-btn--outline hq-btn--full">Enquire</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'pricing-horizontal',
        category: 'Horizontal',
        name: 'Horizontal Pricing',
        desc: 'Side-by-side pricing with feature comparison.',
        html: `
          <section class="hq-section hq-pricing hq-pricing--horizontal" id="pricing">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Maintenance Plans</span>
                <h2 class="hq-section-title">Service Packages</h2>
              </div>
              <div class="hq-pricing__rows">
                <div class="hq-pricing-row">
                  <div class="hq-pricing-row__info">
                    <h3>Basic Inspection</h3>
                    <p>Annual inspection and safety checks</p>
                  </div>
                  <div class="hq-pricing-row__features">
                    <span class="hq-tag">100-hour check</span>
                    <span class="hq-tag">Oil analysis</span>
                    <span class="hq-tag">Logbook update</span>
                  </div>
                  <div class="hq-pricing-row__price">
                    <strong>From £1,850</strong>
                  </div>
                  <a href="#book" class="hq-btn hq-btn--outline hq-btn--sm">Book</a>
                </div>
                <div class="hq-pricing-row hq-pricing-row--featured">
                  <div class="hq-pricing-row__info">
                    <h3>Complete Care</h3>
                    <p>Full maintenance program with priority service</p>
                  </div>
                  <div class="hq-pricing-row__features">
                    <span class="hq-tag">All inspections</span>
                    <span class="hq-tag">Parts included</span>
                    <span class="hq-tag">24/7 AOG support</span>
                    <span class="hq-tag">Loan aircraft</span>
                  </div>
                  <div class="hq-pricing-row__price">
                    <strong>£485/month</strong>
                  </div>
                  <a href="#book" class="hq-btn hq-btn--primary hq-btn--sm">Subscribe</a>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // ANNOUNCEMENT SECTIONS (Blue Tab)
    // ----------------------------------------
    announce: [
      {
        id: 'announce-bar-top',
        category: 'Bar',
        name: 'Top Announcement Bar',
        desc: 'Slim announcement bar for page top.',
        html: `
          <div class="hq-announce-bar hq-announce-bar--top">
            <div class="hq-container">
              <p class="hq-announce-bar__text">
                <strong>🚁 New R66 Turbine in stock</strong> — Ready for immediate delivery.
                <a href="#contact" class="hq-announce-bar__link">Contact us today →</a>
              </p>
              <button class="hq-announce-bar__close" aria-label="Close">&times;</button>
            </div>
          </div>`
      },
      {
        id: 'announce-banner-promo',
        category: 'Banner',
        name: 'Promotional Banner',
        desc: 'Full-width promotional banner with CTA.',
        html: `
          <section class="hq-section hq-announce-banner hq-announce-banner--promo">
            <div class="hq-container">
              <div class="hq-announce-banner__content">
                <span class="hq-announce-banner__label">Limited Time Offer</span>
                <h2 class="hq-announce-banner__title">Spring Training Special</h2>
                <p class="hq-announce-banner__text">Book your PPL(H) course before March 31st and receive 5 bonus flight hours absolutely free.</p>
              </div>
              <div class="hq-announce-banner__action">
                <a href="#book" class="hq-btn hq-btn--white hq-btn--lg">Claim Offer</a>
                <span class="hq-announce-banner__expires">Ends in 14 days</span>
              </div>
            </div>
          </section>`
      },
      {
        id: 'announce-ribbon',
        category: 'Ribbon',
        name: 'Corner Ribbon',
        desc: 'Corner badge for promotions.',
        html: `
          <div class="hq-ribbon hq-ribbon--corner">
            <span class="hq-ribbon__text">New Arrival</span>
          </div>`
      }
    ],

    // ----------------------------------------
    // FORM SECTIONS (Blue Tab)
    // ----------------------------------------
    formSections: [
      {
        id: 'form-quote-detailed',
        category: 'Quote',
        name: 'Detailed Quote Form',
        desc: 'Comprehensive aircraft quote request.',
        html: `
          <section class="hq-section hq-form-section hq-form-section--quote" id="quote">
            <div class="hq-container hq-container--narrow">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Get a Quote</span>
                <h2 class="hq-section-title">Request Aircraft Pricing</h2>
                <p class="hq-section-subtitle">Fill out the form below and we'll provide a detailed quote within 24 hours</p>
              </div>
              <form class="hq-form hq-form--card">
                <div class="hq-form__section">
                  <h4 class="hq-form__section-title">Contact Information</h4>
                  <div class="hq-form__row hq-form__row--2">
                    <div class="hq-form__field">
                      <label class="hq-label">First Name *</label>
                      <input type="text" class="hq-input" required>
                    </div>
                    <div class="hq-form__field">
                      <label class="hq-label">Last Name *</label>
                      <input type="text" class="hq-input" required>
                    </div>
                  </div>
                  <div class="hq-form__row hq-form__row--2">
                    <div class="hq-form__field">
                      <label class="hq-label">Email *</label>
                      <input type="email" class="hq-input" required>
                    </div>
                    <div class="hq-form__field">
                      <label class="hq-label">Phone</label>
                      <input type="tel" class="hq-input">
                    </div>
                  </div>
                </div>
                <div class="hq-form__section">
                  <h4 class="hq-form__section-title">Aircraft Preferences</h4>
                  <div class="hq-form__row hq-form__row--2">
                    <div class="hq-form__field">
                      <label class="hq-label">Aircraft Model *</label>
                      <select class="hq-select" required>
                        <option value="">Select model...</option>
                        <option>Robinson R22 Beta II</option>
                        <option>Robinson R44 Raven I</option>
                        <option>Robinson R44 Raven II</option>
                        <option>Robinson R44 Cadet</option>
                        <option>Robinson R66 Turbine</option>
                      </select>
                    </div>
                    <div class="hq-form__field">
                      <label class="hq-label">Condition</label>
                      <select class="hq-select">
                        <option>New Factory Order</option>
                        <option>Pre-Owned</option>
                        <option>Either</option>
                      </select>
                    </div>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Intended Use</label>
                    <div class="hq-checkbox-group">
                      <label class="hq-checkbox"><input type="checkbox"> Private flying</label>
                      <label class="hq-checkbox"><input type="checkbox"> Training</label>
                      <label class="hq-checkbox"><input type="checkbox"> Commercial operations</label>
                      <label class="hq-checkbox"><input type="checkbox"> Photography/Survey</label>
                    </div>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Additional Requirements</label>
                    <textarea class="hq-textarea" rows="4" placeholder="Tell us about any specific requirements, timeline, or questions..."></textarea>
                  </div>
                </div>
                <div class="hq-form__footer">
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--lg">Submit Request</button>
                  <p class="hq-form__privacy">By submitting, you agree to our <a href="/privacy">privacy policy</a>.</p>
                </div>
              </form>
            </div>
          </section>`
      },
      {
        id: 'form-callback',
        category: 'Callback',
        name: 'Quick Callback Form',
        desc: 'Simple callback request form.',
        html: `
          <section class="hq-section hq-form-section hq-form-section--callback" id="callback">
            <div class="hq-container">
              <div class="hq-callback-card">
                <div class="hq-callback-card__icon">📞</div>
                <h3 class="hq-callback-card__title">Request a Callback</h3>
                <p class="hq-callback-card__text">Leave your number and we'll call you back within the hour.</p>
                <form class="hq-form hq-form--inline">
                  <input type="tel" class="hq-input" placeholder="Your phone number" required>
                  <button type="submit" class="hq-btn hq-btn--primary">Call Me</button>
                </form>
                <p class="hq-callback-card__hours">Available Mon-Fri, 8am-6pm</p>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TABBED CONTENT SECTIONS (Blue Tab)
    // ----------------------------------------
    tabbed: [
      {
        id: 'tabbed-services',
        category: 'Services',
        name: 'Tabbed Services',
        desc: 'Switchable service content panels.',
        html: `
          <section class="hq-section hq-tabbed hq-tabbed--services" id="services-tabs">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">What We Offer</span>
                <h2 class="hq-section-title">Our Services</h2>
              </div>
              <div class="hq-tabs">
                <div class="hq-tabs__nav">
                  <button class="hq-tabs__btn active" data-tab="sales">Sales</button>
                  <button class="hq-tabs__btn" data-tab="training">Training</button>
                  <button class="hq-tabs__btn" data-tab="maintenance">Maintenance</button>
                  <button class="hq-tabs__btn" data-tab="charter">Charter</button>
                </div>
                <div class="hq-tabs__content">
                  <div class="hq-tabs__panel active" id="tab-sales">
                    <div class="hq-tabs__panel-split">
                      <div class="hq-tabs__panel-text">
                        <h3>Helicopter Sales</h3>
                        <p>As an authorized Robinson dealer, we offer the complete range of new and pre-owned helicopters. From your first enquiry to delivery, our team provides expert guidance throughout the purchase process.</p>
                        <ul class="hq-list hq-list--check">
                          <li>New factory orders with full customization</li>
                          <li>Quality pre-owned inventory</li>
                          <li>Trade-in valuations</li>
                          <li>Worldwide delivery</li>
                        </ul>
                        <a href="#aircraft" class="hq-btn hq-btn--primary">View Aircraft</a>
                      </div>
                      <div class="hq-tabs__panel-image">
                        <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66 Helicopter">
                      </div>
                    </div>
                  </div>
                  <div class="hq-tabs__panel" id="tab-training">
                    <div class="hq-tabs__panel-split">
                      <div class="hq-tabs__panel-text">
                        <h3>Flight Training</h3>
                        <p>Learn to fly with our CAA-approved training organization. From complete beginners to type ratings, our experienced instructors will guide you every step of the way.</p>
                        <ul class="hq-list hq-list--check">
                          <li>PPL(H) complete courses</li>
                          <li>Type ratings (R22, R44, R66)</li>
                          <li>Instructor ratings</li>
                          <li>Night ratings</li>
                        </ul>
                        <a href="#training" class="hq-btn hq-btn--primary">View Courses</a>
                      </div>
                      <div class="hq-tabs__panel-image">
                        <img src="/assets/images/team/british-helicopter-team.webp" alt="Training">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'tabbed-specs',
        category: 'Specs',
        name: 'Tabbed Specifications',
        desc: 'Aircraft specs in tabbed format.',
        html: `
          <section class="hq-section hq-tabbed hq-tabbed--specs" id="specs">
            <div class="hq-container">
              <h2 class="hq-section-title">R66 Turbine Specifications</h2>
              <div class="hq-tabs hq-tabs--underline">
                <div class="hq-tabs__nav">
                  <button class="hq-tabs__btn active" data-tab="performance">Performance</button>
                  <button class="hq-tabs__btn" data-tab="dimensions">Dimensions</button>
                  <button class="hq-tabs__btn" data-tab="engine">Engine</button>
                  <button class="hq-tabs__btn" data-tab="weights">Weights</button>
                </div>
                <div class="hq-tabs__content">
                  <div class="hq-tabs__panel active" id="tab-performance">
                    <div class="hq-specs-grid">
                      <div class="hq-spec-item">
                        <span class="hq-spec-item__label">Max Cruise Speed</span>
                        <span class="hq-spec-item__value">110 kts</span>
                      </div>
                      <div class="hq-spec-item">
                        <span class="hq-spec-item__label">Max Range</span>
                        <span class="hq-spec-item__value">350 nm</span>
                      </div>
                      <div class="hq-spec-item">
                        <span class="hq-spec-item__label">Hover Ceiling IGE</span>
                        <span class="hq-spec-item__value">10,000 ft</span>
                      </div>
                      <div class="hq-spec-item">
                        <span class="hq-spec-item__label">Rate of Climb</span>
                        <span class="hq-spec-item__value">1,000 fpm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // STATISTICS SECTIONS (Blue Tab)
    // ----------------------------------------
    statistics: [
      {
        id: 'stats-counter-animated',
        category: 'Counter',
        name: 'Animated Counter Stats',
        desc: 'Large animated number counters.',
        html: `
          <section class="hq-section hq-stats hq-stats--counter" id="stats">
            <div class="hq-container">
              <div class="hq-stats__grid hq-stats__grid--4">
                <div class="hq-stat-item hq-stat-item--large">
                  <span class="hq-stat-item__number" data-count="34">0</span>
                  <span class="hq-stat-item__label">Years in Business</span>
                </div>
                <div class="hq-stat-item hq-stat-item--large">
                  <span class="hq-stat-item__number" data-count="500">0</span>
                  <span class="hq-stat-item__suffix">+</span>
                  <span class="hq-stat-item__label">Aircraft Sold</span>
                </div>
                <div class="hq-stat-item hq-stat-item--large">
                  <span class="hq-stat-item__number" data-count="1200">0</span>
                  <span class="hq-stat-item__suffix">+</span>
                  <span class="hq-stat-item__label">Pilots Trained</span>
                </div>
                <div class="hq-stat-item hq-stat-item--large">
                  <span class="hq-stat-item__number" data-count="98">0</span>
                  <span class="hq-stat-item__suffix">%</span>
                  <span class="hq-stat-item__label">Customer Satisfaction</span>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'stats-comparison',
        category: 'Comparison',
        name: 'Side-by-Side Stats',
        desc: 'Comparative statistics display.',
        html: `
          <section class="hq-section hq-stats hq-stats--comparison" id="compare-stats">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <h2 class="hq-section-title">Why Choose HQ Aviation?</h2>
              </div>
              <div class="hq-stats-compare">
                <div class="hq-stats-compare__column">
                  <h4 class="hq-stats-compare__header">Industry Average</h4>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value">5-7 days</span>
                    <span class="hq-stats-compare__label">Response time</span>
                  </div>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value">12 weeks</span>
                    <span class="hq-stats-compare__label">Maintenance turnaround</span>
                  </div>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value">Basic</span>
                    <span class="hq-stats-compare__label">Post-sale support</span>
                  </div>
                </div>
                <div class="hq-stats-compare__vs">VS</div>
                <div class="hq-stats-compare__column hq-stats-compare__column--featured">
                  <h4 class="hq-stats-compare__header">HQ Aviation</h4>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value hq-stats-compare__value--highlight">Same day</span>
                    <span class="hq-stats-compare__label">Response time</span>
                  </div>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value hq-stats-compare__value--highlight">2-4 weeks</span>
                    <span class="hq-stats-compare__label">Maintenance turnaround</span>
                  </div>
                  <div class="hq-stats-compare__item">
                    <span class="hq-stats-compare__value hq-stats-compare__value--highlight">Lifetime</span>
                    <span class="hq-stats-compare__label">Post-sale support</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TIMELINE SECTIONS (Blue Tab)
    // ----------------------------------------
    timelines: [
      {
        id: 'timeline-vertical-history',
        category: 'Vertical',
        name: 'Company History Timeline',
        desc: 'Vertical timeline with milestones.',
        html: `
          <section class="hq-section hq-timeline hq-timeline--vertical" id="history">
            <div class="hq-container hq-container--narrow">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Our Story</span>
                <h2 class="hq-section-title">Three Decades of Excellence</h2>
              </div>
              <div class="hq-timeline__track">
                <div class="hq-timeline-item">
                  <div class="hq-timeline-item__year">1990</div>
                  <div class="hq-timeline-item__content">
                    <h3>HQ Aviation Founded</h3>
                    <p>Established at Denham Aerodrome with a single R22 and a vision to become the UK's premier helicopter center.</p>
                  </div>
                </div>
                <div class="hq-timeline-item">
                  <div class="hq-timeline-item__year">1998</div>
                  <div class="hq-timeline-item__content">
                    <h3>Robinson Authorized Dealer</h3>
                    <p>Appointed as an official Robinson Helicopter Company dealer for the United Kingdom.</p>
                  </div>
                </div>
                <div class="hq-timeline-item">
                  <div class="hq-timeline-item__year">2005</div>
                  <div class="hq-timeline-item__content">
                    <h3>New Facility Opens</h3>
                    <p>Moved to expanded purpose-built hangar facilities with dedicated maintenance and training areas.</p>
                  </div>
                </div>
                <div class="hq-timeline-item">
                  <div class="hq-timeline-item__year">2015</div>
                  <div class="hq-timeline-item__content">
                    <h3>500th Aircraft Sold</h3>
                    <p>Celebrated the delivery of our 500th helicopter, cementing our position as the UK's leading dealer.</p>
                  </div>
                </div>
                <div class="hq-timeline-item">
                  <div class="hq-timeline-item__year">2024</div>
                  <div class="hq-timeline-item__content">
                    <h3>Looking Forward</h3>
                    <p>Continuing to grow with new technology, expanded services, and the same commitment to excellence.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'timeline-horizontal-process',
        category: 'Horizontal',
        name: 'Horizontal Process Timeline',
        desc: 'Left-to-right process flow.',
        html: `
          <section class="hq-section hq-timeline hq-timeline--horizontal" id="process-timeline">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <h2 class="hq-section-title">Your Purchase Journey</h2>
              </div>
              <div class="hq-timeline__horizontal">
                <div class="hq-timeline-step">
                  <div class="hq-timeline-step__icon">1</div>
                  <div class="hq-timeline-step__line"></div>
                  <h4>Enquiry</h4>
                  <p>Share your requirements</p>
                </div>
                <div class="hq-timeline-step">
                  <div class="hq-timeline-step__icon">2</div>
                  <div class="hq-timeline-step__line"></div>
                  <h4>Consultation</h4>
                  <p>Expert advice & options</p>
                </div>
                <div class="hq-timeline-step">
                  <div class="hq-timeline-step__icon">3</div>
                  <div class="hq-timeline-step__line"></div>
                  <h4>Selection</h4>
                  <p>Choose your aircraft</p>
                </div>
                <div class="hq-timeline-step">
                  <div class="hq-timeline-step__icon">4</div>
                  <div class="hq-timeline-step__line"></div>
                  <h4>Purchase</h4>
                  <p>Paperwork handled</p>
                </div>
                <div class="hq-timeline-step">
                  <div class="hq-timeline-step__icon">5</div>
                  <h4>Delivery</h4>
                  <p>Fly away ready</p>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // ICON GRID SECTIONS (Blue Tab)
    // ----------------------------------------
    iconGrids: [
      {
        id: 'icons-benefits-6',
        category: 'Benefits',
        name: '6-Icon Benefits Grid',
        desc: 'Six icon feature cards.',
        html: `
          <section class="hq-section hq-icons hq-icons--benefits" id="benefits">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Why HQ Aviation</span>
                <h2 class="hq-section-title">The HQ Advantage</h2>
              </div>
              <div class="hq-icons__grid hq-icons__grid--6">
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">🏆</div>
                  <h3 class="hq-icon-card__title">Authorized Dealer</h3>
                  <p class="hq-icon-card__text">Official Robinson Helicopter Company dealer with factory backing.</p>
                </div>
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">🔧</div>
                  <h3 class="hq-icon-card__title">EASA Part-145</h3>
                  <p class="hq-icon-card__text">Fully approved maintenance organization with trained engineers.</p>
                </div>
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">🎓</div>
                  <h3 class="hq-icon-card__title">ATO Approved</h3>
                  <p class="hq-icon-card__text">CAA Approved Training Organization for PPL(H) and ratings.</p>
                </div>
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">💬</div>
                  <h3 class="hq-icon-card__title">Expert Advice</h3>
                  <p class="hq-icon-card__text">30+ years experience helping customers make the right choice.</p>
                </div>
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">📦</div>
                  <h3 class="hq-icon-card__title">Parts Stock</h3>
                  <p class="hq-icon-card__text">Comprehensive inventory of Robinson parts for quick service.</p>
                </div>
                <div class="hq-icon-card">
                  <div class="hq-icon-card__icon">🌍</div>
                  <h3 class="hq-icon-card__title">Global Delivery</h3>
                  <p class="hq-icon-card__text">Worldwide shipping and ferry flight services available.</p>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'icons-checklist',
        category: 'Checklist',
        name: 'Checklist Feature List',
        desc: 'Vertical icon checklist.',
        html: `
          <section class="hq-section hq-icons hq-icons--checklist" id="checklist">
            <div class="hq-container">
              <div class="hq-split">
                <div class="hq-split__content">
                  <span class="hq-overline">What's Included</span>
                  <h2 class="hq-section-title">Complete Purchase Package</h2>
                  <ul class="hq-checklist">
                    <li class="hq-checklist__item">
                      <svg class="hq-checklist__icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      <div class="hq-checklist__text">
                        <strong>Full handover training</strong>
                        <span>Type-specific ground and flight instruction</span>
                      </div>
                    </li>
                    <li class="hq-checklist__item">
                      <svg class="hq-checklist__icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      <div class="hq-checklist__text">
                        <strong>Documentation pack</strong>
                        <span>All manuals, certificates, and logbooks</span>
                      </div>
                    </li>
                    <li class="hq-checklist__item">
                      <svg class="hq-checklist__icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      <div class="hq-checklist__text">
                        <strong>Insurance guidance</strong>
                        <span>Introduction to specialist aviation insurers</span>
                      </div>
                    </li>
                    <li class="hq-checklist__item">
                      <svg class="hq-checklist__icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      <div class="hq-checklist__text">
                        <strong>Lifetime support</strong>
                        <span>Ongoing advice and maintenance booking</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="hq-split__image">
                  <img src="/assets/images/facility/busy-hangar.jpg" alt="Hangar">
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // CARD LAYOUTS (Blue Tab)
    // ----------------------------------------
    cardLayouts: [
      {
        id: 'cards-hover-lift',
        category: 'Hover',
        name: 'Hover Lift Cards',
        desc: 'Cards that lift on hover.',
        html: `
          <section class="hq-section hq-cards hq-cards--hover" id="cards-hover">
            <div class="hq-container">
              <div class="hq-cards__grid hq-cards__grid--3">
                <a href="#sales" class="hq-hover-card">
                  <div class="hq-hover-card__image">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="Sales">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3>Aircraft Sales</h3>
                    <p>New and pre-owned Robinson helicopters</p>
                    <span class="hq-hover-card__link">View Aircraft →</span>
                  </div>
                </a>
                <a href="#training" class="hq-hover-card">
                  <div class="hq-hover-card__image">
                    <img src="/assets/images/team/british-helicopter-team.webp" alt="Training">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3>Flight Training</h3>
                    <p>From first flight to commercial license</p>
                    <span class="hq-hover-card__link">View Courses →</span>
                  </div>
                </a>
                <a href="#maintenance" class="hq-hover-card">
                  <div class="hq-hover-card__image">
                    <img src="/assets/images/facility/busy-hangar.jpg" alt="Maintenance">
                  </div>
                  <div class="hq-hover-card__content">
                    <h3>Maintenance</h3>
                    <p>EASA Part-145 approved service center</p>
                    <span class="hq-hover-card__link">Learn More →</span>
                  </div>
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'cards-stacked',
        category: 'Stacked',
        name: 'Stacked Overlap Cards',
        desc: 'Overlapping card stack effect.',
        html: `
          <section class="hq-section hq-cards hq-cards--stacked" id="cards-stacked">
            <div class="hq-container">
              <div class="hq-section-header">
                <h2 class="hq-section-title">Featured Services</h2>
              </div>
              <div class="hq-stacked-cards">
                <div class="hq-stacked-card hq-stacked-card--1">
                  <h3>Pre-Purchase Inspections</h3>
                  <p>Comprehensive evaluation of pre-owned aircraft before purchase. Our engineers will assess condition, compliance, and value.</p>
                  <a href="#ppi" class="hq-btn hq-btn--outline hq-btn--sm">Learn More</a>
                </div>
                <div class="hq-stacked-card hq-stacked-card--2">
                  <h3>AOG Support</h3>
                  <p>Aircraft on ground? Our 24/7 emergency support ensures minimal downtime with parts and engineers ready.</p>
                  <a href="#aog" class="hq-btn hq-btn--outline hq-btn--sm">Contact</a>
                </div>
                <div class="hq-stacked-card hq-stacked-card--3">
                  <h3>Aircraft Management</h3>
                  <p>Full management services including scheduling, maintenance tracking, and regulatory compliance.</p>
                  <a href="#management" class="hq-btn hq-btn--outline hq-btn--sm">Enquire</a>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FOOTER SECTIONS (Blue Tab)
    // ----------------------------------------
    footers: [
      {
        id: 'footer-minimal',
        category: 'Minimal',
        name: 'Minimal Footer',
        desc: 'Simple single-line footer.',
        html: `
          <footer class="hq-footer hq-footer--minimal">
            <div class="hq-container">
              <div class="hq-footer__minimal">
                <div class="hq-footer__logo">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" class="hq-footer__logo-img">
                </div>
                <nav class="hq-footer__links">
                  <a href="#aircraft">Aircraft</a>
                  <a href="#training">Training</a>
                  <a href="#maintenance">Maintenance</a>
                  <a href="#contact">Contact</a>
                </nav>
                <div class="hq-footer__social">
                  <a href="#" aria-label="Instagram">📷</a>
                  <a href="#" aria-label="Facebook">📘</a>
                  <a href="#" aria-label="LinkedIn">💼</a>
                </div>
              </div>
              <div class="hq-footer__bottom">
                <p>&copy; 2024 HQ Aviation. All rights reserved.</p>
              </div>
            </div>
          </footer>`
      },
      {
        id: 'footer-mega',
        category: 'Mega',
        name: 'Mega Footer',
        desc: 'Comprehensive multi-column footer.',
        html: `
          <footer class="hq-footer hq-footer--mega">
            <div class="hq-container">
              <div class="hq-footer__main">
                <div class="hq-footer__brand">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" class="hq-footer__logo-img">
                  <p class="hq-footer__tagline">UK's Premier Robinson Helicopter Dealer</p>
                  <div class="hq-footer__contact-primary">
                    <a href="tel:+441753868976" class="hq-footer__phone">01753 868 976</a>
                    <a href="mailto:info@hqaviation.com" class="hq-footer__email">info@hqaviation.com</a>
                  </div>
                </div>
                <div class="hq-footer__nav-col">
                  <h4>Aircraft</h4>
                  <ul>
                    <li><a href="#">Robinson R22</a></li>
                    <li><a href="#">Robinson R44</a></li>
                    <li><a href="#">Robinson R66</a></li>
                    <li><a href="#">Pre-Owned</a></li>
                  </ul>
                </div>
                <div class="hq-footer__nav-col">
                  <h4>Training</h4>
                  <ul>
                    <li><a href="#">PPL(H) Course</a></li>
                    <li><a href="#">Type Ratings</a></li>
                    <li><a href="#">Trial Lessons</a></li>
                    <li><a href="#">Night Ratings</a></li>
                  </ul>
                </div>
                <div class="hq-footer__nav-col">
                  <h4>Services</h4>
                  <ul>
                    <li><a href="#">Maintenance</a></li>
                    <li><a href="#">Parts</a></li>
                    <li><a href="#">Inspections</a></li>
                    <li><a href="#">Management</a></li>
                  </ul>
                </div>
                <div class="hq-footer__nav-col">
                  <h4>Location</h4>
                  <address>
                    Denham Aerodrome<br>
                    Tilehouse Lane<br>
                    Buckinghamshire<br>
                    UB9 5DF
                  </address>
                  <a href="#" class="hq-btn hq-btn--outline hq-btn--sm">Get Directions</a>
                </div>
              </div>
              <div class="hq-footer__bottom">
                <p>&copy; 2024 HQ Aviation Ltd. All rights reserved.</p>
                <nav class="hq-footer__legal">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms</a>
                  <a href="#">Cookies</a>
                </nav>
                <div class="hq-footer__social">
                  <a href="#" aria-label="Instagram">📷</a>
                  <a href="#" aria-label="Facebook">📘</a>
                  <a href="#" aria-label="LinkedIn">💼</a>
                  <a href="#" aria-label="YouTube">📺</a>
                </div>
              </div>
            </div>
          </footer>`
      }
    ],

    // ----------------------------------------
    // NAVIGATION ELEMENTS (Blue Tab)
    // ----------------------------------------
    navigation: [
      {
        id: 'nav-breadcrumbs',
        category: 'Breadcrumbs',
        name: 'Breadcrumb Navigation',
        desc: 'Page location breadcrumbs.',
        html: `
          <nav class="hq-breadcrumbs" aria-label="Breadcrumb">
            <div class="hq-container">
              <ol class="hq-breadcrumbs__list">
                <li class="hq-breadcrumbs__item"><a href="/">Home</a></li>
                <li class="hq-breadcrumbs__separator">/</li>
                <li class="hq-breadcrumbs__item"><a href="/aircraft">Aircraft</a></li>
                <li class="hq-breadcrumbs__separator">/</li>
                <li class="hq-breadcrumbs__item"><a href="/aircraft/r66">Robinson R66</a></li>
                <li class="hq-breadcrumbs__separator">/</li>
                <li class="hq-breadcrumbs__item hq-breadcrumbs__item--current" aria-current="page">G-HQAV</li>
              </ol>
            </div>
          </nav>`
      },
      {
        id: 'nav-pagination',
        category: 'Pagination',
        name: 'Pagination Controls',
        desc: 'Page navigation for listings.',
        html: `
          <nav class="hq-pagination" aria-label="Pagination">
            <a href="#" class="hq-pagination__btn hq-pagination__btn--prev" aria-label="Previous page">
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </a>
            <div class="hq-pagination__pages">
              <a href="#" class="hq-pagination__page">1</a>
              <a href="#" class="hq-pagination__page hq-pagination__page--active" aria-current="page">2</a>
              <a href="#" class="hq-pagination__page">3</a>
              <span class="hq-pagination__ellipsis">...</span>
              <a href="#" class="hq-pagination__page">12</a>
            </div>
            <a href="#" class="hq-pagination__btn hq-pagination__btn--next" aria-label="Next page">
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </a>
          </nav>`
      },
      {
        id: 'nav-sticky-header',
        category: 'Header',
        name: 'Sticky Compact Header',
        desc: 'Compact header that appears on scroll.',
        html: `
          <header class="hq-header hq-header--sticky">
            <div class="hq-container">
              <a href="/" class="hq-header__logo">
                <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation">
              </a>
              <nav class="hq-header__nav">
                <a href="#aircraft">Aircraft</a>
                <a href="#training">Training</a>
                <a href="#maintenance">Maintenance</a>
                <a href="#about">About</a>
              </nav>
              <div class="hq-header__actions">
                <a href="tel:+441753868976" class="hq-header__phone">01753 868 976</a>
                <a href="#contact" class="hq-btn hq-btn--primary hq-btn--sm">Contact</a>
              </div>
            </div>
          </header>`
      }
    ],

    // ----------------------------------------
    // SEARCH & FILTER (Blue Tab)
    // ----------------------------------------
    searchFilter: [
      {
        id: 'search-hero',
        category: 'Hero',
        name: 'Search Hero Section',
        desc: 'Hero with prominent search.',
        html: `
          <section class="hq-section hq-search-hero">
            <div class="hq-search-hero__bg">
              <img src="/assets/images/facility/busy-hangar.jpg" alt="Fleet">
            </div>
            <div class="hq-search-hero__overlay"></div>
            <div class="hq-container">
              <div class="hq-search-hero__content">
                <h1>Find Your Perfect Helicopter</h1>
                <p>Search our inventory of new and pre-owned Robinson aircraft</p>
                <form class="hq-search-form hq-search-form--large">
                  <div class="hq-search-form__row">
                    <select class="hq-select">
                      <option>Any Model</option>
                      <option>R22</option>
                      <option>R44</option>
                      <option>R66</option>
                    </select>
                    <select class="hq-select">
                      <option>Any Year</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                      <option>2021 & earlier</option>
                    </select>
                    <select class="hq-select">
                      <option>Any Price</option>
                      <option>Under £200k</option>
                      <option>£200k - £500k</option>
                      <option>Over £500k</option>
                    </select>
                    <button type="submit" class="hq-btn hq-btn--primary hq-btn--lg">Search</button>
                  </div>
                </form>
                <div class="hq-search-hero__quick">
                  <span>Popular:</span>
                  <a href="#">R44 Raven II</a>
                  <a href="#">R66 Turbine</a>
                  <a href="#">Under 500 hours</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'filter-bar',
        category: 'Filter',
        name: 'Filter Bar',
        desc: 'Horizontal filter controls.',
        html: `
          <div class="hq-filter-bar">
            <div class="hq-container">
              <div class="hq-filter-bar__content">
                <div class="hq-filter-bar__left">
                  <span class="hq-filter-bar__count">24 aircraft found</span>
                </div>
                <div class="hq-filter-bar__filters">
                  <div class="hq-filter-dropdown">
                    <button class="hq-filter-dropdown__btn">Model <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                  </div>
                  <div class="hq-filter-dropdown">
                    <button class="hq-filter-dropdown__btn">Price <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                  </div>
                  <div class="hq-filter-dropdown">
                    <button class="hq-filter-dropdown__btn">Year <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                  </div>
                  <div class="hq-filter-dropdown">
                    <button class="hq-filter-dropdown__btn">Hours <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                  </div>
                </div>
                <div class="hq-filter-bar__right">
                  <div class="hq-filter-sort">
                    <label>Sort by:</label>
                    <select class="hq-select hq-select--inline">
                      <option>Newest First</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Hours: Low to High</option>
                    </select>
                  </div>
                  <div class="hq-filter-view">
                    <button class="hq-filter-view__btn active" aria-label="Grid view">▦</button>
                    <button class="hq-filter-view__btn" aria-label="List view">☰</button>
                  </div>
                </div>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // TESTIMONIAL VARIANTS (Blue Tab)
    // ----------------------------------------
    testimonialVariants: [
      {
        id: 'testimonial-video',
        category: 'Video',
        name: 'Video Testimonial',
        desc: 'Customer testimonial with video.',
        html: `
          <section class="hq-section hq-testimonial hq-testimonial--video" id="testimonial-video">
            <div class="hq-container">
              <div class="hq-testimonial__split">
                <div class="hq-testimonial__video">
                  <div class="hq-video-placeholder">
                    <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Video thumbnail">
                    <button class="hq-video-play" aria-label="Play video">▶</button>
                  </div>
                </div>
                <div class="hq-testimonial__content">
                  <blockquote class="hq-testimonial__quote">
                    "The team at HQ Aviation made buying my R66 an absolute pleasure. From the initial enquiry to delivery, every step was handled professionally. I've now completed over 200 hours and the ongoing support has been exceptional."
                  </blockquote>
                  <div class="hq-testimonial__author">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="James Mitchell" class="hq-testimonial__avatar">
                    <div class="hq-testimonial__author-info">
                      <strong>James Mitchell</strong>
                      <span>R66 Owner since 2022</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'testimonial-carousel',
        category: 'Carousel',
        name: 'Testimonial Carousel',
        desc: 'Sliding testimonial cards.',
        html: `
          <section class="hq-section hq-testimonial hq-testimonial--carousel" id="testimonial-carousel">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">What Our Clients Say</span>
                <h2 class="hq-section-title">Customer Stories</h2>
              </div>
              <div class="hq-testimonial-carousel">
                <div class="hq-testimonial-carousel__track">
                  <div class="hq-testimonial-slide">
                    <div class="hq-testimonial-card">
                      <div class="hq-testimonial-card__stars">★★★★★</div>
                      <p class="hq-testimonial-card__text">"Excellent service from start to finish. The training team are knowledgeable and patient."</p>
                      <div class="hq-testimonial-card__author">
                        <strong>Sarah Williams</strong>
                        <span>PPL(H) Graduate</span>
                      </div>
                    </div>
                  </div>
                  <div class="hq-testimonial-slide">
                    <div class="hq-testimonial-card">
                      <div class="hq-testimonial-card__stars">★★★★★</div>
                      <p class="hq-testimonial-card__text">"Bought my R44 from HQ last year. The maintenance service keeps everything running perfectly."</p>
                      <div class="hq-testimonial-card__author">
                        <strong>Mark Thompson</strong>
                        <span>R44 Owner</span>
                      </div>
                    </div>
                  </div>
                  <div class="hq-testimonial-slide">
                    <div class="hq-testimonial-card">
                      <div class="hq-testimonial-card__stars">★★★★★</div>
                      <p class="hq-testimonial-card__text">"Professional team, competitive pricing, and genuine expertise. Highly recommended."</p>
                      <div class="hq-testimonial-card__author">
                        <strong>David Chen</strong>
                        <span>Commercial Operator</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hq-testimonial-carousel__nav">
                  <button class="hq-testimonial-carousel__prev">←</button>
                  <button class="hq-testimonial-carousel__next">→</button>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // CONTENT BLOCKS (Blue Tab)
    // ----------------------------------------
    contentBlocks: [
      {
        id: 'content-split-image-left',
        category: 'Split',
        name: 'Split Content (Image Left)',
        desc: 'Image on left, content on right.',
        html: `
          <section class="hq-section hq-content hq-content--split" id="content-split">
            <div class="hq-container">
              <div class="hq-content__split">
                <div class="hq-content__image">
                  <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Training">
                </div>
                <div class="hq-content__text">
                  <span class="hq-overline">About Our Training</span>
                  <h2>World-Class Instruction</h2>
                  <p>Our flight instructors bring decades of combined experience to every lesson. With backgrounds in commercial aviation, military service, and competition flying, they provide diverse perspectives and expert guidance.</p>
                  <p>We maintain small class sizes to ensure personalized attention, and our modern fleet of training aircraft are maintained to the highest standards.</p>
                  <div class="hq-content__cta">
                    <a href="#training" class="hq-btn hq-btn--primary">View Training Courses</a>
                    <a href="#instructors" class="hq-btn hq-btn--ghost">Meet Our Team</a>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'content-quote-featured',
        category: 'Quote',
        name: 'Featured Quote Block',
        desc: 'Large pull quote with background.',
        html: `
          <section class="hq-section hq-content hq-content--quote" id="content-quote">
            <div class="hq-content__quote-bg">
              <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="Background">
            </div>
            <div class="hq-content__quote-overlay"></div>
            <div class="hq-container">
              <blockquote class="hq-blockquote hq-blockquote--large">
                <p>"Flying a helicopter is unlike anything else. The freedom to go anywhere, land anywhere, see the world from a completely new perspective – it changes your life."</p>
                <footer>
                  <cite>Quentin Smith</cite>
                  <span>Founder, HQ Aviation</span>
                </footer>
              </blockquote>
            </div>
          </section>`
      }
    ],

    // ============================================
    // NEW GREEN TAB ELEMENTS (Mix & Match Set 3)
    // ============================================

    // ----------------------------------------
    // MODAL/POPUP SECTIONS (Green Tab)
    // ----------------------------------------
    modals: [
      {
        id: 'modal-newsletter',
        category: 'Newsletter',
        name: 'Newsletter Popup',
        desc: 'Email capture modal overlay.',
        html: `
          <div class="hq-modal-demo">
            <div class="hq-modal hq-modal--newsletter">
              <button class="hq-modal__close">&times;</button>
              <div class="hq-modal__content">
                <div class="hq-modal__icon">✈️</div>
                <h3>Stay in the Loop</h3>
                <p>Get exclusive updates on new aircraft, special offers, and aviation news.</p>
                <form class="hq-modal__form">
                  <input type="email" placeholder="Enter your email" class="hq-input">
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Subscribe</button>
                </form>
                <p class="hq-modal__privacy">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>`
      },
      {
        id: 'modal-enquiry',
        category: 'Enquiry',
        name: 'Quick Enquiry Modal',
        desc: 'Contact form in modal.',
        html: `
          <div class="hq-modal-demo">
            <div class="hq-modal hq-modal--enquiry">
              <button class="hq-modal__close">&times;</button>
              <div class="hq-modal__header">
                <h3>Quick Enquiry</h3>
                <p>We'll get back to you within 24 hours</p>
              </div>
              <div class="hq-modal__content">
                <form class="hq-form">
                  <div class="hq-form__row hq-form__row--2">
                    <input type="text" placeholder="First Name" class="hq-input">
                    <input type="text" placeholder="Last Name" class="hq-input">
                  </div>
                  <input type="email" placeholder="Email Address" class="hq-input">
                  <input type="tel" placeholder="Phone Number" class="hq-input">
                  <select class="hq-select">
                    <option>What are you interested in?</option>
                    <option>Aircraft Sales</option>
                    <option>Flight Training</option>
                    <option>Maintenance</option>
                    <option>Parts</option>
                  </select>
                  <textarea placeholder="Your message..." class="hq-textarea" rows="3"></textarea>
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Send Enquiry</button>
                </form>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // ALERT/NOTIFICATION SECTIONS (Green Tab)
    // ----------------------------------------
    alerts: [
      {
        id: 'alert-banner-success',
        category: 'Banner',
        name: 'Success Alert Banner',
        desc: 'Full-width success notification.',
        html: `
          <div class="hq-alert hq-alert--success hq-alert--banner">
            <div class="hq-container">
              <div class="hq-alert__content">
                <span class="hq-alert__icon">✓</span>
                <span class="hq-alert__message"><strong>Success!</strong> Your enquiry has been submitted. We'll be in touch shortly.</span>
              </div>
              <button class="hq-alert__close">&times;</button>
            </div>
          </div>`
      },
      {
        id: 'alert-toast-stack',
        category: 'Toast',
        name: 'Toast Notifications',
        desc: 'Stacked toast messages.',
        html: `
          <div class="hq-toast-container">
            <div class="hq-toast hq-toast--info">
              <span class="hq-toast__icon">ℹ️</span>
              <span class="hq-toast__message">New aircraft added to inventory</span>
              <button class="hq-toast__close">&times;</button>
            </div>
            <div class="hq-toast hq-toast--success">
              <span class="hq-toast__icon">✓</span>
              <span class="hq-toast__message">Message sent successfully</span>
              <button class="hq-toast__close">&times;</button>
            </div>
            <div class="hq-toast hq-toast--warning">
              <span class="hq-toast__icon">⚠️</span>
              <span class="hq-toast__message">Limited availability on this model</span>
              <button class="hq-toast__close">&times;</button>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // LOADING STATES (Green Tab)
    // ----------------------------------------
    loading: [
      {
        id: 'loading-skeleton',
        category: 'Skeleton',
        name: 'Skeleton Loading',
        desc: 'Content placeholder animation.',
        html: `
          <section class="hq-section hq-loading-demo">
            <div class="hq-container">
              <div class="hq-skeleton-card">
                <div class="hq-skeleton hq-skeleton--image"></div>
                <div class="hq-skeleton-card__content">
                  <div class="hq-skeleton hq-skeleton--title"></div>
                  <div class="hq-skeleton hq-skeleton--text"></div>
                  <div class="hq-skeleton hq-skeleton--text hq-skeleton--short"></div>
                </div>
              </div>
              <div class="hq-skeleton-card">
                <div class="hq-skeleton hq-skeleton--image"></div>
                <div class="hq-skeleton-card__content">
                  <div class="hq-skeleton hq-skeleton--title"></div>
                  <div class="hq-skeleton hq-skeleton--text"></div>
                  <div class="hq-skeleton hq-skeleton--text hq-skeleton--short"></div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'loading-spinner',
        category: 'Spinner',
        name: 'Loading Spinner',
        desc: 'Centered loading indicator.',
        html: `
          <section class="hq-section hq-loading-demo hq-loading-demo--centered">
            <div class="hq-loader">
              <div class="hq-loader__spinner"></div>
              <p class="hq-loader__text">Loading aircraft...</p>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // EMPTY STATES (Green Tab)
    // ----------------------------------------
    emptyStates: [
      {
        id: 'empty-no-results',
        category: 'No Results',
        name: 'No Search Results',
        desc: 'Empty search results state.',
        html: `
          <section class="hq-section hq-empty">
            <div class="hq-container">
              <div class="hq-empty__content">
                <div class="hq-empty__icon">🔍</div>
                <h2 class="hq-empty__title">No Aircraft Found</h2>
                <p class="hq-empty__text">We couldn't find any aircraft matching your criteria. Try adjusting your filters or search terms.</p>
                <div class="hq-empty__actions">
                  <button class="hq-btn hq-btn--primary">Clear Filters</button>
                  <button class="hq-btn hq-btn--outline">Contact Us</button>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'empty-coming-soon',
        category: 'Coming Soon',
        name: 'Coming Soon State',
        desc: 'Feature coming soon placeholder.',
        html: `
          <section class="hq-section hq-empty hq-empty--coming-soon">
            <div class="hq-container">
              <div class="hq-empty__content">
                <div class="hq-empty__icon">🚀</div>
                <h2 class="hq-empty__title">Coming Soon</h2>
                <p class="hq-empty__text">We're working on something exciting. Sign up to be notified when this feature launches.</p>
                <form class="hq-empty__form">
                  <input type="email" placeholder="Enter your email" class="hq-input">
                  <button type="submit" class="hq-btn hq-btn--primary">Notify Me</button>
                </form>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // ERROR PAGES (Green Tab)
    // ----------------------------------------
    errorPages: [
      {
        id: 'error-404',
        category: '404',
        name: '404 Not Found',
        desc: 'Page not found error.',
        html: `
          <section class="hq-section hq-error hq-error--404">
            <div class="hq-container">
              <div class="hq-error__content">
                <h1 class="hq-error__code">404</h1>
                <h2 class="hq-error__title">Page Not Found</h2>
                <p class="hq-error__text">The page you're looking for seems to have flown away. Let's get you back on course.</p>
                <div class="hq-error__actions">
                  <a href="/" class="hq-btn hq-btn--primary">Back to Home</a>
                  <a href="/aircraft" class="hq-btn hq-btn--outline">View Aircraft</a>
                </div>
              </div>
              <div class="hq-error__image">
                <img src="/assets/images/new-aircraft/r66/r66-cutout.png" alt="Helicopter">
              </div>
            </div>
          </section>`
      },
      {
        id: 'error-maintenance',
        category: 'Maintenance',
        name: 'Under Maintenance',
        desc: 'Site maintenance page.',
        html: `
          <section class="hq-section hq-error hq-error--maintenance">
            <div class="hq-container">
              <div class="hq-error__content">
                <div class="hq-error__icon">🔧</div>
                <h2 class="hq-error__title">Under Maintenance</h2>
                <p class="hq-error__text">We're performing scheduled maintenance to improve your experience. We'll be back shortly.</p>
                <div class="hq-error__eta">
                  <strong>Estimated return:</strong> 2 hours
                </div>
                <div class="hq-error__contact">
                  <p>Urgent enquiries: <a href="tel:+441753868976">01753 868 976</a></p>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // AUTH/LOGIN SECTIONS (Green Tab)
    // ----------------------------------------
    auth: [
      {
        id: 'auth-login',
        category: 'Login',
        name: 'Login Form',
        desc: 'User login page.',
        html: `
          <section class="hq-section hq-auth">
            <div class="hq-auth__card">
              <div class="hq-auth__header">
                <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" class="hq-auth__logo">
                <h2>Welcome Back</h2>
                <p>Sign in to access your account</p>
              </div>
              <form class="hq-form">
                <div class="hq-form__field">
                  <label class="hq-label">Email</label>
                  <input type="email" class="hq-input" placeholder="you@example.com">
                </div>
                <div class="hq-form__field">
                  <label class="hq-label">Password</label>
                  <input type="password" class="hq-input" placeholder="••••••••">
                </div>
                <div class="hq-auth__options">
                  <label class="hq-checkbox">
                    <input type="checkbox"> Remember me
                  </label>
                  <a href="#forgot" class="hq-link">Forgot password?</a>
                </div>
                <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Sign In</button>
              </form>
              <div class="hq-auth__footer">
                <p>Don't have an account? <a href="#register">Create one</a></p>
              </div>
            </div>
          </section>`
      },
      {
        id: 'auth-register',
        category: 'Register',
        name: 'Registration Form',
        desc: 'New user registration.',
        html: `
          <section class="hq-section hq-auth">
            <div class="hq-auth__card">
              <div class="hq-auth__header">
                <h2>Create Account</h2>
                <p>Join HQ Aviation today</p>
              </div>
              <form class="hq-form">
                <div class="hq-form__row hq-form__row--2">
                  <div class="hq-form__field">
                    <label class="hq-label">First Name</label>
                    <input type="text" class="hq-input">
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Last Name</label>
                    <input type="text" class="hq-input">
                  </div>
                </div>
                <div class="hq-form__field">
                  <label class="hq-label">Email</label>
                  <input type="email" class="hq-input">
                </div>
                <div class="hq-form__field">
                  <label class="hq-label">Password</label>
                  <input type="password" class="hq-input">
                  <span class="hq-form__hint">Minimum 8 characters</span>
                </div>
                <label class="hq-checkbox">
                  <input type="checkbox"> I agree to the <a href="/terms">Terms of Service</a>
                </label>
                <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Create Account</button>
              </form>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // PROFILE/ACCOUNT SECTIONS (Green Tab)
    // ----------------------------------------
    profile: [
      {
        id: 'profile-header',
        category: 'Header',
        name: 'Profile Header',
        desc: 'User profile header card.',
        html: `
          <section class="hq-section hq-profile-header">
            <div class="hq-container">
              <div class="hq-profile-card">
                <div class="hq-profile-card__avatar">
                  <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Profile">
                  <button class="hq-profile-card__edit-avatar">📷</button>
                </div>
                <div class="hq-profile-card__info">
                  <h2>James Mitchell</h2>
                  <p class="hq-profile-card__role">R66 Owner • Member since 2022</p>
                  <div class="hq-profile-card__stats">
                    <div class="hq-profile-stat">
                      <strong>2</strong>
                      <span>Aircraft</span>
                    </div>
                    <div class="hq-profile-stat">
                      <strong>450</strong>
                      <span>Flight Hours</span>
                    </div>
                    <div class="hq-profile-stat">
                      <strong>12</strong>
                      <span>Services</span>
                    </div>
                  </div>
                </div>
                <div class="hq-profile-card__actions">
                  <button class="hq-btn hq-btn--outline hq-btn--sm">Edit Profile</button>
                  <button class="hq-btn hq-btn--ghost hq-btn--sm">Settings</button>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'profile-settings',
        category: 'Settings',
        name: 'Settings Panel',
        desc: 'Account settings form.',
        html: `
          <section class="hq-section hq-settings">
            <div class="hq-container hq-container--narrow">
              <div class="hq-settings__card">
                <h3 class="hq-settings__title">Account Settings</h3>
                <div class="hq-settings__section">
                  <h4>Notifications</h4>
                  <div class="hq-settings__option">
                    <div class="hq-settings__option-info">
                      <strong>Email Notifications</strong>
                      <span>Receive updates about your aircraft and services</span>
                    </div>
                    <label class="hq-toggle">
                      <input type="checkbox" checked>
                      <span class="hq-toggle__slider"></span>
                    </label>
                  </div>
                  <div class="hq-settings__option">
                    <div class="hq-settings__option-info">
                      <strong>SMS Alerts</strong>
                      <span>Get text messages for urgent notifications</span>
                    </div>
                    <label class="hq-toggle">
                      <input type="checkbox">
                      <span class="hq-toggle__slider"></span>
                    </label>
                  </div>
                </div>
                <div class="hq-settings__section">
                  <h4>Privacy</h4>
                  <div class="hq-settings__option">
                    <div class="hq-settings__option-info">
                      <strong>Profile Visibility</strong>
                      <span>Allow other members to see your profile</span>
                    </div>
                    <label class="hq-toggle">
                      <input type="checkbox" checked>
                      <span class="hq-toggle__slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // DASHBOARD WIDGETS (Green Tab)
    // ----------------------------------------
    dashboard: [
      {
        id: 'dashboard-stats',
        category: 'Stats',
        name: 'Dashboard Stats',
        desc: 'Key metrics cards.',
        html: `
          <section class="hq-section hq-dashboard">
            <div class="hq-container">
              <div class="hq-dashboard__stats">
                <div class="hq-dashboard-stat">
                  <div class="hq-dashboard-stat__icon">🚁</div>
                  <div class="hq-dashboard-stat__content">
                    <span class="hq-dashboard-stat__value">24</span>
                    <span class="hq-dashboard-stat__label">Aircraft in Stock</span>
                  </div>
                  <span class="hq-dashboard-stat__trend hq-dashboard-stat__trend--up">+3 this month</span>
                </div>
                <div class="hq-dashboard-stat">
                  <div class="hq-dashboard-stat__icon">📋</div>
                  <div class="hq-dashboard-stat__content">
                    <span class="hq-dashboard-stat__value">18</span>
                    <span class="hq-dashboard-stat__label">Active Enquiries</span>
                  </div>
                  <span class="hq-dashboard-stat__trend hq-dashboard-stat__trend--up">+5 this week</span>
                </div>
                <div class="hq-dashboard-stat">
                  <div class="hq-dashboard-stat__icon">🔧</div>
                  <div class="hq-dashboard-stat__content">
                    <span class="hq-dashboard-stat__value">7</span>
                    <span class="hq-dashboard-stat__label">In Maintenance</span>
                  </div>
                  <span class="hq-dashboard-stat__trend">2 completing today</span>
                </div>
                <div class="hq-dashboard-stat">
                  <div class="hq-dashboard-stat__icon">🎓</div>
                  <div class="hq-dashboard-stat__content">
                    <span class="hq-dashboard-stat__value">12</span>
                    <span class="hq-dashboard-stat__label">Students Training</span>
                  </div>
                  <span class="hq-dashboard-stat__trend hq-dashboard-stat__trend--up">+2 enrolled</span>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'dashboard-activity',
        category: 'Activity',
        name: 'Activity Feed',
        desc: 'Recent activity timeline.',
        html: `
          <section class="hq-section hq-dashboard">
            <div class="hq-container hq-container--narrow">
              <div class="hq-activity-feed">
                <h3 class="hq-activity-feed__title">Recent Activity</h3>
                <div class="hq-activity-feed__list">
                  <div class="hq-activity-item">
                    <div class="hq-activity-item__icon hq-activity-item__icon--sale">💰</div>
                    <div class="hq-activity-item__content">
                      <p><strong>R66 G-HELI</strong> sold to James Mitchell</p>
                      <span class="hq-activity-item__time">2 hours ago</span>
                    </div>
                  </div>
                  <div class="hq-activity-item">
                    <div class="hq-activity-item__icon hq-activity-item__icon--enquiry">📧</div>
                    <div class="hq-activity-item__content">
                      <p>New enquiry from <strong>Sarah Williams</strong> about R44</p>
                      <span class="hq-activity-item__time">4 hours ago</span>
                    </div>
                  </div>
                  <div class="hq-activity-item">
                    <div class="hq-activity-item__icon hq-activity-item__icon--maintenance">🔧</div>
                    <div class="hq-activity-item__content">
                      <p><strong>G-ROBN</strong> completed 100-hour inspection</p>
                      <span class="hq-activity-item__time">Yesterday</span>
                    </div>
                  </div>
                  <div class="hq-activity-item">
                    <div class="hq-activity-item__icon hq-activity-item__icon--training">🎓</div>
                    <div class="hq-activity-item__content">
                      <p><strong>Mark Thompson</strong> passed skills test - PPL(H)</p>
                      <span class="hq-activity-item__time">2 days ago</span>
                    </div>
                  </div>
                </div>
                <a href="#" class="hq-activity-feed__more">View all activity →</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // DATA TABLES (Green Tab)
    // ----------------------------------------
    tables: [
      {
        id: 'table-inventory',
        category: 'Inventory',
        name: 'Inventory Table',
        desc: 'Aircraft inventory listing.',
        html: `
          <section class="hq-section hq-table-section">
            <div class="hq-container">
              <div class="hq-table-wrapper">
                <table class="hq-table">
                  <thead>
                    <tr>
                      <th>Registration</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>G-HELI</strong></td>
                      <td>Robinson R66</td>
                      <td>2023</td>
                      <td>245</td>
                      <td><span class="hq-badge hq-badge--success">Available</span></td>
                      <td>£895,000</td>
                      <td><a href="#" class="hq-btn hq-btn--sm hq-btn--outline">View</a></td>
                    </tr>
                    <tr>
                      <td><strong>G-ROBN</strong></td>
                      <td>Robinson R44 Raven II</td>
                      <td>2021</td>
                      <td>580</td>
                      <td><span class="hq-badge hq-badge--warning">Reserved</span></td>
                      <td>£425,000</td>
                      <td><a href="#" class="hq-btn hq-btn--sm hq-btn--outline">View</a></td>
                    </tr>
                    <tr>
                      <td><strong>G-FLYT</strong></td>
                      <td>Robinson R22 Beta II</td>
                      <td>2020</td>
                      <td>1,200</td>
                      <td><span class="hq-badge hq-badge--success">Available</span></td>
                      <td>£185,000</td>
                      <td><a href="#" class="hq-btn hq-btn--sm hq-btn--outline">View</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>`
      },
      {
        id: 'table-comparison',
        category: 'Comparison',
        name: 'Comparison Table',
        desc: 'Feature comparison grid.',
        html: `
          <section class="hq-section hq-table-section">
            <div class="hq-container">
              <div class="hq-table-wrapper">
                <table class="hq-table hq-table--comparison">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>R22 Beta II</th>
                      <th>R44 Raven II</th>
                      <th class="hq-table--featured">R66 Turbine</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Seats</td>
                      <td>2</td>
                      <td>4</td>
                      <td class="hq-table--featured">5</td>
                    </tr>
                    <tr>
                      <td>Engine</td>
                      <td>Piston</td>
                      <td>Piston</td>
                      <td class="hq-table--featured">Turbine</td>
                    </tr>
                    <tr>
                      <td>Cruise Speed</td>
                      <td>96 kts</td>
                      <td>110 kts</td>
                      <td class="hq-table--featured">110 kts</td>
                    </tr>
                    <tr>
                      <td>Range</td>
                      <td>200 nm</td>
                      <td>300 nm</td>
                      <td class="hq-table--featured">350 nm</td>
                    </tr>
                    <tr>
                      <td>Price From</td>
                      <td>£180,000</td>
                      <td>£400,000</td>
                      <td class="hq-table--featured">£850,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // PROGRESS INDICATORS (Green Tab)
    // ----------------------------------------
    progress: [
      {
        id: 'progress-steps',
        category: 'Steps',
        name: 'Progress Steps',
        desc: 'Multi-step progress indicator.',
        html: `
          <section class="hq-section hq-progress-section">
            <div class="hq-container">
              <div class="hq-progress-steps">
                <div class="hq-progress-step hq-progress-step--complete">
                  <div class="hq-progress-step__marker">✓</div>
                  <div class="hq-progress-step__label">Enquiry</div>
                </div>
                <div class="hq-progress-step hq-progress-step--complete">
                  <div class="hq-progress-step__marker">✓</div>
                  <div class="hq-progress-step__label">Consultation</div>
                </div>
                <div class="hq-progress-step hq-progress-step--active">
                  <div class="hq-progress-step__marker">3</div>
                  <div class="hq-progress-step__label">Selection</div>
                </div>
                <div class="hq-progress-step">
                  <div class="hq-progress-step__marker">4</div>
                  <div class="hq-progress-step__label">Purchase</div>
                </div>
                <div class="hq-progress-step">
                  <div class="hq-progress-step__marker">5</div>
                  <div class="hq-progress-step__label">Delivery</div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'progress-bars',
        category: 'Bars',
        name: 'Progress Bars',
        desc: 'Horizontal progress bars.',
        html: `
          <section class="hq-section hq-progress-section">
            <div class="hq-container hq-container--narrow">
              <div class="hq-progress-bars">
                <div class="hq-progress-bar">
                  <div class="hq-progress-bar__header">
                    <span class="hq-progress-bar__label">Flight Hours Complete</span>
                    <span class="hq-progress-bar__value">32 / 45 hours</span>
                  </div>
                  <div class="hq-progress-bar__track">
                    <div class="hq-progress-bar__fill" style="width: 71%"></div>
                  </div>
                </div>
                <div class="hq-progress-bar">
                  <div class="hq-progress-bar__header">
                    <span class="hq-progress-bar__label">Ground School</span>
                    <span class="hq-progress-bar__value">8 / 9 exams</span>
                  </div>
                  <div class="hq-progress-bar__track">
                    <div class="hq-progress-bar__fill hq-progress-bar__fill--success" style="width: 89%"></div>
                  </div>
                </div>
                <div class="hq-progress-bar">
                  <div class="hq-progress-bar__header">
                    <span class="hq-progress-bar__label">Solo Navigation</span>
                    <span class="hq-progress-bar__value">2 / 5 flights</span>
                  </div>
                  <div class="hq-progress-bar__track">
                    <div class="hq-progress-bar__fill hq-progress-bar__fill--warning" style="width: 40%"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // BADGES & LABELS (Green Tab)
    // ----------------------------------------
    badges: [
      {
        id: 'badges-showcase',
        category: 'Showcase',
        name: 'Badge Showcase',
        desc: 'Various badge styles.',
        html: `
          <section class="hq-section hq-badges-demo">
            <div class="hq-container">
              <div class="hq-badges-grid">
                <div class="hq-badges-group">
                  <h4>Status Badges</h4>
                  <div class="hq-badges-row">
                    <span class="hq-badge hq-badge--success">Available</span>
                    <span class="hq-badge hq-badge--warning">Reserved</span>
                    <span class="hq-badge hq-badge--danger">Sold</span>
                    <span class="hq-badge hq-badge--info">Coming Soon</span>
                  </div>
                </div>
                <div class="hq-badges-group">
                  <h4>Tags</h4>
                  <div class="hq-badges-row">
                    <span class="hq-tag">Turbine</span>
                    <span class="hq-tag">Low Hours</span>
                    <span class="hq-tag">IFR Equipped</span>
                    <span class="hq-tag">New Arrival</span>
                  </div>
                </div>
                <div class="hq-badges-group">
                  <h4>Labels</h4>
                  <div class="hq-badges-row">
                    <span class="hq-label hq-label--primary">Featured</span>
                    <span class="hq-label hq-label--accent">Hot Deal</span>
                    <span class="hq-label hq-label--dark">Exclusive</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'badges-with-icons',
        category: 'With Icons',
        name: 'Icon Badges',
        desc: 'Badges with icons.',
        html: `
          <section class="hq-section hq-badges-demo">
            <div class="hq-container">
              <div class="hq-icon-badges">
                <div class="hq-icon-badge">
                  <span class="hq-icon-badge__icon">✓</span>
                  <span class="hq-icon-badge__text">CAA Approved</span>
                </div>
                <div class="hq-icon-badge">
                  <span class="hq-icon-badge__icon">🏆</span>
                  <span class="hq-icon-badge__text">Authorized Dealer</span>
                </div>
                <div class="hq-icon-badge">
                  <span class="hq-icon-badge__icon">🛡️</span>
                  <span class="hq-icon-badge__text">EASA Part-145</span>
                </div>
                <div class="hq-icon-badge">
                  <span class="hq-icon-badge__icon">⭐</span>
                  <span class="hq-icon-badge__text">5-Star Rated</span>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // COOKIE CONSENT (Green Tab)
    // ----------------------------------------
    cookies: [
      {
        id: 'cookie-banner',
        category: 'Banner',
        name: 'Cookie Banner',
        desc: 'GDPR cookie consent banner.',
        html: `
          <div class="hq-cookie-banner">
            <div class="hq-container">
              <div class="hq-cookie-banner__content">
                <p><strong>🍪 We use cookies</strong> to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/privacy">Learn more</a></p>
              </div>
              <div class="hq-cookie-banner__actions">
                <button class="hq-btn hq-btn--outline hq-btn--sm">Manage</button>
                <button class="hq-btn hq-btn--primary hq-btn--sm">Accept All</button>
              </div>
            </div>
          </div>`
      },
      {
        id: 'cookie-modal',
        category: 'Modal',
        name: 'Cookie Preferences',
        desc: 'Cookie settings modal.',
        html: `
          <div class="hq-modal-demo">
            <div class="hq-modal hq-modal--cookies">
              <div class="hq-modal__header">
                <h3>Cookie Preferences</h3>
                <button class="hq-modal__close">&times;</button>
              </div>
              <div class="hq-modal__content">
                <div class="hq-cookie-option">
                  <div class="hq-cookie-option__info">
                    <strong>Essential Cookies</strong>
                    <p>Required for the website to function properly.</p>
                  </div>
                  <span class="hq-badge hq-badge--info">Always On</span>
                </div>
                <div class="hq-cookie-option">
                  <div class="hq-cookie-option__info">
                    <strong>Analytics Cookies</strong>
                    <p>Help us understand how visitors use our website.</p>
                  </div>
                  <label class="hq-toggle">
                    <input type="checkbox" checked>
                    <span class="hq-toggle__slider"></span>
                  </label>
                </div>
                <div class="hq-cookie-option">
                  <div class="hq-cookie-option__info">
                    <strong>Marketing Cookies</strong>
                    <p>Used to deliver personalized advertisements.</p>
                  </div>
                  <label class="hq-toggle">
                    <input type="checkbox">
                    <span class="hq-toggle__slider"></span>
                  </label>
                </div>
              </div>
              <div class="hq-modal__footer">
                <button class="hq-btn hq-btn--outline">Reject All</button>
                <button class="hq-btn hq-btn--primary">Save Preferences</button>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // BACK TO TOP (Green Tab)
    // ----------------------------------------
    backToTop: [
      {
        id: 'back-to-top-simple',
        category: 'Simple',
        name: 'Simple Back to Top',
        desc: 'Basic scroll to top button.',
        html: `
          <button class="hq-back-to-top" aria-label="Back to top">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>`
      },
      {
        id: 'back-to-top-progress',
        category: 'Progress',
        name: 'Progress Back to Top',
        desc: 'With scroll progress indicator.',
        html: `
          <button class="hq-back-to-top hq-back-to-top--progress" aria-label="Back to top">
            <svg class="hq-back-to-top__progress" viewBox="0 0 100 100">
              <circle class="hq-back-to-top__track" cx="50" cy="50" r="45"/>
              <circle class="hq-back-to-top__bar" cx="50" cy="50" r="45" style="stroke-dashoffset: 100"/>
            </svg>
            <span class="hq-back-to-top__icon">↑</span>
          </button>`
      }
    ],

    // ----------------------------------------
    // SOCIAL SHARE (Green Tab)
    // ----------------------------------------
    socialShare: [
      {
        id: 'social-share-bar',
        category: 'Bar',
        name: 'Share Bar',
        desc: 'Horizontal social share buttons.',
        html: `
          <div class="hq-share-bar">
            <span class="hq-share-bar__label">Share:</span>
            <div class="hq-share-bar__buttons">
              <a href="#" class="hq-share-btn hq-share-btn--facebook" aria-label="Share on Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" class="hq-share-btn hq-share-btn--twitter" aria-label="Share on Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" class="hq-share-btn hq-share-btn--linkedin" aria-label="Share on LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" class="hq-share-btn hq-share-btn--email" aria-label="Share via Email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
              <button class="hq-share-btn hq-share-btn--copy" aria-label="Copy link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>`
      },
      {
        id: 'social-share-floating',
        category: 'Floating',
        name: 'Floating Share',
        desc: 'Vertical floating share buttons.',
        html: `
          <div class="hq-share-floating">
            <a href="#" class="hq-share-btn hq-share-btn--facebook" aria-label="Share on Facebook">f</a>
            <a href="#" class="hq-share-btn hq-share-btn--twitter" aria-label="Share on Twitter">𝕏</a>
            <a href="#" class="hq-share-btn hq-share-btn--linkedin" aria-label="Share on LinkedIn">in</a>
            <a href="#" class="hq-share-btn hq-share-btn--whatsapp" aria-label="Share on WhatsApp">💬</a>
          </div>`
      }
    ],

    // ========================================
    // PURPLE TAB SET - Premium UI Components
    // ========================================

    // ----------------------------------------
    // MEGA MENUS (Purple Tab)
    // ----------------------------------------
    megaMenus: [
      {
        id: 'mega-menu-aircraft',
        category: 'Navigation',
        name: 'Aircraft Mega Menu',
        desc: 'Rich dropdown with categories and featured aircraft.',
        html: `
          <div class="hq-mega-demo">
            <nav class="hq-mega-nav">
              <a href="#" class="hq-mega-trigger">
                Aircraft <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4"/></svg>
              </a>
              <div class="hq-mega-dropdown hq-mega-dropdown--aircraft">
                <div class="hq-mega-grid">
                  <div class="hq-mega-column">
                    <h4 class="hq-mega-heading">Fixed Wing</h4>
                    <ul class="hq-mega-list">
                      <li><a href="#">Single Engine Piston</a></li>
                      <li><a href="#">Multi Engine Piston</a></li>
                      <li><a href="#">Turboprops</a></li>
                      <li><a href="#">Light Jets</a></li>
                      <li><a href="#">Midsize Jets</a></li>
                    </ul>
                  </div>
                  <div class="hq-mega-column">
                    <h4 class="hq-mega-heading">Rotorcraft</h4>
                    <ul class="hq-mega-list">
                      <li><a href="#">Piston Helicopters</a></li>
                      <li><a href="#">Turbine Helicopters</a></li>
                      <li><a href="#">Light Twins</a></li>
                      <li><a href="#">Medium Twins</a></li>
                    </ul>
                  </div>
                  <div class="hq-mega-column">
                    <h4 class="hq-mega-heading">By Mission</h4>
                    <ul class="hq-mega-list">
                      <li><a href="#">Training Aircraft</a></li>
                      <li><a href="#">Charter & Travel</a></li>
                      <li><a href="#">Cargo & Utility</a></li>
                      <li><a href="#">Survey & Patrol</a></li>
                    </ul>
                  </div>
                  <div class="hq-mega-featured">
                    <span class="hq-mega-badge">Featured</span>
                    <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop" alt="Featured Aircraft">
                    <h5>2024 Robinson R66</h5>
                    <p>Turbine helicopter, 200 hours TT</p>
                    <a href="#" class="hq-btn hq-btn--sm hq-btn--primary">View Details</a>
                  </div>
                </div>
                <div class="hq-mega-footer">
                  <a href="#">View All Aircraft →</a>
                  <span>83 aircraft currently available</span>
                </div>
              </div>
            </nav>
          </div>`
      },
      {
        id: 'mega-menu-services',
        category: 'Navigation',
        name: 'Services Mega Menu',
        desc: 'Icon-based service navigation with descriptions.',
        html: `
          <div class="hq-mega-demo">
            <nav class="hq-mega-nav">
              <a href="#" class="hq-mega-trigger">
                Services <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4"/></svg>
              </a>
              <div class="hq-mega-dropdown hq-mega-dropdown--services">
                <div class="hq-mega-services">
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">🛒</div>
                    <div class="hq-mega-service__content">
                      <h5>Aircraft Sales</h5>
                      <p>Buy & sell pre-owned aircraft with expert guidance</p>
                    </div>
                  </a>
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">🎓</div>
                    <div class="hq-mega-service__content">
                      <h5>Flight Training</h5>
                      <p>PPL, CPL, IR, and type ratings with experienced instructors</p>
                    </div>
                  </a>
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">🔧</div>
                    <div class="hq-mega-service__content">
                      <h5>Maintenance</h5>
                      <p>CAA approved facility for inspections and repairs</p>
                    </div>
                  </a>
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">📦</div>
                    <div class="hq-mega-service__content">
                      <h5>Parts & Accessories</h5>
                      <p>OEM parts, avionics, and pilot supplies</p>
                    </div>
                  </a>
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">✈️</div>
                    <div class="hq-mega-service__content">
                      <h5>Charter Flights</h5>
                      <p>Executive transport and scenic tours</p>
                    </div>
                  </a>
                  <a href="#" class="hq-mega-service">
                    <div class="hq-mega-service__icon">💰</div>
                    <div class="hq-mega-service__content">
                      <h5>Financing</h5>
                      <p>Flexible financing options for aircraft purchase</p>
                    </div>
                  </a>
                </div>
              </div>
            </nav>
          </div>`
      }
    ],

    // ----------------------------------------
    // COMMAND PALETTE (Purple Tab)
    // ----------------------------------------
    commandPalette: [
      {
        id: 'command-palette-full',
        category: 'Search',
        name: 'Command Palette',
        desc: 'Modern cmd+k style search interface.',
        html: `
          <div class="hq-command-demo">
            <div class="hq-command-overlay">
              <div class="hq-command">
                <div class="hq-command__search">
                  <svg class="hq-command__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input type="text" class="hq-command__input" placeholder="Search aircraft, services, or type a command..." value="Robinson R">
                  <kbd class="hq-command__kbd">ESC</kbd>
                </div>
                <div class="hq-command__results">
                  <div class="hq-command__group">
                    <div class="hq-command__label">Aircraft</div>
                    <a href="#" class="hq-command__item hq-command__item--active">
                      <span class="hq-command__item-icon">🚁</span>
                      <div class="hq-command__item-content">
                        <span class="hq-command__item-title"><mark>Robinson R</mark>44 Raven II</span>
                        <span class="hq-command__item-meta">2019 · 850 TT · £340,000</span>
                      </div>
                      <span class="hq-command__item-action">↵</span>
                    </a>
                    <a href="#" class="hq-command__item">
                      <span class="hq-command__item-icon">🚁</span>
                      <div class="hq-command__item-content">
                        <span class="hq-command__item-title"><mark>Robinson R</mark>66 Turbine</span>
                        <span class="hq-command__item-meta">2022 · 200 TT · £890,000</span>
                      </div>
                      <span class="hq-command__item-action">↵</span>
                    </a>
                    <a href="#" class="hq-command__item">
                      <span class="hq-command__item-icon">🚁</span>
                      <div class="hq-command__item-content">
                        <span class="hq-command__item-title"><mark>Robinson R</mark>22 Beta II</span>
                        <span class="hq-command__item-meta">2015 · 2,100 TT · £185,000</span>
                      </div>
                      <span class="hq-command__item-action">↵</span>
                    </a>
                  </div>
                  <div class="hq-command__group">
                    <div class="hq-command__label">Quick Actions</div>
                    <a href="#" class="hq-command__item">
                      <span class="hq-command__item-icon">📞</span>
                      <div class="hq-command__item-content">
                        <span class="hq-command__item-title">Request a callback</span>
                      </div>
                      <kbd>C</kbd>
                    </a>
                    <a href="#" class="hq-command__item">
                      <span class="hq-command__item-icon">📋</span>
                      <div class="hq-command__item-content">
                        <span class="hq-command__item-title">Get a valuation</span>
                      </div>
                      <kbd>V</kbd>
                    </a>
                  </div>
                </div>
                <div class="hq-command__footer">
                  <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                  <span><kbd>↵</kbd> Select</span>
                  <span><kbd>ESC</kbd> Close</span>
                </div>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // BOOKING INTERFACES (Purple Tab)
    // ----------------------------------------
    booking: [
      {
        id: 'booking-calendar',
        category: 'Scheduling',
        name: 'Appointment Calendar',
        desc: 'Date and time slot booking interface.',
        html: `
          <section class="hq-section hq-booking-section">
            <div class="hq-container">
              <div class="hq-booking">
                <div class="hq-booking__header">
                  <h2>Book a Viewing</h2>
                  <p>Select a date and time that works for you</p>
                </div>
                <div class="hq-booking__content">
                  <div class="hq-booking__calendar">
                    <div class="hq-calendar">
                      <div class="hq-calendar__header">
                        <button class="hq-calendar__nav">←</button>
                        <span class="hq-calendar__month">February 2026</span>
                        <button class="hq-calendar__nav">→</button>
                      </div>
                      <div class="hq-calendar__weekdays">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                      <div class="hq-calendar__days">
                        <span class="hq-calendar__day hq-calendar__day--other">27</span>
                        <span class="hq-calendar__day hq-calendar__day--other">28</span>
                        <span class="hq-calendar__day hq-calendar__day--other">29</span>
                        <span class="hq-calendar__day hq-calendar__day--other">30</span>
                        <span class="hq-calendar__day hq-calendar__day--other">31</span>
                        <span class="hq-calendar__day">1</span>
                        <span class="hq-calendar__day">2</span>
                        <span class="hq-calendar__day">3</span>
                        <span class="hq-calendar__day">4</span>
                        <span class="hq-calendar__day">5</span>
                        <span class="hq-calendar__day">6</span>
                        <span class="hq-calendar__day">7</span>
                        <span class="hq-calendar__day hq-calendar__day--disabled">8</span>
                        <span class="hq-calendar__day hq-calendar__day--today">9</span>
                        <span class="hq-calendar__day hq-calendar__day--selected">10</span>
                        <span class="hq-calendar__day">11</span>
                        <span class="hq-calendar__day">12</span>
                        <span class="hq-calendar__day">13</span>
                        <span class="hq-calendar__day">14</span>
                        <span class="hq-calendar__day">15</span>
                        <span class="hq-calendar__day">16</span>
                        <span class="hq-calendar__day">17</span>
                        <span class="hq-calendar__day">18</span>
                        <span class="hq-calendar__day">19</span>
                        <span class="hq-calendar__day">20</span>
                        <span class="hq-calendar__day">21</span>
                        <span class="hq-calendar__day">22</span>
                        <span class="hq-calendar__day">23</span>
                        <span class="hq-calendar__day">24</span>
                        <span class="hq-calendar__day">25</span>
                        <span class="hq-calendar__day">26</span>
                        <span class="hq-calendar__day">27</span>
                        <span class="hq-calendar__day">28</span>
                      </div>
                    </div>
                  </div>
                  <div class="hq-booking__slots">
                    <h4>Available Times - Feb 10</h4>
                    <div class="hq-time-slots">
                      <button class="hq-time-slot">9:00 AM</button>
                      <button class="hq-time-slot">9:30 AM</button>
                      <button class="hq-time-slot hq-time-slot--selected">10:00 AM</button>
                      <button class="hq-time-slot">10:30 AM</button>
                      <button class="hq-time-slot hq-time-slot--disabled">11:00 AM</button>
                      <button class="hq-time-slot">11:30 AM</button>
                      <button class="hq-time-slot">2:00 PM</button>
                      <button class="hq-time-slot">2:30 PM</button>
                      <button class="hq-time-slot">3:00 PM</button>
                      <button class="hq-time-slot">3:30 PM</button>
                    </div>
                    <div class="hq-booking__selected">
                      <strong>Selected:</strong> Tuesday, Feb 10 at 10:00 AM
                    </div>
                    <button class="hq-btn hq-btn--primary hq-btn--full">Confirm Booking</button>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'booking-trial-flight',
        category: 'Scheduling',
        name: 'Trial Flight Booking',
        desc: 'Complete booking flow with aircraft selection.',
        html: `
          <section class="hq-section hq-booking-section">
            <div class="hq-container">
              <div class="hq-trial-booking">
                <div class="hq-trial-booking__header">
                  <h2>Book Your Trial Flight</h2>
                  <p>Experience the thrill of flying with a 30-minute introductory lesson</p>
                </div>
                <div class="hq-trial-booking__steps">
                  <div class="hq-step-indicator">
                    <div class="hq-step-indicator__step hq-step-indicator__step--completed">
                      <span class="hq-step-indicator__number">✓</span>
                      <span class="hq-step-indicator__label">Aircraft</span>
                    </div>
                    <div class="hq-step-indicator__line hq-step-indicator__line--completed"></div>
                    <div class="hq-step-indicator__step hq-step-indicator__step--active">
                      <span class="hq-step-indicator__number">2</span>
                      <span class="hq-step-indicator__label">Details</span>
                    </div>
                    <div class="hq-step-indicator__line"></div>
                    <div class="hq-step-indicator__step">
                      <span class="hq-step-indicator__number">3</span>
                      <span class="hq-step-indicator__label">Payment</span>
                    </div>
                  </div>
                </div>
                <div class="hq-trial-booking__content">
                  <div class="hq-trial-booking__form">
                    <div class="hq-form-section">
                      <h4>Your Details</h4>
                      <div class="hq-form__row hq-form__row--2">
                        <div class="hq-form-group">
                          <label class="hq-label">First Name</label>
                          <input type="text" class="hq-input" placeholder="John">
                        </div>
                        <div class="hq-form-group">
                          <label class="hq-label">Last Name</label>
                          <input type="text" class="hq-input" placeholder="Smith">
                        </div>
                      </div>
                      <div class="hq-form-group">
                        <label class="hq-label">Email Address</label>
                        <input type="email" class="hq-input" placeholder="john@example.com">
                      </div>
                      <div class="hq-form-group">
                        <label class="hq-label">Phone Number</label>
                        <input type="tel" class="hq-input" placeholder="+44 7700 900000">
                      </div>
                    </div>
                    <div class="hq-form-section">
                      <h4>Flight Preferences</h4>
                      <div class="hq-form-group">
                        <label class="hq-label">Preferred Date</label>
                        <input type="date" class="hq-input">
                      </div>
                      <div class="hq-form-group">
                        <label class="hq-label">Preferred Time</label>
                        <select class="hq-select">
                          <option>Morning (9am - 12pm)</option>
                          <option>Afternoon (12pm - 5pm)</option>
                          <option>No preference</option>
                        </select>
                      </div>
                      <div class="hq-form-group">
                        <label class="hq-label">Special Requirements</label>
                        <textarea class="hq-textarea" rows="3" placeholder="Any medical conditions, mobility requirements, or special requests..."></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="hq-trial-booking__summary">
                    <div class="hq-booking-summary">
                      <h4>Booking Summary</h4>
                      <div class="hq-booking-summary__aircraft">
                        <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=120&h=80&fit=crop" alt="R44">
                        <div>
                          <strong>Robinson R44</strong>
                          <span>30-minute trial flight</span>
                        </div>
                      </div>
                      <div class="hq-booking-summary__details">
                        <div class="hq-booking-summary__row">
                          <span>Trial Flight (30 min)</span>
                          <span>£199</span>
                        </div>
                        <div class="hq-booking-summary__row">
                          <span>HD Video Recording</span>
                          <span>£49</span>
                        </div>
                        <div class="hq-booking-summary__row hq-booking-summary__row--total">
                          <span>Total</span>
                          <span>£248</span>
                        </div>
                      </div>
                      <div class="hq-booking-summary__actions">
                        <button class="hq-btn hq-btn--outline">← Back</button>
                        <button class="hq-btn hq-btn--primary">Continue to Payment →</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // CONFIGURATORS (Purple Tab)
    // ----------------------------------------
    configurators: [
      {
        id: 'config-aircraft-options',
        category: 'Product',
        name: 'Aircraft Options Configurator',
        desc: 'Interactive option selector with live pricing.',
        html: `
          <section class="hq-section hq-config-section">
            <div class="hq-container">
              <div class="hq-configurator">
                <div class="hq-configurator__header">
                  <h2>Configure Your R66</h2>
                  <p>Customize your aircraft with available options</p>
                </div>
                <div class="hq-configurator__content">
                  <div class="hq-configurator__options">
                    <div class="hq-config-group">
                      <h4 class="hq-config-group__title">Exterior Color</h4>
                      <div class="hq-color-picker">
                        <button class="hq-color-swatch hq-color-swatch--selected" style="background: #1a1a1a" title="Jet Black"></button>
                        <button class="hq-color-swatch" style="background: #fff" title="Pearl White"></button>
                        <button class="hq-color-swatch" style="background: #c41e3a" title="Racing Red"></button>
                        <button class="hq-color-swatch" style="background: #003087" title="Navy Blue"></button>
                        <button class="hq-color-swatch" style="background: #2d5a27" title="Forest Green"></button>
                        <button class="hq-color-swatch hq-color-swatch--custom" title="Custom Color">+</button>
                      </div>
                      <span class="hq-config-group__selected">Selected: Jet Black</span>
                    </div>

                    <div class="hq-config-group">
                      <h4 class="hq-config-group__title">Avionics Package</h4>
                      <div class="hq-config-options">
                        <label class="hq-config-option">
                          <input type="radio" name="avionics" checked>
                          <div class="hq-config-option__content">
                            <div class="hq-config-option__info">
                              <strong>Standard IFR</strong>
                              <span>Garmin G500H TXi, GTN 650Xi, GFC 600H autopilot</span>
                            </div>
                            <span class="hq-config-option__price">Included</span>
                          </div>
                        </label>
                        <label class="hq-config-option">
                          <input type="radio" name="avionics">
                          <div class="hq-config-option__content">
                            <div class="hq-config-option__info">
                              <strong>Enhanced IFR</strong>
                              <span>Dual GTN 750Xi, radar altimeter, TCAS</span>
                            </div>
                            <span class="hq-config-option__price">+ £42,000</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div class="hq-config-group">
                      <h4 class="hq-config-group__title">Additional Equipment</h4>
                      <div class="hq-config-options">
                        <label class="hq-config-checkbox">
                          <input type="checkbox" checked>
                          <div class="hq-config-checkbox__content">
                            <strong>Air Conditioning</strong>
                            <span class="hq-config-checkbox__price">+ £18,500</span>
                          </div>
                        </label>
                        <label class="hq-config-checkbox">
                          <input type="checkbox" checked>
                          <div class="hq-config-checkbox__content">
                            <strong>Leather Interior</strong>
                            <span class="hq-config-checkbox__price">+ £12,000</span>
                          </div>
                        </label>
                        <label class="hq-config-checkbox">
                          <input type="checkbox">
                          <div class="hq-config-checkbox__content">
                            <strong>External Cargo Hook</strong>
                            <span class="hq-config-checkbox__price">+ £8,500</span>
                          </div>
                        </label>
                        <label class="hq-config-checkbox">
                          <input type="checkbox">
                          <div class="hq-config-checkbox__content">
                            <strong>Pop-Out Floats</strong>
                            <span class="hq-config-checkbox__price">+ £32,000</span>
                          </div>
                        </label>
                        <label class="hq-config-checkbox">
                          <input type="checkbox">
                          <div class="hq-config-checkbox__content">
                            <strong>Wire Strike Protection</strong>
                            <span class="hq-config-checkbox__price">+ £15,000</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="hq-configurator__preview">
                    <div class="hq-config-preview">
                      <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop" alt="R66 Configuration">
                      <div class="hq-config-preview__badge">Your Configuration</div>
                    </div>
                    <div class="hq-config-total">
                      <div class="hq-config-total__row">
                        <span>Base Price</span>
                        <span>£890,000</span>
                      </div>
                      <div class="hq-config-total__row">
                        <span>Selected Options</span>
                        <span>£30,500</span>
                      </div>
                      <div class="hq-config-total__row hq-config-total__row--total">
                        <span>Total Price</span>
                        <span>£920,500</span>
                      </div>
                      <p class="hq-config-total__note">*Prices exclude VAT and delivery</p>
                      <div class="hq-config-total__actions">
                        <button class="hq-btn hq-btn--outline">Save Configuration</button>
                        <button class="hq-btn hq-btn--primary">Request Quote</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // LIGHTBOX GALLERY (Purple Tab)
    // ----------------------------------------
    lightbox: [
      {
        id: 'lightbox-aircraft',
        category: 'Gallery',
        name: 'Aircraft Lightbox Gallery',
        desc: 'Full-screen image viewer with thumbnails.',
        html: `
          <div class="hq-lightbox-demo">
            <div class="hq-lightbox">
              <button class="hq-lightbox__close">&times;</button>
              <button class="hq-lightbox__nav hq-lightbox__nav--prev">‹</button>
              <button class="hq-lightbox__nav hq-lightbox__nav--next">›</button>

              <div class="hq-lightbox__main">
                <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=800&fit=crop" alt="Aircraft">
              </div>

              <div class="hq-lightbox__info">
                <div class="hq-lightbox__details">
                  <h3>Robinson R66 Turbine</h3>
                  <p>2022 · 200 TT · Immaculate Condition</p>
                </div>
                <div class="hq-lightbox__counter">3 / 12</div>
              </div>

              <div class="hq-lightbox__thumbnails">
                <button class="hq-lightbox__thumb">
                  <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=100&h=70&fit=crop" alt="">
                </button>
                <button class="hq-lightbox__thumb">
                  <img src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=100&h=70&fit=crop" alt="">
                </button>
                <button class="hq-lightbox__thumb hq-lightbox__thumb--active">
                  <img src="https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=100&h=70&fit=crop" alt="">
                </button>
                <button class="hq-lightbox__thumb">
                  <img src="https://images.unsplash.com/photo-1559083991-098b5c7a3c22?w=100&h=70&fit=crop" alt="">
                </button>
                <button class="hq-lightbox__thumb">
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=70&fit=crop" alt="">
                </button>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // FILTER PANELS (Purple Tab)
    // ----------------------------------------
    filterPanels: [
      {
        id: 'filter-sidebar',
        category: 'Filtering',
        name: 'Advanced Filter Sidebar',
        desc: 'Comprehensive filtering with range sliders.',
        html: `
          <div class="hq-filter-demo">
            <aside class="hq-filter-sidebar">
              <div class="hq-filter-sidebar__header">
                <h3>Filters</h3>
                <button class="hq-filter-sidebar__clear">Clear All</button>
              </div>

              <div class="hq-filter-section">
                <button class="hq-filter-section__toggle">
                  <span>Aircraft Type</span>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="hq-filter-section__content">
                  <label class="hq-filter-checkbox">
                    <input type="checkbox" checked>
                    <span>Helicopters</span>
                    <span class="hq-filter-checkbox__count">24</span>
                  </label>
                  <label class="hq-filter-checkbox">
                    <input type="checkbox">
                    <span>Single Engine</span>
                    <span class="hq-filter-checkbox__count">31</span>
                  </label>
                  <label class="hq-filter-checkbox">
                    <input type="checkbox">
                    <span>Multi Engine</span>
                    <span class="hq-filter-checkbox__count">12</span>
                  </label>
                  <label class="hq-filter-checkbox">
                    <input type="checkbox">
                    <span>Turboprops</span>
                    <span class="hq-filter-checkbox__count">8</span>
                  </label>
                  <label class="hq-filter-checkbox">
                    <input type="checkbox">
                    <span>Jets</span>
                    <span class="hq-filter-checkbox__count">5</span>
                  </label>
                </div>
              </div>

              <div class="hq-filter-section">
                <button class="hq-filter-section__toggle">
                  <span>Price Range</span>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="hq-filter-section__content">
                  <div class="hq-range-slider">
                    <div class="hq-range-slider__track">
                      <div class="hq-range-slider__fill" style="left: 10%; right: 30%"></div>
                      <div class="hq-range-slider__thumb" style="left: 10%"></div>
                      <div class="hq-range-slider__thumb" style="left: 70%"></div>
                    </div>
                    <div class="hq-range-slider__values">
                      <span>£100k</span>
                      <span>£700k</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="hq-filter-section">
                <button class="hq-filter-section__toggle">
                  <span>Year</span>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="hq-filter-section__content">
                  <div class="hq-filter-row">
                    <input type="number" class="hq-input hq-input--sm" placeholder="From" value="2015">
                    <span>to</span>
                    <input type="number" class="hq-input hq-input--sm" placeholder="To" value="2024">
                  </div>
                </div>
              </div>

              <div class="hq-filter-section">
                <button class="hq-filter-section__toggle">
                  <span>Total Time</span>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="hq-filter-section__content">
                  <div class="hq-range-slider">
                    <div class="hq-range-slider__track">
                      <div class="hq-range-slider__fill" style="left: 0%; right: 50%"></div>
                      <div class="hq-range-slider__thumb" style="left: 0%"></div>
                      <div class="hq-range-slider__thumb" style="left: 50%"></div>
                    </div>
                    <div class="hq-range-slider__values">
                      <span>0 hrs</span>
                      <span>2,500 hrs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="hq-filter-section">
                <button class="hq-filter-section__toggle">
                  <span>Manufacturer</span>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="hq-filter-section__content">
                  <input type="text" class="hq-input hq-input--sm" placeholder="Search manufacturers...">
                  <div class="hq-filter-tags">
                    <span class="hq-filter-tag">Robinson <button>&times;</button></span>
                    <span class="hq-filter-tag">Airbus <button>&times;</button></span>
                  </div>
                </div>
              </div>

              <button class="hq-btn hq-btn--primary hq-btn--full">
                Show 24 Results
              </button>
            </aside>
          </div>`
      }
    ],

    // ----------------------------------------
    // CHAT WIDGETS (Purple Tab)
    // ----------------------------------------
    chatWidgets: [
      {
        id: 'chat-widget-modern',
        category: 'Support',
        name: 'Live Chat Widget',
        desc: 'Modern chat interface with typing indicator.',
        html: `
          <div class="hq-chat-demo">
            <div class="hq-chat-widget">
              <div class="hq-chat-widget__header">
                <div class="hq-chat-widget__avatar">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="Sarah">
                  <span class="hq-chat-widget__status"></span>
                </div>
                <div class="hq-chat-widget__info">
                  <strong>Sarah Mitchell</strong>
                  <span>Sales Advisor · Online</span>
                </div>
                <button class="hq-chat-widget__minimize">−</button>
              </div>

              <div class="hq-chat-widget__messages">
                <div class="hq-chat-message hq-chat-message--agent">
                  <div class="hq-chat-message__content">
                    <p>Hello! Welcome to HQ Aviation. How can I help you today?</p>
                  </div>
                  <span class="hq-chat-message__time">10:23 AM</span>
                </div>

                <div class="hq-chat-message hq-chat-message--user">
                  <div class="hq-chat-message__content">
                    <p>Hi, I'm interested in the R66 you have listed. Is it still available?</p>
                  </div>
                  <span class="hq-chat-message__time">10:24 AM</span>
                </div>

                <div class="hq-chat-message hq-chat-message--agent">
                  <div class="hq-chat-message__content">
                    <p>Yes, the 2022 R66 is still available! It's in excellent condition with only 200 hours. Would you like to schedule a viewing?</p>
                  </div>
                  <span class="hq-chat-message__time">10:25 AM</span>
                </div>

                <div class="hq-chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>

              <div class="hq-chat-widget__input">
                <input type="text" placeholder="Type your message...">
                <button class="hq-chat-widget__attach">📎</button>
                <button class="hq-chat-widget__send">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                </button>
              </div>
            </div>

            <button class="hq-chat-trigger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              <span class="hq-chat-trigger__badge">1</span>
            </button>
          </div>`
      }
    ],

    // ----------------------------------------
    // NOTIFICATION CENTERS (Purple Tab)
    // ----------------------------------------
    notifications: [
      {
        id: 'notification-dropdown',
        category: 'UI',
        name: 'Notification Dropdown',
        desc: 'Bell icon with notification list.',
        html: `
          <div class="hq-notif-demo">
            <div class="hq-notif-container">
              <button class="hq-notif-trigger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span class="hq-notif-badge">3</span>
              </button>

              <div class="hq-notif-dropdown">
                <div class="hq-notif-dropdown__header">
                  <h4>Notifications</h4>
                  <button>Mark all read</button>
                </div>

                <div class="hq-notif-dropdown__list">
                  <a href="#" class="hq-notif-item hq-notif-item--unread">
                    <div class="hq-notif-item__icon hq-notif-item__icon--success">✓</div>
                    <div class="hq-notif-item__content">
                      <p><strong>Viewing confirmed</strong> for Robinson R44 on Feb 12 at 10:00 AM</p>
                      <span class="hq-notif-item__time">2 hours ago</span>
                    </div>
                  </a>

                  <a href="#" class="hq-notif-item hq-notif-item--unread">
                    <div class="hq-notif-item__icon hq-notif-item__icon--info">📋</div>
                    <div class="hq-notif-item__content">
                      <p><strong>New aircraft listed</strong> matching your saved search: Airbus H125</p>
                      <span class="hq-notif-item__time">5 hours ago</span>
                    </div>
                  </a>

                  <a href="#" class="hq-notif-item hq-notif-item--unread">
                    <div class="hq-notif-item__icon hq-notif-item__icon--price">💰</div>
                    <div class="hq-notif-item__content">
                      <p><strong>Price reduced</strong> on Bell 206B you're watching: now £285,000</p>
                      <span class="hq-notif-item__time">1 day ago</span>
                    </div>
                  </a>

                  <a href="#" class="hq-notif-item">
                    <div class="hq-notif-item__icon">📧</div>
                    <div class="hq-notif-item__content">
                      <p>Sarah Mitchell replied to your enquiry about the R66</p>
                      <span class="hq-notif-item__time">2 days ago</span>
                    </div>
                  </a>
                </div>

                <div class="hq-notif-dropdown__footer">
                  <a href="#">View all notifications</a>
                </div>
              </div>
            </div>
          </div>`
      }
    ],

    // ----------------------------------------
    // BREADCRUMBS (Purple Tab)
    // ----------------------------------------
    breadcrumbs: [
      {
        id: 'breadcrumb-standard',
        category: 'Navigation',
        name: 'Standard Breadcrumbs',
        desc: 'Simple navigation trail.',
        html: `
          <div class="hq-breadcrumb-demo">
            <nav class="hq-breadcrumb" aria-label="Breadcrumb">
              <ol class="hq-breadcrumb__list">
                <li class="hq-breadcrumb__item">
                  <a href="#" class="hq-breadcrumb__link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    Home
                  </a>
                </li>
                <li class="hq-breadcrumb__separator">/</li>
                <li class="hq-breadcrumb__item">
                  <a href="#" class="hq-breadcrumb__link">Aircraft</a>
                </li>
                <li class="hq-breadcrumb__separator">/</li>
                <li class="hq-breadcrumb__item">
                  <a href="#" class="hq-breadcrumb__link">Helicopters</a>
                </li>
                <li class="hq-breadcrumb__separator">/</li>
                <li class="hq-breadcrumb__item hq-breadcrumb__item--current">
                  <span>Robinson R66</span>
                </li>
              </ol>
            </nav>
          </div>`
      },
      {
        id: 'breadcrumb-with-dropdown',
        category: 'Navigation',
        name: 'Breadcrumbs with Dropdown',
        desc: 'Collapsible breadcrumb for deep navigation.',
        html: `
          <div class="hq-breadcrumb-demo">
            <nav class="hq-breadcrumb hq-breadcrumb--dropdown" aria-label="Breadcrumb">
              <ol class="hq-breadcrumb__list">
                <li class="hq-breadcrumb__item">
                  <a href="#" class="hq-breadcrumb__link">Home</a>
                </li>
                <li class="hq-breadcrumb__separator">›</li>
                <li class="hq-breadcrumb__item hq-breadcrumb__item--collapsed">
                  <button class="hq-breadcrumb__more">
                    •••
                    <div class="hq-breadcrumb__dropdown">
                      <a href="#">Aircraft</a>
                      <a href="#">Helicopters</a>
                      <a href="#">Turbine</a>
                    </div>
                  </button>
                </li>
                <li class="hq-breadcrumb__separator">›</li>
                <li class="hq-breadcrumb__item">
                  <a href="#" class="hq-breadcrumb__link">Robinson</a>
                </li>
                <li class="hq-breadcrumb__separator">›</li>
                <li class="hq-breadcrumb__item hq-breadcrumb__item--current">
                  <span>R66 Turbine - G-HQAV</span>
                </li>
              </ol>
            </nav>
          </div>`
      }
    ],

    // ----------------------------------------
    // DATA CARDS (Purple Tab)
    // ----------------------------------------
    dataCards: [
      {
        id: 'data-card-aircraft',
        category: 'Cards',
        name: 'Aircraft Data Card',
        desc: 'Rich information card with specs and actions.',
        html: `
          <div class="hq-data-card-demo">
            <article class="hq-data-card">
              <div class="hq-data-card__media">
                <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=280&fit=crop" alt="R66">
                <div class="hq-data-card__badges">
                  <span class="hq-badge hq-badge--success">Available</span>
                  <span class="hq-badge hq-badge--info">Featured</span>
                </div>
                <button class="hq-data-card__favorite" aria-label="Add to favorites">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>

              <div class="hq-data-card__content">
                <div class="hq-data-card__header">
                  <div>
                    <h3 class="hq-data-card__title">Robinson R66 Turbine</h3>
                    <p class="hq-data-card__subtitle">2022 · Registration: G-HQAV</p>
                  </div>
                  <div class="hq-data-card__price">
                    <span class="hq-data-card__price-value">£890,000</span>
                    <span class="hq-data-card__price-note">+ VAT</span>
                  </div>
                </div>

                <div class="hq-data-card__specs">
                  <div class="hq-data-card__spec">
                    <span class="hq-data-card__spec-label">Total Time</span>
                    <span class="hq-data-card__spec-value">200 hrs</span>
                  </div>
                  <div class="hq-data-card__spec">
                    <span class="hq-data-card__spec-label">Engine</span>
                    <span class="hq-data-card__spec-value">RR 300</span>
                  </div>
                  <div class="hq-data-card__spec">
                    <span class="hq-data-card__spec-label">Seats</span>
                    <span class="hq-data-card__spec-value">4+1</span>
                  </div>
                  <div class="hq-data-card__spec">
                    <span class="hq-data-card__spec-label">Location</span>
                    <span class="hq-data-card__spec-value">UK</span>
                  </div>
                </div>

                <p class="hq-data-card__description">
                  Immaculate condition with full IFR avionics package. Garmin G500H TXi, GTN 650Xi, air conditioning, leather interior. No damage history.
                </p>

                <div class="hq-data-card__actions">
                  <button class="hq-btn hq-btn--outline hq-btn--sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Call
                  </button>
                  <button class="hq-btn hq-btn--outline hq-btn--sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Email
                  </button>
                  <button class="hq-btn hq-btn--primary hq-btn--sm">View Details</button>
                </div>
              </div>
            </article>
          </div>`
      }
    ],

    // ----------------------------------------
    // COMPARISON SLIDER (Purple Tab)
    // ----------------------------------------
    comparisonSlider: [
      {
        id: 'comparison-before-after',
        category: 'Interactive',
        name: 'Before/After Slider',
        desc: 'Drag to compare two images.',
        html: `
          <section class="hq-section hq-comparison-section">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Restoration</span>
                <h2 class="hq-section-title">Before & After</h2>
                <p>Drag the slider to see the transformation</p>
              </div>
              <div class="hq-comparison-slider">
                <div class="hq-comparison-slider__container">
                  <div class="hq-comparison-slider__before">
                    <img src="https://images.unsplash.com/photo-1559083991-098b5c7a3c22?w=800&h=500&fit=crop&sat=-100" alt="Before restoration">
                    <span class="hq-comparison-slider__label">Before</span>
                  </div>
                  <div class="hq-comparison-slider__after">
                    <img src="https://images.unsplash.com/photo-1559083991-098b5c7a3c22?w=800&h=500&fit=crop" alt="After restoration">
                    <span class="hq-comparison-slider__label">After</span>
                  </div>
                  <div class="hq-comparison-slider__handle">
                    <div class="hq-comparison-slider__line"></div>
                    <div class="hq-comparison-slider__drag">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l-7-7 7-7zm8 0v14l7-7-7-7z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // RATING & REVIEWS (Purple Tab)
    // ----------------------------------------
    ratings: [
      {
        id: 'rating-breakdown',
        category: 'Reviews',
        name: 'Rating Breakdown',
        desc: 'Star rating with distribution chart.',
        html: `
          <section class="hq-section hq-rating-section">
            <div class="hq-container">
              <div class="hq-rating-summary">
                <div class="hq-rating-summary__score">
                  <span class="hq-rating-summary__number">4.8</span>
                  <div class="hq-rating-stars">
                    <span class="hq-star hq-star--filled">★</span>
                    <span class="hq-star hq-star--filled">★</span>
                    <span class="hq-star hq-star--filled">★</span>
                    <span class="hq-star hq-star--filled">★</span>
                    <span class="hq-star hq-star--partial">★</span>
                  </div>
                  <span class="hq-rating-summary__count">Based on 127 reviews</span>
                </div>

                <div class="hq-rating-breakdown">
                  <div class="hq-rating-bar">
                    <span class="hq-rating-bar__label">5 stars</span>
                    <div class="hq-rating-bar__track">
                      <div class="hq-rating-bar__fill" style="width: 78%"></div>
                    </div>
                    <span class="hq-rating-bar__count">99</span>
                  </div>
                  <div class="hq-rating-bar">
                    <span class="hq-rating-bar__label">4 stars</span>
                    <div class="hq-rating-bar__track">
                      <div class="hq-rating-bar__fill" style="width: 15%"></div>
                    </div>
                    <span class="hq-rating-bar__count">19</span>
                  </div>
                  <div class="hq-rating-bar">
                    <span class="hq-rating-bar__label">3 stars</span>
                    <div class="hq-rating-bar__track">
                      <div class="hq-rating-bar__fill" style="width: 5%"></div>
                    </div>
                    <span class="hq-rating-bar__count">6</span>
                  </div>
                  <div class="hq-rating-bar">
                    <span class="hq-rating-bar__label">2 stars</span>
                    <div class="hq-rating-bar__track">
                      <div class="hq-rating-bar__fill" style="width: 2%"></div>
                    </div>
                    <span class="hq-rating-bar__count">2</span>
                  </div>
                  <div class="hq-rating-bar">
                    <span class="hq-rating-bar__label">1 star</span>
                    <div class="hq-rating-bar__track">
                      <div class="hq-rating-bar__fill" style="width: 1%"></div>
                    </div>
                    <span class="hq-rating-bar__count">1</span>
                  </div>
                </div>
              </div>

              <div class="hq-reviews">
                <div class="hq-review">
                  <div class="hq-review__header">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" alt="James" class="hq-review__avatar">
                    <div class="hq-review__meta">
                      <strong>James Richardson</strong>
                      <div class="hq-rating-stars hq-rating-stars--sm">
                        <span class="hq-star hq-star--filled">★</span>
                        <span class="hq-star hq-star--filled">★</span>
                        <span class="hq-star hq-star--filled">★</span>
                        <span class="hq-star hq-star--filled">★</span>
                        <span class="hq-star hq-star--filled">★</span>
                      </div>
                    </div>
                    <span class="hq-review__date">2 weeks ago</span>
                  </div>
                  <p class="hq-review__text">Exceptional service from start to finish. Sarah was incredibly knowledgeable and helped me find the perfect aircraft. The whole team made the buying process seamless.</p>
                  <div class="hq-review__tags">
                    <span class="hq-badge hq-badge--default">Verified Purchase</span>
                    <span class="hq-badge hq-badge--default">Robinson R44</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FILE UPLOAD (Purple Tab)
    // ----------------------------------------
    fileUpload: [
      {
        id: 'upload-dropzone',
        category: 'Forms',
        name: 'File Upload Dropzone',
        desc: 'Drag and drop file upload with previews.',
        html: `
          <div class="hq-upload-demo">
            <div class="hq-upload">
              <div class="hq-upload__dropzone">
                <div class="hq-upload__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p class="hq-upload__text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p class="hq-upload__hint">PNG, JPG, PDF up to 10MB</p>
                <input type="file" class="hq-upload__input" multiple accept="image/*,.pdf">
              </div>

              <div class="hq-upload__files">
                <div class="hq-upload__file">
                  <div class="hq-upload__file-preview">
                    <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=60&h=60&fit=crop" alt="">
                  </div>
                  <div class="hq-upload__file-info">
                    <span class="hq-upload__file-name">aircraft-exterior-01.jpg</span>
                    <span class="hq-upload__file-size">2.4 MB</span>
                  </div>
                  <div class="hq-upload__file-progress">
                    <div class="hq-upload__file-progress-bar" style="width: 100%"></div>
                  </div>
                  <span class="hq-upload__file-status hq-upload__file-status--complete">✓</span>
                  <button class="hq-upload__file-remove">&times;</button>
                </div>

                <div class="hq-upload__file">
                  <div class="hq-upload__file-preview hq-upload__file-preview--doc">
                    📄
                  </div>
                  <div class="hq-upload__file-info">
                    <span class="hq-upload__file-name">maintenance-records.pdf</span>
                    <span class="hq-upload__file-size">5.1 MB</span>
                  </div>
                  <div class="hq-upload__file-progress">
                    <div class="hq-upload__file-progress-bar" style="width: 65%"></div>
                  </div>
                  <span class="hq-upload__file-status">65%</span>
                  <button class="hq-upload__file-remove">&times;</button>
                </div>
              </div>
            </div>
          </div>`
      }
    ],

    // ========================================
    // HQ AVIATION STORYTELLING (Orange Tab)
    // Brand-specific components for services
    // ========================================

    // ----------------------------------------
    // JOURNEY & PROCESS (Orange Tab)
    // ----------------------------------------
    journey: [
      {
        id: 'journey-ownership-timeline',
        category: 'Ownership',
        name: 'Path to Ownership',
        desc: 'Visual journey from enquiry to keys in hand.',
        html: `
          <section class="hq-section hq-journey">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Your Journey</span>
                <h2 class="hq-section__title">From Dream to Hangar</h2>
                <p class="hq-section__subtitle">Four simple steps to aircraft ownership</p>
              </div>
              <div class="hq-journey__timeline">
                <div class="hq-journey__step hq-journey__step--active">
                  <div class="hq-journey__step-marker">
                    <span class="hq-journey__step-num">01</span>
                    <div class="hq-journey__step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                  </div>
                  <div class="hq-journey__step-content">
                    <h3>Discovery Call</h3>
                    <p>Share your vision. We'll discuss mission profiles, budget, and timeline to find your perfect match.</p>
                    <span class="hq-journey__step-time">30 min call</span>
                  </div>
                </div>
                <div class="hq-journey__step">
                  <div class="hq-journey__step-marker">
                    <span class="hq-journey__step-num">02</span>
                    <div class="hq-journey__step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </div>
                  </div>
                  <div class="hq-journey__step-content">
                    <h3>Aircraft Selection</h3>
                    <p>Tour our inventory or configure a factory-new Robinson. Compare specs, inspect in person.</p>
                    <span class="hq-journey__step-time">1-2 weeks</span>
                  </div>
                </div>
                <div class="hq-journey__step">
                  <div class="hq-journey__step-marker">
                    <span class="hq-journey__step-num">03</span>
                    <div class="hq-journey__step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                  </div>
                  <div class="hq-journey__step-content">
                    <h3>Paperwork & Finance</h3>
                    <p>We handle registration, insurance coordination, and financing options. Stress-free process.</p>
                    <span class="hq-journey__step-time">2-4 weeks</span>
                  </div>
                </div>
                <div class="hq-journey__step">
                  <div class="hq-journey__step-marker">
                    <span class="hq-journey__step-num">04</span>
                    <div class="hq-journey__step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                  </div>
                  <div class="hq-journey__step-content">
                    <h3>Handover Day</h3>
                    <p>Collect your aircraft. Full briefing, documentation pack, and optional transition training included.</p>
                    <span class="hq-journey__step-time">Celebration time</span>
                  </div>
                </div>
              </div>
              <div class="hq-journey__cta">
                <a href="#contact" class="hq-btn hq-btn--primary hq-btn--lg">Start Your Journey</a>
                <span class="hq-journey__cta-note">No commitment required</span>
              </div>
            </div>
          </section>`
      },
      {
        id: 'journey-pilot-pathway',
        category: 'Training',
        name: 'Pilot Pathway',
        desc: 'Student to licensed pilot journey visualization.',
        html: `
          <section class="hq-section hq-section--cream hq-pathway">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Flight Training</span>
                <h2 class="hq-section__title">Your Path to the Skies</h2>
                <p class="hq-section__subtitle">From first lesson to PPL(H) in as little as 3 months</p>
              </div>
              <div class="hq-pathway__track">
                <div class="hq-pathway__progress" style="--progress: 35%"></div>
                <div class="hq-pathway__milestone hq-pathway__milestone--complete">
                  <div class="hq-pathway__milestone-dot"></div>
                  <div class="hq-pathway__milestone-content">
                    <span class="hq-pathway__milestone-label">Trial Flight</span>
                    <strong>£299</strong>
                    <p>30-minute hands-on experience</p>
                  </div>
                </div>
                <div class="hq-pathway__milestone hq-pathway__milestone--complete">
                  <div class="hq-pathway__milestone-dot"></div>
                  <div class="hq-pathway__milestone-content">
                    <span class="hq-pathway__milestone-label">First Solo</span>
                    <strong>~15 hours</strong>
                    <p>Your first flight alone</p>
                  </div>
                </div>
                <div class="hq-pathway__milestone hq-pathway__milestone--current">
                  <div class="hq-pathway__milestone-dot"></div>
                  <div class="hq-pathway__milestone-content">
                    <span class="hq-pathway__milestone-label">Skills Test</span>
                    <strong>45 hours min</strong>
                    <p>Demonstrate your abilities</p>
                  </div>
                </div>
                <div class="hq-pathway__milestone">
                  <div class="hq-pathway__milestone-dot"></div>
                  <div class="hq-pathway__milestone-content">
                    <span class="hq-pathway__milestone-label">PPL(H) License</span>
                    <strong>Freedom</strong>
                    <p>The world is yours</p>
                  </div>
                </div>
              </div>
              <div class="hq-pathway__features">
                <div class="hq-pathway__feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Flexible scheduling around your life</span>
                </div>
                <div class="hq-pathway__feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span>1-on-1 CAA approved instruction</span>
                </div>
                <div class="hq-pathway__feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  <span>Ground school included</span>
                </div>
              </div>
              <a href="#training" class="hq-btn hq-btn--primary">Book Your Trial Flight</a>
            </div>
          </section>`
      },
      {
        id: 'journey-service-wheel',
        category: 'Services',
        name: 'Complete Care Wheel',
        desc: 'Circular diagram showing full-service ecosystem.',
        html: `
          <section class="hq-section hq-service-wheel">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Complete Aviation Care</span>
                <h2 class="hq-section__title">Everything Under One Roof</h2>
              </div>
              <div class="hq-wheel">
                <div class="hq-wheel__center">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ" class="hq-wheel__logo">
                  <span>Your Aircraft</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--1">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Maintenance</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--2">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Training</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--3">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Finance</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--4">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Hangarage</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--5">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Sales</span>
                </div>
                <div class="hq-wheel__segment hq-wheel__segment--6">
                  <div class="hq-wheel__segment-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <span class="hq-wheel__segment-label">Parts</span>
                </div>
              </div>
              <p class="hq-service-wheel__tagline">One relationship. Complete peace of mind.</p>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // FLEET SHOWCASE (Orange Tab)
    // ----------------------------------------
    fleetShowcase: [
      {
        id: 'fleet-model-spotlight',
        category: 'Featured',
        name: 'Model Spotlight',
        desc: 'Full-screen aircraft hero with floating specs.',
        html: `
          <section class="hq-section hq-model-spotlight">
            <div class="hq-model-spotlight__bg">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="Robinson R66">
            </div>
            <div class="hq-container">
              <div class="hq-model-spotlight__content">
                <span class="hq-overline hq-overline--light">New Aircraft</span>
                <h1 class="hq-model-spotlight__title">Robinson R66</h1>
                <p class="hq-model-spotlight__tagline">Turbine Performance. Robinson Reliability.</p>
                <div class="hq-model-spotlight__specs">
                  <div class="hq-spec-pill">
                    <span class="hq-spec-pill__value">5</span>
                    <span class="hq-spec-pill__label">Seats</span>
                  </div>
                  <div class="hq-spec-pill">
                    <span class="hq-spec-pill__value">120</span>
                    <span class="hq-spec-pill__label">Knots</span>
                  </div>
                  <div class="hq-spec-pill">
                    <span class="hq-spec-pill__value">350</span>
                    <span class="hq-spec-pill__label">NM Range</span>
                  </div>
                  <div class="hq-spec-pill">
                    <span class="hq-spec-pill__value">RR300</span>
                    <span class="hq-spec-pill__label">Engine</span>
                  </div>
                </div>
                <div class="hq-model-spotlight__actions">
                  <a href="#configure" class="hq-btn hq-btn--primary hq-btn--lg">Configure Yours</a>
                  <a href="#specs" class="hq-btn hq-btn--ghost">Full Specifications</a>
                </div>
                <div class="hq-model-spotlight__price">
                  <span>From</span>
                  <strong>$1,290,000</strong>
                  <span>ex-factory</span>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'fleet-comparison-visual',
        category: 'Compare',
        name: 'Visual Fleet Comparison',
        desc: 'Side-by-side aircraft comparison with visuals.',
        html: `
          <section class="hq-section hq-section--dark hq-fleet-compare">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center hq-section-header--light">
                <span class="hq-overline hq-overline--light">Find Your Match</span>
                <h2 class="hq-section__title">Compare the Fleet</h2>
              </div>
              <div class="hq-fleet-compare__grid">
                <div class="hq-fleet-compare__card">
                  <div class="hq-fleet-compare__image">
                    <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22">
                    <span class="hq-badge hq-badge--primary">Training Favourite</span>
                  </div>
                  <h3 class="hq-fleet-compare__name">R22 Beta II</h3>
                  <p class="hq-fleet-compare__tagline">The world's most popular training helicopter</p>
                  <ul class="hq-fleet-compare__specs">
                    <li><strong>2</strong> Seats</li>
                    <li><strong>102</strong> kts cruise</li>
                    <li><strong>Piston</strong> engine</li>
                    <li><strong>204</strong> nm range</li>
                  </ul>
                  <div class="hq-fleet-compare__price">From <strong>$387,000</strong></div>
                  <a href="#r22" class="hq-btn hq-btn--outline-light hq-btn--full">Learn More</a>
                </div>
                <div class="hq-fleet-compare__card hq-fleet-compare__card--featured">
                  <div class="hq-fleet-compare__image">
                    <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="R44">
                    <span class="hq-badge hq-badge--accent">Most Popular</span>
                  </div>
                  <h3 class="hq-fleet-compare__name">R44 Raven II</h3>
                  <p class="hq-fleet-compare__tagline">Versatile 4-seater for touring and business</p>
                  <ul class="hq-fleet-compare__specs">
                    <li><strong>4</strong> Seats</li>
                    <li><strong>113</strong> kts cruise</li>
                    <li><strong>Piston</strong> engine</li>
                    <li><strong>300</strong> nm range</li>
                  </ul>
                  <div class="hq-fleet-compare__price">From <strong>$577,000</strong></div>
                  <a href="#r44" class="hq-btn hq-btn--primary hq-btn--full">Learn More</a>
                </div>
                <div class="hq-fleet-compare__card">
                  <div class="hq-fleet-compare__image">
                    <img src="/assets/images/new-aircraft/r66/r66-turbine.png" alt="R66">
                    <span class="hq-badge hq-badge--success">Turbine Power</span>
                  </div>
                  <h3 class="hq-fleet-compare__name">R66 Turbine</h3>
                  <p class="hq-fleet-compare__tagline">5-seat turbine for maximum capability</p>
                  <ul class="hq-fleet-compare__specs">
                    <li><strong>5</strong> Seats</li>
                    <li><strong>120</strong> kts cruise</li>
                    <li><strong>Turbine</strong> engine</li>
                    <li><strong>350</strong> nm range</li>
                  </ul>
                  <div class="hq-fleet-compare__price">From <strong>$1,290,000</strong></div>
                  <a href="#r66" class="hq-btn hq-btn--outline-light hq-btn--full">Learn More</a>
                </div>
              </div>
              <p class="hq-fleet-compare__note">All prices ex-factory. Custom configurations available.</p>
            </div>
          </section>`
      },
      {
        id: 'fleet-inventory-live',
        category: 'Inventory',
        name: 'Live Inventory Feed',
        desc: 'Real-time aircraft availability with filters.',
        html: `
          <section class="hq-section hq-inventory">
            <div class="hq-container">
              <div class="hq-inventory__header">
                <div>
                  <span class="hq-overline">Available Now</span>
                  <h2 class="hq-section__title">Current Inventory</h2>
                </div>
                <div class="hq-inventory__filters">
                  <button class="hq-filter-btn hq-filter-btn--active">All</button>
                  <button class="hq-filter-btn">R22</button>
                  <button class="hq-filter-btn">R44</button>
                  <button class="hq-filter-btn">R66</button>
                </div>
              </div>
              <div class="hq-inventory__grid">
                <article class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/used-aircraft/r66/ghver.jpg" alt="R66">
                    <span class="hq-aircraft-card__status hq-aircraft-card__status--available">Available</span>
                  </div>
                  <div class="hq-aircraft-card__content">
                    <div class="hq-aircraft-card__header">
                      <span class="hq-aircraft-card__year">2023</span>
                      <h3 class="hq-aircraft-card__title">Robinson R66 Turbine</h3>
                      <span class="hq-aircraft-card__reg">G-HQAV</span>
                    </div>
                    <div class="hq-aircraft-card__specs">
                      <span><strong>287</strong> TT</span>
                      <span><strong>IFR</strong> Equipped</span>
                      <span><strong>Garmin</strong> G500H</span>
                    </div>
                    <div class="hq-aircraft-card__footer">
                      <span class="hq-aircraft-card__price">£895,000</span>
                      <a href="#" class="hq-btn hq-btn--sm">View Details</a>
                    </div>
                  </div>
                </article>
                <article class="hq-aircraft-card">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg" alt="R44">
                    <span class="hq-aircraft-card__status hq-aircraft-card__status--reserved">Reserved</span>
                  </div>
                  <div class="hq-aircraft-card__content">
                    <div class="hq-aircraft-card__header">
                      <span class="hq-aircraft-card__year">2022</span>
                      <h3 class="hq-aircraft-card__title">Robinson R44 Raven II</h3>
                      <span class="hq-aircraft-card__reg">G-PIXL</span>
                    </div>
                    <div class="hq-aircraft-card__specs">
                      <span><strong>520</strong> TT</span>
                      <span><strong>VFR</strong> Only</span>
                      <span><strong>Pop-out</strong> Floats</span>
                    </div>
                    <div class="hq-aircraft-card__footer">
                      <span class="hq-aircraft-card__price">£420,000</span>
                      <a href="#" class="hq-btn hq-btn--sm hq-btn--outline">Enquire</a>
                    </div>
                  </div>
                </article>
                <article class="hq-aircraft-card hq-aircraft-card--new">
                  <div class="hq-aircraft-card__image">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66 Factory New">
                    <span class="hq-aircraft-card__status hq-aircraft-card__status--new">Factory New</span>
                  </div>
                  <div class="hq-aircraft-card__content">
                    <div class="hq-aircraft-card__header">
                      <span class="hq-aircraft-card__year">2024</span>
                      <h3 class="hq-aircraft-card__title">Robinson R66 Turbine</h3>
                      <span class="hq-aircraft-card__reg">Build Slot</span>
                    </div>
                    <div class="hq-aircraft-card__specs">
                      <span><strong>0</strong> TT</span>
                      <span><strong>Your</strong> Spec</span>
                      <span><strong>Q2</strong> Delivery</span>
                    </div>
                    <div class="hq-aircraft-card__footer">
                      <span class="hq-aircraft-card__price">From $1.29M</span>
                      <a href="#" class="hq-btn hq-btn--primary hq-btn--sm">Configure</a>
                    </div>
                  </div>
                </article>
              </div>
              <div class="hq-inventory__footer">
                <p>Can't find what you're looking for?</p>
                <a href="#contact" class="hq-btn hq-btn--dark">Tell Us Your Requirements</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TRAINING STORIES (Orange Tab)
    // ----------------------------------------
    trainingStories: [
      {
        id: 'training-instructor-spotlight',
        category: 'Instructors',
        name: 'Meet Your Instructor',
        desc: 'Instructor profile with credentials and approach.',
        html: `
          <section class="hq-section hq-instructor">
            <div class="hq-container">
              <div class="hq-instructor__layout">
                <div class="hq-instructor__image">
                  <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Chris Smith">
                  <div class="hq-instructor__credentials">
                    <span class="hq-badge">CAA Approved</span>
                    <span class="hq-badge">FI(H)</span>
                    <span class="hq-badge">CPL(H)</span>
                  </div>
                </div>
                <div class="hq-instructor__content">
                  <span class="hq-overline">Flight Training</span>
                  <h2 class="hq-section__title">Learn from the Best</h2>
                  <div class="hq-instructor__profile">
                    <h3>Chris Smith</h3>
                    <span class="hq-instructor__role">Chief Flying Instructor</span>
                  </div>
                  <p class="hq-instructor__bio">With over 8,000 hours and 25 years in the cockpit, Chris has trained hundreds of pilots from first hover to commercial certification. His patient, structured approach makes complex concepts accessible.</p>
                  <div class="hq-instructor__stats">
                    <div class="hq-stat">
                      <span class="hq-stat__value">8,000+</span>
                      <span class="hq-stat__label">Flight Hours</span>
                    </div>
                    <div class="hq-stat">
                      <span class="hq-stat__value">500+</span>
                      <span class="hq-stat__label">Students Trained</span>
                    </div>
                    <div class="hq-stat">
                      <span class="hq-stat__value">98%</span>
                      <span class="hq-stat__label">Pass Rate</span>
                    </div>
                  </div>
                  <blockquote class="hq-instructor__quote">
                    "Every student learns differently. My job is to find what clicks for you and build from there. Flying should be challenging but never intimidating."
                  </blockquote>
                  <a href="#book" class="hq-btn hq-btn--primary">Book a Lesson with Chris</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'training-student-journey',
        category: 'Stories',
        name: 'Student Success Story',
        desc: 'Real student journey with photos and milestones.',
        html: `
          <section class="hq-section hq-section--cream hq-student-story">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Student Stories</span>
                <h2 class="hq-section__title">From Desk to Cockpit</h2>
              </div>
              <div class="hq-student-story__content">
                <div class="hq-student-story__hero">
                  <img src="/assets/images/team/mackie-alcantara-profile-picture.jpg" alt="Sarah's first solo">
                  <div class="hq-student-story__badge">First Solo: Day 47</div>
                </div>
                <div class="hq-student-story__narrative">
                  <div class="hq-student-story__author">
                    <img src="/assets/images/team/mackie-alcantara-profile-picture.jpg" alt="Sarah">
                    <div>
                      <strong>Sarah Mitchell</strong>
                      <span>Marketing Director → Private Pilot</span>
                    </div>
                  </div>
                  <blockquote>
                    "I'd dreamed of flying since I was a kid watching helicopters at air shows. At 42, I thought I'd missed my chance. HQ proved me wrong."
                  </blockquote>
                  <div class="hq-student-story__timeline">
                    <div class="hq-student-story__event">
                      <span class="hq-student-story__event-date">March 2023</span>
                      <span class="hq-student-story__event-title">Trial Flight</span>
                      <p>"30 minutes that changed everything. I was hooked."</p>
                    </div>
                    <div class="hq-student-story__event">
                      <span class="hq-student-story__event-date">May 2023</span>
                      <span class="hq-student-story__event-title">First Solo</span>
                      <p>"The radio call 'G-HQAV cleared for takeoff, student pilot' gave me chills."</p>
                    </div>
                    <div class="hq-student-story__event">
                      <span class="hq-student-story__event-date">September 2023</span>
                      <span class="hq-student-story__event-title">PPL(H) Awarded</span>
                      <p>"The examiner said 'Congratulations, you're a pilot.' I cried."</p>
                    </div>
                  </div>
                  <a href="#training" class="hq-btn hq-btn--primary">Start Your Story</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'training-course-breakdown',
        category: 'Courses',
        name: 'Course Breakdown',
        desc: 'Visual course structure with modules.',
        html: `
          <section class="hq-section hq-course-breakdown">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">PPL(H) Course</span>
                <h2 class="hq-section__title">What You'll Learn</h2>
                <p class="hq-section__subtitle">45 hours minimum flight time, 100 hours ground school</p>
              </div>
              <div class="hq-course-breakdown__modules">
                <div class="hq-course-module">
                  <div class="hq-course-module__header">
                    <span class="hq-course-module__num">01</span>
                    <h3>Fundamentals</h3>
                    <span class="hq-course-module__hours">8-10 hours</span>
                  </div>
                  <ul class="hq-course-module__topics">
                    <li>Controls and effects</li>
                    <li>Hovering and hover taxi</li>
                    <li>Basic manoeuvres</li>
                    <li>Circuit work</li>
                  </ul>
                  <div class="hq-course-module__milestone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    First Solo
                  </div>
                </div>
                <div class="hq-course-module">
                  <div class="hq-course-module__header">
                    <span class="hq-course-module__num">02</span>
                    <h3>Navigation</h3>
                    <span class="hq-course-module__hours">15-20 hours</span>
                  </div>
                  <ul class="hq-course-module__topics">
                    <li>Map reading and planning</li>
                    <li>Dead reckoning</li>
                    <li>Radio navigation</li>
                    <li>Cross-country flights</li>
                  </ul>
                  <div class="hq-course-module__milestone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Qualifying Cross-Country
                  </div>
                </div>
                <div class="hq-course-module">
                  <div class="hq-course-module__header">
                    <span class="hq-course-module__num">03</span>
                    <h3>Advanced & Test Prep</h3>
                    <span class="hq-course-module__hours">12-15 hours</span>
                  </div>
                  <ul class="hq-course-module__topics">
                    <li>Confined areas</li>
                    <li>Emergencies and failures</li>
                    <li>Night rating prep (optional)</li>
                    <li>Skills test practice</li>
                  </ul>
                  <div class="hq-course-module__milestone hq-course-module__milestone--final">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    PPL(H) License
                  </div>
                </div>
              </div>
              <div class="hq-course-breakdown__cta">
                <div class="hq-course-breakdown__price">
                  <span>Complete PPL(H) Course</span>
                  <strong>From £15,000</strong>
                  <span>Payment plans available</span>
                </div>
                <a href="#book" class="hq-btn hq-btn--primary hq-btn--lg">Download Course Guide</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // MAINTENANCE & SERVICE (Orange Tab)
    // ----------------------------------------
    maintenanceShowcase: [
      {
        id: 'maintenance-capabilities',
        category: 'Services',
        name: 'Service Capabilities',
        desc: 'Visual breakdown of maintenance services.',
        html: `
          <section class="hq-section hq-maintenance-services">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">EASA Part-145 Approved</span>
                <h2 class="hq-section__title">Complete Maintenance Solutions</h2>
                <p class="hq-section__subtitle">Factory-trained engineers. Genuine parts. Full certification.</p>
              </div>
              <div class="hq-maintenance-services__grid">
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <h3>100-Hour Inspections</h3>
                  <p>Comprehensive checks to keep you flying safely. Typically 2-3 day turnaround.</p>
                  <span class="hq-service-block__price">From £2,400</span>
                </div>
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3>Annual Inspections</h3>
                  <p>Full annual airworthiness review with CAA documentation.</p>
                  <span class="hq-service-block__price">From £4,800</span>
                </div>
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                  <h3>Component Overhaul</h3>
                  <p>Blade, gearbox, and major component rebuilds to factory spec.</p>
                  <span class="hq-service-block__price">Quote on request</span>
                </div>
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <h3>Parts Supply</h3>
                  <p>Genuine Robinson parts. Large UK stock for rapid turnaround.</p>
                  <span class="hq-service-block__price">Next-day delivery</span>
                </div>
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <h3>AOG Support</h3>
                  <p>Aircraft on ground? Priority response to get you flying again.</p>
                  <span class="hq-service-block__price">24/7 Available</span>
                </div>
                <div class="hq-service-block">
                  <div class="hq-service-block__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <h3>Tech Records</h3>
                  <p>Complete logbook and documentation management services.</p>
                  <span class="hq-service-block__price">Included</span>
                </div>
              </div>
              <div class="hq-maintenance-services__certifications">
                <img src="/assets/images/logos/certifications/easa1.png" alt="EASA Part-145">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA Approved">
                <img src="/assets/images/logos/certifications/logo_robinson_authorized_repair_center1.jpg" alt="Robinson Authorized">
              </div>
            </div>
          </section>`
      },
      {
        id: 'maintenance-hangar-tour',
        category: 'Facilities',
        name: 'Hangar Tour',
        desc: 'Visual tour of maintenance facilities.',
        html: `
          <section class="hq-section hq-hangar-tour">
            <div class="hq-hangar-tour__hero">
              <img src="/assets/images/facility/hq-0007.jpg" alt="HQ Aviation Hangar">
              <div class="hq-hangar-tour__overlay">
                <div class="hq-container">
                  <span class="hq-overline hq-overline--light">Our Facilities</span>
                  <h2 class="hq-hangar-tour__title">Where Excellence Takes Shape</h2>
                  <p>20,000 sq ft of purpose-built helicopter maintenance and storage</p>
                </div>
              </div>
            </div>
            <div class="hq-container">
              <div class="hq-hangar-tour__features">
                <div class="hq-hangar-tour__feature">
                  <div class="hq-hangar-tour__feature-image">
                    <img src="/assets/images/facility/hq-0391.jpg" alt="Workshop">
                  </div>
                  <div class="hq-hangar-tour__feature-content">
                    <h3>Modern Workshop</h3>
                    <p>Climate-controlled environment with specialized tooling for all Robinson models. Clean, organized, efficient.</p>
                  </div>
                </div>
                <div class="hq-hangar-tour__feature">
                  <div class="hq-hangar-tour__feature-image">
                    <img src="/assets/images/facility/hq-0502.jpg" alt="Parts Store">
                  </div>
                  <div class="hq-hangar-tour__feature-content">
                    <h3>Comprehensive Parts Store</h3>
                    <p>£500,000+ inventory of genuine Robinson parts. No waiting for shipments from the US.</p>
                  </div>
                </div>
                <div class="hq-hangar-tour__feature">
                  <div class="hq-hangar-tour__feature-image">
                    <img src="/assets/images/facility/hangar.png" alt="Hangarage">
                  </div>
                  <div class="hq-hangar-tour__feature-content">
                    <h3>Secure Hangarage</h3>
                    <p>Long-term and overnight storage with 24/7 CCTV. Keep your aircraft protected and ready to fly.</p>
                  </div>
                </div>
              </div>
              <div class="hq-hangar-tour__cta">
                <p>Want to see our facilities in person?</p>
                <a href="#visit" class="hq-btn hq-btn--primary">Book a Tour</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'maintenance-booking',
        category: 'Booking',
        name: 'Service Booking Form',
        desc: 'Maintenance appointment scheduler.',
        html: `
          <section class="hq-section hq-section--cream hq-service-booking">
            <div class="hq-container">
              <div class="hq-service-booking__layout">
                <div class="hq-service-booking__info">
                  <span class="hq-overline">Maintenance</span>
                  <h2 class="hq-section__title">Book Your Service</h2>
                  <p>Schedule your aircraft's next inspection or repair. We'll confirm availability within 24 hours.</p>
                  <div class="hq-service-booking__contact">
                    <div class="hq-service-booking__contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <div>
                        <strong>Call Direct</strong>
                        <a href="tel:+441onal753868976">01753 868 976</a>
                      </div>
                    </div>
                    <div class="hq-service-booking__contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <div>
                        <strong>Email</strong>
                        <a href="mailto:maintenance@hqaviation.com">maintenance@hqaviation.com</a>
                      </div>
                    </div>
                  </div>
                </div>
                <form class="hq-service-booking__form">
                  <div class="hq-form__row hq-form__row--2">
                    <div class="hq-form__field">
                      <label class="hq-label">Your Name</label>
                      <input type="text" class="hq-input" required>
                    </div>
                    <div class="hq-form__field">
                      <label class="hq-label">Phone Number</label>
                      <input type="tel" class="hq-input" required>
                    </div>
                  </div>
                  <div class="hq-form__row hq-form__row--2">
                    <div class="hq-form__field">
                      <label class="hq-label">Aircraft Registration</label>
                      <input type="text" class="hq-input" placeholder="G-XXXX" required>
                    </div>
                    <div class="hq-form__field">
                      <label class="hq-label">Aircraft Model</label>
                      <select class="hq-select" required>
                        <option value="">Select model...</option>
                        <option>R22 Beta II</option>
                        <option>R44 Raven I</option>
                        <option>R44 Raven II</option>
                        <option>R44 Cadet</option>
                        <option>R66 Turbine</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Service Required</label>
                    <select class="hq-select" required>
                      <option value="">Select service...</option>
                      <option>100-Hour Inspection</option>
                      <option>Annual Inspection</option>
                      <option>2200-Hour Overhaul</option>
                      <option>Unscheduled Repair</option>
                      <option>Pre-Purchase Inspection</option>
                      <option>Other (describe below)</option>
                    </select>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Preferred Date</label>
                    <input type="date" class="hq-input">
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label">Additional Details</label>
                    <textarea class="hq-textarea" rows="3" placeholder="Any specific concerns or requirements..."></textarea>
                  </div>
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Request Booking</button>
                </form>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // TEAM & TRUST (Orange Tab)
    // ----------------------------------------
    teamTrust: [
      {
        id: 'team-leadership',
        category: 'Leadership',
        name: 'Leadership Team',
        desc: 'Executive team with backgrounds and philosophy.',
        html: `
          <section class="hq-section hq-leadership">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Our People</span>
                <h2 class="hq-section__title">Leadership Team</h2>
                <p class="hq-section__subtitle">Three decades of aviation excellence</p>
              </div>
              <div class="hq-leadership__grid">
                <div class="hq-leader-card">
                  <div class="hq-leader-card__image">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith">
                  </div>
                  <div class="hq-leader-card__content">
                    <h3>Quentin Smith</h3>
                    <span class="hq-leader-card__role">Founder & Managing Director</span>
                    <p>Founded HQ Aviation in 1990. Former British Helicopter Champion. 15,000+ flight hours. Quentin's vision built the UK's leading Robinson dealership.</p>
                    <div class="hq-leader-card__social">
                      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                    </div>
                  </div>
                </div>
                <div class="hq-leader-card">
                  <div class="hq-leader-card__image">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Chris Smith">
                  </div>
                  <div class="hq-leader-card__content">
                    <h3>Chris Smith</h3>
                    <span class="hq-leader-card__role">Chief Flying Instructor</span>
                    <p>8,000+ hours instructing. CAA examiner. Trained over 500 private and commercial pilots. The patient voice guiding the next generation of aviators.</p>
                    <div class="hq-leader-card__social">
                      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                    </div>
                  </div>
                </div>
                <div class="hq-leader-card">
                  <div class="hq-leader-card__image">
                    <img src="/assets/images/team/for-england-282-29.jpg" alt="Mark Thompson">
                  </div>
                  <div class="hq-leader-card__content">
                    <h3>Mark Thompson</h3>
                    <span class="hq-leader-card__role">Chief Engineer</span>
                    <p>EASA Part-66 B1/B2 licensed. Factory-trained at Robinson HQ, Torrance. Leads our maintenance team with meticulous attention to safety and quality.</p>
                    <div class="hq-leader-card__social">
                      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'team-heritage-timeline',
        category: 'Heritage',
        name: 'Heritage Timeline',
        desc: 'Company history with milestones.',
        html: `
          <section class="hq-section hq-section--dark hq-heritage">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--light">
                <span class="hq-overline hq-overline--light">Our Story</span>
                <h2 class="hq-section__title">30+ Years of Aviation Excellence</h2>
              </div>
              <div class="hq-heritage__timeline">
                <div class="hq-heritage__event">
                  <span class="hq-heritage__year">1990</span>
                  <div class="hq-heritage__content">
                    <h3>The Beginning</h3>
                    <p>Quentin Smith founds HQ Aviation at White Waltham. One R22, one instructor, one vision.</p>
                  </div>
                </div>
                <div class="hq-heritage__event">
                  <span class="hq-heritage__year">1995</span>
                  <div class="hq-heritage__content">
                    <h3>Robinson Dealership</h3>
                    <p>Appointed official Robinson Helicopter dealer for the UK. First new R44 delivered to a British customer.</p>
                  </div>
                </div>
                <div class="hq-heritage__event">
                  <span class="hq-heritage__year">2002</span>
                  <div class="hq-heritage__content">
                    <h3>Part-145 Approval</h3>
                    <p>EASA Part-145 maintenance approval granted. Now a one-stop shop for sales, training, and maintenance.</p>
                  </div>
                </div>
                <div class="hq-heritage__event">
                  <span class="hq-heritage__year">2010</span>
                  <div class="hq-heritage__content">
                    <h3>New Headquarters</h3>
                    <p>Move to purpose-built 20,000 sq ft facility at Denham Aerodrome. Room to grow.</p>
                  </div>
                </div>
                <div class="hq-heritage__event">
                  <span class="hq-heritage__year">2015</span>
                  <div class="hq-heritage__content">
                    <h3>R66 Launch Partner</h3>
                    <p>First UK delivery of the R66 Turbine. A new era of turbine accessibility begins.</p>
                  </div>
                </div>
                <div class="hq-heritage__event hq-heritage__event--current">
                  <span class="hq-heritage__year">Today</span>
                  <div class="hq-heritage__content">
                    <h3>Industry Leader</h3>
                    <p>500+ aircraft delivered. 1,000+ pilots trained. The UK's most trusted Robinson partner.</p>
                  </div>
                </div>
              </div>
              <div class="hq-heritage__stats">
                <div class="hq-stat hq-stat--light">
                  <span class="hq-stat__value">30+</span>
                  <span class="hq-stat__label">Years</span>
                </div>
                <div class="hq-stat hq-stat--light">
                  <span class="hq-stat__value">500+</span>
                  <span class="hq-stat__label">Aircraft Sold</span>
                </div>
                <div class="hq-stat hq-stat--light">
                  <span class="hq-stat__value">1,000+</span>
                  <span class="hq-stat__label">Pilots Trained</span>
                </div>
                <div class="hq-stat hq-stat--light">
                  <span class="hq-stat__value">50,000+</span>
                  <span class="hq-stat__label">Maintenance Hours</span>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'team-trust-signals',
        category: 'Trust',
        name: 'Trust & Credentials',
        desc: 'Certifications, awards, and social proof.',
        html: `
          <section class="hq-section hq-trust-signals">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Why Choose HQ</span>
                <h2 class="hq-section__title">Trusted by Pilots Worldwide</h2>
              </div>
              <div class="hq-trust-signals__certifications">
                <div class="hq-cert-card">
                  <img src="/assets/images/logos/certifications/logo_robinson_authorized_repair_center1.jpg" alt="Robinson">
                  <h3>Robinson Authorized</h3>
                  <p>Official UK dealer since 1995</p>
                </div>
                <div class="hq-cert-card">
                  <img src="/assets/images/logos/certifications/easa1.png" alt="EASA">
                  <h3>EASA Part-145</h3>
                  <p>Approved Maintenance Organisation</p>
                </div>
                <div class="hq-cert-card">
                  <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA">
                  <h3>CAA Approved</h3>
                  <p>Approved Training Organisation</p>
                </div>
                <div class="hq-cert-card">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="BHPA">
                  <h3>BHPA Member</h3>
                  <p>British Helicopter Association</p>
                </div>
              </div>
              <div class="hq-trust-signals__testimonials">
                <div class="hq-testimonial-featured">
                  <blockquote>
                    "I've bought three aircraft from HQ over 15 years. The relationship doesn't end at the sale—they're partners in every sense. Maintenance, training, advice, they're always there."
                  </blockquote>
                  <div class="hq-testimonial-featured__author">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="James Carter">
                    <div>
                      <strong>James Carter</strong>
                      <span>R66 Owner, Surrey</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hq-trust-signals__numbers">
                <p>Join <strong>500+</strong> aircraft owners who trust HQ Aviation</p>
                <a href="#contact" class="hq-btn hq-btn--primary">Start a Conversation</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // LIFESTYLE & ASPIRATION (Orange Tab)
    // ----------------------------------------
    lifestyle: [
      {
        id: 'lifestyle-destinations',
        category: 'Destinations',
        name: 'Where Will You Go?',
        desc: 'Aspirational destinations gallery.',
        html: `
          <section class="hq-section hq-destinations">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">The World Awaits</span>
                <h2 class="hq-section__title">Where Will You Go?</h2>
                <p class="hq-section__subtitle">Skip the traffic. Land where others can't. Your helicopter, your freedom.</p>
              </div>
              <div class="hq-destinations__grid">
                <div class="hq-destination hq-destination--large">
                  <img src="/assets/images/gallery/flying/flying--1.jpg" alt="Scottish Highlands">
                  <div class="hq-destination__overlay">
                    <h3>Scottish Highlands</h3>
                    <span>2hr 45min from London</span>
                  </div>
                </div>
                <div class="hq-destination">
                  <img src="/assets/images/expeditions/antartica.jpg" alt="French Riviera">
                  <div class="hq-destination__overlay">
                    <h3>French Riviera</h3>
                    <span>Direct to your yacht</span>
                  </div>
                </div>
                <div class="hq-destination">
                  <img src="/assets/images/gallery/flying/flying-.jpg" alt="Cotswolds">
                  <div class="hq-destination__overlay">
                    <h3>The Cotswolds</h3>
                    <span>45min lunch trips</span>
                  </div>
                </div>
                <div class="hq-destination">
                  <img src="/assets/images/expeditions/channel.jpg" alt="Cornwall">
                  <div class="hq-destination__overlay">
                    <h3>Cornwall Coast</h3>
                    <span>Weekend escapes</span>
                  </div>
                </div>
                <div class="hq-destination">
                  <img src="/assets/images/expeditions/antartica.jpg" alt="Swiss Alps">
                  <div class="hq-destination__overlay">
                    <h3>Swiss Alps</h3>
                    <span>Ski resort transfers</span>
                  </div>
                </div>
              </div>
              <p class="hq-destinations__tagline">Life is too short for motorways.</p>
            </div>
          </section>`
      },
      {
        id: 'lifestyle-ownership-benefits',
        category: 'Benefits',
        name: 'Ownership Benefits',
        desc: 'Why own a helicopter lifestyle piece.',
        html: `
          <section class="hq-section hq-section--cream hq-ownership-benefits">
            <div class="hq-container">
              <div class="hq-ownership-benefits__layout">
                <div class="hq-ownership-benefits__content">
                  <span class="hq-overline">Helicopter Ownership</span>
                  <h2 class="hq-section__title">More Than Transport.<br>A Way of Life.</h2>
                  <div class="hq-ownership-benefits__list">
                    <div class="hq-benefit">
                      <div class="hq-benefit__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <h3>Time Freedom</h3>
                        <p>London to Edinburgh in 2.5 hours. Skip check-in queues, security lines, and delays. Your schedule, your aircraft.</p>
                      </div>
                    </div>
                    <div class="hq-benefit">
                      <div class="hq-benefit__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div>
                        <h3>Access Anywhere</h3>
                        <p>Land at 2,000+ airfields across Europe. Remote estates, private helipads, events—arrive exactly where you need to be.</p>
                      </div>
                    </div>
                    <div class="hq-benefit">
                      <div class="hq-benefit__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </div>
                      <div>
                        <h3>Pure Joy</h3>
                        <p>The view from 2,000 feet. The thrill of flight. The smiles from passengers. Some things can't be measured in ROI.</p>
                      </div>
                    </div>
                    <div class="hq-benefit">
                      <div class="hq-benefit__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <div>
                        <h3>Business Asset</h3>
                        <p>Tax-efficient ownership structures. Potential charter revenue. An asset that pays for itself while you fly.</p>
                      </div>
                    </div>
                  </div>
                  <a href="#ownership" class="hq-btn hq-btn--primary">Explore Ownership Options</a>
                </div>
                <div class="hq-ownership-benefits__image">
                  <img src="/assets/images/used-aircraft/r66/ghver.jpg" alt="Happy owner with R66">
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'lifestyle-experience-cta',
        category: 'CTA',
        name: 'Experience Flight CTA',
        desc: 'Immersive call-to-action section.',
        html: `
          <section class="hq-section hq-experience-cta">
            <div class="hq-experience-cta__bg">
              <video autoplay muted loop playsinline>
                <source src="/assets/videos/flight-sunset.mp4" type="video/mp4">
              </video>
              <div class="hq-experience-cta__overlay"></div>
            </div>
            <div class="hq-container">
              <div class="hq-experience-cta__content">
                <span class="hq-overline hq-overline--light">Take the First Step</span>
                <h2 class="hq-experience-cta__title">Experience Flight</h2>
                <p class="hq-experience-cta__text">No commitment. No pressure. Just 30 minutes of pure aviation joy. Take the controls, feel the freedom, and discover why 1,000+ pilots started their journey with us.</p>
                <div class="hq-experience-cta__offer">
                  <div class="hq-experience-cta__price">
                    <span>Trial Flight</span>
                    <strong>£299</strong>
                  </div>
                  <ul class="hq-experience-cta__includes">
                    <li>30 minutes flight time</li>
                    <li>Full pre-flight briefing</li>
                    <li>Hands-on controls</li>
                    <li>Souvenir logbook entry</li>
                  </ul>
                </div>
                <div class="hq-experience-cta__actions">
                  <a href="#book" class="hq-btn hq-btn--primary hq-btn--lg">Book Your Trial Flight</a>
                  <a href="tel:+441753868976" class="hq-btn hq-btn--ghost">Call 01753 868 976</a>
                </div>
                <p class="hq-experience-cta__note">Gift vouchers available. Valid for 12 months.</p>
              </div>
            </div>
          </section>`
      },
      {
        id: 'lifestyle-day-in-life',
        category: 'Lifestyle',
        name: 'A Day in the Life',
        desc: 'Visual story of helicopter ownership.',
        html: `
          <section class="hq-section hq-day-life">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Helicopter Ownership</span>
                <h2 class="hq-section__title">A Day in Your Life</h2>
              </div>
              <div class="hq-day-life__story">
                <div class="hq-day-life__chapter">
                  <span class="hq-day-life__time">7:30 AM</span>
                  <div class="hq-day-life__image">
                    <img src="/assets/images/facility/hq-0035.jpg" alt="Morning at hangar">
                  </div>
                  <div class="hq-day-life__text">
                    <h3>Quick Pre-Flight</h3>
                    <p>Coffee in hand, 15-minute walk-around. Your R66 is ready, fueled overnight by the hangar team.</p>
                  </div>
                </div>
                <div class="hq-day-life__chapter">
                  <span class="hq-day-life__time">8:15 AM</span>
                  <div class="hq-day-life__image">
                    <img src="/assets/images/gallery/flying/flying-.jpg" alt="Flying over London">
                  </div>
                  <div class="hq-day-life__text">
                    <h3>Above the M25</h3>
                    <p>20 minutes into your flight, you glance down at gridlocked traffic. You smile. Meeting in Birmingham starts at 9:30.</p>
                  </div>
                </div>
                <div class="hq-day-life__chapter">
                  <span class="hq-day-life__time">12:30 PM</span>
                  <div class="hq-day-life__image">
                    <img src="/assets/images/expeditions/channel.jpg" alt="Lunch in Cotswolds">
                  </div>
                  <div class="hq-day-life__text">
                    <h3>Lunch Detour</h3>
                    <p>Client meeting done early. Quick hop to a Cotswolds pub for lunch. Back home by 3 PM.</p>
                  </div>
                </div>
                <div class="hq-day-life__chapter">
                  <span class="hq-day-life__time">5:00 PM</span>
                  <div class="hq-day-life__image">
                    <img src="/assets/images/facility/hq-0153.jpg" alt="Family flight">
                  </div>
                  <div class="hq-day-life__text">
                    <h3>School Pickup (Different)</h3>
                    <p>The kids spot you coming in. Their friends are jealous. "Your dad has a helicopter?!"</p>
                  </div>
                </div>
              </div>
              <div class="hq-day-life__cta">
                <p>This could be your Tuesday.</p>
                <a href="#contact" class="hq-btn hq-btn--primary">Let's Make It Happen</a>
              </div>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // DEEP DIVE SERVICE STORIES (Orange Tab)
    // ----------------------------------------
    deepDive: [
      {
        id: 'deep-why-robinson',
        category: 'Aircraft',
        name: 'Why Robinson?',
        desc: 'Brand story and value proposition for Robinson.',
        html: `
          <section class="hq-section hq-why-robinson">
            <div class="hq-container">
              <div class="hq-why-robinson__layout">
                <div class="hq-why-robinson__content">
                  <span class="hq-overline">The Robinson Advantage</span>
                  <h2 class="hq-section__title">Why the World Flies Robinson</h2>
                  <p class="hq-lead">More Robinson helicopters are sold each year than any other manufacturer. Here's why 80% of the world's helicopter pilots train in one.</p>
                  <div class="hq-why-robinson__reasons">
                    <div class="hq-reason">
                      <div class="hq-reason__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <h3>Accessible Ownership</h3>
                      <p>The lowest acquisition and operating costs of any helicopter class. Ownership isn't just for the ultra-wealthy.</p>
                    </div>
                    <div class="hq-reason">
                      <div class="hq-reason__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <h3>Proven Safety Record</h3>
                      <p>Decades of continuous refinement. Simple, reliable systems that pilots trust with their lives.</p>
                    </div>
                    <div class="hq-reason">
                      <div class="hq-reason__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      </div>
                      <h3>Easy Maintenance</h3>
                      <p>Designed for simplicity. Lower maintenance costs. Faster turnarounds. More time flying.</p>
                    </div>
                    <div class="hq-reason">
                      <div class="hq-reason__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </div>
                      <h3>Global Support Network</h3>
                      <p>Dealers and service centres worldwide. Parts availability. Community of passionate owners.</p>
                    </div>
                  </div>
                </div>
                <div class="hq-why-robinson__visual">
                  <div class="hq-stat-showcase">
                    <div class="hq-stat-showcase__item">
                      <span class="hq-stat-showcase__value">13,000+</span>
                      <span class="hq-stat-showcase__label">Aircraft delivered worldwide</span>
                    </div>
                    <div class="hq-stat-showcase__item">
                      <span class="hq-stat-showcase__value">#1</span>
                      <span class="hq-stat-showcase__label">Best-selling civil helicopter</span>
                    </div>
                    <div class="hq-stat-showcase__item">
                      <span class="hq-stat-showcase__value">50+</span>
                      <span class="hq-stat-showcase__label">Years of innovation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-r66-showcase',
        category: 'Aircraft',
        name: 'R66 Deep Dive',
        desc: 'Comprehensive R66 Turbine showcase.',
        html: `
          <section class="hq-section hq-aircraft-deep">
            <div class="hq-aircraft-deep__hero">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66 in flight">
              <div class="hq-aircraft-deep__hero-overlay">
                <div class="hq-container">
                  <span class="hq-badge hq-badge--accent">Turbine Powered</span>
                  <h1 class="hq-aircraft-deep__title">Robinson R66</h1>
                  <p class="hq-aircraft-deep__tagline">Where turbine performance meets Robinson simplicity</p>
                </div>
              </div>
            </div>
            <div class="hq-container">
              <div class="hq-aircraft-deep__specs-bar">
                <div class="hq-spec-item">
                  <span class="hq-spec-item__value">5</span>
                  <span class="hq-spec-item__label">Seats</span>
                </div>
                <div class="hq-spec-item">
                  <span class="hq-spec-item__value">120 kts</span>
                  <span class="hq-spec-item__label">Max Cruise</span>
                </div>
                <div class="hq-spec-item">
                  <span class="hq-spec-item__value">350 nm</span>
                  <span class="hq-spec-item__label">Range</span>
                </div>
                <div class="hq-spec-item">
                  <span class="hq-spec-item__value">1,300 lbs</span>
                  <span class="hq-spec-item__label">Useful Load</span>
                </div>
                <div class="hq-spec-item">
                  <span class="hq-spec-item__value">RR300</span>
                  <span class="hq-spec-item__label">Engine</span>
                </div>
              </div>
              <div class="hq-aircraft-deep__features">
                <div class="hq-aircraft-feature">
                  <img src="/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-glass-instrument-panel-13712.jpg" alt="R66 Cockpit">
                  <h3>Glass Cockpit Ready</h3>
                  <p>Available with Garmin G500H TXi integrated flight display. Modern avionics, intuitive interface.</p>
                </div>
                <div class="hq-aircraft-feature">
                  <img src="/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-aft-cabin-seats-13653.jpg" alt="R66 Cabin">
                  <h3>Spacious Cabin</h3>
                  <p>Room for 4 passengers plus pilot. Comfortable leather seating. Climate controlled.</p>
                </div>
                <div class="hq-aircraft-feature">
                  <img src="/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-engine-cowling-logo-13765.jpg" alt="R66 Engine">
                  <h3>Rolls-Royce Power</h3>
                  <p>The RR300 turbine delivers 270 shp with exceptional reliability and hot-and-high performance.</p>
                </div>
              </div>
              <div class="hq-aircraft-deep__cta">
                <div class="hq-aircraft-deep__price">
                  <span>From</span>
                  <strong>$1,290,000</strong>
                  <span>Factory new, ex-works Torrance</span>
                </div>
                <div class="hq-aircraft-deep__actions">
                  <a href="#configure" class="hq-btn hq-btn--primary hq-btn--lg">Configure Your R66</a>
                  <a href="#brochure" class="hq-btn hq-btn--outline">Download Brochure</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-training-philosophy',
        category: 'Training',
        name: 'Training Philosophy',
        desc: 'HQ approach to flight instruction.',
        html: `
          <section class="hq-section hq-training-philosophy">
            <div class="hq-container">
              <div class="hq-training-philosophy__layout">
                <div class="hq-training-philosophy__content">
                  <span class="hq-overline">Our Approach</span>
                  <h2 class="hq-section__title">How We Teach You to Fly</h2>
                  <p class="hq-lead">Learning to fly isn't just about passing tests. It's about building confidence, competence, and a lifelong love of aviation.</p>
                  <div class="hq-philosophy-points">
                    <div class="hq-philosophy-point">
                      <span class="hq-philosophy-point__num">01</span>
                      <div>
                        <h3>Your Pace, Not Ours</h3>
                        <p>Some students fly twice a week. Others once a month. We adapt to your schedule and learning style. No pressure, no judgement.</p>
                      </div>
                    </div>
                    <div class="hq-philosophy-point">
                      <span class="hq-philosophy-point__num">02</span>
                      <div>
                        <h3>One-on-One Always</h3>
                        <p>Every lesson is private instruction. Your instructor's full attention, every time. Questions welcomed, curiosity encouraged.</p>
                      </div>
                    </div>
                    <div class="hq-philosophy-point">
                      <span class="hq-philosophy-point__num">03</span>
                      <div>
                        <h3>Real-World Skills</h3>
                        <p>We train pilots, not test-passers. Scenario-based learning. Decision-making practice. The skills that matter when it matters.</p>
                      </div>
                    </div>
                    <div class="hq-philosophy-point">
                      <span class="hq-philosophy-point__num">04</span>
                      <div>
                        <h3>Beyond the License</h3>
                        <p>Your PPL is the beginning, not the end. Mentorship, currency training, and community support for life.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hq-training-philosophy__image">
                  <img src="/assets/images/facility/hq-0153.jpg" alt="Instructor briefing">
                  <div class="hq-training-philosophy__quote">
                    <blockquote>"A great instructor doesn't just teach you to fly. They teach you to think like a pilot."</blockquote>
                    <cite>— Chris Smith, Chief Flying Instructor</cite>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-trial-experience',
        category: 'Training',
        name: 'Trial Flight Experience',
        desc: 'What to expect on your trial flight.',
        html: `
          <section class="hq-section hq-section--cream hq-trial-experience">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Your First Flight</span>
                <h2 class="hq-section__title">The Trial Flight Experience</h2>
                <p class="hq-section__subtitle">30 minutes that could change your life. Here's exactly what happens.</p>
              </div>
              <div class="hq-trial-timeline">
                <div class="hq-trial-step">
                  <div class="hq-trial-step__time">Arrival</div>
                  <div class="hq-trial-step__content">
                    <img src="/assets/images/facility/hq-0035.jpg" alt="Arrival at HQ">
                    <h3>Welcome to HQ</h3>
                    <p>Park up, grab a coffee, and meet your instructor. We'll have a chat about what to expect and answer any questions. No rush.</p>
                  </div>
                </div>
                <div class="hq-trial-step">
                  <div class="hq-trial-step__time">Briefing</div>
                  <div class="hq-trial-step__content">
                    <img src="/assets/images/facility/hq-0153.jpg" alt="Pre-flight briefing">
                    <h3>Pre-Flight Briefing</h3>
                    <p>15 minutes understanding the basics: how a helicopter flies, the controls, and what you'll be doing. Simple, clear, jargon-free.</p>
                  </div>
                </div>
                <div class="hq-trial-step">
                  <div class="hq-trial-step__time">Flight</div>
                  <div class="hq-trial-step__content">
                    <img src="/assets/images/gallery/flying/flying-.jpg" alt="In flight">
                    <h3>You're Flying</h3>
                    <p>30 minutes airborne. You'll take the controls, feel how the helicopter responds, and experience flight from the pilot's seat. The views are a bonus.</p>
                  </div>
                </div>
                <div class="hq-trial-step">
                  <div class="hq-trial-step__time">Debrief</div>
                  <div class="hq-trial-step__content">
                    <img src="/assets/images/facility/hq-0167.jpg" alt="Post-flight">
                    <h3>Post-Flight Chat</h3>
                    <p>Back on the ground, we'll talk through the experience. Questions about training, costs, next steps—ask anything. No sales pitch.</p>
                  </div>
                </div>
              </div>
              <div class="hq-trial-experience__cta">
                <div class="hq-trial-experience__price">
                  <strong>£299</strong>
                  <span>Gift vouchers available • Valid 12 months</span>
                </div>
                <a href="#book" class="hq-btn hq-btn--primary hq-btn--lg">Book Your Trial Flight</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-maintenance-promise',
        category: 'Maintenance',
        name: 'The HQ Maintenance Promise',
        desc: 'What sets HQ maintenance apart.',
        html: `
          <section class="hq-section hq-maintenance-promise">
            <div class="hq-container">
              <div class="hq-maintenance-promise__layout">
                <div class="hq-maintenance-promise__content">
                  <span class="hq-overline">Our Promise</span>
                  <h2 class="hq-section__title">Maintenance That Respects Your Investment</h2>
                  <p class="hq-lead">Your helicopter represents a significant investment—of money, yes, but also of dreams. We treat every aircraft like it's our own.</p>
                  <div class="hq-promise-grid">
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>No Surprises</h4>
                        <p>Detailed quotes before work begins. No hidden costs. If we find something unexpected, we call you first.</p>
                      </div>
                    </div>
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>Genuine Parts Only</h4>
                        <p>We only use Robinson-approved parts. No compromises on safety or longevity. Ever.</p>
                      </div>
                    </div>
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>Factory-Trained Engineers</h4>
                        <p>Our team trains regularly at Robinson HQ in Torrance. Latest techniques, latest knowledge.</p>
                      </div>
                    </div>
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>Complete Documentation</h4>
                        <p>Meticulous records. Full traceability. Your logbooks maintained to the highest standards.</p>
                      </div>
                    </div>
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>Respectful Handling</h4>
                        <p>Protective covers. Clean workspace. We treat your aircraft with the care it deserves.</p>
                      </div>
                    </div>
                    <div class="hq-promise-item">
                      <div class="hq-promise-item__icon">✓</div>
                      <div>
                        <h4>On-Time Delivery</h4>
                        <p>We quote realistic timelines and stick to them. Your aircraft back when promised.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hq-maintenance-promise__image">
                  <img src="/assets/images/facility/hq-0391.jpg" alt="HQ Engineer">
                  <div class="hq-maintenance-promise__badge">
                    <span>EASA Part-145</span>
                    <span>Approved Organisation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-parts-service',
        category: 'Maintenance',
        name: 'Parts & Logistics',
        desc: 'Parts availability and shipping.',
        html: `
          <section class="hq-section hq-section--dark hq-parts-service">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center hq-section-header--light">
                <span class="hq-overline hq-overline--light">Parts Department</span>
                <h2 class="hq-section__title">The Part You Need. When You Need It.</h2>
              </div>
              <div class="hq-parts-service__stats">
                <div class="hq-parts-stat">
                  <span class="hq-parts-stat__value">£500k+</span>
                  <span class="hq-parts-stat__label">Parts in stock</span>
                </div>
                <div class="hq-parts-stat">
                  <span class="hq-parts-stat__value">95%</span>
                  <span class="hq-parts-stat__label">Same-day dispatch</span>
                </div>
                <div class="hq-parts-stat">
                  <span class="hq-parts-stat__value">24hr</span>
                  <span class="hq-parts-stat__label">UK delivery</span>
                </div>
                <div class="hq-parts-stat">
                  <span class="hq-parts-stat__value">48hr</span>
                  <span class="hq-parts-stat__label">European delivery</span>
                </div>
              </div>
              <div class="hq-parts-service__features">
                <div class="hq-parts-feature">
                  <h3>Massive UK Inventory</h3>
                  <p>One of the largest Robinson parts stocks outside the US factory. Consumables, components, and exchange units ready to ship.</p>
                </div>
                <div class="hq-parts-feature">
                  <h3>Global Shipping</h3>
                  <p>DHL, FedEx, specialist aviation freight—whatever it takes to get you flying again. AOG service available.</p>
                </div>
                <div class="hq-parts-feature">
                  <h3>Expert Advice</h3>
                  <p>Not sure what you need? Our parts team knows Robinson aircraft inside out. Call us.</p>
                </div>
              </div>
              <div class="hq-parts-service__cta">
                <p>Grounded and need parts urgently?</p>
                <a href="tel:+441753868976" class="hq-btn hq-btn--primary hq-btn--lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call AOG Hotline
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-cost-transparency',
        category: 'Ownership',
        name: 'Cost Transparency',
        desc: 'Honest breakdown of ownership costs.',
        html: `
          <section class="hq-section hq-cost-transparency">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Real Numbers</span>
                <h2 class="hq-section__title">What Does It Actually Cost?</h2>
                <p class="hq-section__subtitle">Transparent pricing. No nasty surprises. Here's what R44 ownership really looks like.</p>
              </div>
              <div class="hq-cost-breakdown">
                <div class="hq-cost-category">
                  <h3>Fixed Annual Costs</h3>
                  <div class="hq-cost-items">
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Insurance (hull + liability)</span>
                      <span class="hq-cost-item__value">£8,000 - £15,000</span>
                    </div>
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Hangarage</span>
                      <span class="hq-cost-item__value">£6,000 - £12,000</span>
                    </div>
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Annual inspection</span>
                      <span class="hq-cost-item__value">£4,000 - £6,000</span>
                    </div>
                    <div class="hq-cost-item hq-cost-item--subtotal">
                      <span class="hq-cost-item__label">Fixed costs</span>
                      <span class="hq-cost-item__value">~£22,000/year</span>
                    </div>
                  </div>
                </div>
                <div class="hq-cost-category">
                  <h3>Variable Costs (per hour)</h3>
                  <div class="hq-cost-items">
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Fuel (Avgas)</span>
                      <span class="hq-cost-item__value">£80 - £100</span>
                    </div>
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Maintenance reserve</span>
                      <span class="hq-cost-item__value">£100 - £150</span>
                    </div>
                    <div class="hq-cost-item">
                      <span class="hq-cost-item__label">Engine/overhaul reserve</span>
                      <span class="hq-cost-item__value">£80 - £120</span>
                    </div>
                    <div class="hq-cost-item hq-cost-item--subtotal">
                      <span class="hq-cost-item__label">Per flight hour</span>
                      <span class="hq-cost-item__value">~£300/hour</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hq-cost-example">
                <h4>Example: 100 hours/year</h4>
                <div class="hq-cost-example__calc">
                  <span>Fixed: £22,000</span>
                  <span>+</span>
                  <span>Variable: £30,000</span>
                  <span>=</span>
                  <span class="hq-cost-example__total">£52,000/year</span>
                </div>
                <p>That's roughly £520 per hour of flight, or about the same as chartering—except you own the aircraft.</p>
              </div>
              <div class="hq-cost-transparency__cta">
                <p>Want a personalized cost analysis?</p>
                <a href="#contact" class="hq-btn hq-btn--primary">Request Ownership Consultation</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-financing-options',
        category: 'Ownership',
        name: 'Financing Options',
        desc: 'Aircraft financing explained.',
        html: `
          <section class="hq-section hq-section--cream hq-financing-detail">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Aircraft Finance</span>
                <h2 class="hq-section__title">Flexible Ways to Own</h2>
                <p class="hq-section__subtitle">From outright purchase to tax-efficient structures, we'll help you find the right approach.</p>
              </div>
              <div class="hq-financing-options">
                <div class="hq-finance-option">
                  <div class="hq-finance-option__header">
                    <h3>Asset Finance</h3>
                    <span class="hq-badge">Most Popular</span>
                  </div>
                  <p>Spread payments over 3-7 years. Competitive rates from aviation-specialist lenders. Own the aircraft from day one.</p>
                  <ul class="hq-finance-option__features">
                    <li>From 10% deposit</li>
                    <li>Fixed or variable rates</li>
                    <li>Capital allowances available</li>
                  </ul>
                  <div class="hq-finance-option__example">
                    <span>Example: R44 Raven II</span>
                    <strong>From £4,200/month</strong>
                    <span>60 months, 15% deposit</span>
                  </div>
                </div>
                <div class="hq-finance-option">
                  <div class="hq-finance-option__header">
                    <h3>Operating Lease</h3>
                  </div>
                  <p>Lower monthly payments. Return or purchase at end of term. Keep capital working elsewhere.</p>
                  <ul class="hq-finance-option__features">
                    <li>No large deposit required</li>
                    <li>Payments may be tax-deductible</li>
                    <li>Flexible end-of-term options</li>
                  </ul>
                  <div class="hq-finance-option__example">
                    <span>Ideal for</span>
                    <strong>Business users</strong>
                    <span>Commercial operators</span>
                  </div>
                </div>
                <div class="hq-finance-option">
                  <div class="hq-finance-option__header">
                    <h3>Syndicate/Share</h3>
                  </div>
                  <p>Share costs with other pilots. Fly more, pay less. We can help structure or find existing groups.</p>
                  <ul class="hq-finance-option__features">
                    <li>1/2, 1/4, or custom shares</li>
                    <li>Shared maintenance costs</li>
                    <li>Perfect for <100 hrs/year</li>
                  </ul>
                  <div class="hq-finance-option__example">
                    <span>Quarter share example</span>
                    <strong>From £100,000</strong>
                    <span>+ monthly contribution</span>
                  </div>
                </div>
              </div>
              <div class="hq-financing-detail__note">
                <p>We work with specialist aviation lenders including Shawbrook, Close Brothers, and Lombard. No commission from lenders—we're on your side.</p>
                <a href="#finance" class="hq-btn hq-btn--primary">Discuss Finance Options</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-pre-purchase',
        category: 'Sales',
        name: 'Pre-Purchase Inspection',
        desc: 'What HQ checks before you buy.',
        html: `
          <section class="hq-section hq-pre-purchase">
            <div class="hq-container">
              <div class="hq-pre-purchase__layout">
                <div class="hq-pre-purchase__content">
                  <span class="hq-overline">Buying Used?</span>
                  <h2 class="hq-section__title">Our Pre-Purchase Inspection</h2>
                  <p class="hq-lead">Buying a used helicopter is a significant decision. Our comprehensive inspection protects your investment.</p>
                  <div class="hq-inspection-list">
                    <div class="hq-inspection-item">
                      <span class="hq-inspection-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </span>
                      <div>
                        <h4>Document Review</h4>
                        <p>Complete logbook analysis. AD compliance check. Damage history review. Ownership verification.</p>
                      </div>
                    </div>
                    <div class="hq-inspection-item">
                      <span class="hq-inspection-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </span>
                      <div>
                        <h4>Physical Inspection</h4>
                        <p>Detailed airframe examination. Control system check. Blade condition. Corrosion inspection.</p>
                      </div>
                    </div>
                    <div class="hq-inspection-item">
                      <span class="hq-inspection-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>
                      </span>
                      <div>
                        <h4>Engine Assessment</h4>
                        <p>Oil analysis. Compression test. Component time remaining. Overhaul status.</p>
                      </div>
                    </div>
                    <div class="hq-inspection-item">
                      <span class="hq-inspection-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </span>
                      <div>
                        <h4>Test Flight</h4>
                        <p>Full systems check in flight. Performance verification. Vibration analysis. Avionics test.</p>
                      </div>
                    </div>
                  </div>
                  <div class="hq-pre-purchase__price">
                    <span>Comprehensive Pre-Purchase Inspection</span>
                    <strong>From £1,500</strong>
                    <p>Includes detailed written report with photos and recommendations</p>
                  </div>
                  <a href="#ppi" class="hq-btn hq-btn--primary">Book Inspection</a>
                </div>
                <div class="hq-pre-purchase__image">
                  <img src="/assets/images/facility/hq-0477.jpg" alt="Pre-purchase inspection">
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-selling-your-aircraft',
        category: 'Sales',
        name: 'Selling Your Aircraft',
        desc: 'How HQ helps you sell.',
        html: `
          <section class="hq-section hq-section--dark hq-sell-aircraft">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center hq-section-header--light">
                <span class="hq-overline hq-overline--light">Aircraft Sales</span>
                <h2 class="hq-section__title">Selling Your Helicopter?</h2>
                <p class="hq-section__subtitle">Three decades of connections. Worldwide buyer network. Maximum value for your aircraft.</p>
              </div>
              <div class="hq-sell-options">
                <div class="hq-sell-option">
                  <h3>Brokerage</h3>
                  <p>We market your aircraft to our global network. Professional photography, listing on major platforms, qualified buyer screening.</p>
                  <ul>
                    <li>Your aircraft, our expertise</li>
                    <li>Commission on sale only</li>
                    <li>You control the process</li>
                  </ul>
                  <span class="hq-sell-option__timeline">Typical: 2-6 months</span>
                </div>
                <div class="hq-sell-option hq-sell-option--featured">
                  <span class="hq-badge hq-badge--accent">Fastest</span>
                  <h3>Trade-In</h3>
                  <p>Upgrading to a new Robinson? We'll give you a fair trade-in value against your new aircraft purchase.</p>
                  <ul>
                    <li>Immediate valuation</li>
                    <li>Seamless transition</li>
                    <li>One transaction</li>
                  </ul>
                  <span class="hq-sell-option__timeline">As fast as you need</span>
                </div>
                <div class="hq-sell-option">
                  <h3>Outright Purchase</h3>
                  <p>Need to sell quickly? We may buy your aircraft directly for stock or a waiting customer.</p>
                  <ul>
                    <li>Fast decision</li>
                    <li>Cash purchase</li>
                    <li>No waiting for buyers</li>
                  </ul>
                  <span class="hq-sell-option__timeline">Offer within 48 hours</span>
                </div>
              </div>
              <div class="hq-sell-aircraft__cta">
                <p>Curious what your aircraft is worth?</p>
                <a href="#valuation" class="hq-btn hq-btn--primary hq-btn--lg">Request Free Valuation</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-customer-transformation',
        category: 'Stories',
        name: 'Customer Transformation',
        desc: 'Before and after ownership story.',
        html: `
          <section class="hq-section hq-transformation">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Real Stories</span>
                <h2 class="hq-section__title">Life Before & After</h2>
              </div>
              <div class="hq-transformation__story">
                <div class="hq-transformation__before">
                  <h3>Before</h3>
                  <div class="hq-transformation__scenario">
                    <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="James before">
                    <div class="hq-transformation__details">
                      <p class="hq-transformation__quote">"I was spending 4 hours driving to our Scottish estate. Leaving at 5am, arriving exhausted. Weekends felt like work."</p>
                      <ul>
                        <li>4-hour drive each way</li>
                        <li>Every other weekend only</li>
                        <li>Arrived stressed and tired</li>
                        <li>Limited quality time</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="hq-transformation__after">
                  <h3>After</h3>
                  <div class="hq-transformation__scenario">
                    <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="James now">
                    <div class="hq-transformation__details">
                      <p class="hq-transformation__quote">"Now I leave at 9am, arrive for coffee at 10:30. We go every weekend. The kids have learned to fly fish. Everything changed."</p>
                      <ul>
                        <li>90-minute flight</li>
                        <li>Every weekend possible</li>
                        <li>Arrives relaxed, ready</li>
                        <li>Family time maximized</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hq-transformation__footer">
                <div class="hq-transformation__owner">
                  <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="James Richardson">
                  <div>
                    <strong>James Richardson</strong>
                    <span>R66 Owner since 2021</span>
                  </div>
                </div>
                <p>"HQ didn't just sell me a helicopter. They gave me my weekends back."</p>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-business-case',
        category: 'Ownership',
        name: 'The Business Case',
        desc: 'ROI and business benefits of ownership.',
        html: `
          <section class="hq-section hq-section--cream hq-business-case">
            <div class="hq-container">
              <div class="hq-business-case__layout">
                <div class="hq-business-case__content">
                  <span class="hq-overline">For Business</span>
                  <h2 class="hq-section__title">More Than a Cost.<br>A Competitive Advantage.</h2>
                  <p class="hq-lead">The most successful business owners know: time is the only resource you can't make more of.</p>
                  <div class="hq-business-benefits">
                    <div class="hq-business-benefit">
                      <h4>Executive Productivity</h4>
                      <p>Turn travel time into work time or rest time. Arrive at meetings fresh, not frazzled. Make decisions with a clear head.</p>
                    </div>
                    <div class="hq-business-benefit">
                      <h4>Site Accessibility</h4>
                      <p>Visit multiple locations in a day. Remote sites, client offices, job sites—anywhere with a helipad or field.</p>
                    </div>
                    <div class="hq-business-benefit">
                      <h4>Client Impressions</h4>
                      <p>Arrive by helicopter. Make a statement. Show clients you value your time—and theirs.</p>
                    </div>
                    <div class="hq-business-benefit">
                      <h4>Tax Efficiency</h4>
                      <p>Capital allowances on purchase. Potential VAT recovery. Operating costs may be deductible. Consult your accountant.</p>
                    </div>
                  </div>
                </div>
                <div class="hq-business-case__example">
                  <h3>The Numbers</h3>
                  <div class="hq-time-comparison">
                    <div class="hq-time-comparison__row">
                      <span class="hq-time-comparison__route">London → Manchester</span>
                      <span class="hq-time-comparison__car">4hrs (M6)</span>
                      <span class="hq-time-comparison__heli">1hr 10min</span>
                    </div>
                    <div class="hq-time-comparison__row">
                      <span class="hq-time-comparison__route">London → Edinburgh</span>
                      <span class="hq-time-comparison__car">7hrs (A1)</span>
                      <span class="hq-time-comparison__heli">2hr 30min</span>
                    </div>
                    <div class="hq-time-comparison__row">
                      <span class="hq-time-comparison__route">London → Cornwall</span>
                      <span class="hq-time-comparison__car">5hrs (M4/A30)</span>
                      <span class="hq-time-comparison__heli">1hr 45min</span>
                    </div>
                  </div>
                  <p class="hq-time-comparison__note">Based on R66 cruise speed. Door-to-door times depend on helipad locations.</p>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-safety-commitment',
        category: 'Trust',
        name: 'Safety Commitment',
        desc: 'HQ approach to safety.',
        html: `
          <section class="hq-section hq-safety-commitment">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Our Commitment</span>
                <h2 class="hq-section__title">Safety Is Everything</h2>
                <p class="hq-section__subtitle">It's not just a policy. It's our culture.</p>
              </div>
              <div class="hq-safety-pillars">
                <div class="hq-safety-pillar">
                  <div class="hq-safety-pillar__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3>Training Excellence</h3>
                  <p>We don't just meet minimums—we exceed them. Every pilot we train learns not just how to fly, but how to make safe decisions under pressure.</p>
                </div>
                <div class="hq-safety-pillar">
                  <div class="hq-safety-pillar__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3>Maintenance Standards</h3>
                  <p>Every inspection, every repair, every sign-off—done as if our own families were flying. EASA Part-145 is the minimum, not the goal.</p>
                </div>
                <div class="hq-safety-pillar">
                  <div class="hq-safety-pillar__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </div>
                  <h3>Open Reporting</h3>
                  <p>We encourage reporting of safety concerns—no blame, no consequences. Every near-miss is a lesson that could save a life.</p>
                </div>
                <div class="hq-safety-pillar">
                  <div class="hq-safety-pillar__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3>Continuous Learning</h3>
                  <p>Regular recurrency training for our team. Safety seminars for owners. We never stop learning—and neither should you.</p>
                </div>
              </div>
              <div class="hq-safety-commitment__cta">
                <p>Questions about safety? We welcome them.</p>
                <a href="#safety" class="hq-btn hq-btn--primary">Learn About Our Safety Culture</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-community',
        category: 'Trust',
        name: 'The HQ Community',
        desc: 'Owner community and events.',
        html: `
          <section class="hq-section hq-section--dark hq-community">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center hq-section-header--light">
                <span class="hq-overline hq-overline--light">More Than Customers</span>
                <h2 class="hq-section__title">The HQ Family</h2>
                <p class="hq-section__subtitle">Buy from HQ, join a community of passionate aviators.</p>
              </div>
              <div class="hq-community__features">
                <div class="hq-community-feature">
                  <img src="/assets/images/facility/hq-0167.jpg" alt="HQ Fly-in">
                  <h3>Annual Fly-In</h3>
                  <p>Every summer, HQ pilots gather for our legendary fly-in. Food, friends, and flying. Friendships formed, stories shared.</p>
                </div>
                <div class="hq-community-feature">
                  <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Group trip">
                  <h3>Group Adventures</h3>
                  <p>France for lunch. Scottish castles. Channel Islands. Organized group flights with like-minded pilots.</p>
                </div>
                <div class="hq-community-feature">
                  <img src="/assets/images/facility/hq-0209.jpg" alt="Safety seminar">
                  <h3>Safety Seminars</h3>
                  <p>Free quarterly seminars for HQ customers. Guest speakers, refresher training, and the latest in aviation safety.</p>
                </div>
                <div class="hq-community-feature">
                  <img src="/assets/images/facility/hq-0254.jpg" alt="Hangar social">
                  <h3>Hangar Socials</h3>
                  <p>Informal gatherings at Denham. Coffee, conversation, and camaraderie. Aviation geeks welcome.</p>
                </div>
              </div>
              <div class="hq-community__testimonial">
                <blockquote>"I didn't just buy a helicopter from HQ. I joined a family of pilots who look out for each other. That's priceless."</blockquote>
                <cite>— Sarah Mitchell, R44 Owner</cite>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-meet-fleet',
        category: 'Training',
        name: 'Meet the Training Fleet',
        desc: 'Training aircraft showcase.',
        html: `
          <section class="hq-section hq-training-fleet">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Training Aircraft</span>
                <h2 class="hq-section__title">Meet Your Training Partners</h2>
                <p class="hq-section__subtitle">Well-maintained, modern aircraft that make learning a pleasure.</p>
              </div>
              <div class="hq-training-fleet__grid">
                <div class="hq-training-aircraft">
                  <div class="hq-training-aircraft__image">
                    <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="G-HQAV R22">
                    <span class="hq-training-aircraft__reg">G-HQAV</span>
                  </div>
                  <div class="hq-training-aircraft__content">
                    <h3>Robinson R22 Beta II</h3>
                    <p>The world's most popular training helicopter. Light, responsive, and perfect for learning the fundamentals.</p>
                    <div class="hq-training-aircraft__specs">
                      <span>2 seats</span>
                      <span>Piston</span>
                      <span>PPL training</span>
                    </div>
                    <div class="hq-training-aircraft__rate">
                      <strong>£340/hr</strong>
                      <span>Dual instruction</span>
                    </div>
                  </div>
                </div>
                <div class="hq-training-aircraft">
                  <div class="hq-training-aircraft__image">
                    <img src="/assets/images/new-aircraft/r44/r44-cutout.png" alt="G-HQTR R44">
                    <span class="hq-training-aircraft__reg">G-HQTR</span>
                  </div>
                  <div class="hq-training-aircraft__content">
                    <h3>Robinson R44 Raven II</h3>
                    <p>Step up to four seats. Ideal for advanced training, type ratings, and building hours in comfort.</p>
                    <div class="hq-training-aircraft__specs">
                      <span>4 seats</span>
                      <span>Piston</span>
                      <span>Advanced/type rating</span>
                    </div>
                    <div class="hq-training-aircraft__rate">
                      <strong>£480/hr</strong>
                      <span>Dual instruction</span>
                    </div>
                  </div>
                </div>
                <div class="hq-training-aircraft">
                  <div class="hq-training-aircraft__image">
                    <img src="/assets/images/new-aircraft/r66/r66-cutout.png" alt="G-HQTB R66">
                    <span class="hq-training-aircraft__reg">G-HQTB</span>
                  </div>
                  <div class="hq-training-aircraft__content">
                    <h3>Robinson R66 Turbine</h3>
                    <p>Turbine type rating and advanced instruction. Glass cockpit. The flagship of our training fleet.</p>
                    <div class="hq-training-aircraft__specs">
                      <span>5 seats</span>
                      <span>Turbine</span>
                      <span>Type rating</span>
                    </div>
                    <div class="hq-training-aircraft__rate">
                      <strong>£720/hr</strong>
                      <span>Dual instruction</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hq-training-fleet__note">
                <p>All rates include instructor. Fuel included. No hidden costs.</p>
                <a href="#training" class="hq-btn hq-btn--primary">View Training Courses</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-type-ratings',
        category: 'Training',
        name: 'Type Rating Courses',
        desc: 'Transition and type rating details.',
        html: `
          <section class="hq-section hq-section--cream hq-type-ratings">
            <div class="hq-container">
              <div class="hq-section-header">
                <span class="hq-overline">Advanced Training</span>
                <h2 class="hq-section__title">Type Ratings & Transitions</h2>
                <p class="hq-section__subtitle">Already a pilot? Get rated on Robinson aircraft quickly and efficiently.</p>
              </div>
              <div class="hq-type-ratings__grid">
                <div class="hq-type-rating-card">
                  <h3>R22 → R44 Transition</h3>
                  <p>Move up to four seats. Learn the differences in handling, performance, and systems.</p>
                  <div class="hq-type-rating-card__details">
                    <div class="hq-type-rating-card__item">
                      <span>Duration</span>
                      <strong>5-10 hours</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Ground school</span>
                      <strong>Included</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Cost</span>
                      <strong>From £2,400</strong>
                    </div>
                  </div>
                  <a href="#r44-transition" class="hq-btn hq-btn--outline hq-btn--full">Learn More</a>
                </div>
                <div class="hq-type-rating-card hq-type-rating-card--featured">
                  <span class="hq-badge hq-badge--accent">Most Popular</span>
                  <h3>R66 Turbine Type Rating</h3>
                  <p>Step into turbine aviation. Comprehensive course covering the Rolls-Royce RR300 and R66 systems.</p>
                  <div class="hq-type-rating-card__details">
                    <div class="hq-type-rating-card__item">
                      <span>Duration</span>
                      <strong>10-15 hours</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Ground school</span>
                      <strong>2 days</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Cost</span>
                      <strong>From £7,200</strong>
                    </div>
                  </div>
                  <a href="#r66-type" class="hq-btn hq-btn--primary hq-btn--full">Learn More</a>
                </div>
                <div class="hq-type-rating-card">
                  <h3>Fixed-Wing to Helicopter</h3>
                  <p>Airplane pilots welcome. We'll teach you rotary-wing from scratch with credit for your existing skills.</p>
                  <div class="hq-type-rating-card__details">
                    <div class="hq-type-rating-card__item">
                      <span>Duration</span>
                      <strong>35-40 hours</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Credit given</span>
                      <strong>Up to 10 hrs</strong>
                    </div>
                    <div class="hq-type-rating-card__item">
                      <span>Cost</span>
                      <strong>From £12,000</strong>
                    </div>
                  </div>
                  <a href="#fw-conversion" class="hq-btn hq-btn--outline hq-btn--full">Learn More</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-hq-difference',
        category: 'Trust',
        name: 'The HQ Difference',
        desc: 'What makes HQ unique.',
        html: `
          <section class="hq-section hq-hq-difference">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Why HQ?</span>
                <h2 class="hq-section__title">The HQ Difference</h2>
              </div>
              <div class="hq-difference-grid">
                <div class="hq-difference-item">
                  <div class="hq-difference-item__compare">
                    <div class="hq-difference-item__others">
                      <h4>Others</h4>
                      <p>Sales team hands you off to service team. Different people, different priorities.</p>
                    </div>
                    <div class="hq-difference-item__hq">
                      <h4>HQ</h4>
                      <p>One relationship from first enquiry to every service visit. We know you, your aircraft, your needs.</p>
                    </div>
                  </div>
                </div>
                <div class="hq-difference-item">
                  <div class="hq-difference-item__compare">
                    <div class="hq-difference-item__others">
                      <h4>Others</h4>
                      <p>Wait weeks for parts from overseas. Your aircraft sits grounded.</p>
                    </div>
                    <div class="hq-difference-item__hq">
                      <h4>HQ</h4>
                      <p>£500k parts stock on site. Most orders dispatched same day. Get flying again fast.</p>
                    </div>
                  </div>
                </div>
                <div class="hq-difference-item">
                  <div class="hq-difference-item__compare">
                    <div class="hq-difference-item__others">
                      <h4>Others</h4>
                      <p>Factory training? Maybe. Years ago. Who knows.</p>
                    </div>
                    <div class="hq-difference-item__hq">
                      <h4>HQ</h4>
                      <p>Regular training at Robinson HQ, Torrance. Latest techniques, direct factory relationship.</p>
                    </div>
                  </div>
                </div>
                <div class="hq-difference-item">
                  <div class="hq-difference-item__compare">
                    <div class="hq-difference-item__others">
                      <h4>Others</h4>
                      <p>Transaction complete. Good luck. Call if you need something.</p>
                    </div>
                    <div class="hq-difference-item__hq">
                      <h4>HQ</h4>
                      <p>Lifetime support. Regular check-ins. Community events. We're invested in your success.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hq-hq-difference__founder">
                <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith">
                <blockquote>"I built HQ on a simple principle: treat every customer the way I'd want to be treated. That hasn't changed in 30 years."</blockquote>
                <cite>— Quentin Smith, Founder</cite>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-first-aircraft',
        category: 'Ownership',
        name: 'Buying Your First Helicopter',
        desc: 'Guide for first-time buyers.',
        html: `
          <section class="hq-section hq-section--cream hq-first-aircraft">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">First-Time Buyers</span>
                <h2 class="hq-section__title">Your First Helicopter</h2>
                <p class="hq-section__subtitle">Thinking about taking the leap? Here's everything you need to know.</p>
              </div>
              <div class="hq-first-aircraft__questions">
                <div class="hq-faq-item hq-faq-item--open">
                  <h3>Do I need a license first?</h3>
                  <p>No! Many people buy an aircraft before they can fly it—it's great motivation! You can train in your own aircraft or ours. Some owners even hire a pilot while they learn.</p>
                </div>
                <div class="hq-faq-item">
                  <h3>New or pre-owned?</h3>
                  <p>Both have merits. New: your spec, warranty, known history. Pre-owned: lower entry cost, immediate availability, proven reliability. We can advise based on your situation.</p>
                </div>
                <div class="hq-faq-item">
                  <h3>Which model should I choose?</h3>
                  <p>Depends on your mission. Training yourself? R22 is economical. Family of four? R44. Range and comfort priority? R66. We'll help you match aircraft to needs.</p>
                </div>
                <div class="hq-faq-item">
                  <h3>What about insurance?</h3>
                  <p>We'll introduce you to aviation insurance specialists. Rates depend on your experience, aircraft value, and usage. Budget £8-15k/year for a typical R44.</p>
                </div>
                <div class="hq-faq-item">
                  <h3>Where will I keep it?</h3>
                  <p>We offer hangarage at Denham, or can recommend facilities near you. Some owners even keep aircraft at home with a helipad—we can advise on that too.</p>
                </div>
              </div>
              <div class="hq-first-aircraft__cta">
                <h3>Ready to explore ownership?</h3>
                <p>No pressure, no obligation. Let's have a conversation about whether helicopter ownership is right for you.</p>
                <a href="#consultation" class="hq-btn hq-btn--primary hq-btn--lg">Book Free Consultation</a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'deep-service-comparison',
        category: 'Maintenance',
        name: 'Service Level Comparison',
        desc: 'Compare maintenance packages.',
        html: `
          <section class="hq-section hq-service-comparison">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Maintenance Options</span>
                <h2 class="hq-section__title">Choose Your Service Level</h2>
              </div>
              <div class="hq-service-tiers">
                <div class="hq-service-tier">
                  <h3>Essential</h3>
                  <p class="hq-service-tier__desc">The basics, done brilliantly</p>
                  <div class="hq-service-tier__price">
                    <span>From</span>
                    <strong>£2,400</strong>
                    <span>/100hr inspection</span>
                  </div>
                  <ul class="hq-service-tier__features">
                    <li class="included">Full 100-hour inspection</li>
                    <li class="included">Oil & filter change</li>
                    <li class="included">Blade inspection</li>
                    <li class="included">Systems check</li>
                    <li class="not-included">Complimentary wash</li>
                    <li class="not-included">Pickup/delivery</li>
                    <li class="not-included">Loaner aircraft</li>
                  </ul>
                  <a href="#essential" class="hq-btn hq-btn--outline hq-btn--full">Select</a>
                </div>
                <div class="hq-service-tier hq-service-tier--featured">
                  <span class="hq-badge hq-badge--accent">Most Popular</span>
                  <h3>Premium</h3>
                  <p class="hq-service-tier__desc">The full HQ experience</p>
                  <div class="hq-service-tier__price">
                    <span>From</span>
                    <strong>£2,900</strong>
                    <span>/100hr inspection</span>
                  </div>
                  <ul class="hq-service-tier__features">
                    <li class="included">Full 100-hour inspection</li>
                    <li class="included">Oil & filter change</li>
                    <li class="included">Blade inspection</li>
                    <li class="included">Systems check</li>
                    <li class="included">Complimentary wash</li>
                    <li class="included">Pickup/delivery (50nm)</li>
                    <li class="not-included">Loaner aircraft</li>
                  </ul>
                  <a href="#premium" class="hq-btn hq-btn--primary hq-btn--full">Select</a>
                </div>
                <div class="hq-service-tier">
                  <h3>Concierge</h3>
                  <p class="hq-service-tier__desc">White-glove service</p>
                  <div class="hq-service-tier__price">
                    <span>From</span>
                    <strong>£3,800</strong>
                    <span>/100hr inspection</span>
                  </div>
                  <ul class="hq-service-tier__features">
                    <li class="included">Full 100-hour inspection</li>
                    <li class="included">Oil & filter change</li>
                    <li class="included">Blade inspection</li>
                    <li class="included">Systems check</li>
                    <li class="included">Full detail & polish</li>
                    <li class="included">Pickup/delivery (UK-wide)</li>
                    <li class="included">Loaner aircraft available</li>
                  </ul>
                  <a href="#concierge" class="hq-btn hq-btn--outline hq-btn--full">Select</a>
                </div>
              </div>
              <p class="hq-service-comparison__note">All prices R44 example. Actual cost depends on aircraft condition and any additional work required.</p>
            </div>
          </section>`
      }
    ],

    // ----------------------------------------
    // CONTACT & CONVERSION (Orange Tab)
    // ----------------------------------------
    contactConversion: [
      {
        id: 'contact-split-services',
        category: 'Contact',
        name: 'Service-Specific Contact',
        desc: 'Contact form split by service type.',
        html: `
          <section class="hq-section hq-contact-services">
            <div class="hq-container">
              <div class="hq-section-header hq-section-header--center">
                <span class="hq-overline">Get In Touch</span>
                <h2 class="hq-section__title">How Can We Help?</h2>
                <p class="hq-section__subtitle">Select the service you're interested in</p>
              </div>
              <div class="hq-contact-services__grid">
                <a href="#sales-enquiry" class="hq-contact-card">
                  <div class="hq-contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <h3>Aircraft Sales</h3>
                  <p>Buy or sell helicopters. New factory orders or quality pre-owned.</p>
                  <span class="hq-contact-card__link">Sales Enquiry →</span>
                </a>
                <a href="#training-enquiry" class="hq-contact-card">
                  <div class="hq-contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3>Flight Training</h3>
                  <p>PPL(H), type ratings, or trial flights. Start your journey.</p>
                  <span class="hq-contact-card__link">Training Enquiry →</span>
                </a>
                <a href="#maintenance-enquiry" class="hq-contact-card">
                  <div class="hq-contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3>Maintenance</h3>
                  <p>Inspections, repairs, and parts. EASA Part-145 approved.</p>
                  <span class="hq-contact-card__link">Maintenance Enquiry →</span>
                </a>
                <a href="#general-enquiry" class="hq-contact-card">
                  <div class="hq-contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <h3>General Enquiry</h3>
                  <p>Questions, partnerships, or just want to chat about helicopters.</p>
                  <span class="hq-contact-card__link">Get In Touch →</span>
                </a>
              </div>
              <div class="hq-contact-services__direct">
                <p>Prefer to speak directly?</p>
                <a href="tel:+441753868976" class="hq-contact-services__phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  01753 868 976
                </a>
              </div>
            </div>
          </section>`
      },
      {
        id: 'contact-location-hero',
        category: 'Location',
        name: 'Location Hero',
        desc: 'Map and location details as hero section.',
        html: `
          <section class="hq-section hq-location-hero">
            <div class="hq-location-hero__map">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2479.123456789!2d-0.512345!3d51.567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zHQ%20Aviation!5e0!3m2!1sen!2suk!4v1234567890" allowfullscreen="" loading="lazy"></iframe>
            </div>
            <div class="hq-location-hero__content">
              <div class="hq-location-hero__card">
                <h2>Visit Us</h2>
                <div class="hq-location-hero__address">
                  <strong>HQ Aviation Ltd</strong>
                  <p>Denham Aerodrome<br>Tilehouse Lane<br>Denham, Buckinghamshire<br>UB9 5DF</p>
                </div>
                <div class="hq-location-hero__details">
                  <div class="hq-location-hero__detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div>
                      <strong>Opening Hours</strong>
                      <span>Mon-Fri: 8am - 6pm</span>
                      <span>Sat: 9am - 4pm</span>
                    </div>
                  </div>
                  <div class="hq-location-hero__detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <div>
                      <strong>Phone</strong>
                      <a href="tel:+441753868976">01753 868 976</a>
                    </div>
                  </div>
                  <div class="hq-location-hero__detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <div>
                      <strong>Email</strong>
                      <a href="mailto:info@hqaviation.com">info@hqaviation.com</a>
                    </div>
                  </div>
                </div>
                <div class="hq-location-hero__directions">
                  <a href="https://goo.gl/maps/xyz" class="hq-btn hq-btn--primary" target="_blank">Get Directions</a>
                  <a href="#fly-in" class="hq-btn hq-btn--outline">Fly-In Information</a>
                </div>
              </div>
            </div>
          </section>`
      },
      {
        id: 'contact-callback-form',
        category: 'Callback',
        name: 'Request Callback',
        desc: 'Simple callback request with time preference.',
        html: `
          <section class="hq-section hq-section--dark hq-callback">
            <div class="hq-container">
              <div class="hq-callback__layout">
                <div class="hq-callback__content">
                  <span class="hq-overline hq-overline--light">Let's Talk</span>
                  <h2 class="hq-section__title hq-section__title--light">Request a Callback</h2>
                  <p>Leave your details and we'll call you back at a time that suits you. No sales pressure, just a friendly chat about how we can help.</p>
                  <div class="hq-callback__promise">
                    <div class="hq-callback__promise-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Response within 4 hours</span>
                    </div>
                    <div class="hq-callback__promise-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Speak to an expert, not a call centre</span>
                    </div>
                    <div class="hq-callback__promise-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>No obligation, ever</span>
                    </div>
                  </div>
                </div>
                <form class="hq-callback__form">
                  <div class="hq-form__field">
                    <label class="hq-label hq-label--light">Your Name</label>
                    <input type="text" class="hq-input hq-input--dark" required>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label hq-label--light">Phone Number</label>
                    <input type="tel" class="hq-input hq-input--dark" required>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label hq-label--light">Best Time to Call</label>
                    <select class="hq-select hq-select--dark">
                      <option>Morning (9am - 12pm)</option>
                      <option>Afternoon (12pm - 5pm)</option>
                      <option>Evening (5pm - 7pm)</option>
                      <option>Anytime</option>
                    </select>
                  </div>
                  <div class="hq-form__field">
                    <label class="hq-label hq-label--light">What's this about?</label>
                    <select class="hq-select hq-select--dark">
                      <option>Aircraft Purchase</option>
                      <option>Flight Training</option>
                      <option>Maintenance</option>
                      <option>Selling My Aircraft</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <button type="submit" class="hq-btn hq-btn--primary hq-btn--full">Request Callback</button>
                </form>
              </div>
            </div>
          </section>`
      },
      {
        id: 'contact-sticky-cta',
        category: 'Sticky',
        name: 'Sticky Contact Bar',
        desc: 'Fixed bottom contact bar.',
        html: `
          <div class="hq-sticky-cta">
            <div class="hq-container">
              <div class="hq-sticky-cta__content">
                <div class="hq-sticky-cta__text">
                  <strong>Ready to take the next step?</strong>
                  <span>Speak to our team today</span>
                </div>
                <div class="hq-sticky-cta__actions">
                  <a href="tel:+441753868976" class="hq-sticky-cta__phone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    01753 868 976
                  </a>
                  <a href="#contact" class="hq-btn hq-btn--primary">Enquire Now</a>
                </div>
              </div>
            </div>
          </div>`
      }
    ],

    // ========================================
    // INSPIRATIONAL QUOTES (Teal Tab)
    // 100 punchy quotes for marketing
    // ========================================
    quotes: [
      // FREEDOM & JOY (1-20)
      { id: 'quote-001', category: 'Freedom', name: 'Rise Above', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"The sky is not the limit. It's home."</blockquote><span class="hq-quote-use">Hero tagline, social media</span></div>` },
      { id: 'quote-002', category: 'Freedom', name: 'No Roads', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Where we're going, we don't need roads."</blockquote><span class="hq-quote-use">Homepage hero, lifestyle</span></div>` },
      { id: 'quote-003', category: 'Freedom', name: 'Break Free', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Break free from traffic. Break free from schedules. Just fly."</blockquote><span class="hq-quote-use">Ownership page</span></div>` },
      { id: 'quote-004', category: 'Freedom', name: 'Your Schedule', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Your aircraft. Your schedule. Your freedom."</blockquote><span class="hq-quote-use">Sales page CTA</span></div>` },
      { id: 'quote-005', category: 'Freedom', name: 'Horizon Calling', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"The horizon is calling. Will you answer?"</blockquote><span class="hq-quote-use">Trial flight promo</span></div>` },
      { id: 'quote-006', category: 'Freedom', name: 'Above It All', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Rise above it all."</blockquote><span class="hq-quote-use">Minimal hero, social</span></div>` },
      { id: 'quote-007', category: 'Freedom', name: 'Escape Gravity', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Escape gravity. Escape the ordinary."</blockquote><span class="hq-quote-use">Lifestyle section</span></div>` },
      { id: 'quote-008', category: 'Freedom', name: 'Vertical Freedom', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Vertical freedom starts here."</blockquote><span class="hq-quote-use">Training page hero</span></div>` },
      { id: 'quote-009', category: 'Freedom', name: 'No Boundaries', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"No runways. No boundaries. No limits."</blockquote><span class="hq-quote-use">Helicopter benefits</span></div>` },
      { id: 'quote-010', category: 'Freedom', name: 'Live Unlimited', desc: 'Freedom theme', html: `<div class="hq-quote-card"><blockquote>"Life is too short for motorways."</blockquote><span class="hq-quote-use">Ownership lifestyle</span></div>` },
      { id: 'quote-011', category: 'Joy', name: 'Pure Joy', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Some things can't be measured in ROI. Joy is one of them."</blockquote><span class="hq-quote-use">Ownership benefits</span></div>` },
      { id: 'quote-012', category: 'Joy', name: 'First Hover', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Your first hover. You'll never forget it."</blockquote><span class="hq-quote-use">Training page</span></div>` },
      { id: 'quote-013', category: 'Joy', name: 'Smile Factor', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Warning: May cause uncontrollable smiling."</blockquote><span class="hq-quote-use">Trial flight, fun tone</span></div>` },
      { id: 'quote-014', category: 'Joy', name: 'Addictive', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Highly addictive. Beautifully so."</blockquote><span class="hq-quote-use">Social media, playful</span></div>` },
      { id: 'quote-015', category: 'Joy', name: 'Monday Feeling', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Find something that makes Monday feel like Friday. We found flying."</blockquote><span class="hq-quote-use">Social, lifestyle</span></div>` },
      { id: 'quote-016', category: 'Joy', name: 'Inner Child', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Your inner child knew. It's time to listen."</blockquote><span class="hq-quote-use">Dream fulfillment</span></div>` },
      { id: 'quote-017', category: 'Joy', name: 'Best Office', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Best office view? 2,000 feet up."</blockquote><span class="hq-quote-use">Pilot lifestyle</span></div>` },
      { id: 'quote-018', category: 'Joy', name: 'Therapy', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Cheaper than therapy. Better views."</blockquote><span class="hq-quote-use">Social, humor</span></div>` },
      { id: 'quote-019', category: 'Joy', name: 'Peace Above', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Up here, emails can't find you."</blockquote><span class="hq-quote-use">Escapism, lifestyle</span></div>` },
      { id: 'quote-020', category: 'Joy', name: 'Alive', desc: 'Joy theme', html: `<div class="hq-quote-card"><blockquote>"Flying doesn't make you feel alive. It makes you realize you weren't before."</blockquote><span class="hq-quote-use">Deep, testimonial style</span></div>` },

      // TRAINING & LEARNING (21-40)
      { id: 'quote-021', category: 'Training', name: 'Dream to Reality', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"From dreamer to pilot. We'll get you there."</blockquote><span class="hq-quote-use">Training hero</span></div>` },
      { id: 'quote-022', category: 'Training', name: 'Learn to Fly', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Learn to fly. Learn to live."</blockquote><span class="hq-quote-use">Training page tagline</span></div>` },
      { id: 'quote-023', category: 'Training', name: 'First Step', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Every pilot started exactly where you are now."</blockquote><span class="hq-quote-use">Encouraging, beginner</span></div>` },
      { id: 'quote-024', category: 'Training', name: 'Never Too Late', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"It's never too late to touch the sky."</blockquote><span class="hq-quote-use">Mature learners</span></div>` },
      { id: 'quote-025', category: 'Training', name: '45 Hours', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"45 hours between you and a license. What are you waiting for?"</blockquote><span class="hq-quote-use">Direct CTA</span></div>` },
      { id: 'quote-026', category: 'Training', name: 'Wings Not Given', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Wings aren't given. They're earned."</blockquote><span class="hq-quote-use">Achievement, motivation</span></div>` },
      { id: 'quote-027', category: 'Training', name: 'One Lesson', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"One lesson changes everything."</blockquote><span class="hq-quote-use">Trial flight</span></div>` },
      { id: 'quote-028', category: 'Training', name: 'Scared Normal', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Being nervous is normal. Not trying isn't."</blockquote><span class="hq-quote-use">Overcoming fear</span></div>` },
      { id: 'quote-029', category: 'Training', name: 'Controls Ready', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"You have control."</blockquote><span class="hq-quote-use">Pilot phrase, empowering</span></div>` },
      { id: 'quote-030', category: 'Training', name: 'Solo Day', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"The day you solo, everything changes."</blockquote><span class="hq-quote-use">Milestone celebration</span></div>` },
      { id: 'quote-031', category: 'Training', name: 'Patient Skies', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"The sky is patient. So are we."</blockquote><span class="hq-quote-use">Instructor philosophy</span></div>` },
      { id: 'quote-032', category: 'Training', name: 'At Your Pace', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Your pace. Your journey. Your wings."</blockquote><span class="hq-quote-use">Flexible training</span></div>` },
      { id: 'quote-033', category: 'Training', name: 'Dream Starter', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"£299 to start a dream. What's stopping you?"</blockquote><span class="hq-quote-use">Trial flight promo</span></div>` },
      { id: 'quote-034', category: 'Training', name: 'Bucket List', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Cross it off the bucket list. Then make it your life."</blockquote><span class="hq-quote-use">Aspiration to reality</span></div>` },
      { id: 'quote-035', category: 'Training', name: 'Age No Barrier', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"17 or 70. The sky doesn't check IDs."</blockquote><span class="hq-quote-use">Age inclusivity</span></div>` },
      { id: 'quote-036', category: 'Training', name: 'Trust Process', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Trust the process. Trust your instructor. Trust yourself."</blockquote><span class="hq-quote-use">Learning mindset</span></div>` },
      { id: 'quote-037', category: 'Training', name: 'Master Hover', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Master the hover. Master the helicopter."</blockquote><span class="hq-quote-use">Training fundamental</span></div>` },
      { id: 'quote-038', category: 'Training', name: 'PPL Pride', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"PPL(H): Three letters that change your life."</blockquote><span class="hq-quote-use">License achievement</span></div>` },
      { id: 'quote-039', category: 'Training', name: 'Instructor Hand', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"A great instructor doesn't teach you to fly. They help you discover you already can."</blockquote><span class="hq-quote-use">Instructor tribute</span></div>` },
      { id: 'quote-040', category: 'Training', name: 'Started Somewhere', desc: 'Training journey', html: `<div class="hq-quote-card"><blockquote>"Chris has 8,000 hours. He started with zero too."</blockquote><span class="hq-quote-use">Relatable, encouraging</span></div>` },

      // OWNERSHIP & LIFESTYLE (41-60)
      { id: 'quote-041', category: 'Ownership', name: 'Own The Sky', desc: 'Ownership pride', html: `<div class="hq-quote-card"><blockquote>"Own the sky."</blockquote><span class="hq-quote-use">Sales page hero, bold</span></div>` },
      { id: 'quote-042', category: 'Ownership', name: 'Not Just Aircraft', desc: 'Ownership pride', html: `<div class="hq-quote-card"><blockquote>"You're not buying an aircraft. You're buying freedom."</blockquote><span class="hq-quote-use">Sales philosophy</span></div>` },
      { id: 'quote-043', category: 'Ownership', name: 'Time Machine', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"A helicopter isn't transport. It's a time machine."</blockquote><span class="hq-quote-use">Time savings</span></div>` },
      { id: 'quote-044', category: 'Ownership', name: 'Skip Traffic', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"M25? Never heard of it."</blockquote><span class="hq-quote-use">UK-specific, witty</span></div>` },
      { id: 'quote-045', category: 'Ownership', name: 'Land Anywhere', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"Land where others can only dream of parking."</blockquote><span class="hq-quote-use">Access benefits</span></div>` },
      { id: 'quote-046', category: 'Ownership', name: 'Door to Door', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"Door to door. Garden to garden. Life without limits."</blockquote><span class="hq-quote-use">Convenience</span></div>` },
      { id: 'quote-047', category: 'Ownership', name: 'Business Asset', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"An asset that pays dividends in time."</blockquote><span class="hq-quote-use">Business case</span></div>` },
      { id: 'quote-048', category: 'Ownership', name: 'Monday Meeting', desc: 'Ownership lifestyle', html: `<div class="hq-quote-card"><blockquote>"London for breakfast. Edinburgh for lunch. Home for dinner."</blockquote><span class="hq-quote-use">Day trip capability</span></div>` },
      { id: 'quote-049', category: 'Ownership', name: 'Private View', desc: 'Ownership lifestyle', html: `<div class="hq-quote-card"><blockquote>"The best views aren't shared on Instagram. They're through your windscreen."</blockquote><span class="hq-quote-use">Exclusive experience</span></div>` },
      { id: 'quote-050', category: 'Ownership', name: 'Investment', desc: 'Ownership benefits', html: `<div class="hq-quote-card"><blockquote>"The best investment? One that gives returns in memories."</blockquote><span class="hq-quote-use">Emotional ROI</span></div>` },
      { id: 'quote-051', category: 'Lifestyle', name: 'Weekend Reimagined', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Reimagine your weekends."</blockquote><span class="hq-quote-use">Lifestyle transformation</span></div>` },
      { id: 'quote-052', category: 'Lifestyle', name: 'Spontaneous', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Let's go. Right now. Because you can."</blockquote><span class="hq-quote-use">Spontaneity</span></div>` },
      { id: 'quote-053', category: 'Lifestyle', name: 'Family Adventures', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Adventures that your kids will tell their kids about."</blockquote><span class="hq-quote-use">Family legacy</span></div>` },
      { id: 'quote-054', category: 'Lifestyle', name: 'Cool Parent', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"School pickup just got interesting."</blockquote><span class="hq-quote-use">Fun, family</span></div>` },
      { id: 'quote-055', category: 'Lifestyle', name: 'Date Night', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Dinner reservations? How about lunch in Paris instead."</blockquote><span class="hq-quote-use">Romance, luxury</span></div>` },
      { id: 'quote-056', category: 'Lifestyle', name: 'Golf Trip', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Same tee time. Different continent."</blockquote><span class="hq-quote-use">Golf lifestyle</span></div>` },
      { id: 'quote-057', category: 'Lifestyle', name: 'Yacht Tender', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Skip the tender. Land on deck."</blockquote><span class="hq-quote-use">Yacht owners</span></div>` },
      { id: 'quote-058', category: 'Lifestyle', name: 'Remote Cottage', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"That remote cottage? It's 20 minutes away now."</blockquote><span class="hq-quote-use">Second home access</span></div>` },
      { id: 'quote-059', category: 'Lifestyle', name: 'Commute Upgrade', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"Upgrade your commute. Upgrade your life."</blockquote><span class="hq-quote-use">Business use</span></div>` },
      { id: 'quote-060', category: 'Lifestyle', name: 'New Perspective', desc: 'Lifestyle benefits', html: `<div class="hq-quote-card"><blockquote>"New perspectives aren't found on the ground."</blockquote><span class="hq-quote-use">Philosophy, views</span></div>` },

      // HQ AVIATION BRAND (61-80)
      { id: 'quote-061', category: 'HQ Brand', name: '30 Years', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"30 years of making dreams airborne."</blockquote><span class="hq-quote-use">Heritage, trust</span></div>` },
      { id: 'quote-062', category: 'HQ Brand', name: 'UK Leader', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"The UK's most trusted name in Robinson helicopters."</blockquote><span class="hq-quote-use">Brand positioning</span></div>` },
      { id: 'quote-063', category: 'HQ Brand', name: 'One Relationship', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"One relationship. Complete peace of mind."</blockquote><span class="hq-quote-use">Full-service promise</span></div>` },
      { id: 'quote-064', category: 'HQ Brand', name: 'Buy Once', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"Buy from HQ. Fly with confidence. Forever."</blockquote><span class="hq-quote-use">Lifetime relationship</span></div>` },
      { id: 'quote-065', category: 'HQ Brand', name: '500 Aircraft', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"500+ aircraft delivered. Each one a story."</blockquote><span class="hq-quote-use">Track record</span></div>` },
      { id: 'quote-066', category: 'HQ Brand', name: '1000 Pilots', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"1,000+ pilots trained. You could be next."</blockquote><span class="hq-quote-use">Training credentials</span></div>` },
      { id: 'quote-067', category: 'HQ Brand', name: 'Family Business', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"A family business that treats you like family."</blockquote><span class="hq-quote-use">Personal service</span></div>` },
      { id: 'quote-068', category: 'HQ Brand', name: 'Under One Roof', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"Sales. Training. Maintenance. All under one roof."</blockquote><span class="hq-quote-use">Full service</span></div>` },
      { id: 'quote-069', category: 'HQ Brand', name: 'Authorized', desc: 'HQ credentials', html: `<div class="hq-quote-card"><blockquote>"Robinson authorized. Owner approved."</blockquote><span class="hq-quote-use">Credentials</span></div>` },
      { id: 'quote-070', category: 'HQ Brand', name: 'Beyond Sale', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"Our relationship doesn't end at the sale. It starts there."</blockquote><span class="hq-quote-use">Ongoing support</span></div>` },
      { id: 'quote-071', category: 'HQ Brand', name: 'Expert Team', desc: 'HQ team', html: `<div class="hq-quote-card"><blockquote>"Expert hands. Passionate hearts."</blockquote><span class="hq-quote-use">Team values</span></div>` },
      { id: 'quote-072', category: 'HQ Brand', name: 'Factory Trained', desc: 'HQ credentials', html: `<div class="hq-quote-card"><blockquote>"Factory-trained engineers. Factory-level care."</blockquote><span class="hq-quote-use">Maintenance quality</span></div>` },
      { id: 'quote-073', category: 'HQ Brand', name: 'EASA Pride', desc: 'HQ credentials', html: `<div class="hq-quote-card"><blockquote>"EASA Part-145. Because your safety isn't negotiable."</blockquote><span class="hq-quote-use">Certification</span></div>` },
      { id: 'quote-074', category: 'HQ Brand', name: 'Denham Home', desc: 'HQ location', html: `<div class="hq-quote-card"><blockquote>"Denham. Where aviation dreams come home."</blockquote><span class="hq-quote-use">Location pride</span></div>` },
      { id: 'quote-075', category: 'HQ Brand', name: 'Parts Ready', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"£500k in parts stock. Zero waiting."</blockquote><span class="hq-quote-use">Parts availability</span></div>` },
      { id: 'quote-076', category: 'HQ Brand', name: 'AOG Promise', desc: 'HQ service', html: `<div class="hq-quote-card"><blockquote>"Grounded? Not for long."</blockquote><span class="hq-quote-use">AOG support</span></div>` },
      { id: 'quote-077', category: 'HQ Brand', name: 'Pass Rate', desc: 'HQ training', html: `<div class="hq-quote-card"><blockquote>"98% pass rate. 100% dedication."</blockquote><span class="hq-quote-use">Training success</span></div>` },
      { id: 'quote-078', category: 'HQ Brand', name: 'Built on Trust', desc: 'HQ values', html: `<div class="hq-quote-card"><blockquote>"Built on trust. Proven by time."</blockquote><span class="hq-quote-use">Brand values</span></div>` },
      { id: 'quote-079', category: 'HQ Brand', name: 'Your Partner', desc: 'HQ relationship', html: `<div class="hq-quote-card"><blockquote>"Your aviation partner for life."</blockquote><span class="hq-quote-use">Partnership</span></div>` },
      { id: 'quote-080', category: 'HQ Brand', name: 'Quentin Vision', desc: 'HQ heritage', html: `<div class="hq-quote-card"><blockquote>"One man's passion. Thousands of pilots' dreams."</blockquote><span class="hq-quote-use">Founder tribute</span></div>` },

      // ROBINSON & AIRCRAFT (81-90)
      { id: 'quote-081', category: 'Robinson', name: 'R22 Spirit', desc: 'Aircraft', html: `<div class="hq-quote-card"><blockquote>"R22. Where legends begin."</blockquote><span class="hq-quote-use">R22 training</span></div>` },
      { id: 'quote-082', category: 'Robinson', name: 'R44 Versatility', desc: 'Aircraft', html: `<div class="hq-quote-card"><blockquote>"R44. Four seats. Infinite possibilities."</blockquote><span class="hq-quote-use">R44 promotion</span></div>` },
      { id: 'quote-083', category: 'Robinson', name: 'R66 Power', desc: 'Aircraft', html: `<div class="hq-quote-card"><blockquote>"R66. Turbine dreams, Robinson reliability."</blockquote><span class="hq-quote-use">R66 hero</span></div>` },
      { id: 'quote-084', category: 'Robinson', name: 'Best Seller', desc: 'Aircraft', html: `<div class="hq-quote-card"><blockquote>"The world's best-selling helicopters. For a reason."</blockquote><span class="hq-quote-use">Robinson range</span></div>` },
      { id: 'quote-085', category: 'Robinson', name: 'Proven Design', desc: 'Aircraft', html: `<div class="hq-quote-card"><blockquote>"Proven. Refined. Perfected."</blockquote><span class="hq-quote-use">Robinson heritage</span></div>` },
      { id: 'quote-086', category: 'Robinson', name: 'Factory New', desc: 'Sales', html: `<div class="hq-quote-card"><blockquote>"Factory fresh. Configured for you."</blockquote><span class="hq-quote-use">New aircraft sales</span></div>` },
      { id: 'quote-087', category: 'Robinson', name: 'Pre-Owned Quality', desc: 'Sales', html: `<div class="hq-quote-card"><blockquote>"Pre-owned by one. Loved by HQ."</blockquote><span class="hq-quote-use">Used aircraft</span></div>` },
      { id: 'quote-088', category: 'Robinson', name: 'Right Aircraft', desc: 'Sales', html: `<div class="hq-quote-card"><blockquote>"The right aircraft for the right mission."</blockquote><span class="hq-quote-use">Consultation</span></div>` },
      { id: 'quote-089', category: 'Robinson', name: 'Your Spec', desc: 'Sales', html: `<div class="hq-quote-card"><blockquote>"Your spec. Your colors. Your aircraft."</blockquote><span class="hq-quote-use">Customization</span></div>` },
      { id: 'quote-090', category: 'Robinson', name: 'Frank Robinson', desc: 'Heritage', html: `<div class="hq-quote-card"><blockquote>"Frank Robinson had a vision. You're living it."</blockquote><span class="hq-quote-use">Brand tribute</span></div>` },

      // CALLS TO ACTION (91-100)
      { id: 'quote-091', category: 'CTA', name: 'Start Today', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"The best time to start was yesterday. The next best time is now."</blockquote><span class="hq-quote-use">Action CTA</span></div>` },
      { id: 'quote-092', category: 'CTA', name: 'What If', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"What if you stopped saying 'one day' and started saying 'day one'?"</blockquote><span class="hq-quote-use">Motivation CTA</span></div>` },
      { id: 'quote-093', category: 'CTA', name: 'Call Us', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Let's talk. No pressure. Just passion."</blockquote><span class="hq-quote-use">Contact CTA</span></div>` },
      { id: 'quote-094', category: 'CTA', name: 'Book Now', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Book today. Thank yourself tomorrow."</blockquote><span class="hq-quote-use">Booking CTA</span></div>` },
      { id: 'quote-095', category: 'CTA', name: 'Visit Us', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Come for a tour. Leave with a dream."</blockquote><span class="hq-quote-use">Visit CTA</span></div>` },
      { id: 'quote-096', category: 'CTA', name: 'Gift Flight', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Give the gift of flight. Change a life."</blockquote><span class="hq-quote-use">Gift voucher</span></div>` },
      { id: 'quote-097', category: 'CTA', name: 'Questions', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Questions? We've got answers. And coffee."</blockquote><span class="hq-quote-use">Friendly contact</span></div>` },
      { id: 'quote-098', category: 'CTA', name: 'Ready When', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Ready when you are."</blockquote><span class="hq-quote-use">Simple CTA</span></div>` },
      { id: 'quote-099', category: 'CTA', name: 'Join Us', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Join the 1,000+ pilots who started right here."</blockquote><span class="hq-quote-use">Community CTA</span></div>` },
      { id: 'quote-100', category: 'CTA', name: 'Your Turn', desc: 'Call to action', html: `<div class="hq-quote-card"><blockquote>"Your turn to fly."</blockquote><span class="hq-quote-use">Hero CTA, powerful</span></div>` }
    ],

    // ========================================
    // HQ AVIATION SHOWCASE (Burgundy Tab)
    // 20 premium service storytelling components
    // ========================================
    showcase: [
      // YOUR AVIATION PARTNER
      {
        id: 'showcase-aviation-partner',
        category: 'Partner',
        name: 'Your Complete Aviation Partner',
        desc: 'Full-service overview with elegant service pillars.',
        html: `
          <section class="hq-showcase hq-showcase--partner">
            <div class="hq-container">
              <div class="hq-showcase__header">
                <span class="hq-showcase__eyebrow">HQ Aviation</span>
                <h2 class="hq-showcase__title">Your Complete<br><em>Aviation Partner</em></h2>
                <p class="hq-showcase__lead">From your first trial flight to owning your own aircraft and beyond. One trusted partner for every stage of your aviation journey.</p>
              </div>
              <div class="hq-showcase__pillars">
                <div class="hq-showcase__pillar">
                  <div class="hq-showcase__pillar-icon">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="18"/><path d="M24 12v24M12 24h24"/><circle cx="24" cy="24" r="6"/></svg>
                  </div>
                  <h3>Aircraft Sales</h3>
                  <p>New Robinson helicopters factory-configured to your specification. Pre-owned aircraft inspected and certified by our engineers.</p>
                  <span class="hq-showcase__pillar-stat">500+ aircraft sold</span>
                </div>
                <div class="hq-showcase__pillar">
                  <div class="hq-showcase__pillar-icon">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 36V24l12-12 12 12v12"/><path d="M20 36V28h8v8"/></svg>
                  </div>
                  <h3>Flight Training</h3>
                  <p>CAA-approved school with experienced instructors. From zero experience to PPL(H) and beyond with 1-to-1 training.</p>
                  <span class="hq-showcase__pillar-stat">1,000+ pilots trained</span>
                </div>
                <div class="hq-showcase__pillar">
                  <div class="hq-showcase__pillar-icon">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 12l-6 24h24l-6-24"/><circle cx="24" cy="30" r="6"/><path d="M24 24v6"/></svg>
                  </div>
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved facility with factory-trained engineers. Annual inspections, overhauls, and repairs you can trust.</p>
                  <span class="hq-showcase__pillar-stat">30+ years expertise</span>
                </div>
                <div class="hq-showcase__pillar">
                  <div class="hq-showcase__pillar-icon">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="16" width="28" height="20" rx="2"/><path d="M16 16V12a8 8 0 0116 0v4"/><circle cx="24" cy="28" r="4"/></svg>
                  </div>
                  <h3>Parts Supply</h3>
                  <p>Extensive Robinson parts inventory with worldwide shipping. Same-day dispatch keeps you flying without delay.</p>
                  <span class="hq-showcase__pillar-stat">Next-day delivery UK</span>
                </div>
              </div>
              <div class="hq-showcase__cta">
                <a href="tel:+441onal753868976" class="hq-btn hq-btn--outline">Call 01753 868 976</a>
                <a href="#contact" class="hq-btn hq-btn--primary">Start Your Journey</a>
              </div>
            </div>
          </section>`
      },

      // AIRCRAFT SALES STORY
      {
        id: 'showcase-sales-story',
        category: 'Sales',
        name: 'Finding Your Perfect Aircraft',
        desc: 'Guided buying journey with personalized approach.',
        html: `
          <section class="hq-showcase hq-showcase--sales-story">
            <div class="hq-container">
              <div class="hq-showcase__split">
                <div class="hq-showcase__content">
                  <span class="hq-showcase__eyebrow">Aircraft Sales</span>
                  <h2 class="hq-showcase__title">Finding Your<br><em>Perfect Aircraft</em></h2>
                  <p class="hq-showcase__text">Every pilot's needs are different. Whether you're a first-time buyer seeking training reliability, a business owner needing point-to-point transport, or a family wanting weekend adventures—we'll match you with the right Robinson.</p>

                  <div class="hq-showcase__journey">
                    <div class="hq-showcase__journey-step">
                      <span class="hq-showcase__step-num">01</span>
                      <div>
                        <h4>Consultation</h4>
                        <p>Discuss your mission, budget, and preferences</p>
                      </div>
                    </div>
                    <div class="hq-showcase__journey-step">
                      <span class="hq-showcase__step-num">02</span>
                      <div>
                        <h4>Selection</h4>
                        <p>New factory order or curated pre-owned options</p>
                      </div>
                    </div>
                    <div class="hq-showcase__journey-step">
                      <span class="hq-showcase__step-num">03</span>
                      <div>
                        <h4>Handover</h4>
                        <p>Full familiarization and ongoing support</p>
                      </div>
                    </div>
                  </div>

                  <a href="#sales" class="hq-btn hq-btn--primary">Explore Our Inventory</a>
                </div>
                <div class="hq-showcase__visual">
                  <div class="hq-showcase__image-stack">
                    <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66 Turbine" class="hq-showcase__img-main">
                    <div class="hq-showcase__img-badge">
                      <span>UK's Premier</span>
                      <strong>Robinson Dealer</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },

      // NEW VS PRE-OWNED
      {
        id: 'showcase-new-preowned',
        category: 'Sales',
        name: 'New vs Pre-Owned Guide',
        desc: 'Side-by-side comparison helping buyers decide.',
        html: `
          <section class="hq-showcase hq-showcase--comparison">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Which Path Is Right For You?</span>
                <h2 class="hq-showcase__title">New or Pre-Owned</h2>
                <p class="hq-showcase__lead">Both paths lead to flight. Here's how to choose.</p>
              </div>

              <div class="hq-showcase__compare-grid">
                <div class="hq-showcase__compare-card hq-showcase__compare-card--new">
                  <div class="hq-showcase__compare-header">
                    <h3>Factory New</h3>
                    <span class="hq-showcase__compare-tag">Configure to Spec</span>
                  </div>
                  <ul class="hq-showcase__compare-list">
                    <li>Choose your exact configuration</li>
                    <li>Select colors, avionics, options</li>
                    <li>Full Robinson factory warranty</li>
                    <li>Latest safety features included</li>
                    <li>Direct relationship with factory</li>
                    <li>Financing packages available</li>
                  </ul>
                  <div class="hq-showcase__compare-note">
                    <strong>Lead time:</strong> 6-12 months depending on configuration
                  </div>
                  <a href="#new-aircraft" class="hq-btn hq-btn--outline">Configure New Aircraft</a>
                </div>

                <div class="hq-showcase__compare-card hq-showcase__compare-card--preowned">
                  <div class="hq-showcase__compare-header">
                    <h3>HQ Pre-Owned</h3>
                    <span class="hq-showcase__compare-tag">Ready Now</span>
                  </div>
                  <ul class="hq-showcase__compare-list">
                    <li>Immediate availability</li>
                    <li>HQ inspected and certified</li>
                    <li>Full maintenance history reviewed</li>
                    <li>Lower initial investment</li>
                    <li>Trade-in options available</li>
                    <li>Upgrade path to new aircraft</li>
                  </ul>
                  <div class="hq-showcase__compare-note">
                    <strong>Current stock:</strong> R22s, R44s, and R66s available
                  </div>
                  <a href="#preowned" class="hq-btn hq-btn--primary">View Available Aircraft</a>
                </div>
              </div>

              <div class="hq-showcase__compare-footer">
                <p>Not sure which route is right? <a href="#contact">Talk to our sales team</a> for personalized guidance.</p>
              </div>
            </div>
          </section>`
      },

      // TRAINING TRANSFORMATION
      {
        id: 'showcase-training-transform',
        category: 'Training',
        name: 'From Student to Pilot',
        desc: 'Emotional training journey visualization.',
        html: `
          <section class="hq-showcase hq-showcase--transform">
            <div class="hq-container">
              <div class="hq-showcase__transform-hero">
                <div class="hq-showcase__transform-before">
                  <span class="hq-showcase__transform-label">Day 1</span>
                  <h3>"I've never flown before"</h3>
                  <p>Nervous excitement, a dream waiting to happen</p>
                </div>
                <div class="hq-showcase__transform-arrow">
                  <svg viewBox="0 0 100 24"><path d="M0 12h90M90 12l-8-8M90 12l-8 8" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                </div>
                <div class="hq-showcase__transform-after">
                  <span class="hq-showcase__transform-label">45+ Hours Later</span>
                  <h3>"I have control"</h3>
                  <p>Licensed pilot, limitless horizons</p>
                </div>
              </div>

              <div class="hq-showcase__transform-content">
                <h2 class="hq-showcase__title">Your <em>Transformation</em> Begins Here</h2>
                <p class="hq-showcase__text">Every pilot in our community started exactly where you are now. That mix of excitement and uncertainty? We understand it. Our CAA-approved training program is designed to transform complete beginners into confident, competent helicopter pilots.</p>

                <div class="hq-showcase__milestones">
                  <div class="hq-showcase__milestone">
                    <span class="hq-showcase__milestone-hours">1</span>
                    <span class="hq-showcase__milestone-text">First hover attempt</span>
                  </div>
                  <div class="hq-showcase__milestone">
                    <span class="hq-showcase__milestone-hours">10</span>
                    <span class="hq-showcase__milestone-text">Circuit work begins</span>
                  </div>
                  <div class="hq-showcase__milestone">
                    <span class="hq-showcase__milestone-hours">20</span>
                    <span class="hq-showcase__milestone-text">First solo flight</span>
                  </div>
                  <div class="hq-showcase__milestone">
                    <span class="hq-showcase__milestone-hours">35</span>
                    <span class="hq-showcase__milestone-text">Navigation qualifying</span>
                  </div>
                  <div class="hq-showcase__milestone">
                    <span class="hq-showcase__milestone-hours">45+</span>
                    <span class="hq-showcase__milestone-text">Skills test passed</span>
                  </div>
                </div>

                <div class="hq-showcase__transform-cta">
                  <a href="#trial" class="hq-btn hq-btn--primary hq-btn--lg">Book Your Trial Flight - £299</a>
                  <span class="hq-showcase__transform-note">No commitment. Just discovery.</span>
                </div>
              </div>
            </div>
          </section>`
      },

      // TRAINING ENVIRONMENT
      {
        id: 'showcase-training-environment',
        category: 'Training',
        name: 'The HQ Training Experience',
        desc: 'What makes training at HQ special.',
        html: `
          <section class="hq-showcase hq-showcase--environment">
            <div class="hq-container">
              <div class="hq-showcase__header">
                <span class="hq-showcase__eyebrow">Flight Training</span>
                <h2 class="hq-showcase__title">Why Students<br><em>Choose HQ</em></h2>
              </div>

              <div class="hq-showcase__features-grid">
                <div class="hq-showcase__feature-card hq-showcase__feature-card--large">
                  <div class="hq-showcase__feature-img">
                    <img src="/assets/images/training/home-2312.jpg" alt="R22 Training">
                  </div>
                  <div class="hq-showcase__feature-content">
                    <h3>1-to-1 Instruction</h3>
                    <p>Every lesson is personal. Our experienced instructors adapt to your learning style, ensuring you progress at the right pace. No group sessions, no waiting—just focused flight time.</p>
                  </div>
                </div>

                <div class="hq-showcase__feature-card">
                  <div class="hq-showcase__feature-icon">
                    <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 20l6 6 10-12" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                  </div>
                  <h3>Modern Fleet</h3>
                  <p>Train on well-maintained R22s and R44s with modern avionics. Our aircraft are maintained by our own EASA Part-145 engineers.</p>
                </div>

                <div class="hq-showcase__feature-card">
                  <div class="hq-showcase__feature-icon">
                    <svg viewBox="0 0 40 40"><path d="M20 4v16l12 8-12-8-12 8 12-8V4z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
                  </div>
                  <h3>Flexible Scheduling</h3>
                  <p>Weekend warrior or intensive course? We work around your life. Many students complete PPL(H) while maintaining full-time careers.</p>
                </div>

                <div class="hq-showcase__feature-card">
                  <div class="hq-showcase__feature-icon">
                    <svg viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 18h6M12 22h10" stroke="currentColor" stroke-width="1.5"/></svg>
                  </div>
                  <h3>Ground School Included</h3>
                  <p>Theory exams don't have to be daunting. Our ground school sessions prepare you thoroughly for all nine required exams.</p>
                </div>

                <div class="hq-showcase__feature-card">
                  <div class="hq-showcase__feature-icon">
                    <svg viewBox="0 0 40 40"><path d="M20 8c-6 0-12 8-12 12s6 12 12 12 12-8 12-12-6-12-12-12z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
                  </div>
                  <h3>Post-License Support</h3>
                  <p>Your relationship with HQ doesn't end at license. Ongoing mentorship, type ratings, and currency training available.</p>
                </div>
              </div>

              <div class="hq-showcase__cta hq-showcase__cta--centered">
                <a href="#training" class="hq-btn hq-btn--primary">View Training Courses</a>
                <a href="tel:+441753868976" class="hq-btn hq-btn--outline">Call to Discuss</a>
              </div>
            </div>
          </section>`
      },

      // MAINTENANCE PROMISE
      {
        id: 'showcase-maintenance-promise',
        category: 'Maintenance',
        name: 'The Maintenance Promise',
        desc: 'Trust and transparency in aircraft care.',
        html: `
          <section class="hq-showcase hq-showcase--maintenance">
            <div class="hq-container">
              <div class="hq-showcase__split hq-showcase__split--reverse">
                <div class="hq-showcase__visual">
                  <div class="hq-showcase__visual-grid">
                    <div class="hq-showcase__cert-badge">
                      <span class="hq-showcase__cert-title">EASA</span>
                      <span class="hq-showcase__cert-sub">Part-145 Approved</span>
                    </div>
                    <div class="hq-showcase__cert-badge">
                      <span class="hq-showcase__cert-title">Robinson</span>
                      <span class="hq-showcase__cert-sub">Factory Trained</span>
                    </div>
                  </div>
                </div>

                <div class="hq-showcase__content">
                  <span class="hq-showcase__eyebrow">Aircraft Maintenance</span>
                  <h2 class="hq-showcase__title">Your Aircraft.<br><em>Our Expertise.</em></h2>
                  <p class="hq-showcase__text">Trust is earned, not given. Our EASA Part-145 approved facility and factory-trained engineers have maintained Robinson helicopters for over three decades. We treat every aircraft as if it were our own.</p>

                  <div class="hq-showcase__promise-list">
                    <div class="hq-showcase__promise-item">
                      <span class="hq-showcase__promise-icon">✓</span>
                      <div>
                        <strong>Transparent Pricing</strong>
                        <p>Detailed quotes before work begins. No surprises.</p>
                      </div>
                    </div>
                    <div class="hq-showcase__promise-item">
                      <span class="hq-showcase__promise-icon">✓</span>
                      <div>
                        <strong>Genuine Parts Only</strong>
                        <p>Robinson certified parts from our extensive inventory.</p>
                      </div>
                    </div>
                    <div class="hq-showcase__promise-item">
                      <span class="hq-showcase__promise-icon">✓</span>
                      <div>
                        <strong>Direct Communication</strong>
                        <p>Talk to the engineers working on your aircraft.</p>
                      </div>
                    </div>
                    <div class="hq-showcase__promise-item">
                      <span class="hq-showcase__promise-icon">✓</span>
                      <div>
                        <strong>Documentation Excellence</strong>
                        <p>Full records for every inspection and repair.</p>
                      </div>
                    </div>
                  </div>

                  <a href="#maintenance" class="hq-btn hq-btn--primary">Book Maintenance</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // PARTS SERVICE
      {
        id: 'showcase-parts-service',
        category: 'Parts',
        name: 'Parts When You Need Them',
        desc: 'Speed and reliability of parts supply.',
        html: `
          <section class="hq-showcase hq-showcase--parts">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Parts Supply</span>
                <h2 class="hq-showcase__title">Keeping You <em>Flying</em></h2>
                <p class="hq-showcase__lead">Downtime costs money and frustration. Our extensive parts inventory and rapid dispatch means your aircraft spends less time on the ground.</p>
              </div>

              <div class="hq-showcase__parts-stats">
                <div class="hq-showcase__parts-stat">
                  <span class="hq-showcase__stat-value">10,000+</span>
                  <span class="hq-showcase__stat-label">Parts in Stock</span>
                </div>
                <div class="hq-showcase__parts-stat">
                  <span class="hq-showcase__stat-value">Same Day</span>
                  <span class="hq-showcase__stat-label">UK Dispatch</span>
                </div>
                <div class="hq-showcase__parts-stat">
                  <span class="hq-showcase__stat-value">Worldwide</span>
                  <span class="hq-showcase__stat-label">Shipping</span>
                </div>
                <div class="hq-showcase__parts-stat">
                  <span class="hq-showcase__stat-value">100%</span>
                  <span class="hq-showcase__stat-label">Genuine Parts</span>
                </div>
              </div>

              <div class="hq-showcase__parts-models">
                <h3>Full Support For</h3>
                <div class="hq-showcase__model-badges">
                  <span class="hq-showcase__model-badge">R22 Beta II</span>
                  <span class="hq-showcase__model-badge">R44 Raven I</span>
                  <span class="hq-showcase__model-badge">R44 Raven II</span>
                  <span class="hq-showcase__model-badge">R44 Cadet</span>
                  <span class="hq-showcase__model-badge">R66 Turbine</span>
                </div>
              </div>

              <div class="hq-showcase__parts-cta">
                <div class="hq-showcase__parts-contact">
                  <strong>Need a part urgently?</strong>
                  <a href="tel:+441753868976" class="hq-showcase__phone">01753 868 976</a>
                </div>
                <a href="#parts" class="hq-btn hq-btn--primary">Browse Parts Catalog</a>
              </div>
            </div>
          </section>`
      },

      // THE HQ DIFFERENCE
      {
        id: 'showcase-hq-difference',
        category: 'Brand',
        name: 'The HQ Difference',
        desc: 'What sets HQ apart from others.',
        html: `
          <section class="hq-showcase hq-showcase--difference">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Why HQ</span>
                <h2 class="hq-showcase__title">The <em>HQ</em> Difference</h2>
              </div>

              <div class="hq-showcase__diff-grid">
                <div class="hq-showcase__diff-item">
                  <div class="hq-showcase__diff-comparison">
                    <div class="hq-showcase__diff-others">
                      <span class="hq-showcase__diff-label">Others</span>
                      <p>Multiple suppliers for different needs</p>
                    </div>
                    <div class="hq-showcase__diff-hq">
                      <span class="hq-showcase__diff-label">HQ</span>
                      <p>One trusted partner for everything</p>
                    </div>
                  </div>
                </div>

                <div class="hq-showcase__diff-item">
                  <div class="hq-showcase__diff-comparison">
                    <div class="hq-showcase__diff-others">
                      <span class="hq-showcase__diff-label">Others</span>
                      <p>Sales team separate from maintenance</p>
                    </div>
                    <div class="hq-showcase__diff-hq">
                      <span class="hq-showcase__diff-label">HQ</span>
                      <p>Integrated team who knows your aircraft</p>
                    </div>
                  </div>
                </div>

                <div class="hq-showcase__diff-item">
                  <div class="hq-showcase__diff-comparison">
                    <div class="hq-showcase__diff-others">
                      <span class="hq-showcase__diff-label">Others</span>
                      <p>Transaction-focused relationships</p>
                    </div>
                    <div class="hq-showcase__diff-hq">
                      <span class="hq-showcase__diff-label">HQ</span>
                      <p>Long-term partnership for your journey</p>
                    </div>
                  </div>
                </div>

                <div class="hq-showcase__diff-item">
                  <div class="hq-showcase__diff-comparison">
                    <div class="hq-showcase__diff-others">
                      <span class="hq-showcase__diff-label">Others</span>
                      <p>Wait for parts from external suppliers</p>
                    </div>
                    <div class="hq-showcase__diff-hq">
                      <span class="hq-showcase__diff-label">HQ</span>
                      <p>Extensive stock, same-day dispatch</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="hq-showcase__diff-quote">
                <blockquote>"HQ isn't just where I bought my helicopter. It's where I learned to fly, where it's maintained, and where I know I'm always welcome."</blockquote>
                <cite>— R44 Owner, HQ customer since 2018</cite>
              </div>
            </div>
          </section>`
      },

      // ROBINSON HERITAGE
      {
        id: 'showcase-robinson-heritage',
        category: 'Brand',
        name: 'Robinson Heritage',
        desc: 'The story of Robinson and HQ partnership.',
        html: `
          <section class="hq-showcase hq-showcase--heritage">
            <div class="hq-showcase__heritage-bg">
              <div class="hq-container">
                <div class="hq-showcase__heritage-content">
                  <span class="hq-showcase__eyebrow">Our Heritage</span>
                  <h2 class="hq-showcase__title">A Partnership<br><em>Built on Trust</em></h2>
                  <p class="hq-showcase__text">In 1973, Frank Robinson founded Robinson Helicopter Company with a vision: to build the most reliable, affordable helicopters in the world. Today, Robinson is the world's largest helicopter manufacturer by number of aircraft produced.</p>
                  <p class="hq-showcase__text">Since 1990, HQ Aviation has been proud to represent Robinson in the UK. We share their values: quality, reliability, and putting pilots first. Every aircraft we sell, every pilot we train, every service we provide reflects this shared commitment to excellence.</p>

                  <div class="hq-showcase__heritage-stats">
                    <div class="hq-showcase__heritage-stat">
                      <span>1973</span>
                      <span>Robinson founded</span>
                    </div>
                    <div class="hq-showcase__heritage-stat">
                      <span>1990</span>
                      <span>HQ established</span>
                    </div>
                    <div class="hq-showcase__heritage-stat">
                      <span>30+</span>
                      <span>Years partnership</span>
                    </div>
                    <div class="hq-showcase__heritage-stat">
                      <span>#1</span>
                      <span>UK Robinson dealer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },

      // TRIAL FLIGHT EXPERIENCE
      {
        id: 'showcase-trial-experience',
        category: 'Training',
        name: 'Your Trial Flight',
        desc: 'What to expect from a trial lesson.',
        html: `
          <section class="hq-showcase hq-showcase--trial">
            <div class="hq-container">
              <div class="hq-showcase__trial-header">
                <span class="hq-showcase__eyebrow">Experience It First</span>
                <h2 class="hq-showcase__title">Your First<br><em>Flight Awaits</em></h2>
                <p class="hq-showcase__lead">Not sure if helicopter flying is for you? A trial flight is the perfect way to discover the magic—with no commitment required.</p>
              </div>

              <div class="hq-showcase__trial-timeline">
                <div class="hq-showcase__trial-step">
                  <span class="hq-showcase__trial-time">30 min</span>
                  <div class="hq-showcase__trial-content">
                    <h4>Pre-Flight Briefing</h4>
                    <p>Meet your instructor, learn the basics, and ask any questions. We'll cover safety, controls, and what to expect.</p>
                  </div>
                </div>
                <div class="hq-showcase__trial-step">
                  <span class="hq-showcase__trial-time">30 min</span>
                  <div class="hq-showcase__trial-content">
                    <h4>Your Flight</h4>
                    <p>You'll take the controls under supervision. Experience hovering, forward flight, and turns over beautiful Buckinghamshire.</p>
                  </div>
                </div>
                <div class="hq-showcase__trial-step">
                  <span class="hq-showcase__trial-time">15 min</span>
                  <div class="hq-showcase__trial-content">
                    <h4>Debrief & Discussion</h4>
                    <p>Review your flight, discuss your potential, and if you're hooked—map out your training journey.</p>
                  </div>
                </div>
              </div>

              <div class="hq-showcase__trial-cta">
                <div class="hq-showcase__trial-price">
                  <span class="hq-showcase__price-label">Trial Flight</span>
                  <span class="hq-showcase__price-value">£299</span>
                  <span class="hq-showcase__price-note">~75 minutes total experience</span>
                </div>
                <a href="#book-trial" class="hq-btn hq-btn--primary hq-btn--lg">Book Your Trial</a>
                <p class="hq-showcase__trial-gift">Makes an unforgettable gift. <a href="#vouchers">Gift vouchers available →</a></p>
              </div>
            </div>
          </section>`
      },

      // COST TRANSPARENCY
      {
        id: 'showcase-cost-transparency',
        category: 'Training',
        name: 'What It Really Costs',
        desc: 'Honest pricing breakdown for training.',
        html: `
          <section class="hq-showcase hq-showcase--costs">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Transparent Pricing</span>
                <h2 class="hq-showcase__title">What It <em>Really</em> Costs</h2>
                <p class="hq-showcase__lead">No hidden fees. No surprises. Here's the full picture for your PPL(H).</p>
              </div>

              <div class="hq-showcase__cost-breakdown">
                <div class="hq-showcase__cost-item">
                  <div class="hq-showcase__cost-header">
                    <h4>Flight Training</h4>
                    <span class="hq-showcase__cost-range">£16,000 - £20,000</span>
                  </div>
                  <p>Minimum 45 hours required. Most students complete in 50-60 hours. R22 rate: approx £350/hour dual.</p>
                </div>

                <div class="hq-showcase__cost-item">
                  <div class="hq-showcase__cost-header">
                    <h4>Ground School</h4>
                    <span class="hq-showcase__cost-range">Included</span>
                  </div>
                  <p>Theory training for all 9 exams included in your training package. No extra charge.</p>
                </div>

                <div class="hq-showcase__cost-item">
                  <div class="hq-showcase__cost-header">
                    <h4>Exam Fees</h4>
                    <span class="hq-showcase__cost-range">£500 - £800</span>
                  </div>
                  <p>CAA theory exam fees (9 exams) plus skills test fee. Prices set by CAA.</p>
                </div>

                <div class="hq-showcase__cost-item">
                  <div class="hq-showcase__cost-header">
                    <h4>Medical Certificate</h4>
                    <span class="hq-showcase__cost-range">£200 - £300</span>
                  </div>
                  <p>Class 2 medical required. Arranged through CAA-approved medical examiners.</p>
                </div>

                <div class="hq-showcase__cost-total">
                  <span>Typical Total Investment</span>
                  <strong>£17,000 - £22,000</strong>
                </div>
              </div>

              <div class="hq-showcase__cost-note">
                <p><strong>Payment flexibility:</strong> Pay-as-you-fly available. Block booking discounts. Talk to us about structuring your training investment.</p>
                <a href="#contact" class="hq-btn hq-btn--outline">Discuss Your Training Plan</a>
              </div>
            </div>
          </section>`
      },

      // OWNERSHIP LIFESTYLE
      {
        id: 'showcase-ownership-lifestyle',
        category: 'Lifestyle',
        name: 'Life With Your Helicopter',
        desc: 'The ownership experience and lifestyle.',
        html: `
          <section class="hq-showcase hq-showcase--lifestyle">
            <div class="hq-showcase__lifestyle-hero">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Helicopter lifestyle">
              <div class="hq-showcase__lifestyle-overlay"></div>
              <div class="hq-container">
                <div class="hq-showcase__lifestyle-content">
                  <span class="hq-showcase__eyebrow">Ownership</span>
                  <h2 class="hq-showcase__title">Life With Your<br><em>Helicopter</em></h2>
                  <p class="hq-showcase__text">Ownership changes everything. Weekend trips become adventures. Business meetings across the country become same-day affairs. The horizon isn't a destination—it's a starting point.</p>
                </div>
              </div>
            </div>

            <div class="hq-container">
              <div class="hq-showcase__lifestyle-grid">
                <div class="hq-showcase__lifestyle-card">
                  <span class="hq-showcase__lifestyle-icon">🏡</span>
                  <h4>Door to Door</h4>
                  <p>Land at your destination, not miles away at an airport. From your garden to theirs.</p>
                </div>
                <div class="hq-showcase__lifestyle-card">
                  <span class="hq-showcase__lifestyle-icon">⏱️</span>
                  <h4>Time Freedom</h4>
                  <p>3-hour drives become 45-minute flights. Reclaim your most valuable resource.</p>
                </div>
                <div class="hq-showcase__lifestyle-card">
                  <span class="hq-showcase__lifestyle-icon">👨‍👩‍👧‍👦</span>
                  <h4>Family Adventures</h4>
                  <p>Create memories that your children will tell their children about.</p>
                </div>
                <div class="hq-showcase__lifestyle-card">
                  <span class="hq-showcase__lifestyle-icon">💼</span>
                  <h4>Business Edge</h4>
                  <p>Three client meetings in three cities? Before lunch.</p>
                </div>
              </div>

              <div class="hq-showcase__lifestyle-cta">
                <p>Ready to explore ownership?</p>
                <a href="#sales" class="hq-btn hq-btn--primary">View Available Aircraft</a>
              </div>
            </div>
          </section>`
      },

      // DENHAM LOCATION
      {
        id: 'showcase-denham-location',
        category: 'Location',
        name: 'Visit Us at Denham',
        desc: 'Location information and welcome.',
        html: `
          <section class="hq-showcase hq-showcase--location">
            <div class="hq-container">
              <div class="hq-showcase__split">
                <div class="hq-showcase__content">
                  <span class="hq-showcase__eyebrow">Our Home</span>
                  <h2 class="hq-showcase__title">Find Us at<br><em>Denham Aerodrome</em></h2>
                  <p class="hq-showcase__text">Just 20 minutes from Central London, our purpose-built facility at Denham Aerodrome has been home to HQ Aviation since 1990. Whether you're visiting for a trial flight, collecting a new aircraft, or bringing yours in for service—you're always welcome.</p>

                  <div class="hq-showcase__location-details">
                    <div class="hq-showcase__location-item">
                      <strong>Address</strong>
                      <p>HQ Aviation<br>Denham Aerodrome<br>Tilehouse Lane<br>Denham, Buckinghamshire<br>UB9 5DF</p>
                    </div>
                    <div class="hq-showcase__location-item">
                      <strong>Getting Here</strong>
                      <p>5 mins from M40 Junction 1<br>20 mins from M25 Junction 16<br>Free parking on site</p>
                    </div>
                    <div class="hq-showcase__location-item">
                      <strong>Opening Hours</strong>
                      <p>Monday - Friday: 08:00 - 18:00<br>Saturday: By appointment<br>Sunday: Closed</p>
                    </div>
                  </div>

                  <div class="hq-showcase__location-contact">
                    <a href="tel:+441753868976" class="hq-showcase__contact-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      01753 868 976
                    </a>
                    <a href="mailto:info@hqaviation.com" class="hq-showcase__contact-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      info@hqaviation.com
                    </a>
                  </div>
                </div>

                <div class="hq-showcase__visual">
                  <div class="hq-showcase__map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.8!2d-0.5!3d51.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHQ+Aviation!5e0!3m2!1sen!2suk!4v1" allowfullscreen="" loading="lazy"></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },

      // MEET THE TEAM
      {
        id: 'showcase-meet-team',
        category: 'Team',
        name: 'The People Behind HQ',
        desc: 'Friendly team introduction.',
        html: `
          <section class="hq-showcase hq-showcase--team">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Our Team</span>
                <h2 class="hq-showcase__title">The People<br><em>Behind HQ</em></h2>
                <p class="hq-showcase__lead">We're not a call center. We're pilots, engineers, and aviation enthusiasts who've chosen to make helicopters our life's work.</p>
              </div>

              <div class="hq-showcase__team-grid">
                <div class="hq-showcase__team-member">
                  <div class="hq-showcase__team-role">Sales Director</div>
                  <h4>Chris Sherrington</h4>
                  <p>8,000+ hours | Type-rated on all Robinson models | Here to help you find the perfect aircraft</p>
                </div>
                <div class="hq-showcase__team-member">
                  <div class="hq-showcase__team-role">Chief Engineer</div>
                  <h4>Engineering Team</h4>
                  <p>Factory-trained | EASA licensed | Combined 50+ years Robinson experience</p>
                </div>
                <div class="hq-showcase__team-member">
                  <div class="hq-showcase__team-role">Flight Training</div>
                  <h4>Instructor Team</h4>
                  <p>CAA approved | 1,000+ students trained | Patient, experienced, passionate</p>
                </div>
                <div class="hq-showcase__team-member">
                  <div class="hq-showcase__team-role">Operations</div>
                  <h4>Support Team</h4>
                  <p>Parts, scheduling, admin | The people who keep everything running smoothly</p>
                </div>
              </div>

              <div class="hq-showcase__team-message">
                <p>"We're all here because we love aviation. That passion shows in everything we do. Come visit—we'd love to meet you."</p>
              </div>
            </div>
          </section>`
      },

      // SERVICE LEVELS
      {
        id: 'showcase-service-levels',
        category: 'Maintenance',
        name: 'Maintenance Services',
        desc: 'Clear breakdown of maintenance offerings.',
        html: `
          <section class="hq-showcase hq-showcase--services">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Maintenance</span>
                <h2 class="hq-showcase__title">Our <em>Services</em></h2>
              </div>

              <div class="hq-showcase__services-grid">
                <div class="hq-showcase__service-card">
                  <div class="hq-showcase__service-icon">
                    <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M20 10v10l7 4" stroke="currentColor" stroke-width="2"/></svg>
                  </div>
                  <h3>100-Hour / Annual</h3>
                  <p>Comprehensive inspections meeting Robinson and EASA requirements. Scheduled to minimize your downtime.</p>
                  <span class="hq-showcase__service-note">Typically 2-3 working days</span>
                </div>

                <div class="hq-showcase__service-card">
                  <div class="hq-showcase__service-icon">
                    <svg viewBox="0 0 40 40"><path d="M8 20a12 12 0 1124 0" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M20 32V20M16 28l4 4 4-4" stroke="currentColor" stroke-width="2"/></svg>
                  </div>
                  <h3>Component Overhauls</h3>
                  <p>Engine, gearbox, rotor system overhauls by our factory-trained engineers using genuine parts.</p>
                  <span class="hq-showcase__service-note">Component exchange available</span>
                </div>

                <div class="hq-showcase__service-card">
                  <div class="hq-showcase__service-icon">
                    <svg viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 16h24M16 16v16" stroke="currentColor" stroke-width="1.5"/></svg>
                  </div>
                  <h3>Avionics & Upgrades</h3>
                  <p>Modern glass cockpit installations, radio upgrades, and navigation equipment. Approved modifications.</p>
                  <span class="hq-showcase__service-note">Garmin specialist</span>
                </div>

                <div class="hq-showcase__service-card">
                  <div class="hq-showcase__service-icon">
                    <svg viewBox="0 0 40 40"><path d="M20 8l-12 8v16h24V16z" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="16" y="24" width="8" height="8" stroke="currentColor" stroke-width="1.5"/></svg>
                  </div>
                  <h3>AOG Response</h3>
                  <p>Aircraft on ground? We respond quickly with parts and expertise to get you flying again ASAP.</p>
                  <span class="hq-showcase__service-note">Priority service available</span>
                </div>
              </div>

              <div class="hq-showcase__cta hq-showcase__cta--centered">
                <p>Need maintenance? Get a quote today.</p>
                <a href="#maintenance-quote" class="hq-btn hq-btn--primary">Request Quote</a>
              </div>
            </div>
          </section>`
      },

      // CUSTOMER STORIES
      {
        id: 'showcase-customer-stories',
        category: 'Social',
        name: 'Customer Stories',
        desc: 'Real testimonials with context.',
        html: `
          <section class="hq-showcase hq-showcase--stories">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Our Community</span>
                <h2 class="hq-showcase__title">Stories From<br><em>Our Pilots</em></h2>
              </div>

              <div class="hq-showcase__stories-grid">
                <div class="hq-showcase__story-card hq-showcase__story-card--featured">
                  <blockquote>"I walked in knowing nothing about helicopters and walked out three months later with my PPL(H). The team at HQ didn't just teach me to fly—they made me feel like part of a family. Two years on, I now own an R44 and couldn't imagine going anywhere else."</blockquote>
                  <div class="hq-showcase__story-author">
                    <strong>James T.</strong>
                    <span>R44 Owner | Student to Owner Journey</span>
                  </div>
                </div>

                <div class="hq-showcase__story-card">
                  <blockquote>"When I needed a pre-purchase inspection on an R66, Chris found issues the seller hadn't disclosed. His honesty saved me from a costly mistake. I bought through HQ instead—best decision I ever made."</blockquote>
                  <div class="hq-showcase__story-author">
                    <strong>Michael R.</strong>
                    <span>R66 Owner</span>
                  </div>
                </div>

                <div class="hq-showcase__story-card">
                  <blockquote>"The trial flight for my 60th birthday was supposed to be a one-off treat. Eighteen months later, I passed my skills test. It's never too late."</blockquote>
                  <div class="hq-showcase__story-author">
                    <strong>David H.</strong>
                    <span>New PPL(H) Holder</span>
                  </div>
                </div>

                <div class="hq-showcase__story-card">
                  <blockquote>"Our company R44 hasn't missed a flight in three years thanks to HQ's maintenance team. They know the aircraft, they know our schedule, and they make it work."</blockquote>
                  <div class="hq-showcase__story-author">
                    <strong>Sarah K.</strong>
                    <span>Corporate Flight Ops</span>
                  </div>
                </div>
              </div>

              <div class="hq-showcase__stories-cta">
                <p>Your story could be next.</p>
                <a href="#contact" class="hq-btn hq-btn--outline">Start Your Journey</a>
              </div>
            </div>
          </section>`
      },

      // FAQ SECTION
      {
        id: 'showcase-faq-common',
        category: 'FAQ',
        name: 'Common Questions',
        desc: 'Frequently asked questions answered.',
        html: `
          <section class="hq-showcase hq-showcase--faq">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Questions?</span>
                <h2 class="hq-showcase__title">We've Got <em>Answers</em></h2>
              </div>

              <div class="hq-showcase__faq-grid">
                <div class="hq-showcase__faq-item">
                  <h4>How long does it take to get a helicopter license?</h4>
                  <p>The minimum is 45 hours flight time plus theory exams. Most students complete in 6-12 months training part-time, or 2-3 months intensive. It depends on how frequently you can fly and your learning pace.</p>
                </div>

                <div class="hq-showcase__faq-item">
                  <h4>Do I need any prior experience?</h4>
                  <p>None at all. Our training starts from absolute zero. Many of our students have never been in a helicopter before their first lesson.</p>
                </div>

                <div class="hq-showcase__faq-item">
                  <h4>What's the difference between R22, R44, and R66?</h4>
                  <p>R22 is a 2-seat trainer, perfect for learning. R44 seats 4 and is the world's best-selling civilian helicopter. R66 is a 5-seat turbine for those wanting more power and payload. We can help you choose.</p>
                </div>

                <div class="hq-showcase__faq-item">
                  <h4>Can I land a helicopter in my garden?</h4>
                  <p>Potentially, yes—subject to local planning permission and some operational requirements. Many private owners do exactly this. We can advise on what's involved.</p>
                </div>

                <div class="hq-showcase__faq-item">
                  <h4>What medical do I need?</h4>
                  <p>A Class 2 medical certificate, which most reasonably healthy people can obtain. It's similar to what you'd need for a private pilot's license for fixed-wing aircraft.</p>
                </div>

                <div class="hq-showcase__faq-item">
                  <h4>How much does it cost to own a helicopter?</h4>
                  <p>Purchase price is just the start—budget for insurance, maintenance reserves, hangarage, and fuel. For an R44, expect £30-50k annually in operating costs. We can provide detailed estimates.</p>
                </div>
              </div>

              <div class="hq-showcase__faq-more">
                <p>Have a question not answered here?</p>
                <a href="tel:+441753868976" class="hq-btn hq-btn--primary">Call Us: 01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // NEXT STEPS
      {
        id: 'showcase-next-steps',
        category: 'CTA',
        name: 'Your Next Step',
        desc: 'Clear call-to-action with multiple paths.',
        html: `
          <section class="hq-showcase hq-showcase--nextsteps">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <h2 class="hq-showcase__title">Your Next <em>Step</em></h2>
                <p class="hq-showcase__lead">Every journey starts somewhere. Where would you like to begin?</p>
              </div>

              <div class="hq-showcase__paths">
                <a href="#trial" class="hq-showcase__path-card">
                  <div class="hq-showcase__path-icon">🚁</div>
                  <h3>Try It</h3>
                  <p>Book a trial flight and discover if flying is for you. £299 for approximately 75 minutes.</p>
                  <span class="hq-showcase__path-action">Book Trial Flight →</span>
                </a>

                <a href="#training" class="hq-showcase__path-card">
                  <div class="hq-showcase__path-icon">📚</div>
                  <h3>Learn</h3>
                  <p>Explore our training courses and start your journey to PPL(H) with experienced instructors.</p>
                  <span class="hq-showcase__path-action">View Training →</span>
                </a>

                <a href="#aircraft" class="hq-showcase__path-card">
                  <div class="hq-showcase__path-icon">✈️</div>
                  <h3>Buy</h3>
                  <p>Browse new and pre-owned Robinson helicopters. Find your perfect aircraft.</p>
                  <span class="hq-showcase__path-action">View Aircraft →</span>
                </a>

                <a href="#contact" class="hq-showcase__path-card">
                  <div class="hq-showcase__path-icon">💬</div>
                  <h3>Talk</h3>
                  <p>Not sure where to start? Call us or send a message. No pressure, just friendly advice.</p>
                  <span class="hq-showcase__path-action">Get In Touch →</span>
                </a>
              </div>

              <div class="hq-showcase__nextsteps-footer">
                <div class="hq-showcase__contact-bar">
                  <a href="tel:+441753868976" class="hq-showcase__contact-phone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    01753 868 976
                  </a>
                  <span class="hq-showcase__contact-hours">Mon-Fri 8am-6pm</span>
                </div>
              </div>
            </div>
          </section>`
      },

      // FINANCING OPTIONS
      {
        id: 'showcase-financing',
        category: 'Sales',
        name: 'Financing Your Aircraft',
        desc: 'Financing options and guidance.',
        html: `
          <section class="hq-showcase hq-showcase--financing">
            <div class="hq-container">
              <div class="hq-showcase__split">
                <div class="hq-showcase__content">
                  <span class="hq-showcase__eyebrow">Aircraft Financing</span>
                  <h2 class="hq-showcase__title">Making Ownership<br><em>Achievable</em></h2>
                  <p class="hq-showcase__text">A helicopter doesn't have to be a cash purchase. We work with specialist aviation finance providers to structure packages that make ownership a reality. From hire purchase to operating leases, there's a solution for your situation.</p>

                  <div class="hq-showcase__finance-options">
                    <div class="hq-showcase__finance-option">
                      <h4>Hire Purchase</h4>
                      <p>Own the aircraft outright after the payment term. Typically 3-7 years with 10-20% deposit.</p>
                    </div>
                    <div class="hq-showcase__finance-option">
                      <h4>Operating Lease</h4>
                      <p>Lower monthly payments, hand the aircraft back at the end. Great for businesses.</p>
                    </div>
                    <div class="hq-showcase__finance-option">
                      <h4>Balloon Finance</h4>
                      <p>Reduced monthly payments with a final balloon payment. Flexible end options.</p>
                    </div>
                  </div>

                  <div class="hq-showcase__finance-cta">
                    <p><strong>Interested in financing?</strong> We can connect you with trusted aviation finance specialists who understand helicopter ownership.</p>
                    <a href="#finance-enquiry" class="hq-btn hq-btn--primary">Discuss Finance Options</a>
                  </div>
                </div>
                <div class="hq-showcase__visual">
                  <div class="hq-showcase__finance-visual">
                    <div class="hq-showcase__finance-card">
                      <span class="hq-showcase__finance-label">Example Monthly Payment</span>
                      <span class="hq-showcase__finance-amount">from £2,500</span>
                      <span class="hq-showcase__finance-note">R44 Raven II, subject to status</span>
                    </div>
                    <div class="hq-showcase__finance-benefits">
                      <span>✓ Preserve capital</span>
                      <span>✓ Fixed monthly costs</span>
                      <span>✓ Potential tax benefits</span>
                      <span>✓ Flexible terms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`
      },

      // GIFT EXPERIENCES
      {
        id: 'showcase-gift-experiences',
        category: 'Training',
        name: 'Gift an Experience',
        desc: 'Gift voucher and experience packages.',
        html: `
          <section class="hq-showcase hq-showcase--gifts">
            <div class="hq-container">
              <div class="hq-showcase__header hq-showcase__header--centered">
                <span class="hq-showcase__eyebrow">Gift Vouchers</span>
                <h2 class="hq-showcase__title">Give the Gift of <em>Flight</em></h2>
                <p class="hq-showcase__lead">Looking for an unforgettable gift? A helicopter experience creates memories that last a lifetime. Perfect for birthdays, anniversaries, retirements, or just because.</p>
              </div>

              <div class="hq-showcase__gifts-grid">
                <div class="hq-showcase__gift-card">
                  <div class="hq-showcase__gift-header">
                    <span class="hq-showcase__gift-badge">Most Popular</span>
                    <h3>Trial Flight Experience</h3>
                    <span class="hq-showcase__gift-price">£299</span>
                  </div>
                  <ul class="hq-showcase__gift-includes">
                    <li>30-minute pre-flight briefing</li>
                    <li>30-minute hands-on flight</li>
                    <li>Post-flight debrief</li>
                    <li>Log book entry</li>
                    <li>Personalised certificate</li>
                  </ul>
                  <a href="#voucher-trial" class="hq-btn hq-btn--primary">Buy Voucher</a>
                </div>

                <div class="hq-showcase__gift-card">
                  <div class="hq-showcase__gift-header">
                    <h3>Extended Experience</h3>
                    <span class="hq-showcase__gift-price">£499</span>
                  </div>
                  <ul class="hq-showcase__gift-includes">
                    <li>Extended briefing session</li>
                    <li>60-minute flight time</li>
                    <li>Scenic route options</li>
                    <li>Photos included</li>
                    <li>Premium presentation pack</li>
                  </ul>
                  <a href="#voucher-extended" class="hq-btn hq-btn--outline">Buy Voucher</a>
                </div>

                <div class="hq-showcase__gift-card">
                  <div class="hq-showcase__gift-header">
                    <h3>Custom Amount</h3>
                    <span class="hq-showcase__gift-price">Any Value</span>
                  </div>
                  <ul class="hq-showcase__gift-includes">
                    <li>Choose your own amount</li>
                    <li>Redeemable against any service</li>
                    <li>Training, flights, or merchandise</li>
                    <li>Valid for 12 months</li>
                    <li>Gift-ready presentation</li>
                  </ul>
                  <a href="#voucher-custom" class="hq-btn hq-btn--outline">Buy Voucher</a>
                </div>
              </div>

              <div class="hq-showcase__gifts-footer">
                <p>All vouchers are beautifully presented and can be emailed instantly or posted in a gift box. Valid for 12 months from purchase.</p>
                <p><strong>Corporate gifting available</strong> — <a href="#corporate">contact us for bulk orders</a></p>
              </div>
            </div>
          </section>`
      }
    ],

    // ========================================
    // CREATIVE EXPLORATIONS (Rose/Pink Tab)
    // 20 highly varied design directions
    // ========================================
    creative: [
      // 1. BRUTALIST - Raw, bold, minimal
      {
        id: 'creative-brutalist-services',
        category: 'Brutalist',
        name: 'Raw Typography Services',
        desc: 'Brutalist design: massive type, raw aesthetic, stark contrast.',
        html: `
          <section class="hq-creative hq-creative--brutalist">
            <div class="hq-creative__brutalist-grid">
              <div class="hq-creative__brutalist-header">
                <h1 class="hq-creative__brutalist-title">HELI<br/>COPTERS</h1>
                <span class="hq-creative__brutalist-sub">EST. 1990</span>
              </div>
              <div class="hq-creative__brutalist-services">
                <a href="#sales" class="hq-creative__brutalist-service">
                  <span class="hq-creative__brutalist-num">001</span>
                  <span class="hq-creative__brutalist-name">AIRCRAFT SALES</span>
                  <span class="hq-creative__brutalist-arrow">→</span>
                </a>
                <a href="#training" class="hq-creative__brutalist-service">
                  <span class="hq-creative__brutalist-num">002</span>
                  <span class="hq-creative__brutalist-name">FLIGHT TRAINING</span>
                  <span class="hq-creative__brutalist-arrow">→</span>
                </a>
                <a href="#maintenance" class="hq-creative__brutalist-service">
                  <span class="hq-creative__brutalist-num">003</span>
                  <span class="hq-creative__brutalist-name">MAINTENANCE</span>
                  <span class="hq-creative__brutalist-arrow">→</span>
                </a>
                <a href="#parts" class="hq-creative__brutalist-service">
                  <span class="hq-creative__brutalist-num">004</span>
                  <span class="hq-creative__brutalist-name">PARTS SUPPLY</span>
                  <span class="hq-creative__brutalist-arrow">→</span>
                </a>
              </div>
              <div class="hq-creative__brutalist-contact">
                <span>CALL NOW</span>
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // 2. EDITORIAL - Elegant magazine style
      {
        id: 'creative-editorial-hero',
        category: 'Editorial',
        name: 'Magazine Cover Hero',
        desc: 'Editorial design: serif headlines, elegant spacing, high fashion feel.',
        html: `
          <section class="hq-creative hq-creative--editorial">
            <div class="hq-creative__editorial-layout">
              <div class="hq-creative__editorial-masthead">
                <span class="hq-creative__editorial-issue">Issue No. 47 — Winter 2024</span>
                <h1 class="hq-creative__editorial-logo">HQ Aviation</h1>
                <span class="hq-creative__editorial-tagline">The Art of Helicopter Ownership</span>
              </div>
              <div class="hq-creative__editorial-hero-img">
                <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
              </div>
              <div class="hq-creative__editorial-feature">
                <span class="hq-creative__editorial-kicker">Cover Story</span>
                <h2 class="hq-creative__editorial-headline">The Robinson R66:<br/><em>Turbine Perfection</em></h2>
                <p class="hq-creative__editorial-deck">How Frank Robinson's vision became the world's most beloved helicopter. Plus: Your complete guide to aircraft ownership.</p>
                <a href="#feature" class="hq-creative__editorial-link">Read the Feature →</a>
              </div>
              <div class="hq-creative__editorial-sidebar">
                <div class="hq-creative__editorial-toc">
                  <h3>Inside This Issue</h3>
                  <ul>
                    <li><span>14</span> Learning to Fly: A Beginner's Journey</li>
                    <li><span>28</span> Maintenance Matters: Expert Insights</li>
                    <li><span>42</span> Owner Profiles: Three Stories</li>
                    <li><span>56</span> The Parts That Keep You Flying</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>`
      },

      // 3. NEON DARK - Vibrant on black
      {
        id: 'creative-neon-dark',
        category: 'Neon Dark',
        name: 'Cyberpunk Services',
        desc: 'Dark mode with neon accents, futuristic tech aesthetic.',
        html: `
          <section class="hq-creative hq-creative--neon">
            <div class="hq-creative__neon-bg"></div>
            <div class="hq-container">
              <div class="hq-creative__neon-header">
                <span class="hq-creative__neon-badge">UK ROBINSON DEALER</span>
                <h1 class="hq-creative__neon-title">
                  <span class="hq-creative__neon-glow">HQ</span>
                  <span class="hq-creative__neon-outline">AVIATION</span>
                </h1>
              </div>
              <div class="hq-creative__neon-grid">
                <div class="hq-creative__neon-card" data-color="cyan">
                  <div class="hq-creative__neon-icon">◈</div>
                  <h3>SALES</h3>
                  <p>New & Pre-owned Robinson Helicopters</p>
                  <span class="hq-creative__neon-stat">500+ Sold</span>
                </div>
                <div class="hq-creative__neon-card" data-color="magenta">
                  <div class="hq-creative__neon-icon">◉</div>
                  <h3>TRAINING</h3>
                  <p>Zero to PPL(H) Licensed Pilot</p>
                  <span class="hq-creative__neon-stat">1000+ Pilots</span>
                </div>
                <div class="hq-creative__neon-card" data-color="yellow">
                  <div class="hq-creative__neon-icon">⬡</div>
                  <h3>MAINTENANCE</h3>
                  <p>EASA Part-145 Approved</p>
                  <span class="hq-creative__neon-stat">30+ Years</span>
                </div>
                <div class="hq-creative__neon-card" data-color="green">
                  <div class="hq-creative__neon-icon">◇</div>
                  <h3>PARTS</h3>
                  <p>Same-Day UK Dispatch</p>
                  <span class="hq-creative__neon-stat">10K+ Stock</span>
                </div>
              </div>
              <div class="hq-creative__neon-cta">
                <a href="#contact" class="hq-creative__neon-btn">INITIATE CONTACT</a>
              </div>
            </div>
          </section>`
      },

      // 4. SOFT ORGANIC - Rounded, gentle
      {
        id: 'creative-organic-welcome',
        category: 'Soft Organic',
        name: 'Gentle Welcome',
        desc: 'Soft shapes, muted pastels, approachable and warm.',
        html: `
          <section class="hq-creative hq-creative--organic">
            <div class="hq-creative__organic-blobs">
              <div class="hq-creative__blob hq-creative__blob--1"></div>
              <div class="hq-creative__blob hq-creative__blob--2"></div>
              <div class="hq-creative__blob hq-creative__blob--3"></div>
            </div>
            <div class="hq-container">
              <div class="hq-creative__organic-content">
                <span class="hq-creative__organic-wave">👋</span>
                <h1 class="hq-creative__organic-title">Welcome to HQ</h1>
                <p class="hq-creative__organic-intro">We're a friendly team of helicopter enthusiasts who'd love to help you discover the joy of flight. No pressure, just passion.</p>
                <div class="hq-creative__organic-cards">
                  <div class="hq-creative__organic-card">
                    <span class="hq-creative__organic-emoji">✨</span>
                    <h3>Dream</h3>
                    <p>Thinking about flying? Let's chat about what's possible.</p>
                  </div>
                  <div class="hq-creative__organic-card">
                    <span class="hq-creative__organic-emoji">📚</span>
                    <h3>Learn</h3>
                    <p>Our friendly instructors make learning a joy.</p>
                  </div>
                  <div class="hq-creative__organic-card">
                    <span class="hq-creative__organic-emoji">🚁</span>
                    <h3>Fly</h3>
                    <p>From first hover to owning your own aircraft.</p>
                  </div>
                </div>
                <a href="#start" class="hq-creative__organic-btn">Let's Talk ☕</a>
              </div>
            </div>
          </section>`
      },

      // 5. GEOMETRIC - Sharp angles, bold shapes
      {
        id: 'creative-geometric-stats',
        category: 'Geometric',
        name: 'Angular Statistics',
        desc: 'Sharp geometric shapes, bold angles, modern architectural feel.',
        html: `
          <section class="hq-creative hq-creative--geometric">
            <div class="hq-creative__geo-pattern"></div>
            <div class="hq-container">
              <div class="hq-creative__geo-header">
                <div class="hq-creative__geo-badge">
                  <span>HQ</span>
                </div>
                <h2 class="hq-creative__geo-title">BY THE NUMBERS</h2>
              </div>
              <div class="hq-creative__geo-stats">
                <div class="hq-creative__geo-stat hq-creative__geo-stat--tilted">
                  <span class="hq-creative__geo-value">30+</span>
                  <span class="hq-creative__geo-label">YEARS IN BUSINESS</span>
                </div>
                <div class="hq-creative__geo-stat">
                  <span class="hq-creative__geo-value">500+</span>
                  <span class="hq-creative__geo-label">AIRCRAFT DELIVERED</span>
                </div>
                <div class="hq-creative__geo-stat hq-creative__geo-stat--tilted-reverse">
                  <span class="hq-creative__geo-value">1K+</span>
                  <span class="hq-creative__geo-label">PILOTS TRAINED</span>
                </div>
                <div class="hq-creative__geo-stat">
                  <span class="hq-creative__geo-value">24H</span>
                  <span class="hq-creative__geo-label">PARTS DISPATCH</span>
                </div>
              </div>
              <div class="hq-creative__geo-cta">
                <a href="#contact" class="hq-creative__geo-btn">
                  <span>GET STARTED</span>
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </section>`
      },

      // 6. VINTAGE RETRO - Nostalgic warmth
      {
        id: 'creative-vintage-heritage',
        category: 'Retro',
        name: 'Vintage Heritage',
        desc: 'Nostalgic design with warm sepia tones and classic typography.',
        html: `
          <section class="hq-creative hq-creative--vintage">
            <div class="hq-creative__vintage-border">
              <div class="hq-creative__vintage-inner">
                <div class="hq-creative__vintage-ornament">✦ ✦ ✦</div>
                <span class="hq-creative__vintage-est">— Established 1990 —</span>
                <h1 class="hq-creative__vintage-title">HQ Aviation</h1>
                <p class="hq-creative__vintage-subtitle">Purveyors of Fine Rotorcraft</p>
                <div class="hq-creative__vintage-divider"></div>
                <div class="hq-creative__vintage-services">
                  <div class="hq-creative__vintage-service">
                    <span class="hq-creative__vintage-icon">⚙</span>
                    <h3>Aircraft Sales</h3>
                    <p>Robinson Helicopters, new & previously cherished</p>
                  </div>
                  <div class="hq-creative__vintage-service">
                    <span class="hq-creative__vintage-icon">✈</span>
                    <h3>Flight Instruction</h3>
                    <p>The gentleman's art of helicopter piloting</p>
                  </div>
                  <div class="hq-creative__vintage-service">
                    <span class="hq-creative__vintage-icon">🔧</span>
                    <h3>Engineering</h3>
                    <p>Maintenance by master craftsmen</p>
                  </div>
                </div>
                <div class="hq-creative__vintage-footer">
                  <span>Denham Aerodrome, Buckinghamshire</span>
                  <a href="tel:+441753868976">Telephone: 01753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 7. MINIMAL JAPANESE - Zen whitespace
      {
        id: 'creative-zen-minimal',
        category: 'Japanese Minimal',
        name: 'Zen Services',
        desc: 'Japanese-inspired minimalism: pure whitespace, careful balance.',
        html: `
          <section class="hq-creative hq-creative--zen">
            <div class="hq-container">
              <div class="hq-creative__zen-layout">
                <div class="hq-creative__zen-left">
                  <span class="hq-creative__zen-kanji">空</span>
                  <p class="hq-creative__zen-meaning">Sky</p>
                </div>
                <div class="hq-creative__zen-center">
                  <h1 class="hq-creative__zen-title">HQ Aviation</h1>
                  <p class="hq-creative__zen-philosophy">The art of flight requires patience, precision, and a trusted guide.</p>
                  <div class="hq-creative__zen-line"></div>
                  <nav class="hq-creative__zen-nav">
                    <a href="#sales">Sales</a>
                    <a href="#training">Training</a>
                    <a href="#service">Service</a>
                    <a href="#parts">Parts</a>
                  </nav>
                </div>
                <div class="hq-creative__zen-right">
                  <span class="hq-creative__zen-kanji">道</span>
                  <p class="hq-creative__zen-meaning">Path</p>
                </div>
              </div>
              <div class="hq-creative__zen-footer">
                <span>Since 1990</span>
                <span>•</span>
                <span>Denham Aerodrome</span>
              </div>
            </div>
          </section>`
      },

      // 8. TECH DATA - Monospace, grids
      {
        id: 'creative-tech-specs',
        category: 'Tech/Data',
        name: 'Technical Interface',
        desc: 'Technical aesthetic: monospace fonts, data grids, terminal feel.',
        html: `
          <section class="hq-creative hq-creative--tech">
            <div class="hq-creative__tech-scanlines"></div>
            <div class="hq-container">
              <div class="hq-creative__tech-header">
                <span class="hq-creative__tech-status">● SYSTEM ONLINE</span>
                <span class="hq-creative__tech-id">HQ_AVIATION_v34.1</span>
              </div>
              <div class="hq-creative__tech-main">
                <pre class="hq-creative__tech-ascii">
    __  ______  ___   _    ___   ___________  _   __
   / / / / __ \\/   | | |  / / | / /  _/ __  \\/ | / /
  / /_/ / / / / /| | | | / /| |/ // // / / /  |/ /
 / __  / /_/ / ___ | | |/ / |   // // /_/ / /|  /
/_/ /_/\\___\\_\\/_/  |_| |___/|_/\\_\\___/_____/_/ |_/
                </pre>
                <div class="hq-creative__tech-grid">
                  <div class="hq-creative__tech-module">
                    <span class="hq-creative__tech-label">[AIRCRAFT_SALES]</span>
                    <span class="hq-creative__tech-data">STATUS: ACTIVE</span>
                    <span class="hq-creative__tech-data">UNITS_SOLD: 500+</span>
                    <span class="hq-creative__tech-data">MODELS: R22, R44, R66</span>
                  </div>
                  <div class="hq-creative__tech-module">
                    <span class="hq-creative__tech-label">[FLIGHT_TRAINING]</span>
                    <span class="hq-creative__tech-data">STATUS: ACTIVE</span>
                    <span class="hq-creative__tech-data">PILOTS_TRAINED: 1000+</span>
                    <span class="hq-creative__tech-data">CERT: CAA_APPROVED</span>
                  </div>
                  <div class="hq-creative__tech-module">
                    <span class="hq-creative__tech-label">[MAINTENANCE]</span>
                    <span class="hq-creative__tech-data">STATUS: ACTIVE</span>
                    <span class="hq-creative__tech-data">CERT: EASA_PART_145</span>
                    <span class="hq-creative__tech-data">EXP_YEARS: 30+</span>
                  </div>
                  <div class="hq-creative__tech-module">
                    <span class="hq-creative__tech-label">[PARTS_SUPPLY]</span>
                    <span class="hq-creative__tech-data">STATUS: ACTIVE</span>
                    <span class="hq-creative__tech-data">INVENTORY: 10000+</span>
                    <span class="hq-creative__tech-data">DISPATCH: SAME_DAY</span>
                  </div>
                </div>
              </div>
              <div class="hq-creative__tech-footer">
                <span>> INITIATE_CONTACT: </span>
                <a href="tel:+441753868976">01753_868_976</a>
                <span class="hq-creative__tech-cursor">_</span>
              </div>
            </div>
          </section>`
      },

      // 9. LUXURY GOLD - Rich and elegant
      {
        id: 'creative-luxury-gold',
        category: 'Luxury',
        name: 'Gold Premium',
        desc: 'Luxury aesthetic: rich navy, gold accents, premium feel.',
        html: `
          <section class="hq-creative hq-creative--luxury">
            <div class="hq-creative__luxury-bg"></div>
            <div class="hq-container">
              <div class="hq-creative__luxury-header">
                <div class="hq-creative__luxury-logo">
                  <span class="hq-creative__luxury-crown">♔</span>
                  <span class="hq-creative__luxury-brand">HQ Aviation</span>
                </div>
                <p class="hq-creative__luxury-tagline">The Premier Robinson Experience</p>
              </div>
              <div class="hq-creative__luxury-content">
                <div class="hq-creative__luxury-feature">
                  <span class="hq-creative__luxury-number">I</span>
                  <h3>Bespoke Aircraft</h3>
                  <p>Factory-configured to your precise specification, delivered with white-glove service.</p>
                </div>
                <div class="hq-creative__luxury-feature">
                  <span class="hq-creative__luxury-number">II</span>
                  <h3>Private Tuition</h3>
                  <p>One-to-one instruction with our senior flight team, scheduled at your convenience.</p>
                </div>
                <div class="hq-creative__luxury-feature">
                  <span class="hq-creative__luxury-number">III</span>
                  <h3>Concierge Service</h3>
                  <p>Your aircraft maintained, managed, and ready whenever you wish to fly.</p>
                </div>
              </div>
              <div class="hq-creative__luxury-cta">
                <a href="#enquire" class="hq-creative__luxury-btn">Request Private Consultation</a>
              </div>
              <div class="hq-creative__luxury-footer">
                <span>Denham Aerodrome</span>
                <span>·</span>
                <span>Since 1990</span>
              </div>
            </div>
          </section>`
      },

      // 10. BOLD POP - Primary colors, playful
      {
        id: 'creative-pop-bold',
        category: 'Bold Pop',
        name: 'Primary Color Blast',
        desc: 'Bold primary colors, playful shapes, high energy design.',
        html: `
          <section class="hq-creative hq-creative--pop">
            <div class="hq-container">
              <div class="hq-creative__pop-header">
                <div class="hq-creative__pop-logo">
                  <span class="hq-creative__pop-h">H</span>
                  <span class="hq-creative__pop-q">Q</span>
                </div>
                <h1 class="hq-creative__pop-title">LET'S FLY!</h1>
              </div>
              <div class="hq-creative__pop-grid">
                <a href="#sales" class="hq-creative__pop-card hq-creative__pop-card--red">
                  <span class="hq-creative__pop-icon">🚁</span>
                  <h3>BUY</h3>
                  <p>Get your own helicopter</p>
                </a>
                <a href="#training" class="hq-creative__pop-card hq-creative__pop-card--blue">
                  <span class="hq-creative__pop-icon">🎓</span>
                  <h3>LEARN</h3>
                  <p>Become a pilot</p>
                </a>
                <a href="#maintenance" class="hq-creative__pop-card hq-creative__pop-card--yellow">
                  <span class="hq-creative__pop-icon">🔧</span>
                  <h3>FIX</h3>
                  <p>Expert maintenance</p>
                </a>
                <a href="#trial" class="hq-creative__pop-card hq-creative__pop-card--green">
                  <span class="hq-creative__pop-icon">✨</span>
                  <h3>TRY</h3>
                  <p>Trial flight £299</p>
                </a>
              </div>
              <div class="hq-creative__pop-cta">
                <span class="hq-creative__pop-phone">📞 01753 868 976</span>
              </div>
            </div>
          </section>`
      },

      // 11. GRADIENT AURORA - Beautiful gradients
      {
        id: 'creative-aurora-gradient',
        category: 'Gradient',
        name: 'Aurora Flow',
        desc: 'Flowing gradients, dreamy colors, ethereal atmosphere.',
        html: `
          <section class="hq-creative hq-creative--aurora">
            <div class="hq-creative__aurora-bg">
              <div class="hq-creative__aurora-layer hq-creative__aurora-layer--1"></div>
              <div class="hq-creative__aurora-layer hq-creative__aurora-layer--2"></div>
              <div class="hq-creative__aurora-layer hq-creative__aurora-layer--3"></div>
            </div>
            <div class="hq-container">
              <div class="hq-creative__aurora-content">
                <h1 class="hq-creative__aurora-title">Touch the Sky</h1>
                <p class="hq-creative__aurora-subtitle">Your helicopter journey begins at HQ Aviation</p>
                <div class="hq-creative__aurora-services">
                  <div class="hq-creative__aurora-service">
                    <h3>Aircraft Sales</h3>
                    <p>New & Pre-owned Robinson</p>
                  </div>
                  <div class="hq-creative__aurora-divider"></div>
                  <div class="hq-creative__aurora-service">
                    <h3>Flight Training</h3>
                    <p>PPL(H) & Type Ratings</p>
                  </div>
                  <div class="hq-creative__aurora-divider"></div>
                  <div class="hq-creative__aurora-service">
                    <h3>Maintenance</h3>
                    <p>EASA Part-145</p>
                  </div>
                </div>
                <a href="#discover" class="hq-creative__aurora-btn">Begin Your Journey</a>
              </div>
            </div>
          </section>`
      },

      // 12. NEWSPAPER - Classic editorial columns
      {
        id: 'creative-newspaper-layout',
        category: 'Newspaper',
        name: 'Broadsheet Layout',
        desc: 'Classic newspaper design with columns, bylines, and datelines.',
        html: `
          <section class="hq-creative hq-creative--newspaper">
            <div class="hq-container">
              <header class="hq-creative__news-masthead">
                <div class="hq-creative__news-meta">
                  <span>Denham, Buckinghamshire</span>
                  <span>Est. 1990</span>
                </div>
                <h1 class="hq-creative__news-title">THE HQ AVIATION GAZETTE</h1>
                <div class="hq-creative__news-meta">
                  <span>Tel: 01753 868 976</span>
                  <span>UK's Premier Robinson Dealer</span>
                </div>
              </header>
              <div class="hq-creative__news-rule"></div>
              <div class="hq-creative__news-columns">
                <article class="hq-creative__news-lead">
                  <h2 class="hq-creative__news-headline">LOCAL AVIATION COMPANY MARKS THREE DECADES OF EXCELLENCE</h2>
                  <p class="hq-creative__news-byline">By Our Aviation Correspondent</p>
                  <p class="hq-creative__news-body">HQ Aviation, the distinguished Robinson helicopter dealership based at Denham Aerodrome, celebrates over thirty years serving the British helicopter community. Having sold more than 500 aircraft and trained over 1,000 pilots, the company stands as a testament to British aviation excellence.</p>
                  <p class="hq-creative__news-continued">Continued on page 3...</p>
                </article>
                <aside class="hq-creative__news-sidebar">
                  <div class="hq-creative__news-box">
                    <h3>SERVICES OFFERED</h3>
                    <ul>
                      <li>New Aircraft Sales</li>
                      <li>Pre-Owned Aircraft</li>
                      <li>PPL(H) Training</li>
                      <li>Type Ratings</li>
                      <li>Annual Inspections</li>
                      <li>Parts Supply</li>
                    </ul>
                  </div>
                  <div class="hq-creative__news-ad">
                    <span>TRIAL FLIGHTS</span>
                    <strong>£299</strong>
                    <span>Book Today</span>
                  </div>
                </aside>
              </div>
            </div>
          </section>`
      },

      // 13. DUOTONE - Two color palette
      {
        id: 'creative-duotone-split',
        category: 'Duotone',
        name: 'Two-Tone Split',
        desc: 'Striking two-color design, high contrast split layout.',
        html: `
          <section class="hq-creative hq-creative--duotone">
            <div class="hq-creative__duo-split">
              <div class="hq-creative__duo-left">
                <h2 class="hq-creative__duo-title">LEARN</h2>
                <p class="hq-creative__duo-text">From first hover to licensed pilot. CAA-approved training with experienced instructors.</p>
                <ul class="hq-creative__duo-list">
                  <li>Trial Flights</li>
                  <li>PPL(H) Course</li>
                  <li>Type Ratings</li>
                  <li>Night Rating</li>
                </ul>
                <a href="#training" class="hq-creative__duo-btn hq-creative__duo-btn--light">Start Training →</a>
              </div>
              <div class="hq-creative__duo-right">
                <h2 class="hq-creative__duo-title">OWN</h2>
                <p class="hq-creative__duo-text">Your perfect Robinson helicopter. Factory new or carefully selected pre-owned.</p>
                <ul class="hq-creative__duo-list">
                  <li>R22 Beta II</li>
                  <li>R44 Raven II</li>
                  <li>R66 Turbine</li>
                  <li>Trade-Ins</li>
                </ul>
                <a href="#sales" class="hq-creative__duo-btn hq-creative__duo-btn--dark">View Aircraft →</a>
              </div>
            </div>
            <div class="hq-creative__duo-footer">
              <span class="hq-creative__duo-logo">HQ AVIATION</span>
              <span class="hq-creative__duo-phone">01753 868 976</span>
            </div>
          </section>`
      },

      // 14. GLASSMORPHISM - Frosted glass
      {
        id: 'creative-glass-cards',
        category: 'Glass',
        name: 'Frosted Glass Cards',
        desc: 'Glassmorphism: frosted panels, blur effects, depth.',
        html: `
          <section class="hq-creative hq-creative--glass">
            <div class="hq-creative__glass-bg">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Helicopter flight">
            </div>
            <div class="hq-container">
              <div class="hq-creative__glass-header">
                <h1 class="hq-creative__glass-title">HQ Aviation</h1>
                <p class="hq-creative__glass-tagline">Robinson Specialists Since 1990</p>
              </div>
              <div class="hq-creative__glass-grid">
                <div class="hq-creative__glass-card">
                  <div class="hq-creative__glass-icon">✦</div>
                  <h3>Aircraft Sales</h3>
                  <p>New factory orders and hand-selected pre-owned helicopters.</p>
                  <span class="hq-creative__glass-link">Explore →</span>
                </div>
                <div class="hq-creative__glass-card">
                  <div class="hq-creative__glass-icon">◈</div>
                  <h3>Flight Training</h3>
                  <p>PPL(H) training with CAA-approved instructors.</p>
                  <span class="hq-creative__glass-link">Learn more →</span>
                </div>
                <div class="hq-creative__glass-card">
                  <div class="hq-creative__glass-icon">⬡</div>
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved service centre.</p>
                  <span class="hq-creative__glass-link">Our services →</span>
                </div>
              </div>
              <div class="hq-creative__glass-cta">
                <a href="#contact" class="hq-creative__glass-btn">Get in Touch</a>
              </div>
            </div>
          </section>`
      },

      // 15. NEUBRUTALISM - Thick borders, shadows
      {
        id: 'creative-neubrutalist',
        category: 'Neubrutalism',
        name: 'Neo-Brutal Cards',
        desc: 'Neubrutalism: thick borders, hard shadows, bold colors.',
        html: `
          <section class="hq-creative hq-creative--neubrutalist">
            <div class="hq-container">
              <div class="hq-creative__neub-header">
                <h1 class="hq-creative__neub-title">HQ AVIATION</h1>
                <span class="hq-creative__neub-tag">HELICOPTER PEOPLE</span>
              </div>
              <div class="hq-creative__neub-grid">
                <a href="#sales" class="hq-creative__neub-card hq-creative__neub-card--yellow">
                  <h2>BUY A HELICOPTER</h2>
                  <p>Robinson R22 • R44 • R66</p>
                  <span class="hq-creative__neub-arrow">↗</span>
                </a>
                <a href="#training" class="hq-creative__neub-card hq-creative__neub-card--pink">
                  <h2>LEARN TO FLY</h2>
                  <p>PPL(H) from £299 trial</p>
                  <span class="hq-creative__neub-arrow">↗</span>
                </a>
                <a href="#maintenance" class="hq-creative__neub-card hq-creative__neub-card--blue">
                  <h2>GET IT FIXED</h2>
                  <p>EASA Part-145 Approved</p>
                  <span class="hq-creative__neub-arrow">↗</span>
                </a>
                <a href="#parts" class="hq-creative__neub-card hq-creative__neub-card--green">
                  <h2>ORDER PARTS</h2>
                  <p>Same-day UK dispatch</p>
                  <span class="hq-creative__neub-arrow">↗</span>
                </a>
              </div>
              <div class="hq-creative__neub-footer">
                <div class="hq-creative__neub-contact">
                  <span>CALL US</span>
                  <a href="tel:+441753868976">01753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 16. ART DECO - 1920s glamour
      {
        id: 'creative-artdeco-elegant',
        category: 'Art Deco',
        name: 'Deco Elegance',
        desc: 'Art Deco design: geometric patterns, gold accents, 1920s glamour.',
        html: `
          <section class="hq-creative hq-creative--deco">
            <div class="hq-creative__deco-frame">
              <div class="hq-creative__deco-corner hq-creative__deco-corner--tl"></div>
              <div class="hq-creative__deco-corner hq-creative__deco-corner--tr"></div>
              <div class="hq-creative__deco-corner hq-creative__deco-corner--bl"></div>
              <div class="hq-creative__deco-corner hq-creative__deco-corner--br"></div>
              <div class="hq-creative__deco-content">
                <div class="hq-creative__deco-sunburst"></div>
                <span class="hq-creative__deco-year">— MCMXC —</span>
                <h1 class="hq-creative__deco-title">HQ<br/>AVIATION</h1>
                <p class="hq-creative__deco-tagline">Purveyors of Exceptional Rotorcraft</p>
                <div class="hq-creative__deco-divider">◆ ◆ ◆</div>
                <div class="hq-creative__deco-services">
                  <span>Aircraft Sales</span>
                  <span>•</span>
                  <span>Flight Tuition</span>
                  <span>•</span>
                  <span>Engineering</span>
                </div>
                <a href="#enquire" class="hq-creative__deco-btn">Make an Enquiry</a>
                <div class="hq-creative__deco-footer">
                  <span>Denham Aerodrome, Buckinghamshire</span>
                  <span>Telephone 01753 868 976</span>
                </div>
              </div>
            </div>
          </section>`
      },

      // 17. SWISS INTERNATIONAL - Grid-based, Helvetica
      {
        id: 'creative-swiss-grid',
        category: 'Swiss',
        name: 'International Grid',
        desc: 'Swiss design: strict grid, Helvetica-style type, functional.',
        html: `
          <section class="hq-creative hq-creative--swiss">
            <div class="hq-creative__swiss-grid">
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Organization</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--value">HQ Aviation Ltd</div>
              </div>
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Established</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--value">1990</div>
              </div>
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Location</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--value">Denham Aerodrome, UK</div>
              </div>
              <div class="hq-creative__swiss-row hq-creative__swiss-row--divider"></div>
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Services</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--list">
                  <span>1. Aircraft Sales (New/Pre-owned)</span>
                  <span>2. Flight Training (PPL-H)</span>
                  <span>3. Maintenance (EASA Part-145)</span>
                  <span>4. Parts Supply (Worldwide)</span>
                </div>
              </div>
              <div class="hq-creative__swiss-row hq-creative__swiss-row--divider"></div>
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Statistics</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--stats">
                  <div class="hq-creative__swiss-stat">
                    <span class="hq-creative__swiss-stat-num">500+</span>
                    <span class="hq-creative__swiss-stat-label">Aircraft Sold</span>
                  </div>
                  <div class="hq-creative__swiss-stat">
                    <span class="hq-creative__swiss-stat-num">1000+</span>
                    <span class="hq-creative__swiss-stat-label">Pilots Trained</span>
                  </div>
                  <div class="hq-creative__swiss-stat">
                    <span class="hq-creative__swiss-stat-num">30+</span>
                    <span class="hq-creative__swiss-stat-label">Years Operating</span>
                  </div>
                </div>
              </div>
              <div class="hq-creative__swiss-row hq-creative__swiss-row--divider"></div>
              <div class="hq-creative__swiss-row">
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--label">Contact</div>
                <div class="hq-creative__swiss-cell hq-creative__swiss-cell--value">
                  <a href="tel:+441753868976">+44 1753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 18. MAXIMALIST - Rich, layered
      {
        id: 'creative-maximalist-rich',
        category: 'Maximalist',
        name: 'Layered Maximalism',
        desc: 'Maximalist design: rich layers, multiple textures, visual abundance.',
        html: `
          <section class="hq-creative hq-creative--maximalist">
            <div class="hq-creative__max-layer hq-creative__max-layer--pattern"></div>
            <div class="hq-creative__max-layer hq-creative__max-layer--gradient"></div>
            <div class="hq-container">
              <div class="hq-creative__max-header">
                <div class="hq-creative__max-badge">★ UK'S PREMIER DEALER ★</div>
                <h1 class="hq-creative__max-title">
                  <span class="hq-creative__max-outline">HQ</span>
                  <span class="hq-creative__max-filled">Aviation</span>
                </h1>
                <div class="hq-creative__max-subtitle">
                  <span>ROBINSON</span>
                  <span>HELICOPTERS</span>
                  <span>SINCE 1990</span>
                </div>
              </div>
              <div class="hq-creative__max-features">
                <div class="hq-creative__max-feature">
                  <div class="hq-creative__max-feature-bg"></div>
                  <span class="hq-creative__max-icon">🚁</span>
                  <h3>Aircraft Sales</h3>
                  <span class="hq-creative__max-stat">500+ SOLD</span>
                  <p>New factory orders & carefully selected pre-owned Robinson helicopters</p>
                </div>
                <div class="hq-creative__max-feature">
                  <div class="hq-creative__max-feature-bg"></div>
                  <span class="hq-creative__max-icon">🎯</span>
                  <h3>Flight Training</h3>
                  <span class="hq-creative__max-stat">1000+ PILOTS</span>
                  <p>CAA-approved school with experienced instructors</p>
                </div>
                <div class="hq-creative__max-feature">
                  <div class="hq-creative__max-feature-bg"></div>
                  <span class="hq-creative__max-icon">⚙️</span>
                  <h3>Maintenance</h3>
                  <span class="hq-creative__max-stat">EASA PT-145</span>
                  <p>Factory-trained engineers, genuine parts, expert care</p>
                </div>
              </div>
              <div class="hq-creative__max-cta">
                <a href="#contact" class="hq-creative__max-btn">ENQUIRE NOW</a>
                <span class="hq-creative__max-phone">☎ 01753 868 976</span>
              </div>
            </div>
          </section>`
      },

      // 19. MONOCHROME - Single color variations
      {
        id: 'creative-mono-blue',
        category: 'Monochrome',
        name: 'Mono Blue System',
        desc: 'Single-color design: all blue spectrum, tonal depth.',
        html: `
          <section class="hq-creative hq-creative--mono hq-creative--mono-blue">
            <div class="hq-container">
              <div class="hq-creative__mono-header">
                <div class="hq-creative__mono-logo">HQ</div>
                <nav class="hq-creative__mono-nav">
                  <a href="#sales">Sales</a>
                  <a href="#training">Training</a>
                  <a href="#maintenance">Maintenance</a>
                  <a href="#contact">Contact</a>
                </nav>
              </div>
              <div class="hq-creative__mono-hero">
                <h1 class="hq-creative__mono-title">Robinson Helicopter<br/>Specialists</h1>
                <p class="hq-creative__mono-subtitle">Thirty years of trusted service at Denham Aerodrome</p>
              </div>
              <div class="hq-creative__mono-cards">
                <div class="hq-creative__mono-card hq-creative__mono-card--lightest">
                  <span class="hq-creative__mono-num">01</span>
                  <h3>Sales</h3>
                  <p>New & pre-owned aircraft</p>
                </div>
                <div class="hq-creative__mono-card hq-creative__mono-card--light">
                  <span class="hq-creative__mono-num">02</span>
                  <h3>Training</h3>
                  <p>PPL(H) certified courses</p>
                </div>
                <div class="hq-creative__mono-card hq-creative__mono-card--medium">
                  <span class="hq-creative__mono-num">03</span>
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved</p>
                </div>
                <div class="hq-creative__mono-card hq-creative__mono-card--dark">
                  <span class="hq-creative__mono-num">04</span>
                  <h3>Parts</h3>
                  <p>Same-day dispatch</p>
                </div>
              </div>
              <div class="hq-creative__mono-footer">
                <a href="tel:+441753868976" class="hq-creative__mono-phone">01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // 20. SPLIT CONTRAST - Half and half
      {
        id: 'creative-split-contrast',
        category: 'Split',
        name: 'Dark/Light Split',
        desc: 'Dramatic split layout: dark vs light, stark contrast.',
        html: `
          <section class="hq-creative hq-creative--splitcontrast">
            <div class="hq-creative__split-dark">
              <div class="hq-creative__split-inner">
                <span class="hq-creative__split-label">BUY</span>
                <h2 class="hq-creative__split-title">Aircraft<br/>Sales</h2>
                <p class="hq-creative__split-desc">Factory-new Robinson helicopters configured to your exact specification. Pre-owned aircraft inspected by our engineers.</p>
                <div class="hq-creative__split-stats">
                  <div class="hq-creative__split-stat">
                    <span>500+</span>
                    <span>Sold</span>
                  </div>
                  <div class="hq-creative__split-stat">
                    <span>R22</span>
                    <span>R44</span>
                    <span>R66</span>
                  </div>
                </div>
                <a href="#sales" class="hq-creative__split-btn hq-creative__split-btn--light">View Aircraft →</a>
              </div>
            </div>
            <div class="hq-creative__split-light">
              <div class="hq-creative__split-inner">
                <span class="hq-creative__split-label">FLY</span>
                <h2 class="hq-creative__split-title">Flight<br/>Training</h2>
                <p class="hq-creative__split-desc">From zero to PPL(H) with our CAA-approved flight school. Experienced instructors, modern fleet, flexible scheduling.</p>
                <div class="hq-creative__split-stats">
                  <div class="hq-creative__split-stat">
                    <span>1000+</span>
                    <span>Trained</span>
                  </div>
                  <div class="hq-creative__split-stat">
                    <span>45hrs</span>
                    <span>minimum</span>
                  </div>
                </div>
                <a href="#training" class="hq-creative__split-btn hq-creative__split-btn--dark">Start Training →</a>
              </div>
            </div>
            <div class="hq-creative__split-center">
              <div class="hq-creative__split-logo">HQ</div>
              <span class="hq-creative__split-phone">01753 868 976</span>
            </div>
          </section>`
      }
    ],

    // ========================================
    // AWWWARDS LEVEL DESIGNS (Violet Tab)
    // 30 Award-winning, sophisticated components
    // ========================================
    awwwards: [
      // 1. BENTO - Modern SaaS with overlapping cards
      {
        id: 'aww-bento-hero',
        category: 'Bento',
        name: 'Bento Dashboard Hero',
        desc: 'Apple/Linear-inspired bento grid with overlapping rounded cards.',
        html: `
          <section class="hq-aww hq-aww--bento">
            <div class="hq-aww__bento-canvas">
              <div class="hq-aww__bento-grid">
                <div class="hq-aww__bento-card hq-aww__bento-card--hero">
                  <span class="hq-aww__bento-tag">Robinson Specialists</span>
                  <h1 class="hq-aww__bento-title">Your aviation<br/>journey starts here</h1>
                  <p class="hq-aww__bento-desc">Sales · Training · Maintenance · Parts</p>
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--stat hq-aww__bento-card--overlap-1">
                  <span class="hq-aww__bento-stat-value">500+</span>
                  <span class="hq-aww__bento-stat-label">Aircraft Sold</span>
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--image">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--cta hq-aww__bento-card--overlap-2">
                  <span>Trial Flight</span>
                  <strong>£299</strong>
                  <a href="#book">Book Now →</a>
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--stat-small">
                  <span>1000+</span>
                  <span>Pilots Trained</span>
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--contact">
                  <span class="hq-aww__bento-contact-icon">📞</span>
                  <span>01753 868 976</span>
                </div>
                <div class="hq-aww__bento-card hq-aww__bento-card--badge hq-aww__bento-card--float">
                  <span>EASA Part-145</span>
                </div>
              </div>
            </div>
          </section>`
      },

      // 2. BENTO - Services Grid
      {
        id: 'aww-bento-services',
        category: 'Bento',
        name: 'Bento Services Grid',
        desc: 'Asymmetric bento with varying card sizes and subtle depth.',
        html: `
          <section class="hq-aww hq-aww--bento-services">
            <div class="hq-container">
              <header class="hq-aww__bento-header">
                <h2>Everything you need to fly</h2>
              </header>
              <div class="hq-aww__bento-mosaic">
                <a href="#sales" class="hq-aww__bento-tile hq-aww__bento-tile--large">
                  <div class="hq-aww__bento-tile-bg"></div>
                  <div class="hq-aww__bento-tile-content">
                    <span class="hq-aww__bento-tile-icon">
                      <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
                    </span>
                    <h3>Aircraft Sales</h3>
                    <p>New Robinson helicopters configured to your specification. Pre-owned aircraft inspected by experts.</p>
                    <span class="hq-aww__bento-tile-arrow">→</span>
                  </div>
                  <span class="hq-aww__bento-tile-stat">500+ sold</span>
                </a>
                <a href="#training" class="hq-aww__bento-tile">
                  <h3>Flight Training</h3>
                  <p>From zero to licensed pilot with CAA-approved instructors.</p>
                  <span class="hq-aww__bento-tile-arrow">→</span>
                </a>
                <a href="#maintenance" class="hq-aww__bento-tile">
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved facility.</p>
                  <span class="hq-aww__bento-tile-arrow">→</span>
                </a>
                <a href="#parts" class="hq-aww__bento-tile hq-aww__bento-tile--accent">
                  <h3>Parts</h3>
                  <p>Same-day dispatch, worldwide shipping.</p>
                  <span class="hq-aww__bento-tile-arrow">→</span>
                </a>
                <div class="hq-aww__bento-tile hq-aww__bento-tile--cta">
                  <span>Ready to start?</span>
                  <a href="tel:+441753868976">Call 01753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 3. GLASSMORPHISM AURORA - Immersive hero
      {
        id: 'aww-aurora-immersive',
        category: 'Glassmorphism',
        name: 'Aurora Immersive Hero',
        desc: 'Deep aurora gradients with floating frosted glass panels.',
        html: `
          <section class="hq-aww hq-aww--aurora">
            <div class="hq-aww__aurora-bg">
              <div class="hq-aww__aurora-orb hq-aww__aurora-orb--1"></div>
              <div class="hq-aww__aurora-orb hq-aww__aurora-orb--2"></div>
              <div class="hq-aww__aurora-orb hq-aww__aurora-orb--3"></div>
              <div class="hq-aww__aurora-orb hq-aww__aurora-orb--4"></div>
            </div>
            <div class="hq-aww__aurora-content">
              <div class="hq-aww__aurora-glass hq-aww__aurora-glass--main">
                <span class="hq-aww__aurora-eyebrow">HQ Aviation · Denham</span>
                <h1 class="hq-aww__aurora-headline">Experience<br/>the freedom<br/>of flight</h1>
                <div class="hq-aww__aurora-actions">
                  <a href="#discover" class="hq-aww__aurora-btn hq-aww__aurora-btn--primary">Discover More</a>
                  <a href="#contact" class="hq-aww__aurora-btn hq-aww__aurora-btn--ghost">Contact Us</a>
                </div>
              </div>
              <div class="hq-aww__aurora-glass hq-aww__aurora-glass--float hq-aww__aurora-glass--stats">
                <div class="hq-aww__aurora-stat">
                  <span>30+</span>
                  <span>Years</span>
                </div>
                <div class="hq-aww__aurora-stat">
                  <span>500+</span>
                  <span>Aircraft</span>
                </div>
                <div class="hq-aww__aurora-stat">
                  <span>1K+</span>
                  <span>Pilots</span>
                </div>
              </div>
              <div class="hq-aww__aurora-glass hq-aww__aurora-glass--float hq-aww__aurora-glass--cta">
                <span>Trial Flight</span>
                <strong>£299</strong>
              </div>
            </div>
          </section>`
      },

      // 4. DARK LUXURY - Cinematic matte black
      {
        id: 'aww-luxury-cinematic',
        category: 'Dark Luxury',
        name: 'Cinematic Dark Hero',
        desc: 'Matte black with noise texture, gold accents, elegant typography.',
        html: `
          <section class="hq-aww hq-aww--luxury">
            <div class="hq-aww__luxury-noise"></div>
            <div class="hq-aww__luxury-gradient"></div>
            <div class="hq-aww__luxury-content">
              <div class="hq-aww__luxury-left">
                <span class="hq-aww__luxury-overline">The Premier Robinson Experience</span>
                <h1 class="hq-aww__luxury-title">Redefining<br/><em>aviation</em><br/>excellence</h1>
                <div class="hq-aww__luxury-line"></div>
                <p class="hq-aww__luxury-text">Three decades of uncompromising service. From acquisition to flight, we are your trusted partner in the skies.</p>
                <a href="#discover" class="hq-aww__luxury-link">Explore Our Services</a>
              </div>
              <div class="hq-aww__luxury-right">
                <div class="hq-aww__luxury-image-frame">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66 Turbine">
                  <div class="hq-aww__luxury-image-overlay"></div>
                </div>
                <div class="hq-aww__luxury-detail hq-aww__luxury-detail--top">
                  <span>R66 Turbine</span>
                </div>
                <div class="hq-aww__luxury-detail hq-aww__luxury-detail--bottom">
                  <span>From $POA</span>
                </div>
              </div>
            </div>
            <div class="hq-aww__luxury-footer">
              <span>Est. 1990</span>
              <span class="hq-aww__luxury-sep">◈</span>
              <span>Denham Aerodrome</span>
              <span class="hq-aww__luxury-sep">◈</span>
              <a href="tel:+441753868976">+44 1753 868 976</a>
            </div>
          </section>`
      },

      // 5. SWISS ASYMMETRIC - Bold typography
      {
        id: 'aww-swiss-asymmetric',
        category: 'Swiss',
        name: 'Swiss Asymmetric Grid',
        desc: 'Massive typography, mathematical grid, bold red accent.',
        html: `
          <section class="hq-aww hq-aww--swiss">
            <div class="hq-aww__swiss-grid">
              <div class="hq-aww__swiss-col hq-aww__swiss-col--narrow">
                <span class="hq-aww__swiss-vertical">HQ AVIATION</span>
              </div>
              <div class="hq-aww__swiss-col hq-aww__swiss-col--main">
                <h1 class="hq-aww__swiss-mega">Heli<br/>cop<br/>ters</h1>
                <div class="hq-aww__swiss-bar"></div>
              </div>
              <div class="hq-aww__swiss-col hq-aww__swiss-col--info">
                <div class="hq-aww__swiss-block">
                  <span class="hq-aww__swiss-label">Services</span>
                  <ul class="hq-aww__swiss-list">
                    <li><span class="hq-aww__swiss-num">01</span>Aircraft Sales</li>
                    <li><span class="hq-aww__swiss-num">02</span>Flight Training</li>
                    <li><span class="hq-aww__swiss-num">03</span>Maintenance</li>
                    <li><span class="hq-aww__swiss-num">04</span>Parts Supply</li>
                  </ul>
                </div>
                <div class="hq-aww__swiss-block">
                  <span class="hq-aww__swiss-label">Contact</span>
                  <a href="tel:+441753868976" class="hq-aww__swiss-phone">01753<br/>868 976</a>
                </div>
              </div>
            </div>
            <div class="hq-aww__swiss-accent"></div>
          </section>`
      },

      // 6. SWISS - Big Numbers
      {
        id: 'aww-swiss-numbers',
        category: 'Swiss',
        name: 'Swiss Big Numbers',
        desc: 'Oversized statistics with tight grid alignment.',
        html: `
          <section class="hq-aww hq-aww--swiss-num">
            <div class="hq-aww__snum-grid">
              <div class="hq-aww__snum-item">
                <span class="hq-aww__snum-big">500</span>
                <span class="hq-aww__snum-plus">+</span>
                <span class="hq-aww__snum-text">Aircraft<br/>Delivered</span>
              </div>
              <div class="hq-aww__snum-item hq-aww__snum-item--offset">
                <span class="hq-aww__snum-big">1K</span>
                <span class="hq-aww__snum-plus">+</span>
                <span class="hq-aww__snum-text">Pilots<br/>Trained</span>
              </div>
              <div class="hq-aww__snum-item">
                <span class="hq-aww__snum-big">30</span>
                <span class="hq-aww__snum-plus">+</span>
                <span class="hq-aww__snum-text">Years<br/>Operating</span>
              </div>
              <div class="hq-aww__snum-content">
                <h2 class="hq-aww__snum-title">HQ Aviation</h2>
                <p class="hq-aww__snum-desc">UK's premier Robinson helicopter dealer since 1990. Sales, training, maintenance, parts.</p>
                <a href="#contact" class="hq-aww__snum-link">Get in touch →</a>
              </div>
            </div>
          </section>`
      },

      // 7. CLAYMORPHISM - Soft 3D Cards
      {
        id: 'aww-clay-services',
        category: 'Claymorphism',
        name: 'Clay 3D Services',
        desc: 'Soft, inflated cards with pastel colors and playful depth.',
        html: `
          <section class="hq-aww hq-aww--clay">
            <div class="hq-container">
              <div class="hq-aww__clay-header">
                <h2 class="hq-aww__clay-title">How can we help?</h2>
                <p class="hq-aww__clay-subtitle">Choose your adventure</p>
              </div>
              <div class="hq-aww__clay-grid">
                <a href="#sales" class="hq-aww__clay-card hq-aww__clay-card--blue">
                  <div class="hq-aww__clay-icon">
                    <div class="hq-aww__clay-icon-inner">🚁</div>
                  </div>
                  <h3>Buy an Aircraft</h3>
                  <p>New & pre-owned Robinson helicopters</p>
                  <span class="hq-aww__clay-arrow">→</span>
                </a>
                <a href="#training" class="hq-aww__clay-card hq-aww__clay-card--pink hq-aww__clay-card--raised">
                  <div class="hq-aww__clay-icon">
                    <div class="hq-aww__clay-icon-inner">✈️</div>
                  </div>
                  <h3>Learn to Fly</h3>
                  <p>PPL(H) training from £299 trial</p>
                  <span class="hq-aww__clay-arrow">→</span>
                  <span class="hq-aww__clay-badge">Popular</span>
                </a>
                <a href="#maintenance" class="hq-aww__clay-card hq-aww__clay-card--green">
                  <div class="hq-aww__clay-icon">
                    <div class="hq-aww__clay-icon-inner">🔧</div>
                  </div>
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved</p>
                  <span class="hq-aww__clay-arrow">→</span>
                </a>
                <a href="#parts" class="hq-aww__clay-card hq-aww__clay-card--orange">
                  <div class="hq-aww__clay-icon">
                    <div class="hq-aww__clay-icon-inner">📦</div>
                  </div>
                  <h3>Order Parts</h3>
                  <p>Same-day UK dispatch</p>
                  <span class="hq-aww__clay-arrow">→</span>
                </a>
              </div>
              <div class="hq-aww__clay-cta">
                <div class="hq-aww__clay-cta-card">
                  <span>Not sure? Give us a call</span>
                  <a href="tel:+441753868976">01753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 8. Y2K CHROME - Liquid metal aesthetic
      {
        id: 'aww-y2k-chrome',
        category: 'Y2K Chrome',
        name: 'Chrome Liquid Hero',
        desc: 'Metallic gradients, distorted type, holographic overlays.',
        html: `
          <section class="hq-aww hq-aww--y2k">
            <div class="hq-aww__y2k-bg">
              <div class="hq-aww__y2k-blob hq-aww__y2k-blob--1"></div>
              <div class="hq-aww__y2k-blob hq-aww__y2k-blob--2"></div>
            </div>
            <div class="hq-aww__y2k-stars"></div>
            <div class="hq-aww__y2k-content">
              <div class="hq-aww__y2k-badge">★ ROBINSON DEALER ★</div>
              <h1 class="hq-aww__y2k-title">
                <span class="hq-aww__y2k-chrome">HQ</span>
                <span class="hq-aww__y2k-chrome">AVIATION</span>
              </h1>
              <div class="hq-aww__y2k-tagline">
                <span>SALES</span>
                <span class="hq-aww__y2k-star">✦</span>
                <span>TRAINING</span>
                <span class="hq-aww__y2k-star">✦</span>
                <span>SERVICE</span>
              </div>
              <div class="hq-aww__y2k-cards">
                <div class="hq-aww__y2k-card">
                  <span class="hq-aww__y2k-card-num">500+</span>
                  <span class="hq-aww__y2k-card-label">AIRCRAFT</span>
                </div>
                <div class="hq-aww__y2k-card">
                  <span class="hq-aww__y2k-card-num">1K+</span>
                  <span class="hq-aww__y2k-card-label">PILOTS</span>
                </div>
                <div class="hq-aww__y2k-card">
                  <span class="hq-aww__y2k-card-num">30+</span>
                  <span class="hq-aww__y2k-card-label">YEARS</span>
                </div>
              </div>
              <a href="#enter" class="hq-aww__y2k-btn">
                <span>ENTER SITE</span>
                <span class="hq-aww__y2k-btn-arrow">→</span>
              </a>
            </div>
          </section>`
      },

      // 9. PAPER INK - Academia tactile
      {
        id: 'aww-paper-editorial',
        category: 'Paper & Ink',
        name: 'Paper Editorial',
        desc: 'Tactile paper texture, ink-bleed typography, warm scholarly feel.',
        html: `
          <section class="hq-aww hq-aww--paper">
            <div class="hq-aww__paper-texture"></div>
            <article class="hq-aww__paper-article">
              <header class="hq-aww__paper-header">
                <div class="hq-aww__paper-meta">
                  <span>The Aviation Journal</span>
                  <span>Vol. XXXIV · No. 1</span>
                </div>
                <h1 class="hq-aww__paper-headline">On the Art of<br/>Helicopter Flight</h1>
                <p class="hq-aww__paper-standfirst">A comprehensive examination of HQ Aviation's three-decade commitment to excellence in rotorcraft sales, training, and maintenance at Denham Aerodrome.</p>
              </header>
              <div class="hq-aww__paper-body">
                <div class="hq-aww__paper-dropcap">S</div>
                <p>ince its founding in 1990, HQ Aviation has established itself as the United Kingdom's foremost Robinson helicopter dealership. The company's philosophy centres on providing comprehensive support throughout the aircraft ownership journey—from initial consultation through acquisition, training, and ongoing maintenance.</p>
                <aside class="hq-aww__paper-pullquote">
                  <blockquote>"We don't just sell helicopters. We create pilots."</blockquote>
                </aside>
                <p>The flight school has trained more than one thousand pilots, each receiving one-to-one instruction from CAA-approved instructors. Meanwhile, the EASA Part-145 approved maintenance facility ensures aircraft remain in optimal condition.</p>
              </div>
              <footer class="hq-aww__paper-footer">
                <span>Enquiries: 01753 868 976</span>
                <span>Denham Aerodrome, Buckinghamshire</span>
              </footer>
            </article>
          </section>`
      },

      // 10. SOLARPUNK - Organic tech
      {
        id: 'aww-solarpunk-hero',
        category: 'Solarpunk',
        name: 'Solarpunk Organic Hero',
        desc: 'Nature meets technology: organic curves, botanical accents, warm golds.',
        html: `
          <section class="hq-aww hq-aww--solar">
            <div class="hq-aww__solar-bg">
              <div class="hq-aww__solar-sun"></div>
              <div class="hq-aww__solar-rays"></div>
            </div>
            <div class="hq-aww__solar-vines hq-aww__solar-vines--left"></div>
            <div class="hq-aww__solar-vines hq-aww__solar-vines--right"></div>
            <div class="hq-aww__solar-content">
              <div class="hq-aww__solar-badge">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span>Sustainable Aviation</span>
              </div>
              <h1 class="hq-aww__solar-title">Flight in<br/>Harmony</h1>
              <p class="hq-aww__solar-text">Connecting you with the sky through Robinson helicopters—designed for efficiency, maintained with care.</p>
              <div class="hq-aww__solar-cards">
                <div class="hq-aww__solar-card">
                  <div class="hq-aww__solar-card-leaf">🌿</div>
                  <h3>Sales</h3>
                  <p>New & Pre-owned aircraft</p>
                </div>
                <div class="hq-aww__solar-card">
                  <div class="hq-aww__solar-card-leaf">🌱</div>
                  <h3>Training</h3>
                  <p>Nurturing new pilots</p>
                </div>
                <div class="hq-aww__solar-card">
                  <div class="hq-aww__solar-card-leaf">🌾</div>
                  <h3>Service</h3>
                  <p>Careful maintenance</p>
                </div>
              </div>
              <a href="#grow" class="hq-aww__solar-btn">Begin Your Journey</a>
            </div>
          </section>`
      },

      // 11. DIAGONAL SPLIT - Dramatic angle
      {
        id: 'aww-diagonal-split',
        category: 'Diagonal',
        name: 'Diagonal Drama',
        desc: 'Bold diagonal split with overlapping type and image.',
        html: `
          <section class="hq-aww hq-aww--diagonal">
            <div class="hq-aww__diag-bg hq-aww__diag-bg--dark"></div>
            <div class="hq-aww__diag-bg hq-aww__diag-bg--light"></div>
            <div class="hq-aww__diag-content">
              <div class="hq-aww__diag-text">
                <span class="hq-aww__diag-label">Since 1990</span>
                <h1 class="hq-aww__diag-title">HQ<br/>Aviation</h1>
                <p class="hq-aww__diag-desc">The UK's leading Robinson helicopter specialists. Sales, training, maintenance, and parts.</p>
                <a href="#explore" class="hq-aww__diag-btn">Explore →</a>
              </div>
              <div class="hq-aww__diag-image">
                <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
              </div>
              <div class="hq-aww__diag-stats">
                <div class="hq-aww__diag-stat">
                  <span>500+</span>
                  <span>Aircraft</span>
                </div>
                <div class="hq-aww__diag-stat">
                  <span>1000+</span>
                  <span>Pilots</span>
                </div>
              </div>
            </div>
            <div class="hq-aww__diag-contact">
              <a href="tel:+441753868976">01753 868 976</a>
            </div>
          </section>`
      },

      // 12. OVERLAPPING CARDS - Depth composition
      {
        id: 'aww-overlap-cards',
        category: 'Overlap',
        name: 'Floating Card Stack',
        desc: 'Layered cards with depth, shadows creating visual hierarchy.',
        html: `
          <section class="hq-aww hq-aww--overlap">
            <div class="hq-aww__overlap-bg"></div>
            <div class="hq-aww__overlap-stack">
              <div class="hq-aww__overlap-card hq-aww__overlap-card--back">
                <span class="hq-aww__overlap-card-label">Parts Supply</span>
                <p>10,000+ items in stock. Same-day UK dispatch.</p>
              </div>
              <div class="hq-aww__overlap-card hq-aww__overlap-card--mid">
                <span class="hq-aww__overlap-card-label">Maintenance</span>
                <p>EASA Part-145 approved. Factory-trained engineers.</p>
              </div>
              <div class="hq-aww__overlap-card hq-aww__overlap-card--front">
                <span class="hq-aww__overlap-card-label">Aircraft Sales</span>
                <p>New & pre-owned Robinson helicopters.</p>
                <span class="hq-aww__overlap-card-stat">500+ sold</span>
              </div>
            </div>
            <div class="hq-aww__overlap-hero">
              <h1 class="hq-aww__overlap-title">Complete helicopter solutions</h1>
              <p class="hq-aww__overlap-subtitle">HQ Aviation — Your trusted partner since 1990</p>
              <a href="#services" class="hq-aww__overlap-btn">Discover Our Services</a>
            </div>
          </section>`
      },

      // 13. SPLIT REVEAL - Hover reveal
      {
        id: 'aww-split-reveal',
        category: 'Interactive',
        name: 'Split Reveal Panels',
        desc: 'Two-panel layout with subtle depth and interactivity.',
        html: `
          <section class="hq-aww hq-aww--reveal">
            <div class="hq-aww__reveal-panel hq-aww__reveal-panel--left">
              <div class="hq-aww__reveal-content">
                <span class="hq-aww__reveal-tag">For Buyers</span>
                <h2 class="hq-aww__reveal-title">Find Your<br/>Aircraft</h2>
                <p class="hq-aww__reveal-text">New factory orders. Pre-owned gems. Your perfect Robinson awaits.</p>
                <ul class="hq-aww__reveal-list">
                  <li>R22 Beta II</li>
                  <li>R44 Raven II</li>
                  <li>R66 Turbine</li>
                </ul>
                <a href="#sales" class="hq-aww__reveal-link">View Aircraft →</a>
              </div>
              <div class="hq-aww__reveal-bg"></div>
            </div>
            <div class="hq-aww__reveal-panel hq-aww__reveal-panel--right">
              <div class="hq-aww__reveal-content">
                <span class="hq-aww__reveal-tag">For Pilots</span>
                <h2 class="hq-aww__reveal-title">Learn to<br/>Fly</h2>
                <p class="hq-aww__reveal-text">From first hover to licensed pilot. 1-to-1 instruction with experienced instructors.</p>
                <ul class="hq-aww__reveal-list">
                  <li>Trial Flights</li>
                  <li>PPL(H) Course</li>
                  <li>Type Ratings</li>
                </ul>
                <a href="#training" class="hq-aww__reveal-link">Start Training →</a>
              </div>
              <div class="hq-aww__reveal-bg"></div>
            </div>
            <div class="hq-aww__reveal-center">
              <span>HQ</span>
            </div>
          </section>`
      },

      // 14. KINETIC TYPE - Motion-inspired
      {
        id: 'aww-kinetic-hero',
        category: 'Kinetic',
        name: 'Kinetic Typography Hero',
        desc: 'Dynamic, motion-inspired layout with staggered type.',
        html: `
          <section class="hq-aww hq-aww--kinetic">
            <div class="hq-aww__kinetic-bg"></div>
            <div class="hq-aww__kinetic-content">
              <div class="hq-aww__kinetic-intro">
                <span class="hq-aww__kinetic-pre">UK's Premier</span>
              </div>
              <h1 class="hq-aww__kinetic-headline">
                <span class="hq-aww__kinetic-word hq-aww__kinetic-word--1">Robinson</span>
                <span class="hq-aww__kinetic-word hq-aww__kinetic-word--2">Helicopter</span>
                <span class="hq-aww__kinetic-word hq-aww__kinetic-word--3">Dealer</span>
              </h1>
              <div class="hq-aww__kinetic-services">
                <span class="hq-aww__kinetic-service">Sales</span>
                <span class="hq-aww__kinetic-dot"></span>
                <span class="hq-aww__kinetic-service">Training</span>
                <span class="hq-aww__kinetic-dot"></span>
                <span class="hq-aww__kinetic-service">Maintenance</span>
                <span class="hq-aww__kinetic-dot"></span>
                <span class="hq-aww__kinetic-service">Parts</span>
              </div>
              <div class="hq-aww__kinetic-cta">
                <a href="#discover" class="hq-aww__kinetic-btn">Discover HQ →</a>
              </div>
            </div>
            <div class="hq-aww__kinetic-meta">
              <span>Est. 1990</span>
              <span>Denham Aerodrome</span>
              <a href="tel:+441753868976">01753 868 976</a>
            </div>
          </section>`
      },

      // 15. EDITORIAL OVERLAP - Magazine style
      {
        id: 'aww-editorial-overlap',
        category: 'Editorial',
        name: 'Editorial Overlap',
        desc: 'Magazine-style layout with overlapping image and text.',
        html: `
          <section class="hq-aww hq-aww--editorial-o">
            <div class="hq-aww__ed-layout">
              <div class="hq-aww__ed-image-wrap">
                <div class="hq-aww__ed-image">
                  <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
                </div>
                <div class="hq-aww__ed-image-caption">
                  <span>R66 Turbine</span>
                  <span>5-Seat / 300 SHP</span>
                </div>
              </div>
              <div class="hq-aww__ed-text">
                <span class="hq-aww__ed-issue">Feature Story</span>
                <h1 class="hq-aww__ed-headline">The Art of<br/>Robinson<br/>Ownership</h1>
                <p class="hq-aww__ed-intro">For over three decades, HQ Aviation has been guiding discerning buyers through the journey of helicopter ownership—from selection to first flight and beyond.</p>
                <a href="#read" class="hq-aww__ed-more">Read the Story →</a>
              </div>
              <div class="hq-aww__ed-sidebar">
                <div class="hq-aww__ed-stat">
                  <span>500+</span>
                  <span>Aircraft Sold</span>
                </div>
                <div class="hq-aww__ed-stat">
                  <span>30+</span>
                  <span>Years Experience</span>
                </div>
              </div>
            </div>
          </section>`
      },

      // 16. STACKED SECTIONS - Vertical rhythm
      {
        id: 'aww-stacked-sections',
        category: 'Stacked',
        name: 'Vertical Rhythm Stack',
        desc: 'Bold vertical sections with strong typographic hierarchy.',
        html: `
          <section class="hq-aww hq-aww--stacked">
            <div class="hq-aww__stack-section hq-aww__stack-section--hero">
              <span class="hq-aww__stack-num">01</span>
              <h1 class="hq-aww__stack-title">HQ Aviation</h1>
              <p class="hq-aww__stack-sub">Robinson Helicopter Specialists · Since 1990</p>
            </div>
            <div class="hq-aww__stack-section hq-aww__stack-section--sales">
              <span class="hq-aww__stack-num">02</span>
              <h2 class="hq-aww__stack-heading">Aircraft Sales</h2>
              <p class="hq-aww__stack-text">New and pre-owned Robinson helicopters. Factory configured or handpicked from our curated inventory.</p>
              <span class="hq-aww__stack-stat">500+ aircraft delivered</span>
            </div>
            <div class="hq-aww__stack-section hq-aww__stack-section--training">
              <span class="hq-aww__stack-num">03</span>
              <h2 class="hq-aww__stack-heading">Flight Training</h2>
              <p class="hq-aww__stack-text">From trial flight to PPL(H). CAA-approved school with one-to-one instruction.</p>
              <span class="hq-aww__stack-stat">1000+ pilots trained</span>
            </div>
            <div class="hq-aww__stack-section hq-aww__stack-section--cta">
              <span class="hq-aww__stack-num">04</span>
              <h2 class="hq-aww__stack-heading">Get Started</h2>
              <a href="tel:+441753868976" class="hq-aww__stack-phone">01753 868 976</a>
            </div>
          </section>`
      },

      // 17. FLOATING ELEMENTS - Scattered composition
      {
        id: 'aww-floating-scatter',
        category: 'Floating',
        name: 'Scattered Float',
        desc: 'Elements floating at different depths with organic placement.',
        html: `
          <section class="hq-aww hq-aww--float">
            <div class="hq-aww__float-element hq-aww__float-element--title">
              <h1>HQ<br/>Aviation</h1>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--tag">
              <span>UK's Premier Robinson Dealer</span>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--stat1">
              <span>500+</span>
              <span>Aircraft</span>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--stat2">
              <span>1000+</span>
              <span>Pilots</span>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--image">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--cta">
              <a href="#explore">Explore →</a>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--contact">
              <span>01753 868 976</span>
            </div>
            <div class="hq-aww__float-element hq-aww__float-element--year">
              <span>Est. 1990</span>
            </div>
            <div class="hq-aww__float-services">
              <span>Sales</span>
              <span>Training</span>
              <span>Maintenance</span>
              <span>Parts</span>
            </div>
          </section>`
      },

      // 18. MARQUEE - Infinite scroll text
      {
        id: 'aww-marquee-hero',
        category: 'Marquee',
        name: 'Marquee Text Hero',
        desc: 'Oversized scrolling text with static content overlay.',
        html: `
          <section class="hq-aww hq-aww--marquee">
            <div class="hq-aww__marquee-bg">
              <div class="hq-aww__marquee-track hq-aww__marquee-track--1">
                <span>SALES • TRAINING • MAINTENANCE • PARTS • </span>
                <span>SALES • TRAINING • MAINTENANCE • PARTS • </span>
              </div>
              <div class="hq-aww__marquee-track hq-aww__marquee-track--2">
                <span>R22 • R44 • R66 • ROBINSON • </span>
                <span>R22 • R44 • R66 • ROBINSON • </span>
              </div>
              <div class="hq-aww__marquee-track hq-aww__marquee-track--3">
                <span>SINCE 1990 • DENHAM AERODROME • 500+ AIRCRAFT • </span>
                <span>SINCE 1990 • DENHAM AERODROME • 500+ AIRCRAFT • </span>
              </div>
            </div>
            <div class="hq-aww__marquee-content">
              <div class="hq-aww__marquee-card">
                <h1 class="hq-aww__marquee-title">HQ Aviation</h1>
                <p class="hq-aww__marquee-text">UK's premier Robinson helicopter specialists</p>
                <div class="hq-aww__marquee-cta">
                  <a href="#discover" class="hq-aww__marquee-btn">Discover</a>
                  <a href="tel:+441753868976" class="hq-aww__marquee-phone">01753 868 976</a>
                </div>
              </div>
            </div>
          </section>`
      },

      // 19. BRUTALIST OFFSET - Raw asymmetry
      {
        id: 'aww-brutal-offset',
        category: 'Brutalist',
        name: 'Brutal Offset Grid',
        desc: 'Raw brutalist aesthetic with offset elements and hard shadows.',
        html: `
          <section class="hq-aww hq-aww--brutal">
            <div class="hq-aww__brutal-grid">
              <div class="hq-aww__brutal-block hq-aww__brutal-block--title">
                <h1>HQ<br/>AVI<br/>ATION</h1>
              </div>
              <div class="hq-aww__brutal-block hq-aww__brutal-block--info">
                <span class="hq-aww__brutal-label">EST</span>
                <span class="hq-aww__brutal-value">1990</span>
              </div>
              <div class="hq-aww__brutal-block hq-aww__brutal-block--service1">
                <span class="hq-aww__brutal-num">[01]</span>
                <h3>SALES</h3>
                <p>NEW & PRE-OWNED ROBINSON</p>
              </div>
              <div class="hq-aww__brutal-block hq-aww__brutal-block--service2">
                <span class="hq-aww__brutal-num">[02]</span>
                <h3>TRAINING</h3>
                <p>PPL(H) • CAA APPROVED</p>
              </div>
              <div class="hq-aww__brutal-block hq-aww__brutal-block--stat">
                <span class="hq-aww__brutal-big">500+</span>
                <span>AIRCRAFT</span>
              </div>
              <div class="hq-aww__brutal-block hq-aww__brutal-block--cta">
                <a href="tel:+441753868976">
                  <span>CALL</span>
                  <span>01753</span>
                  <span>868 976</span>
                </a>
              </div>
            </div>
          </section>`
      },

      // 20. GLASS CARDS FLOAT - Depth layers
      {
        id: 'aww-glass-float',
        category: 'Glass',
        name: 'Floating Glass Panels',
        desc: 'Multiple glass panels at varying depths with rich background.',
        html: `
          <section class="hq-aww hq-aww--glassfloat">
            <div class="hq-aww__gf-bg">
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Flight">
            </div>
            <div class="hq-aww__gf-overlay"></div>
            <div class="hq-aww__gf-panels">
              <div class="hq-aww__gf-panel hq-aww__gf-panel--main">
                <h1 class="hq-aww__gf-title">HQ Aviation</h1>
                <p class="hq-aww__gf-text">UK's premier Robinson helicopter specialists since 1990</p>
                <a href="#discover" class="hq-aww__gf-btn">Explore Our Services</a>
              </div>
              <div class="hq-aww__gf-panel hq-aww__gf-panel--stat1">
                <span class="hq-aww__gf-stat-num">500+</span>
                <span class="hq-aww__gf-stat-label">Aircraft Sold</span>
              </div>
              <div class="hq-aww__gf-panel hq-aww__gf-panel--stat2">
                <span class="hq-aww__gf-stat-num">1000+</span>
                <span class="hq-aww__gf-stat-label">Pilots Trained</span>
              </div>
              <div class="hq-aww__gf-panel hq-aww__gf-panel--contact">
                <span>Get in touch</span>
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
              <div class="hq-aww__gf-panel hq-aww__gf-panel--badge">
                <span>EASA Part-145</span>
              </div>
            </div>
          </section>`
      },

      // 21. CIRCULAR COMPOSITION - Radial layout
      {
        id: 'aww-circular-layout',
        category: 'Circular',
        name: 'Radial Composition',
        desc: 'Circular/radial layout with services arranged around center.',
        html: `
          <section class="hq-aww hq-aww--circular">
            <div class="hq-aww__circ-center">
              <div class="hq-aww__circ-logo">HQ</div>
              <span class="hq-aww__circ-name">Aviation</span>
            </div>
            <div class="hq-aww__circ-orbit">
              <a href="#sales" class="hq-aww__circ-item hq-aww__circ-item--1">
                <span class="hq-aww__circ-item-title">Sales</span>
                <span class="hq-aww__circ-item-stat">500+</span>
              </a>
              <a href="#training" class="hq-aww__circ-item hq-aww__circ-item--2">
                <span class="hq-aww__circ-item-title">Training</span>
                <span class="hq-aww__circ-item-stat">1000+</span>
              </a>
              <a href="#maintenance" class="hq-aww__circ-item hq-aww__circ-item--3">
                <span class="hq-aww__circ-item-title">Service</span>
                <span class="hq-aww__circ-item-stat">30yr</span>
              </a>
              <a href="#parts" class="hq-aww__circ-item hq-aww__circ-item--4">
                <span class="hq-aww__circ-item-title">Parts</span>
                <span class="hq-aww__circ-item-stat">24hr</span>
              </a>
            </div>
            <div class="hq-aww__circ-tagline">Robinson Helicopter Specialists · Denham</div>
            <div class="hq-aww__circ-contact">
              <a href="tel:+441753868976">01753 868 976</a>
            </div>
          </section>`
      },

      // 22. MINIMAL IMPACT - Huge type, minimal elements
      {
        id: 'aww-minimal-impact',
        category: 'Minimal',
        name: 'Minimal Impact Type',
        desc: 'Massive typography with minimal supporting elements.',
        html: `
          <section class="hq-aww hq-aww--impact">
            <div class="hq-aww__impact-bg"></div>
            <h1 class="hq-aww__impact-title">
              <span class="hq-aww__impact-line hq-aww__impact-line--1">Your</span>
              <span class="hq-aww__impact-line hq-aww__impact-line--2">Aviation</span>
              <span class="hq-aww__impact-line hq-aww__impact-line--3">Partner</span>
            </h1>
            <div class="hq-aww__impact-meta">
              <span>HQ Aviation</span>
              <span>Since 1990</span>
            </div>
            <a href="#explore" class="hq-aww__impact-cta">
              <span>Explore</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </section>`
      },

      // 23. LAYERED GRADIENT - Multiple gradient layers
      {
        id: 'aww-layered-gradient',
        category: 'Gradient',
        name: 'Layered Gradient Depth',
        desc: 'Multiple gradient layers creating rich depth and dimension.',
        html: `
          <section class="hq-aww hq-aww--laygrad">
            <div class="hq-aww__lg-layer hq-aww__lg-layer--1"></div>
            <div class="hq-aww__lg-layer hq-aww__lg-layer--2"></div>
            <div class="hq-aww__lg-layer hq-aww__lg-layer--3"></div>
            <div class="hq-aww__lg-content">
              <div class="hq-aww__lg-header">
                <span class="hq-aww__lg-pre">Robinson Specialists</span>
                <h1 class="hq-aww__lg-title">HQ Aviation</h1>
              </div>
              <div class="hq-aww__lg-services">
                <div class="hq-aww__lg-service">
                  <h3>Aircraft Sales</h3>
                  <p>New & pre-owned Robinson helicopters</p>
                </div>
                <div class="hq-aww__lg-service">
                  <h3>Flight Training</h3>
                  <p>PPL(H) from zero to licensed pilot</p>
                </div>
                <div class="hq-aww__lg-service">
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 approved facility</p>
                </div>
              </div>
              <div class="hq-aww__lg-footer">
                <span>Denham Aerodrome · Est. 1990</span>
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // 24. TIMELINE VERTICAL - Storytelling
      {
        id: 'aww-timeline-story',
        category: 'Timeline',
        name: 'Vertical Story Timeline',
        desc: 'Vertical timeline with overlapping content blocks.',
        html: `
          <section class="hq-aww hq-aww--timeline">
            <div class="hq-aww__tl-line"></div>
            <div class="hq-aww__tl-header">
              <h2>Your Journey with HQ</h2>
            </div>
            <div class="hq-aww__tl-item hq-aww__tl-item--left">
              <div class="hq-aww__tl-dot"></div>
              <div class="hq-aww__tl-card">
                <span class="hq-aww__tl-step">01</span>
                <h3>Discovery</h3>
                <p>Book a trial flight. Experience the magic of helicopter flight for yourself.</p>
                <span class="hq-aww__tl-price">From £299</span>
              </div>
            </div>
            <div class="hq-aww__tl-item hq-aww__tl-item--right">
              <div class="hq-aww__tl-dot"></div>
              <div class="hq-aww__tl-card">
                <span class="hq-aww__tl-step">02</span>
                <h3>Training</h3>
                <p>Begin your PPL(H). Learn with experienced CAA-approved instructors.</p>
                <span class="hq-aww__tl-duration">45+ hours</span>
              </div>
            </div>
            <div class="hq-aww__tl-item hq-aww__tl-item--left">
              <div class="hq-aww__tl-dot"></div>
              <div class="hq-aww__tl-card">
                <span class="hq-aww__tl-step">03</span>
                <h3>Ownership</h3>
                <p>Find your perfect aircraft. New or pre-owned, we'll guide you through.</p>
                <span class="hq-aww__tl-stat">500+ sold</span>
              </div>
            </div>
            <div class="hq-aww__tl-item hq-aww__tl-item--right">
              <div class="hq-aww__tl-dot"></div>
              <div class="hq-aww__tl-card">
                <span class="hq-aww__tl-step">04</span>
                <h3>Partnership</h3>
                <p>Ongoing maintenance, parts, and support. We're with you for the journey.</p>
                <span class="hq-aww__tl-cert">EASA Part-145</span>
              </div>
            </div>
            <div class="hq-aww__tl-cta">
              <a href="#start">Begin Your Journey →</a>
            </div>
          </section>`
      },

      // 25. CARD PERSPECTIVE - 3D depth
      {
        id: 'aww-perspective-cards',
        category: 'Perspective',
        name: '3D Perspective Cards',
        desc: 'Cards with 3D perspective transforms creating depth.',
        html: `
          <section class="hq-aww hq-aww--persp">
            <div class="hq-aww__persp-header">
              <span>HQ Aviation</span>
              <h2>Our Services</h2>
            </div>
            <div class="hq-aww__persp-scene">
              <a href="#sales" class="hq-aww__persp-card hq-aww__persp-card--1">
                <div class="hq-aww__persp-card-front">
                  <span class="hq-aww__persp-card-icon">✦</span>
                  <h3>Aircraft Sales</h3>
                  <p>New & pre-owned Robinson helicopters</p>
                  <span class="hq-aww__persp-card-stat">500+ sold</span>
                </div>
              </a>
              <a href="#training" class="hq-aww__persp-card hq-aww__persp-card--2">
                <div class="hq-aww__persp-card-front">
                  <span class="hq-aww__persp-card-icon">◈</span>
                  <h3>Flight Training</h3>
                  <p>PPL(H) with CAA-approved instructors</p>
                  <span class="hq-aww__persp-card-stat">1000+ pilots</span>
                </div>
              </a>
              <a href="#maintenance" class="hq-aww__persp-card hq-aww__persp-card--3">
                <div class="hq-aww__persp-card-front">
                  <span class="hq-aww__persp-card-icon">⬡</span>
                  <h3>Maintenance</h3>
                  <p>EASA Part-145 certified facility</p>
                  <span class="hq-aww__persp-card-stat">30+ years</span>
                </div>
              </a>
            </div>
            <div class="hq-aww__persp-cta">
              <a href="tel:+441753868976">Call 01753 868 976</a>
            </div>
          </section>`
      },

      // 26. DYNAMIC GRID - Varied cell sizes
      {
        id: 'aww-dynamic-grid',
        category: 'Dynamic Grid',
        name: 'Dynamic Cell Grid',
        desc: 'CSS Grid with dramatically varied cell sizes and overlaps.',
        html: `
          <section class="hq-aww hq-aww--dyngrid">
            <div class="hq-aww__dg-grid">
              <div class="hq-aww__dg-cell hq-aww__dg-cell--title">
                <h1>HQ<br/>Aviation</h1>
                <span>Since 1990</span>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--image">
                <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--stat1">
                <span class="hq-aww__dg-num">500+</span>
                <span class="hq-aww__dg-label">Aircraft</span>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--sales">
                <h3>Sales</h3>
                <p>New & Pre-owned Robinson</p>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--training">
                <h3>Training</h3>
                <p>PPL(H) Course</p>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--stat2">
                <span class="hq-aww__dg-num">1K+</span>
                <span class="hq-aww__dg-label">Pilots</span>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--maintenance">
                <h3>Maintenance</h3>
                <p>EASA Part-145</p>
              </div>
              <div class="hq-aww__dg-cell hq-aww__dg-cell--cta">
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // 27. SPLIT SCROLL - Pinned section
      {
        id: 'aww-split-pin',
        category: 'Split Pin',
        name: 'Split Pinned Content',
        desc: 'One side pinned while other scrolls, creating dynamic reveal.',
        html: `
          <section class="hq-aww hq-aww--splitpin">
            <div class="hq-aww__sp-fixed">
              <div class="hq-aww__sp-brand">
                <h1>HQ</h1>
                <span>Aviation</span>
              </div>
              <div class="hq-aww__sp-tagline">Robinson Helicopter Specialists</div>
              <div class="hq-aww__sp-contact">
                <span>Denham Aerodrome</span>
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
            </div>
            <div class="hq-aww__sp-scroll">
              <div class="hq-aww__sp-item">
                <span class="hq-aww__sp-num">01</span>
                <h2>Aircraft Sales</h2>
                <p>New Robinson helicopters factory-configured to your specification. Pre-owned aircraft inspected and certified by our engineers.</p>
                <span class="hq-aww__sp-stat">500+ aircraft sold</span>
              </div>
              <div class="hq-aww__sp-item">
                <span class="hq-aww__sp-num">02</span>
                <h2>Flight Training</h2>
                <p>From zero experience to licensed pilot. CAA-approved school with experienced instructors. Flexible scheduling.</p>
                <span class="hq-aww__sp-stat">1000+ pilots trained</span>
              </div>
              <div class="hq-aww__sp-item">
                <span class="hq-aww__sp-num">03</span>
                <h2>Maintenance</h2>
                <p>EASA Part-145 approved facility. Factory-trained engineers. Annual inspections, overhauls, repairs.</p>
                <span class="hq-aww__sp-stat">30+ years experience</span>
              </div>
              <div class="hq-aww__sp-item">
                <span class="hq-aww__sp-num">04</span>
                <h2>Parts Supply</h2>
                <p>Extensive Robinson parts inventory. Same-day UK dispatch. Worldwide shipping available.</p>
                <span class="hq-aww__sp-stat">10,000+ parts in stock</span>
              </div>
            </div>
          </section>`
      },

      // 28. COLLAGE - Artistic overlap
      {
        id: 'aww-collage-artistic',
        category: 'Collage',
        name: 'Artistic Collage',
        desc: 'Artistic collage with overlapping images and text.',
        html: `
          <section class="hq-aww hq-aww--collage">
            <div class="hq-aww__col-item hq-aww__col-item--title">
              <h1>HQ Aviation</h1>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--image1">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66">
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--tag">
              <span>Robinson Specialists</span>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--stat">
              <span>500+</span>
              <span>Aircraft Sold</span>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--services">
              <span>Sales</span>
              <span>Training</span>
              <span>Maintenance</span>
              <span>Parts</span>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--year">
              <span>Since</span>
              <span>1990</span>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--cta">
              <a href="tel:+441753868976">01753 868 976</a>
            </div>
            <div class="hq-aww__col-item hq-aww__col-item--location">
              <span>Denham Aerodrome<br/>Buckinghamshire</span>
            </div>
          </section>`
      },

      // 29. MINIMAL LINE - Refined simplicity
      {
        id: 'aww-minimal-line',
        category: 'Minimal',
        name: 'Refined Line Minimal',
        desc: 'Ultra minimal with delicate lines and refined typography.',
        html: `
          <section class="hq-aww hq-aww--minline">
            <div class="hq-aww__ml-container">
              <div class="hq-aww__ml-top">
                <span>HQ Aviation</span>
                <span>Est. 1990</span>
              </div>
              <div class="hq-aww__ml-line"></div>
              <h1 class="hq-aww__ml-title">Robinson<br/>Helicopter<br/>Specialists</h1>
              <div class="hq-aww__ml-line"></div>
              <div class="hq-aww__ml-services">
                <a href="#sales">Sales</a>
                <span class="hq-aww__ml-dot"></span>
                <a href="#training">Training</a>
                <span class="hq-aww__ml-dot"></span>
                <a href="#maintenance">Maintenance</a>
                <span class="hq-aww__ml-dot"></span>
                <a href="#parts">Parts</a>
              </div>
              <div class="hq-aww__ml-line"></div>
              <div class="hq-aww__ml-bottom">
                <span>Denham Aerodrome</span>
                <a href="tel:+441753868976">01753 868 976</a>
              </div>
            </div>
          </section>`
      },

      // 30. BOLD STATEMENT - Single focus
      {
        id: 'aww-bold-statement',
        category: 'Statement',
        name: 'Bold Single Statement',
        desc: 'Single bold statement with supporting micro-content.',
        html: `
          <section class="hq-aww hq-aww--statement">
            <div class="hq-aww__stmt-bg"></div>
            <div class="hq-aww__stmt-content">
              <div class="hq-aww__stmt-pre">
                <span>HQ Aviation · Denham · Since 1990</span>
              </div>
              <h1 class="hq-aww__stmt-main">
                We help people<br/>
                <em>fly helicopters.</em>
              </h1>
              <div class="hq-aww__stmt-services">
                <div class="hq-aww__stmt-service">
                  <span>Sales</span>
                  <span>500+ aircraft</span>
                </div>
                <div class="hq-aww__stmt-service">
                  <span>Training</span>
                  <span>1000+ pilots</span>
                </div>
                <div class="hq-aww__stmt-service">
                  <span>Service</span>
                  <span>EASA certified</span>
                </div>
              </div>
              <div class="hq-aww__stmt-cta">
                <a href="#start" class="hq-aww__stmt-btn">Get Started</a>
                <a href="tel:+441753868976" class="hq-aww__stmt-phone">01753 868 976</a>
              </div>
            </div>
          </section>`
      }
    ]
  };

  // ============================================
  // PAGE COMBINATIONS
  // ============================================

  const PAGE_LAYOUTS = [
    { name: 'Layout A: Classic', desc: 'Clean minimal hero with standard sections', sections: ['hero-minimal-centered', 'aircraft-grid-3', 'services-icons-4', 'trust-stats-simple', 'cta-simple-centered'] },
    { name: 'Layout B: Premium', desc: 'Split hero with featured content', sections: ['hero-split-50', 'aircraft-featured-large', 'services-split-image', 'trust-testimonial-single', 'cta-with-image'] },
    { name: 'Layout C: Sales Focus', desc: 'Product-driven with comparison', sections: ['hero-product-lineup', 'aircraft-comparison-table', 'services-hover-cards', 'trust-testimonials-grid', 'cta-split-contact'] },
    { name: 'Layout D: Cinematic', desc: 'Dark moody atmosphere', sections: ['hero-cinematic-dark', 'aircraft-carousel', 'trust-logos-bar', 'services-icons-4', 'cta-with-image'] },
    { name: 'Layout E: Action Path', desc: 'Dual path with quick actions', sections: ['hero-action-dual', 'aircraft-masonry', 'trust-stats-simple', 'cta-simple-centered'] },
    { name: 'Layout F: Heritage', desc: 'Trust and history focused', sections: ['hero-trust-heritage', 'aircraft-grid-3', 'services-split-image', 'trust-testimonials-grid', 'cta-split-contact'] },
    { name: 'Layout G: Editorial', desc: 'Magazine-style storytelling', sections: ['hero-editorial-magazine', 'aircraft-featured-large', 'trust-testimonial-single', 'cta-with-image'] },
    { name: 'Layout H: Service Hub', desc: 'Triple path action focused', sections: ['hero-action-triple', 'services-hover-cards', 'aircraft-grid-3', 'trust-stats-simple', 'cta-simple-centered'] },
    { name: 'Layout I: Story-driven', desc: 'Team and founder focus', sections: ['hero-cinematic-dark', 'team-founder-spotlight', 'features-alternating', 'pilots-success-stories', 'quote-large', 'cta-with-image'] },
    { name: 'Layout J: Full Experience', desc: 'Comprehensive showcase', sections: ['hero-minimal-centered', 'partners-marquee', 'aircraft-grid-3', 'features-icon-grid', 'video-featured', 'trust-testimonials-grid', 'faq-accordion', 'cta-split-contact'] },
    { name: 'Layout K: Training Focus', desc: 'Flight school optimized', sections: ['hero-action-booking', 'process-timeline', 'pilots-success-stories', 'faq-two-column', 'newsletter-feature', 'cta-simple-centered'] },
    { name: 'Layout L: Expedition', desc: 'Adventure and travel focused', sections: ['hero-cinematic-parallax', 'expedition-showcase', 'gallery-masonry', 'team-grid-4', 'social-instagram', 'cta-with-image'] },
    { name: 'Layout M: Sales Funnel', desc: 'Conversion optimized', sections: ['hero-product-showcase', 'compare-new-used', 'financing-options', 'trust-logos-bar', 'faq-accordion', 'cta-split-contact'] },
    { name: 'Layout N: Content Rich', desc: 'Blog and resources focus', sections: ['hero-editorial-quote', 'blog-featured-grid', 'video-gallery', 'events-upcoming', 'newsletter-simple', 'cta-simple-centered'] },
    { name: 'Layout O: Local Business', desc: 'Location and contact focus', sections: ['hero-minimal-left', 'services-icons-4', 'location-split-map', 'trust-stats-simple', 'social-stats-bar', 'cta-split-contact'] },
    { name: 'Layout P: Fleet Showcase', desc: 'Aircraft exploration', sections: ['hero-product-lineup', 'fleet-interactive', 'aircraft-comparison-table', 'financing-options', 'trust-logos-bar', 'cta-with-image'] }
  ];

  // ============================================
  // PICKER UI
  // ============================================

  let currentSection = 'heroes';
  let currentIndex = 0;
  let selectedSections = {};
  let pickerVisible = true;
  // Favorites now stored as [{id, note, name}]
  let favorites = JSON.parse(localStorage.getItem('hqp-favorites') || '[]');
  // Migrate old format (array of strings) to new format
  if (favorites.length > 0 && typeof favorites[0] === 'string') {
    favorites = favorites.map(id => ({ id, note: '', name: '' }));
    localStorage.setItem('hqp-favorites', JSON.stringify(favorites));
  }
  let showingFavoritesOnly = false;

  function saveFavorites() {
    localStorage.setItem('hqp-favorites', JSON.stringify(favorites));
    updateFavoritesCount();
  }

  function isFavorite(id) {
    return favorites.some(f => f.id === id);
  }

  function getFavorite(id) {
    return favorites.find(f => f.id === id);
  }

  function getCurrentItemInfo() {
    const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);
    const current = items[currentIndex];
    const id = currentSection === 'layouts' ? current.name : current.id;
    const name = currentSection === 'layouts' ? current.name : current.name;
    return { id, name, current };
  }

  function toggleFavorite(id) {
    if (isFavorite(id)) {
      // Remove favorite
      favorites = favorites.filter(f => f.id !== id);
      saveFavorites();
      updateFavoriteButton();
      hideNoteInput();
    } else {
      // Show note input for new favorite
      showNoteInput(id);
    }
  }

  function addFavoriteWithNote(id, note) {
    const { name } = getCurrentItemInfo();
    favorites.push({ id, note: note || '', name });
    saveFavorites();
    updateFavoriteButton();
    hideNoteInput();
  }

  function showNoteInput(id) {
    const existing = document.querySelector('.hqp-note-modal');
    if (existing) existing.remove();

    const { name } = getCurrentItemInfo();

    const modal = document.createElement('div');
    modal.className = 'hqp-note-modal';
    modal.innerHTML = `
      <div class="hqp-note-modal__content">
        <div class="hqp-note-modal__header">
          <span class="hqp-note-modal__icon">★</span>
          <span>Add to Favorites</span>
        </div>
        <div class="hqp-note-modal__name">${name}</div>
        <textarea class="hqp-note-input" placeholder="Add a note (optional)..." rows="2"></textarea>
        <div class="hqp-note-modal__actions">
          <button class="hqp-note-cancel">Cancel</button>
          <button class="hqp-note-save">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('.hqp-note-input');
    const saveBtn = modal.querySelector('.hqp-note-save');
    const cancelBtn = modal.querySelector('.hqp-note-cancel');

    input.focus();

    saveBtn.addEventListener('click', () => {
      addFavoriteWithNote(id, input.value.trim());
    });

    cancelBtn.addEventListener('click', hideNoteInput);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addFavoriteWithNote(id, input.value.trim());
      }
      if (e.key === 'Escape') {
        hideNoteInput();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideNoteInput();
    });
  }

  function hideNoteInput() {
    const modal = document.querySelector('.hqp-note-modal');
    if (modal) modal.remove();
  }

  function updateFavoriteButton() {
    const btn = document.querySelector('.hqp-fav-btn');
    const icon = document.querySelector('.hqp-fav-icon');
    if (!btn || !icon) return;

    const { id } = getCurrentItemInfo();
    const fav = getFavorite(id);

    if (fav) {
      btn.classList.add('hqp-fav-btn--active');
      icon.textContent = '★';
      btn.title = fav.note ? `Note: ${fav.note}` : 'Remove from favorites';
      if (fav.note) {
        btn.classList.add('hqp-fav-btn--has-note');
      } else {
        btn.classList.remove('hqp-fav-btn--has-note');
      }
    } else {
      btn.classList.remove('hqp-fav-btn--active', 'hqp-fav-btn--has-note');
      icon.textContent = '☆';
      btn.title = 'Add to favorites';
    }
  }

  function updateFavoritesCount() {
    const countEl = document.querySelector('.hqp-fav-count');
    if (countEl) {
      countEl.textContent = favorites.length;
    }
    const favsBtn = document.querySelector('.hqp-favs-btn');
    if (favsBtn) {
      favsBtn.classList.toggle('hqp-favs-btn--has-items', favorites.length > 0);
    }
  }

  function copyFavorites() {
    if (favorites.length === 0) {
      showCopyFeedback('No favorites to copy!', false);
      return;
    }

    // Format: ID - Name: Note (or just ID - Name if no note)
    const lines = favorites.map(f => {
      let line = f.id;
      if (f.name) line += ` (${f.name})`;
      if (f.note) line += `\n   → ${f.note}`;
      return line;
    });
    const text = lines.join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(`Copied ${favorites.length} favorites!`, true);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopyFeedback(`Copied ${favorites.length} favorites!`, true);
    });
  }

  function showCopyFeedback(message, success) {
    const btn = document.querySelector('.hqp-copy-btn');
    if (!btn) return;

    const original = btn.innerHTML;
    btn.innerHTML = success ? '✓ ' + message : '⚠ ' + message;
    btn.classList.add(success ? 'hqp-copy-btn--success' : 'hqp-copy-btn--error');

    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('hqp-copy-btn--success', 'hqp-copy-btn--error');
    }, 2000);
  }

  function toggleFavoritesView() {
    const existing = document.querySelector('.hqp-favs-panel');
    if (existing) {
      existing.remove();
      return;
    }

    if (favorites.length === 0) {
      showCopyFeedback('No favorites yet!', false);
      return;
    }

    const panel = document.createElement('div');
    panel.className = 'hqp-favs-panel';

    const favsHtml = favorites.map((f, idx) => `
      <div class="hqp-favs-item" data-idx="${idx}">
        <div class="hqp-favs-item__main">
          <span class="hqp-favs-item__name">${f.name || f.id}</span>
          <span class="hqp-favs-item__id">${f.id}</span>
        </div>
        ${f.note ? `<div class="hqp-favs-item__note">→ ${f.note}</div>` : '<div class="hqp-favs-item__note hqp-favs-item__note--empty">No note</div>'}
        <div class="hqp-favs-item__actions">
          <button class="hqp-favs-item__edit" data-idx="${idx}" title="Edit note">✏️</button>
          <button class="hqp-favs-item__delete" data-idx="${idx}" title="Remove">🗑️</button>
        </div>
      </div>
    `).join('');

    panel.innerHTML = `
      <div class="hqp-favs-panel__header">
        <strong>★ Favorites (${favorites.length})</strong>
        <button class="hqp-favs-panel__close">×</button>
      </div>
      <div class="hqp-favs-panel__list">
        ${favsHtml}
      </div>
      <div class="hqp-favs-panel__footer">
        <button class="hqp-favs-panel__copy">📋 Copy All</button>
        <button class="hqp-favs-panel__clear">🗑️ Clear All</button>
      </div>
    `;

    document.body.appendChild(panel);

    // Close button
    panel.querySelector('.hqp-favs-panel__close').addEventListener('click', () => panel.remove());

    // Copy all
    panel.querySelector('.hqp-favs-panel__copy').addEventListener('click', () => {
      copyFavorites();
    });

    // Clear all
    panel.querySelector('.hqp-favs-panel__clear').addEventListener('click', () => {
      if (confirm('Remove all favorites?')) {
        favorites = [];
        saveFavorites();
        updateFavoriteButton();
        panel.remove();
      }
    });

    // Click on item to navigate
    panel.querySelectorAll('.hqp-favs-item__main').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.parentElement.dataset.idx);
        const fav = favorites[idx];
        // Find and navigate to this section
        for (const [type, items] of Object.entries(SECTIONS)) {
          const sectionIdx = items.findIndex(s => s.id === fav.id);
          if (sectionIdx !== -1) {
            currentSection = type;
            currentIndex = sectionIdx;
            updateTabs();
            updateDisplay();
            panel.remove();
            break;
          }
        }
      });
    });

    // Edit note
    panel.querySelectorAll('.hqp-favs-item__edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const fav = favorites[idx];
        const newNote = prompt('Edit note:', fav.note || '');
        if (newNote !== null) {
          favorites[idx].note = newNote;
          saveFavorites();
          panel.remove();
          toggleFavoritesView(); // Refresh panel
        }
      });
    });

    // Delete
    panel.querySelectorAll('.hqp-favs-item__delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        favorites.splice(idx, 1);
        saveFavorites();
        updateFavoriteButton();
        if (favorites.length === 0) {
          panel.remove();
        } else {
          panel.remove();
          toggleFavoritesView(); // Refresh panel
        }
      });
    });

    // Close when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closePanel(e) {
        if (!panel.contains(e.target) && !e.target.closest('.hqp-favs-btn')) {
          panel.remove();
          document.removeEventListener('click', closePanel);
        }
      });
    }, 100);
  }

  function getAllSections() {
    return [
      ...SECTIONS.heroes,
      ...SECTIONS.aircraft,
      ...SECTIONS.services,
      ...SECTIONS.trust,
      ...SECTIONS.cta,
      ...SECTIONS.team,
      ...SECTIONS.gallery,
      ...SECTIONS.faq,
      ...SECTIONS.features,
      ...SECTIONS.newsletter,
      ...SECTIONS.blog,
      ...SECTIONS.location,
      ...SECTIONS.process,
      ...SECTIONS.social,
      ...SECTIONS.fleet,
      ...SECTIONS.pilots,
      ...SECTIONS.financing,
      ...SECTIONS.events,
      ...SECTIONS.video,
      ...SECTIONS.expedition,
      ...SECTIONS.compare,
      ...SECTIONS.partners,
      ...SECTIONS.quote,
      // New Blue Tab sections
      ...SECTIONS.pricing,
      ...SECTIONS.announce,
      ...SECTIONS.formSections,
      ...SECTIONS.tabbed,
      ...SECTIONS.statistics,
      ...SECTIONS.timelines,
      ...SECTIONS.iconGrids,
      ...SECTIONS.cardLayouts,
      ...SECTIONS.footers,
      ...SECTIONS.navigation,
      ...SECTIONS.searchFilter,
      ...SECTIONS.testimonialVariants,
      ...SECTIONS.contentBlocks,
      // New Green Tab sections
      ...SECTIONS.modals,
      ...SECTIONS.alerts,
      ...SECTIONS.loading,
      ...SECTIONS.emptyStates,
      ...SECTIONS.errorPages,
      ...SECTIONS.auth,
      ...SECTIONS.profile,
      ...SECTIONS.dashboard,
      ...SECTIONS.tables,
      ...SECTIONS.progress,
      ...SECTIONS.badges,
      ...SECTIONS.cookies,
      ...SECTIONS.backToTop,
      ...SECTIONS.socialShare,
      // Purple Tab sections (Premium UI)
      ...SECTIONS.megaMenus,
      ...SECTIONS.commandPalette,
      ...SECTIONS.booking,
      ...SECTIONS.configurators,
      ...SECTIONS.lightbox,
      ...SECTIONS.filterPanels,
      ...SECTIONS.chatWidgets,
      ...SECTIONS.notifications,
      ...SECTIONS.breadcrumbs,
      ...SECTIONS.dataCards,
      ...SECTIONS.comparisonSlider,
      ...SECTIONS.ratings,
      ...SECTIONS.fileUpload
    ];
  }

  function getSectionsByType(type) {
    return SECTIONS[type] || [];
  }

  function findSectionById(id) {
    return getAllSections().find(s => s.id === id);
  }

  function renderSection(section) {
    const container = document.getElementById('hq-page-container');
    if (!container || !section) return;

    container.style.opacity = '0';
    setTimeout(() => {
      container.innerHTML = section.html;
      container.style.opacity = '1';
      initInteractions();
    }, 200);
  }

  function renderFullPage(layout) {
    const container = document.getElementById('hq-page-container');
    if (!container) return;

    const html = layout.sections
      .map(id => findSectionById(id))
      .filter(Boolean)
      .map(s => s.html)
      .join('\n');

    container.style.opacity = '0';
    setTimeout(() => {
      container.innerHTML = html;
      container.style.opacity = '1';
      initInteractions();
    }, 200);
  }

  function initInteractions() {
    // Video controls
    document.querySelectorAll('.hq-hero__video-control').forEach(btn => {
      const video = btn.closest('.hq-hero').querySelector('video');
      if (video) {
        btn.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            btn.classList.remove('paused');
          } else {
            video.pause();
            btn.classList.add('paused');
          }
        });
      }
    });

    // Stat counters
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
    });

    // Crossfade galleries
    document.querySelectorAll('.hq-hero--crossfade').forEach(hero => {
      const images = hero.querySelectorAll('.hq-hero__crossfade img');
      let idx = 0;
      setInterval(() => {
        images[idx].classList.remove('active');
        idx = (idx + 1) % images.length;
        images[idx].classList.add('active');
      }, 4000);
    });
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function createPicker() {
    const picker = document.createElement('div');
    picker.id = 'hq-page-picker';
    picker.innerHTML = `
      <!-- Collapsed Bar (shown when minimized) -->
      <div class="hqp-collapsed">
        <button class="hqp-collapsed-prev">←</button>
        <div class="hqp-collapsed-info">
          <span class="hqp-collapsed-section"></span>
          <span class="hqp-collapsed-name"></span>
          <span class="hqp-collapsed-counter"></span>
        </div>
        <button class="hqp-collapsed-next">→</button>
        <button class="hqp-collapsed-expand" title="Expand picker">▲</button>
      </div>

      <div class="hqp-container">
        <div class="hqp-header">
          <span class="hqp-title">Page Variations</span>
          <div class="hqp-header-btns">
            <button class="hqp-minimize" title="Minimize">─</button>
            <button class="hqp-close">&times;</button>
          </div>
        </div>

        <div class="hqp-tabs">
          <button class="hqp-tab active" data-section="heroes">Heroes (${SECTIONS.heroes.length})</button>
          <button class="hqp-tab" data-section="aircraft">Aircraft (${SECTIONS.aircraft.length})</button>
          <button class="hqp-tab" data-section="services">Services (${SECTIONS.services.length})</button>
          <button class="hqp-tab" data-section="trust">Trust (${SECTIONS.trust.length})</button>
          <button class="hqp-tab" data-section="cta">CTA (${SECTIONS.cta.length})</button>
          <button class="hqp-tab" data-section="team">Team (${SECTIONS.team.length})</button>
          <button class="hqp-tab" data-section="gallery">Gallery (${SECTIONS.gallery.length})</button>
          <button class="hqp-tab" data-section="faq">FAQ (${SECTIONS.faq.length})</button>
          <button class="hqp-tab" data-section="features">Features (${SECTIONS.features.length})</button>
          <button class="hqp-tab" data-section="newsletter">Newsletter (${SECTIONS.newsletter.length})</button>
          <button class="hqp-tab" data-section="blog">Blog (${SECTIONS.blog.length})</button>
          <button class="hqp-tab" data-section="location">Location (${SECTIONS.location.length})</button>
          <button class="hqp-tab" data-section="process">Process (${SECTIONS.process.length})</button>
          <button class="hqp-tab" data-section="social">Social (${SECTIONS.social.length})</button>
          <button class="hqp-tab" data-section="fleet">Fleet (${SECTIONS.fleet.length})</button>
          <button class="hqp-tab" data-section="pilots">Pilots (${SECTIONS.pilots.length})</button>
          <button class="hqp-tab" data-section="financing">Finance (${SECTIONS.financing.length})</button>
          <button class="hqp-tab" data-section="events">Events (${SECTIONS.events.length})</button>
          <button class="hqp-tab" data-section="video">Video (${SECTIONS.video.length})</button>
          <button class="hqp-tab" data-section="expedition">Expedition (${SECTIONS.expedition.length})</button>
          <button class="hqp-tab" data-section="compare">Compare (${SECTIONS.compare.length})</button>
          <button class="hqp-tab" data-section="partners">Partners (${SECTIONS.partners.length})</button>
          <button class="hqp-tab" data-section="quote">Quote (${SECTIONS.quote.length})</button>
          <button class="hqp-tab" data-section="layouts">Layouts (${PAGE_LAYOUTS.length})</button>
          <!-- NEW BLUE TABS (Mix & Match Set 2) -->
          <button class="hqp-tab hqp-tab--blue" data-section="pricing">💰 Pricing (${SECTIONS.pricing.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="announce">📢 Announce (${SECTIONS.announce.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="formSections">📝 Forms (${SECTIONS.formSections.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="tabbed">📑 Tabbed (${SECTIONS.tabbed.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="statistics">📊 Stats (${SECTIONS.statistics.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="timelines">⏱️ Timelines (${SECTIONS.timelines.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="iconGrids">🎯 Icons (${SECTIONS.iconGrids.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="cardLayouts">🃏 Cards (${SECTIONS.cardLayouts.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="footers">🦶 Footers (${SECTIONS.footers.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="navigation">🧭 Nav (${SECTIONS.navigation.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="searchFilter">🔍 Search (${SECTIONS.searchFilter.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="testimonialVariants">💬 Testimonials (${SECTIONS.testimonialVariants.length})</button>
          <button class="hqp-tab hqp-tab--blue" data-section="contentBlocks">📄 Content (${SECTIONS.contentBlocks.length})</button>
          <!-- NEW GREEN TABS (Mix & Match Set 3) -->
          <button class="hqp-tab hqp-tab--green" data-section="modals">🪟 Modals (${SECTIONS.modals.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="alerts">⚠️ Alerts (${SECTIONS.alerts.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="loading">⏳ Loading (${SECTIONS.loading.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="emptyStates">📭 Empty (${SECTIONS.emptyStates.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="errorPages">❌ Errors (${SECTIONS.errorPages.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="auth">🔐 Auth (${SECTIONS.auth.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="profile">👤 Profile (${SECTIONS.profile.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="dashboard">📊 Dashboard (${SECTIONS.dashboard.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="tables">📋 Tables (${SECTIONS.tables.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="progress">📈 Progress (${SECTIONS.progress.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="badges">🏷️ Badges (${SECTIONS.badges.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="cookies">🍪 Cookies (${SECTIONS.cookies.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="backToTop">⬆️ Back Top (${SECTIONS.backToTop.length})</button>
          <button class="hqp-tab hqp-tab--green" data-section="socialShare">📤 Share (${SECTIONS.socialShare.length})</button>
          <!-- PURPLE TABS (Premium UI Set) -->
          <button class="hqp-tab hqp-tab--purple" data-section="megaMenus">🎯 Mega Menus (${SECTIONS.megaMenus.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="commandPalette">⌘ Command (${SECTIONS.commandPalette.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="booking">📅 Booking (${SECTIONS.booking.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="configurators">⚙️ Config (${SECTIONS.configurators.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="lightbox">🖼️ Lightbox (${SECTIONS.lightbox.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="filterPanels">🔍 Filters (${SECTIONS.filterPanels.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="chatWidgets">💬 Chat (${SECTIONS.chatWidgets.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="notifications">🔔 Notifs (${SECTIONS.notifications.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="breadcrumbs">🔗 Crumbs (${SECTIONS.breadcrumbs.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="dataCards">📊 Data Cards (${SECTIONS.dataCards.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="comparisonSlider">↔️ Compare (${SECTIONS.comparisonSlider.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="ratings">⭐ Ratings (${SECTIONS.ratings.length})</button>
          <button class="hqp-tab hqp-tab--purple" data-section="fileUpload">📤 Upload (${SECTIONS.fileUpload.length})</button>
          <!-- ORANGE TABS (HQ Aviation Storytelling) -->
          <button class="hqp-tab hqp-tab--orange" data-section="journey">🛤️ Journey (${SECTIONS.journey.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="fleetShowcase">🚁 Fleet (${SECTIONS.fleetShowcase.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="trainingStories">🎓 Training (${SECTIONS.trainingStories.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="maintenanceShowcase">🔧 Maint. (${SECTIONS.maintenanceShowcase.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="teamTrust">👥 Team (${SECTIONS.teamTrust.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="lifestyle">✈️ Lifestyle (${SECTIONS.lifestyle.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="deepDive">🔍 Deep Dive (${SECTIONS.deepDive.length})</button>
          <button class="hqp-tab hqp-tab--orange" data-section="contactConversion">📞 Contact (${SECTIONS.contactConversion.length})</button>
          <!-- TEAL TAB (Quotes & Copy) -->
          <button class="hqp-tab hqp-tab--teal" data-section="quotes">💬 Quotes (${SECTIONS.quotes.length})</button>
          <!-- BURGUNDY TAB (HQ Showcase) -->
          <button class="hqp-tab hqp-tab--burgundy" data-section="showcase">🏆 Showcase (${SECTIONS.showcase.length})</button>
          <!-- ROSE TAB (Creative Explorations) -->
          <button class="hqp-tab hqp-tab--rose" data-section="creative">🎨 Creative (${SECTIONS.creative.length})</button>
          <!-- VIOLET TAB (Award-Winning Designs) -->
          <button class="hqp-tab hqp-tab--violet" data-section="awwwards">🌟 Awwwards (${SECTIONS.awwwards.length})</button>
        </div>

        <div class="hqp-content">
          <div class="hqp-nav">
            <button class="hqp-nav-btn hqp-prev">←</button>
            <div class="hqp-info">
              <span class="hqp-category"></span>
              <span class="hqp-counter"></span>
              <h3 class="hqp-name"></h3>
              <p class="hqp-desc"></p>
            </div>
            <button class="hqp-nav-btn hqp-next">→</button>
            <button class="hqp-fav-btn" title="Add to favorites">
              <span class="hqp-fav-icon">☆</span>
            </button>
          </div>
        </div>

        <div class="hqp-footer">
          <div class="hqp-footer-left">
            <button class="hqp-grid-btn">View All</button>
            <button class="hqp-favs-btn" title="View favorites">★ <span class="hqp-fav-count">0</span></button>
            <button class="hqp-copy-btn" title="Copy favorite IDs">📋 Copy</button>
          </div>
          <div class="hqp-hints">
            <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
            <span><kbd>F</kbd> Fav</span>
            <span><kbd>M</kbd> Mini</span>
          </div>
        </div>
      </div>

      <div class="hqp-grid-overlay">
        <div class="hqp-grid-header">
          <h2>All Variations</h2>
          <button class="hqp-grid-close">&times;</button>
        </div>
        <div class="hqp-grid-content"></div>
      </div>
    `;

    // Styles
    const styles = document.createElement('style');
    styles.textContent = `
      #hq-page-container {
        transition: opacity 0.2s ease;
      }

      #hq-page-picker {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .hqp-container {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.2);
        width: 440px;
        overflow: hidden;
      }

      .hqp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #0a0a0a;
        color: #fff;
      }

      .hqp-title { font-weight: 600; font-size: 14px; }

      .hqp-header-btns {
        display: flex;
        gap: 8px;
      }

      .hqp-minimize,
      .hqp-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hqp-minimize:hover,
      .hqp-close:hover { opacity: 1; }

      /* Collapsed State */
      .hqp-collapsed {
        display: none;
        background: #0a0a0a;
        color: #fff;
        border-radius: 8px;
        padding: 10px 16px;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }

      #hq-page-picker.minimized .hqp-collapsed {
        display: flex;
      }

      #hq-page-picker.minimized .hqp-container {
        display: none;
      }

      .hqp-collapsed-prev,
      .hqp-collapsed-next {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.15s;
      }
      .hqp-collapsed-prev:hover,
      .hqp-collapsed-next:hover {
        background: rgba(255,255,255,0.2);
      }

      .hqp-collapsed-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .hqp-collapsed-section {
        background: #e04a2f;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .hqp-collapsed-name {
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hqp-collapsed-counter {
        font-size: 11px;
        opacity: 0.6;
        white-space: nowrap;
      }

      .hqp-collapsed-expand {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.15s;
      }
      .hqp-collapsed-expand:hover {
        background: rgba(255,255,255,0.2);
      }

      .hqp-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 12px;
        background: #f5f5f5;
        border-bottom: 1px solid #e5e5e5;
        max-height: 140px;
        overflow-y: auto;
      }

      .hqp-tabs::-webkit-scrollbar {
        width: 6px;
      }
      .hqp-tabs::-webkit-scrollbar-track {
        background: #e5e5e5;
        border-radius: 3px;
      }
      .hqp-tabs::-webkit-scrollbar-thumb {
        background: #999;
        border-radius: 3px;
      }
      .hqp-tabs::-webkit-scrollbar-thumb:hover {
        background: #666;
      }

      .hqp-tab {
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 500;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .hqp-tab:hover { border-color: #333; }
      .hqp-tab.active {
        background: #0a0a0a;
        color: #fff;
        border-color: #0a0a0a;
      }

      /* Blue tabs for Mix & Match Set 2 */
      .hqp-tab--blue {
        background: #e3f2fd;
        border-color: #2196f3;
        color: #1565c0;
      }
      .hqp-tab--blue:hover {
        background: #bbdefb;
        border-color: #1976d2;
      }
      .hqp-tab--blue.active {
        background: #1976d2;
        color: #fff;
        border-color: #1976d2;
      }

      /* Green tabs for Mix & Match Set 3 */
      .hqp-tab--green {
        background: #e8f5e9;
        border-color: #4caf50;
        color: #2e7d32;
      }
      .hqp-tab--green:hover {
        background: #c8e6c9;
        border-color: #43a047;
      }
      .hqp-tab--green.active {
        background: #43a047;
        color: #fff;
        border-color: #43a047;
      }

      /* Purple tabs for Premium UI Set */
      .hqp-tab--purple {
        background: #f3e5f5;
        border-color: #9c27b0;
        color: #7b1fa2;
      }
      .hqp-tab--purple:hover {
        background: #e1bee7;
        border-color: #8e24aa;
      }
      .hqp-tab--purple.active {
        background: #8e24aa;
        color: #fff;
        border-color: #8e24aa;
      }

      /* Orange tabs for HQ Aviation Storytelling */
      .hqp-tab--orange {
        background: #fff7ed;
        border-color: #f97316;
        color: #c2410c;
      }
      .hqp-tab--orange:hover {
        background: #ffedd5;
        border-color: #ea580c;
      }
      .hqp-tab--orange.active {
        background: #ea580c;
        color: #fff;
        border-color: #ea580c;
      }

      /* Teal tabs for Quotes & Copy */
      .hqp-tab--teal {
        background: #f0fdfa;
        border-color: #14b8a6;
        color: #0f766e;
      }
      .hqp-tab--teal:hover {
        background: #ccfbf1;
        border-color: #0d9488;
      }
      .hqp-tab--teal.active {
        background: #0d9488;
        color: #fff;
        border-color: #0d9488;
      }

      /* Burgundy tabs for HQ Showcase */
      .hqp-tab--burgundy {
        background: #fdf2f8;
        border-color: #9f1239;
        color: #881337;
      }
      .hqp-tab--burgundy:hover {
        background: #fce7f3;
        border-color: #be123c;
      }
      .hqp-tab--burgundy.active {
        background: #9f1239;
        color: #fff;
        border-color: #9f1239;
      }

      /* Rose tabs for Creative Explorations */
      .hqp-tab--rose {
        background: #fff1f2;
        border-color: #e11d48;
        color: #be123c;
      }
      .hqp-tab--rose:hover {
        background: #ffe4e6;
        border-color: #f43f5e;
      }
      .hqp-tab--rose.active {
        background: #e11d48;
        color: #fff;
        border-color: #e11d48;
      }

      /* Violet tabs for Awwwards-level designs */
      .hqp-tab--violet {
        background: #f5f3ff;
        border-color: #8b5cf6;
        color: #7c3aed;
      }
      .hqp-tab--violet:hover {
        background: #ede9fe;
        border-color: #a78bfa;
      }
      .hqp-tab--violet.active {
        background: #8b5cf6;
        color: #fff;
        border-color: #8b5cf6;
      }

      .hqp-content { padding: 16px; }

      .hqp-nav {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }

      .hqp-nav-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        background: #f5f5f5;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.15s;
      }
      .hqp-nav-btn:hover { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

      .hqp-info { flex: 1; text-align: center; }

      .hqp-category {
        display: block;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #e04a2f;
        margin-bottom: 4px;
      }

      .hqp-counter {
        font-size: 11px;
        color: #999;
      }

      .hqp-name {
        font-size: 15px;
        font-weight: 600;
        margin: 4px 0;
        color: #0a0a0a;
      }

      .hqp-desc {
        font-size: 12px;
        color: #666;
        margin: 0;
        line-height: 1.4;
      }

      .hqp-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f5f5f5;
        border-top: 1px solid #e5e5e5;
      }

      .hqp-footer-left {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .hqp-grid-btn,
      .hqp-favs-btn,
      .hqp-copy-btn {
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 500;
        background: #0a0a0a;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
      }

      .hqp-favs-btn {
        background: #333;
      }

      .hqp-favs-btn--has-items {
        background: #d97706;
      }

      .hqp-favs-btn--active {
        background: #f59e0b;
      }

      .hqp-fav-count {
        display: inline-block;
        min-width: 16px;
        padding: 0 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 8px;
        font-size: 10px;
      }

      .hqp-copy-btn {
        background: #6366f1;
      }

      .hqp-copy-btn:hover {
        background: #4f46e5;
      }

      .hqp-copy-btn--success {
        background: #22c55e !important;
      }

      .hqp-copy-btn--error {
        background: #ef4444 !important;
      }

      .hqp-fav-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border: 2px solid #e5e5e5;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hqp-fav-btn:hover {
        border-color: #f59e0b;
        color: #f59e0b;
      }

      .hqp-fav-btn--active {
        background: #f59e0b;
        border-color: #f59e0b;
        color: #fff;
      }

      .hqp-fav-btn--active:hover {
        background: #d97706;
        border-color: #d97706;
        color: #fff;
      }

      .hqp-fav-btn--has-note::after {
        content: '';
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        background: #3b82f6;
        border-radius: 50%;
        border: 2px solid #fff;
      }

      /* Note Modal */
      .hqp-note-modal {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100001;
        animation: fadeIn 0.15s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .hqp-note-modal__content {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        width: 320px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.2s ease-out;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .hqp-note-modal__header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .hqp-note-modal__icon {
        color: #f59e0b;
        font-size: 18px;
      }

      .hqp-note-modal__name {
        font-size: 12px;
        color: #666;
        margin-bottom: 12px;
        padding: 6px 10px;
        background: #f5f5f5;
        border-radius: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hqp-note-input {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        font-size: 13px;
        font-family: inherit;
        resize: none;
        transition: border-color 0.15s;
      }

      .hqp-note-input:focus {
        outline: none;
        border-color: #f59e0b;
      }

      .hqp-note-modal__actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .hqp-note-cancel,
      .hqp-note-save {
        flex: 1;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
      }

      .hqp-note-cancel {
        background: #f5f5f5;
        color: #666;
      }

      .hqp-note-cancel:hover {
        background: #e5e5e5;
      }

      .hqp-note-save {
        background: #f59e0b;
        color: #fff;
      }

      .hqp-note-save:hover {
        background: #d97706;
      }

      /* Favorites Panel */
      .hqp-favs-panel {
        position: fixed;
        bottom: 70px;
        left: 20px;
        width: 360px;
        max-height: 400px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        z-index: 100001;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.2s ease-out;
      }

      .hqp-favs-panel__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 14px;
      }

      .hqp-favs-panel__close {
        width: 24px;
        height: 24px;
        border: none;
        background: #f5f5f5;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
      }

      .hqp-favs-panel__list {
        flex: 1;
        overflow-y: auto;
        max-height: 280px;
      }

      .hqp-favs-item {
        padding: 10px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.15s;
      }

      .hqp-favs-item:hover {
        background: #f9f9f9;
      }

      .hqp-favs-item__main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .hqp-favs-item__name {
        font-weight: 600;
        font-size: 13px;
        color: #333;
      }

      .hqp-favs-item__id {
        font-size: 10px;
        color: #999;
        font-family: monospace;
      }

      .hqp-favs-item__note {
        font-size: 12px;
        color: #666;
        padding: 4px 8px;
        background: #f5f5f5;
        border-radius: 4px;
        margin: 6px 0;
      }

      .hqp-favs-item__note--empty {
        color: #bbb;
        font-style: italic;
      }

      .hqp-favs-item__actions {
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      .hqp-favs-item__edit,
      .hqp-favs-item__delete {
        width: 28px;
        height: 28px;
        border: 1px solid #e5e5e5;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.15s;
      }

      .hqp-favs-item__edit:hover {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .hqp-favs-item__delete:hover {
        border-color: #ef4444;
        background: #fef2f2;
      }

      .hqp-favs-panel__footer {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid #e5e5e5;
      }

      .hqp-favs-panel__copy,
      .hqp-favs-panel__clear {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
      }

      .hqp-favs-panel__copy {
        background: #6366f1;
        color: #fff;
      }

      .hqp-favs-panel__copy:hover {
        background: #4f46e5;
      }

      .hqp-favs-panel__clear {
        background: #f5f5f5;
        color: #666;
      }

      .hqp-favs-panel__clear:hover {
        background: #fee2e2;
        color: #dc2626;
      }

      .hqp-hints {
        display: flex;
        gap: 12px;
        font-size: 10px;
        color: #999;
      }

      .hqp-hints kbd {
        display: inline-block;
        padding: 2px 5px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        font-family: inherit;
        font-size: 9px;
      }

      /* Grid overlay */
      .hqp-grid-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(10,10,10,0.95);
        z-index: 100000;
        overflow-y: auto;
      }
      .hqp-grid-overlay.active { display: block; }

      .hqp-grid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .hqp-grid-header h2 {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .hqp-grid-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 28px;
        cursor: pointer;
        opacity: 0.7;
      }
      .hqp-grid-close:hover { opacity: 1; }

      .hqp-grid-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        padding: 24px;
      }

      .hqp-grid-item {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 14px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .hqp-grid-item:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.2);
      }
      .hqp-grid-item.active {
        border-color: #e04a2f;
      }

      .hqp-grid-item__cat {
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #e04a2f;
        margin-bottom: 4px;
      }

      .hqp-grid-item__name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin: 0 0 4px;
      }

      .hqp-grid-item__desc {
        font-size: 11px;
        color: rgba(255,255,255,0.6);
        margin: 0;
      }

      @media (max-width: 480px) {
        #hq-page-picker { left: 12px; right: 12px; bottom: 12px; }
        .hqp-container { width: 100%; }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(picker);

    // Events
    picker.querySelector('.hqp-close').addEventListener('click', closePicker);
    picker.querySelector('.hqp-minimize').addEventListener('click', minimizePicker);
    picker.querySelector('.hqp-collapsed-expand').addEventListener('click', expandPicker);
    picker.querySelector('.hqp-prev').addEventListener('click', goPrev);
    picker.querySelector('.hqp-next').addEventListener('click', goNext);
    picker.querySelector('.hqp-collapsed-prev').addEventListener('click', goPrev);
    picker.querySelector('.hqp-collapsed-next').addEventListener('click', goNext);
    picker.querySelector('.hqp-grid-btn').addEventListener('click', openGrid);
    picker.querySelector('.hqp-grid-close').addEventListener('click', closeGrid);

    // Favorites functionality
    picker.querySelector('.hqp-fav-btn').addEventListener('click', () => {
      const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);
      const current = items[currentIndex];
      const id = currentSection === 'layouts' ? current.name : current.id;
      toggleFavorite(id);
    });
    picker.querySelector('.hqp-favs-btn').addEventListener('click', toggleFavoritesView);
    picker.querySelector('.hqp-copy-btn').addEventListener('click', copyFavorites);
    updateFavoritesCount();

    picker.querySelectorAll('.hqp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentSection = tab.dataset.section;
        currentIndex = 0;
        updateTabs();
        updateDisplay();
      });
    });

    window.addEventListener('keydown', handleKeys);

    return picker;
  }

  function updateTabs() {
    document.querySelectorAll('.hqp-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === currentSection);
    });
  }

  function updateDisplay() {
    const picker = document.getElementById('hq-page-picker');
    if (!picker) return;

    if (currentSection === 'layouts') {
      const layout = PAGE_LAYOUTS[currentIndex];
      picker.querySelector('.hqp-category').textContent = 'Full Page';
      picker.querySelector('.hqp-counter').textContent = `${currentIndex + 1} / ${PAGE_LAYOUTS.length}`;
      picker.querySelector('.hqp-name').textContent = layout.name;
      picker.querySelector('.hqp-desc').textContent = `${layout.sections.length} sections`;
      renderFullPage(layout);
    } else {
      const items = getSectionsByType(currentSection);
      const item = items[currentIndex];
      if (item) {
        picker.querySelector('.hqp-category').textContent = item.category;
        picker.querySelector('.hqp-counter').textContent = `${currentIndex + 1} / ${items.length}`;
        picker.querySelector('.hqp-name').textContent = item.name;
        picker.querySelector('.hqp-desc').textContent = item.desc;
        renderSection(item);
      }
    }

    updateGrid();
    updateCollapsedBar();
    updateFavoriteButton();
  }

  function updateGrid() {
    const gridContent = document.querySelector('.hqp-grid-content');
    if (!gridContent) return;

    let items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);

    gridContent.innerHTML = items.map((item, i) => `
      <div class="hqp-grid-item ${i === currentIndex ? 'active' : ''}" data-index="${i}">
        <div class="hqp-grid-item__cat">${item.category || 'Layout'}</div>
        <h3 class="hqp-grid-item__name">${item.name}</h3>
        <p class="hqp-grid-item__desc">${item.desc || item.sections?.length + ' sections'}</p>
      </div>
    `).join('');

    gridContent.querySelectorAll('.hqp-grid-item').forEach(el => {
      el.addEventListener('click', () => {
        currentIndex = parseInt(el.dataset.index);
        updateDisplay();
        closeGrid();
      });
    });
  }

  // Section order for seamless navigation
  const SECTION_ORDER = [
    'heroes', 'aircraft', 'services', 'trust', 'cta', 'team', 'gallery', 'faq',
    'features', 'newsletter', 'blog', 'location', 'process', 'social', 'fleet',
    'pilots', 'financing', 'events', 'video', 'expedition', 'compare', 'partners', 'quote',
    // New Blue Tab sections
    'pricing', 'announce', 'formSections', 'tabbed', 'statistics', 'timelines',
    'iconGrids', 'cardLayouts', 'footers', 'navigation', 'searchFilter',
    'testimonialVariants', 'contentBlocks',
    // New Green Tab sections
    'modals', 'alerts', 'loading', 'emptyStates', 'errorPages', 'auth',
    'profile', 'dashboard', 'tables', 'progress', 'badges', 'cookies',
    'backToTop', 'socialShare',
    // Purple Tab sections (Premium UI)
    'megaMenus', 'commandPalette', 'booking', 'configurators', 'lightbox',
    'filterPanels', 'chatWidgets', 'notifications', 'breadcrumbs', 'dataCards',
    'comparisonSlider', 'ratings', 'fileUpload',
    'layouts'
  ];

  function goPrev() {
    const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);

    if (currentIndex > 0) {
      // Still have items in current section
      currentIndex--;
    } else {
      // Jump to previous section, skipping empty sections
      let sectionIdx = SECTION_ORDER.indexOf(currentSection);
      let prevSection;
      let prevItems;

      // Find previous non-empty section
      do {
        sectionIdx = (sectionIdx - 1 + SECTION_ORDER.length) % SECTION_ORDER.length;
        prevSection = SECTION_ORDER[sectionIdx];
        prevItems = prevSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(prevSection);
      } while (prevItems.length === 0 && sectionIdx !== SECTION_ORDER.indexOf(currentSection));

      currentSection = prevSection;
      currentIndex = prevItems.length - 1;
      updateTabs();
    }
    updateDisplay();
  }

  function goNext() {
    const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);
    console.log('[goNext] Current:', currentSection, 'Index:', currentIndex, 'Items:', items.length);

    if (currentIndex < items.length - 1) {
      // Still have items in current section
      currentIndex++;
      console.log('[goNext] Staying in section, new index:', currentIndex);
    } else {
      // Jump to next section, skipping empty sections
      let sectionIdx = SECTION_ORDER.indexOf(currentSection);
      console.log('[goNext] At end of section, sectionIdx:', sectionIdx);
      let nextSection;
      let nextItems;
      let attempts = 0;

      // Find next non-empty section
      do {
        sectionIdx = (sectionIdx + 1) % SECTION_ORDER.length;
        nextSection = SECTION_ORDER[sectionIdx];
        nextItems = nextSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(nextSection);
        console.log('[goNext] Trying:', nextSection, 'has', nextItems.length, 'items');
        attempts++;
      } while (nextItems.length === 0 && attempts < SECTION_ORDER.length);

      currentSection = nextSection;
      currentIndex = 0;
      console.log('[goNext] Jumping to:', currentSection);
      updateTabs();
    }
    updateDisplay();
  }

  function openGrid() {
    document.querySelector('.hqp-grid-overlay').classList.add('active');
    updateGrid();
  }

  function closeGrid() {
    document.querySelector('.hqp-grid-overlay').classList.remove('active');
  }

  function minimizePicker() {
    const picker = document.getElementById('hq-page-picker');
    if (picker) {
      picker.classList.add('minimized');
      updateCollapsedBar();
    }
  }

  function expandPicker() {
    const picker = document.getElementById('hq-page-picker');
    if (picker) {
      picker.classList.remove('minimized');
    }
  }

  function updateCollapsedBar() {
    const picker = document.getElementById('hq-page-picker');
    if (!picker) return;

    const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);
    const item = items[currentIndex];

    if (item) {
      picker.querySelector('.hqp-collapsed-section').textContent = currentSection;
      picker.querySelector('.hqp-collapsed-name').textContent = item.name;
      picker.querySelector('.hqp-collapsed-counter').textContent = `${currentIndex + 1}/${items.length}`;
    }
  }

  function closePicker() {
    const picker = document.getElementById('hq-page-picker');
    if (picker) {
      picker.style.display = 'none';
    }
    pickerVisible = false;
  }

  function openPicker() {
    const picker = document.getElementById('hq-page-picker');
    if (picker) {
      picker.style.display = 'block';
    }
    pickerVisible = true;
  }

  function handleKeys(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      const items = currentSection === 'layouts' ? PAGE_LAYOUTS : getSectionsByType(currentSection);
      const current = items[currentIndex];
      const id = currentSection === 'layouts' ? current.name : current.id;
      toggleFavorite(id);
    }
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      const picker = document.getElementById('hq-page-picker');
      if (picker?.classList.contains('minimized')) {
        expandPicker();
      } else {
        minimizePicker();
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (document.querySelector('.hqp-grid-overlay.active')) {
        closeGrid();
      } else {
        const picker = document.getElementById('hq-page-picker');
        if (picker?.classList.contains('minimized')) {
          expandPicker();
        } else {
          minimizePicker();
        }
      }
    }
  }

  // ============================================
  // INIT
  // ============================================

  function init() {
    // Create page container if needed
    let container = document.getElementById('hq-page-container');
    if (!container) {
      const hero = document.querySelector('.hq-hero');
      if (hero) {
        container = document.createElement('div');
        container.id = 'hq-page-container';
        hero.parentNode.insertBefore(container, hero);
        hero.remove();
      } else {
        container = document.createElement('div');
        container.id = 'hq-page-container';
        document.querySelector('main')?.prepend(container) || document.body.prepend(container);
      }
    }

    createPicker();
    updateDisplay();

    console.log('🎨 Page Variations loaded');
    console.log(`   Heroes: ${SECTIONS.heroes.length}`);
    console.log(`   Aircraft: ${SECTIONS.aircraft.length}`);
    console.log(`   Services: ${SECTIONS.services.length}`);
    console.log(`   Trust: ${SECTIONS.trust.length}`);
    console.log(`   CTA: ${SECTIONS.cta.length}`);
    console.log(`   Team: ${SECTIONS.team.length}`);
    console.log(`   Gallery: ${SECTIONS.gallery.length}`);
    console.log(`   FAQ: ${SECTIONS.faq.length}`);
    console.log(`   Features: ${SECTIONS.features.length}`);
    console.log(`   Newsletter: ${SECTIONS.newsletter.length}`);
    console.log(`   Blog: ${SECTIONS.blog.length}`);
    console.log(`   Location: ${SECTIONS.location.length}`);
    console.log(`   Process: ${SECTIONS.process.length}`);
    console.log(`   Social: ${SECTIONS.social.length}`);
    console.log(`   Fleet: ${SECTIONS.fleet.length}`);
    console.log(`   Pilots: ${SECTIONS.pilots.length}`);
    console.log(`   Financing: ${SECTIONS.financing.length}`);
    console.log(`   Events: ${SECTIONS.events.length}`);
    console.log(`   Video: ${SECTIONS.video.length}`);
    console.log(`   Expedition: ${SECTIONS.expedition.length}`);
    console.log(`   Compare: ${SECTIONS.compare.length}`);
    console.log(`   Partners: ${SECTIONS.partners.length}`);
    console.log(`   Quote: ${SECTIONS.quote.length}`);
    console.log('%c   --- BLUE TABS (Set 2) ---', 'color: #1976d2; font-weight: bold');
    console.log(`   Pricing: ${SECTIONS.pricing.length}`);
    console.log(`   Announce: ${SECTIONS.announce.length}`);
    console.log(`   Forms: ${SECTIONS.formSections.length}`);
    console.log(`   Tabbed: ${SECTIONS.tabbed.length}`);
    console.log(`   Statistics: ${SECTIONS.statistics.length}`);
    console.log(`   Timelines: ${SECTIONS.timelines.length}`);
    console.log(`   Icon Grids: ${SECTIONS.iconGrids.length}`);
    console.log(`   Card Layouts: ${SECTIONS.cardLayouts.length}`);
    console.log(`   Footers: ${SECTIONS.footers.length}`);
    console.log(`   Navigation: ${SECTIONS.navigation.length}`);
    console.log(`   Search/Filter: ${SECTIONS.searchFilter.length}`);
    console.log(`   Testimonials: ${SECTIONS.testimonialVariants.length}`);
    console.log(`   Content Blocks: ${SECTIONS.contentBlocks.length}`);
    console.log(`   Layouts: ${PAGE_LAYOUTS.length}`);
    console.log(`   Total: ${getAllSections().length + PAGE_LAYOUTS.length} variations`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.HQPageVariations = {
    next: goNext,
    prev: goPrev,
    openPicker,
    closePicker,
    openGrid,
    closeGrid,
    getSections: () => SECTIONS,
    getLayouts: () => PAGE_LAYOUTS,
    renderSection,
    renderFullPage
  };

})();
