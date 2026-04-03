/**
 * TrainingSummary - Displays training hours and pricing at a glance
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Animated counter
function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Reveal animation wrapper
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TrainingSummary() {
  return (
    <section className="training-summary">
      <div className="training-summary__container">
        <Reveal>
          <div className="training-summary__header">
            <span className="training-summary__pre-text">At a Glance</span>
            <h2>
              <span className="training-summary__text--dark">Training</span>{' '}
              <span className="training-summary__text--mid">Summary</span>
            </h2>
            <p className="training-summary__desc">
              Your practical training begins with basic handling and progresses through hovering, circuits, and cross-country navigation.
              After completing your solo flights and building confidence, you'll take your Skills Test with an examiner—a practical
              flight demonstrating everything you've learned.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="training-summary__grid">
            {/* Hours Summary */}
            <div className="training-summary__block">
              <span className="training-summary__label">Minimum Training Hours</span>
              <div className="training-summary__hours">
                <div className="training-summary__hour-item">
                  <span className="training-summary__hour-val"><AnimatedNumber value="25" /></span>
                  <span className="training-summary__hour-label">Dual</span>
                </div>
                <span className="training-summary__hour-plus">+</span>
                <div className="training-summary__hour-item">
                  <span className="training-summary__hour-val"><AnimatedNumber value="10" /></span>
                  <span className="training-summary__hour-label">Solo</span>
                </div>
                <span className="training-summary__hour-plus">+</span>
                <div className="training-summary__hour-item">
                  <span className="training-summary__hour-val"><AnimatedNumber value="10" /></span>
                  <span className="training-summary__hour-label">X-Country</span>
                </div>
                <span className="training-summary__hour-eq">=</span>
                <div className="training-summary__hour-item training-summary__hour-item--total">
                  <span className="training-summary__hour-val"><AnimatedNumber value="45" /></span>
                  <span className="training-summary__hour-label">Minimum</span>
                </div>
              </div>
            </div>

            <div className="training-summary__divider"></div>

            {/* Rates Summary */}
            <div className="training-summary__block">
              <span className="training-summary__label">Transparent Pricing</span>
              <p className="training-summary__subtitle">Clear, honest pricing with no hidden fees</p>
              <div className="training-summary__rates">
                <div className="training-summary__rate">
                  <span className="training-summary__rate-aircraft">R22</span>
                  <span className="training-summary__rate-price">£275<small>/hr</small></span>
                </div>
                <div className="training-summary__rate-divider"></div>
                <div className="training-summary__rate">
                  <span className="training-summary__rate-aircraft">R44</span>
                  <span className="training-summary__rate-price">£395<small>/hr</small></span>
                </div>
                <div className="training-summary__rate-divider"></div>
                <div className="training-summary__rate">
                  <span className="training-summary__rate-aircraft">R66</span>
                  <span className="training-summary__rate-price">£595<small>/hr</small></span>
                </div>
              </div>
              <span className="training-summary__vat">*All prices exclude VAT · Block booking discounts available</span>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .training-summary {
          background: #fff;
          padding: 3rem 2rem 0;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }

        .training-summary__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .training-summary__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .training-summary__header h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .training-summary__desc {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto;
        }

        .training-summary__pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .training-summary__text--dark { color: #1a1a1a; }
        .training-summary__text--mid { color: #4a4a4a; }

        .training-summary__grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .training-summary__block {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .training-summary__divider {
          width: 1px;
          height: 80px;
          background: #e8e6e2;
          flex-shrink: 0;
        }

        .training-summary__label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 1rem;
        }

        .training-summary__hours {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .training-summary__hour-item {
          text-align: center;
        }

        .training-summary__hour-val {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .training-summary__hour-label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-top: 0.25rem;
        }

        .training-summary__hour-plus,
        .training-summary__hour-eq {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: #ccc;
        }

        .training-summary__hour-item--total .training-summary__hour-val {
          color: #2563eb;
          font-size: 1.75rem;
        }

        .training-summary__rates {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .training-summary__rate {
          text-align: center;
        }

        .training-summary__rate-aircraft {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .training-summary__rate-price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .training-summary__rate-price small {
          font-size: 0.7rem;
          font-weight: 400;
          color: #999;
        }

        .training-summary__rate-divider {
          width: 1px;
          height: 30px;
          background: #e8e6e2;
        }

        .training-summary__subtitle {
          font-size: 0.8rem;
          color: #888;
          margin: -0.5rem 0 1rem;
        }

        .training-summary__vat {
          display: block;
          font-size: 0.7rem;
          color: #999;
          margin-top: 0.75rem;
          font-style: italic;
        }

        @media (max-width: 480px) {
          .training-summary__grid {
            flex-direction: column;
            gap: 2rem;
          }

          .training-summary__hours {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .training-summary__rates {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .training-summary__rate-divider {
            display: none;
          }

          .training-summary__divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

export default TrainingSummary;
