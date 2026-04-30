/**
 * AircraftPriceBlock — small reusable USD/GBP/EUR price display.
 * Reads live FX rates and Firestore overrides via hooks.
 *
 * Usage:
 *   <AircraftPriceBlock modelId="r66" subtypes={r66Subtypes} activeSubtype={current} />
 *
 * `subtypes` is an array of { id, name, priceUsd } so the block can render
 * variant pills + the active subtype's converted price. If only one subtype
 * is provided the pills are hidden.
 */
import { useState, useRef, useEffect } from 'react';
import { useFx } from '../hooks/useFx';
import { useAircraftPricing } from '../hooks/useAircraftPricing';

export default function AircraftPriceBlock({ modelId, subtypes, activeSubtype: controlled, onSubtypeChange }) {
  const fx = useFx();
  const pricing = useAircraftPricing();
  const [internal, setInternal] = useState(subtypes?.[0]);
  const active = controlled ?? internal;
  const cardRef = useRef(null);
  const chipRef = useRef(null);
  const [matchedWidth, setMatchedWidth] = useState(null);
  useEffect(() => {
    const card = cardRef.current;
    const chip = chipRef.current;
    if (!card) return;
    const measure = () => {
      const cardPrev = card.style.width;
      card.style.width = 'auto';
      const cardNatural = card.scrollWidth;
      card.style.width = cardPrev;

      let chipNatural = 0;
      if (chip) {
        const chipPrev = chip.style.width;
        chip.style.width = 'auto';
        chipNatural = chip.scrollWidth;
        chip.style.width = chipPrev;
      }
      setMatchedWidth(Math.max(cardNatural, chipNatural));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    if (chip) ro.observe(chip);
    return () => ro.disconnect();
  }, [active?.id]);

  if (!subtypes?.length || !active) return null;

  const usd = pricing.getPriceUsd(modelId, active);

  return (
    <div className="aircraft-price-block">
      {subtypes.length > 1 && (
        <div className="aircraft-price-block__variants">
          {subtypes.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`aircraft-price-block__variant ${active.id === s.id ? 'is-active' : ''}`}
              onClick={() => {
                if (onSubtypeChange) onSubtypeChange(s);
                else setInternal(s);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="aircraft-price-block__price">
        {usd ? (
          <div className="aircraft-price-block__stack">
            <div
              ref={cardRef}
              className="aircraft-price-block__card"
              style={matchedWidth ? { width: matchedWidth } : undefined}
            >
              <span className="aircraft-price-block__label">From</span>
              <span className="aircraft-price-block__usd">{fx.format(usd, 'USD')}</span>
            </div>
            <div
              ref={chipRef}
              className="aircraft-price-block__chip"
              style={matchedWidth ? { width: matchedWidth } : undefined}
            >
              ~{fx.format(usd, 'GBP')}
              <span className="aircraft-price-block__sep">·</span>
              ~{fx.format(usd, 'EUR')}
            </div>
          </div>
        ) : (
          <div className="aircraft-price-block__stack">
            <div className="aircraft-price-block__card">
              <span className="aircraft-price-block__label">From</span>
              <span className="aircraft-price-block__usd">POA</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .aircraft-price-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem 1.75rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          font-family: 'Space Grotesk', sans-serif;
        }
        .aircraft-price-block__variants {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .aircraft-price-block__variant {
          padding: 0.4rem 0.85rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4a4a4a;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .aircraft-price-block__variant:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .aircraft-price-block__variant.is-active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .aircraft-price-block__price {
          display: flex;
        }
        .aircraft-price-block__stack {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .aircraft-price-block__card {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.85rem;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .aircraft-price-block__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #9a9a9a;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .aircraft-price-block__usd {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }
        .aircraft-price-block__chip {
          display: block;
          box-sizing: border-box;
          padding: 0.5rem 0.95rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4a4a4a;
          background: #fbfaf7;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 6px;
          letter-spacing: 0.01em;
          text-align: center;
          white-space: nowrap;
        }
        .aircraft-price-block__sep {
          color: #c0c0c0;
          margin: 0 0.25rem;
        }
      `}</style>
    </div>
  );
}
