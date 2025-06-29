const { createOrder, getOrders, deleteOrder } = require('../controllers/cartController');
const express = require('express');
const auth = require('../middleware/auth');
const userRouter = express.Router();

userRouter.post('/create-order', createOrder);
userRouter.get('/orders', getOrders);
userRouter.delete('/delete-order/:id', deleteOrder);

module.exports = userRouter;
