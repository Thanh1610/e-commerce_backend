const { createOrderService, getOrdersService, deleteOrderService } = require('../services/cartServices');
const Cart = require('../models/cart');

const createOrder = async (req, res) => {
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
        } = req.body;

        if (
            !cartItem ||
            !paymentMethod ||
            !itemsPrice ||
            !shippingPrice ||
            !totalPrice ||
            !fullname ||
            !address ||
            !phone ||
            !user ||
            !email
        ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhâp đầy đủ thông tin!',
            });
        }

        const data = await createOrderService(req.body);

        return res.status(200).json(data);
    } catch (error) {
        console.error('createOrder error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getOrders = async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thiếu UserId',
            });
        }

        const data = await getOrdersService(userId);
        return res.status(200).json(data);
    } catch (error) {
        console.error('getOrders error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thiếu orderId',
            });
        }

        const data = await deleteOrderService(orderId);
        return res.status(200).json(data);
    } catch (error) {
        console.error('deleteOrder error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Cart.find().sort({ createdAt: -1 });
        if (!orders) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Lấy danh sách đơn hàng thất bại!',
                data: orders,
            });
        }
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Lấy danh sách đơn hàng thành công!',
            data: orders,
        });
    } catch (error) {
        console.error('getAllOrders error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    getAllOrders,
};
