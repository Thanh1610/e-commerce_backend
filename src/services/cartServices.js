const Cart = require('../models/cart');

const createOrderService = async (data) => {
    try {
        const { cartItem, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullname, address, phone, user } = data;

        const createOder = await Cart.create({
            cartItem,
            shippingAddress: {
                fullname,
                address,
                phone,
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
        });

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
module.exports = { createOrderService };
