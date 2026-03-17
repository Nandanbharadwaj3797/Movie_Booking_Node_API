const axios = require('axios');

const THEATRE_API_BASE_URL = process.env.THEATRE_API_URL || 'http://localhost:5000/mba/api/v1/theatres';

/**
 * Theatre API Client for admin approval operations
 */
class TheatreClient {
    /**
     * Initialize client with auth token
     * @param {string} token - JWT token for authentication
     */
    constructor(token) {
        this.token = token;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Create a new theatre
     * @param {Object} theatreData - Theatre details
     * @returns {Promise} - Response with created theatre
     */
    async createTheatre(theatreData) {
        try {
            const response = await axios.post(
                THEATRE_API_BASE_URL,
                theatreData,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Get all theatres with filters
     * @param {Object} queryParams - Query parameters (page, limit, city, name, etc.)
     * @returns {Promise} - Response with theatres list
     */
    async getAllTheatres(queryParams = {}) {
        try {
            const response = await axios.get(
                THEATRE_API_BASE_URL,
                {
                    params: queryParams,
                    headers: this.headers
                }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Get pending theatres (only for admin)
     * @returns {Promise} - Response with pending theatres
     */
    async getPendingTheatres() {
        return this.getAllTheatres({ status: 'PENDING' });
    }

    /**
     * Get a single theatre by ID
     * @param {string} theatreId - Theatre ID
     * @returns {Promise} - Response with theatre details
     */
    async getTheatreByID(theatreId) {
        try {
            const response = await axios.get(
                `${THEATRE_API_BASE_URL}/${theatreId}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Approve a theatre (Admin only)
     * @param {string} theatreId - Theatre ID to approve
     * @returns {Promise} - Response with updated theatre
     */
    async approveTheatre(theatreId) {
        try {
            const response = await axios.patch(
                `${THEATRE_API_BASE_URL}/${theatreId}/approve`,
                { status: 'APPROVED' },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Reject a theatre (Admin only)
     * @param {string} theatreId - Theatre ID to reject
     * @returns {Promise} - Response with updated theatre
     */
    async rejectTheatre(theatreId) {
        try {
            const response = await axios.patch(
                `${THEATRE_API_BASE_URL}/${theatreId}/approve`,
                { status: 'REJECTED' },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Update theatre details
     * @param {string} theatreId - Theatre ID
     * @param {Object} updateData - Data to update
     * @returns {Promise} - Response with updated theatre
     */
    async updateTheatre(theatreId, updateData) {
        try {
            const response = await axios.patch(
                `${THEATRE_API_BASE_URL}/${theatreId}`,
                updateData,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Delete a theatre
     * @param {string} theatreId - Theatre ID to delete
     * @returns {Promise} - Response with deletion status
     */
    async deleteTheatre(theatreId) {
        try {
            const response = await axios.delete(
                `${THEATRE_API_BASE_URL}/${theatreId}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Add movies to a theatre
     * @param {string} theatreId - Theatre ID
     * @param {Array} movieIds - Array of movie IDs to add
     * @returns {Promise} - Response with updated theatre
     */
    async addMoviesToTheatre(theatreId, movieIds) {
        try {
            const response = await axios.patch(
                `${THEATRE_API_BASE_URL}/${theatreId}/movies`,
                { movieIds, insert: true },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Remove movies from a theatre
     * @param {string} theatreId - Theatre ID
     * @param {Array} movieIds - Array of movie IDs to remove
     * @returns {Promise} - Response with updated theatre
     */
    async removeMoviesFromTheatre(theatreId, movieIds) {
        try {
            const response = await axios.patch(
                `${THEATRE_API_BASE_URL}/${theatreId}/movies`,
                { movieIds, insert: false },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Handle errors from API calls
     * @private
     * @param {Error} error - Error object
     * @returns {Error} - Formatted error message
     */
    _handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || 'An error occurred';
            const err = new Error(message);
            err.status = status;
            err.details = data?.details;
            return err;
        } else if (error.request) {
            const err = new Error('No response received from server');
            err.status = 503;
            return err;
        } else {
            return new Error(error.message);
        }
    }
}

module.exports = TheatreClient;
