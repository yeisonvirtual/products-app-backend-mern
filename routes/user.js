const express = require('express');
const userRouter = express.Router();
const verifyToken = require('./validate_token');

const { profileToken, profileSession, getUsers } = require('../controllers/userController');

// ruta protegida por el middleware verifyToken
userRouter.get('/profile-token', verifyToken, profileToken);

// ruta desprotegida
userRouter.get('/', getUsers);

module.exports = userRouter;