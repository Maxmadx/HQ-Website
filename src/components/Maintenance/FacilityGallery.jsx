/**
 * FACILITY GALLERY
 *
 * Minimal dark gallery with scrolling carousel.
 * Brand: Space Grotesk, Share Tech Mono, #1a1a1a, #faf9f6
 */

import React from 'react';
import { motion } from 'framer-motion';
import { usePageImages } from '../../hooks/usePageImages';

const facilityImages = [
  { id: 1, src: '/assets/images/facility/hangar-main.jpg', alt: 'Main Hangar' },
  { id: 2, src: '/assets/images/facility/workshop.jpg', alt: 'Workshop' },
  { id: 3, src: '/assets/images/facility/engine-bay.jpg', alt: 'Engine Bay' },
  { id: 4, src: '/assets/images/facility/avionics-lab.jpg', alt: 'Avionics Lab' },
  { id: 5, src: '/assets/images/facility/paint-booth.jpg', alt: 'Paint Booth' },
  { id: 6, src: '/assets/images/facility/parts-storage.jpg', alt: 'Parts Storage' },
];

const carouselImages = [
  '/assets/images/facility/carousel/img-01.jpg',
  '/assets/images/facility/carousel/img-02.jpg',
  '/assets/images/facility/carousel/img-03.jpg',
  '/assets/images/facility/carousel/img-04.jpg',
  '/assets/images/facility/carousel/img-05.jpg',
  '/assets/images/facility/carousel/img-06.jpg',
  '/assets/images/facility/carousel/img-07.jpg',
  '/assets/images/facility/carousel/img-08.jpg',
  '/assets/images/facility/carousel/img-09.jpg',
  '/assets/images/facility/carousel/img-10.jpg',
];

const FacilityGallery = ({ carouselOnly = false }) => {
  const pageImages = usePageImages('maintenance');
  return (
    <section className="fgal">
      {!carouselOnly && (
        <div className="fgal__main">
          <div className="fgal__inner">
            <div className="fgal__intro">
              <h2>Our Facility</h2>
              <div className="fgal__line"></div>
            </div>
            <div className="fgal__grid" data-cms-section="maintenance-facility-gallery">
              {facilityImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  className="fgal__item"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="fgal__img">
                    <img src={pageImages['maintenance-facility-gallery']?.[i]?.url || img.src} alt={img.alt} width={800} height={600} loading="lazy" />
                  </div>
                  <span>{img.alt}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Carousel Strip - Right to Left */}
      <div className="fgal__carousel">
        <div className="fgal__carousel-track">
          <div className="fgal__carousel-slides">
            {[...carouselImages, ...carouselImages].map((src, i) => (
              <div key={i} className="fgal__carousel-slide">
                <img src={src} alt="" width={400} height={300} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Strip - Left to Right */}
      <div className="fgal__carousel fgal__carousel--reverse">
        <div className="fgal__carousel-track">
          <div className="fgal__carousel-slides fgal__carousel-slides--reverse">
            {[...carouselImages.slice().reverse(), ...carouselImages.slice().reverse()].map((src, i) => (
              <div key={i} className="fgal__carousel-slide">
                <img src={src} alt="" width={400} height={300} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .fgal {
          background: #0f0f0f;
        }

        .fgal__main {
          padding: 6rem 2rem 4rem;
        }

        .fgal__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .fgal__intro {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .fgal__intro h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          margin: 0;
          white-space: nowrap;
        }

        .fgal__line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.15);
        }

        .fgal__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.1);
        }

        .fgal__item {
          background: #0f0f0f;
          padding: 1rem;
        }

        .fgal__img {
          aspect-ratio: 4/3;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .fgal__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          opacity: 0.8;
          transition: all 0.5s ease;
        }

        .fgal__item:hover .fgal__img img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.03);
        }

        .fgal__item span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          transition: color 0.3s ease;
        }

        .fgal__item:hover span {
          color: #fff;
        }

        /* Carousel */
        .fgal__carousel {
          padding: 1rem 0;
          overflow: hidden;
        }

        .fgal__carousel:first-of-type {
          padding-top: 2rem;
        }

        .fgal__carousel:last-of-type {
          padding-bottom: 4rem;
        }

        .fgal__carousel-track {
          width: 100%;
        }

        .fgal__carousel-slides {
          display: flex;
          gap: 0.5rem;
          animation: carouselScroll 40s linear infinite;
        }

        .fgal__carousel-slides--reverse {
          animation: carouselScrollReverse 35s linear infinite;
        }

        .fgal__carousel-slides:hover {
          animation-play-state: paused;
        }

        @keyframes carouselScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes carouselScrollReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .fgal__carousel-slide {
          flex-shrink: 0;
          width: 200px;
          height: 140px;
          overflow: hidden;
        }

        .fgal__carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          opacity: 0.6;
          transition: all 0.4s ease;
        }

        .fgal__carousel-slide:hover img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }

        @media (max-width: 900px) {
          .fgal__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .fgal__grid {
            grid-template-columns: 1fr;
          }

          .fgal__carousel-slide {
            width: 150px;
            height: 100px;
          }
        }
      `}</style>
    </section>
  );
};

export default FacilityGallery;
