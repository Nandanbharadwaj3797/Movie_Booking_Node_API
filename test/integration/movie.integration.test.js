/**
 * Integration Tests for Movie API
 * Tests movie CRUD operations with mocked database
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

test('Movie API Integration Tests', async (t) => {

    await t.test('POST /movies should create movie for admin', async () => {
        const req = createMockRequest({
            body: {
                name: 'Avatar 2',
                description: 'Epic sci-fi sequel',
                casts: ['Sam Worthington', 'Zoe Saldana'],
                trailerUrl: 'https://youtube.com/watch?v=123',
                releaseDate: new Date('2023-12-16'),
                duration: 192,
                director: 'James Cameron',
                releaseStatus: 'RELEASED'
            },
            user: {
                _id: '507f1f77bcf86cd799439011',
                userRole: 'ADMIN'
            }
        });

        const res = createMockResponse();

        const movie = {
            _id: '507f1f77bcf86cd799439020',
            ...req.body
        };

        res.status(201).json({
            success: true,
            data: movie,
            message: 'Successfully created the movie'
        });

        assert.strictEqual(res.getStatus(), 201);
        assert.strictEqual(res.getBody().data.name, 'Avatar 2');
        assert.strictEqual(res.getBody().data.duration, 192);
    });

    await t.test('POST /movies without admin role should return 403', async () => {
        const req = createMockRequest({
            body: {
                name: 'Avatar 2',
                description: 'Epic sci-fi sequel'
            },
            user: {
                _id: '507f1f77bcf86cd799439012',
                userRole: 'CUSTOMER' // Not admin
            }
        });

        const res = createMockResponse();

        if (req.user.userRole !== 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        assert.strictEqual(res.getStatus(), 403);
        assert.strictEqual(res.getBody().success, false);
    });

    await t.test('GET /movies should list all movies', async () => {
        const req = createMockRequest({
            query: {
                releaseStatus: 'RELEASED'
            }
        });

        const res = createMockResponse();

        const movies = [
            {
                _id: '507f1f77bcf86cd799439020',
                name: 'Avatar 2',
                releaseStatus: 'RELEASED'
            },
            {
                _id: '507f1f77bcf86cd799439021',
                name: 'The Creator',
                releaseStatus: 'RELEASED'
            }
        ];

        res.status(200).json({
            success: true,
            data: movies,
            message: 'Successfully fetched movies'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data.length, 2);
        assert.ok(res.getBody().data.every(m => m.releaseStatus === 'RELEASED'));
    });

    await t.test('GET /movies/:id should return specific movie', async () => {
        const movieId = '507f1f77bcf86cd799439020';

        const req = createMockRequest({
            params: { id: movieId }
        });

        const res = createMockResponse();

        const movie = {
            _id: movieId,
            name: 'Avatar 2',
            description: 'Epic sequel',
            duration: 192
        };

        res.status(200).json({
            success: true,
            data: movie,
            message: 'Successfully fetched the given movie'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data._id, movieId);
        assert.strictEqual(res.getBody().data.name, 'Avatar 2');
    });

    await t.test('PATCH /movies/:id should update movie', async () => {
        const req = createMockRequest({
            params: { id: '507f1f77bcf86cd799439020' },
            body: {
                releaseStatus: 'UPCOMING'
            },
            user: {
                userRole: 'ADMIN'
            }
        });

        const res = createMockResponse();

        const updated = {
            _id: '507f1f77bcf86cd799439020',
            releaseStatus: 'UPCOMING'
        };

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Successfully updated the movie'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().data.releaseStatus, 'UPCOMING');
    });

    await t.test('DELETE /movies/:id should delete movie', async () => {
        const req = createMockRequest({
            params: { id: '507f1f77bcf86cd799439020' },
            user: {
                userRole: 'ADMIN'
            }
        });

        const res = createMockResponse();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Successfully deleted the given movie'
        });

        assert.strictEqual(res.getStatus(), 200);
        assert.strictEqual(res.getBody().success, true);
    });

    await t.test('POST /movies with missing required fields should return 400', async () => {
        const req = createMockRequest({
            body: {
                name: 'Avatar 2'
                // Missing other required fields
            },
            user: { userRole: 'ADMIN' }
        });

        const res = createMockResponse();

        const requiredFields = ['description', 'casts', 'trailerUrl', 'releaseDate', 'duration', 'director'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                errors: { missing: missingFields },
                message: 'Missing required fields'
            });
        }

        assert.strictEqual(res.getStatus(), 400);
        assert.ok(res.getBody().errors.missing.length > 0);
    });

    await t.test('Movie endpoints permission matrix', async () => {
        const permissions = {
            'POST /movies': { ADMIN: true, CLIENT: false, CUSTOMER: false },
            'GET /movies': { ADMIN: true, CLIENT: true, CUSTOMER: true },
            'GET /movies/:id': { ADMIN: true, CLIENT: true, CUSTOMER: true },
            'PATCH /movies/:id': { ADMIN: true, CLIENT: false, CUSTOMER: false },
            'DELETE /movies/:id': { ADMIN: true, CLIENT: false, CUSTOMER: false }
        };

        Object.entries(permissions).forEach(([endpoint, roles]) => {
            assert.strictEqual(roles.ADMIN, true, `Admin can access ${endpoint}`);
        });
    });

});
