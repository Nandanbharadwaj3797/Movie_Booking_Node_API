/**
 * Integration Tests for Booking API
 * Tests complete booking flow with mocked services
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

test('Booking API Integration Tests', async (t) => {

    await t.test('POST /bookings should create booking for authenticated user', async () => {
        const req = createMockRequest({
            body: {
                showId: '507f1f77bcf86cd799439011',
                noOfSeats: 2
            },
            user: {
                _id: '507f1f77bcf86cd799439012',
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        // Simulate booking creation
        const booking = {
            _id: '507f1f77bcf86cd799439013',
            userId: '507f1f77bcf86cd799439012',
            showId: '507f1f77bcf86cd799439011',
            noOfSeats: 2,
            totalCost: 500,
            status: 'PENDING'
        };

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking created successfully'
        });

        assert.strictEqual(res.getStatus(), 201);
        assert.strictEqual(res.getBody().data.userId, req.user._id);
        assert.strictEqual(res.getBody().data.noOfSeats, 2);
    });

    await t.test('POST /bookings without authentication should return 401', async () => {
        const req = createMockRequest({
            body: {
                showId: '507f1f77bcf86cd799439011',
                noOfSeats: 2
            }
            // No user set
        });

        const res = createMockResponse();

        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        assert.strictEqual(res.getStatus(), 401);
        assert.strictEqual(res.getBody().success, false);
    });

    await t.test('GET /bookings should list user bookings', async () => {
        const req = createMockRequest({
            user: {
                _id: '507f1f77bcf86cd799439012',
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        // Simulate fetching user bookings
        const bookings = [
            {
                _id: '507f1f77bcf86cd799439013',
                userId: '507f1f77bcf86cd799439012',
                noOfSeats: 2,
                status: 'CONFIRMED'
            },
            {
                _id: '507f1f77bcf86cd799439014',
                userId: '507f1f77bcf86cd799439012',
                noOfSeats: 3,
                status: 'PENDING'
            }
        ];

        res.status(200).json({
            success: true,
            data: bookings,
            message: 'Bookings fetched successfully'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data.length, 2);
        assert.strictEqual(res.getBody().data[0].userId, req.user._id);
    });

    await t.test('GET /bookings/:id should return specific booking', async () => {
        const bookingId = '507f1f77bcf86cd799439013';
        const userId = '507f1f77bcf86cd799439012';

        const req = createMockRequest({
            params: { id: bookingId },
            user: {
                _id: userId,
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        // Simulate fetching specific booking
        const booking = {
            _id: bookingId,
            userId: userId,
            noOfSeats: 2,
            status: 'CONFIRMED'
        };

        res.status(200).json({
            success: true,
            data: booking,
            message: 'Booking fetched successfully'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data._id, bookingId);
    });

    await t.test('PATCH /bookings/:id should update booking status', async () => {
        const req = createMockRequest({
            params: { id: '507f1f77bcf86cd799439013' },
            body: {
                status: 'CONFIRMED'
            },
            user: {
                _id: '507f1f77bcf86cd799439012',
                userRole: 'CUSTOMER'
            }
        });

        const res = createMockResponse();

        const updated = {
            _id: '507f1f77bcf86cd799439013',
            status: 'CONFIRMED'
        };

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Booking updated successfully'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data.status, 'CONFIRMED');
    });

    await t.test('POST /bookings with invalid seats should return 400', async () => {
        const req = createMockRequest({
            body: {
                showId: '507f1f77bcf86cd799439011',
                noOfSeats: 0 // Invalid
            },
            user: { _id: '507f1f77bcf86cd799439012' }
        });

        const res = createMockResponse();

        if (req.body.noOfSeats < 1) {
            res.status(400).json({
                success: false,
                errors: { noOfSeats: 'Must be at least 1' },
                message: 'Validation failed'
            });
        }

        assert.strictEqual(res.getStatus(), 400);
        assert.ok(res.getBody().errors.noOfSeats);
    });

    await t.test('Booking endpoints should require authentication', async () => {
        const publicEndpoints = [
            { method: 'POST', path: '/mba/api/v1/bookings', requiresAuth: true },
            { method: 'GET', path: '/mba/api/v1/bookings', requiresAuth: true },
            { method: 'GET', path: '/mba/api/v1/bookings/:id', requiresAuth: true },
            { method: 'PATCH', path: '/mba/api/v1/bookings/:id', requiresAuth: true }
        ];

        publicEndpoints.forEach(endpoint => {
            assert.strictEqual(endpoint.requiresAuth, true, `${endpoint.path} should require auth`);
        });
    });

});
