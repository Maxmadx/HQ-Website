// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoTooltip from './InfoTooltip';

describe('InfoTooltip', () => {
  it('renders an info button with aria-label', () => {
    render(<InfoTooltip topic="aov" />);
    const button = screen.getByRole('button', { name: /more info/i });
    expect(button).toBeInTheDocument();
  });

  it('does not show the popover initially', () => {
    render(<InfoTooltip topic="aov" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the popover with the glossary content when clicked', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // The default glossary entry for 'aov' should appear
    expect(screen.getByText(/Average Order Value/i)).toBeInTheDocument();
  });

  it('closes the popover when the close button is clicked', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the popover when Escape is pressed', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders gracefully (no crash) when given an unknown topic', () => {
    render(<InfoTooltip topic="this-does-not-exist" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    // Popover opens with a sensible fallback
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();
  });
});
