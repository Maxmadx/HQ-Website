/**
 * SCROLL PATH ANIMATION TEST PAGE
 *
 * Standalone page to test the scroll path animation component.
 * Visit /scroll-path-test to see it in action.
 */

import ScrollPathAnimation from '../components/ScrollPathAnimation';

function ScrollPathTest() {
  return (
    <div className="scroll-path-test">
      {/* Spacer to allow scrolling into the animation */}
      <section className="test-intro">
        <div className="test-intro__content">
          <h1>Scroll Path Animation Test</h1>
          <p>Scroll down to see the helicopter follow the flight path</p>
          <div className="test-intro__arrow">↓</div>
        </div>
      </section>

      {/* The scroll path animation */}
      <ScrollPathAnimation
        iconSrc="/assets/images/icons/r66-icon-transparent going right.svg"
        iconSize={60}
        colorStart="#FFFFFF"
        colorMid="#5B9BD5"
        colorEnd="#1E3A5F"
      />

      {/* Footer spacer */}
      <section className="test-outro">
        <div className="test-outro__content">
          <h2>Animation Complete</h2>
          <p>The helicopter has reached its destination.</p>
        </div>
      </section>

      <style>{`
        .scroll-path-test {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }

        .test-intro {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          color: #fff;
          text-align: center;
        }

        .test-intro__content h1 {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .test-intro__content p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 3rem;
        }

        .test-intro__arrow {
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        .test-outro {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: #fff;
          text-align: center;
        }

        .test-outro__content h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .test-outro__content p {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

export default ScrollPathTest;
