require('dotenv').config();
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = {
    app_id: process.env.APP_ID,
    key1: process.env.KEY1,
    key2: process.env.KEY1,
    endpoint: process.env.ENDPOINT,
};

const createOrder = async (req, res) => {
    const { amount } = req.body;

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    const embed_data = {
        preferred_payment_method: ['domestic_card", "account'],
        redirecturl: `http://localhost:5173/PaymentSuccess?app_trans_id=${app_trans_id}`,
    };

    const order = {
        app_id: config.app_id,
        app_trans_id,
        app_user: 'demo',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount,
        description: `Thanh toán đơn hàng #${transID}`,
        bank_code: '',
    };
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: 'ZaloPay create order failed', details: err.message });
    }
};

module.exports = {
    createOrder,
};
