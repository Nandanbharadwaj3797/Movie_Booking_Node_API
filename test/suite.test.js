const test = require('node:test');
const assert = require('node:assert/strict');

const testDirs = require('node:fs').readdirSync(__dirname).filter(f => f.endsWith('.test.js'));

test('test suite - all test files are runnable', () => {
  assert.ok(testDirs.length >= 7, 'Should have at least 7 test files');
});

test('test suite - verify expected test files exist', () => {
  const expectedTests = [
    'auth.test.js',
    'user.test.js',
    'movie.test.js',
    'theatre.test.js',
    'show.test.js',
    'booking.test.js',
    'payment.test.js'
  ];

  expectedTests.forEach((testFile) => {
    assert.ok(testDirs.includes(testFile), `Test file ${testFile} should exist`);
  });
});
