const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  
    
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  createdBy:[ {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    }],
   admin: {
      name: String,
      image: String,
    },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
