// models/ad.model.js
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String },
    category: {
        type: String,
        required: true,
        enum: ["Mobile", "Laptop", "Car", "Furniture", "Other"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);
