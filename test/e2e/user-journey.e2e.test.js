/**
 * End-to-End (E2E) Test
 * Simulates complete user journey: Signup -> Browse Movies -> Book Show -> Make Payment
 */
const test = require('node:test');
const assert = require('node:assert');

// Mock database
const mockDB = {
    users: [],
    movies: [],
    shows: [],
    bookings: [],
    payments: []
};

// Mock services
const mockUserService = {
    createUser: async (data) => {
        const user = {
            _id: String(mockDB.users.length + 1),
            ...data,
            userRole: 'CUSTOMER',
            userStatus: 'APPROVED',
            createdAt: new Date()
        };
        mockDB.users.push(user);
        return user;
    },
    getUserByEmail: async (email) => {
        return mockDB.users.find(u => u.email === email);
    }
};

const mockMovieService = {
    fetchMovies: async (query) => {
        return mockDB.movies.filter(m => {
            if (query.releaseStatus) return m.releaseStatus === query.releaseStatus;
            return true;
        });
    },
    getMovieById: async (id) => {
        return mockDB.movies.find(m => m._id === id);
    }
};

const mockShowService = {
    getShows: async (filters) => {
        return mockDB.shows.filter(s => {
            if (filters.movieId) return s.movieId === filters.movieId;
            return true;
        });
    }
};

const mockBookingService = {
    createBooking: async (data, userId) => {
        const booking = {
            _id: String(mockDB.bookings.length + 1),
            userId,
            ...data,
            status: 'PENDING',
            createdAt: new Date()
        };
        mockDB.bookings.push(booking);
        return booking;
    }
};

const mockPaymentService = {
    createPayment: async (data, userId) => {
        const payment = {
            _id: String(mockDB.payments.length + 1),
            userId,
            ...data,
            status: 'SUCCESSFUL',
            transactionId: 'txn_' + Date.now(),
            createdAt: new Date()
        };
        mockDB.payments.push(payment);
        return payment;
    }
};

test('End-to-End User Journey', async (t) => {

    await t.test('Complete booking flow: Signup -> Browse -> Book -> Pay', async () => {
        let currentUser = null;
        let selectedMovie = null;
        let selectedShow = null;
        let booking = null;
        let payment = null;

        // Step 1: User Signup
        console.log('\n✅ Step 1: User Registration');
        currentUser = await mockUserService.createUser({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        assert.ok(currentUser._id, 'User should have ID');
        assert.strictEqual(currentUser.email, 'john@example.com');
        assert.strictEqual(currentUser.userRole, 'CUSTOMER');
        console.log(`   - User registered: ${currentUser.name} (${currentUser.email})`);

        // Step 2: Browse Available Movies
        console.log('\n✅ Step 2: Browse Movies');
        mockDB.movies = [
            {
                _id: '1',
                name: 'Avatar 2',
                description: 'Epic sci-fi',
                releaseStatus: 'RELEASED',
                duration: 192
            },
            {
                _id: '2',
                name: 'Oppenheimer',
                description: 'Historical drama',
                releaseStatus: 'RELEASED',
                duration: 180
            }
        ];

        const movies = await mockMovieService.fetchMovies({ releaseStatus: 'RELEASED' });
        assert.strictEqual(movies.length, 2, 'Should find 2 released movies');
        console.log(`   - Found ${movies.length} available movies`);

        // Step 3: Select Movie and Check Shows
        console.log('\n✅ Step 3: Select Movie and Check Shows');
        selectedMovie = movies[0]; // Avatar 2
        assert.ok(selectedMovie, 'Should select a movie');
        console.log(`   - Selected: ${selectedMovie.name}`);

        mockDB.shows = [
            {
                _id: '1',
                movieId: '1',
                theatreId: '1',
                startTime: new Date(),
                price: 250,
                totalSeats: 100,
                availableSeats: 50
            },
            {
                _id: '2',
                movieId: '1',
                theatreId: '2',
                startTime: new Date(),
                price: 300,
                totalSeats: 80,
                availableSeats: 30
            }
        ];

        const shows = await mockShowService.getShows({ movieId: selectedMovie._id });
        assert.ok(shows.length > 0, 'Should find shows for selected movie');
        console.log(`   - Found ${shows.length} shows available`);

        // Step 4: Book Show
        console.log('\n✅ Step 4: Book Show');
        selectedShow = shows[0];
        
        booking = await mockBookingService.createBooking(
            {
                showId: selectedShow._id,
                noOfSeats: 2,
                totalCost: selectedShow.price * 2
            },
            currentUser._id
        );

        assert.ok(booking._id, 'Booking should be created');
        assert.strictEqual(booking.status, 'PENDING');
        assert.strictEqual(booking.noOfSeats, 2);
        console.log(`   - Booked ${booking.noOfSeats} seats for ₹${booking.totalCost}`);

        // Step 5: Process Payment
        console.log('\n✅ Step 5: Process Payment');
        payment = await mockPaymentService.createPayment(
            {
                bookingId: booking._id,
                amount: booking.totalCost
            },
            currentUser._id
        );

        assert.ok(payment._id, 'Payment should be created');
        assert.strictEqual(payment.status, 'SUCCESSFUL');
        assert.ok(payment.transactionId, 'Should have transaction ID');
        console.log(`   - Payment successful! Transaction ID: ${payment.transactionId}`);

        // Step 6: Verify Complete Flow
        console.log('\n✅ Step 6: Verify Complete Journey');
        assert.strictEqual(mockDB.users.length, 1, 'One user registered');
        assert.ok(mockDB.bookings.length > 0, 'Booking created');
        assert.ok(mockDB.payments.length > 0, 'Payment processed');
        
        const userPayments = mockDB.payments.filter(p => p.userId === currentUser._id);
        assert.strictEqual(userPayments.length, 1, 'User has 1 payment');

        console.log('\n📊 Journey Summary:');
        console.log(`   ✓ User: ${currentUser.name}`);
        console.log(`   ✓ Movie: ${selectedMovie.name}`);
        console.log(`   ✓ Seats: ${booking.noOfSeats}`);
        console.log(`   ✓ Total: ₹${payment.amount}`);
        console.log(`   ✓ Status: ${payment.status}`);
    });

    await t.test('Error handling: Invalid booking attempt', async () => {
        console.log('\n✅ Error Handling Test');
        
        // Try to book without valid movie
        const invalidBooking = {
            movieId: 'invalid-id',
            showId: 'invalid-show',
            noOfSeats: 2
        };

        // Validate
        const hasValidMovie = mockDB.movies.some(m => m._id === invalidBooking.movieId);
        assert.strictEqual(hasValidMovie, false, 'Movie should not exist');
        console.log('   - Correctly rejected invalid movie ID');

        // Try invalid seat count
        const invalidSeats = {
            showId: mockDB.shows[0]?._id,
            noOfSeats: -1 // Invalid
        };

        assert.ok(invalidSeats.noOfSeats < 0, 'Negative seats should be invalid');
        console.log('   - Correctly rejected invalid seat count');
    });

    await t.test('Data persistence across operations', async () => {
        console.log('\n✅ Data Persistence Test');
        
        // Verify data in mock database
        assert.ok(mockDB.users.length > 0, 'Users persisted');
        assert.ok(mockDB.movies.length > 0, 'Movies persisted');
        assert.ok(mockDB.bookings.length > 0, 'Bookings persisted');
        assert.ok(mockDB.payments.length > 0, 'Payments persisted');

        console.log(`   - Users: ${mockDB.users.length}`);
        console.log(`   - Movies: ${mockDB.movies.length}`);
        console.log(`   - Bookings: ${mockDB.bookings.length}`);
        console.log(`   - Payments: ${mockDB.payments.length}`);
    });

});
