/**
 * HQ Aviation - Navigation JavaScript
 * Handles mobile menu, dropdowns, and search overlay
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const navItems = document.querySelectorAll('.header__nav-item');
    const searchToggle = document.querySelector('.header__search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay__close');
    const searchInput = document.querySelector('.search-overlay__input');

    // State
    let isMenuOpen = false;
    let isSearchOpen = false;
    let lastScrollY = window.scrollY;

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (menuToggle) {
            menuToggle.classList.toggle('is-active', isMenuOpen);
            menuToggle.setAttribute('aria-expanded', isMenuOpen);
        }

        if (mobileMenu) {
            mobileMenu.classList.toggle('is-open', isMenuOpen);
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            if (menuToggle) {
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            if (mobileMenu) {
                mobileMenu.classList.remove('is-open');
            }
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle dropdown menus on desktop
     */
    function setupDropdowns() {
        navItems.forEach(item => {
            const dropdown = item.querySelector('.header__dropdown');
            if (!dropdown) return;

            // Show dropdown on hover (desktop)
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    dropdown.classList.add('is-visible');
                }
            });

            item.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    dropdown.classList.remove('is-visible');
                }
            });

            // Handle click for mobile
            const link = item.querySelector('.header__nav-link');
            if (link && link.nextElementSibling === dropdown) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth < 1024) {
                        e.preventDefault();
                        dropdown.classList.toggle('is-visible');
                        // Close other dropdowns
                        navItems.forEach(other => {
                            if (other !== item) {
                                const otherDropdown = other.querySelector('.header__dropdown');
                                if (otherDropdown) {
                                    otherDropdown.classList.remove('is-visible');
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * Toggle search overlay
     */
    function toggleSearch() {
        isSearchOpen = !isSearchOpen;

        if (searchOverlay) {
            searchOverlay.classList.toggle('is-open', isSearchOpen);
            if (isSearchOpen && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }

        document.body.style.overflow = isSearchOpen ? 'hidden' : '';
    }

    /**
     * Close search overlay
     */
    function closeSearch() {
        if (isSearchOpen) {
            isSearchOpen = false;
            if (searchOverlay) {
                searchOverlay.classList.remove('is-open');
            }
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle scroll behavior - hide/show header
     */
    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for styling
        if (header) {
            header.classList.toggle('is-scrolled', currentScrollY > 50);
        }

        // Hide header on scroll down, show on scroll up
        if (header && !isMenuOpen && !isSearchOpen) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }
        }

        lastScrollY = currentScrollY;
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(e) {
        // Close menu/search on Escape
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeSearch();
        }
    }

    /**
     * Handle clicks outside menu/dropdowns
     */
    function handleClickOutside(e) {
        // Close mobile menu if clicked outside
        if (isMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }

        // Close search if clicked outside
        if (isSearchOpen && searchOverlay && !searchOverlay.querySelector('.search-overlay__container').contains(e.target)) {
            closeSearch();
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 1024 && isMenuOpen) {
            closeMobileMenu();
        }

        // Reset dropdown visibility
        document.querySelectorAll('.header__dropdown').forEach(dropdown => {
            dropdown.classList.remove('is-visible');
        });
    }

    /**
     * Initialize navigation
     */
    function init() {
        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Search toggle
        if (searchToggle) {
            searchToggle.addEventListener('click', toggleSearch);
        }

        // Search close
        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        // Setup dropdowns
        setupDropdowns();

        // Event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('click', handleClickOutside);

        // Initial scroll check
        handleScroll();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
