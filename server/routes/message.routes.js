const express = require("express");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Get messages of specific chat
router.get("/:chatId", protect, async (req, res) => {
    const msgs = await Message.find({ chat: req.params.chatId });
    res.json(msgs);
});


// 📌 Send Message
router.post("/send", protect, async (req, res) => {
    try {
        const msg = await Message.create({
            chat: req.body.chatId,
            sender: req.user._id,
            text: req.body.text,
        });

        // 🔥 Update lastMessage to show in Inbox preview
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
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
