const express = require("express");
const ConfigMulter = require("../Middleware/multerConfig");
const { Register, Login, logout, ForgetPassword, ResetPassword } = require("../controller/AuthController");

const Router = express.Router();

Router.post("/Register",ConfigMulter,Register);
Router.post("/Login",Login);
Router.get("/Logout",logout);
Router.post("/ForgetPassword",ForgetPassword);
Router.post("/ResetPassword/:token",ResetPassword);

module.exports = Router;