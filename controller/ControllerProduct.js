
const Product = require('../model/Product');


const CreateProduct = async (req, res) => {
  try {
    const {user} = req.body;
    if(!user && !user.Username && !user.Image){
      return res.status(400).json({ message: 'Please provide adetail' }); 
    }
    const { name, description, price, imageUrl, type } = req.body;
    if (!name || !description || !price || !imageUrl || !type) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    if (!name || name.trim() === '') {
      return res.status(400).send('Product name is required and cannot be empty.');
    }
    const { Username: Username, Image: Image, _id: createdBy } = req.user || {};
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      type,
      createdBy, 
      admin: {
        name: Username,
        Image,
      },
    });
    await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const GetAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const GetProductbyId = async (req,res)=>{
  try{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product listed successfully' ,product : product  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error  product' });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  CreateProduct,
  GetAllProduct,
  deleteProduct,
  GetProductbyId,
};
