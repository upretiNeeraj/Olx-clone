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
        const msg = await Message.create({
            chat: req.body.chatId,
            sender: req.user._id,
            text: req.body.text,
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: msg._id,
            updatedAt: new Date(),
        });

        res.json(msg);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
