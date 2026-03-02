const test = require('node:test');
const assert = require('node:assert/strict');

const bookingRoutes = require('../src/routes/booking.routes');
const bookingController = require('../src/controllers/booking.controller');
const bookingMiddleware = require('../src/middlewares/booking.middlewares');

test('booking middlewares exist', () => {
  assert.equal(typeof bookingMiddleware.validateBookingCreateRequest, 'function');
  assert.equal(typeof bookingMiddleware.canChangeStatus, 'function');
});

test('booking controller exports all handlers', () => {
  assert.equal(typeof bookingController.create, 'function');
  assert.equal(typeof bookingController.update, 'function');
  assert.equal(typeof bookingController.getBookings, 'function');
  assert.equal(typeof bookingController.getAllBookings, 'function');
  assert.equal(typeof bookingController.getBookingById, 'function');
});

test('booking routes - registers all 5 endpoints', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path }),
    get: (path, ...handlers) => calls.push({ method: 'get', path })
  };

  bookingRoutes(app);

  const endpoints = calls.map((c) => `${c.method.toUpperCase()} ${c.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/bookings'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/bookings/:id'));
  assert.ok(endpoints.includes('GET /mba/api/v1/bookings'));
  assert.ok(endpoints.includes('GET /mba/api/v1/bookings/all'));
  assert.ok(endpoints.includes('GET /mba/api/v1/bookings/:id'));
});

test('booking routes - all endpoints require authentication', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers })
  };

  bookingRoutes(app);

  // All booking endpoints are authenticated
  calls.forEach((call) => {
    assert.ok(call.handlers.length >= 2, `${call.method.toUpperCase()} ${call.path} should have at least auth + handler`);
  });

  // GET /bookings/all requires additional isAdmin check
  const getAllBookings = calls.find((c) => c.method === 'get' && c.path === '/mba/api/v1/bookings/all');
  assert.equal(getAllBookings.handlers.length, 3); // isAuthenticated, isAdmin, getAllBookings
});
