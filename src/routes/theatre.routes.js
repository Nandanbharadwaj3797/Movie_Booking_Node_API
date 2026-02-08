const theatreController = require('../controllers/theatre.controller');
const theatreMiddleware = require('../middlewares/theatre.middleware');

const routes = (app) => {

    // routes function takes express app object as parameter

    // create a theatre
    app.post(
        '/mba/api/v1/theatres',
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.create
    );

    // delete a theatre
    app.delete(
        '/mba/api/v1/theatres/:id',
        theatreController.destroy
    );

    // get a theatre
    app.get(
        '/mba/api/v1/theatres/:id',
        theatreController.getTheatre
    );

    // get all theatres
    app.get(
        '/mba/api/v1/theatres',
        theatreController.getTheatres
    );

    // update a theatre partially
    app.patch(
        '/mba/api/v1/theatres/:id',
        theatreController.update
    );

    // update a theatre completely
    app.put(
        '/mba/api/v1/theatres/:id',
        theatreController.update
    );

    // update movies in a theatre
    app.patch(
        '/mba/api/v1/theatres/:id/movies',
        theatreMiddleware.validateUpdateMoviesRequest,
        theatreController.updateMovies
    );
}

module.exports = routes;