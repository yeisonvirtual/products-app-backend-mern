const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/product')
const cors = require('cors')

const app = express()

// para permitir solicitudes desde otro puerto de 5173 a 8080
app.use(cors())

// para acceder al body de la consulta
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// para acceder a las imagenes
app.use('/public', express.static(`${__dirname}/storage/imgs`))

// ruta de products
app.use('/v1', productRoutes)

module.exports = app