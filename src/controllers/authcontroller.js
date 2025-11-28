const User = require("../models/user");
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
