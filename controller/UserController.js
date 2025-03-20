const Product = require('../model/Product');
const User = require('../model/User');



const getUser = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = {
      _id: user._id,
      Username: user.Username,
      Email: user.Email,
      Role: user.role,
      Image: user.image,
      Cart:user.cart,
      LikedProducts:user.likedProducts,
       
    };
    return res.status(200).json(userData);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.status(200).json({ admins });
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
};

module.exports = { getProducts , getUser};
