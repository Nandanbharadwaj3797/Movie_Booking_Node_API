const Movie = require('../models/movie.model');

/**
 * 
 * @param data -> object containing details of the new movie to be created
 * @returns -> returns the new movie object created
 */
const createMovie = async (data) => {
    try {
        const movie = await Movie.create(data);
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }
}

/**
 * 
 * @param id -> id of the movie to be deleted
 * @returns -> whether the movie is deleted or not
 */
const deleteMovie = async (id) => {
    try {
        const response = await Movie.findByIdAndDelete(id);
        if(!response) {
            return {
                err: "No movie record found for the id provided",
                code: 404
            }
        }
        return response
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * 
 * @param id -> id of the movie to be fetched
 * @returns -> the movie object for the corresponding id
 */
const getMoviById = async (id) => {
    const movie = await Movie.findById(id);
    if(!movie) {
        return {
            err: "No movie found for the corresponding id provided",
            code: 404
        }
    };
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
        const movie = await Movie.findByIdAndUpdate(id, data, {new: true, runValidators: true});
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }
}

/**
 * 
 * @param filter -> filter object to filter the movies
 * @returns -> list of movies for the corresponding filter
 */
const fetchMovies = async (filter) => {
    let query = {};
    if(filter.name) {
        query.name = filter.name;
    }
    let movies = await Movie.find(query);
    if(!movies) {
        return {
            err: 'Not able to find the queries movies',
            code: 404
        }
    }
    return movies;
}

module.exports = {
    createMovie,
    deleteMovie,
    getMoviById,
    updateMovie,
    fetchMovies
}