const express = require('express')
const upload = require('../libs/storage')
const api = express.Router()
const verifyToken = require('./validate_token');

const { addProduct, getProductsUser, getProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/productController');


api.post('/', verifyToken, upload.single('image'), addProduct);
api.get('/', verifyToken, getProducts);
api.get('/myproducts/:id', verifyToken, getProduct);
api.get('/myproducts', verifyToken, getProductsUser);
api.post('/delete/:id', verifyToken, deleteProduct);
api.post('/update/:id', verifyToken, updateProduct);

module.exports = api