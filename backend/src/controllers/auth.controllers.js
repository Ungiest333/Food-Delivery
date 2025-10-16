const userModel = require("../models/user.models");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to sign JWT
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// ------------------ User ------------------
async function registerUser(req, res) {
  try {
    // Safety check
    if (!req.body || !req.body.fullName || !req.body.email || !req.body.password || !req.body.phone || !req.body.confirmPassword) {
      return res.status(400).json({ message: "Please provide fullName, email, and password" });

    }

    const { fullName, email, password, phone , confirmPassword} = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      confirmPassword: hashedPassword
    });

    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      success:true,
      message: "User Registered Successfully",
      user: { _id: user._id,
         email: user.email,
         fullName: user.fullName, 
        phone: user.phone ,
        
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success:true,
      message: "User logged in Successfully",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

// ------------------ Food Partner ------------------
async function registerFoodPartner(req, res) {
  try {
    if (!req.body || !req.body.restaurantName || !req.body.email || !req.body.password  || !req.body.phone || !req.body.address || !req.body.contactName || !req.body.confirmPassword

  
    ) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const { restaurantName, email, password, phone , address , contactName, confirmPassword } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: "This account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      restaurantName,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName,
      confirmPassword: hashedPassword   

    });

    const token = generateToken(foodPartner._id);
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      success:true,
      message: "Registration Successful",
      foodPartner: { _id: foodPartner._id, 
        email: foodPartner.email, 
        name: foodPartner.name, 
        contactName:foodPartner.contactName, 
        address:foodPartner.address, 
        phone:foodPartner.phone,

      
       },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(foodPartner._id);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      success:true,
      message: "Food Partner logged in Successfully",
      foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Food Partner logged out successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
