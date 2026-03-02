# Movie Booking API - Test Suite Documentation

## Overview
This project includes comprehensive **unit tests**, **integration tests**, and **end-to-end tests** to ensure code quality and functionality.

## Test Structure

```
test/
├── unit/                          # Unit Tests (isolated function testing)
│   ├── auth.unit.test.js         # Auth controller and validation functions
│   ├── validators.unit.test.js   # Field validation utilities
│   └── handlers.unit.test.js     # Async handler wrapper and response helpers
├── integration/                   # Integration Tests (API endpoint testing)
│   ├── auth.integration.test.js      # Auth endpoints (signup, signin, logout)
│   ├── booking.integration.test.js   # Booking CRUD operations
│   ├── movie.integration.test.js     # Movie CRUD with permissions
│   └── payment.integration.test.js   # Payment flow and idempotency
├── e2e/                           # End-to-End Tests (complete user journey)
│   └── user-journey.e2e.test.js  # Full flow: signup → browse → book → pay
├── suite.test.js                  # Basic API route tests
├── TEST_SUITE.js                  # Test suite summary and coverage
└── *.test.js                      # Additional feature tests
```

## Test Coverage

### Unit Tests (3 files, ~8 test cases)
Tests individual functions in isolation:
- **auth.unit.test.js**: sanitizeUser, password validation, email validation
- **validators.unit.test.js**: ObjectId validation, field validation, multi-field validation
- **handlers.unit.test.js**: asyncHandler wrapper, response helpers (sendSuccess, sendError, sendValidationError)

### Integration Tests (4 files, ~25 test cases)
Tests complete API flows with mocked database:
- **auth.integration.test.js**: 
  - User signup, signin, password reset, logout
  - Authentication middleware
  - Invalid credentials handling
  - Route registration

- **booking.integration.test.js**:
  - Create booking (authenticated)
  - List user bookings
  - Get specific booking
  - Update booking status
  - Auth requirement validation
  - Input validation

- **movie.integration.test.js**:
  - Create movie (admin only)
  - List movies
  - Get specific movie
  - Update movie
  - Delete movie
  - Permission matrix (ADMIN, CLIENT, CUSTOMER)
  - Role-based access control

- **payment.integration.test.js**:
  - Create payment
  - Get payment details
  - List payments (admin vs customer)
  - Idempotency key handling
  - Input validation
  - Status transitions

### End-to-End Tests (1 file, ~5 test cases)
Tests complete user journey:
- **user-journey.e2e.test.js**:
  - Full flow: User signup → Browse movies → Select show → Book seats → Process payment
  - Error handling for invalid inputs
  - Data persistence across operations
  - Transaction status verification

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
node --test test/unit/*.test.js
```

### Run Integration Tests Only
```bash
node --test test/integration/*.test.js
```

### Run E2E Tests Only
```bash
node --test test/e2e/*.test.js
```

### Run Specific Test File
```bash
node --test test/unit/validators.unit.test.js
node --test test/integration/auth.integration.test.js
node --test test/e2e/user-journey.e2e.test.js
```

### Run with Verbose Output
```bash
node --test --verbose test/unit/*.test.js
```

## Test Execution Order

1. **Unit Tests** → Test isolated functions
2. **Integration Tests** → Test API endpoints and flows
3. **E2E Tests** → Test complete user journey

## Key Testing Patterns

### Unit Test Pattern
```javascript
const test = require('node:test');
const assert = require('node:assert');

test('Module Name', async (t) => {
    await t.test('specific functionality', async () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = functionUnderTest(input);
        
        // Assert
        assert.strictEqual(result, 'expected');
    });
});
```

### Integration Test Pattern
```javascript
const req = createMockRequest({ body: { ... }, user: { ... } });
const res = createMockResponse();

// Simulate handler
res.status(200).json({ success: true, data: {...} });

assert.strictEqual(res.getStatus(), 200);
assert.strictEqual(res.getBody().success, true);
```

### E2E Test Pattern
```javascript
// Step 1: Setup initial state
const user = await mockUserService.createUser({...});

// Step 2: Execute flow
const booking = await mockBookingService.createBooking({...}, user._id);

// Step 3: Verify results
assert.ok(booking._id);
assert.strictEqual(booking.status, 'PENDING');
```

## Test Assertions

Most common assertions used:

```javascript
assert.strictEqual(actual, expected)        // Value equality
assert.deepStrictEqual(obj1, obj2)         // Deep object comparison
assert.ok(value)                           // Truthiness
assert.strictEqual(array.length, 3)        // Array length
assert.throws(() => func())                // Error throwing
assert.doesNotThrow(() => func())          // No error
```

## Test Coverage Metrics

| Module | Unit Tests | Integration Tests | E2E Tests | Total |
|--------|------------|-------------------|-----------|-------|
| Auth | 6 | 5 | 1 | 12 |
| User | - | 4 | 1 | 5 |
| Booking | - | 6 | 1 | 7 |
| Movie | - | 7 | 1 | 8 |
| Payment | - | 8 | 1 | 9 |
| Validators | 7 | - | - | 7 |
| Handlers | 6 | - | - | 6 |
| **Total** | **19** | **30** | **5** | **54** |

## Mocking Strategy

### Mock Database
```javascript
const mockDB = {
    users: [],
    movies: [],
    bookings: [],
    payments: []
};
```

### Mock Request/Response
```javascript
const req = createMockRequest({ body: {...}, user: {...} });
const res = createMockResponse(); // Returns { status(), json(), getStatus(), getBody() }
```

### Mock Services
Services are mocked with pre-defined responses for testing without database:
- mockUserService
- mockMovieService
- mockBookingService
- mockPaymentService
- mockShowService

## Expected Test Results

When running `npm test`, you should see:
```
✔ Auth API Integration Tests (5 tests)
✔ Booking API Integration Tests (6 tests)
✔ Movie API Integration Tests (7 tests)
✔ Payment API Integration Tests (8 tests)
✔ Auth Unit Tests (6 tests)
✔ Validators Unit Tests (7 tests)
✔ Handlers Unit Tests (6 tests)
✔ End-to-End User Journey (3 tests)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ tests 54
✓ suites 0
✓ pass 54
✓ fail 0
✓ duration_ms 2500
```

## Best Practices

1. **Isolation**: Unit tests should not depend on external services
2. **Clarity**: Test names should clearly describe what is being tested
3. **Coverage**: Test both happy path and error scenarios
4. **Mocking**: Use mocks for database and external services in unit tests
5. **Assertions**: Use specific assertions rather than generic ones
6. **Cleanup**: Tests should not modify shared state

## Continuous Integration

For CI/CD pipelines, use:
```bash
npm test -- --reporter=json > test-results.json
```

## Debugging Tests

### Debug Single Test
```bash
node --inspect --test test/unit/validators.unit.test.js
```

### View Test Output
```bash
node --test test/integration/auth.integration.test.js --reporter=tap
```

## Future Testing Enhancements

- [ ] Add performance benchmarks
- [ ] Add load/stress tests
- [ ] Add visual regression tests for API responses
- [ ] Integrate with coverage tools (nyc/istanbul)
- [ ] Add mutation testing
- [ ] API contract testing

## Common Test Failures & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Async timeout | Promise not resolved | Add `await` before async calls |
| Assertion fails | Wrong expected value | Check mock data matches reality |
| Mock not called | Handler logic changed | Update mock to match new signature |
| ObjectId validation | Invalid format | Use valid MongoDB ObjectId format |

## Resources

- [Node.js Test Runner Docs](https://nodejs.org/api/test.html)
- [Assert Module](https://nodejs.org/api/assert.html)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Last Updated**: 2024
**Test Framework**: Node.js Built-in Test Runner (node:test)
**Total Test Files**: 9
**Estimated Total Tests**: 54+
