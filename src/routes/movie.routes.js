const movieController = require('../controllers/movie.controller');
const movieMiddlewares = require('../middlewares/movie.middlewares');
const authMiddlewares = require('../middlewares/auth.middlewares');

const routes = (app) => {
    // routes function takes express app object as parameter

    // create a movie
    app.post('/mba/api/v1/movies',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieMiddlewares.validateMovieCreateRequest,
        movieController.createMovie
    );

    // delete a movie
    app.delete(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.deleteMovie
    );

    // get a movie
    app.get(
        '/mba/api/v1/movies/:id',
        movieController.getMovie
    );

    // update a movie completely
    app.put(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.updateMovie
    );

    // update a movie partially
    app.patch(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.updateMovie
    );

    // get all movies
    app.get(
        '/mba/api/v1/movies',
        movieController.getMovies
    );
}

module.exports = routes;