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

const updateProductService = async (id, data) => {
    try {
        const checkProduct = await Product.findOne({ _id: id });

        if (!checkProduct) {
            return {
                status: 'ERR',
                message: `Sản phẩm không tồn tại`,
            };
        }

        // Kiểm tra chuỗi rỗng
        if (data.name !== undefined && data.name.trim() === '') {
            return {
                status: 'ERR',
                message: 'Tên sản phẩm không được để trống',
            };
        }

        if (data.image !== undefined && data.image.trim() === '') {
            return {
                status: 'ERR',
                message: 'Ảnh sản phẩm không được để trống',
            };
        }

        if (data.type !== undefined && data.type.trim() === '') {
            return {
                status: 'ERR',
                message: 'Loại sản phẩm không được để trống',
            };
        }

        // Kiểm tra các giá trị số
        if (data.price !== undefined && data.price < 0) {
            return {
                status: 'ERR',
                message: 'Giá sản phẩm không hợp lệ',
            };
        }

        if (data.countInStock !== undefined && data.countInStock < 0) {
            return {
                status: 'ERR',
                message: 'Số lượng trong kho không hợp lệ',
            };
        }

        if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
            return {
                status: 'ERR',
                message: 'Đánh giá phải nằm trong khoảng 0 đến 5',
            };
        }

        const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        return {
            status: 'Ok',
            message: 'Cập nhật sản phẩm thành công!',
            data: updateProduct,
        };
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        return {
            status: 'ERR',
            message: 'Lỗi máy chủ khi cập nhật sản phẩm',
        };
    }
};

const getDetailProductService = async (id) => {
    try {
        const product = await Product.findById(id);

        if (!product) {
            return {
                status: 'ERR',
                message: `Sản phẩm không tồn tại !`,
            };
        }

        return {
            status: 'Ok',
            message: 'Truy vấn sản phẩm thành công!',
            data: product,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getProductsServices = async (page, limit, sortBy, sortOrder, name) => {
    console.log('🚀 ~ getProductsServices ~ sort:', sortBy);
    try {
        // số sản phẩm cần bỏ qua
        const skip = (page - 1) * limit;

        // Lọc theo tên nếu có tham số name (không phân biệt hoa thường)
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // i = ignore case
        }

        const sortOption = { [sortBy || 'createdAt']: sortOrder || -1 };

        // Lấy danh sách sản phẩm theo trang
        const products = await Product.find(filter).skip(skip).limit(limit).sort(sortOption);

        // Đếm tổng số sản phẩm trong database
        const total = await Product.countDocuments(filter);

        // Tính tổng số trang
        const totalPages = Math.ceil(total / limit);

        return {
            status: 'Ok',
            message: 'Truy vấn Thành Công!',
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                limit: limit,
            },
        };
    } catch (error) {
        console.error('Update user service error:', error);
        return { error: 'Lỗi server.' };
    }
};

const deleteProductServices = async (id) => {
    try {
        const product = await Product.findById(id);

        if (!product) {
            return {
                status: 'ERR',
                message: 'Sản phẩm không tồn tại',
            };
        }
        const deleteProduct = await Product.findByIdAndDelete(id);

        return {
            status: 'Ok',
            message: 'Xóa sản phẩm Thành Công!',
            data: deleteProduct,
        };
    } catch (error) {
        console.error('Delete Product service error:', error);
        return { error: 'Lỗi server.' };
    }
};

module.exports = {
    createProductService,
    updateProductService,
    getDetailProductService,
    getProductsServices,
    deleteProductServices,
};
