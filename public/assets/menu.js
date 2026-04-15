/**
 * HQ Aviation Navigation Menu
 * Simple dropdown navigation with hamburger toggle
 */
(function() {
  'use strict';

  // Menu button CSS - Two Lines Diagonal style
  var menuCSS = '.hq-menu-btn{position:fixed!important;top:26px!important;right:24px!important;' +
    'z-index:99999!important;width:32px!important;height:22px!important;' +
    'background:transparent!important;border:none!important;cursor:pointer!important;display:flex!important;' +
    'flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;' +
    'gap:7px!important;transition:top 0.3s ease-in-out, transform 0.3s ease!important}' +
    '.hq-menu-btn span{width:24px!important;height:2.5px!important;background:#fff!important;' +
    'border-radius:1.5px!important;transition:all 0.4s cubic-bezier(0.4,0,0.2,1)!important}' +
    '.hq-menu-btn span:nth-child(1){transform:translateX(6px)!important}' +
    '.hq-menu-btn span:nth-child(2){display:none!important}' +
    '.hq-menu-btn span:nth-child(3){transform:translateX(0)!important}' +
    // Hover state - lines swap position
    '.hq-menu-btn:hover span:nth-child(1){transform:translateX(0)!important}' +
    '.hq-menu-btn:hover span:nth-child(3){transform:translateX(6px)!important}' +
    // Color dark state (at 300px) - lines turn black
    '.hq-menu-btn.color-dark span{background:#333!important}' +
    // Scrolled state (at 800px) - move up, centered in 55px header (35+10+10)
    '.hq-menu-btn.scrolled{top:17px!important}' +
    // Mobile (under 640px) - always black, no position transition, centered in 47.875px header with 8px padding
    '@media(max-width:640px){.hq-menu-btn{top:21px!important;transition:none!important}.hq-menu-btn.scrolled{top:21px!important}.hq-menu-btn span{background:#333!important}}' +
    '.hq-menu-btn.color-dark:hover span:nth-child(1){transform:translateX(0)!important}' +
    '.hq-menu-btn.color-dark:hover span:nth-child(3){transform:translateX(6px)!important}' +
    // Open state - lines turn black and form X
    '.hq-menu-btn.open span{background:#333!important}' +
    '.hq-menu-btn.open span:nth-child(1){transform:translateX(4px) translateY(4.75px) rotate(45deg)!important}' +
    '.hq-menu-btn.open span:nth-child(3){transform:translateX(4px) translateY(-4.75px) rotate(-45deg)!important}' +
    // Open + hover should not animate the swap
    '.hq-menu-btn.open:hover span:nth-child(1){transform:translateX(4px) translateY(4.75px) rotate(45deg)!important}' +
    '.hq-menu-btn.open:hover span:nth-child(3){transform:translateX(4px) translateY(-4.75px) rotate(-45deg)!important}';

  // Menu panel CSS
  var panelCSS = '.hq-menu-panel{position:fixed!important;top:0!important;left:0!important;right:0!important;' +
    'background:#fff!important;box-shadow:0 6px 20px rgba(0,0,0,.2)!important;z-index:99998!important;' +
    'transform:translateY(-100%)!important;transition:transform 0.4s cubic-bezier(0.4,0,0.2,1)!important;' +
    'padding:80px 20px 30px!important;max-height:90vh!important;overflow-y:auto!important}' +
    '.hq-menu-panel.open{transform:translateY(0)!important}' +
    '.hq-menu-grid{max-width:1200px!important;margin:0 auto!important;display:grid!important;' +
    'grid-template-columns:repeat(auto-fit,minmax(200px,1fr))!important;gap:40px!important}' +
    '.hq-menu-section h3{margin:0 0 15px!important;font-size:13px!important;font-weight:700!important;' +
    'text-transform:uppercase!important;color:#3498db!important;border-bottom:2px solid #3498db!important;' +
    'padding-bottom:10px!important}' +
    '.hq-menu-section ul{list-style:none!important;padding:0!important;margin:0!important}' +
    '.hq-menu-section li{margin:10px 0!important}' +
    '.hq-menu-section a{color:#2c3e50!important;text-decoration:none!important;font-size:14px!important;' +
    'display:block!important;pointer-events:auto!important;cursor:pointer!important}' +
    '.hq-menu-section a:hover{color:#3498db!important}';

  // Combined CSS
  var CSS = menuCSS + panelCSS;

  // Menu HTML Structure
  var HTML = '<div class="hq-menu-panel">' +
      '<div class="hq-menu-grid">' +
        '<div class="hq-menu-section">' +
          '<h3>About</h3>' +
          '<ul>' +
            '<li><a href="/">Home</a></li>' +
            '<li><a href="/about-us">About Us</a></li>' +
            '<li><a href="/about-us-more">About Us More</a></li>' +
            '<li><a href="/more-about-us">More About Us</a></li>' +
            '<li><a href="/meet-the-team">Meet The Team</a></li>' +
            '<li><a href="/quentin-smith">Quentin Smith</a></li>' +
            '<li><a href="/images-of-q">Images of Q</a></li>' +
            '<li><a href="/testimonials-feedback">Testimonials</a></li>' +
            '<li><a href="/aviationlinks">Aviation Links</a></li>' +
            '<li><a href="/contact">Contact</a></li>' +
            '<li><a href="/contactus">Contact Us</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>R44 Aircraft</h3>' +
          '<ul>' +
            '<li><a href="/r44-details">R44 Details</a></li>' +
            '<li><a href="/r44-raven-series-details">R44 Raven Series</a></li>' +
            '<li><a href="/r44-cadet-details">R44 Cadet</a></li>' +
            '<li><a href="/r44-clipper-series">R44 Clipper Series</a></li>' +
            '<li><a href="/r44-cap">R44 Cap</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>R66 Aircraft</h3>' +
          '<ul>' +
            '<li><a href="/r66-details">R66 Details</a></li>' +
            '<li><a href="/r66">R66 Overview</a></li>' +
            '<li><a href="/r66-palo-verde">R66 Palo Verde</a></li>' +
            '<li><a href="/r66-nxg-palo-verde">R66 NxG Palo Verde</a></li>' +
            '<li><a href="/r66-nxg-riviera">R66 NxG Riviera</a></li>' +
            '<li><a href="/r66-riviera-selected">R66 Riviera Selected</a></li>' +
            '<li><a href="/r66-nxg-southwood">R66 NxG Southwood</a></li>' +
            '<li><a href="/r66-nxg-southwood-selected">R66 NxG Southwood Selected</a></li>' +
            '<li><a href="/hq-r66-cap">HQ R66 Cap</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>R88 Aircraft</h3>' +
          '<ul>' +
            '<li><a href="/r88-details">R88 Details</a></li>' +
            '<li><a href="/r88">R88 Overview</a></li>' +
            '<li><a href="/r88-selected">R88 Selected</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Aircraft Sales</h3>' +
          '<ul>' +
            '<li><a href="/new-aircraft-1">New Aircraft</a></li>' +
            '<li><a href="/aircraft-compare">Compare Aircraft</a></li>' +
            '<li><a href="/helicopter-fleet">Helicopter Fleet</a></li>' +
            '<li><a href="/used-aircraft">Used Aircraft</a></li>' +
            '<li><a href="/used-aircraft-2">Used Aircraft 2</a></li>' +
            '<li><a href="/recently-sold-aircraft">Recently Sold</a></li>' +
            '<li><a href="/2006-r44-raven-ii">2006 R44 Raven II</a></li>' +
            '<li><a href="/2007-r44-raven-ii">2007 R44 Raven II</a></li>' +
            '<li><a href="/2018-r66">2018 R66</a></li>' +
            '<li><a href="/helicopter-leaseback">Leaseback</a></li>' +
            '<li><a href="/aircraft-fleet-insurance">Fleet Insurance</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Flight Training</h3>' +
          '<ul>' +
            '<li><a href="/discovery-flights">Discovery Flights</a></li>' +
            '<li><a href="/discovery-flight">Discovery Flight</a></li>' +
            '<li><a href="/discovery-flight-1">Discovery Flight 1</a></li>' +
            '<li><a href="/trial-lessons">Trial Lessons</a></li>' +
            '<li><a href="/flying">Flying</a></li>' +
            '<li><a href="/private-pilots-license">Private Pilot License</a></li>' +
            '<li><a href="/commercial-courses">Commercial Courses</a></li>' +
            '<li><a href="/instructor-courses">Instructor Courses</a></li>' +
            '<li><a href="/type-rating">Type Rating</a></li>' +
            '<li><a href="/training-faq">Training FAQ</a></li>' +
            '<li><a href="/pricing">Pricing</a></li>' +
            '<li><a href="/british-team">British Helicopter Racing Team</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Advanced Training</h3>' +
          '<ul>' +
            '<li><a href="/advanced-flight-training">Advanced Flight</a></li>' +
            '<li><a href="/instrument-ratings">Instrument Ratings</a></li>' +
            '<li><a href="/night-ratings">Night Ratings</a></li>' +
            '<li><a href="/mountain-flying">Mountain Flying</a></li>' +
            '<li><a href="/faa-pilot-training">FAA Training</a></li>' +
            '<li><a href="/robinson-safety-courses">Safety Courses</a></li>' +
            '<li><a href="/special-training">Special Training</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Services</h3>' +
          '<ul>' +
            '<li><a href="/self-fly-hire">Self-Fly Hire</a></li>' +
            '<li><a href="/tour-of-london">Tour of London</a></li>' +
            '<li><a href="/helicopter-ferry-flights">Ferry Flights</a></li>' +
            '<li><a href="/helicopter-hangarage">Helicopter Hangarage</a></li>' +
            '<li><a href="/hangarage">Hangarage</a></li>' +
            '<li><a href="/our-fleet">Our Fleet</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Maintenance</h3>' +
          '<ul>' +
            '<li><a href="/maintenance-1">Maintenance</a></li>' +
            '<li><a href="/maintenance-rebuilds">Maintenance & Rebuilds</a></li>' +
            '<li><a href="/part145">Part 145</a></li>' +
            '<li><a href="/easapartm">EASA Part M</a></li>' +
            '<li><a href="/robinsonapproved">Robinson Approved</a></li>' +
            '<li><a href="/parts-dealer">Parts Dealer</a></li>' +
            '<li><a href="/custom-paint">Custom Paint</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Experiences</h3>' +
          '<ul>' +
            '<li><a href="/worldwide-helicopter-expeditions">Worldwide Expeditions</a></li>' +
            '<li><a href="/expeditions">Expeditions</a></li>' +
            '<li><a href="/helicopterexploration">Helicopter Exploration</a></li>' +
            '<li><a href="/hq-helicopter-trips">HQ Helicopter Trips</a></li>' +
            '<li><a href="/bespoke-adventures">Bespoke Adventures</a></li>' +
            '<li><a href="/gifts-experiences">Gifts & Experiences</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Special Services</h3>' +
          '<ul>' +
            '<li><a href="/pilot-provisioning">Pilot Provisioning</a></li>' +
            '<li><a href="/special-ops">Special Ops</a></li>' +
            '<li><a href="/media">Media & Film</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Gallery & Media</h3>' +
          '<ul>' +
            '<li><a href="/gallery">Gallery</a></li>' +
            '<li><a href="/video-gallery">Video Gallery</a></li>' +
            '<li><a href="/news">News</a></li>' +
            '<li><a href="/blogs">Blog</a></li>' +
            '<li><a href="/publications">Publications</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Shop & Community</h3>' +
          '<ul>' +
            '<li><a href="/apparel">Apparel</a></li>' +
            '<li><a href="/clubhouse">The Clubhouse</a></li>' +
            '<li><a href="/job-board">Job Board</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hq-menu-section">' +
          '<h3>Other Pages</h3>' +
          '<ul>' +
            '<li><a href="/miscellaneous">Miscellaneous</a></li>' +
            '<li><a href="/new-page-2">New Page 2</a></li>' +
            '<li><a href="/new-page-75">New Page 75</a></li>' +
            '<li><a href="/test-simple">Test Simple</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<button class="hq-menu-btn">' +
      '<span></span>' +
      '<span></span>' +
      '<span></span>' +
    '</button>';

  /**
   * Initialize the menu system
   */
  function init() {
    // Inject CSS
    var style = document.createElement('style');
    style.id = 'hq-menu-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    // Inject HTML
    document.body.insertAdjacentHTML('afterbegin', HTML);

    // Get references to menu elements
    var btn = document.querySelector('.hq-menu-btn');
    var panel = document.querySelector('.hq-menu-panel');

    // Guard: Ensure elements exist
    if (!btn || !panel) {
      console.error('HQ Menu: Failed to initialize - elements not found');
      return;
    }

    // Toggle menu on button click
    btn.onclick = function() {
      btn.classList.toggle('open');
      panel.classList.toggle('open');
    };

    // Check if we're on the home page
    var isHomePage = window.location.pathname === '/' || window.location.pathname === '/index' || window.location.pathname === '/index.html';

    // If not on home page, always use dark color
    if (!isHomePage) {
      btn.classList.add('color-dark');
    }

    // Color changes at 300px, position changes at 800px
    var colorChanged = !isHomePage; // Start as true if not home page
    var positionChanged = false;

    function checkScroll() {
      var scrollY = window.scrollY;

      // Color: black after 300px (only applies on home page)
      var shouldChangeColor = !isHomePage || scrollY > 300;
      if (shouldChangeColor !== colorChanged) {
        colorChanged = shouldChangeColor;
        if (colorChanged) {
          btn.classList.add('color-dark');
        } else {
          btn.classList.remove('color-dark');
        }
      }

      // Position: move up after 800px
      var shouldChangePosition = scrollY > 800;
      if (shouldChangePosition !== positionChanged) {
        positionChanged = shouldChangePosition;
        if (positionChanged) {
          btn.classList.add('scrolled');
        } else {
          btn.classList.remove('scrolled');
        }
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        btn.classList.remove('open');
        panel.classList.remove('open');
      }
    });

    // Handle link clicks - navigate explicitly
    var links = panel.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href) {
          e.preventDefault();
          btn.classList.remove('open');
          panel.classList.remove('open');
          // Navigate after a brief delay to let animation start
          setTimeout(function() {
            if (href === '/' || window.location.pathname === href) {
              window.location.href = href;
              window.location.reload();
            } else {
              window.location.href = href;
            }
          }, 100);
        }
      });
    }
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Squarespace Gallery & Image Handler
 * Handles lazy-loaded images and slideshow functionality for local viewing
 */
(function() {
  'use strict';

  // Inject gallery CSS
  var galleryCSS = document.createElement('style');
  galleryCSS.textContent =
    '.sqs-gallery-container { position: relative !important; }' +
    '.sqs-gallery-block-slideshow { position: relative; background: transparent; }' +
    '.sqs-gallery-block-slideshow .sqs-gallery { position: relative; width: 100%; height: 60vh; min-height: 400px; max-height: 700px; overflow: hidden; z-index: 1; }' +
    '.sqs-gallery-block-slideshow .slide { position: absolute !important; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.5s ease; }' +
    '.sqs-gallery-block-slideshow .slide.sqs-active-slide { opacity: 1; }' +
    '.sqs-gallery-block-slideshow .slide img { width: 100%; height: 100%; object-fit: contain; }' +
    '.sqs-gallery-block-slideshow .slide.content-fill img { object-fit: contain; }' +
    '.sqs-gallery-meta-container { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 10 !important; pointer-events: none !important; }' +
    '.sqs-gallery-controls { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; z-index: 10 !important; }' +
    '.sqs-gallery-controls .previous, .sqs-gallery-controls .next { position: absolute !important; top: 50% !important; transform: translateY(-50%) !important; background: rgba(0,0,0,0.4) !important; color: #fff !important; padding: 20px 15px !important; cursor: pointer !important; pointer-events: auto !important; font-size: 24px !important; transition: background 0.3s !important; z-index: 11 !important; }' +
    '.sqs-gallery-controls .previous:hover, .sqs-gallery-controls .next:hover { background: transparent !important; }' +
    '.sqs-gallery-controls .previous { left: 0 !important; }' +
    '.sqs-gallery-controls .next { right: 0 !important; }' +
    '.sqs-gallery-controls .previous:before { content: "\\2039"; }' +
    '.sqs-gallery-controls .next:before { content: "\\203A"; }' +
    '.sqs-gallery-thumbnails { display: flex !important; overflow-x: auto !important; overflow-y: hidden !important; gap: 10px; padding: 10px 0; background: transparent; white-space: nowrap; scrollbar-width: thin; }' +
    '.sqs-gallery-thumbnails img { height: 80px; width: auto; cursor: pointer; opacity: 0.5; transition: opacity 0.3s; flex-shrink: 0; }' +
    '.sqs-gallery-thumbnails img:hover, .sqs-gallery-thumbnails img.active { opacity: 1; }';
  document.head.appendChild(galleryCSS);

  function initGalleries() {
    // Load all lazy images (data-src -> src)
    var images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img) {
      var src = img.getAttribute('data-src');
      if (src) {
        img.setAttribute('src', src);
        img.style.opacity = '1';
      }
    });

    // Initialize slideshows
    var galleries = document.querySelectorAll('.sqs-gallery-block-slideshow');
    galleries.forEach(function(gallery) {
      var slides = gallery.querySelectorAll('.slide');
      if (slides.length === 0) return;

      var currentIndex = 0;

      // Mark first slide as active
      if (slides[0]) slides[0].classList.add('sqs-active-slide');

      function goToSlide(index) {
        currentIndex = index;
        slides.forEach(function(s, i) {
          s.classList.toggle('sqs-active-slide', i === index);
        });
        // Update thumbnails
        var thumbs = gallery.querySelectorAll('.sqs-gallery-thumbnails img');
        thumbs.forEach(function(t, i) {
          t.classList.toggle('active', i === index);
        });
      }

      // Use existing controls if present
      var prevBtn = gallery.querySelector('.sqs-gallery-controls .previous');
      var nextBtn = gallery.querySelector('.sqs-gallery-controls .next');

      if (prevBtn) {
        prevBtn.onclick = function(e) {
          e.preventDefault();
          goToSlide((currentIndex - 1 + slides.length) % slides.length);
        };
      }
      if (nextBtn) {
        nextBtn.onclick = function(e) {
          e.preventDefault();
          goToSlide((currentIndex + 1) % slides.length);
        };
      }

      // Handle thumbnail clicks
      var thumbs = gallery.querySelectorAll('.sqs-gallery-thumbnails img');
      thumbs.forEach(function(thumb, index) {
        thumb.onclick = function() { goToSlide(index); };
        if (index === 0) thumb.classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }
})();
