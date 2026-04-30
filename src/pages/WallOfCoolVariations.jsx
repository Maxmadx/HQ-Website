import React, { useEffect } from 'react';

const IMAGES = [
  { src: '/assets/images/gallery/social/img-20241004-wa0001.jpg', alt: 'Community' },
  { src: '/assets/images/gallery/flying/foggy-evening-flying.jpg', alt: 'Flying' },
  { src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team' },
  { src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole' },
  { src: '/assets/images/expeditions/antartica.jpg', alt: 'Antarctica' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expedition' },
  { src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht' },
  { src: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet' },
  { src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night flying' },
];

const VARIATIONS = [
  { id: 'v1', title: 'Alternating Horizontal', desc: 'Odd rows slide in from the right, even rows from the left. (Current baseline.)' },
  { id: 'v2', title: 'Row Cascade (zig-zag)', desc: 'Rows arrive in sequence — top row first from the right, middle from the left, bottom from the right. Each row waits for the previous.' },
  { id: 'v3', title: 'Vertical Alternating', desc: 'Odd rows drop from above, even rows rise from below.' },
  { id: 'v4', title: 'Zoom + Fade', desc: 'Each cell scales up from 30% with opacity fade.' },
  { id: 'v5', title: 'Blur to Sharp', desc: 'Cells reveal through a heavy blur that sharpens with scroll.' },
  { id: 'v6', title: 'Diagonal Slide', desc: 'All cells enter from the top-left corner diagonally.' },
  { id: 'v7', title: '3D Flip (Y-axis)', desc: 'Cells flip in around their left edge with perspective.' },
  { id: 'v8', title: 'Bottom-up Clip Reveal', desc: 'Cells stay in place; a clip-path unmasks them from their bottom edge upward.' },
  { id: 'v9', title: 'Tilt + Slide', desc: 'Cells slide in from the right with a slight rotation that straightens.' },
  { id: 'v10', title: 'Parallax Image Zoom', desc: 'Cells are in place from the start; inner images zoom out from 1.3x to 1.0x as you scroll.' },
];

export default function WallOfCoolVariations() {
  useEffect(() => {
    const wrappers = Array.from(document.querySelectorAll('.woc-variant'));
    let rafId = null;
    const update = () => {
      rafId = null;
      const vh = window.innerHeight;
      wrappers.forEach((wrapper) => {
        const sticky = wrapper.querySelector('.woc-variant__sticky');
        if (!sticky) return;
        const rect = sticky.getBoundingClientRect();
        const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
        const start = vh * 0.65;
        const end = stickyTop;
        const range = start - end;
        const raw = range > 0 ? (start - rect.top) / range : 0;
        const p = Math.max(0, Math.min(1, raw));
        wrapper.style.setProperty('--p', p.toFixed(4));
      });
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="woc-variations-page">
      <header className="woc-variations-nav">
        <div className="woc-variations-nav__title">Wall of Cool — 10 Variations</div>
        <nav className="woc-variations-nav__links">
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="woc-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="woc-variant__sticky">
            <div className="woc-variant__label">
              <span className="woc-variant__number">{v.id.toUpperCase()}</span>
              <div className="woc-variant__label-text">
                <h2 className="woc-variant__title">{v.title}</h2>
                <p className="woc-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="woc-variant__gallery">
              <div className="woc-variant__grid">
                {IMAGES.map((img, i) => (
                  <div className="woc-variant__cell" key={i} style={{ '--i': i }}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .woc-variations-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* Sticky top nav */
        .woc-variations-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.65rem 1.25rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
        }
        .woc-variations-nav__title {
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
        }
        .woc-variations-nav__links {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .woc-variations-nav__links a {
          display: inline-block;
          padding: 0.25rem 0.55rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          text-decoration: none;
          color: #333;
          background: #fff;
          transition: background 0.15s, color 0.15s;
        }
        .woc-variations-nav__links a:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* Variant section */
        .woc-variant {
          position: relative;
          height: 165vh;
          padding: 2rem 1.5rem 0;
        }
        .woc-variant__sticky {
          position: sticky;
          top: 70px;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          height: calc(100vh - 90px);
        }
        .woc-variant__label {
          flex: 0 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
        }
        .woc-variant__number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          padding: 0 0.5rem;
          background: #1a1a1a;
          color: #fff;
          border-radius: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .woc-variant__title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.2;
        }
        .woc-variant__desc {
          margin: 0.2rem 0 0;
          color: #666;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        /* Gallery */
        .woc-variant__gallery {
          flex: 1 1 auto;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom, #ffffff 0%, #000000 100%);
        }
        .woc-variant__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px;
          padding: 8px;
          height: 100%;
        }
        .woc-variant__cell {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.22);
          background: #1a1a1a;
          will-change: transform, opacity, filter, clip-path;
        }
        .woc-variant__cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        /* ========= V1: Alternating Horizontal ========= */
        [data-variant="v1"] .woc-variant__cell:nth-child(6n+1),
        [data-variant="v1"] .woc-variant__cell:nth-child(6n+2),
        [data-variant="v1"] .woc-variant__cell:nth-child(6n+3) {
          transform: translateX(calc((1 - var(--p, 0)) * 110vw));
        }
        [data-variant="v1"] .woc-variant__cell:nth-child(6n+4),
        [data-variant="v1"] .woc-variant__cell:nth-child(6n+5),
        [data-variant="v1"] .woc-variant__cell:nth-child(6n) {
          transform: translateX(calc((1 - var(--p, 0)) * -110vw));
        }

        /* ========= V2: Row Cascade (staggered) ========= */
        /* Each row gets its own progress window: row 1 (0→0.4), row 2 (0.3→0.7), row 3 (0.6→1.0) */
        [data-variant="v2"] .woc-variant__cell:nth-child(-n+3) {
          --row-p: clamp(0, calc(var(--p, 0) * 2.5), 1);
          transform: translateX(calc((1 - var(--row-p)) * 110vw));
        }
        [data-variant="v2"] .woc-variant__cell:nth-child(n+4):nth-child(-n+6) {
          --row-p: clamp(0, calc((var(--p, 0) - 0.3) * 2.5), 1);
          transform: translateX(calc((1 - var(--row-p)) * -110vw));
        }
        [data-variant="v2"] .woc-variant__cell:nth-child(n+7) {
          --row-p: clamp(0, calc((var(--p, 0) - 0.6) * 2.5), 1);
          transform: translateX(calc((1 - var(--row-p)) * 110vw));
        }

        /* ========= V3: Vertical Alternating ========= */
        [data-variant="v3"] .woc-variant__cell:nth-child(6n+1),
        [data-variant="v3"] .woc-variant__cell:nth-child(6n+2),
        [data-variant="v3"] .woc-variant__cell:nth-child(6n+3) {
          transform: translateY(calc((1 - var(--p, 0)) * -105vh));
        }
        [data-variant="v3"] .woc-variant__cell:nth-child(6n+4),
        [data-variant="v3"] .woc-variant__cell:nth-child(6n+5),
        [data-variant="v3"] .woc-variant__cell:nth-child(6n) {
          transform: translateY(calc((1 - var(--p, 0)) * 105vh));
        }

        /* ========= V4: Zoom + Fade ========= */
        [data-variant="v4"] .woc-variant__cell {
          transform: scale(calc(0.3 + var(--p, 0) * 0.7));
          opacity: var(--p, 0);
          transform-origin: center;
        }

        /* ========= V5: Blur to Sharp ========= */
        [data-variant="v5"] .woc-variant__cell {
          opacity: var(--p, 0);
          filter: blur(calc((1 - var(--p, 0)) * 24px));
        }

        /* ========= V6: Diagonal Slide ========= */
        [data-variant="v6"] .woc-variant__cell {
          transform:
            translateX(calc((1 - var(--p, 0)) * -100vw))
            translateY(calc((1 - var(--p, 0)) * -70vh));
        }

        /* ========= V7: 3D Flip ========= */
        [data-variant="v7"] .woc-variant__gallery {
          perspective: 1500px;
        }
        [data-variant="v7"] .woc-variant__cell {
          transform: rotateY(calc((1 - var(--p, 0)) * -95deg));
          transform-origin: left center;
          backface-visibility: hidden;
          opacity: clamp(0, calc(var(--p, 0) * 3), 1);
        }

        /* ========= V8: Bottom-up Clip Reveal ========= */
        [data-variant="v8"] .woc-variant__cell {
          clip-path: inset(calc((1 - var(--p, 0)) * 100%) 0 0 0);
        }

        /* ========= V9: Tilt + Slide ========= */
        [data-variant="v9"] .woc-variant__cell {
          transform:
            translateX(calc((1 - var(--p, 0)) * 60vw))
            rotate(calc((1 - var(--p, 0)) * 15deg));
          opacity: clamp(0, calc(var(--p, 0) * 1.5), 1);
          transform-origin: center;
        }

        /* ========= V10: Parallax Image Zoom (cells static, image scales) ========= */
        [data-variant="v10"] .woc-variant__cell img {
          transform: scale(calc(1.3 - var(--p, 0) * 0.3));
        }

        /* Mobile: still show all variations but reduce section height to avoid excessive scrolling */
        @media (max-width: 768px) {
          .woc-variant {
            height: 130vh;
          }
          .woc-variant__title {
            font-size: 1rem;
          }
          .woc-variant__desc {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
