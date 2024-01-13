const User = require('../models/User');

async function getUser (req, res) {

  const { id } = req.params;

  try {

    const user = await User.findOne({ _id: id });
    
    if (!user) return res.status(400).json({ message:'No se encontró el usuario' });

    return res.status(200).send({ user });
    
  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).send({ message: e.message });
  }
}

async function getUsers (req, res) {

  const { limit, page } = req.query;

  const { field, value } = req.query;

  const options = {
    limit: limit || 10,
    page: page || 1
  };

  try {

    // expresion regular para buscar todos los documentos que contengan value en la cadena
    const regex = new RegExp(`${value}`, 'i');

    if (value==='' || field==='0') {

      const users = await User.paginate({}, options);

      if (!users.docs.length) {
        return res.status(400).json({ message:'Página vacia' });
      }
  
      return res.status(200).send({ users });

    } 
    else if (field==='1') {

      const users = await User.paginate({name: regex}, options);

      if (!users.docs.length) {
        return res.status(400).json({ message:'Página vacia' });
      }
  
      return res.status(200).send({ users });

    }
    else if (field==='2') {
      
      const users = await User.paginate({email: regex}, options);

      if (!users.docs.length) {
        return res.status(400).json({ message:'Página vacia' });
      }
  
      return res.status(200).send({ users });

    }
    else if (field==='3') {
      
      const users = await User.paginate({type: regex}, options);

      if (!users.docs.length) {
        return res.status(400).json({ message:'Página vacia' });
      }
  
      return res.status(200).send({ users });

  } else {

      const users = await User.paginate({}, options);

      if (!users.docs.length) {
        return res.status(400).json({ message:'Página vacia' });
      }
  
      return res.status(200).send({ users });

  }

  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).send({ message: e.message });
  }
}

// async function getUsers (req, res) {

//   try {

//     const users = await User.find().lean().exec();
//     return res.status(200).send({ users });
    
//   } catch (e) {
//     // 500 - Internal Server Error
//     return res.status(500).send({ message: e.message });
//   }
// }

async function deleteUser (req, res) {

  const { id } = req.params;

  try {

    const user = await User.findOneAndDelete({ _id: id });
    
    if (!user) return res.status(400).json({ message:'No se encontró el usuario' });

    return res.status(200).send({ user });
    
  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).send({ message: e.message });
  }
}

async function updateUser (req, res) {
  try {

    const { id } = req.params;
    
    const {
      name,
      email,
      type
    } = req.body;

    const user = await User.findOne({ _id: id });
    
    if (!user) return res.status(400).json({ message:'No se encontró el usuario' });

    if (user.email!==email) {
      
      const emailExist = await User.findOne({ email });
      
      if (emailExist) return res.status(400).json({ message:'El email ya existe' });

      const userUpdated = await User.findOneAndUpdate({ _id: user._id },{
        name,
        email,
        type
      },
      {
        new: true
      });

      return res.status(200).json({ userUpdated });

    }

    const userUpdated = await User.findOneAndUpdate({ _id: id },{
      name,
      type
    },
    {
      new: true
    });

    return res.status(200).json({ userUpdated });

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser
}