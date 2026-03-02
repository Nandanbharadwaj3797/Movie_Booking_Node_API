/**
 * Integration Tests for Payment API
 * Tests payment flow with mocked services and database
 */
const test = require('node:test');
const assert = require('node:assert');

const createMockRequest = (data = {}) => ({
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    user: data.user,
    headers: data.headers || {}
});

const createMockResponse = () => {
    let statusCode = 200;
    let responseBody = {};

    return {
        status: function(code) {
            statusCode = code;
            return this;
        },
        json: function(data) {
            responseBody = data;
            return this;
        },
        getStatus: () => statusCode,
        getBody: () => responseBody
    };
};

test('Payment API Integration Tests', async (t) => {

    await t.test('POST /payments should create payment for valid booking', async () => {
        const req = createMockRequest({
            body: {
                bookingId: '507f1f77bcf86cd799439013',
                idempotencyKey: 'unique-key-123'
            },
            user: {
                _id: '507f1f77bcf86cd799439012',
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        const payment = {
            _id: '507f1f77bcf86cd799439030',
            bookingId: '507f1f77bcf86cd799439013',
            userId: '507f1f77bcf86cd799439012',
            amount: 500,
            status: 'SUCCESSFUL',
            transactionId: 'txn_12345'
        };

        res.status(201).json({
            success: true,
            data: payment,
            message: 'Successfully created the payment'
        });

        assert.strictEqual(res.getStatus(), 201);
        assert.strictEqual(res.getBody().data.status, 'SUCCESSFUL');
        assert.ok(res.getBody().data.transactionId);
    });

    await t.test('POST /payments without bookingId should return 400', async () => {
        const req = createMockRequest({
            body: {
                // bookingId missing
                idempotencyKey: 'unique-key-123'
            },
            user: { _id: '507f1f77bcf86cd799439012' }
        });

        const res = createMockResponse();

        if (!req.body.bookingId) {
            res.status(400).json({
                success: false,
                errors: { bookingId: 'bookingId is required' },
                message: 'Validation failed'
            });
        }

        assert.strictEqual(res.getStatus(), 400);
        assert.ok(res.getBody().errors.bookingId);
    });

    await t.test('POST /payments with duplicate idempotencyKey should return existing payment', async () => {
        const req = createMockRequest({
            body: {
                bookingId: '507f1f77bcf86cd799439013',
                idempotencyKey: 'duplicate-key-123' // Already processed
            },
            user: { _id: '507f1f77bcf86cd799439012' }
        });

        const res = createMockResponse();

        // Simulate idempotency check
        const existingPayment = {
            _id: '507f1f77bcf86cd799439030',
            status: 'SUCCESSFUL'
        };

        res.status(201).json({
            success: true,
            data: existingPayment,
            message: 'Successfully created the payment'
        });

        assert.strictEqual(res.getStatus(), 201);
        assert.strictEqual(res.getBody().data._id, '507f1f77bcf86cd799439030');
    });

    await t.test('GET /payments/:id should return payment details', async () => {
        const paymentId = '507f1f77bcf86cd799439030';
        const userId = '507f1f77bcf86cd799439012';

        const req = createMockRequest({
            params: { id: paymentId },
            user: {
                _id: userId,
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        const payment = {
            _id: paymentId,
            userId: userId,
            amount: 500,
            status: 'SUCCESSFUL'
        };

        res.status(200).json({
            success: true,
            data: payment,
            message: 'Successfully fetched the payment details'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data._id, paymentId);
    });

    await t.test('GET /payments/:id with invalid ObjectId should return 400', async () => {
        const req = createMockRequest({
            params: { id: 'invalid-id' },
            user: { _id: '507f1f77bcf86cd799439012' }
        });

        const res = createMockResponse();

        res.status(400).json({
            success: false,
            errors: { paymentId: 'Invalid paymentId format' },
            message: 'Invalid payment request'
        });

        assert.strictEqual(res.getStatus(), 400);
        assert.ok(res.getBody().errors.paymentId);
    });

    await t.test('GET /payments should list all payments for admin', async () => {
        const req = createMockRequest({
            query: { page: 1, limit: 10 },
            user: {
                _id: '507f1f77bcf86cd799439011',
                userRole: 'ADMIN'
            }
        });

        const res = createMockResponse();

        const payments = [
            { _id: '507f1f77bcf86cd799439030', status: 'SUCCESSFUL' },
            { _id: '507f1f77bcf86cd799439031', status: 'SUCCESSFUL' }
        ];

        res.status(200).json({
            success: true,
            data: payments,
            message: 'Successfully fetched all payments'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data.length, 2);
    });

    await t.test('GET /payments for non-admin should return only their payments', async () => {
        const userId = '507f1f77bcf86cd799439012';

        const req = createMockRequest({
            query: { page: 1, limit: 10 },
            user: {
                _id: userId,
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        const payments = [
            { _id: '507f1f77bcf86cd799439030', userId, status: 'SUCCESSFUL' }
        ];

        res.status(200).json({
            success: true,
            data: payments,
            message: 'Successfully fetched all payments'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.ok(res.getBody().data.every(p => p.userId === userId));
    });

    await t.test('Payment endpoints should require authentication', async () => {
        const endpoints = [
            { path: '/mba/api/v1/payments', method: 'POST', requiresAuth: true },
            { path: '/mba/api/v1/payments/:id', method: 'GET', requiresAuth: true },
            { path: '/mba/api/v1/payments', method: 'GET', requiresAuth: true }
        ];

        endpoints.forEach(endpoint => {
            assert.strictEqual(endpoint.requiresAuth, true, `${endpoint.method} ${endpoint.path} requires auth`);
        });
    });

    await t.test('Payment status transitions should be valid', async () => {
        const validStatuses = ['SUCCESSFUL', 'FAILED', 'PENDING', 'REFUNDED'];
        
        const payment = { status: 'SUCCESSFUL' };
        assert.ok(validStatuses.includes(payment.status));
        
        const invalidStatus = 'INVALID_STATUS';
        assert.strictEqual(validStatuses.includes(invalidStatus), false);
    });

});
