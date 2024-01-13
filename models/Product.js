const mongoose = require('mongoose')
const { appConfig } = require('../config')
const Schema = mongoose.Schema

const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true // elimina los espacios
  },
  size: {
    type: String,
    trim: true // elimina los espacios
  },
  unitaryPrice: {
    type: Number,
    required: true,
    trim: true
  },
  imgUrl: {
    type: String,
    required: true,
    trim: true // elimina los espacios
  },
  description: {
    type: String,
    trim: true // elimina los espacios
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
})

ProductSchema.methods.setImgUrl = function setImgUrl(filename){
  const { host, port } = appConfig;
  this.imgUrl = `${host}:${port}/public/${filename}`;
}

module.exports = mongoose.model('Products', ProductSchema);