const Cart = require('../models/cart');
const { sendEmailCreateOrder } = require('./emailServices');

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
