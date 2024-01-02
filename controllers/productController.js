const Product = require('../models/Product')

async function addProduct (req, res) {
  try {

    const {
      name,
      size,
      unitaryPrice,
      description
    } = req.body

    const product = Product({
      name,
      size,
      unitaryPrice,
      description,
      user: req.user.id
    })

    if(req.file){
      const { filename } = req.file
      product.setImgUrl(filename)
    }

    const productStore = await product.save()

    res.status(201).json({ productStore })

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

async function getProductsUser (req,res) {
  try {

    // trae los datos del usuario
    const products = await Product.find({ user: req.user.id });
    
    res.status(200).json({ products });
    
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getProducts (req, res) {
  try {

    const products = await Product.find().populate('user').lean().exec();
    
    res.status(200).json({ products });
    
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteProduct (req, res) {

  const { productID } = req.body;
  console.log(req)

  try {
    
    const deletedProduct = await Product.deleteOne({ _id: productID });
    
    if (!deletedProduct.deletedCount) return res.status(400).json({ message:'Producto no encontrado' });

    res.status(200).json({ deletedProduct });
    
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  addProduct,
  getProductsUser,
  getProducts,
  deleteProduct
}