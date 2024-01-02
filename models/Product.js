const mongoose = require('mongoose')
const { appConfig } = require('../config')
const Schema = mongoose.Schema

const ProductSchema = Schema({
  name: String,
  size: Number,
  unitaryPrice: Number,
  imgUrl: String,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
})

ProductSchema.methods.setImgUrl = function setImgUrl(filename){
  const { host, port } = appConfig
  this.imgUrl = `${host}:${port}/public/${filename}`
}

module.exports = mongoose.model('Products', ProductSchema)