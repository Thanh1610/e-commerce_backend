const { createOrderService } = require('../services/cartServices');

const createOrder = async (req, res) => {
    try {
        const { cartItem, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullname, address, phone, user } =
            req.body;

        if (
            !cartItem ||
            !paymentMethod ||
            !itemsPrice ||
            !shippingPrice ||
            !totalPrice ||
            !fullname ||
            !address ||
            !phone ||
            !user
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

module.exports = {
    createOrder,
};
