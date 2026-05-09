import express from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import nodemailer from 'nodemailer';
import admin from './firebase-admin.js';

const router = express.Router();

// Keep legacy values accepted so old listings (overhauled/exchange/repaired)
// still submit cleanly. New listings use only 'new' / 'used'.
const VALID_CONDITIONS = ['new', 'used', 'overhauled', 'exchange', 'repaired', 'any'];
const VALID_STATUSES = ['open', 'responded', 'closed'];
const VALID_KINDS = ['enquire', 'request'];

// 5 requests per 10 minutes per IP, mirroring /api/leads.
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

async function sendOpsEmail(enquiry) {
  if (!process.env.SMTP_HOST) return; // skip in dev/test
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const to = process.env.PARTS_ENQUIRY_EMAIL || process.env.EMAIL_FROM;
  const subjectTag = enquiry.kind === 'request' ? '[Parts Sourcing Request]' : '[Parts Enquiry]';
  const subject = `${subjectTag} ${enquiry.partNumber} — ${enquiry.condition || 'any'} × ${enquiry.qty || 1}`;
  const text = [
    `Part Number: ${enquiry.partNumber}`,
    `Condition: ${enquiry.condition || 'any'}`,
    `Quantity: ${enquiry.qty || 1}`,
    '',
    `Customer: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || '—'}`,
    `Tail: ${enquiry.tail || '—'}`,
    '',
    `Notes:`,
    enquiry.notes || '(none)',
    '',
    `Admin: ${process.env.SITE_URL || 'https://hqaviation.com'}/admin/parts/enquiries`,
  ].join('\n');
  await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    replyTo: enquiry.email,
    subject,
    text,
  });
}

// POST /api/parts-enquiry — public, rate-limited
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const { partNumber, partListingId, condition, qty, name, email, phone, tail, notes, kind } = req.body || {};
    if (!partNumber || !name || !email) {
      return res.status(400).json({ error: 'partNumber, name, and email are required' });
    }
    const qtyNum = qty === undefined || qty === null ? 1 : Number(qty);
    if (!Number.isInteger(qtyNum) || qtyNum < 1 || qtyNum > 999) {
      return res.status(400).json({ error: 'qty must be an integer between 1 and 999' });
    }
    if (condition !== undefined && condition !== null && !VALID_CONDITIONS.includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition' });
    }
    if (kind !== undefined && kind !== null && !VALID_KINDS.includes(kind)) {
      return res.status(400).json({ error: 'Invalid kind' });
    }

    const db = admin.firestore();
    const doc = {
      partNumber: String(partNumber).slice(0, 100),
      partListingId: String(partListingId || '').slice(0, 100),
      condition: condition || 'any',
      qty: qtyNum,
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || '').slice(0, 50),
      tail: String(tail || '').slice(0, 20),
      notes: String(notes || '').slice(0, 5000),
      kind: kind || 'enquire',
      status: 'open',
      adminNotes: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await db.collection('parts_enquiries').add(doc);

    // Best-effort email — don't fail the request if SMTP is down.
    sendOpsEmail(doc).catch((err) => console.error('[parts-enquiry] email failed:', err.message));

    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Parts enquiry capture error:', err);
    return res.status(500).json({ error: 'Failed to capture enquiry' });
  }
});

// PATCH /api/parts-enquiry/:id — admin only, update status or admin notes
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    const update = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
      update.status = status;
    }
    if (adminNotes !== undefined) update.adminNotes = String(adminNotes).slice(0, 5000);
    await admin.firestore().collection('parts_enquiries').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Parts enquiry update error:', err);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

export default router;
