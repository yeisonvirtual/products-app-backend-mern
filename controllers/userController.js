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

    if (field!=='0' && value!=='') {

      if (field==='1') {

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
  
      }
      else if (field==='4') {

        let active = null;

        if (value==='1') active = true;
        else if (value==='0') active = false;
        
        const users = await User.paginate({active}, options);
  
        if (!users.docs.length) {
          return res.status(400).json({ message:'Página vacia' });
        }
    
        return res.status(200).send({ users });
  
      }
      else if (field==='5') {

        let verified = null;

        if (value==='1') verified = true;
        else if (value==='0') verified = false;
        
        const users = await User.paginate({verified}, options);
  
        if (!users.docs.length) {
          return res.status(400).json({ message:'Página vacia' });
        }
    
        return res.status(200).send({ users });
  
      }

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
      type,
      active
    } = req.body;

    // convertir string a booleano
    let activeBool = false;
    if (active==='true') activeBool = true;

    const user = await User.findOne({ _id: id });
    
    if (!user) return res.status(400).json({ message:'No se encontró el usuario' });

    if (user.email!==email) {
      
      const emailExist = await User.findOne({ email });
      
      if (emailExist) return res.status(400).json({ message:'El email ya existe' });

      const userUpdated = await User.findOneAndUpdate({ _id: user._id },{
        name,
        email,
        type,
        active: activeBool,
        verified: false
      },
      {
        new: true
      });

      return res.status(200).json({ userUpdated });

    }

    const userUpdated = await User.findOneAndUpdate({ _id: id },{
      name,
      type,
      active: activeBool
    },
    {
      new: true
    });

    return res.status(200).json({ userUpdated });

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function verifyEmail (req, res) {
  
  const { id } = req.params;

  try {

    const user = await User.findOne({ _id: id });
    // si el link ya fue utilizado
    if (user.verified) return res.status(400).json({ message:'El link ya expiró' });

    const verifiedUser = await User.findOneAndUpdate({ _id: id },{
      active: true,
      verified: true
    },
    {
      new: true
    });

    return res.status(200).send({ verifiedUser });
    
  } catch (e) {
    // 500 - Internal Server Error
    return res.status(500).send({ message: e.message });
  }

}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  verifyEmail
}