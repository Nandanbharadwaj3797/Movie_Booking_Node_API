const TheatreClient = require('./theatre.client');

/**
 * Example usage of Theatre Client for Admin Operations
 */

// Initialize client with admin token
const adminToken = 'your_admin_jwt_token_here';
const theatreClient = new TheatreClient(adminToken);

/**
 * Example 1: Get all pending theatres for approval
 */
async function getPendingTheatres() {
    try {
        console.log('Fetching pending theatres...');
        const response = await theatreClient.getPendingTheatres();
        console.log('Pending theatres:', response.data.theatres);
        return response;
    } catch (error) {
        console.error('Error fetching pending theatres:', error.message);
    }
}

/**
 * Example 2: Approve a theatre
 */
async function approveTheatre(theatreId) {
    try {
        console.log(`Approving theatre: ${theatreId}`);
        const response = await theatreClient.approveTheatre(theatreId);
        console.log('Theatre approved:', response.data);
        return response;
    } catch (error) {
        console.error('Error approving theatre:', error.message);
    }
}

/**
 * Example 3: Reject a theatre
 */
async function rejectTheatre(theatreId) {
    try {
        console.log(`Rejecting theatre: ${theatreId}`);
        const response = await theatreClient.rejectTheatre(theatreId);
        console.log('Theatre rejected:', response.data);
        return response;
    } catch (error) {
        console.error('Error rejecting theatre:', error.message);
    }
}

/**
 * Example 4: Get theatre details
 */
async function getTheatreDetails(theatreId) {
    try {
        console.log(`Fetching theatre details: ${theatreId}`);
        const response = await theatreClient.getTheatreByID(theatreId);
        console.log('Theatre details:', response.data);
        return response;
    } catch (error) {
        console.error('Error fetching theatre details:', error.message);
    }
}

/**
 * Example 5: Admin approval workflow
 */
async function adminApprovalWorkflow() {
    try {
        console.log('=== Admin Theatre Approval Workflow ===\n');

        // Step 1: Get all pending theatres
        console.log('Step 1: Fetching pending theatres for review...');
        const pendingResponse = await theatreClient.getPendingTheatres();
        const pendingTheatres = pendingResponse.data.theatres;
        console.log(`Found ${pendingTheatres.length} pending theatres\n`);

        // Step 2: Review each theatre
        for (const theatre of pendingTheatres) {
            console.log(`Reviewing theatre: ${theatre.name}`);
            console.log(`- City: ${theatre.city}`);
            console.log(`- License: ${theatre.licenseNumber}`);
            console.log(`- Owner: ${theatre.owner}`);
            console.log('---');

            // Simulate approval decision (in real scenario, this would be based on admin decision)
            const shouldApprove = theatre.licenseNumber && theatre.city; // dummy check
            
            if (shouldApprove) {
                console.log(`✓ Approving theatre: ${theatre.name}`);
                await theatreClient.approveTheatre(theatre._id);
            } else {
                console.log(`✗ Rejecting theatre: ${theatre.name}`);
                await theatreClient.rejectTheatre(theatre._id);
            }
            console.log('');
        }

        console.log('=== Workflow completed ===');
    } catch (error) {
        console.error('Error in workflow:', error.message);
    }
}

/**
 * Example 6: Get all theatres with pagination
 */
async function getAllTheatres(page = 1, limit = 10) {
    try {
        console.log(`Fetching theatres (page: ${page}, limit: ${limit})...`);
        const response = await theatreClient.getAllTheatres({
            page,
            limit,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        console.log('Theatres retrieved:', response.data);
        return response;
    } catch (error) {
        console.error('Error fetching theatres:', error.message);
    }
}

// Export functions for use in other files
module.exports = {
    theatreClient,
    getPendingTheatres,
    approveTheatre,
    rejectTheatre,
    getTheatreDetails,
    adminApprovalWorkflow,
    getAllTheatres
};

// Example: Run workflow
// Note: Uncomment the line below to run the example
// adminApprovalWorkflow().catch(console.error);
