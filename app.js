const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/product')
const cors = require('cors')
const cookieParser = require('cookie-parser');

const verifyToken = require('./routes/validate_token');
const verify = require('./routes/verify');

//const userRouter = require('./routes/user');
const authTokenRouter = require('./routes/auth_token');

const app = express()

// para permitir solicitudes desde otro puerto de 5173 a 8080
app.use(cors({
  origin: 'http://localhost:5173', // dominio app frontend
  credentials: true // permite enviar cookies
}))

// para acceder al body de la consulta
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// para acceder a las imagenes
app.use('/public', express.static(`${__dirname}/storage/imgs`))

// ruta de auth
app.use("/v1/auth-token", authTokenRouter);
// ruta de products
app.use('/v1', verifyToken, productRoutes);
// ruta para verificar token
app.use('/v1/verify', verify);

// ruta de users
//app.use('/v1/users', userRouter)

module.exports = app