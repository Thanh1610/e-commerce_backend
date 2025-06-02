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
const router = express.Router();

router.all('/*splat', auth);

router.get('/', (req, res) => {
    res.status(200).json('Hello world Api');
});

router.get('/users', getAllUser);
router.get('/detail-user/:id', getDetailUser);

router.post('/register', createUser);
router.post('/create-admin', createAdmin);
router.post('/login', handleLogin);
router.post('/refresh-token', refreshToken);

router.put('/update-user/:id', updateUser);

router.delete('/delete-user/:id', deleteUser);

module.exports = router;
