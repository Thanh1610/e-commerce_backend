const { createOrder, getOrders, deleteOrder } = require('../controllers/cartController');
const express = require('express');
const cartRouter = express.Router();

cartRouter.post('/create-order', createOrder);
cartRouter.get('/orders', getOrders);
cartRouter.delete('/delete-order/:id', deleteOrder);

module.exports = cartRouter;
