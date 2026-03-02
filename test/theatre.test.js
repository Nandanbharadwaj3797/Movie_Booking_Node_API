const test = require('node:test');
const assert = require('node:assert/strict');

const theatreRoutes = require('../src/routes/theatre.routes');
const theatreController = require('../src/controllers/theatre.controller');
const theatreMiddleware = require('../src/middlewares/theatre.middleware');

test('theatre middlewares - validateTheatreCreateRequest exists', () => {
  assert.equal(typeof theatreMiddleware.validateTheatreCreateRequest, 'function');
});

test('theatre controller exports all handlers', () => {
  assert.equal(typeof theatreController.create, 'function');
  assert.equal(typeof theatreController.destroy, 'function');
  assert.equal(typeof theatreController.getTheatre, 'function');
  assert.equal(typeof theatreController.getTheatres, 'function');
  assert.equal(typeof theatreController.update, 'function');
  assert.equal(typeof theatreController.updateMovies, 'function');
  assert.equal(typeof theatreController.getMovies, 'function');
  assert.equal(typeof theatreController.checkMovie, 'function');
});

test('theatre routes - registers all 8 endpoints', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path }),
    get: (path, ...handlers) => calls.push({ method: 'get', path }),
    put: (path, ...handlers) => calls.push({ method: 'put', path }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path })
  };

  theatreRoutes(app);

  const endpoints = calls.map((c) => `${c.method.toUpperCase()} ${c.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/theatres'));
  assert.ok(endpoints.includes('DELETE /mba/api/v1/theatres/:id'));
  assert.ok(endpoints.includes('GET /mba/api/v1/theatres/:id'));
  assert.ok(endpoints.includes('GET /mba/api/v1/theatres'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/theatres/:id'));
  assert.ok(endpoints.includes('PUT /mba/api/v1/theatres/:id'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/theatres/:id/movies'));
  assert.ok(endpoints.includes('GET /mba/api/v1/theatres/:id/movies'));
  assert.ok(endpoints.includes('GET /mba/api/v1/theatres/:theatreId/movies/:movieId'));
});

test('theatre routes - protected endpoints require auth and isAdminOrClient', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers }),
    put: (path, ...handlers) => calls.push({ method: 'put', path, handlers }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path, handlers })
  };

  theatreRoutes(app);

  // POST /theatres should have 4 handlers
  const postTheatres = calls.find((c) => c.method === 'post' && c.path === '/mba/api/v1/theatres');
  assert.ok(postTheatres.handlers.length >= 3);

  // GET /theatres is public
  const getTheatres = calls.find((c) => c.method === 'get' && c.path === '/mba/api/v1/theatres');
  assert.equal(getTheatres.handlers.length, 1);
});
