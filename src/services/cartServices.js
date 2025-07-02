const Cart = require('../models/cart');
const { sendEmailCreateOrder } = require('./emailServices');
const Product = require('../models/product');

const createOrderService = async (data) => {
    try {
        const {
            cartItem,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullname,
            address,
            phone,
            user,
            email,
            isPaid = 'false',
        } = data;

        // Kiểm tra tồn kho trước khi tạo đơn hàng
        for (const item of cartItem) {
            const product = await Product.findById(item.product);
            if (!product) {
                return { status: 'ERR', message: `Sản phẩm không tồn tại!` };
            }
            if (product.countInStock === 0) {
                return { status: 'ERR', message: `Sản phẩm "${product.name}" đã hết hàng!` };
            }
            if (product.countInStock < item.amount) {
                return {
                    status: 'ERR',
                    message: `Sản phẩm "${product.name}" chỉ còn ${product.countInStock} sản phẩm!`,
                };
            }
        }

        const createOder = await Cart.create({
            cartItem,
            shippingAddress: {
                fullname,
                address,
                phone,
            },
            paymentMethod,
            isPaid,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
        });

        // Trừ số lượng tồn kho cho từng sản phẩm và tăng số lượng đã bán
        for (const item of cartItem) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.amount, selled: item.amount },
            });
        }

        await sendEmailCreateOrder(email, cartItem, totalPrice);

        if (createOder) {
            return {
                status: 'SUCCESS',
                message: 'Đặt hàng thành công!',
                data: createOder,
            };
        }
    } catch (error) {
        console.error('createOrderService error:', error);
        return { error: 'Lỗi server.' };
    }
};

const getOrdersService = async (userId) => {
    try {
        const orders = await Cart.find({ user: userId }).sort({ createdAt: -1 });
        if (!orders) {
            return {
                status: 'ERR',
                message: 'Không có dữ liệu',
            };
        }

        return {
            status: 'SUCCESS',
            message: 'Truy vấn thành công!',
            data: orders,
        };
    } catch (error) {
        console.error('getOrdersService error:', error);
        return { error: 'Lỗi server.' };
    }
};

const deleteOrderService = async (orderId) => {
    try {
        const order = await Cart.findById(orderId);

        if (!order) {
            return {
                status: 'ERR',
                message: 'Không có dữ liệu',
            };
        }

        const res = await Cart.findByIdAndDelete(orderId);

        return {
            status: 'SUCCESS',
            message: 'Hủy đơn hàng thành công!',
            data: res,
        };
    } catch (error) {
        console.error('deleteOrderService error:', error);
        return { error: 'Lỗi server.' };
    }
};

const deleteManyServices = async (ids) => {
    try {
        const deleteOrder = await Cart.deleteMany({ _id: { $in: ids } });

        return {
            status: 'SUCCESS',
            message: 'Xóa sản phẩm Thành Công!',
            data: deleteOrder,
        };
    } catch (error) {
        console.error('deleteManyServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

const updateStatusService = async (id, data) => {
    try {
        // Kiểm tra đơn hàng có tồn tại không
        const checkOrder = await Cart.findOne({ _id: id });

        if (!checkOrder) {
            return {
                status: 'ERR',
                message: `Đơn hàng không tồn tại`,
            };
        }

        const updateFields = {};
        if (typeof data.isPaid !== 'undefined') {
            updateFields.isPaid = data.isPaid;
        }
        if (typeof data.isDelivered !== 'undefined') {
            updateFields.isDelivered = data.isDelivered;
        }

        if (Object.keys(updateFields).length === 0) {
            return {
                status: 'ERR',
                message: 'Không có trường hợp lệ để cập nhật!',
            };
        }

        const updatedOrder = await Cart.findByIdAndUpdate(id, updateFields, { new: true });

        return {
            status: 'SUCCESS',
            message: 'Cập nhật trạng thái thành công!',
            data: updatedOrder,
        };
    } catch (error) {
        return { status: 'ERROR', message: 'Cập nhật thất bại!', error: error.message };
    }
};
module.exports = { createOrderService, getOrdersService, deleteOrderService, deleteManyServices, updateStatusService };
