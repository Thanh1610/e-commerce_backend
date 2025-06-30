const { createOrder } = require('../controllers/zaloPaymentController');
const express = require('express');
const zaloRouter = express.Router();

zaloRouter.post('/create-order', createOrder);

module.exports = zaloRouter;
