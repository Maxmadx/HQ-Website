// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailFirstStep from './EmailFirstStep';

describe('EmailFirstStep', () => {
  it('renders the email field and continue button', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('disables continue until a valid email is entered', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onContinue with the email when the button is clicked', () => {
    const onContinue = vi.fn();
    render(<EmailFirstStep onContinue={onContinue} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalledWith('jane@example.com');
  });

  it('renders the privacy note under the email field', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    expect(screen.getByText(/we'll only use this/i)).toBeInTheDocument();
  });

  it('pre-fills the email if defaultEmail prop is provided', () => {
    render(<EmailFirstStep defaultEmail="prefilled@example.com" onContinue={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('prefilled@example.com');
  });

  it('renders a hidden honeypot field with name="company"', () => {
    const { container } = render(<EmailFirstStep onContinue={() => {}} />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot.tabIndex).toBe(-1);
  });
});
