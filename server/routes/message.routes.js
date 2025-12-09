const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const protect = require("../middleware/authMiddleware");

// 🔥 MESSAGES GET (must have token)
router.get("/:chatId", protect, async (req, res) => {
    const msgs = await Message.find({ chat: req.params.chatId });
    res.json(msgs);
});

// 🔥 SEND MESSAGE
router.post("/send", protect, async (req, res) => {
    const msg = await Message.create({
        chat: req.body.chatId,
        sender: req.user._id,
        text: req.body.text
    });

    // Update Inbox preview
    await Chat.findByIdAndUpdate(req.body.chatId, {
        lastMessage: { text: req.body.text, sender: req.user._id, timestamp: new Date() },
        updatedAt: new Date()
    });

    res.json(msg);
});

module.exports = router;
