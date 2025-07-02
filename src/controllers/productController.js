const {
    createProductService,
    updateProductService,
    getDetailProductService,
    getProductsServices,
    deleteProductServices,
    deleteManyServices,
    searchProductsServices,
    getDetailProductBySlugService,
    getAllTypeServices,
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

const getDetailProductBySlug = async (req, res) => {
    try {
        const productSlug = req.params.slug;

        if (!productSlug) {
            return {
                status: 'ERR',
                message: 'Slug không tồn tại!',
            };
        }
        const data = await getDetailProductBySlugService(productSlug);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getProducts = async (req, res) => {
    try {
        const { page, limit, sort, order, name, type, isSale, ratingGte } = req.query;

        const pageNum = parseInt(page, 10) || undefined;
        const limitNum = parseInt(limit, 10) || undefined;
        const sortBy = sort || 'createdAt'; // mặc định sort theo ngày tạo
        const sortOrder = order === 'asc' ? 1 : -1; // mặc định là giảm dần

        const data = await getProductsServices(pageNum, limitNum, sortBy, sortOrder, name, type, isSale, ratingGte);

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

const deleteMany = async (req, res) => {
    try {
        const ids = req.body;

        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Ids là bắt buộc',
            });
        }
        const data = await deleteManyServices(ids);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const searchProducts = async (req, res) => {
    try {
        const q = req.query.q;
        const type = req.query.type === 'more' ? 'more' : 'less';

        if (!q.trim()) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Từ khóa tìm kiếm không hợp lệ.',
            });
        }

        const data = await searchProductsServices(q, type);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getAllType = async (req, res) => {
    try {
        const data = await getAllTypeServices();

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
    deleteMany,
    searchProducts,
    getDetailProductBySlug,
    getAllType,
};
