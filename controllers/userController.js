const User = require('../models/User');

async function profileToken (req, res) {

  res.json({
    error: null,
    data: {
      title: "Profile",
      user: req.user, // permite acceder a la informacion del usuario
    }
  });
  
}

async function profileSession (req,res) {

  try {

    // comprueba que el usuario exista
    const user = await User.findOne({ _id: req.session.userID });
      
    if (!user) return res.status(400).json({ error: true, message:'Usuario no encontrado' });

    return res.status(200).send(user);
    
  } catch (error) {

    return res.status(500).send({ message: e.message });

  }

}

async function getUsers (req, res) {
  try {

    const users = await User.find().lean().exec();
    return res.status(200).send({ users });
    
  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).send({ message: e.message })
  }
}

module.exports = {
  profileToken,
  profileSession,
  getUsers
}