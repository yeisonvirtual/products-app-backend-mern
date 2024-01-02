const { jwtVerify } = require('jose');
const User = require('../models/User');

// middleware to validate token (rutas protegidas)
const verifyToken = async (req, res) => {

  // con cookies
  const { token } = req.cookies;

  if (token===undefined) return res.status(401).json({ error: "Acceso denegado" });
  
  try {

    // genera clave secreta
    const encoder = new TextEncoder();
    const secret = encoder.encode('secret_key');
    
    // verifica el token
    const { payload } = await jwtVerify(token, secret);

    const user = await User.findOne({ _id: payload.id });

    if (!user) return res.status(400).json({ error: true, message:'Usuario no encontrado' });

    return res.status(200).json(user);

  } catch (error) {

    res.status(500).send({ error: "Token no es válido" });
    
  }
  
};

module.exports = verifyToken;