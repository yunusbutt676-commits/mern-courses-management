const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();
const JWT_SECRET = "mysupersecretkey"; // ✅ Matches your middleware

// =======================
// Register User
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body; // ❌ Ignore role from frontend

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user with forced role = "user"
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Always assign "user" or "student"
    });

    res.json({ message: "User registered successfully!", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =======================
// Login User
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 // =======================
// Get All Users (for Pie Chart)
// =======================
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, role: 1, _id: 0 }).lean();

    // ✅ Remove duplicates by email
    const uniqueUsers = Array.from(new Map(users.map(u => [u.email, u])).values());

    // ✅ Normalize roles
    const normalizedUsers = uniqueUsers.map(u => ({
      ...u,
      role: (u.role || "user").toLowerCase().trim(),
    }));

    res.json(normalizedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


module.exports = router;
