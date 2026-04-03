/**
 * ExpeditionPassportStamps
 *
 * Passport page with visa-style stamps for each expedition destination.
 * Features animated stamp reveals with rotation effects.
 *
 * Props:
 * - stamps: Array of stamp objects (optional, uses defaults if not provided)
 * - title: Header title (default: "EXPEDITION RECORD")
 * - subtitle: Header subtitle (default: "HQ AVIATION • DENHAM")
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const defaultStamps = [
  { label: 'ARCTIC', date: '15 MAR 2022', shape: 'circle', color: '#1e40af' },
  { label: 'ICELAND', date: '22 JUN 2019', shape: 'rect', color: '#166534' },
  { label: 'MOROCCO', date: '08 NOV 2021', shape: 'circle', color: '#b45309' },
  { label: 'NORWAY', date: '03 FEB 2018', shape: 'rect', color: '#7c2d12' },
  { label: 'ALPS', date: '19 SEP 2020', shape: 'circle', color: '#4c1d95' },
  { label: 'GREENLAND', date: '11 JUL 2023', shape: 'rect', color: '#0f766e' },
  { label: 'BAHAMAS', date: '25 DEC 2024', shape: 'circle', color: '#9f1239' },
  { label: 'COSTA RICA', date: '30 APR 2025', shape: 'rect', color: '#065f46' },
];

function ExpeditionPassportStamps({
  stamps = defaultStamps,
  title = 'EXPEDITION RECORD',
  subtitle = 'HQ AVIATION • DENHAM',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Generate random rotation for each stamp
  const getRandomRotation = (index) => {
    const seed = index * 7;
    return ((seed % 30) - 15);
  };

  return (
    <section className="exp-passport" ref={ref}>
      <div className="exp-passport__container">
        <div className="exp-passport__page">
          {/* Header */}
          <motion.div
            className="exp-passport__header"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="exp-passport__title">{title}</span>
            <span className="exp-passport__subtitle">{subtitle}</span>
          </motion.div>

          {/* Stamps grid */}
          <div className="exp-passport__stamps">
            {stamps.map((stamp, i) => (
              <motion.div
                key={stamp.label}
                className={`exp-passport__stamp exp-passport__stamp--${stamp.shape}`}
                style={{
                  '--stamp-color': stamp.color,
                  '--stamp-rotate': `${getRandomRotation(i)}deg`,
                }}
                initial={{ scale: 2, opacity: 0, rotate: -45 }}
                animate={isInView ? {
                  scale: 1,
                  opacity: 0.85,
                  rotate: getRandomRotation(i)
                } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.12 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
              >
                <span className="exp-passport__stamp-dest">{stamp.label}</span>
                <span className="exp-passport__stamp-date">{stamp.date}</span>
                <span className="exp-passport__stamp-approved">✓ CLEARED</span>
              </motion.div>
            ))}
          </div>

          {/* Join CTA */}
          <motion.div
            className="exp-passport__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <span className="exp-passport__cta-text">Join The our next trip to appear on the HQ passport</span>
            <a href="/expeditions" className="exp-passport__cta-btn">
              View Expeditions →
            </a>
          </motion.div>

          {/* Page decorations */}
          <div className="exp-passport__watermark">HQ</div>
          <div className="exp-passport__page-num">PAGE 1</div>
        </div>
      </div>

      <style>{`
        .exp-passport {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: linear-gradient(135deg, #f5f5dc 0%, #e8e4d4 100%);
          padding: 4rem 2rem;
        }

        .exp-passport__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .exp-passport__page {
          background: #fffef5;
          border: 1px solid #d4c5a9;
          padding: 2rem;
          min-height: 500px;
          position: relative;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.05),
            0 10px 40px rgba(0,0,0,0.1);
        }

        .exp-passport__page::before {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px solid #e8e0d0;
          pointer-events: none;
        }

        .exp-passport__header {
          text-align: center;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e8e0d0;
          margin-bottom: 2rem;
        }

        .exp-passport__title {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .exp-passport__subtitle {
          display: block;
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.5rem;
          letter-spacing: 0.15em;
        }

        .exp-passport__stamps {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          padding: 1rem;
        }

        .exp-passport__stamp {
          padding: 1.25rem;
          border: 4px solid var(--stamp-color);
          color: var(--stamp-color);
          text-align: center;
          transform: rotate(var(--stamp-rotate));
          cursor: pointer;
          transition: transform 0.2s ease;
          position: relative;
        }

        .exp-passport__stamp::before {
          content: '';
          position: absolute;
          inset: 4px;
          border: 1px dashed var(--stamp-color);
          opacity: 0.5;
          border-radius: inherit;
        }

        .exp-passport__stamp--circle {
          border-radius: 50%;
          width: 110px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .exp-passport__stamp--circle::before {
          border-radius: 50%;
        }

        .exp-passport__stamp--rect {
          border-radius: 4px;
          min-width: 100px;
        }

        .exp-passport__stamp-dest {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .exp-passport__stamp-date {
          display: block;
          font-size: 0.65rem;
          margin: 0.35rem 0;
          font-family: 'Share Tech Mono', monospace;
        }

        .exp-passport__stamp-approved {
          display: block;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .exp-passport__watermark {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          font-size: 4rem;
          font-weight: 700;
          color: rgba(0,0,0,0.03);
          pointer-events: none;
          font-family: 'Share Tech Mono', monospace;
        }

        .exp-passport__page-num {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.65rem;
          color: #bbb;
          letter-spacing: 0.2em;
        }

        .exp-passport__cta {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px dashed #d4c5a9;
          text-align: center;
        }

        .exp-passport__cta-text {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          font-style: italic;
          font-family: 'Georgia', serif;
          margin-bottom: 1rem;
        }

        .exp-passport__cta-btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: #1a1a1a;
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .exp-passport__cta-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }

        @media (max-width: 600px) {
          .exp-passport {
            padding: 2rem 1rem;
          }

          .exp-passport__page {
            padding: 1.5rem;
          }

          .exp-passport__stamps {
            gap: 1rem;
          }

          .exp-passport__stamp--circle {
            width: 90px;
            height: 90px;
          }

          .exp-passport__stamp-dest {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionPassportStamps;
