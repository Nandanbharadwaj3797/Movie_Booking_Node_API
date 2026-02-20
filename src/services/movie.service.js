const Movie = require('../models/movie.model');
const { STATUS } = require('../utils/constants');

/**
 * 
 * @param data -> object containing details of the new movie to be created
 * @returns -> returns the new movie object created
 */
const createMovie = async (data) => {
    try {
        const response = await Movie.create(data);
        return response;
    } catch (error) {
        if (error.name === 'ValidationError') {
            const err = {};
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
};


/**
 * 
 * @param id -> id of the movie to be deleted
 * @returns -> whether the movie is deleted or not
 */
const deleteMovie = async (id) => {
    try {
        const response = await Movie.findByIdAndDelete(id);
        if (!response) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No movie record found for the id provided"
            };
        }

        return response
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param id -> id of the movie to be fetched
 * @returns -> the movie object for the corresponding id
 */
const getMovieById = async (id) => {
    const movie = await Movie.findById(id);
    if (!movie) {
        throw {
            code: STATUS.NOT_FOUND,
            message: "No movie found for the corresponding id provided"
        };
    }
    return movie;
}

/**
 * 
 * @param id -> id of the movie to be updated
 * @param data -> object containing details of the movie to be updated
 * @returns -> the updated movie object
 */

const updateMovie = async (id, data) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!movie) {
            throw {
                code: STATUS.NOT_FOUND,
                message: "No movie found for the given id"
            };
        }

        return movie;

    } catch (error) {
        if (error.name === 'ValidationError') {
            const err = {};
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
};


/**
 * 
 * @param filter -> filter object to filter the movies
 * @returns -> list of movies for the corresponding filter
 */
const fetchMovies = async (filter) => {
    const query = {};

    if (filter.name) {
        query.name = filter.name;
    }

    return await Movie.find(query);
};


module.exports = {
    createMovie,
    deleteMovie,
    getMovieById,
    updateMovie,
    fetchMovies
}