const User = require('../models/user');
const validator = require('validator');
const { genneralAccessToken, genneralRefreshToken } = require('./jwtServices');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdminService = async (name, email, password, phone, isAdmin) => {
    try {
        //check exist
        const user = await User.findOne({ email });

        if (user) {
            console.log(`Email đã tồn tại, vui lòng dùng email khác ${email}`);
            return null;
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        return await User.create({ name, email, password: hashPassword, phone, isAdmin });
    } catch (error) {
        console.log(error);
        return null;
    }
};

const createUserService = async (name, email, password, phone, adress, avatar) => {
    try {
        //check exist
        const user = await User.findOne({ email });

        if (user) {
            return {
                EC: 1,
                EM: 'Email đã tồn tại, vui lòng dùng email khác',
            };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const data = await User.create({ name, email, password: hashPassword, phone, adress, avatar });
        return {
            EC: 0,
            EM: 'Đăng kí thành công',
            data,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const handleLoginServices = async (email, password) => {
    try {
        // tìm kiếm xem có email đã tồn tại chưa
        const user = await User.findOne({ email });

        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);

            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: 'email/password không hợp lệ',
                };
            } else {
                const payload = {
                    email: user.email,
                    name: user.name,
                    id: user._id,
                    phone: user.phone,
                    adress: user.adress,
                    isAdmin: user.isAdmin,
                };

                const access_token = await genneralAccessToken(payload);
                const refresh_token = await genneralRefreshToken(payload);
                return {
                    EC: 0,
                    EM: 'Đăng nhập thành công !',
                    access_token,
                    refresh_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        id: user._id,
                        phone: user.phone,
                        adress: user.adress,
                        isAdmin: user.isAdmin,
                    },
                };
            }
        } else {
            return {
                EC: 1,
                EM: 'email/password không hợp lệ',
            };
        }
    } catch (error) {
        console.error('handleLoginServices error:', error);
        return {
            EC: -1,
            EM: 'Đã xảy ra lỗi máy chủ.',
        };
    }
};

const updateUserServices = async (id, data) => {
    try {
        const checkUser = await User.findOne({ _id: id });

        if (!checkUser) {
            return { error: 'Sản phẩm không tồn tại.' };
        }

        // Kiểm tra định dạng email nếu có cập nhật
        if (data.email && !validator.isEmail(data.email)) {
            return { error: 'Email không hợp lệ.' };
        }

        // Kiểm tra định dạng số điện thoại nếu có (mã vùng VN)
        if (data.phone && !validator.isMobilePhone(data.phone, 'vi-VN')) {
            return { error: 'Số điện thoại không hợp lệ.' };
        }

        const updateUser = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
        return {
            status: 'OK',
            message: 'Sửa Thành Công!',
            data: updateUser,
        };
    } catch (error) {
        console.error('updateUserServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

const deleteUserServices = async (id) => {
    try {
        const checkUser = await User.findOne({ _id: id });

        if (!checkUser) {
            return { error: 'User không tồn tại.' };
        }

        const deleteUser = await User.findByIdAndDelete(id).select('-password');
        return {
            status: 'Ok',
            message: 'Xóa Thành Công!',
            data: deleteUser,
        };
    } catch (error) {
        console.error('deleteUserServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

const getAllUserServices = async (id) => {
    try {
        const users = await User.find().select('-password');
        return {
            status: 'Ok',
            message: 'Truy vấn Thành Công!',
            data: users,
        };
    } catch (error) {
        console.error('getAllUserServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

const getDetailUserServices = async (id) => {
    try {
        const user = await User.findOne({ _id: id }).select('-password');

        if (!user) {
            return { error: 'User không tồn tại.' };
        }

        return {
            status: 'Ok',
            message: 'Truy vấn Thành Công!',
            data: user,
        };
    } catch (error) {
        console.error('getDetailUserServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

const deleteManyServices = async (userIds) => {
    try {
        const deleteUser = await User.deleteMany({ _id: { $in: userIds } });
        return {
            status: 'Ok',
            message: 'Xóa Thành Công!',
            data: deleteUser,
        };
    } catch (error) {
        console.error('deleteManyServices error:', error);
        return { error: 'Lỗi server.' };
    }
};

module.exports = {
    createAdminService,
    createUserService,
    handleLoginServices,
    updateUserServices,
    deleteUserServices,
    getAllUserServices,
    getDetailUserServices,
    deleteManyServices,
};
