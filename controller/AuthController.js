const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../Middleware/multerConfig");
const nodemailer = require("nodemailer");

const Register = async (req, res) => {
  try {
    const { Username, Password, Email, role } = req.body;
    if (!Username || !Password || !Email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({ Email });
    if (existedUser) {
      return res
        .status(409)
        .json({ message: "User already registered with this email" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Profile image file is required" });
    }

    const imageUrl = `http://localhost:4000/Uploader/${req.file.filename}`;

    const hashedPassword = await bcrypt.hash(Password, 8);

    const newUser = new User({
      Username,
      Email,
      Password: hashedPassword,
      image: imageUrl,
      role: role || "user",
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        Username: newUser.Username,
        Email: newUser.Email,
        image: newUser.image,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { Password, Email } = req.body;

    if (!Password || !Email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({ Email });
    if (!existedUser) {
      return res.status(404).json({ message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(Password, existedUser.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: existedUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        Username: existedUser.Username,
        Email: existedUser.Email,
        image: existedUser.image,
        role: existedUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }
    const user = await User.findOne({ Email: email });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10min",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    user.Password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { Register, Login, logout, ForgetPassword, ResetPassword };
