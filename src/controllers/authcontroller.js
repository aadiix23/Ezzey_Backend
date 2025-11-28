const User = require("../models/Users");
const bcrypt = require("bcrypt");
const validateInstitutionEmail = require("../utils/validateInstitutionEmail");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Role validation
    const allowedRoles = ["student", "coordinator", "faculty"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    // Institution email check
    if (!validateInstitutionEmail(email)) {
      return res.status(400).json({
        message: "Invalid institution email! Only .edu or .ac.in allowed."
      });
    }

    // Existing user check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser._id,
      role: newUser.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error });
  }
};
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error });
  }
};

