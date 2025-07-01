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

        if (order.isDelivered) {
            throw new Error('Đơn hàng đã giao, không thể xoá.');
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

module.exports = { createOrderService, getOrdersService, deleteOrderService };
