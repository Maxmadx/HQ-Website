/**
 * HQ Aviation Navigation Controller
 * Handles header scroll behavior and mobile menu
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    scrollThreshold: 100,      // Pixels before header becomes solid
    hideThreshold: 400,        // Pixels before hide-on-scroll kicks in
    hideScrollDelta: 10,       // Minimum scroll delta to trigger hide/show
  };

  // State
  let lastScrollY = 0;
  let ticking = false;
  let isHidden = false;
  let isSolid = false;

  // Elements
  let nav = null;
  let mobileNav = null;
  let mobileToggle = null;
  let mobileClose = null;
  let mobileItems = null;

  /**
   * Initialize navigation
   */
  function init() {
    nav = document.querySelector('.hq-nav');
    mobileNav = document.querySelector('.hq-mobile-nav');
    mobileToggle = document.querySelector('.hq-nav__toggle');
    mobileClose = document.querySelector('.hq-mobile-nav__close');
    mobileItems = document.querySelectorAll('.hq-mobile-nav__item[data-submenu]');

    if (!nav) return;

    // Initial state
    updateNavState(window.scrollY);

    // Scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Mobile submenu toggles
    mobileItems.forEach(item => {
      const link = item.querySelector('.hq-mobile-nav__link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMobileSubmenu(item);
        });
      }
    });

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav?.classList.contains('hq-mobile-nav--open')) {
        closeMobileMenu();
      }
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileNav?.classList.contains('hq-mobile-nav--open')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Scroll event handler with requestAnimationFrame throttling
   */
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavState(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }

  /**
   * Update navigation state based on scroll position
   */
  function updateNavState(scrollY) {
    if (!nav) return;

    const scrollDelta = scrollY - lastScrollY;

    // Solid/Transparent state
    if (scrollY > CONFIG.scrollThreshold) {
      if (!isSolid) {
        nav.classList.remove('hq-nav--transparent');
        nav.classList.add('hq-nav--solid');
        isSolid = true;
      }
    } else {
      if (isSolid) {
        nav.classList.remove('hq-nav--solid');
        nav.classList.add('hq-nav--transparent');
        isSolid = false;
      }
    }

    // Hide/Show on scroll direction
    if (scrollY > CONFIG.hideThreshold) {
      if (scrollDelta > CONFIG.hideScrollDelta && !isHidden) {
        // Scrolling down - hide
        nav.classList.add('hq-nav--hidden');
        isHidden = true;
      } else if (scrollDelta < -CONFIG.hideScrollDelta && isHidden) {
        // Scrolling up - show
        nav.classList.remove('hq-nav--hidden');
        isHidden = false;
      }
    } else {
      // Near top - always show
      if (isHidden) {
        nav.classList.remove('hq-nav--hidden');
        isHidden = false;
      }
    }

    lastScrollY = scrollY;
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    if (!mobileNav || !mobileToggle) return;

    const isOpen = mobileNav.classList.contains('hq-mobile-nav--open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    if (!mobileNav || !mobileToggle) return;

    mobileNav.classList.add('hq-mobile-nav--open');
    mobileToggle.classList.add('hq-nav__toggle--active');
    document.body.style.overflow = 'hidden';

    // Focus first link for accessibility
    const firstLink = mobileNav.querySelector('.hq-mobile-nav__link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    if (!mobileNav || !mobileToggle) return;

    mobileNav.classList.remove('hq-mobile-nav--open');
    mobileToggle.classList.remove('hq-nav__toggle--active');
    document.body.style.overflow = '';

    // Close all submenus
    mobileItems.forEach(item => {
      item.classList.remove('hq-mobile-nav__item--open');
    });
  }

  /**
   * Toggle mobile submenu
   */
  function toggleMobileSubmenu(item) {
    if (!item) return;

    const isOpen = item.classList.contains('hq-mobile-nav__item--open');

    // Close all other submenus
    mobileItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('hq-mobile-nav__item--open');
      }
    });

    // Toggle this submenu
    if (isOpen) {
      item.classList.remove('hq-mobile-nav__item--open');
    } else {
      item.classList.add('hq-mobile-nav__item--open');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use
  window.HQNavigation = {
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu
  };

})();
