/**
 * ExpeditionSplitFlap
 *
 * Classic split-flap airport display showing expedition destinations.
 * Auto-cycles through destinations with flip animation.
 *
 * Props:
 * - destinations: Array of destination objects (optional, uses defaults)
 * - cycleInterval: Time between destination changes in ms (default: 3000)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const defaultDestinations = [
  { id: 'arctic', name: 'Arctic', distance: '2,500 nm', direction: 'N' },
  { id: 'iceland', name: 'Iceland', distance: '1,200 nm', direction: 'NW' },
  { id: 'morocco', name: 'Morocco', distance: '1,100 nm', direction: 'S' },
  { id: 'norway', name: 'Norway', distance: '650 nm', direction: 'NE' },
  { id: 'alps', name: 'Alps', distance: '500 nm', direction: 'SE' },
  { id: 'greenland', name: 'Greenland', distance: '2,100 nm', direction: 'NW' },
  { id: 'bahamas', name: 'Bahamas', distance: '4,200 nm', direction: 'W' },
  { id: 'costa-rica', name: 'Costa Rica', distance: '5,100 nm', direction: 'SW' },
];

function ExpeditionSplitFlap({
  destinations = defaultDestinations,
  cycleInterval = 3000,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentDest, setCurrentDest] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentDest(prev => (prev + 1) % destinations.length);
    }, cycleInterval);
    return () => clearInterval(interval);
  }, [isInView, destinations.length, cycleInterval]);

  const dest = destinations[currentDest];

  return (
    <section className="exp-splitflap" ref={ref}>
      <div className="exp-splitflap__container">
        <div className="exp-splitflap__header">
          <span className="exp-splitflap__title">HQ AVIATION EXPEDITIONS</span>
          <span className="exp-splitflap__subtitle">DEPARTURES FROM DENHAM</span>
        </div>

        <div className="exp-splitflap__board">
          <div className="exp-splitflap__row">
            <span className="exp-splitflap__label">DESTINATION:</span>
            <div className="exp-splitflap__chars">
              {dest.name.toUpperCase().padEnd(12, ' ').split('').map((char, i) => (
                <motion.div
                  key={`${currentDest}-${i}`}
                  className="exp-splitflap__char"
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="exp-splitflap__row">
            <span className="exp-splitflap__label">DISTANCE:</span>
            <div className="exp-splitflap__chars">
              {dest.distance.padEnd(10, ' ').split('').map((char, i) => (
                <motion.div
                  key={`d-${currentDest}-${i}`}
                  className="exp-splitflap__char"
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.2 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="exp-splitflap__row">
            <span className="exp-splitflap__label">DIRECTION:</span>
            <div className="exp-splitflap__chars">
              {dest.direction.padEnd(4, ' ').split('').map((char, i) => (
                <motion.div
                  key={`dir-${currentDest}-${i}`}
                  className="exp-splitflap__char"
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.2 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="exp-splitflap__row">
            <span className="exp-splitflap__label">STATUS:</span>
            <div className="exp-splitflap__chars">
              {'READY'.padEnd(8, ' ').split('').map((char, i) => (
                <motion.div
                  key={`status-${i}`}
                  className="exp-splitflap__char exp-splitflap__char--status"
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.2 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="exp-splitflap__footer">
          <div className="exp-splitflap__counter">
            {currentDest + 1} / {destinations.length}
          </div>
          <a href="/expeditions" className="exp-splitflap__cta">
            View All Expeditions →
          </a>
        </div>
      </div>

      <style>{`
        .exp-splitflap {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #1a1a1a;
          padding: 4rem 2rem;
        }

        .exp-splitflap__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .exp-splitflap__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .exp-splitflap__title {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fbbf24;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }

        .exp-splitflap__subtitle {
          display: block;
          font-size: 0.8rem;
          color: #666;
          letter-spacing: 0.1em;
        }

        .exp-splitflap__board {
          background: #0a0a0a;
          padding: 2rem;
          border-radius: 8px;
          border: 4px solid #333;
        }

        .exp-splitflap__row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .exp-splitflap__row:last-child {
          margin-bottom: 0;
        }

        .exp-splitflap__label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #666;
          width: 110px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .exp-splitflap__chars {
          display: flex;
          gap: 3px;
        }

        .exp-splitflap__char {
          width: 32px;
          height: 48px;
          background: #1a1a1a;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          color: #fbbf24;
          perspective: 100px;
        }

        .exp-splitflap__char--status {
          color: #4ade80;
        }

        .exp-splitflap__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #333;
        }

        .exp-splitflap__counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #666;
        }

        .exp-splitflap__cta {
          font-size: 0.85rem;
          color: #fbbf24;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .exp-splitflap__cta:hover {
          color: #fff;
        }

        @media (max-width: 600px) {
          .exp-splitflap {
            padding: 2rem 1rem;
          }

          .exp-splitflap__board {
            padding: 1.5rem 1rem;
          }

          .exp-splitflap__row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .exp-splitflap__label {
            width: auto;
          }

          .exp-splitflap__char {
            width: 24px;
            height: 36px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionSplitFlap;
