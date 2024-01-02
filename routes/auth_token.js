const express = require('express');
const authTokenRouter = express.Router();

const { register, login, logout } = require('../controllers/authTokenController');

authTokenRouter.post('/register', register);
authTokenRouter.post('/login', login);
authTokenRouter.post('/logout', logout);

module.exports = authTokenRouter;