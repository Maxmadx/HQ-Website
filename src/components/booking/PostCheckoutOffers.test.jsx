// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCheckoutOffers from './PostCheckoutOffers';

const baseBooking = {
  productType: 'discovery-flight',
  aircraft: 'r22',
  duration: 30,
  flightAmountPence: 18000,
  totalAmountPence: 18000,
  referralCode: 'ABCD2345',
  customerName: 'Maximus',
  customerEmail: 'm@x.com',
};

const freeItem = {
  id: 'tee-1',
  name: 'HQ Tee',
  price: 2500,
  description: 'Soft cotton tee.',
  images: [{ url: 'https://example/img.jpg', isPrimary: true }],
};

describe('PostCheckoutOffers', () => {
  it('returns null for misc bookings', () => {
    const { container } = render(<PostCheckoutOffers booking={{ ...baseBooking, productType: 'misc' }} freeReferralItem={freeItem} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when no referralCode', () => {
    const { container } = render(<PostCheckoutOffers booking={{ ...baseBooking, referralCode: null }} freeReferralItem={freeItem} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when no freeReferralItem flagged', () => {
    const { container } = render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the referral card when both are present', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    expect(screen.getByText(/Refer a friend/i)).toBeInTheDocument();
    expect(screen.getByText('HQ Tee')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('does not display the bare referral code on screen', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    expect(screen.queryByText('ABCD2345')).toBeNull();
  });

  it('copies the share link (with code) to clipboard on Copy', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    fireEvent.click(screen.getByRole('button', { name: /Copy share link/i }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toMatch(/\/training\/trial-lessons\?ref=ABCD2345$/);
  });

  it('opens the product info modal on item click', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    fireEvent.click(screen.getByLabelText(/View details of HQ Tee/i));
    expect(screen.getByRole('dialog', { name: /HQ Tee/i })).toBeInTheDocument();
    expect(screen.getByText(/Soft cotton tee\./i)).toBeInTheDocument();
  });
});
