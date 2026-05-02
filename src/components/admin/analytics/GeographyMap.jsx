import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// World atlas topojson — countries-110m is small (~80KB), good for an admin tile.
const WORLD_GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const NO_DATA_FILL = '#1f2937';
const STROKE = '#0f172a';

/**
 * @param {object[]} data  Array of { countryCode, visits } where countryCode is ISO 3166-1 alpha-2 (e.g. 'GB', 'US').
 *                          Visit counts are aggregated by the caller — this component just renders.
 */
export default function GeographyMap({ data = [], width = 640, height = 320 }) {
  const visitsByCountry = useMemo(() => {
    const m = new Map();
    for (const row of data) {
      if (!row || !row.countryCode) continue;
      m.set(String(row.countryCode).toUpperCase(), Number(row.visits) || 0);
    }
    return m;
  }, [data]);

  const maxVisits = useMemo(() => {
    let max = 0;
    for (const v of visitsByCountry.values()) if (v > max) max = v;
    return max;
  }, [visitsByCountry]);

  // Color scale: light purple → deep purple, capped by maxVisits.
  const colorScale = useMemo(() => (
    scaleLinear()
      .domain([1, Math.max(maxVisits, 1)])
      .range(['#5b21b6', '#c084fc'])
      .clamp(true)
  ), [maxVisits]);

  function fillFor(geo) {
    const code = (geo.properties && geo.properties['ISO_A2']) || '';
    const visits = visitsByCountry.get(String(code).toUpperCase()) || 0;
    if (visits === 0) return NO_DATA_FILL;
    return colorScale(visits);
  }

  return (
    <div style={{ width: '100%', maxWidth: width, margin: '0 auto', background: '#0f172a', borderRadius: 8, padding: 12 }}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 110 }}
        width={width}
        height={height}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = (geo.properties && geo.properties['ISO_A2']) || '';
              const name = (geo.properties && geo.properties.name) || code;
              const visits = visitsByCountry.get(String(code).toUpperCase()) || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillFor(geo)}
                  stroke={STROKE}
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', filter: 'brightness(1.4)' },
                    pressed: { outline: 'none' },
                  }}
                >
                  <title>{`${name}: ${visits.toLocaleString('en-GB')} visit${visits === 1 ? '' : 's'}`}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
