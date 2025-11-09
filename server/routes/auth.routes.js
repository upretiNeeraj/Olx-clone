// routes/auth.routes.js
const express = require("express");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await user.matchPassword(password)) {
            const token = generateToken(user._id);
            return res.json({ _id: user._id, name: user.name, email: user.email, token });
        }
        res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Profile
const protect = require("../middleware/authMiddleware");
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
