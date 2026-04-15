/**
 * HQ Aviation Animation System
 * Scroll-triggered reveals using IntersectionObserver
 * Consistent timing: 300ms ease-out-expo
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Observer options
    rootMargin: '0px 0px -10% 0px',  // Trigger slightly before element enters viewport
    threshold: 0.1,                   // Trigger when 10% visible

    // Animation classes
    revealClass: 'hq-reveal',
    revealedClass: 'hq-revealed',
    homeRevealClass: 'hq-home-reveal',
    staggerClass: 'hq-home-reveal-stagger',
  };

  // Elements to observe
  let observer = null;

  /**
   * Initialize scroll animations
   */
  function init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Immediately reveal all elements
      revealAllInstantly();
      return;
    }

    // Create intersection observer
    observer = new IntersectionObserver(handleIntersection, {
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold,
    });

    // Observe all reveal elements
    observeElements();

    // Re-observe after dynamic content loads
    document.addEventListener('hq:content-loaded', observeElements);
  }

  /**
   * Handle intersection changes
   */
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Reveal an element
   */
  function revealElement(element) {
    if (element.classList.contains(CONFIG.revealClass)) {
      element.classList.add(CONFIG.revealedClass);
    }

    if (element.classList.contains(CONFIG.homeRevealClass)) {
      element.classList.add('revealed');
    }

    if (element.classList.contains(CONFIG.staggerClass)) {
      element.classList.add('revealed');
    }
  }

  /**
   * Observe all reveal elements
   */
  function observeElements() {
    const elements = document.querySelectorAll(
      `.${CONFIG.revealClass}:not(.${CONFIG.revealedClass}), ` +
      `.${CONFIG.homeRevealClass}:not(.revealed), ` +
      `.${CONFIG.staggerClass}:not(.revealed)`
    );

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Reveal all elements instantly (for reduced motion)
   */
  function revealAllInstantly() {
    const elements = document.querySelectorAll(
      `.${CONFIG.revealClass}, .${CONFIG.homeRevealClass}, .${CONFIG.staggerClass}`
    );

    elements.forEach(element => {
      element.style.transition = 'none';
      element.classList.add(CONFIG.revealedClass, 'revealed');
    });
  }

  /**
   * Manually trigger reveal for an element
   */
  function reveal(element) {
    if (element) {
      revealElement(element);
      if (observer) {
        observer.unobserve(element);
      }
    }
  }

  /**
   * Reset an element to hidden state
   */
  function reset(element) {
    if (element) {
      element.classList.remove(CONFIG.revealedClass, 'revealed');
      if (observer) {
        observer.observe(element);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.HQAnimations = {
    reveal,
    reset,
    observeElements,
  };

})();

/**
 * Parallax Effect for Hero Images
 * Subtle parallax on scroll
 */
(function() {
  'use strict';

  const parallaxElements = [];
  let ticking = false;

  function init() {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Find parallax elements
    document.querySelectorAll('[data-hq-parallax]').forEach(element => {
      parallaxElements.push({
        element,
        speed: parseFloat(element.dataset.hqParallax) || 0.5,
      });
    });

    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateParallax();
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(({ element, speed }) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Only animate if element is in or near viewport
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        const yOffset = (scrollY - elementTop) * speed;
        element.style.transform = `translateY(${yOffset}px)`;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/**
 * Counter Animation
 * Animate numbers when they come into view
 */
(function() {
  'use strict';

  function init() {
    const counters = document.querySelectorAll('[data-hq-counter]');

    if (counters.length === 0) return;

    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(counter => {
        counter.textContent = counter.dataset.hqCounter;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.hqCounter, 10);
    const duration = parseInt(element.dataset.hqCounterDuration, 10) || 2000;
    const suffix = element.dataset.hqCounterSuffix || '';
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
