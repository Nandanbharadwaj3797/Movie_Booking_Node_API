/**
 * Unit Tests for Handlers Utility
 * Tests async handler wrapper and response helpers
 */
const test = require('node:test');
const assert = require('node:assert');

// Mock handlers
const { asyncHandler, sendSuccess, sendError, sendValidationError } = require('../../src/utils/handlers');
const { STATUS } = require('../../src/utils/constants');

test('Handlers Unit Tests', async (t) => {

    await t.test('asyncHandler should call handler with req, res, next', async () => {
        let handlerCalled = false;
        let handlerReq, handlerRes, handlerNext;

        const mockHandler = async (req, res, next) => {
            handlerCalled = true;
            handlerReq = req;
            handlerRes = res;
            handlerNext = next;
        };

        const wrapped = asyncHandler(mockHandler);
        const mockReq = { body: {} };
        const mockRes = {};
        const mockNext = () => {};

        await wrapped(mockReq, mockRes, mockNext);

        assert.strictEqual(handlerCalled, true, 'Handler should be called');
        assert.strictEqual(handlerReq, mockReq, 'Correct req passed');
        assert.strictEqual(handlerRes, mockRes, 'Correct res passed');
    });

    await t.test('asyncHandler should catch errors and call next with error', async () => {
        const testError = new Error('Test error');
        let errorCaught;

        const mockHandler = async (req, res, next) => {
            throw testError;
        };

        const wrapped = asyncHandler(mockHandler);
        const mockReq = {};
        const mockRes = {};
        const mockNext = (error) => {
            errorCaught = error;
        };

        await wrapped(mockReq, mockRes, mockNext);

        assert.strictEqual(errorCaught, testError, 'Error should be passed to next');
    });

    await t.test('sendSuccess should format response correctly', async () => {
        let statusCode, jsonResponse;

        const mockRes = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        jsonResponse = data;
                    }
                };
            }
        };

        const data = { id: 1, name: 'Test' };
        sendSuccess(mockRes, STATUS.CREATED, data, 'Created successfully');

        assert.strictEqual(statusCode, STATUS.CREATED);
        assert.strictEqual(jsonResponse.success, true);
        assert.strictEqual(jsonResponse.message, 'Created successfully');
        assert.deepStrictEqual(jsonResponse.data, data);
        assert.deepStrictEqual(jsonResponse.err, {});
    });

    await t.test('sendSuccess should use default values', async () => {
        let statusCode, jsonResponse;

        const mockRes = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        jsonResponse = data;
                    }
                };
            }
        };

        sendSuccess(mockRes);

        assert.strictEqual(statusCode, STATUS.OK);
        assert.deepStrictEqual(jsonResponse.data, {});
        assert.strictEqual(jsonResponse.message, 'Success');
    });

    await t.test('sendError should format error response correctly', async () => {
        let statusCode, jsonResponse;

        const mockRes = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        jsonResponse = data;
                    }
                };
            }
        };

        const error = { field: 'email', issue: 'already exists' };
        sendError(mockRes, STATUS.CONFLICT, error, 'Conflict');

        assert.strictEqual(statusCode, STATUS.CONFLICT);
        assert.strictEqual(jsonResponse.success, false);
        assert.deepStrictEqual(jsonResponse.err, error);
        assert.strictEqual(jsonResponse.message, 'Conflict');
        assert.deepStrictEqual(jsonResponse.data, {});
    });

    await t.test('sendValidationError should create BAD_REQUEST response', async () => {
        let statusCode, jsonResponse;

        const mockRes = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        jsonResponse = data;
                    }
                };
            }
        };

        const errors = { name: 'Required', email: 'Invalid format' };
        sendValidationError(mockRes, errors, 'Validation failed');

        assert.strictEqual(statusCode, STATUS.BAD_REQUEST);
        assert.strictEqual(jsonResponse.success, false);
        assert.deepStrictEqual(jsonResponse.err, errors);
        assert.strictEqual(jsonResponse.message, 'Validation failed');
    });

    await t.test('sendValidationError should use default message', async () => {
        let jsonResponse;

        const mockRes = {
            status: () => ({
                json: (data) => {
                    jsonResponse = data;
                }
            })
        };

        const errors = { age: 'Must be a number' };
        sendValidationError(mockRes, errors);

        assert.strictEqual(jsonResponse.message, 'Validation failed');
    });

});
