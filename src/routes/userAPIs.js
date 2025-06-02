const {
    getAllUser,
    createUser,
    handleLogin,
    updateUser,
    deleteUser,
    getDetailUser,
    createAdmin,
    refreshToken,
} = require('../controllers/userController');
const express = require('express');
const auth = require('../middleware/auth');
const userRouter = express.Router();

userRouter.all('/*splat', auth);

userRouter.get('/', (req, res) => {
    res.status(200).json('Hello world Api');
});

userRouter.get('/users', getAllUser);
userRouter.get('/detail-user/:id', getDetailUser);

userRouter.post('/register', createUser);
userRouter.post('/create-admin', createAdmin);
userRouter.post('/login', handleLogin);
userRouter.post('/refresh-token', refreshToken);

userRouter.put('/update-user/:id', updateUser);

userRouter.delete('/delete-user/:id', deleteUser);

module.exports = userRouter;
