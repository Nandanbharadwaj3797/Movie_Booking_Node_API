const Theatre = require('../models/theatre.model');
const {STATUS} = require('../utils/constants');

/**
 * 
 * @param data -> object containing details of the new theatre to be created
 * @returns -> returns the new theatre object created
 */
const createTheatre = async (data) => {
    try {
        const response = await Theatre.create(data);
        return response;

    } catch (error) {

        if (error.name === 'ValidationError') {

            const validationErrors = {};

            Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });

            throw {
                code: STATUS.UNPROCESSABLE_ENTITY,
                message: validationErrors
            };

        }

        // For all other errors
        throw {
            code: STATUS.INTERNAL_SERVER_ERROR,
            message: error.message
        };

    }
};


/**
 * 
 * @param id -> id of the theatre to be deleted
 * @returns -> whether the theatre is deleted or not
 */
const deleteTheatre = async (id) => {
    try {
        const response = await Theatre.findByIdAndDelete(id);
        if(!response) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param id -> it is the unique _id based on which we will fetch a theatre
 * @returns -> the theatre object for the corresponding id
 */
const getTheatre = async (id) => {
    try {
        const response = await Theatre.findById(id);
        if(!response) {
            // no record found for the given id
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            };
        }
        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param data -> it is the filter object based on which we will fetch the theatres
 * @returns -> list of theatres for the corresponding filter
 */
const getAllTheatres = async (queryParams) => {
    try {
        const {
            page = 1,
            limit = 10,
            city,
            name,
            movieId,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = queryParams;

        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.max(1, parseInt(limit) || 10);


        let query = {};

        if (city) query.city = city;
        if (name) query.name = name;
        if (movieId) query.movies = { $all: movieId };

        const skip = (pageNumber - 1) * limitNumber;

        const sortOptions = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1
        };

        const [totalItems, theatres] = await Promise.all([
            Theatre.countDocuments(query),
            Theatre.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNumber)
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);
        return {
            theatres,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNumber,
                pageSize: limitNumber
            }
        };

    } catch (error) {
        throw error;
    }
};



/** * 
 * @param id -> id of the theatre to be updated
 * @param data -> object containing details of the theatre to be updated
 * @returns -> the updated theatre object
 * // we can use the same function for both put and patch request as in both cases we are updating the theatre details
 */

const updateTheatre = async (id, data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(id, data, {
            new: true, runValidators: true
        });
        if (!response) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            };
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {
                code: STATUS.UNPROCESSABLE_ENTITY,
                message: err
            };

        }
        throw error;
    }
}
/**
 * 
 * @param theatreId -> unique id of the theatre for which we want to update movies
 * @param movieIds -> array of movie ids that are expected to be updated in theatre
 * @param insert -> boolean that tells whether we want insert movies or remove them
 * @returns -> updated theatre object
 */
const updateMoviesInTheatres = async (theatreId, movieIds, insert) => {
    try {
        if (!Array.isArray(movieIds) || movieIds.length === 0) {
            throw {
                code: STATUS.BAD_REQUEST,
                message: "movieIds must be a non-empty array"
            };
        }
        let updateOperation;

        if (insert) {
            updateOperation = {
                $addToSet: { movies: { $each: movieIds } }
            };
        } else {
            updateOperation = {
                $pull: { movies: { $in: movieIds } }
            };
        }

        const theatre = await Theatre.findByIdAndUpdate(
            theatreId,
            updateOperation,
            { new: true }
        );

        if (!theatre) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            };
        }

        return theatre;

    } catch (error) {
        throw error;
    }
};



const getMoviesInATheatre = async (id) => {
    try {
        const theatre = await Theatre.findById(id, {name: 1, movies: 1, address: 1}).populate('movies');
        if(!theatre) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            };

        }
        return theatre;
    } catch (error) {
        throw error;
    }
}

const checkMovieInATheatre = async (theatreId, movieId) => {
    try {
        let response = await Theatre.findById(theatreId);
        if(!response) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No theatre found for the given id"
            };
        }
        return response.movies.some(movie => movie.toString() === movieId);

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatres,
    updateTheatre,
    updateMoviesInTheatres,
    getMoviesInATheatre,
    checkMovieInATheatre
}