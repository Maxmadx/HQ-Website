/**
 * HERO PATH PICKER
 *
 * Browse 20 different SVG scroll path variations for the hero section.
 * Each path draws itself as you scroll.
 *
 * Variations include:
 * - Different trajectories (ascending, wave, S-curve, diagonal, etc.)
 * - Different line counts (1, 2, 3 lines)
 * - Different stroke widths and opacities
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// PATH DEFINITIONS - 20 VARIATIONS
// ============================================

const PATH_VARIATIONS = [
  {
    id: 'path-01',
    name: 'Gentle Ascent',
    category: 'Single Line',
    desc: 'Smooth left-to-right climb',
    paths: [
      { d: 'M -50 400 C 200 380, 500 300, 800 250 S 1200 180, 1500 150 C 1700 130, 1900 100, 2050 80', stroke: '#b0b0b0', width: 2 }
    ]
  },
  {
    id: 'path-02',
    name: 'Steep Climb',
    category: 'Single Line',
    desc: 'Dramatic ascending trajectory',
    paths: [
      { d: 'M -50 450 C 150 400, 300 350, 500 280 S 800 150, 1100 100 C 1400 50, 1700 30, 2050 20', stroke: '#a0a0a0', width: 2.5 }
    ]
  },
  {
    id: 'path-03',
    name: 'Gentle Wave',
    category: 'Single Line',
    desc: 'Subtle undulating path',
    paths: [
      { d: 'M -50 250 C 200 200, 400 300, 600 250 S 900 150, 1100 200 C 1300 250, 1500 180, 1700 220 S 1900 180, 2050 200', stroke: '#b5b5b5', width: 2 }
    ]
  },
  {
    id: 'path-04',
    name: 'Deep Wave',
    category: 'Single Line',
    desc: 'Pronounced wave motion',
    paths: [
      { d: 'M -50 300 C 150 150, 350 400, 550 250 S 850 50, 1050 300 C 1250 450, 1450 100, 1650 250 S 1900 350, 2050 200', stroke: '#a8a8a8', width: 3 }
    ]
  },
  {
    id: 'path-05',
    name: 'S-Curve Classic',
    category: 'Single Line',
    desc: 'Elegant S-shaped trajectory',
    paths: [
      { d: 'M -50 400 C 200 400, 400 100, 700 150 S 1000 400, 1300 350 C 1500 300, 1700 100, 2050 120', stroke: '#b0b0b0', width: 2 }
    ]
  },
  {
    id: 'path-06',
    name: 'Horizontal Drift',
    category: 'Single Line',
    desc: 'Nearly horizontal with slight variation',
    paths: [
      { d: 'M -50 250 C 300 240, 600 260, 900 245 S 1200 255, 1500 240 C 1700 235, 1900 250, 2050 245', stroke: '#c0c0c0', width: 1.5 }
    ]
  },
  {
    id: 'path-07',
    name: 'Diagonal Slice',
    category: 'Single Line',
    desc: 'Clean diagonal from bottom-left to top-right',
    paths: [
      { d: 'M -50 480 L 2050 20', stroke: '#a5a5a5', width: 2 }
    ]
  },
  {
    id: 'path-08',
    name: 'Curved Diagonal',
    category: 'Single Line',
    desc: 'Smooth curved diagonal',
    paths: [
      { d: 'M -50 480 Q 500 400, 1000 250 T 2050 20', stroke: '#b0b0b0', width: 2.5 }
    ]
  },
  {
    id: 'path-09',
    name: 'Double Parallel',
    category: 'Multi Line',
    desc: 'Two parallel ascending lines',
    paths: [
      { d: 'M -50 420 C 300 380, 700 280, 1100 200 S 1600 120, 2050 80', stroke: '#b5b5b5', width: 2 },
      { d: 'M -50 480 C 300 440, 700 340, 1100 260 S 1600 180, 2050 140', stroke: '#c5c5c5', width: 1.5 }
    ]
  },
  {
    id: 'path-10',
    name: 'Converging Lines',
    category: 'Multi Line',
    desc: 'Two lines that converge toward the right',
    paths: [
      { d: 'M -50 350 C 400 300, 800 200, 1200 150 S 1700 100, 2050 100', stroke: '#a8a8a8', width: 2 },
      { d: 'M -50 450 C 400 400, 800 300, 1200 200 S 1700 120, 2050 110', stroke: '#b8b8b8', width: 2 }
    ]
  },
  {
    id: 'path-11',
    name: 'Diverging Lines',
    category: 'Multi Line',
    desc: 'Two lines that spread apart',
    paths: [
      { d: 'M -50 280 C 300 280, 700 200, 1100 100 S 1600 50, 2050 30', stroke: '#b0b0b0', width: 2 },
      { d: 'M -50 320 C 300 320, 700 350, 1100 400 S 1600 450, 2050 470', stroke: '#c0c0c0', width: 2 }
    ]
  },
  {
    id: 'path-12',
    name: 'Triple Stack',
    category: 'Multi Line',
    desc: 'Three parallel ascending lines',
    paths: [
      { d: 'M -50 380 C 400 340, 900 240, 1400 160 S 1800 100, 2050 80', stroke: '#a0a0a0', width: 2 },
      { d: 'M -50 420 C 400 380, 900 280, 1400 200 S 1800 140, 2050 120', stroke: '#b0b0b0', width: 1.5 },
      { d: 'M -50 460 C 400 420, 900 320, 1400 240 S 1800 180, 2050 160', stroke: '#c0c0c0', width: 1 }
    ]
  },
  {
    id: 'path-13',
    name: 'Crossing Waves',
    category: 'Multi Line',
    desc: 'Two waves that interweave',
    paths: [
      { d: 'M -50 350 C 200 200, 500 400, 800 250 S 1200 100, 1500 250 C 1700 350, 1900 150, 2050 200', stroke: '#a8a8a8', width: 2 },
      { d: 'M -50 250 C 200 400, 500 200, 800 350 S 1200 400, 1500 250 C 1700 150, 1900 350, 2050 300', stroke: '#b8b8b8', width: 2 }
    ]
  },
  {
    id: 'path-14',
    name: 'Thick Accent',
    category: 'Single Line',
    desc: 'Bold thick line ascending',
    paths: [
      { d: 'M -50 450 C 300 400, 700 300, 1100 220 S 1600 120, 2050 80', stroke: '#999999', width: 5 }
    ]
  },
  {
    id: 'path-15',
    name: 'Hairline Trace',
    category: 'Single Line',
    desc: 'Delicate thin line',
    paths: [
      { d: 'M -50 420 C 250 380, 600 280, 950 200 S 1400 120, 1750 90 C 1900 70, 2000 60, 2050 50', stroke: '#b5b5b5', width: 1 }
    ]
  },
  {
    id: 'path-16',
    name: 'Swooping Arc',
    category: 'Single Line',
    desc: 'Large sweeping arc',
    paths: [
      { d: 'M -50 200 C 300 450, 800 480, 1200 350 S 1700 100, 2050 50', stroke: '#a5a5a5', width: 2.5 }
    ]
  },
  {
    id: 'path-17',
    name: 'Inverse Arc',
    category: 'Single Line',
    desc: 'Arc that dips then rises',
    paths: [
      { d: 'M -50 150 C 300 50, 700 400, 1100 450 S 1500 400, 1800 200 C 1900 100, 2000 50, 2050 30', stroke: '#b0b0b0', width: 2 }
    ]
  },
  {
    id: 'path-18',
    name: 'Stepped Ascent',
    category: 'Single Line',
    desc: 'Plateau-style climbing path',
    paths: [
      { d: 'M -50 450 C 100 450, 200 400, 400 400 S 600 400, 700 300 C 800 300, 1000 300, 1100 200 S 1400 200, 1500 100 C 1700 100, 1900 100, 2050 50', stroke: '#a8a8a8', width: 2 }
    ]
  },
  {
    id: 'path-19',
    name: 'Triple Wave',
    category: 'Multi Line',
    desc: 'Three offset wave lines',
    paths: [
      { d: 'M -50 200 C 200 150, 400 250, 600 200 S 900 100, 1100 150 C 1300 200, 1500 100, 1700 150 S 1900 100, 2050 120', stroke: '#a0a0a0', width: 2 },
      { d: 'M -50 280 C 200 230, 400 330, 600 280 S 900 180, 1100 230 C 1300 280, 1500 180, 1700 230 S 1900 180, 2050 200', stroke: '#b0b0b0', width: 1.5 },
      { d: 'M -50 360 C 200 310, 400 410, 600 360 S 900 260, 1100 310 C 1300 360, 1500 260, 1700 310 S 1900 260, 2050 280', stroke: '#c0c0c0', width: 1 }
    ]
  },
  {
    id: 'path-20',
    name: 'Flight Path',
    category: 'Multi Line',
    desc: 'Main line with trailing accent',
    paths: [
      { d: 'M -50 400 C 200 350, 500 250, 800 200 S 1200 120, 1500 100 C 1700 80, 1900 60, 2050 50', stroke: '#a0a0a0', width: 3 },
      { d: 'M -50 420 C 180 380, 480 290, 780 240 S 1180 160, 1480 140 C 1680 120, 1880 100, 2050 90', stroke: '#c8c8c8', width: 1, dashArray: '4 6' }
    ]
  }
];

// ============================================
// PATH PREVIEW COMPONENT
// ============================================

function PathPreview({ variation, progress }) {
  return (
    <svg
      className="path-preview__svg"
      viewBox="0 0 2000 500"
      preserveAspectRatio="none"
      fill="none"
    >
      {variation.paths.map((path, idx) => (
        <g key={idx}>
          {/* Guide path */}
          <path
            d={path.d}
            stroke="rgba(180, 180, 180, 0.15)"
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeDasharray="6 10"
            fill="none"
          />
          {/* Animated path */}
          <motion.path
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeDasharray={path.dashArray || 'none'}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        </g>
      ))}
    </svg>
  );
}

// ============================================
// MAIN PICKER COMPONENT
// ============================================

function HeroPathPicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const currentPath = PATH_VARIATIONS[currentIndex];

  // Simulate scroll progress with slider
  const handleProgressChange = (e) => {
    setScrollProgress(parseFloat(e.target.value));
  };

  // Navigation
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % PATH_VARIATIONS.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + PATH_VARIATIONS.length) % PATH_VARIATIONS.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'f' || e.key === 'F') toggleFavorite();
      if (e.key === 'm' || e.key === 'M') setIsMinimized((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Favorites
  const isFavorite = favorites.includes(currentPath.id);
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites((prev) => prev.filter((id) => id !== currentPath.id));
    } else {
      setFavorites((prev) => [...prev, currentPath.id]);
    }
  };

  const copyFavorites = () => {
    const text = favorites.join('\n');
    navigator.clipboard.writeText(text);
    alert(`Copied ${favorites.length} favorites to clipboard!`);
  };

  return (
    <div className="path-picker-page">
      {/* Preview Area */}
      <div className="path-preview">
        <div className="path-preview__bg">
          <PathPreview variation={currentPath} progress={scrollProgress} />
        </div>

        <div className="path-preview__info">
          <span className="path-preview__category">{currentPath.category}</span>
          <h1 className="path-preview__name">{currentPath.name}</h1>
          <p className="path-preview__desc">{currentPath.desc}</p>
          <code className="path-preview__id">{currentPath.id}</code>
        </div>

        {/* Progress Slider */}
        <div className="path-preview__slider">
          <label>Scroll Progress: {Math.round(scrollProgress * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={scrollProgress}
            onChange={handleProgressChange}
          />
        </div>
      </div>

      {/* Picker Controls */}
      <div className={`path-picker ${isMinimized ? 'minimized' : ''}`}>
        <div className="path-picker__collapsed" onClick={() => setIsMinimized(false)}>
          <span>{currentPath.name}</span>
          <span>{currentIndex + 1} / {PATH_VARIATIONS.length}</span>
        </div>

        <div className="path-picker__main">
          <div className="path-picker__header">
            <h3>Hero Path Picker</h3>
            <button onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="path-picker__nav">
            <button onClick={goPrev}>←</button>
            <div className="path-picker__info">
              <span className="path-picker__counter">{currentIndex + 1} / {PATH_VARIATIONS.length}</span>
              <span className="path-picker__cat">{currentPath.category}</span>
              <h4>{currentPath.name}</h4>
              <p>{currentPath.desc}</p>
            </div>
            <button onClick={goNext}>→</button>
            <button className={`path-picker__fav ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
              {isFavorite ? '★' : '☆'}
            </button>
          </div>

          <div className="path-picker__grid">
            {PATH_VARIATIONS.map((v, idx) => (
              <button
                key={v.id}
                className={`path-picker__thumb ${idx === currentIndex ? 'active' : ''} ${favorites.includes(v.id) ? 'fav' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                title={v.name}
              >
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  {v.paths.map((p, i) => (
                    <path
                      key={i}
                      d={p.d.replace(/(\d+)/g, (m) => parseFloat(m) / 20)}
                      stroke="#888"
                      strokeWidth={0.5}
                      fill="none"
                    />
                  ))}
                </svg>
                <span>{idx + 1}</span>
              </button>
            ))}
          </div>

          <div className="path-picker__footer">
            <button onClick={copyFavorites}>
              📋 Copy ({favorites.length})
            </button>
            <div className="path-picker__hints">
              <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
              <span><kbd>F</kbd> Fav</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .path-picker-page {
          min-height: 100vh;
          background: #faf9f6;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }

        /* Preview */
        .path-preview {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 2rem;
        }

        .path-preview__bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding-bottom: 10%;
        }

        .path-preview__svg {
          width: 100%;
          height: 40%;
        }

        .path-preview__info {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-bottom: 2rem;
        }

        .path-preview__category {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #888;
          background: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .path-preview__name {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }

        .path-preview__desc {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 1rem;
        }

        .path-preview__id {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #999;
          background: #f0f0f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .path-preview__slider {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .path-preview__slider label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #666;
        }

        .path-preview__slider input {
          width: 300px;
          cursor: pointer;
        }

        /* Picker */
        .path-picker {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 500px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .path-picker.minimized {
          transform: translateY(calc(100% - 44px));
        }

        .path-picker__collapsed {
          display: none;
          height: 44px;
          background: #1a1a1a;
          border-radius: 16px 16px 0 0;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
        }

        .path-picker.minimized .path-picker__collapsed {
          display: flex;
        }

        .path-picker.minimized .path-picker__main {
          display: none;
        }

        .path-picker__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        .path-picker__header h3 {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
        }

        .path-picker__header button {
          width: 28px;
          height: 28px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
        }

        .path-picker__nav {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          position: relative;
        }

        .path-picker__nav > button:first-child,
        .path-picker__nav > button:nth-child(3) {
          width: 36px;
          height: 36px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .path-picker__nav > button:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .path-picker__info {
          flex: 1;
          text-align: center;
        }

        .path-picker__counter {
          font-size: 10px;
          color: #999;
        }

        .path-picker__cat {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #e04a2f;
          margin-bottom: 4px;
        }

        .path-picker__info h4 {
          font-size: 14px;
          margin: 4px 0;
        }

        .path-picker__info p {
          font-size: 11px;
          color: #666;
          margin: 0;
        }

        .path-picker__fav {
          width: 36px;
          height: 36px;
          border: 2px solid #e5e5e5;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .path-picker__fav:hover {
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .path-picker__fav.active {
          background: #f59e0b;
          border-color: #f59e0b;
          color: #fff;
        }

        .path-picker__grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 6px;
          padding: 0 16px 16px;
        }

        .path-picker__thumb {
          aspect-ratio: 2/1;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          padding: 4px;
          transition: all 0.15s;
        }

        .path-picker__thumb svg {
          width: 100%;
          height: 100%;
        }

        .path-picker__thumb span {
          position: absolute;
          bottom: 2px;
          right: 4px;
          font-size: 8px;
          color: #999;
        }

        .path-picker__thumb:hover {
          border-color: #1a1a1a;
        }

        .path-picker__thumb.active {
          border-color: #1a1a1a;
          background: #1a1a1a;
        }

        .path-picker__thumb.active svg path {
          stroke: #fff;
        }

        .path-picker__thumb.active span {
          color: #fff;
        }

        .path-picker__thumb.fav::before {
          content: '★';
          position: absolute;
          top: 2px;
          left: 4px;
          font-size: 8px;
          color: #f59e0b;
        }

        .path-picker__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f5f5f5;
          border-radius: 0 0 16px 16px;
        }

        .path-picker__footer button {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 500;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .path-picker__hints {
          display: flex;
          gap: 12px;
          font-size: 10px;
          color: #999;
        }

        .path-picker__hints kbd {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 1px 4px;
          font-size: 9px;
        }

        @media (max-width: 600px) {
          .path-picker {
            left: 10px;
            right: 10px;
            width: auto;
          }

          .path-picker__grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default HeroPathPicker;
