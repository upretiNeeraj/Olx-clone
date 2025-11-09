const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
