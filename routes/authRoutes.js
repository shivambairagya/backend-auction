const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔍 Checking user:", email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ message: "User not found" });
        }

        console.log("✅ User found:", user);
        console.log("🔑 Stored Password:", user.password); // Should be hashed

        // Ensure password and user.password exist
        if (!password || !user.password) {
            console.log("❌ Missing password data");
            return res.status(400).json({ message: "Invalid login data" });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("✅ Password matched");

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

module.exports = router;