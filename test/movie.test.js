const test = require('node:test');
const assert = require('node:assert/strict');

const movieRoutes = require('../src/routes/movie.routes');
const movieController = require('../src/controllers/movie.controller');
const movieMiddlewares = require('../src/middlewares/movie.middlewares');

test('movie middlewares - validateMovieCreateRequest exists', () => {
  assert.equal(typeof movieMiddlewares.validateMovieCreateRequest, 'function');
});

test('movie controller exports all handlers', () => {
  assert.equal(typeof movieController.createMovie, 'function');
  assert.equal(typeof movieController.deleteMovie, 'function');
  assert.equal(typeof movieController.getMovie, 'function');
  assert.equal(typeof movieController.updateMovie, 'function');
  assert.equal(typeof movieController.getMovies, 'function');
});

test('movie routes - registers all 6 endpoints', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path }),
    get: (path, ...handlers) => calls.push({ method: 'get', path }),
    put: (path, ...handlers) => calls.push({ method: 'put', path }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path })
  };

  movieRoutes(app);

  const endpoints = calls.map((c) => `${c.method.toUpperCase()} ${c.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/movies'));
  assert.ok(endpoints.includes('DELETE /mba/api/v1/movies/:id'));
  assert.ok(endpoints.includes('GET /mba/api/v1/movies/:id'));
  assert.ok(endpoints.includes('PUT /mba/api/v1/movies/:id'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/movies/:id'));
  assert.ok(endpoints.includes('GET /mba/api/v1/movies'));
});

test('movie routes - protected endpoints require auth and isAdminOrClient', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    delete: (path, ...handlers) => calls.push({ method: 'delete', path, handlers }),
    get: (path, ...handlers) => calls.push({ method: 'get', path, handlers }),
    put: (path, ...handlers) => calls.push({ method: 'put', path, handlers }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path, handlers })
  };

  movieRoutes(app);

  // POST /movies should have 4 handlers: auth, isAdminOrClient, validate, create
  const postMovies = calls.find((c) => c.method === 'post' && c.path === '/mba/api/v1/movies');
  assert.equal(postMovies.handlers.length, 4);

  // GET /movies/:id is public - should only have 1 handler
  const getMovieById = calls.find((c) => c.method === 'get' && c.path === '/mba/api/v1/movies/:id');
  assert.equal(getMovieById.handlers.length, 1);
});
