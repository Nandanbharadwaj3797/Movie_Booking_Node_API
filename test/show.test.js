const test = require('node:test');
const assert = require('node:assert/strict');

const showRoutes = require('../src/routes/show.routes');
const showController = require('../src/controllers/show.controller');
const showMiddleware = require('../src/middlewares/show.middlewares');

test('show middlewares exist', () => {
  assert.equal(typeof showMiddleware.validateCreateShowRequest, 'function');
  assert.equal(typeof showMiddleware.validateGetShowsRequest, 'function');
  assert.equal(typeof showMiddleware.validateUpdateShowRequest, 'function');
});

test('show controller exports all handlers', () => {
  assert.equal(typeof showController.create, 'function');
  assert.equal(typeof showController.getShows, 'function');
  assert.equal(typeof showController.destroy, 'function');
  assert.equal(typeof showController.update, 'function');
});

test('show routes - registers all 4 endpoints', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path }),
    get: (path, ...handlers) => calls.push({ method: 'get', path }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path })
  };

  showRoutes(app);

  const endpoints = calls.map((c) => `${c.method.toUpperCase()} ${c.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/shows'));
  assert.ok(endpoints.includes('GET /mba/api/v1/shows'));
  assert.ok(endpoints.includes('DELETE /mba/api/v1/shows/:id'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/shows/:id'));
});

test('show routes - protected endpoints require auth and middleware', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path, handlers })
  };

  showRoutes(app);

  // POST /shows requires auth, isAdminOrClient, validate, create
  const postShows = calls.find((c) => c.method === 'post' && c.path === '/mba/api/v1/shows');
  assert.equal(postShows.handlers.length, 4);

  // GET /shows is public but needs validation
  const getShows = calls.find((c) => c.method === 'get' && c.path === '/mba/api/v1/shows');
  assert.equal(getShows.handlers.length, 2);
});
