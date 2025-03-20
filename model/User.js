const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  likedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
