const express = require("express");
const router = express.Router();
const Chat = require("../models/chat.model");
const protect = require("../middleware/authMiddleware");

router.post("/start", protect, async (req, res) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) return res.status(400).json({ message: "Seller ID required" });

        let chat = await Chat.findOne({
            users: { $all: [req.user._id, sellerId] }
        });

        if (!chat) {
            chat = await Chat.create({
                users: [req.user._id, sellerId] 
            });
        }

        res.json(chat);

    } catch (err) {
        console.log("Chat create error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/my", protect, async (req, res) => {
    try {
        const chats = await Chat.find({ users: req.user._id })
            .populate("users", "name email");

        res.json(chats);
    } catch (err) {
        console.log("Chat fetch error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
