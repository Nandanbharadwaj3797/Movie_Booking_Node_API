const test = require('node:test');
const assert = require('node:assert/strict');

const authRoutes = require('../src/routes/auth.routes');
const authController = require('../src/controllers/auth.controller');
const authMiddlewares = require('../src/middlewares/auth.middlewares');

test('auth middlewares export required handlers', () => {
  assert.equal(typeof authMiddlewares.validateSignupRequest, 'function');
  assert.equal(typeof authMiddlewares.validateSigninRequest, 'function');
  assert.equal(typeof authMiddlewares.isAuthenticated, 'function');
  assert.equal(typeof authMiddlewares.validateResetPasswordRequest, 'function');
  assert.equal(typeof authMiddlewares.isAdmin, 'function');
  assert.equal(typeof authMiddlewares.isAdminOrClient, 'function');
});

test('auth controller exports logout handler', () => {
  assert.equal(typeof authController.logout, 'function');
});

test('auth routes register expected endpoints with function handlers', () => {
  const calls = [];
  const app = {
    post: (path, ...handlers) => calls.push({ method: 'post', path, handlers }),
    patch: (path, ...handlers) => calls.push({ method: 'patch', path, handlers })
  };

  authRoutes(app);

  const endpoints = calls.map((call) => `${call.method.toUpperCase()} ${call.path}`);

  assert.ok(endpoints.includes('POST /mba/api/v1/auth/signup'));
  assert.ok(endpoints.includes('POST /mba/api/v1/auth/signin'));
  assert.ok(endpoints.includes('PATCH /mba/api/v1/users/me/password'));
  assert.ok(endpoints.includes('POST /mba/api/v1/auth/logout'));

  calls.forEach((call) => {
    call.handlers.forEach((handler) => {
      assert.equal(typeof handler, 'function');
    });
  });
});

test('logout returns 200 success response', async () => {
  let statusCode;
  let payload;

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(body) {
          payload = body;
          return body;
        }
      };
    }
  };

  let nextCalled = false;
  await authController.logout({}, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(statusCode, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.message, 'Successfully logged out');
});
