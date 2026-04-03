/**
 * ExpeditionVideoSlider
 *
 * YouTube video slider showcasing HQ Aviation expedition footage.
 * Features thumbnail navigation, arrow controls, and video descriptions.
 *
 * Props:
 * - videos: Array of video objects (optional, uses defaults if not provided)
 * - title: Header title (optional)
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const defaultVideos = [
  {
    videoUrl: 'https://youtu.be/ey2WYARj5bE',
    title: 'Greenland Mission (2025) Part II',
    desc: 'Exploring abandoned mining camps, crossing the ice cap to Dye 2 station, and reuniting with old friends in the vast Greenland landscape.'
  },
  {
    videoUrl: 'https://youtu.be/k4LQeSkGC4M',
    title: 'Keebird: High Arctic Adventure',
    desc: 'A journey to the extreme north of Greenland, landing at Keebird (85° North) in an R66 helicopter.'
  },
  {
    videoUrl: 'https://youtu.be/0UUUcngxr2k',
    title: 'Amicalement Votre!',
    desc: 'A scenic helicopter flight showcasing the beauty of aviation and friendship.'
  },
  {
    videoUrl: 'https://youtu.be/xO7RlObDdjM',
    title: 'Magical Mission in the Alps',
    desc: 'A magical mission flying through the breathtaking snow-covered peaks and valleys of the Alps.'
  },
  {
    videoUrl: 'https://youtu.be/gREwO1BDxXA',
    title: 'Fly',
    desc: 'An inspiring aerial journey capturing the pure freedom and beauty of helicopter flight.'
  },
  {
    videoUrl: 'https://youtu.be/hhpZMuz-sPg',
    title: 'Iceland 2016',
    desc: "A stunning visual tour of Iceland's dramatic landscapes, from glaciers to volcanoes, seen from above."
  },
  {
    videoUrl: 'https://youtu.be/Vm8MOmC90o4',
    title: '3 North Poles Expedition',
    desc: 'The epic "3 North Poles" expedition, featuring champagne on the ice and survival challenges in the freezing Arctic.'
  },
  {
    videoUrl: 'https://youtu.be/5gGSMw5BV34',
    title: 'Iceland to Scotland Cruise',
    desc: 'A transoceanic crossing in an R66 helicopter, navigating from the rugged coast of Iceland to the shores of Scotland.'
  },
  {
    videoUrl: 'https://youtu.be/wURZ1iFyaZg',
    title: 'Sahara Mission (1998)',
    desc: 'A vintage look at a 1998 helicopter mission across the vast and arid Sahara Desert.'
  },
  {
    videoUrl: 'https://youtu.be/VGJiepZyFRg',
    title: 'Bahamas Island Hopping',
    desc: 'Exploring turquoise waters and white sandy beaches from the air during the 2013 Bahamas expedition.'
  },
  {
    videoUrl: 'https://youtu.be/oqGeij7PrIY',
    title: 'North Pole Expedition Part 2',
    desc: 'Celebrating at the pole, setting up camp, and calling family from the very top of the world.'
  },
  {
    videoUrl: 'https://youtu.be/nq2P907DbZk',
    title: 'North Pole Expedition Part 3',
    desc: 'Continuing the North Pole adventure and navigating the unique challenges of the Arctic environment.'
  },
  {
    videoUrl: 'https://youtu.be/_SX8zUaQysk',
    title: 'Captain Q in Russia',
    desc: "Captain Q's adventures flying through Russia, meeting locals, and experiencing the culture firsthand."
  },
  {
    videoUrl: 'https://youtu.be/qBL2TRKntts',
    title: 'Costa Rica Expedition 2011',
    desc: 'Exploring the lush jungles and stunning coastlines of Costa Rica by helicopter.'
  },
  {
    videoUrl: 'https://youtu.be/2sDIFT6ZqN4',
    title: 'Pole to Pole',
    desc: 'The incredible story of the first helicopter flight from the North Pole to the South Pole, battling extreme weather and mechanical failure.'
  },
  {
    videoUrl: 'https://youtu.be/UH35IKQNZoA',
    title: 'Mission North Cape',
    desc: "Jennifer and Q's mission to the North Cape, flying through challenging northern European landscapes."
  },
  {
    videoUrl: 'https://youtu.be/Q5AGvsfmt_I',
    title: 'Ice Challenger',
    desc: 'Testing the "Snowbird 5" vehicle designed to drive across the Bering Straits from America to Russia.'
  }
];

function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function ExpeditionVideoSlider({ videos = defaultVideos, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailRef = useRef(null);

  const currentVideo = videos[currentIndex];
  const videoId = getYouTubeID(currentVideo.videoUrl);

  const changeSlide = (direction) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next >= videos.length) next = 0;
      if (next < 0) next = videos.length - 1;
      return next;
    });
  };

  const jumpToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailRef.current;
    if (container) {
      const activeThumb = container.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  return (
    <section className="exp-video-slider">
      <div className="exp-video-slider__container">
        {title && (
          <div className="exp-video-slider__header-wrap">
            <h2 className="exp-video-slider__header">{title}</h2>
            <p className="exp-video-slider__subtitle">
              To give you a taste of some of our expeditions, here are some quick videos we made
            </p>
          </div>
        )}

        <div className="exp-video-slider__main">
          {/* Prev Chevron */}
          <motion.button
            className="exp-video-slider__chevron exp-video-slider__chevron--prev"
            onClick={() => changeSlide(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous video"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </motion.button>

          {/* Video Side */}
          <div className="exp-video-slider__video-side">
            <div className="exp-video-slider__video-wrapper">
              <iframe
                src={videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : ''}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentVideo.title}
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="exp-video-slider__text-side">
            <div className="exp-video-slider__content-box">
              <motion.h3
                key={currentVideo.title}
                className="exp-video-slider__title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentVideo.title}
              </motion.h3>
              <motion.p
                key={currentVideo.desc}
                className="exp-video-slider__desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {currentVideo.desc}
              </motion.p>
              <div className="exp-video-slider__counter">
                {currentIndex + 1} / {videos.length}
              </div>
            </div>
          </div>

          {/* Next Chevron */}
          <motion.button
            className="exp-video-slider__chevron exp-video-slider__chevron--next"
            onClick={() => changeSlide(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next video"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        </div>

        {/* Thumbnail Strip */}
        <div className="exp-video-slider__thumbnails" ref={thumbnailRef}>
          {videos.map((video, index) => {
            const thumbId = getYouTubeID(video.videoUrl);
            return (
              <motion.div
                key={video.title}
                className={`exp-video-slider__thumb ${index === currentIndex ? 'exp-video-slider__thumb--active' : ''}`}
                onClick={() => jumpToSlide(index)}
                whileHover={{ y: -3, opacity: 1 }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: index === currentIndex ? 1 : 0.6 }}
              >
                <img
                  src={thumbId ? `https://img.youtube.com/vi/${thumbId}/mqdefault.jpg` : ''}
                  alt={video.title}
                  className="exp-video-slider__thumb-img"
                />
                <span className="exp-video-slider__thumb-title">{video.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .exp-video-slider {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          padding: 4rem 2rem;
        }

        .exp-video-slider__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .exp-video-slider__header-wrap {
          text-align: center;
          margin-bottom: 2rem;
        }

        .exp-video-slider__header {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .exp-video-slider__subtitle {
          font-size: 1rem;
          color: #666;
          margin: 0;
          font-weight: 400;
        }

        .exp-video-slider__main {
          display: flex;
          gap: 1.5rem;
          align-items: stretch;
          margin-bottom: 2rem;
        }

        .exp-video-slider__chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          align-self: center;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 50%;
          cursor: pointer;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }

        .exp-video-slider__chevron:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .exp-video-slider__video-side {
          flex: 6;
          width: 100%;
        }

        .exp-video-slider__video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 8px;
          background: #000;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .exp-video-slider__video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .exp-video-slider__text-side {
          flex: 4;
          display: flex;
          flex-direction: column;
        }

        .exp-video-slider__content-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .exp-video-slider__title {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .exp-video-slider__desc {
          font-size: 1rem;
          line-height: 1.6;
          color: #555;
          margin: 0 0 1.5rem 0;
        }

        .exp-video-slider__counter {
          font-size: 0.85rem;
          color: #999;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
        }

        .exp-video-slider__thumbnails {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 1.5rem 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(26,26,26,0.3) transparent;
        }

        .exp-video-slider__thumbnails::-webkit-scrollbar {
          height: 4px;
        }

        .exp-video-slider__thumbnails::-webkit-scrollbar-track {
          background: transparent;
          margin: 0 2rem;
        }

        .exp-video-slider__thumbnails::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, transparent, rgba(26,26,26,0.25), transparent);
          border-radius: 4px;
        }

        .exp-video-slider__thumbnails::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, transparent, rgba(26,26,26,0.4), transparent);
        }

        .exp-video-slider__thumb {
          flex: 0 0 160px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .exp-video-slider__thumb--active {
          opacity: 1 !important;
        }

        .exp-video-slider__thumb--active .exp-video-slider__thumb-img {
          border-bottom: 4px solid #2563eb;
        }

        .exp-video-slider__thumb-img {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 4px;
          display: block;
          background: #333;
          margin-bottom: 0.5rem;
        }

        .exp-video-slider__thumb-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        @media (max-width: 1024px) {
          .exp-video-slider__main {
            flex-direction: column;
            gap: 1.5rem;
            position: relative;
          }

          .exp-video-slider__chevron {
            position: absolute;
            top: calc((56.25vw - 4rem) / 2);
            transform: translateY(-50%);
            z-index: 10;
            width: 36px;
            height: 36px;
            background: rgba(255,255,255,0.95);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }

          .exp-video-slider__chevron--prev {
            left: 0.5rem;
          }

          .exp-video-slider__chevron--next {
            right: 0.5rem;
          }

          .exp-video-slider__video-side {
            width: 100%;
          }

          .exp-video-slider__text-side {
            width: 100%;
            padding: 0;
          }

          .exp-video-slider__content-box {
            flex: none;
            padding: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .exp-video-slider {
            padding: 2rem 1rem;
          }

          .exp-video-slider__thumb {
            flex: 0 0 120px;
          }

          .exp-video-slider__thumb-img {
            height: 70px;
          }

          .exp-video-slider__title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ExpeditionVideoSlider;
