const express = require('express');
const { createProduct } = require('../controllers/productController');

const productRouter = express.Router();

productRouter.post('/create', createProduct);

module.exports = productRouter;
