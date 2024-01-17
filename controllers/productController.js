const Product = require('../models/Product');
const fs = require('fs');

async function addProduct (req, res) {
  
  const {
    name,
    size,
    unitaryPrice,
    description
  } = req.body;

  if (!name || !unitaryPrice || !req.file) return res.status(409).json({ message: 'Faltan datos' });

  try {

    const product = Product({
      name,
      size,
      unitaryPrice,
      description,
      user: req.user.id
    });

    if(req.file){
      const { filename } = req.file;
      product.setImgUrl(filename);
    }

    const productStore = await product.save();

    return res.status(201).json({ productStore });

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function getProductsUser (req,res) {

  try {
    // trae los datos del usuario
    const products = await Product.find({ user: req.user.id });
    
    return res.status(200).json({ products });
    
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function getProducts (req, res) {

  try {

    // lean -> retorna como objeto js, sort -> ordena
    const products = await Product.find().populate('user').sort({
      unitaryPrice: 1 // orden ascendente
    }).lean();
    
    return res.status(200).json({ products });
    
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function getProduct (req, res) {

  const { id } = req.params;

  try {

    const product = await Product.findOne({ _id: id }).populate('user').exec();

    return res.status(200).json({ product });
    
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function deleteProduct (req, res) {

  const { id } = req.params;

  try {

    // elimina de la BDD
    const deletedProduct = await Product.findOneAndDelete({ _id: id });

    if (!deletedProduct) return res.status(400).json({ message:'No se encontró el producto' });

    // elimina la imagen de storage/imgs
    const subcadena = deletedProduct.imgUrl.split('/');

    fs.unlink(`./storage/imgs/${subcadena[4]}`, (err)=>{
      if (err) return console.log('No se encontró la imagen del producto');
      console.log(`${subcadena[4]} fue eliminada`);
    });

    return res.status(200).json({ deletedProduct });
    
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function updateProduct (req, res) {
  try {

    const { id } = req.params;
    
    const {
      name,
      size,
      unitaryPrice,
      description
    } = req.body;

    const productUpdated = await Product.findOneAndUpdate({ _id: id },{
      name,
      size,
      unitaryPrice,
      description
    },
    {
      new: true
    });

    if (!productUpdated) return res.status(400).json({ message:'No se encontró el producto' });

    //const productUpdated = await Product.findOne({ _id: productOld._id });

    return res.status(200).json({ productUpdated });

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = {
  addProduct,
  getProduct,
  getProductsUser,
  getProducts,
  deleteProduct,
  updateProduct
}