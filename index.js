const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const { dirname, join } = require("path");

const routerProduct = require("./routes/RouterProduct");  
const AuthRouter = require("./routes/AuthRouter");  
const adminRoutes = require("./routes/adminRoutes");  
const userRoutes = require("./routes/userRoutes"); 

const { verifyUser, verifyAdmin } = require("./Middleware/AuthMiddle"); 

dotenv.config();

const app = express();

app.use(cookieParser());  
app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 
app.use(
  cors({
    origin: ["http://localhost:5174","http://localhost:5173","https://e-commerce-frontend-git-main-simrans-projects-dee52ad7.vercel.app/"], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],  
  })
);

app.use("/uploader", express.static(path.join(__dirname, "Uploader")));


mongoose
  .connect(process.env.MONGODB_URL,{
  
    serverSelectionTimeoutMS: 30000,  
    socketTimeoutMS: 45000,  
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home route" });
});

app.use("/about",(req,res)=>{
  res.send("this is about page");
})
app.use("/api/auth", AuthRouter);
app.use("/api/products", verifyUser, routerProduct); 
app.use("/api/admin", verifyAdmin, adminRoutes); 
app.use("/api/user", verifyUser, userRoutes); 


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
