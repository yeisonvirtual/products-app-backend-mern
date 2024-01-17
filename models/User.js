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
    trim: true,
    required: true,
    unique: true, // unico
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    default: 'guest'
  },
  active: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Users', UserSchema);