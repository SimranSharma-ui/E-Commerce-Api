const Product = require("../model/Product");
const User = require("../model/User");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Updated Product", product });
  } catch (err) {
    console.error("Error updating product:", err);
    return res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

const likeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;
    if (!user || !user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.likedBy.includes(user._id)) {
      return res.status(400).json({ message: "Product already liked" });
    }
    product.likedBy.push(user._id);
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    currentUser.likedProducts.push(productId);
    await product.save();
    await currentUser.save();
    return res
      .status(200)
      .json({ message: "Product liked successfully", product });
  } catch (error) {
    console.error("Error liking product:", error);
    return res
      .status(500)
      .json({ message: "Error liking product", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;
    if (!user || !user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser.cart.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }
    currentUser.cart.push(productId);
    await currentUser.save();
    console.log("Product Addded to the Cart");
    return res
      .status(200)
      .json({ message: "Product added to cart", cart: currentUser.cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res
      .status(500)
      .json({ message: "Error adding product to cart", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

const getMyProduct = async (req, res) => {
  const createdBy = req.user._id;
  const myproduct = await Product.find({ createdBy });
  res.status(200).json(myproduct);
};

const AdminProduct = async (req, res) => {
  const { productIds } = req.body;
  try {
    const products = await Product.find({ _id: { $in: productIds } });
    return res
      .status(200)
      .json({ message: "Product listed successfully", products: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product details." });
  }
};

module.exports = {
  getProducts,
  likeProduct,
  addToCart,
  deleteProduct,
  getMyProduct,
  AdminProduct,
  updateProduct,
};
