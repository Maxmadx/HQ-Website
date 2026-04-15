/**
 * Scrolling Strips Component
 *
 * Horizontal strips of images and text that move in opposite directions
 * as the user scrolls. Creates a dynamic parallax-like effect.
 *
 * Usage: <ScrollingStrips />
 *
 * Features:
 * - Images and destination text in alternating rows
 * - Scroll-driven horizontal movement (left/right)
 * - Sticky behavior when used with wrapper
 * - Grayscale images with hover color effect
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollingStrips = ({ sticky = true }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll to horizontal movement
  const xLeft = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  const destinations = [
    { text: '1hr to the Cotswolds', type: 'destination' },
    { text: 'HQ Flying Community', type: 'community' },
    { text: '3hrs to Scottish Highlands', type: 'destination' },
    { text: 'Isle of Wight 1hr', type: 'destination' },
    { text: 'Join the Adventure', type: 'community' },
    { text: '45min to Brighton', type: 'destination' },
    { text: 'Lake District 2hrs', type: 'destination' },
    { text: 'Cornwall 2.5hrs', type: 'destination' },
  ];

  const images = [
    '/assets/images/expeditions/antartica.jpg',
    '/assets/images/gallery/flying/flying-.jpg',
    '/assets/images/expeditions/channel.jpg',
    '/assets/images/facility/hq-aviation-robinsons.jpg',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/gallery/flying/foggy-evening-flying.jpg',
  ];

  return (
    <section
      className="scrolling-strips"
      ref={containerRef}
      style={sticky ? { position: 'sticky', top: '200px', zIndex: 50 } : {}}
    >
      <style>{`
        .scrolling-strips {
          background: #1a1a1a;
          padding: 1.5rem 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .scrolling-strips__row {
          display: flex;
          gap: 0.75rem;
          white-space: nowrap;
        }

        .scrolling-strips__row--text {
          gap: 2rem;
        }

        .scrolling-strips__image {
          flex-shrink: 0;
          width: 200px;
          height: 120px;
          border-radius: 6px;
          overflow: hidden;
        }

        .scrolling-strips__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(30%);
          transition: filter 0.3s ease;
        }

        .scrolling-strips__image:hover img {
          filter: grayscale(0%);
        }

        .scrolling-strips__text-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .scrolling-strips__bullet {
          font-size: 0.4rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .scrolling-strips__text-item span:last-child {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.7);
        }

        .scrolling-strips__text-item--community span:last-child {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          font-weight: 400;
        }

        .scrolling-strips__text-item--destination span:last-child {
          color: rgba(255, 255, 255, 0.85);
        }
      `}</style>

      {/* Strip 1 - Images moving left */}
      <motion.div className="scrolling-strips__row" style={{ x: xLeft }}>
        {[...images, ...images].map((img, i) => (
          <div key={i} className="scrolling-strips__image">
            <img src={img} alt="" />
          </div>
        ))}
      </motion.div>

      {/* Strip 2 - Text moving right */}
      <motion.div className="scrolling-strips__row scrolling-strips__row--text" style={{ x: xRight }}>
        {[...destinations, ...destinations].map((item, i) => (
          <div key={i} className={`scrolling-strips__text-item scrolling-strips__text-item--${item.type}`}>
            <span className="scrolling-strips__bullet">●</span>
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>

      {/* Strip 3 - Images moving right */}
      <motion.div className="scrolling-strips__row" style={{ x: xRight }}>
        {[...images.slice(3), ...images.slice(0, 3), ...images].map((img, i) => (
          <div key={i} className="scrolling-strips__image">
            <img src={img} alt="" />
          </div>
        ))}
      </motion.div>

      {/* Strip 4 - Text moving left */}
      <motion.div className="scrolling-strips__row scrolling-strips__row--text" style={{ x: xLeft }}>
        {[...destinations.slice(4), ...destinations.slice(0, 4), ...destinations].map((item, i) => (
          <div key={i} className={`scrolling-strips__text-item scrolling-strips__text-item--${item.type}`}>
            <span className="scrolling-strips__bullet">●</span>
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default ScrollingStrips;
