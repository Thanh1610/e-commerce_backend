const {
    getAllUser,
    createUser,
    handleLogin,
    updateUser,
    deleteUser,
    getDetailUser,
    createAdmin,
    refreshToken,
    handleLogout,
} = require('../controllers/userController');
const express = require('express');
const auth = require('../middleware/auth');
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.status(200).json('Hello world Api');
});

userRouter.get('/users', auth, getAllUser);
userRouter.get('/detail-user/:id', getDetailUser);

userRouter.post('/register', createUser);
userRouter.post('/create-admin', createAdmin);
userRouter.post('/login', handleLogin);
userRouter.post('/logout', handleLogout);
userRouter.post('/refresh-token', refreshToken);

userRouter.put('/update-user/:id', updateUser);

userRouter.delete('/delete-user/:id', auth, deleteUser);

module.exports = userRouter;
