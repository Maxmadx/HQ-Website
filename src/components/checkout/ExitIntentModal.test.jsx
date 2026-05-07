// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExitIntentModal from './ExitIntentModal';

describe('ExitIntentModal', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(<ExitIntentModal open={false} onSave={() => {}} onDismiss={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when open is true', () => {
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={() => {}} />);
    expect(screen.getByText(/save your booking/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('disables the save button until a valid email is entered', () => {
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={() => {}} />);
    const button = screen.getByRole('button', { name: /save & email/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onSave with the email when clicked', () => {
    const onSave = vi.fn();
    render(<ExitIntentModal open={true} onSave={onSave} onDismiss={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save & email/i }));
    expect(onSave).toHaveBeenCalledWith('jane@example.com');
  });

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
