const express = require('express')
const upload = require('../libs/storage')
const api = express.Router()
const verifyToken = require('./validate_token');

const { addProduct, getProductsUser, getProducts, deleteProduct } = require('../controllers/productController');


api.post('/products', verifyToken, upload.single('image'), addProduct);
api.get('/products', verifyToken, getProductsUser);
api.get('/allproducts', verifyToken, getProducts);
api.post('/deleteproduct', verifyToken, deleteProduct);

module.exports = api