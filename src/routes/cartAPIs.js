const { createOrder, getOrders, deleteOrder, getAllOrders } = require('../controllers/cartController');
const express = require('express');
const cartRouter = express.Router();

cartRouter.post('/create-order', createOrder);
cartRouter.get('/orders', getOrders);
cartRouter.delete('/delete-order/:id', deleteOrder);
cartRouter.get('/get-all-order', getAllOrders);

module.exports = cartRouter;
