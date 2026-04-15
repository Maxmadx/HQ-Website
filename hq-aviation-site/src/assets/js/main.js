/**
 * HQ Aviation - Main JavaScript
 * Core functionality: accordions, animations, forms
 */

(function() {
    'use strict';

    /**
     * Accordion Component
     */
    function initAccordions() {
        const accordions = document.querySelectorAll('.accordion');

        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.accordion__item');

            items.forEach(item => {
                const header = item.querySelector('.accordion__header');
                const content = item.querySelector('.accordion__content');

                if (!header || !content) return;

                // Set initial state
                if (item.classList.contains('is-open')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                header.addEventListener('click', () => {
                    const isOpen = item.classList.contains('is-open');

                    // Close all items in this accordion (single-open mode)
                    if (accordion.dataset.singleOpen !== 'false') {
                        items.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('is-open');
                                const otherContent = otherItem.querySelector('.accordion__content');
                                if (otherContent) {
                                    otherContent.style.maxHeight = '0';
                                }
                            }
                        });
                    }

                    // Toggle current item
                    item.classList.toggle('is-open', !isOpen);
                    content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
                });
            });
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Animate elements on scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Lazy load images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }

        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('is-loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Form validation and submission
     */
    function initForms() {
        const forms = document.querySelectorAll('.contact-form, form[data-validate]');

        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Basic validation
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;

                requiredFields.forEach(field => {
                    const errorClass = 'is-invalid';

                    // Remove existing error state
                    field.classList.remove(errorClass);

                    // Check validity
                    if (!field.value.trim()) {
                        field.classList.add(errorClass);
                        isValid = false;
                    }

                    // Email validation
                    if (field.type === 'email' && field.value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value)) {
                            field.classList.add(errorClass);
                            isValid = false;
                        }
                    }
                });

                if (isValid) {
                    // Show loading state
                    const submitBtn = form.querySelector('[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;

                    // Simulate form submission (replace with actual API call)
                    setTimeout(() => {
                        // Show success message
                        form.innerHTML = `
                            <div class="form-success">
                                <i class="fas fa-check-circle fa-3x text-accent mb-4"></i>
                                <h3>Message Sent!</h3>
                                <p>Thank you for your enquiry. We'll be in touch shortly.</p>
                            </div>
                        `;
                    }, 1500);
                }
            });

            // Real-time validation on blur
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.addEventListener('blur', function() {
                    if (field.required && !field.value.trim()) {
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
            });
        });
    }

    /**
     * Counter animation for stats
     */
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter, 10);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.round(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Tab component
     */
    function initTabs() {
        const tabContainers = document.querySelectorAll('[data-tabs]');

        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('[data-tab]');
            const panels = container.querySelectorAll('[data-panel]');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetPanel = tab.dataset.tab;

                    // Update active states
                    tabs.forEach(t => t.classList.remove('is-active'));
                    panels.forEach(p => p.classList.remove('is-active'));

                    tab.classList.add('is-active');
                    const panel = container.querySelector(`[data-panel="${targetPanel}"]`);
                    if (panel) panel.classList.add('is-active');
                });
            });
        });
    }

    /**
     * Copy to clipboard functionality
     */
    function initClipboard() {
        const copyButtons = document.querySelectorAll('[data-copy]');

        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const text = button.dataset.copy;

                try {
                    await navigator.clipboard.writeText(text);

                    // Visual feedback
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.classList.add('is-copied');

                    setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove('is-copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    /**
     * Video embed click-to-play
     */
    function initVideoEmbeds() {
        const videoPlaceholders = document.querySelectorAll('[data-video]');

        videoPlaceholders.forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                const videoId = placeholder.dataset.video;
                const iframe = document.createElement('iframe');

                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';

                placeholder.innerHTML = '';
                placeholder.style.position = 'relative';
                placeholder.style.paddingBottom = '56.25%';
                placeholder.appendChild(iframe);
            });
        });
    }

    /**
     * Initialize all components
     */
    function init() {
        initAccordions();
        initSmoothScroll();
        initScrollAnimations();
        initLazyLoading();
        initForms();
        initCounters();
        initTabs();
        initClipboard();
        initVideoEmbeds();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
