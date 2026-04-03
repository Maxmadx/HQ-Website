/**
 * ExpeditionDepartureBoard
 *
 * Airport-style departure board showing HQ Aviation expedition destinations.
 * Features animated row reveals and status badges.
 *
 * Props:
 * - flights: Array of flight objects (optional, uses defaults if not provided)
 * - title: Board title (default: "HQ AVIATION EXPEDITIONS")
 * - origin: Origin text (default: "DEPARTURES FROM DENHAM")
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const defaultFlights = [
  { code: 'HQ-001', dest: 'ARCTIC', status: 'COMPLETED', distance: '2,500nm', year: '2022' },
  { code: 'HQ-002', dest: 'ICELAND', status: 'COMPLETED', distance: '1,200nm', year: '2019' },
  { code: 'HQ-003', dest: 'MOROCCO', status: 'COMPLETED', distance: '1,100nm', year: '2021' },
  { code: 'HQ-004', dest: 'NORWAY', status: 'COMPLETED', distance: '650nm', year: '2018' },
  { code: 'HQ-005', dest: 'ALPS', status: 'COMPLETED', distance: '500nm', year: '2020' },
  { code: 'HQ-006', dest: 'GREENLAND', status: 'COMPLETED', distance: '2,100nm', year: '2023' },
  { code: 'HQ-007', dest: 'BAHAMAS', status: 'UPCOMING', distance: '4,200nm', year: '2025' },
  { code: 'HQ-008', dest: 'COSTA RICA', status: 'UPCOMING', distance: '5,100nm', year: '2026' },
  { code: 'HQ-009', dest: 'PATAGONIA', status: 'UPCOMING', distance: '7,800nm', year: '2027' },
];

function ExpeditionDepartureBoard({
  flights = defaultFlights,
  title = 'HQ AVIATION EXPEDITIONS',
  origin = 'DEPARTURES FROM DENHAM',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="exp-board" ref={ref}>
      <div className="exp-board__container">
        <div className="exp-board__screen">
          <img
            src="/assets/images/icons/r66-icon-yellow.svg"
            alt=""
            className="exp-board__heli"
          />
          {/* Header */}
          <div className="exp-board__header">
            <motion.span
              className="exp-board__title"
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.span>
            <motion.span
              className="exp-board__origin"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {origin}
            </motion.span>
          </div>

          {/* Column headers */}
          <div className="exp-board__cols">
            <span>FLIGHT</span>
            <span>DESTINATION</span>
            <span>DISTANCE</span>
            <span>STATUS</span>
          </div>

          {/* Flight rows */}
          <div className="exp-board__rows">
            {flights.map((flight, i) => (
              <motion.div
                key={flight.code}
                className="exp-board__row"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              >
                <span className="exp-board__code">{flight.code}</span>
                <span className="exp-board__dest">{flight.dest}</span>
                <span className="exp-board__dist">{flight.distance}</span>
                <span className={`exp-board__status exp-board__status--${flight.status.toLowerCase()}`}>
                  {flight.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Scan lines effect */}
          <div className="exp-board__scanlines" />
        </div>
      </div>

      <style>{`
        .exp-board {
          font-family: 'Share Tech Mono', monospace;
          background: #0a0a0a;
          padding: 4rem 2rem;
        }

        .exp-board__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .exp-board__screen {
          background: #0f0f0f;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 0 0 4px #1a1a1a,
            0 0 0 6px #0a0a0a,
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 0 100px rgba(0,0,0,0.3);
        }

        .exp-board__header {
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          padding: 1.5rem 2rem;
          text-align: center;
          border-bottom: 2px solid #2a2a2a;
        }

        .exp-board__title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: clamp(1rem, 3vw, 1.5rem);
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.15em;
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }

        .exp-board__heli {
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          height: 2.5rem;
          width: auto;
          z-index: 2;
        }

        .exp-board__origin {
          display: block;
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.5rem;
          letter-spacing: 0.1em;
        }

        .exp-board__cols {
          display: grid;
          grid-template-columns: 100px 1fr 120px 120px;
          padding: 1rem 2rem;
          background: #1a1a1a;
          font-size: 0.7rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-bottom: 1px solid #2a2a2a;
        }

        .exp-board__rows {
          padding: 0.5rem 0;
        }

        .exp-board__row {
          display: grid;
          grid-template-columns: 100px 1fr 120px 120px;
          padding: 1rem 2rem;
          border-bottom: 1px solid #1a1a1a;
          align-items: center;
          transition: background 0.3s ease;
        }

        .exp-board__row:hover {
          background: rgba(251, 191, 36, 0.05);
        }

        .exp-board__code {
          font-size: 0.9rem;
          color: #555;
        }

        .exp-board__dest {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        .exp-board__dist {
          font-size: 0.95rem;
          color: #888;
        }

        .exp-board__status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .exp-board__status--completed {
          background: rgba(22, 163, 74, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        .exp-board__status--scheduled {
          background: rgba(234, 179, 8, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .exp-board__status--boarding {
          background: rgba(251, 191, 36, 0.3);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.5);
          animation: boardingPulse 1.5s ease-in-out infinite;
        }

        @keyframes boardingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .exp-board__status--planning {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .exp-board__status--upcoming {
          background: rgba(168, 85, 247, 0.2);
          color: #c084fc;
          border: 1px solid rgba(192, 132, 252, 0.3);
        }

        .exp-board__status--cancelled {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
        }

        .exp-board__scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .exp-board {
            padding: 2rem 1rem;
          }

          .exp-board__cols,
          .exp-board__row {
            grid-template-columns: 70px 1fr 80px 90px;
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
          }

          .exp-board__dest {
            font-size: 0.95rem;
          }

          .exp-board__status {
            font-size: 0.65rem;
            padding: 0.3rem 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .exp-board__cols {
            grid-template-columns: 1fr 1fr;
          }

          .exp-board__cols span:nth-child(1),
          .exp-board__cols span:nth-child(3) {
            display: none;
          }

          .exp-board__row {
            grid-template-columns: 1fr auto;
            gap: 0.5rem;
          }

          .exp-board__code,
          .exp-board__dist {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionDepartureBoard;
