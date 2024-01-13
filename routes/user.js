const express = require('express');
const userRouter = express.Router();
const verifyToken = require('./validate_token');

const { getUsers, getUser, deleteUser, updateUser } = require('../controllers/userController');

// ruta protegidas por el middleware verifyToken
userRouter.get('/', verifyToken, getUsers);
userRouter.get('/:id', verifyToken, getUser);
userRouter.post('/delete/:id', verifyToken, deleteUser);
userRouter.post('/update/:id', verifyToken, updateUser);

module.exports = userRouter;