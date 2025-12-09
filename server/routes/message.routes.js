const express = require("express");
const Message = require("../models/message.model");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


router.get("/:chatId", async (req, res) => {
    const msgs = await Message.find({ chat: req.params.chatId });
    res.json(msgs);
});

router.post("/send", protect, async (req, res) => {
    try {
        const msg = await Message.create({
            chat: req.body.chatId,
            sender: req.user._id,
            text: req.body.text,
        });

        // 🔥 Update lastMessage for inbox preview
        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: {
                text: req.body.text,
                sender: req.user._id,
                timestamp: new Date()
            },
            updatedAt: new Date()
        });

        res.json(msg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
