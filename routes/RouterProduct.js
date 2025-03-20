
const express = require('express');
const router = express.Router();
const { verifyUser, verifyAdmin } = require('../Middleware/AuthMiddle');  
const { CreateProduct, GetAllProduct, deleteProduct,GetProductbyId } = require('../controller/ControllerProduct');

router.post('/create', verifyAdmin,CreateProduct);
router.get('/getProduct',verifyAdmin, verifyUser, GetAllProduct);
router.get('/product/:id',verifyAdmin,GetProductbyId);
router.delete('/Delete/:id', verifyAdmin, deleteProduct);

module.exports = router;
