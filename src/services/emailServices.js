const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailCreateOrder = async (email, cartItem, totalPrice) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: email,
            subject: 'Bạn đã đặt hàng từ SyberShop 🛒',
            text: `Xin chào, ${cartItem.name}`, // plain‑text body
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); padding: 30px;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">🛒 SyberShop - Xác nhận đơn hàng</h2>
                        <p style="font-size: 16px; margin-bottom: 10px;">Xin chào <strong>${
                            cartItem?.name || 'Khách hàng'
                        }</strong>,</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn đã đặt hàng tại <strong>SyberShop</strong>!</p>

                        ${(cartItem || [])
                            .map(
                                (item) =>
                                    `<p style="font-size: 15px; margin: 4px 0;">Sản phẩm: <strong>${item.name}</strong> x <strong>${item.amount}</strong></p>`,
                            )
                            .join('')}

                        <p style="font-size: 16px; margin-top: 20px;">Tổng giá trị:
                        <strong style="color: #e74c3c; font-size: 18px;">${totalPrice.toLocaleString('vi-VN')}₫</strong>
                        </p>

                        <p style="font-size: 15px; margin-top: 20px;">Đơn hàng sẽ được giao trong <strong>4-5 ngày</strong>.</p>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

                        <p style="font-size: 14px; color: #777;">📞 Hotline: <strong>0963828838</strong></p>
                        <p style="font-size: 14px; color: #777;">✉️ Email: <strong>support@sybershop.com</strong></p>
                    </div>
                </div>
                `,
        });

        console.log('Message sent:', info.messageId);
    })();
};

module.exports = { sendEmailCreateOrder };
