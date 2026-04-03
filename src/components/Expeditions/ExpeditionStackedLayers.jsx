/**
 * ExpeditionStackedLayers
 *
 * Card layers showing expedition destinations grouped by range.
 * Cards displayed side by side with hover effects.
 *
 * Props:
 * - layers: Array of layer objects (optional, uses defaults)
 */

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const defaultLayers = [
  { name: 'SHORT RANGE', color: '#22c55e', dests: ['ALPS', 'NORWAY'], range: '< 1,000 nm' },
  { name: 'MEDIUM RANGE', color: '#eab308', dests: ['ICELAND', 'MOROCCO'], range: '1,000 - 2,000 nm' },
  { name: 'LONG RANGE', color: '#ef4444', dests: ['ARCTIC', 'GREENLAND', 'BAHAMAS', 'COSTA RICA'], range: '> 2,000 nm' },
];

function ExpeditionStackedLayers({ layers = defaultLayers }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeLayer, setActiveLayer] = useState(null);

  return (
    <section className="exp-stacked" ref={ref}>
      <div className="exp-stacked__container">
        <motion.div
          className="exp-stacked__header"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="exp-stacked__title">EXPEDITION RANGES</h2>
          <p className="exp-stacked__subtitle">From Denham Aerodrome</p>
        </motion.div>

        <div className="exp-stacked__grid">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.name}
              className={`exp-stacked__layer ${activeLayer === i ? 'active' : ''}`}
              style={{ background: layer.color }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
              whileHover={{ y: -8, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}
            >
              <div className="exp-stacked__layer-header">
                <span className="exp-stacked__layer-name">{layer.name}</span>
                <span className="exp-stacked__layer-range">{layer.range}</span>
              </div>
              <div className="exp-stacked__layer-count">
                {layer.dests.length} destinations
              </div>
              <div className="exp-stacked__layer-dests">
                {layer.dests.map(d => (
                  <span key={d} className="exp-stacked__dest">{d}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="exp-stacked__cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a href="/expeditions" className="exp-stacked__cta-btn">
            Explore All Expeditions →
          </a>
        </motion.div>
      </div>

      <style>{`
        .exp-stacked {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #1a1a1a;
          padding: 4rem 2rem;
        }

        .exp-stacked__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .exp-stacked__header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .exp-stacked__title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .exp-stacked__subtitle {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .exp-stacked__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .exp-stacked__layer {
          padding: 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          flex-direction: column;
        }

        .exp-stacked__layer.active {
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        .exp-stacked__layer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }

        .exp-stacked__layer-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .exp-stacked__layer-range {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          background: rgba(0,0,0,0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .exp-stacked__layer-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1rem;
        }

        .exp-stacked__layer-dests {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }

        .exp-stacked__dest {
          background: rgba(255,255,255,0.2);
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #fff;
          font-weight: 500;
        }

        .exp-stacked__cta {
          margin-top: 2.5rem;
          text-align: center;
        }

        .exp-stacked__cta-btn {
          display: inline-block;
          padding: 0.85rem 2rem;
          background: #fff;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .exp-stacked__cta-btn:hover {
          background: #2563eb;
          color: #fff;
          transform: translateY(-2px);
        }

        @media (max-width: 800px) {
          .exp-stacked__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .exp-stacked__layer {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .exp-stacked {
            padding: 2rem 1rem;
          }

          .exp-stacked__layer {
            padding: 1.25rem;
          }

          .exp-stacked__layer-name {
            font-size: 1rem;
          }

          .exp-stacked__dest {
            font-size: 0.75rem;
            padding: 0.25rem 0.6rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionStackedLayers;
