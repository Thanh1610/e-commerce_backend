require('dotenv').config();
const jwt = require('jsonwebtoken');
const whiteListRoutes = require('../config/whiteListRoutes');

const auth = (req, res, next) => {
    if (whiteListRoutes.includes(req.path)) {
        next();
    } else {
        const token = req?.headers?.authorization?.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                console.log('>>>>>>>>>>.check decoded: ', decoded);

                if (decoded.isAdmin) {
                    next();
                } else {
                    return res.status(403).json({ message: 'Bạn không phải admin' });
                }
            } catch (error) {
                return res.status(401).json({
                    message: 'token hết hạn / hoặc không hợp lệ',
                });
            }
        } else {
            //return exception
            return res.status(401).json({
                message: 'Bạn chưa truyền access token ở headers / hoặc token hết hạn',
            });
        }
    }
};

module.exports = auth;
