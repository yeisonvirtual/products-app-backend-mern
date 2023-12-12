const express = require('express')
const upload = require('../libs/storage')
const api = express.Router()

const { addProduct, getProducts } = require('../controllers/productController')

api.post('/products', upload.single('image'), addProduct)
api.get('/products', getProducts)

module.exports = api