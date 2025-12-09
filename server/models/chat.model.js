const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: {                           // 🔥 now it accepts an object
        text: { type: String, default: "" },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
