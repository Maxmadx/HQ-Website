'use strict';

const express = require('express');
const Stripe = require('stripe');
const admin = require('./firebase-admin');

const router = express.Router();

// Lazy-init Stripe (same pattern as existing api/stripe.js)
let _stripe = null;
function getStripe() {
  if (!_stripe) _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

// POST /api/stripe/discovery-checkout
// Body: { priceId, customerEmail }
// priceId is a Firestore document id in the `pricing` collection
router.post('/', async (req, res) => {
  try {
    const { priceId, customerEmail } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId required' });

    const db = admin.firestore();
    const snap = await db.collection('pricing').doc(priceId).get();
    if (!snap.exists) return res.status(404).json({ error: 'Price not found' });

    const item = snap.data();
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: item.label, description: item.description || '' },
          unit_amount: item.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${siteUrl}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/training/trial-lessons`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
