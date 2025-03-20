const jwt = require('jsonwebtoken');
const User = require('../model/User'); 

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(403).json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, you are not an admin" });
    }

    req.user = user;
    next(); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAdmin;
