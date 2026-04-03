/**
 * EDITORIAL GRID COMPONENT
 * Curated Commerce - Net-a-Porter, Sotheby's inspired
 */

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const imgs = {
  r66: '/assets/images/new-aircraft/r66-turbine.jpg',
  r44: '/assets/images/new-aircraft/r44-raven.jpg',
  hangar: '/assets/images/facility/hangar-main.jpg',
};

export const EditorialGrid = () => {
  // 'normal' = in document flow | 'sticky' = fixed at nav | 'hidden' = faded out
  const [mode, setMode] = useState('normal');
  const [navBottom, setNavBottom] = useState(120);
  const [tickerLeftOffset, setTickerLeftOffset] = useState(0);
  const placeholderRef = useRef(null);
  const tickerRef = useRef(null);
  const originalTopRef = useRef(null);
  const prevModeRef = useRef('normal');
  const STICKY_DURATION = 100;

  useEffect(() => {
    const calculate = () => {
      // Get nav bottom
      const nav = document.querySelector('.fd-nav');
      if (nav) {
        const style = window.getComputedStyle(nav);
        const top = parseFloat(style.top) || 49;
        setNavBottom(top + nav.getBoundingClientRect().height);
      }

      // Store original top position once, but always update left offset (for resize)
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        if (originalTopRef.current === null) {
          originalTopRef.current = rect.top + window.scrollY;
        }
        // Always update left offset to handle resize
        setTickerLeftOffset(rect.left);
      }

      if (originalTopRef.current === null) return;

      const scrollY = window.scrollY;
      const triggerPoint = originalTopRef.current - navBottom;
      const endPoint = triggerPoint + STICKY_DURATION;

      let newMode = 'normal';
      if (scrollY < triggerPoint) {
        newMode = 'normal';
      } else if (scrollY >= triggerPoint && scrollY < endPoint) {
        newMode = 'sticky';
      } else {
        newMode = 'hidden';
      }

      // Log only on actual mode change
      if (prevModeRef.current !== newMode && tickerRef.current) {
        const contentEl = tickerRef.current.querySelector('.editorial-grid__ticker-content');
        const computedStyle = window.getComputedStyle(contentEl);
        const transform = computedStyle.transform;

        console.log('=== TICKER MODE CHANGE ===');
        console.log(`Transition: ${prevModeRef.current} → ${newMode}`);
        console.log(`Ticker getBoundingClientRect():`, tickerRef.current.getBoundingClientRect());
        console.log(`Content getBoundingClientRect():`, contentEl?.getBoundingClientRect());
        console.log(`Content transform: ${transform}`);
        console.log(`tickerLeftOffset state: ${tickerLeftOffset}`);
        console.log(`Inline style being applied: top=${navBottom}, left=${tickerLeftOffset}`);
        console.log('==========================');

        prevModeRef.current = newMode;
      }

      setMode(newMode);
    };

    window.addEventListener('scroll', calculate, { passive: true });
    window.addEventListener('resize', calculate);
    calculate();

    return () => {
      window.removeEventListener('scroll', calculate);
      window.removeEventListener('resize', calculate);
    };
  }, [navBottom, tickerLeftOffset]);

  // Log positions AFTER mode change has been applied to DOM
  useEffect(() => {
    if (!tickerRef.current) return;

    const contentEl = tickerRef.current.querySelector('.editorial-grid__ticker-content');

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      console.log(`=== AFTER MODE APPLIED: ${mode} ===`);
      console.log(`Ticker left (getBoundingClientRect): ${tickerRef.current?.getBoundingClientRect().left}`);
      console.log(`Content left (getBoundingClientRect): ${contentEl?.getBoundingClientRect().left}`);
      console.log('================================');
    });
  }, [mode]);

  return (
  <section className="editorial-grid">
    <header className="editorial-grid__header">
      <div className="editorial-grid__logo">HQ</div>
      <div className="editorial-grid__tagline">The Aviation Edit</div>
      <div className="editorial-grid__issue">Issue No. 47 — Winter 2024</div>
    </header>

    <div className="editorial-grid__grid">
      <div className="editorial-grid__cell editorial-grid__cell--feature">
        <img src={imgs.r66} alt="" />
        <div className="editorial-grid__cell-content">
          <span className="editorial-grid__category">Featured Aircraft</span>
          <h2>The R66 Turbine</h2>
          <p>Redefining private aviation for the discerning pilot</p>
          <Link to="/aircraft">Shop Now →</Link>
        </div>
      </div>

      <div className="editorial-grid__cell editorial-grid__cell--training">
        <img src={imgs.hangar} alt="" />
        <div className="editorial-grid__cell-content">
          <span className="editorial-grid__category">Training</span>
          <h3>Flight Academy</h3>
          <Link to="/training">Explore</Link>
        </div>
      </div>

      <div className="editorial-grid__cell editorial-grid__cell--quote">
        <blockquote>
          "Excellence is not a destination but a continuous journey."
        </blockquote>
        <cite>— Captain Q</cite>
      </div>

      <div className="editorial-grid__cell editorial-grid__cell--expeditions">
        <img src={imgs.r44} alt="" />
        <div className="editorial-grid__cell-content">
          <span className="editorial-grid__category">Expeditions</span>
          <h3>World Adventures</h3>
          <Link to="/expeditions">Discover</Link>
        </div>
      </div>
    </div>

    {/* Placeholder keeps space in document flow */}
    <div
      ref={placeholderRef}
      className="editorial-grid__ticker-placeholder"
      style={{ height: mode !== 'normal' ? tickerRef.current?.offsetHeight || 48 : 'auto' }}
    >
      {/* Ticker - in flow when normal, fixed when sticky/hidden */}
      <div
        ref={tickerRef}
        className={`editorial-grid__ticker editorial-grid__ticker--${mode}`}
        style={mode !== 'normal' ? { top: navBottom, left: tickerLeftOffset } : undefined}
      >
        <div className="editorial-grid__ticker-content">
          <span>Robinson Approved Service Centre</span>
          <span>•</span>
          <span>35+ Years Experience</span>
          <span>•</span>
          <span>PPL to ATPL Training</span>
          <span>•</span>
          <span>Aircraft Sales & Acquisition</span>
          <span>•</span>
          <span>Worldwide Expeditions</span>
          <span>•</span>
        </div>
      </div>
    </div>

    <style>{`
      .editorial-grid {
        min-height: 100vh;
        background: #faf9f7;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .editorial-grid__header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e8e6e2;
      }

      .editorial-grid__logo {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.75rem;
        font-weight: 600;
        color: #1a1a1a;
      }

      .editorial-grid__tagline {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1rem;
        font-style: italic;
        color: #666;
      }

      .editorial-grid__issue {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #999;
      }

      .editorial-grid__grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        flex: 1;
        gap: 1px;
        background: #e8e6e2;
      }

      .editorial-grid__cell {
        position: relative;
        background: #fff;
        overflow: hidden;
      }

      .editorial-grid__cell img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.8s ease;
      }

      .editorial-grid__cell:hover img {
        transform: scale(1.05);
      }

      .editorial-grid__cell-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: #fff;
      }

      .editorial-grid__category {
        display: block;
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: rgba(255,255,255,0.7);
        margin-bottom: 0.5rem;
      }

      .editorial-grid__cell-content h2 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.75rem;
        font-weight: 400;
        margin: 0 0 0.5rem;
      }

      .editorial-grid__cell-content h3 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.25rem;
        font-weight: 400;
        margin: 0 0 0.5rem;
      }

      .editorial-grid__cell-content p {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.8);
        margin: 0 0 1rem;
      }

      .editorial-grid__cell-content a {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #fff;
        text-decoration: none;
        border-bottom: 1px solid rgba(255,255,255,0.3);
        padding-bottom: 0.25rem;
        transition: border-color 0.3s ease;
      }

      .editorial-grid__cell-content a:hover {
        border-color: #fff;
      }

      .editorial-grid__cell--feature {
        grid-row: span 2;
      }

      .editorial-grid__cell--quote {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background: #1a1a1a;
      }

      .editorial-grid__cell--quote blockquote {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.25rem;
        font-style: italic;
        color: #fff;
        text-align: center;
        line-height: 1.6;
        margin: 0 0 1rem;
      }

      .editorial-grid__cell--quote cite {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: rgba(255,255,255,0.5);
      }

      .editorial-grid__ticker-placeholder {
        position: relative;
        /* Break out of parent to be full width */
        width: 100vw;
        margin-left: calc(-50vw + 50%);
      }

      .editorial-grid__ticker {
        padding: 1rem 0;
        border-top: 1px solid #e8e6e2;
        overflow: hidden;
        background: #faf9f7;
        /* Always full viewport width to prevent animation jump */
        width: 100vw;
      }

      /* Normal: in document flow */
      .editorial-grid__ticker--normal {
        /* stays in placeholder */
      }

      /* Sticky: fixed at nav bottom */
      .editorial-grid__ticker--sticky {
        position: fixed;
        z-index: 99;
        border-top: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      /* Hidden: fixed but faded out */
      .editorial-grid__ticker--hidden {
        position: fixed;
        z-index: 99;
        border-top: 0;
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .editorial-grid__ticker-content {
        display: flex;
        gap: 2rem;
        animation: tickerScroll 20s linear infinite;
        white-space: nowrap;
      }

      @keyframes tickerScroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      .editorial-grid__ticker-content span {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #666;
      }

      @media (max-width: 768px) {
        .editorial-grid__grid {
          grid-template-columns: 1fr;
          grid-template-rows: auto;
        }

        .editorial-grid__cell--feature {
          grid-row: 1;
          min-height: 50vh;
        }
      }
    `}</style>
  </section>
  );
};

export default EditorialGrid;
