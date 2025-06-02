require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateAccessToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const generateRefreshToken = async (payload) => {
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

        const newAccessToken = await generateAccessToken({
            id: decoded?.id,
            isAdminid: decoded?.isAdmin,
        });

        return {
            status: 'Ok',
            message: 'Tạo mới accessToken Thành Công!',
            newAccessToken,
        };
    } catch (error) {
        console.error('Update user service error:', error);
        return { error: 'Lỗi server.' };
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenServices,
};
