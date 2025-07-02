const {
    createOrder,
    getOrders,
    deleteOrder,
    getAllOrders,
    deleteMany,
    updateStatus,
} = require('../controllers/cartController');
const auth = require('../middleware/auth');
const express = require('express');
const cartRouter = express.Router();

cartRouter.post('/create-order', createOrder);
cartRouter.get('/orders', getOrders);
cartRouter.delete('/delete-order/:id', deleteOrder);
cartRouter.get('/get-all-order', auth, getAllOrders);
cartRouter.delete('/delete-many', auth, deleteMany);
cartRouter.patch('/update-status/:id', auth, updateStatus);

module.exports = cartRouter;
