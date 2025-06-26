const userRouter = require('./userAPIs');
const productRouter = require('./productAPIs');
const cartRouter = require('./cartAPIs');

const routes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
};

module.exports = routes;
