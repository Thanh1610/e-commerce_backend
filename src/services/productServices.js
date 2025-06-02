const Product = require('../models/product');

const createProductService = async (data) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = data;

        const product = await Product.findOne({ name });

        if (product) {
            return {
                status: 'OK',
                message: `Sản phẩm đã tồn tại, vui lòng chọn sản phẩm khác !`,
            };
        }

        const newProduct = await Product.create({
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
        });

        return {
            status: 'Ok',
            message: 'Thêm sản phẩm thành công!',
            data: newProduct,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    createProductService,
};
