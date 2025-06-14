require('dotenv').config();
const jwt = require('jsonwebtoken');

const genneralAccessToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const genneralRefreshToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
};

const refreshTokenServices = async (token) => {
    try {
        if (!token) {
            return { status: 'Error', message: 'Token không được cung cấp.' };
        }

        //Kiểm tra token có hợp lệ k và giải mã
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = await genneralAccessToken({
            id: decoded?.id,
            isAdmin: decoded?.isAdmin,
        });

        return {
            status: 'SUCCESS',
            message: 'Tạo mới accessToken Thành Công!',
            newAccessToken,
        };
    } catch (error) {
        console.error('Update user service error:', error);
        return { error: 'Lỗi server.' };
    }
};

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenServices,
};
