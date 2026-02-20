const showController = require('../controllers/show.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const showMiddleware = require('../middlewares/show.middlewares');

const routes=(app)=>{
    app.post('/mba/api/v1/shows',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        showMiddleware.validateCreateShowRequest,
        showController.create
    );
    app.get('/mba/api/v1/shows',
        showMiddleware.validateGetShowsRequest,
        showController.getShows
    );
    app.delete('/mba/api/v1/shows/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        showController.destroy
    );

    app.patch('/mba/api/v1/shows/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        showMiddleware.validateUpdateShowRequest,
        showController.update
    );
}

module.exports=routes;