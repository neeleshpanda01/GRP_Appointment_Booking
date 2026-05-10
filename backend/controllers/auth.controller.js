const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_in_production";

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user"
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      msg: "Registration successful"
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      msg: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};