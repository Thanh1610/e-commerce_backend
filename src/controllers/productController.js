const { createProductService } = require('../services/productServices');

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating } = req.body;

        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhâp đầy đủ thông tin!',
            });
        }
        console.log(req.body);

        const data = await createProductService(req.body);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

module.exports = {
    createProduct,
};
