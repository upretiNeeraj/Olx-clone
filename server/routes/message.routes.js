const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");          // 🔥 MISSING IMPORT FIXED
const protect = require("../middleware/authMiddleware");


// GET all messages of a chat
router.get("/:chatId", protect, async (req, res) => {
    try {
        const msgs = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 });
        res.json(msgs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// SEND MESSAGE
router.post("/send", protect, async (req, res) => {
    try {
        if (!req.body.chatId || !req.body.text) {
            return res.status(400).json({ message: "chatId & text required" });
        }

        // save message
        const msg = await Message.create({
            chat: req.body.chatId,
            sender: req.user._id,
            text: req.body.text,
        });

        // update last message for inbox preview
        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: {
                text: req.body.text,
                sender: req.user._id,
                timestamp: new Date()
            },
            updatedAt: new Date()
        });

        res.json(msg);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
