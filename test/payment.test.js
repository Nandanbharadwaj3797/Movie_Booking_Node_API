const test = require('node:test');
const assert = require('node:assert/strict');

const paymentRoutes = require('../src/routes/payment.routes');
const paymentController = require('../src/controllers/payment.controller');
const paymentMiddleware = require('../src/middlewares/payment.middlewares');

test('payment middlewares exist', () => {
  assert.equal(typeof paymentMiddleware.verifyPaymentCreateRequest, 'function');
  assert.equal(typeof paymentMiddleware.verifyPaymentIdParam, 'function');
});

test('payment controller exports all handlers', () => {
  assert.equal(typeof paymentController.create, 'function');
  assert.equal(typeof paymentController.getAllPayments, 'function');
  assert.equal(typeof paymentController.getPaymentDetails, 'function');
});

test('payment routes - registers all 3 endpoints', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path }),
    get: (path, ...handlers) => calls.push({ method: 'get', path })
  };

  paymentRoutes(app);

  const endpoints = calls.map((c) => `${c.method.toUpperCase()} ${c.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/payments'));
  assert.ok(endpoints.includes('GET /mba/api/v1/payments/all'));
  assert.ok(endpoints.includes('GET /mba/api/v1/payments/:id'));
});

test('payment routes - all endpoints require authentication', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers })
  };

  paymentRoutes(app);

  calls.forEach((call) => {
    assert.ok(call.handlers.length >= 2, `${call.method.toUpperCase()} ${call.path} should require authentication`);
  });
});

test('payment routes - create and getDetails have validation middleware', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers })
  };

  paymentRoutes(app);

  // POST /payments: isAuthenticated, verifyPaymentCreateRequest, create
  const createPayment = calls.find((c) => c.method === 'post' && c.path === '/mba/api/v1/payments');
  assert.equal(createPayment.handlers.length, 3);

  // GET /payments/:id: isAuthenticated, verifyPaymentIdParam, getPaymentDetails
  const getPaymentById = calls.find((c) => c.method === 'get' && c.path === '/mba/api/v1/payments/:id');
  assert.equal(getPaymentById.handlers.length, 3);
});
