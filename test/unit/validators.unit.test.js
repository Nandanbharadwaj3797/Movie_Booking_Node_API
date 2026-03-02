/**
 * Unit Tests for Validators Utility
 * Tests field validation functions
 */
const test = require('node:test');
const assert = require('node:assert');
const { isValidObjectId, validateField, validateFields } = require('../../src/utils/validators');

test('Validators Unit Tests', async (t) => {

    await t.test('isValidObjectId should validate MongoDB ObjectIds', async () => {
        const validId = '507f1f77bcf86cd799439011';
        const invalidId = 'not-an-objectid';
        const anotherId = '507f1f77bcf86cd799439012';

        assert.strictEqual(isValidObjectId(validId), true, 'Valid ID should pass');
        assert.strictEqual(isValidObjectId(invalidId), false, 'Invalid ID should fail');
        assert.strictEqual(isValidObjectId(anotherId), true, 'Another valid ID should pass');
    });

    await t.test('validateField should validate required strings', async () => {
        const error1 = validateField('', 'name', 'string');
        const error2 = validateField('John', 'name', 'string');
        const error3 = validateField(123, 'name', 'string');

        assert.ok(error1, 'Empty string should have error');
        assert.strictEqual(error2, null, 'Valid string should have no error');
        assert.ok(error3, 'Non-string should have error');
    });

    await t.test('validateField should validate numbers', async () => {
        const error1 = validateField(1, 'age', 'number');
        const error2 = validateField(25, 'age', 'number');
        const error3 = validateField(-5, 'age', 'number');
        const error4 = validateField('twenty', 'age', 'number');
        const error5 = validateField(null, 'age', 'number');

        assert.strictEqual(error1, null, 'Positive number should be valid');
        assert.strictEqual(error2, null, 'Positive number should be valid');
        assert.ok(error3, 'Negative number should error');
        assert.ok(error4, 'Non-number should error');
        assert.ok(error5, 'Null should error');
    });

    await t.test('validateField should validate arrays', async () => {
        const error1 = validateField([], 'tags', 'array');
        const error2 = validateField(['tag1'], 'tags', 'array');
        const error3 = validateField('not-array', 'tags', 'array');
        const error4 = validateField(null, 'tags', 'array');

        assert.ok(error1, 'Empty array should error');
        assert.strictEqual(error2, null, 'Non-empty array should be valid');
        assert.ok(error3, 'Non-array should error');
        assert.ok(error4, 'Null should error');
    });

    await t.test('validateField should validate ObjectIds', async () => {
        const validId = '507f1f77bcf86cd799439011';
        const invalidId = 'not-valid';

        const error1 = validateField(validId, 'userId', 'objectId');
        const error2 = validateField(invalidId, 'userId', 'objectId');
        const error3 = validateField(null, 'userId', 'objectId');

        assert.strictEqual(error1, null, 'Valid ObjectId should be valid');
        assert.ok(error2, 'Invalid ObjectId should error');
        assert.ok(error3, 'Null ObjectId should error');
    });

    await t.test('validateFields should validate multiple fields', async () => {
        const data = {
            name: 'John',
            email: 'john@example.com',
            age: 30
        };

        const schema = {
            name: 'string',
            email: 'string',
            age: 'number'
        };

        const result = validateFields(data, schema);

        assert.strictEqual(result.isValid, true, 'All valid fields should pass');
        assert.deepStrictEqual(result.errors, {}, 'No errors should be present');
    });

    await t.test('validateFields should catch missing fields', async () => {
        const data = {
            name: 'John'
            // email missing
        };

        const schema = {
            name: 'string',
            email: 'string'
        };

        const result = validateFields(data, schema);

        assert.strictEqual(result.isValid, false, 'Missing email should fail');
        assert.ok(result.errors.email, 'Should have email error');
        assert.strictEqual(result.errors.name, undefined, 'Valid name should have no error');
    });

    await t.test('validateFields should catch invalid types', async () => {
        const data = {
            name: 123, // should be string
            count: 'not-a-number' // should be number
        };

        const schema = {
            name: 'string',
            count: 'number'
        };

        const result = validateFields(data, schema);

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.name, 'Should have name type error');
        assert.ok(result.errors.count, 'Should have count type error');
    });

});
