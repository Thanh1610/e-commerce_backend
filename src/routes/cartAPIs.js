const { createOrder } = require('../controllers/cartController');
const express = require('express');
const auth = require('../middleware/auth');
const userRouter = express.Router();

userRouter.post('/create-order', auth, createOrder);

module.exports = userRouter;
