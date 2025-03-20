const express = require('express');
const {getProducts, getUser} = require("../controller/UserController");
const { verifyUser } = require('../Middleware/AuthMiddle'); 
const router = express.Router();

router.get("/getUser",verifyUser,getUser);
router.get('/products', verifyUser, getProducts);
module.exports = router;
