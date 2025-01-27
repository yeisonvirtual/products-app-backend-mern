const User = require('../models/User');
const bcrypt = require("bcryptjs");
const { SignJWT } = require('jose');

const { Resend } = require('resend');

async function register (req, res) {

  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) return res.status(409).json({ message: 'Faltan datos' });
  
  try {

    // comprueba que el usuario exista
    const emailExist = await User.findOne({ email });
    
    // 409 - Conflict Status
    if (emailExist) return res.status(409).json({ message: 'Email ya existe' });

    // Encripta la password
    const passwordHash = await bcrypt.hash(password, 10);

    // Store hash in your password DB.
    const user = User({
      name,
      email,
      password: passwordHash
    });
        
    const newUser = await user.save();

    const resend = new Resend('re_CqXVzKgL_8hfuAniKeiS8QZX6WE9aneHs');

    const data = await resend.emails.send({
      from: 'products_app@resend.dev',
      to: 'yeisonjr98@gmail.com',
      subject: 'Products App: Verifique su correo',
      html: 
      `<p>Este usuario se registro en la página <strong>Products App</strong> de <strong>Yeison Rojas</strong>.</p>
       <p>Verifique su cuenta en el siguente link:</p>
       <a href='http://localhost:5173/login/${newUser._id}'>Confirmar usuario</a>
      `
    });

    if (!data) return res.status(409).json({ message: 'No se pudo enviar el correo' });

    // 201 - Created
    return res.status(201).json({ newUser });

  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).json({ message: e.message });
  }
}

//login email and password
async function login (req, res) {

  const { email, password } = req.body;

  // si no hay email o pass en los campos
  if (!email || !password) return res.status(400).json({ message: 'Faltan datos'});

  try {

    const user = await User.findOne({ email }); // comprueba que el usuario exista
    
	  if (!user) return res.status(400).json({ message:'Usuario no encontrado' });

    if (!user.verified) return res.status(400).json({ message:'Usuario no verificado' });

    if (!user.active) return res.status(400).json({ message:'Usuario inactivo' });

    // compara la password
    const validPassword = await bcrypt.compare(password, user.password);

    // si coinciden
    if (validPassword) {
      // // GENERAR TOKEN

      // datos que almacenara el token
      const id = user._id;
      const name = user.name;

      // genera clave secreta
      const encoder = new TextEncoder()
      const secret = encoder.encode('secret_key')

      // genera el jsonwebtoken
      const jwt = await new SignJWT({ id, name, email }).setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('20m')
        .sign(secret);

      // 20 minutos
      const expireTime = 20 * 60000;

      //res.set('authorization', jwt); // agregar a la header de la respuesta
      res.cookie('token', jwt, { 
        expires: new Date(Date.now() + expireTime), // expira en 20 minutos
        
      }); // agregar a la cookie de la respuesta

      return res.status(201).json(user);

    } else {

      return res.status(400).json({ message:'Password incorrecta' });

    }

  } catch (e) {
    
    return res.status(500).json({ message: e.message });

  }

}

async function logout (req, res) {

  res.cookie('token', '',{
    expires: new Date(0)
  });

  return res.status(201).json({ message: 'Logout successfully' });

}

module.exports = {
  register,
  login,
  logout
}