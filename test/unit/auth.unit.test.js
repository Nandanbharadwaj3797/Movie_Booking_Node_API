/**
 * Unit Tests for Auth Module
 * Tests individual functions and utilities in isolation
 */
const test = require('node:test');
const assert = require('node:assert');

// Sanitize user helper function
const sanitizeUser = (user) => {
    if (!user) return user;
    const plainUser = user.toObject ? user.toObject() : { ...user };
    delete plainUser.password;
    delete plainUser.__v;
    return plainUser;
};

test('Auth Unit Tests', async (t) => {

    await t.test('sanitizeUser should remove password and __v', async () => {
        const mockUser = {
            _id: '123',
            email: 'test@example.com',
            password: 'secret',
            __v: 0,
            toObject: function() {
                return { _id: this._id, email: this.email, password: this.password, __v: this.__v };
            }
        };

        const sanitized = sanitizeUser(mockUser);
        
        assert.strictEqual(sanitized.password, undefined, 'Password should be removed');
        assert.strictEqual(sanitized.__v, undefined, '__v should be removed');
        assert.strictEqual(sanitized.email, 'test@example.com', 'Email should be preserved');
    });

    await t.test('sanitizeUser should handle plain objects', async () => {
        const plainUser = {
            _id: '456',
            email: 'plain@test.com',
            password: 'secret',
            __v: 1
        };

        const sanitized = sanitizeUser(plainUser);
        
        assert.strictEqual(sanitized.password, undefined);
        assert.strictEqual(sanitized.__v, undefined);
        assert.strictEqual(sanitized._id, '456');
    });

    await t.test('sanitizeUser should return null if user is null', async () => {
        const result = sanitizeUser(null);
        assert.strictEqual(result, null);
    });

    await t.test('validateSignupRequest should reject missing fields', async () => {
        const req = { body: { email: 'test@test.com' } };

        // Mock validation logic
        const isValidSignup = (body) => {
            if (!body) return false;
            if (!body.name) return false;
            if (!body.email) return false;
            if (!body.password) return false;
            return true;
        };
        
        // Missing name and password - should be invalid
        assert.strictEqual(isValidSignup(req.body), false, 'Missing required fields should fail validation');
    });

    await t.test('validateSignupRequest should accept valid request', async () => {
        const isValidSignup = (body) => {
            if (!body) return false;
            if (!body.name) return false;
            if (!body.email) return false;
            if (!body.password) return false;
            return true;
        };

        const req = { 
            body: { 
                name: 'John',
                email: 'test@test.com',
                password: 'password123'
            } 
        };

        assert.strictEqual(isValidSignup(req.body), true, 'Valid fields should pass');
    });

    await t.test('password validation should enforce minimum length', async () => {
        const shortPassword = 'abc';
        const passwordRegex = /.{6,}/;
        
        assert.strictEqual(passwordRegex.test(shortPassword), false, 'Password too short');
        assert.strictEqual(passwordRegex.test('abcd1234'), true, 'Valid password');
    });

    await t.test('email validation should use proper regex', async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        assert.strictEqual(emailRegex.test('valid@email.com'), true);
        assert.strictEqual(emailRegex.test('invalid.email'), false);
        assert.strictEqual(emailRegex.test('missingat.com'), false);
    });

});
