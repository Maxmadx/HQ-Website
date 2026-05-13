'use strict';

const { rateLimit } = require('express-rate-limit');

/**
 * Rate-limiter for payment-intent creation endpoints.
 * 10 requests per minute per IP — enough for genuine customers,
 * tight enough to block pricing-enumeration and Firebase-quota-drain attacks.
 */
const paymentLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests. Try again in a minute.' },
});

module.exports = { paymentLimiter };
