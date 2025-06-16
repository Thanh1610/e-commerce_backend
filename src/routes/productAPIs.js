const express = require('express');
const {
    createProduct,
    updateProduct,
    getDetailProduct,
    getProducts,
    deleteProduct,
    deleteMany,
    searchProducts,
    getDetailProductBySlug,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const productRouter = express.Router();

productRouter.get('/details/:id', getDetailProduct);
productRouter.get('/details/slug/:slug', getDetailProductBySlug);
productRouter.get('/products', getProducts);
productRouter.get('/search', searchProducts);

productRouter.post('/create', createProduct);
productRouter.put('/update/:id', auth, updateProduct);
productRouter.delete('/delete/:id', auth, deleteProduct);
productRouter.delete('/delete-many', auth, deleteMany);

module.exports = productRouter;
