const validator = require('validator');
const {
    createAdminService,
    createUserService,
    handleLoginServices,
    updateUserServices,
    deleteUserServices,
    getAllUserServices,
    getDetailUserServices,
} = require('../services/userServices');

const { refreshTokenServices } = require('../services/jwtServices');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;

        // const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const isCheckEmail = emailReg.test(email);

        const isValidPhone = validator.isMobilePhone(phone, 'vi-VN');

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhâp đầy đủ thông tin!',
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu không khớp!',
            });
        } else if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ!',
            });
        } else if (!isValidPhone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Số điện thoại không hợp lệ!',
            });
        }

        const data = await createUserService(name, email, password, phone);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, isAdmin } = req.body;

        const isValidPhone = validator.isMobilePhone(phone, 'vi-VN');

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhâp đầy đủ thông tin!',
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu không khớp!',
            });
        } else if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ!',
            });
        } else if (!isValidPhone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Số điện thoại không hợp lệ!',
            });
        }

        const data = await createAdminService(name, email, password, phone, isAdmin);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
        }

        const data = await handleLoginServices(email, password);

        const { refresh_token, ...newData } = data;

        // Lưu refresh_token vào cookie

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        return res.status(200).json(newData);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const handleLogout = async (req, res) => {
    try {
        res.clearCookie('refresh_token');

        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công!',
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId.' });
        }

        const data = await updateUserServices(userId, req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId.' });
        }

        const data = await deleteUserServices(userId);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await getDetailUserServices(userId);

        return res.status(200).json(data);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const getAllUser = async (req, res) => {
    try {
        const data = await getAllUserServices();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req?.cookies?.refresh_token;

        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'yêu cầu token',
            });
        }
        const data = await refreshTokenServices(token);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

module.exports = {
    getAllUser,
    getDetailUser,
    createUser,
    handleLogin,
    updateUser,
    deleteUser,
    createAdmin,
    refreshToken,
    handleLogout,
};
