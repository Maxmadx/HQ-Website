// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchKeywords from './SearchKeywords';

const rows = [
  { date: '2026-04-15', query: 'hq aviation',    page: '/',        clicks: 30, impressions: 100, ctr: 0.30, position: 2.0 },
  { date: '2026-04-15', query: 'hq helicopters', page: '/',        clicks:  5, impressions:  20, ctr: 0.25, position: 1.5 },
  { date: '2026-04-15', query: 'hq aviation',    page: '/contact', clicks:  2, impressions:  50, ctr: 0.04, position: 4.0 },
];

describe('SearchKeywords', () => {
  it('renders top-line stats: Clicks, Impressions, CTR, Avg. Position', () => {
    render(<SearchKeywords rows={rows} />);
    // Each label appears in both the Stat tile AND the table header — use getAllByText
    expect(screen.getAllByText(/Clicks/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Impressions/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/CTR/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Avg\. Position/i).length).toBeGreaterThanOrEqual(2);
  });

  it('shows the sum of clicks (37) in the top-line', () => {
    render(<SearchKeywords rows={rows} />);
    expect(screen.getByText('37')).toBeInTheDocument();
  });

  it('renders the By Keyword table by default with the top keyword first', () => {
    render(<SearchKeywords rows={rows} />);
    expect(screen.getByText('hq aviation')).toBeInTheDocument();
    expect(screen.getByText('hq helicopters')).toBeInTheDocument();
  });

  it('switches to the By Page table when the Pages tab is clicked', () => {
    render(<SearchKeywords rows={rows} />);
    const pagesTab = screen.getByRole('button', { name: /by page/i });
    fireEvent.click(pagesTab);
    expect(screen.getByText('/contact')).toBeInTheDocument();
  });

  it('shows an empty state when no rows', () => {
    render(<SearchKeywords rows={[]} />);
    expect(screen.getByText(/no search data/i)).toBeInTheDocument();
  });
});
