const express = require('express');
const { getProducts, likeProduct, addToCart, deleteProduct, GetProductbyId, AdminProduct, updateProduct } = require('../controller/AdminController');
const { verifyAdmin } = require('../Middleware/AuthMiddle'); 
const router = express.Router();


router.get('/products', verifyAdmin, getProducts);  
router.post('/products/like/:id', verifyAdmin, likeProduct);  
router.post('/products/cart/:id', verifyAdmin, addToCart);  
router.delete('/products/:id', verifyAdmin, deleteProduct); 
router.post('/products/detail',verifyAdmin,AdminProduct);
router.put('/update/:id',verifyAdmin,updateProduct);


module.exports = router;
