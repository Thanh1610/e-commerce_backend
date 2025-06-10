const express = require('express');
const {
    createProduct,
    updateProduct,
    getDetailProduct,
    getProducts,
    deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const productRouter = express.Router();

productRouter.post('/create', createProduct);
productRouter.put('/update/:id', auth, updateProduct);
productRouter.get('/details/:id', getDetailProduct);
productRouter.get('/products', getProducts);
productRouter.delete('/delete/:id', auth, deleteProduct);

module.exports = productRouter;
