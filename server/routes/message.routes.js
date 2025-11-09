const express = require("express");
const Message = require("../models/message.model");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


router.get("/:chatId", async (req, res) => {
    const msgs = await Message.find({ chat: req.params.chatId });
    res.json(msgs);
});

router.post("/send", async (req, res) => {
    const msg = await Message.create({
        chat: req.body.chatId,
        sender: req.body.sender,
        text: req.body.text,
    });
    res.json(msg);
});

module.exports = router;
