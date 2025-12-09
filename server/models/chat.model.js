const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: {                      // 👇 change type here
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
