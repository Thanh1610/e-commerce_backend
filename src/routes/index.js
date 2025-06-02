const userRouter = require('./userAPIs');
const productRouter = require('./productAPIs');

const routes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
};

module.exports = routes;
