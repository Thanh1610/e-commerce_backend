const {
    createProductService,
    updateProductService,
    getDetailProductService,
    getProductsServices,
    deleteProductServices,
} = require('../services/productServices');

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating } = req.body;

        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhâp đầy đủ thông tin!',
            });
        }

        const data = await createProductService(req.body);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: 'Thiếu productId.' });
        }

        const data = await updateProductService(productId, req.body);

        return res.status(200).json(data);
    } catch (error) {
        console.error('updateProduct error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId);

        if (!productId) {
            return {
                status: 'ERR',
                message: 'id sản phẩm không tồn tại!',
            };
        }
        const data = await getDetailProductService(productId);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getProducts = async (req, res) => {
    try {
        const { page, limit, sort, order, name } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 6;
        const sortBy = sort || 'createdAt'; // mặc định sort theo ngày tạo
        const sortOrder = order === 'asc' ? 1 : -1; // mặc định là giảm dần

        const data = await getProductsServices(pageNum, limitNum, sortBy, sortOrder, name);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = await deleteProductServices(productId);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    getProducts,
    deleteProduct,
};
