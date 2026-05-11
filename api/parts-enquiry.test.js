import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Use vi.hoisted so mock functions are available inside vi.mock factory (which is hoisted).
const { mockAdd, mockUpdate, mockDoc, mockCollection, mockVerifyIdToken } = vi.hoisted(() => {
  const mockAdd = vi.fn().mockResolvedValue({ id: 'mock-enquiry-id' });
  const mockUpdate = vi.fn().mockResolvedValue(undefined);
  const mockDoc = vi.fn(() => ({ update: mockUpdate }));
  const mockCollection = vi.fn(() => ({ add: mockAdd, doc: mockDoc }));
  const mockVerifyIdToken = vi.fn();
  return { mockAdd, mockUpdate, mockDoc, mockCollection, mockVerifyIdToken };
});

// Mock firebase-admin BEFORE requiring the route module.
vi.mock('./firebase-admin', () => {
  const firestoreFn = Object.assign(
    () => ({ collection: mockCollection }),
    { FieldValue: { serverTimestamp: () => 'TS' } },
  );
  const adminMock = {
    firestore: firestoreFn,
    auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  };
  return { default: adminMock, ...adminMock };
});

vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail: vi.fn().mockResolvedValue({}) }) },
  createTransport: () => ({ sendMail: vi.fn().mockResolvedValue({}) }),
}));

const { default: partsEnquiry } = await import('./parts-enquiry.js');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/parts-enquiry', partsEnquiry);
  return app;
}

describe('POST /api/parts-enquiry', () => {
  beforeEach(() => {
    mockAdd.mockClear();
    mockVerifyIdToken.mockClear();
  });

  it('requires partNumber, name, email', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({});
    expect(res.status).toBe(400);
  });

  it('accepts a valid enquiry and writes to Firestore', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A102',
      partListingId: 'firestore-auto-id-abc',
      condition: 'new',
      qty: 1,
      name: 'John Test',
      email: 'john@test.com',
      phone: '+44 1234 567890',
      tail: 'G-ABCD',
      notes: 'AOG',
    });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('mock-enquiry-id');
    expect(mockAdd).toHaveBeenCalledOnce();
    const doc = mockAdd.mock.calls[0][0];
    expect(doc.partNumber).toBe('A102');
    expect(doc.partListingId).toBe('firestore-auto-id-abc');
    expect(doc.status).toBe('open');
    expect(doc.condition).toBe('new');
  });

  it('rejects qty < 1', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A205-1', name: 'X', email: 'x@x.com', qty: 0,
    });
    expect(res.status).toBe(400);
  });

  it('rejects unknown condition', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A205-1', name: 'X', email: 'x@x.com', condition: 'fake',
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/parts-enquiry/:id', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockVerifyIdToken.mockClear();
  });

  it('rejects requests without a Bearer token', async () => {
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').send({ status: 'responded' });
    expect(res.status).toBe(401);
  });

  it('rejects non-admin tokens', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'editor' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'responded' });
    expect(res.status).toBe(403);
  });

  it('accepts admin status updates', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'admin' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'responded' });
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledOnce();
  });

  it('rejects invalid status', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'admin' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'fake' });
    expect(res.status).toBe(400);
  });
});
