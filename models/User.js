const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true // elimina los espacios
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true // unico
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    default: 'guest'
  }
}, {
  timestamps: true
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Users', UserSchema);