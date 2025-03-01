const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware
const User = require("../models/User");

const router = express.Router();

// User Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get User Profile (Protected)
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
});

module.exports = router;
