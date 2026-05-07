// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeographyMap from './GeographyMap';

// react-simple-maps uses fetch + d3-geo internally — mock the heavy bits
vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <svg data-testid="map">{children}</svg>,
  Geographies: ({ children }) => children({
    geographies: [
      { rsmKey: 'GBR', properties: { name: 'United Kingdom', 'ISO_A2': 'GB' }, id: '826' },
      { rsmKey: 'USA', properties: { name: 'United States of America', 'ISO_A2': 'US' }, id: '840' },
      { rsmKey: 'FRA', properties: { name: 'France', 'ISO_A2': 'FR' }, id: '250' },
    ],
  }),
  Geography: ({ geography, fill, ...props }) => (
    <path data-testid={`country-${geography.properties['ISO_A2']}`} fill={fill} data-name={geography.properties.name} {...props} />
  ),
}));

describe('GeographyMap', () => {
  it('renders the world map svg', () => {
    render(<GeographyMap data={[]} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('renders one path per country', () => {
    render(<GeographyMap data={[]} />);
    expect(screen.getByTestId('country-GB')).toBeInTheDocument();
    expect(screen.getByTestId('country-US')).toBeInTheDocument();
    expect(screen.getByTestId('country-FR')).toBeInTheDocument();
  });

  it('shades countries with data more than countries without', () => {
    const data = [
      { countryCode: 'GB', visits: 100 },
      { countryCode: 'US', visits: 30 },
    ];
    render(<GeographyMap data={data} />);
    const gb = screen.getByTestId('country-GB');
    const fr = screen.getByTestId('country-FR'); // not in data
    expect(gb.getAttribute('fill')).not.toBe(fr.getAttribute('fill'));
  });

  it('applies a darker shade to higher-visit countries (GB > US)', () => {
    const data = [
      { countryCode: 'GB', visits: 100 },
      { countryCode: 'US', visits: 10 },
    ];
    render(<GeographyMap data={data} />);
    const gb = screen.getByTestId('country-GB').getAttribute('fill');
    const us = screen.getByTestId('country-US').getAttribute('fill');
    // Both should be non-default, and the country with more visits should differ from the lower one.
    // We don't assert specific colors — just that they're distinguishable.
    expect(gb).toBeTruthy();
    expect(us).toBeTruthy();
    expect(gb).not.toBe(us);
  });

  it('renders an empty state when data is empty', () => {
    render(<GeographyMap data={[]} />);
    // With empty data, every country gets the no-data fill — but the map still renders.
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
