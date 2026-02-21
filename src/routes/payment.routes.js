const paymentController=require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const paymentMiddleware = require('../middlewares/payment.middlewares');

const routes=(app)=>{
    app.post('/api/v1/payments',
        authMiddleware.isAuthenticated,
        paymentMiddleware.verifyPaymentCreateRequest,
        paymentController.create
    );
}

module.exports=routes;